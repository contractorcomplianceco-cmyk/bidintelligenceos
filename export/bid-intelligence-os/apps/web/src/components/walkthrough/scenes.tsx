import { motion } from "framer-motion";
import {
  Lock,
  FileText,
  ClipboardCheck,
  Calculator,
  Gauge,
  CheckCircle2,
  Mic,
  Video,
  Users,
  ShieldCheck,
  Radar,
  Landmark,
  Compass,
  Dna,
  CalendarDays,
  FileCheck2,
  CloudSun,
  DollarSign,
  HardHat,
  Bell,
  TrendingUp,
} from "lucide-react";
import logo from "@/assets/bidintelligence-logo.png";

const ease = [0.16, 1, 0.3, 1] as const;

const TEAL = "#0BA3A8";
const VIOLET = "#7C3AED";
const ORANGE = "#F97316";
const EMERALD = "#10B981";
const AMBER = "#F59E0B";
const ROSE = "#E11D48";
const BLUE = "#38BDF8";

function Frame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-[3%]">
      <div className="w-full h-full rounded-xl border border-[#1C253B] bg-[#0B1222] overflow-hidden shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] flex flex-col">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#1C253B] bg-[#0F1830]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/70" />
          <span className="ml-3 text-[11px] font-medium text-[#5b6680] tracking-wide">
            {label}
          </span>
        </div>
        <div className="relative flex-1 p-[3.5%]">{children}</div>
      </div>
    </div>
  );
}

