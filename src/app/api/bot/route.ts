import { Telegraf, Markup } from 'telegraf';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

const token = process.env.TELEGRAM_BOT_TOKEN || '';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://nexus-shers-projects-97eb3851.vercel.app';

// Singleton instance to prevent multiple handler registrations in dev/serverless warm starts
let botInstance: Telegraf<any>;

function getBot() {
  if (botInstance) return botInstance;
  
  const bot = new Telegraf(token);
  
  // --- COMMANDS ---
  bot.start(async (ctx) => {
    const firstName = (ctx.from.first_name || 'Агент').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const telegramId = String(ctx.from.id);
    
    const startPayload = ctx.payload;
    if (startPayload && startPayload.startsWith('sync_')) {
      const userId = startPayload.replace('sync_', '');
      const { error: syncError } = await supabase
        .from('agents')
        .update({ telegram_id: telegramId })
        .eq('id', userId);

      if (!syncError) {
        await ctx.reply(`✅ <b>СИНХРОНИЗАЦИЯ УСПЕШНА</b>\nВаш профиль Nexus связан с аккаунтом @${ctx.from.username || telegramId}.`, { parse_mode: 'HTML' });
      } else {
        await ctx.reply(`❌ <b>ОШИБКА СИНХРОНИЗАЦИИ</b>\nНе удалось привязать профиль.`, { parse_mode: 'HTML' });
      }
    }

    const MAIN_MENU = Markup.inlineKeyboard([
      [Markup.button.callback('📂 ПРОФИЛЬ', 'profile'), Markup.button.callback('🧬 МАТРИЦА', 'matrix')],
      [Markup.button.callback('⚡️ НАЧАТЬ ИНДУКЦИЮ', 'start_induction')],
      [Markup.button.webApp('🚀 ВХОД В NEXUS', APP_URL)]
    ]);

    await ctx.reply(
      `⚡️ <b>ВХОД В НЕЙРОСЕТЬ NEXUS ПОДТВЕРЖДЕН</b> ⚡️\n\n` +
      `Приветствую, <b>${firstName}</b>. Ваша нейронная архитектура готова к синхронизации.\n\n` +
      `📡 <b>Протокол:</b> Human OS v1.0.26\n` +
      `🛡 <b>Статус:</b> Доступ разрешен`,
      { parse_mode: 'HTML', ...MAIN_MENU }
    );
  });

  // --- ACTIONS ---
  bot.action('profile', async (ctx) => {
    const agent = await supabase.from('agents').select('*').eq('telegram_id', String(ctx.from.id)).single();
    if (agent.error || !agent.data) {
      return ctx.reply('⚠️ ПРОФИЛЬ НЕ НАЙДЕН\nИспользуйте приложение для привязки.', 
        Markup.inlineKeyboard([[Markup.button.webApp('🚀 ОТКРЫТЬ NEXUS', APP_URL)]])
      );
    }

    const cardUrl = `${APP_URL}/api/og/card?id=${agent.data.id}&t=${Date.now()}`;
    await ctx.replyWithPhoto(cardUrl, {
      caption: `<b>ID:</b> <code>${agent.data.id.slice(0, 8)}</code>\n<b>AGENT:</b> ${agent.data.full_name || ctx.from.first_name}\n<b>ARCHETYPE:</b> ${agent.data.archetype || 'НЕ ОПРЕДЕЛЕН'}`,
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([[Markup.button.callback('🧬 МАТРИЦА', 'matrix'), Markup.button.callback('⚡️ ИНДУКЦИЯ', 'start_induction')]])
    });
  });

  bot.action('matrix', async (ctx) => {
    const agent = await supabase.from('agents').select('archetype').eq('telegram_id', String(ctx.from.id)).single();
    const status = agent.data?.archetype ? 'ACTIVE (LEVEL 26)' : 'RESTRICTED';
    await ctx.answerCbQuery();
    await ctx.reply(`🌐 <b>ACCESSING NEURAL MATRIX</b> 🌐\n\n<b>Status:</b> ${status}\n\n<i>Для управления Матрицей используйте Desktop интерфейс.</i>`, { parse_mode: 'HTML' });
  });

  bot.action('start_induction', async (ctx) => {
    const agent = await supabase.from('agents').select('id').eq('telegram_id', String(ctx.from.id)).single();
    if (!agent.data) return ctx.reply('Сначала привяжите профиль.');

    const { data: session } = await supabase
      .from('induction_sessions')
      .insert({ agent_id: agent.data.id, conversation: [{ role: 'assistant', content: 'INITIALIZING INTERFACE...' }] })
      .select().single();

    await ctx.reply(`⚡️ <b>ИНДУКЦИЯ ЗАПУЩЕНА</b>\n\nNeural link established. Tell me about a person or character you deeply resonate with—and why?`, { 
      parse_mode: 'HTML', 
      ...Markup.inlineKeyboard([[Markup.button.callback('⏹ ПРЕРВАТЬ', 'cancel_induction')]]) 
    });
  });

  bot.action('cancel_induction', async (ctx) => {
    await ctx.reply('Индукция прервана.');
  });

  // --- MESSAGES ---
  bot.on(['text', 'voice'], async (ctx) => {
    const agent = await supabase.from('agents').select('id').eq('telegram_id', String(ctx.from.id)).single();
    if (!agent.data) return;

    const { data: session } = await supabase
      .from('induction_sessions')
      .select('*').eq('agent_id', agent.data.id).eq('is_completed', false).order('created_at', { ascending: false }).limit(1).single();

    if (!session) return;

    let content = '';
    let audioData = null;

    if ('text' in ctx.message) {
      content = ctx.message.text;
    } else if ('voice' in ctx.message) {
      content = '[Audio Response]';
      try {
        const file = await ctx.telegram.getFile(ctx.message.voice.file_id);
        if (file?.file_path) {
          const res = await fetch(`https://api.telegram.org/file/bot${token}/${file.file_path}`);
          audioData = Buffer.from(await res.arrayBuffer()).toString('base64');
        }
      } catch (e) {}
    }

    if (!content && !audioData) return;
    await ctx.sendChatAction('typing');

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
    await ctx.reply(isCompleted ? `✅ ${aiResponse}` : aiResponse, { parse_mode: 'HTML' });
  });

  botInstance = bot;
  return bot;
}

// --- API HANDLERS ---
export async function POST(request: Request) {
  try {
    if (!token) return NextResponse.json({ ok: false, error: 'Config missing' }, { status: 500 });
    const bot = getBot();
    const body = await request.json();
    await bot.handleUpdate(body);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Bot Error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'operational', 
    token_detected: !!token,
    app_url: APP_URL
  });
}
