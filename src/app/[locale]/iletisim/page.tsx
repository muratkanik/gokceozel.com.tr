'use client';

import { useState } from 'react';

export default function IletisimPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/randevu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error('Form gönderilemedi');
      
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setStatus('error');
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-[#d4af37] tracking-tight leading-tight text-center">
          İletişim
        </h1>
        
        <div className="bg-[#141414] rounded-2xl p-8 md:p-12 border border-[#2a2a2a] grid md:grid-cols-2 gap-12 shadow-2xl">
          
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-white">Bize Ulaşın</h2>
            <div className="space-y-4 text-gray-400">
              <p>
                <strong className="block text-[#d4af37] mb-1">Adres</strong>
                Prof. Dr. Gökçe Özel Kliniği<br/>
                Ümitköy Mahallesi, Çankaya, Ankara
              </p>
              <p>
                <strong className="block text-[#d4af37] mb-1">Telefon</strong>
                <a href="tel:+905342096935" className="hover:text-white transition-colors">+90 534 209 69 35</a>
              </p>
              <p>
                <strong className="block text-[#d4af37] mb-1">E-Posta</strong>
                <a href="mailto:info@gokceozel.com.tr" className="hover:text-white transition-colors">info@gokceozel.com.tr</a>
              </p>
            </div>
          </div>
          
          <div>
            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
               <input 
                 type="text" 
                 name="name"
                 required
                 value={formData.name}
                 onChange={handleChange}
                 placeholder="Adınız Soyadınız" 
                 className="bg-[#1a1a1a] border border-[#333] rounded-lg p-3 text-white outline-none focus:border-[#d4af37] transition-colors" 
               />
               <input 
                 type="email" 
                 name="email"
                 value={formData.email}
                 onChange={handleChange}
                 placeholder="E-Posta Adresiniz (İsteğe Bağlı)" 
                 className="bg-[#1a1a1a] border border-[#333] rounded-lg p-3 text-white outline-none focus:border-[#d4af37] transition-colors" 
               />
               <input 
                 type="tel" 
                 name="phone"
                 required
                 value={formData.phone}
                 onChange={handleChange}
                 placeholder="Telefon Numaranız" 
                 className="bg-[#1a1a1a] border border-[#333] rounded-lg p-3 text-white outline-none focus:border-[#d4af37] transition-colors" 
               />
               <textarea 
                 name="message"
                 value={formData.message}
                 onChange={handleChange}
                 placeholder="Mesajınız" 
                 rows={4} 
                 className="bg-[#1a1a1a] border border-[#333] rounded-lg p-3 text-white outline-none focus:border-[#d4af37] transition-colors resize-none"
               ></textarea>
               
               <button 
                 type="submit" 
                 disabled={status === 'loading'}
                 className="bg-[#d4af37] text-black font-semibold py-3 rounded-lg hover:bg-white transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {status === 'loading' ? 'Gönderiliyor...' : 'Gönder'}
               </button>

               {status === 'success' && (
                 <p className="text-green-500 text-sm mt-2 text-center">Mesajınız başarıyla iletildi. En kısa sürede size dönüş yapacağız.</p>
               )}
               {status === 'error' && (
                 <p className="text-red-500 text-sm mt-2 text-center">Bir hata oluştu. Lütfen doğrudan telefonla ulaşmayı deneyin.</p>
               )}
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}
