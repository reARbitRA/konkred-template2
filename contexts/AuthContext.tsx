
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '../types';
import { auth, db } from '../services/firebase.ts';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  updateProfile,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from './ToastContext.tsx';
import { MOCK_USER } from '../constants.ts'; // For structure reference

interface AuthContextValue extends AuthState {
  login: (email: string, key: string) => Promise<void>;
  signup: (email: string, key: string, name: string) => Promise<string | null>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Helper to map Firebase user to our app's User type
const mapFirebaseUserToAppUser = (firebaseUser: FirebaseUser): User => {
  return {
    ...MOCK_USER, // Use mock as a template for structure
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Architect',
    verified: firebaseUser.emailVerified,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) { // Google sign-in users are auto-verified
        setUser(mapFirebaseUserToAppUser(firebaseUser));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, key: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, key);
      if (!userCredential.user.emailVerified) {
        await sendEmailVerification(userCredential.user);
        await signOut(auth);
        throw { code: 'auth/email-not-verified', email: userCredential.user.email };
      }
      // On successful login with verified email, onAuthStateChanged will handle setting the user.
      const appUser = mapFirebaseUserToAppUser(userCredential.user);
      showToast(`Welcome back, ${appUser.name}`, 'success');
    } catch (error: any) {
      if (error.code === 'auth/email-not-verified') {
        throw error;
      }
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          throw new Error('Email or password is incorrect');
        default:
          throw new Error('An unknown error occurred during login.');
      }
    }
  }, [showToast]);

  const signup = useCallback(async (email: string, key: string, name: string): Promise<string | null> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, key);
      await updateProfile(userCredential.user, { displayName: name });
      
      // Create user document in Firestore
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userDocRef, {
          displayName: name,
          email: email,
          plan: 'free',
          createdAt: serverTimestamp(),
      });

      await sendEmailVerification(userCredential.user);
      
      // We sign out immediately to prevent auto-login, enforcing verification.
      await signOut(auth);

      showToast('Verification email sent.', 'info');
      return userCredential.user.email;
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('User already exists. Please sign in');
      } else {
        throw new Error('An unknown error occurred during sign up.');
      }
    }
  }, [showToast]);

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // This is a new user.
        await setDoc(userDocRef, {
            displayName: user.displayName || user.email?.split('@')[0] || 'Architect',
            email: user.email,
            plan: 'free',
            createdAt: serverTimestamp(),
        });
        showToast(`Welcome, ${user.displayName || 'Architect'}`, 'success');
      } else {
        showToast(`Welcome back, ${user.displayName || 'Architect'}`, 'success');
      }
      // onAuthStateChanged in useEffect will handle setting the user state.
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      let errorMessage = 'An unknown error occurred during Google sign-in.';
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in cancelled.';
        showToast(errorMessage, 'info');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with this email. Please sign in using the original method.';
        showToast(errorMessage, 'warning');
      } else {
        showToast(errorMessage, 'error');
      }
      throw new Error(errorMessage);
    }
  }, [showToast]);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    showToast('Session Terminated', 'info');
  }, [showToast]);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => (prev ? { ...prev, ...updates } : null));
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout, updateUser, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
