import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function saveFaq(formData: FormData) {
  'use server';
  const id = formData.get('id') as string | null;
  const question = (formData.get('question') as string).trim();
  const answer = (formData.get('answer') as string).trim();
  const keywords = (formData.get('keywords') as string || '').trim();
  const category = (formData.get('category') as string || 'genel').trim();
  if (!question || !answer) return;
  if (id) {
    await prisma.chatFaq.update({ where: { id }, data: { question, answer, keywords, category } });
  } else {
    await prisma.chatFaq.create({ data: { question, answer, keywords, category } });
  }
  revalidatePath('/admin/sohbet-sss');
  redirect('/admin/sohbet-sss');
}

async function deleteFaq(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  if (!id) return;
  await prisma.chatFaq.delete({ where: { id } });
  revalidatePath('/admin/sohbet-sss');
}

async function toggleFaq(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  const current = formData.get('isActive') === 'true';
  await prisma.chatFaq.update({ where: { id }, data: { isActive: !current } });
  revalidatePath('/admin/sohbet-sss');
}

const CATEGORIES = ['genel', 'rinoplasti', 'botoks', 'dolgu', 'blefaroplasti', 'otoplasti', 'facelift', 'fiyat', 'randevu', 'iyileşme'];

export default async function SohbetSSSPage() {
  const faqs = await prisma.chatFaq.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#17201e]">Chatbot Soru-Cevap Yönetimi</h1>
        <p className="text-[#61706b] text-sm mt-1">
          Burada tanımladığınız cevaplar yapay zekanın genel bilgisinden önce kullanılır. Müşterilere kesin, tutarlı yanıtlar vermek için en sık sorulan soruları ekleyin.
        </p>
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
          <strong>Öncelik sırası:</strong> 1. Bu sayfadaki tanımlı cevaplar → 2. Site içeriği → 3. Yapay zekanın genel bilgisi
        </div>
      </div>

      {/* Add new FAQ */}
      <div className="bg-white border border-[#e8e1d4] rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-base font-semibold text-[#17201e] mb-5">Yeni Soru-Cevap Ekle</h2>
        <form action={saveFaq} className="flex flex-col gap-4">
          <input type="hidden" name="id" value="" />
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#61706b] uppercase tracking-wider mb-1.5">Soru</label>
              <input
                type="text" name="question" required
                placeholder="örn: Rinoplasti ne kadar sürer?"
                className="w-full p-2.5 rounded-lg border border-[#e8e1d4] focus:ring-2 focus:ring-[#b8893c]/30 focus:border-[#b8893c] outline-none text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#61706b] uppercase tracking-wider mb-1.5">Cevap</label>
              <textarea
                name="answer" required rows={3}
                placeholder="Chatbot'un bu soruya vereceği kesin yanıt…"
                className="w-full p-2.5 rounded-lg border border-[#e8e1d4] focus:ring-2 focus:ring-[#b8893c]/30 focus:border-[#b8893c] outline-none text-sm resize-y"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#61706b] uppercase tracking-wider mb-1.5">Kategori</label>
              <select name="category" className="w-full p-2.5 rounded-lg border border-[#e8e1d4] outline-none text-sm bg-white">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#61706b] uppercase tracking-wider mb-1.5">Anahtar Kelimeler (virgülle ayır)</label>
              <input
                type="text" name="keywords"
                placeholder="rinoplasti, burun, ameliyat"
                className="w-full p-2.5 rounded-lg border border-[#e8e1d4] focus:ring-2 focus:ring-[#b8893c]/30 focus:border-[#b8893c] outline-none text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-[#17201e] text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-[#49685f] transition-colors text-sm">
              Ekle
            </button>
          </div>
        </form>
      </div>

      {/* FAQ list */}
      <div className="flex flex-col gap-3">
        {faqs.length === 0 ? (
          <div className="text-center py-16 text-[#61706b]">
            <p className="text-3xl mb-3">📋</p>
            <p className="font-semibold text-lg text-[#17201e] mb-1">Henüz soru-cevap eklenmedi</p>
            <p className="text-sm">Yukarıdaki formu kullanarak ilk soruyu ekleyin.</p>
          </div>
        ) : faqs.map(faq => (
          <div key={faq.id} className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-opacity ${faq.isActive ? 'border-[#e8e1d4]' : 'border-[#e8e1d4] opacity-50'}`}>
            <div className="px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs bg-[#f4f0e8] text-[#61706b] px-2 py-0.5 rounded-full font-mono">{faq.category}</span>
                    {faq.keywords && faq.keywords.split(',').slice(0, 3).map(k => (
                      <span key={k.trim()} className="text-xs bg-[#17201e]/5 text-[#61706b] px-2 py-0.5 rounded-full">{k.trim()}</span>
                    ))}
                    {!faq.isActive && <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">Pasif</span>}
                  </div>
                  <p className="text-sm font-semibold text-[#17201e] mb-1">S: {faq.question}</p>
                  <p className="text-sm text-[#61706b] leading-relaxed">C: {faq.answer}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0 ml-2">
                  {/* Toggle active */}
                  <form action={toggleFaq}>
                    <input type="hidden" name="id" value={faq.id} />
                    <input type="hidden" name="isActive" value={String(faq.isActive)} />
                    <button type="submit" className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${faq.isActive ? 'bg-[#f4f0e8] text-[#61706b] hover:bg-[#e8e1d4]' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>
                      {faq.isActive ? 'Pasife Al' : 'Aktif Et'}
                    </button>
                  </form>
                  {/* Delete */}
                  <form action={deleteFaq}>
                    <input type="hidden" name="id" value={faq.id} />
                    <button type="submit" className="text-xs px-2.5 py-1.5 rounded-lg font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                      Sil
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {faqs.length > 0 && (
        <p className="text-xs text-center text-[#9ca3af] mt-6">{faqs.filter(f => f.isActive).length} aktif / {faqs.length} toplam soru-cevap</p>
      )}
    </div>
  );
}
