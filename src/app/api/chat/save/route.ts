import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createHash } from 'crypto';
import { aiComplete } from '@/lib/ai-providers';

export const runtime = 'nodejs';

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

function stripContactTags(messages: { role: string; content: string }[]): { role: string; content: string }[] {
  return messages.map(m => ({
    ...m,
    content: m.content.replace(/\s*\[CONTACT:[^\]]*\]/gi, '').trim(),
  }));
}

async function generateSummary(messages: { role: string; content: string }[], locale: string): Promise<string | null> {
  const convo = messages
    .filter(m => m.role !== 'system')
    .map(m => `${m.role === 'user' ? 'Hasta' : 'Asistan'}: ${m.content}`)
    .join('\n');

  try {
    const { content } = await aiComplete(
      [
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
      { temperature: 0.3, maxTokens: 200, effort: 'low' },
    );
    return content || null;
  } catch {
    return null;
  }
}

async function getGeoLocation(ip: string): Promise<{ city: string | null; country: string | null }> {
  if (!ip || ip === '::1' || ip.startsWith('127.') || ip.startsWith('192.168.')) {
    return { city: null, country: null };
  }
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=city,country,status`, {
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return { city: null, country: null };
    const data = await res.json();
    if (data.status === 'success') {
      return { city: data.city || null, country: data.country || null };
    }
  } catch {}
  return { city: null, country: null };
}

async function sendWhatsAppNotification(
  contactName: string,
  contactPhone: string,
  summary: string | null,
  leadScore: number,
  city: string | null
): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_FROM; // whatsapp:+14155238886
  const toNumber = process.env.CLINIC_WHATSAPP_TO;     // whatsapp:+905342096935

  if (!accountSid || !authToken || !fromNumber || !toNumber) return;

  const emoji = leadScore >= 60 ? '🔥' : leadScore >= 30 ? '🌡️' : '❄️';
  const locationLine = city ? `📍 Konum: ${city}\n` : '';

  const body = `${emoji} *Yeni Potansiyel Hasta — Aranmak İstiyor!*

👤 Ad: *${contactName}*
📞 Tel: *${contactPhone}*
${locationLine}📊 Lead Skoru: ${leadScore}/100
${summary ? `\n💬 Özet: ${summary}` : ''}

_gokceozel.com.tr chatbot_`;

  try {
    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ From: fromNumber, To: toNumber, Body: body }).toString(),
        signal: AbortSignal.timeout(5000),
      }
    );
  } catch (e) {
    console.error('Twilio WhatsApp error:', e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId, messages: rawMessages, locale = 'tr' } = await req.json();

    if (!rawMessages || rawMessages.length < 2) {
      return NextResponse.json({ ok: true });
    }

    const rawIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
      || req.headers.get('x-real-ip')
      || '';
    const ipHash = rawIp ? createHash('sha256').update(rawIp).digest('hex').slice(0, 16) : null;
    const ua = req.headers.get('user-agent') || null;

    const contact = parseContact(rawMessages);
    const cleanMessages = stripContactTags(rawMessages);
    const anxiety = detectAnxiety(cleanMessages);
    const leadScore = calcLeadScore(cleanMessages) + (contact.phone ? 30 : 0);
    const finalLeadScore = Math.min(leadScore, 100);

    const userMsgCount = cleanMessages.filter(m => m.role === 'user').length;
    const summary = userMsgCount >= 3 ? await generateSummary(cleanMessages, locale) : null;

    if (sessionId) {
      // Check if phone was newly added (wasn't there before)
      const existing = await prisma.chatSession.findUnique({
        where: { id: sessionId },
        select: { contactPhone: true, whatsappNotified: true, city: true },
      });

      const phoneNewlyAdded = contact.phone && !existing?.contactPhone;
      const shouldNotify = phoneNewlyAdded && !existing?.whatsappNotified;

      // Get geo only if new session or city missing
      const geo = (!existing?.city && rawIp)
        ? await getGeoLocation(rawIp)
        : { city: existing?.city || null, country: null };

      const updated = await prisma.chatSession.update({
        where: { id: sessionId },
        data: {
          messages: cleanMessages,
          anxiety,
          leadScore: finalLeadScore,
          ...(contact.name && { contactName: contact.name }),
          ...(contact.phone && { contactPhone: contact.phone }),
          ...(summary && { summary }),
          ...(geo.city && { city: geo.city }),
          ...(geo.country && { country: geo.country }),
          ...(shouldNotify && { whatsappNotified: true }),
          updatedAt: new Date(),
        },
      });

      if (shouldNotify && contact.phone) {
        // Fire and forget — don't block response
        sendWhatsAppNotification(
          contact.name || 'Bilinmiyor',
          contact.phone,
          summary,
          finalLeadScore,
          geo.city
        ).catch(() => {});
      }

      return NextResponse.json({ ok: true, sessionId: updated.id });
    } else {
      const geo = rawIp ? await getGeoLocation(rawIp) : { city: null, country: null };

      const created = await prisma.chatSession.create({
        data: {
          locale,
          messages: cleanMessages,
          anxiety,
          leadScore: finalLeadScore,
          ipHash,
          userAgent: ua,
          city: geo.city,
          country: geo.country,
          ...(contact.name && { contactName: contact.name }),
          ...(contact.phone && { contactPhone: contact.phone }),
          ...(summary && { summary }),
        },
      });

      // If phone already present on first save, notify
      if (contact.phone) {
        sendWhatsAppNotification(
          contact.name || 'Bilinmiyor',
          contact.phone,
          summary,
          finalLeadScore,
          geo.city
        ).catch(() => {});

        await prisma.chatSession.update({
          where: { id: created.id },
          data: { whatsappNotified: true },
        });
      }

      return NextResponse.json({ ok: true, sessionId: created.id });
    }
  } catch (e) {
    console.error('chat/save error', e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
