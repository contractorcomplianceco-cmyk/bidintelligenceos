import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";
import { apiFetch } from "./api-client";
import { setApiAuthTokenGetter, clearApiAuthTokenGetter } from "./api-auth";
import { clearDemoSession } from "./data-mode";
import { isClerkFrontendEnabled } from "./clerk-root";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export type AuthOrg = {
  id: string;
  name: string;
  vertical: string;
  profile: Record<string, unknown>;
};

type AuthState = {
  user: AuthUser | null;
  org: AuthOrg | null;
  loading: boolean;
  isAuthenticated: boolean;
  clerkEnabled: boolean;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (input: { email: string; password: string; name: string; orgName?: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

function LegacyAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [org, setOrg] = useState<AuthOrg | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await apiFetch<{ user: AuthUser; org: AuthOrg }>("/api/v1/auth/me");
      setUser(data.user);
      setOrg(data.org);
    } catch {
      setUser(null);
      setOrg(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(
    async (email: string, password: string) => {
      await apiFetch("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      clearDemoSession();
      await refresh();
    },
    [refresh],
  );

  const register = useCallback(
    async (input: { email: string; password: string; name: string; orgName?: string }) => {
      await apiFetch("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify(input),
      });
      clearDemoSession();
      await refresh();
    },
    [refresh],
  );

  const logout = useCallback(async () => {
    await apiFetch("/api/v1/auth/logout", { method: "POST" });
    setUser(null);
    setOrg(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      org,
      loading,
      isAuthenticated: !!user,
      clerkEnabled: false,
      refresh,
      login,
      register,
      logout,
    }),
    [user, org, loading, refresh, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function ClerkAuthProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, getToken, signOut } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [org, setOrg] = useState<AuthOrg | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setApiAuthTokenGetter(async () => {
      try {
        return await getToken();
      } catch {
        return null;
      }
    });
    return () => clearApiAuthTokenGetter();
  }, [getToken]);

  const refresh = useCallback(async () => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setUser(null);
      setOrg(null);
      setLoading(false);
      return;
    }
    try {
      const data = await apiFetch<{ user: AuthUser; org: AuthOrg }>("/api/v1/auth/me");
      setUser(data.user);
      setOrg(data.org);
    } catch {
      setUser(null);
      setOrg(null);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    void refresh();
  }, [refresh, clerkUser?.id]);

  const login = useCallback(async () => {
    throw new Error("Use Clerk Sign in at /login");
  }, []);

  const register = useCallback(async () => {
    throw new Error("Use Clerk Sign up at /register");
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
    setOrg(null);
    clearDemoSession();
  }, [signOut]);

  const value = useMemo(
    () => ({
      user,
      org,
      loading: !isLoaded || loading,
      isAuthenticated: Boolean(user && isSignedIn),
      clerkEnabled: true,
      refresh,
      login,
      register,
      logout,
    }),
    [user, org, isLoaded, loading, isSignedIn, refresh, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  if (isClerkFrontendEnabled()) {
    return <ClerkAuthProvider>{children}</ClerkAuthProvider>;
  }
  return <LegacyAuthProvider>{children}</LegacyAuthProvider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
