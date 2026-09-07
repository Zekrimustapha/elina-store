// =============================================================
// Server-only Telegram notification helper.
//
// SECURITY:
//  - The bot token is read from process.env.TELEGRAM_BOT_TOKEN ONLY.
//  - This module must never be imported into client code (no 'use client',
//    no NEXT_PUBLIC_). It runs exclusively inside API route handlers.
//  - The token is never logged, never returned, never included in errors.
// =============================================================

const TELEGRAM_CHAT_ID = '-1004379167289';

// Reliability tuning: how hard we try to deliver each notification.
const MAX_ATTEMPTS = 3;          // total send attempts before giving up
const ATTEMPT_TIMEOUT_MS = 2500; // per-attempt network timeout
const RETRY_BACKOFF_MS = 300;    // base backoff, multiplied by attempt number

export interface OrderNotification {
  full_name: string;
  phone_number: string;
  wilaya: string;
  commune: string;
  product_price: number;
  shipping_price: number;
  total_price: number;
  status: string; // stored English key, e.g. 'New'
  created_at?: string; // ISO string if available
}

// Result of a low-level send. NEVER contains the token.
export interface TelegramSendResult {
  ok: boolean;
  status?: number;      // HTTP status of the last attempt (if any)
  description?: string; // safe Telegram API description or error label (no token)
}

/**
 * Returns true when a real (non-placeholder) bot token is configured.
 * Does NOT reveal the token.
 */
export function isTelegramConfigured(): boolean {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  return Boolean(token && token.trim().length >= 20 && !token.includes('your_'));
}

/**
 * Low-level sender. Posts `text` to the fulfillment group with bounded retries
 * and a per-attempt timeout. NEVER throws and NEVER leaks the token.
 *
 * Retries transient failures (network error, timeout, HTTP 5xx, HTTP 429) so a
 * momentary blip cannot silently drop an order notification. Does NOT retry a
 * hard 4xx (bad token / chat not found) — those never fix themselves.
 */
async function postToTelegram(text: string): Promise<TelegramSendResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!isTelegramConfigured()) {
    // Not configured (e.g. local dev). Do nothing, do not log the token.
    console.warn('Telegram notification skipped: TELEGRAM_BOT_TOKEN not configured.');
    return { ok: false, description: 'not_configured' };
  }

  let lastStatus: number | undefined;
  let lastDescription: string | undefined;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ATTEMPT_TIMEOUT_MS);

    try {
      const res = await fetch(`https://api.telegram.org/bot${token!.trim()}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          disable_web_page_preview: true,
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      lastStatus = res.status;

      if (res.ok) {
        return { ok: true, status: res.status };
      }

      // Pull a safe description from the API body (never the token).
      try {
        const body = await res.json();
        if (body && typeof body.description === 'string') lastDescription = body.description;
      } catch {
        /* ignore body parse errors */
      }

      // Hard client errors won't be fixed by retrying.
      if (res.status >= 400 && res.status < 500 && res.status !== 429) {
        console.error('Telegram sendMessage rejected. HTTP status:', res.status);
        return { ok: false, status: res.status, description: lastDescription };
      }

      console.error(`Telegram sendMessage failed (attempt ${attempt}/${MAX_ATTEMPTS}). HTTP status:`, res.status);
    } catch (err) {
      clearTimeout(timer);
      lastDescription = err instanceof Error ? err.message : 'unknown error';
      console.error(`Telegram notification error (attempt ${attempt}/${MAX_ATTEMPTS}):`, lastDescription);
    }

    if (attempt < MAX_ATTEMPTS) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_BACKOFF_MS * attempt));
    }
  }

  return { ok: false, status: lastStatus, description: lastDescription };
}

function buildMessage(_order: OrderNotification): string {
  // Message intentionally contains ONLY these two lines — no customer/order details.
  return [
    'لديك طلب جديد على الموقع! 🚨',
    'الزبون في انتظار اتصالك 📞',
  ].join('\n');
}

/**
 * Sends an order notification to the fulfillment Telegram group.
 *
 * This function NEVER throws. A Telegram failure (missing token, network
 * error, API rejection) is logged safely (without the token) and swallowed,
 * so it can never roll back or fail a real order that was already created.
 *
 * Returns true if Telegram accepted the message, false otherwise.
 */
export async function sendOrderNotification(order: OrderNotification): Promise<boolean> {
  const result = await postToTelegram(buildMessage(order));
  return result.ok;
}

/**
 * Sends a clearly-labeled TEST message to the fulfillment group. Used by the
 * admin panel so the store owner can verify — on demand, in production — that
 * the token is set, the bot is in the group, and messages actually arrive.
 *
 * Returns a structured result (never the token) so the UI can explain failures
 * (e.g. "chat not found" = bot not added to the group; 401 = wrong token).
 */
export async function sendTelegramTestMessage(): Promise<TelegramSendResult & { configured: boolean }> {
  if (!isTelegramConfigured()) {
    return { configured: false, ok: false, description: 'not_configured' };
  }

  const text = [
    '✅ اختبار إشعارات ELINA COLLECTIONS',
    'هذه رسالة تجريبية — إعدادات الإشعارات تعمل بنجاح 🎉',
    'ستصلك رسالة مثل هذه عند كل طلب جديد على الموقع.',
  ].join('\n');

  const result = await postToTelegram(text);
  return { configured: true, ...result };
}
