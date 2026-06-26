import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import bidLogo from '@assets/BidIntelligenceOS_1781626679949.png';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-end px-[10vw]"
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1/2 flex items-center justify-center px-[5vw]">
        <motion.div 
          className="w-full bg-[var(--color-bg-muted)] border border-[var(--color-accent)]/20 rounded-xl p-8"
          initial={{ opacity: 0, rotateY: -30, x: -50, z: -100 }}
          animate={phase >= 1 ? { opacity: 1, rotateY: 10, x: 0, z: 0 } : {}}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ transformPerspective: 1000 }}
        >
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
            <span className="text-[var(--color-text-secondary)] font-mono text-sm">BID CONFIDENCE</span>
            <span className="text-[var(--color-success)] font-bold text-2xl">87%</span>
          </div>
          <div className="space-y-4">
            {[90, 60, 75].map((w, i) => (
              <div key={i} className="h-4 bg-[var(--color-bg-dark)] rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-[var(--color-accent)]"
                  initial={{ width: 0 }}
                  animate={phase >= 2 ? { width: `${w}%` } : {}}
                  transition={{ duration: 1, delay: i * 0.2, ease: 'easeOut' }}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col gap-6 z-10 w-1/2 pl-12 text-right items-end">
        <motion.img 
          src={bidLogo} 
          className="h-12 w-auto object-contain brightness-0 invert"
          initial={{ opacity: 0, x: 20 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        />
        
        <motion.h2 
          className="text-[4vw] font-bold leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          Insights you would<br/>
          have <span className="text-[var(--color-accent)]">never known.</span>
        </motion.h2>
        
        <motion.p
          className="text-[1.8vw] text-white/60 max-w-lg"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          Build history to see what works. Uncover the real strategy.
        </motion.p>
      </div>
    </motion.div>
  );
}