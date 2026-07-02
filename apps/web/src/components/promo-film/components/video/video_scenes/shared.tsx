import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

export const EASE = [0.16, 1, 0.3, 1] as const;

export const NAVY = '#0A0E1A';
export const PANEL = '#0F1830';
export const PANEL2 = '#111A2E';
export const BORDER = '#1C253B';
export const CYAN = '#38BDF8';
export const TEAL = '#0BA3A8';
export const VIOLET = '#7C3AED';
export const ORANGE = '#F97316';
export const EMERALD = '#059669';
export const GREEN = '#22C55E';
export const RED = '#EF4444';
export const AMBER = '#F59E0B';
export const ROSE = '#E11D48';
export const MUTED = '#8A96B0';
export const DIM = '#5b6680';

/** Browser-chrome desktop app frame */
export function AppFrame({
  label,
  children,
  className = '',
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`w-full h-full rounded-xl border overflow-hidden flex flex-col shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] ${className}`}
      style={{ borderColor: BORDER, background: '#0B1222' }}
    >
      <div
        className="flex items-center gap-2 px-[1.2vw] py-[0.7vh] border-b shrink-0"
        style={{ borderColor: BORDER, background: PANEL }}
      >
        <span className="w-[0.6vw] h-[0.6vw] rounded-full bg-[#EF4444]/70" />
        <span className="w-[0.6vw] h-[0.6vw] rounded-full bg-[#F59E0B]/70" />
        <span className="w-[0.6vw] h-[0.6vw] rounded-full bg-[#22C55E]/70" />
        <span className="ml-[0.8vw] text-[0.85vw] font-medium tracking-wide" style={{ color: DIM }}>
          {label}
        </span>
      </div>
      <div className="relative flex-1 min-h-0 p-[1.4vw]">{children}</div>
    </div>
  );
}

/** Teal-branded VoiceConnect phone frame */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative h-full aspect-[9/19] rounded-[2.2vw] border-[0.22vw] overflow-hidden flex flex-col shadow-[0_30px_90px_-20px_rgba(11,163,168,0.35)]"
      style={{ borderColor: 'rgba(11,163,168,0.55)', background: '#07131d' }}
    >
      <div className="flex items-center justify-between px-[1vw] pt-[0.9vh] pb-[0.5vh] shrink-0">
        <span className="text-[0.75vw] font-semibold" style={{ color: TEAL }}>
          VoiceConnect
        </span>
        <span className="text-[0.6vw]" style={{ color: DIM }}>
          Field Capture
        </span>
      </div>
      <div className="relative flex-1 min-h-0 px-[0.9vw] pb-[0.9vh] flex flex-col gap-[0.9vh]">{children}</div>
    </div>
  );
}

/** Small uppercase section kicker used above scene headlines */
export function Kicker({ text, color = CYAN, delay = 0 }: { text: string; color?: string; delay?: number }) {
  return (
    <motion.div
      className="flex items-center gap-[0.6vw]"
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5, ease: EASE }}
    >
      <motion.span
        className="h-[2px] block"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: '2.2vw' }}
        transition={{ delay: delay + 0.15, duration: 0.5, ease: EASE }}
      />
      <span className="text-[0.95vw] font-bold uppercase tracking-[0.25em]" style={{ color }}>
        {text}
      </span>
    </motion.div>
  );
}

/** Animated voice waveform bars */
export function Waveform({ bars = 24, color = TEAL, className = '' }: { bars?: number; color?: string; className?: string }) {
  return (
    <div className={`flex items-center gap-[0.18vw] ${className}`}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.span
          key={i}
          className="w-[0.22vw] rounded-full"
          style={{ background: color }}
          animate={{ height: ['0.4vh', `${1 + ((i * 7) % 5) * 0.55}vh`, '0.5vh', `${0.8 + ((i * 3) % 4) * 0.6}vh`, '0.4vh'] }}
          transition={{ duration: 1.2 + (i % 5) * 0.14, repeat: Infinity, ease: 'easeInOut', delay: i * 0.05 }}
        />
      ))}
    </div>
  );
}
