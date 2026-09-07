import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

// Simple password verification from header or body
function verifyAdminAuth(request: Request): boolean {
  const authHeader = request.headers.get('x-admin-password');
  const configuredPassword = process.env.ADMIN_PASSWORD || 'admin123';
  return authHeader === configuredPassword;
}

export async function GET(request: Request) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 });
  }

  const supabase = getServiceSupabase();
  if (!supabase) {
    return NextResponse.json({ 
      success: true, 
      orders: [], 
      note: 'Supabase credentials not configured in .env.local' 
    });
  }

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, orders: orders || [] });
}

export async function PATCH(request: Request) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || !body.orderId || !body.status) {
    return NextResponse.json({ success: false, message: 'بيانات غير مكتملة' }, { status: 400 });
  }

  // Active statuses the admin can set, plus legacy values still accepted so
  // historical orders can be re-saved without being rejected.
  const validStatuses = [
    'New',
    'Confirmed',
    'NoAnswer1',
    'NoAnswer2',
    'NoAnswer3',
    'Cancelled',
    // legacy (historical compatibility):
    'Processing',
    'Shipped',
    'Delivered',
  ];
  if (!validStatuses.includes(body.status)) {
    return NextResponse.json({ success: false, message: 'حالة غير صالحة' }, { status: 400 });
  }

  const supabase = getServiceSupabase();
  if (!supabase) {
    return NextResponse.json({ success: true, message: 'Updated locally' });
  }

  const { error } = await supabase
    .from('orders')
    .update({ status: body.status, notes: body.notes || '' })
    .eq('id', body.orderId);

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'تم تحديث حالة الطلب' });
}
