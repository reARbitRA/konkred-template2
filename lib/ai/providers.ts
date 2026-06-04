import { GoogleGenAI, Modality } from "@google/genai";
import { AIProviderID, AIProviderConfig } from '../../types.ts';

/**
 * Standardized message format for all providers
 */
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Interface for any AI Provider implementation
 */
export interface ProviderImplementation {
  id: AIProviderID;
  generateResponse(
    messages: ChatMessage[],
    config: AIProviderConfig,
    apiKey: string
  ): Promise<string>;
}

/**
 * Google Gemini Implementation using @google/genai SDK
 */
class GoogleProvider implements ProviderImplementation {
  id: AIProviderID = 'google';

  async generateResponse(messages: ChatMessage[], config: AIProviderConfig, _apiKey: string): Promise<string> {
    // FIX: Using process.env.API_KEY exclusively for Gemini as per platform guidelines.
    // The application must not manage or ask for the Gemini API key via UI.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Extract system instruction if present
    const systemInstruction = messages.find(m => m.role === 'system')?.content;
    const chatMessages = messages.filter(m => m.role !== 'system');

    const response = await ai.models.generateContent({
      model: config.defaultModel || 'gemini-3-flash-preview',
      contents: chatMessages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      })),
      config: {
        systemInstruction,
        temperature: config.temperature,
        // FIX: Removed maxOutputTokens to follow best practices for unblocked generation.
      }
    });

    // FIX: Accessing .text property directly as it is a getter, not a method.
    return response.text || '';
  }
}

/**
 * Anthropic Implementation using native messages format
 */
class AnthropicProvider implements ProviderImplementation {
  id: AIProviderID = 'anthropic';

  async generateResponse(messages: ChatMessage[], config: AIProviderConfig, apiKey: string): Promise<string> {
    const system = messages.find(m => m.role === 'system')?.content;
    const body = {
      model: config.defaultModel,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
      system,
      messages: messages.filter(m => m.role !== 'system').map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      })),
    };

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'dangerously-allow-browser': 'true' // In production, route through backend
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error(`Anthropic API error: ${res.statusText}`);
    const data = await res.json();
    return data.content[0].text;
  }
}

/**
 * General OpenAI-Compatible Implementation
 */
class OpenAICompatibleProvider implements ProviderImplementation {
  constructor(public id: AIProviderID, private baseUrl: string) {}

  async generateResponse(messages: ChatMessage[], config: AIProviderConfig, apiKey: string): Promise<string> {
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: config.defaultModel,
        messages,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        stream: false
      })
    });

    if (!res.ok) throw new Error(`${this.id} API error: ${res.statusText}`);
    const data = await res.json();
    return data.choices[0].message.content;
  }
}

/**
 * Cohere Specific Implementation
 */
class CohereProvider implements ProviderImplementation {
  id: AIProviderID = 'cohere';

  async generateResponse(messages: ChatMessage[], config: AIProviderConfig, apiKey: string): Promise<string> {
    const chatHistory = messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'CHATBOT' : 'USER',
      message: m.content
    }));

    const res = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: config.defaultModel,
        message: messages[messages.length - 1].content,
        chat_history: chatHistory,
        temperature: config.temperature
      })
    });

    if (!res.ok) throw new Error(`Cohere API error: ${res.statusText}`);
    const data = await res.json();
    return data.text;
  }
}

/**
 * Factory and Registry for AI Providers
 */
export class AIProviderFactory {
  private static providers: Map<AIProviderID, ProviderImplementation> = new Map();

  static {
    // Register Google
    this.providers.set('google', new GoogleProvider());
    
    // Register Anthropic
    this.providers.set('anthropic', new AnthropicProvider());

    // Register Cohere
    this.providers.set('cohere', new CohereProvider());

    // Register OpenAI-Compatible APIs
    const openAICompatible: Record<string, string> = {
      'openai': 'https://api.openai.com/v1',
      'openrouter': 'https://openrouter.ai/api/v1',
      'groq': 'https://api.groq.com/openai/v1',
      'xai': 'https://api.x.ai/v1',
      'deepseek': 'https://api.deepseek.com/v1',
      'mistral': 'https://api.mistral.ai/v1',
      'qwen': 'https://dashscope.aliyuncs.com/api/v1',
      'cerebras': 'https://api.cerebras.ai/v1',
      'sambanova': 'https://api.sambanova.ai/v1',
      'together': 'https://api.together.xyz/v1',
      'fireworks': 'https://api.fireworks.ai/inference/v1',
      'perplexity': 'https://api.perplexity.ai',
    };

    Object.entries(openAICompatible).forEach(([id, url]) => {
      this.providers.set(id as AIProviderID, new OpenAICompatibleProvider(id as AIProviderID, url));
    });
  }

  static getProvider(id: AIProviderID): ProviderImplementation {
    const provider = this.providers.get(id);
    if (!provider) throw new Error(`Provider ${id} not implemented.`);
    return provider;
  }
}
