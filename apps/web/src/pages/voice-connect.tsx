import { Layout } from "@/components/layout";
import { OpsModuleGate } from "@/components/ops-module-gate";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { activateOnKey } from "@shared/a11y";
import {
  ArrowRight,
  AudioLines,
  ClipboardList,
  Users,
  Phone,
  FileText,
  Headphones,
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { VoiceConnectWordmark } from "@/components/voice-connect/logo";
import { PhoneShowcase } from "@/components/voice-connect/phones";
import { FeaturePillars } from "@/components/voice-connect/pillars";
import { useAuth } from "@/lib/auth-context";
import { useLiveData } from "@/lib/data-mode";
import {
  useVoiceConnectCaptures,
  useVoiceConnectStatus,
  type VoiceConnectCapture,
} from "@/hooks/use-voice-connect";

const TEAL = "#0BA3A8";

const DEMO_CAPTURES = [
  {
    icon: ClipboardList,
    title: "Riverside Medical — Site Walkthrough",
    meta: "Bldg A roof & mechanical · 12:47",
    date: "Today, 9:41 AM",
    status: "Draft bid created",
    done: true,
  },
  {
    icon: Phone,
    title: "Cedar Logistics — Pre-bid Call",
    meta: "Scope clarifications · 08:12",
    date: "Yesterday",
    status: "Synced",
    done: true,
  },
  {
    icon: Users,
    title: "Metro Transit — Walkthrough Notes",
    meta: "MEP conditions · 21:30",
    date: "2 days ago",
    status: "Processing",
    done: false,
  },
  {
    icon: FileText,
    title: "Harbor Point — Project Update",
    meta: "Punch list & risks · 06:55",
    date: "3 days ago",
    status: "Synced",
    done: true,
  },
];

const DEMO_STATS = [
  { label: "Captures this week", value: "9" },
  { label: "Items auto-tagged", value: "146" },
  { label: "Draft bids created", value: "4" },
];

const REPORT_STATS = [
  { icon: ImageIcon, label: "Photos Captured", value: "24", color: TEAL },
  { icon: AlertTriangle, label: "Missing Info", value: "5", color: "#F59E0B" },
  { icon: AlertTriangle, label: "Risk Flags", value: "3", color: "#EF4444" },
];

type CaptureRow = {
  icon: typeof ClipboardList;
  title: string;
  meta: string;
  date: string;
  status: string;
  done: boolean;
  bidId?: string | null;
};

function captureIcon(c: VoiceConnectCapture) {
  if (c.status.toLowerCase().includes("call")) return Phone;
  if (c.status.toLowerCase().includes("process")) return Users;
  return ClipboardList;
}

function VoiceConnectHeader({ connected, appUrl }: { connected?: boolean; appUrl?: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#0BA3A8]/25 bg-white shadow-sm p-6 lg:p-8">
      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <VoiceConnectWordmark textClassName="text-xl" markClassName="h-7 w-auto text-slate-900" />
            <span
              className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{ color: TEAL, background: "rgba(11,163,168,0.1)", border: "1px solid rgba(11,163,168,0.35)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: TEAL }} />
              {connected ? "Live integration" : "Connected add-on"}
            </span>
          </div>
          <p className="mt-3 text-lg text-slate-900 font-semibold tracking-tight">
            Capture it. Connect it. Build it.
          </p>
          <p className="mt-1.5 text-sm text-slate-500 max-w-xl leading-relaxed">
            A connected field companion for CCA BidIntelligenceOS. Walk a site, talk through what you see,
            and VoiceConnect transcribes, tags, and feeds field data into BidIntelligenceOS as a draft bid.
          </p>
          {connected && appUrl && (
            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
              style={{ color: TEAL }}
            >
              Open VoiceConnect capture app
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
        <div
          className="shrink-0 rounded-xl border px-4 py-3 flex items-center gap-3"
          style={{ borderColor: "rgba(11,163,168,0.4)", background: "rgba(11,163,168,0.08)" }}
        >
          <Headphones className="w-5 h-5" style={{ color: TEAL }} />
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-900">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: TEAL }} />
              {connected ? "API connected" : "Connected"}
            </div>
            <div className="text-[10px] text-slate-500">
              {connected ? "Field capture service reachable" : "Jabra Elite 8 Active · 100%"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VoiceConnectBody({
  captures,
  stats,
  live = false,
}: {
  captures: CaptureRow[];
  stats: { label: string; value: string }[];
  live?: boolean;
}) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const readiness = live ? (captures.length > 0 ? 72 : 0) : 68;
  const R = 52;
  const C = 2 * Math.PI * R;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-[#E2E8F0] bg-white p-5">
            <div className="text-[11px] uppercase tracking-widest text-slate-400">{s.label}</div>
            <div className="mt-1 text-3xl font-bold text-slate-900">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E2E8F0]">
            <h3 className="text-sm font-semibold text-slate-900">Recent Field Captures</h3>
            <Sparkles className="w-4 h-4" style={{ color: TEAL }} />
          </div>
          {captures.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-slate-500">
              No captures yet. Record a site walkthrough in VoiceConnect to populate this list.
            </div>
          ) : (
            captures.map((c) => {
              const openCapture = () =>
                c.done
                  ? navigate(c.bidId ? `/bids/${c.bidId}` : "/bids")
                  : toast({
                      title: "Capture processing",
                      description: "This capture is still being transcribed and tagged.",
                    });
              return (
                <div
                  key={c.title}
                  onClick={openCapture}
                  onKeyDown={activateOnKey(openCapture)}
                  role="button"
                  tabIndex={0}
                  aria-label={
                    c.done ? `Open captured bid ${c.title}` : `Capture ${c.title} is still processing`
                  }
                  className="flex items-center gap-3 px-5 py-3.5 border-b border-[#E2E8F0] last:border-0 hover:bg-[#F1F5F9]/50 transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#0BA3A8]"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#0BA3A8]/10 border border-[#0BA3A8]/20 flex items-center justify-center shrink-0">
                    <c.icon className="w-4 h-4" style={{ color: TEAL }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-slate-900 truncate">{c.title}</div>
                    <div className="text-xs text-slate-500 truncate">{c.meta}</div>
                  </div>
                  <div className="hidden sm:block text-xs text-slate-400 shrink-0">{c.date}</div>
                  <span
                    className="shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium border"
                    style={
                      c.done
                        ? {
                            color: "#22C55E",
                            borderColor: "rgba(34,197,94,0.3)",
                            background: "rgba(34,197,94,0.08)",
                          }
                        : {
                            color: "#F59E0B",
                            borderColor: "rgba(245,158,11,0.3)",
                            background: "rgba(245,158,11,0.08)",
                          }
                    }
                  >
                    {c.done && <CheckCircle2 className="w-3 h-3" />}
                    {c.status}
                  </span>
                </div>
              );
            })
          )}
        </div>

        <div className="rounded-xl border border-[#0BA3A8]/25 bg-white p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4" style={{ color: TEAL }} />
            <span className="text-sm font-semibold text-slate-900">Draft Site Report</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-24 h-24 shrink-0">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r={R} fill="none" stroke="#E2E8F0" strokeWidth="10" />
                <circle
                  cx="60"
                  cy="60"
                  r={R}
                  fill="none"
                  stroke={TEAL}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={C * (1 - readiness / 100)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-900 leading-none">{readiness}%</span>
                <span className="text-[8px] uppercase tracking-widest text-slate-400 mt-0.5">Ready</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {live
                ? "Live captures feed draft readiness scores after human review."
                : "Good start. Address missing info and risk flags to improve readiness before building the bid."}
            </p>
          </div>
          <div className="space-y-2">
            {REPORT_STATS.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-2"
              >
                <s.icon className="w-4 h-4 shrink-0" style={{ color: s.color }} />
                <span className="text-xs text-slate-700 flex-1">{s.label}</span>
                <span className="text-sm font-bold" style={{ color: s.color }}>
                  {s.value}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              toast({
                title: live ? "Review in Bid Intelligence" : "Draft bid profile created",
                description: live
                  ? "Open linked captures in Bid Intelligence after reviewer approval."
                  : "Capture sent to BidIntelligenceOS. Review required before use.",
              });
              navigate("/bids");
            }}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-colors hover:brightness-110"
            style={{ background: TEAL, color: "#06080B" }}
          >
            {live ? "Open Bid Intelligence" : "Create Draft Bid Profile"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!live && (
        <>
          <div className="rounded-2xl border border-white/10 bg-[#0B1220] p-6 lg:p-8">
            <div className="text-center mb-8">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>
                In the field
              </span>
              <h3 className="mt-2 text-2xl font-bold text-white tracking-tight">From walkthrough to draft bid</h3>
              <p className="mt-2 text-sm text-slate-300 max-w-md mx-auto">
                Choose a capture type, record hands-free, and hand the result off to BidIntelligenceOS.
              </p>
            </div>
            <PhoneShowcase />
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0B1220] p-6 lg:p-8">
            <FeaturePillars />
          </div>
        </>
      )}

      <div className="flex items-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5" style={{ color: TEAL }} />
        VoiceConnect output requires human review before any bid is built or exported.
      </div>
    </div>
  );
}

function VoiceConnectDemo() {
  return (
    <Layout>
      <div className="space-y-8 max-w-[1600px] mx-auto">
        <VoiceConnectHeader />
        <VoiceConnectBody captures={DEMO_CAPTURES} stats={DEMO_STATS} />
      </div>
    </Layout>
  );
}

function VoiceConnectLive() {
  const { isAuthenticated } = useAuth();
  const live = useLiveData(isAuthenticated);
  const { data: status } = useVoiceConnectStatus(live);
  const { data, isLoading, isError } = useVoiceConnectCaptures(live && Boolean(status?.available));

  const captures: CaptureRow[] = (data?.captures ?? []).map((c) => ({
    icon: captureIcon(c),
    title: c.title,
    meta: c.meta ?? "",
    date: c.date ?? "",
    status: c.status,
    done: Boolean(c.done ?? c.bidId),
    bidId: c.bidId,
  }));

  const stats = data?.stats
    ? [
        { label: "Captures this week", value: String(data.stats.capturesThisWeek) },
        { label: "Items auto-tagged", value: String(data.stats.itemsAutoTagged) },
        { label: "Draft bids created", value: String(data.stats.draftBidsCreated) },
      ]
    : [
        { label: "Captures this week", value: "0" },
        { label: "Items auto-tagged", value: "0" },
        { label: "Draft bids created", value: "0" },
      ];

  return (
    <Layout>
      <div className="space-y-8 max-w-[1600px] mx-auto">
        <VoiceConnectHeader connected appUrl={status?.appUrl} />
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500 py-8">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading captures from VoiceConnect…
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
            VoiceConnect is connected but capture data could not be loaded. The capture service may not
            expose a list endpoint yet — use the capture app link above to record walkthroughs.
          </div>
        ) : (
          <VoiceConnectBody captures={captures} stats={stats} live />
        )}
      </div>
    </Layout>
  );
}

export default function VoiceConnect() {
  return (
    <OpsModuleGate
      title="VoiceConnect"
      subtitle="Voice-first field capture that drafts bids into BidIntelligenceOS."
      module="VoiceConnect field capture"
      statusPath="/api/v1/integrations/voice-connect/status"
      icon={<AudioLines className="h-7 w-7 text-[#0BA3A8]" />}
      connectedChildren={<VoiceConnectLive />}
    >
      <VoiceConnectDemo />
    </OpsModuleGate>
  );
}
