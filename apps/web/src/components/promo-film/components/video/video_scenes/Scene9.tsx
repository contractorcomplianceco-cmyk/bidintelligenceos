import { motion } from 'framer-motion';
import { EASE, ROSE, GREEN, AMBER, RED, CYAN, TEAL, ORANGE, EMERALD, PANEL, PANEL2, BORDER, MUTED, DIM } from './shared';

const VERDICTS = [
  {
    label: 'GREEN LIGHT',
    tone: GREEN,
    title: 'Northline HVAC Retrofit — proceed',
    sub: 'Fit score 87 · margin healthy · crew capacity clear',
  },
  {
    label: 'YELLOW FLAG',
    tone: AMBER,
    title: 'Harbor Point reroof — adjust strategy',
    sub: 'Freight lead-time risk · re-slot lift week before commit',
  },
  {
    label: 'RED ALERT',
    tone: RED,
    title: 'Westgate lump-sum — avoid or revise',
    sub: 'Scope gaps + liquidated damages clause flagged for review',
  },
];

const LAYERS = [
  { label: 'BidIntelligenceOS', color: CYAN },
  { label: 'MarketWatchOS', color: AMBER },
  { label: 'BuildConnect', color: ORANGE },
  { label: 'ComplianceConnect', color: EMERALD },
  { label: 'VoiceConnect', color: TEAL },
];

export function Scene9() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-[9vw] gap-[2.6vh]"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -60 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {/* ROSEOS lockup */}
      <motion.div
        className="flex items-center gap-[0.8vw]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
      >
        <motion.span
          className="w-[2.2vw] h-[2.2vw] rounded-lg flex items-center justify-center text-[1.2vw] font-black text-white"
          style={{ background: ROSE, boxShadow: `0 0 40px -8px ${ROSE}` }}
          animate={{ boxShadow: [`0 0 30px -10px ${ROSE}`, `0 0 55px -6px ${ROSE}`, `0 0 30px -10px ${ROSE}`] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          R
        </motion.span>
        <span className="text-[1.9vw] font-bold text-white tracking-tight">
          ROSE<span style={{ color: ROSE }}>OS</span>
        </span>
        <span
          className="ml-[0.4vw] px-[0.7vw] py-[0.35vh] rounded-full text-[0.62vw] font-bold uppercase tracking-widest"
          style={{ color: ROSE, background: `${ROSE}16`, border: `1px solid ${ROSE}55` }}
        >
          Executive Intelligence Layer
        </span>
      </motion.div>

      <motion.h2
        className="text-[2.2vw] font-bold text-white text-center leading-tight"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
      >
        Every decision returns <span style={{ color: ROSE }}>a verdict</span>
      </motion.h2>

      {/* Verdict cards */}
      <div className="w-full grid grid-cols-3 gap-[1.2vw]">
        {VERDICTS.map((v, i) => (
          <motion.div
            key={v.label}
            className="rounded-xl border p-[1.1vw]"
            style={{ background: PANEL2, borderColor: `${v.tone}44` }}
            initial={{ opacity: 0, y: 36, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.1 + i * 0.55, duration: 0.5, ease: EASE }}
          >
            <motion.span
              className="inline-flex items-center gap-[0.4vw] px-[0.8vw] py-[0.4vh] rounded-full text-[0.66vw] font-black tracking-widest"
              style={{ color: v.tone, background: `${v.tone}16`, border: `1px solid ${v.tone}66` }}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.3 + i * 0.55, duration: 0.4, ease: EASE }}
            >
              <motion.span
                className="w-[0.5vw] h-[0.5vw] rounded-full"
                style={{ background: v.tone }}
                animate={{ opacity: [1, 0.35, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.3 }}
              />
              {v.label}
            </motion.span>
            <div className="mt-[1vh] text-[0.9vw] font-semibold text-white/90 leading-snug">{v.title}</div>
            <div className="mt-[0.5vh] text-[0.68vw]" style={{ color: MUTED }}>
              {v.sub}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Signal layer strip */}
      <motion.div
        className="flex items-center gap-[0.7vw] rounded-full border px-[1.2vw] py-[0.8vh]"
        style={{ background: PANEL, borderColor: BORDER }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.4, duration: 0.6, ease: EASE }}
      >
        <span className="text-[0.62vw] uppercase tracking-widest font-semibold" style={{ color: DIM }}>
          Reads signals from
        </span>
        {LAYERS.map((l, i) => (
          <motion.span
            key={l.label}
            className="text-[0.68vw] font-semibold"
            style={{ color: l.color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.7 + i * 0.2, duration: 0.35 }}
          >
            {l.label}
            {i < LAYERS.length - 1 && <span style={{ color: DIM }}> ·</span>}
          </motion.span>
        ))}
      </motion.div>

      <motion.p
        className="text-[0.9vw]"
        style={{ color: DIM }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5, duration: 0.6 }}
      >
        You decide. <span style={{ color: ROSE }}>ROSEOS informs</span> — every verdict is flagged for your review.
      </motion.p>
    </motion.div>
  );
}
