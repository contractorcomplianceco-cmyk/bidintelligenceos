import { useMemo, useState } from "react";
import { Layout } from "@/components/layout";
import { useAppContext } from "@/lib/context";
import { useToast } from "@/hooks/use-toast";
import {
  permitItems as seedPermits,
  PermitItem,
  PermitStatus,
  jobDeployments,
} from "@core/operations";
import {
  FileCheck2,
  FileText,
  ClipboardCheck,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Link2,
  RefreshCw,
  Filter,
  ListChecks,
} from "lucide-react";

const STATUS_ORDER: PermitStatus[] = [
  "Not Required",
  "Needed",
  "Requested",
  "Submitted",
  "Approved",
  "Expiring",
  "Blocked",
];

const STATUS_STYLES: Record<PermitStatus, { text: string; bg: string; border: string; dot: string }> = {
  Approved: { text: "#22C55E", bg: "rgba(34,197,94,0.10)", border: "rgba(34,197,94,0.30)", dot: "#22C55E" },
  Expiring: { text: "#F59E0B", bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.30)", dot: "#F59E0B" },
  Blocked: { text: "#EF4444", bg: "rgba(239,68,68,0.10)", border: "rgba(239,68,68,0.30)", dot: "#EF4444" },
  Needed: { text: "#EF4444", bg: "rgba(239,68,68,0.10)", border: "rgba(239,68,68,0.30)", dot: "#EF4444" },
  Requested: { text: "#0EA5E9", bg: "rgba(56,189,248,0.10)", border: "rgba(56,189,248,0.30)", dot: "#0EA5E9" },
  Submitted: { text: "#0EA5E9", bg: "rgba(56,189,248,0.10)", border: "rgba(56,189,248,0.30)", dot: "#0EA5E9" },
  "Not Required": { text: "#64748B", bg: "rgba(138,150,176,0.10)", border: "rgba(138,150,176,0.30)", dot: "#64748B" },
};

function KindIcon({ kind, className }: { kind: PermitItem["kind"]; className?: string }) {
  if (kind === "Permit") return <FileCheck2 className={className} />;
  if (kind === "Inspection") return <ClipboardCheck className={className} />;
  return <FileText className={className} />;
}

