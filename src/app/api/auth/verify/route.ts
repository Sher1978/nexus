import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { initData } = await req.json();
    
    if (!initData) {
      return NextResponse.json({ error: 'Missing initData' }, { status: 400 });
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    if (!BOT_TOKEN) {
      console.error('TELEGRAM_BOT_TOKEN is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // 1. Parse the initData string
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');

    // 2. Sort the keys alphabetically
    const params = Array.from(urlParams.entries());
    params.sort(([a], [b]) => a.localeCompare(b));

    // 3. Create the data-check-string
    const dataCheckString = params
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // 4. Calculate secret key (HMAC-SHA256 of bot token with "WebAppData")
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(BOT_TOKEN)
      .digest();

    // 5. Calculate validation hash
    const validationHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    // 6. Compare hashes
    if (validationHash !== hash) {
      return NextResponse.json({ error: 'Invalid hash' }, { status: 403 });
    }

    // 7. Parse user data
    const userData = JSON.parse(urlParams.get('user') || '{}');

    return NextResponse.json({ 
      success: true, 
      user: userData 
    });

  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
