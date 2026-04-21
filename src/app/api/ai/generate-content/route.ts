import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY bulunamadı. Lütfen ortam değişkenlerine (veya Vercel\'e) ekleyin.' }, { status: 400 });
    }

    const { prompt, currentHtml, locale } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt gereklidir.' }, { status: 400 });
    }

    const systemPrompt = `Sen profesyonel bir içerik üreticisi ve SEO uzmanısın.
Hedef dil: ${locale.toUpperCase()}
Mevcut içerik: ${currentHtml || 'Yok'}

Kullanıcının isteği: ${prompt}

Lütfen sadece saf HTML (örneğin <h2>, <p>, <strong>, <ul> etiketlerini kullanarak) formatında zengin metin üret. Markdown veya backtick (\`\`\`html) KULLANMA. Doğrudan HTML etiketleriyle başla. 
SEO uyumlu, okunabilir, kısa paragraflar ve uygun başlık hiyerarşisi kullan.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt }
        ],
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'OpenAI API Hatası');
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();

    // Remove markdown backticks if OpenAI mistakenly adds them
    if (content.startsWith('```html')) {
      content = content.replace(/^```html\n?/, '').replace(/\n?```$/, '');
    } else if (content.startsWith('```')) {
      content = content.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    return NextResponse.json({ content });
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return NextResponse.json({ error: error.message || 'Bilinmeyen bir hata oluştu.' }, { status: 500 });
  }
}
