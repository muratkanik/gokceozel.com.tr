import nodemailer from 'nodemailer';

interface ResetMailInput {
  to: string;
  name: string;
  resetUrl: string;
}

interface ReservationConfirmationInput {
  to: string;
  name: string;
  service?: string | null;
  date: string;
  time: string;
  confirmUrl: string;
}

function resetMailHtml(name: string, resetUrl: string) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
      <h2>Cari takip şifre sıfırlama</h2>
      <p>Merhaba ${name},</p>
      <p>Gökçe Özel cari takip hesabınız için şifre sıfırlama talebi alındı.</p>
      <p><a href="${resetUrl}" style="display:inline-block;background:#059669;color:white;text-decoration:none;padding:12px 16px;border-radius:8px;font-weight:700">Yeni şifre belirle</a></p>
      <p>Bu bağlantı 30 dakika geçerlidir. Talebi siz oluşturmadıysanız bu e-postayı yok sayabilirsiniz.</p>
    </div>
  `;
}

export async function sendCariPasswordResetMail({ to, name, resetUrl }: ResetMailInput) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  const smtpFrom = process.env.CARI_RESET_FROM_EMAIL || process.env.SMTP_FROM || smtpUser;
  const subject = 'Cari takip şifre sıfırlama';
  const html = resetMailHtml(name, resetUrl);

  if (smtpHost && smtpUser && smtpPass && smtpFrom) {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: smtpFrom,
      to,
      subject,
      html,
    });

    return { sent: true as const, provider: 'smtp' as const };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CARI_RESET_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || 'Prof. Dr. Gökçe Özel <noreply@gokceozel.com.tr>';

  if (!apiKey) {
    console.warn(`Cari password reset mail provider missing. Reset URL for ${to}: ${resetUrl}`);
    return { sent: false, reason: 'missing_provider' as const };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Reset mail could not be sent: ${response.status} ${detail}`);
  }

  return { sent: true as const, provider: 'resend' as const };
}

async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  const smtpFrom = process.env.CARI_RESET_FROM_EMAIL || process.env.SMTP_FROM || smtpUser;

  if (smtpHost && smtpUser && smtpPass && smtpFrom) {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });
    await transporter.sendMail({ from: smtpFrom, to, subject, html });
    return { sent: true as const, provider: 'smtp' as const };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CARI_RESET_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || 'Prof. Dr. Gökçe Özel <noreply@gokceozel.com.tr>';
  if (!apiKey) {
    console.warn(`Mail provider missing. Mail to ${to}: ${subject}`);
    return { sent: false, reason: 'missing_provider' as const };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, html }),
  });
  if (!response.ok) throw new Error(`Mail could not be sent: ${response.status}`);
  return { sent: true as const, provider: 'resend' as const };
}

export async function sendReservationConfirmationMail({ to, name, service, date, time, confirmUrl }: ReservationConfirmationInput) {
  return sendMail({
    to,
    subject: 'Randevunuzu onaylayın',
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
        <h2>Randevunuzu onaylayın</h2>
        <p>Merhaba ${name},</p>
        <p>Prof. Dr. Gökçe Özel için oluşturduğunuz randevu talebini kesinleştirmek için aşağıdaki bağlantıya tıklayın.</p>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:14px;margin:16px 0">
          <p style="margin:0"><strong>Tarih:</strong> ${date}</p>
          <p style="margin:4px 0 0"><strong>Saat:</strong> ${time}</p>
          <p style="margin:4px 0 0"><strong>Hizmet:</strong> ${service || 'Belirtilmedi'}</p>
        </div>
        <p><a href="${confirmUrl}" style="display:inline-block;background:#059669;color:white;text-decoration:none;padding:12px 16px;border-radius:8px;font-weight:700">Randevuyu onayla</a></p>
        <p>Bu bağlantı 24 saat geçerlidir. Onaylanmayan randevular kesinleşmiş sayılmaz.</p>
      </div>
    `,
  });
}
