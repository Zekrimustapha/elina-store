import { NextResponse } from 'next/server';
import { 
  validateFullName, 
  validatePhone, 
  validateWilaya, 
  validateCommune, 
  sanitizeString, 
  normalizePhone 
} from '@/lib/validation';
import { PRODUCT_PRICE, PRODUCT_NAME, getShippingPrice } from '@/lib/shipping';
import { checkRateLimit } from '@/lib/rate-limiter';
import { getServiceSupabase } from '@/lib/supabase';
import { sendOrderNotification } from '@/lib/telegram';

// In-memory duplicate cache as an additional fast-path guard
const recentOrdersByPhone = new Map<string, number>();

/**
 * Checks if Cloudflare Turnstile is properly configured with real production keys.
 * Returns false if keys are missing, empty, or placeholder strings.
 */
function isTurnstileConfigured(): boolean {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false;
  const cleaned = secret.trim().toLowerCase();
  if (
    cleaned === '' ||
    cleaned.startsWith('your_') ||
    cleaned.includes('placeholder') ||
    cleaned.includes('change_this') ||
    cleaned.length < 15
  ) {
    return false;
  }
  return true;
}

export async function POST(request: Request) {
  try {
    // 1. IP extraction & Abuse Rate Limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = (forwardedFor ? forwardedFor.split(',')[0].trim() : realIp) || '127.0.0.1';

    // Allow maximum 8 submissions per minute per IP to prevent DDoS / automated floods
    const isAllowed = checkRateLimit(ip, 8, 60 * 1000);
    if (!isAllowed) {
      return NextResponse.json(
        { success: false, message: 'تعذر معالجة الطلب. يرجى المحاولة مرة أخرى لاحقاً.' },
        { status: 429 }
      );
    }

    // 2. Parse request body
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, message: 'تعذر معالجة الطلب. يرجى المحاولة مرة أخرى.' },
        { status: 400 }
      );
    }

    const { full_name, phone_number, wilaya, commune, notes, website_hp, turnstileToken } = body;

    // 3. Honeypot check (Silent discard for bots)
    // NOTE: We intentionally return isNewOrder:false so the frontend shows a
    // neutral success UI to the bot but NEVER fires a Meta Purchase event.
    if (website_hp && String(website_hp).trim().length > 0) {
      return NextResponse.json({ success: true, isNewOrder: false, message: 'Order created' });
    }

    // 4. Cloudflare Turnstile Verification (Graceful bypass if unconfigured in local/dev mode)
    if (isTurnstileConfigured()) {
      const turnstileSecret = process.env.TURNSTILE_SECRET_KEY!.trim();

      if (!turnstileToken) {
        return NextResponse.json(
          { success: false, message: 'تعذر معالجة الطلب. يرجى إعادة التحقق من الأمان والمحاولة مجدداً.' },
          { status: 400 }
        );
      }

      try {
        const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            secret: turnstileSecret,
            response: turnstileToken,
            remoteip: ip,
          }),
        });
        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          return NextResponse.json(
            { success: false, message: 'تعذر التحقق من الأمان. يرجى إعادة المحاولة.' },
            { status: 400 }
          );
        }
      } catch (err) {
        console.error('Turnstile verification error:', err);
      }
    }

    // 5. Server-side Input Validation (Address field omitted completely)
    const normalizedPhone = normalizePhone(String(phone_number || ''));

    if (
      !validateFullName(String(full_name || '')) ||
      !validatePhone(normalizedPhone) ||
      !validateWilaya(String(wilaya || '')) ||
      !validateCommune(String(wilaya || ''), String(commune || ''))
    ) {
      return NextResponse.json(
        { success: false, message: 'تعذر معالجة الطلب. يرجى التحقق من صحة المعلومات المدخلة.' },
        { status: 400 }
      );
    }

    // 6. Fast In-Memory 24-Hour Check Guard
    const now = Date.now();
    const lastOrderTime = recentOrdersByPhone.get(normalizedPhone);
    if (lastOrderTime && now - lastOrderTime < 24 * 60 * 60 * 1000) {
      return NextResponse.json({
        success: false,
        isDuplicate: true,
        message: 'لقد قمت بإرسال طلبية من قبل. يرجى الانتظار لتأكيد طلبيتك.',
      });
    }

    // 7. Input Sanitization
    const safeFullName = sanitizeString(String(full_name));
    const safeWilaya = sanitizeString(String(wilaya));
    const safeCommune = sanitizeString(String(commune));
    const safeNotes = notes ? sanitizeString(String(notes)) : '';
    const safeSize = 'To Confirm'; // Call center confirms size

    // 8. Server-side Pricing Recalculation
    const shippingPrice = getShippingPrice(safeWilaya);
    const totalPrice = PRODUCT_PRICE + shippingPrice;

    // 9. Database Insertion with Supabase
    const supabase = getServiceSupabase();

    if (supabase) {
      // Primary atomic execution via PostgreSQL function.
      // IMPORTANT: pass the full order payload including the server-computed
      // prices so the DB stores the REAL per-wilaya total (not a fixed value).
      const { data: rpcData, error: rpcError } = await supabase.rpc('create_order_if_allowed', {
        p_full_name: safeFullName,
        p_phone_number: phone_number,
        p_normalized_phone: normalizedPhone,
        p_wilaya: safeWilaya,
        p_commune: safeCommune,
        p_address: safeCommune, // address field removed from form; commune used as address
        p_size: safeSize,
        p_product_name: PRODUCT_NAME,
        p_product_price: PRODUCT_PRICE,
        p_shipping_price: shippingPrice,
        p_total_price: totalPrice,
        p_notes: safeNotes,
      });

      if (!rpcError && rpcData) {
        if (rpcData.is_duplicate) {
          recentOrdersByPhone.set(normalizedPhone, now);
          return NextResponse.json({
            success: false,
            isNewOrder: false,
            isDuplicate: true,
            message: 'لقد قمت بإرسال طلبية من قبل.',
          });
        }
        // Genuine new order created in the database.
        recentOrdersByPhone.set(normalizedPhone, now);

        // Telegram notification — fires ONLY here (real new order via RPC).
        // Never throws; a failure cannot fail the order (see telegram.ts).
        await sendOrderNotification({
          full_name: safeFullName,
          phone_number: phone_number,
          wilaya: safeWilaya,
          commune: safeCommune,
          product_price: PRODUCT_PRICE,
          shipping_price: shippingPrice,
          total_price: rpcData.total_price ?? totalPrice,
          status: 'New',
          created_at: new Date().toISOString(),
        });

        return NextResponse.json({
          success: true,
          isNewOrder: true,
          orderId: rpcData.order_id,
          total_price: rpcData.total_price ?? totalPrice,
          message: 'Order created successfully',
        });
      }

      // If RPC fails/missing, fallback to direct query + insert
      if (rpcError) {
        console.warn('RPC create_order_if_allowed fallback:', rpcError.message);
        
        // Check 24-hour duplicate in Supabase directly
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { data: existingOrders } = await supabase
          .from('orders')
          .select('id, created_at')
          .eq('normalized_phone', normalizedPhone)
          .gte('created_at', twentyFourHoursAgo)
          .neq('status', 'Cancelled')
          .limit(1);

        if (existingOrders && existingOrders.length > 0) {
          recentOrdersByPhone.set(normalizedPhone, now);
          return NextResponse.json({
            success: false,
            isNewOrder: false,
            isDuplicate: true,
            message: 'لقد قمت بإرسال طلبية من قبل.',
          });
        }

        // Insert new order (using commune as address since address field is removed)
        const { data: insertedRows, error: insertError } = await supabase
          .from('orders')
          .insert({
            full_name: safeFullName,
            phone_number: phone_number,
            normalized_phone: normalizedPhone,
            wilaya: safeWilaya,
            commune: safeCommune,
            address: safeCommune,
            size: safeSize,
            product_name: PRODUCT_NAME,
            product_price: PRODUCT_PRICE,
            shipping_price: shippingPrice,
            total_price: totalPrice,
            status: 'New',
            notes: safeNotes,
          })
          .select('id, total_price')
          .single();

        if (insertError || !insertedRows) {
          console.error('Supabase Insert Error:', insertError);
          return NextResponse.json(
            { success: false, message: 'تعذر معالجة الطلب. يرجى المحاولة مرة أخرى.' },
            { status: 500 }
          );
        }

        // Genuine new order created via fallback insert.
        recentOrdersByPhone.set(normalizedPhone, now);

        // Telegram notification — fires ONLY here (real new order via fallback).
        // Never throws; a failure cannot fail the order (see telegram.ts).
        await sendOrderNotification({
          full_name: safeFullName,
          phone_number: phone_number,
          wilaya: safeWilaya,
          commune: safeCommune,
          product_price: PRODUCT_PRICE,
          shipping_price: shippingPrice,
          total_price: insertedRows.total_price ?? totalPrice,
          status: 'New',
          created_at: new Date().toISOString(),
        });

        return NextResponse.json({
          success: true,
          isNewOrder: true,
          orderId: insertedRows.id,
          total_price: insertedRows.total_price ?? totalPrice,
          message: 'Order created successfully',
        });
      }
    } else {
      // Local test mode
      console.log('Local dev order received (Supabase pending):', {
        name: safeFullName,
        phone: normalizedPhone,
        wilaya: safeWilaya,
        commune: safeCommune,
        total: totalPrice,
      });
      recentOrdersByPhone.set(normalizedPhone, now);
      return NextResponse.json({
        success: true,
        isNewOrder: true,
        total_price: totalPrice,
        message: 'Order created successfully in local mode',
      });
    }

    // Defensive fallthrough — the RPC returned neither data nor an error, so we
    // CANNOT confirm an order was actually created. Treat it as a failure:
    //  - do NOT report a new order (that would fire a false Meta Purchase),
    //  - do NOT mark the phone as "used" (let the customer retry cleanly),
    //  - no Telegram is sent because no order is confirmed.
    console.error('Order API: unexpected empty RPC result (no data, no error).');
    return NextResponse.json(
      { success: false, message: 'تعذر تأكيد الطلب. يرجى المحاولة مرة أخرى.' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Order API Critical Error:', error);
    return NextResponse.json(
      { success: false, message: 'تعذر معالجة الطلب. يرجى المحاولة مرة أخرى.' },
      { status: 500 }
    );
  }
}