/* Scene 1 — Intro: new logo + ecosystem */
export function SceneIntro() {
  const badges = [
    { label: "VoiceConnect", color: TEAL },
    { label: "VideoConnect", color: VIOLET },
    { label: "BuildConnect", color: ORANGE },
    { label: "ComplianceConnect", color: EMERALD },
    { label: "MarketWatchOS", color: AMBER },
    { label: "ROSEOS", color: ROSE },
  ];
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.6, ease }}
    >
      <motion.img
        src={logo}
        alt="BidIntelligenceOS"
        className="w-[38%] max-w-[340px] drop-shadow-[0_0_40px_rgba(56,189,248,0.25)]"
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease }}
      />
      <motion.p
        className="mt-4 text-[clamp(0.85rem,1.7vw,1.15rem)] font-semibold text-white tracking-tight"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6, ease }}
      >
        Research Less, <span className="text-[#38BDF8]">Win More.</span>
      </motion.p>
      <motion.p
        className="mt-1 text-[clamp(0.6rem,1.1vw,0.8rem)] text-[#8A96B0]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.5 }}
      >
        One OS from field walkthrough to final closeout
      </motion.p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 max-w-[80%]">
        {badges.map((b, i) => (
          <motion.span
            key={b.label}
            className="rounded-full border px-2.5 py-1 text-[clamp(0.5rem,0.85vw,0.65rem)] font-semibold"
            style={{ color: b.color, borderColor: `${b.color}55`, background: `${b.color}14` }}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.5 + i * 0.14, duration: 0.4, ease }}
          >
            {b.label}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

/* Scene 2 — Command Center */
export function SceneCommandCenter() {
  const kpis = [
    { label: "Active Bids", value: "12", accent: BLUE },
    { label: "Win Rate", value: "38%", accent: "#22C55E" },
    { label: "Pipeline", value: "$4.2M", accent: BLUE },
    { label: "Alerts", value: "3", accent: AMBER },
  ];
  const rows = [
    { name: "Riverside Medical — HVAC Retrofit", due: "Due 4d", action: "Submit pricing", hot: true },
    { name: "Cedar Logistics — Roof Replacement", due: "Due 9d", action: "Review scope", hot: false },
  ];
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, ease }}
    >
      <Frame label="Command Center · BidIntelligenceOS">
        <div className="grid grid-cols-4 gap-[2%] h-[28%]">
          {kpis.map((k, i) => (
            <motion.div
              key={k.label}
              className="rounded-lg border border-[#1C253B] bg-[#0F1830] p-2.5 flex flex-col justify-between"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5, ease }}
            >
              <span className="text-[clamp(0.5rem,0.9vw,0.62rem)] uppercase tracking-widest text-[#5b6680]">
                {k.label}
              </span>
              <span
                className="text-[clamp(1rem,2.3vw,1.7rem)] font-bold leading-none"
                style={{ color: k.accent }}
              >
                {k.value}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-[2.5%] grid grid-cols-[1.5fr_1fr] gap-[2.5%] h-[64%]">
          <motion.div
            className="rounded-lg border border-[#1C253B] bg-[#0F1830] overflow-hidden"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5, ease }}
          >
            <div className="flex items-center justify-between px-3.5 py-2 border-b border-[#1C253B]">
              <span className="text-[clamp(0.6rem,1.1vw,0.78rem)] font-semibold text-white">
                Active Bid Intelligence
              </span>
              <Bell className="w-3.5 h-3.5 text-[#5b6680]" />
            </div>
            {rows.map((r, i) => (
              <motion.div
                key={r.name}
                className="flex items-center justify-between px-3.5 py-[3%] border-b border-[#161f33] last:border-0"
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.85 + i * 0.2, duration: 0.45, ease }}
              >
                <div className="min-w-0 flex-1">
                  <div className="text-[clamp(0.58rem,1vw,0.75rem)] text-slate-200 truncate">
                    {r.name}
                  </div>
                  <div className="text-[clamp(0.48rem,0.82vw,0.62rem)] text-[#8A96B0] mt-0.5">
                    {r.due}
                  </div>
                </div>
                <motion.span
                  className="ml-3 shrink-0 rounded-full px-2.5 py-1 text-[clamp(0.48rem,0.82vw,0.62rem)] font-medium border"
                  style={
                    r.hot
                      ? { color: BLUE, borderColor: "rgba(56,189,248,0.4)", background: "rgba(56,189,248,0.1)" }
                      : { color: "#8A96B0", borderColor: "#1C253B", background: "transparent" }
                  }
                  animate={r.hot ? { boxShadow: ["0 0 0 rgba(56,189,248,0)", "0 0 16px rgba(56,189,248,0.45)", "0 0 0 rgba(56,189,248,0)"] } : {}}
                  transition={r.hot ? { delay: 1.4, duration: 1.8, repeat: Infinity } : {}}
                >
                  {r.action}
                </motion.span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="rounded-lg border border-[#F59E0B]/25 bg-[#0F1830] p-3 flex flex-col"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5, ease }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Radar className="w-3.5 h-3.5" style={{ color: AMBER }} />
              <span className="text-[clamp(0.55rem,0.95vw,0.7rem)] font-semibold" style={{ color: AMBER }}>
                Opportunity Radar
              </span>
            </div>
            {[
              { t: "Medical campus RFP — HVAC", s: 92 },
              { t: "Distribution hub re-roof", s: 87 },
            ].map((a, i) => (
              <motion.div
                key={a.t}
                className="flex items-center justify-between rounded-md border border-[#1C253B] bg-[#0B1222] px-2.5 py-2 mb-1.5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + i * 0.25, duration: 0.4, ease }}
              >
                <span className="text-[clamp(0.5rem,0.85vw,0.65rem)] text-[#cbd5e1] truncate mr-2">{a.t}</span>
                <span className="shrink-0 text-[clamp(0.5rem,0.85vw,0.65rem)] font-bold" style={{ color: AMBER }}>
                  {a.s}
                </span>
              </motion.div>
            ))}
            <div className="mt-auto text-[clamp(0.45rem,0.75vw,0.58rem)] text-[#5b6680]">
              Public signals · MarketWatchOS
            </div>
          </motion.div>
        </div>
      </Frame>
    </motion.div>
  );
}

