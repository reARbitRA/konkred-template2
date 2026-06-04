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
  type User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from './ToastContext.tsx';
import { MOCK_USER } from '../constants.ts';

interface AuthContextValue extends AuthState {
  login: (email: string, key: string) => Promise<void>;
  signup: (email: string, key: string, name: string) => Promise<string | null>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const mapFirebaseUserToAppUser = (firebaseUser: FirebaseUser): User => {
  return {
    ...MOCK_USER,
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.emailVerified) {
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
      const appUser = mapFirebaseUserToAppUser(userCredential.user);
      showToast(`Welcome back, ${appUser.name}`, 'success');
    } catch (error: any) {
      if (error.code === 'auth/email-not-verified') throw error;
      if (error.code === 'auth/unauthorized-domain') {
        throw new Error(`Domain ${window.location.hostname} not whitelisted in Firebase Console.`);
      }
      throw new Error(error.message || 'Authentication failed.');
    }
  }, [showToast]);

  const signup = useCallback(async (email: string, key: string, name: string): Promise<string | null> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, key);
      await updateProfile(userCredential.user, { displayName: name });
      
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userDocRef, {
          displayName: name,
          email: email,
          plan: 'free',
          createdAt: serverTimestamp(),
      });

      await sendEmailVerification(userCredential.user);
      await signOut(auth);
      return userCredential.user.email;
    } catch (error: any) {
      if (error.code === 'auth/unauthorized-domain') {
        throw new Error('Registration node error: Domain not whitelisted.');
      }
      throw new Error(error.message || 'Signup sequence failed.');
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
            displayName: user.displayName || user.email?.split('@')[0] || 'Architect',
            email: user.email,
            plan: 'free',
            createdAt: serverTimestamp(),
        });
      }
      showToast(`Uplink established: ${user.displayName}`, 'success');
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      let msg = 'Neural handshake failed.';
      if (error.code === 'auth/unauthorized-domain') {
        msg = `SYSTEM_ERROR: Domain ${window.location.hostname} is not whitelisted for Google Auth.`;
        showToast(msg, 'error', 10000);
      } else if (error.code === 'auth/popup-closed-by-user') {
        msg = 'Handshake cancelled by architect.';
        showToast(msg, 'info');
      } else {
        showToast(msg, 'error');
      }
      throw new Error(msg);
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