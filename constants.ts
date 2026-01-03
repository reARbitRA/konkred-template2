

import { Listing, User } from './types.ts';

export const MOCK_USER: User = {
    id: 'U1',
    email: 'ari@arbitra.io',
    name: 'Ari Miyanji',
    role: 'pro_seller',
    verified: true,
    balance: { fiat: 12450.00, crypto: 0.85 },
    stats: { totalPurchases: 24, totalSales: 482, totalEarnings: 45200, rating: 4.9, reviewCount: 120 },
    payoutThreshold: 100,
    kycStatus: 'verified'
};

export const BRAND = {
    name: 'KONKRED',
    suffix: '.xyz',
    tagline: 'The Operating System for AI Commerce'
};

export const PLATFORM_STATS = [
    { label: 'Assets Verified', value: '1,240', icon: 'Shield' },
    { label: 'Active Sellers', value: '480', icon: 'Users' },
    { label: 'Avg. Audit Score', value: '94.2', icon: 'BarChart3' },
    { label: 'Daily Volume', value: '$84k', icon: 'Zap' },
];

export const SUBSCRIPTION_PLANS = [
    { id: 'free', name: 'Explorer', price: 0 },
    { id: 'pro', name: 'Professional', price: 49 },
    { id: 'enterprise', name: 'Enterprise', price: 299 },
];

export const FEATURED_LISTINGS_DEMO: Listing[] = [
    {
        id: 'L1',
        sellerId: 's1',
        seller: { name: 'LogicForge', verified: true, badge: 'top_seller', totalSales: 450 },
        title: 'Enterprise Legal Contract Analyzer',
        shortDescription: 'High-precision system prompt for NDA and MSA analysis. Verified for zero-hallucination compliance.',
        type: 'prompt_system',
        category: 'legal',
        pricing: { mode: 'one_time', amount: 149, currency: 'USD' },
        delivery: 'download',
        auditScore: 96,
        rating: 4.9,
        reviewCount: 127,
        featured: true,
        tags: ['legal', 'contracts', 'enterprise', 'pdf gen'],
        createdAt: new Date(),
    },
    {
        id: 'L2',
        sellerId: 's2',
        seller: { name: 'HealthAI Systems', verified: true, badge: 'editor_choice', totalSales: 1200 },
        title: 'HIPAA-Compliant Patient Intake API',
        shortDescription: 'Usage-based access to our medical intent classification engine. 99.9% uptime guaranteed.',
        type: 'api',
        category: 'healthcare',
        pricing: { mode: 'usage', amount: 0.02, currency: 'USD', unit: 'request' },
        delivery: 'api_key',
        auditScore: 98,
        rating: 4.9,
        reviewCount: 342,
        featured: true,
        tags: ['health', 'hipaa', 'api', 'compliance'],
        createdAt: new Date(),
    },
    {
        id: 'L3',
        sellerId: 's3',
        seller: { name: 'AgentForge', verified: true, totalSales: 210 },
        title: 'Autonomous Support Agent (SaaS)',
        shortDescription: 'Subscription-based Tier-1 support agent with sentiment analysis and escalation protocols.',
        type: 'agent',
        category: 'support',
        pricing: { mode: 'subscription', amount: 49, currency: 'USD', interval: 'month' },
        delivery: 'hosted_demo',
        auditScore: 91,
        rating: 4.8,
        reviewCount: 89,
        featured: false,
        trending: true,
        tags: ['support', 'agent', 'automation', 'saas'],
        createdAt: new Date(),
    }
];

export const FORGE_TOOLS = [
    { id: 'audit', name: 'Audit Engine', icon: 'Shield' },
    { id: 'optimizer', name: 'Optimizer', icon: 'Zap' },
];

export const TRUST_POINTS = [
    { title: 'Deterministic Audits', description: 'Every asset undergoes automated verification.' },
    { title: 'Secure Escrow', description: 'Funds are held in neutral custody until delivery.' },
    { title: 'Verified Identity', description: 'Sellers undergo rigorous KYC/KYB checks.' },
];

export const HOW_IT_WORKS_BUYER = [
    { step: '01', title: 'Discover', description: 'Find verified prompts and agents.', icon: 'Search' },
    { step: '02', title: 'Audit', description: 'Review the autonomous audit report.', icon: 'Shield' },
    { step: '03', title: 'Acquire', description: 'Secure licensing via Stripe or Crypto.', icon: 'CreditCard' },
    { step: '04', title: 'Deploy', description: 'Instant delivery of structural capital.', icon: 'Rocket' },
];

export const HOW_IT_WORKS_SELLER = [
    { step: '01', title: 'Forge', description: 'Upload your AI architectures.', icon: 'PenTool' },
    { step: '02', title: 'Verify', description: 'Run autonomous audit diagnostics.', icon: 'Shield' },
    { step: '03', title: 'List', description: 'Publish to the global marketplace.', icon: 'Upload' },
    { step: '04', title: 'Scale', description: 'Receive payouts to your global bank.', icon: 'DollarSign' },
];

export const NAV_LINKS = [
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Forge', href: '/forge' },
    { label: 'Network', href: '/network' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Documentation', href: '/documentation' }, // New link
    { label: 'Careers', href: '/career' }, // New link
    { label: 'Courses', href: '/academy' }, // New link (re-pointing existing)
    { label: 'Resources', href: '/resources' }, // New link
];

export const FOOTER_SECTIONS = [
    { title: 'Product', links: [] },
    { title: 'Resources', links: [] },
    { title: 'Company', links: [] },
];

export const ASSET_TYPES = [
    { id: 'prompt', name: 'Prompt', icon: 'FileText', color: 'cyan' },
    { id: 'agent', name: 'AI Agent', icon: 'Bot', color: 'green' },
    { id: 'workflow', name: 'Workflow', icon: 'GitBranch', color: 'orange' },
    { id: 'dataset', name: 'Dataset', icon: 'Database', color: 'blue' },
    { id: 'api', name: 'API', icon: 'Code', color: 'red' },
];

export const LICENSE_TYPES = [
    { id: 'personal', name: 'Personal License', description: 'Individual projects only.', multiplier: 1 },
    { id: 'commercial', name: 'Commercial License', description: 'Up to 10 team members.', multiplier: 2.5 },
    { id: 'enterprise', name: 'Enterprise License', description: 'Unlimited scaling & resale.', multiplier: 10 },
];

export const CATEGORIES = [
    { id: 'legal', name: 'Legal' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'finance', name: 'Finance' },
    { id: 'support', name: 'Support' },
    { id: 'marketing', name: 'Marketing' },
];

export const SORT_OPTIONS = [
    { label: 'Trending', value: 'trending' },
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low', value: 'price_low' },
    { label: 'Price: High', value: 'price_high' },
    { label: 'Highest Rated', value: 'rating' },
];