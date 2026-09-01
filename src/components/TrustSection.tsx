export default function TrustSection() {
  const trustItems = [
    {
      id: 1,
      title: "الدفع عند الاستلام",
      desc: "استلمي فستانك وعاينيه أولاً ثم ادفعي بثقة تامة",
      icon: (
        <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 2,
      title: "توصيل سريع لـ 58 ولاية",
      desc: "شحن مضمون ومباشر إلى باب منزلك في جميع ولايات الجزائر",
      icon: (
        <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      id: 3,
      title: "معاينة قبل الدفع",
      desc: "يمكنك التحقق من القماش والمقاس مع رجل التوصيل",
      icon: (
        <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    {
      id: 4,
      title: "جودة أصلية مضمونة 100%",
      desc: "قماش فاخر وخياطة متقنة بأعلى معايير الأناقة العصرية",
      icon: (
        <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-16 bg-neutral-900 border-t border-neutral-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="text-center mb-10">
          <span className="text-[#E5C158] font-bold text-xs uppercase tracking-widest block mb-1">ضماناتنا لك</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">لماذا تتسوقين وأنتِ مطمئنة معنا؟</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item) => (
            <div 
              key={item.id} 
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 hover:border-[#D4AF37]/40 transition-colors"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-4 shadow-inner">
                {item.icon}
              </div>
              <h3 className="font-extrabold text-white text-base mb-2">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
