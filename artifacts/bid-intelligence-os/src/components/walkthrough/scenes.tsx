import { motion } from "framer-motion";
import {
  Lock,
  TrendingUp,
  FileText,
  ClipboardCheck,
  Calculator,
  Gauge,
  CheckCircle2,
} from "lucide-react";
import { CCACrest } from "@/components/cca-crest";

const ease = [0.16, 1, 0.3, 1] as const;

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

/* Scene 1 — Problem → Solution */
export function SceneIntro() {
  const docs = [
    { x: "-34%", y: "-22%", r: -12, d: 0 },
    { x: "32%", y: "-26%", r: 9, d: 0.1 },
    { x: "-30%", y: "24%", r: 7, d: 0.2 },
    { x: "30%", y: "26%", r: -8, d: 0.3 },
  ];
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.6, ease }}
    >
      {docs.map((doc, i) => (
        <motion.div
          key={i}
          className="absolute w-[16%] aspect-[3/4] rounded-md border border-white/10 bg-[#111A2E]/80 backdrop-blur-sm flex flex-col gap-1.5 p-3"
          initial={{ x: doc.x, y: doc.y, rotate: doc.r, opacity: 0 }}
          animate={{
            x: ["" + doc.x, "0%"],
            y: ["" + doc.y, "0%"],
            rotate: [doc.r, 0],
            opacity: [0, 0.9, 0],
            scale: [0.9, 1, 0.6],
          }}
          transition={{ duration: 3.4, delay: doc.d, times: [0, 0.4, 1], ease }}
        >
          {[...Array(4)].map((_, j) => (
            <div
              key={j}
              className="h-1.5 rounded-full bg-white/15"
              style={{ width: `${90 - j * 16}%` }}
            />
          ))}
        </motion.div>
      ))}

      <motion.div
        className="relative z-10 text-center px-8"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.6, duration: 0.9, ease }}
      >
        <motion.div
          className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center"
          animate={{ boxShadow: ["0 0 0px rgba(56,189,248,0)", "0 0 40px rgba(56,189,248,0.5)", "0 0 18px rgba(56,189,248,0.25)"] }}
          transition={{ delay: 1.6, duration: 1.6, ease }}
        >
          <CCACrest className="w-9 h-9 text-[#38BDF8]" />
        </motion.div>
        <h3 className="text-[clamp(1.6rem,4.4vw,3.2rem)] font-bold text-white leading-[1.05] tracking-tight">
          Research Less,
          <br />
          <span className="text-[#38BDF8]">Win More.</span>
        </h3>
        <p className="mt-3 text-[clamp(0.8rem,1.4vw,1rem)] text-[#8A96B0]">
          Every bid, in one decision workspace.
        </p>
      </motion.div>
    </motion.div>
  );
}

