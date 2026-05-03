/**
 * complete-all-missing.mjs
 * Fills ALL missing content translations, SEO meta, and creates new service pages.
 *
 * Tasks:
 * 1. Add AR/RU/FR/DE content translations for rinoplasti, gz-kapa-estetii
 * 2. Add EN+AR+RU+FR+DE SEO meta for 18 existing pages with only TR SEO
 * 3. Create 5 new full pages: botoks, endolift, endolift-lazer, ip-aski, cilt-yenileme
 */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────
// MULTILINGUAL CONTENT FOR EXISTING PAGES (missing AR/RU/FR/DE)
// ─────────────────────────────────────────────────────────────

const TRANSLATION_DATA = {
  rinoplasti: {
    ar: { title: 'تجميل الأنف', content: '<p>تجميل الأنف (الرينوبلاستي) هو عملية جراحية تهدف إلى تصحيح التشوهات في الأنف ومعالجة التأثيرات النفسية المرتبطة بها. يتم في هذه العملية تقييم الوجه ككل بدلاً من التركيز على الأنف فقط. تُعدّ البروفيسورة الدكتورة غوكتشه أوزيل من أبرز المتخصصات في تجميل الأنف في أنقرة وأنطاليا، إذ تتميز بتوجهها الطبيعي في نتائج العمليات وخبرتها الواسعة التي تمتد لأكثر من 15 عاماً. تُجرى عملية تجميل الأنف عادةً تحت التخدير العام وتستغرق بين ساعتين وأربع ساعات. تبدأ نتائج العملية بالظهور خلال 3-6 أشهر وتكتمل بالكامل في غضون عام.</p>' },
    ru: { title: 'Ринопластика', content: '<p>Ринопластика — операция, направленная на устранение деформаций носа и связанных с ними психологических последствий. При этой операции лицо оценивается в целом, а не только нос. Проф. д-р Гёкче Озель — один из ведущих специалистов по ринопластике в Анкаре и Анталье, отличающийся естественным подходом к результатам. Операция проводится под общей анестезией и длится от 2 до 4 часов. Первые результаты заметны через 3–6 месяцев, окончательные — через год.</p>' },
    fr: { title: 'Rhinoplastie', content: '<p>La rhinoplastie est une opération visant à corriger les déformations nasales et à traiter leurs effets psychologiques. Dans cette opération, le visage est évalué dans son ensemble. La Prof. Dr. Gökçe Özel est l\'une des spécialistes les plus reconnues en rhinoplastie à Ankara et Antalya, avec une approche axée sur des résultats naturels. L\'opération est réalisée sous anesthésie générale et dure entre 2 et 4 heures. Les résultats commencent à apparaître en 3 à 6 mois et sont complets en un an.</p>' },
    de: { title: 'Rhinoplastik', content: '<p>Die Rhinoplastik ist eine Operation, die Nasendeformitäten korrigiert und die damit verbundenen psychologischen Auswirkungen behandelt. Bei dieser Operation wird das Gesicht als Ganzes bewertet. Prof. Dr. Gökçe Özel ist eine der führenden Rhinoplastik-Spezialistinnen in Ankara und Antalya und zeichnet sich durch einen natürlichen Ansatz bei den Ergebnissen aus. Die Operation wird unter Vollnarkose durchgeführt und dauert 2–4 Stunden. Die Ergebnisse zeigen sich nach 3–6 Monaten und sind nach einem Jahr vollständig.</p>' },
  },
  'gz-kapa-estetii': {
    ar: { title: 'تجميل جفن العين', content: '<p>يُجرى تجميل جفن العين لتصحيح التشوهات والترهلات الناجمة عن ارتخاء أنسجة الجفن العلوي أو السفلي بسبب التقدم في السن أو أسباب أخرى. عادةً ما تُجرى هذه العملية تحت التخدير الموضعي وتستغرق نحو ساعة. فترة التعافي قصيرة وعادةً ما تعود الحياة إلى طبيعتها خلال أسبوع واحد. تُقدّم البروفيسورة الدكتورة غوكتشه أوزيل في أنقرة وأنطاليا لارا عمليات الجفن العلوي والسفلي، مما يمنح المريض مظهراً أكثر شباباً وحيوية.</p>' },
    ru: { title: 'Эстетика век', content: '<p>Блефаропластика выполняется для коррекции деформаций и птоза, вызванных ослаблением тканей верхнего или нижнего века вследствие старения или других причин. Операция обычно проводится под местной анестезией и занимает около часа. Восстановление проходит быстро, нормальная жизнь возобновляется в течение недели. Проф. д-р Гёкче Озель выполняет операции на верхнем и нижнем веках в Анкаре и Анталье (Лара), придавая взгляду более молодой и выразительный вид.</p>' },
    fr: { title: 'Esthétique des paupières', content: '<p>L\'esthétique des paupières est réalisée pour corriger les déformations et le relâchement des tissus de la paupière supérieure ou inférieure dus au vieillissement. L\'opération se fait généralement sous anesthésie locale et dure environ une heure. La récupération est rapide, avec un retour à la vie normale en une semaine. La Prof. Dr. Gökçe Özel réalise des blépharoplasties supérieures et inférieures à Ankara et Antalya Lara pour un regard plus jeune et expressif.</p>' },
    de: { title: 'Lidästhetik', content: '<p>Die Lidästhetik wird durchgeführt, um Verformungen und Erschlaffungen des Ober- oder Unterlids zu korrigieren, die durch Alterung oder andere Ursachen entstehen. Der Eingriff erfolgt meist unter Lokalanästhesie und dauert etwa eine Stunde. Die Erholung verläuft schnell, die Rückkehr zum normalen Alltag erfolgt innerhalb einer Woche. Prof. Dr. Gökçe Özel führt Ober- und Unterlidkorrekturen in Ankara und Antalya Lara durch und verleiht dem Blick ein jüngeres, ausdrucksstärkeres Erscheinungsbild.</p>' },
  },
};

// ─────────────────────────────────────────────────────────────
// SEO META FOR EXISTING PAGES (missing EN+AR+RU+FR+DE)
// ─────────────────────────────────────────────────────────────

