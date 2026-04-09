import crypto from 'crypto';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface WebAppInitData {
  user?: TelegramUser;
  query_id?: string;
  auth_date?: string;
  hash?: string;
}

export const getTelegramWebApp = () => {
  if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
    return (window as any).Telegram.WebApp;
  }
  return null;
};

export const getTelegramInitData = (): WebAppInitData | null => {
  const webApp = getTelegramWebApp();
  if (webApp && webApp.initDataUnsafe) {
    return webApp.initDataUnsafe;
  }
  return null;
};

export const validateTelegramInitData = (initData: string, botToken: string): boolean => {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');

  const dataCheckString = Array.from(urlParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  return calculatedHash === hash;
};

export const expandTelegramWebApp = () => {
  const webApp = getTelegramWebApp();
  if (webApp) {
    webApp.expand();
  }
};
