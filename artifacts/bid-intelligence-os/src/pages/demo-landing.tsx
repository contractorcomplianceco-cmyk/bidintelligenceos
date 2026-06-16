import { useState } from "react";
import { CCACrest } from "@/components/cca-crest";
import { ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
import heroImage from "@/assets/hero-construction.jpg";

export default function DemoLanding({ onEnter }: { onEnter: () => void }) {
  const [email, setEmail] = useState("jordan.p@contractorconnect.com");
  const [password, setPassword] = useState("demo");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEnter();
  };

  return (
    <div className="min-h-[100dvh] bg-[#0A0E1A] text-slate-200 font-sans relative overflow-hidden flex flex-col">
      {/* Live background photo */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={heroImage}
          alt="Commercial construction site"
          className="w-full h-full object-cover scale-105 animate-in fade-in duration-[1500ms] fill-mode-both"
        />
        {/* Vignette + tint layers */}
        <div className="absolute inset-0 bg-[#0A0E1A]/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E1A] via-[#0A0E1A]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A] via-transparent to-[#0A0E1A]/60" />
        <div
          className="absolute inset-0"
          style={{
            boxShadow: "inset 0 0 320px 80px rgba(5,8,16,0.9)",
          }}
        />
        <div className="absolute inset-0 blueprint-texture opacity-20" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-6">
        <div className="flex items-center gap-3">
          <CCACrest className="w-8 h-8 text-[#38BDF8]" />
          <h1 className="font-bold text-base text-white tracking-tight leading-none">
            <span className="text-[#38BDF8]">CCA</span> BidIntelligenceOS
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-[#cbd5e1]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
          Interactive Demo
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex items-center px-6 lg:px-12 py-10">
        <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Copy */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#38BDF8]/30 bg-[#38BDF8]/10 backdrop-blur-sm text-[#7dd3fc] text-xs font-semibold tracking-wide mb-6">
              <ShieldCheck className="w-3.5 h-3.5" />
              A product of Contractor Connect
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-white tracking-tight leading-[1.05] drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
              Research Less,
              <br />
              <span className="text-[#38BDF8]">Win More.</span>
            </h2>
            <p className="mt-6 text-base lg:text-lg text-[#cbd5e1] leading-relaxed max-w-md drop-shadow-[0_1px_10px_rgba(0,0,0,0.6)]">
              The bid intelligence cockpit for commercial trade contractors —
              analyze opportunities, structure pricing, build vendor-ready
              packages, and track outcomes in one workspace.
            </p>
          </div>

          {/* Login card */}
          <div className="w-full max-w-md lg:justify-self-end animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
            <div className="rounded-2xl border border-white/10 bg-[#0F1830]/80 backdrop-blur-xl p-7 lg:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">Sign in</h3>
                <p className="text-sm text-[#8A96B0] mt-1">
                  Access your bid intelligence cockpit.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="demo-email" className="block text-xs font-semibold text-[#8A96B0] uppercase tracking-widest mb-2">
                    Work Email
                  </label>
                  <div className="relative">
                    <Mail aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A96B0]" />
                    <input
                      id="demo-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg bg-[#0A0E1A]/80 border border-[#1C253B] pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-[#5b6680] focus:outline-none focus:border-[#38BDF8]/60 focus:ring-1 focus:ring-[#38BDF8]/40 transition-colors"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="demo-password" className="block text-xs font-semibold text-[#8A96B0] uppercase tracking-widest">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-[11px] text-[#38BDF8] hover:text-white transition-colors"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A96B0]" />
                    <input
                      id="demo-password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg bg-[#0A0E1A]/80 border border-[#1C253B] pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-[#5b6680] focus:outline-none focus:border-[#38BDF8]/60 focus:ring-1 focus:ring-[#38BDF8]/40 transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="group w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#38BDF8] text-[#0A0E1A] font-semibold text-sm tracking-wide hover:bg-[#5cc6fb] transition-all shadow-[0_0_30px_rgba(56,189,248,0.35)] hover:shadow-[0_0_40px_rgba(56,189,248,0.55)]"
                >
                  Sign in to Demo
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </form>

              <p className="mt-5 text-center text-[11px] text-[#8A96B0]">
                Interactive prototype · sample data · any credentials work
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-6 lg:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[#8A96B0] text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>
            Interactive prototype — output is for demonstration and requires
            review before use.
          </span>
        </div>
        <span className="text-white/90">
          CCA BidIntelligenceOS is a product of Contractor Connect
        </span>
      </footer>
    </div>
  );
}
