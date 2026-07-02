import { useState } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  LineChart,
  Lock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Mail,
  TrendingUp,
  Flame,
  Package,
  Users,
} from "lucide-react";

const AMBER = "#F59E0B";

const MARKETWATCH = {
  name: "MarketWatchOS",
  status: "Coming Soon",
  tagline: "Read regional market pressure before you commit bid resources.",
  overview:
    "MarketWatchOS is a planned market-intelligence add-on for BidIntelligenceOS. It surfaces regional pricing trends, demand heat, material cost signals, and subcontractor availability from lawful, public data — so you can time bids, set realistic assumptions, and protect margin.",
  whyItMatters: [
    "Spot where demand is heating up before you allocate estimating time.",
    "Track regional pricing trends to set realistic estimate assumptions.",
    "Read material cost signals to time purchases and protect margin.",
    "Gauge subcontractor availability by trade and region.",
    "Turn public market movement into a repeatable bid/no-bid strategy.",
  ],
  features: [
    { icon: TrendingUp, title: "Regional pricing trends", description: "Directional pricing movement by region and trade, drawn from public market data." },
    { icon: Flame, title: "Demand heat", description: "See where project demand is rising or cooling so you focus on winnable work." },
    { icon: Package, title: "Material cost signals", description: "Track public material cost movement and lead-time pressure that affects your estimates." },
    { icon: Users, title: "Subcontractor availability", description: "Read directional signals on sub availability by trade and region from public sources." },
    { icon: LineChart, title: "Market benchmark ranges", description: "Public benchmark pricing bands to sanity-check your assumptions." },
    { icon: Sparkles, title: "Bid timing guidance", description: "Decision-support prompts on when market conditions favor bidding." },
  ],
  guardrail:
    "MarketWatchOS uses lawful, public data sources only. It does not access private company systems, confidential pricing, or non-public bid information.",
};

export default function MarketWatch() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [joined, setJoined] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Enter a work email to join the MarketWatchOS waitlist.",
      });
      return;
    }
    setJoined(true);
    toast({
      title: "You're on the waitlist",
      description: `We'll notify ${email.trim()} when MarketWatchOS opens for early access.`,
    });
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* Hero */}
        <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-6 opacity-[0.05] pointer-events-none">
            <LineChart className="w-48 h-48" style={{ color: AMBER }} />
          </div>
          <CardContent className="p-6 lg:p-8 relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                {MARKETWATCH.status}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 text-[#0A8A8F] border border-teal-200 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" />
                Public data only
              </span>
            </div>
            <h2 className="text-2xl lg:text-4xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
              <LineChart className="h-8 w-8" style={{ color: AMBER }} />
              {MARKETWATCH.name}
            </h2>
            <p className="text-[#0284C7] font-medium mt-2">{MARKETWATCH.tagline}</p>
            <p className="text-slate-500 mt-3 max-w-3xl leading-relaxed">{MARKETWATCH.overview}</p>
            <div className="mt-5">
              <a
                href="#waitlist"
                className="inline-flex items-center gap-2 text-white text-sm font-semibold rounded-lg px-4 py-2.5 transition-colors hover:brightness-105"
                style={{ background: AMBER }}
              >
                Join the waitlist
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Why it matters */}
        <Card className="bg-white border-[#E2E8F0] shadow-sm">
          <CardHeader className="p-4 border-b border-[#E2E8F0]">
            <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0284C7]" />
              WHY IT MATTERS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {MARKETWATCH.whyItMatters.map((reason) => (
                <div
                  key={reason}
                  className="flex items-start gap-3 rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-[12px] text-slate-700 leading-relaxed">{reason}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features (locked) */}
        <Card className="bg-white border-[#E2E8F0] shadow-sm">
          <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
              <Lock className="w-4 h-4" style={{ color: AMBER }} />
              PLANNED CAPABILITIES
            </CardTitle>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {MARKETWATCH.features.length} features
            </span>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {MARKETWATCH.features.map((feature) => (
                <div
                  key={feature.title}
                  className="relative rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] p-4 overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 pr-6">
                      <feature.icon className="w-4 h-4 shrink-0" style={{ color: AMBER }} />
                      <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                        {feature.title}
                      </h4>
                    </div>
                    <span className="absolute top-3 right-3 inline-flex items-center justify-center rounded-md bg-amber-50 border border-amber-200 p-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-700" />
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{feature.description}</p>
                  <span className="mt-3 inline-block text-[9px] font-bold uppercase tracking-widest text-amber-700">
                    Coming soon
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Guardrails */}
        <Card className="bg-white border-teal-200 shadow-sm">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="shrink-0 rounded-lg bg-teal-50 border border-teal-200 p-2.5">
              <ShieldCheck className="w-5 h-5 text-[#0A8A8F]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 tracking-wide mb-1">
                Lawful, public data guardrails
              </h4>
              <p className="text-[12px] text-slate-500 leading-relaxed max-w-4xl">
                {MARKETWATCH.guardrail}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Waitlist */}
        <Card id="waitlist" className="bg-white border-[#E2E8F0] shadow-sm">
          <CardHeader className="p-4 border-b border-[#E2E8F0]">
            <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
              <Mail className="w-4 h-4" style={{ color: AMBER }} />
              JOIN THE WAITLIST
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {joined ? (
              <div className="flex flex-col items-center text-center gap-3 py-6">
                <div className="rounded-full bg-emerald-50 border border-emerald-200 p-3">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">You're on the list</h4>
                <p className="text-[12px] text-slate-500 max-w-md leading-relaxed">
                  Thanks for your interest in {MARKETWATCH.name}. We'll reach out as early access opens
                  up. Decision-support guidance only — every signal stays lawful, public, and reviewable.
                </p>
              </div>
            ) : (
              <form onSubmit={handleJoin} className="max-w-2xl">
                <p className="text-[12px] text-slate-500 leading-relaxed mb-4">
                  Be first to know when {MARKETWATCH.name} opens for early access. No spam — just a
                  single note when it's ready.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="mw-email"
                      className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5"
                    >
                      Work email
                    </label>
                    <input
                      id="mw-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F59E0B] transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="mw-company"
                      className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5"
                    >
                      Company <span className="text-slate-400 normal-case">(optional)</span>
                    </label>
                    <input
                      id="mw-company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Your company"
                      className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F59E0B] transition-colors"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-4 inline-flex items-center gap-2 text-white text-sm font-semibold rounded-lg px-5 py-2.5 transition-colors hover:brightness-105"
                  style={{ background: AMBER }}
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
          {MARKETWATCH.name} is a planned add-on licensed separately. Features shown are directional
          and subject to change. Decision-support guidance only, from lawful public data sources.
        </p>
      </div>
    </Layout>
  );
}