const SEO_META_ADDITIONS = [
  {
    slug: 'i-ple-yuz-germe-fransiz-aski',
    en: { title: 'Thread Face Lift Ankara & Antalya | French Lift', desc: 'Non-surgical thread face lift with PDO threads. Natural and immediate results by Prof. Dr. Gökçe Özel in Ankara & Antalya Lara.' },
    ar: { title: 'شد الوجه بالخيوط أنقرة وأنطاليا | الرفع الفرنسي', desc: 'شد الوجه بدون جراحة باستخدام خيوط PDO. نتائج طبيعية وفورية مع البروفيسورة د. غوكتشه أوزيل في أنقرة وأنطاليا.' },
    ru: { title: 'Нитевой лифтинг Анкара & Анталья | Французский лифт', desc: 'Безоперационный нитевой лифтинг лица с нитями PDO. Естественные и немедленные результаты. Проф. д-р Гёкче Озель, Анкара и Анталья Лара.' },
    fr: { title: 'Lifting par fils Ankara & Antalya | French Lift', desc: 'Lifting facial non chirurgical avec fils PDO. Résultats naturels et immédiats par Prof. Dr. Gökçe Özel à Ankara & Antalya Lara.' },
    de: { title: 'Faden-Facelift Ankara & Antalya | French Lift', desc: 'Nicht-chirurgisches Faden-Facelift mit PDO-Fäden. Natürliche und sofortige Ergebnisse von Prof. Dr. Gökçe Özel in Ankara & Antalya Lara.' },
  },
  {
    slug: 'sinuzit-ameliyati',
    en: { title: 'Sinusitis Surgery Ankara & Antalya | ENT Specialist', desc: 'Functional endoscopic sinus surgery (FESS) for chronic sinusitis. Prof. Dr. Gökçe Özel, ENT specialist in Ankara & Antalya.' },
    ar: { title: 'عملية الجيوب الأنفية أنقرة وأنطاليا | التنظير الأنفي', desc: 'جراحة الجيوب الأنفية بالتنظير (FESS) لعلاج التهاب الجيوب المزمن. البروفيسورة د. غوكتشه أوزيل، أخصائية أنف وأذن وحنجرة في أنقرة وأنطاليا.' },
    ru: { title: 'Операция на пазухах Анкара & Анталья | ЛОР-хирург', desc: 'Функциональная эндоскопическая хирургия пазух (FESS) при хроническом синусите. Проф. д-р Гёкче Озель, ЛОР, Анкара и Анталья.' },
    fr: { title: 'Chirurgie des sinus Ankara & Antalya | Spécialiste ORL', desc: 'Chirurgie sinusale endoscopique fonctionnelle (FESS) pour sinusite chronique. Prof. Dr. Gökçe Özel, spécialiste ORL à Ankara & Antalya.' },
    de: { title: 'Nasennebenhöhlen-OP Ankara & Antalya | HNO-Chirurgie', desc: 'Funktionelle endoskopische Nasennebenhöhlenchirurgie (FESS) bei chronischer Sinusitis. Prof. Dr. Gökçe Özel, HNO-Spezialistin in Ankara & Antalya.' },
  },
  {
    slug: 'botulinum-toksin-uygulamasi',
    en: { title: 'Botulinum Toxin Treatment Ankara & Antalya | Botox', desc: 'Medical and aesthetic botulinum toxin (Botox) applications. Wrinkle treatment, brow lift, migraine therapy by Prof. Dr. Gökçe Özel.' },
    ar: { title: 'علاج توكسين البوتولينوم أنقرة وأنطاليا | بوتوكس', desc: 'تطبيقات توكسين البوتولينوم (البوتوكس) الطبية والجمالية. علاج التجاعيد ورفع الحاجب وعلاج الصداع النصفي. البروفيسورة د. غوكتشه أوزيل.' },
    ru: { title: 'Ботулинотоксин Анкара & Анталья | Ботокс', desc: 'Медицинское и эстетическое применение ботулинотоксина (Ботокс): коррекция морщин, подъём брови, лечение мигрени. Проф. д-р Гёкче Озель.' },
    fr: { title: 'Toxine botulinique Ankara & Antalya | Botox', desc: 'Applications médicales et esthétiques de la toxine botulinique (Botox) : traitement des rides, lifting du sourcil, migraine. Prof. Dr. Gökçe Özel.' },
    de: { title: 'Botulinumtoxin Ankara & Antalya | Botox', desc: 'Medizinische und ästhetische Botulinumtoxin-Behandlungen: Faltenkorrektur, Brauenlift, Migränetherapie. Prof. Dr. Gökçe Özel.' },
  },
  {
    slug: 'goz-alti-isik-dolgusu',
    en: { title: 'Under Eye Filler Ankara & Antalya | Tear Trough Filler', desc: 'Under-eye light filler for dark circles and hollows. Hyaluronic acid tear trough treatment by Prof. Dr. Gökçe Özel in Ankara & Antalya.' },
    ar: { title: 'حشو تحت العين أنقرة وأنطاليا | فيلر الهالات', desc: 'حشو الضوء تحت العين لعلاج الهالات السوداء والغائرة. علاج الأخدود الدمعي بحمض الهيالورونيك. البروفيسورة د. غوكتشه أوزيل، أنقرة وأنطاليا.' },
    ru: { title: 'Филлер под глаза Анкара & Анталья | Слёзная борозда', desc: 'Световой филлер под глаза от тёмных кругов и впадин. Коррекция слёзной борозды гиалуроновой кислотой. Проф. д-р Гёкче Озель, Анкара и Анталья.' },
    fr: { title: 'Filler sous les yeux Ankara & Antalya | Sillon lacrymal', desc: 'Comblement du sillon lacrymal par acide hyaluronique pour les cernes et creux sous les yeux. Prof. Dr. Gökçe Özel, Ankara & Antalya.' },
    de: { title: 'Tränenrinnen-Filler Ankara & Antalya | Augenringe', desc: 'Unteraugen-Filler mit Hyaluronsäure gegen Augenringe und Hohlräume. Prof. Dr. Gökçe Özel, Ankara & Antalya Lara.' },
  },
  {
    slug: 'ameliyatsiz-kas-kaldirma',
    en: { title: 'Non-Surgical Brow Lift Ankara & Antalya | Botox Brow Lift', desc: 'Non-surgical brow lift with Botox or thread techniques. Instantly refreshed look without surgery by Prof. Dr. Gökçe Özel.' },
    ar: { title: 'رفع الحاجب بدون جراحة أنقرة وأنطاليا', desc: 'رفع الحاجب بدون جراحة باستخدام البوتوكس أو الخيوط. مظهر أكثر شباباً فوراً دون عملية جراحية. البروفيسورة د. غوكتشه أوزيل.' },
    ru: { title: 'Безоперационный подъём бровей Анкара & Анталья', desc: 'Нехирургический лифтинг бровей с помощью ботокса или нитей. Немедленно освежённый взгляд без операции. Проф. д-р Гёкче Озель.' },
    fr: { title: 'Lifting des sourcils non chirurgical Ankara & Antalya', desc: 'Lifting des sourcils sans chirurgie avec botox ou fils. Regard immédiatement rajeuni par Prof. Dr. Gökçe Özel, Ankara & Antalya.' },
    de: { title: 'Nicht-chirurgischer Brauenlift Ankara & Antalya', desc: 'Nicht-chirurgischer Brauenlift mit Botox oder Fäden. Sofort verjüngter Blick ohne Operation. Prof. Dr. Gökçe Özel, Ankara & Antalya.' },
  },
  {
    slug: 'botoks-ile-kas-kaldirma',
    en: { title: 'Botox Brow Lift Ankara & Antalya | Chemical Browpexy', desc: 'Brow lift with botulinum toxin injections. A quick, effective solution for drooping brows. Prof. Dr. Gökçe Özel, Ankara & Antalya.' },
    ar: { title: 'رفع الحاجب بالبوتوكس أنقرة وأنطاليا', desc: 'رفع الحاجب بحقن البوتولينوم. حل سريع وفعّال للحواجب المتدلية. البروفيسورة د. غوكتشه أوزيل، أنقرة وأنطاليا.' },
    ru: { title: 'Подъём бровей ботоксом Анкара & Анталья', desc: 'Подъём бровей инъекциями ботулинотоксина. Быстрое и эффективное решение для опущенных бровей. Проф. д-р Гёкче Озель.' },
    fr: { title: 'Lifting sourcils au botox Ankara & Antalya', desc: 'Lifting des sourcils par injections de toxine botulinique. Solution rapide et efficace pour les sourcils tombants. Prof. Dr. Gökçe Özel.' },
    de: { title: 'Botox-Brauenlift Ankara & Antalya', desc: 'Brauenlift mit Botulinumtoxin-Injektionen. Schnelle und effektive Lösung für hängende Augenbrauen. Prof. Dr. Gökçe Özel.' },
  },
  {
    slug: 'dolgu-ile-kas-kaldirma',
    en: { title: 'Filler Brow Lift Ankara & Antalya | Hyaluronic Browpexy', desc: 'Brow lift with hyaluronic acid filler injections. Volumizes and lifts brows for a younger look. Prof. Dr. Gökçe Özel.' },
    ar: { title: 'رفع الحاجب بالفيلر أنقرة وأنطاليا', desc: 'رفع الحاجب بحقن حمض الهيالورونيك. يمنح الحواجب حجماً وارتفاعاً لمظهر أكثر شباباً. البروفيسورة د. غوكتشه أوزيل.' },
    ru: { title: 'Подъём бровей филлером Анкара & Анталья', desc: 'Подъём бровей инъекциями гиалуроновой кислоты. Объём и лифтинг для более молодого вида. Проф. д-р Гёкче Озель.' },
    fr: { title: 'Lifting sourcils au filler Ankara & Antalya', desc: 'Lifting des sourcils par injections d\'acide hyaluronique. Volume et élévation pour un regard plus jeune. Prof. Dr. Gökçe Özel.' },
    de: { title: 'Filler-Brauenlift Ankara & Antalya', desc: 'Brauenlift mit Hyaluronsäure-Injektionen. Volumen und Lift für einen jüngeren Blick. Prof. Dr. Gökçe Özel.' },
  },
  {
    slug: 'i-ple-kas-kaldirma',
    en: { title: 'Thread Brow Lift Ankara & Antalya | PDO Thread Browpexy', desc: 'Brow lifting with PDO threads for an immediate and natural result. Non-surgical, minimal recovery. Prof. Dr. Gökçe Özel.' },
    ar: { title: 'رفع الحاجب بالخيوط أنقرة وأنطاليا', desc: 'رفع الحاجب بخيوط PDO لنتيجة فورية وطبيعية. بدون جراحة مع فترة تعافٍ قصيرة. البروفيسورة د. غوكتشه أوزيل.' },
    ru: { title: 'Нитевой лифтинг бровей Анкара & Анталья', desc: 'Подъём бровей нитями PDO — немедленный и естественный результат. Без операции, минимальная реабилитация. Проф. д-р Гёкче Озель.' },
    fr: { title: 'Lifting sourcils par fils Ankara & Antalya', desc: 'Lifting des sourcils avec fils PDO pour un résultat immédiat et naturel. Sans chirurgie, récupération minimale. Prof. Dr. Gökçe Özel.' },
    de: { title: 'Faden-Brauenlift Ankara & Antalya', desc: 'Brauen-Lifting mit PDO-Fäden für sofortige und natürliche Ergebnisse. Ohne Operation, minimale Erholung. Prof. Dr. Gökçe Özel.' },
  },
  {
    slug: 'migren-tedavisi',
    en: { title: 'Migraine Treatment Ankara & Antalya | Botox for Migraine', desc: 'FDA-approved botulinum toxin treatment for chronic migraine. Reduce frequency and severity of attacks. Prof. Dr. Gökçe Özel, ENT specialist.' },
    ar: { title: 'علاج الصداع النصفي أنقرة وأنطاليا | بوتوكس للصداع', desc: 'علاج الصداع النصفي المزمن بتوكسين البوتولينوم المعتمد من FDA. تقليل تكرار وشدة النوبات. البروفيسورة د. غوكتشه أوزيل.' },
    ru: { title: 'Лечение мигрени Анкара & Анталья | Ботокс от мигрени', desc: 'Лечение хронической мигрени ботулинотоксином (одобрено FDA). Снижение частоты и интенсивности приступов. Проф. д-р Гёкче Озель.' },
    fr: { title: 'Traitement migraine Ankara & Antalya | Botox migraine', desc: 'Traitement de la migraine chronique par toxine botulinique approuvée FDA. Réduction de la fréquence et de l\'intensité des crises. Prof. Dr. Gökçe Özel.' },
    de: { title: 'Migränebehandlung Ankara & Antalya | Botox bei Migräne', desc: 'FDA-zugelassene Botulinumtoxin-Behandlung bei chronischer Migräne. Reduzierung von Häufigkeit und Intensität der Anfälle. Prof. Dr. Gökçe Özel.' },
  },
  {
    slug: 'yuz-mezoterapisi',
    en: { title: 'Facial Mesotherapy Ankara & Antalya | Skin Vitamins', desc: 'Facial mesotherapy with vitamin cocktails for collagen stimulation, brightness and hydration. Prof. Dr. Gökçe Özel, Ankara & Antalya.' },
    ar: { title: 'ميزوثيرابي الوجه أنقرة وأنطاليا | فيتامينات البشرة', desc: 'ميزوثيرابي الوجه بكوكتيل الفيتامينات لتحفيز الكولاجين والإشراق والترطيب. البروفيسورة د. غوكتشه أوزيل، أنقرة وأنطاليا.' },
    ru: { title: 'Мезотерапия лица Анкара & Анталья | Витамины для кожи', desc: 'Мезотерапия лица витаминными коктейлями для стимуляции коллагена, сияния и увлажнения. Проф. д-р Гёкче Озель, Анкара и Анталья.' },
    fr: { title: 'Mésothérapie faciale Ankara & Antalya | Vitamines cutanées', desc: 'Mésothérapie faciale aux cocktails vitaminés pour stimuler le collagène, l\'éclat et l\'hydratation. Prof. Dr. Gökçe Özel, Ankara & Antalya.' },
    de: { title: 'Gesichts-Mesotherapie Ankara & Antalya | Hautvitamine', desc: 'Gesichts-Mesotherapie mit Vitamin-Cocktails zur Kollagenstimulation, Helligkeit und Hydration. Prof. Dr. Gökçe Özel, Ankara & Antalya.' },
  },
  {
    slug: 'cene-estetigi-mentoplasti',
    en: { title: 'Chin Aesthetics Ankara & Antalya | Mentoplasty', desc: 'Chin augmentation, reduction and reshaping surgery for balanced facial proportions. Prof. Dr. Gökçe Özel, Ankara & Antalya.' },
    ar: { title: 'تجميل الذقن أنقرة وأنطاليا | منتوبلاستي', desc: 'جراحة تكبير وتصغير وإعادة تشكيل الذقن لتحقيق نسب الوجه المتوازنة. البروفيسورة د. غوكتشه أوزيل، أنقرة وأنطاليا.' },
    ru: { title: 'Пластика подбородка Анкара & Анталья | Ментопластика', desc: 'Увеличение, уменьшение и изменение формы подбородка для гармоничных пропорций лица. Проф. д-р Гёкче Озель, Анкара и Анталья.' },
    fr: { title: 'Esthétique du menton Ankara & Antalya | Mentoplastie', desc: 'Augmentation, réduction et remodelage du menton pour des proportions faciales équilibrées. Prof. Dr. Gökçe Özel, Ankara & Antalya.' },
    de: { title: 'Kinnästhetik Ankara & Antalya | Mentoplastik', desc: 'Kinnvergrößerung, -verkleinerung und Umformung für ausgewogene Gesichtsproportionen. Prof. Dr. Gökçe Özel, Ankara & Antalya.' },
  },
  {
    slug: 'lipoliz-i-nceltme-mezoterapisi',
    en: { title: 'Lipolysis Slimming Mesotherapy Ankara & Antalya', desc: 'Mesotherapy for fat dissolution and body slimming. Effective inch loss treatment by Prof. Dr. Gökçe Özel in Ankara & Antalya.' },
    ar: { title: 'ميزوثيرابي تحليل الدهون أنقرة وأنطاليا | التنحيف', desc: 'ميزوثيرابي لتحليل الدهون وتنحيف الجسم. علاج فعّال لتقليل المقاسات. البروفيسورة د. غوكتشه أوزيل، أنقرة وأنطاليا.' },
    ru: { title: 'Липолитическая мезотерапия Анкара & Анталья', desc: 'Мезотерапия для растворения жира и коррекции фигуры. Эффективное уменьшение объёмов. Проф. д-р Гёкче Озель, Анкара и Анталья.' },
    fr: { title: 'Mésothérapie lipolyse Ankara & Antalya | Amincissement', desc: 'Mésothérapie pour la dissolution des graisses et l\'amincissement corporel. Traitement efficace pour perdre des centimètres. Prof. Dr. Gökçe Özel.' },
    de: { title: 'Lipolyse-Mesotherapie Ankara & Antalya | Körperstraffung', desc: 'Mesotherapie zur Fettauflösung und Körperstraffung. Wirksame Zentimeterreduktion. Prof. Dr. Gökçe Özel, Ankara & Antalya.' },
  },
  {
    slug: 'ozon-uygulamasi',
    en: { title: 'Ozone Therapy Ankara & Antalya | Skin & Wellness', desc: 'Medical ozone therapy for skin rejuvenation, wound healing and immune support. Prof. Dr. Gökçe Özel clinic, Ankara & Antalya.' },
    ar: { title: 'العلاج بالأوزون أنقرة وأنطاليا | الجلد والصحة', desc: 'العلاج بالأوزون الطبي لتجديد البشرة وشفاء الجروح ودعم المناعة. عيادة البروفيسورة د. غوكتشه أوزيل، أنقرة وأنطاليا.' },
    ru: { title: 'Озонотерапия Анкара & Анталья | Кожа и здоровье', desc: 'Медицинская озонотерапия для омоложения кожи, заживления ран и иммунной поддержки. Клиника проф. д-р Гёкче Озель, Анкара и Анталья.' },
    fr: { title: 'Ozonothérapie Ankara & Antalya | Peau et bien-être', desc: 'Ozonothérapie médicale pour le rajeunissement cutané, la cicatrisation et le soutien immunitaire. Clinique Prof. Dr. Gökçe Özel, Ankara & Antalya.' },
    de: { title: 'Ozontherapie Ankara & Antalya | Haut & Wohlbefinden', desc: 'Medizinische Ozontherapie zur Hautverjüngung, Wundheilung und Immununterstützung. Klinik Prof. Dr. Gökçe Özel, Ankara & Antalya.' },
  },
  {
    slug: 'damar-icine-glutatyon-uygulamasi',
    en: { title: 'IV Glutathione Ankara & Antalya | Skin Brightening', desc: 'Intravenous glutathione for skin brightening, antioxidant support and anti-aging. Prof. Dr. Gökçe Özel clinic, Ankara & Antalya.' },
    ar: { title: 'الجلوتاثيون الوريدي أنقرة وأنطاليا | تفتيح البشرة', desc: 'الجلوتاثيون عن طريق الوريد لتفتيح البشرة ودعم مضادات الأكسدة ومكافحة الشيخوخة. عيادة البروفيسورة د. غوكتشه أوزيل.' },
    ru: { title: 'Глутатион внутривенно Анкара & Анталья | Осветление', desc: 'Внутривенный глутатион для осветления кожи, антиоксидантной защиты и омоложения. Клиника проф. д-р Гёкче Озель, Анкара и Анталья.' },
    fr: { title: 'Glutathion IV Ankara & Antalya | Éclaircissement cutané', desc: 'Glutathion intraveineux pour l\'éclaircissement cutané, le soutien antioxydant et l\'anti-âge. Clinique Prof. Dr. Gökçe Özel, Ankara & Antalya.' },
    de: { title: 'IV-Glutathion Ankara & Antalya | Hautaufhellung', desc: 'Intravenöses Glutathion zur Hautaufhellung, antioxidativen Unterstützung und Anti-Aging. Klinik Prof. Dr. Gökçe Özel, Ankara & Antalya.' },
  },
  {
    slug: 'bisektomi',
    en: { title: 'Bisectomy Ankara & Antalya | Nose Tip Surgery', desc: 'Bisectomy (bony hump removal) of the nose for a refined profile. Prof. Dr. Gökçe Özel, rhinoplasty specialist in Ankara & Antalya.' },
    ar: { title: 'بيسيكتومي أنقرة وأنطاليا | تجميل طرف الأنف', desc: 'بيسيكتومي لإزالة النتوء العظمي للأنف وتحسين الملف الجانبي. البروفيسورة د. غوكتشه أوزيل، متخصصة في تجميل الأنف، أنقرة وأنطاليا.' },
    ru: { title: 'Бисектомия Анкара & Анталья | Хирургия кончика носа', desc: 'Бисектомия (удаление костного горбинки носа) для изящного профиля. Проф. д-р Гёкче Озель, специалист по ринопластике в Анкаре и Анталье.' },
    fr: { title: 'Bisectomie Ankara & Antalya | Chirurgie de la bosse nasale', desc: 'Bisectomie (ablation de la bosse osseuse) du nez pour un profil affiné. Prof. Dr. Gökçe Özel, spécialiste en rhinoplastie, Ankara & Antalya.' },
    de: { title: 'Bisektomie Ankara & Antalya | Nasenhöcker-OP', desc: 'Bisektomie (Nasenrücken-Abtragung) für ein verfeinertes Profil. Prof. Dr. Gökçe Özel, Rhinoplastik-Spezialistin in Ankara & Antalya.' },
  },
  {
    slug: 'mikro-i-gneleme',
    en: { title: 'Microneedling Ankara & Antalya | Collagen Induction', desc: 'Microneedling (collagen induction therapy) for skin texture improvement, pore minimising and scar treatment. Prof. Dr. Gökçe Özel.' },
    ar: { title: 'الإبر الدقيقة أنقرة وأنطاليا | تحريض الكولاجين', desc: 'علاج الإبر الدقيقة (تحريض الكولاجين) لتحسين نسيج البشرة وتقليص المسام وعلاج الندوب. البروفيسورة د. غوكتشه أوزيل.' },
    ru: { title: 'Микроиглинг Анкара & Анталья | Индукция коллагена', desc: 'Микроиглинг (индукция коллагена) для улучшения текстуры кожи, сужения пор и лечения рубцов. Проф. д-р Гёкче Озель, Анкара и Анталья.' },
    fr: { title: 'Microneedling Ankara & Antalya | Induction de collagène', desc: 'Microneedling (thérapie par induction de collagène) pour améliorer la texture, minimiser les pores et traiter les cicatrices. Prof. Dr. Gökçe Özel.' },
    de: { title: 'Microneedling Ankara & Antalya | Kollagen-Induktion', desc: 'Microneedling (Kollagen-Induktionstherapie) zur Verbesserung der Hauttextur, Porenverkleinerung und Narbenbehandlung. Prof. Dr. Gökçe Özel.' },
  },
  {
    slug: 'skar-revizyonu-yara-izi-estetigi',
    en: { title: 'Scar Revision Ankara & Antalya | Wound Scar Aesthetics', desc: 'Surgical and non-surgical scar revision treatments for improved skin appearance. Prof. Dr. Gökçe Özel, Ankara & Antalya.' },
    ar: { title: 'تجديد الندوب أنقرة وأنطاليا | جماليات آثار الجروح', desc: 'علاجات جراحية وغير جراحية لتجديد الندوب وتحسين مظهر البشرة. البروفيسورة د. غوكتشه أوزيل، أنقرة وأنطاليا.' },
    ru: { title: 'Коррекция рубцов Анкара & Анталья | Эстетика шрамов', desc: 'Хирургические и нехирургические методы коррекции рубцов для улучшения внешнего вида кожи. Проф. д-р Гёкче Озель, Анкара и Анталья.' },
    fr: { title: 'Révision de cicatrice Ankara & Antalya | Esthétique des cicatrices', desc: 'Traitements chirurgicaux et non chirurgicaux de révision de cicatrices pour améliorer l\'apparence de la peau. Prof. Dr. Gökçe Özel.' },
    de: { title: 'Narbenkorrektur Ankara & Antalya | Narbenästhetik', desc: 'Chirurgische und nicht-chirurgische Narbenkorrektur für ein verbessertes Hautbild. Prof. Dr. Gökçe Özel, Ankara & Antalya.' },
  },
  {
    slug: 'dolgu-i-slemleri',
    en: { title: 'Filler Procedures Ankara & Antalya | Hyaluronic Acid', desc: 'Comprehensive filler procedures with hyaluronic acid for face contouring, volume restoration and rejuvenation. Prof. Dr. Gökçe Özel.' },
    ar: { title: 'إجراءات الفيلر أنقرة وأنطاليا | حمض الهيالورونيك', desc: 'إجراءات الفيلر الشاملة بحمض الهيالورونيك لتشكيل الوجه واستعادة الحجم والتجديد. البروفيسورة د. غوكتشه أوزيل.' },
    ru: { title: 'Процедуры с филлером Анкара & Анталья | Гиалуроновая кислота', desc: 'Комплексные процедуры с гиалуроновой кислотой: контурирование лица, восстановление объёма и омоложение. Проф. д-р Гёкче Озель.' },
    fr: { title: 'Procédures de filler Ankara & Antalya | Acide hyaluronique', desc: 'Procédures de filler complètes à l\'acide hyaluronique pour la sculpture faciale, la restauration du volume et le rajeunissement. Prof. Dr. Gökçe Özel.' },
    de: { title: 'Filler-Behandlungen Ankara & Antalya | Hyaluronsäure', desc: 'Umfassende Filler-Behandlungen mit Hyaluronsäure für Gesichtskonturierung, Volumenwiederherstellung und Verjüngung. Prof. Dr. Gökçe Özel.' },
  },
];