/* Scene 3 — Guided analysis */
export function SceneAnalysis() {
  const steps = [
    { label: "Scope", icon: ClipboardCheck },
    { label: "Cost Inputs", icon: Calculator },
    { label: "Fit Score", icon: Gauge },
  ];
  const score = 82;
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, ease }}
    >
      <Frame label="Guided Bid Analysis">
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between gap-[2%] mb-[4%]">
            {steps.map((s, i) => (
              <div key={s.label} className="flex items-center flex-1 last:flex-none">
                <motion.div
                  className="flex items-center gap-2 rounded-lg border px-3 py-2"
                  initial={{ opacity: 0.3, borderColor: "#1C253B", backgroundColor: "#0F1830" }}
                  animate={{
                    opacity: 1,
                    borderColor: ["#1C253B", "rgba(56,189,248,0.5)"],
                    backgroundColor: ["#0F1830", "rgba(56,189,248,0.08)"],
                  }}
                  transition={{ delay: 0.3 + i * 0.6, duration: 0.5, ease }}
                >
                  <s.icon className="w-4 h-4 text-[#38BDF8]" />
                  <span className="text-[clamp(0.6rem,1.1vw,0.82rem)] font-medium text-slate-200 whitespace-nowrap">
                    {s.label}
                  </span>
                </motion.div>
                {i < steps.length - 1 && (
                  <motion.div
                    className="h-[2px] flex-1 mx-2 origin-left bg-[#38BDF8]/50"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.7 + i * 0.6, duration: 0.4, ease }}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex-1 grid grid-cols-2 gap-[3%]">
            <motion.div
              className="rounded-lg border border-[#1C253B] bg-[#0F1830] p-4 flex flex-col gap-2.5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5, ease }}
            >
              {["Scope items mapped", "Material & labor inputs", "Risk flags reviewed"].map((t, i) => (
                <motion.div
                  key={t}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.4, duration: 0.4, ease }}
                >
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                  <span className="text-[clamp(0.6rem,1vw,0.78rem)] text-[#cbd5e1]">{t}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="rounded-lg border border-[#1C253B] bg-[#0F1830] p-4 flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.9, duration: 0.6, ease }}
            >
              <div className="relative w-[42%] aspect-square">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#1C253B" strokeWidth="9" />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#22C55E"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 42}
                    initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - score / 100) }}
                    transition={{ delay: 2.1, duration: 1.1, ease }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[clamp(1.1rem,2.6vw,2rem)] font-bold text-white leading-none">
                    {score}
                  </span>
                  <span className="text-[clamp(0.45rem,0.8vw,0.6rem)] uppercase tracking-widest text-[#5b6680] mt-0.5">
                    Bid Fit
                  </span>
                </div>
              </div>
              <span className="mt-2 text-[clamp(0.55rem,1vw,0.75rem)] font-semibold text-[#22C55E]">
                Strong Fit
              </span>
            </motion.div>
          </div>
        </div>
      </Frame>
    </motion.div>
  );
}

/* Scene 4 — Package builder */
export function ScenePackage() {
  const sections = ["Cover & Company", "Scope of Work", "Pricing Summary", "Terms & Schedule"];
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, ease }}
    >
      <Frame label="Bid Package Builder">
        <div className="h-full grid grid-cols-[40%_1fr] gap-[3%]">
          <motion.div
            className="rounded-lg border border-[#1C253B] bg-[#0F1830] p-4 flex flex-col"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span className="text-[clamp(0.55rem,1vw,0.72rem)] font-semibold text-[#F59E0B]">
                Internal Strategy · Private
              </span>
            </div>
            <div className="space-y-2 opacity-70">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-2 rounded-full bg-white/10" style={{ width: `${85 - i * 12}%` }} />
              ))}
            </div>
            <div className="mt-auto pt-3 text-[clamp(0.5rem,0.9vw,0.65rem)] text-[#5b6680]">
              Never shared with vendors
            </div>
          </motion.div>

          <motion.div
            className="rounded-lg border border-[#38BDF8]/25 bg-[#0F1830] p-4 flex flex-col"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease }}
          >
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="text-[clamp(0.55rem,1vw,0.72rem)] font-semibold text-white">
                Vendor-Facing Package
              </span>
            </div>
            <div className="space-y-2">
              {sections.map((s, i) => (
                <motion.div
                  key={s}
                  className="flex items-center gap-2 rounded-md border border-[#1C253B] bg-[#0B1222] px-3 py-2"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.3, duration: 0.4, ease }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                  <span className="text-[clamp(0.55rem,1vw,0.75rem)] text-[#cbd5e1]">{s}</span>
                </motion.div>
              ))}
            </div>
            <motion.div
              className="mt-auto pt-3 text-[clamp(0.5rem,0.9vw,0.66rem)] text-[#8A96B0]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.5 }}
            >
              Review required before export
            </motion.div>
          </motion.div>
        </div>
      </Frame>
    </motion.div>
  );
}

