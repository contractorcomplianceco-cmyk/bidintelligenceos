import { useMemo, useState } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { analyticsData } from "@core/data";
import { costRecords, jobDeployments } from "@core/operations";
import { useAppContext } from "@/lib/context";
import { useToast } from "@/hooks/use-toast";
import {
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  BarChart3,
  Lightbulb,
  ArrowRight,
  Percent,
  Trophy,
  Download,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";

const tooltipStyle = {
  backgroundColor: "#FFFFFF",
  borderColor: "#E2E8F0",
  borderRadius: "8px",
  fontSize: "12px",
  color: "#0F172A",
};

const LOSS_COLORS = ["#EF4444", "#F59E0B", "#38BDF8", "#8A96B0", "#A855F7"];

export default function Analytics() {
  const { verticalConfig } = useAppContext();
  const { toast } = useToast();
  const [range, setRange] = useState<"6M" | "12M">("12M");

  const winRateSeries = useMemo(
    () => (range === "6M" ? analyticsData.winRateOverTime.slice(-6) : analyticsData.winRateOverTime),
    [range]
  );

  const currentWinRate = analyticsData.winRateOverTime[analyticsData.winRateOverTime.length - 1].rate;
  const priorWinRate = analyticsData.winRateOverTime[analyticsData.winRateOverTime.length - 2].rate;
  const winRateDelta = currentWinRate - priorWinRate;

  const currentMargin = analyticsData.marginTrend[analyticsData.marginTrend.length - 1].margin;
  const firstMargin = analyticsData.marginTrend[0].margin;
  const marginDelta = +(currentMargin - firstMargin).toFixed(1);

  const totalWon = analyticsData.projectTypes.reduce((s, p) => s + p.won, 0);
  const totalLost = analyticsData.projectTypes.reduce((s, p) => s + p.lost, 0);
  const totalOutcomes = totalWon + totalLost;

  const avgProjectedRoi = useMemo(
    () => +(costRecords.reduce((s, r) => s + r.projectedRoi, 0) / costRecords.length).toFixed(1),
    []
  );

  const roiByJob = useMemo(
    () =>
      [...costRecords]
        .sort((a, b) => b.projectedRoi - a.projectedRoi)
        .map((r) => ({
          name: r.jobName.replace(/ (Retrofit|Replacement|Electrical|Restoration|Buildout|Facilities)$/i, ""),
          projected: r.projectedRoi,
          actual: r.actualRoi,
        })),
    []
  );

  const completionData = useMemo(
    () =>
      [...jobDeployments]
        .sort((a, b) => b.completion - a.completion)
        .map((j) => ({ name: j.name, completion: j.completion, status: j.status })),
    []
  );

  const topLossReason = [...analyticsData.lossReasons].sort((a, b) => b.count - a.count)[0];
  const bestType = [...analyticsData.projectTypes].sort(
    (a, b) => b.won / (b.won + b.lost) - a.won / (a.won + a.lost)
  )[0];
  const weakestType = [...analyticsData.projectTypes].sort(
    (a, b) => a.won / (a.won + a.lost) - b.won / (b.won + b.lost)
  )[0];
  const fadeRiskJobs = costRecords.filter((r) => r.profitFadeRisk === "High");

  const insights = [
    {
      icon: TrendingUp,
      tone: "#22C55E",
      title: "Win rate momentum is positive",
      body: `Win rate climbed to ${currentWinRate}% (${winRateDelta >= 0 ? "+" : ""}${winRateDelta}pp vs prior month). Sustaining responsiveness on ${bestType.type} bids is compounding results.`,
    },
    {
      icon: Trophy,
      tone: "#38BDF8",
      title: `${bestType.type} is the strongest vertical`,
      body: `${bestType.type} converts at ${Math.round((bestType.won / (bestType.won + bestType.lost)) * 100)}% (${bestType.won} won / ${bestType.lost} lost). Prioritize similar scopes in the pipeline.`,
    },
    {
      icon: TrendingDown,
      tone: "#EF4444",
      title: `"${topLossReason.reason}" drives the most losses`,
      body: `${topLossReason.count} losses tied to this factor. ${weakestType.type} lags at ${Math.round((weakestType.won / (weakestType.won + weakestType.lost)) * 100)}% win rate — revisit qualification and pricing posture there.`,
    },
    {
      icon: DollarSign,
      tone: "#F59E0B",
      title: "Profit-fade pattern detected on active jobs",
      body: `${fadeRiskJobs.length} active job${fadeRiskJobs.length === 1 ? "" : "s"} flagged High profit-fade risk (${fadeRiskJobs.map((j) => j.jobName.split(" ")[0]).join(", ")}). Margin trend is up ${marginDelta}pp overall, but change orders and labor burn need active recovery.`,
    },
  ];

  const kpis = [
    { label: "Win Rate", value: `${currentWinRate}%`, delta: `${winRateDelta >= 0 ? "+" : ""}${winRateDelta}pp MoM`, positive: winRateDelta >= 0, icon: Target, color: "#38BDF8" },
    { label: "Avg Gross Margin", value: `${currentMargin}%`, delta: `${marginDelta >= 0 ? "+" : ""}${marginDelta}pp YTD`, positive: marginDelta >= 0, icon: Percent, color: "#22C55E" },
    { label: "Avg Projected ROI", value: `${avgProjectedRoi}%`, delta: "Across active jobs", positive: true, icon: TrendingUp, color: "#0BA3A8" },
    { label: "Total Outcomes", value: `${totalOutcomes}`, delta: `${totalWon} won / ${totalLost} lost`, positive: true, icon: BarChart3, color: "#A855F7" },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <BarChart3 className="w-7 h-7 text-[#0284C7]" />
              Analytics
            </h1>
            <p className="text-slate-500 mt-1">
              Win/loss and performance intelligence for {verticalConfig.name}. Decision-support guidance only.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-[#E2E8F0] bg-white p-1">
              {(["6M", "12M"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                    range === r ? "bg-[#2563EB] text-white" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {r === "6M" ? "6 Months" : "12 Months"}
                </button>
              ))}
            </div>
            <button
              onClick={() =>
                toast({ title: "Export queued", description: "Analytics report is being compiled. Review before sharing." })
              }
              className="flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg border border-[#E2E8F0] bg-white text-slate-500 hover:text-slate-900 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-xl border border-[#E2E8F0] bg-white p-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <k.icon className="w-10 h-10" style={{ color: k.color }} />
              </div>
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <k.icon className="w-4 h-4" style={{ color: k.color }} />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{k.label}</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 tracking-tight relative z-10">{k.value}</div>
              <p
                className={`text-[10px] mt-1 font-medium tracking-wide relative z-10 ${
                  k.positive ? "text-[#22C55E]" : "text-[#EF4444]"
                }`}
              >
                {k.delta}
              </p>
            </div>
          ))}
        </div>

        {/* Win Rate + Margin Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-white border-[#E2E8F0]">
            <CardHeader className="p-5 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide">WIN RATE OVER TIME</CardTitle>
              <span className="text-xs text-slate-500">{range === "6M" ? "Last 6 months" : "Trailing 12 months"}</span>
            </CardHeader>
            <CardContent className="p-5">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={winRateSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="winGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} unit="%" />
                    <RechartsTooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "Win Rate"]} />
                    <Area type="monotone" dataKey="rate" stroke="#38BDF8" strokeWidth={2} fill="url(#winGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E2E8F0]">
            <CardHeader className="p-5 border-b border-[#E2E8F0]">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide">GROSS MARGIN TREND</CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.marginTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} unit="%" domain={["dataMin - 1", "dataMax + 1"]} />
                    <RechartsTooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "Margin"]} />
                    <Line type="monotone" dataKey="margin" stroke="#22C55E" strokeWidth={2} dot={{ r: 3, fill: "#22C55E" }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bid Outcomes + Win/Loss by type */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-white border-[#E2E8F0]">
            <CardHeader className="p-5 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide">BID OUTCOME TIMELINE ($M)</CardTitle>
              <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1.5 text-[#22C55E]"><span className="w-2 h-2 rounded-full bg-[#22C55E]" />Won</span>
                <span className="flex items-center gap-1.5 text-[#EF4444]"><span className="w-2 h-2 rounded-full bg-[#EF4444]" />Lost</span>
                <span className="flex items-center gap-1.5 text-slate-500"><span className="w-2 h-2 rounded-full bg-[#8A96B0]" />No Decision</span>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.bidOutcomeTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} unit="M" />
                    <RechartsTooltip contentStyle={tooltipStyle} formatter={(v: number) => `$${v}M`} />
                    <Bar dataKey="won" stackId="a" fill="#22C55E" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="lost" stackId="a" fill="#EF4444" />
                    <Bar dataKey="noDecision" stackId="a" fill="#8A96B0" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E2E8F0]">
            <CardHeader className="p-5 border-b border-[#E2E8F0]">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide">WIN / LOSS BY TYPE</CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.projectTypes} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                    <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="type" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} width={70} />
                    <RechartsTooltip contentStyle={tooltipStyle} cursor={{ fill: "#E2E8F0" }} />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Bar dataKey="won" name="Won" stackId="b" fill="#22C55E" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="lost" name="Lost" stackId="b" fill="#EF4444" radius={[0, 3, 3, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loss reasons + ROI by job */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-white border-[#E2E8F0]">
            <CardHeader className="p-5 border-b border-[#E2E8F0]">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide">LOSS REASONS</CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-32 h-32 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.lossReasons}
                        dataKey="count"
                        nameKey="reason"
                        innerRadius={38}
                        outerRadius={62}
                        paddingAngle={2}
                        stroke="none"
                      >
                        {analyticsData.lossReasons.map((_, i) => (
                          <Cell key={i} fill={LOSS_COLORS[i % LOSS_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {analyticsData.lossReasons.map((r, i) => (
                    <div key={r.reason} className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-2 text-slate-500">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: LOSS_COLORS[i % LOSS_COLORS.length] }} />
                        {r.reason}
                      </span>
                      <span className="font-bold text-slate-900">{r.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 bg-white border-[#E2E8F0]">
            <CardHeader className="p-5 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide">ROI BY JOB — PROJECTED VS ACTUAL</CardTitle>
              <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1.5 text-[#0BA3A8]"><span className="w-2 h-2 rounded-full bg-[#0BA3A8]" />Projected</span>
                <span className="flex items-center gap-1.5 text-[#0284C7]"><span className="w-2 h-2 rounded-full bg-[#38BDF8]" />Actual</span>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roiByJob} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} interval={0} angle={-12} textAnchor="end" height={50} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} unit="%" />
                    <RechartsTooltip contentStyle={tooltipStyle} cursor={{ fill: "#E2E8F0" }} formatter={(v: number) => `${v}%`} />
                    <Bar dataKey="projected" name="Projected ROI" fill="#0BA3A8" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="actual" name="Actual ROI" fill="#38BDF8" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job completion progress */}
        <Card className="bg-white border-[#E2E8F0]">
          <CardHeader className="p-5 border-b border-[#E2E8F0]">
            <CardTitle className="text-sm font-bold text-slate-900 tracking-wide">JOB COMPLETION PROGRESS</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {completionData.map((j) => (
                <div key={j.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-slate-900 truncate pr-2">{j.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                          j.status === "Delayed"
                            ? "bg-[#EF4444]/10 text-[#EF4444]"
                            : j.status === "On Hold"
                            ? "bg-[#F59E0B]/10 text-[#F59E0B]"
                            : j.status === "Completed"
                            ? "bg-[#22C55E]/10 text-[#22C55E]"
                            : "bg-[#38BDF8]/10 text-[#0284C7]"
                        }`}
                      >
                        {j.status}
                      </span>
                      <span className="text-xs font-bold text-slate-900 w-9 text-right">{j.completion}%</span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#E2E8F0] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${j.completion}%`,
                        backgroundColor: j.status === "Delayed" ? "#EF4444" : "#38BDF8",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Post-job learning loop */}
        <Card className="bg-white border-[#E2E8F0]">
          <CardHeader className="p-5 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
              POST-JOB LEARNING LOOP
            </CardTitle>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">AI-synthesized insights</span>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((ins) => (
                <div key={ins.title} className="rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-4 flex gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${ins.tone}1A` }}
                  >
                    <ins.icon className="w-5 h-5" style={{ color: ins.tone }} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1">{ins.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{ins.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500 border-t border-[#E2E8F0] pt-4">
              <ArrowRight className="w-3.5 h-3.5 text-[#0284C7]" />
              Insights are decision-support only and require user verification before acting on client-facing output.
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
