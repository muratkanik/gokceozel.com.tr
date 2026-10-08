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
  LEAD_KEYWORDS.forEach(kw => { if (userText.includes(kw)) score += 15; });
  score += Math.min(messages.filter(m => m.role === 'user').length * 5, 40);
  return Math.min(score, 100);
}

// Parse [CONTACT: ad=<name> tel=<phone>] tag injected by AI
function parseContact(messages: { role: string; content: string }[]): { name: string | null; phone: string | null } {
  for (const msg of [...messages].reverse()) {
    if (msg.role !== 'assistant') continue;
    const match = msg.content.match(/\[CONTACT:\s*ad=([^\]]+?)\s+tel=([^\]]+?)\]/i);
    if (match) {
      return { name: match[1].trim(), phone: match[2].trim() };
    }
  }
  return { name: null, phone: null };
}

// Strip [CONTACT:...] tags from stored messages (keep messages clean for display)
function stripContactTags(messages: { role: string; content: string }[]): { role: string; content: string }[] {
  return messages.map(m => ({
    ...m,
    content: m.content.replace(/\s*\[CONTACT:[^\]]*\]/gi, '').trim(),
  }));
}

// Generate a short AI summary of the conversation
async function generateSummary(messages: { role: string; content: string }[], locale: string): Promise<string | null> {
  const key = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  if (!key) return null;

  const convo = messages
    .filter(m => m.role !== 'system')
    .map(m => `${m.role === 'user' ? 'Hasta' : 'Asistan'}: ${m.content}`)
    .join('\n');

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `Sen bir klinik yöneticisisin. Aşağıdaki chatbot konuşmasını 2-3 cümleyle Türkçe özetle. Şunları belirt:
- Hasta ne sormak/öğrenmek istedi?
- Kaygılı mıydı? (varsa neden)
- Randevu/fiyat ilgisi var mı?
- İletişim bilgisi bıraktı mı?
Yalnızca özeti yaz, başlık veya madde ekleme.`,
          },
          { role: 'user', content: convo },
        ],
        temperature: 0.3,
        max_tokens: 200,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId, messages: rawMessages, locale = 'tr' } = await req.json();

    if (!rawMessages || rawMessages.length < 2) {
      return NextResponse.json({ ok: true });
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
    const ipHash = ip ? createHash('sha256').update(ip).digest('hex').slice(0, 16) : null;
    const ua = req.headers.get('user-agent') || null;

    const contact = parseContact(rawMessages);
    const cleanMessages = stripContactTags(rawMessages);
    const anxiety = detectAnxiety(cleanMessages);
    const leadScore = calcLeadScore(cleanMessages) + (contact.phone ? 30 : 0);
    const finalLeadScore = Math.min(leadScore, 100);

    // Generate summary (only if >= 3 user messages to save API cost)
    const userMsgCount = cleanMessages.filter(m => m.role === 'user').length;
    const summary = userMsgCount >= 3 ? await generateSummary(cleanMessages, locale) : null;

    if (sessionId) {
      const updated = await prisma.chatSession.update({
        where: { id: sessionId },
        data: {
          messages: cleanMessages,
          anxiety,
          leadScore: finalLeadScore,
          ...(contact.name && { contactName: contact.name }),
          ...(contact.phone && { contactPhone: contact.phone }),
          ...(summary && { summary }),
          updatedAt: new Date(),
        },
      });
      return NextResponse.json({ ok: true, sessionId: updated.id });
    } else {
      const created = await prisma.chatSession.create({
        data: {
          locale,
          messages: cleanMessages,
          anxiety,
          leadScore: finalLeadScore,
          ipHash,
          userAgent: ua,
          ...(contact.name && { contactName: contact.name }),
          ...(contact.phone && { contactPhone: contact.phone }),
          ...(summary && { summary }),
        },
      });
      return NextResponse.json({ ok: true, sessionId: created.id });
    }
  } catch (e) {
    console.error('chat/save error', e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
