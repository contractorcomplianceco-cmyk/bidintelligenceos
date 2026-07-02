import { useState } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { COMPETITORWATCH } from "@/lib/competitorwatch";
import {
  Crosshair,
  Lock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Mail,
} from "lucide-react";

export default function CompetitorWatch() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [joined, setJoined] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Enter a work email to join the CompetitorWatchOS waitlist.",
      });
      return;
    }
    setJoined(true);
    toast({
      title: "You're on the waitlist",
      description: `We'll notify ${email.trim()} when CompetitorWatchOS opens for early access.`,
    });
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* Hero */}
        <Card className="bg-white shadow-sm border-[#E2E8F0] overflow-hidden relative">
          <div className="absolute top-0 right-0 p-6 opacity-[0.06] pointer-events-none">
            <Crosshair className="w-48 h-48 text-[#A855F7]" />
          </div>
          <CardContent className="p-6 lg:p-8 relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A855F7]/15 text-[#7C3AED] border border-[#A855F7]/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                {COMPETITORWATCH.status}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0BA3A8]/10 text-[#0A8A8F] border border-[#0BA3A8]/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" />
                Lawful signals only
              </span>
            </div>
            <h2 className="text-2xl lg:text-4xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
              <Crosshair className="h-8 w-8 text-[#A855F7]" />
              {COMPETITORWATCH.name}
            </h2>
            <p className="text-[#0284C7] font-medium mt-2">{COMPETITORWATCH.tagline}</p>
            <p className="text-slate-500 mt-3 max-w-3xl leading-relaxed">
              {COMPETITORWATCH.overview}
            </p>
            <div className="mt-5">
              <a
                href="#waitlist"
                className="inline-flex items-center gap-2 bg-[#A855F7] hover:bg-[#A855F7]/90 text-white text-sm font-semibold rounded-lg px-4 py-2.5 transition-colors"
              >
                Join the waitlist
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Why it matters */}
        <Card className="bg-white border-[#E2E8F0]">
          <CardHeader className="p-4 border-b border-[#E2E8F0]">
            <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0284C7]" />
              WHY IT MATTERS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {COMPETITORWATCH.whyItMatters.map((reason) => (
                <div
                  key={reason}
                  className="flex items-start gap-3 rounded-lg border border-[#E2E8F0] bg-[#F1F5F9]/50 p-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                  <p className="text-[12px] text-slate-700 leading-relaxed">{reason}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features (locked) */}
        <Card className="bg-white border-[#E2E8F0]">
          <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#A855F7]" />
              PLANNED CAPABILITIES
            </CardTitle>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {COMPETITORWATCH.features.length} features
            </span>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {COMPETITORWATCH.features.map((feature) => (
                <div
                  key={feature.title}
                  className="relative rounded-xl border border-[#E2E8F0] bg-[#F1F5F9]/50 p-4 overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-sm font-semibold text-slate-900 leading-snug pr-6">
                      {feature.title}
                    </h4>
                    <span className="absolute top-3 right-3 inline-flex items-center justify-center rounded-md bg-[#A855F7]/10 border border-[#A855F7]/30 p-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#7C3AED]" />
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {feature.description}
                  </p>
                  <span className="mt-3 inline-block text-[9px] font-bold uppercase tracking-widest text-[#7C3AED]">
                    Coming soon
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Guardrails */}
        <Card className="bg-white border-[#0BA3A8]/30">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="shrink-0 rounded-lg bg-[#0BA3A8]/10 border border-[#0BA3A8]/30 p-2.5">
              <ShieldCheck className="w-5 h-5 text-[#0BA3A8]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 tracking-wide mb-1">
                Ethical intelligence guardrails
              </h4>
              <p className="text-[12px] text-slate-500 leading-relaxed max-w-4xl">
                {COMPETITORWATCH.guardrail}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Waitlist */}
        <Card id="waitlist" className="bg-white shadow-sm border-[#E2E8F0]">
          <CardHeader className="p-4 border-b border-[#E2E8F0]">
            <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#A855F7]" />
              JOIN THE WAITLIST
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {joined ? (
              <div className="flex flex-col items-center text-center gap-3 py-6">
                <div className="rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 p-3">
                  <CheckCircle2 className="w-7 h-7 text-[#22C55E]" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">You're on the list</h4>
                <p className="text-[12px] text-slate-500 max-w-md leading-relaxed">
                  Thanks for your interest in {COMPETITORWATCH.name}. We'll reach out as early access
                  opens up. Decision-support guidance only — every signal stays lawful and reviewable.
                </p>
              </div>
            ) : (
              <form onSubmit={handleJoin} className="max-w-2xl">
                <p className="text-[12px] text-slate-500 leading-relaxed mb-4">
                  Be first to know when {COMPETITORWATCH.name} opens for early access. No spam — just a
                  single note when it's ready.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="cw-email"
                      className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5"
                    >
                      Work email
                    </label>
                    <input
                      id="cw-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#A855F7] transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cw-company"
                      className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5"
                    >
                      Company <span className="text-slate-400 normal-case">(optional)</span>
                    </label>
                    <input
                      id="cw-company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Your company"
                      className="w-full rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#A855F7] transition-colors"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-4 inline-flex items-center gap-2 bg-[#A855F7] hover:bg-[#A855F7]/90 text-white text-sm font-semibold rounded-lg px-5 py-2.5 transition-colors"
                >
                  Join the waitlist
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-[11px] text-slate-500 flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          {COMPETITORWATCH.name} is a planned add-on. Features shown are directional and subject to
          change. Decision-support guidance only.
        </p>
      </div>
    </Layout>
  );
}
