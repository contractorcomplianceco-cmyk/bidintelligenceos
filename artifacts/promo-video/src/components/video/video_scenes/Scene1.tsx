import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { EASE, TEAL, VIOLET, PANEL2, BORDER, MUTED, DIM, Waveform } from './shared';

function CapturePhone({ label, accent, tag, children }: { label: string; accent: string; tag: string; children: ReactNode }) {
  return (
    <div
      className="relative h-full aspect-[9/19] rounded-[2vw] border-[0.22vw] overflow-hidden flex flex-col"
      style={{ borderColor: `${accent}88`, background: '#07131d', boxShadow: `0 30px 90px -20px ${accent}55` }}
    >
      <div className="flex items-center justify-between px-[1vw] pt-[0.9vh] pb-[0.5vh] shrink-0">
        <span className="text-[0.75vw] font-semibold" style={{ color: accent }}>
          {label}
        </span>
        <span className="text-[0.6vw]" style={{ color: DIM }}>
          {tag}
        </span>
      </div>
      <div className="relative flex-1 min-h-0 px-[0.9vw] pb-[0.9vh] flex flex-col gap-[1vh]">{children}</div>
    </div>
  );
}

export function Scene1() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center gap-[3.4vh] px-[8vw]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div className="text-center">
        <motion.h1
          className="text-[3.1vw] font-bold text-white leading-tight"
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
        >
          Every job starts in the field
        </motion.h1>
        <motion.p
          className="mt-[1.2vh] text-[1.5vw]"
          style={{ color: MUTED }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.2, ease: EASE }}
        >
          …but intelligence is usually <span style={{ color: '#EF4444' }}>lost before execution.</span>
        </motion.p>
      </div>

      <div className="flex items-end justify-center gap-[3vw] h-[52vh]">
        {/* VoiceConnect capture */}
        <motion.div
          className="h-full"
          initial={{ opacity: 0, y: 60, rotate: -3 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
        >
          <CapturePhone label="VoiceConnect" accent={TEAL} tag="Voice Capture">
            <div className="rounded-lg border p-[0.7vw]" style={{ background: '#0a1a24', borderColor: `${TEAL}44` }}>
              <div className="flex items-center justify-between">
                <span className="text-[0.6vw] font-semibold uppercase tracking-wider" style={{ color: TEAL }}>
                  Recording
                </span>
                <motion.span
                  className="w-[0.5vw] h-[0.5vw] rounded-full bg-red-500"
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
              <Waveform bars={22} color={TEAL} className="mt-[0.8vh] h-[3vh]" />
            </div>
            <div className="rounded-lg border p-[0.7vw] flex-1 min-h-0" style={{ background: PANEL2, borderColor: BORDER }}>
              <span className="text-[0.55vw] uppercase tracking-wider" style={{ color: DIM }}>
                Live transcription
              </span>
              <p className="mt-[0.5vh] text-[0.68vw] leading-relaxed text-white/80">
                "Rooftop unit two is past service life — corroded coil, crane access from the north lot only…"
                <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity }} style={{ color: TEAL }}>
                  ▍
                </motion.span>
              </p>
            </div>
          </CapturePhone>
        </motion.div>

        {/* VideoConnect capture */}
        <motion.div
          className="h-full"
          initial={{ opacity: 0, y: 60, rotate: 3 }}
          animate={{ opacity: 1, y: 0, rotate: 2 }}
          transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
        >
          <CapturePhone label="VideoConnect" accent={VIOLET} tag="Video Capture">
            <div className="relative rounded-lg border overflow-hidden flex-1 min-h-0" style={{ borderColor: `${VIOLET}55`, background: `linear-gradient(140deg, #171033, #0b0a1e)` }}>
              <motion.div
                className="absolute inset-0"
                style={{ background: `radial-gradient(60% 40% at 50% 40%, ${VIOLET}33, transparent)` }}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="absolute top-[0.6vh] left-[0.6vw] flex items-center gap-[0.4vw]">
                <motion.span
                  className="w-[0.5vw] h-[0.5vw] rounded-full bg-red-500"
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-[0.55vw] font-semibold" style={{ color: '#fff' }}>REC 00:42</span>
              </div>
              <div className="absolute inset-x-[0.8vw] bottom-[0.8vh] flex flex-wrap gap-[0.3vw]">
                {['RTU-2 coil', 'curb detail', 'north lot access'].map((t, i) => (
                  <motion.span
                    key={t}
                    className="px-[0.5vw] py-[0.2vh] rounded-full text-[0.5vw] font-semibold border"
                    style={{ color: VIOLET, borderColor: `${VIOLET}66`, background: `${VIOLET}18` }}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.6 + i * 0.4, duration: 0.4, ease: EASE }}
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            </div>
            <div className="rounded-lg border p-[0.6vw]" style={{ background: PANEL2, borderColor: BORDER }}>
              <span className="text-[0.6vw]" style={{ color: MUTED }}>
                Timestamped photos + video, auto-tagged to scope
              </span>
            </div>
          </CapturePhone>
        </motion.div>
      </div>
    </motion.div>
  );
}
