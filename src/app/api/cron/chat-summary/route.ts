import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV !== 'production';
  return request.headers.get('authorization') === `Bearer ${secret}`;
}

async function sendMail(to: string, subject: string, html: string) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  const smtpFrom = process.env.SMTP_FROM || smtpUser;

  if (smtpHost && smtpUser && smtpPass && smtpFrom) {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });
    await transporter.sendMail({ from: smtpFrom, to, subject, html });
    return true;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || 'Prof. Dr. Gökçe Özel Klinik <noreply@gokceozel.com.tr>';
  if (apiKey) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, subject, html }),
    });
    return res.ok;
  }

  console.warn(`[chat-summary] Mail provider missing, skipping: ${to}`);
  return false;
}

function sessionHtml(sessions: any[]) {
  if (sessions.length === 0) {
    return `<p style="color:#9ca3af;font-style:italic">Bugün yeni sohbet yok.</p>`;
  }

  return sessions.map(s => {
    const hasContact = s.contactName || s.contactPhone;
    const leadColor = s.leadScore >= 60 ? '#22c55e' : s.leadScore >= 30 ? '#f59e0b' : '#9ca3af';
    const userMessages = s.messages.filter((m: any) => m.role === 'user');
    const firstQ = userMessages[0]?.content || '—';

    return `
<div style="border:1px solid #e8e1d4;border-radius:12px;padding:16px 20px;margin-bottom:12px;background:${hasContact ? '#f0fdf4' : '#fff'};">
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
    ${hasContact ? `
      <span style="font-weight:700;color:#059669;font-size:15px;">${s.contactName || 'İsim yok'}</span>
      ${s.contactPhone ? `<a href="tel:${s.contactPhone}" style="background:#059669;color:white;padding:2px 10px;border-radius:20px;text-decoration:none;font-size:12px;font-weight:700;">📞 ${s.contactPhone}</a>` : ''}
      ${s.contactPhone ? `<a href="https://wa.me/${s.contactPhone.replace(/\D/g,'')}" style="background:#25D366;color:white;padding:2px 10px;border-radius:20px;text-decoration:none;font-size:12px;font-weight:700;">WhatsApp</a>` : ''}
    ` : `<span style="color:#9ca3af;font-size:13px;font-style:italic;">İletişim bilgisi bırakmadı</span>`}
    ${s.anxiety ? `<span style="background:#fee2e2;color:#dc2626;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:700;">⚠️ Kaygılı</span>` : ''}
    <span style="background:#f4f0e8;color:#61706b;padding:2px 8px;border-radius:20px;font-size:11px;font-family:monospace;text-transform:uppercase;">${s.locale}</span>
    <span style="font-size:12px;color:${leadColor};font-weight:700;">Lead %${s.leadScore}</span>
    <span style="font-size:11px;color:#9ca3af;">${new Date(s.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
  </div>
  ${s.summary ? `<p style="color:#1e3a34;font-size:13px;line-height:1.6;margin:0 0 8px;background:#f0f9ff;border-left:3px solid #3b82f6;padding:8px 12px;border-radius:4px;"><strong>AI Özeti:</strong> ${s.summary}</p>` : ''}
  <p style="color:#61706b;font-size:13px;margin:0;"><strong>İlk soru:</strong> ${firstQ.length > 200 ? firstQ.slice(0, 200) + '…' : firstQ}</p>
  <p style="color:#9ca3af;font-size:11px;margin:6px 0 0;">${userMessages.length} kullanıcı mesajı</p>
</div>`;
  }).join('');
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch recipient emails from Settings
  const [recipientSetting] = await Promise.all([
    prisma.setting.findUnique({ where: { key: 'chat_summary_emails' } }),
  ]);

  const rawEmails = recipientSetting?.value || process.env.CHAT_SUMMARY_EMAILS || '';
  const recipients = rawEmails
    .split(',')
    .map((e: string) => e.trim())
    .filter((e: string) => e.includes('@'));

  if (recipients.length === 0) {
    return NextResponse.json({ ok: false, reason: 'No recipients configured. Set chat_summary_emails in Settings.' });
  }

  // Fetch sessions created in last 24 hours not yet emailed
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const sessions = await prisma.chatSession.findMany({
    where: { createdAt: { gte: since }, emailSent: false },
    orderBy: [{ leadScore: 'desc' }, { createdAt: 'desc' }],
    take: 50,
  });

  const today = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
  const contactCount = sessions.filter(s => s.contactPhone).length;
  const anxietyCount = sessions.filter(s => s.anxiety).length;
  const hotCount = sessions.filter(s => s.leadScore >= 60).length;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Sohbet Özeti</title></head>
<body style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;padding:24px;color:#17201e;background:#fcfbf9;">
  <div style="background:#17201e;color:white;padding:20px 24px;border-radius:12px 12px 0 0;margin-bottom:0;">
    <h1 style="margin:0;font-size:20px;font-weight:700;">💬 AI Sohbet Günlük Özeti</h1>
    <p style="margin:4px 0 0;color:#b8893c;font-size:14px;">${today} · Prof. Dr. Gökçe Özel Kliniği</p>
  </div>

  <div style="background:#f4f0e8;padding:16px 24px;border-radius:0 0 12px 12px;margin-bottom:20px;display:flex;gap:24px;flex-wrap:wrap;">
    <div><span style="font-size:24px;font-weight:700;color:#17201e;">${sessions.length}</span><br><span style="font-size:12px;color:#61706b;">Toplam sohbet</span></div>
    <div><span style="font-size:24px;font-weight:700;color:#059669;">${contactCount}</span><br><span style="font-size:12px;color:#61706b;">İletişim bilgisi</span></div>
    <div><span style="font-size:24px;font-weight:700;color:#22c55e;">${hotCount}</span><br><span style="font-size:12px;color:#61706b;">Sıcak lead</span></div>
    <div><span style="font-size:24px;font-weight:700;color:#dc2626;">${anxietyCount}</span><br><span style="font-size:12px;color:#61706b;">Kaygılı hasta</span></div>
  </div>

  ${contactCount > 0 ? `
  <h2 style="font-size:15px;font-weight:700;color:#059669;margin:20px 0 10px;">📞 İletişim Bilgisi Bırakanlar (${contactCount})</h2>
  ${sessionHtml(sessions.filter(s => s.contactPhone))}
  <h2 style="font-size:15px;font-weight:700;color:#61706b;margin:24px 0 10px;">Diğer Sohbetler (${sessions.length - contactCount})</h2>
  ${sessionHtml(sessions.filter(s => !s.contactPhone))}
  ` : `
  <h2 style="font-size:15px;font-weight:700;color:#17201e;margin:20px 0 10px;">Tüm Sohbetler</h2>
  ${sessionHtml(sessions)}
  `}

  <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e8e1d4;text-align:center;">
    <a href="https://gokceozel.com.tr/admin/sohbet" style="background:#17201e;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:700;">Admin Panelini Aç</a>
  </div>

  <p style="font-size:11px;color:#9ca3af;text-align:center;margin-top:16px;">
    Bu e-posta otomatik olarak gönderilmektedir. Alıcıları değiştirmek için Admin → Ayarlar → chat_summary_emails
  </p>
</body>
</html>`;

  let sentCount = 0;
  for (const email of recipients) {
    try {
      const ok = await sendMail(
        email,
        `💬 ${today} — ${sessions.length} sohbet, ${contactCount} iletişim`,
        html,
      );
      if (ok) sentCount++;
    } catch (e) {
      console.error(`[chat-summary] Failed to send to ${email}:`, e);
    }
  }

  // Mark sessions as emailed
  if (sessions.length > 0) {
    await prisma.chatSession.updateMany({
      where: { id: { in: sessions.map(s => s.id) } },
      data: { emailSent: true },
    });
  }

  return NextResponse.json({
    ok: true,
    date: today,
    sessions: sessions.length,
    contacts: contactCount,
    emailsSent: sentCount,
    recipients,
  });
}
