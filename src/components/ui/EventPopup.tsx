'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface EventPopupProps {
  title: string;
  body: string;
  imageUrl?: string;
  isNationalDay?: boolean;
}

export default function EventPopup({ title, body, imageUrl, isNationalDay = false }: EventPopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user has already closed the popup today
    const closed = sessionStorage.getItem('eventPopupClosed');
    if (!closed) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('eventPopupClosed', 'true');
  };

  if (isNationalDay) {
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
          >
            ✕
          </button>
          
          <div className="relative h-48 w-full bg-[#E30A17]">
            {/* 23 Nisan / Dynamic Theme Image */}
            <Image 
              src={imageUrl || "https://images.unsplash.com/photo-1558025211-1db5e324c431?q=80&w=1200&auto=format&fit=crop"}
              alt="Etkinlik Görseli"
              fill
              className="object-cover opacity-80"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
            
            {/* Logo and Name */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-full bg-white p-2 shadow-xl border-2 border-white">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <Image src="/images/logo.png" alt="Prof. Dr. Gökçe Özel" width={56} height={56} className="w-12 h-12 object-contain" />
                </div>
              </div>
              <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#E30A17] shadow-md">
                Prof. Dr. Gökçe Özel
              </span>
            </div>
          </div>
          
          <div className="pt-20 pb-8 px-8 text-center">
            <h3 className="text-2xl font-serif font-bold text-[#E30A17] mb-3 leading-tight">
              {title}
            </h3>
            <p className="text-slate-600 text-[15px] leading-relaxed mb-6 font-medium">
              {body}
            </p>
            <button 
              onClick={handleClose}
              className="bg-[#E30A17] text-white px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-[#C00000] transition-colors shadow-lg shadow-red-500/30"
            >
              Teşekkürler
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Generic small popup
  return (
    <div className="fixed bottom-6 right-6 z-[1000] p-6 rounded-2xl max-w-xs bg-[#1a1410]/90 backdrop-blur-md border border-[#b8893c]/30 shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
      <h4 className="bg-gradient-to-br from-[#f0d48e] via-[#b8893c] to-[#8f6b2e] bg-clip-text text-transparent font-serif text-lg font-bold mb-3">
        {title}
      </h4>
      <p className="text-sm text-[#e9e4d8]/80 leading-relaxed mb-4">{body}</p>
      <button 
        onClick={handleClose}
        className="text-xs font-bold tracking-widest uppercase text-[#b8893c] hover:text-white transition-colors"
      >
        Kapat
      </button>
    </div>
  );
}
