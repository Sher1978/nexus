'use client';

import React, { useState, useEffect, Suspense } from 'react';
import styles from '../page.module.css';
import { QRScanner } from '@/components/features/QRScanner';
import { SyncTabs, SyncTab } from '@/components/features/SyncTabs';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Shield, Zap, Target, ArrowLeft, RefreshCw, AlertTriangle, Users } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/features/AuthProvider';
import { supabase } from '@/lib/supabaseClient';
import { getProtocol, SHADOW_CODE_NAMES, PROTOCOL_NAMES, TYPE_QUADRA, QUADRA_DATA, QUADRA_COMPATIBILITY } from '@/lib/shadowCode';
import { SYNC_INSIGHTS } from '@/lib/mbtiSyncData';
import { useSearchParams } from 'next/navigation';
import { QuadraCompatibility } from '@/components/features/QuadraCompatibility';
import { motion, AnimatePresence } from 'framer-motion';

function SyncContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [partner, setPartner] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SyncTab>('business');
  const [showQuadraDossier, setShowQuadraDossier] = useState(false);

  // Load partner from URL if present (e.g. from QR scan redirect)
  useEffect(() => {
    const partnerId = searchParams.get('partnerId');
    if (partnerId && !partner) {
      handleScan(partnerId);
    }
  }, [searchParams, partner]);

  const handleScan = async (id: string) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      // Try to find by UUID first (primary key)
      const { data, error: sbError } = await supabase
        .from('agents')
        .select('*')
        .eq('id', id)
        .single();
      
      let finalData = data;

      // Fallback to searching by telegram_id if scan was a raw TG ID
      if (sbError || !data) {
        const { data: tgData } = await supabase
          .from('agents')
          .select('*')
          .eq('telegram_id', id)
          .single();
        finalData = tgData;
      }

      if (finalData) {
        if (!finalData.archetype) {
          setError('НЕЙРОННАЯ АРХИТЕКТУРА АГЕНТА НЕ ИНИЦИАЛИЗИРОВАНА');
        } else {
          setPartner(finalData);
        }
      } else {
        setError('АГЕНТ НЕ НАЙДЕН В БАЗЕ NEXUS');
      }
    } catch (err) {
      setError('ОШИБКА НЕЙРОННОЙ СВЯЗИ');
    } finally {
      setLoading(false);
    }
  };

  const protocol = (user?.archetype && partner?.archetype) ? getProtocol(user.archetype, partner.archetype) : null;
  const insights = protocol ? SYNC_INSIGHTS[protocol] : null;

  const userQuadra = user?.archetype ? TYPE_QUADRA[user.archetype] : null;
  const partnerQuadra = partner?.archetype ? TYPE_QUADRA[partner.archetype] : null;
  
  const getQuadraRelation = () => {
    if (!userQuadra || !partnerQuadra) return null;
    const pair1 = `${userQuadra}+${partnerQuadra}`;
    const pair2 = `${partnerQuadra}+${userQuadra}`;
    
    // Check for same quadra
    if (userQuadra === partnerQuadra) {
      return QUADRA_COMPATIBILITY.find(c => c.pair.includes('Внутри одной квадры'));
    }
    
    return QUADRA_COMPATIBILITY.find(c => c.pair === pair1 || c.pair === pair2);
  };

  const quadraRel = getQuadraRelation();
  const userQData = userQuadra ? QUADRA_DATA[userQuadra] : null;

  return (
    <div style={{ width: '100%', maxWidth: '440px' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', padding: '0 1rem' }}>
        <Link href="/">
          <div className="glass" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ArrowLeft size={20} className="text-gold" />
          </div>
        </Link>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '2px', opacity: 0.5, textTransform: 'uppercase' }}>Tactical Sync</span>
          <h1 className="text-gold" style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, letterSpacing: '-1px' }}>СИНХРОНИЗАЦИЯ</h1>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '15vh' }}>
          <div className="radar-pulse" style={{ width: '100px', height: '100px', borderRadius: '50%', border: '2px solid var(--ios-gold)', margin: '0 auto 2rem' }}></div>
          <p className="text-gold" style={{ fontWeight: 800, letterSpacing: '2px', fontSize: '0.7rem' }}>АНАЛИЗ НЕЙРОННОЙ СВЯЗИ...</p>
        </div>
      ) : !partner ? (
        <div style={{ textAlign: 'center', marginTop: '10vh', padding: '0 1rem' }}>
          <div className="radar-pulse" style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '50%', 
            border: '2px solid var(--ios-gold)', 
            margin: '0 auto 2.5rem',
            opacity: 0.3
          }}></div>
          
          {error && (
            <div style={{ color: '#ff4d4d', fontSize: '0.7rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'rgba(255,77,77,0.1)', padding: '1rem', borderRadius: '12px' }}>
              <AlertTriangle size={14} /> {error}
            </div>
          )}

          <p style={{ opacity: 0.6, marginBottom: '2rem', fontWeight: 500, letterSpacing: '0.5px', fontSize: '0.9rem' }}>
            ОЖИДАНИЕ ТАКТИЧЕСКОГО КОДА...
          </p>
          <div style={{ width: '100%' }}>
            <QRScanner onScan={handleScan} />
          </div>
        </div>
      ) : (
        <div style={{ padding: '0 1rem' }} className="fade-in">
          {/* Sync Bridge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
             <div className="glass" style={{ padding: '1rem', textAlign: 'center', flex: 1, borderBottom: `2px solid ${userQData?.color || 'var(--ios-gold)'}` }}>
                <div style={{ fontSize: '0.55rem', opacity: 0.5, marginBottom: '0.25rem' }}>ВЫ</div>
                <div style={{ fontWeight: 900, fontSize: '1.1rem', color: userQData?.color || 'var(--ios-gold)' }}>{user?.archetype}</div>
                {userQuadra && <div style={{ fontSize: '0.5rem', opacity: 0.5 }}>{QUADRA_DATA[userQuadra].name}</div>}
             </div>
             <div className="sync-connector" style={{ position: 'relative', width: '40px', display: 'flex', justifyContent: 'center' }}>
                <Zap size={20} className="text-gold" style={{ animation: 'pulse 2s infinite' }} />
             </div>
             <div className="glass" style={{ padding: '1rem', textAlign: 'center', flex: 1, borderBottom: `2px solid ${partnerQuadra ? QUADRA_DATA[partnerQuadra].color : 'var(--ios-silver)'}` }}>
                <div style={{ fontSize: '0.55rem', opacity: 0.5, marginBottom: '0.25rem' }}>ПАРТНЕР</div>
                <div style={{ fontWeight: 900, fontSize: '1.1rem', color: partnerQuadra ? QUADRA_DATA[partnerQuadra].color : 'var(--ios-silver)' }}>{partner?.archetype}</div>
                {partnerQuadra && <div style={{ fontSize: '0.5rem', opacity: 0.5 }}>{QUADRA_DATA[partnerQuadra].name}</div>}
             </div>
          </div>

          <SyncTabs activeTab={activeTab} onChange={setActiveTab} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <GlassCard 
              title={insights?.label || 'АНАЛИЗ СОВМЕСТИМОСТИ'}
              style={{ borderTop: `2px solid ${insights?.score && insights.score > 80 ? 'var(--ios-gold)' : 'rgba(255,255,255,0.1)'}` }}
            >
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div className="glass" style={{ padding: '6px 12px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--ios-gold)', letterSpacing: '1px' }}>
                  {partner.full_name?.split(' ')[0].toUpperCase() || 'AGENT'} UNIT
                </div>
                <div className="glass" style={{ padding: '6px 12px', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '1px', opacity: 0.7 }}>
                  {protocol && PROTOCOL_NAMES[protocol].split(' (')[0].toUpperCase()}
                </div>
              </div>
              <p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: '1.6', color: 'var(--ios-silver)', minHeight: '80px' }}>
                {activeTab === 'business' && insights?.business}
                {activeTab === 'friendship' && insights?.friendship}
                {activeTab === 'personal' && insights?.personal}
              </p>
            </GlassCard>

            {/* Quadra Resonance Section */}
            {quadraRel && (
              <GlassCard 
                title="КВАДРОВЫЙ РЕЗОНАНС" 
                style={{ borderLeft: `4px solid ${userQData?.color || 'var(--ios-gold)'}` }}
              >
                 <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, opacity: 0.5, textTransform: 'uppercase', marginBottom: '4px' }}>УРОВЕНЬ</div>
                    <div style={{ fontWeight: 900, color: 'var(--ios-gold)', fontSize: '1.2rem' }}>{quadraRel.level.toUpperCase()}</div>
                 </div>
                 
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                       <div style={{ fontSize: '0.55rem', fontWeight: 800, opacity: 0.4, marginBottom: '4px' }}>СИЛЬНЫЕ СТОРОНЫ</div>
                       <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{quadraRel.strengths}</div>
                    </div>
                    <div>
                       <div style={{ fontSize: '0.55rem', fontWeight: 800, opacity: 0.4, marginBottom: '4px' }}>РЕКОМЕНДАЦИИ</div>
                       <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{quadraRel.advice}</div>
                    </div>
                 </div>

                 <Button 
                   variant="glass" 
                   onClick={() => setShowQuadraDossier(true)}
                   style={{ width: '100%', fontSize: '0.7rem', gap: '0.5rem', fontWeight: 800 }}
                 >
                   ПОЛНЫЙ КВАДРОВЫЙ ДОСЬЕ <Users size={14} />
                 </Button>
              </GlassCard>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <GlassCard style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 800, opacity: 0.5, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '1px' }}>ЭНЕРГООБМЕН</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--ios-gold)' }}>
                  {insights?.score || '--'}%
                </div>
              </GlassCard>
              <GlassCard style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 800, opacity: 0.5, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '1px' }}>РЕЗОНАНС</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'white' }}>
                  {insights ? Math.floor(insights.score * 0.9 + 5) : '--'}%
                </div>
              </GlassCard>
            </div>

            {insights?.protocols && (
              <div style={{ marginTop: '0.5rem' }}>
                <h4 style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.4, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>ТАКТИЧЕСКИЕ ПРОТОКОЛЫ</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {insights.protocols.map((p, i) => (
                    <div key={i} className="glass" style={{ padding: '1.25rem', fontSize: '0.85rem', color: 'var(--ios-silver)', borderLeft: i === 0 ? '3px solid var(--ios-gold)' : '1px solid rgba(255,255,255,0.1)' }}>
                      <span style={{ color: 'var(--ios-gold)', fontWeight: 800, marginRight: '0.5rem' }}>0{i + 1}</span> {p}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button variant="glass" style={{ marginTop: '2rem', width: '100%', opacity: 0.6, gap: '0.75rem' }} onClick={() => setPartner(null)}>
              ПРЕРВАТЬ СЕАНС <RefreshCw size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Quadra Dossier Overlay */}
      <AnimatePresence>
        {showQuadraDossier && userQuadra && (
          <QuadraCompatibility 
            userQuadra={userQuadra} 
            onClose={() => setShowQuadraDossier(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SyncPage() {
  return (
    <main className={styles.main} style={{ paddingBottom: '2rem' }}>
      <Suspense fallback={<div>Loading...</div>}>
        <SyncContent />
      </Suspense>
    </main>
  );
}
