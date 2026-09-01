export default function Benefits() {
  const benefitsList = [
    {
      id: 1,
      title: "تصميم كتف واحد مميز",
      desc: "قصّة عصرية وجذابة تبرز أنوثتك وتمنحك حضوراً ساحراً في أي سهرة أو مناسبة خاصة.",
      icon: (
        <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      id: 2,
      title: "قماش فاخر وانسيابي",
      desc: "خامة ناعمة ومريحة تتكيف مع حركة الجسم ولا تسبب أي إزعاج حتى مع ارتدائه طوال السهرة.",
      icon: (
        <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      )
    },
    {
      id: 3,
      title: "قصّة نحت القوام (Ruched)",
      desc: "تفاصيل الثنيات الجانبية الأنيقة تساعد على إبراز الخصر وإخفاء العيوب بإتقان لتبدين بأجمل مظهر.",
      icon: (
        <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: 4,
      title: "مثالي لجميع المناسبات",
      desc: "اختيار مثالي لحفلات الزفاف، الخطوبة، أعياد الميلاد، والخروجات المسائية الراقية.",
      icon: (
        <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
        </svg>
      )
    },
    {
      id: 5,
      title: "سهل التنسيق مع الإكسسوارات",
      desc: "اللون الأسود الملكي يتناسق بكل سهولة مع المجوهرات الذهبية أو الفضية وحقائب السهرة.",
      icon: (
        <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    },
    {
      id: 6,
      title: "خياطة دقيقة ومتقنة",
      desc: "تشطيبات فائقة الجودة لضمان متانة الفستان وثبات تفاصيله مع كل استخدام وغسيل.",
      icon: (
        <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ];

  return (
    <section className="section-padding bg-neutral-950 text-white border-t border-neutral-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <span className="text-[#E5C158] font-bold text-xs uppercase tracking-widest block mb-2">مميزات لا مثيل لها</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            لماذا تختارين هذا الفستان؟
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto rounded-full mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {benefitsList.map((benefit) => (
            <div 
              key={benefit.id} 
              className="bg-neutral-900/70 border border-neutral-800 rounded-3xl p-7 flex flex-col items-start hover:border-[#D4AF37]/50 hover:bg-neutral-900 transition-all duration-300 shadow-lg"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center mb-5 shadow-inner">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
