import { type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  ClipboardList,
  Users,
  Phone,
  FileText,
  ChevronRight,
  ChevronLeft,
  MoreVertical,
  Mic,
  History,
  User,
  Camera,
  Square,
  Pause,
  Image as ImageIcon,
  AlertTriangle,
  HelpCircle,
  ListChecks,
  Battery,
  Wifi,
  SignalHigh,
  type LucideIcon,
} from "lucide-react";
import { VoiceConnectMark } from "./logo";

const TEAL = "#0BA3A8";
const ease = [0.16, 1, 0.3, 1] as const;

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-2.5 pb-1.5 text-[8px] font-semibold text-white/85 relative z-10">
      <span>9:41</span>
      <div className="flex items-center gap-1">
        <SignalHigh className="w-2.5 h-2.5" />
        <Wifi className="w-2.5 h-2.5" />
        <Battery className="w-3 h-3" />
      </div>
    </div>
  );
}

function PhoneFrame({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="w-full max-w-[248px] mx-auto">
      <div className="relative rounded-[2.1rem] border border-white/10 bg-[#06080B] p-1.5 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.85)]">
        <div className="relative overflow-hidden rounded-[1.7rem] bg-[#0F1419] aspect-[9/19.5]">
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 h-4 w-20 rounded-full bg-black z-30" />
          <StatusBar />
          <div className="relative z-0 h-[calc(100%-1.6rem)]">{children}</div>
        </div>
      </div>
      {label && (
        <p className="mt-3 text-center text-[11px] font-medium uppercase tracking-widest text-[#5b6680]">
          {label}
        </p>
      )}
    </div>
  );
}

