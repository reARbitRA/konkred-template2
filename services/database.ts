
import { Listing, Protocol } from '../types.ts';
import { FEATURED_LISTINGS_DEMO } from '../constants.ts';

class DatabaseService {
    // Simulated latency
    private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    async getListings(filters: {
        query?: string;
        type?: string;
        category?: string;
        minScore?: number;
        sortBy?: string;
    } = {}): Promise<Listing[]> {
        await this.delay(600);
        let results = [...FEATURED_LISTINGS_DEMO];

        if (filters.query) {
            const q = filters.query.toLowerCase();
            results = results.filter(l => 
                l.title.toLowerCase().includes(q) || 
                l.shortDescription.toLowerCase().includes(q) ||
                l.tags.some(t => t.toLowerCase().includes(q))
            );
        }

        if (filters.type && filters.type !== 'all') {
            results = results.filter(l => l.type === filters.type);
        }

        if (filters.category && filters.category !== 'all') {
            results = results.filter(l => l.category === filters.category);
        }

        if (filters.minScore) {
            results = results.filter(l => l.auditScore >= filters.minScore!);
        }

        if (filters.sortBy) {
            results.sort((a, b) => {
                if (filters.sortBy === 'price_low') return a.pricing.amount - b.pricing.amount;
                if (filters.sortBy === 'price_high') return b.pricing.amount - a.pricing.amount;
                if (filters.sortBy === 'rating') return b.rating - a.rating;
                return 0;
            });
        }

        return results;
    }

    async getRecentSearches(): Promise<string[]> {
        const stored = localStorage.getItem('konkred_recent_searches');
        return stored ? JSON.parse(stored) : [];
    }

    async saveSearch(query: string) {
        if (!query.trim()) return;
        const searches = await this.getRecentSearches();
        const updated = [query, ...searches.filter(s => s !== query)].slice(0, 5);
        localStorage.setItem('konkred_recent_searches', JSON.stringify(updated));
    }
}

export const databaseService = new DatabaseService();
