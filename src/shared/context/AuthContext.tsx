import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

interface User {
  id: string;
  email: string;
  name: string | null;
  role: "TENANT" | "LANDLORD" | "ADMIN" | "UNIVERSITY_ADMIN";
  image?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: "TENANT" | "LANDLORD" | "ADMIN" | "UNIVERSITY_ADMIN";
}

const AuthContext = createContext<AuthContextType | null>(null);

const SIGNED_OUT: AuthContextType = {
  user: null,
  session: null,
  loading: false,
  login: async () => { throw new Error("No AuthProvider mounted"); },
  register: async () => { throw new Error("No AuthProvider mounted"); },
  logout: async () => { throw new Error("No AuthProvider mounted"); },
  refreshSession: async () => { throw new Error("No AuthProvider mounted"); },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = async () => {
    try {
      const { data } = await authClient.getSession();
      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role as User["role"],
          image: data.user.image,
          emailVerified: data.user.emailVerified,
          createdAt: new Date(data.user.createdAt),
          updatedAt: new Date(data.user.updatedAt),
        });
        setSession({
          id: data.session.id,
          userId: data.session.userId,
          token: data.session.token,
          expiresAt: new Date(data.session.expiresAt),
        });
      } else {
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      console.error("Session refresh failed:", error);
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();

    // Listen for auth changes
    const unsubscribe = authClient.useSession(refreshSession);
    return () => unsubscribe?.();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await authClient.signIn.email({ email, password });
    if (error) throw new Error(error.message);
    await refreshSession();
  };

  const register = async (data: RegisterData) => {
    const { error } = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role || "TENANT",
    });
    if (error) throw new Error(error.message);
    await refreshSession();
  };

  const logout = async () => {
    const { error } = await authClient.signOut();
    if (error) throw new Error(error.message);
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, register, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) return SIGNED_OUT;
  return context;
};