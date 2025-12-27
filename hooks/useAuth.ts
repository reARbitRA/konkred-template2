
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { User, AuthState } from '../types';
import { useLocalStorage } from './useLocalStorage';

interface AuthContextValue extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string) => Promise<void>;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
}

// Create context
const AuthContext = createContext<AuthContextValue | null>(null);

// Auth Provider component (to be used in App)
export function useAuthProvider(): AuthContextValue {
    const [user, setUser] = useLocalStorage<User | null>('konkred-user', null);
    const [isLoading, setIsLoading] = useState(true);

    // Check auth on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        setIsLoading(true);
        try {
            // TODO: Implement actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock user
            const mockUser: User = {
                id: '1',
                email,
                name: email.split('@')[0],
                role: 'seller',
                verified: true,
                balance: { fiat: 0, crypto: 0 },
                stats: {
                    totalPurchases: 0,
                    totalSales: 0,
                    totalEarnings: 0,
                    rating: 0,
                    reviewCount: 0,
                },
                payoutThreshold: 100,
                kycStatus: 'verified'
            };
            
            setUser(mockUser);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [setUser]);

    const signup = useCallback(async (email: string, password: string, name: string) => {
        setIsLoading(true);
        try {
            // TODO: Implement actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const newUser: User = {
                id: Date.now().toString(),
                email,
                name,
                role: 'buyer',
                verified: false,
                balance: { fiat: 0, crypto: 0 },
                stats: {
                    totalPurchases: 0,
                    totalSales: 0,
                    totalEarnings: 0,
                    rating: 0,
                    reviewCount: 0,
                },
                payoutThreshold: 100,
                kycStatus: 'unverified'
            };
            
            setUser(newUser);
        } catch (error) {
            console.error('Signup failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [setUser]);

    const logout = useCallback(() => {
        setUser(null);
    }, [setUser]);

    const updateUser = useCallback((updates: Partial<User>) => {
        setUser(prev => prev ? { ...prev, ...updates } : null);
    }, [setUser]);

    return {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateUser,
    };
}

// Hook to use auth context
export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export { AuthContext };
export default useAuth;
