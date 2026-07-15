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

function ClerkLogin({ smokeLogin }: { smokeLogin: boolean }) {
  const [, navigate] = useLocation();
  const { isLoaded, isSignedIn } = useClerkAuth();
  const { isAuthenticated } = useAuth();
  const [showClerk, setShowClerk] = useState(!smokeLogin);

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

  if (!isLoaded || isSignedIn || isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center p-6 text-slate-300">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        {isSignedIn || isAuthenticated ? "Opening Bid Intelligence…" : "Loading…"}
      </div>
    );
  }

  if (smokeLogin && !showClerk) {
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
            onClick={() => setShowClerk(true)}
            className="mt-6 w-full text-center text-sm text-[#7dd3fc] hover:underline"
          >
            Use Clerk / CCA production sign in
          </button>
        </div>
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
    void (async () => {
      try {
        const data = await apiFetch<AuthConfig>("/api/v1/auth/config");
        if (!cancelled) setConfig(data);
      } catch {
        if (!cancelled) {
          setConfig({
            clerk: isClerkFrontendEnabled(),
            legacyLogin: !isClerkFrontendEnabled(),
            smokeLogin: false,
          });
        }
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
