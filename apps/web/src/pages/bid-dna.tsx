import { useMemo, useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/lib/context";
import { useAuth } from "@/lib/auth-context";
import { useLiveData } from "@/lib/data-mode";
import { useBids, useWinLossAnalytics } from "@/hooks/use-bids";
import { useOpsCloseout } from "@/hooks/use-ops";
import { DemoDataBadge } from "@/components/demo-data-badge";
import { OpsModuleEmpty } from "@/components/ops-module-empty";
import { buildLiveBidDna } from "@/lib/live-bid-dna";
import {
  bidDnaProfiles,
  dnaLearnings,
  estimateAccuracySeries,
  dnaStats,
  dnaSteps,
} from "@core/bid-dna";
import type {
  BidDnaProfile,
  DnaLearning,
  LearningStatus,
  ConfidenceLevel,
} from "@core/bid-dna";
import {
  Dna,
  Target,
  Layers,
  Lightbulb,
  Gauge,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Sparkles,
  SearchCheck,
  Radar,
  Scale,
  BrainCircuit,
  ClipboardCheck,
  Clock,
  Timer,
  Users,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

const fmtCurrency = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${(n / 1000).toFixed(0)}K`;

const fmtFull = (n: number) => `$${n.toLocaleString()}`;

const statusMeta: Record<
  LearningStatus,
  { label: string; badge: string; icon: typeof CheckCircle2; color: string }
> = {
  applied: {
    label: "Applied",
    badge: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20",
    icon: CheckCircle2,
    color: "#22C55E",
  },
  suggested: {
    label: "Suggested",
    badge: "bg-[#38BDF8]/10 text-[#0284C7] border-[#38BDF8]/20",
    icon: Sparkles,
    color: "#38BDF8",
  },
  "under-review": {
    label: "Under Review",
    badge: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
    icon: SearchCheck,
    color: "#F59E0B",
  },
};

const confidenceMeta: Record<ConfidenceLevel, string> = {
  High: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20",
  Medium: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
  Low: "bg-[#8A96B0]/10 text-slate-500 border-[#8A96B0]/20",
};

const stepIcon = {
  capture: Radar,
  compare: Scale,
  learn: BrainCircuit,
  apply: ClipboardCheck,
} as const;

/** Green if the estimate came in at or under actual (good), amber/red if over. */
function VarianceChip({ pct }: { pct: number }) {
  const over = pct > 0;
  const strong = Math.abs(pct) >= 10;
  const cls = !over
    ? "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20"
    : strong
    ? "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20"
    : "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20";
  return (
    <span
      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-semibold border ${cls}`}
    >
      {over ? (
        <ArrowUpRight className="w-3 h-3" />
      ) : (
        <ArrowDownRight className="w-3 h-3" />
      )}
      {pct > 0 ? "+" : ""}
      {pct.toFixed(1)}%
    </span>
  );
}