function TabBar({ active }: { active: string }) {
  const tabs: { id: string; label: string; icon: LucideIcon }[] = [
    { id: "capture", label: "Capture", icon: Mic },
    { id: "history", label: "History", icon: History },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "profile", label: "Profile", icon: User },
  ];
  return (
    <div className="absolute inset-x-0 bottom-0 flex items-center justify-around border-t border-white/5 bg-[#0B0E12]/95 px-2 py-2 backdrop-blur">
      {tabs.map((t) => {
        const on = t.id === active;
        return (
          <div key={t.id} className="flex flex-col items-center gap-0.5">
            <t.icon className="w-3.5 h-3.5" style={{ color: on ? TEAL : "#5b6680" }} />
            <span className="text-[7px]" style={{ color: on ? TEAL : "#5b6680" }}>
              {t.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* Screen 1 — Capture purpose */
export function ScreenCapture() {
  const options: { icon: LucideIcon; title: string; sub: string; hot?: boolean }[] = [
    { icon: ClipboardList, title: "New Bid Site Walkthrough", sub: "Capture site conditions, scope, and risks", hot: true },
    { icon: Users, title: "Meeting Notes", sub: "Record meeting notes and action items" },
    { icon: Phone, title: "Client Call", sub: "Capture call notes and follow-ups" },
    { icon: FileText, title: "Project Update", sub: "Share progress, issues, and next steps" },
  ];
  return (
    <div className="flex flex-col h-full px-3.5 pb-14 pt-1">
      <div className="flex items-center justify-between mb-3">
        <VoiceConnectMark className="h-3.5 w-auto text-white" />
        <Settings className="w-3 h-3 text-[#5b6680]" />
      </div>
      <h3 className="text-[13px] font-bold text-white leading-tight">
        What's the purpose of this capture?
      </h3>
      <p className="mt-1 text-[8.5px] text-[#8A96B0] leading-snug">
        Choose the best option for your session.
      </p>
      <div className="mt-3 space-y-2">
        {options.map((o, i) => (
          <motion.div
            key={o.title}
            className="flex items-center gap-2.5 rounded-xl border px-2.5 py-2.5"
            style={{
              borderColor: o.hot ? "rgba(11,163,168,0.45)" : "#222A33",
              background: o.hot ? "rgba(11,163,168,0.08)" : "#161C23",
            }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.4, ease }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: o.hot ? TEAL : "#222A33",
              }}
            >
              <o.icon className="w-3.5 h-3.5" style={{ color: o.hot ? "#06080B" : "#9aa6b8" }} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[9.5px] font-semibold text-white truncate">{o.title}</div>
              <div className="text-[7.5px] text-[#8A96B0] truncate">{o.sub}</div>
            </div>
            <ChevronRight className="w-3 h-3 text-[#5b6680] shrink-0" />
          </motion.div>
        ))}
      </div>
      <TabBar active="capture" />
    </div>
  );
}

/* Screen 2 — Recording */
export function ScreenRecording() {
  const transcript = [
    { t: "00:15", text: "North side of the building. CMU walls look solid, but there's efflorescence at the base." },
    { t: "00:32", text: "Roof access is from the west side. Parapet cap is loose in sections. Recommend replacement." },
    { t: "00:47", text: "HVAC units appear original. No seismic bracing. Will need engineering review." },
  ];
  const chips = [
    { label: "Scope", icon: ListChecks },
    { label: "Photos", icon: ImageIcon },
    { label: "Risks", icon: AlertTriangle },
    { label: "Questions", icon: HelpCircle },
  ];
  return (
    <div className="flex flex-col h-full px-3.5 pb-16 pt-1">
      <div className="flex items-center gap-2 mb-2">
        <ChevronLeft className="w-3.5 h-3.5 text-[#8A96B0]" />
        <span className="text-[10px] font-semibold text-white">New Bid Site Walkthrough</span>
      </div>

      <div className="rounded-xl border border-[#222A33] bg-[#161C23] p-2.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#EF4444] opacity-70 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#EF4444]" />
          </span>
          <span className="text-[9px] font-semibold text-white">Recording</span>
          <span className="text-[9px] text-[#8A96B0]">· 02:47</span>
          <span className="ml-auto text-[7px] uppercase tracking-wider text-[#8A96B0]">Live transcript</span>
        </div>
        <div className="mt-1.5 flex items-center gap-1.5 text-[7.5px]" style={{ color: TEAL }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: TEAL }} />
          Connected — Jabra Elite 8 Active · 100%
        </div>
      </div>

      <div className="mt-2.5 flex-1 space-y-2 overflow-hidden">
        {transcript.map((line) => (
          <div key={line.t} className="flex gap-2">
            <span className="text-[7.5px] font-mono text-[#5b6680] pt-0.5 shrink-0">{line.t}</span>
            <p className="text-[8px] text-[#c2cad6] leading-snug">{line.text}</p>
          </div>
        ))}
        {/* waveform */}
        <div className="flex items-center gap-[2px] h-8 pt-1">
          {Array.from({ length: 34 }).map((_, i) => (
            <motion.span
              key={i}
              className="flex-1 rounded-full"
              style={{ background: TEAL, opacity: 0.55 }}
              animate={{ scaleY: [0.3, Math.random() * 0.9 + 0.3, 0.3] }}
              transition={{ duration: 0.9 + (i % 5) * 0.12, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {chips.map((c) => (
          <div
            key={c.label}
            className="flex items-center justify-center gap-1 rounded-lg border border-[#222A33] bg-[#161C23] py-1.5 text-[8px] font-medium text-[#c2cad6]"
          >
            <c.icon className="w-3 h-3" style={{ color: TEAL }} />
            {c.label}
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-around border-t border-white/5 bg-[#0B0E12]/95 px-4 py-2.5 backdrop-blur">
        <div className="flex flex-col items-center gap-0.5 text-[#8A96B0]">
          <Camera className="w-4 h-4" />
          <span className="text-[7px]">Photo</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#EF4444" }}>
            <Square className="w-3.5 h-3.5 text-white" fill="currentColor" />
          </div>
          <span className="text-[7px] text-white">Stop</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 text-[#8A96B0]">
          <Pause className="w-4 h-4" />
          <span className="text-[7px]">Pause</span>
        </div>
      </div>
    </div>
  );
}

/* Screen 3 — Bid Handoff / Report */
export function ScreenReport() {
  const stats: { icon: LucideIcon; label: string; value: string; color: string }[] = [
    { icon: ImageIcon, label: "Photos Captured", value: "24", color: TEAL },
    { icon: AlertTriangle, label: "Missing Info", value: "5", color: "#F59E0B" },
    { icon: AlertTriangle, label: "Risk Flags", value: "3", color: "#EF4444" },
  ];
  const readiness = 68;
  const R = 26;
  const C = 2 * Math.PI * R;
  return (
    <div className="flex flex-col h-full px-3.5 pb-14 pt-1">
      <div className="flex items-center gap-2 mb-2.5">
        <ChevronLeft className="w-3.5 h-3.5 text-[#8A96B0]" />
        <span className="text-[10px] font-semibold text-white">Bid Handoff / Report</span>
        <MoreVertical className="w-3.5 h-3.5 text-[#8A96B0] ml-auto" />
      </div>

      <div className="flex items-center gap-2.5 rounded-xl border border-[#222A33] bg-[#161C23] p-2.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(11,163,168,0.15)" }}>
          <FileText className="w-4 h-4" style={{ color: TEAL }} />
        </div>
        <div>
          <div className="text-[10px] font-semibold text-white">Draft Site Report</div>
          <div className="text-[7.5px] text-[#8A96B0]">Created today, 9:41 AM</div>
        </div>
      </div>

      <div className="mt-2 space-y-1.5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-2 rounded-lg border border-[#222A33] bg-[#161C23] px-2.5 py-2"
          >
            <s.icon className="w-3.5 h-3.5 shrink-0" style={{ color: s.color }} />
            <span className="text-[8.5px] text-[#c2cad6] flex-1">{s.label}</span>
            <span className="text-[10px] font-bold" style={{ color: s.color }}>
              {s.value}
            </span>
            <ChevronRight className="w-3 h-3 text-[#5b6680]" />
          </div>
        ))}
      </div>

      <div className="mt-2 rounded-xl border border-[#222A33] bg-[#161C23] p-2.5">
        <div className="text-[7px] font-bold uppercase tracking-widest text-[#8A96B0] mb-1">
          Bid Readiness
        </div>
        <div className="flex items-center gap-2.5">
          <div className="relative w-14 h-14 shrink-0">
            <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
              <circle cx="32" cy="32" r={R} fill="none" stroke="#222A33" strokeWidth="6" />
              <motion.circle
                cx="32"
                cy="32"
                r={R}
                fill="none"
                stroke={TEAL}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={C}
                initial={{ strokeDashoffset: C }}
                whileInView={{ strokeDashoffset: C * (1 - readiness / 100) }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 1.1, ease }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[12px] font-bold text-white">
              {readiness}%
            </div>
          </div>
          <p className="text-[7.5px] text-[#8A96B0] leading-snug">
            Good start. Address missing info and risks to improve readiness.
          </p>
        </div>
      </div>

      <div
        className="mt-2 rounded-xl p-2.5"
        style={{ background: "rgba(11,163,168,0.12)", border: "1px solid rgba(11,163,168,0.4)" }}
      >
        <div className="flex items-center gap-1.5">
          <VoiceConnectMark className="h-2.5 w-auto text-[#0BA3A8]" />
          <span className="text-[9px] font-semibold text-white">Create Draft Bid Profile</span>
        </div>
        <p className="mt-1 text-[7.5px] text-[#a9d6d8] leading-snug">
          Send this capture to CCA BidIntelligenceOS. Review required before use.
        </p>
      </div>

      <TabBar active="reports" />
    </div>
  );
}

export const VC_PHONES = [
  { id: "capture", Component: ScreenCapture, label: "Choose capture" },
  { id: "recording", Component: ScreenRecording, label: "Capture on site" },
  { id: "report", Component: ScreenReport, label: "Hand off to bid" },
] as const;

export function PhoneShowcase({ className = "" }: { className?: string }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-5 ${className}`}>
      {VC_PHONES.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: i * 0.12, duration: 0.6, ease }}
        >
          <PhoneFrame label={p.label}>
            <p.Component />
          </PhoneFrame>
        </motion.div>
      ))}
    </div>
  );
}
