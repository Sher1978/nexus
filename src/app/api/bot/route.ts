import { Telegraf, Markup } from 'telegraf';
import { NextResponse } from 'next/server';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN must be provided!');
}

const bot = new Telegraf(token);

// Premium Welcome Message in SHADOW CODE style
bot.start((ctx) => {
  const firstName = ctx.from.first_name || 'Агент';
  
  return ctx.replyWithMarkdownV2(
    `⚡️ *ВХОД В НЕЙРОСЕТЬ NEXUS ПОДТВЕРЖДЕН* ⚡️\n\n` +
    `Приветствую, *${firstName}*\\. Ваша нейронная архитектура (Human OS) готова к синхронизации\\.\n\n` +
    `Система **SHADOW CODE** развернута в вашем терминале\\. Здесь вы получите доступ к тактической разведке интертипных отношений и анализу архетипов\\.\n\n` +
    `📡 *Протокол:* Elite Obsidian v1\\.0\\.26\n` +
    `🛡 *Статус:* Доступ разрешен`,
    Markup.inlineKeyboard([
      [Markup.button.webApp('🚀 ЗАПУСТИТЬ NEXUS', process.env.NEXT_PUBLIC_APP_URL || 'https://nexus-obsidian.vercel.app')]
    ])
  );
});

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

// Needed for setWebhook (simple helper)
export async function GET() {
  return NextResponse.json({ 
    message: 'Nexus Bot API is operational.',
    endpoint: '/api/bot'
  });
}
