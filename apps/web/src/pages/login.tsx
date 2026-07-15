import { SignIn, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api-client";
import {
  clerkPostAuthUrl,
  clerkSignInUrl,
  isClerkFrontendEnabled,
  POST_AUTH_PATH,
  usesHostedAccountPortal,
} from "@/lib/clerk-root";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import logo from "@/assets/bidintelligence-logo.png";

type AuthConfig = {
  clerk: boolean;
  legacyLogin: boolean;
  smokeLogin?: boolean;
};

function SmokeLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <Label className="text-slate-300">Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 bg-[#0A0E1A] border-white/15 text-white"
          autoComplete="username"
          required
        />
      </div>
      <div>
        <Label className="text-slate-300">Password</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 bg-[#0A0E1A] border-white/15 text-white"
          autoComplete="current-password"
          required
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full bg-[#38BDF8] text-[#04121F] font-semibold">
        {loading ? "Signing in…" : "Team smoke sign in"}
      </Button>
    </form>
  );
}

const CLERK_READY_TIMEOUT_MS = 8_000;
const AUTH_CONFIG_TIMEOUT_MS = 5_000;

function ClerkLogin({ smokeLogin }: { smokeLogin: boolean }) {
  const [, navigate] = useLocation();
  const { isLoaded, isSignedIn } = useClerkAuth();
  const { isAuthenticated } = useAuth();
  // Smoke path: show email/password first — never gate on Clerk bootstrap.
  const [showClerk, setShowClerk] = useState(!smokeLogin);
  const [clerkTimedOut, setClerkTimedOut] = useState(false);

  useEffect(() => {
    if (isLoaded || !showClerk) return;
    const t = window.setTimeout(() => setClerkTimedOut(true), CLERK_READY_TIMEOUT_MS);
    return () => window.clearTimeout(t);
  }, [isLoaded, showClerk]);

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn || isAuthenticated) {
      navigate(POST_AUTH_PATH);
      return;
    }
    // Smoke overlay: keep email/password on this page; skip hosted portal redirect.
    if (smokeLogin) return;
    if (!usesHostedAccountPortal()) return;
    const returnUrl = encodeURIComponent(clerkPostAuthUrl());
    window.location.replace(`${clerkSignInUrl()}?redirect_url=${returnUrl}`);
  }, [isLoaded, isSignedIn, isAuthenticated, navigate, smokeLogin]);

  // Prefer team smoke form whenever enabled — do not wait for Clerk isLoaded.
  if (smokeLogin && !showClerk) {
    if (isSignedIn || isAuthenticated) {
      return (
        <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center p-6 text-slate-300">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Opening Bid Intelligence…
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B1220] p-8 shadow-xl">
          <img src={logo} alt="BidIntelligenceOS" className="h-8 w-auto mb-6" />
          <h1 className="text-2xl font-bold text-white">Team smoke login</h1>
          <p className="mt-2 text-sm text-slate-400">
            Allowlisted QA sign-in (no Clerk redirect). Use your team smoke password from the server env.
          </p>
          <SmokeLoginForm onSuccess={() => navigate(POST_AUTH_PATH)} />
          <button
            type="button"
            onClick={() => {
              setClerkTimedOut(false);
              setShowClerk(true);
            }}
            className="mt-6 w-full text-center text-sm text-[#7dd3fc] hover:underline"
          >
            Use Clerk / CCA production sign in
          </button>
        </div>
      </div>
    );
  }

  // Clerk stuck: fail-open back to smoke (or show error) instead of spinning forever.
  if (!isLoaded && clerkTimedOut) {
    if (smokeLogin) {
      return (
        <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center p-6">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B1220] p-8 shadow-xl">
            <img src={logo} alt="BidIntelligenceOS" className="h-8 w-auto mb-6" />
            <h1 className="text-2xl font-bold text-white">Team smoke login</h1>
            <p className="mt-2 text-sm text-amber-300/90">
              Clerk sign-in did not become ready. Use team smoke login below, or retry Clerk later.
            </p>
            <SmokeLoginForm onSuccess={() => navigate(POST_AUTH_PATH)} />
            <button
              type="button"
              onClick={() => {
                setClerkTimedOut(false);
                setShowClerk(true);
              }}
              className="mt-6 w-full text-center text-sm text-[#7dd3fc] hover:underline"
            >
              Retry Clerk / CCA production sign in
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B1220] p-8 shadow-xl text-center">
          <img src={logo} alt="BidIntelligenceOS" className="h-8 w-auto mb-6 mx-auto" />
          <p className="text-amber-300">Sign-in is taking longer than expected.</p>
          <p className="mt-2 text-sm text-slate-400">Check your network or refresh the page to try again.</p>
          <Button
            type="button"
            className="mt-6 w-full bg-[#38BDF8] text-[#04121F] font-semibold"
            onClick={() => {
              setClerkTimedOut(false);
              window.location.reload();
            }}
          >
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  if (!isLoaded || isSignedIn || isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center p-6 text-slate-300">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        {isSignedIn || isAuthenticated ? "Opening Bid Intelligence…" : "Loading…"}
      </div>
    );
  }

  if (!smokeLogin && usesHostedAccountPortal()) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center p-6 text-slate-300">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Redirecting to CCA sign in…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <img src={logo} alt="BidIntelligenceOS" className="h-8 w-auto mb-6 mx-auto" />
        {smokeLogin && (
          <button
            type="button"
            onClick={() => setShowClerk(false)}
            className="mb-4 w-full text-center text-sm text-[#7dd3fc] hover:underline"
          >
            ← Back to team smoke login
          </button>
        )}
        <SignIn
          routing="path"
          path="/login"
          signUpUrl="/register"
          forceRedirectUrl={POST_AUTH_PATH}
          fallbackRedirectUrl={POST_AUTH_PATH}
        />
      </div>
    </div>
  );
}

