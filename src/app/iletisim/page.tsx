export default function IletisimPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-[#d4af37] tracking-tight leading-tight text-center">
          İletişim
        </h1>
        
        <div className="bg-[#141414] rounded-2xl p-8 md:p-12 border border-[#2a2a2a] grid md:grid-cols-2 gap-12">
          
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-white">Bize Ulaşın</h2>
            <div className="space-y-4 text-gray-400">
              <p>
                <strong className="block text-[#d4af37] mb-1">Adres</strong>
                Prof. Dr. Gökçe Özel Kliniği<br/>
                Kavaklıdere Mahallesi, Ankara
              </p>
              <p>
                <strong className="block text-[#d4af37] mb-1">Telefon</strong>
                <a href="tel:+905330000000" className="hover:text-white">+90 533 000 00 00</a>
              </p>
              <p>
                <strong className="block text-[#d4af37] mb-1">E-Posta</strong>
                <a href="mailto:info@gokceozel.com.tr" className="hover:text-white">info@gokceozel.com.tr</a>
              </p>
            </div>
          </div>
          
          <div>
            <form className="space-y-4 flex flex-col">
               <input type="text" placeholder="Adınız Soyadınız" className="bg-[#1a1a1a] border border-[#333] rounded-lg p-3 text-white outline-none focus:border-[#d4af37] transition-colors" />
               <input type="email" placeholder="E-Posta Adresiniz" className="bg-[#1a1a1a] border border-[#333] rounded-lg p-3 text-white outline-none focus:border-[#d4af37] transition-colors" />
               <input type="tel" placeholder="Telefon Numaranız" className="bg-[#1a1a1a] border border-[#333] rounded-lg p-3 text-white outline-none focus:border-[#d4af37] transition-colors" />
               <textarea placeholder="Mesajınız" rows={4} className="bg-[#1a1a1a] border border-[#333] rounded-lg p-3 text-white outline-none focus:border-[#d4af37] transition-colors resize-none"></textarea>
               <button type="button" className="bg-[#d4af37] text-black font-semibold py-3 rounded-lg hover:bg-white transition-colors mt-2">
                 Gönder
               </button>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}
