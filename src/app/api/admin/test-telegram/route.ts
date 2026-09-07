import { NextResponse } from 'next/server';
import { sendTelegramTestMessage } from '@/lib/telegram';

// Same simple password check used by the orders admin route.
function verifyAdminAuth(request: Request): boolean {
  const authHeader = request.headers.get('x-admin-password');
  const configuredPassword = process.env.ADMIN_PASSWORD || 'admin123';
  return authHeader === configuredPassword;
}

/**
 * Admin-only Telegram health check.
 *
 * Lets the store owner verify — on demand, in production — that order
 * notifications will actually arrive: it confirms the bot token is set on the
 * server, then sends a labeled TEST message to the fulfillment group.
 *
 * Never returns the token. Error details (status/description) are safe to show
 * so the owner can self-diagnose (401 = wrong token, "chat not found" = bot not
 * added to the group, etc.).
 */
export async function POST(request: Request) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 });
  }

  const result = await sendTelegramTestMessage();

  if (!result.configured) {
    return NextResponse.json({
      success: false,
      configured: false,
      message: 'لم يتم ضبط رمز بوت تيليغرام (TELEGRAM_BOT_TOKEN) على الخادم. أضِفه في إعدادات Vercel ثم أعِد النشر.',
    });
  }

  if (!result.ok) {
    return NextResponse.json({
      success: false,
      configured: true,
      status: result.status,
      description: result.description,
      message:
        'الرمز مضبوط لكن فشل إرسال الرسالة. تأكد من صحة الرمز وأن البوت مضاف إلى المجموعة.',
    });
  }

  return NextResponse.json({
    success: true,
    configured: true,
    message: 'تم إرسال رسالة تجريبية بنجاح ✅ — تحقق من مجموعة تيليغرام الآن.',
  });
}
