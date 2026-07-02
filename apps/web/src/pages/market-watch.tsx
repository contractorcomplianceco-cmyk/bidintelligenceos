import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  radarAlerts,
  jobSignals,
  bidSignals,
  marketSignals,
  type RadarAlert,
  type AlertLevel,
  type RegionHeat,
  type CompetitionDensity,
  type SignalSummary,
} from "@core/market-watch";
import { Link } from "wouter";
import {
  Radar,
  Radio,
  ShieldCheck,
  Flame,
  Gavel,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  Target,
  AlertTriangle,
  Activity,
  Clock,
  MapPin,
  Users,
  Send,
  ArrowRight,
  Network,
  Briefcase,
} from "lucide-react";

const AMBER = "#F59E0B";

const levelMeta: Record<
  AlertLevel,
  { label: string; dot: string; chip: string; border: string }
> = {
  high: {
    label: "HIGH OPPORTUNITY",
    dot: "#22C55E",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
    border: "border-l-emerald-400",
  },
  medium: {
    label: "MEDIUM",
    dot: "#F59E0B",
    chip: "bg-amber-50 text-amber-700 border-amber-200",
    border: "border-l-amber-400",
  },
  "critical-window": {
    label: "CRITICAL BID WINDOW",
    dot: "#EF4444",
    chip: "bg-red-50 text-red-700 border-red-200",
    border: "border-l-red-400",
  },
};

const heatMeta: Record<RegionHeat, { label: string; chip: string }> = {
  low: { label: "Low heat", chip: "bg-slate-100 text-slate-600 border-slate-200" },
  building: { label: "Building", chip: "bg-sky-50 text-sky-700 border-sky-200" },
  hot: { label: "Hot", chip: "bg-amber-50 text-amber-700 border-amber-200" },
  surging: { label: "Surging", chip: "bg-red-50 text-red-700 border-red-200" },
};

