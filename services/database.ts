import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  doc, 
  getDoc,
  updateDoc,
  increment,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase.ts';
import { Listing, GlobalStats } from '../types.ts';

class DatabaseService {
    /**
     * Fetches marketplace listings with dynamic filtering from production Firestore collections.
     */
    async getListings(filters: {
        query?: string;
        type?: string;
        category?: string;
        minScore?: number;
        sortBy?: string;
        limit?: number;
    } = {}): Promise<Listing[]> {
        try {
            const protocolsRef = collection(db, 'protocols');
            let q = query(protocolsRef);

            // Filtering
            if (filters.type && filters.type !== 'all') {
                q = query(q, where('type', '==', filters.type));
            }

            if (filters.category && filters.category !== 'all') {
                q = query(q, where('category', '==', filters.category));
            }

            if (filters.minScore && filters.minScore > 0) {
                q = query(q, where('auditScore', '>=', filters.minScore));
            }

            // Sorting
            // Note: Composite indexes are required for complex sorting combined with filtering.
            switch (filters.sortBy) {
                case 'price_low':
                    q = query(q, orderBy('pricing.amount', 'asc'));
                    break;
                case 'price_high':
                    q = query(q, orderBy('pricing.amount', 'desc'));
                    break;
                case 'rating':
                    q = query(q, orderBy('rating', 'desc'));
                    break;
                case 'newest':
                    q = query(q, orderBy('createdAt', 'desc'));
                    break;
                case 'featured':
                    // Prioritize featured items then sort by age
                    q = query(q, orderBy('featured', 'desc'), orderBy('createdAt', 'desc'));
                    break;
                default:
                    q = query(q, orderBy('createdAt', 'desc'));
            }

            if (filters.limit) {
                q = query(q, limit(filters.limit));
            }

            const snapshot = await getDocs(q);
            let results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing));

            // Client-side search (Fuzzy fallback)
            if (filters.query) {
                const searchTerm = filters.query.toLowerCase();
                results = results.filter(l => 
                    l.title.toLowerCase().includes(searchTerm) || 
                    l.shortDescription.toLowerCase().includes(searchTerm) ||
                    (l.tags && l.tags.some(t => t.toLowerCase().includes(searchTerm)))
                );
            }

            return results;
        } catch (error: any) {
            // Detailed logging to distinguish between Permission Denied and Missing Index
            if (error.code === 'permission-denied') {
                console.error("CRITICAL: Firestore Permission Denied. Check security rules for 'protocols' collection.", error);
            } else if (error.message?.includes('index')) {
                console.warn("INDEX_REQUIRED: This query requires a composite index. Check the link in the browser console to create it.", error);
            } else {
                console.error("Failed to fetch listings:", error);
            }
            return [];
        }
    }

    /**
     * Subscribes to real-time global platform statistics.
     */
    subscribeToGlobalStats(callback: (stats: GlobalStats) => void, onError?: (error: any) => void) {
        const defaultStats: GlobalStats = {
            totalUsers: 0,
            totalProtocols: 0,
            totalAgents: 0,
            totalAudits: 0,
            totalVolume: 0,
            activeNodes: 0
        };

        return onSnapshot(
            doc(db, 'statistics', 'global'), 
            (docSnap) => {
                if (docSnap.exists()) {
                    callback(docSnap.data() as GlobalStats);
                } else {
                    console.warn("Global stats document 'statistics/global' not found. Using defaults.");
                    callback(defaultStats);
                }
            },
            (error) => {
                console.warn("Global stats telemetry disrupted:", error);
                if (onError) onError(error);
            }
        );
    }

    /**
     * Increments view count for an asset using atomic increment.
     */
    async recordView(listingId: string) {
        try {
            const docRef = doc(db, 'protocols', listingId);
            await updateDoc(docRef, { viewCount: increment(1) });
        } catch (error) {
            console.warn(`Could not update view telemetry for ${listingId}:`, error);
        }
    }

    async getRecentSearches(): Promise<string[]> {
        try {
            const stored = localStorage.getItem('konkred_recent_searches');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    }

    async saveSearch(query: string) {
        if (!query.trim()) return;
        const searches = await this.getRecentSearches();
        const updated = [query, ...searches.filter(s => s !== query)].slice(0, 5);
        localStorage.setItem('konkred_recent_searches', JSON.stringify(updated));
    }
}

export const databaseService = new DatabaseService();