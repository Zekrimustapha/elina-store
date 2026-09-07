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

// Map the stored status key to its Arabic label for the message.
const STATUS_LABELS_AR: Record<string, string> = {
  New: 'جديد',
  Confirmed: 'مؤكد',
  NoAnswer1: 'العميل لا يجيب 1 + SMS',
  NoAnswer2: 'العميل لا يجيب 2',
  NoAnswer3: 'العميل لا يجيب 3',
  Cancelled: 'ملغي',
};

function formatOrderTime(iso?: string): string {
  const d = iso ? new Date(iso) : new Date();
  // Algeria local time (UTC+1), 24h, day/month/year hour:minute
  try {
    return new Intl.DateTimeFormat('fr-DZ', {
      timeZone: 'Africa/Algiers',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(d);
  } catch {
    return d.toISOString();
  }
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
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token || token.trim().length < 20 || token.includes('your_')) {
    // Not configured (e.g. local dev). Do nothing, do not log the token.
    console.warn('Telegram notification skipped: TELEGRAM_BOT_TOKEN not configured.');
    return false;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: buildMessage(order),
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      // Log status only — never the token or full URL.
      console.error('Telegram sendMessage failed with HTTP status:', res.status);
      return false;
    }
    return true;
  } catch (err) {
    // Log a generic error without leaking the token/URL.
    console.error('Telegram notification error:', err instanceof Error ? err.message : 'unknown error');
    return false;
  }
}
