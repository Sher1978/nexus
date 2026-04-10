'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { QRScanner } from '@/components/features/QRScanner';
import { SyncTabs, SyncTab } from '@/components/features/SyncTabs';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Zap, RefreshCw, AlertTriangle, Users } from 'lucide-react';
import { useAuth } from '@/components/features/AuthProvider';
import { supabase } from '@/lib/supabaseClient';
import { getProtocol, SHADOW_CODE_NAMES, PROTOCOL_NAMES, TYPE_QUADRA, QUADRA_DATA, QUADRA_COMPATIBILITY } from '@/lib/shadowCode';
import { SYNC_INSIGHTS } from '@/lib/mbtiSyncData';
import { useSearchParams, useRouter } from 'next/navigation';
import { QuadraCompatibility } from '@/components/features/QuadraCompatibility';
import { AnimatePresence } from 'framer-motion';
import TopNav from '@/components/ui/TopNav';

function SyncContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [partner, setPartner] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SyncTab>('business');
  const [showQuadraDossier, setShowQuadraDossier] = useState(false);

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
      const { data, error: sbError } = await supabase
        .from('agents')
        .select('*')
        .eq('id', id)
        .single();
      
      let finalData = data;

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
          setError('NEURAL ARCHITECTURE NOT INITIALIZED');
        } else {
          setPartner(finalData);
        }
      } else {
        setError('AGENT NOT FOUND IN NEXUS DATABASE');
      }
    } catch (err) {
      setError('CONNECTION FAILURE');
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
    
    if (userQuadra === partnerQuadra) {
      return QUADRA_COMPATIBILITY.find(c => c.pair.includes('Внутри одной квадры'));
    }
    
    return QUADRA_COMPATIBILITY.find(c => c.pair === pair1 || c.pair === pair2);
  };

  const quadraRel = getQuadraRelation();
  const userQData = userQuadra ? QUADRA_DATA[userQuadra] : null;

  const handleBack = () => {
    if (partner) setPartner(null);
    else router.push('/');
  };

  return (
    <div className="w-full max-w-[440px] px-4">
      <TopNav 
        title={partner ? "SYNC ANALYSIS" : "SCAN AGENT"} 
        showBack={true} 
        onBack={handleBack} 
      />
      
      <div className="pt-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center pt-24">
            <div className="w-20 h-20 rounded-full border-2 border-accent border-t-transparent animate-spin mb-6" />
            <p className="text-[10px] font-black tracking-[0.2em] text-accent uppercase">Analyzing Neural Bridge...</p>
          </div>
        ) : !partner ? (
          <div className="flex flex-col items-center">
             <div className="w-32 h-32 rounded-full border border-accent/20 flex items-center justify-center mb-10 relative">
                <div className="absolute inset-0 border border-accent/10 rounded-full animate-ping" />
                <Zap size={40} className="text-accent/40" />
             </div>
             
             {error && (
               <div className="w-full bg-red-500/10 border border-red-500/20 p-4 rounded-xl mb-8 flex items-center gap-3">
                 <AlertTriangle size={18} className="text-red-500 shrink-0" />
                 <span className="text-[10px] font-black text-red-500 uppercase leading-tight">{error}</span>
               </div>
             )}

             <p className="text-sm text-white/40 font-bold mb-8 uppercase tracking-widest text-center">
               Waiting for Tactical Code Signature...
             </p>
             <div className="w-full">
               <QRScanner onScan={handleScan} />
             </div>
          </div>
        ) : (
          <div className="fade-in pb-24">
            <div className="flex items-center justify-between gap-4 mb-8">
               <div className="flex-1 glass p-4 text-center border-b-2" style={{ borderBottomColor: userQData?.color || 'var(--accent)' }}>
                  <div className="text-[10px] font-black opacity-30 mb-1">YOU</div>
                  <div className="text-lg font-black tracking-tighter" style={{ color: userQData?.color || 'var(--accent)' }}>{user?.archetype}</div>
                  <div className="text-[8px] font-bold opacity-30 uppercase tracking-widest">{userQuadra && QUADRA_DATA[userQuadra].name}</div>
               </div>
               <div className="shrink-0">
                  <Zap size={20} className="text-accent animate-pulse" />
               </div>
               <div className="flex-1 glass p-4 text-center border-b-2" style={{ borderBottomColor: partnerQuadra ? QUADRA_DATA[partnerQuadra].color : 'var(--ios-silver)' }}>
                  <div className="text-[10px] font-black opacity-30 mb-1">AGENT</div>
                  <div className="text-lg font-black tracking-tighter" style={{ color: partnerQuadra ? QUADRA_DATA[partnerQuadra].color : 'var(--ios-silver)' }}>{partner?.archetype}</div>
                  <div className="text-[8px] font-bold opacity-30 uppercase tracking-widest">{partnerQuadra && QUADRA_DATA[partnerQuadra].name}</div>
               </div>
            </div>

            <SyncTabs activeTab={activeTab} onChange={setActiveTab} />
            
            <div className="flex flex-col gap-5 mt-6">
              <GlassCard className="p-0 border-t-2 border-t-accent overflow-hidden">
                <div className="p-6">
                  <div className="flex gap-2 mb-4">
                    <div className="glass px-3 py-1 text-[10px] font-black text-accent uppercase tracking-widest">
                      {partner.full_name?.split(' ')[0] || 'AGENT'}
                    </div>
                    <div className="glass px-3 py-1 text-[10px] font-black uppercase tracking-widest opacity-40">
                      {protocol && PROTOCOL_NAMES[protocol].split(' (')[0]}
                    </div>
                  </div>
                  <h4 className="text-xl font-black mb-3 italic tracking-tight uppercase">{insights?.label || 'Compatibility Analysis'}</h4>
                  <p className="text-sm text-white/70 leading-relaxed font-medium">
                    {activeTab === 'business' && insights?.business}
                    {activeTab === 'friendship' && insights?.friendship}
                    {activeTab === 'personal' && insights?.personal}
                  </p>
                </div>
              </GlassCard>

              {quadraRel && (
                <GlassCard className="p-6 border-l-4" style={{ borderLeftColor: userQData?.color || 'var(--accent)' }}>
                   <div className="mb-4">
                      <div className="text-[8px] font-black opacity-30 uppercase tracking-widest mb-1">RESONANCE LEVEL</div>
                      <div className="text-xl font-black text-accent uppercase italic">{quadraRel.level}</div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                         <div className="text-[8px] font-black opacity-30 uppercase tracking-[0.2em] mb-2">ADVANTAGES</div>
                         <div className="text-xs text-white/70 leading-normal">{quadraRel.strengths}</div>
                      </div>
                      <div>
                         <div className="text-[8px] font-black opacity-30 uppercase tracking-[0.2em] mb-2">RECOMMS</div>
                         <div className="text-xs text-white/70 leading-normal">{quadraRel.advice}</div>
                      </div>
                   </div>

                   <Button 
                     variant="glass" 
                     onClick={() => setShowQuadraDossier(true)}
                     className="w-full py-4 font-black text-[10px] tracking-widest uppercase gap-2"
                   >
                     QUADRA DOSSIER <Users size={14} />
                   </Button>
                </GlassCard>
              )}

              <div className="grid grid-cols-2 gap-4">
                <GlassCard className="p-6 text-center">
                  <div className="text-[8px] font-black opacity-30 uppercase tracking-widest mb-2">ENERGY FLOW</div>
                  <div className="text-3xl font-black text-accent tracking-tighter italic">
                    {insights?.score || '--'}%
                  </div>
                </GlassCard>
                <GlassCard className="p-6 text-center">
                  <div className="text-[8px] font-black opacity-30 uppercase tracking-widest mb-2">RESONANCE</div>
                  <div className="text-3xl font-black text-white tracking-tighter italic">
                    {insights ? Math.floor(insights.score * 0.9 + 5) : '--'}%
                  </div>
                </GlassCard>
              </div>

              {insights?.protocols && (
                <div className="mt-4">
                  <h4 className="text-[10px] font-black opacity-30 uppercase tracking-[0.3em] mb-4">Tactical Protocols</h4>
                  <div className="flex flex-col gap-3">
                    {insights.protocols.map((p, i) => (
                      <div key={i} className={`glass p-5 text-sm font-medium text-white/80 border-l-2 ${i === 0 ? 'border-l-accent' : 'border-l-white/10'}`}>
                        <span className="text-accent font-black mr-2 italic">0{i + 1}</span> {p}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button variant="glass" className="mt-8 py-5 flex items-center justify-center gap-3 opacity-50 hover:opacity-100 font-black text-xs tracking-widest uppercase" onClick={() => setPartner(null)}>
                TERMINATE SESSION <RefreshCw size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>

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
    <main className="flex flex-col items-center min-h-screen bg-black">
      <Suspense fallback={<div className="pt-24 text-accent font-black">INITIALIZING...</div>}>
        <SyncContent />
      </Suspense>
    </main>
  );
}
