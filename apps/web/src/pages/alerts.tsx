import { useMemo, useState } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { alertItems, AlertItem, AlertSeverity, AlertCategory } from "@core/operations";
import {
  AlertTriangle,
  CloudRain,
  FileCheck2,
  DollarSign,
  Users,
  Truck,
  BellRing,
  TrendingDown,
  CalendarClock,
  ShieldAlert,
  CheckCircle2,
  RotateCcw,
  Clock,
  Briefcase,
  ArrowRight,
} from "lucide-react";

const SEVERITY_ORDER: AlertSeverity[] = ["Critical", "High", "Medium", "Info"];

const SEVERITY_META: Record<
  AlertSeverity,
  { color: string; bg: string; border: string; label: string }
> = {
  Critical: { color: "#EF4444", bg: "rgba(239,68,68,0.10)", border: "rgba(239,68,68,0.30)", label: "Critical" },
  High: { color: "#F59E0B", bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.30)", label: "High" },
  Medium: { color: "#38BDF8", bg: "rgba(56,189,248,0.10)", border: "rgba(56,189,248,0.30)", label: "Medium" },
  Info: { color: "#8A96B0", bg: "rgba(138,150,176,0.10)", border: "rgba(138,150,176,0.30)", label: "Info" },
};

const CATEGORY_ICON: Record<AlertCategory, typeof AlertTriangle> = {
  Weather: CloudRain,
  Permit: FileCheck2,
  Cost: DollarSign,
  Labor: Users,
  Subcontractor: Truck,
  "Follow-Up": BellRing,
  ROI: TrendingDown,
  Schedule: CalendarClock,
};

const CATEGORIES: AlertCategory[] = [
  "Weather",
  "Permit",
  "Cost",
  "Labor",
  "Subcontractor",
  "Follow-Up",
  "ROI",
  "Schedule",
];

