
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
import { getSortedProviders, markRateLimited, isRateLimited, SYSTEM_PROMPTS, PROVIDERS } from './services/fullkonk';
import { logUsage, getUserUsageSummary, getRecentEvents } from './services/fullkonk.analytics';
import { exportToGitHub } from './services/fullkonk.github';

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

  // ─── fullKONK_> ROUTES ──────────────────────────────────────────

  // GET /api/fullkonk/providers
  app.get('/api/fullkonk/providers', (_req, res) => {
    const list = PROVIDERS.map(p => ({
      id:     p.id,
      name:   p.name,
      models: p.models,
      hasKey: !!process.env[p.envKey],
    }));
    res.json({ providers: list });
  });

  // POST /api/fullkonk/generate  (SSE streaming)
  app.post('/api/fullkonk/generate', async (req, res) => {
    const { prompt, mode = 'fullstack', provider: preferredProvider, model, temperature = 0.4, maxTokens = 8192, systemPrompt } = req.body;

    if (!prompt?.trim()) {
      return res.status(400).json({ error: 'prompt required' });
    }

    res.setHeader('Content-Type',  'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection',    'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const send = (chunk: object) => {
      if (!res.writableEnded) res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    };

    // ── streaming fetch helper ───────────────────────────────────
    async function streamStage(
      task: string,
      messages: { role: string; content: string }[],
      onChunk: (text: string) => void,
    ): Promise<string> {
      const providers = preferredProvider
        ? [PROVIDERS.find(p => p.id === preferredProvider)!, ...getSortedProviders(task).filter(p => p.id !== preferredProvider)]
        : getSortedProviders(task);

      for (const prov of providers) {
        if (!prov) continue;
        const apiKey = process.env[prov.envKey];
        if (!apiKey) continue;
        if (isRateLimited(prov.id)) continue;

        const selectedModel = model && prov.models.some(m => m.id === model)
          ? model
          : prov.models[0].id;

        send({ type: 'provider', provider: prov.name, model: selectedModel });

        try {
          const response = await fetch(`${prov.baseUrl}/chat/completions`, {
            method:  'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type':  'application/json',
              'HTTP-Referer':  'https://konkred.xyz',
              'X-Title':       'fullKONK_>',
            },
            body: JSON.stringify({
              model: selectedModel,
              messages,
              temperature,
              max_tokens: maxTokens,
              stream: true,
            }),
            signal: req.socket.destroyed ? AbortSignal.abort() : undefined,
          });

          if (response.status === 429) {
            markRateLimited(prov.id);
            send({ type: 'failover', from: prov.name });
            continue;
          }

          if (!response.ok) {
            const err = await response.text();
            throw new Error(`${response.status}: ${err}`);
          }

          const reader = response.body!.getReader();
          const decoder = new TextDecoder();
          let full = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const lines = decoder.decode(value).split('\n');
            for (const line of lines) {
              if (!line.startsWith('data: ')) continue;
              const raw = line.slice(6).trim();
              if (raw === '[DONE]') continue;
              try {
                const parsed = JSON.parse(raw);
                const text = parsed.choices?.[0]?.delta?.content ?? '';
                if (text) { full += text; onChunk(text); }
              } catch {}
            }
          }

          return full;

        } catch (err: any) {
          if (err?.message?.includes('429')) markRateLimited(prov.id);
          send({ type: 'failover', from: prov.name, error: err?.message });
          continue;
        }
      }

      throw new Error('All providers exhausted.');
    }

    try {
      // ── REVIEW mode ─────────────────────────────────────────────
      if (mode === 'review') {
        send({ type: 'stage', stage: 'review' });
        let out = '';
        await streamStage('verify',
          [
            { role: 'system', content: systemPrompt || SYSTEM_PROMPTS.verify },
            { role: 'user',   content: prompt },
          ],
          chunk => { out += chunk; send({ type: 'delta', content: chunk }); },
        );
        send({ type: 'done' });
        return;
      }

      // ── STAGE 1: ARCHITECT ───────────────────────────────────────
      send({ type: 'stage', stage: 'architect' });
      let architecture = '';
      await streamStage('architect',
        [
          { role: 'system', content: systemPrompt || SYSTEM_PROMPTS.architect },
          { role: 'user',   content: `Design the complete architecture for: ${prompt}` },
        ],
        chunk => { architecture += chunk; send({ type: 'delta', content: chunk }); },
      );

      if (res.writableEnded) return;

      // ── STAGE 2: BUILD ───────────────────────────────────────────
      if (mode === 'frontend' || mode === 'fullstack') {
        send({ type: 'stage', stage: 'frontend' });
        let frontend = '';
        await streamStage('frontend',
          [
            { role: 'system', content: SYSTEM_PROMPTS.frontend },
            { role: 'user',   content: `Architecture:\n${architecture}\n\nImplement the complete frontend.` },
          ],
          chunk => { frontend += chunk; send({ type: 'delta', content: chunk }); },
        );

        if (mode === 'fullstack' && !res.writableEnded) {
          send({ type: 'stage', stage: 'backend' });
          let backend = '';
          await streamStage('backend',
            [
              { role: 'system', content: SYSTEM_PROMPTS.backend },
              { role: 'user',   content: `Architecture:\n${architecture}\n\nFrontend done. Implement the complete backend.` },
            ],
            chunk => { backend += chunk; send({ type: 'delta', content: chunk }); },
          );

          if (!res.writableEnded) {
            send({ type: 'stage', stage: 'verify' });
            let verified = '';
            await streamStage('verify',
              [
                { role: 'system', content: SYSTEM_PROMPTS.verify },
                { role: 'user',   content: `Architecture:\n${architecture}\n\nFrontend:\n${frontend}\n\nBackend:\n${backend}\n\nVerify and fix integration.` },
              ],
              chunk => { verified += chunk; send({ type: 'delta', content: chunk }); },
            );
          }
        }
      } else if (mode === 'backend') {
        send({ type: 'stage', stage: 'backend' });
        await streamStage('backend',
          [
            { role: 'system', content: SYSTEM_PROMPTS.backend },
            { role: 'user',   content: `Architecture:\n${architecture}\n\nImplement the complete backend.` },
          ],
          chunk => send({ type: 'delta', content: chunk }),
        );
      }

      send({ type: 'done' });

    } catch (err: any) {
      send({ type: 'error', error: err?.message ?? 'Pipeline failed' });
    } finally {
      if (!res.writableEnded) res.end();
    }
  });

  // GET /api/fullkonk/sessions/:userId
  app.get('/api/fullkonk/sessions/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const count = Math.min(Number(req.query.count) || 20, 50);
      res.json({ message: 'Fetch sessions client-side via firebase SDK', userId, count });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/fullkonk/usage
  app.post('/api/fullkonk/usage', async (req, res) => {
    try {
      const { userId, provider, model, mode, stage, tokens, durationMs, success } = req.body;
      if (!userId || !provider) return res.status(400).json({ error: 'userId and provider required' });
      await logUsage({ userId, provider, model, mode, stage, tokens: tokens ?? 0, durationMs: durationMs ?? 0, success: success ?? true });
      res.json({ ok: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/fullkonk/analytics/:userId
  app.get('/api/fullkonk/analytics/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const days = Math.min(Number(req.query.days) || 30, 90);
      const [summary, recent] = await Promise.all([
        getUserUsageSummary(userId, days),
        getRecentEvents(userId, 10),
      ]);
      res.json({ summary, recent });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/fullkonk/github/export
  app.post('/api/fullkonk/github/export', async (req, res) => {
    try {
      const { files, token, owner, repo, branch = 'fullkonk-output', message = 'Generated by fullKONK_>' } = req.body;
      if (!files?.length) return res.status(400).json({ error: 'files required' });
      if (!token || !owner || !repo) return res.status(400).json({ error: 'token, owner, repo required' });
      const result = await exportToGitHub(files, { token, owner, repo, branch, message });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
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
