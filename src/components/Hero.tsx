'use client';

import Image from 'next/image';

export default function Hero() {
  const scrollToOrder = () => {
    document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.png"
          alt="Ensemble Elegance - Collection 2026"
          fill
          priority
          className="object-cover object-center scale-105 transition-transform duration-1000"
          sizes="100vw"
        />
        {/* Layered Luxury Gradient Overlays for perfect legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/65 to-neutral-950/50"></div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/80"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-10 flex flex-col items-center text-center max-w-4xl">
        
        {/* Brand & Urgency Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-5">
          <span className="bg-black/60 backdrop-blur-md text-[#E5C158] border border-[#D4AF37]/50 font-sans tracking-[0.25em] uppercase text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-lg">
            ELINA COLLECTIONS
          </span>
          <span className="bg-red-600/90 text-white text-xs sm:text-sm font-extrabold px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            تخفيض لفترة محدودة
          </span>
        </div>
        
        {/* Main Headings */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 leading-tight tracking-tight">
          <span className="block font-sans font-light tracking-wide text-2xl sm:text-3xl md:text-4xl text-neutral-200 mb-1">
            Ensemble Elegance
          </span>
          <span className="bg-gradient-to-r from-white via-neutral-100 to-[#F3E5AB] bg-clip-text text-transparent">
            Collection 2026
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-neutral-200 mb-8 max-w-2xl font-light leading-relaxed">
          أناقة لا تُنسى وفخامة راقية تبرز جمالك في كل مناسبة وسهرة خاصة
        </p>
        
        {/* Luxury Glass Price Card */}
        <div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-700/80 rounded-3xl p-6 sm:p-7 mb-8 w-full max-w-md shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          <div className="flex justify-center items-center gap-3 mb-2">
            <span className="text-neutral-400 line-through text-lg sm:text-xl font-sans font-medium">
              6,500 دج
            </span>
            <span className="bg-[#B8860B]/20 text-[#E5C158] border border-[#D4AF37]/40 text-xs sm:text-sm font-bold px-3 py-1 rounded-full">
              وفري 3,100 دج اليوم
            </span>
          </div>
          
          <div className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-1 font-sans tracking-tight">
            3,400 <span className="text-2xl sm:text-3xl font-bold text-[#E5C158]">دج</span>
          </div>
          
          <p className="text-xs sm:text-sm text-neutral-400 mt-2">
            + توصيل سريع حتى باب منزلك في 58 ولاية
          </p>
        </div>
        
        {/* Luxury CTA Button with Pulse/Shimmer effect */}
        <div className="w-full max-w-md mb-8">
          <button 
            onClick={scrollToOrder}
            className="w-full bg-gradient-to-r from-[#B8860B] via-[#E5C158] to-[#AA771C] hover:from-[#A07609] hover:to-[#916514] text-neutral-950 py-4 sm:py-5 px-8 rounded-2xl text-xl sm:text-2xl font-black shadow-[0_0_30px_rgba(212,175,55,0.45)] hover:shadow-[0_0_40px_rgba(212,175,55,0.65)] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-3 group relative overflow-hidden"
          >
            {/* Shimmer Light Reflection Effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            
            <span className="relative z-10">اطلبي الآن — الدفع عند الاستلام</span>
            <svg className="w-6 h-6 -rotate-90 relative z-10 transition-transform group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
        
        {/* Minimalist Trust Badges */}
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-neutral-200 text-xs sm:text-sm md:text-base font-medium">
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10">
            <svg className="w-5 h-5 text-[#E5C158]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>الدفع عند الاستلام</span>
          </div>

          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10">
            <svg className="w-5 h-5 text-[#E5C158]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>توصيل سريع لـ 58 ولاية</span>
          </div>

          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10">
            <svg className="w-5 h-5 text-[#E5C158]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>معاينة الفستان قبل الدفع</span>
          </div>
        </div>

      </div>
    </section>
  );
}