// ─────────────────────────────────────────────────────────────
// NEW PAGES TO CREATE FROM SCRATCH
// ─────────────────────────────────────────────────────────────

const NEW_PAGES = [
  {
    slug: 'botoks',
    titleInternal: 'Botoks Uygulamaları',
    seo: {
      tr: { title: 'Botoks Uygulamaları Ankara & Antalya | Prof. Dr. Gökçe Özel', desc: 'Botoks ile kırışıklık tedavisi, alın botoksu, kaş kaldırma ve migrenin botoks tedavisi. Ankara ve Antalya Lara\'da uzman botoks uygulamaları.', kw: 'botoks Ankara, botoks Antalya, kırışıklık tedavisi, alın botoksu, kaş kaldırma botoks, migren botoks' },
      en: { title: 'Botox Treatment Ankara & Antalya | Prof. Dr. Gökçe Özel', desc: 'Expert Botox injections for wrinkle removal, brow lift and migraine treatment. Natural-looking results in Ankara & Antalya Lara.', kw: 'botox Ankara, botox Antalya, wrinkle treatment, brow lift botox, migraine botox' },
      ar: { title: 'علاج البوتوكس أنقرة وأنطاليا | البروفيسورة د. غوكتشه أوزيل', desc: 'حقن البوتوكس المتخصصة لإزالة التجاعيد ورفع الحاجب وعلاج الصداع النصفي. نتائج طبيعية في أنقرة وأنطاليا لارا.' },
      ru: { title: 'Ботокс Анкара & Анталья | Проф. д-р Гёкче Озель', desc: 'Профессиональные инъекции ботокса: удаление морщин, подъём бровей, лечение мигрени. Естественные результаты в Анкаре и Анталье Лара.' },
      fr: { title: 'Botox Ankara & Antalya | Prof. Dr. Gökçe Özel', desc: 'Injections de botox expertisées pour supprimer les rides, lifter les sourcils et traiter la migraine. Résultats naturels à Ankara & Antalya Lara.' },
      de: { title: 'Botox Ankara & Antalya | Prof. Dr. Gökçe Özel', desc: 'Professionelle Botox-Injektionen zur Faltenentfernung, Brauenlift und Migränebehandlung. Natürliche Ergebnisse in Ankara & Antalya Lara.' },
    },
    content: {
      tr: { title: 'Botoks Uygulamaları', text: '<p>Botoks (botulinum toksin), kırışıklıkları geçici olarak düzelten, yüz gençleştirmede en sık başvurulan estetik uygulamalardan biridir. Prof. Dr. Gökçe Özel kliniğinde Ankara ve Antalya Lara\'da uygulanan botoks tedavisi; alın, gözçevresi, dudak çevresi kırışıklıkları, boyun bantları ve tavşan hatlarını hedefler.</p><p>Aynı zamanda botoks; kaş kaldırma, diş gıcırdatma (bruksizm) tedavisi, aşırı terleme (hiperhidroz) ve kronik migren tedavisinde de kullanılmaktadır. İşlem 15-20 dakika sürer, günlük yaşama anında dönülebilir. Etkisi 4-6 ay devam eder.</p>' },
      en: { title: 'Botox Treatments', text: '<p>Botox (botulinum toxin) is one of the most commonly used aesthetic procedures for temporarily correcting wrinkles and rejuvenating the face. At the clinic of Prof. Dr. Gökçe Özel in Ankara and Antalya Lara, Botox targets forehead lines, crow\'s feet, lip lines, neck bands and bunny lines.</p><p>Botox is also used for brow lifting, bruxism (teeth grinding) treatment, hyperhidrosis (excessive sweating) and chronic migraine therapy. The procedure takes 15-20 minutes with no downtime. Effects last 4-6 months.</p>' },
      ar: { title: 'علاجات البوتوكس', text: '<p>البوتوكس (توكسين البوتولينوم) هو أحد الإجراءات الجمالية الأكثر شيوعاً لتصحيح التجاعيد مؤقتاً وتجديد شباب الوجه. في عيادة البروفيسورة د. غوكتشه أوزيل في أنقرة وأنطاليا لارا، يستهدف البوتوكس خطوط الجبهة، وخطوط حول العينين والشفتين، وأطواق الرقبة.</p><p>يُستخدم البوتوكس أيضاً لرفع الحاجب وعلاج الصرير وفرط التعرق والصداع النصفي المزمن. تستغرق العملية 15-20 دقيقة دون توقف عن الأنشطة. يستمر المفعول 4-6 أشهر.</p>' },
      ru: { title: 'Ботокс-процедуры', text: '<p>Ботокс (ботулинотоксин) — одна из наиболее распространённых эстетических процедур для временной коррекции морщин и омоложения лица. В клинике проф. д-р Гёкче Озель в Анкаре и Анталье Лара ботокс применяется для лобных морщин, гусиных лапок, линий вокруг губ, шейных полос.</p><p>Ботокс также используется для подъёма бровей, лечения бруксизма, гипергидроза и хронической мигрени. Процедура занимает 15-20 минут без периода реабилитации. Эффект длится 4-6 месяцев.</p>' },
      fr: { title: 'Traitements Botox', text: '<p>Le botox (toxine botulinique) est l\'une des procédures esthétiques les plus utilisées pour corriger temporairement les rides et rajeunir le visage. À la clinique de la Prof. Dr. Gökçe Özel à Ankara et Antalya Lara, le botox cible les rides du front, les pattes d\'oie, les rides péribuccales et les bandes du cou.</p><p>Le botox est également utilisé pour le lifting des sourcils, le traitement du bruxisme, l\'hyperhidrose et la migraine chronique. La procédure dure 15-20 minutes sans temps d\'arrêt. Les effets durent 4-6 mois.</p>' },
      de: { title: 'Botox-Behandlungen', text: '<p>Botox (Botulinumtoxin) ist eine der am häufigsten verwendeten ästhetischen Behandlungen zur vorübergehenden Faltenkorrektur und Gesichtsverjüngung. In der Klinik von Prof. Dr. Gökçe Özel in Ankara und Antalya Lara zielt Botox auf Stirnfalten, Krähenfüße, Lippenfalten und Halsbänder.</p><p>Botox wird auch für Brauenlift, Bruxismus-Behandlung, Hyperhidrose und chronische Migräne eingesetzt. Der Eingriff dauert 15-20 Minuten ohne Ausfallzeit. Die Wirkung hält 4-6 Monate an.</p>' },
    },
  },
  {
    slug: 'endolift',
    titleInternal: 'Endolift Lazer',
    seo: {
      tr: { title: 'Endolift Lazer Ankara & Antalya | Cerrahsız Yüz Germe', desc: 'Endolift lazer ile cilt altı doku sıkılaştırma ve cerrahsız yüz germe. Prof. Dr. Gökçe Özel ile Ankara ve Antalya Lara\'da güvenli Endolift uygulaması.', kw: 'Endolift Ankara, Endolift Antalya, lazerle yüz germe, cerrahsız yüz germe' },
      en: { title: 'Endolift Laser Ankara & Antalya | Non-Surgical Facelift', desc: 'Endolift laser for sub-dermal tissue tightening and non-surgical face lift. Safe Endolift treatment by Prof. Dr. Gökçe Özel in Ankara & Antalya Lara.', kw: 'Endolift Ankara, Endolift Antalya, laser facelift, non-surgical facelift' },
      ar: { title: 'ليزر إندوليفت أنقرة وأنطاليا | شد الوجه بدون جراحة', desc: 'ليزر إندوليفت لشد الأنسجة تحت الجلد ورفع الوجه بدون جراحة. علاج إندوليفت آمن مع البروفيسورة د. غوكتشه أوزيل في أنقرة وأنطاليا لارا.' },
      ru: { title: 'Лазер Endolift Анкара & Анталья | Нехирургический лифтинг', desc: 'Лазер Endolift для подтяжки подкожных тканей и нехирургического лифтинга лица. Безопасная процедура Endolift. Проф. д-р Гёкче Озель, Анкара и Анталья Лара.' },
      fr: { title: 'Laser Endolift Ankara & Antalya | Lifting non chirurgical', desc: 'Laser Endolift pour le resserrement des tissus sous-dermiques et le lifting non chirurgical du visage. Prof. Dr. Gökçe Özel, Ankara & Antalya Lara.' },
      de: { title: 'Endolift-Laser Ankara & Antalya | Nicht-chirurgisches Facelift', desc: 'Endolift-Laser für subdermale Gewebestraffung und nicht-chirurgisches Facelift. Sichere Endolift-Behandlung von Prof. Dr. Gökçe Özel in Ankara & Antalya.' },
    },
    content: {
      tr: { title: 'Endolift Lazer', text: '<p>Endolift, 1470 nm dalga boylu bir lazer tüpünün cilt altına yerleştirilerek subdermal yağ dokusunda ısıl etki oluşturmasına dayanan minimal invaziv bir yüz gençleştirme yöntemidir. Bu işlem ile; boyun, çene altı, yanak, alın ve göz çevresi bölgelerinde eş zamanlı olarak yağ erimesi ve cilt sıkılaşması sağlanır.</p><p>Endolift, lokal anestezi ile uygulanır ve yaklaşık 30-60 dakika sürer. İşlem sonrası hafif şişlik ve morluk 3-5 günde geçer. Sıkılaşma etkisi 3-6 ay içinde belirginleşir ve sonuçlar 2-3 yıl sürer. Prof. Dr. Gökçe Özel, Ankara ve Antalya Lara\'da Endolift uygulamasında deneyimli isimler arasında yer almaktadır.</p>' },
      en: { title: 'Endolift Laser', text: '<p>Endolift is a minimally invasive facial rejuvenation method based on inserting a 1470nm laser fibre under the skin to create a thermal effect in the subdermal fat tissue. This simultaneously achieves fat dissolution and skin tightening in the neck, jowl, cheeks, forehead and eye areas.</p><p>Endolift is performed under local anaesthesia and takes approximately 30-60 minutes. Minor swelling and bruising resolve in 3-5 days. The tightening effect becomes visible over 3-6 months and results last 2-3 years. Prof. Dr. Gökçe Özel is among the experienced practitioners of Endolift in Ankara and Antalya Lara.</p>' },
      ar: { title: 'ليزر إندوليفت', text: '<p>إندوليفت هو طريقة تجديد للوجه بالحد الأدنى من التدخل الجراحي، تعتمد على إدخال ألياف ليزر 1470 نانومتر تحت الجلد لإحداث تأثير حراري في الأنسجة الدهنية تحت الجلد. يحقق هذا الإجراء في آنٍ واحد ذوبان الدهون وشد الجلد في منطقة الرقبة والجوانب والخدين والجبهة وحول العينين.</p><p>يُجرى إندوليفت تحت التخدير الموضعي ويستغرق 30-60 دقيقة. تتراجع التورمات الطفيفة خلال 3-5 أيام. يتضح تأثير الشد بعد 3-6 أشهر وتستمر النتائج 2-3 سنوات.</p>' },
      ru: { title: 'Лазер Endolift', text: '<p>Endolift — малоинвазивный метод омоложения лица, основанный на введении лазерного волокна 1470 нм под кожу для создания теплового эффекта в подкожной жировой клетчатке. Одновременно достигается растворение жира и подтяжка кожи в области шеи, нижней части лица, щёк, лба и зоны вокруг глаз.</p><p>Процедура выполняется под местной анестезией и занимает 30-60 минут. Лёгкий отёк и гематомы проходят за 3-5 дней. Эффект подтяжки становится заметным через 3-6 месяцев, результаты сохраняются 2-3 года.</p>' },
      fr: { title: 'Laser Endolift', text: '<p>Endolift est une méthode de rajeunissement facial minimalement invasive basée sur l\'insertion d\'une fibre laser 1470nm sous la peau pour créer un effet thermique dans le tissu adipeux sous-dermique. Cette procédure réalise simultanément la dissolution des graisses et le raffermissement cutané au niveau du cou, des joues, du front et des yeux.</p><p>Endolift est réalisé sous anesthésie locale et dure environ 30-60 minutes. Le léger gonflement et les ecchymoses se résorbent en 3-5 jours. L\'effet raffermissant se manifeste en 3-6 mois et les résultats durent 2-3 ans.</p>' },
      de: { title: 'Endolift-Laser', text: '<p>Endolift ist eine minimal-invasive Gesichtsverjüngungsmethode, die auf dem Einführen einer 1470-nm-Laserfaser unter die Haut basiert, um einen thermischen Effekt im subdermalen Fettgewebe zu erzeugen. Dabei werden gleichzeitig Fettauflösung und Hautstraffung im Bereich von Hals, Kinn, Wangen, Stirn und Augenpartie erreicht.</p><p>Endolift wird unter Lokalanästhesie durchgeführt und dauert ca. 30-60 Minuten. Leichte Schwellung und Hämatome klingen in 3-5 Tagen ab. Der Straffungseffekt wird nach 3-6 Monaten sichtbar, die Ergebnisse halten 2-3 Jahre an.</p>' },
    },
  },
  {
    slug: 'ip-aski',
    titleInternal: 'İp ile Yüz Askısı',
    seo: {
      tr: { title: 'İp ile Yüz Askısı Ankara & Antalya | PDO İp Askı', desc: 'PDO ipleri ile cerrahsız yüz ve boyun askılama. Anlık sıkılaşma ve doğal görünüm. Prof. Dr. Gökçe Özel ile Ankara ve Antalya Lara\'da ip askı uygulaması.', kw: 'ip askı Ankara, ip askı Antalya, PDO ip, yüz askılama, cerrahsız yüz germe' },
      en: { title: 'Thread Face Lift Ankara & Antalya | PDO Thread Lift', desc: 'Non-surgical face and neck lift with PDO threads. Immediate tightening and natural appearance. Prof. Dr. Gökçe Özel in Ankara & Antalya Lara.', kw: 'thread lift Ankara, thread lift Antalya, PDO threads, face lift threads' },
      ar: { title: 'شد الوجه بالخيوط أنقرة وأنطاليا | خيوط PDO', desc: 'شد الوجه والرقبة بدون جراحة بخيوط PDO. شد فوري ومظهر طبيعي. البروفيسورة د. غوكتشه أوزيل في أنقرة وأنطاليا لارا.' },
      ru: { title: 'Нитевой лифтинг Анкара & Анталья | Нити PDO', desc: 'Нехирургический лифтинг лица и шеи нитями PDO. Немедленная подтяжка и естественный вид. Проф. д-р Гёкче Озель, Анкара и Анталья Лара.' },
      fr: { title: 'Lifting par fils Ankara & Antalya | Fils PDO', desc: 'Lifting visage et cou non chirurgical avec fils PDO. Raffermissement immédiat et aspect naturel. Prof. Dr. Gökçe Özel, Ankara & Antalya Lara.' },
      de: { title: 'Faden-Lifting Ankara & Antalya | PDO-Fäden', desc: 'Nicht-chirurgisches Gesichts- und Hals-Lifting mit PDO-Fäden. Sofortige Straffung und natürliches Erscheinungsbild. Prof. Dr. Gökçe Özel.' },
    },
    content: {
      tr: { title: 'İp ile Yüz Askısı', text: '<p>İp askısı (PDO ip askı), absorbe olabilen özel dikişlerin cilt altına yerleştirilerek sarkmış dokuları yukarı çekmesi ve yeni kolajen üretimini tetiklemesi prensibine dayanan cerrahsız bir yüz gençleştirme yöntemidir. Yanak, boyun, çene ve alın bölgelerinde etkili olan bu uygulama, genel anestezi gerektirmez.</p><p>İşlem lokal anestezi altında yaklaşık 30-60 dakikada tamamlanır. Hafif şişlik ve morluk 5-7 günde geçer. Etki 12-18 ay sürer. Prof. Dr. Gökçe Özel, Ankara ve Antalya Lara\'da PDO ip askı uygulamasını başarıyla gerçekleştirmektedir.</p>' },
      en: { title: 'Thread Face Lift', text: '<p>Thread lifting (PDO thread lift) is a non-surgical facial rejuvenation method based on inserting absorbable sutures under the skin to lift sagging tissues upward and trigger new collagen production. Effective in the cheeks, neck, jowl and forehead areas, this procedure does not require general anaesthesia.</p><p>The procedure is completed under local anaesthesia in approximately 30-60 minutes. Minor swelling and bruising resolve in 5-7 days. The effect lasts 12-18 months. Prof. Dr. Gökçe Özel performs PDO thread lifts successfully in Ankara and Antalya Lara.</p>' },
      ar: { title: 'شد الوجه بالخيوط', text: '<p>شد الوجه بالخيوط (خيوط PDO) هو طريقة تجديد للوجه بدون جراحة تعتمد على إدخال خيوط قابلة للامتصاص تحت الجلد لشد الأنسجة المترهلة للأعلى وتحفيز إنتاج الكولاجين الجديد. تؤثر في منطقة الخدين والرقبة والذقن والجبهة ولا تتطلب تخديراً عاماً.</p><p>تُنجز العملية تحت التخدير الموضعي في 30-60 دقيقة تقريباً. تتراجع التورمات الطفيفة خلال 5-7 أيام. يدوم التأثير 12-18 شهراً.</p>' },
      ru: { title: 'Нитевой лифтинг лица', text: '<p>Нитевой лифтинг (PDO-нити) — нехирургический метод омоложения лица, основанный на введении рассасывающихся нитей под кожу для подтяжки провисших тканей вверх и стимуляции выработки нового коллагена. Эффективен для щёк, шеи, нижней части лица и лба; не требует общей анестезии.</p><p>Процедура выполняется под местной анестезией за 30-60 минут. Лёгкий отёк и гематомы проходят за 5-7 дней. Эффект сохраняется 12-18 месяцев.</p>' },
      fr: { title: 'Lifting par fils', text: '<p>Le lifting par fils (fils PDO) est une méthode de rajeunissement facial non chirurgicale basée sur l\'insertion de sutures résorbables sous la peau pour soulever les tissus relâchés et stimuler la production de collagène. Efficace pour les joues, le cou, les jowls et le front, sans anesthésie générale.</p><p>La procédure est réalisée sous anesthésie locale en 30-60 minutes. Le léger gonflement et les ecchymoses se résorbent en 5-7 jours. L\'effet dure 12-18 mois.</p>' },
      de: { title: 'Faden-Gesichtslift', text: '<p>Faden-Lifting (PDO-Fäden) ist eine nicht-chirurgische Gesichtsverjüngungsmethode, bei der resorbierbare Fäden unter die Haut eingebracht werden, um erschlafftes Gewebe anzuheben und neue Kollagenproduktion anzuregen. Wirksam in den Bereichen Wangen, Hals, Kinn und Stirn; keine Vollnarkose erforderlich.</p><p>Der Eingriff erfolgt unter Lokalanästhesie in ca. 30-60 Minuten. Leichte Schwellung und Hämatome klingen in 5-7 Tagen ab. Die Wirkung hält 12-18 Monate an.</p>' },
    },
  },
  {
    slug: 'cilt-yenileme',
    titleInternal: 'Cilt Yenileme Tedavileri',
    seo: {
      tr: { title: 'Cilt Yenileme Ankara & Antalya | Lazer, PRP, Mezoterapi', desc: 'Lazer, PRP, mezoterapi ve mikro iğneleme ile kapsamlı cilt yenileme tedavileri. Prof. Dr. Gökçe Özel kliniği Ankara ve Antalya Lara.', kw: 'cilt yenileme Ankara, cilt yenileme Antalya, lazer cilt, PRP cilt, mezoterapi' },
      en: { title: 'Skin Renewal Ankara & Antalya | Laser, PRP, Mesotherapy', desc: 'Comprehensive skin renewal treatments with laser, PRP, mesotherapy and microneedling. Prof. Dr. Gökçe Özel clinic, Ankara & Antalya Lara.', kw: 'skin renewal Ankara, skin renewal Antalya, laser skin, PRP skin, mesotherapy' },
      ar: { title: 'تجديد البشرة أنقرة وأنطاليا | ليزر، PRP، ميزوثيرابي', desc: 'علاجات شاملة لتجديد البشرة بالليزر وPRP والميزوثيرابي والإبر الدقيقة. عيادة البروفيسورة د. غوكتشه أوزيل، أنقرة وأنطاليا لارا.' },
      ru: { title: 'Обновление кожи Анкара & Анталья | Лазер, PRP, Мезотерапия', desc: 'Комплексные процедуры обновления кожи: лазер, PRP, мезотерапия и микроиглинг. Клиника проф. д-р Гёкче Озель, Анкара и Анталья Лара.' },
      fr: { title: 'Renouvellement cutané Ankara & Antalya | Laser, PRP, Mésothérapie', desc: 'Traitements complets de renouvellement cutané au laser, PRP, mésothérapie et microneedling. Clinique Prof. Dr. Gökçe Özel, Ankara & Antalya Lara.' },
      de: { title: 'Hauterneuerung Ankara & Antalya | Laser, PRP, Mesotherapie', desc: 'Umfassende Hauterneuerungsbehandlungen mit Laser, PRP, Mesotherapie und Microneedling. Klinik Prof. Dr. Gökçe Özel, Ankara & Antalya Lara.' },
    },
    content: {
      tr: { title: 'Cilt Yenileme Tedavileri', text: '<p>Cilt yenileme, yaşlanma, güneş hasarı, akne izleri ve kaybedilen canlılığı geri kazandırmak amacıyla uygulanan bir dizi modern dermatolojik ve estetik tedaviyi kapsar. Prof. Dr. Gökçe Özel kliniğinde Ankara ve Antalya Lara\'da sunulan cilt yenileme yöntemleri şunlardır:</p><ul><li><strong>Lazer Cilt Yenileme:</strong> Fraksiyonel lazer ile derin cilt yenileme, pore sıkılaştırma ve cilt düzleştirme.</li><li><strong>PRP (Gençlik Aşısı):</strong> Kişinin kendi kanından elde edilen büyüme faktörleri ile cilt gençleştirme.</li><li><strong>Mezoterapi:</strong> Vitamin ve hiyalüronik asit karışımı ile cilt nemlendirme ve canlandırma.</li><li><strong>Mikro İğneleme:</strong> Kolajen uyarımı ile cilt dokusunu iyileştirme ve akne izi tedavisi.</li><li><strong>Kimyasal Peeling:</strong> Yüzeyel veya orta derin peeling ile cilt yenileme.</li></ul>' },
      en: { title: 'Skin Renewal Treatments', text: '<p>Skin renewal encompasses a range of modern dermatological and aesthetic treatments aimed at reversing ageing, sun damage, acne scars and lost vitality. At Prof. Dr. Gökçe Özel\'s clinic in Ankara and Antalya Lara, the following skin renewal methods are available:</p><ul><li><strong>Laser Skin Renewal:</strong> Deep skin resurfacing with fractional laser, pore tightening and skin smoothing.</li><li><strong>PRP (Youth Vaccine):</strong> Skin rejuvenation using growth factors derived from your own blood.</li><li><strong>Mesotherapy:</strong> Skin hydration and revitalisation with vitamin and hyaluronic acid cocktails.</li><li><strong>Microneedling:</strong> Collagen stimulation to improve skin texture and treat acne scars.</li><li><strong>Chemical Peeling:</strong> Superficial or medium-depth peeling for skin renewal.</li></ul>' },
      ar: { title: 'علاجات تجديد البشرة', text: '<p>يشمل تجديد البشرة مجموعة من العلاجات الجلدية والجمالية الحديثة التي تهدف إلى عكس الشيخوخة وأضرار الشمس وآثار حب الشباب وفقدان الحيوية. في عيادة البروفيسورة د. غوكتشه أوزيل في أنقرة وأنطاليا لارا، تتوفر طرق تجديد البشرة التالية:</p><ul><li><strong>تجديد البشرة بالليزر:</strong> تجديد عميق للبشرة بالليزر الكسوري وتقليص المسام وتنعيم البشرة.</li><li><strong>PRP (حقنة الشباب):</strong> تجديد البشرة باستخدام عوامل النمو المستخلصة من دم المريض نفسه.</li><li><strong>الميزوثيرابي:</strong> ترطيب وتنشيط البشرة بكوكتيل الفيتامينات وحمض الهيالورونيك.</li><li><strong>الإبر الدقيقة:</strong> تحفيز الكولاجين لتحسين نسيج البشرة وعلاج آثار حب الشباب.</li><li><strong>التقشير الكيميائي:</strong> تجديد البشرة بالتقشير السطحي أو المتوسط العمق.</li></ul>' },
      ru: { title: 'Процедуры обновления кожи', text: '<p>Обновление кожи охватывает ряд современных дерматологических и эстетических процедур, направленных на устранение возрастных изменений, повреждений от солнца, следов акне и потери жизненных сил. В клинике проф. д-р Гёкче Озель в Анкаре и Анталье Лара доступны следующие методы:</p><ul><li><strong>Лазерное обновление кожи:</strong> Глубокий ресурфейсинг фракционным лазером, сужение пор, выравнивание кожи.</li><li><strong>PRP (уколы молодости):</strong> Омоложение кожи с помощью факторов роста из собственной крови пациента.</li><li><strong>Мезотерапия:</strong> Увлажнение и ревитализация кожи коктейлями витаминов и гиалуроновой кислоты.</li><li><strong>Микроиглинг:</strong> Стимуляция коллагена для улучшения текстуры кожи и лечения постакне.</li><li><strong>Химический пилинг:</strong> Поверхностный или средний пилинг для обновления кожи.</li></ul>' },
      fr: { title: 'Traitements de renouvellement cutané', text: '<p>Le renouvellement cutané englobe une série de traitements dermatologiques et esthétiques modernes visant à inverser le vieillissement, les dommages solaires, les cicatrices d\'acné et la perte de vitalité. À la clinique de la Prof. Dr. Gökçe Özel à Ankara et Antalya Lara, les méthodes suivantes sont disponibles :</p><ul><li><strong>Renouvellement cutané au laser :</strong> Resurfaçage profond au laser fractionné, resserrement des pores et lissage cutané.</li><li><strong>PRP (vaccin jeunesse) :</strong> Rajeunissement cutané par facteurs de croissance issus du propre sang du patient.</li><li><strong>Mésothérapie :</strong> Hydratation et revitalisation par cocktails de vitamines et d\'acide hyaluronique.</li><li><strong>Microneedling :</strong> Stimulation du collagène pour améliorer la texture cutanée et traiter les cicatrices d\'acné.</li><li><strong>Peeling chimique :</strong> Renouvellement cutané par peeling superficiel ou moyen.</li></ul>' },
      de: { title: 'Hauterneuerungsbehandlungen', text: '<p>Hauterneuerung umfasst eine Reihe moderner dermatologischer und ästhetischer Behandlungen zur Bekämpfung von Alterung, Sonnenschäden, Akne-Narben und Vitalitätsverlust. In der Klinik von Prof. Dr. Gökçe Özel in Ankara und Antalya Lara sind folgende Methoden verfügbar:</p><ul><li><strong>Laser-Hauterneuerung:</strong> Tiefes Resurfacing mit fraktioniertem Laser, Porenstraffung und Hautglättung.</li><li><strong>PRP (Jugend-Impfung):</strong> Hautverjüngung mit Wachstumsfaktoren aus dem eigenen Blut.</li><li><strong>Mesotherapie:</strong> Hauthydration und Revitalisierung mit Vitamin- und Hyaluronsäure-Cocktails.</li><li><strong>Microneedling:</strong> Kollagenstimulation zur Verbesserung der Hauttextur und Behandlung von Akne-Narben.</li><li><strong>Chemisches Peeling:</strong> Oberflächliches oder mittleres Peeling zur Hauterneuerung.</li></ul>' },
    },
  },
];

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────

