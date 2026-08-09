
import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { initializeApp as initAdmin, getApps as getAdminApps } from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";
import firebaseConfig from "./firebase-applet-config.json";
import { db as sqlDb } from "./src/db/index.ts";
import { users as sqlUsers } from "./src/db/schema.ts";

dotenv.config();

if (!getAdminApps().length) {
  initAdmin({
    projectId: firebaseConfig.projectId,
  });
}
const adminAuth = getAdminAuth();
const adminDb = getAdminFirestore();


async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", node: "KONKRED-PROD-01" });
  });

  // GitHub OAuth: Get URL
  app.get("/api/auth/github/url", (req, res) => {
    const client_id = process.env.GITHUB_CLIENT_ID;
    if (!client_id) {
      return res.status(500).json({ error: "GITHUB_CLIENT_ID environment variable is not configured on the server." });
    }
    const clientRedirect = req.query.redirectUri as string || `${req.protocol}://${req.get("host")}/auth/callback`;
    const params = new URLSearchParams({
      client_id,
      redirect_uri: clientRedirect,
      scope: "read:user user:email",
    });
    res.json({ url: `https://github.com/login/oauth/authorize?${params.toString()}` });
  });

  // GitHub OAuth: Callback
  app.get(["/auth/callback", "/auth/callback/"], async (req, res) => {
    const { code, state } = req.query;
    if (!code) {
      return res.status(400).send("Authorization code missing from GitHub redirect.");
    }

    try {
      // 1. Swap authorization code for GitHub access token
      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });

      const tokenData = await tokenRes.json() as any;
      if (!tokenData.access_token) {
        throw new Error(tokenData.error_description || "Failed to obtain access token from GitHub.");
      }

      // 2. Fetch user profile info
      const userRes = await fetch("https://api.github.com/user", {
        headers: {
          "Authorization": `Bearer ${tokenData.access_token}`,
          "User-Agent": "konkred-applet",
        },
      });
      const githubUser = await userRes.json() as any;

      // 3. Fetch user emails to get the primary address
      const emailsRes = await fetch("https://api.github.com/user/emails", {
        headers: {
          "Authorization": `Bearer ${tokenData.access_token}`,
          "User-Agent": "konkred-applet",
        },
      });
      const emails = await emailsRes.json() as any[];
      const primaryEmailObj = emails && Array.isArray(emails) ? emails.find((e: any) => e.primary) : null;
      const email = primaryEmailObj ? primaryEmailObj.email : (githubUser.email || `${githubUser.login}@github.konkred.local`);

      const uid = `github_${githubUser.id}`;
      const displayName = githubUser.name || githubUser.login || "GitHub Architect";

      // 4. Synchronize user record with Cloud SQL (PostgreSQL) using Drizzle
      try {
        await sqlDb.insert(sqlUsers)
          .values({
            uid,
            email,
            displayName,
            acceptedCopyrightTerms: true,
            canGenerateBlogs: true,
            role: "user",
          })
          .onConflictDoUpdate({
            target: sqlUsers.uid,
            set: {
              email,
              displayName,
            },
          });
      } catch (dbErr) {
        console.error("Failed to sync GitHub user with Postgres:", dbErr);
      }

      // 5. Synchronize user record with Firebase Firestore
      const userDocRef = adminDb.collection("users").doc(uid);
      const userDoc = await userDocRef.get();
      if (!userDoc.exists) {
        await userDocRef.set({
          displayName,
          email,
          role: "user",
          tier: "free",
          balance: { fiat: 1000, crypto: 0.1 },
          stats: {
            totalPurchases: 0,
            totalSales: 0,
            totalEarnings: 0,
            rating: 5.0,
            reviewCount: 0,
          },
          payoutThreshold: 500,
          kycStatus: "unverified",
          acceptedCopyrightTerms: true,
          canGenerateBlogs: true,
          createdAt: new Date().toISOString(),
        });
      } else {
        await userDocRef.set({
          displayName,
          email,
        }, { merge: true });
      }

      // 6. Generate Custom Firebase Auth Token
      const customToken = await adminAuth.createCustomToken(uid);

      // 7. Inject Custom Token script postMessage and shut the popup
      res.send(`
        <html>
          <head>
            <title>KONKRED Handshake Established</title>
            <style>
              body {
                background: #050505;
                color: #ffffff;
                font-family: monospace;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                letter-spacing: 0.1em;
                text-transform: uppercase;
              }
              .card {
                border: 2px solid #00ffd5;
                padding: 40px;
                text-align: center;
                background: #000000;
                box-shadow: 0 0 30px rgba(0, 255, 213, 0.15);
              }
            </style>
          </head>
          <body>
            <div class="card">
              <h3 style="color: #00ffd5; margin-bottom: 5px;">HANDSHAKE_ESTABLISHED</h3>
              <p style="font-size: 11px; opacity: 0.7;">TRANSMITTING_CRYPTOGRAPHIC_TOKEN_PROXIES...</p>
              <script>
                if (window.opener) {
                  window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', token: '${customToken}' }, '*');
                  setTimeout(() => {
                    window.close();
                  }, 800);
                } else {
                  window.location.href = '/';
                }
              </script>
            </div>
          </body>
        </html>
      `);
    } catch (err: any) {
      console.error("Github OAuth error:", err);
      res.status(500).send(`Authentication sequence failure: ${err.message || err}`);
    }
  });

  // AI Proxy Endpoint
  app.post("/api/ai/generate", async (req, res) => {
    try {
      const { provider, messages, config } = req.body;
      
      if (provider === 'google') {
        const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
        if (!apiKey) {
           return res.status(500).json({ error: "GEMINI_API_KEY not configured on server." });
        }

        const ai = new GoogleGenAI({ 
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build'
            }
          }
        });

        const systemInstruction = messages.find((m: any) => m.role === 'system')?.content;
        const chatMessages = messages.filter((m: any) => m.role !== 'system');

        let modelName = config?.defaultModel || "gemini-3.5-flash";
        // Ensure we support the core system models for high quality audits, search grounding, etc.
        if (modelName !== "gemini-3-pro-preview" && modelName !== "gemini-3-flash-preview" && modelName !== "gemini-3.5-flash") {
          modelName = "gemini-3.5-flash";
        }

        const result = await ai.models.generateContent({
          model: modelName,
          contents: chatMessages.map((m: any) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          })),
          config: {
            systemInstruction: systemInstruction || undefined,
            temperature: config?.temperature ?? 0.7,
            maxOutputTokens: config?.maxTokens,
            responseMimeType: config?.responseMimeType,
            responseSchema: config?.responseSchema,
            tools: config?.tools,
          }
        });

        const responseText = result.text;
        const groundingChunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        return res.json({ 
          text: responseText,
          groundingChunks: groundingChunks
        });
      }

      // Proxy for other providers (Anthropic, OpenAI, etc.)
      // These would use their respective SDKs or fetch with server-side keys
      if (provider === 'anthropic') {
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY missing" });
        
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: config.defaultModel,
            system: messages.find((m: any) => m.role === 'system')?.content,
            messages: messages.filter((m: any) => m.role !== 'system').map((m: any) => ({
              role: m.role === 'assistant' ? 'assistant' : 'user',
              content: m.content
            })),
            max_tokens: config.maxTokens || 1024,
            temperature: config.temperature
          })
        });
        const data = await response.json();
        return res.json({ text: data.content?.[0]?.text || "" });
      }

      // Generic OpenAI-Compatible Proxy (used for many specialized nodes)
      const openAICompatible: Record<string, string> = {
        'openai': 'https://api.openai.com/v1',
        'openrouter': 'https://openrouter.ai/api/v1',
        'groq': 'https://api.groq.com/openai/v1',
        'deepseek': 'https://api.deepseek.com/v1',
        'mistral': 'https://api.mistral.ai/v1',
        'xai': 'https://api.x.ai/v1',
        'cerebras': 'https://api.cerebras.ai/v1',
        'sambanova': 'https://api.sambanova.ai/v1',
        'together': 'https://api.together.xyz/v1',
        'fireworks': 'https://api.fireworks.ai/inference/v1',
        'perplexity': 'https://api.perplexity.ai',
      };

      if (openAICompatible[provider]) {
        const envVarName = `${provider.toUpperCase()}_API_KEY`;
        const apiKey = process.env[envVarName];
        if (!apiKey) return res.status(500).json({ error: `${envVarName} missing on server.` });

        const response = await fetch(`${openAICompatible[provider]}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: config.defaultModel,
            messages: messages.map((m: any) => ({
              role: m.role,
              content: m.content
            })),
            temperature: config.temperature,
            max_tokens: config.maxTokens
          })
        });
        const data = await response.json();
        return res.json({ text: data.choices?.[0]?.message?.content || "" });
      }

      res.status(400).json({ error: `Provider ${provider} not supported by proxy.` });
    } catch (error: any) {
      console.error("AI Proxy Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KONKRED Executive Server running on http://localhost:${PORT}`);
  });
}

startServer();
