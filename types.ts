
// Unified types for the KONKRED platform

export type PageView = 
    | 'landing'
    | 'marketplace'
    | 'listing_detail'
    | 'wizard'
    | 'forge_audit'
    | 'wallet'
    | 'usage'
    | 'seller_dashboard'
    | 'affiliate_center'
    | 'dispute_center'
    | 'admin_moderation'
    | 'checkout'
    | 'payment_success'
    | 'vertical_landing'
    | 'style_guide'
    | 'pricing'
    | 'academy'    // Courses
    | 'intel'      // Blog
    | 'network'    // Forum
    | 'advisory';  // Consulting

export type AssetType = 'prompt' | 'agent' | 'workflow' | 'dataset' | 'api' | 'prompt_system';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'seller' | 'pro_seller';
  verified: boolean;
  balance: { fiat: number; crypto: number };
  stats: {
    totalPurchases: number;
    totalSales: number;
    totalEarnings: number;
    rating: number;
    reviewCount: number;
  };
  payoutThreshold: number;
  kycStatus: 'unverified' | 'verified' | 'pending';
}

export interface Listing {
  id: string;
  sellerId: string;
  seller: {
    name: string;
    verified: boolean;
    badge?: 'top_seller' | 'editor_choice';
    totalSales: number;
  };
  title: string;
  shortDescription: string;
  description?: string;
  type: string;
  category: string;
  pricing: {
    mode: 'one_time' | 'subscription' | 'usage';
    amount: number;
    currency: string;
    interval?: 'month' | 'year';
    unit?: string;
  };
  delivery: 'download' | 'api_key' | 'hosted_demo' | 'repo_access' | 'booking';
  auditScore: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  trending?: boolean;
  tags: string[];
  createdAt: Date;
}

export interface Protocol {
  id: string;
  category: string;
  level: string;
  title: string;
  description: string;
  price: string;
  isVerified: boolean;
  tags: string[];
}

export interface Tool {
  id: string;
  name: string;
  status: string;
  description: string;
  type: string;
  access: string;
}

export interface AppData {
  hero: {
    status: string;
    headline: string;
    subheadline: string;
  };
  protocols: Protocol[];
  tools: Tool[];
  footer: {
    systemStatus: string;
    version: string;
  };
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export type ModalType = 'login' | 'signup' | 'waitlist' | 'enter' | 'demo';

export interface Toast {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export type LicenseType = 'personal' | 'commercial' | 'enterprise';