/* Scene 5 — Won bid → job auto-build */
export function SceneJobBuild() {
  const modules = [
    { label: "Crews Assigned", icon: HardHat },
    { label: "Schedule Built", icon: CalendarDays },
    { label: "Permits Tracked", icon: FileCheck2 },
    { label: "Weather Watch", icon: CloudSun },
    { label: "Cost & ROI Live", icon: DollarSign },
    { label: "Alerts Armed", icon: Bell },
  ];
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, ease }}
    >
      <Frame label="Won Bid → Job Deployment">
        <motion.div
          className="flex items-center gap-2.5 rounded-lg border border-[#22C55E]/35 bg-[#22C55E]/10 px-3.5 py-2.5"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease }}
        >
          <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
          <span className="text-[clamp(0.6rem,1.1vw,0.8rem)] font-semibold text-white">
            Riverside Medical — HVAC Retrofit · WON
          </span>
          <motion.span
            className="ml-auto text-[clamp(0.5rem,0.9vw,0.66rem)] font-medium text-[#22C55E]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            Building job…
          </motion.span>
        </motion.div>

        <div className="mt-[3%] grid grid-cols-3 gap-[2.5%] h-[70%]">
          {modules.map((m, i) => (
            <motion.div
              key={m.label}
              className="rounded-lg border border-[#1C253B] bg-[#0F1830] p-3 flex flex-col items-center justify-center gap-2"
              initial={{ opacity: 0, scale: 0.88, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.3, duration: 0.45, ease }}
            >
              <m.icon className="w-[18%] h-auto text-[#38BDF8]" />
              <span className="text-[clamp(0.52rem,0.95vw,0.7rem)] font-medium text-[#cbd5e1] text-center">
                {m.label}
              </span>
              <motion.span
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 + i * 0.3, duration: 0.3, ease }}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
              </motion.span>
            </motion.div>
          ))}
        </div>
      </Frame>
    </motion.div>
  );
}

