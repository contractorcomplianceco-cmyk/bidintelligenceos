import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/lib/context";
import {
  closeoutJobs,
  punchListItems,
  closeoutChecklist,
  closeoutStats,
  bidDnaFeedSeries,
  CLOSEOUT_STAGES,
  type CloseoutJob,
  type CloseoutStage,
  type PunchStatus,
  type DocStatus,
  type RetainageStatus,
} from "@core/closeout";
import {
  ClipboardCheck,
  ListChecks,
  Wallet,
  TrendingUp,
  Building2,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  Dna,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const money = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${(n / 1000).toFixed(0)}K`;
const moneyFull = (n: number) => `$${n.toLocaleString()}`;

const STAGE_STYLES: Record<CloseoutStage, string> = {
  "Punch List": "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30",
  Documentation: "bg-[#38BDF8]/10 text-[#0284C7] border-[#38BDF8]/30",
  "Final Billing": "bg-[#A855F7]/10 text-[#A855F7] border-[#A855F7]/30",
  Warranty: "bg-[#0BA3A8]/10 text-[#0BA3A8] border-[#0BA3A8]/30",
  Complete: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30",
};

const PUNCH_STYLES: Record<PunchStatus, string> = {
  Open: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30",
  "In Progress": "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30",
  Verified: "bg-[#38BDF8]/10 text-[#0284C7] border-[#38BDF8]/30",
  Closed: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30",
};

const RETAINAGE_STYLES: Record<RetainageStatus, string> = {
  Held: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30",
  Requested: "bg-[#38BDF8]/10 text-[#0284C7] border-[#38BDF8]/30",
  Released: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30",
};

const DOC_STYLES: Record<DocStatus, string> = {
  Complete: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30",
  "In Review": "bg-[#38BDF8]/10 text-[#0284C7] border-[#38BDF8]/30",
  Pending: "bg-[#8A96B0]/10 text-slate-500 border-[#8A96B0]/30",
  Blocked: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30",
};

const PRIORITY_STYLES: Record<string, string> = {
  High: "text-[#EF4444]",
  Medium: "text-[#F59E0B]",
  Low: "text-slate-500",
};

function DocIcon({ status }: { status: DocStatus }) {
  if (status === "Complete") return <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />;
  if (status === "In Review") return <Clock className="w-3.5 h-3.5 text-[#0284C7]" />;
  if (status === "Blocked") return <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />;
  return <Circle className="w-3.5 h-3.5 text-slate-500" />;
}

export default function Closeout() {
  const { toast } = useToast();
  const { verticalConfig } = useAppContext();
  const [selectedJobId, setSelectedJobId] = useState<string>(closeoutJobs[0].id);

  const selectedJob: CloseoutJob =
    closeoutJobs.find((j) => j.id === selectedJobId) ?? closeoutJobs[0];

  const jobPunch = useMemo(
    () => punchListItems.filter((p) => p.jobId === selectedJobId),
    [selectedJobId]
  );

  const stats = closeoutStats;

  return (
    <Layout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <ClipboardCheck className="h-7 w-7 text-[#0284C7]" />
              Job Closeout
            </h1>
            <p className="text-slate-500 mt-1">
              Punch lists, documentation, final billing, and warranty tracking for
              completing {verticalConfig.name} jobs — every closed job trains future
              estimates.
            </p>
          </div>
          <Link
            href="/bid-dna"
            className="inline-flex items-center gap-2 rounded-lg bg-[#A855F7]/15 hover:bg-[#A855F7]/25 text-[#A855F7] text-sm font-semibold px-4 py-2.5 transition-colors border border-[#A855F7]/30"
          >
            <Dna className="w-4 h-4" />
            View Bid DNA
          </Link>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            {
              label: "Jobs In Closeout",
              value: `${stats.jobsInCloseout}`,
              sub: `${closeoutJobs.length} total in the pipeline`,
              icon: ClipboardCheck,
              color: "#0EA5E9",
            },
            {
              label: "Punch Items Open",
              value: `${stats.punchItemsOpen}`,
              sub: "Open + in-progress across jobs",
              icon: ListChecks,
              color: "#F59E0B",
            },
            {
              label: "Retainage Outstanding",
              value: money(stats.retainageOutstanding),
              sub: "Held + requested, not yet released",
              icon: Wallet,
              color: "#A855F7",
            },
            {
              label: "Avg Final ROI",
              value: `${stats.avgFinalRoi.toFixed(1)}%`,
              sub: `vs ${stats.avgProjectedRoi.toFixed(1)}% projected`,
              icon: TrendingUp,
              color: "#22C55E",
            },
          ].map((kpi) => (
            <Card
              key={kpi.label}
              className="bg-white border-[#E2E8F0] shadow-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <kpi.icon className="w-10 h-10" style={{ color: kpi.color }} />
              </div>
              <CardContent className="p-5 relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
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
          ))}
        </div>

        {/* Closeout pipeline cards */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Closeout Pipeline
            </h2>
            <span className="text-[11px] text-slate-500">
              Select a job to review its punch list and documentation
            </span>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {closeoutJobs.map((job) => {
              const active = job.id === selectedJobId;
              const roiUp = job.finalRoi >= job.projectedRoi;
              const stageProgress =
                ((job.stageIndex + 1) / CLOSEOUT_STAGES.length) * 100;
              return (
                <Card
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className={`bg-white shadow-sm flex flex-col cursor-pointer transition-colors ${
                    active
                      ? "border-[#0284C7]/50 ring-1 ring-[#0284C7]/20"
                      : "border-[#E2E8F0] hover:border-[#CBD5E1]"
                  }`}
                >
                  <CardHeader className="p-5 border-b border-[#E2E8F0]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <CardTitle className="text-base font-bold text-slate-900 truncate">
                          {job.name}
                        </CardTitle>
                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1 truncate">
                            <Building2 className="w-3 h-3 shrink-0" />
                            {job.client}
                          </span>
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 shrink-0" />
                            {job.location}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${STAGE_STYLES[job.stage]}`}
                      >
                        {job.stage}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 flex-1 flex flex-col gap-4">
                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] p-3">
                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                          Contract
                        </div>
                        <div className="text-lg font-bold text-slate-900 mt-1">
                          {money(job.contractValue)}
                        </div>
                      </div>
                      <div className="rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] p-3">
                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                          Final ROI
                        </div>
                        <div
                          className={`text-lg font-bold mt-1 flex items-center gap-1 ${
                            roiUp ? "text-[#22C55E]" : "text-[#EF4444]"
                          }`}
                        >
                          {job.finalRoi.toFixed(1)}%
                          {roiUp ? (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowDownRight className="w-3.5 h-3.5" />
                          )}
                        </div>
                      </div>
                      <div className="rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] p-3">
                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                          Punch Open
                        </div>
                        <div className="text-lg font-bold text-slate-900 mt-1">
                          {job.punchItemsRemaining}
                        </div>
                      </div>
                    </div>

                    {/* Stage progress */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          Closeout Stage
                        </span>
                        <span className="text-[10px] font-semibold text-[#0284C7]">
                          {job.stageIndex + 1}/{CLOSEOUT_STAGES.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {CLOSEOUT_STAGES.map((stage, i) => {
                          const done = i < job.stageIndex;
                          const current = i === job.stageIndex;
                          return (
                            <div key={stage} className="flex-1 flex flex-col items-center gap-1">
                              <div className="h-1.5 w-full rounded-full bg-[#E2E8F0] overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    done
                                      ? "bg-[#22C55E]"
                                      : current
                                      ? "bg-[#38BDF8]"
                                      : "bg-transparent"
                                  }`}
                                  style={{ width: done || current ? "100%" : "0%" }}
                                />
                              </div>
                              <span
                                className={`text-[8px] font-semibold uppercase tracking-wide text-center leading-tight ${
                                  current
                                    ? "text-[#0284C7]"
                                    : done
                                    ? "text-[#22C55E]"
                                    : "text-slate-500"
                                }`}
                              >
                                {stage}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-3 h-1.5 w-full rounded-full bg-[#E2E8F0] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#0BA3A8] to-[#38BDF8]"
                          style={{ width: `${stageProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer meta */}
                    <div className="mt-auto pt-1 flex items-center justify-between gap-3 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Retainage</span>
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${RETAINAGE_STYLES[job.retainageStatus]}`}
                        >
                          {job.retainageStatus} · {money(job.retainageAmount)}
                        </span>
                      </div>
                      <span className="text-slate-500">
                        Docs{" "}
                        <span className="text-slate-900 font-semibold">
                          {job.docsComplete}/{job.docsTotal}
                        </span>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Punch list + Documentation panels */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Punch list table */}
          <Card className="bg-white border-[#E2E8F0] shadow-sm xl:col-span-2 flex flex-col">
            <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-[#F59E0B]" />
                PUNCH LIST — {selectedJob.name}
              </CardTitle>
              <span className="text-[11px] text-slate-500">
                {jobPunch.length} items
              </span>
            </CardHeader>
            <CardContent className="p-0">
              {jobPunch.length === 0 ? (
                <div className="p-6 text-sm text-slate-500">
                  No open punch items — this job is clear for the next closeout stage.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] text-[10px] uppercase tracking-widest text-slate-500">
                        <th className="px-4 py-3 font-bold">Item</th>
                        <th className="px-4 py-3 font-bold">Trade</th>
                        <th className="px-4 py-3 font-bold">Assignee</th>
                        <th className="px-4 py-3 font-bold">Priority</th>
                        <th className="px-4 py-3 font-bold">Due</th>
                        <th className="px-4 py-3 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobPunch.map((p) => (
                        <tr
                          key={p.id}
                          className="border-b border-[#E2E8F0] last:border-0 hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm text-slate-900 max-w-[280px]">
                            {p.item}
                          </td>
                          <td className="px-4 py-3 text-[12px] text-slate-500">
                            {p.trade}
                          </td>
                          <td className="px-4 py-3 text-[12px] text-slate-700">
                            {p.assignee}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-[11px] font-bold ${PRIORITY_STYLES[p.priority]}`}
                            >
                              {p.priority}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[12px] text-slate-500">
                            {p.dueDate}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${PUNCH_STYLES[p.status]}`}
                            >
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documentation checklist panel */}
          <Card className="bg-white border-[#E2E8F0] shadow-sm flex flex-col">
            <CardHeader className="p-4 border-b border-[#E2E8F0]">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0284C7]" />
                CLOSEOUT DOCUMENTATION
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {closeoutChecklist.map((item) => {
                const status = item.statusByJob[selectedJobId] ?? "Pending";
                return (
                  <div
                    key={item.id}
                    className="rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 min-w-0">
                        <div className="mt-0.5">
                          <DocIcon status={status} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13px] font-semibold text-slate-900">
                            {item.requirement}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {item.description}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${DOC_STYLES[status]}`}
                      >
                        {status}
                      </span>
                    </div>
                  </div>
                );
              })}
              <button
                onClick={() =>
                  toast({
                    title: "Documentation package requested",
                    description: `Compiling the closeout binder for ${selectedJob.name}. Review before releasing to the client.`,
                  })
                }
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#E2E8F0] hover:bg-[#CBD5E1] text-slate-900 text-xs font-semibold px-3 py-2.5 transition-colors mt-1"
              >
                Compile closeout binder
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Feeds Bid DNA */}
        <Card className="bg-white border-[#A855F7]/30">
          <CardHeader className="p-5 border-b border-[#E2E8F0]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <Dna className="w-4 h-4 text-[#A855F7]" />
                FEEDS BID DNA — EVERY CLOSED JOB TRAINS FUTURE ESTIMATES
              </CardTitle>
              <Link
                href="/bid-dna"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#A855F7]/15 hover:bg-[#A855F7]/25 text-[#A855F7] text-xs font-semibold px-3 py-2 transition-colors border border-[#A855F7]/30"
              >
                Open Bid DNA
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-[11px] text-slate-500">
                  <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" />
                  Projected vs final ROI across recently closed jobs
                </div>
                <div className="flex gap-4 mb-3 text-[10px] font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-[#8A96B0]" />
                    Projected
                  </div>
                  <div className="flex items-center gap-1.5 text-[#A855F7]">
                    <span className="w-2 h-2 rounded-full bg-[#A855F7]" />
                    Final
                  </div>
                </div>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={bidDnaFeedSeries}
                      margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                      <XAxis
                        dataKey="name"
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
                      />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#E2E8F0",
                          fontSize: "12px",
                        }}
                        formatter={(v: number) => `${v}%`}
                      />
                      <Bar dataKey="projected" fill="#64748B" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="final" radius={[3, 3, 0, 0]}>
                        {bidDnaFeedSeries.map((d) => (
                          <Cell
                            key={d.jobId}
                            fill={d.final >= d.projected ? "#22C55E" : "#EF4444"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Selected job learnings */}
              <div className="rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-4">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Learning Snapshot — {selectedJob.name}
                </div>
                <p className="text-sm text-slate-900 mt-2 leading-relaxed">
                  {selectedJob.feedsBidDna.headline}
                </p>

                <div className="mt-4 space-y-2">
                  {selectedJob.feedsBidDna.estimateVsActual.map((row) => {
                    const good = row.variancePct >= 0;
                    return (
                      <div
                        key={row.label}
                        className="flex items-center justify-between gap-3 rounded-md border border-[#E2E8F0] bg-white px-3 py-2"
                      >
                        <span className="text-[12px] text-slate-700 truncate">
                          {row.label}
                        </span>
                        <div className="flex items-center gap-3 shrink-0 text-[11px]">
                          <span className="text-slate-500">
                            {money(row.estimated)} → {money(row.actual)}
                          </span>
                          <span
                            className={`font-bold flex items-center gap-0.5 ${
                              good ? "text-[#22C55E]" : "text-[#EF4444]"
                            }`}
                          >
                            {good ? (
                              <ArrowUpRight className="w-3 h-3" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3" />
                            )}
                            {Math.abs(row.variancePct).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <ul className="mt-4 space-y-1.5">
                  {selectedJob.feedsBidDna.learnings.map((l, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[12px] text-slate-500"
                    >
                      <Dna className="w-3.5 h-3.5 text-[#A855F7] mt-0.5 shrink-0" />
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic mt-5">
              Estimate-versus-actual insights are decision-support only. The Bid DNA engine
              surfaces patterns from closed jobs to inform — not replace — estimator
              judgment, and implies no guaranteed outcomes on future bids.
            </p>
          </CardContent>
        </Card>

        <p className="text-[11px] text-slate-500 italic">
          Decision-support guidance only. ROI, retainage, and closeout figures require user
          verification before client-facing use.
        </p>
      </div>
    </Layout>
  );
}
