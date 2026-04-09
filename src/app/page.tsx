'use client';

import styles from "./page.module.css";
import { useAuth } from "@/components/features/AuthProvider";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Shield, Zap, Target } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { tgUser, loading, user } = useAuth();

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1 className="text-gold" style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-2px' }}>
          NEXUS
        </h1>
        <p style={{ color: 'var(--secondary-foreground)', marginBottom: '2.5rem', fontSize: '1.1rem', fontWeight: 300 }}>
          Социальная архитектура нового поколения
        </p>

        <div className={styles.authSection}>
          {loading ? (
            <div className="radar-pulse" style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              border: '2px solid var(--accent)', 
              margin: '2rem auto' 
            }}></div>
          ) : tgUser ? (
            <div style={{ width: '100%', maxWidth: '320px', margin: '0 auto' }}>
              <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                Добро пожаловать, <span className="text-gold">@{tgUser.username || tgUser.first_name}</span>
              </p>
              {!user ? (
                <Link href="/induction" style={{ width: '100%' }}>
                  <Button variant="primary">
                    Начать Индукцию <Zap size={18} />
                  </Button>
                </Link>
              ) : (
                <Button variant="glass">
                  Открыть Досье <Shield size={18} />
                </Button>
              )}
            </div>
          ) : (
            <div style={{ width: '100%', maxWidth: '320px', margin: '0 auto' }}>
              <p style={{ color: 'rgba(255, 77, 77, 0.8)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Вход только для авторизованных Агентов
              </p>
              <Button variant="primary">
                Войти через Telegram
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.grid}>
        <GlassCard 
          title="Индукция" 
          description="Мгновенное определение вашего Human OS кода."
        >
          <Target className="text-gold" style={{ marginTop: '1rem' }} />
        </GlassCard>
        
        <GlassCard 
          title="Синхрон" 
          description="Анализ совместимости с эффективностью 32х."
        >
          <Zap className="text-gold" style={{ marginTop: '1rem' }} />
        </GlassCard>
      </div>

      <footer style={{ marginTop: '4rem', opacity: 0.3, fontSize: '0.7rem' }}>
        SHADOW CODE SYSTEM // VER 1.1 // INDUCTION PROTOCOL
      </footer>
    </main>
  );
}
