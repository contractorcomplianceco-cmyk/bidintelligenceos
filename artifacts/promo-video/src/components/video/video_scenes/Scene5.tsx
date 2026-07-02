import { motion } from 'framer-motion';
import { EASE, ORANGE, GREEN, CYAN, TEAL, PANEL, PANEL2, BORDER, MUTED, DIM, Kicker, AppFrame } from './shared';

const SUBS = [
  { name: 'Apex Crane & Rigging', trade: 'Crane / Heavy Lift', score: 96, reliability: '98% on-time', tone: ORANGE },
  { name: 'Voltline Electrical', trade: 'Electrical', score: 93, reliability: '96% on-time', tone: CYAN },
  { name: 'AirTrue Test & Balance', trade: 'Test & Balance', score: 91, reliability: '4.9 quality', tone: TEAL },
];

export function Scene5() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-[8vw] gap-[2.4vh]"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -60 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div className="w-full flex items-end justify-between">
        <div>
          <Kicker text="BuildConnect — Sub Network" color={ORANGE} delay={0.2} />
          <motion.h2
            className="mt-[1vh] text-[2.3vw] font-bold text-white"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: EASE }}
          >
            You win the bid. <span style={{ color: ORANGE }}>The network executes.</span>
          </motion.h2>
        </div>
        <motion.span
          className="px-[0.9vw] py-[0.6vh] rounded-full text-[0.75vw] font-bold"
          style={{ background: 'rgba(249,115,22,0.14)', color: ORANGE, border: '1px solid rgba(249,115,22,0.5)' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5, ease: EASE }}
        >
          MATCHING ENGINE · LIVE
        </motion.span>
      </div>

      <motion.div
        className="w-full h-[56vh]"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
      >
        <AppFrame label="BuildConnect — Subcontractor Matching · Northline HVAC Retrofit">
          <div className="grid grid-cols-5 gap-[1.2vw] h-full">
            {/* Job requirements */}
            <div className="col-span-2 rounded-lg border p-[1vw] flex flex-col gap-[1vh]" style={{ background: PANEL2, borderColor: BORDER }}>
              <span className="text-[0.72vw] uppercase tracking-wider font-semibold" style={{ color: DIM }}>
                Won job — trade requirements
              </span>
              {['Crane / Heavy Lift — RTU set day', 'Electrical — disconnect & reconnect', 'Test & Balance — closeout cert'].map((req, i) => (
                <motion.div
                  key={req}
                  className="rounded-md border px-[0.9vw] py-[0.9vh] text-[0.78vw] text-white/85"
                  style={{ background: PANEL, borderColor: BORDER }}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + i * 0.35, duration: 0.45, ease: EASE }}
                >
                  {req}
                </motion.div>
              ))}
              <motion.div
                className="mt-auto text-[0.66vw]"
                style={{ color: DIM }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.2 }}
              >
                Scored on performance, reliability, and capacity — you approve every match.
              </motion.div>
            </div>

            {/* Matched subs */}
            <div className="col-span-3 rounded-lg border p-[1vw] flex flex-col gap-[1vh]" style={{ background: PANEL2, borderColor: BORDER }}>
              <span className="text-[0.72vw] uppercase tracking-wider font-semibold" style={{ color: DIM }}>
                Vetted network matches
              </span>
              {SUBS.map((s, i) => (
                <motion.div
                  key={s.name}
                  className="rounded-md border px-[1vw] py-[0.9vh] flex items-center justify-between"
                  style={{ background: PANEL, borderColor: `${s.tone}44` }}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6 + i * 0.5, duration: 0.45, ease: EASE }}
                >
                  <div className="min-w-0">
                    <div className="text-[0.85vw] text-white/90 font-semibold truncate">{s.name}</div>
                    <div className="text-[0.64vw]" style={{ color: MUTED }}>
                      {s.trade} · {s.reliability}
                    </div>
                  </div>
                  <div className="flex items-center gap-[1vw] shrink-0 ml-[1vw]">
                    <div className="text-right">
                      <div className="text-[1.05vw] font-bold" style={{ color: s.tone }}>{s.score}</div>
                      <div className="text-[0.54vw]" style={{ color: DIM }}>match score</div>
                    </div>
                    <motion.span
                      className="px-[0.7vw] py-[0.35vh] rounded-full text-[0.6vw] font-bold"
                      style={{ background: 'rgba(34,197,94,0.14)', color: GREEN, border: '1px solid rgba(34,197,94,0.5)' }}
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.15, 1] }}
                      transition={{ delay: 2 + i * 0.5, duration: 0.45, ease: EASE }}
                    >
                      MATCHED
                    </motion.span>
                  </div>
                </motion.div>
              ))}
              <motion.div
                className="mt-auto flex items-center justify-between text-[0.68vw]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.6 }}
              >
                <span style={{ color: DIM }}>3 of 3 trades covered — assignments ready for your approval</span>
                <span className="font-semibold" style={{ color: GREEN }}>✓ Network coverage complete</span>
              </motion.div>
            </div>
          </div>
        </AppFrame>
      </motion.div>
    </motion.div>
  );
}
