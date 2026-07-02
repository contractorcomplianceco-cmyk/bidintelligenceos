import { useMemo, useState } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/lib/context";
import {
  riskItems,
  changeOrders,
  profitFadeSignals,
  riskStats,
  type RiskItem,
  type RiskCategory,
  type RiskSeverity,
  type RiskStatus,
  type ChangeOrder,
  type ChangeOrderStatus,
  type DetectionSource,
} from "@/lib/risk";
import {
  ShieldAlert,
  AlertTriangle,
  CloudRain,
  Users,
  FileCheck2,
  Ruler,
  DollarSign,
  FileText,
  TrendingDown,
  Info,
  Radar,
  Radio,
  Bot,
  ClipboardCheck,
  Briefcase,
  Clock,
  ArrowRight,
  CircleDot,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const fmtFull = (n: number) => `$${n.toLocaleString()}`;
const fmtCompact = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(1)}K` : `$${n}`;

const SEVERITY_ORDER: RiskSeverity[] = ["Critical", "High", "Medium", "Low"];

const SEVERITY_META: Record<
  RiskSeverity,
  { color: string; bg: string; border: string }
> = {
  Critical: { color: "#EF4444", bg: "rgba(239,68,68,0.10)", border: "rgba(239,68,68,0.30)" },
  High: { color: "#F59E0B", bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.30)" },
  Medium: { color: "#0EA5E9", bg: "rgba(56,189,248,0.10)", border: "rgba(56,189,248,0.30)" },
  Low: { color: "#64748B", bg: "rgba(138,150,176,0.10)", border: "rgba(138,150,176,0.30)" },
};

const CATEGORY_META: Record<
  RiskCategory,
  { icon: typeof CloudRain; color: string }
> = {
  Weather: { icon: CloudRain, color: "#0EA5E9" },
  Labor: { icon: Users, color: "#A855F7" },
  Permit: { icon: FileCheck2, color: "#F59E0B" },
  Scope: { icon: Ruler, color: "#0EA5E9" },
  Cost: { icon: DollarSign, color: "#22C55E" },
};

const CATEGORIES: RiskCategory[] = ["Weather", "Labor", "Permit", "Scope", "Cost"];

const STATUS_META: Record<
  RiskStatus,
  { icon: typeof CircleDot; color: string; bg: string; border: string }
> = {
  Open: { icon: CircleDot, color: "#EF4444", bg: "rgba(239,68,68,0.10)", border: "rgba(239,68,68,0.30)" },
  Mitigating: { icon: Loader2, color: "#F59E0B", bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.30)" },
  Resolved: { icon: CheckCircle2, color: "#22C55E", bg: "rgba(34,197,94,0.10)", border: "rgba(34,197,94,0.30)" },
};

const CO_STATUS_META: Record<
  ChangeOrderStatus,
  { color: string; bg: string; border: string }
> = {
  Draft: { color: "#64748B", bg: "rgba(138,150,176,0.10)", border: "rgba(138,150,176,0.30)" },
  Submitted: { color: "#0EA5E9", bg: "rgba(56,189,248,0.10)", border: "rgba(56,189,248,0.30)" },
  Approved: { color: "#22C55E", bg: "rgba(34,197,94,0.10)", border: "rgba(34,197,94,0.30)" },
  Disputed: { color: "#EF4444", bg: "rgba(239,68,68,0.10)", border: "rgba(239,68,68,0.30)" },
};

function detectionMeta(source: DetectionSource): { icon: typeof Bot; color: string } {
  if (source === "Field report via VoiceConnect") return { icon: Radio, color: "#0BA3A8" };
  if (source === "Risk Radar AI") return { icon: Bot, color: "#0EA5E9" };
  return { icon: ClipboardCheck, color: "#64748B" };
}

export default function Risk() {
  const { verticalConfig } = useAppContext();
  const [severityFilter, setSeverityFilter] = useState<RiskSeverity | "All">("All");
  const [categoryFilter, setCategoryFilter] = useState<RiskCategory | "All">("All");
  const [selectedCoId, setSelectedCoId] = useState<string>(
    changeOrders.find((c) => c.status === "Disputed")?.id ?? changeOrders[0].id
  );

  const filteredRisks = useMemo(() => {
    return riskItems
      .filter((r) => (severityFilter === "All" ? true : r.severity === severityFilter))
      .filter((r) => (categoryFilter === "All" ? true : r.category === categoryFilter))
      .sort((a, b) => {
        if (a.status === "Resolved" && b.status !== "Resolved") return 1;
        if (b.status === "Resolved" && a.status !== "Resolved") return -1;
        return SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity);
      });
  }, [severityFilter, categoryFilter]);

  const selectedCo = changeOrders.find((c) => c.id === selectedCoId) ?? changeOrders[0];

  return (
    <Layout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Radar className="w-7 h-7 text-[#0284C7]" />
              Risk &amp; Change Orders
            </h1>
            <p className="text-slate-500 mt-1">
              Risk radar, change-order tracking, and profit-fade watch across active{" "}
              {verticalConfig.name} deployments.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2">
            <Info className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
            <span className="text-[11px] text-slate-500">
              AI detections are flagged for review — decision support only.
            </span>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <KpiCard
            icon={ShieldAlert}
            color="#0EA5E9"
            label="Open Risks"
            value={String(riskStats.openRisks)}
            sub={`${riskStats.mitigating} mitigating · ${riskStats.resolved} resolved`}
          />
          <KpiCard
            icon={AlertTriangle}
            color="#EF4444"
            label="High Severity"
            value={String(riskStats.highSeverity)}
            sub="Critical + High, still active"
          />
          <KpiCard
            icon={FileText}
            color="#F59E0B"
            label="Pending COs"
            value={String(riskStats.pendingChangeOrders)}
            sub="Draft + submitted"
          />
          <KpiCard
            icon={DollarSign}
            color="#F59E0B"
            label="CO Value at Stake"
            value={fmtCompact(riskStats.changeOrderValueAtStake)}
            sub={`${fmtCompact(riskStats.disputedChangeOrderValue)} disputed`}
          />
          <KpiCard
            icon={TrendingDown}
            color="#EF4444"
            label="Jobs w/ Profit Fade"
            value={String(riskStats.jobsWithProfitFade)}
            sub={`Avg ${riskStats.avgMarginFade.toFixed(1)}pt margin drift`}
          />
        </div>

        {/* Risk Radar board */}
        <Card className="bg-white border-[#E2E8F0] shadow-sm flex flex-col">
          <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-col gap-4">
            <div className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <Radar className="w-4 h-4 text-[#0284C7]" />
                RISK RADAR
              </CardTitle>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {filteredRisks.length} shown
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mr-1">
                  Severity
                </span>
                <FilterChip
                  label="All"
                  active={severityFilter === "All"}
                  onClick={() => setSeverityFilter("All")}
                />
                {SEVERITY_ORDER.map((sev) => (
                  <FilterChip
                    key={sev}
                    label={sev}
                    dotColor={SEVERITY_META[sev].color}
                    active={severityFilter === sev}
                    onClick={() => setSeverityFilter(severityFilter === sev ? "All" : sev)}
                  />
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mr-1">
                  Category
                </span>
                <FilterChip
                  label="All"
                  active={categoryFilter === "All"}
                  onClick={() => setCategoryFilter("All")}
                />
                {CATEGORIES.map((cat) => (
                  <FilterChip
                    key={cat}
                    label={cat}
                    icon={CATEGORY_META[cat].icon}
                    active={categoryFilter === cat}
                    onClick={() => setCategoryFilter(categoryFilter === cat ? "All" : cat)}
                  />
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {filteredRisks.length === 0 ? (
              <div className="p-10 text-center text-slate-500 text-sm flex flex-col items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-[#22C55E]" />
                No risks match the current filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredRisks.map((item) => (
                  <RiskCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Change Orders: table + detail card */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="bg-white border-[#E2E8F0] shadow-sm flex flex-col xl:col-span-2">
            <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0284C7]" />
                CHANGE ORDERS
              </CardTitle>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {changeOrders.length} total ·{" "}
                <span className="text-[#22C55E]">
                  {fmtCompact(riskStats.approvedChangeOrderValue)} approved
                </span>
              </span>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[720px]">
                <thead className="bg-[#F1F5F9] border-b border-[#E2E8F0]">
                  <tr>
                    {["CO #", "Job / Title", "Origin", "Amount", "Status", "Days Pending"].map(
                      (h, i) => (
                        <th
                          key={h}
                          className={`px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap ${
                            i >= 3 ? "text-right" : ""
                          }`}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {changeOrders.map((co) => {
                    const meta = CO_STATUS_META[co.status];
                    const selected = co.id === selectedCoId;
                    return (
                      <tr
                        key={co.id}
                        onClick={() => setSelectedCoId(co.id)}
                        className={`transition-colors cursor-pointer ${
                          selected ? "bg-[#F1F5F9]" : "hover:bg-[#F1F5F9]"
                        }`}
                      >
                        <td className="px-3 py-3 text-xs font-semibold text-[#0284C7] whitespace-nowrap">
                          {co.coNumber}
                        </td>
                        <td className="px-3 py-3">
                          <div className="text-xs font-semibold text-slate-900">{co.title}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{co.jobName}</div>
                        </td>
                        <td className="px-3 py-3 text-[11px] text-slate-500 max-w-[200px]">
                          {co.origin}
                        </td>
                        <td className="px-3 py-3 text-right text-xs font-semibold text-slate-900 whitespace-nowrap">
                          {fmtFull(co.amount)}
                        </td>
                        <td className="px-3 py-3 text-right whitespace-nowrap">
                          <span
                            className="inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                            style={{
                              color: meta.color,
                              backgroundColor: meta.bg,
                              border: `1px solid ${meta.border}`,
                            }}
                          >
                            {co.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right text-xs whitespace-nowrap">
                          {co.daysPending > 0 ? (
                            <span
                              className={
                                co.daysPending >= 10
                                  ? "text-[#EF4444] font-semibold"
                                  : co.daysPending >= 5
                                    ? "text-[#F59E0B] font-semibold"
                                    : "text-slate-500"
                              }
                            >
                              {co.daysPending}d
                            </span>
                          ) : (
                            <span className="text-[#22C55E]">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <ChangeOrderDetail co={selectedCo} />
        </div>

        {/* Profit Fade watch */}
        <Card className="bg-white border-[#E2E8F0] shadow-sm flex flex-col">
          <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-[#EF4444]" />
              PROFIT FADE WATCH
            </CardTitle>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Projected margin trend · flagged for review
            </span>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profitFadeSignals.map((signal) => (
                <ProfitFadeCard key={signal.jobId} signal={signal} />
              ))}
            </div>
          </CardContent>
        </Card>

        <p className="text-[11px] text-slate-500 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
          Risk Radar signals and margin projections are AI-assisted decision support flagged for
          human review. Figures are directional, not guaranteed outcomes, and no internal pricing
          formula or margin strategy is exposed.
        </p>
      </div>
    </Layout>
  );
}

function KpiCard({
  icon: Icon,
  color,
  label,
  value,
  sub,
}: {
  icon: typeof ShieldAlert;
  color: string;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <Card className="bg-white border-[#E2E8F0] shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="w-10 h-10" style={{ color }} />
      </div>
      <CardContent className="p-4 relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-4 h-4" style={{ color }} />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {label}
          </span>
        </div>
        <div className="text-3xl font-bold text-slate-900 tracking-tight">{value}</div>
        <p className="text-[10px] text-slate-500 mt-1 font-medium tracking-wide">{sub}</p>
      </CardContent>
    </Card>
  );
}

function FilterChip({
  label,
  icon: Icon,
  active,
  dotColor,
  onClick,
}: {
  label: string;
  icon?: typeof CloudRain;
  active: boolean;
  dotColor?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
        active
          ? "border-[#38BDF8]/40 bg-[#38BDF8]/10 text-[#0284C7]"
          : "border-[#E2E8F0] bg-white text-slate-500 hover:text-slate-900 hover:border-[#CBD5E1]"
      }`}
    >
      {dotColor && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />}
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </button>
  );
}

