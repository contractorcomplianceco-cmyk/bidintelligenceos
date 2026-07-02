import { motion } from 'framer-motion';
import { EASE, AMBER, CYAN, RED, GREEN, PANEL, PANEL2, BORDER, MUTED, DIM, Kicker, AppFrame } from './shared';

const SIGNALS = [
  { title: 'Storm surge — Gulf Coast metro', sub: 'Hail + wind event · roofing & HVAC demand spike', score: 92, tone: RED, x: 30, y: 34 },
  { title: 'Permit spike — commercial retrofit', sub: '+41% mechanical permits, last 30 days', score: 84, tone: AMBER, x: 66, y: 44 },
  { title: 'Aging infrastructure cluster', sub: 'RTUs past service life, 3 school districts', score: 77, tone: CYAN, x: 48, y: 66 },
];

export function Scene7() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-[7vw] gap-[2.4vh]"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -60 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div className="w-full">
        <Kicker text="MarketWatchOS" color={AMBER} delay={0.2} />
        <motion.h2
          className="mt-[1vh] text-[2.3vw] font-bold text-white"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: EASE }}
        >
          Market Opportunity Radar identifies work <span style={{ color: AMBER }}>before it exists</span>
        </motion.h2>
      </div>

      <motion.div
        className="w-full h-[58vh]"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
      >
        <AppFrame label="MarketWatchOS — Opportunity Radar · Live Signals">
          <div className="grid grid-cols-5 gap-[1.2vw] h-full">
            {/* Radar */}
            <div className="col-span-2 rounded-lg border relative overflow-hidden flex items-center justify-center" style={{ background: PANEL2, borderColor: BORDER }}>
              <div className="relative w-[85%] aspect-square">
                {[1, 0.66, 0.33].map((r) => (
                  <div
                    key={r}
                    className="absolute rounded-full border"
                    style={{ inset: `${(1 - r) * 50}%`, borderColor: `${AMBER}33` }}
                  />
                ))}
                <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ background: `${AMBER}22` }} />
                <div className="absolute top-1/2 left-0 right-0 h-px" style={{ background: `${AMBER}22` }} />
                <motion.div
                  className="absolute inset-0 origin-center"
                  style={{
                    background: `conic-gradient(from 0deg, ${AMBER}55, transparent 60deg)`,
                    borderRadius: '9999px',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                {SIGNALS.map((s, i) => (
                  <motion.div
                    key={s.title}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${s.x}%`, top: `${s.y}%` }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.2 + i * 0.5, duration: 0.4, ease: EASE }}
                  >
                    <motion.span
                      className="block w-[1vw] h-[1vw] rounded-full"
                      style={{ background: s.tone, boxShadow: `0 0 14px ${s.tone}` }}
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.3 }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Scored opportunities */}
            <div className="col-span-3 rounded-lg border p-[1vw] flex flex-col gap-[1vh]" style={{ background: PANEL2, borderColor: BORDER }}>
              <div className="flex items-center justify-between">
                <span className="text-[0.72vw] uppercase tracking-wider font-semibold" style={{ color: DIM }}>
                  Scored opportunities
                </span>
                <motion.span
                  className="flex items-center gap-[0.35vw] text-[0.66vw]"
                  style={{ color: AMBER }}
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  <span className="w-[0.4vw] h-[0.4vw] rounded-full" style={{ background: AMBER }} /> live
                </motion.span>
              </div>
              {SIGNALS.map((s, i) => (
                <motion.div
                  key={s.title}
                  className="rounded-md border px-[1vw] py-[0.8vh] flex items-center justify-between"
                  style={{ background: PANEL, borderColor: `${s.tone}44` }}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 + i * 0.45, duration: 0.4, ease: EASE }}
                >
                  <div className="min-w-0">
                    <div className="text-[0.82vw] text-white/90 font-medium truncate">{s.title}</div>
                    <div className="text-[0.64vw]" style={{ color: MUTED }}>{s.sub}</div>
                  </div>
                  <div className="text-right shrink-0 ml-[1vw]">
                    <div className="text-[1.1vw] font-bold" style={{ color: s.tone }}>{s.score}</div>
                    <div className="text-[0.56vw]" style={{ color: DIM }}>opp score</div>
                  </div>
                </motion.div>
              ))}
              <motion.div
                className="mt-auto text-[0.68vw]"
                style={{ color: DIM }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
              >
                Forward-looking signals for prioritization — not guaranteed demand.
              </motion.div>
            </div>
          </div>
        </AppFrame>
      </motion.div>
    </motion.div>
  );
}
