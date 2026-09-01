'use client';

import { useState, useEffect } from 'react';
import { PRODUCT_PRICE, SHOPPING_STANDARD } from '@/lib/shipping';

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentShipping, setCurrentShipping] = useState<number>(SHOPPING_STANDARD);

  useEffect(() => {
    // Listen for wilaya / shipping changes from OrderForm
    const handleShippingChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ price: number | null }>;
      if (customEvent.detail && customEvent.detail.price !== null) {
        setCurrentShipping(customEvent.detail.price);
      } else {
        setCurrentShipping(SHOPPING_STANDARD);
      }
    };

    window.addEventListener('shippingChange', handleShippingChange);

    const handleScroll = () => {
      // Only active on mobile / small tablet screens (< 768px)
      if (window.innerWidth >= 768) {
        setIsVisible(false);
        return;
      }

      // Show after scrolling past top hero (e.g. 300px)
      const scrolledPastHero = window.scrollY > 300;
      
      // Hide when user reaches the order form
      const orderForm = document.getElementById('order-form');
      let isNearOrderForm = false;
      
      if (orderForm) {
        const rect = orderForm.getBoundingClientRect();
        isNearOrderForm = rect.top <= window.innerHeight - 60;
      }

      setIsVisible(scrolledPastHero && !isNearOrderForm);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('shippingChange', handleShippingChange);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scrollToOrder = () => {
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
      orderForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  const total = PRODUCT_PRICE + currentShipping;

  return (
    <aside 
      aria-label="شريط الطلب السريع" 
      className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-neutral-950/95 backdrop-blur-2xl border-t border-neutral-800 shadow-[0_-10px_35px_rgba(0,0,0,0.6)] md:hidden transition-all duration-300 animate-in slide-in-from-bottom-5"
    >
      <div className="max-w-md mx-auto flex items-center justify-between gap-3.5">
        <div className="flex flex-col">
          <span className="text-[10px] text-neutral-400 font-medium">الدفع عند الاستلام</span>
          <span className="text-base font-black text-[#E5C158] font-sans">
            {total.toLocaleString('en-US')} <span className="text-xs font-bold">دج</span>
          </span>
        </div>
        
        <button 
          onClick={scrollToOrder}
          className="flex-1 bg-gradient-to-r from-[#B8860B] via-[#E5C158] to-[#AA771C] active:from-[#A07609] active:to-[#916514] text-neutral-950 py-3.5 px-5 rounded-xl font-black text-base flex items-center justify-center gap-2 shadow-[0_2px_15px_rgba(212,175,55,0.4)] active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>اطلبي الآن — الدفع عند الاستلام</span>
          <svg className="w-4 h-4 -rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
