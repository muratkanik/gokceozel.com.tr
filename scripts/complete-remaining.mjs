/**
 * complete-remaining.mjs
 * Final cleanup:
 * 1. Add AR/RU/FR/DE translations for gokce-ozel-kimdir, gd-liposuction, yz-boyun-estetii
 * 2. Add SEO meta for gd-liposuction and yz-boyun-estetii (all 6 locales)
 * 3. Add noindex SEO meta to 15 mojibake duplicate pages with canonicalUrl
 */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const BASE_URL = 'https://gokceozel.com.tr';

// ─── MOJIBAKE → CANONICAL MAPPING ───────────────────────────
const MOJIBAKE_MAP = {
  'ka-kaldrma': 'kas-kaldirma',
  'dudak-estetii-liplift': 'dudak-estetigi-liplift',
  'badem-gz-estetii': 'badem-goz-estetigi',
  'ple-ka-kaldrma': 'i-ple-kas-kaldirma',
  'ozon-uygulamas': 'ozon-uygulamasi',
  'damar-iine-glutatyon-uygulamas': 'damar-icine-glutatyon-uygulamasi',
  'ene-estetii-mentoplasti': 'cene-estetigi-mentoplasti',
  'gz-alt-ik-dolgusu': 'goz-alti-isik-dolgusu',
  'biektomi': 'bisektomi',
  'sinzit-ameliyat': 'sinuzit-ameliyati',
  'ameliyatsz-ka-kaldrma': 'ameliyatsiz-kas-kaldirma',
  'kepe-kulak-estetii-otoplasti': 'kepce-kulak-estetigi-otoplasti',
  'dolgu-ile-ka-kaldrma': 'dolgu-ile-kas-kaldirma',
  'gamze-estetii': 'gamze-estetigi',
  'yz-germe-facelift': 'yuz-germe-facelift',
};

// ─── LEGIT PAGES NEEDING SEO + TRANSLATIONS ─────────────────

