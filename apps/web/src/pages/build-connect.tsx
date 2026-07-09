import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { OpsModuleGate } from "@/components/ops-module-gate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  networkSubs,
  subAssignments,
  tradeDemand,
  type NetworkSub,
  type SubAvailability,
  type RateSignal,
  type AssignmentStatus,
} from "@core/build-connect";
import {
  Network,
  Users,
  CheckCircle2,
  Handshake,
  ShieldCheck,
  Clock,
  Star,
  ArrowRight,
  Trophy,
  CalendarDays,
  HardHat,
  BarChart3,
  Zap,
} from "lucide-react";

const BRAND = "#F97316";

function money(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  return `$${(n / 1_000).toFixed(1)}K`;
}

const AVAILABILITY_STYLES: Record<
  SubAvailability,
  { label: string; className: string }
> = {
  available: {
    label: "Available now",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  limited: {
    label: "Limited",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  "booked-until": {
    label: "Booked",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

const RATE_STYLES: Record<RateSignal, string> = {
  competitive: "bg-emerald-50 text-emerald-700 border-emerald-200",
  market: "bg-sky-50 text-sky-700 border-sky-200",
  premium: "bg-amber-50 text-amber-700 border-amber-200",
};

const ASSIGNMENT_STAGES: {
  key: AssignmentStatus;
  label: string;
  className: string;
}[] = [
  { key: "matched", label: "Matched", className: "bg-sky-50 text-sky-700 border-sky-200" },
  { key: "negotiating", label: "Negotiating", className: "bg-amber-50 text-amber-700 border-amber-200" },
  { key: "assigned", label: "Assigned", className: "bg-[#F97316]/10 text-[#C2410C] border-[#F97316]/30" },
  { key: "in-progress", label: "In-progress", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
];

const DEMAND_STYLES: Record<string, string> = {
  high: "bg-red-50 text-red-700 border-red-200",
  balanced: "bg-sky-50 text-sky-700 border-sky-200",
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function ScoreBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
          {label}
        </span>
        <span className="text-[11px] font-semibold text-slate-900">{value}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-[#E2E8F0] overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function BuildConnect() {
  const trades = useMemo(() => {
    return ["All", ...Array.from(new Set(networkSubs.map((s) => s.trade)))];
  }, []);
  const [tradeFilter, setTradeFilter] = useState<string>("All");

  const filteredSubs = useMemo<NetworkSub[]>(() => {
    if (tradeFilter === "All") return networkSubs;
    return networkSubs.filter((s) => s.trade === tradeFilter);
  }, [tradeFilter]);

  const kpis = useMemo(() => {
    const total = networkSubs.length;
    const availableNow = networkSubs.filter(
      (s) => s.availability === "available",
    ).length;
    const activeAssignments = subAssignments.filter(
      (a) => a.status === "assigned" || a.status === "in-progress",
    ).length;
    const avgReliability = Math.round(
      networkSubs.reduce((s, x) => s + x.reliabilityScore, 0) / (total || 1),
    );
    return { total, availableNow, activeAssignments, avgReliability };
  }, []);

  return (
    <OpsModuleGate
      title="BuildConnect"
      subtitle="Subcontractor network and trade capacity marketplace."
      module="BuildConnect marketplace"
      icon={<Network className="h-7 w-7 text-[#F97316]" />}
    >
    <Layout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border"
                style={{
                  color: BRAND,
                  borderColor: `${BRAND}55`,
                  backgroundColor: `${BRAND}14`,
                }}
              >
                <Zap className="w-3 h-3" />
                Connected add-on
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Network className="h-7 w-7" style={{ color: BRAND }} />
              BuildConnect
            </h1>
            <p className="text-slate-700 mt-1 font-medium">
              You win the bid. The network executes.
            </p>
            <p className="text-slate-500 mt-0.5 text-sm max-w-2xl">
              No self-perform required. Match won jobs to vetted trade subs,
              track availability and assignments, and score performance and
              reliability from recorded history.
            </p>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Users,
              label: "Network Subs",
              value: kpis.total,
              sub: "Vetted trade partners",
              color: BRAND,
            },
            {
              icon: CheckCircle2,
              label: "Available Now",
              value: kpis.availableNow,
              sub: "Ready to mobilize",
              color: "#22C55E",
            },
            {
              icon: Handshake,
              label: "Active Assignments",
              value: kpis.activeAssignments,
              sub: "Assigned or in-progress",
              color: "#0284C7",
            },
            {
              icon: ShieldCheck,
              label: "Avg Reliability",
              value: kpis.avgReliability,
              sub: "From recorded history",
              color: "#7C3AED",
            },
          ].map((k) => (
            <Card
              key={k.label}
              className="bg-white border border-[#E2E8F0] shadow-sm rounded-xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <k.icon className="w-10 h-10" style={{ color: k.color }} />
              </div>
              <CardContent className="p-5 relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <k.icon className="w-4 h-4" style={{ color: k.color }} />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {k.label}
                  </span>
                </div>
                <div className="text-3xl font-bold text-slate-900 tracking-tight">
                  {k.value}
                </div>
                <p className="text-[10px] text-slate-500 mt-1 font-medium tracking-wide">
                  {k.sub}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Sub Marketplace */}
          <div className="xl:col-span-2 space-y-4">
            <Card className="bg-white border border-[#E2E8F0] shadow-sm rounded-xl">
              <CardHeader className="p-4 border-b border-[#E2E8F0]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                    <HardHat className="w-4 h-4" style={{ color: BRAND }} />
                    SUB MARKETPLACE
                  </CardTitle>
                  <div className="flex flex-wrap gap-1.5">
                    {trades.map((t) => {
                      const active = tradeFilter === t;
                      return (
                        <button
                          key={t}
                          onClick={() => setTradeFilter(t)}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                            active
                              ? "text-white border-transparent"
                              : "bg-[#F1F5F9] text-slate-600 border-[#E2E8F0] hover:bg-[#E2E8F0]"
                          }`}
                          style={
                            active
                              ? { backgroundColor: BRAND }
                              : undefined
                          }
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {filteredSubs.map((sub) => {
                  const avail = AVAILABILITY_STYLES[sub.availability];
                  return (
                    <div
                      key={sub.id}
                      className="rounded-lg border border-[#E2E8F0] bg-white p-4 hover:border-[#CBD5E1] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-slate-900">
                              {sub.company}
                            </span>
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded border bg-[#F1F5F9] text-slate-600 border-[#E2E8F0]">
                              {sub.trade}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {sub.region}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${avail.className}`}
                          >
                            {avail.label}
                          </span>
                          {sub.availabilityDate && (
                            <span className="text-[10px] text-slate-500">
                              {sub.availabilityDate}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <ScoreBar
                          label="Performance"
                          value={sub.performanceScore}
                          color={BRAND}
                        />
                        <ScoreBar
                          label="Reliability"
                          value={sub.reliabilityScore}
                          color="#7C3AED"
                        />
                      </div>

                      <div className="flex items-center flex-wrap gap-x-4 gap-y-1.5 mt-3 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Trophy className="w-3 h-3" />
                          {sub.jobsCompleted} jobs completed
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />~{sub.avgResponseHrs}h avg
                          response
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {sub.activeAssignments} active
                        </span>
                        <span
                          className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold border capitalize ${RATE_STYLES[sub.rateSignal]}`}
                        >
                          {sub.rateSignal} rate
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {sub.certifications.map((c) => (
                          <span
                            key={c}
                            className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#F1F5F9] text-slate-600 border border-[#E2E8F0]"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Right column: Assignments + Trade demand */}
          <div className="space-y-6">
            {/* Assignments panel */}
            <Card className="bg-white border border-[#E2E8F0] shadow-sm rounded-xl">
              <CardHeader className="p-4 border-b border-[#E2E8F0]">
                <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                  <Handshake className="w-4 h-4" style={{ color: BRAND }} />
                  MATCHING ENGINE
                </CardTitle>
                <div className="flex items-center flex-wrap gap-1 mt-2">
                  {ASSIGNMENT_STAGES.map((s, i) => (
                    <div key={s.key} className="flex items-center gap-1">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${s.className}`}
                      >
                        {s.label}
                      </span>
                      {i < ASSIGNMENT_STAGES.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {subAssignments.map((a) => {
                  const stage = ASSIGNMENT_STAGES.find(
                    (s) => s.key === a.status,
                  )!;
                  return (
                    <div
                      key={a.id}
                      className="rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-[12px] font-bold text-slate-900 truncate">
                            {a.jobName}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {a.sub} &middot; {a.trade}
                          </div>
                        </div>
                        <span
                          className={`shrink-0 inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${stage.className}`}
                        >
                          {stage.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          Sub Bid
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          {money(a.bidAmount)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
                        {a.negotiationNote}
                      </p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Trade demand mini-panel */}
            <Card className="bg-white border border-[#E2E8F0] shadow-sm rounded-xl">
              <CardHeader className="p-4 border-b border-[#E2E8F0]">
                <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#0284C7]" />
                  TRADE DEMAND
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {tradeDemand.map((row) => (
                  <div
                    key={row.trade}
                    className="rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[12px] font-bold text-slate-900">
                        {row.trade}
                      </span>
                      <span
                        className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${DEMAND_STYLES[row.demandLevel]}`}
                      >
                        {row.demandLevel}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-[11px] text-slate-500">
                      <span>
                        <span className="font-semibold text-slate-900">
                          {row.openJobs}
                        </span>{" "}
                        open jobs
                      </span>
                      <span>
                        <span className="font-semibold text-slate-900">
                          {row.availableSubs}
                        </span>{" "}
                        subs open
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                      {row.note}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Integration strip */}
        <Card className="bg-white border border-[#E2E8F0] shadow-sm rounded-xl">
          <CardHeader className="p-4 border-b border-[#E2E8F0]">
            <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
              <Network className="w-4 h-4" style={{ color: BRAND }} />
              CONNECTED INTO YOUR WORKFLOW
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  icon: Trophy,
                  label: "Won Jobs",
                  desc: "Matched sub shortlists attach to each awarded job.",
                  href: "/won-jobs",
                },
                {
                  icon: CalendarDays,
                  label: "Scheduling",
                  desc: "Sub availability flows into the crew & sub schedule.",
                  href: "/scheduling",
                },
                {
                  icon: Users,
                  label: "Labor & Subs",
                  desc: "Performance scores update the Labor & Subs roster.",
                  href: "/labor",
                },
              ].map((it) => (
                <Link
                  key={it.label}
                  href={it.href}
                  className="rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] p-3 hover:border-[#CBD5E1] transition-colors block"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <it.icon className="w-4 h-4 text-[#0284C7]" />
                    <span className="text-[12px] font-bold text-slate-900">
                      {it.label}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-400 ml-auto" />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {it.desc}
                  </p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Guardrail footer */}
        <div className="rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Performance and reliability scores are decision-support signals based
            on recorded job history — they imply no guaranteed outcomes. Rate
            signals reflect lawful, public market ranges only and expose no
            internal pricing formula. Contractors verify licensing and insurance
            before any award; run credentials through{" "}
            <Link
              href="/compliance-connect"
              className="font-semibold text-[#0284C7] hover:underline"
            >
              ComplianceConnect
            </Link>{" "}
            prior to mobilization.
          </p>
        </div>
      </div>
    </Layout>
    </OpsModuleGate>
  );
}
