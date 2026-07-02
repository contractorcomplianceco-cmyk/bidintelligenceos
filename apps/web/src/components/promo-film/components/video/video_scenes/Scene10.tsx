import { motion } from 'framer-motion';
import logo from '@/assets/bidintelligence-logo.png';
import { EASE, CYAN, TEAL, VIOLET, ORANGE, EMERALD, AMBER, ROSE, GREEN, PANEL, MUTED } from './shared';

const MODULES = [
  { label: 'ROSEOS', color: ROSE },
  { label: 'VoiceConnect', color: TEAL },
  { label: 'VideoConnect', color: VIOLET },
  { label: 'BuildConnect', color: ORANGE },
  { label: 'ComplianceConnect', color: EMERALD },
  { label: 'MarketWatchOS', color: AMBER },
];

export function Scene10() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center gap-[3.2vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <motion.img
        src={logo}
        alt="BidIntelligenceOS"
        className="w-[17vw]"
        initial={{ opacity: 0, y: 24, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
      />

      <motion.p
        className="text-[1vw] tracking-[0.3em] uppercase"
        style={{ color: MUTED }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        One connected ecosystem
      </motion.p>

      <div className="flex items-center gap-[0.9vw]">
        {MODULES.map((m, i) => (
          <motion.div
            key={m.label}
            className="px-[1.1vw] py-[0.9vh] rounded-full border text-[0.9vw] font-semibold"
            style={{ background: PANEL, borderColor: `${m.color}66`, color: m.color, boxShadow: `0 0 30px -12px ${m.color}88` }}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1 + i * 0.28, duration: 0.5, ease: EASE }}
          >
            {m.label}
          </motion.div>
        ))}
      </div>

      <motion.h2
        className="text-[3.2vw] font-bold text-white text-center leading-tight"
        initial={{ opacity: 0, y: 34, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ delay: 2.8, duration: 0.9, ease: EASE }}
      >
        Bid smarter. <span style={{ color: CYAN }}>Execute faster.</span>
        <br />
        <span style={{ color: TEAL }}>Learn continuously.</span>
      </motion.h2>

      <div className="mt-[0.6vh] flex items-center gap-[1vw]">
        <motion.div
          className="px-[2.4vw] py-[1.5vh] rounded-xl text-[1.15vw] font-bold text-[#04111e]"
          style={{ background: CYAN, boxShadow: '0 0 60px -12px rgba(56,189,248,0.8)' }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: [0.85, 1.04, 1] }}
          transition={{ delay: 4, duration: 0.7, ease: EASE }}
        >
          Request a Demo
        </motion.div>
        <motion.div
          className="px-[2.4vw] py-[1.5vh] rounded-xl text-[1.15vw] font-bold text-white border"
          style={{ borderColor: `${CYAN}66`, background: 'rgba(56,189,248,0.08)' }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: [0.85, 1.04, 1] }}
          transition={{ delay: 4.25, duration: 0.7, ease: EASE }}
        >
          Enter Command Center
        </motion.div>
      </div>

      <motion.p
        className="text-[0.82vw]"
        style={{ color: MUTED }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5, duration: 0.6 }}
      >
        Decision-support intelligence — you stay in control of every bid, job, and outcome.
      </motion.p>

      <motion.span
        className="w-[6vw] h-[3px] rounded-full"
        style={{ background: GREEN }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 5.4, duration: 0.6, ease: EASE }}
      />
    </motion.div>
  );
}
