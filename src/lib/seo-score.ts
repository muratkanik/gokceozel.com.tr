/**
 * SEO Score Calculator
 * Analyzes HTML content from zengin_metin blocks and returns 0-100 score
 */

export interface SeoBreakdown {
  wordCount:    { score: number; max: number; words: number };
  charLength:   { score: number; max: number; chars: number };
  h2Headings:   { score: number; max: number; count: number };
  h3Headings:   { score: number; max: number; count: number };
  paragraphs:   { score: number; max: number; count: number };
  lists:        { score: number; max: number; count: number };
  boldText:     { score: number; max: number; hasBold: boolean };
  links:        { score: number; max: number; count: number };
}

export interface SeoScoreResult {
  total: number;        // 0–100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  breakdown: SeoBreakdown;
}

/** Strip HTML tags and return plain text */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Count occurrences of an HTML tag */
function countTag(html: string, tag: string): number {
  const re = new RegExp(`<${tag}[\\s>]`, 'gi');
  return (html.match(re) || []).length;
}

export function calcSeoScore(html: string | null | undefined): SeoScoreResult {
  if (!html || html.trim().length < 10) {
    return {
      total: 0,
      grade: 'F',
      breakdown: {
        wordCount:  { score: 0, max: 25, words: 0 },
        charLength: { score: 0, max: 25, chars: 0 },
        h2Headings: { score: 0, max: 15, count: 0 },
        h3Headings: { score: 0, max: 10, count: 0 },
        paragraphs: { score: 0, max: 12, count: 0 },
        lists:      { score: 0, max: 8,  count: 0 },
        boldText:   { score: 0, max: 3,  hasBold: false },
        links:      { score: 0, max: 2,  count: 0 },
      },
    };
  }

  const plain  = stripHtml(html);
  const words  = plain.split(/\s+/).filter(Boolean).length;
  const chars  = plain.length;
  const h2     = countTag(html, 'h2');
  const h3     = countTag(html, 'h3');
  const p      = countTag(html, 'p');
  const ul     = countTag(html, 'ul') + countTag(html, 'ol');
  const bold   = /<strong|<b[\s>]/i.test(html);
  const links  = (html.match(/<a\s/gi) || []).length;

  // --- Word count: 0–25 pts ---
  let wcScore = 0;
  if (words >= 1200) wcScore = 25;
  else if (words >= 800) wcScore = 20;
  else if (words >= 500) wcScore = 15;
  else if (words >= 300) wcScore = 10;
  else if (words >= 150) wcScore = 5;

  // --- Char length: 0–25 pts ---
  let clScore = 0;
  if (chars >= 6000) clScore = 25;
  else if (chars >= 4000) clScore = 20;
  else if (chars >= 2500) clScore = 15;
  else if (chars >= 1500) clScore = 10;
  else if (chars >= 700)  clScore = 5;

  // --- H2 headings: 0–15 pts ---
  let h2Score = 0;
  if (h2 >= 4) h2Score = 15;
  else if (h2 === 3) h2Score = 12;
  else if (h2 === 2) h2Score = 8;
  else if (h2 === 1) h2Score = 4;

  // --- H3 headings: 0–10 pts ---
  let h3Score = 0;
  if (h3 >= 3) h3Score = 10;
  else if (h3 === 2) h3Score = 7;
  else if (h3 === 1) h3Score = 4;

  // --- Paragraphs: 0–12 pts ---
  let pScore = 0;
  if (p >= 10) pScore = 12;
  else if (p >= 7) pScore = 10;
  else if (p >= 5) pScore = 8;
  else if (p >= 3) pScore = 5;
  else if (p >= 1) pScore = 2;

  // --- Lists: 0–8 pts ---
  let listScore = 0;
  if (ul >= 3) listScore = 8;
  else if (ul === 2) listScore = 6;
  else if (ul === 1) listScore = 4;

  // --- Bold text: 0–3 pts ---
  const boldScore = bold ? 3 : 0;

  // --- Links: 0–2 pts ---
  let linkScore = 0;
  if (links >= 2) linkScore = 2;
  else if (links === 1) linkScore = 1;

  const total = wcScore + clScore + h2Score + h3Score + pScore + listScore + boldScore + linkScore;

  let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  if (total >= 85) grade = 'A';
  else if (total >= 70) grade = 'B';
  else if (total >= 55) grade = 'C';
  else if (total >= 40) grade = 'D';

  return {
    total,
    grade,
    breakdown: {
      wordCount:  { score: wcScore,   max: 25, words  },
      charLength: { score: clScore,   max: 25, chars  },
      h2Headings: { score: h2Score,   max: 15, count: h2 },
      h3Headings: { score: h3Score,   max: 10, count: h3 },
      paragraphs: { score: pScore,    max: 12, count: p  },
      lists:      { score: listScore, max: 8,  count: ul },
      boldText:   { score: boldScore, max: 3,  hasBold: bold },
      links:      { score: linkScore, max: 2,  count: links },
    },
  };
}

export function gradeColor(grade: string): string {
  switch (grade) {
    case 'A': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    case 'B': return 'text-blue-700 bg-blue-50 border-blue-200';
    case 'C': return 'text-amber-700 bg-amber-50 border-amber-200';
    case 'D': return 'text-orange-700 bg-orange-50 border-orange-200';
    default:  return 'text-red-700 bg-red-50 border-red-200';
  }
}

export function scoreBarColor(score: number): string {
  if (score >= 85) return 'bg-emerald-500';
  if (score >= 70) return 'bg-blue-500';
  if (score >= 55) return 'bg-amber-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
}
