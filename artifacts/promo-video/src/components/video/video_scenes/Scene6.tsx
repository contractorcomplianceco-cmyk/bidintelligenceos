import { motion } from 'framer-motion';
import { EASE, CYAN, GREEN, TEAL, AMBER, RED, PANEL2, BORDER, MUTED, DIM, Kicker, AppFrame } from './shared';

const SUBS = [
  { name: 'Apex Crane & Rigging', status: 'Confirmed', tone: GREEN },
  { name: 'Volt Electrical Co.', status: 'On site', tone: CYAN },
  { name: 'AirBalance T&B', status: 'Scheduled', tone: AMBER },
];

export function Scene6() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-[7vw] gap-[2.6vh]"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="w-full">
        <Kicker text="Live Job Execution" delay={0.3} />
        <motion.h2
          className="mt-[1vh] text-[2.3vw] font-bold text-white"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: EASE }}
        >
          One dashboard, from kickoff to closeout
        </motion.h2>
      </div>

      <motion.div
        className="w-full h-[58vh]"
        initial={{ opacity: 0, y: 46, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.9, ease: EASE }}
      >
        <AppFrame label="BidIntelligenceOS — Job Dashboard · Northline HVAC Retrofit">
          <div className="grid grid-cols-3 gap-[1.2vw] h-full">
            {/* Cost vs budget */}
            <div className="rounded-lg border p-[1vw] flex flex-col gap-[1.4vh]" style={{ background: PANEL2, borderColor: BORDER }}>
              <span className="text-[0.72vw] uppercase tracking-wider font-semibold" style={{ color: DIM }}>
                Cost vs budget
              </span>
              {[
                { k: 'Labor', pct: 46, tone: CYAN },
                { k: 'Materials', pct: 61, tone: CYAN },
                { k: 'Equipment', pct: 38, tone: TEAL },
                { k: 'Subs', pct: 52, tone: TEAL },
              ].map((r, i) => (
                <div key={r.k}>
                  <div className="flex justify-between text-[0.7vw]">
                    <span style={{ color: MUTED }}>{r.k}</span>
                    <span className="text-white/85">{r.pct}%</span>
                  </div>
                  <div className="mt-[0.4vh] h-[0.9vh] rounded-full" style={{ background: BORDER }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: r.tone }}
                      initial={{ width: 0 }}
                      animate={{ width: `${r.pct}%` }}
                      transition={{ delay: 1.4 + i * 0.3, duration: 0.9, ease: EASE }}
                    />
                  </div>
                </div>
              ))}
              <motion.div
                className="mt-auto text-[0.72vw]"
                style={{ color: GREEN }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.2 }}
              >
                Tracking 4.2% under budget
              </motion.div>
            </div>

            {/* Subs + permits */}
            <div className="flex flex-col gap-[1.2vh]">
              <div className="rounded-lg border p-[1vw]" style={{ background: PANEL2, borderColor: BORDER }}>
                <span className="text-[0.72vw] uppercase tracking-wider font-semibold" style={{ color: DIM }}>
                  Subcontractors
                </span>
                {SUBS.map((s, i) => (
                  <motion.div
                    key={s.name}
                    className="mt-[0.8vh] flex items-center justify-between"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2 + i * 0.4, duration: 0.45, ease: EASE }}
                  >
                    <span className="text-[0.75vw] text-white/85">{s.name}</span>
                    <span
                      className="px-[0.6vw] py-[0.2vh] rounded-full text-[0.62vw] font-semibold"
                      style={{ color: s.tone, background: `${s.tone}18`, border: `1px solid ${s.tone}55` }}
                    >
                      {s.status}
                    </span>
                  </motion.div>
                ))}
              </div>
              <motion.div
                className="rounded-lg border p-[1vw] flex-1"
                style={{ background: PANEL2, borderColor: BORDER }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.4 }}
              >
                <span className="text-[0.72vw] uppercase tracking-wider font-semibold" style={{ color: DIM }}>
                  Permits
                </span>
                <div className="mt-[0.8vh] flex items-center gap-[0.5vw]">
                  <span className="w-[0.5vw] h-[0.5vw] rounded-full" style={{ background: GREEN }} />
                  <span className="text-[0.75vw] text-white/85">Mechanical — approved</span>
                </div>
                <div className="mt-[0.6vh] flex items-center gap-[0.5vw]">
                  <span className="w-[0.5vw] h-[0.5vw] rounded-full" style={{ background: AMBER }} />
                  <span className="text-[0.75vw] text-white/85">Crane street-use — in review</span>
                </div>
              </motion.div>
            </div>

            {/* Weather + risk */}
            <div className="flex flex-col gap-[1.2vh]">
              <motion.div
                className="rounded-lg border p-[1vw]"
                style={{ background: 'rgba(245,158,11,0.07)', borderColor: 'rgba(245,158,11,0.45)' }}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 4.2, duration: 0.5, ease: EASE }}
              >
                <span className="text-[0.72vw] uppercase tracking-wider font-semibold" style={{ color: AMBER }}>
                  Weather watch
                </span>
                <div className="mt-[0.6vh] text-[0.78vw] text-white/85">
                  Gusts to 28 mph Thursday — crane lift window at risk. Suggested slot: Friday 6–10 AM.
                </div>
              </motion.div>
              <motion.div
                className="rounded-lg border p-[1vw]"
                style={{ background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.4)' }}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 5, duration: 0.5, ease: EASE }}
              >
                <span className="text-[0.72vw] uppercase tracking-wider font-semibold" style={{ color: RED }}>
                  Risk flags
                </span>
                <div className="mt-[0.6vh] text-[0.78vw] text-white/85">
                  Long-lead curb adapter — confirm freight ETA before demo day.
                </div>
              </motion.div>
              <motion.div
                className="rounded-lg border p-[1vw] flex-1 flex items-center justify-between"
                style={{ background: PANEL2, borderColor: BORDER }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 5.8 }}
              >
                <div>
                  <div className="text-[0.72vw]" style={{ color: DIM }}>
                    Labor hours used
                  </div>
                  <div className="text-[1.4vw] font-bold text-white">312 / 680</div>
                </div>
                <div className="text-right">
                  <div className="text-[0.72vw]" style={{ color: DIM }}>
                    Schedule
                  </div>
                  <div className="text-[1.05vw] font-semibold" style={{ color: GREEN }}>
                    On track
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </AppFrame>
      </motion.div>
    </motion.div>
  );
}
