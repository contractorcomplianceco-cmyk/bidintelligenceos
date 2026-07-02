import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { EASE, EMERALD, CYAN, GREEN, AMBER, PANEL, PANEL2, BORDER, MUTED, DIM, Kicker, AppFrame } from './shared';

const OPPS = [
  { id: 'W912-24-R-0043', title: 'HVAC Modernization — VA Medical Ctr', setAside: 'SDVOSB', match: 94 },
  { id: 'GS-07F-118BA', title: 'Mechanical Repair IDIQ — GSA Region 7', setAside: 'Small Business', match: 88 },
  { id: 'FA8903-24-Q-0210', title: 'Chiller Replacement — USAF Base', setAside: '8(a)', match: 81 },
];

const CHECKS = [
  { k: 'SAM.gov registration', v: 'Active', tone: GREEN },
  { k: 'Reps & certs', v: 'Current', tone: GREEN },
  { k: 'Past performance (CPARS)', v: '2 refs', tone: AMBER },
  { k: 'Bonding capacity', v: 'Verified', tone: GREEN },
];

export function Scene8() {
  const [score, setScore] = useState(0);
  useEffect(() => {
    const start = setTimeout(() => {
      const iv = setInterval(() => {
        setScore((s) => {
          if (s >= 87) {
            clearInterval(iv);
            return 87;
          }
          return s + 3;
        });
      }, 30);
    }, 1400);
    return () => clearTimeout(start);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-[7vw] gap-[2.4vh]"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div className="w-full">
        <Kicker text="ComplianceConnect · Government" color={EMERALD} delay={0.2} />
        <motion.h2
          className="mt-[1vh] text-[2.3vw] font-bold text-white"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: EASE }}
        >
          Government contracting intelligence — <span style={{ color: EMERALD }}>built into operations</span>
        </motion.h2>
      </div>

      <motion.div
        className="w-full h-[58vh]"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
      >
        <AppFrame label="ComplianceConnect — Federal Opportunity Feed · SAM.gov">
          <div className="grid grid-cols-3 gap-[1.2vw] h-full">
            <div className="col-span-2 rounded-lg border p-[1vw] flex flex-col gap-[1vh]" style={{ background: PANEL2, borderColor: BORDER }}>
              <div className="flex items-center justify-between">
                <span className="text-[0.72vw] uppercase tracking-wider font-semibold" style={{ color: DIM }}>
                  Matched solicitations
                </span>
                <span className="text-[0.68vw]" style={{ color: EMERALD }}>NAICS 238220 · set-aside eligible</span>
              </div>
              {OPPS.map((o, i) => (
                <motion.div
                  key={o.id}
                  className="rounded-md border px-[1vw] py-[0.8vh] flex items-center justify-between"
                  style={{ background: PANEL, borderColor: BORDER }}
                  initial={{ opacity: 0, x: -26 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.35, duration: 0.4, ease: EASE }}
                >
                  <div className="min-w-0">
                    <div className="text-[0.82vw] text-white/90 font-medium truncate">{o.title}</div>
                    <div className="text-[0.64vw]" style={{ color: MUTED }}>
                      {o.id} · <span style={{ color: EMERALD }}>{o.setAside}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-[1vw]">
                    <div className="text-[1vw] font-bold" style={{ color: o.match >= 90 ? GREEN : CYAN }}>
                      {o.match}%
                    </div>
                    <div className="text-[0.58vw]" style={{ color: DIM }}>fit</div>
                  </div>
                </motion.div>
              ))}
              <motion.div
                className="mt-auto text-[0.68vw]"
                style={{ color: DIM }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.6 }}
              >
                Eligibility signals for review — confirm requirements before you bid.
              </motion.div>
            </div>

            <div className="rounded-lg border p-[1vw] flex flex-col items-center justify-center gap-[1.2vh]" style={{ background: PANEL2, borderColor: BORDER }}>
              <span className="text-[0.72vw] uppercase tracking-wider font-semibold" style={{ color: DIM }}>
                Bid readiness
              </span>
              <div className="relative w-[8.5vw] h-[8.5vw]">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke={BORDER} strokeWidth="8" />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke={EMERALD}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 42}
                    initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - 0.87) }}
                    transition={{ delay: 1.4, duration: 1.4, ease: EASE }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[2vw] font-bold text-white">{score}</span>
                  <span className="text-[0.6vw]" style={{ color: MUTED }}>readiness</span>
                </div>
              </div>
              <div className="w-full flex flex-col gap-[0.5vh]">
                {CHECKS.map((c, i) => (
                  <motion.div
                    key={c.k}
                    className="flex items-center justify-between text-[0.66vw]"
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.8 + i * 0.25, duration: 0.35, ease: EASE }}
                  >
                    <span style={{ color: MUTED }}>{c.k}</span>
                    <span style={{ color: c.tone }} className="font-semibold">{c.v}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </AppFrame>
      </motion.div>
    </motion.div>
  );
}
