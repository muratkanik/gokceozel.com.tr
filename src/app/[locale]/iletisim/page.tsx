'use client';

import { use, useEffect, useMemo, useState } from 'react';

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
    datePh: 'Randevu tarihi',
    timePh: 'Uygun saat',
    send: 'Randevu Talebi Gönder',
    sending: 'Gönderiliyor...',
    success: 'Mesajınız alındı! En kısa sürede sizi arayacağız.',
    confirmInfo: 'Randevunuzun kesinleşmesi için e-postanıza gönderilen onay bağlantısına tıklayın.',
    confirmed: 'Randevunuz onaylandı. Görüşmek üzere.',
    invalidConfirm: 'Onay bağlantısı geçersiz veya süresi dolmuş.',
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
    datePh: 'Appointment date', timePh: 'Available time',
    send: 'Send Appointment Request', sending: 'Sending...',
    success: 'Message received! We will call you shortly.',
    confirmInfo: 'Please click the confirmation link sent to your email to finalize the appointment.',
    confirmed: 'Your appointment is confirmed. See you soon.',
    invalidConfirm: 'The confirmation link is invalid or expired.',
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
    datePh: 'تاريخ الموعد', timePh: 'وقت متاح',
    send: 'إرسال طلب الموعد', sending: 'جارٍ الإرسال...',
    success: 'تم استلام رسالتك! سنتصل بك قريباً.',
    confirmInfo: 'يرجى تأكيد الموعد من الرابط المرسل إلى بريدك الإلكتروني.',
    confirmed: 'تم تأكيد موعدك.',
    invalidConfirm: 'رابط التأكيد غير صالح أو منتهي الصلاحية.',
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
    datePh: 'Дата приёма', timePh: 'Свободное время',
    send: 'Отправить заявку', sending: 'Отправляем...',
    success: 'Сообщение получено! Мы свяжемся с вами.',
    confirmInfo: 'Подтвердите запись по ссылке, отправленной на вашу почту.',
    confirmed: 'Ваша запись подтверждена.',
    invalidConfirm: 'Ссылка подтверждения недействительна или истекла.',
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
    datePh: 'Date du rendez-vous', timePh: 'Créneau disponible',
    send: 'Envoyer la demande', sending: 'Envoi...',
    success: 'Message reçu ! Nous vous rappellerons bientôt.',
    confirmInfo: 'Veuillez confirmer le rendez-vous avec le lien envoyé par e-mail.',
    confirmed: 'Votre rendez-vous est confirmé.',
    invalidConfirm: 'Le lien de confirmation est invalide ou expiré.',
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
    datePh: 'Termindatum', timePh: 'Verfügbare Uhrzeit',
    send: 'Anfrage senden', sending: 'Senden...',
    success: 'Nachricht empfangen! Wir melden uns bald.',
    confirmInfo: 'Bitte bestätigen Sie den Termin über den Link in Ihrer E-Mail.',
    confirmed: 'Ihr Termin ist bestätigt.',
    invalidConfirm: 'Der Bestätigungslink ist ungültig oder abgelaufen.',
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
  const { locale } = use(params);
  const t = I18N[locale as keyof typeof I18N] || I18N.tr;
  const currentMonth = new Date().toISOString().slice(0, 7);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', service: '', message: '', date: '', startTime: '',
  });
  const [slots, setSlots] = useState<Array<{ startTime: string; endTime: string; available: boolean }>>([]);
  const [calendarMonth, setCalendarMonth] = useState(currentMonth);
  const [calendarDays, setCalendarDays] = useState<Array<{ date: string; availableCount: number; available: boolean; reason?: string }>>([]);
  const [slotReason, setSlotReason] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [banner, setBanner] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    const result = new URLSearchParams(window.location.search).get('rezervasyon');
    if (result === 'onaylandi') setBanner(t.confirmed);
    if (result === 'gecersiz') setBanner(t.invalidConfirm);
  }, [t.confirmed, t.invalidConfirm]);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/rezervasyon/takvim?month=${encodeURIComponent(calendarMonth)}`)
      .then((res) => res.json())
      .then((data) => {
        if (mounted) setCalendarDays(data.days || []);
      })
      .catch(() => {
        if (mounted) setCalendarDays([]);
      });
    return () => {
      mounted = false;
    };
  }, [calendarMonth]);

  useEffect(() => {
    let mounted = true;
    if (!formData.date) {
      setSlots([]);
      setSlotReason('');
      return;
    }

    fetch(`/api/rezervasyon/musaitlik?date=${encodeURIComponent(formData.date)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        setSlots(data.slots || []);
        setSlotReason(data.reason || '');
        if (formData.startTime && !(data.slots || []).some((slot: any) => slot.startTime === formData.startTime && slot.available)) {
          setFormData((prev) => ({ ...prev, startTime: '' }));
        }
      })
      .catch(() => {
        if (mounted) {
          setSlots([]);
          setSlotReason('Saatler alınamadı.');
        }
      });

    return () => {
      mounted = false;
    };
  }, [formData.date, formData.startTime]);

  const calendarCells = useMemo(() => {
    const [year, month] = calendarMonth.split('-').map(Number);
    const firstDay = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
    const leading = (firstDay + 6) % 7;
    return [
      ...Array.from({ length: leading }, () => null),
      ...calendarDays,
    ];
  }, [calendarDays, calendarMonth]);

  const shiftMonth = (delta: number) => {
    const [year, month] = calendarMonth.split('-').map(Number);
    const next = new Date(Date.UTC(year, month - 1 + delta, 1));
    setCalendarMonth(`${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, '0')}`);
  };

  const selectCalendarDate = (date: string) => {
    setFormData((prev) => ({ ...prev, date, startTime: '' }));
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
          service_requested: formData.service || null,
          date: formData.date,
          startTime: formData.startTime,
          locale,
          message: formData.service
            ? `[${formData.service}] ${formData.message}`
            : formData.message,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', service: '', message: '', date: '', startTime: '' });
      setCalendarMonth(currentMonth);
    } catch {
      setStatus('error');
    }
  };

  const inputCls = "w-full bg-white/75 border border-[#49685f]/15 rounded-xl px-4 py-3 text-[#17201e] placeholder-[#8a8177] text-[14px] outline-none focus:border-[#b8893c]/60 focus:ring-2 focus:ring-[#b8893c]/15 transition-all";

  return (
    <main className="min-h-screen py-20 lg:py-24">
      <div className="container mx-auto px-5 max-w-6xl">
        <div className="text-center mb-14">
          <p className="section-kicker mb-3">
            Prof. Dr. Gökçe Özel
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-[#17201e] mb-4">{t.title}</h1>
          <p className="text-[#61706b]">{t.subtitle}</p>
          {banner && (
            <div className="mx-auto mt-5 max-w-2xl rounded-2xl border border-[#d4b97a]/30 bg-[#d4b97a]/10 px-5 py-3 text-sm font-semibold text-[#6f5526]">
              {banner}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Contact Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="soft-card rounded-[1.35rem] p-6 space-y-5">
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
            <div className="soft-card rounded-[1.35rem] p-6">
              <h3 className="section-kicker mb-4">{t.social}</h3>
              <div className="space-y-3">
                <a
                  href="https://www.instagram.com/drgokceozel"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[#61706b] hover:text-[#17201e] transition-colors text-[14px] group"
                >
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex items-center justify-center text-white flex-shrink-0">
                    <InstagramIcon className="h-4 w-4" />
                  </span>
                  <span className="group-hover:text-[#d4b97a]">@drgokceozel</span>
                </a>
                <a
                  href="https://www.youtube.com/@drgokceozel"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[#61706b] hover:text-[#17201e] transition-colors text-[14px] group"
                >
                  <span className="w-8 h-8 rounded-lg bg-[#FF0000] flex items-center justify-center text-white flex-shrink-0">
                    <YoutubeIcon className="h-4 w-4" />
                  </span>
                  <span className="group-hover:text-[#d4b97a]">@drgokceozel</span>
                </a>
                <a
                  href="https://wa.me/905342096935"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[#61706b] hover:text-[#17201e] transition-colors text-[14px] group"
                >
                  <span className="w-8 h-8 rounded-lg bg-[#25D366] flex items-center justify-center text-white flex-shrink-0">
                    <WhatsAppIcon className="h-4 w-4" />
                  </span>
                  <span className="group-hover:text-[#d4b97a]">WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

          {/* Form */}
          <div className="md:col-span-3">
            <div className="soft-card rounded-[1.35rem] p-8">
              <h2 className="font-serif text-3xl text-[#17201e] mb-6">{t.form}</h2>

              {status === 'success' ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">✓</div>
                  <p className="text-[#d4b97a] text-lg font-semibold mb-2">{t.success}</p>
                  <p className="mx-auto max-w-md text-sm leading-6 text-[#61706b]">{t.confirmInfo}</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 text-[#61706b] text-sm underline hover:text-[#17201e]"
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
                    required onChange={handleChange} placeholder={t.emailPh} className={inputCls} />
                  <select name="service" value={formData.service}
                    onChange={handleChange}
                    className={`${inputCls} cursor-pointer`}
                  >
                    <option value="">{t.servicePh}</option>
                    {SERVICES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <div className="rounded-2xl border border-[#49685f]/15 bg-white/60 p-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <button type="button" onClick={() => shiftMonth(-1)} className="rounded-full border border-[#49685f]/15 px-3 py-1.5 text-sm text-[#17201e]">←</button>
                      <div className="text-sm font-bold text-[#17201e]">
                        {new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-US', { month: 'long', year: 'numeric' }).format(new Date(`${calendarMonth}-01T00:00:00`))}
                      </div>
                      <button type="button" onClick={() => shiftMonth(1)} className="rounded-full border border-[#49685f]/15 px-3 py-1.5 text-sm text-[#17201e]">→</button>
                    </div>
                    <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-bold uppercase tracking-wide text-[#8a8177]">
                      {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day) => <span key={day}>{day}</span>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1.5">
                      {calendarCells.map((day, index) => day ? (
                        <button
                          key={day.date}
                          type="button"
                          disabled={!day.available}
                          onClick={() => selectCalendarDate(day.date)}
                          className={`min-h-14 rounded-xl border p-1.5 text-left transition ${
                            formData.date === day.date
                              ? 'border-[#17201e] bg-[#17201e] text-white'
                              : day.available
                                ? 'border-[#d4b97a]/40 bg-[#d4b97a]/10 text-[#17201e] hover:border-[#b8893c]'
                                : 'border-[#49685f]/10 bg-white/40 text-[#b9afa3] opacity-70'
                          }`}
                        >
                          <span className="block text-sm font-bold">{Number(day.date.slice(-2))}</span>
                          <span className="block text-[10px]">{day.available ? `${day.availableCount} saat` : 'Kapalı'}</span>
                        </button>
                      ) : <span key={`empty-${index}`} />)}
                    </div>
                  </div>
                  {formData.date && (
                    <div className="rounded-2xl border border-[#49685f]/15 bg-white/60 p-4">
                      <p className="mb-3 text-sm font-semibold text-[#17201e]">{t.timePh}</p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {slots.filter((slot) => slot.available).map((slot) => (
                          <button
                            key={slot.startTime}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, startTime: slot.startTime }))}
                            className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                              formData.startTime === slot.startTime
                                ? 'border-[#17201e] bg-[#17201e] text-white'
                                : 'border-[#d4b97a]/40 bg-white text-[#17201e] hover:bg-[#d4b97a]/10'
                            }`}
                          >
                            {slot.startTime}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <input type="hidden" name="date" value={formData.date} />
                  <input type="hidden" name="startTime" value={formData.startTime} />
                  {formData.date && slotReason && (
                    <p className="text-[#8a8177] text-sm">{slotReason}</p>
                  )}
                  <textarea name="message" value={formData.message}
                    onChange={handleChange} placeholder={t.msgPh}
                    rows={4} className={`${inputCls} resize-none`} />

                  {status === 'error' && (
                    <p className="text-red-400 text-sm">{t.error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading' || !formData.date || !formData.startTime || !formData.email}
                    className="w-full bg-[#17201e] hover:bg-[#49685f] text-white font-bold text-[13px] tracking-widest uppercase py-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-lg shadow-[#17201e]/10"
                  >
                    {status === 'loading' ? t.sending : t.send}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="soft-card rounded-[1.35rem] overflow-hidden p-2">
            <div className="h-[360px] md:h-[460px] rounded-[1rem] overflow-hidden bg-[#17201e]/5">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3061.5!2d32.6897!3d39.8938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDUzJzM3LjciTiAzMsKwNDEnMjIuOSJF!5e0!3m2!1str!2str!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Klinik konumu"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2.15" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.13C19.55 3.58 12 3.58 12 3.58s-7.55 0-9.4.49A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.13c1.85.49 9.4.49 9.4.49s7.55 0 9.4-.49a3 3 0 0 0 2.1-2.13A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8ZM9.6 15.48V8.52L15.86 12 9.6 15.48Z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M20.5 3.5A11.86 11.86 0 0 0 12.04 0C5.45 0 .09 5.36.09 11.96c0 2.11.55 4.17 1.6 5.98L0 24l6.2-1.63a11.92 11.92 0 0 0 5.84 1.49h.01C18.64 23.86 24 18.5 24 11.9c0-3.19-1.24-6.18-3.5-8.4Zm-8.46 18.34h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.68.97.98-3.59-.23-.37a9.92 9.92 0 0 1-1.52-5.3c0-5.48 4.46-9.94 9.95-9.94a9.86 9.86 0 0 1 7.03 2.92 9.86 9.86 0 0 1 2.91 7.02c0 5.48-4.47 9.94-10.02 9.88Zm5.45-7.43c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.11 3.22 5.11 4.52.71.31 1.27.49 1.7.63.72.23 1.37.2 1.89.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
    </svg>
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
          <a href={href} className="text-[#17201e] text-[14px] hover:text-[#b88746] transition-colors">{value}</a>
        ) : (
          <p className="text-[#17201e] text-[14px]">{value}</p>
        )}
      </div>
    </div>
  );
}
