import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-40">
        <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
          <motion.path
            d="M -100 300 C 200 100, 800 500, 1100 300"
            fill="none"
            stroke="url(#grad)"
            strokeWidth="4"
            initial={{ pathLength: 0 }}
            animate={phase >= 1 ? { pathLength: 1 } : {}}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-accent-teal)" />
              <stop offset="100%" stopColor="var(--color-accent)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <motion.div 
        className="z-10 text-center"
        initial={{ y: 30, opacity: 0 }}
        animate={phase >= 2 ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-[5vw] font-bold text-white tracking-tight">
          Intelligence flowing<br/>
          seamlessly.
        </h2>
      </motion.div>
    </motion.div>
  );
}