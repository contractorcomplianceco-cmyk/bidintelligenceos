import { motion } from 'framer-motion';
import { EASE, CYAN, GREEN, TEAL, AMBER, PANEL, PANEL2, BORDER, MUTED, DIM, Kicker } from './shared';

const MODULES = [
  { name: 'Schedule', detail: '6 phases · kickoff Mar 18', color: CYAN },
  { name: 'Labor Plan', detail: '2 crews assigned', color: CYAN },
  { name: 'Subcontractors', detail: 'Crane · Electrical · T&B', color: TEAL },
  { name: 'Permits', detail: 'Mechanical permit filed', color: AMBER },
  { name: 'Weather Watch', detail: 'Lift-day wind monitoring', color: TEAL },
  { name: 'Cost & ROI Tracking', detail: 'Budget baseline locked', color: GREEN },
];

export function Scene5() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-[10vw] gap-[3.4vh]"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -60 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="w-full flex items-center justify-between">
        <div>
          <Kicker text="Bid → Job Deployment" color={GREEN} delay={0.3} />
          <motion.h2
            className="mt-[1vh] text-[2.5vw] font-bold text-white"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: EASE }}
          >
            Win the bid. The job builds itself.
          </motion.h2>
        </div>

        <motion.div
          className="flex items-center gap-[1vw] rounded-xl border px-[1.4vw] py-[1.4vh]"
          style={{ background: PANEL, borderColor: BORDER }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.7, ease: EASE }}
        >
          <div>
            <div className="text-[1.05vw] font-semibold text-white">Northline HVAC Retrofit</div>
            <div className="text-[0.75vw]" style={{ color: MUTED }}>
              Bid #B-2417 · $328,750
            </div>
          </div>
          <motion.span
            className="px-[0.9vw] py-[0.5vh] rounded-full text-[0.8vw] font-bold"
            style={{ background: 'rgba(34,197,94,0.15)', color: GREEN, border: '1px solid rgba(34,197,94,0.5)' }}
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 1.5, type: 'spring', stiffness: 300, damping: 14 }}
          >
            WON
          </motion.span>
        </motion.div>
      </div>

      {/* Cascade of auto-created modules */}
      <div className="w-full grid grid-cols-3 gap-[1.2vw]">
        {MODULES.map((m, i) => (
          <motion.div
            key={m.name}
            className="rounded-xl border p-[1.1vw]"
            style={{ background: PANEL2, borderColor: BORDER }}
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 2.4 + i * 0.55, duration: 0.55, ease: EASE }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[0.95vw] font-semibold text-white/90">{m.name}</span>
              <motion.span
                className="w-[1.2vw] h-[1.2vw] rounded-full flex items-center justify-center text-[0.7vw]"
                style={{ background: `${m.color}22`, color: m.color, border: `1px solid ${m.color}66` }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 2.7 + i * 0.55, type: 'spring', stiffness: 400, damping: 15 }}
              >
                ✓
              </motion.span>
            </div>
            <div className="mt-[0.6vh] text-[0.75vw]" style={{ color: MUTED }}>
              {m.detail}
            </div>
            <motion.div
              className="mt-[1vh] h-[3px] rounded-full"
              style={{ background: m.color }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 2.8 + i * 0.55, duration: 0.6, ease: EASE }}
            />
          </motion.div>
        ))}
      </div>

      <motion.p
        className="text-[1vw]"
        style={{ color: DIM }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 6.2, duration: 0.6 }}
      >
        No retyping. No spreadsheets. The winning bid becomes the working job.
      </motion.p>
    </motion.div>
  );
}
