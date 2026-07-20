import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const locales = ['en', 'de', 'fr', 'ru', 'ar'];

async function callOpenAI(systemPrompt: string, userPrompt: string, isJson: boolean = false) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is missing');
  
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.5,
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error: ${err}`);
  }
  const data = await res.json();
  let result = data.choices[0].message.content.trim();
  if (isJson) {
     if (result.startsWith('```json')) result = result.replace(/^```json\n?/, '').replace(/\n?```$/, '');
     if (result.startsWith('```')) result = result.replace(/^```\n?/, '').replace(/\n?```$/, '');
  } else {
     if (result.startsWith('```html')) result = result.replace(/^```html\n?/, '').replace(/\n?```$/, '');
     if (result.startsWith('```')) result = result.replace(/^```\n?/, '').replace(/\n?```$/, '');
  }
  return result;
}

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, title: true, contentHtml: true, translations: true }
    });
    return NextResponse.json({ videos });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { videoId } = await req.json();
    if (!videoId) return NextResponse.json({ success: false, error: 'videoId required' });

    const video = await prisma.video.findUnique({ where: { id: videoId } });
    if (!video) return NextResponse.json({ success: false, error: 'Video not found' });

    const trans: any = video.translations || {};
    const hasAllLocales = locales.every(l => !!trans[l]);

    // Skip if already processed
    if (video.contentHtml && video.contentHtml.trim() !== '' && hasAllLocales) {
      return NextResponse.json({ success: true, skipped: true });
    }

    let contentHtml = video.contentHtml;
    if (!contentHtml || contentHtml.trim() === '') {
      const htmlSystemPrompt = `Sen profesyonel bir medikal yazar ve SEO uzmanısın. Prof. Dr. Gökçe Özel'in (Kulak Burun Boğaz ve Yüz Plastik Cerrahisi Uzmanı) YouTube videosu için SEO uyumlu, Google'da öne çıkacak ve arama motorları tarafından indekslenecek bir zengin metin (rich text) makalesi oluşturacaksın.
Kurallar:
- Sadece HTML içeriğini döndür (\`\`\`html vs ekleme, doğrudan <p> ile başla).
- Kalın yazılar (<strong>), maddeli listeler (<ul>, <li>) kullan.
- Profesyonel, güven verici, medikal olarak doğru ve ikna edici bir ton kullan. 2-3 paragraf olsun.
- Metnin sonuna videonun konusuyla alakalı 5-8 adet hashtag (ör: #rinoplasti #yuzgerme #ankaraestetik vb) ekle (<p><strong>Etiketler:</strong> #... </p> formatında).`;
      const htmlUserPrompt = `Video Başlığı: "${video.title}"\n\nLütfen bu videoyu destekleyecek SEO uyumlu HTML metni oluştur.`;
      contentHtml = await callOpenAI(htmlSystemPrompt, htmlUserPrompt, false);
    }

    const currentTranslations: any = (video.translations as any) || {};
    const payload = {
      title: video.title,
      contentHtml: contentHtml,
    };

    for (const locale of locales) {
      if (!currentTranslations[locale]) {
        const systemPrompt = `Translate the following JSON object's string values to ${locale.toUpperCase()}. DO NOT change any of the JSON keys, only translate the values. Preserve all HTML tags and attributes exactly as they are in the contentHtml field. Return ONLY valid JSON without any markdown formatting or explanation.`;
        try {
          const result = await callOpenAI(systemPrompt, JSON.stringify(payload), true);
          const parsed = JSON.parse(result);
          currentTranslations[locale] = {
            title: parsed.title,
            contentHtml: parsed.contentHtml
          };
        } catch (e) {
          console.error(`Failed to parse/translate for ${locale}:`, e);
        }
      }
    }

    await prisma.video.update({
      where: { id: video.id },
      data: {
        contentHtml,
        translations: currentTranslations,
      },
    });

    revalidatePath('/admin/videolar');
    revalidatePath('/videolar');
    if (video.slug) revalidatePath(`/videolar/${video.slug}`);

    return NextResponse.json({ success: true, skipped: false });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
