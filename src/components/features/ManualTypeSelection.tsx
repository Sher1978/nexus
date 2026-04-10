'use client';

import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { SHADOW_CODE_NAMES } from '@/lib/shadowCode';

interface ManualTypeSelectionProps {
  onSelect: (code: string) => void;
  onBack: () => void;
}

export const ManualTypeSelection: React.FC<ManualTypeSelectionProps> = ({ onSelect, onBack }) => {
  const codes = Object.keys(SHADOW_CODE_NAMES);

  return (
    <div style={{ width: '100%', maxWidth: '440px' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.4rem' }}>Manual Selection</h2>
        <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>Выберите вашу когнитивную архитектуру</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '0.8rem',
        marginBottom: '2rem'
       }}>
        {codes.map((code) => (
          <GlassCard
            key={code}
            onClick={() => onSelect(code)}
            style={{
              padding: '1rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.2rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--ios-gold)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--glass-border)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--ios-gold)' }}>{code}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.6, fontWeight: 700 }}>{SHADOW_CODE_NAMES[code]}</div>
          </GlassCard>
        ))}
      </div>

      <button
        onClick={onBack}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          color: 'white',
          opacity: 0.4,
          fontSize: '0.8rem',
          cursor: 'pointer',
          padding: '1rem',
          textDecoration: 'underline'
        }}
      >
        Вернуться к выбору метода
      </button>
    </div>
  );
};
