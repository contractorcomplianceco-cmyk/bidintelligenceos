import { motion } from 'framer-motion';
import logo from '@/assets/bidintelligence-logo.png';
import { EASE, CYAN, TEAL, PANEL, BORDER, MUTED } from './shared';

const STRIP = [
  { label: 'Site Walk Capture', color: TEAL },
  { label: 'Bid Intelligence', color: CYAN },
  { label: 'Client Bid Package', color: CYAN },
  { label: 'Job Deployment', color: '#22C55E' },
  { label: 'Cost & ROI', color: '#F59E0B' },
];

export function Scene1() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06, filter: 'blur(8px)' }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <motion.img
        src={logo}
        alt="BidIntelligenceOS"
        className="w-[22vw]"
        initial={{ opacity: 0, y: 30, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
      />
      <motion.h1
        className="mt-[3vh] text-[3.6vw] font-bold text-white text-center leading-tight"
        initial={{ opacity: 0, y: 34, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
      >
        From first site walk
        <br />
        to <span style={{ color: CYAN }}>final closeout</span>
      </motion.h1>
      <motion.p
        className="mt-[1.6vh] text-[1.4vw]"
        style={{ color: MUTED }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.7, ease: EASE }}
      >
        One connected bidding and job execution workflow
      </motion.p>

      <div className="mt-[5vh] flex items-center gap-[1vw]">
        {STRIP.map((s, i) => (
          <motion.div
            key={s.label}
            className="flex items-center gap-[1vw]"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.6 + i * 0.55, ease: EASE }}
          >
            <div
              className="px-[1.2vw] py-[1.1vh] rounded-lg border text-[0.95vw] font-semibold text-white/90"
              style={{ background: PANEL, borderColor: BORDER, boxShadow: `0 0 24px -8px ${s.color}55` }}
            >
              <span className="block w-[2.4vw] h-[3px] rounded-full mb-[0.8vh]" style={{ background: s.color }} />
              {s.label}
            </div>
            {i < STRIP.length - 1 && (
              <motion.span
                className="text-[1.2vw]"
                style={{ color: MUTED }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.9 + i * 0.55 }}
              >
                →
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
