'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mb-8">
        <svg className="w-10 h-10 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-3xl font-serif text-paper mb-4">Bir Şeyler Yanlış Gitti</h2>
      <p className="text-[#9a8f7c] mb-8 max-w-md mx-auto">
        İstediğiniz sayfayı yüklerken beklenmeyen bir hata oluştu. Sorunu çözmek için çalışıyoruz.
      </p>
      <button
        onClick={() => reset()}
        className="bg-gold text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-gold-soft transition-colors shadow-lg shadow-gold/20"
      >
        Sayfayı Yenile
      </button>
    </div>
  );
}
