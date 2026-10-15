import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Locale = 'tr' | 'en' | 'ar' | 'ru' | 'fr' | 'de';
const LOCALES: Locale[] = ['tr', 'en', 'ar', 'ru', 'fr', 'de'];

interface ServiceData {
  slug: string;
  titles: Record<Locale, string>;
  descriptions: Record<Locale, string>;
  shortAnswers?: Record<Locale, string>;
  content: string; // HTML in Turkish — used as rich text block for TR
  contentLocales?: Partial<Record<Locale, string>>;
}

const SERVICES: ServiceData[] = [
  {
    slug: 'rinoplasti',
    titles: {
      tr: 'Rinoplasti (Burun Estetiği)',
      en: 'Rhinoplasty (Nose Job)',
      ar: 'رينوبلاستي (تجميل الأنف)',
      ru: 'Ринопластика (Коррекция носа)',
      fr: 'Rhinoplastie (Esthétique du nez)',
      de: 'Rhinoplastik (Nasenkorrektur)',
    },
    descriptions: {
      tr: 'Ankara\'da Prof. Dr. Gökçe Özel tarafından gerçekleştirilen rinoplasti — burun estetiği ve fonksiyonel burun cerrahisi. Doğal sonuçlar, güvenli teknikler.',
      en: 'Rhinoplasty by Prof. Dr. Gökçe Özel in Ankara — cosmetic and functional nose surgery with natural-looking results.',
      ar: 'رينوبلاستي بقلم أ.د. غوكتشه أوزيل في أنقرة — جراحة تجميل وتشغيل الأنف بنتائج طبيعية.',
      ru: 'Ринопластика от Проф. д-р Гёкче Озель в Анкаре — эстетическая и функциональная коррекция носа.',
      fr: 'Rhinoplastie par Prof. Dr. Gökçe Özel à Ankara — chirurgie esthétique et fonctionnelle du nez.',
      de: 'Rhinoplastik von Prof. Dr. Gökçe Özel in Ankara — ästhetische und funktionelle Nasenkorrektur.',
    },
    shortAnswers: {
      tr: 'Rinoplasti, burunun şeklini ve oranlarını iyileştiren cerrahi bir işlemdir. Prof. Dr. Gökçe Özel, Ankara\'da hem estetik hem fonksiyonel rinoplasti uygulamaktadır.',
      en: 'Rhinoplasty is a surgical procedure to improve the shape and proportions of the nose, performed by Prof. Dr. Gökçe Özel in Ankara.',
      ar: 'رينوبلاستي عملية جراحية لتحسين شكل الأنف وتناسبه.',
      ru: 'Ринопластика — хирургическая операция по коррекции формы и пропорций носа.',
      fr: 'La rhinoplastie est une intervention chirurgicale pour améliorer la forme et les proportions du nez.',
      de: 'Rhinoplastik ist ein chirurgischer Eingriff zur Verbesserung von Form und Proportionen der Nase.',
    },
    content: `<h2>Rinoplasti Nedir?</h2>
<p>Rinoplasti (burun estetiği), burnun şeklini, boyutunu ve oranlarını düzelten cerrahi bir işlemdir. Hem estetik kaygılarla hem de fonksiyonel sorunların giderilmesi amacıyla uygulanabilir. Prof. Dr. Gökçe Özel, Ankara'da kapalı ve açık teknik rinoplasti konusunda yüksek deneyime sahip bir KBB uzmanıdır.</p>
<h2>Rinoplasti Kimlere Uygulanır?</h2>
<ul>
<li>Burun kemiği veya kıkırdak yapısından memnun olmayanlar</li>
<li>Burun ucu şeklini değiştirmek isteyenler</li>
<li>Nefes alma güçlüğü yaşayanlar (fonksiyonel rinoplasti)</li>
<li>Travma sonrası burun şekli bozulanlar</li>
<li>Revizyon rinoplasti ihtiyacı duyanlar</li>
</ul>
<h2>Ameliyat Nasıl Yapılır?</h2>
<p>İşlem genel anestezi altında gerçekleştirilir. Kapalı teknikte tüm kesiler burun içinden yapılırken, açık teknikte kolumella bölgesinde küçük bir ek kesi uygulanır. Ameliyat süresi ortalama 2-3 saattir.</p>
<h2>İyileşme Süreci</h2>
<p>Ameliyat sonrası 7-10 gün alçı veya splint kullanılır. İlk hafta ödem ve morluk görülmesi normaldir. Sosyal hayata 10-14 gün sonra dönülebilir. Nihai sonuç 12 ay içinde netleşir.</p>
<h2>Neden Prof. Dr. Gökçe Özel?</h2>
<p>Prof. Dr. Gökçe Özel, 100'den fazla uluslararası yayını ve H-index 12 akademik çalışmalarıyla Türkiye'nin önde gelen rinoplasti uzmanları arasındadır. Ankara Ümitköy kliniğinde kişiye özel cerrahi planlamalar uygulamaktadır.</p>`,
  },
  {
    slug: 'revizyon-rinoplasti',
    titles: {
      tr: 'Revizyon Rinoplasti',
      en: 'Revision Rhinoplasty',
      ar: 'رينوبلاستي تصحيحية',
      ru: 'Ревизионная ринопластика',
      fr: 'Rhinoplastie de révision',
      de: 'Revisionsrhinoplastik',
    },
    descriptions: {
      tr: 'Ankara\'da revizyon rinoplasti — önceki burun ameliyatı sonuçlarından memnun kalmayanlar için yeniden düzeltme cerrahisi.',
      en: 'Revision rhinoplasty in Ankara — corrective nose surgery for unsatisfactory results from a previous procedure.',
      ar: 'رينوبلاستي تصحيحية في أنقرة — جراحة تصحيح الأنف بعد عملية سابقة.',
      ru: 'Ревизионная ринопластика в Анкаре — коррекция неудовлетворительных результатов предыдущей операции на носу.',
      fr: 'Rhinoplastie de révision à Ankara — chirurgie corrective pour résultats insatisfaisants.',
      de: 'Revisionsrhinoplastik in Ankara — Korrektur nach unzufriedenstellenden Voroperationen.',
    },
    content: `<h2>Revizyon Rinoplasti Nedir?</h2>
<p>Revizyon rinoplasti, daha önce geçirilmiş burun ameliyatı sonucunda elde edilen sonuçtan memnun kalınmayan ya da fonksiyonel sorunlar yaşanan hastalara uygulanan ikincil cerrahi işlemdir. Birincil rinoplastiye kıyasla daha karmaşık bir prosedürdür.</p>
<h2>Ne Zaman Gereklidir?</h2>
<ul>
<li>Önceki ameliyat sonrası estetik sonuçtan memnuniyetsizlik</li>
<li>Kıkırdak dokusunda eğrilik veya asimetri</li>
<li>Skar dokusu nedeniyle oluşan deformiteler</li>
<li>Nefes alma zorluğunun devam etmesi</li>
<li>Aşırı burun ucu düşüklüğü veya yüksekliği</li>
</ul>
<h2>İşlem Detayları</h2>
<p>Revizyon ameliyatı genellikle ilk ameliyattan en az 12 ay sonra planlanır; bu süre zarfında doku iyileşmesinin tamamlanması beklenir. Kıkırdak greft ihtiyacı durumunda kulak veya kaburga kıkırdağından destek alınabilir.</p>
<h2>Uzman Deneyimi</h2>
<p>Prof. Dr. Gökçe Özel, revizyon rinoplasti konusunda özel eğitim almış, ulusal ve uluslararası vakaları olan bir cerrahtır. Türkiye içinden ve yurt dışından gelen hastalar revizyon cerrahisi için kliniğe başvurmaktadır.</p>`,
  },
  {
    slug: 'septorinoplasti',
    titles: {
      tr: 'Septorinoplasti',
      en: 'Septorhinoplasty',
      ar: 'تعديل الحاجز الأنفي مع تجميل الأنف',
      ru: 'Септоринопластика',
      fr: 'Septorhinoplastie',
      de: 'Septorhinoplastik',
    },
    descriptions: {
      tr: 'Septorinoplasti — septum eğriliğini düzelten ve aynı zamanda burun estetiğini iyileştiren kombine cerrahi. Ankara\'da Prof. Dr. Gökçe Özel.',
      en: 'Septorhinoplasty combines septum correction with cosmetic nose reshaping — Prof. Dr. Gökçe Özel, Ankara.',
      ar: 'تعديل الحاجز الأنفي مع تجميل الأنف — دمج إصلاح الحاجز مع تحسين المظهر.',
      ru: 'Септоринопластика — сочетание коррекции перегородки носа с эстетической ринопластикой.',
      fr: 'Septorhinoplastie — combinaison de la correction du septum et de la rhinoplastie esthétique.',
      de: 'Septorhinoplastik — Kombination von Septumkorrektur und ästhetischer Nasenkorrektur.',
    },
    content: `<h2>Septorinoplasti Nedir?</h2>
<p>Septorinoplasti, septum eğriliğinin (burun bölmesinin eğriliğinin) giderilmesiyle burunun estetik görünümünün aynı anda düzeltildiği kombine cerrahi işlemdir. Tek seansta hem fonksiyonel hem estetik sonuç elde edilir.</p>
<h2>Septum Eğriliği Belirtileri</h2>
<ul>
<li>Tek ya da her iki burun deliğinden nefes almada güçlük</li>
<li>Sık tekrarlayan sinüzit atakları</li>
<li>Horlama ve uyku apnesi</li>
<li>Kronik burun akıntısı</li>
<li>Baş ağrısı ve yüz ağrısı</li>
</ul>
<h2>Ameliyat Süreci</h2>
<p>Genel anestezi altında yaklaşık 2-3 saat sürer. Septum eğriliği giderildikten sonra estetik düzeltmeler (burun küçültme, kaldırma, uç şekillendirme) aynı seansta yapılır. Hastane yatışı genellikle 1 gece önerilir.</p>`,
  },
  {
    slug: 'sinuzit-ameliyati',
    titles: {
      tr: 'Sinüzit Ameliyatı (FESS)',
      en: 'Sinusitis Surgery (FESS)',
      ar: 'جراحة التهاب الجيوب الأنفية (FESS)',
      ru: 'Операция при синусите (FESS)',
      fr: 'Chirurgie des sinus (FESS)',
      de: 'Sinusitis-Operation (FESS)',
    },
    descriptions: {
      tr: 'Endoskopik sinüs cerrahisi (FESS) — kronik sinüzit tedavisinde Ankara\'da Prof. Dr. Gökçe Özel tarafından uygulanan minimal invaziv cerrahi.',
      en: 'Functional Endoscopic Sinus Surgery (FESS) for chronic sinusitis — minimally invasive procedure by Prof. Dr. Gökçe Özel, Ankara.',
      ar: 'جراحة الجيوب الأنفية بالمنظار (FESS) — علاج التهاب الجيوب الأنفية المزمن بأقل تدخل جراحي.',
      ru: 'Функциональная эндоскопическая хирургия носовых пазух (FESS) при хроническом синусите.',
      fr: 'Chirurgie endoscopique fonctionnelle des sinus (FESS) pour sinusite chronique.',
      de: 'Funktionelle endoskopische Sinuschirurgie (FESS) bei chronischer Sinusitis.',
    },
    content: `<h2>Sinüzit Ameliyatı Nedir?</h2>
<p>FESS (Fonksiyonel Endoskopik Sinüs Cerrahisi), kronik sinüzit, nazal polip ve sinüs tıkanıklıklarının tedavisinde kullanılan minimal invaziv bir yöntemdir. Endoskop yardımıyla burun içinden yapılan bu işlemde dış kesi gerekmez.</p>
<h2>Kimlere Uygulanır?</h2>
<ul>
<li>İlaç tedavisine yanıt vermeyen kronik sinüzit hastaları</li>
<li>Nazal polip (burun eti) sorunu olanlar</li>
<li>Tekrarlayan sinüs enfeksiyonları yaşayanlar</li>
<li>Sinüs kistleri veya mukoseli bulunanlar</li>
</ul>
<h2>Ameliyat Sonrası</h2>
<p>İşlem genellikle genel anestezi altında 1-2 saat sürer. Hastanede 1 gece kalınır. İlk 2 haftada burun temizliği ve tuzlu su yıkamaları önemlidir. Tam iyileşme 4-6 haftada tamamlanır.</p>`,
  },
  {
    slug: 'botoks',
    titles: {
      tr: 'Botoks Uygulaması',
      en: 'Botox Treatment',
      ar: 'حقن البوتوكس',
      ru: 'Инъекции ботокса',
      fr: 'Injections de Botox',
      de: 'Botox-Behandlung',
    },
    descriptions: {
      tr: 'Yüz kırışıklıklarını gideren botoks uygulaması — Ankara\'da Prof. Dr. Gökçe Özel kliniğinde güvenli ve doğal sonuçlar.',
      en: 'Botox injections for facial wrinkles and fine lines — natural results at Prof. Dr. Gökçe Özel clinic, Ankara.',
      ar: 'حقن البوتوكس لعلاج التجاعيد — نتائج طبيعية في عيادة أ.د. غوكتشه أوزيل بأنقرة.',
      ru: 'Инъекции ботокса от морщин — естественные результаты в клинике Проф. д-р Гёкче Озель в Анкаре.',
      fr: 'Injections de Botox contre les rides — résultats naturels à la clinique du Prof. Dr. Gökçe Özel, Ankara.',
      de: 'Botox-Injektionen gegen Falten — natürliche Ergebnisse in der Klinik von Prof. Dr. Gökçe Özel, Ankara.',
    },
    shortAnswers: {
      tr: 'Botoks, yüz kaslarını geçici olarak gevşeterek mimik kırışıklıklarını gideren bir işlemdir. Etki süresi 4-6 ay olup işlem 15-30 dakika sürer.',
      en: 'Botox temporarily relaxes facial muscles to reduce expression lines. Effects last 4-6 months; the procedure takes 15-30 minutes.',
      ar: 'البوتوكس يرخي عضلات الوجه مؤقتاً للحد من التجاعيد. يستمر التأثير 4-6 أشهر.',
      ru: 'Ботокс временно расслабляет мышцы лица, уменьшая мимические морщины. Эффект длится 4-6 месяцев.',
      fr: 'Le Botox détend temporairement les muscles du visage pour réduire les rides. L\'effet dure 4-6 mois.',
      de: 'Botox entspannt vorübergehend die Gesichtsmuskeln und reduziert Mimikfalten. Der Effekt hält 4-6 Monate an.',
    },
    content: `<h2>Botoks Nedir?</h2>
<p>Botoks (botulinum toksin tip A), yüz kaslarını geçici olarak gevşeterek alın, kaş arası ve göz çevresi gibi bölgelerdeki mimik kırışıklıklarını gideren FDA onaylı bir uygulamadır. Klinik ortamda, ince iğnelerle birkaç noktaya uygulanır.</p>
<h2>Hangi Bölgelere Uygulanır?</h2>
<ul>
<li>Alın çizgileri</li>
<li>Kaş arası dikey çizgiler (glabella)</li>
<li>Göz kenarı "kaz ayağı" kırışıkları</li>
<li>Burun sırtı çizgileri</li>
<li>Boyun bantları (Nefertiti kaldırma)</li>
<li>Diş gıcırdatma (bruksizm) tedavisi</li>
</ul>
<h2>İşlem Süresi ve Etki</h2>
<p>İşlem 15-30 dakika sürer, anestezi gerektirmez. Etki 3-5 gün içinde başlar, 2 haftada tam etki görülür. Etki süresi 4-6 ay olan uygulama, düzenli tekrarlandığında daha uzun süreli sonuçlar verir.</p>
<h2>Güvenlik ve Yan Etkiler</h2>
<p>Doğru doz ve teknikle uygulandığında son derece güvenlidir. Geçici morluk veya hafif kızarıklık görülebilir. İşlem sonrası günlük yaşama hemen dönülebilir.</p>`,
  },
  {
    slug: 'botulinum-toksin-uygulamasi',
    titles: {
      tr: 'Botulinum Toksin Uygulaması',
      en: 'Botulinum Toxin Treatment',
      ar: 'علاج بالتوكسين البوتوليني',
      ru: 'Лечение ботулиническим токсином',
      fr: 'Traitement à la toxine botulique',
      de: 'Botulinumtoxin-Behandlung',
    },
    descriptions: {
      tr: 'Botulinum toksin uygulaması — mimik kırışıklıkları, bruksizm ve hiperhidrozis tedavisinde Ankara kliniğimizde profesyonel uygulama.',
      en: 'Botulinum toxin treatment for expression lines, bruxism and hyperhidrosis — professional application in Ankara.',
      ar: 'علاج بالتوكسين البوتوليني — تجاعيد الوجه وصرير الأسنان وفرط التعرق.',
      ru: 'Лечение ботулиническим токсином мимических морщин, бруксизма и гипергидроза.',
      fr: 'Traitement à la toxine botulique pour rides, bruxisme et hyperhidrose.',
      de: 'Botulinumtoxin-Behandlung bei Mimikfalten, Bruxismus und Hyperhidrose.',
    },
    content: `<h2>Botulinum Toksin Nedir?</h2>
<p>Botulinum toksin, kas aktivitesini geçici olarak azaltan nörotoksik bir proteindir. Tıp ve estetik alanında geniş kullanım yelpazesine sahip, FDA ve CE onaylı bir tedavi ajanıdır.</p>
<h2>Kullanım Alanları</h2>
<ul>
<li><strong>Estetik:</strong> Alın, kaş arası, göz çevresi kırışıklıkları</li>
<li><strong>Bruksizm:</strong> Diş gıcırdatma ve çene sıkma tedavisi</li>
<li><strong>Hiperhidrozis:</strong> Aşırı terleme — koltuk altı, el ve ayaklar</li>
<li><strong>Migren:</strong> Kronik migren profilaksisi</li>
<li><strong>Maseter küçültme:</strong> Yüz incelme uygulamaları</li>
</ul>
<h2>Uygulama ve Takip</h2>
<p>İnce iğnelerle hedef kaslara enjekte edilir. İşlem 10-30 dakika sürer. 3-5 gün içinde etki başlar, 4-6 ay devam eder. Tekrar dozları ile etki süresi uzayabilir.</p>`,
  },
  {
    slug: 'dolgu-i-slemleri',
    titles: {
      tr: 'Dolgu İşlemleri (Hyaluronik Asit)',
      en: 'Dermal Fillers (Hyaluronic Acid)',
      ar: 'حقن الفيلر (حمض الهيالورونيك)',
      ru: 'Контурная пластика (гиалуроновая кислота)',
      fr: 'Injections de filler (acide hyaluronique)',
      de: 'Filler-Behandlungen (Hyaluronsäure)',
    },
    descriptions: {
      tr: 'Hyaluronik asit dolgu uygulamaları — dudak, yanak, elmacık kemiği ve nasolabial kıvrım dolgusu Ankara kliniğimizde.',
      en: 'Hyaluronic acid dermal fillers — lips, cheeks, cheekbones and nasolabial fold treatments in Ankara.',
      ar: 'حقن الفيلر بحمض الهيالورونيك — الشفاه والخدين وطيات الأنف في أنقرة.',
      ru: 'Инъекции гиалуроновой кислоты — губы, щёки, скулы и носогубные складки в Анкаре.',
      fr: 'Injections d\'acide hyaluronique — lèvres, joues, pommettes et sillons nasogéniens à Ankara.',
      de: 'Hyaluronsäure-Filler — Lippen, Wangen, Wangenknochen und Nasolabialfalten in Ankara.',
    },
    content: `<h2>Dolgu İşlemleri Nedir?</h2>
<p>Dermal dolgu uygulamaları, cilt altına enjekte edilen hyaluronik asit bazlı jeller aracılığıyla yüz hatlarını belirginleştiren, hacim kaybını gideren ve kırışıklıkları yumuşatan estetik işlemlerdir.</p>
<h2>Uygulama Bölgeleri</h2>
<ul>
<li><strong>Dudak dolgusu:</strong> Dudak hacmi ve şekli</li>
<li><strong>Yanak ve elmacık kemiği:</strong> Yüz üst bölge volümü</li>
<li><strong>Nasolabial kıvrım:</strong> Gülme çizgileri yumuşatma</li>
<li><strong>Göz altı (tear trough):</strong> Koyu halka ve çöküklük</li>
<li><strong>Çene ucu:</strong> Yüz oranı düzeltme</li>
<li><strong>Şakak bölgesi:</strong> Volüm yenileme</li>
</ul>
<h2>Etki Süresi</h2>
<p>Kullanılan ürün ve bölgeye göre 9-18 ay etkili olur. Dudak dolgusunda 6-12 ay, yanak ve elmacık bölgelerinde 12-18 ay etki beklenir. İşlem tercihe göre tekrarlanabilir veya hyaluronidaz enzimi ile çözülebilir.</p>`,
  },
  {
    slug: 'dudak-dolgusu',
    titles: {
      tr: 'Dudak Dolgusu',
      en: 'Lip Filler',
      ar: 'حقن الشفاه',
      ru: 'Увеличение губ (филлер)',
      fr: 'Injection lèvres (filler)',
      de: 'Lippenaufspritzung (Filler)',
    },
    descriptions: {
      tr: 'Dudak dolgusu — hyaluronik asit ile dudak hacmi ve şekil düzeltmesi. Ankara\'da doğal görünümlü dudak estetiği.',
      en: 'Lip filler with hyaluronic acid for volume and shape — natural-looking lip enhancement in Ankara.',
      ar: 'حقن الشفاه بحمض الهيالورونيك — تكبير وتشكيل الشفاه بمظهر طبيعي في أنقرة.',
      ru: 'Наполнитель для губ с гиалуроновой кислотой — увеличение и коррекция формы губ.',
      fr: 'Filler lèvres à l\'acide hyaluronique — volume et forme naturels des lèvres à Ankara.',
      de: 'Lippenfiller mit Hyaluronsäure — natürliches Lippenvolumen und Formkorrektur in Ankara.',
    },
    content: `<h2>Dudak Dolgusu Nedir?</h2>
<p>Dudak dolgusu, hyaluronik asit bazlı dolgu maddelerinin dudaklara enjekte edilerek hacim, şekil ve simetri sağlanmasıdır. Prosedür ofis ortamında, lokal anestezi krem ile 20-30 dakikada tamamlanır.</p>
<h2>Ne Sağlar?</h2>
<ul>
<li>Dudak hacmini artırma</li>
<li>Dudak sınırını belirginleştirme (lip liner etkisi)</li>
<li>Düşük köşeleri kaldırma</li>
<li>Üst dudak çöküklüğünü giderme</li>
<li>Asimetri düzeltme</li>
</ul>
<h2>İşlem Sonrası</h2>
<p>İlk 24-48 saatte hafif şişlik ve hassasiyet normaldir. Tam oturma 1-2 haftada gerçekleşir. Etki 6-12 ay sürer. İstenirse hyaluronidaz enzimi ile geri döndürülebilir.</p>`,
  },
  {
    slug: 'dudak-estetigi-liplift',
    titles: {
      tr: 'Dudak Estetiği — Lip Lift',
      en: 'Lip Lift Surgery',
      ar: 'رفع الشفاه (Lip Lift)',
      ru: 'Лифтинг губ (Lip Lift)',
      fr: 'Lip Lift (Remontée des lèvres)',
      de: 'Lip Lift (Lippenlifting)',
    },
    descriptions: {
      tr: 'Lip lift cerrahisi — üst dudağı kısaltan ve dolgunlaştıran kalıcı cerrahi yöntem. Ankara\'da Prof. Dr. Gökçe Özel.',
      en: 'Lip lift surgery shortens the philtrum and enhances upper lip fullness — permanent results by Prof. Dr. Gökçe Özel, Ankara.',
      ar: 'جراحة رفع الشفاه — تقصير الشفة العليا وتحسين امتلائها بشكل دائم.',
      ru: 'Хирургический лифтинг губ — укорочение филтрума и увеличение верхней губы.',
      fr: 'Lip lift chirurgical — raccourcissement du philtrum et amélioration du volume labial supérieur.',
      de: 'Lip Lift Chirurgie — Verkürzung des Philtrum und dauerhaftes Lippenvolumen.',
    },
    content: `<h2>Lip Lift Nedir?</h2>
<p>Lip lift (dudak kaldırma), burun tabanı ile üst dudak arasındaki mesafeyi (philtrum) kısaltan ve üst dudağın daha dolgun ve belirgin görünmesini sağlayan küçük bir cerrahi işlemdir. Dolgu enjeksiyonlarından farklı olarak kalıcı sonuç verir.</p>
<h2>Kimler İçin Uygundur?</h2>
<ul>
<li>Philtrum (burun-dudak arası) mesafesi uzun olanlar</li>
<li>Üst dişlerin gülümsemede yeterince görünmediğini düşünenler</li>
<li>Yaşlanmayla birlikte incelen üst dudaktan şikayetçi olanlar</li>
<li>Dolgu ile kalıcı sonuç arayanlar</li>
</ul>
<h2>Ameliyat Detayları</h2>
<p>Lokal anestezi ile burun tabanına yakın ince bir kesi yapılır, küçük bir deri parçası çıkarılır ve dudak yukarı kaldırılır. İşlem 30-45 dakika sürer. Dikişler 5-7 günde alınır, izi burun altında gizlenir.</p>`,
  },
  {
    slug: 'goz-kapagi-estetigi',
    titles: {
      tr: 'Göz Kapağı Estetiği (Blefaroplasti)',
      en: 'Eyelid Surgery (Blepharoplasty)',
      ar: 'جراحة الجفن (بليفاروبلاستي)',
      ru: 'Блефаропластика (коррекция век)',
      fr: 'Blépharoplastie (chirurgie des paupières)',
      de: 'Blepharoplastik (Lidkorrektur)',
    },
    descriptions: {
      tr: 'Göz kapağı estetiği (blefaroplasti) — sarkık üst kapak ve torbalı alt kapak cerrahisi. Ankara\'da gençleştirici göz çevresi operasyonu.',
      en: 'Blepharoplasty for sagging upper eyelids and under-eye bags — rejuvenating eye surgery in Ankara.',
      ar: 'بليفاروبلاستي لترهل الجفن العلوي وانتفاخ الجفن السفلي — جراحة تجديد العيون في أنقرة.',
      ru: 'Блефаропластика при опущении верхних век и мешках под глазами — омолаживающая операция на веках.',
      fr: 'Blépharoplastie pour paupières tombantes et poches sous les yeux — chirurgie de rajeunissement oculaire.',
      de: 'Blepharoplastik bei hängenden Oberlidern und Tränensäcken — verjüngende Augenlidoperation.',
    },
    content: `<h2>Blefaroplasti Nedir?</h2>
<p>Blefaroplasti (göz kapağı estetiği), üst göz kapaklarındaki sarkmayı ve alt göz kapağındaki torbalaşmayı düzelten cerrahi işlemdir. Yorgun ve yaşlı görüntüyü gidererek göz bölgesini gençleştirir.</p>
<h2>Üst ve Alt Blefaroplasti</h2>
<ul>
<li><strong>Üst blefaroplasti:</strong> Sarkık üst kapak derisinin çıkarılması; görüş alanını iyileştirebilir</li>
<li><strong>Alt blefaroplasti:</strong> Göz altı torbaları ve yağ dokusunun düzeltilmesi</li>
<li><strong>Kombine:</strong> Her iki işlemin aynı seansta yapılması</li>
</ul>
<h2>İyileşme Süreci</h2>
<p>Cerrahiden sonra 1-2 hafta şişlik ve morluk görülür. Dikişler 5-7 günde alınır. Gözlük kullanılarak izler büyük ölçüde gizlenebilir. İzler 6-12 ayda soluklaşır.</p>`,
  },
  {
    slug: 'alt-blefaroplasti',
    titles: {
      tr: 'Alt Blefaroplasti (Alt Göz Kapağı)',
      en: 'Lower Blepharoplasty (Lower Eyelid)',
      ar: 'بليفاروبلاستي السفلية (الجفن السفلي)',
      ru: 'Нижняя блефаропластика',
      fr: 'Blépharoplastie inférieure (paupière inférieure)',
      de: 'Untere Blepharoplastik (Unterlid)',
    },
    descriptions: {
      tr: 'Alt blefaroplasti — göz altı torbaları, şişlik ve kahverengi halkalar için cerrahi tedavi. Ankara\'da Prof. Dr. Gökçe Özel.',
      en: 'Lower blepharoplasty for under-eye bags, puffiness and dark circles — surgical correction by Prof. Dr. Gökçe Özel, Ankara.',
      ar: 'بليفاروبلاستي الجفن السفلي لانتفاخ تحت العينين والهالات الداكنة.',
      ru: 'Нижняя блефаропластика — хирургическое устранение мешков под глазами и тёмных кругов.',
      fr: 'Blépharoplastie inférieure pour poches sous les yeux et cernes — correction chirurgicale à Ankara.',
      de: 'Untere Blepharoplastik bei Tränensäcken, Schwellungen und dunklen Ringen.',
    },
    content: `<h2>Alt Blefaroplasti Nedir?</h2>
<p>Alt blefaroplasti, alt göz kapağındaki yağ dokusu fazlalığı, deri sarkması ve torbalaşmayı düzelten cerrahi işlemdir. Yıllar içinde yüzde oluşan yorgun ifadeyi gidererek canlı ve dinlenmiş bir görünüm sağlar.</p>
<h2>Hangi Belirtilere Yöneliktir?</h2>
<ul>
<li>Belirgin göz altı torbaları ve şişkinlik</li>
<li>Alt kapak deri gevşekliği</li>
<li>Göz altı çöküklüğü ve gölgesi</li>
<li>Yeterli uyku alınmasına rağmen yorgun görünüm</li>
</ul>
<h2>Teknikler</h2>
<p>Transkonjunktival yöntemde dış kesi olmaksızın kapak içinden yapılır; cilt fazlası olmayan yağ hernilerinde tercih edilir. Harici yöntemde ise cilt ve yağ fazlası birlikte ele alınır. Gerektiğinde yağ transferi ile volüm artırımı kombine edilebilir.</p>`,
  },
  {
    slug: 'badem-goz-estetigi',
    titles: {
      tr: 'Badem Göz Estetiği (Kantoplasti)',
      en: 'Almond Eye Surgery (Canthoplasty)',
      ar: 'جراحة عيون اللوز (كانثوبلاستي)',
      ru: 'Кантопластика (разрез глаза «миндаль»)',
      fr: 'Canthoplasiie (regard en amande)',
      de: 'Mandelaugen-Operation (Kanthoplastik)',
    },
    descriptions: {
      tr: 'Badem göz estetiği — dış göz köşesini kaldıran kantoplasti ile çekik, badem biçimli göz görünümü. Ankara\'da Prof. Dr. Gökçe Özel.',
      en: 'Canthoplasty for almond-shaped eyes — lifting the outer eye corner for a defined, upturned look.',
      ar: 'كانثوبلاستي لعيون اللوز — رفع زاوية العين الخارجية للحصول على مظهر ممدود.',
      ru: 'Кантопластика — подъём внешнего уголка глаза для миндалевидного разреза.',
      fr: 'Canthoplasiie — remontée du coin externe de l\'œil pour un regard en amande.',
      de: 'Kanthoplastik — Anheben des äußeren Augenwinkels für einen mandelförmigen Blick.',
    },
    content: `<h2>Badem Göz Estetiği Nedir?</h2>
<p>Kantoplasti (badem göz operasyonu), dış göz köşesini (lateral kantus) hafif yukarı kaldırarak gözlere çekik ve badem biçimli bir görünüm kazandıran cerrahi bir işlemdir. Aynı zamanda sarkık dış köşe görünümünü de düzeltir.</p>
<h2>Kimler İçin Uygundur?</h2>
<ul>
<li>Dış göz köşesi düşük veya sarkık görünenler</li>
<li>Badem biçimli, çekik göz görünümü isteyenler</li>
<li>Alt kapakta belirgin sarkıklık yaşayanlar</li>
</ul>
<h2>İşlem Detayları</h2>
<p>Lokal veya genel anestezi altında uygulanabilir. Dış göz köşesine küçük bir kesi yapılarak lateral kantal tendon yeniden konumlandırılır. Dikişler 7-10 günde alınır. İzler göz köşesinde gizlenir.</p>`,
  },
  {
    slug: 'gamze-estetigi',
    titles: {
      tr: 'Gamze Estetiği (Dimpleplasty)',
      en: 'Dimpleplasty (Dimple Creation)',
      ar: 'جراحة الغمازات (Dimpleplasty)',
      ru: 'Создание ямочек (Dimpleplasty)',
      fr: 'Création de fossettes (Dimpleplasty)',
      de: 'Grübchen-OP (Dimpleplasty)',
    },
    descriptions: {
      tr: 'Gamze estetiği (dimpleplasty) — yanaklara doğal görünümlü gamze kazandıran küçük cerrahi işlem. Ankara\'da Prof. Dr. Gökçe Özel.',
      en: 'Dimpleplasty — creating natural-looking cheek dimples with a minor surgical procedure in Ankara.',
      ar: 'عملية الغمازات — إنشاء غمازات خد ذات مظهر طبيعي في أنقرة.',
      ru: 'Диплопластика — создание естественных ямочек на щеках.',
      fr: 'Dimpleplastie — création de fossettes naturelles sur les joues à Ankara.',
      de: 'Dimpleplasty — natürlich aussehende Wangengrübchen durch kleinen Eingriff.',
    },
    content: `<h2>Gamze Estetiği (Dimpleplasty) Nedir?</h2>
<p>Dimpleplasty, yanak kasının derisine ince bir bağlantı oluşturularak gülümseme sırasında doğal görünen gamzelerin yaratıldığı minimal invaziv bir prosedürdür. İşlem lokal anestezi altında, kesi yapılmadan ağız içinden gerçekleştirilir.</p>
<h2>Nasıl Yapılır?</h2>
<p>Anestezi uygulamasının ardından, gamzenin oluşturulacağı noktaya ağız içinden ince bir sütür geçirilir. İşlem iki taraf için 30-45 dakika sürer. Ağız dışında herhangi bir iz kalmaz.</p>
<h2>İyileşme</h2>
<p>İlk günlerde gülümseme olmadan da gamze görünür; bu durum zamanla sadece gülümsemede ortaya çıkan doğal bir görünüme evrilir. Hafif şişlik 1-2 haftada geriler. Sonuçlar kalıcı olmakla birlikte, zamanla gamzenin solabileceği göz önünde bulundurulmalıdır.</p>`,
  },
  {
    slug: 'cene-estetigi-mentoplasti',
    titles: {
      tr: 'Çene Estetiği (Mentoplasti)',
      en: 'Chin Surgery (Mentoplasty)',
      ar: 'جراحة الذقن (مينتوبلاستي)',
      ru: 'Ментопластика (коррекция подбородка)',
      fr: 'Mentoplastie (chirurgie du menton)',
      de: 'Kinnkorrektur (Mentoplastik)',
    },
    descriptions: {
      tr: 'Çene estetiği (mentoplasti) — çene ucu implantı veya osteotomi ile yüz profilini iyileştirme. Ankara\'da Prof. Dr. Gökçe Özel.',
      en: 'Mentoplasty for chin augmentation or reduction to improve facial profile — Prof. Dr. Gökçe Özel, Ankara.',
      ar: 'مينتوبلاستي — تحسين ملامح الوجه بتكبير أو تصغير الذقن.',
      ru: 'Ментопластика — увеличение или уменьшение подбородка для гармонии лица.',
      fr: 'Mentoplastie — augmentation ou réduction du menton pour améliorer le profil facial.',
      de: 'Mentoplastik — Kinnvergrößerung oder -verkleinerung zur Verbesserung des Gesichtsprofils.',
    },
    content: `<h2>Çene Estetiği Nedir?</h2>
<p>Mentoplasti, çene ucunun boyutunu, şeklini veya konumunu değiştirerek yüz profilini dengeleyen cerrahi işlemdir. Küçük bir çene (mikrogeni) veya çıkık bir çene (progeni) tedavisinde kullanılır.</p>
<h2>Yöntemler</h2>
<ul>
<li><strong>Çene implantı:</strong> Silikon veya biyouyumlu implantlarla çene büyütme</li>
<li><strong>Osteotomi:</strong> Çene kemiğinin kesilip yeniden konumlandırılması</li>
<li><strong>Dolgu ile çene:</strong> Cerrahi gerektirmeyen geçici seçenek</li>
</ul>
<h2>Kimler İçin Uygundur?</h2>
<p>Yüz profilinde çene ve burun oranı uyumsuzluğu yaşayanlar, çene ucunun küçük veya geri çekilmiş göründüğünü düşünenler ve rinoplastiyle birlikte kombine çene estetiği isteyenler için idealdir.</p>`,
  },
  {
    slug: 'kepce-kulak-estetigi-otoplasti',
    titles: {
      tr: 'Kepçe Kulak Estetiği (Otoplasti)',
      en: 'Ear Pinning Surgery (Otoplasty)',
      ar: 'جراحة تصحيح الأذن البارزة (أوتوبلاستي)',
      ru: 'Отопластика (коррекция оттопыренных ушей)',
      fr: 'Otoplastie (correction des oreilles décollées)',
      de: 'Ohrenkorrektur (Otoplastik)',
    },
    descriptions: {
      tr: 'Kepçe kulak estetiği (otoplasti) — belirgin veya öne çıkık kulakları düzelten cerrahi. Ankara\'da çocuk ve yetişkin otoplastisi.',
      en: 'Otoplasty for prominent or protruding ears — ear pinning surgery for children and adults in Ankara.',
      ar: 'أوتوبلاستي لتصحيح الأذنين البارزتين — جراحة للأطفال والبالغين في أنقرة.',
      ru: 'Отопластика — коррекция лопоухости у детей и взрослых в Анкаре.',
      fr: 'Otoplastie pour oreilles décollées — chirurgie pour enfants et adultes à Ankara.',
      de: 'Otoplastik für abstehende Ohren — Ohrenkorrektur für Kinder und Erwachsene in Ankara.',
    },
    content: `<h2>Kepçe Kulak Estetiği Nedir?</h2>
<p>Otoplasti, kulak kepçesinin başa olan açısını azaltarak kulakları başa yaklaştıran ve daha doğal bir görünüm kazandıran cerrahi işlemdir. Kulak kıkırdağına verilen şekille kalıcı sonuç elde edilir.</p>
<h2>Çocuk ve Yetişkinlerde Otoplasti</h2>
<p>İdeal yaş, kulak gelişiminin büyük ölçüde tamamlandığı 5-6 yaştır. Bu sayede okul öncesinde sosyal baskıya maruz kalmadan cerrahi yapılabilir. Yetişkinlerde de her yaşta uygulanabilir.</p>
<h2>Ameliyat Detayları</h2>
<p>Kulak arkasına yapılan küçük bir kesiyle kıkırdak yeniden şekillendirilir ve dikişlerle sabitlenir. İşlem 1-2 saat sürer, yetişkinlerde lokal anestezi, çocuklarda genel anestezi tercih edilir. Baş bandı 4-6 hafta kullanılır.</p>`,
  },
  {
    slug: 'bisektomi',
    titles: {
      tr: 'Bisektomi (Yanak Yağı Alma)',
      en: 'Bichectomy (Buccal Fat Removal)',
      ar: 'إزالة دهون الوجه (بيشيكتومي)',
      ru: 'Бишектомия (удаление комков Биша)',
      fr: 'Bichectomie (enlèvement des boules de Bichat)',
      de: 'Bichektomie (Wangenfettentfernung)',
    },
    descriptions: {
      tr: 'Bisektomi — yanak yağ yastıkçıklarını (Bichat yağ topu) çıkararak yüzü inceltme ve elmacık kemiklerini öne çıkarma.',
      en: 'Bichectomy — removing buccal fat pads to slim the face and accentuate cheekbones.',
      ar: 'بيشيكتومي — إزالة دهون الخد لتنحيف الوجه وإبراز عظام الخد.',
      ru: 'Бишектомия — удаление комков Биша для похудения лица и подчёркивания скул.',
      fr: 'Bichectomie — retrait des boules de Bichat pour affiner le visage.',
      de: 'Bichektomie — Entfernung der Wangenfettpolster zur Gesichtsstraffung.',
    },
    content: `<h2>Bisektomi Nedir?</h2>
<p>Bisektomi, yanak içinde yer alan Bichat yağ toplarının ağız içinden yapılan küçük bir kesiyle çıkarıldığı minimal invaziv bir yüz inceltme işlemidir. Yüzün üçgen biçiminde görünmesini, elmacık kemiklerinin belirginleşmesini sağlar.</p>
<h2>Kimler İçin Uygundur?</h2>
<ul>
<li>Yuvarlak veya "hamster yüzü" görünümünden şikayetçi olanlar</li>
<li>Yüz incelmesini isteyen, ancak kilo vermeyle sonuç alamamış bireyler</li>
<li>Elmacık kemiklerini öne çıkarmak isteyenler</li>
</ul>
<h2>Önemli Uyarı</h2>
<p>Bisektomi, yüzün yaşlı görünmesine yol açabileceğinden 35-40 yaş üstünde dikkatli değerlendirilmelidir. İşlem ağız içinden yapıldığından dış iz kalmaz. Etki kalıcıdır.</p>`,
  },
  {
    slug: 'endolift',
    titles: {
      tr: 'Endolift (Lazer Yüz Germe)',
      en: 'Endolift (Laser Face Lifting)',
      ar: 'إندوليفت (شد الوجه بالليزر)',
      ru: 'Эндолифт (лазерный лифтинг лица)',
      fr: 'Endolift (lifting laser du visage)',
      de: 'Endolift (Laser-Facelifting)',
    },
    descriptions: {
      tr: 'Endolift — fiber optik lazer ile cilt altından uygulanan minimal invaziv yüz germe ve sıkılaştırma işlemi. Ankara\'da Prof. Dr. Gökçe Özel.',
      en: 'Endolift — minimally invasive sub-dermal laser tightening and face lifting. Prof. Dr. Gökçe Özel, Ankara.',
      ar: 'إندوليفت — شد وتشديد الوجه بالليزر تحت الجلد بأقل تدخل جراحي.',
      ru: 'Эндолифт — минимально инвазивное подкожное лазерное подтяжение лица.',
      fr: 'Endolift — remodelage et lifting laser sous-cutané minimalement invasif.',
      de: 'Endolift — minimal-invasive subkutane Laser-Straffung und Facelifting.',
    },
    content: `<h2>Endolift Nedir?</h2>
<p>Endolift, 1470 nm dalga boylu diyot lazer kullanan, çok ince fiber optik kanallar aracılığıyla cilt altına uygulanan bir yüz gençleştirme teknolojisidir. Hem yağ eritme (lipoliz) hem kolajen stimülasyonu hem de sıkılaştırma etkisi gösterir.</p>
<h2>Hangi Bölgelere Uygulanır?</h2>
<ul>
<li>Yüz ovalinin sarkması (alt yüz)</li>
<li>Boyun ve çene altı yağlanma</li>
<li>Diz, iç kol ve karın bölgesi</li>
<li>Yüz ortası deri gevşekliği</li>
</ul>
<h2>Avantajları</h2>
<p>Genel anestezi gerektirmez, sadece lokal anestezi uygulanır. Giriş delikleri izi kalmadan kapanır. İşlem süresi bölgeye göre 30-90 dakika. Sosyal hayata 2-3 gün içinde dönülebilir. Etki 3-6 ay içinde ortaya çıkar, 1-2 yıl devam eder.</p>`,
  },
  {
    slug: 'yuz-germe-facelift',
    titles: {
      tr: 'Yüz Germe (Facelift)',
      en: 'Facelift (Rhytidectomy)',
      ar: 'شد الوجه الجراحي (فيسليفت)',
      ru: 'Подтяжка лица (Фейслифт)',
      fr: 'Lifting du visage (Rhytidectomie)',
      de: 'Facelift (Gesichtsstraffung)',
    },
    descriptions: {
      tr: 'Yüz germe (facelift) ameliyatı — yüz ve boyun bölgesindeki sarkmaları düzelten kapsamlı cerrahi gençleştirme. Ankara\'da Prof. Dr. Gökçe Özel.',
      en: 'Facelift surgery — comprehensive surgical rejuvenation for facial and neck sagging in Ankara.',
      ar: 'جراحة شد الوجه — تجديد شامل لترهل الوجه والرقبة في أنقرة.',
      ru: 'Хирургическая подтяжка лица — комплексное омоложение при обвисании кожи лица и шеи.',
      fr: 'Lifting chirurgical du visage — rajeunissement complet pour ptôse faciale et cervicale à Ankara.',
      de: 'Facelift-Operation — umfassende chirurgische Verjüngung bei Gesichts- und Halserschlaffung.',
    },
    content: `<h2>Yüz Germe Nedir?</h2>
<p>Facelift (ritidektomi), yüz ve boyun derisindeki sarkmaları düzelten, derin yüz dokularını (SMAS) yeniden konumlandıran ve yaşlanma işaretlerini önemli ölçüde azaltan cerrahi bir gençleştirme işlemidir.</p>
<h2>Neleri Düzeltir?</h2>
<ul>
<li>Yüz oval sarkması ve jowl bölgesi</li>
<li>Derin nasolabial kıvrımlar</li>
<li>Boyun ve çene altı sarkan deri</li>
<li>Yüz ortası hacim kaybı</li>
</ul>
<h2>Teknikler</h2>
<p>Mini facelift, tam facelift ve derin plan facelift olmak üzere farklı derinliklerde teknikler mevcuttur. Seçim; hastanın yaşına, sarkıklık derecesine ve beklentilerine göre belirlenir.</p>
<h2>İyileşme</h2>
<p>İlk hafta belirgin şişlik ve morluk görülür, 2-3 haftada büyük ölçüde düzelir. Sosyal hayata 2-3 haftada dönülebilir. Nihai sonuç 3-6 ayda oturur; etki 7-10 yıl sürebilir.</p>`,
  },
  {
    slug: 'i-ple-yuz-germe-fransiz-aski',
    titles: {
      tr: 'İple Yüz Germe (Fransız Askısı)',
      en: 'Thread Lift (French Thread Lift)',
      ar: 'شد الوجه بالخيوط (الخيوط الفرنسية)',
      ru: 'Нитевой лифтинг лица (французские нити)',
      fr: 'Lifting par fils (Fil français)',
      de: 'Fadenlifting (Französischer Fadenlifting)',
    },
    descriptions: {
      tr: 'İple yüz germe (Fransız askısı) — eriyen PDO veya PLLA iplerle cerrahi olmayan yüz kaldırma. Hızlı iyileşme, doğal görünüm.',
      en: 'Thread lift with dissolvable PDO or PLLA threads — non-surgical face lifting with quick recovery and natural results.',
      ar: 'شد الوجه بالخيوط القابلة للامتصاص PDO أو PLLA — رفع الوجه بدون جراحة.',
      ru: 'Нитевой лифтинг рассасывающимися нитями PDO/PLLA — нехирургическое подтяжение лица.',
      fr: 'Lifting par fils résorbables PDO/PLLA — remontée du visage sans chirurgie.',
      de: 'Fadenlifting mit resorbierbaren PDO/PLLA-Fäden — nicht-chirurgische Gesichtsstraffung.',
    },
    content: `<h2>İple Yüz Germe Nedir?</h2>
<p>İple yüz germe (thread lift), dikenli veya düz PDO/PLLA eriyen iplerle yapılan minimal invaziv bir yüz kaldırma işlemidir. Cerrahi facelift'e alternatif olarak özellikle hafif-orta derece sarkmalar için tercih edilir.</p>
<h2>Nasıl Çalışır?</h2>
<p>İnce iğneler aracılığıyla cilt altına yerleştirilen iplerin ters yönlü dikenleri doku tutunmasını sağlar. Zamanla ip etrafında kolajen oluşumu başlar. İpler 6-12 ayda çözünerek kalıcı bir gençleşme etkisi bırakır.</p>
<h2>Avantajları</h2>
<ul>
<li>Anestezi gerektirmez (lokal uygulama)</li>
<li>İşlem 30-60 dakika sürer</li>
<li>Aynı gün sosyal hayata dönülebilir</li>
<li>Etki 12-24 ay sürer</li>
</ul>`,
  },
  {
    slug: 'i-ple-kas-kaldirma',
    titles: {
      tr: 'İple Kaş Kaldırma',
      en: 'Thread Brow Lift',
      ar: 'رفع الحاجب بالخيوط',
      ru: 'Нитевой лифтинг бровей',
      fr: 'Lifting des sourcils par fils',
      de: 'Fadenlifting der Augenbrauen',
    },
    descriptions: {
      tr: 'İple kaş kaldırma — PDO eriyen iplerle kaşları yukarı taşıma ve göz çevresini gençleştirme. Ameliyatsız, hızlı iyileşme.',
      en: 'Thread brow lift — elevating the brows with dissolvable PDO threads for a non-surgical youthful eye area.',
      ar: 'رفع الحاجب بالخيوط PDO — رفع الحواجب دون جراحة.',
      ru: 'Нитевой лифтинг бровей PDO — подъём бровей без операции.',
      fr: 'Lifting sourcils par fils PDO — remontée des sourcils sans chirurgie.',
      de: 'Fadenlifting der Augenbrauen mit PDO-Fäden — nicht-chirurgische Brauenanhebung.',
    },
    content: `<h2>İple Kaş Kaldırma Nedir?</h2>
<p>İple kaş kaldırma, ince dikenli PDO iplerin kaş bölgesine yerleştirilmesiyle kaşların yukarı taşındığı ve göz çevresinin daha genç görünmesinin sağlandığı non-cerrahi bir işlemdir.</p>
<h2>Kimler İçin Uygundur?</h2>
<ul>
<li>Kaşları aşağıya düşmüş olanlar</li>
<li>Üst göz kapağı sarkıklığı başlangıç dönemindekiler</li>
<li>Cerrahi kaş kaldırmaya hazır olmayan veya istemeyen bireyler</li>
</ul>
<h2>İşlem Detayları</h2>
<p>Lokal anestezi altında 20-30 dakikada tamamlanır. İşlem sonrası hafif şişlik görülebilir; 1-2 gün içinde kaybolur. Etki 12-18 ay sürer. Tek başına veya botoks ve dolguyla kombine uygulanabilir.</p>`,
  },
  {
    slug: 'kas-kaldirma',
    titles: {
      tr: 'Kaş Kaldırma',
      en: 'Brow Lift',
      ar: 'رفع الحاجب',
      ru: 'Лифтинг бровей',
      fr: 'Remontée des sourcils',
      de: 'Augenbrauen-Lifting',
    },
    descriptions: {
      tr: 'Kaş kaldırma — cerrahi veya non-cerrahi yöntemlerle düşük kaşları kaldırma ve göz çevresini gençleştirme. Ankara\'da Prof. Dr. Gökçe Özel.',
      en: 'Brow lift — surgical or non-surgical elevation of descended brows and rejuvenation of the eye area.',
      ar: 'رفع الحاجب — خيارات جراحية وغير جراحية لرفع الحواجب المتدلية.',
      ru: 'Лифтинг бровей — хирургические и нехирургические методы коррекции опущенных бровей.',
      fr: 'Remontée des sourcils — options chirurgicales et non-chirurgicales.',
      de: 'Augenbrauen-Lifting — chirurgische und nicht-chirurgische Optionen.',
    },
    content: `<h2>Kaş Kaldırma Nedir?</h2>
<p>Yaşla birlikte kaşlar aşağıya iner; bu durum yorgun, sinirli veya yaşlı bir ifade oluşturur. Kaş kaldırma prosedürleri bu görünümü düzelterek göze dinlenmiş ve genç bir ifade kazandırır.</p>
<h2>Yöntemler</h2>
<ul>
<li><strong>Endoskopik kaş kaldırma:</strong> Saçlı deri içinden yapılan cerrahi, kalıcı sonuç</li>
<li><strong>İple kaş kaldırma:</strong> PDO iplerle minimal invaziv, 12-18 ay etki</li>
<li><strong>Botoks ile kaş kaldırma:</strong> Kimyasal gevşemeyle 2-4 mm yükselme, 4-6 ay etki</li>
<li><strong>Dolgu ile kaş kaldırma:</strong> Kaş altına dolgu ile optik yükselme</li>
</ul>
<h2>Hangi Yöntem Seçilmeli?</h2>
<p>İnce ve hafif düşmüş kaşlarda botoks veya ip yeterken, belirgin sarkmalarda endoskopik cerrahi daha kalıcı sonuç verir. Muayenede bireysel değerlendirme yapılır.</p>`,
  },
  {
    slug: 'ameliyatsiz-kas-kaldirma',
    titles: {
      tr: 'Ameliyatsız Kaş Kaldırma',
      en: 'Non-Surgical Brow Lift',
      ar: 'رفع الحاجب بدون جراحة',
      ru: 'Нехирургический лифтинг бровей',
      fr: 'Lifting sourcils sans chirurgie',
      de: 'Nicht-chirurgisches Augenbrauen-Lifting',
    },
    descriptions: {
      tr: 'Ameliyatsız kaş kaldırma — botoks, dolgu veya ip teknikleriyle cerrahi olmadan kaş yükseltme. Hızlı, iyileşme gerektirmez.',
      en: 'Non-surgical brow lift with botox, fillers or threads — quick lift with no downtime.',
      ar: 'رفع الحاجب بدون جراحة — بوتوكس أو حقن أو خيوط للنتائج السريعة.',
      ru: 'Нехирургический лифтинг бровей — ботокс, филлеры или нити без восстановительного периода.',
      fr: 'Lifting sourcils non chirurgical — botox, fillers ou fils sans période de récupération.',
      de: 'Nicht-chirurgisches Augenbrauen-Lifting — Botox, Filler oder Fäden ohne Ausfallzeit.',
    },
    content: `<h2>Ameliyatsız Kaş Kaldırma</h2>
<p>Cerrahi prosedür istemeyenler için botoks, hyaluronik asit dolgu ve PDO ip yöntemleriyle etkin kaş yükseltme mümkündür. Her yöntemin avantajları, etki süresi ve uygun hasta profili farklılık gösterir.</p>
<h2>Botoks ile Kaş Kaldırma</h2>
<p>Kaş altındaki depressor kasları (orbicularis oculi alt lifleri) botoks ile gevşetilir; kaşlar 2-4 mm yukarı taşınır. Etki 4-6 ay sürer. İşlem 10-15 dakika, iz kalmaz.</p>
<h2>Dolgu ile Kaş Kaldırma</h2>
<p>Kaş dış ucuna hyaluronik asit dolgu enjekte edilerek optik yükselme sağlanır. Dolgu, yumuşak doku desteği oluşturur. 9-12 ay etkilidir.</p>
<h2>İple Kaş Kaldırma</h2>
<p>PDO dikenli iplerle mekanik kaldırma. 12-18 ay etki, tam anestezi gerektirmez.</p>`,
  },
  {
    slug: 'botoks-ile-kas-kaldirma',
    titles: {
      tr: 'Botoks ile Kaş Kaldırma',
      en: 'Brow Lift with Botox',
      ar: 'رفع الحاجب بالبوتوكس',
      ru: 'Подъём бровей ботоксом',
      fr: 'Remontée des sourcils au Botox',
      de: 'Augenbrauen-Lifting mit Botox',
    },
    descriptions: {
      tr: 'Botoks ile kaş kaldırma — botulinum toksin enjeksiyonuyla kaşları 2-4 mm yükselten hızlı ve etkili non-cerrahi yöntem.',
      en: 'Brow lift with Botox — quick non-surgical elevation of eyebrows by 2-4 mm with botulinum toxin.',
      ar: 'رفع الحاجب بالبوتوكس — رفع سريع وغير جراحي للحواجب بمقدار 2-4 ملم.',
      ru: 'Подъём бровей ботоксом — быстрый нехирургический подъём на 2-4 мм.',
      fr: 'Remontée des sourcils au Botox — élévation rapide non chirurgicale de 2-4 mm.',
      de: 'Augenbrauen-Lifting mit Botox — schnelle nicht-chirurgische Anhebung um 2-4 mm.',
    },
    content: `<h2>Botoks ile Kaş Kaldırma Nasıl Çalışır?</h2>
<p>Kaşı aşağıya çeken orbicularis oculi kasının alt bölümüne botoks enjekte edilir. Kas gevşeyince kaş elevatör kasları baskısız çalışarak kaşı 2-4 mm yukarı kaldırır. Bu teknik aynı zamanda "brow lift" botoks uygulaması olarak bilinir.</p>
<h2>Uygulama Detayları</h2>
<ul>
<li>İşlem süresi: 10-15 dakika</li>
<li>Etki başlangıcı: 3-5 gün</li>
<li>Tam etki: 2 hafta</li>
<li>Etki süresi: 4-6 ay</li>
<li>Yan etki: Mininal morluk olabilir</li>
</ul>
<h2>Kimler İçin Uygundur?</h2>
<p>Hafif kaş düşüklüğü olan, cerrahi gerektirmeyen hastalarda, özellikle dış kaş köşeleri aşağıya düştüğünde etkilidir. Alın botoksuyla kombine uygulandığında daha dengeli sonuç elde edilir.</p>`,
  },
  {
    slug: 'dolgu-ile-kas-kaldirma',
    titles: {
      tr: 'Dolgu ile Kaş Kaldırma',
      en: 'Brow Lift with Fillers',
      ar: 'رفع الحاجب بالحقن',
      ru: 'Подъём бровей с помощью филлеров',
      fr: 'Remontée des sourcils par fillers',
      de: 'Augenbrauen-Lifting mit Fillern',
    },
    descriptions: {
      tr: 'Dolgu ile kaş kaldırma — hyaluronik asit dolgu enjeksiyonuyla kaş bölgesine hacim katarak optik yükselme. Ameliyatsız, kalıcı olmayan.',
      en: 'Brow lift with hyaluronic acid fillers — adding volume under the brow for optical elevation without surgery.',
      ar: 'رفع الحاجب بحقن حمض الهيالورونيك — إضافة حجم تحت الحاجب.',
      ru: 'Подъём бровей филлерами — добавление объёма под бровь для оптического подъёма.',
      fr: 'Remontée des sourcils par fillers hyaluroniques — volume sous le sourcil pour élévation optique.',
      de: 'Augenbrauen-Lifting mit Hyaluronfillern — Volumenaufbau unter der Braue für optische Anhebung.',
    },
    content: `<h2>Dolgu ile Kaş Kaldırma</h2>
<p>Hyaluronik asit dolgusu, kaş altına veya dış kaş köşesine yerleştirilerek göz çevresindeki volüm kaybını telafi eder ve kaşı optik olarak yukarı kaldırır. Özellikle şakaklardaki yağ dokusu kaybıyla gelen göçme ve çöküklüklerde tercih edilir.</p>
<h2>Nasıl Uygulanır?</h2>
<p>İnce kanüllerle kaş üst ve alt bölgelerine, şakaklara ve göz üstüne dolgu enjekte edilir. İşlem 20-30 dakika sürer. Sonuç hemen görülür. 9-12 ay etki devam eder.</p>
<h2>Kimler İçin Uygundur?</h2>
<p>Kaş düşüklüğüne ek olarak göz çevresinde dolgunluk kaybı yaşayanlar, şakak çöküklüğü olanlar ve botoks etkisini artırmak isteyenler için uygun bir tamamlayıcı uygulamadır.</p>`,
  },
  {
    slug: 'goz-alti-isik-dolgusu',
    titles: {
      tr: 'Göz Altı Işık Dolgusu',
      en: 'Under-Eye Tear Trough Filler',
      ar: 'حقن تعب تحت العين (Tear Trough)',
      ru: 'Контурная пластика под глазами (Tear Trough)',
      fr: 'Cernes sous les yeux (Tear Trough filler)',
      de: 'Tränenrinnenfüller (Under-Eye Filler)',
    },
    descriptions: {
      tr: 'Göz altı ışık dolgusu (tear trough) — göz altı çöküklüğü ve koyu halkayı hyaluronik asit dolgusuyla gideren işlem.',
      en: 'Tear trough filler for under-eye hollows and dark circles — hyaluronic acid injection for a refreshed look.',
      ar: 'حقن Tear Trough لعلاج الهالات والانخماص تحت العينين بحمض الهيالورونيك.',
      ru: 'Tear trough — инъекции гиалуроновой кислоты для устранения тёмных кругов и западин под глазами.',
      fr: 'Tear trough filler — injections d\'acide hyaluronique pour cernes et creux sous les yeux.',
      de: 'Tear Trough Filler für Augenringe und Hohlräume unter den Augen.',
    },
    content: `<h2>Göz Altı Işık Dolgusu Nedir?</h2>
<p>Tear trough (göz altı oluğu) dolgusu, göz ile yanak arasındaki çöküklüğü ve koyu halkaları hyaluronik asit enjeksiyonuyla gideren bir estetik uygulamadır. Yorgun ve gözler çukura kaçmış görüntüyü düzeltir.</p>
<h2>Kimler İçin Uygundur?</h2>
<ul>
<li>Uyku almış olsa da koyu halka şikayeti olanlar</li>
<li>Göz altında belirgin çöküklük ve gölge yaşayanlar</li>
<li>Göz altı torbası ameliyatına hazır olmayan bireyler</li>
</ul>
<h2>Uygulama Detayları</h2>
<p>İnce kanül veya iğneyle, yüksek kohesiv bir hyaluronik asit ürünü, periorbital bölgeye derin planlarda enjekte edilir. İşlem 20-30 dakika sürer. Etki 9-18 ay devam eder. Geri döndürülebilir bir uygulamadır.</p>`,
  },
  {
    slug: 'mezoterapi',
    titles: {
      tr: 'Mezoterapi',
      en: 'Mesotherapy',
      ar: 'علاج الميزوثيرابي',
      ru: 'Мезотерапия',
      fr: 'Mésothérapie',
      de: 'Mesotherapie',
    },
    descriptions: {
      tr: 'Mezoterapi — cilt yenileme, saç dökülmesi ve yağ erimesi için vitamin, mineral ve aktif madde kokteyllerinin cilt altına enjeksiyonu.',
      en: 'Mesotherapy — injection of vitamin and active ingredient cocktails for skin rejuvenation, hair loss and fat reduction.',
      ar: 'ميزوثيرابي — حقن كوكتيلات فيتامين ومواد فعالة لتجديد البشرة وتساقط الشعر.',
      ru: 'Мезотерапия — инъекции витаминных коктейлей для омоложения кожи, лечения выпадения волос.',
      fr: 'Mésothérapie — injections de cocktails vitamines et actifs pour rajeunissement cutané et chute de cheveux.',
      de: 'Mesotherapie — Injektionen von Vitamin- und Wirkstoffcocktails zur Hautverjüngung und Haarausfall.',
    },
    content: `<h2>Mezoterapi Nedir?</h2>
<p>Mezoterapi, vitaminler, mineraller, amino asitler ve hyaluronik asit gibi aktif bileşenlerin ince iğnelerle mezoderma (cilt orta tabakası) ya da saçlı deriye enjekte edilmesi işlemidir.</p>
<h2>Kullanım Alanları</h2>
<ul>
<li><strong>Yüz mezoterapisi:</strong> Cilt nemlendirme, aydınlatma, kırışıklık azaltma</li>
<li><strong>Saç mezoterapisi:</strong> Saç dökülmesini yavaşlatma, saçı güçlendirme</li>
<li><strong>Vücut mezoterapisi (lipoliz):</strong> Lokal yağlanma azaltma</li>
<li><strong>El gençleştirme:</strong> El sırtı cilt kalitesini artırma</li>
</ul>
<h2>Seans Sayısı ve Sıklık</h2>
<p>Genellikle 4-6 seans, 2 haftada bir uygulanır. İdame için ayda 1 seans önerilir. Her seans 20-30 dakika sürer. Kızarıklık ve hafif şişlik 24-48 saat içinde kaybolur.</p>`,
  },
  {
    slug: 'yuz-mezoterapisi',
    titles: {
      tr: 'Yüz Mezoterapisi',
      en: 'Face Mesotherapy',
      ar: 'ميزوثيرابي الوجه',
      ru: 'Мезотерапия лица',
      fr: 'Mésothérapie du visage',
      de: 'Gesichts-Mesotherapie',
    },
    descriptions: {
      tr: 'Yüz mezoterapisi — cilt nemlendirmesi, parlaklık ve gençleştirme için vitamin ve hyaluronik asit enjeksiyonu. Ankara kliniğimizde.',
      en: 'Face mesotherapy — vitamin and hyaluronic acid injections for skin hydration, radiance and rejuvenation in Ankara.',
      ar: 'ميزوثيرابي الوجه — حقن الفيتامينات وحمض الهيالورونيك لترطيب وتجديد البشرة.',
      ru: 'Мезотерапия лица — инъекции витаминов и гиалуроновой кислоты для увлажнения и омоложения.',
      fr: 'Mésothérapie faciale — injections de vitamines et acide hyaluronique pour hydratation et rajeunissement.',
      de: 'Gesichts-Mesotherapie — Vitamin- und Hyaluronsäureinjektionen zur Hautpflege und Verjüngung.',
    },
    content: `<h2>Yüz Mezoterapisi Nedir?</h2>
<p>Yüz mezoterapisi, cildin derin katmanlarına ince iğnelerle vitamin, mineral, amino asit ve hyaluronik asit içeren özel kokteyllerin enjekte edilmesidir. Cilt nemini artırır, kolajen yapımını uyarır ve cilde canlılık katar.</p>
<h2>Faydaları</h2>
<ul>
<li>Derin nem ve parlaklık</li>
<li>İnce çizgi ve kırışıklıkların azalması</li>
<li>Cilt tonunun eşitlenmesi</li>
<li>Sıkılaştırma etkisi</li>
<li>Leke ve matlaşmanın giderilmesi</li>
</ul>
<h2>Seans Planı</h2>
<p>İlk tedavi serisi 4-6 seans, 2 haftada bir yapılır. Ardından ayda 1 idame seansı önerilir. Her seans 20-30 dakika sürer. İşlem sonrası kızarıklık 24-48 saat içinde geçer.</p>`,
  },
  {
    slug: 'prp-uygulamasi',
    titles: {
      tr: 'PRP Uygulaması',
      en: 'PRP Treatment (Platelet-Rich Plasma)',
      ar: 'علاج PRP (البلازما الغنية بالصفائح)',
      ru: 'PRP-терапия (плазмотерапия)',
      fr: 'Traitement PRP (Plasma Riche en Plaquettes)',
      de: 'PRP-Behandlung (Plättchenreiches Plasma)',
    },
    descriptions: {
      tr: 'PRP (trombositten zengin plazma) uygulaması — saç dökülmesi, cilt gençleştirme ve yara iyileşmesi için kendi kanınızdan üretilen doğal tedavi.',
      en: 'PRP treatment using your own platelet-rich plasma — natural therapy for hair loss, skin rejuvenation and healing.',
      ar: 'علاج PRP بالبلازما الغنية بالصفائح — علاج طبيعي لتساقط الشعر وتجديد البشرة.',
      ru: 'PRP-терапия обогащённой тромбоцитами плазмой — натуральное лечение выпадения волос и омоложения кожи.',
      fr: 'Traitement PRP au plasma riche en plaquettes — thérapie naturelle pour chute de cheveux et rajeunissement.',
      de: 'PRP-Behandlung mit thrombozytenreichem Plasma — natürliche Therapie bei Haarausfall und Hautverjüngung.',
    },
    content: `<h2>PRP Nedir?</h2>
<p>PRP (Platelet Rich Plasma — trombositten zengin plazma), hastanın kendi kanından elde edilen ve büyüme faktörlerince zengin plazmanın ihtiyaç duyulan bölgeye enjekte edilmesi işlemidir. Tamamen doğal ve otoloğ (kişinin kendi biyolojik materyali) bir tedavidir.</p>
<h2>Kullanım Alanları</h2>
<ul>
<li><strong>Saç dökülmesi:</strong> Androgenik alopesi, diffüz saç incelmesi</li>
<li><strong>Yüz gençleştirme:</strong> Cilt kalitesi iyileştirme, ince çizgiler</li>
<li><strong>Eklem tedavisi:</strong> Diz ve omuz dejenerasyonu</li>
<li><strong>Yara iyileşmesi:</strong> Cerrahi sonrası iyileşmeyi hızlandırma</li>
</ul>
<h2>Seans Protokolü</h2>
<p>Saç ve cilt tedavisinde 3-4 seans, 4 haftada bir uygulanır. Yılda 1-2 kez idame seansı önerilir. Kan alımından enjeksiyona kadar işlem 30-45 dakika sürer.</p>`,
  },
  {
    slug: 'mikro-i-gneleme',
    titles: {
      tr: 'Mikro İğneleme (Dermapen)',
      en: 'Microneedling (Dermapen)',
      ar: 'الإبر الدقيقة (ديرمابن)',
      ru: 'Микроигольчатая терапия (дермапен)',
      fr: 'Microneedling (Dermapen)',
      de: 'Microneedling (Dermapen)',
    },
    descriptions: {
      tr: 'Mikro iğneleme (Dermapen) — ciltte kolajen üretimini uyaran minik iğne kanallarıyla skar, kırışıklık ve gözenek sorununun tedavisi.',
      en: 'Microneedling with Dermapen — collagen induction therapy for scars, wrinkles and enlarged pores.',
      ar: 'الإبر الدقيقة (ديرمابن) — علاج الندوب والتجاعيد والمسام بتحفيز إنتاج الكولاجين.',
      ru: 'Микроигольчатая терапия — стимуляция выработки коллагена для лечения рубцов и морщин.',
      fr: 'Microneedling Dermapen — thérapie par induction de collagène pour cicatrices, rides et pores.',
      de: 'Microneedling — Kollagen-Induktionstherapie für Narben, Falten und erweiterte Poren.',
    },
    content: `<h2>Mikro İğneleme Nedir?</h2>
<p>Mikro iğneleme (collagen induction therapy), cilde çok ince iğnelerle kontrollü mikro kanallar açarak cildin doğal onarım mekanizmasını ve kolajen yapımını tetikleyen bir cilt gençleştirme yöntemidir.</p>
<h2>Tedavi Edilen Durumlar</h2>
<ul>
<li>Akne ve cerrahi skarları</li>
<li>Büyük gözenekler</li>
<li>İnce çizgiler ve yüzeyel kırışıklıklar</li>
<li>Cilt tonu eşitsizliği ve lekeler</li>
<li>Gebelik çatlakları (stria)</li>
</ul>
<h2>Seans Planı</h2>
<p>3-6 seans, 4 haftada bir uygulanır. Her seans 30-45 dakika sürer. İşlem öncesi topikal anestezi krem uygulanır. İşlem sonrası kızarıklık 24-48 saat sürer. PRP ile kombine edildiğinde sonuçlar güçlenir.</p>`,
  },
  {
    slug: 'cilt-yenileme',
    titles: {
      tr: 'Cilt Yenileme',
      en: 'Skin Renewal',
      ar: 'تجديد البشرة',
      ru: 'Обновление кожи',
      fr: 'Renouvellement cutané',
      de: 'Hauterneuerung',
    },
    descriptions: {
      tr: 'Cilt yenileme tedavileri — peeling, lazer ve mezoterapi ile cilt kalitesini artırma, leke ve kırışıklık azaltma. Ankara kliniği.',
      en: 'Skin renewal treatments — peeling, laser and mesotherapy for improved skin quality, pigmentation and anti-ageing.',
      ar: 'علاجات تجديد البشرة — تقشير وليزر وميزوثيرابي لتحسين جودة البشرة.',
      ru: 'Процедуры обновления кожи — пилинг, лазер и мезотерапия для улучшения качества кожи.',
      fr: 'Traitements de renouvellement cutané — peeling, laser et mésothérapie pour qualité de peau.',
      de: 'Hauterneuerungsbehandlungen — Peeling, Laser und Mesotherapie für bessere Hautqualität.',
    },
    content: `<h2>Cilt Yenileme Nedir?</h2>
<p>Cilt yenileme, yaşlanma, güneş hasarı, akne izleri ve deri solgunluğu gibi sorunları gidermek amacıyla uygulanan çeşitli tıbbi estetik tedavilerin genel adıdır.</p>
<h2>Kullanılan Yöntemler</h2>
<ul>
<li><strong>Kimyasal peeling:</strong> Cilt yüzeyini yenileyen asit bazlı uygulamalar</li>
<li><strong>Lazer cilt yenileme:</strong> Ablative ve non-ablative lazer tedavileri</li>
<li><strong>Mezoterapi:</strong> Vitamin ve aktif madde enjeksiyonları</li>
<li><strong>PRP:</strong> Büyüme faktörü zengin plazma</li>
<li><strong>Mikro iğneleme:</strong> Kolajen indüksiyon tedavisi</li>
</ul>
<h2>Hangi Sorunlara Yönelik?</h2>
<p>Akne izleri, melazma, güneş lekeleri, yaşlılık lekeleri, ince kırışıklıklar, geniş gözenekler ve cilt matlaşması başlıca tedavi endikasyonlarıdır. Kişiye özel protokol oluşturulur.</p>`,
  },
  {
    slug: 'cilt-soyma-kimyasal-peeling-i-slemleri',
    titles: {
      tr: 'Kimyasal Peeling',
      en: 'Chemical Peeling',
      ar: 'التقشير الكيميائي',
      ru: 'Химический пилинг',
      fr: 'Peeling chimique',
      de: 'Chemisches Peeling',
    },
    descriptions: {
      tr: 'Kimyasal peeling — yüzeysel ve orta derinlikte asit uygulamalarıyla cilt yenileme, leke ve ince kırışıklık tedavisi. Ankara.',
      en: 'Chemical peeling — superficial and medium-depth acid treatments for skin renewal and pigmentation in Ankara.',
      ar: 'التقشير الكيميائي — علاج تقشير الجلد بالحمض لتجديد البشرة والتصبغات.',
      ru: 'Химический пилинг — поверхностный и средний пилинг для обновления кожи и лечения пигментации.',
      fr: 'Peeling chimique — traitements acides superficiels et moyens pour renouvellement et pigmentation.',
      de: 'Chemisches Peeling — oberflächliche und mittlere Säurebehandlungen zur Hauterneuerung.',
    },
    content: `<h2>Kimyasal Peeling Nedir?</h2>
<p>Kimyasal peeling, cildin üst tabakalarına belirli asitlerin (AHA, BHA, TCA, fenol vb.) kontrollü biçimde uygulanarak deri hücrelerinin dökülmesini ve yenilenmesini sağlayan bir tıbbi estetik tedavidir.</p>
<h2>Peeling Türleri</h2>
<ul>
<li><strong>Yüzeysel peeling:</strong> Glikolik asit, salisilik asit; hafif leke ve ton eşitsizliği</li>
<li><strong>Orta derinlikte peeling:</strong> TCA %20-35; belirgin leke, ince kırışıklıklar</li>
<li><strong>Derin peeling:</strong> Fenol; derin kırışıklık ve belirgin akne izleri</li>
</ul>
<h2>Kimler İçin Uygundur?</h2>
<p>Melazma, akne sonrası hiperpigmentasyon, güneş lekeleri, ince çizgiler ve mat cilt sorunu olanlar için uygundur. Koyu ten renginde dikkatli seçim önerilir. Yaz aylarında güneş koruma zorunludur.</p>`,
  },
  {
    slug: 'ozon-uygulamasi',
    titles: {
      tr: 'Ozon Uygulaması',
      en: 'Ozone Therapy',
      ar: 'العلاج بالأوزون',
      ru: 'Озонотерапия',
      fr: 'Ozonothérapie',
      de: 'Ozontherapie',
    },
    descriptions: {
      tr: 'Ozon uygulaması — antioksidan, antiinflamatuar ve bağışıklık güçlendirici etkileriyle genel sağlık ve cilt kalitesini destekleyen tıbbi ozon tedavisi.',
      en: 'Ozone therapy — medical ozone for antioxidant, anti-inflammatory and immune-boosting effects on skin and general health.',
      ar: 'العلاج بالأوزون — أوزون طبي لتأثيرات مضادة للأكسدة والالتهابات وتعزيز المناعة.',
      ru: 'Озонотерапия — медицинский озон с антиоксидантным, противовоспалительным и иммуностимулирующим действием.',
      fr: 'Ozonothérapie — ozone médical aux effets antioxydants, anti-inflammatoires et immunostimulants.',
      de: 'Ozontherapie — medizinisches Ozon für antioxidative, entzündungshemmende und immunstimulierende Wirkungen.',
    },
    content: `<h2>Ozon Tedavisi Nedir?</h2>
<p>Tıbbi ozon (O₃), oksijen ve ozondan oluşan bir gaz karışımıdır. Damar içi, cilt altı veya rektal yollarla uygulanan ozon tedavisi; antioksidan kapasite artırımı, dolaşım iyileştirmesi ve bağışıklık modülasyonu sağlar.</p>
<h2>Uygulama Şekilleri</h2>
<ul>
<li><strong>Major ozon otohemoterapi:</strong> Kandan kan alınıp ozonlanarak geri verilir</li>
<li><strong>Minor ozon otohemoterapi:</strong> Küçük miktarda kan ozonlanır</li>
<li><strong>Lokal ozon:</strong> Yara bakımı ve cilt uygulamaları</li>
<li><strong>Rektal insüflasyon:</strong> Bağırsak sağlığı</li>
</ul>
<h2>Endikasyonları</h2>
<p>Kronik yorgunluk, bağışıklık düşüklüğü, cilt yenileme desteği, antiaging, kronik ağrı ve inflamasyon yönetiminde destek amaçlı kullanılır.</p>`,
  },
  {
    slug: 'damar-icine-glutatyon-uygulamasi',
    titles: {
      tr: 'Damar İçi Glutatyon Uygulaması',
      en: 'Intravenous Glutathione Treatment',
      ar: 'حقن الغلوتاثيون الوريدي',
      ru: 'Внутривенное введение глутатиона',
      fr: 'Injection intraveineuse de glutathion',
      de: 'Intravenöse Glutathion-Behandlung',
    },
    descriptions: {
      tr: 'Damar içi glutatyon — cilt aydınlatma, antioksidan destek ve gençleştirme için en güçlü doğal antioksidanın IV yoldan verilmesi.',
      en: 'Intravenous glutathione — the most potent natural antioxidant administered IV for skin brightening and anti-ageing.',
      ar: 'حقن الغلوتاثيون الوريدي — أقوى مضاد للأكسدة لتفتيح البشرة ومكافحة الشيخوخة.',
      ru: 'Внутривенный глутатион — сильнейший природный антиоксидант для осветления кожи и омоложения.',
      fr: 'Glutathion intraveineux — le plus puissant antioxydant naturel pour éclaircissement et anti-âge.',
      de: 'Intravenöses Glutathion — stärkstes natürliches Antioxidans zur Hautaufhellung und Verjüngung.',
    },
    content: `<h2>Glutatyon Nedir?</h2>
<p>Glutatyon, vücutta doğal olarak üretilen ancak stres, yaşlanma ve çevresel faktörlerle azalan üçlü bir peptittir. Damar içi (IV) uygulamada biyoyararlanımı oral takviyeye kıyasla çok daha yüksektir.</p>
<h2>Faydaları</h2>
<ul>
<li>Cilt aydınlatma ve ton eşitleme (melanin inhibisyonu)</li>
<li>Güçlü antioksidan koruma</li>
<li>Hücresel detoks desteği</li>
<li>Anti-aging etkisi</li>
<li>Bağışıklık sistemi güçlendirme</li>
</ul>
<h2>Uygulama Protokolü</h2>
<p>Glutatyon genellikle C vitamini ve diğer antioksidanlarla IV kokteyl şeklinde verilir. Haftada 1-2 seans, 8-12 seans protokol uygulanır. Her seans 30-60 dakika sürer. Yan etki profili son derece düşüktür.</p>`,
  },
  {
    slug: 'lipoliz-i-nceltme-mezoterapisi',
    titles: {
      tr: 'Lipoliz İnceltme Mezoterapisi',
      en: 'Lipolysis Slimming Mesotherapy',
      ar: 'ميزوثيرابي تحليل الدهون',
      ru: 'Мезотерапия для липолиза (похудения)',
      fr: 'Mésothérapie lipolytique (amincissante)',
      de: 'Lipolyse-Mesotherapie (Schlankheitsbehandlung)',
    },
    descriptions: {
      tr: 'Lipoliz mesoterapisi — lokal yağ birikimlerini çözdüren aktif madde enjeksiyonlarıyla bölgesel inceltme. Cerrahisiz, hızlı sonuç.',
      en: 'Lipolysis mesotherapy — dissolving localised fat deposits with active ingredient injections. Non-surgical slimming.',
      ar: 'ميزوثيرابي تحليل الدهون — إذابة الدهون الموضعية بالحقن دون جراحة.',
      ru: 'Липолиз-мезотерапия — растворение локальных жировых отложений инъекциями.',
      fr: 'Mésothérapie lipolytique — dissolution des graisses localisées par injections sans chirurgie.',
      de: 'Lipolyse-Mesotherapie — Auflösung lokaler Fettdepots durch Injektionen ohne Chirurgie.',
    },
    content: `<h2>Lipoliz Mezoterapisi Nedir?</h2>
<p>Lipoliz mezoterapisi, fosfoliditilkolin (PCDC) ve diğer lipoliz ajanlarının yağ dokusuna enjekte edilerek yağ hücrelerinin parçalanmasını ve uzaklaştırılmasını sağlayan non-cerrahi bir bölgesel inceltme yöntemidir.</p>
<h2>Uygulama Bölgeleri</h2>
<ul>
<li>Çift çene ve boyun altı yağlanması</li>
<li>Karın bölgesi lokal yağ</li>
<li>Sırt ve yan yağlanması</li>
<li>Bacak iç yüz</li>
<li>Göz altı yağ hernileri (hafif vakalar)</li>
</ul>
<h2>Seans Planı</h2>
<p>4-6 seans, 4 haftada bir uygulanır. Parçalanan yağ hücreleri lenf yoluyla vücuttan atılır. Her seans 30-45 dakika sürer. İşlem sonrası hafif şişlik ve hassasiyet 1-3 gün sürebilir.</p>`,
  },
  {
    slug: 'gidi-liposuction',
    titles: {
      tr: 'Gidi Liposuction (Lazerli Yağ Aldırma)',
      en: 'Laser-Assisted Liposuction (Vaser/Laser Lipo)',
      ar: 'شفط الدهون بالليزر',
      ru: 'Лазерная липосакция',
      fr: 'Liposuccion assistée par laser',
      de: 'Laser-Liposuktion',
    },
    descriptions: {
      tr: 'Lazerli liposuction — lazer enerjisiyle önce eritilen yağın ardından vakumla uzaklaştırıldığı minimal invaziv bölgesel incelme yöntemi.',
      en: 'Laser liposuction — liquefying fat with laser energy then removing it with gentle suction for body contouring.',
      ar: 'شفط الدهون بالليزر — إذابة الدهون بالليزر ثم شفطها لتشكيل الجسم.',
      ru: 'Лазерная липосакция — разжижение жира лазером с последующим его удалением.',
      fr: 'Liposuccion laser — liquéfaction de la graisse par laser puis aspiration pour modelage corporel.',
      de: 'Laser-Liposuktion — Auflösung von Fett mit Laserenergie dann Absaugung zur Körperformung.',
    },
    content: `<h2>Lazerli Liposuction Nedir?</h2>
<p>Lazerli liposuction, lazer enerjisinin yağ hücrelerini ısıtıp sıvılaştırmasının ardından ince kanüllerle uzaklaştırıldığı minimal invaziv bir vücut konturlama yöntemidir. Klasik liposuction'a kıyasla daha az kanama, daha hızlı iyileşme ve cilt sıkılaştırma avantajı sunar.</p>
<h2>Hedef Bölgeler</h2>
<ul>
<li>Karın ve bel</li>
<li>Kalça ve sırt</li>
<li>Uyluk iç ve dış yüz</li>
<li>Üst kollar</li>
<li>Boyun ve çene altı</li>
</ul>
<h2>Avantajları</h2>
<p>Lazer enerji cilt altında ısı oluşturarak cilt sıkılaşmasını da destekler. Genel anestezi yerine sedasyonla uygulanabilir. İyileşme süresi 1-2 hafta olup sonuçlar 3-6 ayda tam ortaya çıkar.</p>`,
  },
  {
    slug: 'skar-revizyonu-yara-izi-estetigi',
    titles: {
      tr: 'Skar Revizyonu (Yara İzi Estetiği)',
      en: 'Scar Revision',
      ar: 'مراجعة الندوب وتجميل آثار الجروح',
      ru: 'Коррекция рубцов',
      fr: 'Révision de cicatrices',
      de: 'Narbenkorrektur',
    },
    descriptions: {
      tr: 'Skar revizyonu — ameliyat, kaza veya akne sonucu oluşan yara izleri için cerrahi ve cerrahi olmayan düzeltme yöntemleri.',
      en: 'Scar revision — surgical and non-surgical treatments for post-operative, traumatic and acne scars.',
      ar: 'مراجعة الندوب — علاجات جراحية وغير جراحية لآثار الجروح بعد العمليات والحوادث وحب الشباب.',
      ru: 'Коррекция рубцов — хирургические и нехирургические методы лечения послеоперационных, травматических и акне-рубцов.',
      fr: 'Révision de cicatrices — traitements chirurgicaux et non chirurgicaux pour cicatrices post-opératoires, traumatiques et acné.',
      de: 'Narbenkorrektur — chirurgische und nicht-chirurgische Behandlungen für post-operative, traumatische und Aknenarben.',
    },
    content: `<h2>Skar Revizyonu Nedir?</h2>
<p>Skar revizyonu, ameliyat, travma veya enfeksiyon sonucu oluşan yara izlerinin estetik görünümünü ve doku kalitesini iyileştirmeye yönelik işlemler bütünüdür.</p>
<h2>Skar Tipleri ve Tedaviler</h2>
<ul>
<li><strong>Hipertrofik skar:</strong> Lazer, kortikosteroid enjeksiyonu, silikon jel</li>
<li><strong>Keloid:</strong> Cerrahi eksizyon + radyoterapi veya kortikosteroid</li>
<li><strong>Atrofik skar (akne izi):</strong> Mikro iğneleme, CO₂ lazer, dermal dolgu</li>
<li><strong>Kontraktür skarı:</strong> Cerrahi eksizyon ve Z/W-plasti</li>
</ul>
<h2>Tedavi Planlaması</h2>
<p>En az 12 ay bekleyerek skarın olgunlaşması tercih edilir. Her skar tipi ve lokalizasyonu için farklı bir yaklaşım gerekebilir. Çoğu vakada birden fazla seans ya da kombine yöntem uygulanır.</p>`,
  },
  {
    slug: 'migren-tedavisi',
    titles: {
      tr: 'Migren Tedavisi (Botoks)',
      en: 'Migraine Treatment (Botox)',
      ar: 'علاج الصداع النصفي (البوتوكس)',
      ru: 'Лечение мигрени (ботокс)',
      fr: 'Traitement de la migraine (Botox)',
      de: 'Migränebehandlung (Botox)',
    },
    descriptions: {
      tr: 'Kronik migren tedavisi — botulinum toksin ile ayda 15 günden fazla baş ağrısı yaşayan hastalarda FDA onaylı profilaktik tedavi. Ankara.',
      en: 'Chronic migraine treatment with Botox — FDA-approved prophylactic treatment for patients with 15+ headache days per month in Ankara.',
      ar: 'علاج الصداع النصفي المزمن بالبوتوكس — علاج وقائي معتمد من FDA للمرضى الذين يعانون من أكثر من 15 يوم صداع شهرياً.',
      ru: 'Лечение хронической мигрени ботоксом — одобренная FDA профилактика при 15+ днях головной боли в месяц.',
      fr: 'Traitement de la migraine chronique au Botox — prophylaxie approuvée FDA pour patients avec 15+ jours de céphalées par mois.',
      de: 'Chronische Migränebehandlung mit Botox — FDA-zugelassene Prophylaxe bei 15+ Kopfschmerztagen pro Monat.',
    },
    shortAnswers: {
      tr: 'Botoks ile migren tedavisi, ayda 15 gün ve üzeri baş ağrısı yaşayan kronik migren hastalarına 3 ayda bir uygulanan ve FDA onaylı bir profilaktik tedavidir.',
      en: 'Botox for chronic migraine is an FDA-approved preventive treatment applied every 3 months for patients experiencing 15+ headache days per month.',
      ar: 'البوتوكس لعلاج الصداع النصفي علاج وقائي معتمد من FDA يُطبق كل 3 أشهر.',
      ru: 'Ботокс при хронической мигрени — профилактическое лечение, одобренное FDA, применяется каждые 3 месяца.',
      fr: 'Botox pour migraine chronique — traitement préventif approuvé FDA administré tous les 3 mois.',
      de: 'Botox bei chronischer Migräne — FDA-zugelassene Vorbeugungsbehandlung alle 3 Monate.',
    },
    content: `<h2>Botoks ile Migren Tedavisi</h2>
<p>Kronik migren; ayda 15 gün veya daha fazla baş ağrısı yaşanan ve bunun en az 8 günü migrenin kriterlerini karşılayan bir hastalık tablosudur. OnabotulinumtoxinA (Botox), 2010 yılında FDA tarafından kronik migren profilaksisi için onaylanmıştır.</p>
<h2>Nasıl Uygulanır?</h2>
<p>31 ayrı noktaya, alın, şakak, ense ve boyun bölgelerine ince iğnelerle toplam ~155 ünite botoks enjekte edilir. İşlem 20-30 dakika sürer. Her 12 haftada bir tekrarlanır.</p>
<h2>Etkinlik</h2>
<p>Klinik çalışmalarda botoks ile migren günleri aylık ortalama 8-9 gün azalmıştır. Etki 2-3 seans sonrasında tam anlamıyla hissedilir. Kronik ağrı yönetiminde en az 2 yıl uygulanması önerilir.</p>`,
  },
];

