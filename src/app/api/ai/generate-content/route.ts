import { NextResponse } from 'next/server';
import { aiComplete } from '@/lib/ai-providers';

export async function POST(req: Request) {
  try {
    const { prompt, currentHtml, locale } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt gereklidir.' }, { status: 400 });
    }

    const system = `Sen Prof. Dr. Gökçe Özel kliniğinin resmi web sitesi için içerik üreten uzman bir medikal SEO yazarısın.
Klinik: KBB (Kulak-Burun-Boğaz) ve Estetik/Plastik cerrahi — Ankara ve Antalya.
Hedef dil: ${(locale || 'tr').toUpperCase()}
${currentHtml ? `Mevcut içerik (geliştir veya genişlet):\n${currentHtml}` : ''}

GÖREV: Aşağıdaki isteğe göre içerik üret. Sadece TALEP EDİLEN hizmet veya konu hakkında yaz.
Genel klinik tanıtımı veya alakasız içerik EKLEME.

KULLANICI İSTEĞİ:
${prompt}

ÇIKTI KURALLARI:
- Sadece saf HTML döndür: <h2>, <h3>, <p>, <strong>, <ul>, <li> etiketleri
- Markdown veya backtick (~~~) KULLANMA — doğrudan HTML ile başla
- SEO uyumlu, okunabilir, kısa paragraflar
- Başlık hiyerarşisi: h2 (ana bölümler), h3 (alt başlıklar)
- Türkçe içerik için medikal terimleri doğal kullan`;

    const { content, provider } = await aiComplete(
      [{ role: 'system', content: system }],
      { temperature: 0.7 }
    );

    return NextResponse.json({ content, provider });
  } catch (error: any) {
    console.error('[generate-content]', error);
    return NextResponse.json({ error: error.message || 'Bilinmeyen bir hata oluştu.' }, { status: 503 });
  }
}
