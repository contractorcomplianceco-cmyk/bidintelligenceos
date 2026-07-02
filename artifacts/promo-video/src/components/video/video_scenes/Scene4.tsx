import { motion } from 'framer-motion';
import { EASE, CYAN, GREEN, PANEL2, BORDER, MUTED, DIM, Kicker, AppFrame } from './shared';

const SECTIONS = [
  { title: 'Executive Summary', lines: 3 },
  { title: 'Scope of Work', lines: 5 },
  { title: 'Pricing Summary', lines: 0 },
  { title: 'Timeline & Milestones', lines: 3 },
  { title: 'Assumptions & Exclusions', lines: 4 },
];

const PRICING = [
  ['Labor', '$148,200'],
  ['Materials', '$96,450'],
  ['Equipment', '$31,800'],
  ['Subcontractors', '$52,300'],
];

export function Scene4() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center gap-[4vw] px-[7vw]"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="w-[30vw] flex flex-col gap-[2.4vh]">
        <Kicker text="Bid Package Builder" delay={0.3} />
        <motion.h2
          className="text-[2.6vw] font-bold text-white leading-tight"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
        >
          Client-ready proposals, <span style={{ color: CYAN }}>in minutes</span>
        </motion.h2>
        <motion.div
          className="flex items-center gap-[0.7vw] rounded-xl border px-[1.1vw] py-[1.3vh]"
          style={{ background: 'rgba(34,197,94,0.07)', borderColor: 'rgba(34,197,94,0.4)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4.6, duration: 0.6, ease: EASE }}
        >
          <span className="text-[1vw]" style={{ color: GREEN }}>
            ✓
          </span>
          <span className="text-[0.95vw] text-white/85">
            Client-safe by design — internal strategy and pricing models stay private
          </span>
        </motion.div>
        <motion.div
          className="text-[0.95vw]"
          style={{ color: MUTED }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 5.8, duration: 0.6 }}
        >
          Every package is reviewed and approved by you before it ships.
        </motion.div>
      </div>

      <motion.div
        className="w-[42vw] h-[64vh]"
        initial={{ opacity: 0, x: 70 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.9, ease: EASE }}
      >
        <AppFrame label="Bid Package — Northline HVAC Retrofit · Preview">
          <div className="h-full overflow-hidden flex flex-col gap-[1.1vh]">
            {SECTIONS.map((s, i) => (
              <motion.div
                key={s.title}
                className="rounded-lg border px-[1vw] py-[0.9vh]"
                style={{ background: PANEL2, borderColor: BORDER }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.7, duration: 0.55, ease: EASE }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[0.85vw] font-semibold text-white/90">{s.title}</span>
                  <motion.span
                    className="text-[0.7vw]"
                    style={{ color: GREEN }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.5 + i * 0.7, type: 'spring', stiffness: 380, damping: 16 }}
                  >
                    ✓ Ready
                  </motion.span>
                </div>
                {s.title === 'Pricing Summary' ? (
                  <div className="mt-[0.7vh] grid grid-cols-2 gap-x-[1.4vw] gap-y-[0.4vh]">
                    {PRICING.map(([k, v], j) => (
                      <motion.div
                        key={k}
                        className="flex items-center justify-between text-[0.72vw]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.7 + i * 0.7 + j * 0.2 }}
                      >
                        <span style={{ color: MUTED }}>{k}</span>
                        <span className="text-white/85 font-medium">{v}</span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-[0.6vh] flex flex-col gap-[0.4vh]">
                    {Array.from({ length: s.lines }).map((_, j) => (
                      <motion.span
                        key={j}
                        className="h-[0.7vh] rounded-full"
                        style={{ background: BORDER, width: `${88 - j * 14}%` }}
                        initial={{ scaleX: 0, originX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 1.6 + i * 0.7 + j * 0.15, duration: 0.4, ease: EASE }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
            <motion.div
              className="mt-auto flex items-center justify-between text-[0.72vw] px-[0.4vw]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 5.2 }}
            >
              <span style={{ color: DIM }}>Vendor-facing package · no internal strategy included</span>
              <span style={{ color: CYAN }}>Export preview</span>
            </motion.div>
          </div>
        </AppFrame>
      </motion.div>
    </motion.div>
  );
}
