'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { X, Users, ChevronDown, ChevronUp, Briefcase, Heart, Star, Target, Zap } from 'lucide-react';
import { QUADRA_DATA, QUADRA_COMPATIBILITY, QuadraType } from '@/lib/shadowCode';

interface QuadraCompatibilityProps {
  userQuadra: QuadraType;
  onClose: () => void;
}

export const QuadraCompatibility: React.FC<QuadraCompatibilityProps> = ({ userQuadra, onClose }) => {
  const [expandedSection, setExpandedSection] = useState<QuadraType | 'table' | null>(null);

  const quadras: QuadraType[] = ['Alpha', 'Beta', 'Gamma', 'Delta'];

  const toggleSection = (id: QuadraType | 'table') => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        background: 'rgba(0,0,0,0.95)', 
        backdropFilter: 'blur(20px)',
        zIndex: 5000,
        padding: '1.5rem',
        overflowY: 'auto',
        color: 'white'
      }}
    >
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.5, letterSpacing: '2px', textTransform: 'uppercase' }}>
              Intelligence Dossier
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-1px' }}>
              КВАДРОВЫЕ ПРОТОКОЛЫ
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: 'white' }}>
            <X size={20} />
          </button>
        </div>

        {/* COMPATIBILITY TABLE (COLLAPSIBLE) */}
        <GlassCard style={{ marginBottom: '1.5rem', padding: '0' }}>
          <div 
            onClick={() => toggleSection('table')}
            style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Users size={18} className="text-gold" />
              <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>МАТРИЦА СОВМЕСТИМОСТИ КВАДР</div>
            </div>
            {expandedSection === 'table' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          
          <AnimatePresence>
            {expandedSection === 'table' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ padding: '0 1.5rem 1.5rem' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left', padding: '0.5rem', opacity: 0.5 }}>ВЗАИМОДЕЙСТВИЕ</th>
                          <th style={{ textAlign: 'left', padding: '0.5rem', opacity: 0.5 }}>УРОВЕНЬ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {QUADRA_COMPATIBILITY.map((row, idx) => (
                          <tr key={idx} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>{row.pair}</td>
                            <td style={{ padding: '1rem 0.5rem' }}>
                               <div style={{ 
                                 display: 'inline-block', 
                                 padding: '2px 8px', 
                                 borderRadius: '4px', 
                                 background: row.level.includes('Высокий') || row.level.includes('Идеальный') ? 'rgba(0,255,0,0.1)' : 'rgba(255,255,255,0.1)',
                                 color: row.level.includes('Высокий') || row.level.includes('Идеальный') ? '#4ade80' : 'white'
                               }}>
                                 {row.level}
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {QUADRA_COMPATIBILITY.map((row, idx) => (
                      <div key={idx} className="glass" style={{ padding: '1rem' }}>
                         <div style={{ fontWeight: 900, color: 'var(--ios-gold)', marginBottom: '0.5rem', fontSize: '0.8rem' }}>{row.pair.toUpperCase()}</div>
                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.75rem' }}>
                            <div>
                               <div style={{ opacity: 0.4, fontWeight: 800, marginBottom: '0.2rem' }}>СИЛЬНЫЕ СТОРОНЫ</div>
                               <div style={{ opacity: 0.8 }}>{row.strengths}</div>
                            </div>
                            <div>
                               <div style={{ opacity: 0.4, fontWeight: 800, marginBottom: '0.2rem' }}>РЕКОМЕНДАЦИИ</div>
                               <div style={{ opacity: 0.8 }}>{row.advice}</div>
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>

        {/* INDIVIDUAL QUADRA DOSSIERS */}
        <h3 style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.4, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem', marginTop: '2rem' }}>
          ОПИСАНИЯ КВАДР
        </h3>

        {quadras.map((quadraId) => {
          const info = QUADRA_DATA[quadraId];
          const isUserQuadra = userQuadra === quadraId;
          
          return (
            <GlassCard key={quadraId} style={{ 
              marginBottom: '1rem', 
              padding: '0', 
              borderLeft: isUserQuadra ? `4px solid ${info.color}` : 'none'
            }}>
              <div 
                onClick={() => toggleSection(quadraId)}
                style={{ padding: '1.25rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    background: info.color,
                    boxShadow: `0 0 10px ${info.color}`
                  }} />
                  <div>
                    <div style={{ fontWeight: 900, fontSize: '1rem' }}>{info.name}</div>
                    <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>{info.values}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {isUserQuadra && (
                    <div style={{ fontSize: '0.5rem', background: info.color, color: 'black', padding: '2px 6px', borderRadius: '4px', fontWeight: 900 }}>YOU</div>
                  )}
                  {expandedSection === quadraId ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              <AnimatePresence>
                {expandedSection === quadraId && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '0 1.25rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <p style={{ fontSize: '0.85rem', opacity: 0.7, lineHeight: 1.6, marginTop: '1rem' }}>
                        {info.description}
                      </p>

                      <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="glass" style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: info.color }}>
                            <Star size={14} /> <span style={{ fontSize: '0.7rem', fontWeight: 900 }}>СИЛЬНЫЕ СТОРОНЫ</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{info.strengths}</div>
                        </div>
                        <div className="glass" style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#ff4d4d' }}>
                            <Target size={14} /> <span style={{ fontSize: '0.7rem', fontWeight: 900 }}>СЛАБЫЕ СТОРОНЫ</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{info.shadows}</div>
                        </div>
                      </div>

                      <div style={{ marginTop: '1rem' }} className="glass">
                        <div style={{ display: 'flex', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                           <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                              <Briefcase size={14} className="text-gold" />
                              <span style={{ fontSize: '0.65rem', fontWeight: 900 }}>БИЗНЕС-СОВЕТЫ</span>
                           </div>
                           <div style={{ flex: 1, paddingLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Heart size={14} style={{ color: '#ff4d4d' }} />
                              <span style={{ fontSize: '0.65rem', fontWeight: 900 }}>ЛИЧНЫЕ СОВЕТЫ</span>
                           </div>
                        </div>
                        <div style={{ display: 'flex', padding: '1rem' }}>
                           <div style={{ flex: 1, fontSize: '0.75rem', opacity: 0.8, paddingRight: '1rem', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                              {info.business}
                           </div>
                           <div style={{ flex: 1, fontSize: '0.75rem', opacity: 0.8, paddingLeft: '1rem' }}>
                              {info.life}
                           </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          );
        })}
      </div>
    </motion.div>
  );
};
