
// Unified types for the KONKRED platform

export type PageView = 
    | 'landing' | 'marketplace' | 'listing_detail' | 'wizard' | 'forge_audit' 
    | 'wallet' | 'usage' | 'seller_dashboard' | 'academy' | 'intel' 
    | 'network' | 'advisory' | 'documentation' | 'career' | 'resources' 
    | 'pricing' | 'enter' | 'join_network' | 'account' | 'checkout'
    | 'usage_metrics' | 'affiliate' | 'admin' | 'dispute' | 'style_guide'
    | 'verify_email';

export type AssetType = 'prompt' | 'agent' | 'workflow' | 'dataset' | 'api' | 'prompt_system';

export type LicenseType = 'personal' | 'commercial' | 'enterprise';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

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
  acquisitionCount: number;
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

export type ModalType = 
  | 'ProtocolDetails' 
  | 'AuditReport' 
  | 'AddCredits' 
  | 'Withdrawal' 
  | 'DemoView' 
  | 'UpgradePrompt'
  | 'ConfirmPurchase'
  | 'NewFolder'
  | 'AddFile'
  | 'NewNote'
  | 'AddMember';

export interface ModalState {
  type: ModalType | null;
  props: any;
}

// New types for Firestore
export interface FirestoreDocument {
  id: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export interface Folder extends FirestoreDocument {
  name: string;
}

export interface FileItem extends FirestoreDocument {
  name: string;
  folderId?: string;
  size: number; // in KB
}

export interface Note extends FirestoreDocument {
  title: string;
  content: string;
}

export interface TeamMember extends FirestoreDocument {
  name: string;
  role: string;
}