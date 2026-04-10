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
    <header className="fixed top-0 left-0 right-0 z-[1100] h-[60px] flex items-center px-4 bg-black/20 backdrop-blur-xl border-b border-white/5">
      <div className="flex-1 flex items-center gap-3">
        {showBack && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="p-2 -ml-2 rounded-full active:bg-white/10 transition-colors"
          >
            <ChevronLeft size={24} className="text-accent" />
          </motion.button>
        )}
        
        {!showBack && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center border border-accent/30">
              <Zap size={18} className="text-accent fill-accent/20" />
            </div>
          </div>
        )}
        
        <div className="flex flex-col">
          <span className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
            System Interface
          </span>
          <span className="text-sm font-bold tracking-tight text-white/90">
            {title}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">
          Online
        </span>
      </div>
    </header>
  );
};

export default TopNav;
