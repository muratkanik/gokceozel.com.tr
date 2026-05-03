import type { Metadata } from 'next';

interface Props { params: Promise<{ locale: string }> }

const META: Record<string, { title: string; description: string }> = {
  tr: { title: 'KVKK & Gizlilik Politikası | Prof. Dr. Gökçe Özel', description: 'Kişisel verilerinizin işlenmesine ilişkin aydınlatma metni ve gizlilik politikası.' },
  en: { title: 'Privacy Policy | Prof. Dr. Gökçe Özel', description: 'How we collect, use and protect your personal data.' },
  ar: { title: 'سياسة الخصوصية | Prof. Dr. Gökçe Özel', description: 'كيف نجمع بياناتك الشخصية ونستخدمها ونحميها.' },
  ru: { title: 'Политика конфиденциальности | Prof. Dr. Gökçe Özel', description: 'Как мы собираем, используем и защищаем ваши персональные данные.' },
  fr: { title: 'Politique de confidentialité | Prof. Dr. Gökçe Özel', description: 'Comment nous collectons, utilisons et protégeons vos données personnelles.' },
  de: { title: 'Datenschutzerklärung | Prof. Dr. Gökçe Özel', description: 'Wie wir Ihre personenbezogenen Daten erheben, verwenden und schützen.' },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale] || META.tr;
  return { title: m.title, description: m.description, robots: { index: false } };
}

