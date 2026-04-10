import { Telegraf, Markup } from 'telegraf';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

const token = process.env.TELEGRAM_BOT_TOKEN || '';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://nexus-shers-projects-97eb3851.vercel.app';

// Singleton instance to prevent multiple handler registrations in dev/serverless warm starts
let botInstance: Telegraf<any>;

function getBot() {
  if (botInstance) return botInstance;
  
  const bot = new Telegraf(token);
  
  // --- HELPERS ---
  const getOrCreateAgent = async (ctx: any) => {
    const telegramId = String(ctx.from.id);
    const { data: agent, error } = await supabaseAdmin
      .from('agents')
      .select('*')
      .eq('telegram_id', telegramId)
      .maybeSingle();

    if (agent) return { agent, error: null };
    if (error && error.code !== 'PGRST116') {
      console.error('Fetch agent error:', error);
      return { agent: null, error: error.message };
    }

    // Create new agent if not found
    const { data: newAgent, error: createError } = await supabaseAdmin
      .from('agents')
      .insert({
        telegram_id: telegramId,
        username: ctx.from.username || null,
        full_name: `${ctx.from.first_name || ''} ${ctx.from.last_name || ''}`.trim() || 'Anonymous Agent',
        archetype: 'INITIATE'
      })
      .select()
      .single();

    if (createError) {
      console.error('Auto-registration error:', createError);
      return { agent: null, error: createError.message };
    }
    return { agent: newAgent, error: null };
  };

  const sendMainMenu = async (ctx: any, textPrefix = '') => {
    const firstName = (ctx.from.first_name || 'Агент').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const MENU_TEXT = textPrefix + 
      `⚡️ <b>ВХОД В SHADOW CODE ПОДТВЕРЖДЕН</b> ⚡️\n\n` +
      `Приветствую, <b>${firstName}</b>. Ваш Теневой Код готов к расшифровке.\n\n` +
      `📡 <b>Протокол:</b> Nexus v1.0.26\n` +
      `🛡 <b>Статус:</b> Доступ разрешен`;

    const MAIN_MENU = Markup.inlineKeyboard([
      [Markup.button.callback('📂 ТЕНЕВОЙ КОД', 'profile'), Markup.button.callback('🧬 КАРТА ТЕНИ', 'matrix')],
      [Markup.button.callback('⚡️ УЗНАТЬ СВОЙ КОД', 'start_induction')],
      [Markup.button.webApp('🚀 ВХОД В NEXUS', APP_URL)]
    ]);

    const bgUrl = `${APP_URL}/human-os-bg.png`;
    try {
      await ctx.replyWithPhoto(bgUrl, { 
        caption: MENU_TEXT, 
        parse_mode: 'HTML', 
        ...MAIN_MENU 
      });
    } catch (e) {
      // Fallback if photo fails
      await ctx.reply(MENU_TEXT, { parse_mode: 'HTML', ...MAIN_MENU });
    }
  };

  // --- COMMANDS ---
  bot.start(async (ctx) => {
    const telegramId = String(ctx.from.id);
    
    // 1. Handle explicit sync deep link
    const startPayload = ctx.payload;
    if (startPayload && startPayload.startsWith('sync_')) {
      const userId = startPayload.replace('sync_', '');
      const { error: syncError } = await supabaseAdmin
        .from('agents')
        .update({ telegram_id: telegramId })
        .eq('id', userId);

      if (!syncError) {
        await ctx.reply(`✅ <b>СИНХРОНИЗАЦИЯ УСПЕШНА</b>\nВаш профиль Nexus связан с аккаунтом @${ctx.from.username || telegramId}.`, { parse_mode: 'HTML' });
      } else {
        await ctx.reply(`❌ <b>ОШИБКА СИНХРОНИЗАЦИИ</b>\nНе удалось привязать профиль.`, { parse_mode: 'HTML' });
      }
    } else {
      // 2. Auto-register if no sync payload
      await getOrCreateAgent(ctx);
    }

    await sendMainMenu(ctx);
  });

  // --- ACTIONS ---
  bot.action('profile', async (ctx) => {
    const { agent, error } = await getOrCreateAgent(ctx);
    if (!agent) {
      return ctx.reply(`❌ <b>ОШИБКА БАЗЫ ДАННЫХ</b>\n<code>${error || 'Unknown error'}</code>\n\nПроверьте настройки SUPABASE_SERVICE_ROLE_KEY в Vercel.`, { parse_mode: 'HTML' });
    }

    const cardUrl = `${APP_URL}/api/og/card?id=${agent.data?.id || agent.id}&t=${Date.now()}`;
    await ctx.replyWithPhoto(cardUrl, {
      caption: `<b>ID:</b> <code>${(agent.data?.id || agent.id).slice(0, 8)}</code>\n<b>STATUS:</b> АКТИВЕН\n<b>ТЕНЕВОЙ КОД:</b> ${agent.data?.archetype || agent.archetype}`,
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([[Markup.button.callback('🧬 КАРТА ТЕНИ', 'matrix'), Markup.button.callback('⚡️ УЗНАТЬ КОД', 'start_induction')]])
    });
  });

  bot.action('matrix', async (ctx) => {
    const { agent } = await getOrCreateAgent(ctx);
    const status = agent?.archetype ? `ACTIVE (SYNC 26%)` : 'RESTRICTED';
    await ctx.answerCbQuery();
    await ctx.reply(`🌐 <b>ДОСТУП К КАРТЕ ТЕНИ</b> 🌐\n\n<b>Статус:</b> ${status}\n\n<i>Для детального анализа используйте Desktop интерфейс.</i>`, { parse_mode: 'HTML' });
  });

  bot.action('start_induction', async (ctx) => {
    const { agent } = await getOrCreateAgent(ctx);
    if (!agent) return ctx.reply('Сначала привяжите или создайте профиль.');

    const { data: session } = await supabaseAdmin
      .from('induction_sessions')
      .insert({ 
        agent_id: agent.id, 
        conversation: [
          { role: 'user', content: 'START_PROTOCOL' },
          { role: 'assistant', content: 'Neural link established. Tell me about a person or character you deeply resonate with—and why?' }
        ] 
      })
      .select().single();

    await ctx.reply(`⚡️ <b>СКАНИРОВАНИЕ ЗАПУЩЕНО</b>\n\nNeural link established. Введите данные для анализа вашей Тени. Начнем с простого: расскажите о персонаже или реальном человеке, который вызывает у вас сильный отклик (восхищение или резонанс)? Почему?`, { 
      parse_mode: 'HTML', 
      ...Markup.inlineKeyboard([[Markup.button.callback('⏹ ПРЕРВАТЬ', 'cancel_induction')]]) 
    });
  });

  bot.action('cancel_induction', async (ctx) => {
    await ctx.reply('Процесс остановлен. Возврат в главное меню.');
  });

  // --- MESSAGES ---
  bot.on(['text', 'voice'], async (ctx) => {
    const { agent } = await getOrCreateAgent(ctx);
    if (!agent) return;

    const { data: session } = await supabaseAdmin
      .from('induction_sessions')
      .select('*').eq('agent_id', agent.id).eq('is_completed', false).order('created_at', { ascending: false }).limit(1).maybeSingle();

    if (!session) {
      if ('text' in ctx.message && !ctx.message.text.startsWith('/')) {
        await ctx.reply('Команда не распознана. Используйте меню для навигации или начните индукцию.');
        await sendMainMenu(ctx);
      }
      return;
    }

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

    try {
      const result = await profilerRes.json();
      
      if (!profilerRes.ok || result.error) {
        throw new Error(result.error || `HTTP ${profilerRes.status}`);
      }

      const aiResponse = result.content;
      const isCompleted = result.isCompleted;

      if (!aiResponse) {
        throw new Error('Empty AI response');
      }

      // Basic HTML escaping for peace of mind in HTML mode
      const safeResponse = aiResponse
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      await ctx.reply(isCompleted ? `✅ ${safeResponse}` : safeResponse, { 
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([[Markup.button.callback('⏹ ПРЕРВАТЬ', 'cancel_induction')]])
      });
    } catch (e: any) {
      console.error('Induction error:', e);
      await ctx.reply(`❌ <b>ОШИБКА ИНДУКЦИИ</b>\n<code>${e.message}</code>\n\nПопробуйте отправить сообщение еще раз или перезапустите сессию.`, { parse_mode: 'HTML' });
    }
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
