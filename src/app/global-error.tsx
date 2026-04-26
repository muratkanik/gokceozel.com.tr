'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-[#0a0908] text-paper font-sans flex items-center justify-center min-h-screen">
        <div className="text-center px-6">
          <h1 className="text-6xl font-serif text-gold-soft mb-6">500</h1>
          <h2 className="text-2xl font-serif mb-4">Kritik Bir Hata Oluştu</h2>
          <p className="text-[#9a8f7c] mb-8 max-w-md mx-auto">
            Beklenmeyen bir sistem hatası meydana geldi. Lütfen sayfayı yenilemeyi deneyin veya daha sonra tekrar dönün.
          </p>
          <button
            onClick={() => reset()}
            className="bg-gold text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-gold-soft transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </body>
    </html>
  );
}
