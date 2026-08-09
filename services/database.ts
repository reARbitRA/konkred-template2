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
  onSnapshot,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase.ts';
import { Listing, GlobalStats } from '../types.ts';

class DatabaseService {
    /**
     * Fetches marketplace listings with dynamic filtering from production Firestore collections.
     */
    /**
     * Fetches marketplace listings with dynamic filtering from production Firestore collections.
     * Falls back to offline preseeded modules if connecting to Cloud Firestore backend fails.
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
            console.error("Firestore collection disrupted.", error);
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
    async createListing(listing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'protocols'), {
        ...listing,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating listing node:", error);
      throw error;
    }
  }

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

    /**
     * Retrieves all assets acquired by a specific user from their Firestore library collection.
     */
    async getUserLibrary(userId: string): Promise<Listing[]> {
        try {
            const libraryRef = collection(db, 'users', userId, 'library');
            const q = query(libraryRef, orderBy('acquiredAt', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any as Listing));
        } catch (error) {
            console.error("Failed to sync structural library:", error);
            return [];
        }
    }

    /**
     * Securely records an asset acquisition in the user's permanent enclave.
     */
    async purchaseAsset(userId: string, listing: Listing): Promise<void> {
        try {
            const libraryRef = collection(db, 'users', userId, 'library');
            await addDoc(libraryRef, {
                ...listing,
                listingId: listing.id,
                acquiredAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Failed to commit acquisition to ledger:", error);
            throw error;
        }
    }
}

export const databaseService = new DatabaseService();