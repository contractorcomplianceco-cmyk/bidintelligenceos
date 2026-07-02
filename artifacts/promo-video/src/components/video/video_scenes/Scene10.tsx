import { motion } from 'framer-motion';
import logo from '@/assets/bidintelligence-logo.png';
import { EASE, CYAN, TEAL, GREEN, PANEL, BORDER, MUTED } from './shared';

const LOOP = [
  { label: 'Bid', color: CYAN },
  { label: 'Job', color: GREEN },
  { label: 'ROI', color: '#F59E0B' },
  { label: 'Smarter Bids', color: TEAL },
];

export function Scene10() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center gap-[3.6vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <motion.img
        src={logo}
        alt="BidIntelligenceOS"
        className="w-[16vw]"
        initial={{ opacity: 0, y: 24, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
      />

      {/* Learning loop */}
      <div className="flex items-center gap-[1vw]">
        {LOOP.map((n, i) => (
          <motion.div
            key={n.label}
            className="flex items-center gap-[1vw]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + i * 0.4, duration: 0.5, ease: EASE }}
          >
            <div
              className="px-[1.2vw] py-[1vh] rounded-full border text-[0.95vw] font-semibold"
              style={{ background: PANEL, borderColor: `${n.color}66`, color: n.color, boxShadow: `0 0 30px -10px ${n.color}66` }}
            >
              {n.label}
            </div>
            {i < LOOP.length - 1 && (
              <motion.span
                className="text-[1.1vw]"
                style={{ color: MUTED }}
                animate={{ x: [0, 6, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
              >
                →
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>

      <motion.h2
        className="text-[3.4vw] font-bold text-white text-center leading-tight"
        initial={{ opacity: 0, y: 34, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ delay: 2.6, duration: 0.9, ease: EASE }}
      >
        Bid smarter. <span style={{ color: CYAN }}>Execute better.</span>
        <br />
        <span style={{ color: TEAL }}>Learn faster.</span>
      </motion.h2>

      <motion.div
        className="mt-[1vh] px-[2.4vw] py-[1.6vh] rounded-xl text-[1.15vw] font-bold text-[#04111e]"
        style={{ background: CYAN, boxShadow: '0 0 60px -12px rgba(56,189,248,0.8)' }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: [0.85, 1.04, 1] }}
        transition={{ delay: 4.2, duration: 0.7, ease: EASE }}
      >
        Request a Demo
      </motion.div>

      <motion.p
        className="text-[0.85vw]"
        style={{ color: MUTED }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5.2, duration: 0.6 }}
      >
        BidIntelligenceOS + VoiceConnect · Research Less, Win More
      </motion.p>
    </motion.div>
  );
}
