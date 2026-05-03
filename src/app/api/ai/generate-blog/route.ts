import { NextResponse } from 'next/server';
import { aiComplete } from '@/lib/ai-providers';

export async function POST(req: Request) {
  try {
    const { keyword, analysis } = await req.json();

    if (!keyword || !analysis) {
      return NextResponse.json({ error: 'Anahtar kelime ve analiz verisi gereklidir.' }, { status: 400 });
    }

    const systemPrompt = `Sen Türkiye'nin en iyi Sağlık ve Medikal SEO içerik yazarı ve Kulak Burun Boğaz, Estetik uzmanısın.
Görev: Aşağıda verilen SEO Analizi verilerini kullanarak, "${keyword}" anahtar kelimesi odağında 1000+ kelimelik, HTML formatında, profesyonel, okunabilirliği yüksek ve Google'da 1. sıraya çıkacak tam bir blog yazısı/makale üret.

GEREKSİNİMLER:
1. JSON formatında geçerli bir yanıt dön. Markdown kullanma, backtick KULLANMA. Doğrudan JSON objesi döndür.
2. Yazı dili: Türkçe, bilimsel ama hastaların anlayabileceği samimi ve güven veren bir ton.
3. İçerik yapısı: Analizdeki "Önerilen Sayfa Yapısı"na birebir uy, H2 ve H3 etiketlerini kullan.
4. HTML Kuralları: Başlıklar hariç paragrafları <p> ile sar. Kalın yazıları <strong> ile vurgula.
5. Uzunluk: Konuyu derinlemesine ele al (1000+ kelime).
6. Anahtar kelimeler: Analizdeki "Semantik Anahtar Kelimeler"i metin içine doğal biçimde dağıt.

BEKLENEN JSON FORMATI:
{
  "title": "İçeriğin okuyucuyu çekecek H1 başlığı (maks 60 kar)",
  "metaTitle": "SEO uyumlu meta başlık (maks 60 kar)",
  "metaDescription": "Tıklama oranını artıracak meta açıklama (maks 150 kar)",
  "excerpt": "Ana sayfada görünecek 2-3 cümlelik özet",
  "content": "<p>Makalenin tam HTML içeriği...</p>",
  "tags": ["etiket1", "etiket2", "etiket3"],
  "category": "Blog",
  "readTime": "5 dk okuma",
  "seoKeyword": "${keyword}"
}`;

    const { content: rawContent, provider } = await aiComplete([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `SEO Analizi:\n\n${analysis}` },
    ], { temperature: 0.7, json: true });

    let blogData;
    try {
      blogData = JSON.parse(rawContent);
    } catch {
      // Some providers wrap output — try extracting JSON object
      const match = rawContent.match(/\{[\s\S]*\}/);
      if (match) {
        try { blogData = JSON.parse(match[0]); } catch {}
      }
      if (!blogData) throw new Error(`${provider} geçerli bir JSON yanıtı üretmedi.`);
    }

    return NextResponse.json({ blog: blogData, provider });
  } catch (error: any) {
    console.error('[generate-blog]', error);
    return NextResponse.json({ error: error.message || 'Bilinmeyen hata' }, { status: 503 });
  }
}
