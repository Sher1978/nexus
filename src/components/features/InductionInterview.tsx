'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { VoiceRecorder } from './VoiceRecorder';
import { Send, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from './AuthProvider';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface InductionInterviewProps {
  initialCode?: string | null;
  onComplete: (code: string) => void;
}

export const InductionInterview: React.FC<InductionInterviewProps> = ({ initialCode, onComplete }) => {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Инициализация системы Nexus... Здравствуйте. Я ваш виртуальный типировщик. Для начала индукции скажите, кто ваш любимый персонаж из кино или книг и почему?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize or Restore Session
  useEffect(() => {
    if (!user) return;

    const initSession = async () => {
      try {
        // Try to get latest active session
        const res = await fetch(`/api/induction/session?agentId=${user.id}`);
        const { session } = await res.json();

        if (session) {
          setSessionId(session.id);
          if (session.conversation && session.conversation.length > 0) {
            setMessages(session.conversation);
          }
        } else {
          // Create new session
          const createRes = await fetch('/api/induction/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ agentId: user.id }),
          });
          const { session: newSession } = await createRes.json();
          setSessionId(newSession.id);
        }
      } catch (err) {
        console.error('Session init error:', err);
      }
    };

    initSession();
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const sendMessage = async (text: string, audioBase64?: string) => {
    if (!text.trim() && !audioBase64) return;
    if (!sessionId) return; // Wait for session

    const userMessage: Message = { 
      role: 'user' as const, 
      content: text || (audioBase64 ? "[Голосовой ответ]" : "") 
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/profiler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: newMessages,
          audio: audioBase64,
          sessionId: sessionId,
          initialHypothesis: initialCode
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      
      if (data.isCompleted) {
        const codeMatch = data.content.match(/ВАШ СОЦИОТИП: ([\wа-яА-ЯёЁ\s]+)/i);
        setTimeout(() => onComplete(codeMatch ? codeMatch[1].trim() : 'UNKNOWN'), 3000);
      }
    } catch (err) {
      console.error('Interview Error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Ошибка связи с системой. Пожалуйста, попробуйте еще раз." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoice = async (blob: Blob) => {
    try {
      const base64 = await blobToBase64(blob);
      await sendMessage("", base64);
    } catch (err) {
      console.error('Audio processing error:', err);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      maxHeight: '85vh',
      gap: '1rem',
      width: '100%',
      maxWidth: '500px'
    }}>
      <div 
        ref={scrollRef}
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem',
          padding: '1rem 0'
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            animation: 'fadeIn 0.3s ease'
          }}>
            <GlassCard style={{ 
              padding: '0.8rem 1rem',
              backgroundColor: m.role === 'user' ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255, 255, 255, 0.05)',
              border: m.role === 'user' ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{m.content}</p>
            </GlassCard>
          </div>
        ))}
        {isLoading && (
          <div style={{ alignSelf: 'flex-start', opacity: 0.5 }}>
            <RefreshCw className="animate-spin" size={16} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <textarea
            className="glass"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ваш ответ..."
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '0.8rem',
              color: 'white',
              fontSize: '0.9rem',
              resize: 'none',
              height: '48px'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(inputText);
              }
            }}
          />
          <Button 
            variant="primary" 
            onClick={() => sendMessage(inputText)}
            style={{ width: '48px', height: '48px', borderRadius: '16px', padding: 0 }}
          >
            <Send size={20} />
          </Button>
        </div>
        
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
          <VoiceRecorder onRecordingComplete={handleVoice} isProcessing={isLoading} />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
