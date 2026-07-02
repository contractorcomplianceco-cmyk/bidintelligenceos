import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { EASE, CYAN, TEAL, PANEL2, BORDER, MUTED, DIM, RED, AMBER, GREEN, Kicker, AppFrame } from './shared';

const SCOPE_ITEMS = [
  'Remove & replace RTU-2 (12.5-ton) with curb adapter',
  'Ductwork transitions + new supply plenum',
  'Electrical disconnect & whip replacement',
  'Crane lift — north lot staging, weekend window',
  'Test & balance, commissioning report',
];

const RISKS = [
  { label: 'Crane lift over occupied entrance', tone: RED },
  { label: 'Electrical disconnect condition unverified', tone: AMBER },
];

const COSTS = ['Labor', 'Equipment', 'Materials', 'Subcontractors', 'General Conditions'];

export function Scene3() {
  const [score, setScore] = useState(0);

  useEffect(() => {
    const start = setTimeout(() => {
      const iv = setInterval(() => {
        setScore((s) => {
          if (s >= 82) {
            clearInterval(iv);
            return 82;
          }
          return s + 2;
        });
      }, 40);
    }, 4200);
    return () => clearTimeout(start);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-[7vw] gap-[3vh]"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -60 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="w-full flex items-end justify-between">
        <div>
          <Kicker text="Bid Intelligence" delay={0.3} />
          <motion.h2
            className="mt-[1vh] text-[2.4vw] font-bold text-white"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: EASE }}
          >
            Field capture → structured scope, instantly
          </motion.h2>
        </div>
      </div>

      <motion.div
        className="w-full h-[58vh]"
        initial={{ opacity: 0, y: 50, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.9, ease: EASE }}
      >
        <AppFrame label="BidIntelligenceOS — Scope Analyzer · Northline HVAC Retrofit">
          <div className="grid grid-cols-3 gap-[1.2vw] h-full">
            {/* Scope items */}
            <div className="rounded-lg border p-[1vw] flex flex-col gap-[1vh]" style={{ background: PANEL2, borderColor: BORDER }}>
              <span className="text-[0.75vw] uppercase tracking-wider font-semibold" style={{ color: DIM }}>
                Auto-generated scope
              </span>
              {SCOPE_ITEMS.map((s, i) => (
                <motion.div
                  key={s}
                  className="flex items-start gap-[0.5vw]"
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 + i * 0.45, duration: 0.45, ease: EASE }}
                >
                  <motion.span
                    className="mt-[0.2vh] text-[0.8vw]"
                    style={{ color: GREEN }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.55 + i * 0.45, type: 'spring', stiffness: 400, damping: 18 }}
                  >
                    ✓
                  </motion.span>
                  <span className="text-[0.78vw] text-white/85 leading-snug">{s}</span>
                </motion.div>
              ))}
            </div>

            {/* Risks + subs + cost cats */}
            <div className="flex flex-col gap-[1.2vh]">
              <div className="rounded-lg border p-[1vw]" style={{ background: PANEL2, borderColor: BORDER }}>
                <span className="text-[0.75vw] uppercase tracking-wider font-semibold" style={{ color: DIM }}>
                  Risk flags
                </span>
                {RISKS.map((r, i) => (
                  <motion.div
                    key={r.label}
                    className="mt-[0.9vh] flex items-center gap-[0.5vw] rounded-md border px-[0.6vw] py-[0.6vh]"
                    style={{ borderColor: `${r.tone}66`, background: `${r.tone}14` }}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.6 + i * 0.5, duration: 0.4, ease: EASE }}
                  >
                    <span className="w-[0.45vw] h-[0.45vw] rounded-full" style={{ background: r.tone }} />
                    <span className="text-[0.72vw] text-white/85">{r.label}</span>
                  </motion.div>
                ))}
              </div>
              <div className="rounded-lg border p-[1vw] flex-1" style={{ background: PANEL2, borderColor: BORDER }}>
                <span className="text-[0.75vw] uppercase tracking-wider font-semibold" style={{ color: DIM }}>
                  Cost categories
                </span>
                <div className="mt-[1vh] flex flex-wrap gap-[0.5vw]">
                  {COSTS.map((c, i) => (
                    <motion.span
                      key={c}
                      className="px-[0.7vw] py-[0.4vh] rounded-full border text-[0.7vw]"
                      style={{ borderColor: 'rgba(56,189,248,0.4)', color: CYAN, background: 'rgba(56,189,248,0.08)' }}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 3.4 + i * 0.3, duration: 0.35, ease: EASE }}
                    >
                      {c}
                    </motion.span>
                  ))}
                </div>
                <motion.div
                  className="mt-[1.4vh] text-[0.72vw]"
                  style={{ color: MUTED }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 4.6 }}
                >
                  Sub requirements: crane & rigging, electrical, test & balance
                </motion.div>
              </div>
            </div>

            {/* Readiness score */}
            <div className="rounded-lg border p-[1vw] flex flex-col items-center justify-center gap-[1.5vh]" style={{ background: PANEL2, borderColor: BORDER }}>
              <span className="text-[0.75vw] uppercase tracking-wider font-semibold" style={{ color: DIM }}>
                Bid readiness
              </span>
              <div className="relative w-[9vw] h-[9vw]">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke={BORDER} strokeWidth="8" />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke={CYAN}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 42}
                    initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - 0.82) }}
                    transition={{ delay: 4.2, duration: 1.6, ease: EASE }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[2.2vw] font-bold text-white">{score}</span>
                  <span className="text-[0.65vw]" style={{ color: MUTED }}>
                    of 100
                  </span>
                </div>
              </div>
              <motion.span
                className="text-[0.75vw] text-center leading-snug"
                style={{ color: MUTED }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 5.4 }}
              >
                Draft bid created from
                <br />
                <span style={{ color: TEAL }}>VoiceConnect capture</span>
              </motion.span>
            </div>
          </div>
        </AppFrame>
      </motion.div>
    </motion.div>
  );
}
