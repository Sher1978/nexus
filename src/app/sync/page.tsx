'use client';

import React, { useState } from 'react';
import styles from '../page.module.css';
import { QRScanner } from '@/components/features/QRScanner';
import { SyncTabs, SyncTab } from '@/components/features/SyncTabs';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Shield, Zap, Target, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SyncPage() {
  const [targetId, setTargetId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SyncTab>('business');

  const handleScan = (id: string) => {
    setTargetId(id);
  };

  return (
    <main className={styles.main}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/">
            <Button variant="ghost" style={{ padding: '0.5rem', width: 'auto' }}>
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <h1 className="text-gold" style={{ fontSize: '1.5rem', margin: 0 }}>Синхрон</h1>
        </div>

        {!targetId ? (
          <div style={{ textAlign: 'center', marginTop: '20vh' }}>
            <div className="radar-pulse" style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              border: '2px solid var(--accent)', 
              margin: '0 auto 2rem',
              opacity: 0.5
            }}></div>
            <p style={{ opacity: 0.6, marginBottom: '2rem' }}>
              Готовность к сканированию...
            </p>
            <QRScanner onScan={handleScan} />
          </div>
        ) : (
          <div>
            <SyncTabs activeTab={activeTab} onChange={setActiveTab} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <GlassCard title="Human OS (Совместимость)">
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span className="glass" style={{ padding: '4px 8px', fontSize: '0.7rem', color: 'var(--accent)' }}>ALPHA UNIT</span>
                  <span className="glass" style={{ padding: '4px 8px', fontSize: '0.7rem' }}>ДУАЛЬНОСТЬ</span>
                </div>
                <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: '1.5' }}>
                  {activeTab === 'business' && "Высокая продуктивность. Ваши функции дополняют друг друга в принятии решений."}
                  {activeTab === 'friendship' && "Полный резонанс. Быстрое восстановление энергии при общении."}
                  {activeTab === 'personal' && "Идеальный мэтч. Вы закрываете 'тени' друг друга."}
                </p>
              </GlassCard>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <GlassCard title="HD" style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>Энергетика</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent)' }}>84%</div>
                </GlassCard>
                <GlassCard title="Astro" style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>Синхрон</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent)' }}>92%</div>
                </GlassCard>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '1rem', textTransform: 'uppercase' }}>Протоколы Связи</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li className="glass" style={{ padding: '1rem', fontSize: '0.85rem' }}>
                    1. Не используйте прямое давление при обсуждении задач.
                  </li>
                  <li className="glass" style={{ padding: '1rem', fontSize: '0.85rem' }}>
                    2. Апеллируйте к логике и сухим фактам.
                  </li>
                </ul>
              </div>

              <Button variant="primary" style={{ marginTop: '2rem' }} onClick={() => setTargetId(null)}>
                Завершить Сеанс
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
