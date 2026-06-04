
import { GoogleGenAI, Type } from "@google/genai";
import { AIProviderID, AIProviderConfig, AuditResult } from '../types.ts';
import { db } from './firebase.ts';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { AIProviderFactory, ChatMessage } from '../lib/ai/providers.ts';
import { AI_PROVIDERS } from '../constants.ts';

class UnifiedAIService {
  constructor() {}

  /**
   * Performs an executive AUDIT on a payload using the Google Gemini 3 Pro model.
   * This is the core verification layer for all assets on the platform.
   */
  async runAudit(payload: string, userId: string): Promise<AuditResult> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [{
        parts: [{
          text: `Perform an exhaustive architecture audit for KONKRED Executive Systems.
          Score the payload on: Logical Integrity (0-100), Safety/Compliance (0-100), and Execution Efficiency (0-100).
          Input: "${payload}"`
        }]
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER },
            logic: { type: Type.NUMBER },
            safety: { type: Type.NUMBER },
            efficiency: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            vulnerabilities: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["overallScore", "logic", "safety", "efficiency", "summary"]
        }
      }
    });

    const data = JSON.parse(response.text?.trim() || '{}');
    const auditId = `aud_${Date.now()}`;
    
    const result: AuditResult = {
      id: auditId,
      userId,
      ...data,
      provider: 'google',
      model: 'gemini-3-pro-preview',
      timestamp: serverTimestamp()
    };

    await setDoc(doc(db, 'audits', auditId), result);
    return result;
  }

  /**
   * Executes a chat completion using the user's preferred external provider.
   */
  async executiveChat(userId: string, messages: ChatMessage[]) {
    const configRef = doc(db, `users/${userId}/settings/ai`);
    const configSnap = await getDoc(configRef);
    
    const keysRef = doc(db, `users/${userId}/secure/keys`);
    const keysSnap = await getDoc(keysRef);

    if (!configSnap.exists() || !keysSnap.exists()) {
        // Default to internal Gemini if user has no keys
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          })),
          config: {
            temperature: 0.7,
          }
        });
        return response.text;
    }

    const config = configSnap.data() as AIProviderConfig;
    const keys = keysSnap.data() as Record<AIProviderID, string>;
    const providerId = config.primaryProvider;
    const apiKey = keys[providerId];

    if (!apiKey) {
      throw new Error(`API Key for ${providerId} is missing in your secure enclave.`);
    }

    try {
      const provider = AIProviderFactory.getProvider(providerId);
      return await provider.generateResponse(messages, config, apiKey);
    } catch (error: any) {
      // Fallback logic
      if (config.fallbackProvider && keys[config.fallbackProvider]) {
        const fallbackProvider = AIProviderFactory.getProvider(config.fallbackProvider);
        return await fallbackProvider.generateResponse(messages, {
          ...config,
          primaryProvider: config.fallbackProvider
        }, keys[config.fallbackProvider]);
      }
      throw error;
    }
  }

  /**
   * Tests connection to an AI provider node.
   * FIX: Implemented testConnection to verify provider connectivity and measure latency.
   */
  async testConnection(id: AIProviderID, apiKey: string): Promise<{ success: boolean, latency: number, message: string }> {
    const start = Date.now();
    try {
      const provider = AIProviderFactory.getProvider(id);
      // Send a minimal prompt to verify connectivity
      await provider.generateResponse([{ role: 'user', content: 'connection_test' }], {
        primaryProvider: id,
        defaultModel: AI_PROVIDERS[id].models[0],
        temperature: 0.1,
        maxTokens: 1,
        stream: false
      }, apiKey);
      
      return {
        success: true,
        latency: Date.now() - start,
        message: "Neural handshake verified."
      };
    } catch (error: any) {
      return {
        success: false,
        latency: Date.now() - start,
        message: error.message || "Uplink disruption detected."
      };
    }
  }
}

export const aiService = new UnifiedAIService();
