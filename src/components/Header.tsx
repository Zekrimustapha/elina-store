'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-neutral-200 bg-white">
            <Image 
              src="/images/logo.jpg" 
              alt="ELINA COLLECTIONS Logo" 
              fill
              className="object-cover"
              sizes="(max-width: 768px) 40px, 48px"
            />
          </div>
          <span className={`font-bold tracking-widest text-sm md:text-base ${isScrolled ? 'text-neutral-900' : 'text-white drop-shadow-md'}`}>
            ELINA COLLECTIONS
          </span>
        </div>
      </div>
    </header>
  );
}
