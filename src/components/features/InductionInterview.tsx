'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { VoiceRecorder } from './VoiceRecorder';
import { Send, RefreshCw, Cpu, User as UserIcon } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';

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
    { role: 'assistant', content: 'INITIALIZING INTERFACE... Neural link established. Welcome. I am your Nexus Profiler. To begin our session, tell me about a person or character you deeply resonate with—and why?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const initSession = async () => {
      try {
        const res = await fetch(`/api/induction/session?agentId=${user.id}`);
        const { session } = await res.json();

        if (session) {
          setSessionId(session.id);
          if (session.conversation && session.conversation.length > 0) {
            setMessages(session.conversation);
          }
        } else {
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
    if (!sessionId) return;

    const userMessage: Message = { 
      role: 'user', 
      content: text || (audioBase64 ? "[Voice Data Captured]" : "") 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/profiler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
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
        setTimeout(() => onComplete(codeMatch ? codeMatch[1].trim() : 'UNKNOWN'), 4000);
      }
    } catch (err) {
      console.error('Interview Error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Interface sync failure. Neural signature lost. Please retry input." }]);
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
    <div className="flex flex-col h-[75vh] w-full max-w-[500px]">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-8 custom-scrollbar space-y-6"
      >
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-2 px-1">
                {m.role === 'assistant' ? (
                  <>
                    <Cpu size={10} className="text-accent" />
                    <span className="text-[8px] font-black text-accent tracking-[0.2em] uppercase">Profiler System</span>
                  </>
                ) : (
                  <>
                    <span className="text-[8px] font-black text-white/30 tracking-[0.2em] uppercase">Agent Signature</span>
                    <UserIcon size={10} className="text-white/30" />
                  </>
                )}
              </div>
              <GlassCard className={`p-4 max-w-[90%] ${
                m.role === 'user' 
                  ? 'border-accent/40 bg-accent/5 !rounded-tr-none' 
                  : 'border-white/10 bg-white/5 !rounded-tl-none'
              }`}>
                <p className="text-sm font-medium leading-relaxed tracking-tight">
                  {m.content}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 px-1"
          >
            <div className="flex gap-1">
              <span className="w-1 h-1 bg-accent rounded-full animate-bounce" />
              <span className="w-1 h-1 bg-accent rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1 h-1 bg-accent rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
            <span className="text-[8px] font-black text-accent tracking-widest uppercase italic">Analyzing Neural Patterns...</span>
          </motion.div>
        )}
      </div>

      <div className="p-4 pt-0">
        <GlassCard className="p-4 border-white/10 flex flex-col gap-4">
          <div className="flex gap-3 items-end">
            <textarea
              className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-medium resize-none focus:border-accent/50 outline-none transition-all h-[52px]"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Input response..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(inputText);
                }
              }}
            />
            <button 
              onClick={() => sendMessage(inputText)}
              disabled={!inputText.trim() || isLoading}
              className="w-[52px] h-[52px] rounded-xl bg-accent text-black flex items-center justify-center disabled:opacity-30 transition-all hover:scale-105 active:scale-95 shrink-0"
            >
              <Send size={20} />
            </button>
          </div>
          
          <div className="border-t border-white/5 pt-4">
            <VoiceRecorder onRecordingComplete={handleVoice} isProcessing={isLoading} />
          </div>
        </GlassCard>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default InductionInterview;
