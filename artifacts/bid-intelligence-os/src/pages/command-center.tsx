import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/lib/context";
import { seedBids } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
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
  dailyBriefing,
  BID_LIFECYCLE,
  type AlertSeverity,
  type ScheduleType,
  type SubStatus,
  type CrewStatus,
  type RiskBand,
} from "@/lib/operations";
import { Link } from "wouter";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
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

  const activeBids = seedBids.filter(
    (b) => b.status === "In Progress" || b.status === "Review"
  );
  const openBidValue = activeBids.reduce((sum, b) => sum + b.amount, 0);
  const jobsInProgress = jobDeployments.filter((j) => j.status === "In Progress");
  const wonJobsCount = jobDeployments.length;
  const activeAlerts = alertItems.filter((a) => !a.resolved);
  const criticalAlerts = activeAlerts.filter((a) => a.severity === "Critical");
  const avgRoi =
    costRecords.reduce((sum, r) => sum + r.projectedRoi, 0) / costRecords.length;

  const todaySchedule = scheduleEvents
    .filter((e) => e.dayIndex === 1)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const criticalPermits = permitItems.filter(
    (p) => p.status === "Expiring" || p.status === "Blocked" || p.status === "Needed"
  );
  const permitSnapshot = permitItems
    .filter((p) => p.critical || p.status === "Expiring" || p.status === "Blocked")
    .slice(0, 5);

  const avgUtilization = Math.round(
    crewMembers.reduce((sum, c) => sum + c.utilization, 0) / crewMembers.length
  );
  const overallocated = crewMembers.filter((c) => c.status === "Overallocated");
  const topCrew = [...crewMembers]
    .sort((a, b) => b.utilization - a.utilization)
    .slice(0, 6);
  const subsAtRisk = subcontractors.filter(
    (s) => s.status === "At Risk" || s.status === "Delayed"
  );

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
      sub: `${jobDeployments.length} total deployments`,
      href: "/deployment",
    },
    {
      label: "Won Jobs",
      value: wonJobsCount,
      icon: Trophy,
      color: "#22C55E",
      sub: `$${(
        jobDeployments.reduce((s, j) => s + j.contractValue, 0) / 1_000_000
      ).toFixed(2)}M contracted`,
      href: "/won-jobs",
    },
    {
      label: "Critical Alerts",
      value: criticalAlerts.length,
      icon: AlertTriangle,
      color: "#EF4444",
      sub: `${activeAlerts.length} active total`,
      href: "/alerts",
    },
    {
      label: "Avg Projected ROI",
      value: `${avgRoi.toFixed(1)}%`,
      icon: TrendingUp,
      color: "#38BDF8",
      sub: "Across active jobs",
      href: "/cost-roi",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome header */}
        <div className="rounded-xl border border-[#1C253B] bg-gradient-to-br from-[#0F1830] to-[#111A2E] p-6 relative overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-1/3 blueprint-texture opacity-20 pointer-events-none mix-blend-screen"></div>
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#38BDF8]">
                  Command Center
                </span>
                <span className="text-[10px] text-[#8A96B0]">·</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A96B0]">
                  {verticalConfig.name} Operations
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                {dailyBriefing.greeting}
              </h1>
              <p className="text-[#8A96B0] mt-1.5 max-w-2xl">{dailyBriefing.summary}</p>
              <p className="text-[11px] text-[#5b6680] mt-2">{dailyBriefing.date}</p>
            </div>
            <div className="flex flex-col items-start lg:items-end gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-[#0BA3A8]/40 bg-[#0BA3A8]/10 px-3 py-2">
                <Sparkles className="w-4 h-4 text-[#0BA3A8]" />
                <span className="text-xs text-[#5eead4]">
                  Try VoiceConnect: <span className="font-semibold text-white">"Show jobs at risk today"</span>
                </span>
              </div>
              <Link
                href="/briefings"
                className="text-xs text-[#38BDF8] hover:text-white transition-colors flex items-center gap-1 font-medium"
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
                <Card className="bg-[#0F1830] border-[#1C253B] shadow-sm relative overflow-hidden group cursor-pointer hover:border-[#2A3756] transition-colors h-full">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Icon className="w-10 h-10" style={{ color: kpi.color }} />
                  </div>
                  <CardContent className="p-4 relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4" style={{ color: kpi.color }} />
                      <span className="text-[10px] font-bold text-[#8A96B0] uppercase tracking-wider">
                        {kpi.label}
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-white tracking-tight">
                      {kpi.value}
                    </div>
                    <p className="text-[10px] text-[#8A96B0] mt-1 font-medium tracking-wide">
                      {kpi.sub}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Row: Daily Briefing + Today's Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-[#0F1830] border-[#1C253B] flex flex-col">
            <CardHeader className="p-4 border-b border-[#1C253B] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                DAILY INTELLIGENT BRIEFING
              </CardTitle>
              <Link
                href="/briefings"
                className="text-xs text-[#38BDF8] hover:text-white transition-colors flex items-center gap-1 font-medium"
              >
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {dailyBriefing.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-[#1C253B] bg-[#151D2E] p-3"
                  >
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-[10px] text-[#8A96B0] uppercase tracking-wider mt-0.5 leading-tight">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2.5">
                {dailyBriefing.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-[#1C253B] bg-[#151D2E] p-3 flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span
                        className="mt-1 w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: severityColor[item.priority] }}
                      ></span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-white">
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
                          <span className="text-[9px] font-bold uppercase tracking-widest text-[#8A96B0]">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8A96B0] mt-1 leading-snug">
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
                      className="flex-shrink-0 px-2.5 py-1.5 rounded bg-[#1C253B] hover:bg-[#2A3756] text-white text-[10px] font-semibold transition-colors whitespace-nowrap"
                    >
                      {item.action}
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0F1830] border-[#1C253B] flex flex-col">
            <CardHeader className="p-4 border-b border-[#1C253B] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <CalendarRange className="w-4 h-4 text-[#38BDF8]" />
                TODAY · TUE JUL 1
              </CardTitle>
              <Link
                href="/scheduling"
                className="text-xs text-[#38BDF8] hover:text-white transition-colors font-medium"
              >
                Schedule
              </Link>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
              <div className="divide-y divide-[#1C253B]">
                {todaySchedule.map((event) => (
                  <div key={event.id} className="p-3 hover:bg-[#151D2E] transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 min-w-0">
                        <span
                          className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: scheduleTypeColor[event.type] }}
                        ></span>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-white truncate">
                            {event.title}
                          </div>
                          <div className="text-[10px] text-[#8A96B0] mt-0.5">
                            {event.jobName} · {event.assignee}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-[10px] text-[#8A96B0] flex items-center gap-1 justify-end">
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
              <div className="p-3 border-t border-[#1C253B] mt-auto">
                <Link href="/scheduling">
                  <button className="w-full py-2 bg-[#1C253B] hover:bg-[#2A3756] text-white text-xs font-semibold rounded transition-colors flex items-center justify-center gap-2">
                    Open Weekly Schedule <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row: Cost-to-date chart + Weather Watch */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-[#0F1830] border-[#1C253B] flex flex-col">
            <CardHeader className="p-4 border-b border-[#1C253B] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#38BDF8]" />
                COST-TO-DATE · BUDGET VS ACTUAL
              </CardTitle>
              <Link
                href="/cost-roi"
                className="text-xs text-[#38BDF8] hover:text-white transition-colors font-medium"
              >
                Cost & ROI
              </Link>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col">
              <div className="flex gap-4 mb-4 text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-1.5 text-[#38BDF8]">
                  <span className="w-2 h-2 rounded-full bg-[#38BDF8]"></span>Budget
                </div>
                <div className="flex items-center gap-1.5 text-[#F59E0B]">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>Actual
                </div>
              </div>
              <div className="h-48 w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={costToDateSeries}
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#1C253B" vertical={false} />
                    <XAxis
                      dataKey="week"
                      stroke="#8A96B0"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#8A96B0"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "#0F1830",
                        borderColor: "#1C253B",
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
              <p className="text-[10px] text-[#5b6680] mt-3 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-[#38BDF8]" />
                Decision-support guidance only. Projections require user verification.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#0F1830] border-[#1C253B] flex flex-col">
            <CardHeader className="p-4 border-b border-[#1C253B] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-[#38BDF8]" />
                WEATHER WATCH
              </CardTitle>
              <Link
                href="/weather"
                className="text-xs text-[#38BDF8] hover:text-white transition-colors font-medium"
              >
                All Sites
              </Link>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
              <div className="divide-y divide-[#1C253B]">
                {jobsiteWeather.map((site) => (
                  <div key={site.jobId} className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate">
                          {site.jobName}
                        </div>
                        <div className="text-[10px] text-[#8A96B0]">{site.location}</div>
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
                          return <Icon className="w-4 h-4 text-[#8A96B0]" />;
                        })()}
                        <span className="text-xs text-white font-medium">
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
                    <p className="text-[10px] text-[#8A96B0] leading-snug">
                      {site.recommendation}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-[#1C253B] mt-auto">
                <p className="text-[10px] text-[#5b6680] leading-snug">
                  {verticalConfig.weatherNote}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row: Permit tracker + Labor utilization + Subcontractor strip */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Permit tracker */}
          <Card className="bg-[#0F1830] border-[#1C253B] flex flex-col">
            <CardHeader className="p-4 border-b border-[#1C253B] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#38BDF8]" />
                PERMIT TRACKER
              </CardTitle>
              <Link
                href="/permits"
                className="text-xs text-[#38BDF8] hover:text-white transition-colors font-medium"
              >
                All Permits
              </Link>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col">
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 p-2 text-center">
                  <div className="text-xl font-bold text-[#EF4444]">
                    {permitItems.filter((p) => p.status === "Blocked").length}
                  </div>
                  <div className="text-[9px] text-[#8A96B0] uppercase tracking-wider">Blocked</div>
                </div>
                <div className="rounded-lg border border-[#F59E0B]/30 bg-[#F59E0B]/10 p-2 text-center">
                  <div className="text-xl font-bold text-[#F59E0B]">
                    {permitItems.filter((p) => p.status === "Expiring").length}
                  </div>
                  <div className="text-[9px] text-[#8A96B0] uppercase tracking-wider">Expiring</div>
                </div>
                <div className="rounded-lg border border-[#38BDF8]/30 bg-[#38BDF8]/10 p-2 text-center">
                  <div className="text-xl font-bold text-[#38BDF8]">{criticalPermits.length}</div>
                  <div className="text-[9px] text-[#8A96B0] uppercase tracking-wider">Needs Action</div>
                </div>
              </div>
              <div className="space-y-2 flex-1">
                {permitSnapshot.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-[#1C253B] bg-[#151D2E] p-2"
                  >
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-white truncate">{p.name}</div>
                      <div className="text-[9px] text-[#8A96B0] truncate">{p.jobName}</div>
                    </div>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded flex-shrink-0 ${
                        p.status === "Blocked" || p.status === "Needed"
                          ? "text-[#EF4444] bg-[#EF4444]/10"
                          : p.status === "Expiring"
                          ? "text-[#F59E0B] bg-[#F59E0B]/10"
                          : "text-[#38BDF8] bg-[#38BDF8]/10"
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
          <Card className="bg-[#0F1830] border-[#1C253B] flex flex-col">
            <CardHeader className="p-4 border-b border-[#1C253B] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <HardHat className="w-4 h-4 text-[#38BDF8]" />
                LABOR UTILIZATION
              </CardTitle>
              <Link
                href="/labor"
                className="text-xs text-[#38BDF8] hover:text-white transition-colors font-medium"
              >
                Labor & Subs
              </Link>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-2xl font-bold text-white">{avgUtilization}%</div>
                  <div className="text-[10px] text-[#8A96B0] uppercase tracking-wider">
                    Avg utilization
                  </div>
                </div>
                {overallocated.length > 0 && (
                  <div className="rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 px-2.5 py-1.5 text-right">
                    <div className="text-sm font-bold text-[#EF4444]">
                      {overallocated.length} overallocated
                    </div>
                    <div className="text-[9px] text-[#8A96B0]">{overallocated[0].name} @ {overallocated[0].utilization}%</div>
                  </div>
                )}
              </div>
              <div className="space-y-2.5 flex-1">
                {topCrew.map((c) => (
                  <div key={c.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-white font-medium truncate">
                        {c.name}
                      </span>
                      <span
                        className="text-[10px] font-bold"
                        style={{ color: crewStatusColor[c.status] }}
                      >
                        {c.utilization}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[#1C253B] overflow-hidden">
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
          <Card className="bg-[#0F1830] border-[#1C253B] flex flex-col">
            <CardHeader className="p-4 border-b border-[#1C253B] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <Users className="w-4 h-4 text-[#38BDF8]" />
                SUBCONTRACTOR STATUS
              </CardTitle>
              <Link
                href="/labor"
                className="text-xs text-[#38BDF8] hover:text-white transition-colors font-medium"
              >
                View All
              </Link>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col">
              {subsAtRisk.length > 0 && (
                <div className="rounded-lg border border-[#F59E0B]/30 bg-[#F59E0B]/10 p-2.5 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#F59E0B] flex-shrink-0" />
                  <span className="text-[10px] text-[#8A96B0]">
                    <span className="font-semibold text-white">{subsAtRisk.length} subs</span> need
                    attention (delayed / at risk)
                  </span>
                </div>
              )}
              <div className="space-y-2 flex-1">
                {subcontractors.slice(0, 6).map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-[#1C253B] bg-[#151D2E] p-2"
                  >
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-white truncate">{s.name}</div>
                      <div className="text-[9px] text-[#8A96B0] truncate">
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
        <Card className="bg-[#0F1830] border-[#1C253B]">
          <CardHeader className="p-4 border-b border-[#1C253B] flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-white tracking-wide">
              BID-TO-JOB LIFECYCLE
            </CardTitle>
            <span className="text-[10px] text-[#8A96B0] uppercase tracking-widest">
              Research Less, Win More
            </span>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-1">
              {BID_LIFECYCLE.map((stage, i) => (
                <div key={stage} className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-2 rounded-full border border-[#1C253B] bg-[#151D2E] px-3 py-1.5">
                    <span className="text-[10px] font-bold text-[#38BDF8]">{i + 1}</span>
                    <span className="text-[11px] text-[#c3ccdd] whitespace-nowrap">{stage}</span>
                  </div>
                  {i < BID_LIFECYCLE.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-[#5b6680] flex-shrink-0" />
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
