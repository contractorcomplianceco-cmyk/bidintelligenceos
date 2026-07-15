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
      clearDemoSession();
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
  /** Legacy smoke session cookie while Clerk is also enabled. */
  const [legacySession, setLegacySession] = useState(false);

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
    // Clerk still bootstrapping: do not block legacy/smoke session cookie checks forever.
    if (!isLoaded) {
      try {
        const data = await apiFetch<{ user: AuthUser; org: AuthOrg }>("/api/v1/auth/me");
        setUser(data.user);
        setOrg(data.org);
        setLegacySession(true);
        clearDemoSession();
      } catch {
        // Keep loading=true until Clerk loads or a later refresh succeeds while signed out.
      }
      return;
    }

    if (isSignedIn) {
      try {
        const data = await apiFetch<{ user: AuthUser; org: AuthOrg }>("/api/v1/auth/me");
        setUser(data.user);
        setOrg(data.org);
        setLegacySession(false);
        clearDemoSession();
      } catch {
        setUser(null);
        setOrg(null);
        setLegacySession(false);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Dual mode: accept bios_token from smoke login when Clerk signed-out.
    try {
      const data = await apiFetch<{ user: AuthUser; org: AuthOrg }>("/api/v1/auth/me");
      setUser(data.user);
      setOrg(data.org);
      setLegacySession(true);
      clearDemoSession();
    } catch {
      setUser(null);
      setOrg(null);
      setLegacySession(false);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    void refresh();
  }, [refresh, clerkUser?.id]);

  // Fail-open: if Clerk never reaches isLoaded, stop blocking the app shell / smoke path.
  useEffect(() => {
    if (isLoaded) return;
    const t = window.setTimeout(() => setLoading(false), 8_000);
    return () => window.clearTimeout(t);
  }, [isLoaded]);

  const login = useCallback(
    async (email: string, password: string) => {
      await apiFetch("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      clearDemoSession();
      // Smoke login must apply session even if Clerk never reaches isLoaded.
      try {
        const data = await apiFetch<{ user: AuthUser; org: AuthOrg }>("/api/v1/auth/me");
        setUser(data.user);
        setOrg(data.org);
        setLegacySession(true);
        setLoading(false);
      } catch {
        await refresh();
      }
    },
    [refresh],
  );

  const register = useCallback(async () => {
    throw new Error("Use Clerk Sign up at /login");
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch("/api/v1/auth/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
    if (isSignedIn) {
      await signOut();
    }
    setUser(null);
    setOrg(null);
    setLegacySession(false);
    clearDemoSession();
  }, [isSignedIn, signOut]);

  const value = useMemo(
    () => ({
      user,
      org,
      // Smoke/legacy cookie auth must not stay "loading" forever if Clerk never loads.
      loading: legacySession ? loading : !isLoaded || loading,
      isAuthenticated: Boolean(user && (isSignedIn || legacySession)),
      clerkEnabled: true,
      refresh,
      login,
      register,
      logout,
    }),
    [user, org, isLoaded, loading, isSignedIn, legacySession, refresh, login, register, logout],
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
