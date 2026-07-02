import { motion } from 'framer-motion';
import { EASE, CYAN, PANEL, PANEL2, BORDER, MUTED, DIM, Kicker } from './shared';

const FEATURES = [
  'Public bid-award tracking',
  'Market pricing signals',
  'Win-rate benchmarking',
  'Strategic positioning insights',
];

export function Scene9() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center gap-[5vw] px-[10vw]"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -60 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="w-[28vw] flex flex-col gap-[2.2vh]">
        <Kicker text="Coming Soon" delay={0.3} />
        <motion.h2
          className="text-[2.7vw] font-bold text-white leading-tight"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
        >
          CompetitorWatch<span style={{ color: CYAN }}>OS</span>
        </motion.h2>
        <motion.p
          className="text-[1.05vw] leading-relaxed"
          style={{ color: MUTED }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          An upcoming intelligence layer for market awareness — built on lawful, public signals only.
        </motion.p>
      </div>

      <motion.div
        className="relative w-[34vw] rounded-2xl border overflow-hidden"
        style={{ background: PANEL, borderColor: 'rgba(56,189,248,0.35)', boxShadow: '0 0 80px -20px rgba(56,189,248,0.35)' }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.9, ease: EASE }}
      >
        {/* Lock badge */}
        <div className="flex items-center justify-between px-[1.4vw] py-[1.4vh] border-b" style={{ borderColor: BORDER }}>
          <span className="text-[1vw] font-semibold text-white">CompetitorWatchOS</span>
          <motion.span
            className="w-[2.2vw] h-[2.2vw] rounded-full flex items-center justify-center text-[1vw]"
            style={{ background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.5)' }}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 1.4, type: 'spring', stiffness: 300, damping: 14 }}
          >
            🔒
          </motion.span>
        </div>
        <div className="p-[1.4vw] flex flex-col gap-[1vh] relative">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f}
              className="flex items-center gap-[0.8vw] rounded-lg border px-[1vw] py-[1vh]"
              style={{ background: PANEL2, borderColor: BORDER }}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 + i * 0.55, duration: 0.5, ease: EASE }}
            >
              <span className="w-[0.5vw] h-[0.5vw] rounded-full" style={{ background: CYAN }} />
              <span className="text-[0.88vw] text-white/80">{f}</span>
            </motion.div>
          ))}
          {/* Soft frosted sheen to suggest "locked" */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(10,14,26,0.55) 100%)', backdropFilter: 'blur(0.5px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.4, duration: 0.8 }}
          />
        </div>
        <motion.div
          className="px-[1.4vw] py-[1.2vh] border-t flex items-center justify-between"
          style={{ borderColor: BORDER }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.8 }}
        >
          <span className="text-[0.78vw]" style={{ color: DIM }}>
            Join the waitlist inside BidIntelligenceOS
          </span>
          <span
            className="px-[0.9vw] py-[0.5vh] rounded-full text-[0.75vw] font-semibold"
            style={{ color: CYAN, background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.45)' }}
          >
            Coming Soon
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
