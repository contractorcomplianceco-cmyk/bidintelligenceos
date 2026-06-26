import { Layout } from "@/components/layout";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { activateOnKey } from "@/lib/a11y";
import {
  ArrowRight,
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
} from "lucide-react";
import { VoiceConnectWordmark } from "@/components/voice-connect/logo";
import { PhoneShowcase } from "@/components/voice-connect/phones";
import { FeaturePillars } from "@/components/voice-connect/pillars";

const TEAL = "#0BA3A8";

const CAPTURES = [
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

const STATS = [
  { label: "Captures this week", value: "9" },
  { label: "Items auto-tagged", value: "146" },
  { label: "Draft bids created", value: "4" },
];

const REPORT_STATS = [
  { icon: ImageIcon, label: "Photos Captured", value: "24", color: TEAL },
  { icon: AlertTriangle, label: "Missing Info", value: "5", color: "#F59E0B" },
  { icon: AlertTriangle, label: "Risk Flags", value: "3", color: "#EF4444" },
];

export default function VoiceConnect() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const readiness = 68;
  const R = 52;
  const C = 2 * Math.PI * R;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl border border-[#0BA3A8]/25 bg-gradient-to-br from-[#0F1830] to-[#111A2E] p-6 lg:p-8">
          <div className="absolute inset-0 blueprint-texture opacity-10" aria-hidden="true" />
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <VoiceConnectWordmark textClassName="text-xl" markClassName="h-7 w-auto text-white" />
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ color: TEAL, background: "rgba(11,163,168,0.12)", border: "1px solid rgba(11,163,168,0.4)" }}
                >
                  Premium Add-On
                </span>
              </div>
              <p className="mt-3 text-lg text-white font-semibold tracking-tight">
                Capture it. Connect it. Build it.
              </p>
              <p className="mt-1.5 text-sm text-[#8A96B0] max-w-xl leading-relaxed">
                The voice-first field companion for CCA BidIntelligenceOS. Walk a site,
                talk through what you see, and let VoiceConnect transcribe, tag, and hand
                it off as a draft bid — no typing required.
              </p>
            </div>
            <div
              className="shrink-0 rounded-xl border px-4 py-3 flex items-center gap-3"
              style={{ borderColor: "rgba(11,163,168,0.4)", background: "rgba(11,163,168,0.08)" }}
            >
              <Headphones className="w-5 h-5" style={{ color: TEAL }} />
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: TEAL }} />
                  Connected
                </div>
                <div className="text-[10px] text-[#8A96B0]">Jabra Elite 8 Active · 100%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-xl border border-[#1C253B] bg-[#0F1830] p-5">
              <div className="text-[11px] uppercase tracking-widest text-[#5b6680]">{s.label}</div>
              <div className="mt-1 text-3xl font-bold text-white">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Recent captures + featured report */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 rounded-xl border border-[#1C253B] bg-[#0F1830] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1C253B]">
              <h3 className="text-sm font-semibold text-white">Recent Field Captures</h3>
              <Sparkles className="w-4 h-4" style={{ color: TEAL }} />
            </div>
            {CAPTURES.map((c) => {
              const openCapture = () =>
                c.done
                  ? navigate("/bids/1")
                  : toast({ title: "Capture processing", description: "This capture is still being transcribed and tagged." });
              return (
              <div
                key={c.title}
                onClick={openCapture}
                onKeyDown={activateOnKey(openCapture)}
                role="button"
                tabIndex={0}
                aria-label={c.done ? `Open captured bid ${c.title}` : `Capture ${c.title} is still processing`}
                className="flex items-center gap-3 px-5 py-3.5 border-b border-[#151D2E] last:border-0 hover:bg-[#151D2E]/50 transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#0BA3A8]"
              >
                <div className="w-9 h-9 rounded-lg bg-[#0BA3A8]/10 border border-[#0BA3A8]/20 flex items-center justify-center shrink-0">
                  <c.icon className="w-4 h-4" style={{ color: TEAL }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-white truncate">{c.title}</div>
                  <div className="text-xs text-[#8A96B0] truncate">{c.meta}</div>
                </div>
                <div className="hidden sm:block text-xs text-[#5b6680] shrink-0">{c.date}</div>
                <span
                  className="shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium border"
                  style={
                    c.done
                      ? { color: "#22C55E", borderColor: "rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.08)" }
                      : { color: "#F59E0B", borderColor: "rgba(245,158,11,0.3)", background: "rgba(245,158,11,0.08)" }
                  }
                >
                  {c.done && <CheckCircle2 className="w-3 h-3" />}
                  {c.status}
                </span>
              </div>
              );
            })}
          </div>

          {/* Featured draft report */}
          <div className="rounded-xl border border-[#0BA3A8]/25 bg-[#0F1830] p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4" style={{ color: TEAL }} />
              <span className="text-sm font-semibold text-white">Draft Site Report</span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-24 h-24 shrink-0">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r={R} fill="none" stroke="#1C253B" strokeWidth="10" />
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
                  <span className="text-2xl font-bold text-white leading-none">{readiness}%</span>
                  <span className="text-[8px] uppercase tracking-widest text-[#5b6680] mt-0.5">Ready</span>
                </div>
              </div>
              <p className="text-xs text-[#8A96B0] leading-relaxed">
                Good start. Address missing info and risk flags to improve readiness before
                building the bid.
              </p>
            </div>

            <div className="space-y-2">
              {REPORT_STATS.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-2 rounded-lg border border-[#1C253B] bg-[#0B1222] px-3 py-2"
                >
                  <s.icon className="w-4 h-4 shrink-0" style={{ color: s.color }} />
                  <span className="text-xs text-[#c2cad6] flex-1">{s.label}</span>
                  <span className="text-sm font-bold" style={{ color: s.color }}>
                    {s.value}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                toast({
                  title: "Draft bid profile created",
                  description: "Capture sent to BidIntelligenceOS. Review required before use.",
                });
                navigate("/bids/1");
              }}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-colors hover:brightness-110"
              style={{ background: TEAL, color: "#06080B" }}
            >
              Create Draft Bid Profile
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="mt-2 text-[10px] text-[#5b6680] text-center">
              Review required before the bid is used or exported.
            </p>
          </div>
        </div>

        {/* Phone showcase */}
        <div className="rounded-2xl border border-[#1C253B] bg-[#0B1222] p-6 lg:p-8">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>
              In the field
            </span>
            <h3 className="mt-2 text-2xl font-bold text-white tracking-tight">
              From walkthrough to draft bid
            </h3>
            <p className="mt-2 text-sm text-[#8A96B0] max-w-md mx-auto">
              Choose a capture type, record hands-free, and hand the result off to
              BidIntelligenceOS.
            </p>
          </div>
          <PhoneShowcase />
        </div>

        {/* Pillars */}
        <FeaturePillars />

        {/* Footer note */}
        <div className="flex items-center gap-2 text-xs text-[#8A96B0]">
          <ShieldCheck className="w-3.5 h-3.5" style={{ color: TEAL }} />
          VoiceConnect output is a draft for demonstration and requires review before any bid is built or exported.
        </div>
      </div>
    </Layout>
  );
}
