import { useState, useEffect } from 'react';
import { GlobalStats } from '../types.ts';
import { databaseService } from '../services/database.ts';

/**
 * Hook to consume real-time platform statistics from Firestore.
 */
export const useGlobalStats = () => {
    const [stats, setStats] = useState<GlobalStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = databaseService.subscribeToGlobalStats(
            (data) => {
                setStats(data);
                setLoading(false);
            },
            (err) => {
                setError(err);
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, []);

    return { stats, loading, error };
};