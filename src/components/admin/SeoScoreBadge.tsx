'use client';

import React, { useMemo } from 'react';

interface SeoScoreBadgeProps {
  content: string;
}

export default function SeoScoreBadge({ content }: SeoScoreBadgeProps) {
  const { score, reasons } = useMemo(() => {
    let s = 100;
    const notes: string[] = [];
    
    if (!content || content.trim() === '') {
      return { score: 0, reasons: ['İçerik boş.'] };
    }

    const wordCount = content.replace(/<[^>]*>?/gm, '').split(/\s+/).filter(Boolean).length;
    
    if (wordCount < 100) {
      s -= 30;
      notes.push('Kelime sayısı çok az (<100 kelime).');
    } else if (wordCount > 1000) {
      notes.push('Kapsamlı ve uzun içerik (Güzel).');
    }

    const hasH2 = /<h2[^>]*>/i.test(content);
    const hasH3 = /<h3[^>]*>/i.test(content);

    if (!hasH2) {
      s -= 15;
      notes.push('Hiç H2 başlığı kullanılmamış.');
    }
    
    if (hasH2 && !hasH3) {
      s -= 5;
      notes.push('H3 alt başlıkları eklenebilir.');
    }

    const hasBold = /<strong[^>]*>|<b[^>]*>/i.test(content);
    if (!hasBold) {
      s -= 10;
      notes.push('Önemli kelimeler kalın (bold) yapılmamış.');
    }

    const hasLinks = /<a[^>]*>/i.test(content);
    if (!hasLinks) {
      s -= 10;
      notes.push('İç veya dış bağlantı (link) bulunmuyor.');
    }

    if (s === 100) {
      notes.push('SEO açısından mükemmel görünüyor!');
    }

    return { score: Math.max(0, s), reasons: notes };
  }, [content]);

  let color = '#2ed573'; // green
  if (score < 50) color = '#ff4757'; // red
  else if (score < 80) color = '#ffa502'; // orange

  return (
    <div style={{ marginTop: '20px', padding: '15px', borderRadius: '8px', border: `1px solid ${color}33`, background: `${color}11` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <strong style={{ color: '#333' }}>SEO Puanı:</strong>
        <span style={{ 
          background: color, 
          color: '#fff', 
          padding: '4px 12px', 
          borderRadius: '20px', 
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          {score} / 100
        </span>
      </div>
      <ul style={{ margin: 0, paddingLeft: '20px', color: '#555', fontSize: '13px' }}>
        {reasons.map((r, i) => (
          <li key={i} style={{ marginBottom: '4px' }}>{r}</li>
        ))}
      </ul>
    </div>
  );
}
