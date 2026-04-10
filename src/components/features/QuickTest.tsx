'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Shield, ArrowRight, Check, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DILEMMAS = [
  {
    id: 'ei',
    title: 'Откуда вы берете энергию?',
    options: [
      { label: 'Мир и люди (Экстраверсия)', value: 'E', description: 'Активное взаимодействие с внешним миром' },
      { label: 'Тишина и мысли (Интроверсия)', value: 'I', description: 'Концентрация на внутренних процессах' }
    ]
  },
  {
    id: 'sn',
    title: 'Как вы собираете информацию?',
    options: [
      { label: 'Факты и детали (Сенсорика)', value: 'S', description: 'Опора на конкретные данные и опыт' },
      { label: 'Смыслы и интуиция (Интуиция)', value: 'N', description: 'Поиск скрытых возможностей и идей' }
    ]
  },
  {
    id: 'tf',
    title: 'Как вы принимаете решения?',
    options: [
      { label: 'Логика и анализ (Логика)', value: 'T', description: 'Объективный расчет и структура' },
      { label: 'Ценности и чувства (Этика)', value: 'F', description: 'Гармония отношений и эмоции' }
    ]
  },
  {
    id: 'jp',
    title: 'Как вы организуете жизнь?',
    options: [
      { label: 'План и структура (Рациональность)', value: 'J', description: 'Порядок и завершенность действий' },
      { label: 'Гибкость и поток (Иррациональность)', value: 'P', description: 'Адаптивность и спонтанность' }
    ]
  }
];

export const QuickTest = ({ onComplete }: { onComplete: (code: string) => void }) => {
  const [step, setStep] = useState(0);
  const [results, setResults] = useState<string[]>([]);

  const handleSelect = (value: string) => {
    const newResults = [...results, value];
    setResults(newResults);
    
    if (step < DILEMMAS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(newResults.join(''));
    }
  };

  const currentDilemma = DILEMMAS[step];
  const progress = ((step + 1) / DILEMMAS.length) * 100;

  return (
    <div className="w-full max-w-[440px] px-4 py-8 fade-in">
      <div className="mb-8">
        <div className="flex justify-between items-end mb-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-black tracking-[0.2em] text-accent uppercase mb-1">Neural Induction</span>
            <span className="text-xl font-black tracking-tight">PHASE_0{step + 1}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black opacity-30 tracking-widest uppercase">Progress</span>
            <div className="text-sm font-black italic">{Math.round(progress)}%</div>
          </div>
        </div>
        <div className="h-1 bg-white/5 w-full rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-accent shadow-[0_0_10px_rgba(212,175,55,0.5)]"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <GlassCard className="p-8">
            <h2 className="text-2xl font-black text-center mb-8 leading-tight uppercase italic tracking-tight">
              {currentDilemma.title}
            </h2>
            <div className="flex flex-col gap-4">
              {currentDilemma.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className="w-full p-6 text-left glass-card hover:border-accent transition-all group flex items-center justify-between"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-black text-lg tracking-tight group-hover:text-accent transition-colors italic">{opt.label}</span>
                    <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">
                      {opt.description}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-all">
                    <ArrowRight size={16} className="group-hover:text-accent" />
                  </div>
                </button>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>
      
      <div className="mt-8 flex items-center justify-center gap-2 opacity-20">
        <Zap size={12} className="text-accent" />
        <span className="text-[8px] font-black tracking-[0.4em] uppercase">Processing neural signature</span>
      </div>
    </div>
  );
};

export default QuickTest;
