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
        className="custom-scrollbar"
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.25rem',
          padding: '1rem 0'
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            animation: 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <GlassCard style={{ 
              padding: '1rem 1.25rem',
              backgroundColor: m.role === 'user' ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: m.role === 'user' ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: m.role === 'user' ? '0 4px 15px rgba(255,215,0,0.1)' : '0 4px 15px rgba(0,0,0,0.2)',
              borderRadius: m.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
            }}>
              <p style={{ 
                fontSize: '0.95rem', 
                lineHeight: '1.5', 
                color: 'white',
                fontWeight: 450
              }}>{m.content}</p>
            </GlassCard>
            <div style={{ 
              fontSize: '0.65rem', 
              marginTop: '0.4rem', 
              opacity: 0.4, 
              textAlign: m.role === 'user' ? 'right' : 'left',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {m.role === 'user' ? 'Agent Input' : 'Nexus Response'}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }}>
            <div className="glass" style={{ padding: '0.5rem 1rem', borderRadius: '20px' }}>
              <RefreshCw className="animate-spin text-gold" size={16} />
            </div>
          </div>
        )}
      </div>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem', 
        padding: '1.25rem',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '24px',
        backdropFilter: 'blur(20px)',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
          <textarea
            className="glass"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ввод данных..."
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '18px',
              padding: '0.9rem 1.1rem',
              color: 'white',
              fontSize: '0.95rem',
              resize: 'none',
              height: '52px',
              maxHeight: '120px',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.08)';
              e.target.style.borderColor = 'rgba(255,255,255,0.3)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.05)';
              e.target.style.borderColor = 'rgba(255,255,255,0.15)';
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
            style={{ width: '52px', height: '52px', borderRadius: '18px', padding: 0, minWidth: '52px' }}
            disabled={!inputText.trim() || isLoading}
          >
            <Send size={22} />
          </Button>
        </div>
        
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
          <VoiceRecorder onRecordingComplete={handleVoice} isProcessing={isLoading} />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};
