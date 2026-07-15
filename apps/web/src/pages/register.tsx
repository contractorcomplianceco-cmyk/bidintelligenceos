import { SignUp, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import {
  clerkPostAuthUrl,
  clerkSignUpUrl,
  isClerkFrontendEnabled,
  POST_AUTH_PATH,
  usesHostedAccountPortal,
} from "@/lib/clerk-root";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import logo from "@/assets/bidintelligence-logo.png";

function ClerkRegister() {
  const [, navigate] = useLocation();
  const { isLoaded, isSignedIn } = useClerkAuth();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      navigate(POST_AUTH_PATH);
      return;
    }
    if (!usesHostedAccountPortal()) return;
    const returnUrl = encodeURIComponent(clerkPostAuthUrl());
    window.location.replace(`${clerkSignUpUrl()}?redirect_url=${returnUrl}`);
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded || isSignedIn || usesHostedAccountPortal()) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center p-6 text-slate-300">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        {isSignedIn ? "Opening Bid Intelligence…" : "Redirecting to CCA sign up…"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <img src={logo} alt="BidIntelligenceOS" className="h-8 w-auto mb-6 mx-auto" />
        <SignUp
          routing="path"
          path="/register"
          signInUrl="/login"
          forceRedirectUrl={POST_AUTH_PATH}
          fallbackRedirectUrl={POST_AUTH_PATH}
        />
      </div>
    </div>
  );
}

export default function Register() {
  const [, navigate] = useLocation();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isClerkFrontendEnabled()) {
    return <ClerkRegister />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register({ email, password, name, orgName: orgName || undefined });
      navigate(POST_AUTH_PATH);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B1220] p-8 shadow-xl">
        <img src={logo} alt="BidIntelligenceOS" className="h-8 w-auto mb-6" />
        <h1 className="text-2xl font-bold text-white">Create account</h1>
        <p className="mt-2 text-sm text-slate-400">Start your organization&apos;s bid workspace.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <Label className="text-slate-300">Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 bg-[#0A0E1A] border-white/15 text-white"
              required
            />
          </div>
          <div>
            <Label className="text-slate-300">Organization</Label>
            <Input
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="mt-1 bg-[#0A0E1A] border-white/15 text-white"
            />
          </div>
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
            {loading ? "Creating…" : "Create account"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-[#7dd3fc] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
