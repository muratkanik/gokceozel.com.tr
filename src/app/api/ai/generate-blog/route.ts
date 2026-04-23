import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { keyword, analysis } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY bulunamadı.' }, { status: 400 });
    }

    if (!keyword || !analysis) {
      return NextResponse.json({ error: 'Anahtar kelime ve analiz verisi gereklidir.' }, { status: 400 });
    }

    const systemPrompt = `Sen Türkiye'nin en iyi Sağlık ve Medikal SEO içerik yazarı ve Kulak Burun Boğaz, Estetik uzmanısın.
Görev: Aşağıda verilen SEO Analizi verilerini kullanarak, "${keyword}" anahtar kelimesi odağında 1000+ kelimelik, HTML formatında, profesyonel, okunabilirliği yüksek ve Google'da 1. sıraya çıkacak tam bir blog yazısı/makale üret.

GEREKSİNİMLER:
1. JSON formatında geçerli bir yanıt dön. Markdown kullanma, \`\`\`json veya \`\`\`html gibi işaretleyiciler KULLANMA. Doğrudan JSON objesi döndür.
2. Yazı dili: Türkçe, Bilimsel ama hastaların/halkın anlayabileceği samimi ve güven veren bir ton.
3. İçerik yapısı: Analizdeki "Önerilen Sayfa Yapısı"na birebir uy, H2 ve H3 etiketlerini kullan. 
4. HTML Kuralları: Başlıklar hariç paragrafları <p> ile sar. Kalın yazıları <strong> ile vurgula. Gerekiyorsa <ul><li> listeleri kullan. 
5. Uzunluk: Konuyu derinlemesine ele al, asla kısa ve yüzeysel bir metin yazma (ideal olarak 1000+ kelime hissi versin, detaylı açıklamalar ve örnekler kullan).
6. Anahtar kelimeler: Analizdeki "Semantik Anahtar Kelimeler"i metin içine doğal biçimde, zorlama olmadan dağıt.

BEKLENEN JSON FORMATI:
{
  "title": "İçeriğin okuyucuyu çekecek H1 başlığı (maks 60 kar)",
  "metaTitle": "SEO uyumlu meta başlık (maks 60 kar)",
  "metaDescription": "Tıklama oranını artıracak meta açıklama (maks 150 kar)",
  "excerpt": "Ana sayfada veya blog listesinde görünecek 2-3 cümlelik özet",
  "content": "<p>Makalenin tam HTML içeriği...</p>",
  "tags": ["etiket1", "etiket2", "etiket3"],
  "category": "Blog",
  "readTime": "5 dk okuma",
  "seoKeyword": "${keyword}"
}
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `SEO Analizi:\n\n${analysis}` }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'OpenAI API Hatası');
    }

    const data = await response.json();
    const rawContent = data.choices[0].message.content.trim();
    
    let blogData;
    try {
      blogData = JSON.parse(rawContent);
    } catch (e) {
      console.error('Failed to parse GPT response as JSON', rawContent);
      throw new Error('AI geçerli bir JSON yanıtı üretmedi.');
    }

    return NextResponse.json({ blog: blogData });
  } catch (error: any) {
    console.error('Blog Generation Error:', error);
    return NextResponse.json({ error: error.message || 'Bilinmeyen hata' }, { status: 500 });
  }
}