/* Scene 6 — VoiceConnect + VideoConnect field capture */
export function SceneCapture() {
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, ease }}
    >
      <Frame label="Field Capture · VoiceConnect + VideoConnect">
        <div className="h-full grid grid-cols-2 gap-[3%]">
          <motion.div
            className="rounded-lg border p-4 flex flex-col"
            style={{ borderColor: `${TEAL}40`, background: "#0F1830" }}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Mic className="w-4 h-4" style={{ color: TEAL }} />
              <span className="text-[clamp(0.58rem,1vw,0.75rem)] font-semibold" style={{ color: TEAL }}>
                VoiceConnect
              </span>
              <span className="ml-auto flex items-center gap-1 text-[clamp(0.45rem,0.75vw,0.58rem)] text-[#EF4444] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" /> REC
              </span>
            </div>
            <div className="flex items-end gap-[3px] h-[22%] mb-3">
              {[...Array(24)].map((_, i) => (
                <motion.span
                  key={i}
                  className="flex-1 rounded-full"
                  style={{ background: TEAL, opacity: 0.8 }}
                  animate={{ height: ["20%", `${30 + ((i * 37) % 60)}%`, "25%"] }}
                  transition={{ delay: 0.6 + i * 0.04, duration: 1.4, repeat: Infinity, repeatType: "mirror" }}
                />
              ))}
            </div>
            <motion.div
              className="rounded-md border border-[#1C253B] bg-[#0B1222] p-2.5 text-[clamp(0.5rem,0.9vw,0.68rem)] text-[#cbd5e1] leading-snug"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5, ease }}
            >
              "Rooftop unit two is past service life — corroded coil, crane access from the north lot only…"
            </motion.div>
            <motion.div
              className="mt-auto flex items-center gap-1.5 text-[clamp(0.5rem,0.85vw,0.64rem)] font-medium"
              style={{ color: TEAL }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.5 }}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Draft bid created for review
            </motion.div>
          </motion.div>

          <motion.div
            className="rounded-lg border p-4 flex flex-col"
            style={{ borderColor: `${VIOLET}40`, background: "#0F1830" }}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Video className="w-4 h-4" style={{ color: VIOLET }} />
              <span className="text-[clamp(0.58rem,1vw,0.75rem)] font-semibold" style={{ color: VIOLET }}>
                VideoConnect
              </span>
              <span className="ml-auto text-[clamp(0.45rem,0.75vw,0.58rem)] text-[#8A96B0]">00:42</span>
            </div>
            <div className="relative flex-1 rounded-md border border-[#1C253B] bg-[#0B1222] overflow-hidden mb-3">
              <motion.div
                className="absolute rounded border-2"
                style={{ borderColor: VIOLET, width: "34%", height: "30%", left: "14%", top: "22%" }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5, ease }}
              >
                <span
                  className="absolute -top-4 left-0 text-[clamp(0.42rem,0.72vw,0.55rem)] font-semibold px-1 rounded-sm"
                  style={{ background: VIOLET, color: "white" }}
                >
                  Corroded coil
                </span>
              </motion.div>
              <motion.div
                className="absolute rounded border-2"
                style={{ borderColor: AMBER, width: "28%", height: "24%", right: "12%", bottom: "16%" }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8, duration: 0.5, ease }}
              >
                <span
                  className="absolute -top-4 left-0 text-[clamp(0.42rem,0.72vw,0.55rem)] font-semibold px-1 rounded-sm"
                  style={{ background: AMBER, color: "#0B1222" }}
                >
                  Access risk
                </span>
              </motion.div>
            </div>
            <motion.div
              className="flex items-center gap-1.5 text-[clamp(0.5rem,0.85vw,0.64rem)] font-medium"
              style={{ color: VIOLET }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.6, duration: 0.5 }}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Walkthrough-to-bid draft ready
            </motion.div>
          </motion.div>
        </div>
      </Frame>
    </motion.div>
  );
}

/* Scene 7 — BuildConnect + ComplianceConnect */
export function SceneNetwork() {
  const subs = [
    { name: "Summit Mechanical", trade: "HVAC", score: 96 },
    { name: "Apex Sheet Metal", trade: "Ductwork", score: 91 },
    { name: "Volt Electric Co.", trade: "Electrical", score: 88 },
  ];
  const readiness = 94;
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, ease }}
    >
      <Frame label="BuildConnect + ComplianceConnect">
        <div className="h-full grid grid-cols-[1.4fr_1fr] gap-[3%]">
          <motion.div
            className="rounded-lg border p-3.5 flex flex-col"
            style={{ borderColor: `${ORANGE}35`, background: "#0F1830" }}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease }}
          >
            <div className="flex items-center gap-2 mb-2.5">
              <Users className="w-4 h-4" style={{ color: ORANGE }} />
              <span className="text-[clamp(0.58rem,1vw,0.75rem)] font-semibold" style={{ color: ORANGE }}>
                BuildConnect · Sub Matching
              </span>
            </div>
            {subs.map((s, i) => (
              <motion.div
                key={s.name}
                className="flex items-center justify-between rounded-md border border-[#1C253B] bg-[#0B1222] px-3 py-2 mb-1.5"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.35, duration: 0.45, ease }}
              >
                <div className="min-w-0">
                  <div className="text-[clamp(0.55rem,0.95vw,0.72rem)] text-slate-200 truncate">{s.name}</div>
                  <div className="text-[clamp(0.45rem,0.78vw,0.6rem)] text-[#8A96B0]">{s.trade}</div>
                </div>
                <span
                  className="shrink-0 rounded-full border px-2 py-0.5 text-[clamp(0.5rem,0.85rem,0.64rem)] font-bold"
                  style={{ color: ORANGE, borderColor: `${ORANGE}50`, background: `${ORANGE}14` }}
                >
                  {s.score}
                </span>
              </motion.div>
            ))}
            <div className="mt-auto text-[clamp(0.45rem,0.78vw,0.6rem)] text-[#5b6680]">
              You win the bid. The network executes.
            </div>
          </motion.div>

          <motion.div
            className="rounded-lg border p-3.5 flex flex-col items-center"
            style={{ borderColor: `${EMERALD}35`, background: "#0F1830" }}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45, duration: 0.5, ease }}
          >
            <div className="flex items-center gap-2 mb-2 self-start">
              <ShieldCheck className="w-4 h-4" style={{ color: EMERALD }} />
              <span className="text-[clamp(0.55rem,0.95vw,0.72rem)] font-semibold" style={{ color: EMERALD }}>
                ComplianceConnect
              </span>
            </div>
            <div className="relative w-[52%] aspect-square my-1">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#1C253B" strokeWidth="9" />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke={EMERALD}
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 42}
                  initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - readiness / 100) }}
                  transition={{ delay: 1.2, duration: 1.1, ease }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[clamp(1rem,2.3vw,1.8rem)] font-bold text-white leading-none">{readiness}</span>
                <span className="text-[clamp(0.42rem,0.72vw,0.55rem)] uppercase tracking-widest text-[#5b6680] mt-0.5">
                  Ready
                </span>
              </div>
            </div>
            {["Licenses current", "Insurance verified", "Bond capacity OK"].map((t, i) => (
              <motion.div
                key={t}
                className="flex items-center gap-1.5 self-start"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2 + i * 0.3, duration: 0.4, ease }}
              >
                <CheckCircle2 className="w-3 h-3" style={{ color: EMERALD }} />
                <span className="text-[clamp(0.48rem,0.82vw,0.62rem)] text-[#cbd5e1]">{t}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Frame>
    </motion.div>
  );
}

