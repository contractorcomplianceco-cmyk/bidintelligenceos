import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { EASE, CYAN, TEAL, PANEL, PANEL2, BORDER, MUTED, DIM, Kicker, PhoneFrame, Waveform } from './shared';

const TRANSCRIPT =
  'Rooftop unit two is past service life… corroded coil, curb adapter needed. Crane access from the north lot only.';

const TAGS = ['Labor', 'Materials', 'Subs', 'Access'];

const SCENARIOS = [
  { name: 'Roofing — storm damage walk', color: '#F59E0B' },
  { name: 'HVAC — rooftop unit survey', color: TEAL },
  { name: 'GC — tenant improvement scope', color: CYAN },
  { name: 'Restoration — moisture mapping', color: '#A78BFA' },
];

export function Scene2() {
  const [chars, setChars] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setChars((c) => (c >= TRANSCRIPT.length ? c : c + 2)), 55);
    return () => clearInterval(iv);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center gap-[4vw] px-[6vw]"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      {/* Phone mockup */}
      <motion.div
        className="h-[74vh]"
        initial={{ opacity: 0, y: 60, rotate: -3 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
      >
        <PhoneFrame>
          <div className="rounded-lg border p-[0.7vw]" style={{ background: '#0a1a24', borderColor: 'rgba(11,163,168,0.3)' }}>
            <div className="flex items-center justify-between">
              <span className="text-[0.6vw] font-semibold uppercase tracking-wider" style={{ color: TEAL }}>
                Recording
              </span>
              <motion.span
                className="w-[0.5vw] h-[0.5vw] rounded-full bg-red-500"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.1, repeat: Infinity }}
              />
            </div>
            <Waveform bars={26} className="mt-[0.8vh] h-[3vh]" />
          </div>

          <div className="rounded-lg border p-[0.7vw] flex-1 min-h-0" style={{ background: PANEL2, borderColor: BORDER }}>
            <span className="text-[0.55vw] uppercase tracking-wider" style={{ color: DIM }}>
              Live transcription
            </span>
            <p className="mt-[0.5vh] text-[0.72vw] leading-relaxed text-white/85">
              {TRANSCRIPT.slice(0, chars)}
              <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity }} style={{ color: TEAL }}>
                ▍
              </motion.span>
            </p>
          </div>

          {/* Photos linked to scope */}
          <motion.div
            className="flex gap-[0.5vw]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.2, duration: 0.5, ease: EASE }}
          >
            {['RTU-2 coil', 'Curb detail', 'North lot'].map((p) => (
              <div key={p} className="flex-1 rounded-md border overflow-hidden" style={{ borderColor: BORDER }}>
                <div className="h-[4.5vh]" style={{ background: `linear-gradient(135deg, ${PANEL}, #16283a)` }} />
                <div className="px-[0.3vw] py-[0.3vh] text-[0.5vw] truncate" style={{ background: PANEL2, color: MUTED }}>
                  {p}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Risk + missing info */}
          <motion.div
            className="rounded-lg border p-[0.6vw] flex items-center gap-[0.5vw]"
            style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.4)' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 4.6, duration: 0.45, ease: EASE }}
          >
            <span className="text-[0.8vw]">⚠</span>
            <span className="text-[0.62vw] text-white/85">Risk flagged: crane lift over occupied entrance</span>
          </motion.div>
          <motion.div
            className="rounded-lg border p-[0.6vw]"
            style={{ background: PANEL2, borderColor: 'rgba(56,189,248,0.35)' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 5.6, duration: 0.45, ease: EASE }}
          >
            <span className="text-[0.62vw]" style={{ color: CYAN }}>
              Prompt: confirm electrical disconnect condition
            </span>
          </motion.div>

          {/* Scope tags */}
          <div className="flex gap-[0.4vw] flex-wrap">
            {TAGS.map((t, i) => (
              <motion.span
                key={t}
                className="px-[0.6vw] py-[0.3vh] rounded-full border text-[0.58vw] font-semibold"
                style={{ borderColor: 'rgba(11,163,168,0.5)', color: TEAL, background: 'rgba(11,163,168,0.1)' }}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 6.4 + i * 0.25, duration: 0.35, ease: EASE }}
              >
                {t}
              </motion.span>
            ))}
          </div>
        </PhoneFrame>
      </motion.div>

      {/* Right column */}
      <div className="w-[34vw] flex flex-col gap-[2.6vh]">
        <Kicker text="VoiceConnect" color={TEAL} delay={0.5} />
        <motion.h2
          className="text-[2.8vw] font-bold text-white leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: EASE }}
        >
          Capture the job site.
          <br />
          <span style={{ color: TEAL }}>Hands-free.</span>
        </motion.h2>

        <div className="flex flex-col gap-[1.2vh]">
          {SCENARIOS.map((s, i) => (
            <motion.div
              key={s.name}
              className="flex items-center gap-[0.8vw] rounded-lg border px-[1vw] py-[1.1vh]"
              style={{ background: PANEL, borderColor: BORDER }}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.6 + i * 0.8, duration: 0.55, ease: EASE }}
            >
              <span className="w-[0.55vw] h-[0.55vw] rounded-full" style={{ background: s.color }} />
              <span className="text-[1vw] text-white/85">{s.name}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="flex items-center gap-[0.8vw] rounded-xl border px-[1.2vw] py-[1.4vh]"
          style={{ background: 'rgba(11,163,168,0.08)', borderColor: 'rgba(11,163,168,0.45)' }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 6.2, duration: 0.6, ease: EASE }}
        >
          <span className="text-[1vw] font-semibold" style={{ color: TEAL }}>
            Field capture
          </span>
          <motion.span
            className="text-[1.2vw]"
            style={{ color: MUTED }}
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            →
          </motion.span>
          <span className="text-[1vw] font-semibold" style={{ color: CYAN }}>
            BidIntelligenceOS
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
