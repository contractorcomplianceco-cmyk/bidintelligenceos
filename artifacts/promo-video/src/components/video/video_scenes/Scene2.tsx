import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import voiceConnectLogo from '@assets/VoiceConnecttm_1782477050182.png';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-start px-[10vw]"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex flex-col gap-8 z-10 w-1/2">
        <motion.img 
          src={voiceConnectLogo} 
          className="h-16 w-auto object-contain"
          initial={{ opacity: 0, x: -20 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        />
        
        <motion.h2 
          className="text-[4vw] font-bold leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          Live tips in your ear.<br/>
          <span className="text-[var(--color-accent-teal)]">Hands-free field capture.</span>
        </motion.h2>
      </div>
      
      <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center pointer-events-none">
        <motion.div 
          className="relative w-[30vw] h-[30vw]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Audio Wave Abstraction */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-accent-teal)]/30"
              animate={{
                width: ['20%', '100%'],
                height: ['20%', '100%'],
                opacity: [0.8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeOut'
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}