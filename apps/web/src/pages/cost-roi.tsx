import { useMemo, useState } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/lib/context";
import { costRecords as seedCostRecords, costToDateSeries, laborBurnSeries } from "@core/operations";
import type { RiskLevel } from "@core/operations";
import { useAuth } from "@/lib/auth-context";
import { useLiveData } from "@/lib/data-mode";
import { useOpsCostRoi, useOpsLabor } from "@/hooks/use-ops";
import { DemoDataBadge } from "@/components/demo-data-badge";
import { OpsModuleEmpty } from "@/components/ops-module-empty";
import { AnalyticsChartEmpty } from "@/components/analytics-chart-empty";
import { buildLiveCostSnapshot } from "@/lib/live-analytics";
import {
  DollarSign,
  TrendingUp,
  Percent,
  Wallet,
  ShieldAlert,
  Info,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const fmtCurrency = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${(n / 1000).toFixed(0)}K`;

const fmtFull = (n: number) => `$${n.toLocaleString()}`;

const riskColor: Record<RiskLevel, string> = {
  High: "#EF4444",
  Medium: "#F59E0B",
  Low: "#22C55E",
};

const riskBadge: Record<RiskLevel, string> = {
  High: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
  Medium: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
  Low: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20",
};

export default function CostRoi() {
  const { verticalConfig } = useAppContext();
  const { isAuthenticated } = useAuth();
  const live = useLiveData(isAuthenticated);
  const { data: costData } = useOpsCostRoi();
  const { data: laborData } = useOpsLabor();
  const costRecords = live ? (costData?.records ?? []) : seedCostRecords;
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  if (live && costRecords.length === 0) {
    return (
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Wallet className="w-7 h-7 text-[#0284C7]" />
              Cost &amp; ROI
            </h1>
            <p className="text-slate-500 mt-1">
              Budget tracking across active {verticalConfig.name} deployments.
            </p>
          </div>
          <OpsModuleEmpty
            module="No cost records yet"
            description="Deploy won bids with budget and cost-to-date in job payload to populate cost tracking."
          />
        </div>
      </Layout>
    );
  }

  const kpis = useMemo(() => {
    if (live && costData?.summary) {
      return {
        totalContract: costData.summary.totalContract,
        totalCostToDate: costData.summary.totalCostToDate,
        avgMargin: costData.summary.avgMargin,
        avgProjRoi: costData.summary.avgProjectedRoi,
      };
    }
    const totalContract = costRecords.reduce((s, r) => s + r.bidAmount, 0);
    const totalCostToDate = costRecords.reduce((s, r) => s + r.actualCost, 0);
    const avgMargin =
      costRecords.reduce((s, r) => s + r.grossMargin, 0) / (costRecords.length || 1);
    const avgProjRoi =
      costRecords.reduce((s, r) => s + r.projectedRoi, 0) / (costRecords.length || 1);
    return { totalContract, totalCostToDate, avgMargin, avgProjRoi };
  }, [live, costData, costRecords]);

  const budgetVsActual = useMemo(
    () =>
      costRecords.map((r) => ({
        name: r.jobName.split(" ").slice(0, 2).join(" "),
        estimated: r.estimatedCost,
        actual: r.actualCost,
        jobId: r.jobId,
      })),
    [costRecords]
  );

  const liveCostSnapshot = useMemo(
    () => (live ? buildLiveCostSnapshot(costRecords) : []),
    [live, costRecords],
  );

  const liveLaborBurn = useMemo(() => {
    if (!live) return [];
    if (costData?.laborBurnSeries?.length) return costData.laborBurnSeries;
    if (laborData?.laborBurnSeries?.length) return laborData.laborBurnSeries;
    return [];
  }, [live, costData, laborData]);

  const activeRecords = selectedJob
    ? costRecords.filter((r) => r.jobId === selectedJob)
    : costRecords;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Wallet className="w-7 h-7 text-[#0284C7]" />
              Cost &amp; ROI
            </h1>
            <p className="text-slate-500 mt-1">
              Budget-versus-actual tracking and margin intelligence across active{" "}
              {verticalConfig.name} deployments.
            </p>
            {!live && <DemoDataBadge />}
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2">
            <Info className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
            <span className="text-[11px] text-slate-500">
              Decision-support guidance only. No internal pricing model is exposed.
            </span>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border-[#E2E8F0] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <DollarSign className="w-10 h-10 text-[#0284C7]" />
            </div>
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-[#0284C7]" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Total Contract Value
                </span>
              </div>
              <div className="text-3xl font-bold text-slate-900 tracking-tight">
                {fmtCurrency(kpis.totalContract)}
              </div>
              <p className="text-[10px] text-slate-500 mt-1 font-medium tracking-wide">
                Across {costRecords.length} active jobs
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E2E8F0] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Wallet className="w-10 h-10 text-[#F59E0B]" />
            </div>
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Total Cost-to-Date
                </span>
              </div>
              <div className="text-3xl font-bold text-slate-900 tracking-tight">
                {fmtCurrency(kpis.totalCostToDate)}
              </div>
              <p className="text-[10px] text-slate-500 mt-1 font-medium tracking-wide">
                {((kpis.totalCostToDate / kpis.totalContract) * 100).toFixed(0)}% of
                contract billed
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E2E8F0] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Percent className="w-10 h-10 text-[#22C55E]" />
            </div>
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Percent className="w-4 h-4 text-[#22C55E]" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Avg Gross Margin
                </span>
              </div>
              <div className="text-3xl font-bold text-slate-900 tracking-tight">
                {kpis.avgMargin.toFixed(1)}%
              </div>
              <p className="text-[10px] text-[#22C55E] mt-1 font-medium tracking-wide">
                Weighted across portfolio
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E2E8F0] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-10 h-10 text-[#0284C7]" />
            </div>
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-[#0284C7]" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Avg Projected ROI
                </span>
              </div>
              <div className="text-3xl font-bold text-slate-900 tracking-tight">
                {kpis.avgProjRoi.toFixed(1)}%
              </div>
              <p className="text-[10px] text-slate-500 mt-1 font-medium tracking-wide">
                Projections require user verification
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-[#E2E8F0] shadow-sm flex flex-col">
            <CardHeader className="p-4 border-b border-[#E2E8F0]">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide">
                COST-TO-DATE — BUDGET VS ACTUAL
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1">
              <div className="flex gap-4 mb-3 text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-1.5 text-[#0284C7]">
                  <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                  Budget
                </div>
                <div className="flex items-center gap-1.5 text-[#F59E0B]">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                  Actual
                </div>
              </div>
              {live && liveCostSnapshot.length === 0 ? (
                <AnalyticsChartEmpty label="Cost-to-date trend requires job budget fields on deployments" />
              ) : (
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={live ? liveCostSnapshot : costToDateSeries}
                    margin={{ top: 0, right: 0, left: -10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="costBudget" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="costActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="week" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
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
                    />
                    <Area type="monotone" dataKey="budget" stroke="#0EA5E9" fill="url(#costBudget)" strokeWidth={2} />
                    <Area type="monotone" dataKey="actual" stroke="#F59E0B" fill="url(#costActual)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E2E8F0] shadow-sm flex flex-col">
            <CardHeader className="p-4 border-b border-[#E2E8F0]">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide">
                LABOR BURN — PLANNED VS ACTUAL (HRS)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1">
              {live && liveLaborBurn.length === 0 ? (
                <AnalyticsChartEmpty label="Labor burn requires crew hours on job deployments (planned vs actual)" />
              ) : (
              <>
              <div className="flex gap-4 mb-3 text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-[#8A96B0]" />
                  Planned
                </div>
                <div className="flex items-center gap-1.5 text-[#EF4444]">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                  Actual
                </div>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={live ? liveLaborBurn : laborBurnSeries}
                    margin={{ top: 0, right: 0, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="week" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} domain={["dataMin - 40", "dataMax + 40"]} />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", fontSize: "12px" }}
                    />
                    <Line type="monotone" dataKey="planned" stroke="#64748B" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                    <Line type="monotone" dataKey="actual" stroke="#EF4444" strokeWidth={2} dot={{ r: 3, fill: "#EF4444" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Budget vs Actual per Job */}
        <Card className="bg-white border-[#E2E8F0] shadow-sm flex flex-col">
          <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-900 tracking-wide">
              BUDGET VS ACTUAL COST — PER JOB
            </CardTitle>
            {selectedJob && (
              <button
                onClick={() => setSelectedJob(null)}
                className="text-xs text-[#0284C7] hover:text-slate-900 transition-colors font-medium"
              >
                Clear selection
              </button>
            )}
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex gap-4 mb-3 text-[10px] font-bold uppercase tracking-widest">
              <div className="flex items-center gap-1.5 text-[#0284C7]">
                <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                Estimated Cost
              </div>
              <div className="flex items-center gap-1.5 text-[#F59E0B]">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                Actual Cost-to-Date
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetVsActual} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
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
                  <Legend wrapperStyle={{ display: "none" }} />
                  <Bar dataKey="estimated" fill="#0EA5E9" radius={[3, 3, 0, 0]} maxBarSize={36} />
                  <Bar dataKey="actual" fill="#F59E0B" radius={[3, 3, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Cost categories reference */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {verticalConfig.name} Cost Categories
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {verticalConfig.costCategories.map((cat) => (
              <span
                key={cat}
                className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-medium text-[#0284C7] bg-[#38BDF8]/10 border border-[#38BDF8]/20"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Per-job cost table */}
        <Card className="bg-white border-[#E2E8F0] shadow-sm flex flex-col">
          <CardHeader className="p-4 border-b border-[#E2E8F0]">
            <CardTitle className="text-sm font-bold text-slate-900 tracking-wide">
              JOB-LEVEL COST &amp; MARGIN DETAIL
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead className="bg-[#F1F5F9] border-b border-[#E2E8F0]">
                <tr>
                  {[
                    "Job",
                    "Bid Amount",
                    "Est. Cost",
                    "Actual Cost",
                    "Labor",
                    "Sub",
                    "Material",
                    "Permit",
                    "Equip.",
                    "Change Orders",
                    "Cost Var.",
                    "Gross Margin",
                    "Proj. / Actual ROI",
                    "Profit Fade",
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
                {activeRecords.map((r) => (
                  <tr
                    key={r.jobId}
                    onClick={() => setSelectedJob(r.jobId === selectedJob ? null : r.jobId)}
                    className={`transition-colors cursor-pointer ${
                      r.jobId === selectedJob ? "bg-[#F1F5F9]" : "hover:bg-[#F1F5F9]"
                    }`}
                  >
                    <td className="px-3 py-3">
                      <div className="font-semibold text-slate-900 text-xs whitespace-nowrap">{r.jobName}</div>
                    </td>
                    <td className="px-3 py-3 text-right text-xs text-slate-900 whitespace-nowrap">{fmtFull(r.bidAmount)}</td>
                    <td className="px-3 py-3 text-right text-xs text-slate-500 whitespace-nowrap">{fmtFull(r.estimatedCost)}</td>
                    <td className="px-3 py-3 text-right text-xs text-slate-900 whitespace-nowrap">{fmtFull(r.actualCost)}</td>
                    <td className="px-3 py-3 text-right text-xs text-slate-500 whitespace-nowrap">{fmtFull(r.laborCost)}</td>
                    <td className="px-3 py-3 text-right text-xs text-slate-500 whitespace-nowrap">{fmtFull(r.subCost)}</td>
                    <td className="px-3 py-3 text-right text-xs text-slate-500 whitespace-nowrap">{fmtFull(r.materialCost)}</td>
                    <td className="px-3 py-3 text-right text-xs text-slate-500 whitespace-nowrap">{fmtFull(r.permitCost)}</td>
                    <td className="px-3 py-3 text-right text-xs text-slate-500 whitespace-nowrap">{fmtFull(r.equipmentCost)}</td>
                    <td className="px-3 py-3 text-right text-xs text-slate-900 whitespace-nowrap">{fmtFull(r.changeOrders)}</td>
                    <td className="px-3 py-3 text-right whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                          r.costVariance < 0 ? "text-[#EF4444]" : "text-[#22C55E]"
                        }`}
                      >
                        {r.costVariance < 0 ? (
                          <ArrowDownRight className="w-3 h-3" />
                        ) : (
                          <ArrowUpRight className="w-3 h-3" />
                        )}
                        {fmtFull(Math.abs(r.costVariance))}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right text-xs font-semibold text-slate-900 whitespace-nowrap">
                      {r.grossMargin.toFixed(1)}%
                    </td>
                    <td className="px-3 py-3 text-right text-xs whitespace-nowrap">
                      <span className="text-slate-500">{r.projectedRoi.toFixed(1)}%</span>
                      <span className="text-slate-500"> / </span>
                      <span
                        className={
                          r.actualRoi >= r.projectedRoi ? "text-[#22C55E]" : "text-[#F59E0B]"
                        }
                      >
                        {r.actualRoi.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${
                          riskBadge[r.profitFadeRisk]
                        }`}
                      >
                        <ShieldAlert className="w-3 h-3" style={{ color: riskColor[r.profitFadeRisk] }} />
                        {r.profitFadeRisk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <p className="text-[11px] text-slate-500 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
          Decision-support guidance only. Figures reflect cost-to-date and require review
          before client-facing output. No internal pricing formula or margin strategy is
          exposed.
        </p>
      </div>
    </Layout>
  );
}
