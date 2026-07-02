import { motion } from 'framer-motion';
import { EASE, CYAN, GREEN, TEAL, AMBER, ORANGE, RED, PANEL2, BORDER, MUTED, DIM, Kicker, AppFrame } from './shared';

const SUBS = [
  { name: 'Apex Crane & Rigging', status: 'Confirmed', tone: GREEN },
  { name: 'Volt Electrical Co.', status: 'On site', tone: CYAN },
  { name: 'AirBalance T&B', status: 'Scheduled', tone: AMBER },
];

const BUDGET_PTS = '0,44 14,42 28,39 42,40 56,36 70,33 84,31 100,30';
const ACTUAL_PTS = '0,45 14,43 28,41 42,38 56,37 70,34 84,33 100,31';

export function Scene6() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-[7vw] gap-[2.4vh]"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div className="w-full">
        <Kicker text="Live Job Execution" delay={0.2} />
        <motion.h2
          className="mt-[1vh] text-[2.3vw] font-bold text-white"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: EASE }}
        >
          Real-time cost, labor & execution tracking — <span style={{ color: CYAN }}>across every job</span>
        </motion.h2>
      </div>

      <motion.div
        className="w-full h-[58vh]"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
      >
        <AppFrame label="BidIntelligenceOS — Job Dashboard · Northline HVAC Retrofit">
          <div className="grid grid-cols-3 gap-[1.2vw] h-full">
            {/* Cost/labor burn chart */}
            <div className="rounded-lg border p-[1vw] flex flex-col" style={{ background: PANEL2, borderColor: BORDER }}>
              <span className="text-[0.72vw] uppercase tracking-wider font-semibold" style={{ color: DIM }}>
                Cost burn vs budget
              </span>
              <div className="relative flex-1 mt-[1vh]">
                <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full">
                  {[10, 20, 30, 40].map((y) => (
                    <line key={y} x1="0" y1={y} x2="100" y2={y} stroke={BORDER} strokeWidth="0.4" />
                  ))}
                  <motion.polyline
                    points={BUDGET_PTS}
                    fill="none"
                    stroke={DIM}
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1.2, duration: 1.4, ease: EASE }}
                  />
                  <motion.polyline
                    points={ACTUAL_PTS}
                    fill="none"
                    stroke={GREEN}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1.5, duration: 1.6, ease: EASE }}
                  />
                </svg>
              </div>
              <div className="flex items-center justify-between mt-[0.8vh] text-[0.65vw]">
                <span className="flex items-center gap-[0.3vw]" style={{ color: MUTED }}>
                  <span className="w-[0.6vw] h-[2px]" style={{ background: DIM }} /> Budget
                </span>
                <span className="flex items-center gap-[0.3vw]" style={{ color: MUTED }}>
                  <span className="w-[0.6vw] h-[2px]" style={{ background: GREEN }} /> Actual
                </span>
              </div>
              <motion.div
                className="mt-[0.6vh] text-[0.72vw]"
                style={{ color: GREEN }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.2 }}
              >
                Tracking 4.2% under budget
              </motion.div>
            </div>

            {/* Labor + subs */}
            <div className="flex flex-col gap-[1.1vh]">
              <div className="rounded-lg border p-[1vw]" style={{ background: PANEL2, borderColor: BORDER }}>
                <span className="text-[0.72vw] uppercase tracking-wider font-semibold" style={{ color: DIM }}>
                  Labor hours
                </span>
                {[
                  { k: 'Crew A · install', pct: 46 },
                  { k: 'Crew B · demo', pct: 61 },
                  { k: 'Subs · rigging', pct: 38 },
                ].map((r, i) => (
                  <div key={r.k} className="mt-[0.7vh]">
                    <div className="flex justify-between text-[0.68vw]">
                      <span style={{ color: MUTED }}>{r.k}</span>
                      <span className="text-white/85">{r.pct}%</span>
                    </div>
                    <div className="mt-[0.3vh] h-[0.8vh] rounded-full" style={{ background: BORDER }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: i === 2 ? TEAL : CYAN }}
                        initial={{ width: 0 }}
                        animate={{ width: `${r.pct}%` }}
                        transition={{ delay: 1.4 + i * 0.25, duration: 0.8, ease: EASE }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border p-[1vw] flex-1" style={{ background: PANEL2, borderColor: BORDER }}>
                <span className="text-[0.72vw] uppercase tracking-wider font-semibold" style={{ color: ORANGE }}>
                  Subcontractors · BuildConnect
                </span>
                {SUBS.map((s, i) => (
                  <motion.div
                    key={s.name}
                    className="mt-[0.7vh] flex items-center justify-between"
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.2 + i * 0.35, duration: 0.4, ease: EASE }}
                  >
                    <span className="text-[0.72vw] text-white/85">{s.name}</span>
                    <span
                      className="px-[0.55vw] py-[0.2vh] rounded-full text-[0.6vw] font-semibold"
                      style={{ color: s.tone, background: `${s.tone}18`, border: `1px solid ${s.tone}55` }}
                    >
                      {s.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Live tiles */}
            <div className="flex flex-col gap-[1.1vh]">
              <motion.div
                className="rounded-lg border p-[1vw]"
                style={{ background: 'rgba(245,158,11,0.07)', borderColor: 'rgba(245,158,11,0.45)' }}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 3, duration: 0.5, ease: EASE }}
              >
                <span className="text-[0.7vw] uppercase tracking-wider font-semibold" style={{ color: AMBER }}>
                  Weather watch
                </span>
                <div className="mt-[0.5vh] text-[0.76vw] text-white/85">
                  Gusts to 28 mph Thursday — suggested lift window Friday 6–10 AM.
                </div>
              </motion.div>
              <motion.div
                className="rounded-lg border p-[1vw]"
                style={{ background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.4)' }}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 3.6, duration: 0.5, ease: EASE }}
              >
                <span className="text-[0.7vw] uppercase tracking-wider font-semibold" style={{ color: RED }}>
                  Risk flag
                </span>
                <div className="mt-[0.5vh] text-[0.76vw] text-white/85">
                  Long-lead curb adapter — confirm freight ETA before demo day.
                </div>
              </motion.div>
              <motion.div
                className="rounded-lg border p-[1vw] flex-1 flex items-center justify-between"
                style={{ background: PANEL2, borderColor: BORDER }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 4.2 }}
              >
                <div>
                  <div className="text-[0.7vw]" style={{ color: DIM }}>Labor hrs used</div>
                  <div className="text-[1.4vw] font-bold text-white">312 / 680</div>
                </div>
                <div className="text-right">
                  <div className="text-[0.7vw]" style={{ color: DIM }}>Schedule</div>
                  <div className="text-[1.05vw] font-semibold" style={{ color: GREEN }}>On track</div>
                </div>
              </motion.div>
            </div>
          </div>
        </AppFrame>
      </motion.div>
    </motion.div>
  );
}
