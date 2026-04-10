'use client';

import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { ARCHETYPE_ANALYSIS } from '@/lib/mbtiData';
import { Zap, Moon, Compass, ShieldAlert, Target, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface ArchetypeAnalysisProps {
  archetype: string;
}

export const ArchetypeAnalysis: React.FC<ArchetypeAnalysisProps> = ({ archetype }) => {
  const data = ARCHETYPE_ANALYSIS[archetype];

  if (!data) return (
    <div className="p-12 text-center opacity-30 font-black tracking-[0.2em] italic animate-pulse text-xs">
      SYNCHRONIZING NEURAL DATA...
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Compass size={12} className="text-secondary" />
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40">
            Core Directive
          </span>
        </div>
        <GlassCard className="p-4 border-white/10 bg-white/5">
          <p className="text-sm font-medium leading-relaxed italic text-white/80">
            "{data.drive}"
          </p>
        </GlassCard>
      </div>

      <div className="grid gap-4">
        {/* Superpowers */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-6 border-accent/20 bg-accent/5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-50" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                <Zap size={20} />
              </div>
              <h3 className="text-xs font-black tracking-[0.2em] uppercase">
                Tactical Superpowers
              </h3>
            </div>
            <div className="space-y-4">
              {data.superpowers.map((power, i) => {
                const [label, desc] = power.split(': ');
                return (
                  <div key={i} className="group/item">
                    <div className="text-[10px] font-black text-accent tracking-wider uppercase mb-1">
                      {label}
                    </div>
                    <div className="text-xs text-white/60 leading-relaxed font-medium">
                      {desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>

        {/* Shadows */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-6 border-white/5 bg-white/5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-white/20 opacity-30" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                <Moon size={20} />
              </div>
              <h3 className="text-xs font-black tracking-[0.2em] uppercase text-white/40">
                Cognitive Shadows
              </h3>
            </div>
            <div className="space-y-4">
              {data.shadows.map((shadow, i) => {
                const [label, desc] = shadow.split(': ');
                return (
                  <div key={i} className="group/item">
                    <div className="text-[10px] font-black text-white/40 tracking-wider uppercase mb-1">
                      {label}
                    </div>
                    <div className="text-xs text-white/40 leading-relaxed font-medium">
                      {desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4 group">
        <ShieldAlert size={16} className="text-white/20 group-hover:text-accent transition-colors" />
        <span className="text-[9px] font-black tracking-widest text-white/20 uppercase italic">
          Verification: Nexus v2.6 // Secured
        </span>
        <Activity size={12} className="ml-auto text-accent/30 animate-pulse" />
      </div>
    </motion.div>
  );
};
