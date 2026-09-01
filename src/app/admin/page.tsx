'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Order {
  id: string;
  created_at: string;
  full_name: string;
  phone_number: string;
  normalized_phone: string;
  wilaya: string;
  commune: string;
  address: string;
  size: string;
  product_name: string;
  product_price: number;
  shipping_price: number;
  total_price: number;
  status: 'New' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  notes: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  New: { label: 'جديد', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  Confirmed: { label: 'مؤكد', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  Processing: { label: 'قيد التحضير', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  Shipped: { label: 'تم الشحن', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  Delivered: { label: 'تم التوصيل', color: 'bg-green-100 text-green-800 border-green-200' },
  Cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-800 border-red-200' },
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'orders' | 'settings'>('orders');

  const fetchOrders = async (pwd: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { 'x-admin-password': pwd },
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
        setIsAuthenticated(true);
        sessionStorage.setItem('elina_admin_auth', pwd);
      } else {
        setAuthError('كلمة المرور غير صحيحة');
      }
    } catch (err) {
      setAuthError('تعذر الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const saved = sessionStorage.getItem('elina_admin_auth');
    if (saved) {
      setPassword(saved);
      fetchOrders(saved);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    fetchOrders(password);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
        );
      }
    } catch (err) {
      alert('تعذر تحديث حالة الطلب');
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone_number?.includes(searchQuery) ||
      order.wilaya?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.commune?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.total_price || 0), 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-neutral-800">
          <div className="text-center mb-6">
            <div className="relative w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 border border-neutral-200">
              <Image src="/images/logo.jpg" alt="Logo" fill sizes="64px" className="object-cover" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">لوحة تحكم الطلبيات</h1>
            <p className="text-sm text-neutral-500 mt-1">ELINA COLLECTIONS</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center font-medium">
                {authError}
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-1.5">كلمة المرور</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200 outline-none"
                placeholder="أدخل كلمة مرور الإدارة..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-60"
            >
              {isLoading ? 'جاري الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 pb-16" dir="rtl">
      {/* Top Navbar */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-neutral-200">
              <Image src="/images/logo.jpg" alt="Logo" fill sizes="40px" className="object-cover" />
            </div>
            <div>
              <h1 className="font-extrabold text-base sm:text-lg">لوحة إدارة الطلبيات</h1>
              <span className="text-xs text-neutral-500">ELINA COLLECTIONS</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchOrders(password)}
              className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition"
              title="تحديث البيانات"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem('elina_admin_auth');
                setIsAuthenticated(false);
              }}
              className="text-xs bg-red-50 text-red-600 px-3 py-2 rounded-lg font-bold hover:bg-red-100 transition"
            >
              خروج
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm">
            <span className="text-xs text-neutral-500 font-bold block mb-1">إجمالي الطلبيات</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-sans">{orders.length}</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm">
            <span className="text-xs text-blue-600 font-bold block mb-1">طلبيات جديدة</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-sans">
              {orders.filter((o) => o.status === 'New').length}
            </span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm">
            <span className="text-xs text-green-600 font-bold block mb-1">تم التوصيل</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-green-600 font-sans">
              {orders.filter((o) => o.status === 'Delivered').length}
            </span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm">
            <span className="text-xs text-[#B8860B] font-bold block mb-1">المداخيل الإجمالية</span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#B8860B] font-sans">
              {totalRevenue.toLocaleString('en-US')} دج
            </span>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="w-full sm:w-80 relative">
            <input
              type="text"
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-neutral-300 text-sm outline-none focus:border-neutral-900"
              placeholder="البحث بالاسم، الهاتف، الولاية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {['ALL', 'New', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`text-xs font-bold px-3 py-2 rounded-xl transition ${
                  statusFilter === st
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {st === 'ALL' ? 'الكل' : statusLabels[st]?.label || st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-neutral-50 text-neutral-500 font-bold border-b border-neutral-200 text-xs">
                <tr>
                  <th className="p-4">الزبون</th>
                  <th className="p-4">رقم الهاتف</th>
                  <th className="p-4">الولاية / البلدية</th>
                  <th className="p-4">العنوان</th>
                  <th className="p-4">المجموع</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4">تاريخ الطلب</th>
                  <th className="p-4 text-center">تحديث الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-neutral-500">
                      لا توجد طلبيات مطابقة حالياً
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const statusInfo = statusLabels[order.status] || { label: order.status, color: 'bg-gray-100' };
                    return (
                      <tr key={order.id} className="hover:bg-neutral-50/70 transition">
                        <td className="p-4 font-bold text-neutral-900">{order.full_name}</td>
                        <td className="p-4 font-sans text-neutral-700 font-medium" dir="ltr">
                          <a href={`tel:${order.phone_number}`} className="text-blue-600 hover:underline">
                            {order.phone_number}
                          </a>
                        </td>
                        <td className="p-4">
                          <span className="font-bold">{order.wilaya}</span> — {order.commune}
                        </td>
                        <td className="p-4 text-neutral-600 max-w-xs truncate" title={order.address}>
                          {order.address}
                        </td>
                        <td className="p-4 font-extrabold text-[#B8860B] font-sans">
                          {order.total_price?.toLocaleString('en-US')} دج
                        </td>
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-neutral-400 font-sans">
                          {new Date(order.created_at).toLocaleString('fr-DZ')}
                        </td>
                        <td className="p-4 text-center">
                          <select
                            className="text-xs bg-white border border-neutral-300 rounded-lg px-2 py-1.5 outline-none cursor-pointer"
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          >
                            <option value="New">جديد</option>
                            <option value="Confirmed">مؤكد</option>
                            <option value="Processing">قيد التحضير</option>
                            <option value="Shipped">تم الشحن</option>
                            <option value="Delivered">تم التوصيل</option>
                            <option value="Cancelled">ملغي</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
