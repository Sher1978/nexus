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
    <div style={{ width: '100%', maxWidth: '440px', padding: '1rem' }}>
      {/* Scanning Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative' }}>
        <div className="aura-pulse" style={{ 
          width: '140px', 
          height: '140px', 
          borderRadius: '50%', 
          border: '1px solid rgba(212, 175, 55, 0.3)', 
          margin: '0 auto 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
          position: 'relative'
        }}>
          <div className="scanning" style={{
            position: 'absolute',
            width: '100%',
            height: '2px',
            background: 'var(--gold)',
            zIndex: 10
          }} />
          {isSaved ? (
            <CheckCircle2 size={64} className="text-gold" />
          ) : (
            <Shield size={56} className="text-gold" style={{ filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.5))' }} />
          )}
        </div>

        <h1 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '4px', opacity: 0.5, marginBottom: '0.5rem' }}>
          Verification Status: Confirmed
        </h1>
        <h2 className="text-gold" style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '0.5rem', lineHeight: 1 }}>
          {typeName}
        </h2>
        <div style={{ fontSize: '1.1rem', opacity: 0.4, fontWeight: 600 }}>
          Human OS v1.0.26 // Code: {code}
        </div>
      </div>

      {/* Main Dossier Card */}
      <GlassCard style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ width: '4px', height: '24px', background: 'var(--gold)', borderRadius: '2px' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Результат Индукции
          </h3>
        </div>
        <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: 'rgba(255,255,255,0.7)' }}>
          {isSaved 
            ? "Ваш Shadow Code успешно интегрирован. Все тактические системы синхронизированы с вашим профилем."
            : `Ваша нейронная архитектура идентифицирована как ${typeName}. Все протоколы взаимодействия Shadow Code разблокированы.`
          }
        </p>
      </GlassCard>

      {/* Tactical Alliances / Sync Matrix */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', opacity: 0.8 }}>
          <Users size={20} className="text-gold" />
          <h3 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
            Synchronization Matrix
          </h3>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {partners.map((p) => (
            <div key={p.code} style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${p.protocol === 'W' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '16px',
              padding: '1rem',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {p.protocol === 'PM' && (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at top right, rgba(212, 175, 55, 0.1) 0%, transparent 50%)', pointerEvents: 'none' }} />
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                {getProtocolIcon(p.protocol)}
                <span style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.6 }}>{p.protocol}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: p.protocol === 'W' ? '#f87171' : '#fff' }}>
                {p.name}
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.4 }}>{p.code}</div>
            </div>
          ))}
        </div>
      </div>

      {!isSaved ? (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="secondary" onClick={onBack} style={{ flex: 1 }} disabled={isSaving}>
            <ArrowLeft size={18} /> BACK
          </Button>
          <Button variant="primary" onClick={handleSave} style={{ flex: 2 }} disabled={isSaving}>
            {isSaving ? <Loader2 className="animate-spin" /> : "FINALIZE DOSSIER"} <CheckCircle2 size={18} />
          </Button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <div className="text-gold" style={{ fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
            Initializing Core Systems...
          </div>
        </div>
      )}
    </div>
  );
};
