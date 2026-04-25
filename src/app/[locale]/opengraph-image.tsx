import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Prof. Dr. Gökçe Özel — Ankara KBB ve Rinoplasti Uzmanı';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const titles: Record<string, string> = {
    tr: 'Ankara\'nın Rinoplasti Uzmanı',
    en: 'Rhinoplasty & ENT Specialist Ankara',
    ar: 'أخصائية تجميل الأنف في أنقرة',
    ru: 'Специалист по ринопластике в Анкаре',
    fr: 'Rhinoplastie & ORL à Ankara',
    de: 'Rhinoplastik-Spezialistin in Ankara',
  };

  const subs: Record<string, string> = {
    tr: 'Profesörlük · 100+ Yayın · H-index 12',
    en: 'Professorship · 100+ Publications · H-index 12',
    ar: 'أستاذة · أكثر من 100 منشور',
    ru: 'Профессор · 100+ публикаций',
    fr: 'Professeure · 100+ publications',
    de: 'Professorin · 100+ Publikationen',
  };

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          background: 'linear-gradient(135deg, #0f0d0b 0%, #1a1410 50%, #0f0d0b 100%)',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gold orb */}
        <div
          style={{
            position: 'absolute',
            right: -100,
            top: -100,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(184,137,60,0.35), transparent 70%)',
          }}
        />
        {/* Left content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 50px' }}>
          {/* Logo mark */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14, marginBottom: 40,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'linear-gradient(135deg, #b8893c, #6a4d1f)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 16,
            }}>GÖ</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#f0d48e', fontSize: 20, fontWeight: 700 }}>Prof. Dr. Gökçe Özel</span>
              <span style={{ color: '#b8893c', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase' as const }}>KBB · Yüz Plastik Cerrahı</span>
            </div>
          </div>

          {/* Main title */}
          <div style={{
            fontSize: 52, fontWeight: 800, lineHeight: 1.05, marginBottom: 20,
            background: 'linear-gradient(135deg, #f0d48e, #b8893c 45%, #8f6b2e)',
            backgroundClip: 'text',
            color: 'transparent',
          }}>
            {titles[locale] || titles.tr}
          </div>

          {/* Subtitle */}
          <div style={{ color: '#9a8f7c', fontSize: 22, marginBottom: 40 }}>
            {subs[locale] || subs.tr}
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
            {['TYPCD', 'CMAC', 'Ankara · Ümitköy'].map(badge => (
              <div key={badge} style={{
                padding: '8px 18px',
                border: '1px solid rgba(184,137,60,0.4)',
                borderRadius: 999,
                color: '#d4b97a',
                fontSize: 13,
                background: 'rgba(184,137,60,0.08)',
              }}>{badge}</div>
            ))}
          </div>
        </div>

        {/* Right side — decorative */}
        <div style={{
          width: 280,
          background: 'rgba(184,137,60,0.06)',
          borderLeft: '1px solid rgba(184,137,60,0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
        }}>
          {[['15+', 'Yıl'], ['100+', 'Yayın'], ['H-12', 'Index'], ['4.9★', 'Puan']].map(([val, lbl]) => (
            <div key={lbl} style={{ textAlign: 'center' as const }}>
              <div style={{ color: '#d4b97a', fontSize: 34, fontWeight: 700 }}>{val}</div>
              <div style={{ color: '#9a8f7c', fontSize: 13 }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 4,
          background: 'linear-gradient(90deg, #b8893c, #f0d48e, #b8893c)',
        }} />
      </div>
    ),
    { ...size },
  );
}
