'use client';

import { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { wilayas, getCommunesByWilaya } from '@/lib/algeria-data';
import { PRODUCT_PRICE, getShippingPrice } from '@/lib/shipping';
import SuccessModal from './SuccessModal';
import DuplicateModal from './DuplicateModal';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

interface FormData {
  fullName: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  notes: string;
  website_hp: string; // Honeypot field for bot detection
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  wilaya?: string;
  commune?: string;
  address?: string;
  general?: string;
}

export default function OrderForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    wilaya: '',
    commune: '',
    address: '',
    notes: '',
    website_hp: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingPrice, setShippingPrice] = useState<number | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDuplicate, setShowDuplicate] = useState(false);

  // Guards Purchase against double-firing for a single confirmed order.
  const purchaseFiredRef = useRef(false);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const isTurnstileConfigured = Boolean(
    siteKey &&
    !siteKey.startsWith('your_') &&
    !siteKey.includes('placeholder') &&
    siteKey.length > 10
  );

  const availableCommunes = formData.wilaya ? getCommunesByWilaya(formData.wilaya) : [];
  const selectedWilayaDisplay = formData.wilaya ? formData.wilaya : '58 ولاية';

  useEffect(() => {
    // Render Turnstile widget ONLY if real site key is configured
    if (isTurnstileConfigured && typeof window !== 'undefined' && (window as any).turnstile) {
      try {
        (window as any).turnstile.render('#turnstile-widget', {
          sitekey: siteKey,
          callback: function (token: string) {
            setTurnstileToken(token);
          },
        });
      } catch (e) {
        console.warn('Turnstile init:', e);
      }
    }
  }, [isTurnstileConfigured, siteKey]);

  const handleWilayaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wilayaStr = e.target.value;
    setFormData((prev) => ({ ...prev, wilaya: wilayaStr, commune: '' }));
    
    if (errors.wilaya) {
      setErrors((prev) => ({ ...prev, wilaya: undefined }));
    }

    if (wilayaStr) {
      const price = getShippingPrice(wilayaStr);
      setShippingPrice(price);
      
      // Dispatch custom event for StickyCTA dynamic price update
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('shippingChange', { detail: { price, wilayaCode: wilayaStr } }));
      }
    } else {
      setShippingPrice(null);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('shippingChange', { detail: { price: null, wilayaCode: '' } }));
      }
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      newErrors.fullName = 'يرجى إدخال الاسم واللقب بشكل صحيح';
    }
    
    // Normalize and validate Algerian phone (05, 06, 07 + 8 digits)
    const rawPhone = formData.phone.replace(/[\s\-\.\(\)]/g, '');
    const isAlgiersPhone = /^(0|\+213|00213)?[567]\d{8}$/.test(rawPhone);
    if (!formData.phone.trim() || !isAlgiersPhone) {
      newErrors.phone = 'يرجى إدخال رقم هاتف جزائري صالح (05 / 06 / 07)';
    }
    
    if (!formData.wilaya) {
      newErrors.wilaya = 'يرجى اختيار الولاية';
    }
    
    if (!formData.commune) {
      newErrors.commune = 'يرجى اختيار البلدية';
    }
    
    if (!formData.address.trim() || formData.address.trim().length < 3) {
      newErrors.address = 'يرجى كتابة عنوان التوصيل بالتفصيل';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (isSubmitting) return;

  // Basic client-side required-field check
  if (
    !formData.fullName.trim() ||
    !formData.phone.trim() ||
    !formData.wilaya ||
    !formData.commune
  ) {
    setErrors({
      fullName: !formData.fullName.trim()
        ? 'الرجاء إدخال الاسم الكامل'
        : undefined,
      phone: !formData.phone.trim()
        ? 'الرجاء إدخال رقم الهاتف'
        : undefined,
      wilaya: !formData.wilaya
        ? 'الرجاء اختيار الولاية'
        : undefined,
      commune: !formData.commune
        ? 'الرجاء اختيار البلدية'
        : undefined,
    });

    return;
  }

  // Honeypot: silently reject automated submissions
  if (formData.website_hp) {
    return;
  }

  // Full validation
  if (!validate()) {
    return;
  }

  setIsSubmitting(true);
  setErrors({});

  try {
    const res = await fetch('/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        full_name: formData.fullName,
        phone_number: formData.phone,
        wilaya: formData.wilaya,
        commune: formData.commune,
        address: formData.address,
        notes: formData.notes,
        website_hp: formData.website_hp,
        turnstileToken: turnstileToken || undefined,
      }),
    });

    const data = await res.json();

    /*
     * IMPORTANT:
     * A duplicate request is NOT a successful purchase.
     * The API explicitly tells us when the phone number
     * already has an order within the protected period.
     */
    if (data.isDuplicate) {
      setShowDuplicate(true);
      return;
    }

    /*
     * Any other failed response is NOT a purchase.
     */
    if (!res.ok || !data.success) {
      throw new Error(
        data.message || 'حدث خطأ أثناء إرسال الطلب'
      );
    }

    /*
     * PURCHASE EVENT — single source of truth.
     *
     * Fires ONLY when the backend explicitly confirms a genuinely
     * created NEW order (data.isNewOrder === true). This is NOT the
     * same as res.ok or data.success:
     *   - New order        → isNewOrder true  → Purchase fires (once)
     *   - Duplicate        → handled above    → Purchase does NOT fire
     *   - Bot / honeypot   → isNewOrder false  → Purchase does NOT fire
     *   - Validation error → data.success false → Purchase does NOT fire
     *   - Database failure → data.success false → Purchase does NOT fire
     *
     * The value comes from the server-confirmed order total (per-wilaya),
     * never a hardcoded amount. A ref guard prevents any double-fire
     * within the same submission flow.
     */
    if (
      data.isNewOrder === true &&
      !purchaseFiredRef.current &&
      typeof window !== 'undefined' &&
      typeof window.fbq === 'function'
    ) {
      purchaseFiredRef.current = true;

      const totalValue =
        typeof data.total_price === 'number'
          ? data.total_price
          : PRODUCT_PRICE + (shippingPrice ?? getShippingPrice(formData.wilaya));

      window.fbq('track', 'Purchase', {
        value: totalValue,
        currency: 'DZD',
        content_name: 'Ensemble Elegance - Collection 2026',
        content_type: 'product',
      });
    }

    // Show success popup only after successful order creation.
    // The modal is a UI concern and is intentionally decoupled from
    // Purchase tracking above.
    if (data.isNewOrder === true) {
      setShowSuccess(true);
    }

  } catch (error: any) {
    console.error('Submission error:', error);

    setErrors({
      general:
        error?.message ||
        'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
    });

  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <section id="order-form" className="py-16 md:py-24 bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-white relative overflow-hidden">
      {/* Subtle Luxury Background Glow */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-[#B8860B]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-[#B8860B]/20 text-[#E5C158] border border-[#B8860B]/40 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-3 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#E5C158] animate-ping"></span>
            الدفع عند الاستلام — توصيل سريع لـ 58 ولاية
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            استمارة طلب الفستان
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto rounded-full mt-3"></div>
          <p className="text-neutral-400 text-sm md:text-base mt-3 leading-relaxed">
            املئي الاستمارة لتصلك الطلبية حتى باب منزلك مع إمكانية المعاينة قبل الدفع
          </p>
        </div>
        
        {/* Card Form */}
        <div className="bg-neutral-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-800 relative">
          
          {errors.general && (
            <div className="mb-6 p-4 bg-red-950/80 border border-red-500/50 text-red-300 rounded-2xl text-center text-sm font-medium">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            
            {/* Honeypot Invisible Field */}
            <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
              <input
                type="text"
                name="website_hp"
                tabIndex={-1}
                autoComplete="off"
                value={formData.website_hp}
                onChange={(e) => handleInputChange('website_hp', e.target.value)}
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-neutral-200 mb-2">
                الاسم واللقب <span className="text-[#D4AF37]">*</span>
              </label>
              <input
                type="text"
                required
                className={`w-full min-h-[52px] px-4 py-3.5 rounded-xl border text-white bg-neutral-950/70 transition-all text-base outline-none ${
                  errors.fullName
                    ? 'border-red-500 bg-red-950/30 focus:ring-2 focus:ring-red-500/20'
                    : 'border-neutral-700 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20'
                }`}
                placeholder="مثال: مريم بوعلام"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
              />
              {errors.fullName && <p className="mt-1.5 text-xs font-medium text-red-400">{errors.fullName}</p>}
            </div>

            {/* Phone Number */}
<div>
  <label className="block text-sm font-bold text-neutral-200 mb-2">
    رقم الهاتف <span className="text-[#D4AF37]">*</span>
  </label>

  <input
    type="tel"
    inputMode="numeric"
    pattern="[0-9]*"
    maxLength={10}
    required
    dir="ltr"
    className={`w-full text-right min-h-[52px] px-4 py-3.5 rounded-xl border text-white bg-neutral-950/70 transition-all text-base outline-none font-sans ${
      errors.phone
        ? 'border-red-500 bg-red-950/30 focus:ring-2 focus:ring-red-500/20'
        : 'border-neutral-700 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20'
    }`}
    placeholder="06XXXXXXXX"
    value={formData.phone}
    onChange={(e) => {
      const numbersOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
      handleInputChange('phone', numbersOnly);
    }}
  />

  {errors.phone && (
    <p className="mt-1.5 text-xs font-medium text-red-400">
      {errors.phone}
    </p>
  )}
</div>

            {/* Wilaya & Commune Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Wilaya */}
              <div>
                <label className="block text-sm font-bold text-neutral-200 mb-2">
                  الولاية <span className="text-[#D4AF37]">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    className={`w-full min-h-[52px] px-4 py-3.5 rounded-xl border text-white bg-neutral-950/70 transition-all text-base outline-none appearance-none cursor-pointer ${
                      errors.wilaya
                        ? 'border-red-500 bg-red-950/30 focus:ring-2 focus:ring-red-500/20'
                        : 'border-neutral-700 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20'
                    }`}
                    value={formData.wilaya}
                    onChange={handleWilayaChange}
                  >
                    <option value="" className="bg-neutral-900 text-gray-400">اختر الولاية (58 ولاية)</option>
                    {wilayas.map((wilayaStr) => (
                      <option key={wilayaStr} value={wilayaStr} className="bg-neutral-900 text-white">
                        {wilayaStr}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.wilaya && <p className="mt-1.5 text-xs font-medium text-red-400">{errors.wilaya}</p>}
              </div>

              {/* Commune */}
              <div>
                <label className="block text-sm font-bold text-neutral-200 mb-2">
                  البلدية <span className="text-[#D4AF37]">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    disabled={!formData.wilaya}
                    className={`w-full min-h-[52px] px-4 py-3.5 rounded-xl border text-white bg-neutral-950/70 transition-all text-base outline-none appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                      errors.commune
                        ? 'border-red-500 bg-red-950/30 focus:ring-2 focus:ring-red-500/20'
                        : 'border-neutral-700 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20'
                    }`}
                    value={formData.commune}
                    onChange={(e) => handleInputChange('commune', e.target.value)}
                  >
                    <option value="" className="bg-neutral-900 text-gray-400">
                      {formData.wilaya ? 'اختر البلدية' : 'اختر الولاية أولاً'}
                    </option>
                    {availableCommunes.map((communeStr, index) => (
                      <option key={`${communeStr}-${index}`} value={communeStr} className="bg-neutral-900 text-white">
                        {communeStr}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.commune && <p className="mt-1.5 text-xs font-medium text-red-400">{errors.commune}</p>}
              </div>
            </div>

            {/* Detailed Address */}
            

            {/* Size reassurance notice */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-200/90 text-xs sm:text-sm flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0 text-[#E5C158]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="leading-relaxed">
                <strong>تأكيد المقاس:</strong> سيتصل بك فريقنا هاتفياً بعد إرسال الطلب لاختيار وتأكيد المقاس المثالي لك قبل التوصيل.
              </span>
            </div>

            {/* Dynamic Price Summary Box */}
            <div className="p-5 bg-black/60 rounded-2xl space-y-3.5 mt-6 border border-neutral-800">
              <div className="flex justify-between items-center text-neutral-300 text-sm">
                <span>سعر الفستان:</span>
                <span className="font-bold text-white font-sans text-base">
                  {PRODUCT_PRICE.toLocaleString('en-US')} دج
                </span>
              </div>
              
              <div className="flex justify-between items-center text-neutral-300 text-sm">
                <span>توصيل للمنزل ({selectedWilayaDisplay}):</span>
                <span className="font-bold font-sans text-base text-[#E5C158]">
                  {shippingPrice !== null ? `${shippingPrice.toLocaleString('en-US')} دج` : 'اختر الولاية لتحديد السعر'}
                </span>
              </div>
              
              <div className="border-t border-neutral-800 pt-3.5 flex justify-between items-center text-base sm:text-lg font-bold">
                <span className="text-white">المجموع الإجمالي:</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#D4AF37] font-sans">
                  {shippingPrice !== null
                    ? `${(PRODUCT_PRICE + shippingPrice).toLocaleString('en-US')} دج`
                    : `${PRODUCT_PRICE.toLocaleString('en-US')} دج + التوصيل`}
                </span>
              </div>
            </div>

            {/* Cloudflare Turnstile (only if configured) */}
            {isTurnstileConfigured && (
              <div className="flex justify-center my-2">
                <div id="turnstile-widget" className="cf-turnstile" />
              </div>
            )}

            {/* Submit CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#AA771C] hover:from-[#A07609] hover:to-[#916514] text-neutral-950 py-4 px-6 rounded-2xl font-black text-lg sm:text-xl shadow-[0_4px_25px_rgba(212,175,55,0.35)] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed min-h-[60px] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <svg className="animate-spin h-6 w-6 text-neutral-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="font-bold">جاري تأكيد الطلب...</span>
                </div>
              ) : (
                <span className="tracking-wide">تأكيد الطلب — الدفع عند الاستلام</span>
              )}
            </button>
            
            {/* Reassurance Footer */}
            <div className="text-center pt-2 text-xs text-neutral-400 flex items-center justify-center gap-1.5">
              <svg className="w-4 h-4 text-green-500 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>تسوق آمن 100% — لا تدفعي أي مبلغ حتى تستلمي فستانك وتتأكدي منه</span>
            </div>

          </form>
        </div>
      </div>

      {isTurnstileConfigured && (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
      )}
      
      {/* Popups / Modals */}
      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} />
      <DuplicateModal isOpen={showDuplicate} onClose={() => setShowDuplicate(false)} />
    </section>
  );
}