async function seedService(data: ServiceData) {
  // Find the page
  const page = await prisma.page.findUnique({ where: { slug: data.slug } });
  if (!page) {
    console.log(`  SKIP: page not found for slug "${data.slug}"`);
    return;
  }

  let seoCreated = 0;
  let blockCreated = false;

  // Upsert SeoMeta for all 6 locales
  for (const locale of LOCALES) {
    await prisma.seoMeta.upsert({
      where: { pageId_locale: { pageId: page.id, locale } },
      create: {
        pageId: page.id,
        locale,
        metaTitle: data.titles[locale],
        metaDescription: data.descriptions[locale],
        shortAnswer: data.shortAnswers?.[locale] ?? null,
        robots: 'index,follow',
      },
      update: {
        metaTitle: data.titles[locale],
        metaDescription: data.descriptions[locale],
        shortAnswer: data.shortAnswers?.[locale] ?? null,
      },
    });
    seoCreated++;
  }

  // Check if a content block already exists
  const existingBlock = await prisma.contentBlock.findFirst({
    where: { pageId: page.id, componentType: 'zengin_metin' },
  });

  if (!existingBlock) {
    // Create content block with translations for all locales
    const block = await prisma.contentBlock.create({
      data: {
        pageId: page.id,
        componentType: 'zengin_metin',
        sortOrder: 1,
        isActive: true,
      },
    });

    // Create translations for each locale
    for (const locale of LOCALES) {
      const htmlContent = data.contentLocales?.[locale as Locale] ?? data.content;
      await prisma.translation.create({
        data: {
          blockId: block.id,
          locale,
          contentData: JSON.stringify({ html: htmlContent }),
        },
      });
    }
    blockCreated = true;
  }

  console.log(`  OK: ${data.slug} — ${seoCreated} SeoMeta upserted, block: ${blockCreated ? 'created' : 'already exists'}`);
}

async function main() {
  console.log(`Starting service seed — ${SERVICES.length} services`);
  let ok = 0;
  let skip = 0;

  for (const svc of SERVICES) {
    process.stdout.write(`Processing: ${svc.slug}...`);
    try {
      await seedService(svc);
      ok++;
    } catch (err) {
      console.error(`\n  ERROR: ${svc.slug} —`, err);
      skip++;
    }
  }

  console.log(`\nDone: ${ok} processed, ${skip} errors`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
