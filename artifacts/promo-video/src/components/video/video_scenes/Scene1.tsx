import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import heroImg from '@assets/stock_images/hero_construction.jpg';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 3500), // exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.img 
        src={heroImg} 
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        initial={{ scale: 1, x: '0%' }}
        animate={{ scale: 1.1, x: '-5%' }}
        transition={{ duration: 6, ease: 'linear' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-dark)] to-transparent" />
      
      <div className="relative z-10 text-center px-12 max-w-5xl">
        <motion.h1 
          className="text-[6vw] font-bold leading-tight text-white"
          initial={{ y: 50, opacity: 0, filter: 'blur(10px)' }}
          animate={phase >= 1 ? { y: 0, opacity: 1, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Intelligence flowing from<br/>
          <span className="text-[var(--color-accent)]">site</span> to <span className="text-[var(--color-accent-teal)]">office</span>
        </motion.h1>
        
        <motion.p 
          className="text-[2vw] text-white/70 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          Automate the tedious in-between.
        </motion.p>
      </div>
    </motion.div>
  );
}