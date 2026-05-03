import type { Metadata } from 'next';

interface Props { params: Promise<{ locale: string }> }

const META: Record<string, { title: string; description: string }> = {
  tr: { title: 'Kullanım Koşulları & Tıbbi Feragatname | Prof. Dr. Gökçe Özel', description: 'Web sitesi kullanım koşulları ve tıbbi bilgi feragatnamesi.' },
  en: { title: 'Terms of Use & Medical Disclaimer | Prof. Dr. Gökçe Özel', description: 'Website terms of use and medical information disclaimer.' },
  ar: { title: 'شروط الاستخدام وإخلاء المسؤولية الطبية | Prof. Dr. Gökçe Özel', description: 'شروط استخدام الموقع وإخلاء المسؤولية الطبية.' },
  ru: { title: 'Условия использования | Prof. Dr. Gökçe Özel', description: 'Условия использования сайта и медицинский отказ от ответственности.' },
  fr: { title: 'Conditions d\'utilisation | Prof. Dr. Gökçe Özel', description: 'Conditions d\'utilisation du site et avertissement médical.' },
  de: { title: 'Nutzungsbedingungen | Prof. Dr. Gökçe Özel', description: 'Nutzungsbedingungen der Website und medizinischer Haftungsausschluss.' },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale] || META.tr;
  return { title: m.title, description: m.description, robots: { index: false } };
}

