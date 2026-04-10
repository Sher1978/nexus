'use client';

import React from 'react';
import { ChevronLeft, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface TopNavProps {
  title?: string;
  onBack?: () => void;
  showBack?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({ 
  title = "NEXUS OS v2.6", 
  onBack, 
  showBack = false 
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-[1100] h-[64px] flex items-center px-6 bg-black/40 backdrop-blur-[32px] border-b border-white/10">
      <div className="flex-1 flex items-center gap-4">
        {showBack && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.92 }}
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-white/5 border border-white/10 shadow-xl backdrop-blur-sm"
          >
            <ChevronLeft size={22} className="text-white ml-[-2px]" />
          </motion.button>
        )}
        
        {!showBack && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/20 flex items-center justify-center border border-accent/30 shadow-[0_0_20px_rgba(var(--accent-rgb),0.2)]">
              <Zap size={22} className="text-accent fill-accent/20" />
            </div>
          </div>
        )}
        
        <div className="flex flex-col">
          <span className="text-[10px] font-black tracking-[0.25em] text-accent/60 uppercase">
            {showBack ? "Navigation" : "System Central"}
          </span>
          <span className="text-[17px] font-bold tracking-tight text-white/95">
            {title}
          </span>
        </div>
      </div>
      
      <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-green-500/5 border border-green-500/20 backdrop-blur-md">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">
          Node Active
        </span>
      </div>
    </header>
  );
};

export default TopNav;
