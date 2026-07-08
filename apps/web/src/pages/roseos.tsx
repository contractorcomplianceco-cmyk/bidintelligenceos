import { useState } from "react";
import { Link } from "wouter";
import { useRoseOsSummary } from "@/hooks/use-bids";
import { useAuth } from "@/lib/auth-context";
import { useLiveData } from "@/lib/data-mode";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/lib/context";
import {
  roseInsights,
  insightsBySection,
  executiveSummary,
  roseStats,
  ROSE_SECTIONS,
  ROSE_GUARDRAIL,
  VERDICT_META,
  type Verdict,
  type RoseSectionMeta,
} from "@core/roseos";
import {
  RoseOsLogo,
  RoseOsMark,
  RoseOsBadge,
  VerdictBadge,
  ROSE_COLOR,
  ROSE_COLOR_DARK,
} from "@/components/roseos/brand";
import {
  ArrowRight,
  Layers,
  ShieldCheck,
  Radar,
  FileSearch,
  Activity,
  TrendingUp,
  BadgeCheck,
  Network,
  Sparkles,
} from "lucide-react";

const SECTION_ICONS: Record<RoseSectionMeta["key"], typeof FileSearch> = {
  "bid-risk": FileSearch,
  "job-risk": Activity,
  "market-strategy": TrendingUp,
  compliance: BadgeCheck,
};

const MODULE_LAYER = [
  { name: "BidIntelligenceOS", href: "/bids" },
  { name: "MarketWatchOS", href: "/market-watch" },
  { name: "BuildConnect", href: "/build-connect" },
  { name: "ComplianceConnect", href: "/compliance-connect" },
  { name: "ContractorConnect", href: "/settings" },
];

type VerdictFilter = Verdict | "all";

