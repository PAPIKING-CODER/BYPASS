import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("INITIALIZING SYSTEM...");

  useEffect(() => {
    const texts = [
      "ESTABLISHING SECURE CONNECTION...",
      "BYPASSING PROTOCOLS...",
      "LOADING NEURAL INTERFACE...",
      "DECRYPTING ASSETS...",
      "ACCESS GRANTED."
    ];

    let t = 0;
    const textInterval = setInterval(() => {
      t++;
      if (t < texts.length) setText(texts[t]);
    }, 400);

    const progInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(progInterval);
          clearInterval(textInterval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return p + Math.floor(Math.random() * 15);
      });
    }, 150);

    return () => {
      clearInterval(textInterval);
      clearInterval(progInterval);
    };
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center font-mono"
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="cyber-grid opacity-50" />
      
      <div className="relative mb-12">
        <Terminal className="w-24 h-24 text-primary animate-pulse" />
        <div className="absolute inset-0 bg-primary blur-3xl opacity-20" />
      </div>

      <h1 className="text-4xl font-bold text-white mb-8 tracking-[0.5em] ml-[0.5em]">
        BYPASS<span className="text-primary">.OS</span>
      </h1>

      <div className="w-64 max-w-[80vw]">
        <div className="flex justify-between text-xs text-primary mb-2">
          <span>{text}</span>
          <span>{Math.min(100, progress)}%</span>
        </div>
        <div className="h-1 bg-white/10 w-full rounded overflow-hidden">
          <div 
            className="h-full bg-primary shadow-[0_0_10px_var(--primary-glow)] transition-all duration-100 ease-linear"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