export default function Alerts() {
  const { toast } = useToast();

  const [categoryFilter, setCategoryFilter] = useState<AlertCategory | "All">("All");
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | "All">("All");
  const [resolvedMap, setResolvedMap] = useState<Record<string, boolean>>(
    () => Object.fromEntries(alertItems.map((a) => [a.id, a.resolved]))
  );

  const withResolved = useMemo<AlertItem[]>(
    () => alertItems.map((a) => ({ ...a, resolved: resolvedMap[a.id] ?? a.resolved })),
    [resolvedMap]
  );

  const severityCounts = useMemo(() => {
    const counts: Record<AlertSeverity, number> = { Critical: 0, High: 0, Medium: 0, Info: 0 };
    withResolved.forEach((a) => {
      if (!a.resolved) counts[a.severity] += 1;
    });
    return counts;
  }, [withResolved]);

  const filtered = useMemo(() => {
    return withResolved.filter((a) => {
      if (categoryFilter !== "All" && a.category !== categoryFilter) return false;
      if (severityFilter !== "All" && a.severity !== severityFilter) return false;
      return true;
    });
  }, [withResolved, categoryFilter, severityFilter]);

  const activeAlerts = useMemo(
    () =>
      filtered
        .filter((a) => !a.resolved)
        .sort((x, y) => SEVERITY_ORDER.indexOf(x.severity) - SEVERITY_ORDER.indexOf(y.severity)),
    [filtered]
  );
  const resolvedAlerts = useMemo(() => filtered.filter((a) => a.resolved), [filtered]);

  const toggleResolved = (item: AlertItem) => {
    const nowResolved = !(resolvedMap[item.id] ?? item.resolved);
    setResolvedMap((prev) => ({ ...prev, [item.id]: nowResolved }));
    toast({
      title: nowResolved ? "Alert resolved" : "Alert reopened",
      description: nowResolved
        ? `"${item.title}" moved to Resolved.`
        : `"${item.title}" moved back to Active.`,
    });
  };

  const handleAction = (item: AlertItem) => {
    toast({
      title: item.action,
      description: item.jobName
        ? `${item.action} for ${item.jobName}.`
        : `${item.action}.`,
    });
  };

  const activeTotal = withResolved.filter((a) => !a.resolved).length;

  return (
    <Layout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <ShieldAlert className="h-7 w-7 text-[#0284C7]" />
              Intelligent Alerts
            </h2>
            <p className="text-slate-500 mt-2">
              AI-detected risks across weather, permits, labor, subcontractors, cost, and ROI.
              Decision-support guidance only.
            </p>
          </div>
          <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-center">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Active Alerts</div>
            <div className="text-2xl font-bold text-slate-900">{activeTotal}</div>
          </div>
        </div>

        {/* Severity summary counts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SEVERITY_ORDER.map((sev) => {
            const meta = SEVERITY_META[sev];
            const selected = severityFilter === sev;
            return (
              <button
                key={sev}
                onClick={() => setSeverityFilter(selected ? "All" : sev)}
                className={`rounded-xl border bg-white p-5 text-left transition-colors ${
                  selected ? "border-[#CBD5E1]" : "border-[#E2E8F0] hover:border-[#CBD5E1]"
                }`}
                style={selected ? { borderColor: meta.color } : undefined}
                aria-pressed={selected}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {meta.label}
                  </span>
                </div>
                <div className="text-3xl font-bold text-slate-900 tracking-tight">{severityCounts[sev]}</div>
                <div className="text-[10px] text-slate-500 mt-1">
                  {selected ? "Filtering by this severity" : "Active in this severity"}
                </div>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <Card className="bg-white border-[#E2E8F0]">
          <CardContent className="p-4 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mr-1">
                Category
              </span>
              <FilterChip
                label="All"
                active={categoryFilter === "All"}
                onClick={() => setCategoryFilter("All")}
              />
              {CATEGORIES.map((cat) => {
                const Icon = CATEGORY_ICON[cat];
                return (
                  <FilterChip
                    key={cat}
                    label={cat}
                    icon={Icon}
                    active={categoryFilter === cat}
                    onClick={() => setCategoryFilter(categoryFilter === cat ? "All" : cat)}
                  />
                );
              })}
            </div>
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
                  active={severityFilter === sev}
                  dotColor={SEVERITY_META[sev].color}
                  onClick={() => setSeverityFilter(severityFilter === sev ? "All" : sev)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active alerts */}
        <Card className="bg-white border-[#E2E8F0] flex flex-col">
          <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
              ACTIVE ALERTS
            </CardTitle>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {activeAlerts.length} shown
            </span>
          </CardHeader>
          <CardContent className="p-0">
            {activeAlerts.length === 0 ? (
              <div className="p-10 text-center text-slate-500 text-sm flex flex-col items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-[#22C55E]" />
                No active alerts match the current filters.
              </div>
            ) : (
              <div className="divide-y divide-[#E2E8F0]">
                {activeAlerts.map((item) => (
                  <AlertRow
                    key={item.id}
                    item={item}
                    onAction={() => handleAction(item)}
                    onToggle={() => toggleResolved(item)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resolved alerts */}
        <Card className="bg-white border-[#E2E8F0] flex flex-col">
          <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
              RESOLVED
            </CardTitle>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {resolvedAlerts.length} shown
            </span>
          </CardHeader>
          <CardContent className="p-0">
            {resolvedAlerts.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                Nothing resolved yet. Resolve an active alert to move it here.
              </div>
            ) : (
              <div className="divide-y divide-[#E2E8F0]">
                {resolvedAlerts.map((item) => (
                  <AlertRow
                    key={item.id}
                    item={item}
                    resolved
                    onAction={() => handleAction(item)}
                    onToggle={() => toggleResolved(item)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-[11px] text-slate-500 flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5" />
          Alerts are AI-detected signals for decision support only. Review before acting on
          client-facing output.
        </p>
      </div>
    </Layout>
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
  icon?: typeof AlertTriangle;
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

function AlertRow({
  item,
  resolved,
  onAction,
  onToggle,
}: {
  item: AlertItem;
  resolved?: boolean;
  onAction: () => void;
  onToggle: () => void;
}) {
  const meta = SEVERITY_META[item.severity];
  const Icon = CATEGORY_ICON[item.category];

  return (
    <div className={`p-4 flex items-start gap-4 transition-colors hover:bg-[#F1F5F9] ${resolved ? "opacity-70" : ""}`}>
      <div
        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: meta.bg, border: `1px solid ${meta.border}` }}
      >
        <Icon className="w-4.5 h-4.5" style={{ color: meta.color }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span
            className="inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest"
            style={{ color: meta.color, backgroundColor: meta.bg, border: `1px solid ${meta.border}` }}
          >
            {meta.label}
          </span>
          <span className="inline-flex items-center gap-1 rounded bg-[#E2E8F0] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-500">
            {item.category}
          </span>
          <span
            className={`text-sm font-semibold ${resolved ? "text-slate-500 line-through" : "text-slate-900"}`}
          >
            {item.title}
          </span>
        </div>
        <p className="text-[12px] text-slate-500 leading-snug">{item.detail}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-500">
          {item.jobName && (
            <span className="inline-flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              {item.jobName}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {item.time}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        {!resolved && (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#38BDF8]/30 bg-[#38BDF8]/10 px-2.5 py-1.5 text-[11px] font-semibold text-[#0284C7] transition-colors hover:bg-[#38BDF8]/20"
          >
            {item.action}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={onToggle}
          className="inline-flex items-center gap-1.5 rounded-md border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 transition-colors hover:text-slate-900 hover:border-[#CBD5E1]"
        >
          {resolved ? (
            <>
              <RotateCcw className="w-3.5 h-3.5" />
              Reopen
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Resolve
            </>
          )}
        </button>
      </div>
    </div>
  );
}
