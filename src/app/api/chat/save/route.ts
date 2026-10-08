import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createHash } from 'crypto';

const ANXIETY_SIGNALS = [
  'korkuyorum', 'korku', 'afraid', 'scared', 'worried', 'endişe', 'endişeli',
  'tehlikeli', 'dangerous', 'risk', 'pişman', 'regret', 'acı', 'ağrı', 'pain',
  'emin değil', 'emin olamadım', 'not sure', 'güvenli mi', 'safe', 'güvenilir',
  'خوف', 'خطر', 'страх', 'опасно', 'больно',
];

const LEAD_KEYWORDS = [
  'randevu', 'appointment', 'fiyat', 'price', 'ücret', 'cost', 'ne kadar',
  'how much', 'iletişim', 'contact', 'telefon', 'phone', 'متى', 'سعر', 'цена', 'запись',
];

function detectAnxiety(messages: { role: string; content: string }[]): boolean {
  const userText = messages
    .filter(m => m.role === 'user')
    .map(m => m.content.toLowerCase())
    .join(' ');
  return ANXIETY_SIGNALS.some(s => userText.includes(s));
}

function calcLeadScore(messages: { role: string; content: string }[]): number {
  const userText = messages
    .filter(m => m.role === 'user')
    .map(m => m.content.toLowerCase())
    .join(' ');
  let score = 0;
  LEAD_KEYWORDS.forEach(kw => { if (userText.includes(kw)) score += 20; });
  score += Math.min(messages.filter(m => m.role === 'user').length * 5, 40);
  return Math.min(score, 100);
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId, messages, locale = 'tr' } = await req.json();

    if (!messages || messages.length < 2) {
      return NextResponse.json({ ok: true });
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
    const ipHash = ip ? createHash('sha256').update(ip).digest('hex').slice(0, 16) : null;
    const ua = req.headers.get('user-agent') || null;

    const anxiety = detectAnxiety(messages);
    const leadScore = calcLeadScore(messages);

    if (sessionId) {
      await prisma.chatSession.update({
        where: { id: sessionId },
        data: { messages, anxiety, leadScore, updatedAt: new Date() },
      });
    } else {
      await prisma.chatSession.create({
        data: { locale, messages, anxiety, leadScore, ipHash, userAgent: ua },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('chat/save error', e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
