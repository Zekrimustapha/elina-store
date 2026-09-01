import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-white py-14 border-t border-neutral-800/80">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border border-neutral-700 bg-white mb-5 shadow-lg">
          <Image 
            src="/images/logo.jpg" 
            alt="ELINA COLLECTIONS Logo" 
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
        
        <div className="font-extrabold tracking-widest text-xl mb-2 font-sans bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
          ELINA COLLECTIONS
        </div>
        
        <p className="text-neutral-400 mb-6 max-w-sm text-sm">
          أناقة لا تُنسى وفخامة تناسب كل مناسباتك الراقية
        </p>
        
        <div className="w-full h-px bg-neutral-800/80 mb-6 max-w-xs"></div>
        
        <p className="text-xs text-neutral-500">
          جميع الحقوق محفوظة © {new Date().getFullYear()} ELINA COLLECTIONS — الدفع عند الاستلام في 58 ولاية
        </p>
      </div>
    </footer>
  );
}
