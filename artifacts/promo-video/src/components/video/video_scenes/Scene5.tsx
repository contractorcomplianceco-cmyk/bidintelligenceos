import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import bidLogo from '@assets/BidIntelligenceOS_1781626679949.png';
import voiceLogo from '@assets/VoiceConnecttm_1782477050182.png';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-bg-dark)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="flex items-center justify-center gap-12 mb-16"
        initial={{ y: 30, opacity: 0 }}
        animate={phase >= 1 ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <img src={bidLogo} className="h-16 object-contain brightness-0 invert" alt="BidIntelligenceOS" />
        <div className="w-px h-16 bg-white/20" />
        <img src={voiceLogo} className="h-20 object-contain" alt="VoiceConnect" />
      </motion.div>

      <motion.div 
        className="text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={phase >= 2 ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
      >
        <p className="text-[1.5vw] text-[var(--color-text-secondary)] uppercase tracking-[0.2em] mb-4">
          A product of Contractor Connect
        </p>
        <h2 className="text-[3vw] font-bold text-white">
          Research Less, Win More.
        </h2>
      </motion.div>
    </motion.div>
  );
}