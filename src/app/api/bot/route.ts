import { Telegraf, Markup } from 'telegraf';
import { NextResponse, after } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

const token = process.env.TELEGRAM_BOT_TOKEN || '';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://nexus-shers-projects-97eb3851.vercel.app';

let botInstance: Telegraf<any>;
export const maxDuration = 60; 

const LOADING_PHRASES = [
  "🕸 <b>Теневые механизмы запущены...</b>\nАнализирую ваш Код.",
  "🧩 <b>Синхронизация с Nexus...</b>\nРаспознаю паттерны вашей Тени.",
  "👁 <b>Взор Тени направлен на ваши слова...</b>\nИдет глубинный поиск.",
  "🧬 <b>Нейро-синхронизация...</b>\nТвой Код уникален, дай мне секунду."
];

function getBot() {
  if (botInstance) return botInstance;
  const bot = new Telegraf(token);

  const getOrCreateAgent = async (ctx: any) => {
    const telegramId = String(ctx.from.id);
    const { data: agent, error } = await supabaseAdmin
      .from('agents')
      .select('*')
      .eq('telegram_id', telegramId)
      .maybeSingle();

    if (agent) return { agent, error: null };
    const { data: newAgent, error: createError } = await supabaseAdmin
      .from('agents')
      .insert({
        telegram_id: telegramId,
        username: ctx.from.username || null,
        full_name: \\ \\.trim() || 'Anonymous Agent',
        archetype: 'INITIATE'
      })
      .select()
      .single();
    return { agent: newAgent, error: createError?.message };
  };

  const sendMainMenu = async (ctx: any, textPrefix = '') => {
    const firstName = (ctx.from.first_name || 'Агент').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const MENU_TEXT = textPrefix + 
      \⚡️ <b>ВХОД В SHADOW CODE ПОДТВЕРЖДЕН</b> ⚡️\\n\\n\ +
      \Приветствую, <b>\</b>. Ваш Теневой Код готов к расшифровке.\\n\\n\ +
      \📡 <b>Протокол:</b> Nexus v1.0.35-stable\\n\ +
      \🛡 <b>Статус:</b> Доступ разрешен\;

    const MAIN_MENU = Markup.inlineKeyboard([
      [Markup.button.callback('📂 ТЕНЕВОЙ КОД', 'profile'), Markup.button.callback('🧬 КАРТА ТЕНИ', 'matrix')],
      [Markup.button.callback('⚡️ УЗНАТЬ СВОЙ КОД', 'start_induction')],
      [Markup.button.webApp('🔍 СКАНЕР (P2P)', \\/scan\)],
      [Markup.button.webApp('🚀 ВХОД В NEXUS', APP_URL)]
    ]);

    const bgUrl = \\/human-os-bg.png\;
    try {
      await ctx.replyWithPhoto(bgUrl, { caption: MENU_TEXT, parse_mode: 'HTML', ...MAIN_MENU });
    } catch (e) {
      await ctx.reply(MENU_TEXT, { parse_mode: 'HTML', ...MAIN_MENU });
    }
  };

  bot.start(async (ctx) => {
    const telegramId = String(ctx.from.id);
    const startPayload = ctx.payload;
    
    if (startPayload && startPayload.startsWith('inspect_')) {
      const targetId = startPayload.replace('inspect_', '');
      const { data: targetAgent } = await supabaseAdmin.from('agents').select('*').eq('id', targetId).single();
      if (targetAgent) {
        const cardUrl = \\/api/og/card?id=\&t=\\;
        await ctx.replyWithPhoto(cardUrl, {
          caption: \🔍 <b>ОБНАРУЖЕН СТОРОННИЙ ТЕНЕВОЙ КОД</b>\\n\\n<b>Имя:</b> \\\n<b>Архетип:</b> \\\n\\n<i>Синхронизация Nexus завершена успешно.</i>\,
          parse_mode: 'HTML'
        });
      } else {
        await ctx.reply('❌ <b>ОШИБКА</b>\\nТеневой Код не найден в архивах Nexus.');
      }
    } else {
      await getOrCreateAgent(ctx);
    }
    await sendMainMenu(ctx);
  });

  bot.action('profile', async (ctx) => {
    const { agent } = await getOrCreateAgent(ctx);
    if (!agent) return ctx.reply('Profile error.');
    const cardUrl = \\/api/og/card?id=\&t=\\;
    await ctx.replyWithPhoto(cardUrl, {
      caption: \<b>ID:</b> <code>\</code>\\n<b>STATUS:</b> АКТИВЕН\\n<b>ТЕНЕВОЙ КОД:</b> \\,
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([[Markup.button.callback('🧬 КАРТА ТЕНИ', 'matrix'), Markup.button.callback('⚡️ УЗНАТЬ КОД', 'start_induction')]])
    });
  });

  bot.action('matrix', async (ctx) => {
    const { agent } = await getOrCreateAgent(ctx);
    const status = agent?.archetype ? \ACTIVE (SYNC 26%)\ : 'RESTRICTED';
    await ctx.answerCbQuery();
    await ctx.reply(\🌐 <b>ДОСТУП К КАРТЕ ТЕНИ</b> 🌐\\n\\n<b>Статус:</b> \\\n\\n<i>Для детального анализа используйте Desktop интерфейс.</i>\, { parse_mode: 'HTML' });
  });

  bot.action('start_induction', async (ctx) => {
    const { agent } = await getOrCreateAgent(ctx);
    if (!agent) return;
    await supabaseAdmin.from('induction_sessions').insert({ agent_id: agent.id, conversation: [{ role: 'assistant', content: 'Neural link established.' }] });
    await ctx.reply(\⚡️ <b>СКАНИРОВАНИЕ ЗАПУЩЕНО</b>\\n\\nNeural link established. Расскажите о персонаже или реальном человеке, который вызывает у вас сильный резонанс? Почему?\, { 
      parse_mode: 'HTML', 
      ...Markup.inlineKeyboard([[Markup.button.callback('⏹ ПРЕРВАТЬ', 'cancel_induction')]]) 
    });
  });

  bot.action('cancel_induction', async (ctx) => {
    await supabaseAdmin.from('induction_sessions').update({ is_completed: true }).eq('agent_id', (String(ctx.from.id))).eq('is_completed', false);
    await ctx.reply('Процесс остановлен. Возврат в главное меню.');
    await sendMainMenu(ctx);
  });

  bot.on(['text', 'voice'], async (ctx) => {
    const { agent } = await getOrCreateAgent(ctx);
    if (!agent) return;
    const { data: session } = await supabaseAdmin.from('induction_sessions').select('*').eq('agent_id', agent.id).eq('is_completed', false).order('created_at', { ascending: false }).limit(1).maybeSingle();
    if (!session) return;

    let content = '';
    let audioData = null;
    if ('text' in ctx.message) content = ctx.message.text;
    else if ('voice' in ctx.message) {
      const file = await ctx.telegram.getFile(ctx.message.voice.file_id);
      if (file?.file_path) {
        const res = await fetch(\https://api.telegram.org/file/bot\/\\);
        audioData = Buffer.from(await res.arrayBuffer()).toString('base64');
      }
    }

    const randomPhrase = LOADING_PHRASES[Math.floor(Math.random() * LOADING_PHRASES.length)];
    const placeholderMsg = await ctx.reply(randomPhrase, { parse_mode: 'HTML' });
    const chatId = ctx.chat.id;
    const placeholderMsgId = placeholderMsg.message_id;
    await ctx.sendChatAction('typing');

    after(async () => {
      try {
        const profilerRes = await fetch(\\/api/profiler\, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [...session.conversation, { role: 'user', content: content || '[Audio]' }], audio: audioData, sessionId: session.id })
        });
        const result = await profilerRes.json();
        const safeResponse = (result.content || 'Error...').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        await bot.telegram.editMessageText(chatId, placeholderMsgId, undefined, result.isCompleted ? \✅ \\ : safeResponse, {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([[Markup.button.callback('⏹ ПРЕРВАТЬ', 'cancel_induction')]])
        });
      } catch (e: any) {
        await bot.telegram.editMessageText(chatId, placeholderMsgId, undefined, \❌ <b>ОШИБКА</b>\\n\\, { parse_mode: 'HTML' });
      }
    });
  });

  botInstance = bot;
  return bot;
}

export async function POST(request: Request) {
  try {
    if (!token) return NextResponse.json({ ok: false }, { status: 500 });
    const body = await request.json();
    await getBot().handleUpdate(body);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'operational', 
    token_detected: !!token,
    app_url: APP_URL,
    version: '1.0.35-stable',
    build_id: new Date().toISOString()
  });
}
