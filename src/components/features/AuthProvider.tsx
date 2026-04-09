'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { expandTelegramWebApp, TelegramUser } from '@/lib/telegram';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
      };
    };
  }
}

interface AuthContextType {
  user: any | null;
  tgUser: TelegramUser | null;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  tgUser: null,
  loading: true,
  error: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [tgUser, setTgUser] = useState<TelegramUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        expandTelegramWebApp();
        const rawInitData = window.Telegram?.WebApp?.initData;

        if (rawInitData) {
          // 1. Верификация через сервер
          const verifyRes = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ initData: rawInitData }),
          });

          if (!verifyRes.ok) {
            throw new Error('Verification failed');
          }

          const { user: validatedUser } = await verifyRes.json();
          setTgUser(validatedUser);
          
          // 2. Синхронизация с Supabase
          const { data, error: sbError } = await supabase
            .from('agents')
            .upsert({
              telegram_id: String(validatedUser.id),
              username: validatedUser.username,
              full_name: `${validatedUser.first_name} ${validatedUser.last_name || ''}`.trim(),
              updated_at: new Date().toISOString()
            }, { onConflict: 'telegram_id' })
            .select()
            .single();

          if (sbError) {
            console.error('Supabase sync error:', sbError);
          } else {
            setUser(data);
          }
        }
      } catch (e) {
        setError('Security breach or connection failed.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, tgUser, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
