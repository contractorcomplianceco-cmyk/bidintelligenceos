import { useMemo, useState } from "react";
import { Layout } from "@/components/layout";
import { useToast } from "@/hooks/use-toast";
import { getVertical } from "@/lib/verticals";
import {
  jobDeployments,
  permitItems,
  type JobDeployment,
  type JobStatus,
  type PermitStatus,
} from "@/lib/operations";
import {
  Building2,
  MapPin,
  CalendarDays,
  UserCog,
  HardHat,
  DollarSign,
  TrendingUp,
  CloudRain,
  Flag,
  Users,
  Truck,
  CheckCircle2,
  Circle,
  Clock,
  ShieldCheck,
  FileText,
  ClipboardCheck,
  AlertTriangle,
  Rocket,
  ArrowRight,
} from "lucide-react";

const money = (n: number) => `$${n.toLocaleString()}`;
const moneyM = (n: number) => `$${(n / 1000000).toFixed(2)}M`;

function statusStyles(status: JobStatus) {
  switch (status) {
    case "In Progress":
      return "bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/30";
    case "Delayed":
      return "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30";
    case "On Hold":
      return "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30";
    case "Mobilizing":
      return "bg-purple-500/10 text-purple-400 border-purple-500/30";
    case "Completed":
      return "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30";
    default:
      return "bg-[#1C253B] text-[#8A96B0] border-[#2A3756]";
  }
}

function riskColor(risk: string) {
  if (risk === "High") return "text-[#EF4444]";
  if (risk === "Medium") return "text-[#F59E0B]";
  return "text-[#22C55E]";
}

function permitStatusStyles(status: PermitStatus) {
  switch (status) {
    case "Approved":
      return "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30";
    case "Expiring":
      return "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30";
    case "Blocked":
    case "Needed":
      return "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30";
    case "Requested":
    case "Submitted":
      return "bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/30";
    default:
      return "bg-[#1C253B] text-[#8A96B0] border-[#2A3756]";
  }
}

function permitIcon(kind: string) {
  if (kind === "Inspection") return ClipboardCheck;
  if (kind === "Document") return FileText;
  return ShieldCheck;
}

