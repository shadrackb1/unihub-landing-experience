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
  image?: string | undefined;
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
  login: async () => {
    throw new Error("No AuthProvider mounted");
  },
  register: async () => {
    throw new Error("No AuthProvider mounted");
  },
  logout: async () => {
    throw new Error("No AuthProvider mounted");
  },
  refreshSession: async () => {
    throw new Error("No AuthProvider mounted");
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = async () => {
    try {
      const { data } = await authClient.getSession();
      if (data?.user) {
        // Better Auth user doesn't include custom role field by default
        // We need to fetch it from the server or use the session data
        const userData = data.user as {
          id: string;
          email: string;
          name: string | null;
          image?: string | null;
          emailVerified: boolean;
          createdAt: string | Date;
          updatedAt: string | Date;
          role?: "TENANT" | "LANDLORD" | "ADMIN" | "UNIVERSITY_ADMIN";
        };
        setUser({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role ?? "TENANT",
          image: userData.image ?? undefined,
          emailVerified: userData.emailVerified,
          createdAt: new Date(userData.createdAt),
          updatedAt: new Date(userData.updatedAt),
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

  // Read the session once on mount. Hooks cannot be called from an effect
  // callback (it runs outside render), so the session is resolved through the
  // plain client call; every sign-in/sign-out path refreshes it explicitly.
  useEffect(() => {
    void refreshSession();
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
      // Note: role is a custom field, may need to be handled via metadata or plugin
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
    <AuthContext.Provider
      value={{ user, session, loading, login, register, logout, refreshSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) return SIGNED_OUT;
  return context;
};