function LegacyLogin() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(POST_AUTH_PATH);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B1220] p-8 shadow-xl">
        <img src={logo} alt="BidIntelligenceOS" className="h-8 w-auto mb-6" />
        <h1 className="text-2xl font-bold text-white">Sign in</h1>
        <p className="mt-2 text-sm text-slate-400">Access your organization&apos;s live bid pipeline.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <Label className="text-slate-300">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 bg-[#0A0E1A] border-white/15 text-white"
              required
            />
          </div>
          <div>
            <Label className="text-slate-300">Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 bg-[#0A0E1A] border-white/15 text-white"
              required
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full bg-[#38BDF8] text-[#04121F] font-semibold">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          No account?{" "}
          <Link href="/register" className="text-[#7dd3fc] hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function Login() {
  const [config, setConfig] = useState<AuthConfig | null>(null);

  useEffect(() => {
    let cancelled = false;
    const failOpen = (): AuthConfig => ({
      clerk: isClerkFrontendEnabled(),
      legacyLogin: !isClerkFrontendEnabled(),
      // Fail-open to smoke when Clerk frontend is baked in — never block /login forever.
      smokeLogin: isClerkFrontendEnabled(),
    });

    void (async () => {
      try {
        const data = await Promise.race([
          apiFetch<AuthConfig>("/api/v1/auth/config"),
          new Promise<never>((_, reject) =>
            window.setTimeout(() => reject(new Error("auth config timeout")), AUTH_CONFIG_TIMEOUT_MS),
          ),
        ]);
        if (!cancelled) setConfig(data);
      } catch {
        if (!cancelled) setConfig(failOpen());
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!config) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center p-6 text-slate-300">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading…
      </div>
    );
  }

  if (isClerkFrontendEnabled()) {
    return <ClerkLogin smokeLogin={Boolean(config.smokeLogin)} />;
  }

  return <LegacyLogin />;
}
