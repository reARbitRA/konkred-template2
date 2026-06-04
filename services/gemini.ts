import { GoogleGenAI, Type } from "@google/genai";
import { aiService } from './ai.ts';

/**
 * Runs a technical audit on a provided protocol or prompt.
 * DEPRECATED: Use aiService.runAudit directly.
 */
export const runAudit = async (content: string, userId: string = 'system') => {
  return aiService.runAudit(content, userId);
};

/**
 * Performs a market sentiment analysis using Google Search Grounding.
 */
export const runMarketScan = async (query: string) => {
  /* FIX: Using standard static initialization for Gemini client with environment API key */
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: [{ parts: [{ text: `Analyze the current market demand, pricing trends, and technical sentiment for: "${query}"` }] }],
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  return {
    /* FIX: Correctly accessed model output via .text property */
    text: response.text || '',
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

/**
 * Suggests improvements or next steps for an agent workflow graph.
 */
export const suggestNodeConnections = async (nodes: any[], edges: any[]) => {
    /* FIX: Consistent Gemini client setup using recommended platform patterns */
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{
            parts: [{
                text: `Analyze this agent graph and suggest one critical optimization:
                Nodes: ${JSON.stringify(nodes.map(n => ({ id: n.id, type: n.type, label: n.data.label })))}
                Edges: ${JSON.stringify(edges)}`
            }]
        }],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                /* FIX: Utilized the imported Type enum for strict response schema definition */
                type: Type.OBJECT,
                properties: {
                    suggestion: { type: Type.STRING },
                    rationale: { type: Type.STRING }
                }
            }
        }
    });
    /* FIX: Accessed output string from the model response via .text property */
    return JSON.parse(response.text?.trim() || '{}');
};