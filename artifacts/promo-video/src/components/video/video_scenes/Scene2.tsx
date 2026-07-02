import { motion } from 'framer-motion';
import { EASE, CYAN, TEAL, VIOLET, PANEL, PANEL2, BORDER, MUTED, DIM, GREEN, RED, Kicker } from './shared';

const RAW = [
  { src: 'VoiceConnect', color: TEAL, text: 'RTU-2 past service life, corroded coil' },
  { src: 'VideoConnect', color: VIOLET, text: 'Crane access — north lot only' },
  { src: 'VoiceConnect', color: TEAL, text: 'Curb adapter needed, weekend window' },
];

const SCOPE = ['Remove & replace RTU-2 (12.5-ton)', 'New curb adapter + ductwork transition', 'Crane lift — north lot staging'];
const TAGS = ['Labor', 'Equipment', 'Materials', 'Subs', 'Access'];

export function Scene2() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-[7vw] gap-[2.6vh]"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div className="w-full text-center">
        <div className="flex justify-center">
          <Kicker text="Structured Intelligence" color={CYAN} delay={0.2} />
        </div>
        <motion.h2
          className="mt-[1vh] text-[2.5vw] font-bold text-white"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: EASE }}
        >
          Every walkthrough becomes structured intelligence <span style={{ color: CYAN }}>instantly</span>
        </motion.h2>
      </div>

      <div className="w-full flex items-center justify-center gap-[2.4vw] h-[54vh]">
        {/* Raw capture column */}
        <div className="w-[26vw] flex flex-col gap-[1.2vh]">
          <span className="text-[0.75vw] uppercase tracking-wider font-semibold" style={{ color: DIM }}>
            Raw field capture
          </span>
          {RAW.map((r, i) => (
            <motion.div
              key={r.text}
              className="rounded-lg border px-[1vw] py-[1vh]"
              style={{ background: PANEL2, borderColor: `${r.color}44` }}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.35, duration: 0.45, ease: EASE }}
            >
              <span className="text-[0.62vw] font-semibold" style={{ color: r.color }}>
                {r.src}
              </span>
              <div className="text-[0.78vw] text-white/80 leading-snug">{r.text}</div>
            </motion.div>
          ))}
        </div>

        {/* Transform arrow */}
        <motion.div
          className="flex flex-col items-center gap-[0.6vh]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8, duration: 0.5, ease: EASE }}
        >
          <motion.span
            className="text-[2vw]"
            style={{ color: CYAN }}
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
          >
            →
          </motion.span>
          <span className="text-[0.6vw] uppercase tracking-widest" style={{ color: MUTED }}>
            AI parse
          </span>
        </motion.div>

        {/* Structured output */}
        <motion.div
          className="w-[34vw] rounded-2xl border overflow-hidden"
          style={{ background: PANEL, borderColor: 'rgba(56,189,248,0.35)', boxShadow: '0 0 70px -24px rgba(56,189,248,0.4)' }}
          initial={{ opacity: 0, x: 40, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 2, duration: 0.7, ease: EASE }}
        >
          <div className="flex items-center justify-between px-[1.2vw] py-[1vh] border-b" style={{ borderColor: BORDER }}>
            <span className="text-[0.85vw] font-semibold text-white">Structured Scope</span>
            <span className="text-[0.62vw]" style={{ color: DIM }}>Northline HVAC Retrofit</span>
          </div>
          <div className="p-[1.1vw] flex flex-col gap-[0.9vh]">
            {SCOPE.map((s, i) => (
              <motion.div
                key={s}
                className="flex items-start gap-[0.5vw]"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.4 + i * 0.3, duration: 0.4, ease: EASE }}
              >
                <span className="mt-[0.2vh] text-[0.78vw]" style={{ color: GREEN }}>✓</span>
                <span className="text-[0.78vw] text-white/85 leading-snug">{s}</span>
              </motion.div>
            ))}
            <motion.div
              className="mt-[0.4vh] flex items-center gap-[0.5vw] rounded-md border px-[0.7vw] py-[0.6vh]"
              style={{ borderColor: `${RED}55`, background: `${RED}12` }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 3.5, duration: 0.4, ease: EASE }}
            >
              <span className="w-[0.45vw] h-[0.45vw] rounded-full" style={{ background: RED }} />
              <span className="text-[0.72vw] text-white/85">Risk flagged: crane lift over occupied entrance</span>
            </motion.div>
            <div className="mt-[0.4vh] flex flex-wrap gap-[0.4vw]">
              {TAGS.map((t, i) => (
                <motion.span
                  key={t}
                  className="px-[0.6vw] py-[0.3vh] rounded-full border text-[0.62vw] font-semibold"
                  style={{ borderColor: 'rgba(56,189,248,0.45)', color: CYAN, background: 'rgba(56,189,248,0.08)' }}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 3.9 + i * 0.18, duration: 0.3, ease: EASE }}
                >
                  {t}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.p
        className="text-[0.85vw]"
        style={{ color: DIM }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5.2, duration: 0.6 }}
      >
        Decision-support drafts — reviewed and confirmed by your team before they move forward.
      </motion.p>
    </motion.div>
  );
}
