'use client';

import React, { useState } from 'react';
import styles from '../page.module.css';
import { QuickTest } from '@/components/features/QuickTest';
import { InductionInterview } from '@/components/features/InductionInterview';
import { InductionResult } from '@/components/features/InductionResult';
import { useRouter } from 'next/navigation';

type FlowStep = 'TEST' | 'INTERVIEW' | 'RESULT';

export default function InductionPage() {
  const [step, setStep] = useState<FlowStep>('TEST');
  const [initialCode, setInitialCode] = useState<string | null>(null);
  const [finalCode, setFinalCode] = useState<string | null>(null);
  const router = useRouter();

  const handleTestComplete = (code: string) => {
    setInitialCode(code);
    setStep('INTERVIEW');
  };

  const handleInterviewComplete = (code: string) => {
    setFinalCode(code);
    setStep('RESULT');
  };

  const handleBack = () => {
    if (step === 'RESULT') setStep('INTERVIEW');
    else if (step === 'INTERVIEW') setStep('TEST');
    else router.push('/');
  };

  return (
    <main className={styles.main}>
      {step === 'TEST' && (
        <QuickTest onComplete={handleTestComplete} />
      )}
      
      {step === 'INTERVIEW' && (
        <InductionInterview 
          initialCode={initialCode}
          onComplete={handleInterviewComplete} 
        />
      )}

      {step === 'RESULT' && finalCode && (
        <InductionResult 
          code={finalCode} 
          onBack={handleBack} 
        />
      )}
    </main>
  );
}
