'use client';

import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { SHADOW_CODE_NAMES, TYPE_QUADRA, QUADRA_DATA } from '@/lib/shadowCode';
import { Shield, Zap, QrCode, Scan, Lock, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface IdentityCardProps {
  name: string;
  archetype: string;
  nexusId: string;
}

export const IdentityCard: React.FC<IdentityCardProps> = ({ name, archetype, nexusId }) => {
  const [isHovered, setIsHovered] = useState(false);
  const typeName = SHADOW_CODE_NAMES[archetype] || 'Unknown Agent';
  const qrValue = `https://t.me/humanexusbot?start=inspect_${nexusId}`;
  
  const quadra = TYPE_QUADRA[archetype];
  const quadraInfo = quadra ? QUADRA_DATA[quadra] : null;
  const accentColor = quadraInfo?.color || 'rgba(212, 175, 55, 1)';

  return (
    <div className="w-full max-w-[380px] mx-auto [perspective:1000px]">
      <motion.div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{ 
          rotateX: isHovered ? 5 : 0, 
          rotateY: isHovered ? -5 : 0,
          scale: isHovered ? 1.02 : 1
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative p-10 rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-3xl overflow-hidden group"
        style={{ borderColor: `${accentColor}40` }}
      >
        {/* Animated Background Pulse */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(circle at center, ${accentColor}40 0%, transparent 70%)` }}
        />

        {/* HUD Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />

        {/* Tactical Corners */}
        <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 opacity-30 group-hover:opacity-100 transition-opacity" style={{ borderColor: accentColor }} />
        <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 opacity-30 group-hover:opacity-100 transition-opacity" style={{ borderColor: accentColor }} />
        <div className="absolute bottom-10 left-8 w-6 h-6 border-b-2 border-l-2 opacity-30 group-hover:opacity-100 transition-opacity" style={{ borderColor: accentColor }} />
        <div className="absolute bottom-10 right-8 w-6 h-6 border-b-2 border-r-2 opacity-30 group-hover:opacity-100 transition-opacity" style={{ borderColor: accentColor }} />

        <div className="relative z-10 text-center space-y-8">
          <div className="space-y-1">
            <div className="text-[10px] font-black tracking-[0.5em] uppercase opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: accentColor }}>
              Nexus Identity
            </div>
            <h2 className="text-3xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              {typeName.toUpperCase()}
            </h2>
            <div className="text-[10px] font-black tracking-[0.3em] opacity-30 flex items-center justify-center gap-2">
              <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
              PROTOCOL: {archetype}
            </div>
          </div>

          {/* QR Interface */}
          <div className="relative w-48 h-48 mx-auto p-4 rounded-3xl bg-white/5 border border-white/10 group/qr">
            <div className="absolute inset-2 border border-accent/20 rounded-2xl pointer-events-none" />
            <motion.div 
              animate={{ top: ['10%', '90%', '10%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute left-4 right-4 h-[1px] shadow-[0_0_10px_#fff]"
              style={{ background: accentColor, boxShadow: `0 0 15px ${accentColor}` }}
            />
            <div className="bg-white p-2.5 rounded-2xl shadow-2xl relative z-10 h-full w-full flex items-center justify-center overflow-hidden">
              <QRCodeCanvas 
                value={qrValue} 
                size={140} 
                level="H"
                className="w-full h-full"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xl font-black text-white flex items-center justify-center gap-2">
              <Lock size={16} className="opacity-30" style={{ color: accentColor }} />
              {name}
            </div>
            <div className="text-[9px] font-black tracking-[0.2em] text-white/30 truncate px-4">
              AGENT_{nexusId.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Gloss Effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/10 via-transparent to-transparent" />
      </motion.div>
    </div>
  );
};
