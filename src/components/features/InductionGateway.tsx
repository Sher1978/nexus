'use client';

import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Zap, Brain, Shield, ArrowRight, Scan } from 'lucide-react';
import { motion } from 'framer-motion';

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
      icon: <Scan className="text-accent" size={24} />,
      premium: true
    },
    {
      id: 'TEST',
      title: 'Pattern Test',
      description: 'Быстрый диагностический тест на основе когнитивных дилемм.',
      icon: <Zap size={24} className="text-secondary" />
    },
    {
      id: 'MANUAL',
      title: 'Manual Protocol',
      description: 'Мгновенная активация для тех, кто уже знает свой системный код.',
      icon: <Shield size={24} className="text-white/40" />
    }
  ];

  return (
    <div className="w-full max-w-[440px] flex flex-col gap-8">
      <div className="text-center space-y-2">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black tracking-tight"
        >
          Инициация Профиля
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-white/50 font-medium"
        >
          Выберите метод определения вашей архитектуры личности
        </motion.p>
      </div>

      <div className="flex flex-col gap-4">
        {methods.map((method, index) => (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <GlassCard
              onClick={() => onSelect(method.id)}
              className={`p-6 cursor-pointer relative group transition-all duration-300 hover:border-accent/50 ${
                method.premium ? 'border-accent/30 bg-accent/5' : 'border-white/5'
              }`}
            >
              {method.premium && (
                <div className="absolute top-4 right-6 text-[8px] font-black text-accent tracking-[0.2em] uppercase">
                  Recommended Protocol
                </div>
              )}
              
              <div className="flex gap-5 items-center">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-black transition-colors duration-300">
                  {method.icon}
                </div>
                
                <div className="flex-1 space-y-1">
                  <h3 className={`text-lg font-bold tracking-tight ${method.premium ? 'text-accent' : 'text-white'}`}>
                    {method.title}
                  </h3>
                  <p className="text-xs text-white/40 leading-relaxed font-medium">
                    {method.description}
                  </p>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight size={20} className="text-accent" />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 flex items-center justify-center gap-3 text-[10px] font-black text-white/20 tracking-[0.3em] uppercase italic"
      >
        <span className="w-8 h-[1px] bg-white/10" />
        <Shield size={12} className="opacity-50" />
        Secure Protocol v2.6.4
        <span className="w-8 h-[1px] bg-white/10" />
      </motion.div>
    </div>
  );
};
