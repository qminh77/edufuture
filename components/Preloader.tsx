import React from 'react';
import { motion } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 3, duration: 1, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
    >
      <div className="relative">
        <motion.div
          className="w-24 h-24 border-4 border-neon-blue/30 rounded-full"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            ease: "linear",
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute top-0 left-0 w-24 h-24 border-t-4 border-neon-blue rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
        />
        <motion.div 
          className="absolute inset-0 flex items-center justify-center font-display text-xs tracking-widest text-neon-blue"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          AI.SYS
        </motion.div>
      </div>

      <motion.h2 
        className="mt-8 font-display text-2xl tracking-[0.3em] text-white uppercase"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Loading Interface
      </motion.h2>

      <motion.div 
        className="w-64 h-1 bg-gray-800 mt-4 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div 
          className="h-full bg-neon-blue"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Preloader;
