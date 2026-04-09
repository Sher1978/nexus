-- Create agents table
CREATE TABLE IF NOT EXISTS public.agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    telegram_id TEXT UNIQUE NOT NULL,
    username TEXT,
    full_name TEXT,
    archetype TEXT, -- Shadow Code Archetype (derived from MBTI)
    human_os JSONB DEFAULT '{}'::jsonb, -- Store MBTI, Enneagram, etc.
    hd_data JSONB DEFAULT '{}'::jsonb, -- Human Design
    astro_data JSONB DEFAULT '{}'::jsonb, -- Birth data & planets
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by Telegram ID
CREATE INDEX IF NOT EXISTS idx_agents_telegram_id ON public.agents(telegram_id);

-- Create induction_sessions for tracking AI interviews
CREATE TABLE IF NOT EXISTS public.induction_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
    step INTEGER DEFAULT 1, -- 1 to 5 based on the script
    conversation JSONB DEFAULT '[]'::jsonb, -- List of messages
    current_hypotheses JSONB DEFAULT '[]'::jsonb,
    is_completed BOOLEAN DEFAULT FALSE,
    result_archetype TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.induction_sessions ENABLE ROW LEVEL SECURITY;

-- Simple policies (for MVP, tighten in production)
-- Allow users to read all agents (needed for sync)
CREATE POLICY "Allow public read access to agents" ON public.agents
    FOR SELECT USING (true);

-- Allow users to manage their own profile
CREATE POLICY "Allow users to manage own profile" ON public.agents
    FOR ALL USING (telegram_id = auth.jwt() ->> 'sub');

-- Induction sessions policy
CREATE POLICY "Allow users to manage own induction" ON public.induction_sessions
    FOR ALL USING (agent_id IN (SELECT id FROM public.agents WHERE telegram_id = auth.jwt() ->> 'sub'));
