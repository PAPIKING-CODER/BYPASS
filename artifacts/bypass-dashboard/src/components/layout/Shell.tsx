import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { GlobalMusicPlayer } from './GlobalMusicPlayer';
import { useSettings } from '../SettingsProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';

export function Shell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const { animations } = useSettings();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      <div className="scan-line" />
      <div className="cyber-grid" />
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0 transition-all duration-300 pb-20">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-3 sm:p-4 lg:p-8 overflow-y-auto custom-scrollbar relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={animations ? { opacity: 0, y: 20, filter: 'blur(10px)' } : { opacity: 1 }}
              animate={animations ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 1 }}
              exit={animations ? { opacity: 0, y: -20, filter: 'blur(10px)' } : { opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="max-w-7xl mx-auto"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <GlobalMusicPlayer />
    </div>
  );
}
