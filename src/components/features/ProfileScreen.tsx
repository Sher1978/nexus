import React, { useState } from 'react';
import { SHADOW_CODE_NAMES, TYPE_QUADRA, QUADRA_DATA } from '@/lib/shadowCode';
import { ArchetypeAnalysis } from './ArchetypeAnalysis';
import { IdentityCard } from './IdentityCard';
import { motion, AnimatePresence } from 'framer-motion';
import { QuadraCompatibility } from './QuadraCompatibility';
import { useAuth } from './AuthProvider';
import { Info, Share2, ChevronUp, Scan } from 'lucide-react';
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
      }, 2000);
    } else {
      setShowAnalysis(!showAnalysis);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '440px', padding: '1rem', position: 'relative' }}>
      {/* Top Profile Section with Stories Ring */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div className="stories-ring" style={{ '--ring-color': quadraInfo?.color } as any}>
            <div className="stories-inner">
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                background: quadraInfo ? `${quadraInfo.color}20` : 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                border: `1px solid ${quadraInfo?.color || 'transparent'}`
              }}>
                {tgUser?.first_name?.[0] || 'A'}
              </div>
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.2rem', letterSpacing: '-1px' }}>
          {tgUser?.first_name || 'Anonymous Agent'}
        </h2>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
          <div className="agent-id-badge">
            ID: {nexusId.slice(0, 8).toUpperCase()}
          </div>
          {quadraInfo && (
            <motion.div 
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowQuadraDossier(true)}
              style={{ 
                background: `${quadraInfo.color}20`, 
                border: `1px solid ${quadraInfo.color}40`,
                color: quadraInfo.color,
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                fontSize: '0.65rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              Квадра {quadraInfo.name} <Info size={12} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Premium Identity Card Section */}
      {!showAnalysis && (
        <div style={{ marginBottom: '2.5rem' }} className="fade-in">
          <IdentityCard 
            name={tgUser?.first_name || 'Anonymous'} 
            archetype={code} 
            nexusId={nexusId} 
          />
          <div style={{ 
            marginTop: '1.2rem', 
            textAlign: 'center', 
            fontSize: '0.7rem', 
            opacity: 0.4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <Share2 size={12} /> TAP CARD TO ROTATE • SHARE WITH AGENTS
          </div>
        </div>
      )}

      {/* Stats / Audit Section */}
      <GlassCard style={{ 
        marginBottom: '1.5rem', 
        textAlign: 'center', 
        padding: '1.5rem 1rem',
        borderTop: quadraInfo ? `2px solid ${quadraInfo.color}` : undefined
      }}>
        <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '3px', opacity: 0.5, marginBottom: '0.75rem', fontWeight: 800 }}>
          Human OS Architecture
        </div>
        <div className="text-gold" style={{ 
          fontSize: '2rem', 
          fontWeight: 900, 
          marginBottom: '0.5rem', 
          lineHeight: 1,
          backgroundImage: quadraInfo ? `linear-gradient(135deg, ${quadraInfo.color} 0%, #ffffff 100%)` : undefined,
          WebkitBackgroundClip: quadraInfo ? 'text' : undefined,
          WebkitTextFillColor: quadraInfo ? 'transparent' : undefined
        }}>
          {typeName.toUpperCase()}
        </div>
        
        <Button 
          variant="glass" 
          onClick={handleToggleAnalysis}
          style={{ 
            marginTop: '1.5rem', 
            width: '100%', 
            fontSize: '0.8rem', 
            fontWeight: 800, 
            gap: '0.5rem',
            borderColor: showAnalysis ? (quadraInfo?.color || 'var(--ios-gold)') : undefined
          }}
        >
          {isAuditing ? 'АНАЛИЗ СИСТЕМЫ...' : showAnalysis ? (
            <>СКРЫТЬ АНАЛИЗ <ChevronUp size={16} /></>
          ) : (
            <>ПОЛНЫЙ АУДИТ ТИПА <Info size={16} /></>
          )}
        </Button>
      </GlassCard>

      <AnimatePresence>
        {showAnalysis && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ marginBottom: '2rem', overflow: 'hidden' }}
          >
            <ArchetypeAnalysis archetype={code} />
          </motion.div>
        )}
      </AnimatePresence>

      <Button 
        variant="primary" 
        onClick={onScanClick}
        style={{ 
          width: '100%', 
          padding: '1.4rem', 
          gap: '0.75rem', 
          marginBottom: '2rem',
          boxShadow: `0 10px 30px ${quadraInfo?.color}30`,
          background: quadraInfo?.color 
        }}
      >
        <Scan size={20} /> СКАНЕР АГЕНТА
      </Button>

      {/* Quadra Dossier Overlay */}
      <AnimatePresence>
        {showQuadraDossier && quadra && (
          <QuadraCompatibility 
            userQuadra={quadra} 
            onClose={() => setShowQuadraDossier(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileScreen;
