import { AIProviderID, User } from './types.ts';

export const BRAND = {
    name: 'KONKRED',
    suffix: '.xyz',
    tagline: 'The Operating System for AI Commerce'
};

export const LICENSE_TYPES = [
  { id: 'personal', name: 'Personal License', multiplier: 1, description: 'Single node deployment. For individual architects and researchers.' },
  { id: 'commercial', name: 'Commercial License', multiplier: 2.5, description: 'Up to 5 nodes. For boutique consultancies and startup labs.' },
  { id: 'enterprise', name: 'Enterprise License', multiplier: 8, description: 'Unlimited node distribution. For global enterprise infrastructure.' },
];

export const ASSET_TYPES = [
    { id: 'prompt', name: 'Prompt System' },
    { id: 'agent', name: 'Autonomous Agent' },
    { id: 'dataset', name: 'Proprietary Dataset' },
    { id: 'api', name: 'Enterprise API' },
    { id: 'protocol', name: 'Logic Protocol' },
];

export const AI_PROVIDERS: Record<AIProviderID, { name: string; baseUrl: string; models: string[] }> = {
  openai: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-4o', 'gpt-4-turbo', 'o1-preview', 'o1-mini']
  },
  anthropic: {
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-opus', 'claude-3-haiku']
  },
  google: {
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com',
    models: ['gemini-3-pro-preview', 'gemini-3-flash-preview', 'gemini-2.0-flash-exp']
  },
  openrouter: {
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    models: ['auto', 'meta-llama/llama-3.1-405b']
  },
  groq: {
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    models: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768']
  },
  xai: {
    name: 'xAI (Grok)',
    baseUrl: 'https://api.x.ai/v1',
    models: ['grok-beta', 'grok-2']
  },
  deepseek: {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    models: ['deepseek-chat', 'deepseek-coder']
  },
  mistral: {
    name: 'Mistral AI',
    baseUrl: 'https://api.mistral.ai/v1',
    models: ['mistral-large-latest', 'codestral-latest']
  },
  qwen: {
    name: 'Qwen',
    baseUrl: 'https://dashscope.aliyuncs.com/api/v1',
    models: ['qwen-max', 'qwen-plus']
  },
  cerebras: {
    name: 'Cerebras',
    baseUrl: 'https://api.cerebras.ai/v1',
    models: ['cerebras-gpt']
  },
  sambanova: {
    name: 'SambaNova',
    baseUrl: 'https://api.sambanova.ai/v1',
    models: ['samba-1']
  },
  together: {
    name: 'Together AI',
    baseUrl: 'https://api.together.xyz/v1',
    models: ['meta-llama/Llama-3-70b-chat-hf']
  },
  fireworks: {
    name: 'Fireworks AI',
    baseUrl: 'https://api.fireworks.ai/inference/v1',
    models: ['llama-v3-70b-instruct']
  },
  perplexity: {
    name: 'Perplexity',
    baseUrl: 'https://api.perplexity.ai',
    models: ['llama-3.1-sonar-large-128k-online']
  },
  cohere: {
    name: 'Cohere',
    baseUrl: 'https://api.cohere.ai/v1',
    models: ['command-r-plus', 'command-r']
  }
};

export const SUBSCRIPTION_PLANS = [
    { id: 'free', name: 'Explorer', price: 0 },
    { id: 'pro', name: 'Professional', price: 49 },
    { id: 'enterprise', name: 'Enterprise', price: 299 },
];

export const CATEGORIES = [
    { id: 'content', name: 'Content' },
    { id: 'cybersecurity', name: 'Cybersecurity' },
    { id: 'business_automation', name: 'Business Automation' },
    { id: 'creative_tools', name: 'Creative Tools' },
];

export const SORT_OPTIONS = [
    { label: 'Trending', value: 'trending' },
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low', value: 'price_low' },
    { label: 'Price: High', value: 'price_high' },
    { label: 'Highest Rated', value: 'rating' },
];

export const HOW_IT_WORKS_BUYER = [
  { step: '01', title: 'Search', icon: 'Search', description: 'Browse the verified library for structural capital.' },
  { step: '02', title: 'Verify', icon: 'Shield', description: 'Review the audit report and technical grading.' },
  { step: '03', title: 'Acquire', icon: 'CreditCard', description: 'Secure licensing via decentralized settlement.' },
  { step: '04', title: 'Deploy', icon: 'Rocket', description: 'Download the payload to your secure enclave.' },
];

export const HOW_IT_WORKS_SELLER = [
  { step: '01', title: 'Design', icon: 'PenTool', description: 'Construct high-fidelity logic maps or agents.' },
  { step: '02', title: 'Audit', icon: 'Shield', description: 'Pass the Forge verification for logic integrity.' },
  { step: '03', title: 'Publish', icon: 'Upload', description: 'Deploy your asset to the global network.' },
  { step: '04', title: 'Earn', icon: 'DollarSign', description: 'Receive instant yield on every acquisition.' },
];

/**
 * FIX: Added missing MOCK_USER constant for authentication development and default states.
 */
export const MOCK_USER: any = {
    id: 'system-architect-01',
    email: 'architect@konkred.xyz',
    name: 'Ari Miyanji',
    role: 'pro_seller',
    verified: true,
    tier: 'enterprise',
    balance: { fiat: 12500, crypto: 1.25 },
    stats: {
        totalPurchases: 24,
        totalSales: 156,
        totalEarnings: 42850,
        rating: 5.0,
        reviewCount: 88,
    },
    payoutThreshold: 500,
    kycStatus: 'verified',
    createdAt: new Date(),
};

export const TRUST_POINTS = [
  {
    title: 'Deterministic Logic',
    description: 'Every asset undergoes formal verification to ensure logical consistency and output stability.'
  },
  {
    title: 'Zero-Hallucination',
    description: 'Protocols are stress-tested against adversarial inputs to minimize probabilistic error rates.'
  },
  {
    title: 'Secure Settlement',
    description: 'Instant global clearing via decentralized crypto rails ensures privacy and sovereign ownership.'
  }
];