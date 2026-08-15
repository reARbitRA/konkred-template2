var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server.ts
import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { initializeApp as initAdmin, getApps as getAdminApps } from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";

// firebase-applet-config.json
var firebase_applet_config_default = {
  projectId: "aerobic-effect-wfbwx",
  appId: "1:57029003934:web:8d0a28d3b2e8ae5a12098f",
  apiKey: "AIzaSyDEWykOSsiaznr4v2jkIQk0qTj1uSIGuus",
  authDomain: "aerobic-effect-wfbwx.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-e28842b9-55dc-43e1-a73a-4acb7595e27b",
  storageBucket: "aerobic-effect-wfbwx.firebasestorage.app",
  messagingSenderId: "57029003934",
  measurementId: ""
};

// src/db/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";

// src/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  blogs: () => blogs,
  blogsRelations: () => blogsRelations,
  guestbook: () => guestbook,
  users: () => users,
  usersRelations: () => usersRelations
});
import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(),
  // Firebase Auth UID
  email: text("email").notNull(),
  displayName: text("display_name"),
  acceptedCopyrightTerms: boolean("accepted_copyright_terms").default(false).notNull(),
  canGenerateBlogs: boolean("can_generate_blogs").default(false).notNull(),
  role: text("role").default("user"),
  createdAt: timestamp("created_at").defaultNow()
});
var blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  authorId: text("author_id").notNull(),
  title: text("title").notNull(),
  category: text("category"),
  htmlContent: text("html_content").notNull(),
  desc: text("desc"),
  readTime: text("read_time"),
  createdAt: timestamp("created_at").defaultNow()
});
var guestbook = pgTable("guestbook", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role"),
  text: text("text").notNull(),
  timestamp: text("timestamp").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var usersRelations = relations(users, ({ many }) => ({
  blogs: many(blogs)
}));
var blogsRelations = relations(blogs, ({ one }) => ({
  author: one(users, {
    fields: [blogs.authorId],
    references: [users.uid]
  })
}));

// src/db/index.ts
var { Pool } = pkg;
var createPool = () => {
  return new Pool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB_NAME,
    connectionTimeoutMillis: 15e3
  });
};
var pool = createPool();
pool.on("error", (err) => {
  console.error("Unexpected error on idle SQL pool client:", err);
});
var db = drizzle(pool, { schema: schema_exports });

// services/fullkonk.ts
var SYSTEM_PROMPTS = {
  architect: `You are a senior software architect. Given a product idea, output a complete architecture plan:

## OVERVIEW
## TECH STACK
## COMPONENT TREE (ASCII)
## API CONTRACT (all endpoints, methods, request/response shapes)
## DATABASE SCHEMA (complete)
## FILE STRUCTURE (complete tree)
## KEY DECISIONS

Be specific and opinionated. Output the plan only \u2014 no code.`,
  frontend: `You are a senior frontend engineer. You write complete, production-ready React TypeScript code.
Use: React 19, TypeScript strict, Tailwind CSS, Framer Motion v12.
Rules: No truncation. Every component fully typed. All errors handled. Accessible. Mobile-first.
Output complete file contents with file paths as comments.`,
  backend: `You are a senior backend engineer. You write complete Node.js/TypeScript API code.
Use: Express 5, TypeScript strict, Firebase Firestore, Zod validation.
Rules: Validate all inputs. Handle all errors with proper status codes. Return { data?, error? }.
Output complete file contents with file paths as comments.`,
  verify: `You are a principal engineer doing integration review.
Check: API call signatures match routes. Types consistent across frontend/backend. All imports resolve.
Fix what is broken. Output corrected complete files only. List issues first.`,
  test: `Given the frontend and backend files, write comprehensive tests: unit tests for utilities with Vitest, component tests with Testing Library, Express API route tests with Supertest, and an integration test for the primary flow. Reuse production TypeScript types. Mock Firebase and all external APIs. Output complete test files with paths.`
};

