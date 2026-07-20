import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const locales = ['en', 'de', 'fr', 'ru', 'ar'];

async function callOpenAI(systemPrompt: string, userPrompt: string, isJson: boolean = false) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://gokceozel.com.tr',
      'X-Title': 'Gokce Ozel Admin'
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
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

async function processVideo(video: any) {
  try {
    console.log(`Processing: ${video.title}`);
    
    // 1. Generate SEO HTML Content if it's missing or empty
    let contentHtml = video.contentHtml;
    if (!contentHtml || contentHtml.trim() === '') {
      const htmlSystemPrompt = `Sen profesyonel bir medikal yazar ve SEO uzmanısın. Prof. Dr. Gökçe Özel'in (Kulak Burun Boğaz ve Yüz Plastik Cerrahisi Uzmanı) YouTube videosu için SEO uyumlu, Google'da öne çıkacak ve arama motorları tarafından indekslenecek bir zengin metin (rich text) makalesi oluşturacaksın.
Kurallar:
- Sadece HTML içeriğini döndür (\`\`\`html vs ekleme, doğrudan <p> ile başla).
- Kalın yazılar (<strong>), maddeli listeler (<ul>, <li>) kullan.
- Profesyonel, güven verici, medikal olarak doğru ve ikna edici bir ton kullan. 2-3 paragraf olsun.
- Metnin sonuna videonun konusuyla alakalı 5-8 adet hashtag (ör: #rinoplasti #yuzgerme #ankaraestetik vb) ekle (<p><strong>Etiketler:</strong> #... </p> formatında).
`;
      const htmlUserPrompt = `Video Başlığı: "${video.title}"\n\nLütfen bu videoyu destekleyecek SEO uyumlu HTML metni oluştur.`;
      
      contentHtml = await callOpenAI(htmlSystemPrompt, htmlUserPrompt, false);
    }

    // 2. Generate Translations
    const currentTranslations: any = (video.translations as any) || {};
    const payload = {
      title: video.title,
      contentHtml: contentHtml,
    };

    for (const locale of locales) {
      if (!currentTranslations[locale]) {
        console.log(` Translating to ${locale}...`);
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

    // 3. Save to database
    await prisma.video.update({
      where: { id: video.id },
      data: {
        contentHtml,
        translations: currentTranslations,
      },
    });

    console.log(`✅ Completed: ${video.title}`);
  } catch (err: any) {
    console.error(`❌ Error on ${video.title}: ${err.message}`);
  }
}

async function main() {
  if (!OPENROUTER_API_KEY) {
    console.error("No OPENROUTER_API_KEY provided.");
    process.exit(1);
  }

  // Find all videos
  const videos = await prisma.video.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' }
  });
  
  console.log(`Found ${videos.length} videos. Starting batch processing...`);

  // Process sequentially to respect rate limits
  for (const video of videos) {
    // Only process if it has no contentHtml OR missing translations
    const trans = video.translations as any;
    const hasAllLocales = trans && locales.every(l => !!trans[l]);
    
    if (!video.contentHtml || video.contentHtml.trim() === '' || !hasAllLocales) {
      await processVideo(video);
      // sleep a bit to avoid hitting strict rate limits
      await new Promise(r => setTimeout(r, 1000));
    } else {
      console.log(`⏭️  Skipping (already processed): ${video.title}`);
    }
  }

  console.log('All videos processed successfully.');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