export default function BidDna() {
  const { verticalConfig } = useAppContext();
  const { isAuthenticated } = useAuth();
  const live = useLiveData(isAuthenticated);
  const { data: closeoutData } = useOpsCloseout();
  const { data: allBids = [] } = useBids();
  const { data: winLoss } = useWinLossAnalytics();

  const wonBids = useMemo(() => allBids.filter((b) => b.status === "Won"), [allBids]);

  const liveView = useMemo(
    () =>
      live
        ? buildLiveBidDna(closeoutData?.jobs ?? [], wonBids, winLoss)
        : null,
    [live, closeoutData?.jobs, wonBids, winLoss],
  );

  const profiles = live && liveView ? liveView.profiles : bidDnaProfiles;
  const stats = live && liveView ? liveView.stats : dnaStats;
  const learnings = live && liveView ? liveView.learnings : dnaLearnings;
  const accuracySeries =
    live && liveView && liveView.accuracySeries.length > 0
      ? liveView.accuracySeries
      : estimateAccuracySeries;

  const [selected, setSelected] = useState<BidDnaProfile>(() => profiles[0]);
  const [statusFilter, setStatusFilter] = useState<LearningStatus | "all">("all");

  useEffect(() => {
    if (profiles.length > 0 && !profiles.find((p) => p.id === selected.id)) {
      setSelected(profiles[0]);
    }
  }, [profiles, selected.id]);

  const barData = useMemo(
    () =>
      profiles.map((p) => ({
        name: p.jobType.split(" ").slice(0, 2).join(" "),
        estimated: p.estimatedCost,
        actual: p.actualCost,
        id: p.id,
      })),
    [profiles],
  );

  const trendData = useMemo(
    () =>
      selected.accuracyTrend.map((a, i) => ({
        quarter: accuracySeries[i]?.quarter ?? `Q${i + 1}`,
        accuracy: a,
      })),
    [selected, accuracySeries],
  );

  const filteredLearnings = useMemo<DnaLearning[]>(
    () =>
      statusFilter === "all"
        ? learnings
        : learnings.filter((l) => l.status === statusFilter),
    [learnings, statusFilter],
  );

  if (live && liveView && !liveView.hasData) {
    return (
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 flex items-center gap-3">
              <Dna className="w-8 h-8 text-[#0284C7]" />
              Bid DNA
            </h1>
            <p className="text-slate-500 mt-2 text-sm lg:text-base leading-relaxed">
              Learning engine for {verticalConfig.name} — derived from completed jobs and bid outcomes.
            </p>
          </div>
          <OpsModuleEmpty
            module="Bid DNA learning data"
            description="Complete jobs in closeout or record scored bid outcomes to populate estimate-vs-actual profiles and learned adjustments."
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Hero header */}
        <div className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm p-6 lg:p-8">
          <div className="absolute -right-8 -top-8 opacity-[0.06]">
            <Dna className="w-52 h-52 text-[#0284C7]" />
          </div>
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-[#38BDF8]/30 bg-[#38BDF8]/10 mb-3">
                <BrainCircuit className="w-3.5 h-3.5 text-[#0284C7]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0284C7]">
                  Learning Engine
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 flex items-center gap-3">
                <Dna className="w-8 h-8 text-[#0284C7]" />
                Bid DNA
              </h1>
              <p className="text-slate-500 mt-2 text-sm lg:text-base leading-relaxed">
                Every completed job teaches the next bid. Bid DNA compares what
                you estimated against what actually happened — cost, hours, and
                duration — then surfaces learned adjustments for your{" "}
                {verticalConfig.name} estimators to review and apply.
              </p>
              {!live && <DemoDataBadge />}
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F1F5F9]/60 px-3 py-2 shrink-0">
              <Info className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
              <span className="text-[11px] text-slate-500 max-w-[220px]">
                Decision-support insights. Suggestions require human review — no
                bid is adjusted automatically.
              </span>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border-[#E2E8F0] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Gauge className="w-10 h-10 text-[#22C55E]" />
            </div>
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="w-4 h-4 text-[#22C55E]" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Overall Estimate Accuracy
                </span>
              </div>
              <div className="text-3xl font-bold text-slate-900 tracking-tight">
                {stats.overallAccuracy.toFixed(1)}%
              </div>
              <p className="text-[10px] text-[#22C55E] mt-1 font-medium tracking-wide flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />+
                {stats.accuracyDeltaQoQ.toFixed(1)} pts quarter-over-quarter
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E2E8F0] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Layers className="w-10 h-10 text-[#0284C7]" />
            </div>
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-[#0284C7]" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Jobs Analyzed
                </span>
              </div>
              <div className="text-3xl font-bold text-slate-900 tracking-tight">
                {stats.jobsAnalyzed}
              </div>
              <p className="text-[10px] text-slate-500 mt-1 font-medium tracking-wide">
                Across {profiles.length} job-type profiles
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E2E8F0] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Lightbulb className="w-10 h-10 text-[#F59E0B]" />
            </div>
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Active Learnings
                </span>
              </div>
              <div className="text-3xl font-bold text-slate-900 tracking-tight">
                {stats.activeLearnings}
              </div>
              <p className="text-[10px] text-slate-500 mt-1 font-medium tracking-wide">
                {stats.suggestedLearnings} suggested ·{" "}
                {stats.underReviewLearnings} under review
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E2E8F0] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Target className="w-10 h-10 text-[#0284C7]" />
            </div>
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-[#0284C7]" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Margin-of-Error Improvement
                </span>
              </div>
              <div className="text-3xl font-bold text-slate-900 tracking-tight">
                {stats.marginOfErrorImprovement.toFixed(1)} pts
              </div>
              <p className="text-[10px] text-slate-500 mt-1 font-medium tracking-wide">
                Mean variance reduced since baseline
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Accuracy-over-time chart + selected profile trend */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-white border-[#E2E8F0] flex flex-col lg:col-span-2">
            <CardHeader className="p-4 border-b border-[#E2E8F0]">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide">
                PORTFOLIO ESTIMATE ACCURACY — LAST 6 QUARTERS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1">
              <div className="flex gap-4 mb-3 text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-1.5 text-[#22C55E]">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                  Accuracy %
                </div>
                <div className="flex items-center gap-1.5 text-[#F59E0B]">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                  Mean Cost Variance %
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={accuracySeries}
                    margin={{ top: 0, right: 0, left: -10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="dnaAcc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="dnaVar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="quarter" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#64748B"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 100]}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", fontSize: "12px" }}
                      formatter={(v: number, name) => [
                        `${v}%`,
                        name === "accuracy" ? "Accuracy" : "Mean Cost Variance",
                      ]}
                    />
                    <Area type="monotone" dataKey="accuracy" stroke="#22C55E" fill="url(#dnaAcc)" strokeWidth={2.5} />
                    <Area type="monotone" dataKey="costVariance" stroke="#F59E0B" fill="url(#dnaVar)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                Accuracy rises as mean variance falls — trend reflects historical
                outcomes, not a guarantee of future results.
              </p>
            </CardContent>
          </Card>

          {/* Selected profile trend detail */}
          <Card className="bg-white border-[#E2E8F0] flex flex-col">
            <CardHeader className="p-4 border-b border-[#E2E8F0]">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide">
                PROFILE ACCURACY TREND
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col">
              <div className="mb-3">
                <p className="text-xs font-semibold text-slate-900">{selected.jobType}</p>
                <p className="text-[10px] text-slate-500">
                  {selected.sampleSize} completed jobs · current{" "}
                  <span className="text-[#22C55E] font-semibold">
                    {selected.currentAccuracy.toFixed(1)}%
                  </span>
                </p>
              </div>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="dnaProf" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="quarter" stroke="#64748B" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={9} tickLine={false} axisLine={false} domain={[60, 100]} tickFormatter={(v) => `${v}`} />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", fontSize: "12px" }}
                      formatter={(v: number) => [`${v}%`, "Accuracy"]}
                    />
                    <Area type="monotone" dataKey="accuracy" stroke="#38BDF8" fill="url(#dnaProf)" strokeWidth={2.5} dot={{ r: 2, fill: "#38BDF8" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                  Top Variance Driver
                </p>
                <p className="text-xs text-slate-900 leading-snug">{selected.topDriver}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-2 text-center">
                  <Clock className="w-3.5 h-3.5 text-[#0284C7] mx-auto mb-1" />
                  <VarianceChip pct={selected.hoursVariancePct} />
                  <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-wider">Hours</p>
                </div>
                <div className="rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-2 text-center">
                  <Timer className="w-3.5 h-3.5 text-[#0284C7] mx-auto mb-1" />
                  <VarianceChip pct={selected.durationVariancePct} />
                  <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-wider">Duration</p>
                </div>
                <div className="rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-2 text-center">
                  <Target className="w-3.5 h-3.5 text-[#0284C7] mx-auto mb-1" />
                  <VarianceChip pct={selected.costVariancePct} />
                  <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-wider">Cost</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estimate vs Actual by job type — bar chart */}
        <Card className="bg-white border-[#E2E8F0] flex flex-col">
          <CardHeader className="p-4 border-b border-[#E2E8F0]">
            <CardTitle className="text-sm font-bold text-slate-900 tracking-wide">
              ESTIMATED VS ACTUAL COST — BY JOB TYPE
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex gap-4 mb-3 text-[10px] font-bold uppercase tracking-widest">
              <div className="flex items-center gap-1.5 text-[#0284C7]">
                <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                Estimated
              </div>
              <div className="flex items-center gap-1.5 text-[#F59E0B]">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                Actual
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} interval={0} />
                  <YAxis
                    stroke="#64748B"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                  />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", fontSize: "12px" }}
                    formatter={(v: number) => fmtFull(v)}
                    cursor={{ fill: "#E2E8F0", opacity: 0.4 }}
                  />
                  <Bar dataKey="estimated" fill="#38BDF8" radius={[3, 3, 0, 0]} maxBarSize={30} />
                  <Bar dataKey="actual" fill="#F59E0B" radius={[3, 3, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Estimate vs Actual detail table with variance chips */}
        <Card className="bg-white border-[#E2E8F0] flex flex-col">
          <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-900 tracking-wide">
              ESTIMATE-VS-ACTUAL PROFILES — BY JOB TYPE
            </CardTitle>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest hidden sm:block">
              Click a row to inspect its trend
            </span>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-[#F1F5F9] border-b border-[#E2E8F0]">
                <tr>
                  {[
                    "Job Type",
                    "Sample",
                    "Est. Cost",
                    "Actual Cost",
                    "Cost Var.",
                    "Hours Var.",
                    "Duration Var.",
                    "Accuracy",
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap ${
                        i === 0 ? "" : "text-right"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {profiles.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className={`transition-colors cursor-pointer ${
                      p.id === selected.id ? "bg-[#F1F5F9]" : "hover:bg-[#F1F5F9]"
                    }`}
                  >
                    <td className="px-3 py-3">
                      <div className="font-semibold text-slate-900 text-xs whitespace-nowrap flex items-center gap-2">
                        {p.id === selected.id && (
                          <span className="w-1.5 h-4 rounded-full bg-[#38BDF8]" />
                        )}
                        {p.jobType}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {verticalConfig.id === p.vertical ? "Your vertical · " : ""}
                        {p.topDriver}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <Users className="w-3 h-3" />
                        {p.sampleSize}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right text-xs text-slate-500 whitespace-nowrap">
                      {fmtCurrency(p.estimatedCost)}
                    </td>
                    <td className="px-3 py-3 text-right text-xs text-slate-900 whitespace-nowrap">
                      {fmtCurrency(p.actualCost)}
                    </td>
                    <td className="px-3 py-3 text-right whitespace-nowrap">
                      <VarianceChip pct={p.costVariancePct} />
                    </td>
                    <td className="px-3 py-3 text-right whitespace-nowrap">
                      <VarianceChip pct={p.hoursVariancePct} />
                    </td>
                    <td className="px-3 py-3 text-right whitespace-nowrap">
                      <VarianceChip pct={p.durationVariancePct} />
                    </td>
                    <td className="px-3 py-3 text-right whitespace-nowrap">
                      <span className="text-xs font-semibold text-[#22C55E]">
                        {p.currentAccuracy.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Learnings feed */}
        <Card className="bg-white border-[#E2E8F0] flex flex-col">
          <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
              LEARNED ADJUSTMENTS FEED
            </CardTitle>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(["all", "applied", "suggested", "under-review"] as const).map((f) => {
                const active = statusFilter === f;
                const label =
                  f === "all"
                    ? "All"
                    : f === "under-review"
                    ? "Under Review"
                    : f.charAt(0).toUpperCase() + f.slice(1);
                return (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors ${
                      active
                        ? "bg-[#38BDF8]/10 text-[#0284C7] border-[#38BDF8]/30"
                        : "text-slate-500 border-[#E2E8F0] hover:text-slate-900 hover:border-[#CBD5E1]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {filteredLearnings.map((l) => {
              const meta = statusMeta[l.status];
              const StatusIcon = meta.icon;
              return (
                <div
                  key={l.id}
                  className="rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] p-4 hover:border-[#CBD5E1] transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${meta.badge}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {meta.label}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${confidenceMeta[l.confidence]}`}
                        >
                          {l.confidence} confidence
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                          {l.category}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 leading-snug">
                        {l.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {l.detail}
                      </p>
                      <div className="flex items-center gap-3 mt-2 flex-wrap text-[11px] text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {l.sampleSize} jobs
                        </span>
                        {l.relatedJob && (
                          <span className="inline-flex items-center gap-1">
                            <Layers className="w-3 h-3 text-[#0284C7]" />
                            {l.relatedJob}
                          </span>
                        )}
                        <span>Discovered {l.discovered}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-start lg:items-end gap-2 shrink-0">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border"
                        style={{
                          color: meta.color,
                          borderColor: `${meta.color}33`,
                          backgroundColor: `${meta.color}14`,
                        }}
                      >
                        {l.adjustment}
                      </span>
                      {l.status === "suggested" && (
                        <div className="flex items-center gap-1.5">
                          <button className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 hover:bg-[#22C55E]/20 transition-colors">
                            Apply
                          </button>
                          <button className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-500 border border-[#E2E8F0] hover:text-slate-900 hover:border-[#CBD5E1] transition-colors">
                            Dismiss
                          </button>
                        </div>
                      )}
                      {l.status === "under-review" && (
                        <button className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 hover:bg-[#F59E0B]/20 transition-colors">
                          Review Evidence
                        </button>
                      )}
                      {l.status === "applied" && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#22C55E] font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          In estimate templates
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* How Bid DNA works — explainer strip */}
        <Card className="bg-white border-[#E2E8F0]">
          <CardHeader className="p-4 border-b border-[#E2E8F0]">
            <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-[#0284C7]" />
              HOW BID DNA WORKS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
              {dnaSteps.map((step, i) => {
                const Icon = stepIcon[step.key as keyof typeof stepIcon];
                return (
                  <div
                    key={step.key}
                    className="relative rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] p-4"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center">
                        <Icon className="w-4.5 h-4.5 text-[#0284C7]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          Step {i + 1}
                        </p>
                        <p className="text-sm font-bold text-slate-900">{step.label}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 mt-4 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
              Bid DNA is decision-support. Learned adjustments are surfaced for an
              estimator to review, accept, or dismiss — no pricing formula or margin
              strategy is exposed, and no outcome is guaranteed.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