async function main() {
  const locales = ['tr','en','ar','ru','fr','de'];
  let total = { seoAdded: 0, translationsAdded: 0, pagesCreated: 0 };

  // ── STEP 1: Add missing AR/RU/FR/DE content translations ──
  console.log('\n=== STEP 1: Adding missing content translations ===');
  for (const [slug, translations] of Object.entries(TRANSLATION_DATA)) {
    const page = await prisma.page.findFirst({
      where: { slug },
      include: { blocks: { include: { translations: true } } }
    });
    if (!page) { console.log('  SKIP (not found):', slug); continue; }

    for (const block of page.blocks) {
      if (block.componentType !== 'legacy_content') continue;
      const existingLocales = block.translations.map(t => t.locale);
      // Get TR translation as base for seo_title/seo_description
      const trTr = block.translations.find(t => t.locale === 'tr');
      const trData = trTr ? JSON.parse(trTr.contentData) : {};

      for (const [locale, data] of Object.entries(translations)) {
        if (existingLocales.includes(locale)) continue;
        await prisma.translation.create({
          data: {
            blockId: block.id,
            locale,
            contentData: JSON.stringify({
              slug,
              title: data.title,
              content: data.content,
              seo_title: trData.seo_title || '',
              seo_description: trData.seo_description || '',
            }),
          }
        });
        total.translationsAdded++;
        console.log(`  + Translation [${locale}] for ${slug}`);
      }
    }
  }

  // ── STEP 2: Add missing SEO meta for existing pages ──
  console.log('\n=== STEP 2: Adding missing SEO meta for existing pages ===');
  for (const entry of SEO_META_ADDITIONS) {
    const page = await prisma.page.findFirst({ where: { slug: entry.slug }, include: { seoMeta: true } });
    if (!page) { console.log('  SKIP (not found):', entry.slug); continue; }

    const existingLocales = page.seoMeta.map(s => s.locale);
    for (const locale of ['en','ar','ru','fr','de']) {
      if (existingLocales.includes(locale)) continue;
      const d = entry[locale];
      if (!d) continue;
      await prisma.seoMeta.create({
        data: {
          pageId: page.id,
          locale,
          metaTitle: d.title,
          metaDescription: d.desc,
          robots: 'index,follow',
        }
      });
      total.seoAdded++;
      console.log(`  + SEO [${locale}] for ${entry.slug}`);
    }
  }

  // ── STEP 3: Create new pages from scratch ──
  console.log('\n=== STEP 3: Creating new service pages ===');
  for (const pageData of NEW_PAGES) {
    const existing = await prisma.page.findFirst({ where: { slug: pageData.slug } });
    if (existing) {
      // Update SEO meta if missing
      const existingSeo = await prisma.seoMeta.findMany({ where: { pageId: existing.id } });
      const existingLocales = existingSeo.map(s => s.locale);
      for (const locale of locales) {
        if (existingLocales.includes(locale)) continue;
        const seo = pageData.seo[locale];
        if (!seo) continue;
        await prisma.seoMeta.create({
          data: {
            pageId: existing.id,
            locale,
            metaTitle: seo.title,
            metaDescription: seo.desc,
            keywords: seo.kw || null,
            robots: 'index,follow',
          }
        });
        total.seoAdded++;
        console.log(`  + SEO [${locale}] for existing ${pageData.slug}`);
      }
      console.log(`  EXISTS: ${pageData.slug}`);
      continue;
    }

    const page = await prisma.page.create({
      data: {
        slug: pageData.slug,
        titleInternal: pageData.titleInternal,
        type: 'SERVICE',
      }
    });

    const block = await prisma.contentBlock.create({
      data: {
        pageId: page.id,
        componentType: 'legacy_content',
        sortOrder: 0,
        isActive: true,
      }
    });

    for (const locale of locales) {
      const c = pageData.content[locale];
      if (!c) continue;
      await prisma.translation.create({
        data: {
          blockId: block.id,
          locale,
          contentData: JSON.stringify({
            slug: pageData.slug,
            title: c.title,
            content: c.text,
            seo_title: pageData.seo[locale]?.title || '',
            seo_description: pageData.seo[locale]?.desc || '',
          }),
        }
      });
    }

    for (const locale of locales) {
      const seo = pageData.seo[locale];
      if (!seo) continue;
      await prisma.seoMeta.create({
        data: {
          pageId: page.id,
          locale,
          metaTitle: seo.title,
          metaDescription: seo.desc,
          keywords: seo.kw || null,
          robots: 'index,follow',
        }
      });
    }

    total.pagesCreated++;
    console.log(`  ✅ Created: ${pageData.slug}`);
  }

  console.log('\n=== DONE ===');
  console.log(`SEO meta added: ${total.seoAdded}`);
  console.log(`Translations added: ${total.translationsAdded}`);
  console.log(`New pages created: ${total.pagesCreated}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