export default function RoseOs() {
  const { verticalConfig } = useAppContext();
  const { isAuthenticated } = useAuth();
  const live = useLiveData(isAuthenticated);
  const { data: liveRose } = useRoseOsSummary();
  const [filter, setFilter] = useState<VerdictFilter>("all");

  const headline = live && liveRose
    ? liveRose.insights[0]?.summary ?? executiveSummary.headline
    : executiveSummary.headline;
  const posture = (live && liveRose ? liveRose.verdict : executiveSummary.posture) as Verdict;

  const filtered = (items: typeof roseInsights) =>
    filter === "all" ? items : items.filter((i) => i.verdict === filter);

  const verdictCounts: { key: VerdictFilter; label: string; count: number; color?: string }[] = [
    { key: "all", label: "All verdicts", count: roseStats.total },
    { key: "green", label: "Green Light", count: roseStats.green, color: VERDICT_META.green.color },
    { key: "yellow", label: "Yellow Flag", count: roseStats.yellow, color: VERDICT_META.yellow.color },
    { key: "red", label: "Red Alert", count: roseStats.red, color: VERDICT_META.red.color },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Hero — the layer above the modules */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
          <div
            className="h-1 w-full"
            style={{ background: `linear-gradient(90deg, ${ROSE_COLOR}, #FDA4AF, transparent)` }}
          />
          <div className="p-6 flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 flex-wrap mb-3">
                <RoseOsLogo size={34} />
                <RoseOsBadge />
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                Executive decision intelligence for your {verticalConfig.name.toLowerCase()} operation
              </h1>
              <p className="text-slate-500 mt-2 leading-relaxed">
                ROSEOS sits above every connected module. It is not a chatbot — it evaluates bids
                before submission, forecasts job risk in real time, reviews market opportunity
                strength, and watches compliance readiness, then issues executive-level
                recommendations with a three-tier verdict.
              </p>
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <VerdictBadge verdict="green" />
                <VerdictBadge verdict="yellow" />
                <VerdictBadge verdict="red" />
                <span className="text-[10px] text-slate-500 ml-1">
                  Proceed · Adjust strategy · Avoid or revise
                </span>
              </div>
            </div>

            {/* Layer diagram */}
            <div className="rounded-xl border border-[#FECDD3] bg-[#FFF1F2] p-4 w-full xl:w-[340px] flex-shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4" style={{ color: ROSE_COLOR_DARK }} />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: ROSE_COLOR_DARK }}>
                  The layer above the modules
                </span>
              </div>
              <div className="rounded-lg bg-white border border-[#FECDD3] px-3 py-2.5 flex items-center justify-between shadow-sm">
                <span className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <RoseOsMark size={16} /> ROSEOS
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: ROSE_COLOR_DARK }}>
                  Intelligence — not execution
                </span>
              </div>
              <div className="flex justify-center py-1.5">
                <Network className="w-3.5 h-3.5 text-[#FDA4AF]" />
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {MODULE_LAYER.map((m) => (
                  <Link key={m.name} href={m.href}>
                    <span className="block rounded-md bg-white/70 border border-[#FECDD3] px-2 py-1.5 text-[10px] font-medium text-slate-700 hover:bg-white transition-colors truncate cursor-pointer">
                      {m.name}
                    </span>
                  </Link>
                ))}
                <span className="rounded-md border border-dashed border-[#FDA4AF] px-2 py-1.5 text-[10px] text-[#BE123C]/70 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Reads all signals
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Verdict summary stats + filter */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {verdictCounts.map((v) => {
            const active = filter === v.key;
            return (
              <button
                key={v.key}
                onClick={() => setFilter(v.key)}
                className={`text-left rounded-xl border bg-white shadow-sm p-4 transition-all ${
                  active ? "ring-2 ring-offset-1" : "hover:border-[#CBD5E1]"
                }`}
                style={{
                  borderColor: active ? (v.color ?? ROSE_COLOR) : "#E2E8F0",
                  ...(active ? ({ "--tw-ring-color": v.color ?? ROSE_COLOR } as React.CSSProperties) : {}),
                }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  {v.key === "all" ? (
                    <RoseOsMark size={14} />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: v.color }} />
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {v.label}
                  </span>
                </div>
                <div className="text-3xl font-bold tabular-nums" style={{ color: v.color ?? "#0F172A" }}>
                  {v.count}
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {v.key === "all"
                    ? `across ${roseStats.modulesMonitored} connected modules`
                    : VERDICT_META[v.key as Verdict].action}
                </p>
              </button>
            );
          })}
        </div>

        {/* Executive Intelligence Summary */}
        <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
          <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between gap-3">
            <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
              <Radar className="w-4 h-4" style={{ color: ROSE_COLOR }} />
              EXECUTIVE INTELLIGENCE SUMMARY
            </CardTitle>
            <span className="text-[10px] text-slate-500">As of {executiveSummary.asOf}</span>
          </CardHeader>
          <CardContent className="p-5">
            <div className="flex items-start gap-3 flex-wrap mb-3">
              <VerdictBadge verdict={posture} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">
                {VERDICT_META[posture].label}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {headline}
            </h2>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-4xl">
              {executiveSummary.narrative}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
              {executiveSummary.priorities.map((p) => (
                <Link key={p.id} href={p.href}>
                  <div className="h-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 hover:border-[#FDA4AF] transition-colors cursor-pointer">
                    <VerdictBadge verdict={p.verdict} size="sm" />
                    <p className="text-xs font-semibold text-slate-900 leading-snug mt-2">
                      {p.headline}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1 leading-snug">{p.detail}</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest mt-2" style={{ color: ROSE_COLOR_DARK }}>
                      via {p.sourceModule}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Four intelligence sections */}
        {ROSE_SECTIONS.map((section) => {
          const Icon = SECTION_ICONS[section.key];
          const items = filtered(insightsBySection(section.key));
          const all = insightsBySection(section.key);
          return (
            <Card key={section.key} className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
              <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#FFF1F2] border border-[#FECDD3] flex-shrink-0">
                    <Icon className="w-4 h-4" style={{ color: ROSE_COLOR_DARK }} />
                  </span>
                  <div className="min-w-0">
                    <CardTitle className="text-sm font-bold text-slate-900 tracking-wide uppercase">
                      {section.label}
                    </CardTitle>
                    <p className="text-[10px] text-slate-500 mt-0.5">{section.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {(["green", "yellow", "red"] as Verdict[]).map((v) => {
                    const c = all.filter((i) => i.verdict === v).length;
                    return (
                      <span
                        key={v}
                        className="inline-flex items-center gap-1 text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded"
                        style={{ color: VERDICT_META[v].color, backgroundColor: VERDICT_META[v].bg }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: VERDICT_META[v].color }} />
                        {c}
                      </span>
                    );
                  })}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {items.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    No {filter !== "all" ? VERDICT_META[filter as Verdict].label.toLowerCase() : ""} items
                    in this section right now.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4 flex flex-col"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <VerdictBadge verdict={item.verdict} size="sm" />
                          <span className="text-[9px] text-slate-500 flex-shrink-0">{item.detectedAgo}</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900 leading-snug mt-2">
                          {item.title}
                        </p>
                        <p className="text-[10px] font-medium text-slate-500 mt-0.5">{item.subject}</p>
                        <p className="text-xs text-slate-600 leading-relaxed mt-2">{item.rationale}</p>
                        <div className="mt-3 rounded-md border border-[#FECDD3] bg-[#FFF1F2] px-3 py-2">
                          <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: ROSE_COLOR_DARK }}>
                            ROSEOS recommendation — flagged for review
                          </p>
                          <p className="text-[11px] text-slate-700 leading-snug">{item.recommendation}</p>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-[#E2E8F0]">
                          <span className="text-[9px] text-slate-500 truncate">
                            <span className="font-bold uppercase tracking-widest" style={{ color: ROSE_COLOR_DARK }}>
                              {item.sourceModule}
                            </span>{" "}
                            · {item.sourceSignal} · {item.confidence} confidence
                          </span>
                          {item.href && (
                            <Link
                              href={item.href}
                              className="text-[10px] font-semibold flex items-center gap-1 flex-shrink-0 hover:text-slate-900 transition-colors"
                              style={{ color: ROSE_COLOR_DARK }}
                            >
                              Open source module <ArrowRight className="w-2.5 h-2.5" />
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* Guardrail footer */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm p-4 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-[#0284C7] flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-500 leading-relaxed">{ROSE_GUARDRAIL}</p>
        </div>
      </div>
    </Layout>
  );
}
