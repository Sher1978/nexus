import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// If credentials are missing, we use a placeholder to prevent build-time crashes.
// Next.js evaluates this module during build.
const isReady = supabaseUrl.startsWith('http') && supabaseAnonKey.length > 0;

if (!isReady) {
  console.warn('Supabase credentials missing or invalid. Check your .env file.');
}

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Diagnostic check for Service Key (masked for safety)
if (supabaseServiceKey && !supabaseServiceKey.startsWith('eyJ')) {
  console.error('CRITICAL: SUPABASE_SERVICE_ROLE_KEY detected but has invalid format (does not start with eyJ).');
} else if (supabaseServiceKey) {
  console.log('SUPABASE_SERVICE_ROLE_KEY detected and formatted correctly.');
}

export const supabase = createClient(
  isReady ? supabaseUrl : 'https://placeholder.supabase.co',
  isReady ? supabaseAnonKey : 'placeholder-key'
);

// Admin client for backend operations (bypasses RLS)
export const supabaseAdmin = createClient(
  isReady ? supabaseUrl : 'https://placeholder.supabase.co',
  supabaseServiceKey || (isReady ? supabaseAnonKey : 'placeholder-key'),
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
