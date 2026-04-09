'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Shield, ArrowRight, Check } from 'lucide-react';

const DILEMMAS = [
  {
    id: 'ei',
    title: 'Откуда вы берете энергию?',
    options: [
      { label: 'Мир и люди (Экстраверсия)', value: 'E', icon: '🌍' },
      { label: 'Тишина и мысли (Интроверсия)', value: 'I', icon: '🧘' }
    ]
  },
  {
    id: 'sn',
    title: 'Как вы собираете информацию?',
    options: [
      { label: 'Факты и детали (Сенсорика)', value: 'S', icon: '📊' },
      { label: 'Смыслы и интуиция (Интуиция)', value: 'N', icon: '✨' }
    ]
  },
  {
    id: 'tf',
    title: 'Как вы принимаете решения?',
    options: [
      { label: 'Логика и анализ (Логика)', value: 'T', icon: '🧠' },
      { label: 'Ценности и чувства (Этика)', value: 'F', icon: '❤️' }
    ]
  },
  {
    id: 'jp',
    title: 'Как вы организуете жизнь?',
    options: [
      { label: 'План и структура (Рациональность)', value: 'J', icon: '📅' },
      { label: 'Гибкость и поток (Иррациональность)', value: 'P', icon: '🌊' }
    ]
  }
];

export const QuickTest = ({ onComplete }: { onComplete: (code: string) => void }) => {
  const [step, setStep] = useState(0);
  const [results, setResults] = useState<string[]>([]);

  const handleSelect = (value: string) => {
    const newResults = [...results, value];
    setResults(newResults);
    
    if (step < DILEMMAS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(newResults.join(''));
    }
  };

  const currentDilemma = DILEMMAS[step];
  const progress = ((step + 1) / DILEMMAS.length) * 100;

  return (
    <div style={{ width: '100%', maxWidth: '400px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem', opacity: 0.6 }}>
          <span>Протокол Индукции</span>
          <span>Шаг {step + 1} из 4</span>
        </div>
        <div style={{ height: '2px', background: 'rgba(255,255,255,0.1)', width: '100%', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ 
            height: '100%', 
            background: 'var(--accent)', 
            width: `${progress}%`, 
            transition: 'width 0.4s ease' 
          }} />
        </div>
      </div>

      <GlassCard>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', textAlign: 'center' }}>{currentDilemma.title}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {currentDilemma.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className="glass"
              style={{
                padding: '1.5rem',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all 0.2s ease',
                background: 'rgba(255,255,255,0.03)',
                borderColor: 'rgba(255,255,255,0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{opt.icon}</span>
              <span style={{ fontWeight: 500 }}>{opt.label}</span>
              <ArrowRight size={16} style={{ marginLeft: 'auto', opacity: 0.3 }} />
            </button>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
