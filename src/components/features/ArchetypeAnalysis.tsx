'use client';

import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { ARCHETYPE_ANALYSIS } from '@/lib/mbtiData';
import { Zap, Moon, Compass, ShieldAlert } from 'lucide-react';

interface ArchetypeAnalysisProps {
  archetype: string;
}

export const ArchetypeAnalysis: React.FC<ArchetypeAnalysisProps> = ({ archetype }) => {
  const data = ARCHETYPE_ANALYSIS[archetype];

  if (!data) return (
    <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>
      АНАЛИЗ ДАННОГО ТИПА В ПРОЦЕССЕ ЗАГРУЗКИ...
    </div>
  );

  return (
    <div className="archetype-analysis-container fade-in">
      <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Compass size={14} className="text-gold" />
          <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.6 }}>
            Core Directive
          </span>
        </div>
        <p style={{ fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.4, color: 'var(--ios-silver)' }}>
          {data.drive}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Superpowers */}
        <GlassCard style={{ borderLeft: '3px solid var(--ios-gold)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Zap className="text-gold" size={20} />
            <h3 style={{ fontSize: '0.8rem', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase' }}>
              ТАКТИЧЕСКИЕ СУПЕРСИЛЫ
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.superpowers.map((power, i) => {
              const [label, desc] = power.split(': ');
              return (
                <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--ios-gold)', marginBottom: '0.2rem' }}>
                    {label.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7, lineHeight: 1.4 }}>
                    {desc}
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Shadows */}
        <GlassCard style={{ borderLeft: '3px solid rgba(255,255,255,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Moon style={{ opacity: 0.5 }} size={20} />
            <h3 style={{ fontSize: '0.8rem', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.7 }}>
              ТЕНЕВЫЕ СТОРОНЫ // ВЕКТОРЫ РИСКА
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.shadows.map((shadow, i) => {
              const [label, desc] = shadow.split(': ');
              return (
                <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.5, marginBottom: '0.2rem' }}>
                    {label.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.6, lineHeight: 1.4 }}>
                    {desc}
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          borderRadius: '12px', 
          background: 'rgba(255, 77, 77, 0.05)', 
          border: '1px solid rgba(255, 77, 77, 0.1)', 
          display: 'flex', 
          gap: '0.75rem', 
          alignItems: 'center' 
        }}>
          <ShieldAlert size={18} style={{ color: 'rgba(255, 255, 255, 0.3)' }} />
          <span style={{ fontSize: '0.7rem', opacity: 0.4, fontStyle: 'italic' }}>
            Данные верифицированы по протоколу Stirlitz-Nexus v2.0
          </span>
        </div>
      </div>
    </div>
  );
};
