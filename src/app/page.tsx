'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Scan, Shield, Users, Globe, ChevronRight, Zap } from "lucide-react";
import { SHADOW_CODE_NAMES, TYPE_QUADRA, QUADRA_DATA } from "@/lib/shadowCode";
import { useAuth } from "@/components/features/AuthProvider";
import { getTelegramWebApp } from "@/lib/telegram";
import { TabType, BottomNav } from "@/components/ui/BottomNav";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import ProfileScreen from "@/components/features/ProfileScreen";
import MatrixScreen from "@/components/features/MatrixScreen";
import TopNav from "@/components/ui/TopNav";

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

  const getPageTitle = () => {
    switch (activeTab) {
      case 'profile': return "AGENT PROFILE";
      case 'matrix': return "TACTICAL MATRIX";
      case 'scan': return "NEURAL SCAN";
      default: return "NEXUS INTERFACE";
    }
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
            className="w-full max-w-[440px] px-4"
          >
            <motion.div variants={itemVariants} className="flex flex-col items-center pt-2 pb-10">
              <div className="relative h-24 w-24 flex items-center justify-center mb-6">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border border-accent/20 border-dashed rounded-full"
                />
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-12 h-12 bg-accent/20 rounded-full blur-xl absolute"
                />
                <Cpu size={40} className="text-accent relative z-10" />
              </div>

              <div className="flex flex-col items-center">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '40px' }}
                  className="h-px bg-accent/50 mb-4"
                />
                <h1 className="text-6xl font-black tracking-tighter mb-2 italic">
                  NEXUS
                </h1>
                <div className="flex items-center gap-2 opacity-40 uppercase tracking-[0.3em] text-[8px] font-bold">
                  System Phase: <span className="text-accent">Stable</span>
                </div>
              </div>
            </motion.div>

            <div className="flex flex-col gap-6">
              <AnimatePresence mode="wait">
                {!user ? (
                  <motion.div 
                    key="induction" 
                    variants={itemVariants}
                    className="w-full"
                  >
                    <Link href="/induction" className="block w-full">
                      <GlassCard className="p-0 border-accent/40 overflow-hidden hover:border-accent group transition-all duration-700 relative bg-accent/5 backdrop-blur-2xl">
                        <div className="p-10 flex flex-col items-center text-center">
                           <motion.div 
                             animate={{ 
                               boxShadow: ["0 0 20px rgba(var(--accent-rgb),0.2)", "0 0 40px rgba(var(--accent-rgb),0.5)", "0 0 20px rgba(var(--accent-rgb),0.2)"] 
                             }}
                             transition={{ duration: 4, repeat: Infinity }}
                             className="w-20 h-20 rounded-3xl bg-accent/20 flex items-center justify-center border border-accent/30 mb-8 group-hover:scale-105 transition-transform duration-700"
                           >
                             <Scan size={36} className="text-accent" />
                           </motion.div>
                           <h3 className="text-4xl font-black uppercase tracking-tighter mb-3 group-hover:text-accent transition-colors italic">Индукция</h3>
                           <p className="text-[11px] text-white/50 uppercase tracking-[0.3em] font-bold mb-10">
                             Architecture Identification
                           </p>
                           
                           <div className="w-full flex justify-center gap-1.5 mb-10">
                             {[...Array(5)].map((_, i) => (
                               <motion.div 
                                 key={i}
                                 animate={{ opacity: [0.2, 1, 0.2] }}
                                 transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                                 className="w-1.5 h-1.5 rounded-full bg-accent" 
                               />
                             ))}
                           </div>
                           
                           <div className="flex items-center gap-3 text-accent font-black text-base uppercase tracking-[0.35em] py-4 px-8 rounded-2xl bg-accent/10 border border-accent/20 group-hover:bg-accent/20 transition-all">
                             <Zap size={16} className="fill-accent" />
                             Начать процесс
                           </div>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-accent/10 overflow-hidden">
                          <motion.div 
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="w-1/4 h-full bg-accent pr-px shadow-[0_0_20px_var(--accent)]"
                          />
                        </div>
                      </GlassCard>
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div key="profile-card" variants={itemVariants}>
                    <GlassCard 
                      className="p-6 border-l-4"
                      style={{ borderLeftColor: quadraInfo?.color || 'var(--accent)' }}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-lg font-black tracking-tight mb-1">AGENT DOSSIER</h3>
                          <p className="text-xs text-white/50">Classification: <span className="text-white font-bold">{user.archetype}</span></p>
                        </div>
                        <div 
                          className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5"
                          style={{ borderColor: quadraInfo?.color }}
                        >
                          <Shield size={20} style={{ color: quadraInfo?.color }} />
                        </div>
                      </div>
                      <Button variant="glass" onClick={() => setActiveTab('profile')} className="w-full py-4 font-black">
                        VIEW FULL DATA
                      </Button>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                <GlassCard 
                  className="p-6 flex flex-col items-center text-center hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={handleScanClick}
                >
                  <Users className="text-accent mb-3" size={24} />
                  <span className="text-[10px] font-black uppercase tracking-widest mb-1 text-white/40">SYNCHRON</span>
                  <span className="text-xs font-bold">ANALYZER</span>
                </GlassCard>
                <GlassCard 
                  className="p-6 flex flex-col items-center text-center hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => setActiveTab('matrix')}
                >
                  <Globe className="text-accent mb-3" size={24} />
                  <span className="text-[10px] font-black uppercase tracking-widest mb-1 text-white/40">MATRIX</span>
                  <span className="text-xs font-bold">GLOBAL NET</span>
                </GlassCard>
              </motion.div>
            </div>

            <motion.footer 
              variants={itemVariants}
              className="mt-16 mb-8 opacity-20 text-[8px] font-bold text-center tracking-[0.4em] uppercase"
            >
              NEXUS CORE // AGENT_SESSION_V2.6 // STIRLITZ.OS
            </motion.footer>
          </motion.div>
        );
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen">
      <div className="scanner-line" />
      <TopNav 
        title={getPageTitle()} 
        showBack={activeTab !== 'nexus'} 
        onBack={() => setActiveTab('nexus')} 
      />
      <div className="w-full pt-24 pb-12 flex flex-col items-center">
        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="w-16 h-16 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          </div>
        ) : (
          renderTabContent()
        )}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </main>
  );
}
