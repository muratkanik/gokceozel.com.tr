import { NextResponse } from 'next/server';
import { aiComplete } from '@/lib/ai-providers';

export async function POST(req: Request) {
  try {
    const { prompt, currentHtml, locale } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt gereklidir.' }, { status: 400 });
    }

    const system = `Sen profesyonel bir içerik üreticisi ve SEO uzmanısın.
Hedef dil: ${(locale || 'tr').toUpperCase()}
Mevcut içerik: ${currentHtml || 'Yok'}

Kullanıcının isteği: ${prompt}

Lütfen sadece saf HTML (<h2>, <p>, <strong>, <ul> etiketlerini kullanarak) formatında zengin metin üret.
Markdown veya backtick KULLANMA. Doğrudan HTML etiketleriyle başla.
SEO uyumlu, okunabilir, kısa paragraflar ve uygun başlık hiyerarşisi kullan.`;

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