const LEGIT_PAGES = {
  'gd-liposuction': {
    seo: {
      tr: { title: 'Gıdı Liposuction Ankara & Antalya | Çene Altı Yağ Alımı', desc: 'Gıdı bölgesindeki yağ dokusunun liposuction ile alınması. Çene altı inceltme ve profil düzeltme. Prof. Dr. Gökçe Özel, Ankara & Antalya.' },
      en: { title: 'Jowl Liposuction Ankara & Antalya | Neck Fat Removal', desc: 'Removal of submental (jowl) fat tissue with liposuction. Chin and neck contouring for a refined profile. Prof. Dr. Gökçe Özel, Ankara & Antalya.' },
      ar: { title: 'شفط دهون الذقن أنقرة وأنطاليا | إزالة دهون الرقبة', desc: 'إزالة الأنسجة الدهنية في منطقة الذقن والرقبة بالشفط. تحسين محيط الذقن والرقبة. البروفيسورة د. غوكتشه أوزيل.' },
      ru: { title: 'Липосакция подбородка Анкара & Анталья | Удаление жира шеи', desc: 'Удаление жировой ткани второго подбородка с помощью липосакции. Контурирование подбородка и шеи. Проф. д-р Гёкче Озель.' },
      fr: { title: 'Liposuccion du menton Ankara & Antalya | Graisse sous-mentale', desc: 'Retrait de la graisse sous-mentonnière par liposuccion. Contourage du menton et du cou. Prof. Dr. Gökçe Özel, Ankara & Antalya.' },
      de: { title: 'Kinn-Liposuktion Ankara & Antalya | Hals-Fettentfernung', desc: 'Entfernung von Unterkinnfett durch Liposuktion. Kinn- und Halskonturierung für ein verfeinertes Profil. Prof. Dr. Gökçe Özel.' },
    },
    translations: {
      ar: { title: 'شفط دهون الذقن', content: '<p>منطقة الذقن هي الأنسجة الدهنية في الجزء العلوي من الرقبة تحت الذقن. تصبح هذه الأنسجة بارزة جداً مع تقدم العمر أو زيادة الوزن. يعالج شفط الدهون منطقة الذقن هذه بشكل فعّال ومستدام.</p><p>تُجرى العملية تحت التخدير الموضعي أو العام وتستغرق نحو 30-60 دقيقة. يتم شد الجلد الإضافي وتشكيل الذقن في نفس الجلسة. تدوم النتائج على المدى البعيد مع الحفاظ على الوزن.</p>' },
      ru: { title: 'Липосакция зоны второго подбородка', content: '<p>Зона двойного подбородка — это жировая ткань в верхней части шеи под подбородком. Она становится очень заметной с возрастом или при наборе веса. Липосакция эффективно и долговременно устраняет этот жир.</p><p>Процедура выполняется под местной или общей анестезией и длится около 30-60 минут. Одновременно проводится подтяжка лишней кожи и контурирование подбородка. При сохранении веса результаты долгосрочные.</p>' },
      fr: { title: 'Liposuccion du double menton', content: '<p>La zone du double menton est le tissu adipeux situé dans la partie supérieure du cou sous le menton. Ce tissu devient très apparent avec l\'âge ou la prise de poids. La liposuccion traite efficacement et durablement ce problème.</p><p>La procédure est réalisée sous anesthésie locale ou générale en 30-60 minutes. L\'excès de peau est également remodelé lors de la même séance. Les résultats sont durables avec un poids stable.</p>' },
      de: { title: 'Doppelkinn-Liposuktion', content: '<p>Die Doppelkinnzone ist das Fettgewebe im oberen Halsbereich unter dem Kinn. Dieses Gewebe wird mit zunehmendem Alter oder Gewichtszunahme sehr auffällig. Die Liposuktion behandelt dieses Problem effektiv und dauerhaft.</p><p>Der Eingriff erfolgt unter Lokal- oder Vollnarkose in etwa 30-60 Minuten. Überschüssige Haut wird in derselben Sitzung gestrafft und das Kinn geformt. Bei stabilem Gewicht sind die Ergebnisse langfristig.</p>' },
    },
  },
  'yz-boyun-estetii': {
    seo: {
      tr: { title: 'Yüz Boyun Estetiği Ankara & Antalya | Tam Yüz Gençleştirme', desc: 'Yüz ve boyun bölgesini kapsayan cerrahi ve ameliyatsız estetik tedaviler. Derin yüz gençleştirme. Prof. Dr. Gökçe Özel, Ankara & Antalya.' },
      en: { title: 'Face Neck Aesthetics Ankara & Antalya | Full Facial Rejuvenation', desc: 'Surgical and non-surgical aesthetic treatments covering the face and neck area. Deep facial rejuvenation. Prof. Dr. Gökçe Özel, Ankara & Antalya.' },
      ar: { title: 'تجميل الوجه والرقبة أنقرة وأنطاليا | تجديد شباب الوجه', desc: 'علاجات جمالية جراحية وغير جراحية تشمل منطقة الوجه والرقبة. تجديد شامل لشباب الوجه. البروفيسورة د. غوكتشه أوزيل، أنقرة وأنطاليا.' },
      ru: { title: 'Эстетика лица и шеи Анкара & Анталья | Омоложение', desc: 'Хирургические и нехирургические эстетические процедуры для лица и шеи. Глубокое омоложение лица. Проф. д-р Гёкче Озель, Анкара и Анталья.' },
      fr: { title: 'Esthétique visage-cou Ankara & Antalya | Rajeunissement complet', desc: 'Traitements esthétiques chirurgicaux et non chirurgicaux couvrant le visage et le cou. Rajeunissement facial profond. Prof. Dr. Gökçe Özel.' },
      de: { title: 'Gesicht-Hals-Ästhetik Ankara & Antalya | Vollständige Verjüngung', desc: 'Chirurgische und nicht-chirurgische ästhetische Behandlungen für Gesicht und Hals. Tiefe Gesichtsverjüngung. Prof. Dr. Gökçe Özel, Ankara & Antalya.' },
    },
    translations: {
      ar: { title: 'تجميل الوجه والرقبة', content: '<p>مع التقدم في السن، يحدث انخفاض في البروتينات الحاملة التي تشكّل بنية الجلد المغطي للوجه، مما يؤدي إلى ترهّل الجلد وظهور التجاعيد وفقدان التناسق. تشمل عمليات تجميل الوجه والرقبة طيفاً واسعاً من الخيارات، بدءاً من عمليات شد الوجه الجراحي وحتى التدخلات غير الجراحية بالخيوط والليزر.</p><p>في عيادة البروفيسورة د. غوكتشه أوزيل في أنقرة وأنطاليا لارا، يتم اختيار التدخل الأنسب وفق احتياجات المريض وتشريح وجهه. تشمل الخيارات المتاحة: شد الوجه الكامل (فيسليفت)، شد العنق، شفط دهون الذقن، رفع الوجه بالخيوط والعلاجات بالليزر.</p>' },
      ru: { title: 'Эстетика лица и шеи', content: '<p>С возрастом происходит снижение несущих белков, формирующих структуру кожи лица, что приводит к её провисанию, появлению морщин и потере симметрии. Эстетика лица и шеи охватывает широкий спектр вариантов — от хирургической подтяжки до нехирургических нитевых и лазерных вмешательств.</p><p>В клинике проф. д-р Гёкче Озель в Анкаре и Анталье Лара подбирается наиболее подходящее вмешательство с учётом потребностей и анатомии пациента. Варианты включают: полный фейслифт, подтяжку шеи, липосакцию второго подбородка, нитевой лифтинг и лазерные процедуры.</p>' },
      fr: { title: 'Esthétique visage et cou', content: '<p>Avec le vieillissement, on observe une diminution des protéines porteuses formant la structure de la peau du visage, entraînant un relâchement cutané, l\'apparition de rides et une perte de symétrie. L\'esthétique visage-cou couvre un large spectre d\'options, du lifting chirurgical aux interventions non chirurgicales par fils et laser.</p><p>À la clinique de la Prof. Dr. Gökçe Özel à Ankara et Antalya Lara, l\'intervention la plus adaptée est choisie selon les besoins et l\'anatomie du patient. Les options incluent : lifting complet, cervicoplastie, liposuccion du double menton, lifting par fils et traitements laser.</p>' },
      de: { title: 'Gesicht-Hals-Ästhetik', content: '<p>Mit zunehmendem Alter nimmt die Anzahl der Strukturproteine ab, die die Grundlage der Gesichtshaut bilden, was zu Erschlaffung, Faltenbildung und Symmetrieverlust führt. Die Gesichts-Hals-Ästhetik umfasst ein breites Spektrum von chirurgischen Facelifts bis hin zu nicht-chirurgischen Faden- und Laserverfahren.</p><p>In der Klinik von Prof. Dr. Gökçe Özel in Ankara und Antalya Lara wird der am besten geeignete Eingriff individuell nach den Bedürfnissen und der Anatomie des Patienten ausgewählt. Optionen umfassen: vollständiges Facelift, Halsstraffung, Kinn-Liposuktion, Faden-Lifting und Laserbehandlungen.</p>' },
    },
  },
};

