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
  const response = await fetch('/api/ai/generate', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      provider: "google",
      messages: [{
        role: "user",
        content: `Analyze the current market demand, pricing trends, and technical sentiment for: "${query}"`
      }],
      config: {
        defaultModel: "gemini-3-pro-preview",
        tools: [{ googleSearch: {} }]
      }
    })
  });

  if (!response.ok) {
    throw new Error("Market scan query failed.");
  }

  const resultData = await response.json();
  return {
    text: resultData.text || '',
    sources: resultData.groundingChunks || []
  };
};

/**
 * Suggests improvements or next steps for an agent workflow graph.
 */
export const suggestNodeConnections = async (nodes: any[], edges: any[]) => {
  const response = await fetch('/api/ai/generate', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      provider: "google",
      messages: [{
        role: "user",
        content: `Analyze this agent graph and suggest one critical optimization:
        Nodes: ${JSON.stringify(nodes.map(n => ({ id: n.id, type: n.type, label: n.data.label })))}
        Edges: ${JSON.stringify(edges)}`
      }],
      config: {
        defaultModel: "gemini-3-flash-preview",
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            suggestion: { type: "STRING" },
            rationale: { type: "STRING" }
          }
        }
      }
    })
  });

  if (!response.ok) {
    throw new Error("Node connection suggestions failed.");
  }

  const resultData = await response.json();
  return JSON.parse(resultData.text?.trim() || '{}');
};