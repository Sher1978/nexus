import { Telegraf, Markup } from 'telegraf';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN must be provided!');
}

const bot = new Telegraf(token);

// --- CONSTANTS & HELPERS ---
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://nexus-obsidian.vercel.app';

const MAIN_MENU = Markup.inlineKeyboard([
  [Markup.button.callback('📂 ПРОФИЛЬ', 'profile'), Markup.button.callback('🧬 МАТРИЦА', 'matrix')],
  [Markup.button.callback('⚡️ НАЧАТЬ ИНДУКЦИЮ', 'start_induction')],
  [Markup.button.webApp('🚀 ВХОД В NEXUS', APP_URL)]
]);

const INDUCTION_MENU = Markup.inlineKeyboard([
  [Markup.button.callback('⏹ ПРЕРВАТЬ', 'cancel_induction')]
]);

async function getAgent(ctx: any) {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('telegram_id', String(ctx.from.id))
    .single();
  return data;
}

// --- COMMANDS ---
bot.start(async (ctx) => {
  const firstName = ctx.from.first_name || 'Агент';
  
  // Handle sync token if present
  const startPayload = ctx.payload;
  if (startPayload && startPayload.startsWith('sync_')) {
    // Logic for explicit linking if needed, though ctx.from.id is usually enough
  }

  await ctx.replyWithMarkdownV2(
    `⚡️ *ВХОД В НЕЙРОСЕТЬ NEXUS ПОДТВЕРЖДЕН* ⚡️\n\n` +
    `Приветствую, *${firstName}*\\. Ваша нейронная архитектура (Human OS) готова к синхронизации\\.\n\n` +
    `📡 *Протокол:* Elite Obsidian v1\\.0\\.26\n` +
    `🛡 *Статус:* Доступ разрешен`,
    MAIN_MENU
  );
});

// --- CALLBACK HANDLERS ---
bot.action('profile', async (ctx) => {
  const agent = await getAgent(ctx);
  if (!agent) return ctx.reply('Профиль не найден. Запустите /start');

  const cardUrl = `${APP_URL}/api/og/card?id=${agent.id}`;
  
  await ctx.replyWithPhoto(cardUrl, {
    caption: `🆔 *ID:* \`${agent.id.slice(0, 8)}\`\n👤 *AGENT:* ${agent.full_name}\n🧬 *ARCHETYPE:* ${agent.archetype || 'НЕ ОПРЕДЕЛЕН'}\n\n` +
             `_Nexus Identity Card v1.0_`,
    parse_mode: 'MarkdownV2',
    ...MAIN_MENU
  });
});

bot.action('start_induction', async (ctx) => {
  const agent = await getAgent(ctx);
  if (!agent) return ctx.reply('Сначала запустите /start');

  // Create or get session
  const { data: session } = await supabase
    .from('induction_sessions')
    .insert({ agent_id: agent.id, conversation: [{ role: 'assistant', content: 'INITIALIZING INTERFACE... Neural link established. Tell me about a person you resonate with—and why?' }] })
    .select()
    .single();

  await ctx.reply(`⚡️ ИНДУКЦИЯ ЗАПУЩЕНА\n\nNeural link established. Welcome. I am your Nexus Profiler.\n\nTo begin our session, tell me about a person or character you deeply resonate with—and why?`, INDUCTION_MENU);
});

bot.action('cancel_induction', async (ctx) => {
  await ctx.reply('Индукция прервана. Возврат в главное меню.', MAIN_MENU);
});

// --- COMMAND ACTIONS ---

bot.action('matrix', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('🌐 ACCESSING MATRIX...\n\nThe Neural Matrix is currently in restricted mode. Only Level 26 Agents can access the full architectural map.', MAIN_MENU);
});

bot.action('scan', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('📸 SCAN PROTOCOL\n\nTo scan a physical object or QR code, use the Web Nexus interface. The Bot provides remote diagnostic support only.', MAIN_MENU);
});

// --- MESSAGE HANDLER (INDUCTION FLOW) ---
bot.on(['text', 'voice'], async (ctx) => {
  const agent = await getAgent(ctx);
  if (!agent) return;

  // Check for active session
  const { data: session } = await supabase
    .from('induction_sessions')
    .select('*')
    .eq('agent_id', agent.id)
    .eq('is_completed', false)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!session) return;

  let content = '';
  let audioData = null;

  if ('text' in ctx.message) {
    content = ctx.message.text;
  } else if ('voice' in ctx.message) {
    content = '[Voice Data]';
    // Get file link
    const file = await ctx.telegram.getFile(ctx.message.voice.file_id);
    const audioUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
    const audioRes = await fetch(audioUrl);
    const buffer = await audioRes.arrayBuffer();
    audioData = Buffer.from(buffer).toString('base64');
  }

  // Call the profiler API logic (internal fetch or direct call)
  const profilerRes = await fetch(`${APP_URL}/api/profiler`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [...session.conversation, { role: 'user', content }],
      audio: audioData,
      sessionId: session.id
    })
  });

  const { content: aiResponse, isCompleted } = await profilerRes.json();

  if (isCompleted) {
    await ctx.reply(`✅ ${aiResponse}`, MAIN_MENU);
  } else {
    await ctx.reply(aiResponse, INDUCTION_MENU);
  }
});

// --- EXPORTS ---

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await bot.handleUpdate(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error handling update:', error);
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Nexus Bot API is operational.',
    endpoint: '/api/bot'
  });
}
