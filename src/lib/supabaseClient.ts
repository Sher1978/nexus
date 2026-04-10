import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// If credentials are missing, we use a placeholder to prevent build-time crashes.
// Next.js evaluates this module during build.
const isReady = supabaseUrl.startsWith('http') && supabaseAnonKey.length > 0;

if (!isReady) {
  console.warn('Supabase credentials missing or invalid. Check your .env file.');
}

export const supabase = createClient(
  isReady ? supabaseUrl : 'https://placeholder.supabase.co',
  isReady ? supabaseAnonKey : 'placeholder-key'
);
