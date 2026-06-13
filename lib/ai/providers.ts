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
    _apiKey?: string
  ): Promise<string>;
}

/**
 * Standard Multi-Provider Proxy Implementation
 */
class ProxyAIProvider implements ProviderImplementation {
  constructor(public id: AIProviderID) {}

  async generateResponse(messages: ChatMessage[], config: AIProviderConfig): Promise<string> {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider: this.id,
        messages,
        config
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Uplink to ${this.id} node refused.`);
    }

    const data = await response.json();
    return data.text;
  }
}

/**
 * Factory and Registry for AI Providers
 * Refactored to use central server-side proxy
 */
export class AIProviderFactory {
  private static providers: Map<AIProviderID, ProviderImplementation> = new Map();

  static {
    // List of supported IDs mapped to the central proxy
    const providerIds: AIProviderID[] = [
      'google', 'anthropic', 'cohere', 'openai', 'openrouter', 
      'groq', 'xai', 'deepseek', 'mistral', 'qwen', 
      'cerebras', 'sambanova', 'together', 'fireworks', 'perplexity'
    ];

    providerIds.forEach(id => {
      this.providers.set(id, new ProxyAIProvider(id));
    });
  }

  static getProvider(id: AIProviderID): ProviderImplementation {
    const provider = this.providers.get(id);
    if (!provider) throw new Error(`Provider ${id} not implemented.`);
    return provider;
  }
}
