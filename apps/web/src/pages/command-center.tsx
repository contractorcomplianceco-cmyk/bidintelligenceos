import { useMemo } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/lib/context";
import { followUpQueue, analyticsData, documentReadiness } from "@core/data";
import { useToast } from "@/hooks/use-toast";
import { useBids, useResearchExportReadyPreview, useRoseOsSummary, useWinLossAnalytics } from "@/hooks/use-bids";
import { useAuth } from "@/lib/auth-context";
import { useLiveData } from "@/lib/data-mode";
import { DemoDataBadge } from "@/components/demo-data-badge";
import { useCommandCenterProjection } from "@/hooks/use-command-center";
import { useJobs } from "@/hooks/use-jobs";
import { useOpsScheduling, useOpsPermits, useOpsLabor, useOpsCostRoi, useOpsWeather } from "@/hooks/use-ops";
import { buildLiveBriefing, mapRoseSummaryInsights, roseStatsFromInsights } from "@/lib/live-operations";
import { buildLiveWinRateSeries, buildLiveCostSnapshot, hasLiveChartData } from "@/lib/live-analytics";
import { OpsModuleEmpty } from "@/components/ops-module-empty";
import {
  jobDeployments,
  alertItems,
  scheduleEvents,
  jobsiteWeather,
  permitItems,
  crewMembers,
  subcontractors,
  costToDateSeries,
  costRecords,
  dailyBriefing as demoBriefing,
  voiceCommands,
  BID_LIFECYCLE,
  type AlertSeverity,
  type ScheduleType,
  type SubStatus,
  type CrewStatus,
  type RiskBand,
} from "@core/operations";
import { radarAlerts } from "@core/market-watch";
import { executiveSummary, roseStats, roseInsights, VERDICT_META, type Verdict } from "@core/roseos";
import { RoseOsMark, RoseOsBadge, VerdictBadge, ROSE_COLOR, ROSE_COLOR_DARK } from "@/components/roseos/brand";
import { Link } from "wouter";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FolderKanban,
  Rocket,
  Trophy,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  CalendarRange,
  CloudRain,
  Wind,
  Thermometer,
  FileCheck2,
  HardHat,
  Users,
  Sparkles,
  ShieldCheck,
  Clock,
  Sun,
  PieChart as PieIcon,
  Target,
  PhoneCall,
  ExternalLink,
  ClipboardCheck,
  Crosshair,
  Mic,
  Radio,
  Radar,
  Flame,
} from "lucide-react";

const severityColor: Record<AlertSeverity, string> = {
  Critical: "#EF4444",
  High: "#F59E0B",
  Medium: "#38BDF8",
  Info: "#8A96B0",
};

const scheduleTypeColor: Record<ScheduleType, string> = {
  Crew: "#38BDF8",
  Sub: "#0BA3A8",
  Inspection: "#F59E0B",
  Permit: "#A855F7",
  Delivery: "#8A96B0",
  "Weather-Sensitive": "#EF4444",
};

const subStatusColor: Record<SubStatus, string> = {
  "On Track": "#22C55E",
  Delayed: "#F59E0B",
  "At Risk": "#EF4444",
  "Not Started": "#8A96B0",
  Complete: "#38BDF8",
};

const crewStatusColor: Record<CrewStatus, string> = {
  Available: "#22C55E",
  Assigned: "#38BDF8",
  Overallocated: "#EF4444",
  PTO: "#8A96B0",
};

const riskBandColor: Record<RiskBand, string> = {
  Low: "#22C55E",
  Moderate: "#F59E0B",
  High: "#F97316",
  Severe: "#EF4444",
};

