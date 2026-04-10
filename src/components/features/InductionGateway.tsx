'use client';

import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Zap, Brain, Shield, ArrowRight, Scan } from 'lucide-react';

interface Method {
  id: 'MANUAL' | 'TEST' | 'SCAN';
  title: string;
  description: string;
  icon: React.ReactNode;
  premium?: boolean;
}

interface InductionGatewayProps {
  onSelect: (id: Method['id']) => void;
}

export const InductionGateway: React.FC<InductionGatewayProps> = ({ onSelect }) => {
  const methods: Method[] = [
    {
      id: 'SCAN',
      title: 'Neural AI Scan',
      description: 'Глубинное интервью с ИИ для точного определения вашей Human OS.',
      icon: <Scan className="text-gold" size={24} />,
      premium: true
    },
    {
      id: 'TEST',
      title: 'Pattern Test',
      description: 'Быстрый диагностический тест на основе когнитивных дилемм.',
      icon: <Zap size={24} style={{ color: 'var(--ios-gold)', opacity: 0.8 }} />
    },
    {
      id: 'MANUAL',
      title: 'Manual Protocol',
      description: 'Мгновенная активация для тех, кто уже знает свой системный код.',
      icon: <Shield size={24} style={{ opacity: 0.6 }} />
    }
  ];

  return (
    <div style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-1px' }}>
          Инициация Профиля
        </h1>
        <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>
          Выберите метод определения вашей архитектуры личности
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {methods.map((method) => (
          <GlassCard
            key={method.id}
            onClick={() => onSelect(method.id)}
            style={{
              padding: '1.5rem',
              cursor: 'pointer',
              border: method.premium ? '1px solid var(--ios-gold)' : undefined,
              position: 'relative',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {method.premium && (
              <div style={{ 
                position: 'absolute', 
                top: '12px', 
                right: '12px', 
                fontSize: '0.6rem', 
                fontWeight: 900, 
                color: 'var(--ios-gold)',
                letterSpacing: '1px'
              }}>
                RECOMMENDED
              </div>
            )}
            <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
              <div style={{ 
                padding: '0.8rem', 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {method.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.3rem', color: method.premium ? 'var(--ios-gold)' : 'white' }}>
                  {method.title}
                </h3>
                <p style={{ fontSize: '0.8rem', opacity: 0.5, lineHeight: 1.4 }}>
                  {method.description}
                </p>
              </div>
              <ArrowRight size={20} style={{ alignSelf: 'center', opacity: 0.2 }} />
            </div>
          </GlassCard>
        ))}
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center', opacity: 0.3, fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <Shield size={12} /> SECURE PROTOCOL v2.6.4
      </div>
    </div>
  );
};
