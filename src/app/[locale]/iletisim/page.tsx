'use client';

import { useState } from 'react';

const I18N = {
  tr: {
    title: 'İletişim & Randevu',
    subtitle: 'Sorularınız veya randevu talebiniz için bize ulaşın.',
    address: 'Adres',
    phone: 'Telefon',
    email: 'E-Posta',
    hours: 'Çalışma Saatleri',
    hoursVal: 'Pazartesi – Cumartesi · 10:00 – 18:00',
    addressVal: 'Ümitköy Mahallesi, Çankaya, Ankara',
    namePh: 'Adınız Soyadınız',
    emailPh: 'E-Posta (İsteğe Bağlı)',
    phonePh: 'Telefon Numaranız',
    msgPh: 'Mesajınız veya randevu almak istediğiniz hizmet',
    servicePh: 'İlgilendiğiniz Hizmet',
    send: 'Randevu Talebi Gönder',
    sending: 'Gönderiliyor...',
    success: 'Mesajınız alındı! En kısa sürede sizi arayacağız.',
    error: 'Bir sorun oluştu. Lütfen telefonla ulaşın: +90 534 209 69 35',
    social: 'Sosyal Medya',
    form: 'Randevu Formu',
  },
  en: {
    title: 'Contact & Appointment',
    subtitle: 'Reach out to us for questions or to book an appointment.',
    address: 'Address', phone: 'Phone', email: 'Email',
    hours: 'Working Hours', hoursVal: 'Monday – Saturday · 10:00 – 18:00',
    addressVal: 'Ümitköy District, Çankaya, Ankara, Turkey',
    namePh: 'Full Name', emailPh: 'Email (Optional)', phonePh: 'Phone Number',
    msgPh: 'Your message or preferred service',
    servicePh: 'Service of Interest',
    send: 'Send Appointment Request', sending: 'Sending...',
    success: 'Message received! We will call you shortly.',
    error: 'Something went wrong. Please call us: +90 534 209 69 35',
    social: 'Social Media', form: 'Appointment Form',
  },
  ar: {
    title: 'التواصل والمواعيد',
    subtitle: 'تواصل معنا لأي استفسار أو لحجز موعد.',
    address: 'العنوان', phone: 'الهاتف', email: 'البريد الإلكتروني',
    hours: 'ساعات العمل', hoursVal: 'الاثنين – السبت · 10:00 – 18:00',
    addressVal: 'حي أوميتكوي، تشانكايا، أنقرة، تركيا',
    namePh: 'الاسم الكامل', emailPh: 'البريد الإلكتروني (اختياري)', phonePh: 'رقم الهاتف',
    msgPh: 'رسالتك أو الخدمة المطلوبة',
    servicePh: 'الخدمة المطلوبة',
    send: 'إرسال طلب الموعد', sending: 'جارٍ الإرسال...',
    success: 'تم استلام رسالتك! سنتصل بك قريباً.',
    error: 'حدث خطأ ما. يرجى الاتصال: +90 534 209 69 35',
    social: 'وسائل التواصل الاجتماعي', form: 'نموذج الموعد',
  },
  ru: {
    title: 'Контакты и запись',
    subtitle: 'Свяжитесь с нами по вопросам или для записи на приём.',
    address: 'Адрес', phone: 'Телефон', email: 'Эл. почта',
    hours: 'Рабочие часы', hoursVal: 'Пн – Сб · 10:00 – 18:00',
    addressVal: 'Район Юмиткёй, Чанкая, Анкара, Турция',
    namePh: 'Полное имя', emailPh: 'Эл. почта (необязательно)', phonePh: 'Номер телефона',
    msgPh: 'Ваше сообщение или интересующая услуга',
    servicePh: 'Интересующая услуга',
    send: 'Отправить заявку', sending: 'Отправляем...',
    success: 'Сообщение получено! Мы свяжемся с вами.',
    error: 'Произошла ошибка. Позвоните: +90 534 209 69 35',
    social: 'Социальные сети', form: 'Форма записи',
  },
  fr: {
    title: 'Contact & Rendez-vous',
    subtitle: 'Contactez-nous pour toute question ou pour prendre rendez-vous.',
    address: 'Adresse', phone: 'Téléphone', email: 'E-mail',
    hours: 'Horaires', hoursVal: 'Lundi – Samedi · 10h – 18h',
    addressVal: 'Quartier Ümitköy, Çankaya, Ankara, Turquie',
    namePh: 'Nom complet', emailPh: 'E-mail (optionnel)', phonePh: 'Numéro de téléphone',
    msgPh: 'Votre message ou le soin souhaité',
    servicePh: 'Soin souhaité',
    send: 'Envoyer la demande', sending: 'Envoi...',
    success: 'Message reçu ! Nous vous rappellerons bientôt.',
    error: 'Une erreur est survenue. Appelez-nous : +90 534 209 69 35',
    social: 'Réseaux sociaux', form: 'Formulaire de RDV',
  },
  de: {
    title: 'Kontakt & Termin',
    subtitle: 'Kontaktieren Sie uns für Fragen oder zur Terminbuchung.',
    address: 'Adresse', phone: 'Telefon', email: 'E-Mail',
    hours: 'Öffnungszeiten', hoursVal: 'Mo – Sa · 10:00 – 18:00',
    addressVal: 'Ümitköy Viertel, Çankaya, Ankara, Türkei',
    namePh: 'Vollständiger Name', emailPh: 'E-Mail (optional)', phonePh: 'Telefonnummer',
    msgPh: 'Ihre Nachricht oder gewünschte Behandlung',
    servicePh: 'Gewünschte Behandlung',
    send: 'Anfrage senden', sending: 'Senden...',
    success: 'Nachricht empfangen! Wir melden uns bald.',
    error: 'Fehler aufgetreten. Bitte rufen Sie an: +90 534 209 69 35',
    social: 'Soziale Medien', form: 'Terminformular',
  },
};