const densityMeta: Record<CompetitionDensity, { label: string; chip: string }> = {
  low: { label: "Low competition", chip: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  moderate: { label: "Moderate competition", chip: "bg-sky-50 text-sky-700 border-sky-200" },
  high: { label: "High competition", chip: "bg-red-50 text-red-700 border-red-200" },
};

const scoreColor = (s: number) =>
  s >= 85 ? "#EF4444" : s >= 75 ? "#F59E0B" : s >= 65 ? "#0284C7" : "#22C55E";

function TrendIcon({ trend }: { trend: SignalSummary["trend"] }) {
  if (trend === "up") return <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />;
  if (trend === "down") return <TrendingDown className="w-3.5 h-3.5 text-red-500" />;
  return <Minus className="w-3.5 h-3.5 text-slate-400" />;
}

export default function MarketWatch() {
  const { toast } = useToast();

  const activeAlerts = radarAlerts.length;
  const highOpportunity = radarAlerts.filter(
    (a) => a.level === "high" || a.opportunityScore >= 80
  ).length;
  const criticalWindows = radarAlerts.filter((a) => a.level === "critical-window").length;
  const avgScore = Math.round(
    radarAlerts.reduce((sum, a) => sum + a.opportunityScore, 0) / radarAlerts.length
  );

  const sortedAlerts = [...radarAlerts].sort(
    (a, b) => b.opportunityScore - a.opportunityScore
  );

  const sendToPipeline = (alert: RadarAlert) => {
    toast({
      title: "Sent to Bid Pipeline",
      description: `"${alert.title}" (${alert.trade}) routed to BidIntelligenceOS for review. Decision-support only — verify before committing resources.`,
    });
  };

  const kpis = [
    { label: "Active alerts", value: activeAlerts, icon: Radio, color: AMBER },
    { label: "High-opportunity", value: highOpportunity, icon: Flame, color: "#22C55E" },
    { label: "Critical bid windows", value: criticalWindows, icon: Gavel, color: "#EF4444" },
    { label: "Avg opportunity score", value: avgScore, icon: Target, color: "#0284C7" },
  ];

  const signalColumns: {
    title: string;
    icon: typeof Zap;
    color: string;
    signals: SignalSummary[];
  }[] = [
    { title: "Job Signals", icon: Zap, color: "#22C55E", signals: jobSignals },
    { title: "Bid Signals", icon: Gavel, color: AMBER, signals: bidSignals },
    { title: "Market Signals", icon: Activity, color: "#0284C7", signals: marketSignals },
  ];

  return (
    <Layout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-6 opacity-[0.05] pointer-events-none">
            <Radar className="w-44 h-44" style={{ color: AMBER }} />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
                style={{
                  background: "#FEF3C7",
                  color: "#B45309",
                  borderColor: "#FCD34D",
                }}
              >
                <Radio className="w-3 h-3" />
                Connected add-on
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                Live radar
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" />
                Public data only
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
              <Radar className="h-7 w-7" style={{ color: AMBER }} />
              MarketWatchOS — Opportunity Radar
            </h1>
            <p className="text-[#0284C7] font-medium mt-2">
              Find the work before it hits the street.
            </p>
            <p className="text-slate-500 mt-2 max-w-3xl leading-relaxed text-sm">
              Real-time detection of job and bid opportunities from lawful, public signals — storm
              events, permit spikes, claim surges, RFP releases, and material/labor shifts — scored
              by trade and region and routed straight into your bid pipeline.
            </p>
          </CardContent>
        </Card>

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card
                key={kpi.label}
                className="bg-white border-[#E2E8F0] shadow-sm relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 h-[2px] w-full opacity-60"
                  style={{ background: `linear-gradient(90deg, ${kpi.color}, transparent)` }}
                />
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="inline-flex items-center justify-center w-6 h-6 rounded-md"
                      style={{ backgroundColor: `${kpi.color}1a` }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: kpi.color }} />
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {kpi.label}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
                    {kpi.value}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Alert feed + signals */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Alert feed */}
          <Card className="xl:col-span-2 bg-white border-[#E2E8F0] shadow-sm flex flex-col">
            <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <Radar className="w-4 h-4" style={{ color: AMBER }} />
                OPPORTUNITY RADAR FEED
              </CardTitle>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {sortedAlerts.length} signals detected
              </span>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {sortedAlerts.map((alert) => {
                const lvl = levelMeta[alert.level];
                const heat = heatMeta[alert.regionHeat];
                const density = densityMeta[alert.competitionDensity];
                return (
                  <div
                    key={alert.id}
                    className={`rounded-xl border border-[#E2E8F0] border-l-[3px] ${lvl.border} bg-[#F1F5F9] p-4`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${lvl.chip}`}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: lvl.dot }}
                            />
                            {lvl.label}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-slate-500 bg-white border border-[#E2E8F0] rounded-full px-2 py-0.5">
                            <Briefcase className="w-2.5 h-2.5" />
                            {alert.trade}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                            <Clock className="w-2.5 h-2.5" />
                            {alert.detectedAgo}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {alert.title}
                        </h4>
                        <p className="text-[12px] text-slate-700 leading-relaxed mt-1">
                          {alert.summary}
                        </p>
                      </div>
                      <div className="flex flex-col items-center shrink-0">
                        <div
                          className="text-2xl font-bold tabular-nums leading-none"
                          style={{ color: scoreColor(alert.opportunityScore) }}
                        >
                          {alert.opportunityScore}
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500 mt-1">
                          Score
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap mt-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-white border border-[#E2E8F0] rounded-md px-2 py-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {alert.region}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-semibold ${heat.chip}`}
                      >
                        <Flame className="w-3 h-3" />
                        {heat.label}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-semibold ${density.chip}`}
                      >
                        <Users className="w-3 h-3" />
                        {density.label}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-3 mt-3 pt-3 border-t border-[#E2E8F0]">
                      <div className="min-w-0 space-y-1">
                        <p className="text-[11px] text-slate-700 flex items-start gap-1.5">
                          <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                          <span>
                            <span className="font-semibold text-slate-900">Urgency:</span>{" "}
                            {alert.urgency}
                          </span>
                        </p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
                          <ShieldCheck className="w-3 h-3 text-sky-600 shrink-0" />
                          Source: {alert.source}
                        </p>
                        <p className="text-[10px] text-slate-500 flex items-start gap-1.5">
                          <ArrowRight className="w-3 h-3 text-[#0284C7] shrink-0 mt-0.5" />
                          {alert.suggestedAction}
                        </p>
                      </div>
                      <button
                        onClick={() => sendToPipeline(alert)}
                        className="shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-semibold text-white transition-colors hover:brightness-110"
                        style={{ backgroundColor: "#2563EB" }}
                      >
                        <Send className="w-3.5 h-3.5" />
                        Send to Bid Pipeline
                      </button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Signal columns */}
          <div className="space-y-6">
            {signalColumns.map((col) => {
              const Icon = col.icon;
              return (
                <Card key={col.title} className="bg-white border-[#E2E8F0] shadow-sm">
                  <CardHeader className="p-4 border-b border-[#E2E8F0]">
                    <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                      <Icon className="w-4 h-4" style={{ color: col.color }} />
                      {col.title.toUpperCase()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 space-y-2">
                    {col.signals.map((sig) => (
                      <div
                        key={sig.label}
                        className="flex items-center justify-between gap-3 rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-slate-900 leading-snug">
                            {sig.label}
                          </p>
                          <p className="text-[10px] text-slate-500">{sig.currentReading}</p>
                        </div>
                        <TrendIcon trend={sig.trend} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Integration strip */}
        <Card className="bg-white border-[#E2E8F0] shadow-sm">
          <CardHeader className="p-4 border-b border-[#E2E8F0]">
            <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
              <Network className="w-4 h-4" style={{ color: AMBER }} />
              HOW MARKETWATCHOS CONNECTS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  name: "BidIntelligenceOS",
                  role: "Bid pipeline",
                  desc: "Scored opportunities flow straight into the bid pipeline for review, qualification, and package building.",
                  icon: Target,
                  color: "#2563EB",
                },
                {
                  name: "ContractorConnect",
                  role: "Lead distribution",
                  desc: "Detected job leads are distributed to the right contractor or region for fast, coordinated response.",
                  icon: Send,
                  color: "#0284C7",
                },
                {
                  name: "BuildConnect",
                  role: "Labor demand matching",
                  desc: "Rising trade demand signals help pre-position and reserve subcontractor capacity before pipelines fill.",
                  icon: Users,
                  color: "#F97316",
                },
              ].map((node) => {
                const Icon = node.icon;
                return (
                  <div
                    key={node.name}
                    className="rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="inline-flex items-center justify-center w-7 h-7 rounded-md"
                        style={{ backgroundColor: `${node.color}1a` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: node.color }} />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-none">
                          {node.name}
                        </p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mt-1">
                          {node.role}
                        </p>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{node.desc}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Footer guardrail */}
        <Card className="bg-white border-sky-200 shadow-sm">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="shrink-0 rounded-lg bg-sky-50 border border-sky-200 p-2.5">
              <ShieldCheck className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 tracking-wide mb-1">
                Lawful, public signals — decision-support only
              </h4>
              <p className="text-[12px] text-slate-500 leading-relaxed max-w-4xl">
                MarketWatchOS detects opportunities from lawful, public data sources only (weather
                services, municipal permit feeds, public procurement portals, and published economic
                indices). Opportunity scores and competition signals are decision-support guidance —
                no outcome is guaranteed and every alert requires human review before you commit bid
                resources.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
