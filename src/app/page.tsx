'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Scan, Shield, Users, Globe } from "lucide-react";
import { SHADOW_CODE_NAMES, TYPE_QUADRA, QUADRA_DATA } from "@/lib/shadowCode";
import { useAuth } from "@/components/features/AuthProvider";
import { getTelegramWebApp } from "@/lib/telegram";
import { TabType, BottomNav } from "@/components/ui/BottomNav";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import ProfileScreen from "@/components/features/ProfileScreen";
import MatrixScreen from "@/components/features/MatrixScreen";
import styles from "./page.module.css";

export default function Home() {
  const { tgUser, loading, user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('nexus');
  const router = useRouter();

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const userQuadra = user?.archetype ? TYPE_QUADRA[user.archetype] : null;
  const quadraInfo = userQuadra ? QUADRA_DATA[userQuadra] : null;

  const handleScanClick = () => {
    const webApp = getTelegramWebApp();
    const supportsScanner = webApp && webApp.showScanQrPopup && (!webApp.isVersionAtLeast || webApp.isVersionAtLeast('6.4'));
    
    if (supportsScanner) {
      webApp.showScanQrPopup({ text: 'Наведите камеру на код другого Агента' }, (data: string) => {
        if (data.startsWith('nexus:id:')) {
          const partnerId = data.replace('nexus:id:', '');
          router.push(`/sync?partnerId=${partnerId}`);
        } else {
          router.push(`/sync?partnerId=${data}`);
        }
        webApp.closeScanQrPopup();
        return true;
      });
    } else {
      const mockId = prompt('DEBUG/LEGACY: Введите ID агента (или просканируйте камерой):');
      if (mockId) router.push(`/sync?partnerId=${mockId}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 120 } as any }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileScreen onScanClick={handleScanClick} />;
      case 'matrix':
        return <MatrixScreen />;
      case 'nexus':
      default:
        return (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            style={{ width: '100%', maxWidth: '440px' }}
          >
            {/* Holographic Grid Fallback */}
            <div className="holographic-grid" style={{ 
              '--ring-color': quadraInfo?.color || 'var(--ios-gold)'
            } as any} />

            <motion.div variants={itemVariants} className={styles.hero} style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative' }}>
              {/* NEXUS CORE ANIMATION */}
              <div style={{ position: 'relative', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  style={{ 
                    position: 'absolute', 
                    width: '120px', 
                    height: '120px', 
                    border: '1px dashed var(--ios-gold)', 
                    borderRadius: '50%',
                    opacity: 0.2
                  }} 
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  style={{ 
                    position: 'absolute', 
                    width: '90px', 
                    height: '90px', 
                    border: '1px solid var(--ios-gold)', 
                    borderRadius: '50%',
                    opacity: 0.1
                  }} 
                />
                <motion.div 
                   animate={{ scale: [1, 1.1, 1] }}
                   transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                   style={{ 
                     width: '60px', 
                     height: '60px', 
                     background: 'radial-gradient(circle, var(--ios-gold) 0%, transparent 70%)',
                     borderRadius: '50%',
                     filter: 'blur(10px)',
                     opacity: 0.5
                   }}
                />
                <Cpu size={32} className="text-gold" style={{ position: 'absolute', zIndex: 10 }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '60px' }}
                  transition={{ duration: 0.8 }}
                  style={{ height: '1px', background: 'var(--ios-gold)', opacity: 0.5, marginBottom: '1rem' }}
                />
                <h1 className="text-gold" style={{ fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-4px', lineHeight: 0.8, marginBottom: '0.5rem', filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.3))' }}>
                  NEXUS
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.6 }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase' }}>
                    System.Status: <span className="text-gold">Operational</span>
                  </span>
                </div>
              </div>
            </motion.div>

            <div className={styles.grid} style={{ gridTemplateColumns: '1fr', gap: '1.25rem' }}>
              <AnimatePresence mode="wait">
                {!user ? (
                  <motion.div key="induction" variants={itemVariants}>
                    <GlassCard 
                      title="Индукция" 
                      description="Запуск протокола идентификации нейронной архитектуры Агента."
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '1rem' }}>
                        <div className="radar-pulse" style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                          <Scan size={28} className="text-gold" />
                        </div>
                        <Link href="/induction" style={{ width: '100%' }}>
                          <Button variant="primary" style={{ width: '100%' }}>
                            НАЧАТЬ ТЕСТ
                          </Button>
                        </Link>
                      </div>
                    </GlassCard>
                  </motion.div>
                ) : (
                  <motion.div key="profile" variants={itemVariants}>
                    <GlassCard 
                      title="Мой Профиль" 
                      description={`Агент ${user.archetype} в системе. Квадра: ${quadraInfo?.name || 'Unknown'}`}
                      style={{ borderLeft: `4px solid ${quadraInfo?.color || 'var(--ios-gold)'}` }}
                    >
                      <Button variant="glass" onClick={() => setActiveTab('profile')} style={{ marginTop: '1.5rem', width: '100%', gap: '0.75rem' }}>
                        ОТКРЫТЬ ДОСЬЕ <Shield size={18} className="text-gold" />
                      </Button>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <GlassCard 
                  style={{ padding: '1.5rem' }} 
                  onClick={handleScanClick}
                >
                  <div style={{ position: 'relative', height: '24px', marginBottom: '0.75rem' }}>
                    <Users className="text-gold" size={24} style={{ position: 'absolute', top: 0, left: 0, zIndex: 2 }} />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Синхрон</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>Анализ 32х</div>
                </GlassCard>
                <GlassCard 
                  style={{ padding: '1.5rem' }}
                  onClick={() => setActiveTab('matrix')}
                >
                  <Globe className="text-gold" size={24} style={{ marginBottom: '0.75rem' }} />
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Матрица</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>Глобальная сеть</div>
                </GlassCard>
              </motion.div>
            </div>

            <motion.footer 
              variants={itemVariants}
              style={{ marginTop: '4rem', opacity: 0.2, fontSize: '0.6rem', textAlign: 'center', letterSpacing: '2px' }}
            >
              NEXUS CORE // AGENT_SESSION_ACTIVE // STIRLITZ.OS
            </motion.footer>
          </motion.div>
        );
    }
  };

  return (
    <main className={styles.main} style={{ paddingBottom: '100px' }}>
      {loading ? (
        <div className="radar-pulse" style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '50%', 
          border: '2px solid var(--ios-gold)', 
          margin: '20vh auto' 
        }}></div>
      ) : (
        renderTabContent()
      )}
      
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </main>
  );
}
