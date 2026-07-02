import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/lib/context";
import {
  dailyBriefing,
  type BriefingItem,
  type AlertCategory,
  type AlertSeverity,
} from "@/lib/operations";
import {
  Sunrise,
  Sparkles,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  CloudRain,
  FileWarning,
  Users,
  TrendingUp,
  PhoneCall,
  CalendarClock,
  DollarSign,
  Archive,
  ChevronRight,
} from "lucide-react";

const severityStyles: Record<AlertSeverity, { text: string; bg: string; border: string; dot: string }> = {
  Critical: { text: "text-[#EF4444]", bg: "bg-[#EF4444]/10", border: "border-[#EF4444]/30", dot: "bg-[#EF4444]" },
  High: { text: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10", border: "border-[#F59E0B]/30", dot: "bg-[#F59E0B]" },
  Medium: { text: "text-[#0284C7]", bg: "bg-[#38BDF8]/10", border: "border-[#38BDF8]/30", dot: "bg-[#38BDF8]" },
  Info: { text: "text-slate-500", bg: "bg-[#8A96B0]/10", border: "border-[#8A96B0]/30", dot: "bg-[#8A96B0]" },
};

const categoryIcon: Record<AlertCategory, typeof CloudRain> = {
  Weather: CloudRain,
  Permit: FileWarning,
  Cost: DollarSign,
  Labor: Users,
  Subcontractor: Users,
  "Follow-Up": PhoneCall,
  ROI: TrendingUp,
  Schedule: CalendarClock,
};

const categoryLink: Record<AlertCategory, string> = {
  Weather: "/weather",
  Permit: "/permits",
  Cost: "/cost-roi",
  Labor: "/labor",
  Subcontractor: "/labor",
  "Follow-Up": "/leads",
  ROI: "/cost-roi",
  Schedule: "/scheduling",
};

interface ArchivedBriefing {
  id: string;
  date: string;
  summary: string;
  highlight: AlertSeverity;
}

const briefingArchive: ArchivedBriefing[] = [
  {
    id: "arch-1",
    date: "Monday, June 30, 2025",
    summary:
      "4 bids advanced to follow-up, Harbor Point cleared final inspection prep, and labor burn flagged 12% over plan across active jobs.",
    highlight: "High",
  },
  {
    id: "arch-2",
    date: "Friday, June 27, 2025",
    summary:
      "Gateway MEP rough-in inspection scheduled, Cedar Ridge tear-off completed on-window, and 2 subcontractor COIs flagged as expiring.",
    highlight: "Medium",
  },
  {
    id: "arch-3",
    date: "Thursday, June 26, 2025",
    summary:
      "Storm system delayed Cedar Ridge dry-in, Summit Plaza mitigation began, and Northline rooftop rigging moved to a wind-safe window.",
    highlight: "Critical",
  },
  {
    id: "arch-4",
    date: "Wednesday, June 25, 2025",
    summary:
      "3 new opportunities intook for the pipeline, Metro Retail Q2 SLA review passed, and Gateway change orders logged for margin review.",
    highlight: "Medium",
  },
];

export default function Briefings() {
  const { toast } = useToast();
  const { verticalConfig } = useAppContext();
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  const criticalCount = useMemo(
    () => dailyBriefing.items.filter((i) => i.priority === "Critical").length,
    []
  );

  const handleAction = (item: BriefingItem) => {
    toast({
      title: item.action,
      description: `${item.headline} — action queued from your morning brief.`,
    });
  };

  const handleGenerate = () => {
    const stamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setGeneratedAt(stamp);
    toast({
      title: "Briefing regenerated",
      description: `Refreshed with the latest operational signals for ${verticalConfig.name}.`,
    });
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Sunrise className="h-7 w-7 text-[#0284C7]" />
              Daily Intelligent Briefing
            </h2>
            <p className="text-slate-500 mt-1">
              Your automated morning brief for the {verticalConfig.name} operation. Decision-support guidance only.
            </p>
          </div>
          <button
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#2563EB]/90 text-white text-sm font-semibold rounded-lg px-4 py-2.5 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Generate today's briefing
          </button>
        </div>

        {/* Hero briefing card */}
        <Card className="bg-white border-[#E2E8F0] overflow-hidden relative">
          <div className="absolute top-0 right-0 p-6 opacity-[0.06] pointer-events-none">
            <Sparkles className="w-40 h-40 text-[#0284C7]" />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#0284C7]">
                {dailyBriefing.date}
              </span>
              {generatedAt && (
                <span className="text-[10px] font-medium text-slate-500">· refreshed {generatedAt}</span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{dailyBriefing.greeting}</h3>
            <p className="text-slate-500 mt-2 max-w-3xl leading-relaxed">{dailyBriefing.summary}</p>

            {/* Stat chips */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
              {dailyBriefing.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] px-4 py-3"
                >
                  <div className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* VoiceConnect hint */}
            <div className="mt-5 flex items-center gap-2 text-xs text-[#0BA3A8]">
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="font-medium">
                Ask VoiceConnect: "Brief me on what needs attention today."
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Priority items + summary rail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items list */}
          <Card className="lg:col-span-2 bg-white border-[#E2E8F0] flex flex-col">
            <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                TODAY'S PRIORITY ITEMS
              </CardTitle>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {dailyBriefing.items.length} items · {criticalCount} critical
              </span>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-[#E2E8F0]">
              {dailyBriefing.items.map((item, idx) => {
                const style = severityStyles[item.priority];
                const Icon = categoryIcon[item.category];
                return (
                  <div key={item.id} className="p-4 hover:bg-[#F1F5F9] transition-colors group">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center pt-0.5">
                        <span className="text-[10px] font-bold text-slate-500 tabular-nums">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className={`shrink-0 rounded-lg p-2 ${style.bg} border ${style.border}`}>
                        <Icon className={`w-4 h-4 ${style.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-semibold text-slate-900">{item.headline}</h4>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${style.bg} ${style.text} border ${style.border}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                            {item.priority}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-[#E2E8F0] text-slate-500">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{item.detail}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() => handleAction(item)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${style.bg} ${style.text} border ${style.border} hover:brightness-125`}
                          >
                            {item.action}
                            <ArrowRight className="w-3 h-3" />
                          </button>
                          <Link
                            href={categoryLink[item.category]}
                            className="text-[11px] font-medium text-slate-500 hover:text-[#0284C7] transition-colors flex items-center gap-1"
                          >
                            Open module <ChevronRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Right rail: guardrail + quick links */}
          <div className="space-y-6">
            <Card className="bg-white border-[#E2E8F0]">
              <CardHeader className="p-4 border-b border-[#E2E8F0]">
                <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0284C7]" />
                  HOW THIS BRIEF IS BUILT
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Signals are synthesized from active bids, job deployments, permits, weather, labor
                  utilization, and cost tracking, then ranked by operational impact for the{" "}
                  <span className="text-slate-900 font-medium">{verticalConfig.name}</span> workflow.
                </p>
                <div className="rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-3 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0BA3A8] shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Decision-support guidance only. Projections require user verification and imply no
                    guaranteed bid, schedule, or award outcomes. Review before sending any client-facing
                    output.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E2E8F0]">
              <CardHeader className="p-4 border-b border-[#E2E8F0]">
                <CardTitle className="text-sm font-bold text-slate-900 tracking-wide">JUMP TO MODULE</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Alerts", href: "/alerts", icon: FileWarning },
                    { label: "Weather", href: "/weather", icon: CloudRain },
                    { label: "Labor & Subs", href: "/labor", icon: Users },
                    { label: "Cost & ROI", href: "/cost-roi", icon: TrendingUp },
                  ].map((m) => (
                    <Link
                      key={m.href}
                      href={m.href}
                      className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-2.5 hover:border-[#CBD5E1] hover:bg-[#F1F5F9] transition-colors group"
                    >
                      <m.icon className="w-4 h-4 text-[#0284C7]" />
                      <span className="text-xs font-medium text-slate-900 group-hover:text-[#0284C7] transition-colors">
                        {m.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Archive */}
        <Card className="bg-white border-[#E2E8F0]">
          <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
              <Archive className="w-4 h-4 text-slate-500" />
              BRIEFING ARCHIVE
            </CardTitle>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Prior mornings
            </span>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-[#E2E8F0]">
            {briefingArchive.map((brief) => {
              const style = severityStyles[brief.highlight];
              return (
                <div
                  key={brief.id}
                  className="p-4 flex items-start gap-3 hover:bg-[#F1F5F9] transition-colors"
                >
                  <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-slate-900">{brief.date}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${style.bg} ${style.text} border ${style.border}`}
                      >
                        {brief.highlight}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{brief.summary}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
