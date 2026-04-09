import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Shield, Share2, ArrowLeft, CheckCircle2, Loader2, Zap, Target, AlertTriangle, Users } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

import { SHADOW_CODE_NAMES, getTacticalPartners } from '@/lib/shadowCode';

export const InductionResult = ({ code, onBack }: { code: string, onBack: () => void }) => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();
  
  const typeName = SHADOW_CODE_NAMES[code] || 'Агент';
  const partners = getTacticalPartners(code);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    
    try {
      const { error: agentError } = await supabase
        .from('agents')
        .update({ archetype: code })
        .eq('id', user.id);

      if (agentError) throw agentError;

      await supabase
        .from('induction_sessions')
        .update({ 
          is_completed: true,
          result_archetype: code 
        })
        .eq('agent_id', user.id)
        .eq('is_completed', false);
      
      setIsSaved(true);
      setTimeout(() => router.push('/'), 2000);
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const getProtocolIcon = (protocol: string) => {
    switch (protocol) {
      case 'PM': return <Zap className="text-gold" size={16} />;
      case 'Act': return <Zap className="text-blue-400" size={16} />;
      case 'Sup+': return <Target className="text-purple-400" size={16} />;
      case 'W': return <AlertTriangle className="text-red-500" size={16} />;
      default: return <Users size={16} />;
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '440px', padding: '1.5rem' }}>
      {/* Scanning Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative' }}>
        <div className="aura-pulse" style={{ 
          width: '120px', 
          height: '120px', 
          borderRadius: '50%', 
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          margin: '0 auto 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%)',
          position: 'relative',
          boxShadow: '0 0 30px rgba(255,215,0,0.05)'
        }}>
          {isSaved ? (
            <CheckCircle2 size={56} className="text-gold" />
          ) : (
            <Shield size={48} className="text-gold" style={{ filter: 'drop-shadow(0 0 15px rgba(212, 175, 55, 0.4))' }} />
          )}
        </div>

        <h1 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '4px', opacity: 0.6, marginBottom: '0.75rem', fontWeight: 700 }}>
          Verification Status: Confirmed
        </h1>
        <h2 className="text-gold" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-1px' }}>
          {typeName}
        </h2>
        <div style={{ fontSize: '1rem', opacity: 0.5, fontWeight: 600, color: 'var(--ios-silver)' }}>
          Human OS v1.0.26 // {code}
        </div>
      </div>

      {/* Main Dossier Card */}
      <GlassCard style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
          <Zap size={18} className="text-gold" />
          <h3 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Результат Индукции
          </h3>
        </div>
        <p style={{ fontSize: '1rem', lineHeight: '1.6', color: 'white', fontWeight: 400 }}>
          {isSaved 
            ? "Ваш Shadow Code успешно интегрирован. Все тактические системы синхронизированы с вашим профилем."
            : `Ваша нейронная архитектура идентифицирована как ${typeName}. Все протоколы взаимодействия Shadow Code разблокированы.`
          }
        </p>
      </GlassCard>

      {/* Synchronization Matrix */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.2rem', opacity: 0.7 }}>
          <Users size={16} />
          <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>
            Матрица Синхронизации
          </h3>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '1rem' 
        }}>
          {partners.map((p, i) => (
            <div key={i} className="glass" style={{ 
              padding: '1.2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ 
                  fontSize: '0.65rem', 
                  fontWeight: 900, 
                  padding: '2px 8px', 
                  borderRadius: '6px',
                  background: p.protocol === 'PM' ? 'var(--ios-gold)' : 'rgba(255,255,255,0.15)',
                  color: p.protocol === 'PM' ? 'black' : 'white'
                }}>
                  {p.protocol}
                </span>
                <span style={{ fontSize: '0.6rem', opacity: 0.5 }}>{p.protocolName}</span>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'white', marginBottom: '0.2rem' }}>{p.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--ios-silver)', opacity: 0.6 }}>{p.code}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Action Buttons */}
      {!isSaved ? (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button 
            variant="secondary" 
            onClick={onBack} 
            style={{ flex: 1, padding: '1.1rem' }} 
            disabled={isSaving}
          >
            <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> НАЗАД
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave} 
            style={{ flex: 2, padding: '1.1rem' }} 
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={18} style={{ marginRight: '0.5rem' }} /> ПРИНЯТЬ</>}
          </Button>
        </div>
      ) : (
        <Button 
          variant="primary" 
          onClick={() => router.push('/')}
          style={{ width: '100%', padding: '1.2rem' }}
        >
          <Zap size={18} style={{ marginRight: '0.5rem' }} /> ВЕРНУТЬСЯ В NEXUS
        </Button>
      )}
    </div>
  );
};