function StatusBadge({ status }: { status: PermitStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest"
      style={{ color: s.text, backgroundColor: s.bg, border: `1px solid ${s.border}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
      {status}
    </span>
  );
}

export default function Permits() {
  const { verticalConfig } = useAppContext();
  const { toast } = useToast();

  const [statuses, setStatuses] = useState<Record<string, PermitStatus>>(() =>
    Object.fromEntries(seedPermits.map((p) => [p.id, p.status]))
  );
  const [statusFilter, setStatusFilter] = useState<PermitStatus | "All">("All");
  const [jobFilter, setJobFilter] = useState<string>("All");

  const items: PermitItem[] = useMemo(
    () => seedPermits.map((p) => ({ ...p, status: statuses[p.id] ?? p.status })),
    [statuses]
  );

  const jobs = useMemo(() => {
    const seen = new Map<string, string>();
    seedPermits.forEach((p) => {
      if (!seen.has(p.jobId)) seen.set(p.jobId, p.jobName);
    });
    return Array.from(seen.entries());
  }, []);

  const filtered = useMemo(
    () =>
      items.filter(
        (p) =>
          (statusFilter === "All" || p.status === statusFilter) &&
          (jobFilter === "All" || p.jobId === jobFilter)
      ),
    [items, statusFilter, jobFilter]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    items.forEach((p) => {
      c[p.status] = (c[p.status] ?? 0) + 1;
    });
    return c;
  }, [items]);

  const criticalAlerts = useMemo(
    () => items.filter((p) => p.status === "Expiring" || p.status === "Blocked" || (p.critical && p.status === "Needed")),
    [items]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, PermitItem[]>();
    filtered.forEach((p) => {
      const arr = map.get(p.jobName) ?? [];
      arr.push(p);
      map.set(p.jobName, arr);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const cycleStatus = (item: PermitItem) => {
    const current = statuses[item.id] ?? item.status;
    const idx = STATUS_ORDER.indexOf(current);
    const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
    setStatuses((prev) => ({ ...prev, [item.id]: next }));
    toast({
      title: `${item.name} → ${next}`,
      description: `${item.jobName}: status advanced. Review before sending client-facing output.`,
    });
  };

  const approvedCount = counts["Approved"] ?? 0;
  const total = items.length;
  const readiness = total ? Math.round((approvedCount / total) * 100) : 0;

  return (
    <Layout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <FileCheck2 className="w-7 h-7 text-[#0284C7]" />
              Permits &amp; Documents
            </h1>
            <p className="text-slate-500 mt-2">
              Compliance and approval tracking for active {verticalConfig.name} jobs. Decision-support guidance only.
            </p>
          </div>
          <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm px-5 py-3 flex items-center gap-4">
            <div className="relative w-12 h-12 shrink-0">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="5" fill="transparent" className="text-[#E2E8F0]" />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="5"
                  fill="transparent"
                  strokeDasharray={126}
                  strokeDashoffset={126 - (126 * readiness) / 100}
                  className="text-[#0284C7]"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-900">{readiness}%</span>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Compliance Readiness</div>
              <div className="text-sm text-slate-900 font-semibold mt-0.5">
                {approvedCount} of {total} items approved
              </div>
            </div>
          </div>
        </div>

        {/* Status summary chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {STATUS_ORDER.map((s) => {
            const style = STATUS_STYLES[s];
            const active = statusFilter === s;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(active ? "All" : s)}
                className="rounded-xl border bg-white p-3 text-left transition-colors hover:bg-[#F1F5F9]"
                style={{ borderColor: active ? style.text : "#E2E8F0" }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.dot }} />
                  <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: style.text }}>
                    {s}
                  </span>
                </div>
                <div className="text-2xl font-bold text-slate-900">{counts[s] ?? 0}</div>
              </button>
            );
          })}
        </div>

        {/* Critical alerts callout */}
        {criticalAlerts.length > 0 && (
          <div className="rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/[0.06] p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Critical Permit Alerts</h2>
              <span className="text-[10px] font-bold text-[#EF4444] bg-[#EF4444]/10 px-1.5 py-0.5 rounded uppercase tracking-widest">
                {criticalAlerts.length} Active
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {criticalAlerts.map((p) => (
                <div key={p.id} className="rounded-lg border border-[#E2E8F0] bg-white p-3">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <ShieldAlert className="w-4 h-4 text-[#EF4444] shrink-0" />
                      <span className="text-xs font-semibold text-slate-900 truncate">{p.name}</span>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="text-[11px] text-slate-500">{p.jobName}</div>
                  {p.dependency && <div className="text-[11px] text-[#F59E0B] mt-1">{p.dependency}</div>}
                  {p.expirationDate && (
                    <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Expires {p.expirationDate}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-slate-500">
            <Filter className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Filter</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PermitStatus | "All")}
            className="bg-white border border-[#CBD5E1] text-slate-500 text-xs font-medium rounded px-3 py-2 outline-none focus:border-[#38BDF8]"
          >
            <option value="All">All Statuses</option>
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="bg-white border border-[#CBD5E1] text-slate-500 text-xs font-medium rounded px-3 py-2 outline-none focus:border-[#38BDF8]"
          >
            <option value="All">All Jobs</option>
            {jobs.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
          {(statusFilter !== "All" || jobFilter !== "All") && (
            <button
              onClick={() => {
                setStatusFilter("All");
                setJobFilter("All");
              }}
              className="text-xs text-[#0284C7] hover:text-slate-900 transition-colors font-medium"
            >
              Clear filters
            </button>
          )}
          <span className="text-[11px] text-slate-500 sm:ml-auto">
            {filtered.length} of {total} items
          </span>
        </div>

        {/* Grouped permit lists + vertical needs */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            {grouped.length === 0 && (
              <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm p-10 text-center text-slate-500 text-sm">
                No items match the current filters.
              </div>
            )}
            {grouped.map(([jobName, jobItems]) => {
              const job = jobDeployments.find((j) => j.name.startsWith(jobName.split(" ")[0]) || j.name === jobName);
              return (
                <div key={jobName} className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 tracking-wide">{jobName}</span>
                      <span className="text-[10px] text-slate-500 bg-[#E2E8F0] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">
                        {jobItems.length} items
                      </span>
                    </div>
                    {job && (
                      <span className="text-[11px] text-slate-500">{job.location}</span>
                    )}
                  </div>
                  <div className="divide-y divide-[#E2E8F0]">
                    {jobItems.map((p) => (
                      <div key={p.id} className="p-4 hover:bg-[#F1F5F9] transition-colors">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="mt-0.5 w-8 h-8 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center shrink-0">
                              <KindIcon kind={p.kind} className="w-4 h-4 text-[#0284C7]" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-semibold text-slate-900">{p.name}</span>
                                {p.critical && (
                                  <span className="text-[9px] font-bold text-[#EF4444] bg-[#EF4444]/10 px-1.5 py-0.5 rounded uppercase tracking-widest">
                                    Critical
                                  </span>
                                )}
                                <span className="text-[9px] font-bold text-slate-500 bg-[#E2E8F0] px-1.5 py-0.5 rounded uppercase tracking-widest">
                                  {p.kind}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-[11px] text-slate-500">
                                {p.submittedDate && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Submitted {p.submittedDate}
                                  </span>
                                )}
                                {p.expirationDate && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Expires {p.expirationDate}
                                  </span>
                                )}
                                {p.inspectionDate && (
                                  <span className="flex items-center gap-1">
                                    <ClipboardCheck className="w-3 h-3" /> Inspection {p.inspectionDate}
                                  </span>
                                )}
                              </div>
                              {p.dependency && (
                                <div className="flex items-center gap-1 mt-1.5 text-[11px] text-[#F59E0B]">
                                  <Link2 className="w-3 h-3" /> {p.dependency}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <StatusBadge status={p.status} />
                            <button
                              onClick={() => cycleStatus(p)}
                              className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0284C7] hover:text-slate-900 transition-colors bg-[#F1F5F9] border border-[#CBD5E1] rounded px-2 py-1"
                            >
                              <RefreshCw className="w-3 h-3" /> Advance
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vertical needs sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <ListChecks className="w-4 h-4 text-[#0BA3A8]" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  {verticalConfig.short} Permit &amp; Doc Needs
                </h2>
              </div>
              <p className="text-[11px] text-slate-500 mb-4">
                Typical compliance items for {verticalConfig.name} scopes.
              </p>
              <div className="space-y-2">
                {verticalConfig.permitNeeds.map((need) => {
                  const covered = items.some(
                    (p) =>
                      p.name.toLowerCase().includes(need.toLowerCase().split(" ")[0]) &&
                      (p.status === "Approved" || p.status === "Submitted" || p.status === "Requested")
                  );
                  return (
                    <div
                      key={need}
                      className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-2"
                    >
                      <span className="text-xs text-slate-900">{need}</span>
                      {covered ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-[#22C55E] uppercase tracking-widest">
                          <ShieldCheck className="w-3.5 h-3.5" /> Tracked
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest">
                          <ShieldAlert className="w-3.5 h-3.5" /> Review
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm p-5">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Compliance Note</h2>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Permit and inspection statuses are decision-support guidance only and do not guarantee approval,
                bonding, or compliance outcomes. Verify current status with the issuing authority before scheduling
                dependent work or sending client-facing output.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
