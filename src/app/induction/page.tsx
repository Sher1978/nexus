'use client';

import React, { useState } from 'react';
import { QuickTest } from '@/components/features/QuickTest';
import { InductionInterview } from '@/components/features/InductionInterview';
import { InductionResult } from '@/components/features/InductionResult';
import { InductionGateway } from '@/components/features/InductionGateway';
import { ManualTypeSelection } from '@/components/features/ManualTypeSelection';
import { useRouter } from 'next/navigation';
import TopNav from '@/components/ui/TopNav';

type FlowStep = 'GATEWAY' | 'MANUAL' | 'TEST' | 'INTERVIEW' | 'RESULT';

export default function InductionPage() {
  const [step, setStep] = useState<FlowStep>('GATEWAY');
  const [initialCode, setInitialCode] = useState<string | null>(null);
  const [finalCode, setFinalCode] = useState<string | null>(null);
  const router = useRouter();

  const handleGatewaySelect = (id: 'MANUAL' | 'TEST' | 'SCAN') => {
    if (id === 'SCAN') setStep('INTERVIEW');
    else if (id === 'TEST') setStep('TEST');
    else if (id === 'MANUAL') setStep('MANUAL');
  };

  const handleManualComplete = (code: string) => {
    setFinalCode(code);
    setStep('RESULT');
  };

  const handleTestComplete = (code: string) => {
    setInitialCode(code);
    setStep('INTERVIEW');
  };

  const handleInterviewComplete = (code: string) => {
    setFinalCode(code);
    setStep('RESULT');
  };

  const handleBack = () => {
    if (step === 'RESULT') setStep('GATEWAY');
    else if (step === 'INTERVIEW' || step === 'TEST' || step === 'MANUAL') setStep('GATEWAY');
    else router.push('/');
  };

  const getStepTitle = () => {
    switch(step) {
      case 'GATEWAY': return "SYSTEM INDUCTION";
      case 'MANUAL': return "IDENTITY SELECTION";
      case 'TEST': return "NEURAL ASSESSMENT";
      case 'INTERVIEW': return "AI VERIFICATION";
      case 'RESULT': return "INDUCTION SUCCESS";
      default: return "INDUCTION";
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-black text-white">
      <TopNav 
        title={getStepTitle()} 
        showBack={true} 
        onBack={handleBack} 
      />
      
      <div className="w-full pt-[60px] flex flex-col items-center">
        {step === 'GATEWAY' && (
          <InductionGateway onSelect={handleGatewaySelect} />
        )}

        {step === 'MANUAL' && (
          <ManualTypeSelection onSelect={handleManualComplete} onBack={handleBack} />
        )}
        
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
      </div>
    </main>
  );
}