function RiskCard({ item }: { item: RiskItem }) {
  const sev = SEVERITY_META[item.severity];
  const cat = CATEGORY_META[item.category];
  const CatIcon = cat.icon;
  const status = STATUS_META[item.status];
  const StatusIcon = status.icon;
  const det = detectionMeta(item.detectedBy);
  const DetIcon = det.icon;

  return (
    <div
      className="rounded-xl border bg-white p-4 flex flex-col gap-3 transition-colors hover:border-[#CBD5E1]"
      style={{ borderColor: item.status === "Resolved" ? "#E2E8F0" : sev.border }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: sev.bg, border: `1px solid ${sev.border}` }}
          >
            <CatIcon className="w-4.5 h-4.5" style={{ color: cat.color }} />
          </div>
          <div className="flex flex-col gap-1">
            <span
              className="inline-flex w-fit items-center rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest"
              style={{ color: sev.color, backgroundColor: sev.bg, border: `1px solid ${sev.border}` }}
            >
              {item.severity}
            </span>
            <span className="inline-flex w-fit items-center gap-1 rounded bg-[#E2E8F0] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-500">
              {item.category}
            </span>
          </div>
        </div>
        <span
          className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest"
          style={{ color: status.color, backgroundColor: status.bg, border: `1px solid ${status.border}` }}
        >
          <StatusIcon className="w-3 h-3" />
          {item.status}
        </span>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 leading-snug">{item.title}</h3>
        <p className="text-[12px] text-slate-500 leading-snug mt-1">{item.description}</p>
      </div>

      <div
        className="rounded-lg border border-[#E2E8F0] bg-white p-2.5 flex items-start gap-2"
      >
        <ArrowRight className="w-3.5 h-3.5 text-[#0284C7] shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-700 leading-snug">{item.recommendedAction}</p>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-500 pt-1 border-t border-[#E2E8F0]">
        <span className="inline-flex items-center gap-1">
          <Briefcase className="w-3 h-3" />
          {item.jobName}
        </span>
        <span className="inline-flex items-center gap-1" style={{ color: det.color }}>
          <DetIcon className="w-3 h-3" />
          {item.detectedBy}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {item.detectedAt}
        </span>
      </div>
    </div>
  );
}

