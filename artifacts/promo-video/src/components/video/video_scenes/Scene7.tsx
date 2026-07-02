import { motion } from 'framer-motion';
import { EASE, RED, AMBER, GREEN, CYAN, PANEL, PANEL2, BORDER, MUTED, DIM, Kicker } from './shared';

const ALERTS = [
  { text: 'Margin drift: est. 18.4% → 15.1% on change orders', tone: AMBER },
  { text: 'Profit-fade risk: long-lead curb adapter freight delay', tone: RED },
  { text: 'Labor overrun trending on Crew B demo phase', tone: AMBER },
  { text: 'Mitigation modeled: reslot lift, lock freight ETA', tone: GREEN },
];

const MARGIN_PTS = '0,14 16,15 32,17 48,20 64,24 80,29 100,33';

export function Scene7() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center gap-[4vw] px-[8vw]"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -60 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div className="w-[28vw] flex flex-col gap-[2vh]">
        <Kicker text="Risk Radar" color={RED} delay={0.2} />
        <motion.h2
          className="text-[2.7vw] font-bold text-white leading-tight"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: EASE }}
        >
          Detect risk <span style={{ color: RED }}>before it becomes loss</span>
        </motion.h2>
        <motion.p
          className="text-[1vw]"
          style={{ color: MUTED }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          Margin drift, profit-fade, and schedule risk surfaced early — with modeled mitigations you approve.
        </motion.p>
      </div>

      <motion.div
        className="w-[44vw] rounded-2xl border overflow-hidden"
        style={{ background: PANEL, borderColor: BORDER, boxShadow: '0 30px 80px -30px rgba(0,0,0,0.8)' }}
        initial={{ opacity: 0, x: 50, scale: 0.97 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
      >
        <div className="flex items-center justify-between px-[1.4vw] py-[1.2vh] border-b" style={{ borderColor: BORDER }}>
          <span className="text-[1vw] font-semibold text-white">Risk & Margin Monitor</span>
          <span className="px-[0.7vw] py-[0.3vh] rounded-full text-[0.68vw] font-semibold" style={{ color: AMBER, background: `${AMBER}18`, border: `1px solid ${AMBER}55` }}>
            2 active
          </span>
        </div>
        <div className="p-[1.2vw] grid grid-cols-2 gap-[1.2vw]">
          {/* Margin drift chart */}
          <div className="rounded-lg border p-[1vw] flex flex-col" style={{ background: PANEL2, borderColor: BORDER }}>
            <span className="text-[0.7vw] uppercase tracking-wider font-semibold" style={{ color: DIM }}>
              Projected margin drift
            </span>
            <div className="relative flex-1 mt-[1vh] min-h-[16vh]">
              <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full">
                <line x1="0" y1="20" x2="100" y2="20" stroke={BORDER} strokeWidth="0.4" />
                <motion.polyline
                  points={MARGIN_PTS}
                  fill="none"
                  stroke={RED}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.2, duration: 1.6, ease: EASE }}
                />
              </svg>
            </div>
            <div className="mt-[0.6vh] flex items-center justify-between text-[0.7vw]">
              <span style={{ color: MUTED }}>Baseline 18.4%</span>
              <span style={{ color: RED }}>Now 15.1%</span>
            </div>
          </div>

          {/* Alerts */}
          <div className="flex flex-col gap-[0.8vh]">
            {ALERTS.map((a, i) => (
              <motion.div
                key={a.text}
                className="flex items-start gap-[0.6vw] rounded-lg border px-[0.8vw] py-[0.7vh]"
                style={{ background: `${a.tone}10`, borderColor: `${a.tone}55` }}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6 + i * 0.4, duration: 0.4, ease: EASE }}
              >
                <span className="mt-[0.25vh] w-[0.45vw] h-[0.45vw] rounded-full shrink-0" style={{ background: a.tone }} />
                <span className="text-[0.74vw] text-white/85 leading-snug">{a.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div
          className="px-[1.4vw] py-[1vh] border-t text-[0.72vw]"
          style={{ borderColor: BORDER, color: DIM }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.6 }}
        >
          Decision-support signals — not guarantees. You approve every mitigation.
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
