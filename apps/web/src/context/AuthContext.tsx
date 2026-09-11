import React, { createContext, useContext } from 'react';
import { useAppStore } from '../store';
import type { User, UserRole } from '../types';

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  setUser: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token, setUser, logout } = useAppStore();

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    role: (user?.role as UserRole) ?? null,
    setUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