// ─── GOKCE-OZEL-KIMDIR TRANSLATIONS ─────────────────────────
const GOKCE_HERO_TRANSLATIONS = {
  ar: { title: 'من هي غوكتشه أوزيل؟', subtitle: 'أخصائية أنف وأذن وحنجرة وجراحة تجميل الوجه | أنقرة وأنطاليا' },
  ru: { title: 'Кто такая Гёкче Озель?', subtitle: 'Специалист по ЛОР и пластической хирургии лица | Анкара и Анталья' },
  fr: { title: 'Qui est Gökçe Özel ?', subtitle: 'Spécialiste ORL et chirurgie esthétique du visage | Ankara & Antalya' },
  de: { title: 'Wer ist Gökçe Özel?', subtitle: 'HNO-Spezialistin und Gesichts-Ästhetik-Chirurgin | Ankara & Antalya' },
};

const GOKCE_ZENGIN_TRANSLATIONS = {
  ar: { text: '<p>تخرجت من كلية الطب الإنجليزية في جامعة إسطنبول جراحاشا. أتممت تدريبي في التخصص في عيادة الأنف والأذن والحنجرة بمستشفى دشكابي يلدريم بيازيت للتدريب والبحث.</p><p>بين عامي 2013 و2021، عملت عضو هيئة تدريس في قسم الأنف والأذن والحنجرة بكلية الطب في جامعة كيريككاله. حصلت على لقب أستاذ مشارك عام 2015 وأستاذ عام 2021.</p><p>أنا عضو مجلس إدارة في جمعية جراحة تجميل الوجه التركية، وعضو في كل من TYPCD وCMAC. نشرت أكثر من 100 مقالة أكاديمية في المجلات الدولية المحكّمة. أعمل حالياً في عيادتي الخاصة في أنقرة وأنطاليا لارا.</p>' },
  ru: { text: '<p>Я окончила Английский медицинский факультет Стамбульского университета Джеррахпаша. Прошла специализацию в клинике оториноларингологии учебно-исследовательской больницы Дышкапы Йылдырым Беязыт.</p><p>С 2013 по 2021 год я работала преподавателем кафедры ЛОР медицинского факультета Университета Кыриккале. В 2015 году получила звание доцента, в 2021 году — профессора.</p><p>Являюсь членом совета директоров Турецкой ассоциации пластической хирургии лица и членом TYPCD и CMAC. Опубликовала более 100 научных статей в международных рецензируемых журналах. В настоящее время веду частную практику в Анкаре и Анталье Лара.</p>' },
  fr: { text: '<p>Je suis diplômée de la faculté de médecine anglophone de l\'Université d\'Istanbul Cerrahpaşa. J\'ai effectué ma spécialisation à la clinique ORL de l\'hôpital d\'enseignement et de recherche Dışkapı Yıldırım Beyazıt.</p><p>De 2013 à 2021, j\'ai travaillé comme membre du corps enseignant au département ORL de la faculté de médecine de l\'Université de Kırıkkale. J\'ai obtenu le titre de maître de conférences en 2015 et de professeur en 2021.</p><p>Je suis membre du conseil d\'administration de l\'Association turque de chirurgie plastique faciale et membre de TYPCD et CMAC. J\'ai publié plus de 100 articles scientifiques dans des revues internationales à comité de lecture. J\'exerce actuellement dans ma clinique privée à Ankara et Antalya Lara.</p>' },
  de: { text: '<p>Ich bin Absolventin der englischsprachigen Medizinfakultät der Universität Istanbul Cerrahpaşa. Meine Facharztausbildung absolvierte ich an der HNO-Klinik des Dışkapı Yıldırım Beyazıt Lehr- und Forschungskrankenhauses.</p><p>Von 2013 bis 2021 war ich als Dozentin an der HNO-Abteilung der medizinischen Fakultät der Kırıkkale-Universität tätig. 2015 erhielt ich den Titel Assistenzprofessorin und 2021 den Titel Professorin.</p><p>Ich bin Vorstandsmitglied der Türkischen Gesellschaft für Gesichtsplastische Chirurgie und Mitglied von TYPCD und CMAC. Ich habe über 100 wissenschaftliche Artikel in internationalen Fachzeitschriften veröffentlicht. Derzeit praktiziere ich in meiner Privatklinik in Ankara und Antalya Lara.</p>' },
};

