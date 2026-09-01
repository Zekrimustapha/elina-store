'use client';

export default function OfferSection() {
  const scrollToOrder = () => {
    document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="section-padding bg-black text-white relative overflow-hidden">
      {/* Background Lighting Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto relative z-10 max-w-5xl">
        <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 rounded-3xl p-8 sm:p-12 md:p-14 shadow-2xl border border-neutral-800 relative overflow-hidden">
          
          {/* Top Tag */}
          <div className="flex justify-center md:justify-start mb-6">
            <span className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#E5C158] text-xs sm:text-sm font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#E5C158] animate-ping"></span>
              عرض محدود — تخفيض 48% لهذا الأسبوع فقط
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            
            {/* Left Content */}
            <div className="text-center md:text-right flex-1 space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                احصلي على إطلالتك المميزة بسعر استثنائي
              </h2>
              
              <p className="text-neutral-300 text-base sm:text-lg leading-relaxed max-w-xl">
                فستان <strong>Ensemble Elegance - Collection 2026</strong> الأصلي يجمع بين النعومة والفخامة مع تصميم الكتف الواحد الأنيق.
              </p>
              
              <div className="pt-2 space-y-3 inline-block text-right">
                <div className="flex items-center gap-3 text-neutral-200 text-sm sm:text-base">
                  <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#E5C158]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>توصيل لباب المنزل في 58 ولاية</span>
                </div>

                <div className="flex items-center gap-3 text-neutral-200 text-sm sm:text-base">
                  <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#E5C158]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>الدفع نقداً عند استلام الطلبية</span>
                </div>

                <div className="flex items-center gap-3 text-neutral-200 text-sm sm:text-base">
                  <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#E5C158]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>إمكانية معاينة الفستان مع رجل التوصيل</span>
                </div>
              </div>
            </div>
            
            {/* Right Price Card */}
            <div className="bg-neutral-950/80 backdrop-blur-md rounded-3xl p-7 sm:p-9 text-center flex-1 w-full max-w-sm border border-neutral-700/80 shadow-2xl">
              <span className="text-neutral-400 line-through text-xl sm:text-2xl font-sans block mb-1">
                6,500 دج
              </span>
              
              <div className="text-5xl sm:text-6xl font-black text-white mb-2 font-sans tracking-tight">
                3,400 <span className="text-2xl font-bold text-[#E5C158]">دج</span>
              </div>
              
              <div className="bg-[#B8860B]/25 text-[#E5C158] border border-[#D4AF37]/40 font-bold text-sm py-2 px-4 rounded-xl mb-7 inline-block">
                وفرتِ 3,100 دج في هذا الطلب
              </div>
              
              <button 
                onClick={scrollToOrder}
                className="w-full bg-gradient-to-r from-[#B8860B] via-[#E5C158] to-[#AA771C] hover:from-[#A07609] hover:to-[#916514] text-neutral-950 font-black text-lg sm:text-xl py-4 rounded-2xl shadow-[0_4px_25px_rgba(212,175,55,0.35)] active:scale-[0.98] transition-all cursor-pointer"
              >
                اطلبي الآن قبل نفاد الكمية
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