function ChangeOrderDetail({ co }: { co: ChangeOrder }) {
  const meta = CO_STATUS_META[co.status];
  const det = detectionMeta(co.detectedBy);
  const DetIcon = det.icon;

  return (
    <Card className="bg-white border-[#E2E8F0] shadow-sm flex flex-col">
      <CardHeader className="p-4 border-b border-[#E2E8F0]">
        <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#0284C7]" />
          CHANGE ORDER DETAIL
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-[#0284C7]">{co.coNumber}</span>
          <span
            className="inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
            style={{ color: meta.color, backgroundColor: meta.bg, border: `1px solid ${meta.border}` }}
          >
            {co.status}
          </span>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 leading-snug">{co.title}</h3>
          <p className="text-[12px] text-slate-500 mt-1 flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            {co.jobName}
          </p>
        </div>

        <div className="rounded-lg border border-[#E2E8F0] bg-white p-3">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
            Origin
          </div>
          <p className="text-[12px] text-slate-700">{co.origin}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-[#E2E8F0] bg-white p-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
              Amount
            </div>
            <div className="text-xl font-bold text-slate-900">{fmtFull(co.amount)}</div>
          </div>
          <div className="rounded-lg border border-[#E2E8F0] bg-white p-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
              Days Pending
            </div>
            <div
              className="text-xl font-bold"
              style={{
                color:
                  co.daysPending >= 10
                    ? "#EF4444"
                    : co.daysPending >= 5
                      ? "#F59E0B"
                      : co.daysPending > 0
                        ? "#0EA5E9"
                        : "#22C55E",
              }}
            >
              {co.daysPending > 0 ? `${co.daysPending} days` : "Closed"}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-[11px] text-slate-500 pt-1 border-t border-[#E2E8F0]">
          <span className="inline-flex items-center gap-1.5">
            <ArrowRight className="w-3.5 h-3.5 text-[#0284C7]" />
            Submitted to: <span className="text-slate-900 font-medium">{co.submittedTo}</span>
          </span>
          <span className="inline-flex items-center gap-1.5" style={{ color: det.color }}>
            <DetIcon className="w-3.5 h-3.5" />
            {co.detectedBy}
          </span>
        </div>

        {co.status === "Disputed" && (
          <div className="rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 p-2.5 flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444] shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-700 leading-snug">
              Flagged for review: disputed for {co.daysPending} days. Recommend a documented
              cost-and-schedule justification package before the next owner meeting.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ProfitFadeCard({ signal }: { signal: (typeof profitFadeSignals)[number] }) {
  const fade = signal.baselineMargin - signal.currentMargin;
  const chartData = signal.trend;
  const values = chartData.map((p) => p.projected);
  const min = Math.min(...values, signal.currentMargin);
  const max = Math.max(...values, signal.baselineMargin);

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{signal.jobName}</h3>
          <div className="flex items-center gap-3 mt-1 text-[11px]">
            <span className="text-slate-500">
              Baseline{" "}
              <span className="text-slate-900 font-semibold">{signal.baselineMargin.toFixed(1)}%</span>
            </span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="text-slate-500">
              Current{" "}
              <span className="text-[#F59E0B] font-semibold">
                {signal.currentMargin.toFixed(1)}%
              </span>
            </span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/30">
          <TrendingDown className="w-3 h-3" />
          {fade.toFixed(1)}pt
        </span>
      </div>

      <div className="h-24 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id={`fade-${signal.jobId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="week" stroke="#64748B" fontSize={9} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#64748B"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              domain={[Math.floor(min) - 1, Math.ceil(max) + 1]}
              tickFormatter={(v) => `${v}%`}
            />
            <RechartsTooltip
              contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", fontSize: "12px" }}
              formatter={(v: number) => [`${v.toFixed(1)}%`, "Projected margin"]}
            />
            <ReferenceLine
              y={signal.baselineMargin}
              stroke="#22C55E"
              strokeDasharray="4 4"
              strokeOpacity={0.5}
            />
            <Area
              type="monotone"
              dataKey="projected"
              stroke="#F59E0B"
              fill={`url(#fade-${signal.jobId})`}
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-1 border-t border-[#E2E8F0]">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
          Fade Drivers · flagged for review
        </div>
        <div className="flex flex-wrap gap-1.5">
          {signal.fadeDrivers.map((driver) => (
            <span
              key={driver}
              className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20"
            >
              {driver}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
