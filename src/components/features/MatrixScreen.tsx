'use client';

import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { SYNC_MATRIX, SHADOW_CODE_NAMES, PROTOCOL_NAMES, getTacticalPartners } from '@/lib/shadowCode';
import { SYNC_INSIGHTS } from '@/lib/mbtiSyncData';
import { useAuth } from './AuthProvider';
import { Target, Zap, Shield, Users, Globe, ChevronRight, Lock, Scan, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MatrixScreen: React.FC = () => {
  const { user } = useAuth();
  const [showAll, setShowAll] = useState(false);
  
  if (!user || !user.archetype) return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[70vh] text-center relative overflow-hidden">
      {/* Background Tactical Radar Effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="w-[500px] h-[500px] border border-dashed border-accent/30 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="w-[400px] h-[400px] border border-accent/20 rounded-full"
        />
        <div className="absolute w-[600px] h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent rotate-45" />
      </div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-24 h-24 rounded-3xl bg-error/10 border border-error/30 flex items-center justify-center relative shadow-[0_0_50px_rgba(255,100,100,0.1)] mb-8"
      >
        <div className="absolute inset-0 bg-error/20 blur-2xl rounded-full animate-pulse" />
        <Lock size={40} className="text-error relative z-10" />
      </motion.div>
      
      <div className="space-y-4 mb-8 relative z-10">
        <h2 className="text-3xl font-black tracking-tighter uppercase">Signal <span className="text-error">Encrypted</span></h2>
        <div className="flex items-center justify-center gap-2">
          <span className="w-8 h-[1px] bg-error/30" />
          <span className="text-[10px] font-black text-error tracking-[0.3em] uppercase">Auth Required // SL-4</span>
          <span className="w-8 h-[1px] bg-error/30" />
        </div>
        <p className="text-sm text-white/50 max-w-[280px] leading-relaxed font-medium mx-auto">
          Neural signature verification required to decrypt tactical network mapping. Please complete induction to proceed.
        </p>
      </div>

      <button 
        onClick={() => window.location.href = '/induction'}
        className="group relative px-10 py-5 bg-accent text-black font-black rounded-2xl hover:scale-105 transition-all shadow-[0_20px_40px_rgba(var(--gold-rgb),0.3)] overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
        <span className="relative flex items-center gap-3 text-[12px] tracking-[0.2em] uppercase font-black">
          <Scan size={20} /> Initiate Induction
        </span>
      </button>
    </div>
  );

  const tacticalPartners = getTacticalPartners(user.archetype);
  const allCodes = Object.keys(SHADOW_CODE_NAMES).sort();

  return (
    <div className="w-full max-w-[440px] px-4 pt-0 pb-32 space-y-8">
      <header>
        <div className="flex items-center gap-2 mb-2 opacity-60">
          <Globe size={12} className="text-accent" />
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-accent/80">
            Synchronicity Matrix v2.6
          </span>
        </div>
        <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">
          Tactical <span className="text-accent underline decoration-accent/20 underline-offset-8">Network</span>
        </h2>
        <p className="text-sm text-white/40 leading-relaxed font-medium">
          Deep synchronization protocols for <span className="text-accent font-black tracking-widest">{user.archetype}</span> neural signature.
        </p>
      </header>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">
            Primary Sync Nodes
          </h3>
          <Activity size={12} className="text-accent animate-pulse" />
        </div>
        
        {tacticalPartners.map((partner, index) => {
          const insight = SYNC_INSIGHTS[partner.protocol];
          return (
            <motion.div
              key={partner.code}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-0 border-white/5 overflow-hidden group hover:border-accent/30 transition-all duration-300">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-accent opacity-50 shadow-[0_0_15px_rgba(var(--gold-rgb),0.5)]" />
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">
                          {partner.protocolName}
                        </div>
                        <div className="text-xl font-black tracking-tight">{partner.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-accent drop-shadow-[0_0_10px_rgba(var(--gold-rgb),0.3)]">
                          {insight.score}%
                        </div>
                        <div className="text-[8px] font-black opacity-30 uppercase tracking-widest">Sync Level</div>
                      </div>
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed mb-6 font-medium line-clamp-2">
                      {insight.business}
                    </p>
                    <div className="flex items-center justify-between text-[8px] font-black opacity-30 tracking-[0.3em] uppercase border-t border-white/5 pt-4">
                      <span>SYS_ID // {partner.code}</span>
                      <ChevronRight size={10} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}

        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAll(!showAll)}
          className="w-full py-8 flex flex-col items-center justify-center gap-3 bg-white/5 border border-dashed border-white/10 rounded-2xl group hover:border-accent/50 transition-all"
        >
          <div className="text-[10px] font-black text-accent tracking-[0.4em] uppercase">
            {showAll ? 'Compress Network' : 'Expand Global Network'} 
          </div>
          <ChevronRight size={20} className={`text-white/20 group-hover:text-accent transition-all duration-500 ${showAll ? '-rotate-90' : 'rotate-90'}`} />
        </motion.button>

        <AnimatePresence>
          {showAll && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-2 gap-3 pb-8 overflow-hidden"
            >
              {allCodes.map(code => {
                const protocol = SYNC_MATRIX[user.archetype][code];
                const score = SYNC_INSIGHTS[protocol]?.score || 0;
                return (
                  <GlassCard key={code} className={`p-5 text-center transition-all ${score < 40 ? 'border-error/20 bg-error/5' : 'border-white/5'}`}>
                    <div className="text-[8px] font-black opacity-30 uppercase tracking-[0.2em] mb-2 truncate">
                      {PROTOCOL_NAMES[protocol]?.split(' (')[0]}
                    </div>
                    <div className={`font-black text-lg tracking-tighter ${score < 40 ? 'text-error' : 'text-accent'}`}>{code}</div>
                    <div className="text-[9px] font-bold opacity-30 whitespace-nowrap">{SHADOW_CODE_NAMES[code]}</div>
                  </GlassCard>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="mt-8 flex flex-col items-center gap-4 py-8">
        <div className="w-12 h-[1px] bg-white/10" />
        <div className="text-[8px] font-black opacity-20 text-center tracking-[0.5em] uppercase italic">
          Nexus Neural Link // Synchronicity Engine Active
        </div>
      </footer>
    </div>
  );
};

export default MatrixScreen;
