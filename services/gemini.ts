import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

// Initialize the Gemini API client
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Runs a technical audit on a provided protocol or prompt.
 * Uses Gemini-3-pro-preview for deep logical reasoning.
 */
export const runAudit = async (content: string) => {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: [{
      parts: [{
        text: `Act as a senior AI Security & Logic Auditor for KONKRED Systems. 
        Perform a rigorous audit on the following protocol/prompt architecture.
        Return a valid JSON object containing:
        - overallScore: number (0-100)
        - logic: number (0-100)
        - safety: number (0-100)
        - efficiency: number (0-100)
        - summary: string (concise executive summary)
        - vulnerabilities: string[] (list of technical risks)
        - recommendations: string[] (how to improve the score)
        
        Input Content: "${content}"`
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

  return JSON.parse(response.text.trim());
};

/**
 * Performs a market sentiment analysis using Google Search Grounding.
 */
export const runMarketScan = async (query: string) => {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: [{ parts: [{ text: `Analyze the current market demand, pricing trends, and technical sentiment for: "${query}"` }] }],
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};