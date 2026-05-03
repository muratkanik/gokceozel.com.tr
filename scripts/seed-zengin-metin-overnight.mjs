/**
 * OVERNIGHT SCRIPT: Full zengin_metin content generation for all 36 service pages
 *
 * For each service:
 *   1. Generate high-quality SEO-optimized Turkish HTML (500-800 words) via AI
 *   2. Translate to EN, AR, RU, FR, DE via AI
 *   3. Convert legacy_content block → zengin_metin
 *   4. Upsert all 6 locale translations
 *
 * Concurrency: 3 services at a time
 * Retry: 3 attempts per AI call with exponential backoff
 * Resume: skips services that already have a complete zengin_metin block
 * Progress: logged to scripts/overnight-progress.log
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const LOG_FILE = path.resolve('scripts/overnight-progress.log');
const LOCALES = ['tr', 'en', 'ar', 'ru', 'fr', 'de'];
const CONCURRENCY = 3;

// ─── Logging ─────────────────────────────────────────────────────────────────
function log(msg) {
  const ts = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const line = `[${ts}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

// ─── AI helpers ───────────────────────────────────────────────────────────────
async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function callOpenAI(messages, temperature = 0.7) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY missing');
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: 'gpt-4o-mini', messages, temperature }),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(`OpenAI ${res.status}: ${e.error?.message || res.statusText}`); }
  return (await res.json()).choices[0].message.content.trim();
}

async function callXAI(messages, temperature = 0.7) {
  const key = process.env.XAI_API_KEY;
  if (!key) throw new Error('XAI_API_KEY missing');
  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: 'grok-3-mini', messages, temperature }),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(`xAI ${res.status}: ${e.error?.message || res.statusText}`); }
  return (await res.json()).choices[0].message.content.trim();
}

async function callGemini(messages, temperature = 0.7) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY missing');
  const sys = messages.find(m => m.role === 'system')?.content || '';
  const usr = messages.filter(m => m.role !== 'system').map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));
  const body = { contents: usr, generationConfig: { temperature } };
  if (sys) body.systemInstruction = { parts: [{ text: sys }] };
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(`Gemini ${res.status}: ${e.error?.message || res.statusText}`); }
  return (await res.json()).candidates[0].content.parts[0].text.trim();
}

function stripFences(text) {
  if (text.startsWith('```html')) return text.replace(/^```html\n?/, '').replace(/\n?```$/, '').trim();
  if (text.startsWith('```')) return text.replace(/^```\w*\n?/, '').replace(/\n?```$/, '').trim();
  return text.trim();
}

async function aiCall(messages, temperature = 0.7, retries = 3) {
  const providers = [callOpenAI, callXAI, callGemini];
  const errors = [];
  for (const fn of providers) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return stripFences(await fn(messages, temperature));
      } catch (e) {
        errors.push(`${fn.name} attempt ${attempt}: ${e.message}`);
        if (attempt < retries) await sleep(1500 * attempt);
      }
    }
  }
  throw new Error('All AI providers failed:\n' + errors.join('\n'));
}

// ─── Service data ─────────────────────────────────────────────────────────────
// Turkish content prompts — very specific per service
const SERVICE_PROMPTS = {
  'rinoplasti': {
    name: 'Rinoplasti (Burun Estetiği)',
    keywords: 'rinoplasti, burun estetiği, burun ameliyatı Ankara, açık rinoplasti, kapalı rinoplasti, doğal burun estetiği',
    sections: ['Rinoplasti Nedir?', 'Kimler Rinoplasti Yaptırabilir?', 'Ameliyat Teknikleri: Açık ve Kapalı', 'Ameliyat Sonrası İyileşme Süreci', 'Prof. Dr. Gökçe Özel ile Rinoplasti'],
  },
  'revizyon-rinoplasti': {
    name: 'Revizyon Rinoplasti (İkincil Burun Estetiği)',
    keywords: 'revizyon rinoplasti, ikincil burun ameliyatı, başarısız burun estetiği düzeltme, burun revizyonu Ankara',
    sections: ['Revizyon Rinoplasti Nedir?', 'Ne Zaman Revizyon Gereklidir?', 'İlk Ameliyattan Farklılıklar', 'Süreç ve Planlama', 'Uzman Yaklaşım'],
  },
  'septorinoplasti': {
    name: 'Septorinoplasti (Septum Estetiği + Burun Estetiği)',
    keywords: 'septorinoplasti, septum düzeltme, burun estetiği ve fonksiyon, septoplasti Ankara, nefes alma sorunu',
    sections: ['Septorinoplasti Nedir?', 'Septum Eğriliği Belirtileri', 'Estetik ve Fonksiyon Birlikte', 'Ameliyat Süreci', 'İyileşme ve Sonuçlar'],
  },
  'alt-blefaroplasti': {
    name: 'Alt Blefaroplasti (Göz Altı Torbası Ameliyatı)',
    keywords: 'alt blefaroplasti, göz altı torbası ameliyatı, göz altı şişliği tedavisi, transkonjonktival blefaroplasti Ankara',
    sections: ['Alt Blefaroplasti Nedir?', 'Göz Altı Torbaları Neden Oluşur?', 'Ameliyat Yöntemi', 'İyileşme Dönemi', 'Doğal ve Kalıcı Sonuçlar'],
  },
  'kas-kaldirma': {
    name: 'Üst Blefaroplasti (Göz Kapağı Sarkması Ameliyatı)',
    keywords: 'üst blefaroplasti, göz kapağı sarkması ameliyatı, ptoz düzeltme, göz kapağı estetiği Ankara',
    sections: ['Üst Blefaroplasti Nedir?', 'Göz Kapağı Sarkmasının Etkileri', 'Ameliyat Nasıl Yapılır?', 'İyileşme Süreci', 'Sonuçlar ve Sürdürülebilirlik'],
  },
  'badem-goz-estetigi': {
    name: 'Badem Göz Estetiği (Kanto / Kantoplasti)',
    keywords: 'badem göz estetiği, kantoplasti, kanto, göz şekli değiştirme, fox eye Ankara, tilted eye',
    sections: ['Badem Göz Estetiği Nedir?', 'Kanto ve Kantoplasti Farkı', 'İdeal Aday Özellikleri', 'Ameliyat Detayları', 'Beklenen Sonuçlar'],
  },
  'goz-alti-isik-dolgusu': {
    name: 'Göz Altı Işık Dolgusu (Tear Trough)',
    keywords: 'göz altı ışık dolgusu, tear trough, göz altı morluğu tedavisi, göz altı çukuru dolgusu Ankara',
    sections: ['Işık Dolgusu Nedir?', 'Morluk ve Çukur Nedenleri', 'Uygulama Süreci', 'Ne Kadar Sürer?', 'Sonuçlar ve Dikkat Edilmesi Gerekenler'],
  },
  'endolift': {
    name: 'Endolift Lazer (Cerrahsız Yüz Germe)',
    keywords: 'endolift lazer, cerrahsız yüz germe, endolift Ankara, yüz sıkılaştırma lazer, boyun germe lazer',
    sections: ['Endolift Lazer Nedir?', 'Nasıl Çalışır?', 'Kimler Uygun Adaydır?', 'Uygulama Süreci', 'Kaç Seans Gerekir?'],
  },
  'botoks': {
    name: 'Botoks Uygulamaları',
    keywords: 'botoks Ankara, botoks uygulamaları, alın botoksu, mimik çizgileri botoks, kaz ayağı botoksu',
    sections: ['Botoks Nedir ve Nasıl Çalışır?', 'Hangi Bölgelere Uygulanır?', 'Doğal Sonuç İçin Doğru Teknik', 'Uygulama Sonrası', 'Botoks Sıklığı'],
  },
  'botulinum-toksin-uygulamasi': {
    name: 'Botulinum Toksin Uygulaması',
    keywords: 'botulinum toksin, botulinum toksin tedavisi Ankara, botox medikal, tıbbi botoks',
    sections: ['Botulinum Toksin Nedir?', 'Uygulama Alanları', 'Medikal ve Estetik Kullanım', 'Güvenlik ve Yan Etkiler', 'Uzman Uygulamanın Önemi'],
  },
  'botoks-ile-kas-kaldirma': {
    name: 'Botoks ile Kaş Kaldırma',
    keywords: 'botoks ile kaş kaldırma, kaş kaldırma botoks Ankara, kimyasal kaş lifti, non-cerrahi kaş estetiği',
    sections: ['Botoks ile Kaş Kaldırma Nedir?', 'Kimler Yaptırabilir?', 'Nasıl Uygulanır?', 'Sonuçlar Ne Zaman Görülür?', 'Tekrar Uygulamalar'],
  },
  'dolgu': {
    name: 'Dolgu Uygulamaları (Hyalüronik Asit)',
    keywords: 'dolgu uygulamaları Ankara, hyalüronik asit dolgu, yüz dolgusu, çene dolgusu, şakak dolgusu',
    sections: ['Dolgu Uygulaması Nedir?', 'Hangi Bölgelere Dolgu Yapılır?', 'Hyalüronik Asit Neden Tercih Edilir?', 'Uygulama Süreci', 'Ne Kadar Kalıcıdır?'],
  },
  'dolgu-i-slemleri': {
    name: 'Dolgu İşlemleri (Kapsamlı Rehber)',
    keywords: 'dolgu işlemleri, yüz dolgusu çeşitleri, dolgu nedir, dolgu nasıl yapılır Ankara',
    sections: ['Dolgu İşlemleri Hakkında Her Şey', 'Dolgu Çeşitleri', 'Uygulama Bölgeleri', 'Güvenlik ve Yan Etkiler', 'Doğru Uzman Seçimi'],
  },
  'dudak-dolgusu': {
    name: 'Dudak Dolgusu',
    keywords: 'dudak dolgusu Ankara, dudak büyütme, doğal dudak dolgusu, dudak şekillendirme, Russian lips',
    sections: ['Dudak Dolgusu Nedir?', 'Hangi Teknikler Kullanılır?', 'Doğal Sonuç için Planlama', 'Uygulama Süreci', 'Sonuçlar ve Bakım'],
  },
  'dudak-estetigi-liplift': {
    name: 'Dudak Kaldırma (Lip Lift)',
    keywords: 'lip lift, dudak kaldırma ameliyatı Ankara, kısa filtre, dudak estetiği cerrahi',
    sections: ['Lip Lift Nedir?', 'Kimler İçin Uygundur?', 'Ameliyat Tekniği', 'İz Kalır mı?', 'Sonuçlar ve Sürdürülebilirlik'],
  },
  'i-ple-yuz-germe-fransiz-aski': {
    name: 'İp ile Yüz Germe (Fransız Askı)',
    keywords: 'ip ile yüz germe, fransız askı Ankara, thread lift, yüz askılama, cerrahsız yüz germe',
    sections: ['İp ile Yüz Germe Nedir?', 'Fransız Askı Tekniği', 'Kimler Uygun Adaydır?', 'Uygulama Süreci', 'Sonuçlar Ne Kadar Sürer?'],
  },
  'ameliyatsiz-kas-kaldirma': {
    name: 'Ameliyatsız Kaş Kaldırma',
    keywords: 'ameliyatsız kaş kaldırma Ankara, non-cerrahi kaş lifti, botoks kaş, dolgu kaş kaldırma',
    sections: ['Ameliyatsız Kaş Kaldırma Nedir?', 'Hangi Yöntemler Kullanılır?', 'Avantajları', 'Uygulama Süreci', 'Kimler Yaptırabilir?'],
  },
  'dolgu-ile-kas-kaldirma': {
    name: 'Dolgu ile Kaş Kaldırma',
    keywords: 'dolgu ile kaş kaldırma, kaş dolgusu Ankara, hyalüronik asit kaş, temporal dolgu',
    sections: ['Dolgu ile Kaş Kaldırma Nedir?', 'Hangi Dolgu Kullanılır?', 'Uygulama Tekniği', 'Sonuçlar', 'Avantajları ve Sınırlamaları'],
  },
  'i-ple-kas-kaldirma': {
    name: 'İple Kaş Kaldırma',
    keywords: 'iple kaş kaldırma Ankara, thread brow lift, ip ile kaş estetiği, kaş askılama',
    sections: ['İple Kaş Kaldırma Nedir?', 'Uygulama Süreci', 'Kimler Uygun Adaydır?', 'Ne Kadar Sürer?', 'Avantajları'],
  },
  'kepce-kulak-estetigi-otoplasti': {
    name: 'Kepçe Kulak Ameliyatı (Otoplasti)',
    keywords: 'kepçe kulak ameliyatı Ankara, otoplasti, kulak estetiği, kulak kıkırdağı düzeltme, çocuk kepçe kulak',
    sections: ['Otoplasti Nedir?', 'Kepçe Kulak Neden Oluşur?', 'Ameliyat Yöntemi', 'Çocuklarda Otoplasti', 'İyileşme ve Sonuçlar'],
  },
  'mezoterapi': {
    name: 'Mezoterapi',
    keywords: 'mezoterapi Ankara, cilt mezoterapisi, saç mezoterapisi, mezoterapi nedir, cilt yenileme mezoterapi',
    sections: ['Mezoterapi Nedir?', 'Hangi Bölgelere Uygulanır?', 'İçerik ve Etki Mekanizması', 'Kaç Seans Gerekir?', 'Sonuçlar'],
  },
  'yuz-mezoterapisi': {
    name: 'Yüz Mezoterapisi',
    keywords: 'yüz mezoterapisi Ankara, yüz cilt yenileme, anti-aging mezoterapi, nem mezoterapi yüz',
    sections: ['Yüz Mezoterapisi Nedir?', 'Kullanılan Maddeler', 'Kimler Yaptırabilir?', 'Uygulama Süreci', 'Beklenen Sonuçlar'],
  },
  'lipoliz-i-nceltme-mezoterapisi': {
    name: 'Lipoliz (İnceltme) Mezoterapisi',
    keywords: 'lipoliz mezoterapisi Ankara, yağ eritme mezoterapi, bölgesel incelme, çene altı lipoliz',
    sections: ['Lipoliz Mezoterapisi Nedir?', 'Nasıl Çalışır?', 'Hangi Bölgelere Uygulanır?', 'Kaç Seans?', 'Sonuçlar'],
  },
  'cilt-yenileme': {
    name: 'Cilt Yenileme Tedavileri',
    keywords: 'cilt yenileme Ankara, cilt tazeleyen tedaviler, lazer cilt, peeling cilt, genç cilt',
    sections: ['Cilt Yenileme Nedir?', 'Hangi Tedaviler Uygulanır?', 'Cilt Tiplerine Göre Planlama', 'Tedavi Süreci', 'Sonuçlar ve Bakım'],
  },
  'cilt-soyma-kimyasal-peeling-i-slemleri': {
    name: 'Kimyasal Peeling (Cilt Soyma)',
    keywords: 'kimyasal peeling Ankara, yüzeysel peeling, orta derece peeling, leke tedavisi peeling, akne izi peeling',
    sections: ['Kimyasal Peeling Nedir?', 'Peeling Çeşitleri', 'Hangi Sorunlara İyi Gelir?', 'Uygulama ve İyileşme', 'Güneş Koruma Önemi'],
  },
  'skar-revizyonu-yara-izi-estetigi': {
    name: 'Skar Revizyonu (Yara İzi Estetiği)',
    keywords: 'skar revizyonu Ankara, yara izi tedavisi, ameliyat izi düzeltme, keloid tedavisi, hipertrofik skar',
    sections: ['Skar Revizyonu Nedir?', 'Skar Tipleri', 'Hangi Yöntemler Kullanılır?', 'Planlama Süreci', 'Gerçekçi Beklentiler'],
  },
  'prp-uygulamasi': {
    name: 'PRP (Trombosit Zengin Plazma)',
    keywords: 'PRP Ankara, gençlik aşısı, trombosit zengin plazma, PRP saç, PRP yüz, kan gençlik tedavisi',
    sections: ['PRP Nedir?', 'Nasıl Hazırlanır?', 'Uygulama Alanları', 'Kaç Seans Gerekir?', 'Sonuçlar'],
  },
  'mikro-i-gneleme': {
    name: 'Mikro İğneleme (Dermapen / Dermastamp)',
    keywords: 'mikro iğneleme Ankara, dermapen, collagen induction therapy, akne izi tedavisi iğneleme, kırışıklık iğneleme',
    sections: ['Mikro İğneleme Nedir?', 'Kolajen İndüksiyon Mekanizması', 'Hangi Sorunlara Faydalıdır?', 'Uygulama Süreci', 'Kaç Seans Gerekir?'],
  },
  'ozon-uygulamasi': {
    name: 'Ozon Uygulaması (Medikal Ozon Terapi)',
    keywords: 'ozon uygulaması Ankara, medikal ozon terapi, ozon cilt, ozon antioksidan, ozon bağışıklık',
    sections: ['Ozon Terapisi Nedir?', 'Tıbbi Ozonun Özellikleri', 'Uygulama Yöntemleri', 'Cilde Etkileri', 'Kimler Yararlanabilir?'],
  },
  'damar-icine-glutatyon-uygulamasi': {
    name: 'Damar İçi Glutatyon (IV Glutatyon)',
    keywords: 'IV glutatyon Ankara, damar içi glutatyon, glutatyon cilt aydınlatma, antioksidan tedavi, glutatyon gençleştirme',
    sections: ['Glutatyon Nedir?', 'IV Uygulamanın Avantajları', 'Cilt Aydınlatma Etkisi', 'Uygulama Süreci', 'Dikkat Edilmesi Gerekenler'],
  },
  'bisektomi': {
    name: 'Bisektomi (Konka Küçültme)',
    keywords: 'bisektomi Ankara, konka küçültme, burun eti ameliyatı, nefes darlığı tedavisi, konka hipertrofisi',
    sections: ['Bisektomi Nedir?', 'Konka Büyümesi Belirtileri', 'Ameliyat Yöntemi', 'İyileşme Süreci', 'Yaşam Kalitesine Katkısı'],
  },
  'sinuzit-ameliyati': {
    name: 'Sinüzit Ameliyatı (FESS)',
    keywords: 'sinüzit ameliyatı Ankara, FESS ameliyatı, endoskopik sinüs cerrahisi, kronik sinüzit tedavisi',
    sections: ['Sinüzit Ameliyatı Nedir?', 'Hangi Durumlarda Gereklidir?', 'FESS Tekniği', 'Ameliyat Sonrası', 'Sonuçlar'],
  },
  'gamze-estetigi': {
    name: 'Gamze Estetiği (Dimple Creation)',
    keywords: 'gamze estetiği Ankara, gamze ameliyatı, yanak gamzesi, gamze yaptırma, dimpleplasty',
    sections: ['Gamze Estetiği Nedir?', 'Nasıl Yapılır?', 'Kalıcı mı?', 'İz Kalır mı?', 'Dikkat Edilmesi Gerekenler'],
  },
  'migren-tedavisi': {
    name: 'Botoks ile Migren Tedavisi',
    keywords: 'migren tedavisi botoks Ankara, kronik migren, migren botoksu, FDA onaylı migren tedavisi',
    sections: ['Botoks ile Migren Tedavisi Nasıl Çalışır?', 'Kimler Bu Tedaviden Yararlanabilir?', 'Uygulama Protokolü', 'Yan Etkiler', 'Sonuçlar ve Takip'],
  },
  'cene-estetigi-mentoplasti': {
    name: 'Çene Estetiği (Mentoplasti)',
    keywords: 'çene estetiği Ankara, mentoplasti, çene dolgusu, çene büyütme, geri çene ameliyatı',
    sections: ['Çene Estetiği Nedir?', 'Cerrahi vs Dolgu Yaklaşımı', 'Yüz Simetrisine Katkısı', 'Uygulama Süreci', 'Sonuçlar'],
  },
  'yuz-germe-facelift': {
    name: 'Yüz Gençleştirme (Cerrahsız Facelift)',
    keywords: 'cerrahsız yüz gençleştirme Ankara, non-cerrahi facelift, kombine yüz gençleştirme, ip botoks dolgu kombinasyonu',
    sections: ['Cerrahsız Yüz Gençleştirme Nedir?', 'Kombine Tedavi Yaklaşımı', 'Kimler İçin Uygundur?', 'Uygulama Planlaması', 'Sonuçlar ve Sürekliliği'],
  },
};

// ─── Content generation ───────────────────────────────────────────────────────
async function generateTurkishContent(service) {
  const info = SERVICE_PROMPTS[service.slug] || {
    name: service.cleanName,
    keywords: `${service.cleanName} Ankara`,
    sections: [`${service.cleanName} Nedir?`, 'Kimler Yaptırabilir?', 'Nasıl Uygulanır?', 'Sonuçlar', 'Uzman Yaklaşımı'],
  };

  const sectionList = info.sections.map((s, i) => `${i + 1}. <h2>${s}</h2>`).join('\n');

  const prompt = `Prof. Dr. Gökçe Özel'in KBB ve Estetik kliniği (Ankara & Antalya) için "${info.name}" hizmet sayfasına özel, SEO odaklı zengin metin içeriği üret.

ODAK ANAHTAR KELİMELER: ${info.keywords}

META AÇIKLAMA (bu sayfanın amaçı): ${service.desc}

ZORUNLU İÇERİK YAPISI — tam bu bölümleri, tam bu sırayla oluştur:
${sectionList}

KALİTE VE KURAL GEREKSİNİMLERİ:
- SADECE bu hizmet hakkında yaz — genel klinik tanıtımı YASAK
- Toplam 550-750 kelime
- Her <h2> bölümü 2-4 paragraf <p> içersin
- Tıbbi terimleri parantez içinde Türkçe açıkla: rhinoplasty (burun estetiği)
- Birinci bölüme ana anahtar kelimeyi doğal yerleştir
- Gerekiyorsa <ul><li> listeler kullan
- Son bölümde Ankara ve Antalya'da uygulandığını, randevu için /iletisim linkini belirt
- SADECE HTML döndür: <h2>, <p>, <strong>, <ul>, <li> — başka etiket yok
- Markdown, backtick, veya <html>/<body> gibi wrapper KULLANMA

Doğrudan ilk <h2> etiketiyle başla.`;

  return await aiCall([
    { role: 'system', content: 'Sen Türkiye\'nin en iyi medikal estetik SEO içerik yazarısın. KBB ve estetik cerrahi konularında uzmanlaşmış, doğal ve güven veren içerikler üretirsin. Abartılı vaatler kullanmazsın.' },
    { role: 'user', content: prompt },
  ], 0.7);
}

async function translateContent(html, targetLocale, serviceName) {
  const langNames = { en: 'English', ar: 'Arabic', ru: 'Russian', fr: 'French', de: 'German' };
  const langName = langNames[targetLocale] || targetLocale.toUpperCase();

  const prompt = `Translate the following HTML content about "${serviceName}" from Turkish to ${langName}.

CRITICAL RULES:
- Preserve ALL HTML tags exactly (<h2>, <p>, <strong>, <ul>, <li>)
- Translate only the text content, NOT the tags
- Maintain medical terminology with target language equivalents
- Keep a professional, trustworthy medical tone
- Return ONLY the translated HTML, no explanation or wrapper

HTML to translate:
${html}`;

  return await aiCall([
    { role: 'system', content: `You are a professional medical translator specializing in aesthetic surgery and ENT content. Translate accurately into ${langName} while preserving all HTML markup.` },
    { role: 'user', content: prompt },
  ], 0.3);
}

// ─── DB operations ────────────────────────────────────────────────────────────
async function upsertZenginMetin(service, contentByLocale) {
  // Find existing zengin_metin block or legacy_content to convert
  const page = await prisma.page.findUnique({
    where: { id: service.id },
    include: { blocks: { include: { translations: true } } },
  });

  let block = page.blocks.find(b => b.componentType === 'zengin_metin');

  if (!block) {
    // Check if there's a legacy_content block to convert
    const legacy = page.blocks.find(b => b.componentType === 'legacy_content');
    if (legacy) {
      // Convert legacy_content → zengin_metin
      block = await prisma.contentBlock.update({
        where: { id: legacy.id },
        data: { componentType: 'zengin_metin', sortOrder: 1 },
        include: { translations: true },
      });
    } else {
      // Create new zengin_metin block
      block = await prisma.contentBlock.create({
        data: {
          pageId: service.id,
          componentType: 'zengin_metin',
          sortOrder: 1,
          schemaDef: '{}',
        },
        include: { translations: true },
      });
    }
  }

  // Upsert translations for all 6 locales
  for (const [locale, html] of Object.entries(contentByLocale)) {
    const contentData = JSON.stringify({ title: '', text: html });
    const existing = block.translations?.find(t => t.locale === locale);

    if (existing) {
      await prisma.translation.update({
        where: { id: existing.id },
        data: { contentData },
      });
    } else {
      await prisma.translation.create({
        data: { blockId: block.id, locale, contentData },
      });
    }
  }

  return block.id;
}

// ─── Process single service ───────────────────────────────────────────────────
async function processService(service) {
  log(`▶ START: ${service.slug} (${service.cleanName})`);

  try {
    // Check if already fully processed (has zengin_metin with all 6 locales)
    const existing = await prisma.contentBlock.findFirst({
      where: { pageId: service.id, componentType: 'zengin_metin' },
      include: { translations: true },
    });

    if (existing && existing.translations.length === 6) {
      log(`  ✓ SKIP: already has zengin_metin with 6 locales`);
      return;
    }

    // Generate Turkish content
    log(`  → Generating Turkish content...`);
    const trContent = await generateTurkishContent(service);
    log(`  ✓ Turkish: ${trContent.length} chars`);

    // Translate to 5 languages concurrently (2 at a time to avoid rate limits)
    const otherLocales = ['en', 'ar', 'ru', 'fr', 'de'];
    const contentByLocale = { tr: trContent };

    // Process in batches of 2
    for (let i = 0; i < otherLocales.length; i += 2) {
      const batch = otherLocales.slice(i, i + 2);
      const results = await Promise.allSettled(
        batch.map(async (locale) => {
          log(`  → Translating to ${locale.toUpperCase()}...`);
          const translated = await translateContent(trContent, locale, service.cleanName);
          log(`  ✓ ${locale.toUpperCase()}: ${translated.length} chars`);
          return [locale, translated];
        })
      );

      for (const result of results) {
        if (result.status === 'fulfilled') {
          const [locale, content] = result.value;
          contentByLocale[locale] = content;
        } else {
          log(`  ✗ Translation failed: ${result.reason?.message}`);
        }
      }

      // Small pause between batches
      if (i + 2 < otherLocales.length) await sleep(800);
    }

    // Save to DB
    log(`  → Saving to DB (${Object.keys(contentByLocale).length} locales)...`);
    const blockId = await upsertZenginMetin(service, contentByLocale);
    log(`  ✓ DONE: block ${blockId}, locales: ${Object.keys(contentByLocale).join(',')}`);

  } catch (err) {
    log(`  ✗ FAILED: ${err.message}`);
  }
}

// ─── Concurrency control ──────────────────────────────────────────────────────
async function runWithConcurrency(tasks, concurrency) {
  const results = [];
  let idx = 0;

  async function runNext() {
    if (idx >= tasks.length) return;
    const task = tasks[idx++];
    await task();
    await runNext();
  }

  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, () => runNext());
  await Promise.all(workers);
  return results;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  // Clear log
  fs.writeFileSync(LOG_FILE, `=== Overnight Zengin Metin Seed — ${new Date().toISOString()} ===\n\n`);

  log('🚀 Starting overnight service content generation...');
  log(`API keys: OpenAI=${!!process.env.OPENAI_API_KEY} | xAI=${!!process.env.XAI_API_KEY} | Gemini=${!!process.env.GEMINI_API_KEY}`);

  // Load all services
  const services = await prisma.page.findMany({
    where: { type: 'SERVICE', slug: { not: 'global-settings' } },
    include: {
      seoMeta: { where: { locale: 'tr' } },
      blocks: { include: { translations: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  log(`Found ${services.length} service pages\n`);

  const enriched = services.map(s => ({
    id: s.id,
    slug: s.slug,
    cleanName: (s.seoMeta[0]?.metaTitle || s.titleInternal || s.slug)
      .replace(/\s*[|–-].*$/, '')
      .replace(/\s*(Ankara|Antalya|&).*$/i, '')
      .trim(),
    desc: s.seoMeta[0]?.metaDescription || '',
    hasZengin: s.blocks.some(b => b.componentType === 'zengin_metin' && b.translations.length === 6),
  }));

  log(`Services to process: ${enriched.filter(s => !s.hasZengin).length}\n`);

  const tasks = enriched.map(service => () => processService(service));

  await runWithConcurrency(tasks, CONCURRENCY);

  // Final summary
  const final = await prisma.page.findMany({
    where: { type: 'SERVICE', slug: { not: 'global-settings' } },
    include: { blocks: { include: { translations: true } } },
  });

  const complete = final.filter(s => s.blocks.some(b => b.componentType === 'zengin_metin' && b.translations.length === 6)).length;
  log(`\n✅ COMPLETE: ${complete}/${final.length} services have full zengin_metin blocks`);

  await prisma.$disconnect();
}

main().catch(e => {
  log(`\n💥 FATAL: ${e.message}`);
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
