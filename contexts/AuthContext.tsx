
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '../types';
import { authService } from '../services/auth';
import { useToast } from './ToastContext';

interface AuthContextValue extends AuthState {
  login: (email: string, key: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const sessionUser = await authService.getCurrentSession();
        if (sessionUser) setUser(sessionUser);
      } catch (error) {
        console.error('Session check failed', error);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(async (email: string, key: string) => {
    setIsLoading(true);
    try {
      const result = await authService.login(email, key);
      if (result.success && result.user) {
        setUser(result.user);
        showToast(`Welcome back, ${result.user.name}`, 'success');
      } else {
        throw new Error(result.error || 'Authentication failed');
      }
    } catch (error: any) {
      showToast(error.message, 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    showToast('Session Terminated', 'info');
  }, [showToast]);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
