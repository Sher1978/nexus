'use client';

import React, { useState } from 'react';
import { SHADOW_CODE_NAMES, TYPE_QUADRA, QUADRA_DATA } from '@/lib/shadowCode';
import { ArchetypeAnalysis } from './ArchetypeAnalysis';
import { IdentityCard } from './IdentityCard';
import { motion, AnimatePresence } from 'framer-motion';
import { QuadraCompatibility } from './QuadraCompatibility';
import { useAuth } from './AuthProvider';
import { Info, Share2, ChevronUp, Scan, Fingerprint, Shield, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { GlassCard } from '../ui/GlassCard';

interface ProfileScreenProps {
  onScanClick: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onScanClick }) => {
  const { user, tgUser } = useAuth();
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [showQuadraDossier, setShowQuadraDossier] = useState(false);
  
  const code = user?.archetype || 'UNKNOWN';
  const typeName = SHADOW_CODE_NAMES[code] || 'Агент';
  const nexusId = user?.id || '';
  const quadra = TYPE_QUADRA[code];
  const quadraInfo = quadra ? QUADRA_DATA[quadra] : null;

  const handleToggleAnalysis = () => {
    if (!showAnalysis && !isAuditing) {
      setIsAuditing(true);
      setTimeout(() => {
        setIsAuditing(false);
        setShowAnalysis(true);
      }, 1500);
    } else {
      setShowAnalysis(!showAnalysis);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-[440px] px-4 pt-0 pb-32 space-y-8"
    >
      {/* Top Profile Section */}
      <section className="flex flex-col items-center pt-4">
        <div className="relative group mb-6">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-8px] border border-dashed rounded-full"
            style={{ borderColor: quadraInfo?.color || 'rgba(255,255,255,0.1)' }}
          />
          <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden relative shadow-2xl">
            {tgUser?.photo_url ? (
              <img src={tgUser.photo_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-black text-white/20">
                {tgUser?.first_name?.[0] || 'A'}
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-2">
              <div className="w-1 h-3 bg-accent rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black tracking-tight">
            {tgUser?.first_name || 'Anonymous Agent'}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[8px] font-black tracking-widest text-white/40">
              ID: {nexusId.slice(0, 8).toUpperCase()}
            </span>
            {quadraInfo && (
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowQuadraDossier(true)}
                className="flex items-center gap-1.5 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[9px] font-black tracking-wider text-accent uppercase"
              >
                {quadraInfo.name} Quadra <Info size={10} />
              </motion.button>
            )}
          </div>
        </div>
      </section>

      {/* Primary Status Card */}
      {!showAnalysis && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <IdentityCard 
            name={tgUser?.first_name || 'Anonymous'} 
            archetype={code} 
            nexusId={nexusId} 
          />
          <div className="flex items-center justify-center gap-2 mt-4 text-[9px] font-black text-white/20 tracking-[0.2em] uppercase italic">
            <Fingerprint size={12} className="opacity-50" />
            System signature encrypted
          </div>
        </motion.div>
      )}

      {/* Analysis Interface */}
      <section className="space-y-4">
        <GlassCard className={`p-8 text-center transition-all duration-500 overflow-hidden ${showAnalysis ? 'border-accent/30' : 'border-white/5'}`}>
          <div className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase mb-4">
            Human OS Architecture
          </div>
          <h3 className="text-4xl font-black tracking-tighter mb-8" style={{ color: quadraInfo?.color || '#fff' }}>
            {typeName.toUpperCase()}
          </h3>
          
          <Button 
            variant="glass" 
            onClick={handleToggleAnalysis}
            className="w-full h-14 font-black tracking-widest text-xs gap-3 border-white/10 hover:border-accent/50 group"
          >
            {isAuditing ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-ping" />
                SYSTEM AUDIT IN PROGRESS...
              </div>
            ) : showAnalysis ? (
              <>TERMINATE ANALYSIS <ChevronUp size={16} className="text-accent" /></>
            ) : (
              <>INITIATE FULL AUDIT <Info size={16} className="group-hover:text-accent" /></>
            )}
          </Button>
        </GlassCard>

        <AnimatePresence>
          {showAnalysis && (
            <motion.div 
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="overflow-hidden"
            >
              <ArchetypeAnalysis archetype={code} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Action Section */}
      <section className="pt-4 space-y-4">
        {/* Telegram Mirror Status */}
        <GlassCard className="p-4 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${user?.telegram_id ? 'bg-[#0088cc] animate-pulse' : 'bg-white/20'}`} />
            <div>
              <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Bot Mirror</div>
              <div className="text-xs font-bold">{user?.telegram_id ? 'SYNCED' : 'NOT LINKED'}</div>
            </div>
          </div>
          {!user?.telegram_id && (
            <Button 
              variant="glass" 
              onClick={() => window.open(`https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}?start=sync_${user?.id}`, '_blank')}
              className="h-8 px-4 text-[10px] border-[#0088cc]/30 text-[#0088cc] hover:bg-[#0088cc]/10"
            >
              CONNECT
            </Button>
          )}
        </GlassCard>

        <Button 
          variant="primary" 
          onClick={onScanClick}
          className="w-full h-16 rounded-2xl bg-accent text-black font-black tracking-widest text-sm relative overflow-hidden group shadow-[0_20px_40px_rgba(var(--gold-rgb),0.3)]"
          style={{ 
            backgroundColor: quadraInfo?.color,
            boxShadow: quadraInfo ? `0 20px 40px ${quadraInfo.color}30` : undefined
          } as any}
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
          <div className="relative flex items-center justify-center gap-3">
            <Scan size={20} /> AGENT SCAN PROTOCOL
          </div>
        </Button>
      </section>

      {/* Overlay Screens */}
      <AnimatePresence>
        {showQuadraDossier && quadra && (
          <QuadraCompatibility 
            userQuadra={quadra} 
            onClose={() => setShowQuadraDossier(false)} 
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
        .stories-ring {
          position: relative;
          padding: 4px;
          border-radius: 50%;
          background: linear-gradient(45deg, var(--ring-color, #fff), transparent);
          animation: rotate 10s linear infinite;
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .agent-id-badge {
          font-size: 0.7rem;
          font-weight: 800;
          color: rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.05);
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          letter-spacing: 1px;
        }
      `}</style>
    </motion.div>
  );
};

export default ProfileScreen;
