
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { User, AuthState, AuthResult } from '../types';
import { auth, db } from '../services/firebase.ts';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  type User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextValue extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string, acceptedCopyrightTerms: boolean) => Promise<void>;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// FIX: Correctly mapping Firebase user object to application-specific User interface
const mapFirebaseToAppUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
  const userData = userDoc.data();

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: userData?.displayName || firebaseUser.displayName || 'Architect',
    role: userData?.role || 'buyer',
    verified: firebaseUser.emailVerified,
    tier: userData?.tier || 'free',
    balance: userData?.balance || { fiat: 0, crypto: 0 },
    stats: userData?.stats || {
      totalPurchases: 0,
      totalSales: 0,
      totalEarnings: 0,
      rating: 0,
      reviewCount: 0,
    },
    payoutThreshold: userData?.payoutThreshold || 100,
    kycStatus: userData?.kycStatus || 'unverified',
    acceptedCopyrightTerms: userData?.acceptedCopyrightTerms || false,
    canGenerateBlogs: userData?.canGenerateBlogs || false,
    createdAt: userData?.createdAt || new Date(),
  };
};

export const useAuthProvider = (): AuthContextValue => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // FIX: Ensuring onAuthStateChanged is called correctly from the modular auth package
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const appUser = await mapFirebaseToAppUser(firebaseUser);
                setUser(appUser);
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = useCallback(async (email: string, pass: string) => {
        // FIX: Using modular signInWithEmailAndPassword function
        await signInWithEmailAndPassword(auth, email, pass);
    }, []);

    const signup = useCallback(async (email: string, pass: string, name: string, acceptedCopyrightTerms: boolean) => {
        // FIX: Using modular createUserWithEmailAndPassword function
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        const userRef = doc(db, 'users', res.user.uid);
        await setDoc(userRef, {
            displayName: name,
            email: email,
            role: 'buyer',
            tier: 'free',
            createdAt: serverTimestamp(),
            balance: { fiat: 0, crypto: 0 },
            acceptedCopyrightTerms,
            canGenerateBlogs: false,
            stats: { totalPurchases: 0, totalSales: 0, totalEarnings: 0, rating: 0, reviewCount: 0 }
        });
    }, []);

    const logout = useCallback(async () => {
        // FIX: Using modular signOut function
        await signOut(auth);
    }, []);

    const updateUser = useCallback((updates: Partial<User>) => {
        setUser(prev => prev ? { ...prev, ...updates } : null);
    }, []);

    return {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateUser,
    };
};

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}

export { AuthContext };
export default useAuth;
