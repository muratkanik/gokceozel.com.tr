# 🚀 Deployment Checklist — gokceozel.com.tr

## Lokal geliştirme ortamında yapılması gerekenler

### 1. Prisma migration çalıştır (BeforeAfter.serviceId → optional)
```bash
npx prisma migrate dev --name "optional_beforeafter_serviceid"
```

### 2. İçerik göç scriptini çalıştır (icerik.json → DB)
```bash
# Önce archive/icerik.json dosyasının mevcut olduğundan emin ol
npx tsx scripts/migrate-icerik.ts
```

### 3. Production build test
```bash
npm run build
```

---

## Tamamlanan Sprint Özeti

### SEO & AEO İyileştirmeleri
- ✅ `public/llms.txt` — ChatGPT, Perplexity, Gemini için kapsamlı AEO belgesi
- ✅ `robots.ts` — GPTBot, PerplexityBot, GoogleOther ayrı kurallar
- ✅ `sitemap.ts` — Tüm 6 dil için hreflang URL'leri
- ✅ `layout.tsx` — MedicalClinic + Physician JSON-LD (tam schema.org)
- ✅ `gokce-ozel-kimdir` — Physician + BreadcrumbList JSON-LD + generateMetadata
- ✅ `hizmetler/[slug]` — MedicalProcedure + FAQPage JSON-LD
- ✅ `blog/[slug]` — MedicalWebPage + BreadcrumbList JSON-LD
- ✅ `hasta-yorumlari` — AggregateRating + Review JSON-LD
- ✅ `sss` — FAQPage JSON-LD (statik fallback + DB)
- ✅ RSS feed: `/feed.xml?locale=tr|en|ar|ru`
- ✅ OG image: `/[locale]/opengraph-image` (Edge runtime)

### Yeni Sayfalar
- ✅ `/sss` — Sık Sorulan Sorular (6 dil)
- ✅ `/hasta-yorumlari` — Hasta Yorumları (review schema)
- ✅ `/once-sonra` — Öncesi & Sonrası Galerisi (noindex, KVKK uyumlu)
- ✅ `/not-found.tsx` — 301 Redirect handler (Prisma tabanlı)

### Admin Paneli
- ✅ `/admin/sss` + `/api/admin/sss`
- ✅ `/admin/yorumlar` + `/api/admin/yorumlar`
- ✅ `/admin/redirectler` + `/api/admin/redirectler`
- ✅ `/admin/once-sonra` + `/api/admin/once-sonra`
- ✅ Dashboard: istatistik kartları (sayfa, blog, yorum, SSS sayıları)

### Çok Dil
- ✅ ar.json, ru.json, fr.json, de.json
- ✅ 6 dil hreflang alternates (tüm sayfalarda)
- ✅ RTL desteği (Arapça)

### Bug Düzeltmeleri
- ✅ `params.lang` → `params.locale` (tüm route'larda)
- ✅ `seo?.title` → `seo?.metaTitle`, `seo?.description` → `seo?.metaDescription`
- ✅ Ana sayfa hizmet link: `/${locale}/${slug}` → `/${locale}/hizmetler/${slug}`
- ✅ `md: 'row'` CSS Properties TypeScript hatası
