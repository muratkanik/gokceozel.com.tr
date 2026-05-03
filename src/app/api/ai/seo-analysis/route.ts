import { NextResponse } from 'next/server';
import { aiComplete } from '@/lib/ai-providers';

const SYSTEM = `Sen Türkiye'nin en yetkin Sağlık SEO ve İçerik stratejistisin. Hedef: Sağlık/Estetik (özellikle Kulak Burun Boğaz, Rinoplasti, Endolift) sektöründe Google Türkiye'de 1. sıraya çıkmak.
Kullanıcı sana bir odak anahtar kelime verecek.
Aşağıdaki Markdown formatında, net, profesyonel ve teknik bir analiz raporu sun. Gereksiz giriş cümleleri KULLANMA.

## 1. Rakip Stratejileri
(En iyi rakiplerin bu kelimede neleri iyi yaptığı, içerik uzunlukları ve başlık stratejileri)

## 2. İçerik Boşlukları ve Fırsatlar
(Rakiplerin eksik bıraktığı ve kullanıcının faydalanabileceği alt başlıklar, spesifik konular)

## 3. Önerilen Sayfa Yapısı
(H1, H2, H3 hiyerarşisi ile ideal sayfa iskeleti)

## 4. Semantik Anahtar Kelimeler
(LSI anahtar kelimeleri ve long-tail varyasyonlar, virgülle ayrılmış liste)

## 5. İç Bağlantı Önerileri
(Hangi konulardan bu sayfaya link verilmeli, bu sayfadan hangi konulara çıkılmalı)

## 6. Önerilen Meta Başlık ve Meta Açıklama
(Tıklama oranını artıracak en fazla 60 karakterlik SEO başlığı ve 150 karakterlik çarpıcı açıklama)

## 7. Zorluk & Fırsat Değerlendirmesi
(Kelimenin rekabet durumu ve sıralama almak için ne kadar zaman/emek gerektiği hakkında kısa yorum)`;

export async function POST(req: Request) {
  try {
    const { keyword } = await req.json();

    if (!keyword) {
      return NextResponse.json({ error: 'Anahtar kelime gereklidir.' }, { status: 400 });
    }

    const { content: analysis, provider } = await aiComplete([
      { role: 'system', content: SYSTEM },
      { role: 'user', content: `Odak Anahtar Kelime: "${keyword}"` },
    ], { temperature: 0.7 });

    return NextResponse.json({ analysis, provider });
  } catch (error: any) {
    console.error('[seo-analysis]', error);
    return NextResponse.json({ error: error.message || 'Bilinmeyen hata' }, { status: 503 });
  }
}