/* Scene 8 — MarketWatchOS + Government */
export function SceneMarketGov() {
  const alerts = [
    { t: "Regional hospital expansion — mechanical package", s: 94, tag: "HVAC" },
    { t: "Municipal facilities re-roof program", s: 89, tag: "Roofing" },
    { t: "Airport terminal electrical upgrade", s: 84, tag: "Electrical" },
  ];
  const gov = ["SAM Registered", "UEI Active", "Set-Asides Tracked", "RFP Pipeline"];
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, ease }}
    >
      <Frame label="MarketWatchOS + Government Contracting">
        <div className="h-full flex flex-col">
          <div className="flex items-center gap-2 mb-2.5">
            <Radar className="w-4 h-4" style={{ color: AMBER }} />
            <span className="text-[clamp(0.58rem,1vw,0.75rem)] font-semibold" style={{ color: AMBER }}>
              Opportunity Radar — Live
            </span>
            <span className="ml-auto text-[clamp(0.45rem,0.78vw,0.6rem)] text-[#5b6680]">
              Public signals only
            </span>
          </div>
          <div className="space-y-1.5">
            {alerts.map((a, i) => (
              <motion.div
                key={a.t}
                className="flex items-center gap-3 rounded-md border border-[#1C253B] bg-[#0F1830] px-3 py-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.3, duration: 0.45, ease }}
              >
                <span
                  className="shrink-0 rounded-md px-2 py-0.5 text-[clamp(0.5rem,0.85vw,0.65rem)] font-bold"
                  style={{ color: AMBER, background: `${AMBER}18`, border: `1px solid ${AMBER}40` }}
                >
                  {a.s}
                </span>
                <span className="text-[clamp(0.55rem,0.95vw,0.72rem)] text-[#cbd5e1] truncate flex-1">{a.t}</span>
                <span className="shrink-0 text-[clamp(0.45rem,0.78vw,0.6rem)] text-[#8A96B0]">{a.tag}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-auto rounded-lg border border-[#1C253B] bg-[#0F1830] p-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.5, ease }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Landmark className="w-4 h-4 text-[#38BDF8]" />
              <span className="text-[clamp(0.55rem,0.95vw,0.72rem)] font-semibold text-white">
                Government Contracting — Built In
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {gov.map((g, i) => (
                <motion.span
                  key={g}
                  className="flex items-center gap-1 rounded-full border border-[#38BDF8]/30 bg-[#38BDF8]/10 px-2 py-0.5 text-[clamp(0.45rem,0.8vw,0.62rem)] font-medium text-[#38BDF8]"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2 + i * 0.2, duration: 0.35, ease }}
                >
                  <CheckCircle2 className="w-2.5 h-2.5" /> {g}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </Frame>
    </motion.div>
  );
}

/* Scene 9 — ROSEOS verdict layer */
export function SceneRoseOS() {
  const verdicts = [
    { label: "GREEN LIGHT", detail: "Riverside HVAC — proceed", color: "#22C55E" },
    { label: "YELLOW FLAG", detail: "Cedar re-roof — adjust strategy", color: AMBER },
    { label: "RED ALERT", detail: "Harbor MEP — avoid or revise", color: "#EF4444" },
  ];
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, ease }}
    >
      <Frame label="ROSEOS · Executive Intelligence Layer">
        <div className="h-full flex flex-col">
          <motion.div
            className="flex items-center gap-2.5 mb-[3%]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease }}
          >
            <span
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{ background: `${ROSE}18`, border: `1px solid ${ROSE}45` }}
            >
              <Compass className="w-4.5 h-4.5" style={{ color: ROSE }} />
            </span>
            <div>
              <div className="text-[clamp(0.68rem,1.25vw,0.95rem)] font-bold text-white leading-tight">
                ROSE<span style={{ color: ROSE }}>OS</span>
              </div>
              <div className="text-[clamp(0.45rem,0.8vw,0.62rem)] text-[#8A96B0]">
                Sits above every module — every decision gets a verdict
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-3 gap-[2.5%] flex-1">
            {verdicts.map((v, i) => (
              <motion.div
                key={v.label}
                className="rounded-lg border bg-[#0F1830] p-3 flex flex-col"
                style={{ borderColor: `${v.color}40` }}
                initial={{ opacity: 0, y: 16, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.45, duration: 0.5, ease }}
              >
                <span
                  className="self-start rounded-full px-2 py-0.5 text-[clamp(0.45rem,0.8vw,0.6rem)] font-bold tracking-wide"
                  style={{ color: v.color, background: `${v.color}16`, border: `1px solid ${v.color}45` }}
                >
                  {v.label}
                </span>
                <span className="mt-2.5 text-[clamp(0.52rem,0.92vw,0.7rem)] text-[#cbd5e1] leading-snug">
                  {v.detail}
                </span>
                <motion.div
                  className="mt-auto flex items-end gap-[3px] h-[20%]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 + i * 0.45, duration: 0.5 }}
                >
                  {[...Array(8)].map((_, j) => (
                    <span
                      key={j}
                      className="flex-1 rounded-sm"
                      style={{ background: v.color, opacity: 0.5, height: `${30 + ((j * 41) % 65)}%` }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-[2.5%] text-[clamp(0.45rem,0.78vw,0.6rem)] text-[#5b6680] text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4, duration: 0.5 }}
          >
            Decision support — every verdict is flagged for your review
          </motion.div>
        </div>
      </Frame>
    </motion.div>
  );
}

/* Scene 10 — Bid DNA + close */
export function SceneClose() {
  const badges = [
    { label: "VoiceConnect", color: TEAL },
    { label: "VideoConnect", color: VIOLET },
    { label: "BuildConnect", color: ORANGE },
    { label: "ComplianceConnect", color: EMERALD },
    { label: "MarketWatchOS", color: AMBER },
    { label: "ROSEOS", color: ROSE },
  ];
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.5, ease }}
    >
      <Frame label="Bid DNA · Learning Engine">
        <div className="h-full flex flex-col items-center justify-center">
          <motion.div
            className="flex items-center gap-2 mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease }}
          >
            <Dna className="w-4 h-4 text-[#38BDF8]" />
            <span className="text-[clamp(0.58rem,1vw,0.75rem)] font-semibold text-white">
              Every closeout feeds Bid DNA
            </span>
            <TrendingUp className="w-4 h-4 text-[#22C55E]" />
          </motion.div>
          <div className="flex items-center gap-2 mb-[4%]">
            {["Deploy", "Track", "Close", "Learn"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <motion.span
                  className="rounded-full border border-[#38BDF8]/35 bg-[#38BDF8]/10 px-2.5 py-1 text-[clamp(0.5rem,0.88vw,0.66rem)] font-medium text-[#38BDF8]"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.3, duration: 0.4, ease }}
                >
                  {s}
                </motion.span>
                {i < 3 && (
                  <motion.span
                    className="w-4 h-[2px] bg-[#38BDF8]/40"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.7 + i * 0.3, duration: 0.3, ease }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </Frame>

      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0E1A]/88 backdrop-blur-sm px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2, duration: 0.8, ease }}
      >
        <motion.img
          src={logo}
          alt="BidIntelligenceOS"
          className="w-[32%] max-w-[300px] drop-shadow-[0_0_40px_rgba(56,189,248,0.25)]"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3.4, duration: 0.7, ease }}
        />
        <motion.h3
          className="mt-3 text-[clamp(1.1rem,3vw,2.1rem)] font-bold text-white tracking-tight text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.7, duration: 0.6, ease }}
        >
          Research Less, <span className="text-[#38BDF8]">Win More.</span>
        </motion.h3>
        <motion.div
          className="mt-4 flex flex-wrap items-center justify-center gap-1.5 max-w-[85%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.1, duration: 0.6 }}
        >
          {badges.map((b) => (
            <span
              key={b.label}
              className="rounded-full border px-2 py-0.5 text-[clamp(0.42rem,0.75vw,0.58rem)] font-semibold"
              style={{ color: b.color, borderColor: `${b.color}50`, background: `${b.color}12` }}
            >
              {b.label}
            </span>
          ))}
        </motion.div>
        <motion.p
          className="mt-3 text-[clamp(0.55rem,1vw,0.75rem)] text-[#8A96B0]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.4, duration: 0.5 }}
        >
          A product of Contractor Connect
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

export const WALKTHROUGH_SCENES = [
  {
    id: "scene1",
    Component: SceneIntro,
    caption:
      "BidIntelligenceOS is one operating system from field walkthrough to final closeout — with a full ecosystem of connected products.",
  },
  {
    id: "scene2",
    Component: SceneCommandCenter,
    caption:
      "The Command Center runs your day — active bids, win rate, pipeline, live alerts, and your opportunity radar in one cockpit.",
  },
  {
    id: "scene3",
    Component: SceneAnalysis,
    caption:
      "Guided analysis walks you through scope, cost inputs, and fit scoring before you commit to the chase.",
  },
  {
    id: "scene4",
    Component: ScenePackage,
    caption:
      "Build a vendor-facing package in minutes — internal strategy stays private, every output is review-required.",
  },
  {
    id: "scene5",
    Component: SceneJobBuild,
    caption:
      "Win the bid and the OS builds the job — crews, schedule, permits, weather watch, and live cost tracking.",
  },
  {
    id: "scene6",
    Component: SceneCapture,
    caption:
      "VoiceConnect and VideoConnect capture the field — talk it out or film the walkthrough, and it becomes a draft bid for your review.",
  },
  {
    id: "scene7",
    Component: SceneNetwork,
    caption:
      "BuildConnect matches vetted subs to your winning bids; ComplianceConnect keeps licenses, insurance, and bonds audit-ready.",
  },
  {
    id: "scene8",
    Component: SceneMarketGov,
    caption:
      "MarketWatchOS surfaces scored opportunities from public signals — and government contracting is built in, SAM-ready.",
  },
  {
    id: "scene9",
    Component: SceneRoseOS,
    caption:
      "ROSEOS sits above every module — every decision gets a verdict: green light, yellow flag, or red alert, always flagged for review.",
  },
  {
    id: "scene10",
    Component: SceneClose,
    caption:
      "Bid DNA learns from every closeout so your next bid is sharper. BidIntelligenceOS — research less, win more.",
  },
] as const;
