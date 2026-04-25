import React from 'react';

type Translation = {
  locale: string;
  contentData: string;
};

type ContentBlock = {
  id: string;
  componentType: string;
  sortOrder: number;
  isActive: boolean;
  translations: Translation[];
};

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
};

type BlockRendererProps = {
  blocks: ContentBlock[];
  locale: string;
  faqs?: FaqItem[];
};

function parseContent(trans: Translation | undefined): Record<string, any> {
  if (!trans?.contentData) return {};
  try { return JSON.parse(trans.contentData); } catch { return {}; }
}

// ─── Individual Block Components ─────────────────────────────────────────────

function HeroSliderBlock({ content, id }: { content: any; id: string }) {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-[#141414] border border-[#2a2a2a] p-8 md:p-16 flex flex-col md:flex-row items-center gap-10">
      {/* Gold orb */}
      <div className="absolute right-0 top-0 w-96 h-96 rounded-full bg-[#b8893c]/10 blur-3xl pointer-events-none" />
      <div className="flex-1 z-10 text-center md:text-left">
        {content.tag && (
          <p className="text-[#b8893c] text-xs tracking-[.18em] uppercase mb-4 font-semibold">{content.tag}</p>
        )}
        <h1 className="font-serif text-4xl md:text-6xl text-white mb-6 leading-[1.05]">
          <span style={{ background: 'linear-gradient(135deg,#f0d48e,#b8893c 45%,#8f6b2e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {content.title}
          </span>
        </h1>
        {content.subtitle && (
          <p className="text-lg md:text-xl text-[#c9c0ae] font-light leading-relaxed max-w-xl mb-8">{content.subtitle}</p>
        )}
        {(content.ctaPrimary || content.ctaSecondary) && (
          <div className="flex gap-4 flex-wrap justify-center md:justify-start">
            {content.ctaPrimary && (
              <a href={content.ctaPrimaryUrl || '#'} className="px-7 py-3.5 rounded-full font-bold text-sm text-[#1a1410]" style={{ background: 'linear-gradient(135deg,#d4b97a,#8f6b2e)' }}>
                {content.ctaPrimary}
              </a>
            )}
            {content.ctaSecondary && (
              <a href={content.ctaSecondaryUrl || '#'} className="px-7 py-3.5 rounded-full font-semibold text-sm text-[#e9e4d8] border border-[#b8893c]/40 hover:border-[#b8893c] transition-colors">
                {content.ctaSecondary}
              </a>
            )}
          </div>
        )}
      </div>
      <div className="flex-1 aspect-[4/5] md:max-w-md w-full">
        {content.image ? (
          <img src={content.image} alt={content.imageAlt || content.title} className="w-full h-full object-cover rounded-2xl border border-[#b8893c]/20 shadow-2xl" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2a2010] to-[#0f0d0b] rounded-2xl border border-[#2a2a2a] grid place-items-center">
            <span className="text-[#b8893c]/20 font-serif tracking-widest text-sm">Görsel</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ZenginMetinBlock({ content, id }: { content: any; id: string }) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {content.title && (
        <h2 className="font-serif text-3xl md:text-4xl text-[#f0d48e] mb-6 text-center">{content.title}</h2>
      )}
      <div className="prose prose-invert prose-lg max-w-none prose-headings:text-[#d4af37] prose-headings:font-serif prose-a:text-[#d4af37] hover:prose-a:text-white prose-img:rounded-2xl bg-[#141414] p-8 md:p-12 rounded-3xl border border-[#2a2a2a]">
        <div dangerouslySetInnerHTML={{ __html: content.text || '' }} />
      </div>
    </div>
  );
}

function StatsBandBlock({ content, id }: { content: any; id: string }) {
  const stats: { value: string; label: string }[] = content.stats || [];
  return (
    <div className="w-full bg-gradient-to-r from-[#1a1410] via-[#241d14] to-[#1a1410] border-y border-[#b8893c]/20 py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s, i) => (
          <div key={i}>
            <p className="font-serif text-4xl md:text-5xl font-bold" style={{ background: 'linear-gradient(135deg,#f0d48e,#b8893c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {s.value}
            </p>
            <p className="text-[#9a8f7c] text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DoctorIntroBlock({ content, id }: { content: any; id: string }) {
  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div className="aspect-[3/4]">
        {content.image ? (
          <img src={content.image} alt={content.name || 'Dr. Gökçe Özel'} className="w-full h-full object-cover rounded-2xl border border-[#b8893c]/20 shadow-2xl" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2a2010] to-[#0f0d0b] rounded-2xl border border-[#2a2a2a] grid place-items-center">
            <span className="text-[#b8893c]/20 font-serif">Fotoğraf</span>
          </div>
        )}
      </div>
      <div>
        {content.tag && <p className="text-[#b8893c] text-xs tracking-[.18em] uppercase mb-3 font-semibold">{content.tag}</p>}
        <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">{content.name || content.title}</h2>
        {content.subtitle && <p className="text-[#d4b97a] text-sm font-medium mb-5">{content.subtitle}</p>}
        {content.body && <p className="text-[#9a8f7c] leading-relaxed mb-6">{content.body}</p>}
        {Array.isArray(content.credentials) && (
          <ul className="space-y-2">
            {content.credentials.map((c: string, i: number) => (
              <li key={i} className="flex gap-3 text-sm text-[#c9c0ae]">
                <span className="text-[#b8893c] mt-0.5 shrink-0">◆</span> {c}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function FaqAccordionBlock({ content, id, faqs }: { content: any; id: string; faqs?: FaqItem[] }) {
  // Use faqs from props (page-specific) or from block content
  const items: { q: string; a: string }[] = faqs
    ? faqs.map(f => ({ q: f.question, a: f.answer }))
    : (content.faqs || []);

  if (items.length === 0) return null;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {content.title && (
        <h2 className="font-serif text-3xl text-[#f0d48e] mb-8 text-center">{content.title}</h2>
      )}
      <div className="flex flex-col gap-2">
        {items.map(({ q, a }, i) => (
          <details key={i} className="group bg-[#141414] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#b8893c]/30 transition-colors">
            <summary className="flex items-center justify-between gap-4 cursor-pointer px-6 py-5 font-semibold text-[#e9e4d8] list-none select-none">
              <span>{q}</span>
              <span className="text-[#b8893c] shrink-0 transition-transform group-open:rotate-45 text-xl leading-none">+</span>
            </summary>
            <div className="px-6 pb-6 text-[#9a8f7c] leading-relaxed border-t border-[#2a2a2a] pt-4" dangerouslySetInnerHTML={{ __html: a }} />
          </details>
        ))}
      </div>
    </div>
  );
}

function TestimonialCarouselBlock({ content, id }: { content: any; id: string }) {
  const items: { name: string; text: string; rating?: number; source?: string }[] = content.testimonials || [];
  if (items.length === 0) return null;

  return (
    <div className="w-full">
      {content.title && (
        <h2 className="font-serif text-3xl text-[#f0d48e] mb-8 text-center">{content.title}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((t, i) => (
          <div key={i} className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 hover:border-[#b8893c]/30 transition-colors">
            <div className="flex gap-0.5 mb-3">
              {[1,2,3,4,5].map(s => (
                <span key={s} className={s <= (t.rating || 5) ? 'text-[#b8893c]' : 'text-[#2a2a2a]'}>★</span>
              ))}
            </div>
            <p className="text-[#c9c0ae] text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
            <div>
              <p className="text-[#e9e4d8] font-semibold text-sm">{t.name}</p>
              {t.source && <p className="text-[#9a8f7c] text-xs">{t.source}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CtaBannerBlock({ content, id }: { content: any; id: string }) {
  return (
    <div className="w-full rounded-3xl overflow-hidden relative text-center py-16 px-8" style={{ background: 'linear-gradient(135deg,#1a1410,#2a2010,#1a1410)' }}>
      <div className="absolute inset-0 bg-gradient-to-r from-[#b8893c]/10 via-[#b8893c]/5 to-[#b8893c]/10 pointer-events-none" />
      <p className="text-[#b8893c] text-xs tracking-[.18em] uppercase mb-3 font-semibold relative">{content.tag || 'Randevu'}</p>
      <h2 className="font-serif text-3xl md:text-5xl text-white mb-4 relative">{content.title}</h2>
      {content.subtitle && (
        <p className="text-[#9a8f7c] max-w-xl mx-auto mb-8 relative">{content.subtitle}</p>
      )}
      {content.cta && (
        <a href={content.ctaUrl || '#'} className="relative inline-block px-8 py-3.5 rounded-full font-bold text-sm text-[#1a1410] shadow-lg hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg,#d4b97a,#8f6b2e)' }}>
          {content.cta}
        </a>
      )}
    </div>
  );
}

function ServiceGridBlock({ content, id }: { content: any; id: string }) {
  const services: { title: string; description?: string; icon?: string; href?: string }[] = content.services || [];
  return (
    <div className="w-full">
      {content.title && (
        <h2 className="font-serif text-3xl text-[#f0d48e] mb-8 text-center">{content.title}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((s, i) => (
          <a key={i} href={s.href || '#'} className="group bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 hover:border-[#b8893c]/40 transition-all hover:-translate-y-1 duration-300">
            {s.icon && <div className="text-3xl mb-3">{s.icon}</div>}
            <h3 className="font-semibold text-[#e9e4d8] mb-2 group-hover:text-[#d4b97a] transition-colors">{s.title}</h3>
            {s.description && <p className="text-[#9a8f7c] text-sm leading-relaxed">{s.description}</p>}
          </a>
        ))}
      </div>
    </div>
  );
}

function GalleryMasonryBlock({ content, id }: { content: any; id: string }) {
  const images: { url: string; alt?: string; caption?: string }[] = content.images || [];
  if (images.length === 0) return null;

  return (
    <div className="w-full">
      {content.title && (
        <h2 className="font-serif text-3xl text-[#f0d48e] mb-8 text-center">{content.title}</h2>
      )}
      <div className="columns-2 md:columns-3 gap-4 space-y-4">
        {images.map((img, i) => (
          <div key={i} className="break-inside-avoid rounded-xl overflow-hidden border border-[#2a2a2a]">
            <img src={img.url} alt={img.alt || ''} className="w-full h-auto object-cover" loading="lazy" />
            {img.caption && (
              <p className="text-[#9a8f7c] text-xs p-3 bg-[#141414]">{img.caption}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function VideoEmbedBlock({ content, id }: { content: any; id: string }) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {content.title && (
        <h2 className="font-serif text-3xl text-[#f0d48e] mb-6 text-center">{content.title}</h2>
      )}
      <div className="aspect-video rounded-2xl overflow-hidden border border-[#2a2a2a] bg-[#141414]">
        {content.embedUrl ? (
          <iframe
            src={content.embedUrl}
            title={content.title || 'Video'}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-[#9a8f7c]">Video URL girilmemiş</div>
        )}
      </div>
    </div>
  );
}

function ProcedureInfoBlock({ content, id }: { content: any; id: string }) {
  const specs: { label: string; value: string }[] = content.specs || [];
  return (
    <div className="w-full max-w-3xl mx-auto bg-[#141414] border border-[#2a2a2a] rounded-2xl p-8">
      {content.title && (
        <h2 className="font-serif text-2xl text-[#f0d48e] mb-6">{content.title}</h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {specs.map((s, i) => (
          <div key={i} className="border border-[#2a2a2a] rounded-xl p-4">
            <p className="text-[#9a8f7c] text-xs uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-[#e9e4d8] font-semibold">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineBlock({ content, id }: { content: any; id: string }) {
  const steps: { title: string; description?: string; time?: string }[] = content.steps || [];
  return (
    <div className="w-full max-w-3xl mx-auto">
      {content.title && (
        <h2 className="font-serif text-3xl text-[#f0d48e] mb-8 text-center">{content.title}</h2>
      )}
      <div className="relative">
        <div className="absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-[#b8893c] to-transparent" />
        <div className="flex flex-col gap-8">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-6">
              <div className="w-10 h-10 rounded-full bg-[#b8893c] text-white text-sm font-bold grid place-items-center shrink-0 shadow-lg z-10">
                {i + 1}
              </div>
              <div>
                <h3 className="font-semibold text-[#e9e4d8] mb-1">{s.title}</h3>
                {s.time && <p className="text-[#b8893c] text-xs mb-1 font-medium">{s.time}</p>}
                {s.description && <p className="text-[#9a8f7c] text-sm leading-relaxed">{s.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BeforeAfterBlock({ content, id }: { content: any; id: string }) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {content.title && <h2 className="font-serif text-3xl text-[#f0d48e] mb-6 text-center">{content.title}</h2>}
      {content.description && <p className="text-[#9a8f7c] text-center mb-8">{content.description}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative rounded-2xl overflow-hidden border border-[#2a2a2a]">
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white z-10">ÖNCESİ</div>
          <img src={content.beforeImage} alt="Öncesi" className="w-full h-auto object-cover" />
        </div>
        <div className="relative rounded-2xl overflow-hidden border border-[#2a2a2a]">
          <div className="absolute top-4 right-4 bg-[#b8893c]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white z-10">SONRASI</div>
          <img src={content.afterImage} alt="Sonrası" className="w-full h-auto object-cover" />
        </div>
      </div>
    </div>
  );
}

function ImageWithTextBlock({ content, id }: { content: any; id: string }) {
  const isImageRight = content.imageAlignment === 'right';
  return (
    <div className={`w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center ${isImageRight ? 'md:flex-row-reverse' : ''}`}>
      <div className="flex-1 rounded-3xl overflow-hidden border border-[#2a2a2a] shadow-2xl">
        <img src={content.image} alt={content.title || 'Görsel'} className="w-full h-auto object-cover" />
      </div>
      <div className="flex-1">
        {content.tag && <p className="text-[#b8893c] text-xs tracking-[.18em] uppercase mb-4 font-semibold">{content.tag}</p>}
        {content.title && <h2 className="font-serif text-3xl md:text-4xl text-[#f0d48e] mb-6">{content.title}</h2>}
        <div className="prose prose-invert prose-p:text-[#9a8f7c] leading-relaxed" dangerouslySetInnerHTML={{ __html: content.text || '' }} />
      </div>
    </div>
  );
}

function IconGridBlock({ content, id }: { content: any; id: string }) {
  const items: { icon: string; title: string; text?: string }[] = content.items || [];
  return (
    <div className="w-full max-w-6xl mx-auto">
      {content.title && <h2 className="font-serif text-3xl text-[#f0d48e] mb-10 text-center">{content.title}</h2>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item, i) => (
          <div key={i} className="text-center p-6 bg-[#141414] border border-[#2a2a2a] rounded-2xl">
            {item.icon && <img src={item.icon} alt={item.title} className="w-12 h-12 mx-auto mb-4 object-contain invert opacity-80" />}
            <h3 className="font-semibold text-[#e9e4d8] mb-2">{item.title}</h3>
            {item.text && <p className="text-[#9a8f7c] text-sm">{item.text}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function QuoteBlock({ content, id }: { content: any; id: string }) {
  return (
    <div className="w-full max-w-4xl mx-auto text-center py-12 px-6">
      <span className="text-6xl text-[#b8893c]/20 font-serif leading-none block mb-4">"</span>
      <p className="text-2xl md:text-3xl font-serif text-[#f0d48e] leading-relaxed mb-6 italic">{content.quote}</p>
      {content.author && <p className="text-[#e9e4d8] font-semibold tracking-wide uppercase text-sm">{content.author}</p>}
      {content.role && <p className="text-[#9a8f7c] text-xs mt-1">{content.role}</p>}
    </div>
  );
}

function NumberedStepsBlock({ content, id }: { content: any; id: string }) {
  const steps: { title: string; description: string }[] = content.steps || [];
  return (
    <div className="w-full max-w-5xl mx-auto">
      {content.title && <h2 className="font-serif text-3xl text-[#f0d48e] mb-10 text-center">{content.title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((step, i) => (
          <div key={i} className="relative z-10 p-8 bg-[#141414] border border-[#2a2a2a] rounded-2xl">
            <span className="absolute -top-6 -left-4 text-7xl font-bold font-serif text-[#1a1a1a] select-none z-0">0{i + 1}</span>
            <div className="relative z-10">
              <h3 className="text-xl font-semibold text-[#e9e4d8] mb-3 text-[#b8893c]">{step.title}</h3>
              <p className="text-[#9a8f7c] text-sm leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparisonTableBlock({ content, id }: { content: any; id: string }) {
  const rows: { feature: string; optionA: string; optionB: string }[] = content.rows || [];
  return (
    <div className="w-full max-w-4xl mx-auto overflow-x-auto">
      {content.title && <h2 className="font-serif text-3xl text-[#f0d48e] mb-8 text-center">{content.title}</h2>}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#b8893c]/30">
            <th className="py-4 px-6 text-[#9a8f7c] font-medium">Özellik</th>
            <th className="py-4 px-6 text-[#e9e4d8] font-semibold">{content.headerA || 'Seçenek 1'}</th>
            <th className="py-4 px-6 text-[#e9e4d8] font-semibold bg-[#1a1410]">{content.headerB || 'Seçenek 2'}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[#2a2a2a] hover:bg-[#141414] transition-colors">
              <td className="py-4 px-6 text-[#c9c0ae] text-sm">{row.feature}</td>
              <td className="py-4 px-6 text-[#9a8f7c] text-sm">{row.optionA}</td>
              <td className="py-4 px-6 text-[#e9e4d8] text-sm font-medium bg-[#1a1410]">{row.optionB}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MapEmbedBlock({ content, id }: { content: any; id: string }) {
  return (
    <div className="w-full">
      {content.title && <h2 className="font-serif text-3xl text-[#f0d48e] mb-6 text-center">{content.title}</h2>}
      <div className="w-full h-96 rounded-3xl overflow-hidden border border-[#2a2a2a]">
        <iframe src={content.mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map" />
      </div>
    </div>
  );
}

function InstagramFeedBlock({ content, id }: { content: any; id: string }) {
  // Placeholder for Instagram embed until real API is integrated
  return (
    <div className="w-full max-w-6xl mx-auto text-center py-12">
      {content.title && <h2 className="font-serif text-3xl text-[#f0d48e] mb-4">{content.title}</h2>}
      <a href="https://instagram.com/drgokceozel" target="_blank" rel="noopener noreferrer" className="text-[#b8893c] hover:text-white transition-colors text-sm mb-8 inline-block">@drgokceozel Instagram'da Takip Edin</a>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="aspect-square bg-[#141414] border border-[#2a2a2a] rounded-xl flex items-center justify-center text-[#9a8f7c] text-xs">
            Instagram Post {i}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Renderer ────────────────────────────────────────────────────────────

export default function BlockRenderer({ blocks, locale, faqs }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) return null;

  const activeBlocks = blocks
    .filter(b => b.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="flex flex-col gap-10 md:gap-20 w-full">
      {activeBlocks.map((block) => {
        const trans = block.translations.find(t => t.locale === locale)
                   || block.translations.find(t => t.locale === 'tr');

        const content = parseContent(trans);

        switch (block.componentType) {
          case 'hero_slider':
            return <HeroSliderBlock key={block.id} content={content} id={block.id} />;

          case 'zengin_metin':
          case 'rich_text':
            return <ZenginMetinBlock key={block.id} content={content} id={block.id} />;

          case 'stats_band':
            return <StatsBandBlock key={block.id} content={content} id={block.id} />;

          case 'doctor_intro':
            return <DoctorIntroBlock key={block.id} content={content} id={block.id} />;

          case 'faq_accordion':
            return <FaqAccordionBlock key={block.id} content={content} id={block.id} faqs={faqs} />;

          case 'testimonial_carousel':
            return <TestimonialCarouselBlock key={block.id} content={content} id={block.id} />;

          case 'cta_banner':
            return <CtaBannerBlock key={block.id} content={content} id={block.id} />;

          case 'service_grid':
            return <ServiceGridBlock key={block.id} content={content} id={block.id} />;

          case 'gallery_masonry':
            return <GalleryMasonryBlock key={block.id} content={content} id={block.id} />;

          case 'video_embed':
            return <VideoEmbedBlock key={block.id} content={content} id={block.id} />;

          case 'procedure_card_row':
          case 'procedure_info':
            return <ProcedureInfoBlock key={block.id} content={content} id={block.id} />;

          case 'timeline':
            return <TimelineBlock key={block.id} content={content} id={block.id} />;
            
          case 'before_after':
            return <BeforeAfterBlock key={block.id} content={content} id={block.id} />;
            
          case 'image_with_text':
            return <ImageWithTextBlock key={block.id} content={content} id={block.id} />;
            
          case 'icon_grid':
            return <IconGridBlock key={block.id} content={content} id={block.id} />;
            
          case 'quote_block':
            return <QuoteBlock key={block.id} content={content} id={block.id} />;
            
          case 'numbered_steps':
            return <NumberedStepsBlock key={block.id} content={content} id={block.id} />;
            
          case 'comparison_table':
            return <ComparisonTableBlock key={block.id} content={content} id={block.id} />;
            
          case 'map_embed':
            return <MapEmbedBlock key={block.id} content={content} id={block.id} />;
            
          case 'instagram_feed':
            return <InstagramFeedBlock key={block.id} content={content} id={block.id} />;

          default:
            return (
              <div key={block.id} className="w-full p-8 border border-dashed border-[#2a2a2a] text-center text-slate-500 rounded-xl text-sm">
                Blok tipi &quot;{block.componentType}&quot; henüz render edilmiyor.
              </div>
            );
        }
      })}
    </div>
  );
}
