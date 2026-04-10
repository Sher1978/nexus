'use client';

import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { SHADOW_CODE_NAMES, TYPE_QUADRA, QUADRA_DATA } from '@/lib/shadowCode';
import { Shield, Zap, QrCode, Scan } from 'lucide-react';

interface IdentityCardProps {
  name: string;
  archetype: string;
  nexusId: string;
}

export const IdentityCard: React.FC<IdentityCardProps> = ({ name, archetype, nexusId }) => {
  const [isHovered, setIsHovered] = useState(false);
  const typeName = SHADOW_CODE_NAMES[archetype] || 'Unknown Agent';
  const qrValue = `nexus:id:${nexusId}`;
  
  const quadra = TYPE_QUADRA[archetype];
  const quadraInfo = quadra ? QUADRA_DATA[quadra] : null;
  const accentColor = quadraInfo?.color || 'rgba(212, 175, 55, 1)';

  return (
    <div 
      className="identity-card-wrapper"
      style={{
        perspective: '1000px',
        width: '100%',
        maxWidth: '380px',
        margin: '0 auto'
      }}
    >
      <div 
        className="identity-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(30px) saturate(200%)',
          WebkitBackdropFilter: 'blur(30px) saturate(200%)',
          border: `1px solid ${accentColor}40`,
          borderRadius: '32px',
          padding: '2.5rem 1.5rem',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isHovered ? 'rotateX(5deg) rotateY(-5deg) scale(1.02)' : 'rotateX(0) rotateY(0) scale(1)',
          boxShadow: isHovered 
            ? `0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px ${accentColor}30` 
            : '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: `radial-gradient(circle at center, ${accentColor}15 0%, transparent 50%)`,
          animation: 'rotate-bg 15s infinite linear',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        {/* HUD Corners */}
        <div className="hud-corner-tl" style={{ borderColor: accentColor }} />
        <div className="hud-corner-tr" style={{ borderColor: accentColor }} />
        <div className="hud-corner-bl" style={{ borderColor: accentColor }} />
        <div className="hud-corner-br" style={{ borderColor: accentColor }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ 
            fontSize: '0.65rem', 
            textTransform: 'uppercase', 
            letterSpacing: '5px', 
            opacity: 0.4, 
            marginBottom: '1rem',
            fontWeight: 900,
            color: accentColor
          }}>
            Nexus Identity Card
          </div>

          <div style={{ 
            fontSize: '2.4rem', 
            fontWeight: 900, 
            lineHeight: 1,
            marginBottom: '0.2rem',
            color: 'white',
            filter: `drop-shadow(0 0 15px ${accentColor}40)`
          }}>
            {typeName.toUpperCase()}
          </div>
          
          <div style={{ 
            fontSize: '0.85rem', 
            opacity: 0.5, 
            fontWeight: 700, 
            letterSpacing: '2px',
            marginBottom: '2rem'
          }}>
            PROTOCOL: {archetype}
          </div>

          {/* QR HUD Frame */}
          <div style={{
            width: '200px',
            height: '200px',
            margin: '0 auto 2rem',
            padding: '12px',
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${accentColor}20`,
            borderRadius: '24px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div className="scan-line-qr" style={{ background: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
            <div style={{
              background: 'white',
              padding: '10px',
              borderRadius: '16px',
              boxShadow: '0 0 20px rgba(0,0,0,0.5)'
            }}>
              <QRCodeCanvas 
                value={qrValue} 
                size={140} 
                bgColor={"#ffffff"} 
                fgColor={"#000000"} 
                level={"H"}
              />
            </div>
            
            {/* Micro HUD info */}
            <div style={{
              position: 'absolute',
              bottom: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--background)',
              padding: '2px 10px',
              border: `1px solid ${accentColor}40`,
              borderRadius: '20px',
              fontSize: '0.6rem',
              fontWeight: 800,
              color: accentColor,
              whiteSpace: 'nowrap'
            }}>
              NEURAL SIGNATURE ACTIVE
            </div>
          </div>

          <div style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Shield size={16} style={{ color: accentColor, opacity: 0.5 }} />
              {name}
            </span>
          </div>
          <div style={{ 
            fontSize: '0.7rem', 
            opacity: 0.3, 
            fontFamily: 'monospace',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
           }}>
            <Scan size={10} /> AGENT_{nexusId.slice(0, 12).toUpperCase()}
          </div>
        </div>

        {/* Glass Reflection */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 40%, rgba(255,255,255,0.05) 100%)',
          pointerEvents: 'none'
        }} />
      </div>

      <style jsx>{`
        .hud-corner-tl, .hud-corner-tr, .hud-corner-bl, .hud-corner-br {
          position: absolute;
          width: 20px;
          height: 20px;
          border-color: var(--ios-gold);
          border-width: 2px;
          opacity: 0.3;
        }
        .hud-corner-tl { top: 20px; left: 20px; border-top-style: solid; border-left-style: solid; }
        .hud-corner-tr { top: 20px; right: 20px; border-top-style: solid; border-right-style: solid; }
        .hud-corner-bl { bottom: 20px; left: 20px; border-bottom-style: solid; border-left-style: solid; }
        .hud-corner-br { bottom: 20px; right: 20px; border-bottom-style: solid; border-right-style: solid; }

        @keyframes rotate-bg {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .scan-line-qr {
          position: absolute;
          left: 10px;
          right: 10px;
          height: 1px;
          background: var(--ios-gold);
          box-shadow: 0 0 10px var(--ios-gold);
          z-index: 5;
          animation: scanning-qr 4s infinite linear;
          opacity: 0.5;
        }

        @keyframes scanning-qr {
          0% { top: 10px; opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { top: 190px; opacity: 0; }
        }
      `}</style>
    </div>
  );
};
