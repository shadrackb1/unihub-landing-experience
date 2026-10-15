import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/shared/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Render-safe signed-out default for contexts without a mounted AuthProvider
// (public marketing routes keep Firebase lazy and render logged-out chrome).
// Actions still fail loudly so missing providers are caught at call time.
const SIGNED_OUT: AuthContextType = {
  user: null,
  loading: false,
  logout: async () => {
    throw new Error('useAuth: no AuthProvider mounted');
  },
  login: async () => {
    throw new Error('useAuth: no AuthProvider mounted');
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e: any) {
      console.error('Logout error:', e);
      throw e;
    }
  };

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return SIGNED_OUT;
  }
  return context;
};