import { Telegraf, Markup } from 'telegraf';
import { NextResponse, after } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { SHADOW_CODE_NAMES, TYPE_QUADRA, QUADRA_DATA, getTacticalPartners, getProtocol, PROTOCOL_NAMES } from '@/lib/shadowCode';
import { SYNC_INSIGHTS } from '@/lib/mbtiSyncData';

const token = process.env.TELEGRAM_BOT_TOKEN || '';
let APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://nexus-shers-projects-97eb3851.vercel.app';

// Ensure APP_URL doesn't have a trailing slash for consistency
if (APP_URL.endsWith('/')) APP_URL = APP_URL.slice(0, -1);

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
        full_name: (ctx.from.first_name || 'Anonymous Agent').trim(),
        archetype: 'INITIATE'
      })
      .select()
      .single();
    return { agent: newAgent, error: createError?.message };
  };

  const sendMainMenu = async (ctx: any, textPrefix = '') => {
    const firstName = (ctx.from.first_name || 'Агент').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const MENU_TEXT = textPrefix + 
      `⚡️ <b>ВХОД В SHADOW CODE ПОДТВЕРЖДЕН</b> ⚡️\n\n` +
      `Приветствую, <b>${firstName}</b>. Ваш Теневой Код готов к расшифровке.\n\n` +
      `📡 <b>Протокол:</b> Nexus v1.1-stable\n` +
      `🛡 <b>Статус:</b> Доступ разрешен`;

    const MAIN_MENU = Markup.inlineKeyboard([
      [Markup.button.callback('📂 ТЕНЕВОЙ КОД', 'profile'), Markup.button.callback('🧬 КАРТА ТЕНИ', 'matrix')],
      [Markup.button.callback('⚡️ УЗНАТЬ СВОЙ КОД', 'start_induction')],
      [Markup.button.webApp('🔍 СКАНЕР (P2P)', `${APP_URL}/scan`)],
      [Markup.button.webApp('🚀 ВХОД В NEXUS', APP_URL)]
    ]);

    const bgUrl = `${APP_URL}/human-os-bg.png`;
    try {
      await ctx.replyWithPhoto(bgUrl, { caption: MENU_TEXT, parse_mode: 'HTML', ...MAIN_MENU });
    } catch (e) {
      await ctx.reply(MENU_TEXT, { parse_mode: 'HTML', ...MAIN_MENU });
    }
  };

  bot.start(async (ctx) => {
    const telegramId = String(ctx.from.id);
    const startPayload = ctx.payload;
    
    if (startPayload && (startPayload.startsWith('inspect_') || startPayload.startsWith('scan_'))) {
      const targetId = startPayload.replace('inspect_', '').replace('scan_', '');
      const { data: targetAgent } = await supabaseAdmin.from('agents').select('*').eq('id', targetId).single();
      const { agent: selfAgent } = await getOrCreateAgent(ctx);

      if (targetAgent && selfAgent) {
        const protocolKey = getProtocol(selfAgent.archetype, targetAgent.archetype);
        const protocolName = protocolKey ? PROTOCOL_NAMES[protocolKey] : 'Unknown';
        const insights = protocolKey ? SYNC_INSIGHTS[protocolKey] : null;

        let insightText = `\n\n<i>Синхронизация Nexus завершена успешно.</i>`;
        if (insights) {
          insightText = `\n\n📊 <b>АНАЛИЗ СОВМЕСТИМОСТИ</b> (${insights.score}%)\n` +
            `🔹 <b>Протокол:</b> ${protocolName}\n` +
            `🔹 <b>Статус:</b> ${insights.label}\n\n` +
            `💼 <b>Бизнес-взаимодействие:</b>\n${insights.business}\n\n` +
            `🤝 <b>Дружеская связь:</b>\n${insights.friendship}\n\n` +
            `🖤 <b>Личный резонанс:</b>\n${insights.personal}\n\n` +
            `🛠 <b>ПРОТОКОЛЫ ВЗАИМОДЕЙСТВИЯ:</b>\n${insights.protocols.map(p => `• <b>${p}</b>`).join('\n')}`;
        }

        const cardUrl = `${APP_URL}/api/og/card?id=${targetAgent.id}&t=${Date.now()}`;
        await ctx.replyWithPhoto(cardUrl, {
          caption: `🔍 <b>ОБНАРУЖЕН ТЕНЕВОЙ КОД</b>\n\n` +
            `<b>Имя:</b> ${targetAgent.full_name}\n` +
            `<b>Архетип:</b> ${SHADOW_CODE_NAMES[targetAgent.archetype] || targetAgent.archetype}` +
            insightText + 
            `\n\n<i>Для подробного анализа перейдите в Nexus.</i>`,
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([
            [Markup.button.webApp('🚀 ОТКРЫТЬ В NEXUS', `${APP_URL}/card/${targetAgent.id}`)]
          ])
        });
      } else {
        await ctx.reply('❌ <b>ОШИБКА</b>\nТеневой Код не найден или ваша авторизация устарела.');
      }
    } else {
      await getOrCreateAgent(ctx);
    }
    await sendMainMenu(ctx);
  });

  bot.command('matrix', async (ctx) => {
    const { agent } = await getOrCreateAgent(ctx);
    if (agent) ctx.reply('Загружаю вашу Карту Тени...', { reply_markup: { inline_keyboard: [[{ text: '📊 ПОКАЗАТЬ МАТРИЦУ', callback_data: 'matrix' }]] } });
  });

  bot.command('me', async (ctx) => {
    const { agent } = await getOrCreateAgent(ctx);
    if (agent) ctx.reply('Загружаю ваш профиль...', { reply_markup: { inline_keyboard: [[{ text: '📂 МОЙ ПРОФИЛЬ', callback_data: 'profile' }]] } });
  });

  bot.action('profile', async (ctx) => {
    const { agent } = await getOrCreateAgent(ctx);
    if (!agent) return ctx.reply('Profile error.');
    const cardUrl = `${APP_URL}/api/og/card?id=${agent.id}&t=${Date.now()}`;
    await ctx.replyWithPhoto(cardUrl, {
      caption: `<b>ID:</b> <code>${agent.id}</code>\n<b>STATUS:</b> АКТИВЕН\n<b>ТЕНЕВОЙ КОД:</b> ${SHADOW_CODE_NAMES[agent.archetype] || agent.archetype}`,
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('🧬 КАРТА ТЕНИ', 'matrix'), Markup.button.callback('⚡️ УЗНАТЬ КОД', 'start_induction')]
      ])
    });
  });

  bot.action('matrix', async (ctx) => {
    const { agent } = await getOrCreateAgent(ctx);
    const archetype = agent?.archetype || 'INITIATE';
    const quadraKey = TYPE_QUADRA[archetype];
    
    await ctx.answerCbQuery();
    await ctx.reply(`🌐 <b>ДОСТУП К КАРТЕ ТЕНИ</b> 🌐\n\n` +
      `<b>Архетип:</b> ${SHADOW_CODE_NAMES[archetype] || archetype}\n` +
      `<b>Квадра:</b> ${quadraKey || 'Не определена'}\n\n` +
      `<i>Вы можете выгрузить подробный текстовый отчет со всеми параметрами Карты или открыть интерактивную матрицу в приложении.</i>`, 
      { 
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('📄 ВЫГРУЗИТЬ ТЕКСТОМ', 'export_text')],
          [Markup.button.webApp('🚀 ОТКРЫТЬ КАРТУ', APP_URL)]
        ])
      }
    );
  });

  bot.on('text', async (ctx, next) => {
    const messageText = ctx.message.text?.toLowerCase().trim() || '';
    const MENU_TRIGGERS = ['меню', 'menu', 'профиль', 'profile', 'главная', 'home', '/start'];
    
    if (MENU_TRIGGERS.includes(messageText)) {
      return sendMainMenu(ctx);
    }
    return next();
  });

  bot.action('export_text', async (ctx) => {
    const { agent } = await getOrCreateAgent(ctx);
    const archetype = agent?.archetype || 'INITIATE';
    const quadraKey = TYPE_QUADRA[archetype];
    const quadra = quadraKey ? QUADRA_DATA[quadraKey] : null;
    const partners = getTacticalPartners(archetype);

    await ctx.answerCbQuery('Генерирую полный отчет...');

    let text = `📄 <b>ПОЛНЫЙ ОТЧЕТ: ТЕНЕВАЯ КАРТА NEXUS</b>\n\n`;
    text += `👤 <b>Агент:</b> ${agent?.full_name}\n`;
    text += `🧬 <b>Код:</b> ${SHADOW_CODE_NAMES[archetype]} (${archetype})\n\n`;

    if (quadra) {
      text += `🪐 <b>КВАДРА: ${quadra.name.toUpperCase()}</b>\n`;
      text += `<i>${quadra.description}</i>\n\n`;
      text += `⚡️ <b>ЦЕННОСТИ:</b> ${quadra.values}\n\n`;
      text += `✅ <b>СИЛЬНЫЕ СТОРОНЫ:</b>\n${quadra.strengths}\n\n`;
      text += `⚠️ <b>ТЕНЕВЫЕ ЗОНЫ (РИСКИ):</b>\n${quadra.shadows}\n\n`;
      text += `💼 <b>БИЗНЕС-РОЛЬ:</b>\n${quadra.business}\n\n`;
      text += `🏠 <b>ЖИЗНЕННАЯ СТРАТЕГИЯ:</b>\n${quadra.life}\n\n`;
    }

    if (partners.length > 0) {
      text += `📡 <b>ТАКТИЧЕСКИЕ ПАРТНЕРЫ:</b>\n`;
      partners.forEach(p => {
        text += `• <b>${p.name}</b> (${p.code}) — ${p.protocolName}\n`;
      });
    }

    text += `\n\n<i>Генерация завершена. Все данные синхронизированы с вашим профилем в Nexus.</i>`;

    await ctx.reply(text, { parse_mode: 'HTML' });
  });

  bot.action('start_induction', async (ctx) => {
    const { agent } = await getOrCreateAgent(ctx);
    if (!agent) return;
    await supabaseAdmin.from('induction_sessions').insert({ agent_id: agent.id, conversation: [{ role: 'assistant', content: 'Neural link established.' }] });
    await ctx.reply(`⚡️ <b>СКАНИРОВАНИЕ ЗАПУЩЕНО</b>\n\nNeural link established. Расскажите о персонаже или реальном человеке, который вызывает у вас сильный резонанс? Почему?`, { 
      parse_mode: 'HTML', 
      ...Markup.inlineKeyboard([[Markup.button.callback('⏹ ПРЕРВАТЬ', 'cancel_induction')]]) 
    });
  });

  bot.action('cancel_induction', async (ctx) => {
    const telegramId = String(ctx.from.id);
    const { agent } = await getOrCreateAgent(ctx);
    if (agent) {
      await supabaseAdmin.from('induction_sessions').update({ is_completed: true }).eq('agent_id', agent.id).eq('is_completed', false);
    }
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
        const res = await fetch(`https://api.telegram.org/file/bot${token}/${file.file_path}`);
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
        const profilerRes = await fetch(`${APP_URL}/api/profiler`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [...session.conversation, { role: 'user', content: content || '[Audio]' }], audio: audioData, sessionId: session.id })
        });
        
        const result = await profilerRes.json();
        
        if (!profilerRes.ok || result.error) {
           throw new Error(result.error || `Profiler API returned ${profilerRes.status}`);
        }

        const safeResponse = (result.content || 'Error: Empty response from Nexus.').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        await bot.telegram.editMessageText(chatId, placeholderMsgId, undefined, result.isCompleted ? `✅ ${safeResponse}` : safeResponse, {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([[Markup.button.callback('⏹ ПРЕРВАТЬ', 'cancel_induction')]])
        });
      } catch (e: any) {
        console.error("Induction Error Details:", e);
        await bot.telegram.editMessageText(chatId, placeholderMsgId, undefined, `❌ <b>ОШИБКА ДИАГНОСТИКИ</b>\n\n${e.message}\n\n<i>Попробуйте прервать процесс и начать заново.</i>`, { 
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([[Markup.button.callback('⏹ ПРЕРВАТЬ', 'cancel_induction')]])
        });
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
    
    // Check if we need to update APP_URL from request headers if Vercel env is weird
    const host = request.headers.get('host');
    if (host && !process.env.NEXT_PUBLIC_APP_URL) {
      APP_URL = `https://${host}`;
    }

    await getBot().handleUpdate(body);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Bot POST Error:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'operational', 
    token_detected: !!token,
    app_url: APP_URL,
    version: '1.2-stable',
    build_id: new Date().toISOString()
  });
}