// services/fullkonk.github.ts
function toBase64(value) {
  if (typeof Buffer !== "undefined") return Buffer.from(value, "utf8").toString("base64");
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}
function encodePath(filePath) {
  return filePath.split("/").filter(Boolean).map(encodeURIComponent).join("/");
}
function errorMessage(error) {
  return error instanceof Error ? error.message : "Unknown GitHub error";
}
async function githubFetch(url, init, retries = 2) {
  let response = null;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    response = await fetch(url, init);
    if (response.status !== 429 && response.status < 500) return response;
    if (attempt < retries) {
      const retryAfter = Number(response.headers.get("retry-after"));
      const delay = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1e3 : 300 * 2 ** attempt;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  if (!response) throw new Error("GitHub did not return a response.");
  return response;
}
function headers(config) {
  return {
    Authorization: `Bearer ${config.token}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.github+json",
    "User-Agent": "KONKRED-fullKONK"
  };
}
async function responseError(response, fallback) {
  try {
    const payload = await response.json();
    return typeof payload.message === "string" ? payload.message : fallback;
  } catch {
    return fallback;
  }
}
async function ensureBranch(config) {
  const base = `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}`;
  const repoResponse = await githubFetch(base, { headers: headers(config) });
  if (repoResponse.status === 404) throw new Error("Repository not found or the token cannot access it.");
  if (!repoResponse.ok) throw new Error(await responseError(repoResponse, "Cannot access repository."));
  const repoData = await repoResponse.json();
  const defaultBranch = repoData.default_branch || "main";
  const refResponse = await githubFetch(`${base}/git/refs/heads/${encodeURIComponent(defaultBranch)}`, { headers: headers(config) });
  if (!refResponse.ok) throw new Error(await responseError(refResponse, `Cannot access default branch '${defaultBranch}'.`));
  const refData = await refResponse.json();
  const sha = refData.object?.sha;
  if (!sha) throw new Error("GitHub returned an invalid default branch reference.");
  const branchResponse = await githubFetch(`${base}/git/refs/heads/${encodeURIComponent(config.branch)}`, { headers: headers(config) });
  if (branchResponse.status === 404) {
    const createResponse = await githubFetch(`${base}/git/refs`, {
      method: "POST",
      headers: headers(config),
      body: JSON.stringify({ ref: `refs/heads/${config.branch}`, sha })
    });
    if (!createResponse.ok) throw new Error(await responseError(createResponse, `Could not create branch '${config.branch}'.`));
  } else if (!branchResponse.ok) {
    throw new Error(await responseError(branchResponse, `Could not inspect branch '${config.branch}'.`));
  }
  return defaultBranch;
}
async function getFileSha(config, filePath) {
  const url = `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/${encodePath(filePath)}?ref=${encodeURIComponent(config.branch)}`;
  const response = await githubFetch(url, { headers: headers(config) });
  if (response.status === 404) return void 0;
  if (!response.ok) throw new Error(await responseError(response, `Could not inspect ${filePath}.`));
  const data = await response.json();
  return data.sha;
}
async function uploadFile(config, file) {
  const sha = await getFileSha(config, file.path);
  const body = {
    message: config.message,
    content: toBase64(file.content),
    branch: config.branch
  };
  if (sha) body.sha = sha;
  const url = `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/${encodePath(file.path)}`;
  const response = await githubFetch(url, {
    method: "PUT",
    headers: headers(config),
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error(await responseError(response, `Failed to upload ${file.path}.`));
  const data = await response.json();
  return data.commit?.sha;
}
async function createPR(config, baseBranch) {
  if (config.branch === baseBranch || config.branch === "main" && baseBranch === "main") return "";
  const url = `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/pulls`;
  const response = await githubFetch(url, {
    method: "POST",
    headers: headers(config),
    body: JSON.stringify({
      title: `[fullKONK_>] ${config.message}`,
      head: config.branch,
      base: baseBranch,
      body: `Generated by fullKONK_> on konkred.xyz

${config.message}`
    })
  });
  if (!response.ok) throw new Error(await responseError(response, "Files uploaded, but pull request creation failed."));
  const data = await response.json();
  return data.html_url || "";
}
async function exportToGitHub(files, config) {
  if (files.length === 0) return { success: false, filesUploaded: 0, errors: ["No files to export."] };
  const errors = [];
  let filesUploaded = 0;
  let commitSha;
  let defaultBranch;
  try {
    defaultBranch = await ensureBranch(config);
  } catch (error) {
    return { success: false, filesUploaded: 0, errors: [errorMessage(error)] };
  }
  for (const file of files) {
    try {
      commitSha = await uploadFile(config, file) || commitSha;
      filesUploaded += 1;
    } catch (error) {
      errors.push(`${file.path}: ${errorMessage(error)}`);
    }
  }
  let prUrl;
  if (filesUploaded > 0 && config.branch !== defaultBranch) {
    try {
      prUrl = await createPR(config, defaultBranch) || void 0;
    } catch (error) {
      errors.push(errorMessage(error));
    }
  }
  return { success: filesUploaded > 0, filesUploaded, commitSha, prUrl, errors };
}

// services/fullkonk.orchestrator.ts
var google = { providerId: "google", providerName: "Google AI Studio", baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai", envKey: "GEMINI_API_KEY" };
var deepseek = { providerId: "deepseek", providerName: "DeepSeek", baseUrl: "https://api.deepseek.com/v1", envKey: "DEEPSEEK_API_KEY" };
var openrouter = { providerId: "openrouter", providerName: "OpenRouter", baseUrl: "https://openrouter.ai/api/v1", envKey: "OPENROUTER_API_KEY" };
var groq = { providerId: "groq", providerName: "Groq", baseUrl: "https://api.groq.com/openai/v1", envKey: "GROQ_API_KEY" };
var sambanova = { providerId: "sambanova", providerName: "SambaNova", baseUrl: "https://api.sambanova.ai/v1", envKey: "SAMBANOVA_API_KEY" };
var cerebras = { providerId: "cerebras", providerName: "Cerebras", baseUrl: "https://api.cerebras.ai/v1", envKey: "CEREBRAS_API_KEY" };
var MODEL_REGISTRY = [
  { ...google, modelId: "gemini-2.5-pro", modelLabel: "Gemini 2.5 Pro", contextWindow: 1e6, maxOutput: 65536, thinkingScore: 9, capabilityScore: 10, speedScore: 6, supportsThinking: true, free: true, rpm: 5, tpm: 25e4, tpd: -1, specialty: ["architect", "longcontext", "reasoning", "frontend"] },
  { ...google, modelId: "gemini-2.5-flash", modelLabel: "Gemini 2.5 Flash Thinking", contextWindow: 1e6, maxOutput: 65536, thinkingScore: 9, capabilityScore: 9, speedScore: 7, supportsThinking: true, free: true, rpm: 10, tpm: 5e5, tpd: -1, specialty: ["reasoning", "verify", "architect", "test"] },
  { ...deepseek, modelId: "deepseek-reasoner", modelLabel: "DeepSeek R1", contextWindow: 128e3, maxOutput: 32768, thinkingScore: 10, capabilityScore: 9, speedScore: 5, supportsThinking: true, free: true, rpm: 60, tpm: 6e4, tpd: -1, specialty: ["reasoning", "backend", "verify", "review", "test"] },
  { ...openrouter, modelId: "deepseek/deepseek-r1:free", modelLabel: "DeepSeek R1 (OpenRouter)", contextWindow: 128e3, maxOutput: 32768, thinkingScore: 10, capabilityScore: 9, speedScore: 4, supportsThinking: true, free: true, rpm: 20, tpm: 4e4, tpd: -1, specialty: ["reasoning", "backend", "verify", "test"] },
  { ...deepseek, modelId: "deepseek-chat", modelLabel: "DeepSeek V3", contextWindow: 128e3, maxOutput: 32768, thinkingScore: 7, capabilityScore: 8, speedScore: 7, supportsThinking: false, free: true, rpm: 60, tpm: 6e4, tpd: -1, specialty: ["backend", "architect", "general"] },
  { ...sambanova, modelId: "DeepSeek-R1", modelLabel: "DeepSeek R1 (SambaNova)", contextWindow: 32768, maxOutput: 16384, thinkingScore: 10, capabilityScore: 9, speedScore: 9, supportsThinking: true, free: true, rpm: 30, tpm: 1e5, tpd: -1, specialty: ["reasoning", "backend", "verify", "test"] },
  { ...sambanova, modelId: "Llama-4-Maverick-17B-128E-Instruct", modelLabel: "Llama 4 Maverick", contextWindow: 131072, maxOutput: 16384, thinkingScore: 7, capabilityScore: 8, speedScore: 10, supportsThinking: false, free: true, rpm: 30, tpm: 1e5, tpd: -1, specialty: ["frontend", "general", "architect"] },
  { ...openrouter, modelId: "qwen/qwen3-235b-a22b:free", modelLabel: "Qwen3 235B (OpenRouter)", contextWindow: 40960, maxOutput: 16384, thinkingScore: 9, capabilityScore: 8, speedScore: 5, supportsThinking: true, free: true, rpm: 20, tpm: 4e4, tpd: -1, specialty: ["reasoning", "architect", "general"] },
  { ...groq, modelId: "llama-4-scout-17b-16e-instruct", modelLabel: "Llama 4 Scout", contextWindow: 131072, maxOutput: 16384, thinkingScore: 6, capabilityScore: 7, speedScore: 10, supportsThinking: false, free: true, rpm: 30, tpm: 3e4, tpd: -1, specialty: ["frontend", "general", "longcontext"] },
  { ...groq, modelId: "llama-3.3-70b-versatile", modelLabel: "Llama 3.3 70B", contextWindow: 128e3, maxOutput: 32768, thinkingScore: 6, capabilityScore: 7, speedScore: 10, supportsThinking: false, free: true, rpm: 30, tpm: 3e4, tpd: -1, specialty: ["general", "frontend", "backend"] },
  { ...groq, modelId: "qwen-qwq-32b", modelLabel: "Qwen QwQ 32B", contextWindow: 131072, maxOutput: 16384, thinkingScore: 9, capabilityScore: 8, speedScore: 8, supportsThinking: true, free: true, rpm: 30, tpm: 3e4, tpd: -1, specialty: ["reasoning", "verify", "architect", "test"] },
  { ...cerebras, modelId: "llama-4-scout-17b", modelLabel: "Llama 4 Scout (Cerebras)", contextWindow: 131072, maxOutput: 16384, thinkingScore: 6, capabilityScore: 7, speedScore: 10, supportsThinking: false, free: true, rpm: 30, tpm: 6e4, tpd: 1e6, specialty: ["general", "frontend"] },
  { ...cerebras, modelId: "gpt-oss-120b", modelLabel: "GPT-OSS 120B", contextWindow: 128e3, maxOutput: 32768, thinkingScore: 7, capabilityScore: 7, speedScore: 9, supportsThinking: false, free: true, rpm: 30, tpm: 6e4, tpd: 1e6, specialty: ["general", "backend", "longcontext"] },
  { ...openrouter, modelId: "meta-llama/llama-3.3-70b-instruct:free", modelLabel: "Llama 3.3 70B (OpenRouter)", contextWindow: 128e3, maxOutput: 16384, thinkingScore: 5, capabilityScore: 6, speedScore: 6, supportsThinking: false, free: true, rpm: 20, tpm: 4e4, tpd: -1, specialty: ["general", "frontend"] },
  { providerId: "github", providerName: "GitHub Models", baseUrl: "https://models.inference.ai.azure.com", envKey: "GITHUB_TOKEN", modelId: "gpt-4o", modelLabel: "GPT-4o (GitHub)", contextWindow: 128e3, maxOutput: 16384, thinkingScore: 7, capabilityScore: 8, speedScore: 7, supportsThinking: false, free: true, rpm: 10, tpm: 3e4, tpd: -1, specialty: ["general", "frontend", "verify"] },
  { providerId: "nvidia", providerName: "NVIDIA NIM", baseUrl: "https://integrate.api.nvidia.com/v1", envKey: "NVIDIA_API_KEY", modelId: "deepseek-ai/deepseek-r1", modelLabel: "DeepSeek R1 (NVIDIA)", contextWindow: 128e3, maxOutput: 32768, thinkingScore: 10, capabilityScore: 9, speedScore: 7, supportsThinking: true, free: true, rpm: 40, tpm: 1e5, tpd: -1, specialty: ["reasoning", "backend", "verify", "test"] },
  { providerId: "huggingface", providerName: "HuggingFace", baseUrl: "https://api-inference.huggingface.co/v1", envKey: "HUGGINGFACE_API_KEY", modelId: "Qwen/Qwen3-235B-A22B", modelLabel: "Qwen3 235B (HF)", contextWindow: 40960, maxOutput: 8192, thinkingScore: 9, capabilityScore: 8, speedScore: 4, supportsThinking: true, free: true, rpm: 10, tpm: 2e4, tpd: -1, specialty: ["reasoning", "general"] }
];
var TASK_WEIGHTS = {
  architect: { capability: 0.4, thinking: 0.4, speed: 0.1, context: 0.1 },
  reasoning: { capability: 0.3, thinking: 0.6, speed: 0.05, context: 0.05 },
  verify: { capability: 0.4, thinking: 0.4, speed: 0.1, context: 0.1 },
  test: { capability: 0.45, thinking: 0.35, speed: 0.1, context: 0.1 },
  review: { capability: 0.4, thinking: 0.4, speed: 0.1, context: 0.1 },
  backend: { capability: 0.5, thinking: 0.3, speed: 0.1, context: 0.1 },
  frontend: { capability: 0.5, thinking: 0.2, speed: 0.2, context: 0.1 },
  longcontext: { capability: 0.2, thinking: 0.2, speed: 0.1, context: 0.5 },
  general: { capability: 0.4, thinking: 0.2, speed: 0.2, context: 0.2 }
};
var rateLimitStore = /* @__PURE__ */ new Map();
var modelKey = (profile) => `${profile.providerId}::${profile.modelId}`;
function modelAvailable(profile) {
  const entry = rateLimitStore.get(modelKey(profile));
  if (!entry) return true;
  if (Date.now() >= entry.until) {
    rateLimitStore.delete(modelKey(profile));
    return true;
  }
  return false;
}
function penalize(profile, kind, retryAfterMs) {
  const existing = rateLimitStore.get(modelKey(profile));
  const failCount = (existing?.failCount || 0) + 1;
  const computed = kind === "rate_limit" ? Math.min(6e4 * 2 ** (failCount - 1), 9e5) : Math.min(3e4 * 2 ** (failCount - 1), 3e5);
  rateLimitStore.set(modelKey(profile), { until: Date.now() + Math.max(1e3, retryAfterMs || computed), failCount, lastError: kind });
}
function score(profile, task) {
  const weights = TASK_WEIGHTS[task];
  const context = Math.min(Math.log10(profile.contextWindow / 1e3) * 3.33, 10);
  const specialtyBoost = profile.specialty.includes(task) ? 0.75 : 0;
  return profile.capabilityScore * weights.capability + profile.thinkingScore * weights.thinking + profile.speedScore * weights.speed + context * weights.context + specialtyBoost;
}
function getCandidates(request) {
  return MODEL_REGISTRY.filter((profile) => {
    if (!process.env[profile.envKey] || !modelAvailable(profile)) return false;
    if (request.minContextWindow && profile.contextWindow < request.minContextWindow) return false;
    return true;
  }).sort((a, b) => {
    const aModel = request.preferModel === a.modelId ? 1 : 0;
    const bModel = request.preferModel === b.modelId ? 1 : 0;
    if (aModel !== bModel) return bModel - aModel;
    const aPreferred = request.preferProviders?.includes(a.providerId) ? 1 : 0;
    const bPreferred = request.preferProviders?.includes(b.providerId) ? 1 : 0;
    if (aPreferred !== bPreferred) return bPreferred - aPreferred;
    const aThinking = request.requireThinking && a.supportsThinking ? 1 : 0;
    const bThinking = request.requireThinking && b.supportsThinking ? 1 : 0;
    return aThinking !== bThinking ? bThinking - aThinking : score(b, request.task) - score(a, request.task);
  });
}
function linkAbort(parent) {
  const controller = new AbortController();
  const abort = () => controller.abort(parent?.reason);
  if (parent?.aborted) abort();
  else parent?.addEventListener("abort", abort, { once: true });
  return { controller, cleanup: () => parent?.removeEventListener("abort", abort) };
}
async function fetchWithTimeout(url, init, parent) {
  const { controller, cleanup } = linkAbort(parent);
  const timer = setTimeout(() => controller.abort(new Error("Provider timed out after 30 seconds.")), 3e4);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
    cleanup();
  }
}
async function readWithTimeout(reader, signal) {
  let timer;
  let abortHandler;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      void reader.cancel("Provider inactivity timeout");
      reject(new Error("Provider timed out after 30 seconds."));
    }, 3e4);
  });
  const aborted = new Promise((_, reject) => {
    abortHandler = () => {
      void reader.cancel(signal?.reason);
      reject(signal?.reason || new DOMException("Aborted", "AbortError"));
    };
    if (signal?.aborted) abortHandler();
    else signal?.addEventListener("abort", abortHandler, { once: true });
  });
  try {
    return await Promise.race([reader.read(), timeout, aborted]);
  } finally {
    if (timer) clearTimeout(timer);
    if (abortHandler) signal?.removeEventListener("abort", abortHandler);
  }
}
async function streamModel(profile, request, callbacks, signal) {
  const apiKey = process.env[profile.envKey];
  if (!apiKey) throw new Error(`Missing environment variable ${profile.envKey}.`);
  const response = await fetchWithTimeout(`${profile.baseUrl}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "HTTP-Referer": "https://konkred.xyz", "X-Title": "fullKONK_> Orchestrator" },
    body: JSON.stringify({ model: profile.modelId, messages: request.messages, temperature: request.temperature ?? 0.3, max_tokens: Math.min(request.maxTokens || 8192, profile.maxOutput), stream: true })
  }, signal);
  if (!response.ok) {
    const detail = (await response.text().catch(() => "")).slice(0, 200);
    const retryAfter = Number(response.headers.get("retry-after"));
    if (response.status === 429) penalize(profile, "rate_limit", Number.isFinite(retryAfter) ? retryAfter * 1e3 : void 0);
    else penalize(profile, "error");
    throw new Error(`HTTP ${response.status}${detail ? `: ${detail}` : ""}`);
  }
  if (!response.body) {
    penalize(profile, "error");
    throw new Error("Provider returned an empty body.");
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let pending = "";
  let content = "";
  let totalTokens = 0;
  const rolling = [];
  let lastMetricAt = Date.now();
  while (true) {
    if (signal?.aborted) {
      await reader.cancel();
      throw signal.reason || new DOMException("Aborted", "AbortError");
    }
    const result = await readWithTimeout(reader, signal);
    pending += decoder.decode(result.value || new Uint8Array(), { stream: !result.done });
    const lines = pending.split("\n");
    pending = lines.pop() || "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const raw = line.slice(5).trim();
      if (!raw || raw === "[DONE]") continue;
      try {
        const parsed = JSON.parse(raw);
        const delta = parsed.choices?.[0]?.delta;
        const text2 = typeof delta?.content === "string" ? delta.content : "";
        if (text2) {
          content += text2;
          totalTokens += Math.ceil(text2.length / 4);
          rolling.push({ at: Date.now(), characters: text2.length });
          callbacks.onChunk(text2);
        }
      } catch {
      }
    }
    const now = Date.now();
    if (now - lastMetricAt >= 500) {
      while (rolling.length && rolling[0].at < now - 500) rolling.shift();
      const recentCharacters = rolling.reduce((sum, item) => sum + item.characters, 0);
      callbacks.onMetrics(Math.round(recentCharacters / 2 * 10) / 10, totalTokens, profile.providerName);
      lastMetricAt = now;
    }
    if (result.done) break;
  }
  if (!content.trim()) {
    penalize(profile, "error");
    throw new Error("Provider returned an empty response.");
  }
  rateLimitStore.delete(modelKey(profile));
  callbacks.onMetrics(0, totalTokens, profile.providerName);
  return content;
}
async function orchestrate(request, callbacks, signal) {
  const candidates = getCandidates(request);
  if (!candidates.length) throw new Error("No AI providers available. Configure a matching provider key or wait for model backoff to expire.");
  const startedAt = Date.now();
  let lastError = "Unknown provider error";
  for (let index = 0; index < candidates.length; index += 1) {
    const profile = candidates[index];
    if (index > 0) callbacks.onFailover(`${candidates[index - 1].providerName} / ${candidates[index - 1].modelLabel}`, `${profile.providerName} / ${profile.modelLabel}`, lastError);
    callbacks.onProviderSelect(profile.providerName, profile.modelLabel);
    let streamedCharacters = 0;
    try {
      const content = await streamModel(profile, request, { ...callbacks, onChunk: (text2) => {
        streamedCharacters += text2.length;
        callbacks.onChunk(text2);
      } }, signal);
      return { content, provider: profile.providerName, model: profile.modelLabel, tokensUsed: Math.ceil(content.length / 4), durationMs: Date.now() - startedAt, attempts: index + 1 };
    } catch (error) {
      if (signal?.aborted) throw error;
      if (streamedCharacters) callbacks.onReset(streamedCharacters);
      if (!rateLimitStore.has(modelKey(profile))) penalize(profile, "error");
      lastError = error instanceof Error ? error.message : "Unknown provider error";
    }
  }
  throw new Error(`All ${candidates.length} available models failed. Last error: ${lastError}`);
}
function getOrchestratorHealth() {
  return MODEL_REGISTRY.map((profile) => {
    const entry = rateLimitStore.get(modelKey(profile));
    const hasKey = Boolean(process.env[profile.envKey]);
    return { provider: profile.providerName, model: profile.modelLabel, providerId: profile.providerId, modelId: profile.modelId, available: hasKey && modelAvailable(profile), hasKey, rateLimited: Boolean(entry && Date.now() < entry.until), backoffUntil: entry?.until || null, score: Math.round(score(profile, "general") * 10) / 10 };
  });
}

