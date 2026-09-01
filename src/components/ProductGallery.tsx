import Image from 'next/image';

export default function ProductGallery() {
  return (
    <section className="section-padding bg-neutral-900 text-white relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <span className="text-[#E5C158] font-bold text-xs uppercase tracking-widest block mb-2">
            معرض الصور الحقيقي
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            تفاصيل فستان Ensemble Elegance
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto rounded-full mt-4"></div>
          <p className="text-neutral-400 text-sm md:text-base mt-3">
            صور حية وأصلية للفستان توضح جمال القماش والتفاصيل الأنيقة
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-4 md:gap-6">
          
          {/* Main Showcase Image */}
          <div className="col-span-2 md:col-span-7 relative h-[420px] sm:h-[520px] md:h-[650px] rounded-3xl overflow-hidden group shadow-2xl border border-neutral-800 bg-neutral-950">
            <Image
              src="/images/model-1.png"
              alt="Ensemble Elegance - تفاصيل الفستان"
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80"></div>
            <div className="absolute bottom-5 right-5 left-5 z-10 flex items-center justify-between">
              <span className="bg-black/60 backdrop-blur-md text-[#E5C158] border border-[#D4AF37]/30 text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full">
                قصّة الكتف الواحد الراقية
              </span>
            </div>
          </div>
          
          {/* Right Column Stack */}
          <div className="col-span-2 md:col-span-5 flex flex-col gap-4 md:gap-6">
            {/* Image 2 */}
            <div className="relative h-[300px] md:h-[310px] rounded-3xl overflow-hidden group shadow-xl border border-neutral-800 bg-neutral-950">
              <Image
                src="/images/model-2.png"
                alt="Ensemble Elegance - إطلالة كاملة"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <span className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full border border-white/10">
                إطلالة كاملة وأنيقة
              </span>
            </div>
            
            {/* Image 3 */}
            <div className="relative h-[300px] md:h-[310px] rounded-3xl overflow-hidden group shadow-xl border border-neutral-800 bg-neutral-950">
              <Image
                src="/images/model-3.png"
                alt="Ensemble Elegance - قماش ناعم وخفيف"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <span className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full border border-white/10">
                قماش أسود ملكي فخم
              </span>
            </div>
          </div>

          {/* Wide Feature Image */}
          <div className="col-span-2 md:col-span-12 relative h-[380px] sm:h-[480px] md:h-[550px] rounded-3xl overflow-hidden group shadow-2xl border border-neutral-800 bg-neutral-950 mt-2">
            <Image
              src="/images/model-4.png"
              alt="Ensemble Elegance - Collection 2026"
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90"></div>
            <div className="absolute bottom-6 right-6 z-10">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                تألقي بثقة في كل مناسبة
              </h3>
              <p className="text-neutral-300 text-xs sm:text-sm">
                تصميم يجمع بين الراحة المطلقة والجاذبية الاستثنائية
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
