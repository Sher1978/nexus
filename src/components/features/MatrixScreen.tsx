'use client';

import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { SYNC_MATRIX, SHADOW_CODE_NAMES, PROTOCOL_NAMES, getTacticalPartners } from '@/lib/shadowCode';
import { SYNC_INSIGHTS } from '@/lib/mbtiSyncData';
import { useAuth } from './AuthProvider';
import { Target, Zap, Shield, Users, Globe, ChevronRight } from 'lucide-react';

export const MatrixScreen: React.FC = () => {
  const { user } = useAuth();
  const [showAll, setShowAll] = useState(false);
  
  if (!user) return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <div className="radar-pulse" style={{ width: '60px', height: '60px', margin: '0 auto 2rem' }} />
      <p style={{ opacity: 0.5, fontSize: '0.8rem', letterSpacing: '1px' }}>ПОДКЛЮЧЕНИЕ К NEXUS...</p>
    </div>
  );

  const tacticalPartners = getTacticalPartners(user.archetype);
  const allCodes = Object.keys(SHADOW_CODE_NAMES).sort();

  return (
    <div style={{ width: '100%', maxWidth: '440px', padding: '1rem' }} className="fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', opacity: 0.6 }}>
          <Globe size={14} className="text-gold" />
          <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
            Synchronicity Matrix
          </span>
        </div>
        <h2 className="text-gold" style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-1px' }}>
          ТАКТИЧЕСКАЯ СЕТЬ
        </h2>
        <p style={{ color: 'var(--ios-silver)', fontSize: '0.85rem', opacity: 0.7 }}>
          Анализ протоколов взаимодействия для {user.archetype} ({SHADOW_CODE_NAMES[user.archetype]}).
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.4, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>
          Приоритетные Связи
        </h3>
        
        {tacticalPartners.map((partner) => {
          const insight = SYNC_INSIGHTS[partner.protocol];
          return (
            <GlassCard key={partner.code} style={{ padding: '0' }}>
               <div style={{ padding: '1.25rem', borderLeft: `4px solid ${insight.score > 80 ? 'var(--ios-gold)' : 'rgba(255,255,255,0.1)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.6rem', fontWeight: 800, opacity: 0.5, marginBottom: '2px' }}>{partner.protocolName.toUpperCase()}</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>{partner.name}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="text-gold" style={{ fontSize: '1.2rem', fontWeight: 900 }}>{insight.score}%</div>
                      <div style={{ fontSize: '0.5rem', opacity: 0.4 }}>SYNC LVL</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.6, lineHeight: 1.4, marginBottom: '1rem' }}>
                    {insight.business.slice(0, 80)}...
                  </div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, opacity: 0.4, letterSpacing: '1px' }}>
                    SYSTEM CODE: {partner.code}
                  </div>
               </div>
            </GlassCard>
          );
        })}

        <button 
          onClick={() => setShowAll(!showAll)}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--ios-gold)', 
            fontSize: '0.75rem', 
            fontWeight: 800, 
            letterSpacing: '1px', 
            padding: '1.5rem', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          {showAll ? 'СКРЫТЬ ПОЛНУЮ СЕТЬ' : 'ОТКРЫТЬ ПОЛНУЮ СЕТЬ'} 
          <ChevronRight size={14} style={{ transform: showAll ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform 0.3s' }} />
        </button>

        {showAll && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }} className="fade-in">
            {allCodes.map(code => {
              const protocol = SYNC_MATRIX[user.archetype][code];
              const score = SYNC_INSIGHTS[protocol]?.score || 0;
              return (
                <GlassCard key={code} style={{ padding: '1rem', textAlign: 'center', background: score < 40 ? 'rgba(255, 100, 100, 0.05)' : undefined }}>
                  <div style={{ fontSize: '0.45rem', opacity: 0.5, marginBottom: '4px' }}>{PROTOCOL_NAMES[protocol]?.split(' (')[0].toUpperCase()}</div>
                  <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>{code}</div>
                  <div style={{ fontSize: '0.6rem', opacity: 0.4 }}>{SHADOW_CODE_NAMES[code]}</div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>

      <footer style={{ marginTop: '3rem', opacity: 0.2, fontSize: '0.5rem', textAlign: 'center' }}>
        NEXUS TACTICAL MATRIX // GLOBAL SYNC ENGINE 2.0
      </footer>
    </div>
  );
};

export default MatrixScreen;