export default function Deployment() {
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState<string>(jobDeployments[0].id);

  const job: JobDeployment =
    jobDeployments.find((j) => j.id === selectedId) ?? jobDeployments[0];

  const phases = useMemo(() => {
    const vp = getVertical(job.vertical).jobPhases;
    return vp.length >= job.totalPhases ? vp.slice(0, job.totalPhases) : vp;
  }, [job]);

  const jobPermits = useMemo(
    () => permitItems.filter((p) => p.jobId === job.id),
    [job.id]
  );

  const budgetPct = Math.min(
    100,
    Math.round((job.costToDate / job.budget) * 100)
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
              <Rocket className="w-7 h-7 text-[#38BDF8]" />
              Job Deployment
            </h1>
            <p className="text-[#8A96B0] mt-1.5">
              Field operations command for every won job in production. Select a
              deployment to review crew, budget, permits, and milestones.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-[#1C253B] bg-[#0F1830] px-4 py-2.5">
            <div className="text-center">
              <div className="text-lg font-bold text-white leading-none">
                {jobDeployments.length}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-[#8A96B0] mt-1">
                Active Jobs
              </div>
            </div>
            <div className="h-8 w-px bg-[#1C253B]" />
            <div className="text-center">
              <div className="text-lg font-bold text-[#22C55E] leading-none">
                {moneyM(
                  jobDeployments.reduce((s, j) => s + j.contractValue, 0)
                )}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-[#8A96B0] mt-1">
                In Production
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: selectable job list */}
          <div className="lg:col-span-1 space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#8A96B0] px-1">
              Deployments
            </div>
            {jobDeployments.map((j) => {
              const active = j.id === job.id;
              return (
                <button
                  key={j.id}
                  onClick={() => setSelectedId(j.id)}
                  aria-pressed={active}
                  className={`w-full text-left rounded-xl border p-4 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#38BDF8] ${
                    active
                      ? "border-[#38BDF8]/50 bg-[#111A2E] ring-1 ring-[#38BDF8]/30"
                      : "border-[#1C253B] bg-[#0F1830] hover:bg-[#111A2E] hover:border-[#2A3756]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-semibold text-white text-sm truncate">
                        {j.name}
                      </div>
                      <div className="text-[11px] text-[#8A96B0] mt-0.5 truncate">
                        {j.client}
                      </div>
                    </div>
                    <span
                      className={`shrink-0 inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${statusStyles(
                        j.status
                      )}`}
                    >
                      {j.status}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[10px]">
                    <span className="text-[#8A96B0] uppercase tracking-widest">
                      {j.currentPhase}
                    </span>
                    <span className="text-white font-semibold">
                      {j.completion}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#1C253B] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#38BDF8]"
                      style={{ width: `${j.completion}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: detail */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview card */}
            <div className="rounded-xl border border-[#1C253B] bg-[#0F1830] p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-white">{job.name}</h2>
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${statusStyles(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>
                    {job.weatherSensitive && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border border-[#38BDF8]/30 bg-[#38BDF8]/10 text-[#38BDF8]">
                        <CloudRain className="w-3 h-3" /> Weather Sensitive
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-[#8A96B0]">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#8A96B0]" />
                      {job.client}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#8A96B0]" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="text-[#8A96B0]">Stage:</span>
                      <span className="text-white font-medium">
                        {job.stage}
                      </span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    toast({
                      title: "Field update requested",
                      description: `Requested a status update from ${job.projectManager} on ${job.name}.`,
                    })
                  }
                  className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-[#1C253B] hover:bg-[#2A3756] text-white text-xs font-semibold px-4 py-2 transition-colors"
                >
                  Request field update
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Meta grid */}
              <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-lg border border-[#1C253B] bg-[#111A2E] p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8A96B0]">
                    <DollarSign className="w-3.5 h-3.5" /> Contract
                  </div>
                  <div className="mt-1 text-base font-bold text-white">
                    {money(job.contractValue)}
                  </div>
                </div>
                <div className="rounded-lg border border-[#1C253B] bg-[#111A2E] p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8A96B0]">
                    <TrendingUp className="w-3.5 h-3.5" /> Projected ROI
                  </div>
                  <div className="mt-1 text-base font-bold text-[#22C55E]">
                    {job.projectedRoi}%
                  </div>
                </div>
                <div className="rounded-lg border border-[#1C253B] bg-[#111A2E] p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8A96B0]">
                    <CalendarDays className="w-3.5 h-3.5" /> Start
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    {job.startDate}
                  </div>
                </div>
                <div className="rounded-lg border border-[#1C253B] bg-[#111A2E] p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8A96B0]">
                    <Flag className="w-3.5 h-3.5" /> Target
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    {job.targetCompletion}
                  </div>
                </div>
                <div className="rounded-lg border border-[#1C253B] bg-[#111A2E] p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8A96B0]">
                    <UserCog className="w-3.5 h-3.5" /> Project Manager
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    {job.projectManager}
                  </div>
                </div>
                <div className="rounded-lg border border-[#1C253B] bg-[#111A2E] p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8A96B0]">
                    <HardHat className="w-3.5 h-3.5" /> Crew Lead
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    {job.crewLead}
                  </div>
                </div>
                <div className="rounded-lg border border-[#1C253B] bg-[#111A2E] p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8A96B0]">
                    <AlertTriangle className="w-3.5 h-3.5" /> Risk Level
                  </div>
                  <div
                    className={`mt-1 text-sm font-semibold ${riskColor(
                      job.riskLevel
                    )}`}
                  >
                    {job.riskLevel}
                  </div>
                </div>
                <div className="rounded-lg border border-[#1C253B] bg-[#111A2E] p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8A96B0]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Completion
                  </div>
                  <div className="mt-1 text-base font-bold text-white">
                    {job.completion}%
                  </div>
                </div>
              </div>
            </div>

            {/* Phase stepper */}
            <div className="rounded-xl border border-[#1C253B] bg-[#0F1830] p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Phase Progress
                </h3>
                <span className="text-[11px] text-[#8A96B0]">
                  Phase {job.phaseIndex + 1} of {job.totalPhases} —{" "}
                  <span className="text-[#38BDF8] font-semibold">
                    {job.currentPhase}
                  </span>
                </span>
              </div>
              <div className="flex items-start gap-0 overflow-x-auto pb-1">
                {phases.map((phase, i) => {
                  const done = i < job.phaseIndex;
                  const current = i === job.phaseIndex;
                  return (
                    <div
                      key={phase}
                      className="flex flex-col items-center min-w-[92px] flex-1 relative"
                    >
                      {i < phases.length - 1 && (
                        <div
                          className={`absolute top-3 left-1/2 w-full h-0.5 ${
                            done ? "bg-[#22C55E]" : "bg-[#1C253B]"
                          }`}
                        />
                      )}
                      <div className="relative z-10 bg-[#0F1830] px-1">
                        {done ? (
                          <CheckCircle2 className="w-6 h-6 text-[#22C55E]" />
                        ) : current ? (
                          <div className="w-6 h-6 rounded-full bg-[#38BDF8]/20 border-2 border-[#38BDF8] flex items-center justify-center">
                            <Clock className="w-3 h-3 text-[#38BDF8]" />
                          </div>
                        ) : (
                          <Circle className="w-6 h-6 text-[#2A3756]" />
                        )}
                      </div>
                      <span
                        className={`mt-2 text-[10px] text-center leading-tight px-1 ${
                          current
                            ? "text-[#38BDF8] font-bold"
                            : done
                            ? "text-white"
                            : "text-[#8A96B0]"
                        }`}
                      >
                        {phase}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Budget + milestone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-[#1C253B] bg-[#0F1830] p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-4">
                  Budget vs Cost-to-Date
                </h3>
                <div className="flex items-end justify-between mb-2">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[#8A96B0]">
                      Cost to Date
                    </div>
                    <div className="text-lg font-bold text-white">
                      {money(job.costToDate)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-widest text-[#8A96B0]">
                      Budget
                    </div>
                    <div className="text-lg font-bold text-[#8A96B0]">
                      {money(job.budget)}
                    </div>
                  </div>
                </div>
                <div className="h-3 w-full rounded-full bg-[#1C253B] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      budgetPct > 90
                        ? "bg-[#EF4444]"
                        : budgetPct > 70
                        ? "bg-[#F59E0B]"
                        : "bg-[#22C55E]"
                    }`}
                    style={{ width: `${budgetPct}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-[#8A96B0]">
                    {budgetPct}% of budget consumed
                  </span>
                  <span className="text-white font-medium">
                    {money(job.budget - job.costToDate)} remaining
                  </span>
                </div>
                <div className="mt-4 rounded-lg border border-[#1C253B] bg-[#111A2E] p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8A96B0]">
                    <TrendingUp className="w-3.5 h-3.5" /> Projected ROI
                  </div>
                  <div className="mt-1 text-base font-bold text-[#22C55E]">
                    {job.projectedRoi}%
                  </div>
                  <p className="mt-1 text-[11px] text-[#8A96B0]">
                    Decision-support guidance only. Projections require user
                    verification.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-[#1C253B] bg-[#0F1830] p-6 flex flex-col">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-4">
                  Next Milestone
                </h3>
                <div className="rounded-lg border border-[#38BDF8]/30 bg-[#38BDF8]/5 p-4">
                  <div className="flex items-center gap-2 text-[#38BDF8]">
                    <Flag className="w-4 h-4" />
                    <span className="font-semibold text-white text-sm">
                      {job.nextMilestone}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[12px] text-[#8A96B0]">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Target: {job.nextMilestoneDate}
                  </div>
                </div>
                {job.weatherSensitive && (
                  <div className="mt-4 rounded-lg border border-[#F59E0B]/30 bg-[#F59E0B]/5 p-3 flex items-start gap-2">
                    <CloudRain className="w-4 h-4 text-[#F59E0B] mt-0.5 shrink-0" />
                    <p className="text-[11px] text-[#F59E0B]/90">
                      Weather-sensitive milestone. Confirm go/no-go against the
                      Weather Watch forecast before mobilizing.
                    </p>
                  </div>
                )}
                <button
                  onClick={() =>
                    toast({
                      title: "Milestone review scheduled",
                      description: `${job.nextMilestone} flagged for review on ${job.nextMilestoneDate}.`,
                    })
                  }
                  className="mt-auto pt-4 self-start text-xs text-[#38BDF8] hover:text-white transition-colors flex items-center gap-1 font-medium"
                >
                  Schedule milestone review
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Crew + Subs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-[#1C253B] bg-[#0F1830] p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#38BDF8]" /> Crew Assigned
                  <span className="text-[#8A96B0] font-normal">
                    ({job.crew.length})
                  </span>
                </h3>
                <div className="space-y-2">
                  {job.crew.map((name) => (
                    <div
                      key={name}
                      className="flex items-center gap-3 rounded-lg border border-[#1C253B] bg-[#111A2E] px-3 py-2"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#1C253B] flex items-center justify-center text-[10px] font-bold text-[#38BDF8]">
                        {name
                          .split(" ")
                          .map((p) => p[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <span className="text-sm text-white">{name}</span>
                      {name === job.crewLead && (
                        <span className="ml-auto text-[9px] font-bold uppercase tracking-widest text-[#38BDF8]">
                          Lead
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#1C253B] bg-[#0F1830] p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#0BA3A8]" /> Subcontractors
                  <span className="text-[#8A96B0] font-normal">
                    ({job.subs.length})
                  </span>
                </h3>
                <div className="space-y-2">
                  {job.subs.map((name) => (
                    <div
                      key={name}
                      className="flex items-center gap-3 rounded-lg border border-[#1C253B] bg-[#111A2E] px-3 py-2"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#0BA3A8]/15 flex items-center justify-center">
                        <Truck className="w-3.5 h-3.5 text-[#0BA3A8]" />
                      </div>
                      <span className="text-sm text-white">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Permits */}
            <div className="rounded-xl border border-[#1C253B] bg-[#0F1830] p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#38BDF8]" /> Permits &
                Documents
                <span className="text-[#8A96B0] font-normal">
                  ({jobPermits.length})
                </span>
              </h3>
              {jobPermits.length === 0 ? (
                <p className="text-[13px] text-[#8A96B0]">
                  No permits or documents tracked for this deployment.
                </p>
              ) : (
                <div className="space-y-2">
                  {jobPermits.map((p) => {
                    const Icon = permitIcon(p.kind);
                    return (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 rounded-lg border border-[#1C253B] bg-[#111A2E] px-3 py-2.5"
                      >
                        <Icon className="w-4 h-4 text-[#8A96B0] shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white truncate">
                              {p.name}
                            </span>
                            {p.critical && (
                              <span className="shrink-0 text-[9px] font-bold uppercase tracking-widest text-[#EF4444]">
                                Critical
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#8A96B0] mt-0.5">
                            {p.kind}
                            {p.submittedDate && ` · Submitted ${p.submittedDate}`}
                            {p.expirationDate && ` · Expires ${p.expirationDate}`}
                            {p.inspectionDate &&
                              ` · Inspection ${p.inspectionDate}`}
                            {p.dependency && ` · ${p.dependency}`}
                          </div>
                        </div>
                        <span
                          className={`shrink-0 inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${permitStatusStyles(
                            p.status
                          )}`}
                        >
                          {p.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
              <p className="mt-4 text-[11px] text-[#8A96B0]">
                Review before sending client-facing output.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