const CONTENT: Record<string, { heading: string; sections: { title: string; body: string }[] }> = {
  tr: {
    heading: 'Kullanım Koşulları ve Tıbbi Feragatname',
    sections: [
      {
        title: '1. Genel Bilgilendirme',
        body: 'Bu web sitesi yalnızca genel bilgilendirme amacıyla hazırlanmıştır. Sitede yer alan içerikler tıbbi tavsiye, tanı veya tedavi yerine geçmez. Her bireyin sağlık durumu farklıdır; bu nedenle herhangi bir sağlık sorununuz için mutlaka nitelikli bir hekime başvurunuz.',
      },
      {
        title: '2. Tıbbi Feragatname',
        body: 'Sitede yer alan bilgiler, Prof. Dr. Gökçe Özel ve ekibinin sunduğu tıbbi hizmetler hakkında genel bir fikir vermek amacıyla derlenmiştir. Bu bilgiler: (a) size özel bir tıbbi görüş değildir; (b) mevcut tedavinizi veya hekiminizin önerilerini değiştirmeniz için bir neden oluşturmamaktadır; (c) acil durumlarda 112 Acil Yardım hattını aramanızın alternatifi değildir. Sitedeki görsel içerikler (öncesi–sonrası fotoğrafları dahil) yalnızca genel bilgi amacı taşımakta olup bireysel sonuçların garanti edilmesi amacıyla kullanılmamaktadır.',
      },
      {
        title: '3. Telif Hakkı ve Fikri Mülkiyet',
        body: 'Bu web sitesindeki tüm içerikler (metin, görsel, logo, tasarım) Prof. Dr. Gökçe Özel'e aittir veya lisanslıdır. İzin alınmadan kopyalanamaz, çoğaltılamaz veya yeniden yayımlanamaz. Atıf yapılması hâlinde kısa alıntı yapılabilir.',
      },
      {
        title: '4. Bağlantılar (Linkler)',
        body: 'Site üçüncü taraf web sitelerine bağlantılar içerebilir. Bu siteler üzerinde kontrolümüz bulunmamakta olup içeriklerinden sorumlu değiliz. Bağlantılar yalnızca kolaylık sağlamak amacıyla paylaşılmıştır.',
      },
      {
        title: '5. Sorumluluk Sınırı',
        body: 'Klinik, sitedeki bilgilerin güncelliği veya doğruluğu konusunda azami özen göstermekle birlikte herhangi bir bilginin kullanımından doğabilecek zararlar için sorumluluk kabul etmemektedir. Site, önceden haber vermeksizin değiştirilebilir veya kaldırılabilir.',
      },
      {
        title: '6. Uygulanacak Hukuk',
        body: 'Bu kullanım koşulları Türk Hukuku'na tabi olup anlaşmazlıklarda Ankara Mahkemeleri yetkilidir.',
      },
      {
        title: '7. Sağlık Bakanlığı Düzenlemeleri',
        body: 'Türkiye Cumhuriyeti Sağlık Bakanlığı Yönetmelikleri uyarınca; bu site reklam ya da tanıtım amacı taşımamakta, herhangi bir ameliyat veya girişimsel işlem için doğrudan çağrıda bulunmamakta ve olası sonuçları garanti etmemektedir. Paylaşılan tüm içerikler mesleki etik kurallara uygun olarak hazırlanmıştır.',
      },
      {
        title: '8. İletişim',
        body: 'Kullanım koşullarına ilişkin sorularınız için: info@gokceozel.com.tr',
      },
    ],
  },
  en: {
    heading: 'Terms of Use & Medical Disclaimer',
    sections: [
      {
        title: '1. General Information',
        body: 'This website is provided for general informational purposes only. Content on this site does not constitute medical advice, diagnosis or treatment. Individual health situations vary; please consult a qualified healthcare professional for any health concern.',
      },
      {
        title: '2. Medical Disclaimer',
        body: 'The information on this site provides a general overview of the medical services offered by Prof. Dr. Gökçe Özel. It is not personalised medical advice; it is not a reason to change your current treatment or your doctor's recommendations; and it is not an alternative to calling emergency services in a medical emergency. Visual content, including before-and-after photographs, is for general informational purposes only and does not guarantee individual results.',
      },
      {
        title: '3. Copyright & Intellectual Property',
        body: 'All content on this website (text, images, logos, design elements) is owned by or licensed to Prof. Dr. Gökçe Özel. Unauthorised copying, reproduction or republishing is prohibited. Brief quotations with attribution are permitted.',
      },
      {
        title: '4. Third-Party Links',
        body: 'This site may contain links to third-party websites. We have no control over those sites and accept no responsibility for their content. Links are provided for convenience only.',
      },
      {
        title: '5. Limitation of Liability',
        body: 'While every effort is made to keep information accurate and up to date, the Clinic accepts no liability for any loss or damage arising from use of the information on this site. The site may be changed or removed without notice.',
      },
      {
        title: '6. Governing Law',
        body: 'These terms are governed by Turkish Law. Any disputes shall be subject to the jurisdiction of Ankara Courts.',
      },
      {
        title: '7. Turkish Ministry of Health Regulations',
        body: 'In accordance with Turkish Ministry of Health regulations, this site does not constitute advertising or promotion of medical services, does not make direct calls to action for surgical or invasive procedures, and does not guarantee outcomes. All content has been prepared in compliance with professional medical ethics.',
      },
      {
        title: '8. Contact',
        body: 'Questions about these terms: info@gokceozel.com.tr',
      },
    ],
  },
  ar: {
    heading: 'شروط الاستخدام وإخلاء المسؤولية الطبية',
    sections: [
      {
        title: '١. معلومات عامة',
        body: 'يُقدَّم هذا الموقع لأغراض إعلامية عامة فقط. لا تُشكّل محتوياته نصيحة طبية أو تشخيصًا أو علاجًا. يتباين كل حالة صحية؛ لذا يُرجى استشارة طبيب مؤهل لأي قلق صحي.',
      },
      {
        title: '٢. إخلاء المسؤولية الطبية',
        body: 'لا تُعدّ المعلومات الواردة هنا رأيًا طبيًا شخصيًا، ولا تُشكّل سببًا لتغيير علاجك الحالي. الصور التي تُعرض لأغراض توضيحية فقط ولا تضمن نتائج فردية.',
      },
      {
        title: '٣. حقوق الملكية الفكرية',
        body: 'جميع محتويات الموقع مملوكة لـ Prof. Dr. Gökçe Özel أو مرخصة لها. يُحظر النسخ أو النشر دون إذن.',
      },
      {
        title: '٤. القانون المطبّق',
        body: 'تخضع هذه الشروط للقانون التركي. تختص محاكم أنقرة بالنظر في أي نزاعات.',
      },
    ],
  },
  ru: {
    heading: 'Условия использования и медицинский отказ от ответственности',
    sections: [
      {
        title: '1. Общая информация',
        body: 'Сайт предоставляется исключительно в ознакомительных целях. Размещённые материалы не являются медицинской консультацией, диагностикой или назначением лечения. При наличии жалоб обратитесь к квалифицированному врачу.',
      },
      {
        title: '2. Медицинский отказ от ответственности',
        body: 'Информация на сайте не является персональной медицинской рекомендацией и не должна заменять назначения вашего лечащего врача. Визуальный контент носит исключительно информационный характер и не гарантирует индивидуальных результатов.',
      },
      {
        title: '3. Интеллектуальная собственность',
        body: 'Все материалы сайта (текст, изображения, дизайн) принадлежат Prof. Dr. Gökçe Özel или лицензированы ею. Несанкционированное копирование запрещено.',
      },
      {
        title: '4. Применимое право',
        body: 'Настоящие условия регулируются законодательством Турецкой Республики. Споры рассматриваются судами г. Анкара.',
      },
    ],
  },
  fr: {
    heading: 'Conditions d\'utilisation et avertissement médical',
    sections: [
      {
        title: '1. Informations générales',
        body: 'Ce site est fourni à titre informatif uniquement. Son contenu ne constitue pas un avis médical, un diagnostic ou un traitement. Chaque situation de santé étant unique, consultez un professionnel de santé qualifié pour tout problème médical.',
      },
      {
        title: '2. Avertissement médical',
        body: 'Les informations présentes sur ce site n\'ont pas valeur de conseil médical personnalisé et ne doivent pas inciter à modifier un traitement en cours. Les visuels (photos avant/après) sont fournis à titre illustratif et ne garantissent pas de résultats individuels.',
      },
      {
        title: '3. Propriété intellectuelle',
        body: 'Tous les contenus du site (textes, images, logo, design) sont la propriété de Prof. Dr. Gökçe Özel ou lui sont concédés sous licence. Toute reproduction sans autorisation est interdite.',
      },
      {
        title: '4. Droit applicable',
        body: 'Les présentes conditions sont régies par le droit turc. Tout litige relève de la compétence des tribunaux d\'Ankara.',
      },
    ],
  },
  de: {
    heading: 'Nutzungsbedingungen und medizinischer Haftungsausschluss',
    sections: [
      {
        title: '1. Allgemeine Informationen',
        body: 'Diese Website dient ausschließlich allgemeinen Informationszwecken. Die Inhalte ersetzen keine ärztliche Beratung, Diagnose oder Behandlung. Gesundheitliche Situationen sind individuell verschieden – konsultieren Sie bei Beschwerden einen qualifizierten Arzt.',
      },
      {
        title: '2. Medizinischer Haftungsausschluss',
        body: 'Die Informationen auf dieser Website stellen keine persönliche medizinische Empfehlung dar und sind kein Grund, eine laufende Behandlung zu ändern. Bildmaterial (Vorher-Nachher-Fotos) dient illustrativen Zwecken und garantiert keine individuellen Ergebnisse.',
      },
      {
        title: '3. Urheberrecht',
        body: 'Alle Website-Inhalte (Texte, Bilder, Logo, Design) sind Eigentum von Prof. Dr. Gökçe Özel oder ihr lizenziert. Unerlaubtes Kopieren ist untersagt.',
      },
      {
        title: '4. Anwendbares Recht',
        body: 'Diese Bedingungen unterliegen türkischem Recht. Streitigkeiten fallen in die Zuständigkeit der Gerichte in Ankara.',
      },
    ],
  },
};

export default async function TermsPage({ params }: Props) {
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