const SERVICES = [
  'Rinoplasti / Rhinoplasty',
  'Blefaroplasti / Blepharoplasty',
  'Endolift Lazer',
  'Botoks / Botox',
  'Dudak Dolgusu / Lip Filler',
  'Dudak Kaldırma / Lip Lift',
  'İp Askılama / Thread Lift',
  'Kepçe Kulak / Otoplasty',
  'Mezoterapi / Mesotherapy',
  'PRP',
  'Lazerle Yüz Germe',
  'Gamze Estetiği',
  'Diğer / Other',
];

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default function IletisimPage({ params }: PageProps) {
  const [locale, setLocale] = useState('tr');
  const [resolved, setResolved] = useState(false);

  // Resolve locale from params
  if (!resolved) {
    params.then(({ locale: l }) => {
      setLocale(l);
      setResolved(true);
    });
  }

  const t = I18N[locale as keyof typeof I18N] || I18N.tr;

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', service: '', message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/randevu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          message: formData.service
            ? `[${formData.service}] ${formData.message}`
            : formData.message,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const inputCls = "w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[#e9e4d8] placeholder-[#5a5248] text-[14px] outline-none focus:border-[#b8893c]/60 focus:ring-1 focus:ring-[#b8893c]/20 transition-all";

  return (
    <main className="min-h-screen bg-[#0a0908] text-white py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#b8893c] text-xs tracking-[.18em] uppercase mb-3 font-semibold">
            Prof. Dr. Gökçe Özel
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">{t.title}</h1>
          <p className="text-[#9a8f7c]">{t.subtitle}</p>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#b8893c] to-transparent mx-auto mt-4" />
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Contact Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 space-y-5">
              <ContactItem icon="📍" label={t.address} value={t.addressVal} />
              <ContactItem
                icon="📞" label={t.phone}
                value="+90 534 209 69 35"
                href="tel:+905342096935"
              />
              <ContactItem
                icon="✉️" label={t.email}
                value="info@gokceozel.com.tr"
                href="mailto:info@gokceozel.com.tr"
              />
              <ContactItem icon="🕐" label={t.hours} value={t.hoursVal} />
            </div>

            {/* Social */}
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
              <h3 className="text-[#b8893c] text-xs tracking-widest uppercase font-semibold mb-4">{t.social}</h3>
              <div className="space-y-3">
                <a
                  href="https://www.instagram.com/drgokceozel"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[#9a8f7c] hover:text-white transition-colors text-[14px] group"
                >
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex items-center justify-center text-white text-sm flex-shrink-0">IG</span>
                  <span className="group-hover:text-[#d4b97a]">@drgokceozel</span>
                </a>
                <a
                  href="https://www.youtube.com/@drgokceozel"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[#9a8f7c] hover:text-white transition-colors text-[14px] group"
                >
                  <span className="w-8 h-8 rounded-lg bg-[#FF0000] flex items-center justify-center text-white text-sm flex-shrink-0">YT</span>
                  <span className="group-hover:text-[#d4b97a]">@drgokceozel</span>
                </a>
                <a
                  href="https://wa.me/905342096935"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[#9a8f7c] hover:text-white transition-colors text-[14px] group"
                >
                  <span className="w-8 h-8 rounded-lg bg-[#25D366] flex items-center justify-center text-white text-sm flex-shrink-0">WA</span>
                  <span className="group-hover:text-[#d4b97a]">WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-[#2a2a2a] h-48">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3061.5!2d32.6897!3d39.8938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDUzJzM3LjciTiAzMsKwNDEnMjIuOSJF!5e0!3m2!1str!2str!4v1"
                width="100%" height="100%" style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                title="Klinik konumu"
              />
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3">
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-8">
              <h2 className="font-serif text-2xl text-white mb-6">{t.form}</h2>

              {status === 'success' ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">✓</div>
                  <p className="text-[#d4b97a] text-lg font-semibold mb-2">{t.success}</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 text-[#9a8f7c] text-sm underline hover:text-white"
                  >
                    ← Yeni form
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input type="text" name="name" required value={formData.name}
                      onChange={handleChange} placeholder={t.namePh} className={inputCls} />
                    <input type="tel" name="phone" required value={formData.phone}
                      onChange={handleChange} placeholder={t.phonePh} className={inputCls} />
                  </div>
                  <input type="email" name="email" value={formData.email}
                    onChange={handleChange} placeholder={t.emailPh} className={inputCls} />
                  <select name="service" value={formData.service}
                    onChange={handleChange}
                    className={`${inputCls} cursor-pointer`}
                  >
                    <option value="">{t.servicePh}</option>
                    {SERVICES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <textarea name="message" value={formData.message}
                    onChange={handleChange} placeholder={t.msgPh}
                    rows={4} className={`${inputCls} resize-none`} />

                  {status === 'error' && (
                    <p className="text-red-400 text-sm">{t.error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-[#b8893c] hover:bg-[#d4b97a] text-white font-bold text-[13px] tracking-widest uppercase py-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-lg shadow-[#b8893c]/20"
                  >
                    {status === 'loading' ? t.sending : t.send}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function ContactItem({
  icon, label, value, href,
}: {
  icon: string; label: string; value: string; href?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-lg flex-shrink-0 mt-0.5">{icon}</span>
      <div>
        <p className="text-[#b8893c] text-[11px] tracking-widest uppercase font-semibold mb-0.5">{label}</p>
        {href ? (
          <a href={href} className="text-[#e9e4d8] text-[14px] hover:text-[#d4b97a] transition-colors">{value}</a>
        ) : (
          <p className="text-[#e9e4d8] text-[14px]">{value}</p>
        )}
      </div>
    </div>
  );
}