// ─────────────────────────────────────────────────────────────
async function main() {
  let seoAdded = 0, translationsAdded = 0;

  // ── STEP 1: Fix mojibake duplicates with noindex SEO ──
  console.log('\n=== STEP 1: Adding noindex SEO to mojibake duplicates ===');
  for (const [mojiSlug, canonicalSlug] of Object.entries(MOJIBAKE_MAP)) {
    const page = await prisma.page.findFirst({ where: { slug: mojiSlug }, include: { seoMeta: true } });
    if (!page) { console.log('  SKIP (not found):', mojiSlug); continue; }

    const canonPath = '/hizmetler/' + canonicalSlug;
    const canonUrl = BASE_URL + canonPath;

    for (const locale of ['tr','en','ar','ru','fr','de']) {
      const existing = page.seoMeta.find(s => s.locale === locale);
      if (existing) {
        // Update if no canonical set
        if (!existing.canonicalUrl) {
          await prisma.seoMeta.update({
            where: { id: existing.id },
            data: { robots: 'noindex,follow', canonicalUrl: canonUrl }
          });
        }
        continue;
      }
      await prisma.seoMeta.create({
        data: {
          pageId: page.id,
          locale,
          metaTitle: 'Redirect',
          metaDescription: '',
          robots: 'noindex,follow',
          canonicalUrl: canonUrl,
        }
      });
      seoAdded++;
    }
    console.log('  ✅ noindex set:', mojiSlug, '→', canonicalSlug);
  }

  // ── STEP 2: Add full SEO + translations for legit pages ──
  console.log('\n=== STEP 2: Completing gd-liposuction and yz-boyun-estetii ===');
  for (const [slug, data] of Object.entries(LEGIT_PAGES)) {
    const page = await prisma.page.findFirst({
      where: { slug },
      include: { seoMeta: true, blocks: { include: { translations: true } } }
    });
    if (!page) { console.log('  SKIP:', slug); continue; }

    // Add SEO meta
    const existingSeoLocales = page.seoMeta.map(s => s.locale);
    for (const [locale, seo] of Object.entries(data.seo)) {
      if (existingSeoLocales.includes(locale)) continue;
      await prisma.seoMeta.create({
        data: {
          pageId: page.id,
          locale,
          metaTitle: seo.title,
          metaDescription: seo.desc,
          robots: 'index,follow',
        }
      });
      seoAdded++;
      console.log(`  + SEO [${locale}] for ${slug}`);
    }

    // Add missing translations
    for (const block of page.blocks) {
      if (block.componentType !== 'legacy_content') continue;
      const existingLocales = block.translations.map(t => t.locale);
      const trTr = block.translations.find(t => t.locale === 'tr');
      const trData = trTr ? JSON.parse(trTr.contentData) : {};

      for (const [locale, tr] of Object.entries(data.translations)) {
        if (existingLocales.includes(locale)) continue;
        await prisma.translation.create({
          data: {
            blockId: block.id,
            locale,
            contentData: JSON.stringify({
              slug,
              title: tr.title,
              content: tr.content,
              seo_title: data.seo[locale]?.title || trData.seo_title || '',
              seo_description: data.seo[locale]?.desc || trData.seo_description || '',
            }),
          }
        });
        translationsAdded++;
        console.log(`  + Translation [${locale}] for ${slug}`);
      }
    }
  }

  // ── STEP 3: Add AR/RU/FR/DE translations for gokce-ozel-kimdir ──
  console.log('\n=== STEP 3: Completing gokce-ozel-kimdir translations ===');
  const gokce = await prisma.page.findFirst({
    where: { slug: 'gokce-ozel-kimdir' },
    include: { blocks: { include: { translations: true } } }
  });

  for (const block of gokce.blocks) {
    const existingLocales = block.translations.map(t => t.locale);

    if (block.componentType === 'hero_slider') {
      for (const [locale, data] of Object.entries(GOKCE_HERO_TRANSLATIONS)) {
        if (existingLocales.includes(locale)) continue;
        await prisma.translation.create({
          data: {
            blockId: block.id,
            locale,
            contentData: JSON.stringify(data),
          }
        });
        translationsAdded++;
        console.log(`  + hero_slider [${locale}] for gokce-ozel-kimdir`);
      }
    } else if (block.componentType === 'zengin_metin') {
      for (const [locale, data] of Object.entries(GOKCE_ZENGIN_TRANSLATIONS)) {
        if (existingLocales.includes(locale)) continue;
        await prisma.translation.create({
          data: {
            blockId: block.id,
            locale,
            contentData: JSON.stringify(data),
          }
        });
        translationsAdded++;
        console.log(`  + zengin_metin [${locale}] for gokce-ozel-kimdir`);
      }
    } else if (block.componentType === 'biography') {
      // Add minimal translations for all missing locales
      for (const locale of ['tr','en','ar','ru','fr','de']) {
        if (existingLocales.includes(locale)) continue;
        await prisma.translation.create({
          data: {
            blockId: block.id,
            locale,
            contentData: JSON.stringify({ text: '' }),
          }
        });
        translationsAdded++;
        console.log(`  + biography [${locale}] for gokce-ozel-kimdir`);
      }
    }
  }

  console.log('\n=== DONE ===');
  console.log(`SEO meta added: ${seoAdded}`);
  console.log(`Translations added: ${translationsAdded}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
