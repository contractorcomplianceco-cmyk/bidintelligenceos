import { motion } from 'framer-motion';
import { EASE, CYAN, TEAL, GREEN, AMBER, PANEL, BORDER, MUTED, DIM, Kicker } from './shared';

const INDUSTRIES = [
  {
    name: 'Roofing',
    color: AMBER,
    bullets: ['Storm-response capture', 'Material takeoff scoping', 'Weather-window scheduling'],
    delay: 1.4,
  },
  {
    name: 'HVAC / Mechanical',
    color: TEAL,
    bullets: ['Rooftop unit surveys', 'Equipment & crane logistics', 'Commissioning tracking'],
    delay: 3.9,
  },
  {
    name: 'General Contracting',
    color: CYAN,
    bullets: ['Multi-trade bid leveling', 'TI scope coordination', 'Sub & permit orchestration'],
    delay: 6.4,
  },
  {
    name: 'Insurance Restoration',
    color: '#A78BFA',
    bullets: ['Moisture & damage mapping', 'Carrier-ready documentation', 'Rapid mobilization'],
    delay: 8.9,
  },
];

export function Scene8() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-[8vw] gap-[3.4vh]"
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="w-full flex flex-col items-center text-center gap-[1vh]">
        <Kicker text="Built for the field" delay={0.3} />
        <motion.h2
          className="text-[2.5vw] font-bold text-white"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: EASE }}
        >
          Where timing, accuracy, and coordination win jobs
        </motion.h2>
      </div>

      <div className="w-full grid grid-cols-4 gap-[1.4vw]">
        {INDUSTRIES.map((ind) => (
          <motion.div
            key={ind.name}
            className="rounded-2xl border p-[1.3vw] flex flex-col gap-[1.2vh]"
            style={{ background: PANEL, borderColor: BORDER }}
            initial={{ opacity: 0, y: 46 }}
            animate={{
              opacity: 1,
              y: 0,
              borderColor: [BORDER, `${ind.color}AA`, BORDER],
              boxShadow: [
                '0 0 0px rgba(0,0,0,0)',
                `0 0 40px -10px ${ind.color}66`,
                '0 0 0px rgba(0,0,0,0)',
              ],
            }}
            transition={{
              opacity: { delay: ind.delay * 0.25, duration: 0.6, ease: EASE },
              y: { delay: ind.delay * 0.25, duration: 0.6, ease: EASE },
              borderColor: { delay: ind.delay, duration: 2.4, times: [0, 0.25, 1] },
              boxShadow: { delay: ind.delay, duration: 2.4, times: [0, 0.25, 1] },
            }}
          >
            <span className="w-[2.6vw] h-[3px] rounded-full" style={{ background: ind.color }} />
            <span className="text-[1.15vw] font-bold text-white">{ind.name}</span>
            <div className="flex flex-col gap-[0.8vh]">
              {ind.bullets.map((b, j) => (
                <motion.div
                  key={b}
                  className="flex items-start gap-[0.5vw]"
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: ind.delay + 0.3 + j * 0.3, duration: 0.45, ease: EASE }}
                >
                  <span className="mt-[0.3vh] text-[0.7vw]" style={{ color: ind.color }}>
                    ▸
                  </span>
                  <span className="text-[0.82vw] leading-snug" style={{ color: MUTED }}>
                    {b}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.p
        className="text-[0.95vw]"
        style={{ color: DIM }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 11, duration: 0.6 }}
      >
        Plus electrical, plumbing, concrete, facilities, solar, and more — each with adapted phases and cost categories.
      </motion.p>
    </motion.div>
  );
}