export default function CommandCenter() {
  const { verticalConfig } = useAppContext();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const live = useLiveData(isAuthenticated);
  const { data: allBids = [] } = useBids();
  const { data: liveRose } = useRoseOsSummary();
  const { data: projection } = useCommandCenterProjection();
  const { data: liveJobs = [] } = useJobs();
  const { data: winLoss } = useWinLossAnalytics();
  const { data: liveSchedule = [] } = useOpsScheduling();
  const { data: livePermits = [] } = useOpsPermits();
  const { data: liveLabor } = useOpsLabor();
  const { data: liveCostData } = useOpsCostRoi();
  const { data: liveWeather = [] } = useOpsWeather();
  const { data: researchPreview, isLoading: researchLoading } = useResearchExportReadyPreview("FL", 8);

  const liveCostSeries = useMemo(
    () => (live && liveCostData?.records?.length ? buildLiveCostSnapshot(liveCostData.records) : []),
    [live, liveCostData],
  );
  const liveJobsiteWeather = live ? liveWeather : jobsiteWeather;

  const dailyBriefing = live
    ? buildLiveBriefing(projection, liveRose?.stats, liveRose?.insights ?? [], user?.name)
    : demoBriefing;

  const today = new Date().toISOString().slice(0, 10);
  const liveFollowUp = useMemo(() => {
    if (!live) return followUpQueue;
    return allBids
      .filter(
        (b) =>
          b.nextAction &&
          (b.status === "In Progress" || b.status === "Review" || b.status === "Draft"),
      )
      .sort((a, b) => (a.nextActionDate ?? "").localeCompare(b.nextActionDate ?? ""))
      .slice(0, 5)
      .map((b) => ({
        id: b.id,
        client: b.recipient || b.name,
        action: b.nextAction!,
        date: b.nextActionDate ?? "TBD",
        priority:
          b.nextActionDate && b.nextActionDate < today
            ? ("High" as const)
            : ("Medium" as const),
      }));
  }, [live, allBids, today]);

  const liveAlerts = useMemo(() => {
    if (!live || !projection) return { critical: 0, total: 0 };
    const critical = projection.counts.compliance_blocked;
    const overdue = projection.counts.overdue_follow_ups;
    return { critical: overdue > 0 ? overdue : critical, total: overdue + critical };
  }, [live, projection]);

  const liveRoseInsights = useMemo(
    () => (live && liveRose ? mapRoseSummaryInsights(liveRose.insights ?? []) : []),
    [live, liveRose],
  );
  const rosePosture = (
    live ? (liveRose?.verdict ?? "green") : executiveSummary.posture
  ) as Verdict;
  const roseHeadline = live
    ? liveRose?.executiveBrief?.headline ??
      (liveRose
        ? "Pipeline clear — no active ROSEOS alerts"
        : "Loading ROSEOS intelligence…")
    : executiveSummary.headline;
  const roseNarrative = live
    ? liveRose?.executiveBrief?.narrative ??
      (liveRose
        ? "Live org has no yellow/red verdicts yet. Intake and score bids to populate executive alerts."
        : "")
    : executiveSummary.narrative;
  const liveInsightCards = live
    ? liveRoseInsights.filter((i) => i.verdict !== "green").slice(0, 3)
    : roseInsights.filter((i) => i.verdict !== "green").slice(0, 3);
  const liveVerdictCounts = live
    ? liveRose
      ? roseStatsFromInsights(liveRoseInsights)
      : { green: 0, yellow: 0, red: 0, total: 0, modulesMonitored: 0 }
    : {
        green: roseStats.green,
        yellow: roseStats.yellow,
        red: roseStats.red,
        total: roseStats.total,
        modulesMonitored: roseStats.modulesMonitored,
      };

  const liveWonBids = allBids.filter((b) => b.status === "Won");

  const activeBids = allBids.filter(
    (b) => b.status === "In Progress" || b.status === "Review" || b.status === "Draft"
  );
  const openBidValue = activeBids.reduce((sum, b) => sum + b.amount, 0);
  const jobsInProgress = live
    ? liveJobs.filter((j) => j.status === "In Progress")
    : jobDeployments.filter((j) => j.status === "In Progress");
  const wonJobsCount = live ? liveJobs.length : jobDeployments.length;
  const criticalAlertCount = live
    ? liveAlerts.critical
    : alertItems.filter((a) => !a.resolved && a.severity === "Critical").length;
  const activeAlertTotal = live
    ? liveAlerts.total
    : alertItems.filter((a) => !a.resolved).length;
  const avgRoi = live
    ? liveJobs.length
      ? liveJobs.reduce((sum, j) => sum + j.projectedRoi, 0) / liveJobs.length
      : 0
    : costRecords.reduce((sum, r) => sum + r.projectedRoi, 0) / costRecords.length;

  const todaySchedule = (live ? liveSchedule : scheduleEvents)
    .filter((e) => e.dayIndex === 1)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const activePermits = live ? livePermits : permitItems;
  const criticalPermits = activePermits.filter(
    (p) => p.status === "Expiring" || p.status === "Blocked" || p.status === "Needed"
  );
  const permitSnapshot = activePermits
    .filter((p) => p.critical || p.status === "Expiring" || p.status === "Blocked")
    .slice(0, 5);

  const activeCrew = live ? (liveLabor?.crew ?? []) : crewMembers;
  const activeSubs = live ? (liveLabor?.subs ?? []) : subcontractors;
  const avgUtilization = activeCrew.length
    ? Math.round(activeCrew.reduce((sum, c) => sum + c.utilization, 0) / activeCrew.length)
    : 0;
  const overallocated = activeCrew.filter((c) => c.status === "Overallocated");
  const topCrew = [...activeCrew]
    .sort((a, b) => b.utilization - a.utilization)
    .slice(0, 6);
  const subsAtRisk = activeSubs.filter(
    (s) => s.status === "At Risk" || s.status === "Delayed"
  );

  // --- Bid intelligence derived data ---
  const bidsWithConfidence = activeBids.filter((b) => typeof b.confidence === "number");
  const avgConfidence = bidsWithConfidence.length
    ? Math.round(
        bidsWithConfidence.reduce((sum, b) => sum + (b.confidence ?? 0), 0) /
          bidsWithConfidence.length
      )
    : 0;

  const confidenceBands = [
    { key: "High", label: "High (80%+)", min: 80, max: 101, color: "#22C55E" },
    { key: "Medium", label: "Medium (60–79%)", min: 60, max: 80, color: "#38BDF8" },
    { key: "Watch", label: "Watch (40–59%)", min: 40, max: 60, color: "#F59E0B" },
    { key: "Low", label: "Low (<40%)", min: 0, max: 40, color: "#EF4444" },
  ] as const;

  const pipelineBreakdown = confidenceBands
    .map((band) => {
      const bids = activeBids.filter((b) => {
        const c = b.confidence ?? 0;
        return c >= band.min && c < band.max;
      });
      return {
        name: band.label,
        color: band.color,
        count: bids.length,
        value: bids.reduce((sum, b) => sum + b.amount, 0),
      };
    })
    .filter((b) => b.value > 0);

  const winRateSeries = live
    ? buildLiveWinRateSeries(allBids)
    : analyticsData.winRateOverTime.slice(-8);
  const hasWinRateChart = !live || hasLiveChartData(allBids);
  const latestWinRate = live && winLoss?.summary.winRate != null
    ? winLoss.summary.winRate
    : winRateSeries[winRateSeries.length - 1]?.rate ?? 0;
  const firstWinRate = winRateSeries[0]?.rate ?? 0;
  const winRateDelta = latestWinRate - firstWinRate;

  const topActiveBids = [...activeBids]
    .sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0))
    .slice(0, 5);

  const confidenceColor = (c: number) =>
    c >= 80 ? "#22C55E" : c >= 60 ? "#38BDF8" : c >= 40 ? "#F59E0B" : "#EF4444";

  const priorityColor: Record<string, string> = {
    High: "#EF4444",
    Medium: "#F59E0B",
    Low: "#38BDF8",
  };

  const docsComplete = live
    ? 0
    : documentReadiness.filter((d) => d.status === "complete").length;
  const docsReadiness = live
    ? 0
    : documentReadiness.length
      ? Math.round((docsComplete / documentReadiness.length) * 100)
      : 0;

  const kpis = [
    {
      label: "Active Bids",
      value: activeBids.length,
      icon: FolderKanban,
      color: "#38BDF8",
      sub: `$${(openBidValue / 1_000_000).toFixed(2)}M open value`,
      href: "/bids",
    },
    {
      label: "Jobs In Progress",
      value: jobsInProgress.length,
      icon: Rocket,
      color: "#0BA3A8",
      sub: `${wonJobsCount} total deployments`,
      href: "/deployment",
    },
    {
      label: "Won Jobs",
      value: live ? liveWonBids.length : wonJobsCount,
      icon: Trophy,
      color: "#22C55E",
      sub: live
        ? `$${(liveWonBids.reduce((s, b) => s + b.amount, 0) / 1_000_000).toFixed(2)}M won value`
        : `$${(
            jobDeployments.reduce((s, j) => s + j.contractValue, 0) / 1_000_000
          ).toFixed(2)}M contracted`,
      href: "/won-jobs",
    },
    {
      label: "Critical Alerts",
      value: criticalAlertCount,
      icon: AlertTriangle,
      color: "#EF4444",
      sub: `${activeAlertTotal} active total`,
      href: "/alerts",
    },
    {
      label: "Avg Bid Confidence",
      value: `${avgConfidence}%`,
      icon: Target,
      color: "#0BA3A8",
      sub: `${avgRoi.toFixed(1)}% avg projected ROI`,
      href: "/analytics",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome header */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm p-6 relative overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-1/3 blueprint-texture opacity-[0.04] pointer-events-none"></div>
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0284C7]">
                  Command Center
                </span>
                <span className="text-[10px] text-slate-500">·</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  {verticalConfig.name} Operations
                </span>
                {!live && <DemoDataBadge />}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                {dailyBriefing.greeting}
              </h1>
              <p className="text-slate-500 mt-1.5 max-w-2xl">{dailyBriefing.summary}</p>
              <p className="text-[11px] text-slate-500 mt-2">{dailyBriefing.date}</p>
            </div>
            <div className="flex flex-col items-start lg:items-end gap-2">
              {!live && (
              <div className="flex items-center gap-2 rounded-lg border border-[#0BA3A8]/40 bg-[#0BA3A8]/10 px-3 py-2">
                <Sparkles className="w-4 h-4 text-[#0BA3A8]" />
                <span className="text-xs text-[#0A8A8F]">
                  Try VoiceConnect: <span className="font-semibold text-slate-900">"Show jobs at risk today"</span>
                </span>
              </div>
              )}
              <Link
                href="/briefings"
                className="text-xs text-[#0284C7] hover:text-slate-900 transition-colors flex items-center gap-1 font-medium"
              >
                Open full daily briefing <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Link key={kpi.label} href={kpi.href}>
                <Card className="bg-white border-[#E2E8F0] shadow-sm relative overflow-hidden group cursor-pointer hover:border-[#CBD5E1] hover:shadow-md transition-all duration-300 h-full">
                  <div
                    className="absolute top-0 left-0 h-[2px] w-full opacity-60"
                    style={{ background: `linear-gradient(90deg, ${kpi.color}, transparent)` }}
                  />
                  <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: kpi.color }} />
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-25 transition-opacity">
                    <Icon className="w-10 h-10" style={{ color: kpi.color }} />
                  </div>
                  <CardContent className="p-4 relative z-10">
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
                    <div className="text-3xl font-bold text-slate-900 tracking-tight">
                      {kpi.value}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 font-medium tracking-wide">
                      {kpi.sub}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* ROSEOS Intelligence — executive decision layer */}
        <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
          <div
            className="h-[3px] w-full"
            style={{ background: `linear-gradient(90deg, ${ROSE_COLOR}, #FDA4AF, transparent)` }}
          />
          <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#FFF1F2] border border-[#FECDD3] flex-shrink-0">
                <RoseOsMark size={18} />
              </span>
              <div className="min-w-0">
                <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2 flex-wrap">
                  ROSEOS INTELLIGENCE
                  <RoseOsBadge />
                </CardTitle>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Executive verdicts across all connected modules
                </p>
              </div>
            </div>
            <Link
              href="/roseos"
              className="text-xs hover:text-slate-900 transition-colors flex items-center gap-1 font-medium flex-shrink-0"
              style={{ color: ROSE_COLOR_DARK }}
            >
              Open ROSEOS <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <VerdictBadge verdict={rosePosture} size="sm" />
                  <p className="text-xs font-semibold text-slate-900 leading-snug">
                    {roseHeadline}
                  </p>
                </div>
                {live && liveRose?.executiveBrief && (
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed line-clamp-2">{roseNarrative}</p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {(["green", "yellow", "red"] as Verdict[]).map((v) => (
                  <span
                    key={v}
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold tabular-nums px-2 py-1 rounded-md"
                    style={{
                      color: VERDICT_META[v].color,
                      backgroundColor: VERDICT_META[v].bg,
                      border: `1px solid ${VERDICT_META[v].border}`,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: VERDICT_META[v].color }} />
                    {liveVerdictCounts[v]} {VERDICT_META[v].label}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {liveInsightCards.length === 0 && live ? (
                <div className="md:col-span-3 rounded-lg border border-dashed border-[#E2E8F0] bg-[#F8FAFC] p-4 text-center">
                  <p className="text-xs font-semibold text-slate-900">No active ROSEOS alerts</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Your live pipeline has no yellow/red verdicts yet. Score active bids to surface Bid Risk cards here.
                  </p>
                </div>
              ) : (
                liveInsightCards.map((item) => (
                <Link key={item.id} href={"href" in item && item.href ? String(item.href) : "/roseos"}>
                  <div className="h-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3 hover:border-[#FDA4AF] transition-colors cursor-pointer">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <VerdictBadge verdict={item.verdict as Verdict} size="sm" />
                      {"detectedAgo" in item && item.detectedAgo ? (
                        <span className="text-[9px] text-slate-500 flex-shrink-0">{item.detectedAgo}</span>
                      ) : null}
                    </div>
                    <p className="text-[11px] font-semibold text-slate-900 leading-snug line-clamp-2">
                      {item.title}
                    </p>
                    {"sourceModule" in item && item.sourceModule ? (
                      <p className="text-[9px] font-bold uppercase tracking-widest mt-2" style={{ color: ROSE_COLOR_DARK }}>
                        via {item.sourceModule}
                      </p>
                    ) : (
                      <p className="text-[9px] font-bold uppercase tracking-widest mt-2" style={{ color: ROSE_COLOR_DARK }}>
                        via Bid Intelligence
                      </p>
                    )}
                  </div>
                </Link>
                ))
              )}
            </div>
            <p className="text-[10px] text-slate-500 mt-3 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-[#0284C7]" />
              ROSEOS provides intelligence, not execution — every verdict is flagged for human
              review and no outcome is guaranteed.
            </p>
          </CardContent>
        </Card>

        {/* Research Hub bridge — real compliance research preview */}
        <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="h-[3px] w-full bg-gradient-to-r from-[#0BA3A8] via-[#38BDF8] to-transparent" />
          <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0BA3A8]" />
                RESEARCH HUB COMPLIANCE BRIDGE
              </CardTitle>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Server-only preview of export-ready jurisdiction research for bid eligibility.
              </p>
            </div>
            <a
              href="https://command.cagteam.net/os/research-scoreboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#0284C7] hover:text-slate-900 transition-colors flex items-center gap-1 font-medium"
            >
              Open scoreboard <ExternalLink className="w-3 h-3" />
            </a>
          </CardHeader>
          <CardContent className="p-4">
            {researchLoading ? (
              <p className="text-sm text-slate-500">Loading Research Hub preview…</p>
            ) : !researchPreview?.ok ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                Research bridge is configured server-side, but no export-ready rows are available yet
                {researchPreview?.reason ? ` (${researchPreview.reason})` : ""}.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Export-ready total</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">{researchPreview.total}</p>
                  </div>
                  <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Preview state</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">{researchPreview.state ?? "All"}</p>
                  </div>
                  <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Rows shown</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">{researchPreview.rows.length}</p>
                  </div>
                </div>
                <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                  {researchPreview.rows.slice(0, 8).map((row) => (
                    <div key={row.id ?? `${row.ccaRfCode}-${row.stateCode}`} className="rounded-lg border border-[#E2E8F0] bg-white p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900">{row.ccaRfCode ?? row.riskFactorNumber ?? "Research row"}</span>
                        <span className="rounded-full bg-[#0BA3A8]/10 px-2 py-0.5 text-[10px] font-bold text-[#0A8A8F]">
                          {row.stateCode ?? "NA"}
                        </span>
                      </div>
                      <p className="mt-2 text-[11px] text-slate-500">
                        {row.workflowStage ?? "workflow pending"} · {row.teamValidationMethod ?? "validation pending"}
                      </p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        human approved: {row.humanApproved ? "yes" : "no"}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-[#0BA3A8]" />
                  Sanitized fields only. Raw research notes, statutes, credentials, and service keys stay server-side.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Row: Active Bids Intelligence + Follow-Up Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-white border-[#E2E8F0] shadow-sm flex flex-col">
            <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <Target className="w-4 h-4 text-[#0284C7]" />
                ACTIVE BID INTELLIGENCE
              </CardTitle>
              <Link
                href="/bids"
                className="text-xs text-[#0284C7] hover:text-slate-900 transition-colors flex items-center gap-1 font-medium"
              >
                All Bids <ArrowRight className="w-3 h-3" />
              </Link>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[9px] font-bold uppercase tracking-widest text-slate-500 border-b border-[#E2E8F0]">
                      <th className="px-4 py-2.5 font-bold">Opportunity</th>
                      <th className="px-3 py-2.5 font-bold text-right">Value</th>
                      <th className="px-3 py-2.5 font-bold">Confidence</th>
                      <th className="px-4 py-2.5 font-bold">Next Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topActiveBids.map((bid) => {
                      const conf = bid.confidence ?? 0;
                      return (
                        <tr
                          key={bid.id}
                          className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F1F5F9] transition-colors"
                        >
                          <td className="px-4 py-3 min-w-[180px]">
                            <div className="text-xs font-semibold text-slate-900 truncate">
                              {bid.name}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate">
                              {bid.recipient} · {bid.location}
                            </div>
                          </td>
                          <td className="px-3 py-3 text-right whitespace-nowrap">
                            <span className="text-xs font-bold text-slate-900">
                              ${(bid.amount / 1_000_000).toFixed(2)}M
                            </span>
                          </td>
                          <td className="px-3 py-3 min-w-[120px]">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 flex-1 rounded-full bg-[#E2E8F0] overflow-hidden min-w-[48px]">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${conf}%`,
                                    backgroundColor: confidenceColor(conf),
                                  }}
                                />
                              </div>
                              <span
                                className="text-[11px] font-bold tabular-nums"
                                style={{ color: confidenceColor(conf) }}
                              >
                                {conf}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 min-w-[150px]">
                            <div className="text-[11px] font-medium text-slate-700 truncate">
                              {bid.nextAction ?? "—"}
                            </div>
                            {bid.nextActionDate && (
                              <div className="text-[9px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <Clock className="w-2.5 h-2.5" />
                                Due {bid.nextActionDate}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-slate-500 px-4 py-3 flex items-center gap-1.5 border-t border-[#E2E8F0]">
                <ShieldCheck className="w-3 h-3 text-[#0284C7]" />
                Confidence is decision-support scoring only — no outcome is guaranteed.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E2E8F0] shadow-sm flex flex-col">
            <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#0BA3A8]" />
                FOLLOW-UP QUEUE
              </CardTitle>
              <Link
                href="/bids"
                className="text-xs text-[#0284C7] hover:text-slate-900 transition-colors font-medium"
              >
                Manage
              </Link>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
              <div className="divide-y divide-[#E2E8F0]">
                {liveFollowUp.length === 0 && live ? (
                <div className="p-6 text-center text-xs text-slate-500">No follow-ups queued — active bids are current.</div>
              ) : (
                liveFollowUp.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 flex items-start justify-between gap-3 hover:bg-[#F1F5F9] transition-colors"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span
                        className="mt-1 w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: priorityColor[item.priority] ?? "#8A96B0" }}
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 truncate">
                          {item.client}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">{item.action}</div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-[10px] font-semibold text-slate-900">{item.date}</div>
                      <span
                        className="text-[8px] font-bold uppercase tracking-widest"
                        style={{ color: priorityColor[item.priority] ?? "#8A96B0" }}
                      >
                        {item.priority}
                      </span>
                    </div>
                  </div>
                ))
              )}
              </div>
              {!live && (
              <div className="p-3 border-t border-[#E2E8F0] mt-auto">
                <button
                  onClick={() =>
                    toast({
                      title: "VoiceConnect",
                      description: 'Say "Call my next follow-up" to dial the top of the queue.',
                    })
                  }
                  className="w-full py-2 bg-[#0BA3A8]/15 hover:bg-[#0BA3A8]/25 text-[#0A8A8F] text-xs font-semibold rounded transition-colors flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Auto-dial with VoiceConnect
                </button>
              </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* VoiceConnect Feed — connected add-on (demo fixtures only) */}
        {!live && (
        <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
          <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex-shrink-0">
                <Mic className="w-4 h-4 text-[#0A8A8F]" />
              </span>
              <div className="min-w-0">
                <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2 flex-wrap">
                  VOICECONNECT FEED
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-teal-50 text-[#0A8A8F] border border-teal-200">
                    <Radio className="w-2.5 h-2.5" />
                    Connected add-on
                  </span>
                </CardTitle>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Field captures streaming into the OS in real time
                </p>
              </div>
            </div>
            <Link
              href="/voice-connect"
              className="text-xs text-[#0A8A8F] hover:text-slate-900 transition-colors flex items-center gap-1 font-medium flex-shrink-0"
            >
              Open VoiceConnect <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-start gap-2 mb-3 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2">
              <Radio className="w-3.5 h-3.5 text-[#0A8A8F] flex-shrink-0 mt-0.5" />
              <span className="text-[11px] text-slate-600 leading-snug">
                Voice commands captured in the field are parsed by the VoiceConnect add-on into
                actions across bids, scheduling, permits, and cost tracking — no manual entry
                required.
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {voiceCommands.slice(0, 6).map((vc) => (
                <div
                  key={vc.command}
                  className="rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-3"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-semibold text-slate-900 truncate flex items-center gap-1.5">
                      <Mic className="w-3 h-3 text-[#0A8A8F] flex-shrink-0" />
                      "{vc.command}"
                    </span>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-[#0A8A8F] bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded flex-shrink-0">
                      {vc.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-snug">{vc.response}</p>
                  <button
                    onClick={() =>
                      toast({
                        title: vc.actionLabel,
                        description: `VoiceConnect captured: "${vc.command}"`,
                      })
                    }
                    className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-[#0A8A8F] hover:text-slate-900 transition-colors"
                  >
                    {vc.actionLabel} <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        )}

        {/* Opportunity Radar — MarketWatchOS connected add-on (demo fixtures only) */}
        {!live && (
        <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
          <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex-shrink-0">
                <Radar className="w-4 h-4 text-[#B45309]" />
              </span>
              <div className="min-w-0">
                <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2 flex-wrap">
                  OPPORTUNITY RADAR
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-amber-50 text-[#B45309] border border-amber-200">
                    <Radio className="w-2.5 h-2.5" />
                    Connected add-on
                  </span>
                </CardTitle>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Top public-signal opportunities from MarketWatchOS
                </p>
              </div>
            </div>
            <Link
              href="/market-watch"
              className="text-xs text-[#B45309] hover:text-slate-900 transition-colors flex items-center gap-1 font-medium flex-shrink-0"
            >
              Open MarketWatchOS <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {[...radarAlerts]
                .sort((a, b) => b.opportunityScore - a.opportunityScore)
                .slice(0, 3)
                .map((alert) => {
                  const levelDot =
                    alert.level === "critical-window"
                      ? "#EF4444"
                      : alert.level === "high"
                      ? "#22C55E"
                      : "#F59E0B";
                  const levelLabel =
                    alert.level === "critical-window"
                      ? "Critical bid window"
                      : alert.level === "high"
                      ? "High opportunity"
                      : "Medium";
                  const scoreCol =
                    alert.opportunityScore >= 85
                      ? "#EF4444"
                      : alert.opportunityScore >= 75
                      ? "#F59E0B"
                      : "#0284C7";
                  return (
                    <Link key={alert.id} href="/market-watch">
                      <div className="h-full rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-3 hover:border-amber-300 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: levelDot }}
                            />
                            {levelLabel}
                          </span>
                          <span
                            className="text-lg font-bold tabular-nums leading-none"
                            style={{ color: scoreCol }}
                          >
                            {alert.opportunityScore}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-900 leading-snug line-clamp-2">
                          {alert.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2 text-[9px] font-medium text-slate-500">
                          <Flame className="w-2.5 h-2.5 text-amber-600" />
                          <span className="truncate">
                            {alert.trade} · {alert.region}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
            <p className="text-[10px] text-slate-500 mt-3 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-[#0284C7]" />
              Lawful, public signals only — decision-support scoring requiring review before you
              commit bid resources.
            </p>
          </CardContent>
        </Card>
        )}

        {/* Row: Win Rate Over Time + Pipeline Value Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-white border-[#E2E8F0] shadow-sm flex flex-col">
            <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#22C55E]" />
                WIN RATE OVER TIME
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-lg font-bold text-slate-900">{latestWinRate}%</span>
                  <span
                    className={`ml-2 text-[10px] font-bold ${
                      winRateDelta >= 0 ? "text-[#22C55E]" : "text-[#EF4444]"
                    }`}
                  >
                    {winRateDelta >= 0 ? "▲" : "▼"} {Math.abs(winRateDelta)} pts
                  </span>
                </div>
                <Link
                  href="/analytics"
                  className="text-xs text-[#0284C7] hover:text-slate-900 transition-colors font-medium"
                >
                  Analytics
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col">
              {!hasWinRateChart ? (
                <OpsModuleEmpty module="Win rate trend" description="Record at least two bid outcomes to chart win rate over time." />
              ) : (
              <div className="h-48 w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={winRateSeries}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="ccWinRate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="#64748B"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#64748B"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `${v}%`}
                      domain={[0, 100]}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#E2E8F0", color: "#0F172A",
                        fontSize: "12px",
                      }}
                      formatter={(v: number) => [`${v}%`, "Win rate"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="rate"
                      stroke="#22C55E"
                      fill="url(#ccWinRate)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              )}
              <p className="text-[10px] text-slate-500 mt-3 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-[#0284C7]" />
                Trailing win-rate trend across submitted bids. Past performance is not a guarantee.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E2E8F0] shadow-sm flex flex-col">
            <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-[#0284C7]" />
                PIPELINE BY CONFIDENCE
              </CardTitle>
              <Link
                href="/bids"
                className="text-xs text-[#0284C7] hover:text-slate-900 transition-colors font-medium"
              >
                Pipeline
              </Link>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col">
              {pipelineBreakdown.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                  <PieIcon className="w-8 h-8 text-slate-700 mb-2" />
                  <p className="text-xs text-slate-500">No active pipeline to break down yet.</p>
                </div>
              ) : (
                <>
              <div className="relative h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pipelineBreakdown}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={70}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {pipelineBreakdown.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#E2E8F0", color: "#0F172A",
                        fontSize: "12px",
                      }}
                      formatter={(v: number, n: string) => [
                        `$${(v / 1_000_000).toFixed(2)}M`,
                        n,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                    Open value
                  </span>
                  <span className="text-xl font-bold text-slate-900">
                    ${(openBidValue / 1_000_000).toFixed(1)}M
                  </span>
                </div>
              </div>
              <div className="space-y-1.5 mt-3">
                {pipelineBreakdown.map((band) => (
                  <div key={band.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: band.color }}
                      />
                      <span className="text-[11px] text-slate-700 truncate">{band.name}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-900 whitespace-nowrap">
                      ${(band.value / 1_000_000).toFixed(2)}M
                      <span className="text-[9px] text-slate-500 ml-1">({band.count})</span>
                    </span>
                  </div>
                ))}
              </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ComplianceConnect ecosystem banner */}
        <Card className="bg-white border-[#E2E8F0] shadow-sm relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-[#A855F7]/10 blur-3xl pointer-events-none" />
          <CardContent className="p-5 relative z-10 flex flex-col lg:flex-row lg:items-center gap-5">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-violet-50 flex-shrink-0">
                <ClipboardCheck className="w-6 h-6 text-[#7C3AED]" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#7C3AED]">
                    CCA Ecosystem
                  </span>
                  <span className="text-[9px] text-slate-500">·</span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    ComplianceConnect
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Bid-ready compliance, synced from ComplianceConnect
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xl leading-snug">
                  Licensing, bonding, and insurance readiness flow into every bid package. Keep
                  qualifications current in ComplianceConnect to avoid disqualification.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="text-center">
                <div
                  className="text-2xl font-bold"
                  style={{ color: docsReadiness >= 90 ? "#22C55E" : "#F59E0B" }}
                >
                  {live ? "—" : `${docsReadiness}%`}
                </div>
                <div className="text-[9px] text-slate-500 uppercase tracking-wider">
                  Docs ready
                </div>
              </div>
              <a
                href="https://demo.ccacomplianceconnect.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#A855F7]/20 hover:bg-[#A855F7]/30 border border-violet-200 text-[#7C3AED] text-xs font-semibold transition-colors whitespace-nowrap"
              >
                Open ComplianceConnect <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </CardContent>
        </Card>

        {/* CompetitorWatchOS coming-soon add-on card */}
        <Card className="bg-white border-[#E2E8F0] shadow-sm relative overflow-hidden">
          <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full bg-[#A855F7]/10 blur-3xl pointer-events-none" />
          <CardContent className="p-5 relative z-10 flex flex-col lg:flex-row lg:items-center gap-5">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-violet-50 flex-shrink-0">
                <Crosshair className="w-6 h-6 text-[#7C3AED]" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#7C3AED]">
                    CompetitorWatchOS
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-violet-50 text-[#7C3AED] border border-violet-200">
                    Coming Soon
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Understand lawful market signals before you commit bid resources
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xl leading-snug">
                  Public award history, regional bid activity, competitor presence, and pricing
                  pressure — lawful, public, and contractor-provided data only.
                </p>
              </div>
            </div>
            <Link
              href="/competitor-watch"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#A855F7]/20 hover:bg-[#A855F7]/30 border border-violet-200 text-[#7C3AED] text-xs font-semibold transition-colors whitespace-nowrap flex-shrink-0"
            >
              Preview add-on <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardContent>
        </Card>

        {/* Row: Daily Briefing + Today's Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-white border-[#E2E8F0] shadow-sm flex flex-col">
            <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0284C7]" />
                DAILY INTELLIGENT BRIEFING
              </CardTitle>
              <Link
                href="/briefings"
                className="text-xs text-[#0284C7] hover:text-slate-900 transition-colors flex items-center gap-1 font-medium"
              >
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {dailyBriefing.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-3"
                  >
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5 leading-tight">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2.5">
                {dailyBriefing.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-3 flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span
                        className="mt-1 w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: severityColor[item.priority] }}
                      ></span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-slate-900">
                            {item.headline}
                          </span>
                          <span
                            className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                            style={{
                              color: severityColor[item.priority],
                              backgroundColor: `${severityColor[item.priority]}1a`,
                            }}
                          >
                            {item.priority}
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        toast({
                          title: item.action,
                          description: item.headline,
                        })
                      }
                      className="flex-shrink-0 px-2.5 py-1.5 rounded bg-[#E2E8F0] hover:bg-[#CBD5E1] text-slate-900 text-[10px] font-semibold transition-colors whitespace-nowrap"
                    >
                      {item.action}
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E2E8F0] shadow-sm flex flex-col">
            <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <CalendarRange className="w-4 h-4 text-[#0284C7]" />
                TODAY · TUE JUL 1
              </CardTitle>
              <Link
                href="/scheduling"
                className="text-xs text-[#0284C7] hover:text-slate-900 transition-colors font-medium"
              >
                Schedule
              </Link>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
              {live && todaySchedule.length === 0 ? (
                <div className="p-4">
                  <OpsModuleEmpty module="Today's schedule" description="Convert won bids to jobs to populate schedule events." />
                </div>
              ) : (
              <div className="divide-y divide-[#E2E8F0]">
                {todaySchedule.map((event) => (
                  <div key={event.id} className="p-3 hover:bg-[#F1F5F9] transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 min-w-0">
                        <span
                          className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: scheduleTypeColor[event.type] }}
                        ></span>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-900 truncate">
                            {event.title}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {event.jobName} · {event.assignee}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3" />
                          {event.startTime}
                        </div>
                        {event.critical && (
                          <span className="text-[8px] font-bold uppercase tracking-widest text-[#EF4444] mt-1 inline-block">
                            Critical Path
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              )}
              <div className="p-3 border-t border-[#E2E8F0] mt-auto">
                <Link href="/scheduling">
                  <button className="w-full py-2 bg-[#E2E8F0] hover:bg-[#CBD5E1] text-slate-900 text-xs font-semibold rounded transition-colors flex items-center justify-center gap-2">
                    Open Weekly Schedule <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row: Cost-to-date chart + Weather Watch */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-white border-[#E2E8F0] shadow-sm flex flex-col">
            <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#0284C7]" />
                COST-TO-DATE · BUDGET VS ACTUAL
              </CardTitle>
              <Link
                href="/cost-roi"
                className="text-xs text-[#0284C7] hover:text-slate-900 transition-colors font-medium"
              >
                Cost & ROI
              </Link>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col">
              {live && liveCostSeries.length === 0 ? (
                <OpsModuleEmpty module="Cost tracking" description="Deploy won bids with budget and cost-to-date in job payload to populate cost tracking." />
              ) : (
              <>
              <div className="flex gap-4 mb-4 text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-1.5 text-[#0284C7]">
                  <span className="w-2 h-2 rounded-full bg-[#38BDF8]"></span>Budget
                </div>
                <div className="flex items-center gap-1.5 text-[#F59E0B]">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>Actual
                </div>
              </div>
              <div className="h-48 w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={live ? liveCostSeries : costToDateSeries}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="ccBudget" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="ccActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis
                      dataKey="week"
                      stroke="#64748B"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#64748B"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#E2E8F0", color: "#0F172A",
                        fontSize: "12px",
                      }}
                      formatter={(v: number) => `$${v.toLocaleString()}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="budget"
                      stroke="#38BDF8"
                      fill="url(#ccBudget)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="actual"
                      stroke="#F59E0B"
                      fill="url(#ccActual)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-slate-500 mt-3 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-[#0284C7]" />
                Decision-support guidance only. Projections require user verification.
              </p>
              </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E2E8F0] shadow-sm flex flex-col">
            <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-[#0284C7]" />
                WEATHER WATCH
              </CardTitle>
              <Link
                href="/weather"
                className="text-xs text-[#0284C7] hover:text-slate-900 transition-colors font-medium"
              >
                All Sites
              </Link>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
              {live && liveJobsiteWeather.length === 0 ? (
                <div className="p-4">
                  <OpsModuleEmpty module="Weather watch" description="Record won jobs in deployment to monitor weather-sensitive work." />
                </div>
              ) : (
              <>
              <div className="divide-y divide-[#E2E8F0]">
                {liveJobsiteWeather.map((site) => (
                  <div key={site.jobId} className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 truncate">
                          {site.jobName}
                        </div>
                        <div className="text-[10px] text-slate-500">{site.location}</div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {(() => {
                          const first = site.forecast[0];
                          const Icon =
                            first.condition === "Rain" || first.condition === "Storms"
                              ? CloudRain
                              : first.condition === "Windy"
                              ? Wind
                              : first.condition === "Hot"
                              ? Thermometer
                              : Sun;
                          return <Icon className="w-4 h-4 text-slate-500" />;
                        })()}
                        <span className="text-xs text-slate-900 font-medium">
                          {site.forecast[0].high}°
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {(
                        [
                          { label: "Rain", band: site.rainRisk, icon: CloudRain },
                          { label: "Wind", band: site.windRisk, icon: Wind },
                          { label: "Heat", band: site.heatRisk, icon: Thermometer },
                        ] as const
                      ).map((r) => (
                        <span
                          key={r.label}
                          className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded flex items-center gap-1"
                          style={{
                            color: riskBandColor[r.band],
                            backgroundColor: `${riskBandColor[r.band]}1a`,
                          }}
                        >
                          <r.icon className="w-2.5 h-2.5" />
                          {r.label} {r.band}
                        </span>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-snug">
                      {site.recommendation}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-[#E2E8F0] mt-auto">
                <p className="text-[10px] text-slate-500 leading-snug">
                  {verticalConfig.weatherNote}
                </p>
              </div>
              </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Row: Permit tracker + Labor utilization + Subcontractor strip */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Permit tracker */}
          <Card className="bg-white border-[#E2E8F0] shadow-sm flex flex-col">
            <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#0284C7]" />
                PERMIT TRACKER
              </CardTitle>
              <Link
                href="/permits"
                className="text-xs text-[#0284C7] hover:text-slate-900 transition-colors font-medium"
              >
                All Permits
              </Link>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col">
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 p-2 text-center">
                  <div className="text-xl font-bold text-[#EF4444]">
                    {activePermits.filter((p) => p.status === "Blocked").length}
                  </div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider">Blocked</div>
                </div>
                <div className="rounded-lg border border-[#F59E0B]/30 bg-[#F59E0B]/10 p-2 text-center">
                  <div className="text-xl font-bold text-[#F59E0B]">
                    {activePermits.filter((p) => p.status === "Expiring").length}
                  </div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider">Expiring</div>
                </div>
                <div className="rounded-lg border border-[#38BDF8]/30 bg-[#38BDF8]/10 p-2 text-center">
                  <div className="text-xl font-bold text-[#0284C7]">{criticalPermits.length}</div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider">Needs Action</div>
                </div>
              </div>
              <div className="space-y-2 flex-1">
                {permitSnapshot.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-2"
                  >
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-slate-900 truncate">{p.name}</div>
                      <div className="text-[9px] text-slate-500 truncate">{p.jobName}</div>
                    </div>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded flex-shrink-0 ${
                        p.status === "Blocked" || p.status === "Needed"
                          ? "text-[#EF4444] bg-[#EF4444]/10"
                          : p.status === "Expiring"
                          ? "text-[#F59E0B] bg-[#F59E0B]/10"
                          : "text-[#0284C7] bg-[#38BDF8]/10"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Labor utilization */}
          <Card className="bg-white border-[#E2E8F0] shadow-sm flex flex-col">
            <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <HardHat className="w-4 h-4 text-[#0284C7]" />
                LABOR UTILIZATION
              </CardTitle>
              <Link
                href="/labor"
                className="text-xs text-[#0284C7] hover:text-slate-900 transition-colors font-medium"
              >
                Labor & Subs
              </Link>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-2xl font-bold text-slate-900">{avgUtilization}%</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                    Avg utilization
                  </div>
                </div>
                {overallocated.length > 0 && (
                  <div className="rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 px-2.5 py-1.5 text-right">
                    <div className="text-sm font-bold text-[#EF4444]">
                      {overallocated.length} overallocated
                    </div>
                    <div className="text-[9px] text-slate-500">{overallocated[0].name} @ {overallocated[0].utilization}%</div>
                  </div>
                )}
              </div>
              <div className="space-y-2.5 flex-1">
                {topCrew.map((c) => (
                  <div key={c.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-slate-900 font-medium truncate">
                        {c.name}
                      </span>
                      <span
                        className="text-[10px] font-bold"
                        style={{ color: crewStatusColor[c.status] }}
                      >
                        {c.utilization}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[#E2E8F0] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(c.utilization, 100)}%`,
                          backgroundColor: crewStatusColor[c.status],
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subcontractor strip */}
          <Card className="bg-white border-[#E2E8F0] shadow-sm flex flex-col">
            <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <Users className="w-4 h-4 text-[#0284C7]" />
                SUBCONTRACTOR STATUS
              </CardTitle>
              <Link
                href="/labor"
                className="text-xs text-[#0284C7] hover:text-slate-900 transition-colors font-medium"
              >
                View All
              </Link>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col">
              {subsAtRisk.length > 0 && (
                <div className="rounded-lg border border-[#F59E0B]/30 bg-[#F59E0B]/10 p-2.5 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#F59E0B] flex-shrink-0" />
                  <span className="text-[10px] text-slate-500">
                    <span className="font-semibold text-slate-900">{subsAtRisk.length} subs</span> need
                    attention (delayed / at risk)
                  </span>
                </div>
              )}
              <div className="space-y-2 flex-1">
                {activeSubs.slice(0, 6).map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-2"
                  >
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-slate-900 truncate">{s.name}</div>
                      <div className="text-[9px] text-slate-500 truncate">
                        {s.trade} · {s.assignedJob}
                      </div>
                    </div>
                    <span
                      className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded flex-shrink-0"
                      style={{
                        color: subStatusColor[s.status],
                        backgroundColor: `${subStatusColor[s.status]}1a`,
                      }}
                    >
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bid lifecycle strip */}
        <Card className="bg-white border-[#E2E8F0] shadow-sm">
          <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-900 tracking-wide">
              BID-TO-JOB LIFECYCLE
            </CardTitle>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">
              Research Less, Win More
            </span>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-1">
              {BID_LIFECYCLE.map((stage, i) => (
                <div key={stage} className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-1.5">
                    <span className="text-[10px] font-bold text-[#0284C7]">{i + 1}</span>
                    <span className="text-[11px] text-slate-700 whitespace-nowrap">{stage}</span>
                  </div>
                  {i < BID_LIFECYCLE.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-slate-500 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