const CONTENT: Record<string, { heading: string; sections: { title: string; body: string }[] }> = {
  tr: {
    heading: 'KVKK Aydınlatma Metni ve Gizlilik Politikası',
    sections: [
      {
        title: '1. Veri Sorumlusu',
        body: 'Prof. Dr. Gökçe Özel Muayenehanesi ("Klinik"), 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu sıfatıyla hareket etmektedir. Bu metin, KVKK'nın 10. maddesi uyarınca sizi bilgilendirmek amacıyla hazırlanmıştır.',
      },
      {
        title: '2. İşlenen Kişisel Veriler ve Amaçları',
        body: 'Adınız, soyadınız, iletişim bilgileriniz (telefon, e-posta) ve randevu sırasında paylaştığınız sağlık bilgileri; randevu oluşturma ve yönetme, tıbbi kayıt tutma, yasal yükümlülüklerin yerine getirilmesi, kalite geliştirme ve istatistiksel analiz amacıyla işlenmektedir. Sağlık verileri özel nitelikli kişisel veri kapsamında değerlendirilmekte ve açık rızanız alınarak işlenmektedir.',
      },
      {
        title: '3. Kişisel Verilerin Aktarılması',
        body: 'Kişisel verileriniz; yasal zorunluluk olmadıkça ya da açık rızanız bulunmadıkça üçüncü taraflarla paylaşılmamaktadır. Yalnızca ilgili kamu kurumları (Sağlık Bakanlığı, mahkemeler vb.) ile klinik yazılım ve bulut hizmet sağlayıcıları gibi teknik altyapı sağlayıcılarına KVKK'nın 8. ve 9. maddeleri çerçevesinde aktarım yapılabilmektedir.',
      },
      {
        title: '4. Kişisel Veri Toplama Yöntemi ve Hukuki Sebebi',
        body: 'Verileriniz web sitesi iletişim formları, WhatsApp, telefon görüşmeleri ve yüz yüze muayene sırasında toplanmaktadır. Hukuki dayanak; sözleşmenin ifası (randevu), kanuni yükümlülük (Sağlık Bakanlığı mevzuatı) ve açık rızanızdır.',
      },
      {
        title: '5. Saklama Süresi',
        body: 'Tıbbi kayıtlar, ilgili mevzuat uyarınca muayene tarihinden itibaren en az 10 yıl saklanmaktadır. İletişim bilgileri ise yasal zorunluluk ortadan kalktığında veya rızanızı geri aldığınızda silinmektedir.',
      },
      {
        title: '6. Çerezler (Cookies)',
        body: 'Web sitemiz, ziyaretçi deneyimini iyileştirmek amacıyla teknik çerezler kullanmaktadır. Analitik ve pazarlama çerezleri yalnızca açık onayınız alındıktan sonra etkinleştirilmektedir. Tarayıcı ayarlarınızdan çerezleri dilediğiniz zaman devre dışı bırakabilirsiniz.',
      },
      {
        title: '7. Haklarınız',
        body: 'KVKK'nın 11. maddesi uyarınca şu haklara sahipsiniz: (a) Kişisel verilerinizin işlenip işlenmediğini öğrenme, (b) işlenmişse buna ilişkin bilgi talep etme, (c) işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, (d) yurt içinde/dışında aktarıldığı üçüncü kişileri bilme, (e) eksik veya yanlış işlenme hâlinde düzeltilmesini isteme, (f) KVKK'nın 7. maddesindeki koşullar çerçevesinde silinmesini ya da yok edilmesini isteme, (g) otomatik sistemler vasıtasıyla oluşan aleyhte sonuca itiraz etme, (h) kanuna aykırı işleme nedeniyle uğradığınız zararın giderilmesini talep etme.',
      },
      {
        title: '8. Başvuru Yöntemi',
        body: 'Haklarınıza ilişkin taleplerinizi kimliğinizi doğrulayan bir belgeyle birlikte info@gokceozel.com.tr adresine e-posta göndererek veya kliniğimize yazılı olarak iletebilirsiniz. Talepler 30 gün içinde yanıtlanacaktır.',
      },
      {
        title: '9. Veri Güvenliği',
        body: 'Klinik, kişisel verilerinizi yetkisiz erişime, kayba veya ifşaya karşı korumak amacıyla endüstri standardı teknik ve idari güvenlik önlemlerini uygulamaktadır (SSL şifreleme, erişim kısıtlaması, güvenli veri depolama).',
      },
      {
        title: '10. Değişiklikler',
        body: 'Bu politika gerektiğinde güncellenebilir. Önemli değişiklikler web sitesinde duyurulacaktır. Son güncelleme: Mayıs 2025.',
      },
    ],
  },
  en: {
    heading: 'Privacy Policy & GDPR Notice',
    sections: [
      {
        title: '1. Data Controller',
        body: 'Prof. Dr. Gökçe Özel Clinic ("Clinic") acts as data controller under applicable data protection legislation, including Turkey's Personal Data Protection Law No. 6698 (KVKK) and the EU General Data Protection Regulation (GDPR) for EU/EEA residents.',
      },
      {
        title: '2. Data We Collect and Why',
        body: 'We collect your name, contact details (phone, email) and health information you share during consultations. These are used to: manage appointments and medical records, fulfil legal obligations, improve service quality, and conduct statistical analysis. Health data is treated as special-category data and processed only with your explicit consent.',
      },
      {
        title: '3. Legal Basis for Processing',
        body: 'We process your data on the following legal grounds: (a) Contractual necessity – to fulfil your appointment; (b) Legal obligation – compliance with Turkish health regulations; (c) Explicit consent – for sensitive health data and marketing communications.',
      },
      {
        title: '4. Data Sharing',
        body: 'We do not sell or rent your personal data. We may share information with: competent authorities when required by law; software and cloud infrastructure providers under strict data-processing agreements; and medical specialists involved in your care, with your knowledge.',
      },
      {
        title: '5. Retention',
        body: 'Medical records are retained for a minimum of 10 years from the date of consultation as required by Turkish health legislation. Contact data is deleted once the legal basis no longer applies or upon your withdrawal of consent.',
      },
      {
        title: '6. Cookies',
        body: 'Our website uses essential technical cookies for functionality. Analytics and marketing cookies are activated only with your explicit consent. You can disable cookies at any time via your browser settings.',
      },
      {
        title: '7. Your Rights',
        body: 'You have the right to: access your personal data; rectify inaccurate data; request erasure (right to be forgotten) where legally permitted; object to processing; request restriction of processing; data portability (GDPR); and lodge a complaint with the relevant supervisory authority (Turkey: KVKK Authority; EU: your local DPA).',
      },
      {
        title: '8. Contact',
        body: 'To exercise your rights or raise a data-related concern, please contact us at info@gokceozel.com.tr. We will respond within 30 days.',
      },
      {
        title: '9. Security',
        body: 'We implement industry-standard security measures including SSL encryption, access controls, and secure data storage to protect your personal information against unauthorised access, loss or disclosure.',
      },
      {
        title: '10. Updates',
        body: 'This policy may be updated periodically. Material changes will be announced on the website. Last updated: May 2025.',
      },
    ],
  },
  ar: {
    heading: 'سياسة الخصوصية وإشعار حماية البيانات',
    sections: [
      {
        title: '١. المتحكم في البيانات',
        body: 'تعمل عيادة "Prof. Dr. Gökçe Özel" بوصفها المتحكم في البيانات وفق قانون حماية البيانات الشخصية التركي رقم 6698 (KVKK) ولوائح اللائحة العامة لحماية البيانات الأوروبية (GDPR) للمقيمين في دول الاتحاد الأوروبي.',
      },
      {
        title: '٢. البيانات التي نجمعها ولماذا',
        body: 'نجمع اسمك ومعلومات الاتصال (الهاتف والبريد الإلكتروني) والمعلومات الصحية التي تشاركها خلال الاستشارات. تُستخدم هذه البيانات لإدارة المواعيد والسجلات الطبية، والوفاء بالالتزامات القانونية، وتحسين جودة الخدمة. تُعامَل البيانات الصحية كبيانات ذات طابع خاص ولا تُعالَج إلا بموافقتك الصريحة.',
      },
      {
        title: '٣. مشاركة البيانات',
        body: 'لا نبيع بياناتك الشخصية ولا نؤجرها. يجوز مشاركة المعلومات مع الجهات الحكومية المختصة عند الضرورة القانونية، ومزودي البنية التحتية التقنية وفق اتفاقيات معالجة بيانات صارمة.',
      },
      {
        title: '٤. مدة الاحتفاظ',
        body: 'تُحتفظ بالسجلات الطبية لمدة لا تقل عن 10 سنوات من تاريخ الاستشارة وفقًا للتشريعات الصحية التركية. تُحذف بيانات الاتصال عند انتفاء الأساس القانوني أو بسحبك للموافقة.',
      },
      {
        title: '٥. حقوقك',
        body: 'يحق لك الاطلاع على بياناتك الشخصية، وتصحيح البيانات غير الدقيقة، وطلب المحو حيث يُسمح قانونًا، والاعتراض على المعالجة، وتقديم شكوى إلى جهة الرقابة المختصة.',
      },
      {
        title: '٦. التواصل',
        body: 'لممارسة حقوقك، يُرجى التواصل معنا على البريد الإلكتروني info@gokceozel.com.tr. سنرد خلال 30 يومًا.',
      },
    ],
  },
  ru: {
    heading: 'Политика конфиденциальности',
    sections: [
      {
        title: '1. Оператор персональных данных',
        body: 'Клиника "Prof. Dr. Gökçe Özel" является оператором персональных данных в соответствии с турецким Законом о защите персональных данных № 6698 (KVKK) и Общим регламентом ЕС о защите данных (GDPR) для жителей ЕС/ЕЭЗ.',
      },
      {
        title: '2. Какие данные мы собираем и зачем',
        body: 'Мы собираем ваше имя, контактные данные (телефон, e-mail) и медицинскую информацию, предоставленную во время консультаций. Данные используются для управления записью, ведения медицинских карт, выполнения законодательных требований и улучшения качества услуг. Медицинские данные обрабатываются только с вашего явного согласия.',
      },
      {
        title: '3. Передача данных',
        body: 'Мы не продаём и не передаём ваши данные третьим лицам, кроме случаев, установленных законом, или поставщиков технической инфраструктуры, действующих на основании договоров об обработке данных.',
      },
      {
        title: '4. Сроки хранения',
        body: 'Медицинские записи хранятся не менее 10 лет с даты консультации согласно турецкому законодательству в области здравоохранения.',
      },
      {
        title: '5. Ваши права',
        body: 'Вы вправе: получить доступ к своим данным; потребовать их исправления или удаления; отозвать согласие; подать жалобу в надзорный орган.',
      },
      {
        title: '6. Контакты',
        body: 'По вопросам защиты данных обращайтесь: info@gokceozel.com.tr. Ответ — в течение 30 дней.',
      },
    ],
  },
  fr: {
    heading: 'Politique de Confidentialité',
    sections: [
      {
        title: '1. Responsable du traitement',
        body: 'Le cabinet "Prof. Dr. Gökçe Özel" est responsable du traitement de vos données conformément à la loi turque n° 6698 (KVKK) et au Règlement général sur la protection des données (RGPD) pour les résidents de l'UE/EEE.',
      },
      {
        title: '2. Données collectées et finalités',
        body: 'Nous collectons vos nom, coordonnées (téléphone, e-mail) et informations de santé communiquées lors des consultations. Ces données servent à gérer les rendez-vous, tenir les dossiers médicaux et respecter nos obligations légales. Les données de santé, de catégorie spéciale, ne sont traitées qu'avec votre consentement explicite.',
      },
      {
        title: '3. Partage des données',
        body: 'Vos données ne sont pas vendues ni louées. Elles peuvent être communiquées aux autorités compétentes sur obligation légale ou à nos prestataires techniques sous contrats stricts.',
      },
      {
        title: '4. Durée de conservation',
        body: 'Les dossiers médicaux sont conservés au moins 10 ans à compter de la consultation, conformément à la législation sanitaire turque.',
      },
      {
        title: '5. Vos droits',
        body: 'Vous disposez des droits d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité de vos données, ainsi que du droit de déposer une réclamation auprès de la CNIL ou de l'autorité compétente.',
      },
      {
        title: '6. Contact',
        body: 'Pour exercer vos droits : info@gokceozel.com.tr. Délai de réponse : 30 jours.',
      },
    ],
  },
  de: {
    heading: 'Datenschutzerklärung',
    sections: [
      {
        title: '1. Verantwortliche Stelle',
        body: 'Die Klinik "Prof. Dr. Gökçe Özel" ist Verantwortliche im Sinne des türkischen Datenschutzgesetzes Nr. 6698 (KVKK) sowie der EU-Datenschutz-Grundverordnung (DSGVO) für Besucher aus dem EWR.',
      },
      {
        title: '2. Erhobene Daten und Zwecke',
        body: 'Wir verarbeiten Ihren Namen, Kontaktdaten (Telefon, E-Mail) und Gesundheitsdaten aus Beratungsgesprächen. Die Verarbeitung dient der Terminverwaltung, Patientenaktenführung und Erfüllung gesetzlicher Pflichten. Gesundheitsdaten als besondere Kategorie werden nur mit Ihrer ausdrücklichen Einwilligung verarbeitet.',
      },
      {
        title: '3. Datenweitergabe',
        body: 'Ihre Daten werden nicht verkauft oder vermietet. Eine Weitergabe erfolgt nur bei gesetzlicher Verpflichtung oder an technische Dienstleister unter strengen Auftragsverarbeitungsverträgen.',
      },
      {
        title: '4. Speicherdauer',
        body: 'Patientenakten werden gemäß türkischem Gesundheitsrecht mindestens 10 Jahre ab dem Behandlungsdatum aufbewahrt.',
      },
      {
        title: '5. Ihre Rechte',
        body: 'Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung und Widerspruch sowie Datenübertragbarkeit. Beschwerden können Sie bei der zuständigen Datenschutzbehörde einreichen.',
      },
      {
        title: '6. Kontakt',
        body: 'Anfragen richten Sie bitte an: info@gokceozel.com.tr. Antwortfrist: 30 Tage.',
      },
    ],
  },
};

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  const content = CONTENT[locale] || CONTENT.tr;

  return (
    <main className="min-h-screen bg-[#fbf7ef] pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-5 lg:px-6">
        <h1 className="font-serif text-[clamp(28px,4vw,48px)] leading-tight mb-10 text-[#17201e]">
          {content.heading}
        </h1>
        <div className="space-y-8">
          {content.sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-semibold text-[#17201e] text-[17px] mb-2">{section.title}</h2>
              <p className="text-[#4a5550] text-[15px] leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>
        <p className="mt-12 text-[13px] text-[#9a8f7c]">gokceozel.com.tr</p>
      </div>
    </main>
  );
}