/* Scene 2 — Cockpit */
export function SceneCockpit() {
  const kpis = [
    { label: "Active Bids", value: "12", accent: "#38BDF8" },
    { label: "Win Rate", value: "38%", accent: "#22C55E" },
    { label: "Pipeline", value: "$4.2M", accent: "#38BDF8" },
  ];
  const rows = [
    { name: "Riverside Medical — HVAC Retrofit", due: "Due 4d", action: "Submit pricing", hot: true },
    { name: "Cedar Logistics — Roof Replacement", due: "Due 9d", action: "Review scope", hot: false },
    { name: "Metro Transit — Facilities MEP", due: "Due 12d", action: "Build package", hot: false },
  ];
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, ease }}
    >
      <Frame label="Cockpit · CCA BidIntelligenceOS">
        <div className="grid grid-cols-3 gap-[2.5%] h-[34%]">
          {kpis.map((k, i) => (
            <motion.div
              key={k.label}
              className="rounded-lg border border-[#1C253B] bg-[#0F1830] p-3 flex flex-col justify-between"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.5, ease }}
            >
              <span className="text-[clamp(0.55rem,1vw,0.7rem)] uppercase tracking-widest text-[#5b6680]">
                {k.label}
              </span>
              <span
                className="text-[clamp(1.1rem,2.6vw,1.9rem)] font-bold leading-none"
                style={{ color: k.accent }}
              >
                {k.value}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-[3%] rounded-lg border border-[#1C253B] bg-[#0F1830] h-[58%] overflow-hidden"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5, ease }}
        >
          <div className="flex items-center justify-between px-3.5 py-2 border-b border-[#1C253B]">
            <span className="text-[clamp(0.6rem,1.1vw,0.8rem)] font-semibold text-white">
              Active Bids
            </span>
            <span className="text-[clamp(0.5rem,0.9vw,0.65rem)] text-[#5b6680]">
              Next action
            </span>
          </div>
          {rows.map((r, i) => (
            <motion.div
              key={r.name}
              className="flex items-center justify-between px-3.5 py-[2.4%] border-b border-[#161f33] last:border-0"
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.18, duration: 0.45, ease }}
            >
              <div className="min-w-0 flex-1">
                <div className="text-[clamp(0.6rem,1.05vw,0.8rem)] text-slate-200 truncate">
                  {r.name}
                </div>
                <div className="text-[clamp(0.5rem,0.85vw,0.65rem)] text-[#8A96B0] mt-0.5">
                  {r.due}
                </div>
              </div>
              <motion.span
                className="ml-3 shrink-0 rounded-full px-2.5 py-1 text-[clamp(0.5rem,0.85vw,0.65rem)] font-medium border"
                style={
                  r.hot
                    ? { color: "#38BDF8", borderColor: "rgba(56,189,248,0.4)", background: "rgba(56,189,248,0.1)" }
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

/* Scene 5 — Insights + close */
export function SceneClose() {
  const bars = [
    { h: 52, won: true },
    { h: 38, won: false },
    { h: 64, won: true },
    { h: 47, won: true },
    { h: 30, won: false },
    { h: 78, won: true },
  ];
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.5, ease }}
    >
      <Frame label="Win / Loss Insights">
        <div className="h-full flex flex-col">
          <div className="flex-1 flex items-end gap-[2.4%] pb-[2%]">
            {bars.map((b, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t-md"
                style={{ background: b.won ? "#22C55E" : "#EF4444", opacity: 0.85 }}
                initial={{ height: "0%" }}
                animate={{ height: `${b.h}%` }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.6, ease }}
              />
            ))}
          </div>
          <div className="flex items-center gap-4 border-t border-[#1C253B] pt-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#22C55E]" />
              <span className="text-[clamp(0.5rem,0.9vw,0.68rem)] text-[#8A96B0]">Won</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#EF4444]" />
              <span className="text-[clamp(0.5rem,0.9vw,0.68rem)] text-[#8A96B0]">Lost</span>
            </div>
            <div className="ml-auto flex items-center gap-1.5 text-[#22C55E]">
              <TrendingUp className="w-4 h-4" />
              <span className="text-[clamp(0.55rem,1vw,0.75rem)] font-semibold">
                Win rate trending up
              </span>
            </div>
          </div>
        </div>
      </Frame>

      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0E1A]/85 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.4, duration: 0.8, ease }}
      >
        <CCACrest className="w-12 h-12 text-[#38BDF8] mb-4" />
        <h3 className="text-[clamp(1.4rem,3.6vw,2.6rem)] font-bold text-white tracking-tight text-center">
          Research Less, <span className="text-[#38BDF8]">Win More.</span>
        </h3>
        <p className="mt-2 text-[clamp(0.7rem,1.3vw,0.95rem)] text-[#8A96B0]">
          A product of Contractor Connect
        </p>
      </motion.div>
    </motion.div>
  );
}

export const WALKTHROUGH_SCENES = [
  {
    id: "scene1",
    Component: SceneIntro,
    caption:
      "Commercial contractors lose hours to scattered bid research. CCA BidIntelligenceOS pulls it into one decision workspace.",
  },
  {
    id: "scene2",
    Component: SceneCockpit,
    caption:
      "The Cockpit is a live command center — win rate, deadlines, and the next action on every active bid.",
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
    Component: SceneClose,
    caption:
      "Track wins and losses to sharpen every future bid. CCA BidIntelligenceOS — research less, win more.",
  },
] as const;