// server.ts
dotenv.config();
if (!getAdminApps().length) {
  initAdmin({
    projectId: firebase_applet_config_default.projectId
  });
}
var adminAuth = getAdminAuth();
var adminDb = getAdminFirestore();
async function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", node: "KONKRED-PROD-01" });
  });
  app.get("/api/auth/github/url", (req, res) => {
    const client_id = process.env.GITHUB_CLIENT_ID;
    if (!client_id) {
      return res.status(500).json({ error: "GITHUB_CLIENT_ID environment variable is not configured on the server." });
    }
    const clientRedirect = req.query.redirectUri || `${req.protocol}://${req.get("host")}/auth/callback`;
    const params = new URLSearchParams({
      client_id,
      redirect_uri: clientRedirect,
      scope: "read:user user:email"
    });
    res.json({ url: `https://github.com/login/oauth/authorize?${params.toString()}` });
  });
  app.get(["/auth/callback", "/auth/callback/"], async (req, res) => {
    const { code, state } = req.query;
    if (!code) {
      return res.status(400).send("Authorization code missing from GitHub redirect.");
    }
    try {
      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code
        })
      });
      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) {
        throw new Error(tokenData.error_description || "Failed to obtain access token from GitHub.");
      }
      const userRes = await fetch("https://api.github.com/user", {
        headers: {
          "Authorization": `Bearer ${tokenData.access_token}`,
          "User-Agent": "konkred-applet"
        }
      });
      const githubUser = await userRes.json();
      const emailsRes = await fetch("https://api.github.com/user/emails", {
        headers: {
          "Authorization": `Bearer ${tokenData.access_token}`,
          "User-Agent": "konkred-applet"
        }
      });
      const emails = await emailsRes.json();
      const primaryEmailObj = emails && Array.isArray(emails) ? emails.find((e) => e.primary) : null;
      const email = primaryEmailObj ? primaryEmailObj.email : githubUser.email || `${githubUser.login}@github.konkred.local`;
      const uid = `github_${githubUser.id}`;
      const displayName = githubUser.name || githubUser.login || "GitHub Architect";
      try {
        await db.insert(users).values({
          uid,
          email,
          displayName,
          acceptedCopyrightTerms: true,
          canGenerateBlogs: true,
          role: "user"
        }).onConflictDoUpdate({
          target: users.uid,
          set: {
            email,
            displayName
          }
        });
      } catch (dbErr) {
        console.error("Failed to sync GitHub user with Postgres:", dbErr);
      }
      const userDocRef = adminDb.collection("users").doc(uid);
      const userDoc = await userDocRef.get();
      if (!userDoc.exists) {
        await userDocRef.set({
          displayName,
          email,
          role: "user",
          tier: "free",
          balance: { fiat: 1e3, crypto: 0.1 },
          stats: {
            totalPurchases: 0,
            totalSales: 0,
            totalEarnings: 0,
            rating: 5,
            reviewCount: 0
          },
          payoutThreshold: 500,
          kycStatus: "unverified",
          acceptedCopyrightTerms: true,
          canGenerateBlogs: true,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        });
      } else {
        await userDocRef.set({
          displayName,
          email
        }, { merge: true });
      }
      const customToken = await adminAuth.createCustomToken(uid);
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
    } catch (err) {
      console.error("Github OAuth error:", err);
      res.status(500).send(`Authentication sequence failure: ${err.message || err}`);
    }
  });
  app.post("/api/ai/generate", async (req, res) => {
    try {
      const { provider, messages, config } = req.body;
      if (provider === "google") {
        const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
        if (!apiKey) {
          return res.status(500).json({ error: "GEMINI_API_KEY not configured on server." });
        }
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build"
            }
          }
        });
        const systemInstruction = messages.find((m) => m.role === "system")?.content;
        const chatMessages = messages.filter((m) => m.role !== "system");
        let modelName = config?.defaultModel || "gemini-3.5-flash";
        if (modelName !== "gemini-3-pro-preview" && modelName !== "gemini-3-flash-preview" && modelName !== "gemini-3.5-flash") {
          modelName = "gemini-3.5-flash";
        }
        const result = await ai.models.generateContent({
          model: modelName,
          contents: chatMessages.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }]
          })),
          config: {
            systemInstruction: systemInstruction || void 0,
            temperature: config?.temperature ?? 0.7,
            maxOutputTokens: config?.maxTokens,
            responseMimeType: config?.responseMimeType,
            responseSchema: config?.responseSchema,
            tools: config?.tools
          }
        });
        const responseText = result.text;
        const groundingChunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        return res.json({
          text: responseText,
          groundingChunks
        });
      }
      if (provider === "anthropic") {
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY missing" });
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01"
          },
          body: JSON.stringify({
            model: config.defaultModel,
            system: messages.find((m) => m.role === "system")?.content,
            messages: messages.filter((m) => m.role !== "system").map((m) => ({
              role: m.role === "assistant" ? "assistant" : "user",
              content: m.content
            })),
            max_tokens: config.maxTokens || 1024,
            temperature: config.temperature
          })
        });
        const data = await response.json();
        return res.json({ text: data.content?.[0]?.text || "" });
      }
      const openAICompatible = {
        "openai": "https://api.openai.com/v1",
        "openrouter": "https://openrouter.ai/api/v1",
        "groq": "https://api.groq.com/openai/v1",
        "deepseek": "https://api.deepseek.com/v1",
        "mistral": "https://api.mistral.ai/v1",
        "xai": "https://api.x.ai/v1",
        "cerebras": "https://api.cerebras.ai/v1",
        "sambanova": "https://api.sambanova.ai/v1",
        "together": "https://api.together.xyz/v1",
        "fireworks": "https://api.fireworks.ai/inference/v1",
        "perplexity": "https://api.perplexity.ai"
      };
      if (openAICompatible[provider]) {
        const envVarName = `${provider.toUpperCase()}_API_KEY`;
        const apiKey = process.env[envVarName];
        if (!apiKey) return res.status(500).json({ error: `${envVarName} missing on server.` });
        const response = await fetch(`${openAICompatible[provider]}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: config.defaultModel,
            messages: messages.map((m) => ({
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
    } catch (error) {
      console.error("AI Proxy Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  async function authenticatedIdentity(req) {
    const authorization = req.header("authorization") || "";
    const match = authorization.match(/^Bearer\s+(.+)$/i);
    if (!match) return null;
    try {
      const decoded = await adminAuth.verifyIdToken(match[1]);
      return { uid: decoded.uid };
    } catch {
      return null;
    }
  }
  function safeError(error) {
    return error instanceof Error ? error.message : "Unknown error";
  }
  function validateContextFiles(value) {
    if (value === void 0) return [];
    if (!Array.isArray(value) || value.length > 20) throw new Error("Attachments must contain at most 20 files.");
    const allowed = /\.(?:tsx?|jsx?|json|prisma|sql|ya?ml)$/i;
    let total = 0;
    return value.map((item) => {
      if (!item || typeof item !== "object") throw new Error("Invalid attachment.");
      const candidate = item;
      if (typeof candidate.path !== "string" || !allowed.test(candidate.path) || candidate.path.includes("..")) throw new Error("Attachment path or extension is not allowed.");
      if (typeof candidate.contentBase64 !== "string" || typeof candidate.size !== "number" || candidate.size < 0) throw new Error("Invalid attachment payload.");
      total += candidate.size;
      if (total > 500 * 1024) throw new Error("Attachments exceed the 500KB limit.");
      return { path: candidate.path.slice(0, 240), contentBase64: candidate.contentBase64, size: candidate.size };
    });
  }
  app.get("/api/fullkonk/providers", (_req, res) => {
    const grouped = /* @__PURE__ */ new Map();
    MODEL_REGISTRY.forEach((profile) => {
      const provider = grouped.get(profile.providerId) || { id: profile.providerId, name: profile.providerName, hasKey: Boolean(process.env[profile.envKey]), models: [] };
      provider.models.push({ id: profile.modelId, label: profile.modelLabel });
      grouped.set(profile.providerId, provider);
    });
    res.json({ providers: [...grouped.values()] });
  });
  app.get("/api/fullkonk/health", (_req, res) => {
    res.json({ providers: getOrchestratorHealth() });
  });
  app.post("/api/fullkonk/optimize-prompt", async (req, res) => {
    try {
      const prompt = typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";
      if (!prompt || prompt.length > 4e3) return res.status(400).json({ error: "Prompt must contain 1\u20134000 characters." });
      const groqKey = process.env.GROQ_API_KEY;
      if (!groqKey) return res.status(503).json({ error: "Prompt optimizer is unavailable." });
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15e3);
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { Authorization: `Bearer ${groqKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            temperature: 0.25,
            max_tokens: Math.min(1800, Math.max(256, prompt.length * 2)),
            messages: [
              { role: "system", content: "Improve this product description for AI code generation. Add: tech stack preferences if missing, specific feature list, expected user flows, data models if inferrable. Return improved version only. Max 3x original length." },
              { role: "user", content: prompt }
            ]
          }),
          signal: controller.signal
        });
        if (!response.ok) return res.status(response.status === 429 ? 429 : 502).json({ error: "Prompt optimizer provider failed." });
        const payload = await response.json();
        const optimized = payload.choices?.[0]?.message?.content?.trim();
        if (!optimized) return res.status(502).json({ error: "Prompt optimizer returned no suggestion." });
        res.json({ prompt: optimized.slice(0, prompt.length * 3) });
      } finally {
        clearTimeout(timer);
      }
    } catch (error) {
      res.status(500).json({ error: safeError(error) });
    }
  });
  app.post("/api/fullkonk/generate", async (req, res) => {
    const prompt = typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";
    const mode = ["fullstack", "frontend", "backend", "review"].includes(req.body?.mode) ? req.body.mode : "fullstack";
    const preferredProvider = typeof req.body?.provider === "string" ? req.body.provider : void 0;
    const requestedModel = typeof req.body?.model === "string" ? req.body.model : void 0;
    const temperature = typeof req.body?.temperature === "number" ? Math.min(1, Math.max(0, req.body.temperature)) : 0.4;
    const maxTokens = typeof req.body?.maxTokens === "number" ? Math.min(16384, Math.max(1024, req.body.maxTokens)) : 8192;
    const customSystemPrompt = typeof req.body?.systemPrompt === "string" ? req.body.systemPrompt.slice(0, 12e3) : void 0;
    const projectId = typeof req.body?.projectId === "string" ? req.body.projectId : void 0;
    if (!prompt) return res.status(400).json({ error: "prompt required" });
    let attachedFiles;
    try {
      attachedFiles = validateContextFiles(req.body?.attachedFiles);
    } catch (error) {
      return res.status(400).json({ error: safeError(error) });
    }
    let context = "";
    try {
      if (projectId) {
        const identity = await authenticatedIdentity(req);
        if (!identity) return res.status(401).json({ error: "Authentication required to access a project." });
        const project = await adminDb.collection("fk_projects").doc(projectId).get();
        if (!project.exists) return res.status(404).json({ error: "Project not found." });
        const data = project.data();
        if (data?.userId !== identity.uid) return res.status(403).json({ error: "Project access denied." });
        const projectFiles = Array.isArray(data.files) ? data.files : [];
        const serialized = projectFiles.filter((file) => typeof file.path === "string" && typeof file.content === "string").map((file) => `
[${file.path}]
${file.content.slice(0, 4e4)}`).join("");
        context += `

Existing project files:${serialized}

Extend this project. Do not rewrite what already works.`;
      }
      if (attachedFiles.length) {
        const decoded = attachedFiles.map((file) => {
          const content = Buffer.from(file.contentBase64, "base64").toString("utf8");
          if (Buffer.byteLength(content, "utf8") > file.size + 4) throw new Error(`Attachment size mismatch: ${file.path}`);
          return `
[${file.path}]
${content}`;
        }).join("");
        context += `

User's existing codebase context:${decoded}

Generate code that integrates cleanly with this.`;
      }
    } catch (error) {
      return res.status(400).json({ error: safeError(error) });
    }
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();
    const requestAbort = new AbortController();
    let disconnected = false;
    const disconnect = () => {
      disconnected = true;
      requestAbort.abort();
    };
    req.once("aborted", disconnect);
    res.once("close", () => {
      if (!res.writableEnded) disconnect();
    });
    const send = (chunk) => {
      if (disconnected || res.destroyed || res.writableEnded) return;
      try {
        res.write(`data: ${JSON.stringify(chunk)}

`);
      } catch {
        requestAbort.abort();
      }
    };
    let totalCharacters = 0;
    let currentProvider = "";
    async function streamStage(task, messages, onChunk) {
      const result = await orchestrate({
        task,
        messages,
        temperature,
        maxTokens,
        preferProviders: preferredProvider ? [preferredProvider] : void 0,
        preferModel: requestedModel,
        requireThinking: ["architect", "backend", "verify", "review"].includes(task),
        minContextWindow: task === "architect" ? 32e3 : void 0
      }, {
        onChunk: (text2) => {
          totalCharacters += text2.length;
          onChunk(text2);
        },
        onProviderSelect: (providerName, modelName) => {
          currentProvider = providerName;
          send({ type: "provider", provider: providerName, model: modelName });
        },
        onFailover: (from, to, reason) => send({ type: "failover", from, to, error: reason }),
        onMetrics: (tokensPerSecond, _attemptTokens, providerName) => send({
          type: "metrics",
          data: { tokensPerSecond, totalTokens: Math.ceil(totalCharacters / 4), provider: providerName }
        }),
        onReset: (characters) => {
          totalCharacters = Math.max(0, totalCharacters - characters);
          send({ type: "reset", characters });
        }
      }, requestAbort.signal);
      return result.content;
    }
    try {
      if (mode === "review") {
        send({ type: "stage", stage: "review" });
        await streamStage("review", [{ role: "system", content: customSystemPrompt || SYSTEM_PROMPTS.verify }, { role: "user", content: prompt + context }], (output) => send({ type: "delta", content: output }));
      } else {
        send({ type: "stage", stage: "architect" });
        const architecture = await streamStage("architect", [{ role: "system", content: customSystemPrompt || SYSTEM_PROMPTS.architect }, { role: "user", content: `Design the complete architecture for: ${prompt}${context}` }], (output) => send({ type: "delta", content: output }));
        let frontend = "";
        let backend = "";
        if (mode === "frontend" || mode === "fullstack") {
          send({ type: "stage", stage: "frontend" });
          frontend = await streamStage("frontend", [{ role: "system", content: SYSTEM_PROMPTS.frontend }, { role: "user", content: `Architecture:
${architecture}${context}

Implement the complete frontend.` }], (output) => send({ type: "delta", content: output }));
        }
        if (mode === "backend" || mode === "fullstack") {
          send({ type: "stage", stage: "backend" });
          backend = await streamStage("backend", [{ role: "system", content: SYSTEM_PROMPTS.backend }, { role: "user", content: `Architecture:
${architecture}${context}

Implement the complete backend.` }], (output) => send({ type: "delta", content: output }));
        }
        let integrated = `${frontend}
${backend}`;
        if (mode === "fullstack") {
          send({ type: "stage", stage: "verify" });
          integrated = await streamStage("verify", [{ role: "system", content: SYSTEM_PROMPTS.verify }, { role: "user", content: `Architecture:
${architecture}

Frontend:
${frontend}

Backend:
${backend}

Verify and output the complete final integrated file set.` }], (output) => send({ type: "delta", content: output }));
          send({ type: "stage", stage: "test" });
          await streamStage("test", [{ role: "system", content: SYSTEM_PROMPTS.test }, { role: "user", content: `Architecture:
${architecture}

Integrated files:
${integrated}

Write the complete test files.` }], (output) => send({ type: "delta", content: output }));
        }
      }
      if (!requestAbort.signal.aborted) {
        send({ type: "metrics", data: { tokensPerSecond: 0, totalTokens: Math.ceil(totalCharacters / 4), provider: currentProvider } });
        send({ type: "done" });
      }
    } catch (error) {
      if (!requestAbort.signal.aborted) send({ type: "error", error: safeError(error) });
    } finally {
      if (!res.writableEnded && !res.destroyed) res.end();
    }
  });
  app.get("/api/fullkonk/sessions/:userId", async (req, res) => {
    try {
      const identity = await authenticatedIdentity(req);
      if (!identity) return res.status(401).json({ error: "Authentication required." });
      if (identity.uid !== req.params.userId) return res.status(403).json({ error: "User mismatch." });
      const count = Math.min(Number(req.query.count) || 20, 50);
      const snapshot = await adminDb.collection("fk_sessions").where("userId", "==", identity.uid).limit(count).get();
      const sessions = snapshot.docs.map((item) => ({ id: item.id, data: item.data() })).sort((a, b) => {
        const aUpdated = a.data.updatedAt;
        const bUpdated = b.data.updatedAt;
        return (bUpdated?.toMillis?.() || 0) - (aUpdated?.toMillis?.() || 0);
      }).map((item) => ({ id: item.id, ...item.data }));
      res.json({ sessions, userId: identity.uid });
    } catch (error) {
      res.status(500).json({ error: safeError(error) });
    }
  });
  app.post("/api/fullkonk/usage", async (req, res) => {
    try {
      const identity = await authenticatedIdentity(req);
      if (!identity) return res.status(401).json({ error: "Authentication required." });
      if (identity.uid !== req.body?.userId) return res.status(403).json({ error: "User mismatch." });
      const { provider, model, mode, stage, tokens, durationMs, success } = req.body;
      if (typeof provider !== "string") return res.status(400).json({ error: "provider required" });
      await adminDb.collection("fk_usage").add({
        userId: identity.uid,
        provider,
        model: typeof model === "string" ? model : "",
        mode: typeof mode === "string" ? mode : "",
        stage: typeof stage === "string" ? stage : "",
        tokens: typeof tokens === "number" ? tokens : 0,
        durationMs: typeof durationMs === "number" ? durationMs : 0,
        success: typeof success === "boolean" ? success : true,
        createdAt: /* @__PURE__ */ new Date()
      });
      res.json({ ok: true });
    } catch (error) {
      res.status(500).json({ error: safeError(error) });
    }
  });
  app.get("/api/fullkonk/analytics/:userId", async (req, res) => {
    try {
      const identity = await authenticatedIdentity(req);
      if (!identity) return res.status(401).json({ error: "Authentication required." });
      if (identity.uid !== req.params.userId) return res.status(403).json({ error: "User mismatch." });
      const days = Math.min(Math.max(Number(req.query.days) || 30, 1), 90);
      const since = new Date(Date.now() - days * 864e5);
      const snapshot = await adminDb.collection("fk_usage").where("userId", "==", identity.uid).limit(1e3).get();
      const events = snapshot.docs.map((item) => {
        const data = item.data();
        const created = data.createdAt && typeof data.createdAt.toDate === "function" ? data.createdAt.toDate() : /* @__PURE__ */ new Date(0);
        return {
          id: item.id,
          userId: identity.uid,
          provider: typeof data.provider === "string" ? data.provider : "unknown",
          model: typeof data.model === "string" ? data.model : "",
          mode: typeof data.mode === "string" ? data.mode : "unknown",
          stage: typeof data.stage === "string" ? data.stage : "",
          tokens: typeof data.tokens === "number" ? data.tokens : 0,
          durationMs: typeof data.durationMs === "number" ? data.durationMs : 0,
          success: data.success !== false,
          createdAt: created.getTime()
        };
      }).filter((event) => event.createdAt >= since.getTime()).sort((a, b) => b.createdAt - a.createdAt);
      const summary = {
        totalGenerations: events.length,
        totalTokens: 0,
        totalDurationMs: 0,
        byProvider: {},
        byMode: {},
        failoverCount: 0,
        avgDurationMs: 0
      };
      events.forEach((event) => {
        summary.totalTokens += event.tokens;
        summary.totalDurationMs += event.durationMs;
        summary.byProvider[event.provider] ||= { count: 0, tokens: 0 };
        summary.byProvider[event.provider].count += 1;
        summary.byProvider[event.provider].tokens += event.tokens;
        summary.byMode[event.mode] = (summary.byMode[event.mode] || 0) + 1;
      });
      summary.avgDurationMs = events.length ? Math.round(summary.totalDurationMs / events.length) : 0;
      res.json({ summary, recent: events.slice(0, 10) });
    } catch (error) {
      res.status(500).json({ error: safeError(error) });
    }
  });
  app.post("/api/fullkonk/github/export", async (req, res) => {
    try {
      const { files, token, owner, repo, branch = "fullkonk-output", message = "Generated by fullKONK_>" } = req.body || {};
      if (!Array.isArray(files) || files.length === 0) return res.status(400).json({ error: "files required" });
      if (typeof token !== "string" || !/^(?:gh[pousr]_[A-Za-z0-9_]{20,255}|github_pat_[A-Za-z0-9_]{20,255})$/.test(token)) return res.status(400).json({ error: "A valid GitHub token is required." });
      if (typeof owner !== "string" || typeof repo !== "string" || !/^[A-Za-z0-9_.-]+$/.test(owner) || !/^[A-Za-z0-9_.-]+$/.test(repo)) return res.status(400).json({ error: "Valid owner and repository names are required." });
      if (typeof branch !== "string" || !/^[A-Za-z0-9._/-]+$/.test(branch) || branch.includes("..")) return res.status(400).json({ error: "Invalid branch name." });
      const result = await exportToGitHub(files, { token, owner, repo, branch, message: typeof message === "string" ? message.slice(0, 200) : "Generated by fullKONK_>" });
      res.status(result.success ? 200 : 502).json(result);
    } catch (error) {
      res.status(500).json({ error: safeError(error) });
    }
  });
  app.get(["/redaeye", "/redaeye.html"], (req, res) => {
    const prodFile = path.join(process.cwd(), "dist", "redaeye.html");
    const devFile = path.join(process.cwd(), "public", "redaeye.html");
    if (process.env.NODE_ENV === "production") {
      return res.sendFile(prodFile);
    }
    return res.sendFile(devFile);
  });
  if (process.env.VERCEL) {
    app.use((_req, res) => res.status(404).json({ error: "API route not found." }));
  } else if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true, allowedHosts: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  return app;
}
export {
  createApp
};
