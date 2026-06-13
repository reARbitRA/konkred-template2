
import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", node: "KONKRED-PROD-01" });
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

        const genAI = new GoogleGenAI(apiKey);
        const model = genAI.getGenerativeModel({ model: config.defaultModel || "gemini-1.5-flash" });

        const systemInstruction = messages.find((m: any) => m.role === 'system')?.content;
        const chatMessages = messages.filter((m: any) => m.role !== 'system');

        const result = await model.generateContent({
          contents: chatMessages.map((m: any) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          })),
          systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
          generationConfig: {
            temperature: config.temperature ?? 0.7,
            maxOutputTokens: config.maxTokens,
          }
        });

        const responseText = result.response.text();
        return res.json({ text: responseText });
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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KONKRED Executive Server running on http://localhost:${PORT}`);
  });
}

startServer();
