import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: { db: { url: 'postgresql://postgres.dqofmirqzyoumhzlndbv:GokceOzel2026db@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1' } }
});

// Pages that already have legacy_content - only update SEO
const SEO_ONLY_SLUGS = ['rinoplasti', 'gokce-ozel-kimdir'];

const PAGES = [
  {
    slug: 'cilt-soyma-kimyasal-peeling-i-slemleri',
    seoTitle: 'Cilt Soyma (Kimyasal Peeling) İşlemleri | Prof. Dr. Gökçe Özel',
    seoDesc: 'Kimyasal peeling ile cilt yenileme, leke ve kırışıklık tedavisi. Prof. Dr. Gökçe Özel\'in uzman uygulamaları hakkında bilgi alın.',
    tr: `<p>Kimyasal peeling (cilt soyma), yüz, boyun ve el gibi bölgelere kimyasal solüsyon uygulanarak cildin üst tabakalarının kontrollü biçimde soyulmasını sağlayan tıbbi bir estetik işlemdir. Bu işlem, yeni ve daha pürüzsüz cilt dokusunun yüzeye çıkmasına imkân tanır.</p>
<p>Yüzeysel, orta derinlikte ve derin olmak üzere üç ana kategoride uygulanan kimyasal peeling işlemi; lekelere, ince kırışıklıklara, akne izlerine ve düzensiz cilt dokusuna karşı etkili sonuçlar sunar. Kullanılan ajan konsantrasyonu ve uygulama süresi, hedeflenen derinliğe göre belirlenir.</p>
<p>Glikolik asit, salisilik asit, TCA (trikloroasetik asit) ve fenol gibi farklı kimyasal ajanlara dayanan peeling seçenekleri, cilt tipine ve tedavi hedefine göre kişiselleştirilir. Prof. Dr. Gökçe Özel, her hastanın cilt analizi sonucuna göre en uygun peeling protokolünü belirlemektedir.</p>
<p>İşlem sonrası hafif kızarıklık ve soyulma görülebilir; bu süreç, seçilen peeling derinliğine bağlı olarak birkaç günden iki haftaya kadar sürebilir. Güneşten korunma ve uygun nemlendirme, iyileşme sürecinin temel bileşenlerini oluşturur.</p>`,
    en: `<p>Chemical peeling is a medical aesthetic procedure in which a chemical solution is applied to areas such as the face, neck, and hands to controlled exfoliation of the skin's upper layers, revealing smoother, rejuvenated skin beneath.</p>
<p>Available in superficial, medium-depth, and deep categories, chemical peeling effectively addresses pigmentation, fine lines, acne scars, and uneven skin texture. The concentration of the agent and application time are determined according to the targeted depth.</p>
<p>Options based on agents such as glycolic acid, salicylic acid, TCA, and phenol are personalized according to skin type and treatment goals. Prof. Dr. Gökçe Özel determines the most appropriate peeling protocol based on each patient's skin analysis.</p>
<p>Mild redness and peeling may occur after the procedure; this process may last from a few days to two weeks depending on the selected peeling depth. Sun protection and proper moisturization are key components of the recovery process.</p>`,
    ar: `<p>التقشير الكيميائي هو إجراء تجميلي طبي يُطبَّق فيه محلول كيميائي على مناطق مثل الوجه والرقبة واليدين لتقشير الطبقات العلوية من الجلد بشكل متحكم به، مما يكشف عن جلد أكثر نعومة وتجددًا.</p>
<p>يتوفر التقشير الكيميائي في فئات السطحي ومتوسط العمق والعميق، ويعالج بفعالية التصبغات والخطوط الدقيقة وندوب حب الشباب وعدم انتظام ملمس الجلد. تُحدد تركيزات المادة الكيميائية ومدة التطبيق وفقًا للعمق المستهدف.</p>
<p>تُخصَّص الخيارات المبنية على مواد مثل حمض الجليكوليك وحمض الساليسيليك وTCA والفينول وفقًا لنوع الجلد وأهداف العلاج. تحدد البروفيسورة الدكتورة غوكتشه أوزيل أنسب بروتوكول للتقشير بناءً على تحليل جلد كل مريض.</p>
<p>قد تظهر بعض الاحمرار والتقشير الخفيف بعد الإجراء؛ وقد تستمر هذه العملية من بضعة أيام إلى أسبوعين حسب عمق التقشير المختار. الحماية من الشمس والترطيب المناسب من المكونات الأساسية لعملية التعافي.</p>`,
    ru: `<p>Химический пилинг — это медицинская эстетическая процедура, при которой на такие области, как лицо, шея и руки, наносится химический раствор для контролируемого отшелушивания верхних слоёв кожи, открывая более гладкую и обновлённую кожу.</p>
<p>Химический пилинг доступен в поверхностной, средней и глубокой категориях и эффективно устраняет пигментацию, мелкие морщины, рубцы от акне и неравномерную текстуру кожи. Концентрация агента и время нанесения определяются в зависимости от целевой глубины воздействия.</p>
<p>Варианты на основе гликолевой кислоты, салициловой кислоты, ТХУ и фенола персонализируются в соответствии с типом кожи и целями лечения. Проф. д-р Гёкче Озель определяет наиболее подходящий протокол пилинга на основе анализа кожи каждого пациента.</p>
<p>После процедуры может наблюдаться лёгкое покраснение и шелушение; этот процесс может длиться от нескольких дней до двух недель в зависимости от выбранной глубины пилинга. Защита от солнца и правильное увлажнение являются ключевыми компонентами восстановления.</p>`,
    fr: `<p>Le peeling chimique est une procédure esthétique médicale dans laquelle une solution chimique est appliquée sur des zones telles que le visage, le cou et les mains pour une exfoliation contrôlée des couches supérieures de la peau, révélant une peau plus lisse et rajeunie.</p>
<p>Disponible en catégories superficielles, de profondeur moyenne et profondes, le peeling chimique traite efficacement la pigmentation, les ridules, les cicatrices d'acné et la texture irrégulière de la peau. La concentration de l'agent et la durée d'application sont déterminées en fonction de la profondeur ciblée.</p>
<p>Les options basées sur des agents tels que l'acide glycolique, l'acide salicylique, le TCA et le phénol sont personnalisées en fonction du type de peau et des objectifs de traitement. Le Prof. Dr. Gökçe Özel détermine le protocole de peeling le plus approprié en fonction de l'analyse cutanée de chaque patient.</p>
<p>Une légère rougeur et desquamation peuvent survenir après la procédure ; ce processus peut durer de quelques jours à deux semaines selon la profondeur de peeling choisie. La protection solaire et une hydratation adéquate sont des composantes essentielles du processus de récupération.</p>`,
    de: `<p>Das chemische Peeling ist ein medizinisch-ästhetisches Verfahren, bei dem eine chemische Lösung auf Bereiche wie Gesicht, Hals und Hände aufgetragen wird, um eine kontrollierte Exfoliation der oberen Hautschichten zu erreichen und glattere, verjüngte Haut freizulegen.</p>
<p>In oberflächlichen, mitteltiefe und tiefe Kategorien unterteilt, behandelt das chemische Peeling effektiv Pigmentierung, feine Linien, Aknenarben und ungleichmäßige Hauttextur. Die Konzentration des Mittels und die Anwendungszeit werden entsprechend der Zieltiefe bestimmt.</p>
<p>Optionen auf Basis von Agentien wie Glykolsäure, Salicylsäure, TCA und Phenol werden entsprechend Hauttyp und Behandlungszielen individualisiert. Prof. Dr. Gökçe Özel bestimmt das geeignetste Peeling-Protokoll auf Grundlage der Hautanalyse jedes Patienten.</p>
<p>Nach dem Eingriff können leichte Rötungen und Schuppungen auftreten; dieser Prozess kann je nach gewählter Peeling-Tiefe einige Tage bis zwei Wochen dauern. Sonnenschutz und angemessene Feuchtigkeitspflege sind wesentliche Komponenten des Erholungsprozesses.</p>`
  },
  {
    slug: 'ameliyatsiz-kas-kaldirma',
    seoTitle: 'Ameliyatsız Kaş Kaldırma | Prof. Dr. Gökçe Özel',
    seoDesc: 'Ameliyat gerektirmeyen kaş kaldırma yöntemleri: botoks, dolgu ve ip ile doğal görünümlü sonuçlar. Prof. Dr. Gökçe Özel klinik bilgisi.',
    tr: `<p>Ameliyatsız kaş kaldırma, cerrahi müdahale gerektirmeksizin kaş konumunu yukarı taşıyan ve göz çevresini daha genç, dinç bir görünüme kavuşturan minimal invaziv estetik uygulamaları kapsayan bir tedavi kategorisidir.</p>
<p>Bu kategorideki başlıca yöntemler; botulinum toksin enjeksiyonu, hyalüronik asit dolgu uygulaması ve eriyebilir iplerle yapılan kaş askısı işlemlerini içermektedir. Her yöntem, farklı kaş düşüklüğü derecelerine ve hastanın beklentilerine göre tercih edilir.</p>
<p>Botoks uygulaması, kaşı aşağı çeken kasları gevşeterek doğal bir kaldırma etkisi sağlar; dolgu uygulaması ise kaş altına hacim katarak pozisyonu yukarı taşır. İp askısı yöntemi, biyouyumlu iplerle mekanik bir kaldırma efekti oluşturur.</p>
<p>Prof. Dr. Gökçe Özel, hastanın yüz anatomisi ve kaş düşüklüğünün nedenini değerlendirerek en uygun ameliyatsız kaş kaldırma seçeneğini belirlemektedir. İşlemler genellikle 15-30 dakika içinde tamamlanır ve günlük yaşama dönüş neredeyse anında gerçekleşir.</p>`,
    en: `<p>Non-surgical brow lifting encompasses a category of minimally invasive aesthetic treatments that reposition the brow upward and give a younger, more refreshed appearance to the periorbital area without surgical intervention.</p>
<p>The main methods in this category include botulinum toxin injections, hyaluronic acid filler applications, and thread brow suspension procedures. Each method is preferred according to different degrees of brow ptosis and patient expectations.</p>
<p>Botox application provides a natural lifting effect by relaxing the muscles that pull the brow downward; filler application raises the position by adding volume beneath the brow. The thread suspension method creates a mechanical lifting effect with biocompatible threads.</p>
<p>Prof. Dr. Gökçe Özel determines the most appropriate non-surgical brow lifting option by evaluating the patient's facial anatomy and the cause of brow descent. Procedures are typically completed within 15-30 minutes with virtually no downtime.</p>`,
    ar: `<p>رفع الحاجب غير الجراحي يشمل فئة من العلاجات التجميلية الأقل توغلاً التي تعيد تموضع الحاجب للأعلى وتمنح مظهرًا أكثر شبابًا وانتعاشًا للمنطقة المحيطة بالعين دون تدخل جراحي.</p>
<p>تشمل الطرق الرئيسية في هذه الفئة حقن توكسين البوتولينوم وتطبيقات حشوة حمض الهيالورونيك وإجراءات تعليق الحاجب بالخيوط. يُفضَّل كل أسلوب وفقًا لدرجات مختلفة من هبوط الحاجب وتوقعات المريض.</p>
<p>يوفر تطبيق البوتوكس تأثير رفع طبيعي عن طريق إرخاء العضلات التي تسحب الحاجب للأسفل؛ بينما يرفع تطبيق الحشوة الموضع عن طريق إضافة حجم تحت الحاجب. تخلق طريقة تعليق الخيوط تأثير رفع ميكانيكي بخيوط متوافقة حيويًا.</p>
<p>تحدد البروفيسورة الدكتورة غوكتشه أوزيل الخيار الأنسب لرفع الحاجب غير الجراحي من خلال تقييم تشريح وجه المريض وسبب هبوط الحاجب. تكتمل الإجراءات عادةً في غضون 15-30 دقيقة مع عودة فورية تقريبًا للحياة اليومية.</p>`,
    ru: `<p>Безоперационный подъём бровей охватывает категорию малоинвазивных эстетических процедур, которые перемещают бровь вверх и придают более молодой и свежий вид периорбитальной области без хирургического вмешательства.</p>
<p>Основные методы в этой категории включают инъекции ботулинического токсина, применение наполнителей на основе гиалуроновой кислоты и процедуры подвешивания бровей нитями. Каждый метод выбирается в соответствии со степенью птоза брови и ожиданиями пациента.</p>
<p>Ботокс обеспечивает естественный эффект подъёма за счёт расслабления мышц, тянущих бровь вниз; наполнитель поднимает положение за счёт добавления объёма под бровью. Метод нитевой подвески создаёт механический эффект подъёма с помощью биосовместимых нитей.</p>
<p>Проф. д-р Гёкче Озель определяет наиболее подходящий вариант безоперационного подъёма брови, оценивая анатомию лица пациента и причину опускания брови. Процедуры обычно завершаются в течение 15-30 минут практически без периода восстановления.</p>`,
    fr: `<p>Le lifting des sourcils non chirurgical englobe une catégorie de traitements esthétiques minimalement invasifs qui repositionnent le sourcil vers le haut et donnent une apparence plus jeune et plus fraîche à la région périorbitaire sans intervention chirurgicale.</p>
<p>Les principales méthodes dans cette catégorie comprennent les injections de toxine botulique, les applications de charge d'acide hyaluronique et les procédures de suspension des sourcils par fils. Chaque méthode est préférée selon différents degrés de ptose du sourcil et les attentes du patient.</p>
<p>L'application de botox fournit un effet de lifting naturel en relaxant les muscles qui tirent le sourcil vers le bas ; l'application de charge soulève la position en ajoutant du volume sous le sourcil. La méthode de suspension par fils crée un effet de lifting mécanique avec des fils biocompatibles.</p>
<p>Le Prof. Dr. Gökçe Özel détermine l'option de lifting non chirurgical des sourcils la plus appropriée en évaluant l'anatomie faciale du patient et la cause de la descente du sourcil. Les procédures sont généralement terminées en 15 à 30 minutes avec pratiquement aucun temps de récupération.</p>`,
    de: `<p>Das nicht-chirurgische Brauenlifting umfasst eine Kategorie minimal-invasiver ästhetischer Behandlungen, die die Braue nach oben repositionieren und dem periorbitalen Bereich ohne chirurgischen Eingriff ein jüngeres, frischeres Erscheinungsbild verleihen.</p>
<p>Die Hauptmethoden in dieser Kategorie umfassen Botulinumtoxin-Injektionen, Hyaluronsäure-Filler-Anwendungen und Brauen-Aufhängungsverfahren mit Fäden. Jede Methode wird je nach Grad der Brauen-Ptose und den Patientenerwartungen bevorzugt.</p>
<p>Die Botox-Anwendung erzielt einen natürlichen Liftingeffekt durch Entspannung der Muskeln, die die Braue nach unten ziehen; die Filler-Anwendung hebt die Position durch Volumenergänzung unter der Braue an. Die Fadenaufhängemethode erzeugt einen mechanischen Liftingeffekt mit biokompatiblen Fäden.</p>
<p>Prof. Dr. Gökçe Özel bestimmt die geeignetste Option für das nicht-chirurgische Brauenlifting durch Beurteilung der Gesichtsanatomie des Patienten und der Ursache des Brauenabfalls. Eingriffe werden in der Regel innerhalb von 15-30 Minuten abgeschlossen mit praktisch keiner Ausfallzeit.</p>`
  },
  {
    slug: 'badem-goz-estetigi',
    seoTitle: 'Badem Göz Estetiği | Prof. Dr. Gökçe Özel',
    seoDesc: 'Badem göz estetiği ile oval, çekici göz şekli. Kantoplasti ve kanto modifikasyon teknikleri hakkında uzman bilgisi.',
    tr: `<p>Badem göz estetiği, göz kenarlarının şekillendirilmesi yoluyla gözlere badem biçiminde, yatay olarak uzamış ve daha ifadeli bir görünüm kazandırmayı hedefleyen cerrahi ya da minimal invaziv bir estetik uygulamadır.</p>
<p>Bu prosedür, genellikle lateral kantoplasti veya kanto modifikasyonu tekniğiyle gerçekleştirilir. Dış göz köşesinin yeniden konumlandırılmasıyla gözün geometrisi değiştirilir; yuvarlak ve küçük görünen gözler daha çekici bir badem formuna kavuşturulur.</p>
<p>Estetik açıdan ideal kabul edilen badem göz şekli; pozitif kanthal açı, belirgin lateral kantal çekme ve alt kapak marjininin pupil seviyesinin altında konumlanması ile karakterize edilir. Bu parametreler, operasyonun planlanmasında belirleyici rol oynar.</p>
<p>Prof. Dr. Gökçe Özel, göz kapağı anatomisini ve yüz simetrisini titizlikle değerlendirerek kişiye özel bir badem göz planı hazırlamaktadır. Kalıcı ve doğal görünümlü sonuçlar elde etmek için yüksek hassasiyetli cerrahi teknikler uygulanmaktadır.</p>`,
    en: `<p>Almond eye aesthetics is a surgical or minimally invasive procedure aimed at giving the eyes an almond-shaped, horizontally elongated, and more expressive appearance through reshaping of the eye corners.</p>
<p>This procedure is typically performed using lateral canthoplasty or canthal modification technique. By repositioning the outer eye corner, the geometry of the eye is altered; round and small-appearing eyes are transformed into a more attractive almond shape.</p>
<p>The almond eye shape considered aesthetically ideal is characterized by a positive canthal tilt, prominent lateral canthal inclination, and the lower lid margin positioned below the pupil level. These parameters play a decisive role in surgical planning.</p>
<p>Prof. Dr. Gökçe Özel carefully evaluates eyelid anatomy and facial symmetry to prepare a personalized almond eye plan. High-precision surgical techniques are applied to achieve permanent and natural-looking results.</p>`,
    ar: `<p>جماليات عيون اللوز هي إجراء جراحي أو أقل توغلاً يهدف إلى إضفاء شكل اللوز والامتداد الأفقي والمظهر الأكثر تعبيرًا للعيون من خلال إعادة تشكيل زوايا العين.</p>
<p>يُنفَّذ هذا الإجراء عادةً باستخدام تقنية رأب الزاوية الجانبية أو تعديل الزاوية. من خلال إعادة تموضع الزاوية الخارجية للعين، يتغير شكل العين؛ وتتحول العيون الدائرية الصغيرة إلى شكل لوز أكثر جاذبية.</p>
<p>يتميز شكل عيون اللوز المثالي جماليًا بزاوية زاوية إيجابية وميل زاوي جانبي بارز وهامش الجفن السفلي الموضوع أسفل مستوى الحدقة. تلعب هذه المعاملات دورًا حاسمًا في التخطيط الجراحي.</p>
<p>تقيّم البروفيسورة الدكتورة غوكتشه أوزيل تشريح جفن العين وتماثل الوجه بعناية لإعداد خطة مخصصة لعيون اللوز. تُطبَّق تقنيات جراحية عالية الدقة لتحقيق نتائج دائمة وطبيعية المظهر.</p>`,
    ru: `<p>Эстетика миндалевидных глаз — хирургическая или малоинвазивная процедура, направленная на придание глазам миндалевидной, горизонтально удлинённой и более выразительной формы посредством коррекции уголков глаз.</p>
<p>Процедура обычно выполняется с помощью латеральной кантопластики или техники модификации канта. Путём изменения положения наружного уголка глаза изменяется геометрия глаза; круглые и небольшие глаза приобретают более привлекательную миндалевидную форму.</p>
<p>Эстетически идеальная форма миндалевидного глаза характеризуется положительным кантальным наклоном, выраженным латеральным кантальным наклоном и нижним краем века, расположенным ниже уровня зрачка. Эти параметры играют решающую роль в планировании операции.</p>
<p>Проф. д-р Гёкче Озель тщательно оценивает анатомию век и симметрию лица для разработки индивидуального плана по созданию миндалевидных глаз. Применяются высокоточные хирургические техники для достижения стойких и естественно выглядящих результатов.</p>`,
    fr: `<p>L'esthétique des yeux en amande est une procédure chirurgicale ou minimalement invasive visant à donner aux yeux une apparence en forme d'amande, allongée horizontalement et plus expressive grâce au remodelage des coins des yeux.</p>
<p>Cette procédure est généralement réalisée à l'aide de la canthoplastie latérale ou de la technique de modification canthale. En repositionnant le coin externe de l'œil, la géométrie de l'œil est modifiée ; les yeux ronds et petits sont transformés en une forme d'amande plus attrayante.</p>
<p>La forme d'œil en amande considérée comme esthétiquement idéale est caractérisée par une inclinaison canthale positive, une inclinaison canthale latérale prononcée et la marge de la paupière inférieure positionnée sous le niveau de la pupille. Ces paramètres jouent un rôle décisif dans la planification chirurgicale.</p>
<p>Le Prof. Dr. Gökçe Özel évalue soigneusement l'anatomie des paupières et la symétrie faciale pour préparer un plan personnalisé pour les yeux en amande. Des techniques chirurgicales de haute précision sont appliquées pour obtenir des résultats permanents et naturels.</p>`,
    de: `<p>Die Mandelaugen-Ästhetik ist ein chirurgisches oder minimal-invasives Verfahren, das darauf abzielt, den Augen durch Umformung der Augenwinkel ein mandelförmiges, horizontal verlängertes und ausdrucksvolleres Erscheinungsbild zu verleihen.</p>
<p>Dieses Verfahren wird typischerweise mit der lateralen Kanthoplastik oder der Kanthal-Modifikationstechnik durchgeführt. Durch die Neupositionierung des äußeren Augenwinkels wird die Geometrie des Auges verändert; rund und klein erscheinende Augen werden in eine attraktivere Mandelform umgewandelt.</p>
<p>Die als ästhetisch ideal geltende Mandelaugenform ist durch einen positiven Kanthalneigungswinkel, eine ausgeprägte laterale Kanthalneigung und den unteren Lidrand unterhalb der Pupillenebene charakterisiert. Diese Parameter spielen bei der chirurgischen Planung eine entscheidende Rolle.</p>
<p>Prof. Dr. Gökçe Özel bewertet sorgfältig die Lidanatomie und Gesichtssymmetrie, um einen personalisierten Mandelaugenplan zu erstellen. Hochpräzise chirurgische Techniken werden angewendet, um dauerhafte und natürlich aussehende Ergebnisse zu erzielen.</p>`
  },
  {
    slug: 'bisektomi',
    seoTitle: 'Bisektomi (Burun Ameliyatı) | Prof. Dr. Gökçe Özel',
    seoDesc: 'Bisektomi, burun yapısındaki belirli dokuların çıkarılmasını içeren cerrahi bir rinoplasti tekniğidir. Uzman bilgisi için inceleyin.',
    tr: `<p>Bisektomi, rinoplasti cerrahisi kapsamında değerlendirilen ve burun yapısındaki belirli kemik veya kıkırdak dokularının çıkarılmasını ya da rezeksiyonunu içeren cerrahi bir tekniktir. Bu prosedür, özellikle burun sırtındaki aşırı kemik ve kıkırdak dokusu varlığında tercih edilmektedir.</p>
<p>Operasyon, kapalı veya açık rinoplasti yaklaşımıyla gerçekleştirilebilir. Cerraha göre ve hastanın anatomik özelliklerine göre teknik seçimi yapılır. Bisektomi işlemi, genellikle daha kapsamlı bir rinoplasti prosedürünün bir parçası olarak uygulanır.</p>
<p>Burun sırtında belirgin bir hörgüç (kambur) varlığı, bisektominin en sık endikasyonları arasında yer alır. Kemik ve kıkırdak hörgücün rezeksiyonu ile burun profili düzleştirilir ve yüz hatlarıyla daha uyumlu bir görünüm elde edilir.</p>
<p>Prof. Dr. Gökçe Özel, preoperatif değerlendirmede 3D görüntüleme teknolojisinden yararlanarak bisektomi ve ilişkili prosedürlerin kapsamını belirlemektedir. Bu yaklaşım, ameliyat sonucu hakkında hasta ile şeffaf bir iletişim kurulmasını sağlar.</p>`,
    en: `<p>Bisectomy is a surgical technique within the scope of rhinoplasty surgery involving the removal or resection of specific bone or cartilage tissues in the nasal structure. This procedure is particularly preferred when there is excessive bone and cartilage tissue on the nasal dorsum.</p>
<p>The operation can be performed via closed or open rhinoplasty approach. Technical selection is made according to the surgeon and the patient's anatomical characteristics. The bisectomy procedure is typically applied as part of a more comprehensive rhinoplasty procedure.</p>
<p>The presence of a prominent hump on the nasal dorsum is among the most common indications for bisectomy. By resecting the bone and cartilage hump, the nasal profile is flattened and a more harmonious appearance with facial features is achieved.</p>
<p>Prof. Dr. Gökçe Özel utilizes 3D imaging technology in preoperative evaluation to determine the scope of bisectomy and related procedures, enabling transparent communication with the patient about the surgical outcome.</p>`,
    ar: `<p>الاستئصال الثنائي هو تقنية جراحية في نطاق جراحة رأب الأنف تتضمن إزالة أو استئصال أنسجة عظمية أو غضروفية محددة في بنية الأنف. يُفضَّل هذا الإجراء بشكل خاص عند وجود أنسجة عظمية وغضروفية مفرطة على ظهر الأنف.</p>
<p>يمكن إجراء العملية عبر نهج رأب الأنف المغلق أو المفتوح. يتم اختيار التقنية وفقًا للجراح والخصائص التشريحية للمريض. يُطبَّق إجراء الاستئصال الثنائي عادةً كجزء من إجراء رأب أنف أكثر شمولاً.</p>
<p>يُعد وجود حدبة بارزة على ظهر الأنف من أكثر مؤشرات الاستئصال الثنائي شيوعًا. من خلال استئصال الحدبة العظمية والغضروفية، يتسطح ملف الأنف ويُحقق مظهر أكثر انسجامًا مع ملامح الوجه.</p>
<p>تستخدم البروفيسورة الدكتورة غوكتشه أوزيل تقنية التصوير ثلاثي الأبعاد في التقييم قبل الجراحي لتحديد نطاق الاستئصال الثنائي والإجراءات ذات الصلة، مما يتيح التواصل الشفاف مع المريض بشأن نتيجة الجراحة.</p>`,
    ru: `<p>Бисектомия — хирургическая техника в рамках ринопластики, включающая удаление или резекцию определённых костных или хрящевых тканей в структуре носа. Эта процедура особенно предпочтительна при наличии избыточной костной и хрящевой ткани на спинке носа.</p>
<p>Операция может выполняться закрытым или открытым доступом ринопластики. Выбор техники осуществляется в зависимости от хирурга и анатомических особенностей пациента. Процедура бисектомии обычно применяется как часть более комплексной процедуры ринопластики.</p>
<p>Наличие выраженного горба на спинке носа является одним из наиболее распространённых показаний к бисектомии. Путём резекции костно-хрящевого горба профиль носа выравнивается, и достигается более гармоничный вид с чертами лица.</p>
<p>Проф. д-р Гёкче Озель использует технологию 3D-визуализации при предоперационной оценке для определения объёма бисектомии и связанных процедур, обеспечивая прозрачное общение с пациентом о результатах операции.</p>`,
    fr: `<p>La bisectomie est une technique chirurgicale dans le cadre de la rhinoplastie impliquant l'ablation ou la résection de tissus osseux ou cartilagineux spécifiques dans la structure nasale. Cette procédure est particulièrement préférée en cas de présence excessive de tissus osseux et cartilagineux sur le dos du nez.</p>
<p>L'opération peut être réalisée par approche de rhinoplastie fermée ou ouverte. La sélection technique est effectuée en fonction du chirurgien et des caractéristiques anatomiques du patient. La procédure de bisectomie est généralement appliquée dans le cadre d'une procédure de rhinoplastie plus complète.</p>
<p>La présence d'une bosse proéminente sur le dos du nez est l'une des indications les plus courantes pour la bisectomie. En réséquant la bosse osseuse et cartilagineuse, le profil nasal est aplati et une apparence plus harmonieuse avec les traits du visage est obtenue.</p>
<p>Le Prof. Dr. Gökçe Özel utilise la technologie d'imagerie 3D lors de l'évaluation préopératoire pour déterminer la portée de la bisectomie et des procédures associées, permettant une communication transparente avec le patient sur le résultat chirurgical.</p>`,
    de: `<p>Die Bisektomie ist eine chirurgische Technik im Rahmen der Rhinoplastik-Chirurgie, die die Entfernung oder Resektion spezifischer Knochen- oder Knorpelgewebe in der Nasenstruktur umfasst. Dieses Verfahren wird besonders bevorzugt, wenn übermäßiges Knochen- und Knorpelgewebe am Nasenrücken vorhanden ist.</p>
<p>Die Operation kann über den geschlossenen oder offenen Rhinoplastik-Zugang durchgeführt werden. Die technische Auswahl erfolgt entsprechend dem Chirurgen und den anatomischen Merkmalen des Patienten. Das Bisektomie-Verfahren wird typischerweise als Teil einer umfassenderen Rhinoplastik-Prozedur angewendet.</p>
<p>Das Vorhandensein eines ausgeprägten Höckers am Nasenrücken gehört zu den häufigsten Indikationen für eine Bisektomie. Durch Resektion des Knochen- und Knorpelhöckers wird das Nasenprofil abgeflacht und ein harmonischeres Erscheinungsbild mit den Gesichtszügen erzielt.</p>
<p>Prof. Dr. Gökçe Özel nutzt 3D-Bildgebungstechnologie bei der präoperativen Beurteilung, um den Umfang der Bisektomie und verwandter Verfahren zu bestimmen und eine transparente Kommunikation mit dem Patienten über das chirurgische Ergebnis zu ermöglichen.</p>`
  },
  {
    slug: 'botoks-ile-kas-kaldirma',
    seoTitle: 'Botoks ile Kaş Kaldırma | Prof. Dr. Gökçe Özel',
    seoDesc: 'Botoks enjeksiyonu ile ameliyatsız kaş kaldırma yöntemi, doğal görünümlü sonuçlar ve hızlı iyileşme süreci hakkında bilgi alın.',
    tr: `<p>Botoks ile kaş kaldırma, botulinum toksin tip A enjeksiyonu kullanılarak kaşı aşağı çeken frontal ve orbital kasların seçici olarak gevşetilmesi prensibine dayanan, ameliyat gerektirmeyen bir estetik işlemdir.</p>
<p>Kaşın doğal pozisyonunu aşağıya çeken orbicularis oculi kasının dış üst bölümü ile depressor supercilii kası, uygun dozlarda botulinum toksine maruz bırakılır. Bu gevşeme sayesinde kaş kaldırıcı kas olan frontalis kasının aktivitesi ön plana geçer ve kaş doğal olarak yukarı taşınır.</p>
<p>Uygulama, özellikle hafif ile orta düzey kaş düşüklüğü olan hastalarda belirgin sonuçlar vermektedir. Kaş pozisyonunda ortalama 1-3 mm'lik bir kaldırma elde edilir; bu miktar, göz çevresini kayda değer biçimde canlandırır ve yorgun ifadeyi azaltır.</p>
<p>Prof. Dr. Gökçe Özel, her hastanın kas anatomisine uygun bir enjeksiyon haritası hazırlamakta ve işlemi hassas tekniklerle gerçekleştirmektedir. Etki süresi yaklaşık 4-6 ay olup tekrar uygulamalarla sonuç kalıcı hale getirilebilir.</p>`,
    en: `<p>Brow lifting with Botox is a non-surgical aesthetic procedure based on the principle of selectively relaxing the frontal and orbital muscles that pull the brow downward using botulinum toxin type A injection.</p>
<p>The outer upper portion of the orbicularis oculi muscle, which naturally pulls the brow down, and the depressor supercilii muscle are exposed to appropriate doses of botulinum toxin. Through this relaxation, the activity of the frontalis muscle (the brow elevator) comes to the fore and the brow is naturally lifted upward.</p>
<p>The application produces significant results especially in patients with mild to moderate brow ptosis. An average lift of 1-3 mm in brow position is achieved; this amount noticeably rejuvenates the periorbital area and reduces a tired expression.</p>
<p>Prof. Dr. Gökçe Özel prepares an injection map appropriate to each patient's muscle anatomy and performs the procedure with precise techniques. The duration of effect is approximately 4-6 months, and results can be made more permanent with repeat applications.</p>`,
    ar: `<p>رفع الحاجب بالبوتوكس هو إجراء جمالي غير جراحي يقوم على مبدأ إرخاء العضلات الأمامية والمحجرية التي تسحب الحاجب للأسفل بشكل انتقائي باستخدام حقن توكسين البوتولينوم من النوع أ.</p>
<p>يتعرض الجزء العلوي الخارجي من عضلة الدائرية للعين، التي تسحب الحاجب طبيعيًا للأسفل، وعضلة الخافض للحاجب لجرعات مناسبة من توكسين البوتولينوم. من خلال هذا الاسترخاء، تتقدم نشاط عضلة الجبهة (رافعة الحاجب) وترتفع الحاجب طبيعيًا للأعلى.</p>
<p>يُنتج التطبيق نتائج ملحوظة خاصةً لدى المرضى ذوي هبوط الحاجب الخفيف إلى المتوسط. يُحقق رفع متوسط يتراوح بين 1-3 مم في موضع الحاجب؛ هذا المقدار يُنعش بشكل ملحوظ المنطقة المحيطة بالعين ويقلل من المظهر المتعب.</p>
<p>تُعد البروفيسورة الدكتورة غوكتشه أوزيل خريطة حقن مناسبة لتشريح عضلات كل مريض وتُنفذ الإجراء بتقنيات دقيقة. تبلغ مدة التأثير نحو 4-6 أشهر، ويمكن جعل النتائج أكثر ديمومة مع التطبيقات المتكررة.</p>`,
    ru: `<p>Подъём брови с ботоксом — нехирургическая эстетическая процедура, основанная на принципе избирательного расслабления лобных и орбитальных мышц, тянущих бровь вниз, с помощью инъекции ботулинического токсина типа А.</p>
<p>Верхняя наружная часть круговой мышцы глаза, которая естественным образом тянет бровь вниз, и мышца depressor supercilii подвергаются воздействию подходящих доз ботулинического токсина. Благодаря этому расслаблению на первый план выходит активность лобной мышцы (подъёмника брови), и бровь естественно поднимается вверх.</p>
<p>Процедура даёт значительные результаты особенно у пациентов с лёгким и умеренным птозом брови. Достигается подъём брови в среднем на 1-3 мм; это заметно омолаживает периорбитальную область и уменьшает усталое выражение.</p>
<p>Проф. д-р Гёкче Озель подготавливает карту инъекций, соответствующую анатомии мышц каждого пациента, и выполняет процедуру с использованием точных техник. Продолжительность эффекта составляет приблизительно 4-6 месяцев, а результаты могут быть сделаны более стойкими при повторных процедурах.</p>`,
    fr: `<p>Le lifting des sourcils avec le botox est une procédure esthétique non chirurgicale basée sur le principe du relâchement sélectif des muscles frontaux et orbitaux qui tirent le sourcil vers le bas à l'aide d'une injection de toxine botulique de type A.</p>
<p>La portion supérieure externe du muscle orbiculaire des yeux, qui tire naturellement le sourcil vers le bas, et le muscle dépresseur du sourcil sont exposés à des doses appropriées de toxine botulique. Grâce à ce relâchement, l'activité du muscle frontal (l'élévateur du sourcil) prend le dessus et le sourcil est naturellement soulevé vers le haut.</p>
<p>L'application produit des résultats significatifs notamment chez les patients présentant une ptose légère à modérée du sourcil. Un soulèvement moyen de 1 à 3 mm de la position du sourcil est obtenu ; ce montant rajeunit notablement la région périorbitaire et réduit une expression fatiguée.</p>
<p>Le Prof. Dr. Gökçe Özel prépare une carte d'injection adaptée à l'anatomie musculaire de chaque patient et effectue la procédure avec des techniques précises. La durée de l'effet est d'environ 4 à 6 mois, et les résultats peuvent être rendus plus permanents avec des applications répétées.</p>`,
    de: `<p>Das Brauenlifting mit Botox ist ein nicht-chirurgisches ästhetisches Verfahren, das auf dem Prinzip der selektiven Entspannung der Stirn- und Orbitalmuskeln basiert, die die Braue nach unten ziehen, mithilfe einer Botulinumtoxin-Typ-A-Injektion.</p>
<p>Der äußere obere Teil des Musculus orbicularis oculi, der die Braue natürlicherweise nach unten zieht, und der Musculus depressor supercilii werden geeigneten Dosen von Botulinumtoxin ausgesetzt. Durch diese Entspannung tritt die Aktivität des Musculus frontalis (des Brauenhebemuskels) in den Vordergrund und die Braue wird natürlich nach oben angehoben.</p>
<p>Die Anwendung erzeugt insbesondere bei Patienten mit leichter bis mittelschwerer Brauen-Ptose signifikante Ergebnisse. Es wird ein durchschnittlicher Lift von 1-3 mm in der Brauenposition erzielt; diese Menge verjüngt die periorbitale Region merklich und reduziert einen müden Gesichtsausdruck.</p>
<p>Prof. Dr. Gökçe Özel erstellt eine Injektionskarte entsprechend der Muskelanatomie jedes Patienten und führt den Eingriff mit präzisen Techniken durch. Die Wirkungsdauer beträgt etwa 4-6 Monate, und Ergebnisse können durch Wiederholungsanwendungen dauerhafter gemacht werden.</p>`
  },
  {
    slug: 'botulinum-toksin-uygulamasi',
    seoTitle: 'Botulinum Toksin Uygulaması | Prof. Dr. Gökçe Özel',
    seoDesc: 'Botulinum toksin enjeksiyonu ile kırışıklık tedavisi, mimik kaslarının gevşetilmesi ve yüz gençleştirme hakkında detaylı bilgi.',
    tr: `<p>Botulinum toksin uygulaması, Clostridium botulinum bakterisinden elde edilen ve kas aktivitesini geçici olarak azaltan nörotoksinin tıbbi estetik amaçlı kullanımını ifade etmektedir. Dünya genelinde en yaygın uygulanan estetik işlemler arasında yer alan bu yöntem, güvenilirliği ve etkinliği ile ön plana çıkmaktadır.</p>
<p>Temel etki mekanizması, sinir-kas kavşağında asetilkolin salınımını bloke ederek hedef kasın kasılma yeteneğini geçici olarak ortadan kaldırmaktır. Bu mekanizma; alın kırışıklıkları, glabella çizgileri (kaşlar arası), göz kenarı kırışıklıkları (kaz ayağı) ve boyun bantları gibi mimik kaynaklı kırışıklıkların tedavisinde kullanılır.</p>
<p>Estetik endikasyonlar dışında botulinum toksin; aşırı terleme (hiperhidroz), diş gıcırdatma (bruksizm), migren profilaksisi ve masseter hipertrofisi (yüz inceltme) gibi tıbbi durumlarda da etkin biçimde kullanılmaktadır.</p>
<p>Prof. Dr. Gökçe Özel, her uygulamayı hasta anatomisine ve tedavi hedeflerine göre kişiselleştirmektedir. Kullanılan ürünler uluslararası standartları karşılamakta olup enjeksiyonlar kliniğimizin steril ortamında uygulanmaktadır.</p>`,
    en: `<p>Botulinum toxin application refers to the medical-aesthetic use of neurotoxin derived from Clostridium botulinum bacteria that temporarily reduces muscle activity. Among the most widely performed aesthetic procedures worldwide, this method stands out for its safety and efficacy.</p>
<p>The basic mechanism of action is to temporarily eliminate the target muscle's ability to contract by blocking acetylcholine release at the neuromuscular junction. This mechanism is used in the treatment of expression-related wrinkles such as forehead lines, glabellar lines (between the brows), periorbital wrinkles (crow's feet), and neck bands.</p>
<p>Beyond aesthetic indications, botulinum toxin is also effectively used in medical conditions such as excessive sweating (hyperhidrosis), teeth grinding (bruxism), migraine prophylaxis, and masseter hypertrophy (facial slimming).</p>
<p>Prof. Dr. Gökçe Özel personalizes each application according to patient anatomy and treatment goals. Products used meet international standards, and injections are administered in the sterile environment of our clinic.</p>`,
    ar: `<p>تطبيق توكسين البوتولينوم يشير إلى الاستخدام التجميلي الطبي للعصب السام المشتق من بكتيريا المطثية الوشيقية التي تقلل مؤقتًا من نشاط العضلات. من بين أكثر الإجراءات التجميلية انتشارًا في العالم، تتميز هذه الطريقة بسلامتها وفعاليتها.</p>
<p>آلية العمل الأساسية هي التخلص مؤقتًا من قدرة العضلة المستهدفة على الانقباض عن طريق حجب إطلاق الأسيتيل كولين عند الوصلة العصبية العضلية. تُستخدم هذه الآلية في علاج التجاعيد المرتبطة بالتعبير مثل خطوط الجبهة وخطوط الجلابيلا وتجاعيد المحيط العيني وأحزمة الرقبة.</p>
<p>بالإضافة إلى المؤشرات التجميلية، يُستخدم توكسين البوتولينوم بفعالية في الحالات الطبية مثل التعرق المفرط والصرير والوقاية من الصداع النصفي وضخامة الماضغة (تنحيف الوجه).</p>
<p>تُخصص البروفيسورة الدكتورة غوكتشه أوزيل كل تطبيق وفقًا لتشريح المريض وأهداف العلاج. المنتجات المستخدمة تستوفي المعايير الدولية وتُطبق الحقن في البيئة المعقمة لعيادتنا.</p>`,
    ru: `<p>Применение ботулинического токсина относится к медицинско-эстетическому использованию нейротоксина, полученного из бактерий Clostridium botulinum, который временно снижает мышечную активность. Среди наиболее широко проводимых эстетических процедур в мире этот метод выделяется своей безопасностью и эффективностью.</p>
<p>Основной механизм действия заключается во временном устранении способности целевой мышцы к сокращению путём блокировки высвобождения ацетилхолина в нервно-мышечном синапсе. Этот механизм применяется в лечении мимических морщин, таких как лобные морщины, межбровные линии, периорбитальные морщины и шейные полосы.</p>
<p>Помимо эстетических показаний, ботулинический токсин также эффективно используется при таких медицинских состояниях, как чрезмерное потоотделение, бруксизм, профилактика мигрени и гипертрофия жевательной мышцы.</p>
<p>Проф. д-р Гёкче Озель персонализирует каждое применение в соответствии с анатомией пациента и целями лечения. Используемые продукты соответствуют международным стандартам, а инъекции вводятся в стерильной среде нашей клиники.</p>`,
    fr: `<p>L'application de toxine botulique fait référence à l'utilisation médicale-esthétique de la neurotoxine dérivée des bactéries Clostridium botulinum qui réduit temporairement l'activité musculaire. Parmi les procédures esthétiques les plus largement pratiquées dans le monde, cette méthode se distingue par sa sécurité et son efficacité.</p>
<p>Le mécanisme d'action de base est d'éliminer temporairement la capacité de contraction du muscle cible en bloquant la libération d'acétylcholine à la jonction neuromusculaire. Ce mécanisme est utilisé dans le traitement des rides d'expression telles que les lignes du front, les lignes glabellaires, les rides périorbitaires et les bandes cervicales.</p>
<p>Au-delà des indications esthétiques, la toxine botulique est également utilisée efficacement dans des conditions médicales telles que la transpiration excessive, le bruxisme, la prophylaxie migraineuse et l'hypertrophie du masséter.</p>
<p>Le Prof. Dr. Gökçe Özel personnalise chaque application selon l'anatomie du patient et les objectifs de traitement. Les produits utilisés répondent aux normes internationales et les injections sont administrées dans l'environnement stérile de notre clinique.</p>`,
    de: `<p>Die Botulinumtoxin-Anwendung bezieht sich auf die medizinisch-ästhetische Verwendung von Neurotoxin aus Clostridium-botulinum-Bakterien, das die Muskelaktivität vorübergehend reduziert. Zu den weltweit am häufigsten durchgeführten ästhetischen Verfahren gehörend, zeichnet sich diese Methode durch ihre Sicherheit und Wirksamkeit aus.</p>
<p>Der grundlegende Wirkmechanismus besteht darin, die Kontraktionsfähigkeit des Zielmuskels vorübergehend zu unterbinden, indem die Freisetzung von Acetylcholin an der neuromuskulären Verbindung blockiert wird. Dieser Mechanismus wird in der Behandlung mimikbedingter Falten wie Stirnfalten, Glabellalinien, periorbitalwrinkles und Halsbänder eingesetzt.</p>
<p>Jenseits ästhetischer Indikationen wird Botulinumtoxin auch wirksam bei medizinischen Zuständen wie übermäßigem Schwitzen, Bruxismus, Migräne-Prophylaxe und Masseter-Hypertrophie eingesetzt.</p>
<p>Prof. Dr. Gökçe Özel personalisiert jede Anwendung entsprechend der Patientenanatomie und Behandlungszielen. Verwendete Produkte erfüllen internationale Standards, und Injektionen werden in der sterilen Umgebung unserer Klinik verabreicht.</p>`
  }
];

const PAGES2 = [
  {
    slug: 'cene-estetigi-mentoplasti',
    seoTitle: 'Çene Estetiği - Mentoplasti | Prof. Dr. Gökçe Özel',
    seoDesc: 'Çene estetiği (mentoplasti) ile yüz oranlarını dengeleme, çene büyütme ve küçültme ameliyatları hakkında uzman bilgisi.',
    tr: `<p>Mentoplasti (çene estetiği), çene kemiği veya yumuşak dokularının şekillendirilmesi yoluyla yüz profilini ve alt yüz oranlarını düzelten cerrahi bir prosedürdür. Yüz estetiğinin ayrılmaz bir parçası olan çene şekli ve pozisyonu, yüz uyumunu doğrudan etkiler.</p>
<p>Küçük ve geri çekik çene görünümünde silikon implant ile çene büyütme (augmentasyon mentoplasti), iri veya öne çıkık çenede ise kemik rezeksiyonu yoluyla küçültme (redüksiyon mentoplasti) uygulanabilmektedir. Bazı vakalarda genioplasti adı verilen kemik kesisi ve yeniden konumlandırma tekniği tercih edilir.</p>
<p>Mentoplasti, sıklıkla rinoplasti veya ortognatik cerrahi ile birlikte uygulanır. Bu kombinasyon, yüz orta hat dengesini ve profil estetiğini bütüncül biçimde iyileştirir. Ameliyat, genel veya lokal anestezi altında gerçekleştirilir ve iyileşme süreci ortalama 1-2 hafta sürmektedir.</p>
<p>Prof. Dr. Gökçe Özel, dijital yüz analizi ve 3D planlama araçları kullanarak her hastaya özel bir mentoplasti planı hazırlamaktadır. Bu yaklaşım, ameliyat öncesinde beklenen sonucun hasta ile birlikte değerlendirilmesine olanak tanır.</p>`,
    en: `<p>Mentoplasty (chin aesthetics) is a surgical procedure that corrects the facial profile and lower facial proportions through shaping of the chin bone or soft tissues. The chin shape and position, an integral part of facial aesthetics, directly affects facial harmony.</p>
<p>For small and recessive chin appearance, augmentation mentoplasty with silicone implant can be applied, while for large or protruding chin, reduction through bone resection (reduction mentoplasty) can be performed. In some cases, a technique called genioplasty involving bone cutting and repositioning is preferred.</p>
<p>Mentoplasty is frequently combined with rhinoplasty or orthognathic surgery. This combination holistically improves facial midline balance and profile aesthetics. The surgery is performed under general or local anesthesia, with a recovery period averaging 1-2 weeks.</p>
<p>Prof. Dr. Gökçe Özel prepares a personalized mentoplasty plan for each patient using digital facial analysis and 3D planning tools, allowing the expected outcome to be evaluated with the patient before surgery.</p>`,
    ar: `<p>رأب الذقن (جماليات الذقن) هو إجراء جراحي يُصحح ملف الوجه ونسب الوجه السفلية من خلال تشكيل عظم الذقن أو الأنسجة الرخوة. شكل وموضع الذقن، كجزء لا يتجزأ من جماليات الوجه، يؤثر مباشرة على انسجام الوجه.</p>
<p>لمظهر الذقن الصغير والمتراجع، يمكن تطبيق رأب الذقن بالتضخيم بغرسة سيليكون، بينما يمكن تنفيذ التصغير من خلال استئصال العظم (رأب الذقن بالتصغير) للذقن الكبير أو البارز. في بعض الحالات، يُفضَّل أسلوب يسمى جراحة الذقن يشمل قطع العظم وإعادة التموضع.</p>
<p>كثيرًا ما يُدمج رأب الذقن مع رأب الأنف أو الجراحة التقويمية الفكية. يُحسن هذا الدمج بشكل كلي توازن خط منتصف الوجه وجماليات الملف. تُجرى الجراحة تحت التخدير العام أو الموضعي، مع فترة تعافٍ متوسطها 1-2 أسبوع.</p>
<p>تُعد البروفيسورة الدكتورة غوكتشه أوزيل خطة رأب الذقن المخصصة لكل مريض باستخدام تحليل الوجه الرقمي وأدوات التخطيط ثلاثي الأبعاد، مما يتيح تقييم النتيجة المتوقعة مع المريض قبل الجراحة.</p>`,
    ru: `<p>Ментопластика (эстетика подбородка) — хирургическая процедура, корректирующая профиль лица и пропорции нижней части лица путём формирования подбородочной кости или мягких тканей. Форма и положение подбородка, являясь неотъемлемой частью лицевой эстетики, непосредственно влияют на гармонию лица.</p>
<p>При маленьком и скошенном подбородке может применяться аугментационная ментопластика с силиконовым имплантатом, а при большом или выступающем подбородке — уменьшение путём резекции кости (редукционная ментопластика). В некоторых случаях предпочтительна техника под названием гениопластика, включающая остеотомию и репозицию.</p>
<p>Ментопластика часто сочетается с ринопластикой или ортогнатической хирургией. Эта комбинация комплексно улучшает баланс срединной линии лица и профильную эстетику. Операция проводится под общей или местной анестезией, период восстановления в среднем 1-2 недели.</p>
<p>Проф. д-р Гёкче Озель подготавливает индивидуальный план ментопластики для каждого пациента с использованием цифрового анализа лица и инструментов 3D-планирования, что позволяет оценить ожидаемый результат с пациентом до операции.</p>`,
    fr: `<p>La mentoplastie (esthétique du menton) est une procédure chirurgicale qui corrige le profil facial et les proportions du bas du visage par le modelage de l'os du menton ou des tissus mous. La forme et la position du menton, partie intégrante de l'esthétique faciale, affectent directement l'harmonie faciale.</p>
<p>Pour un menton petit et fuyant, une mentoplastie d'augmentation avec implant en silicone peut être réalisée, tandis que pour un menton large ou proéminent, une réduction par résection osseuse (mentoplastie de réduction) peut être effectuée. Dans certains cas, une technique appelée génioplastie impliquant une coupe osseuse et un repositionnement est préférée.</p>
<p>La mentoplastie est fréquemment combinée avec la rhinoplastie ou la chirurgie orthognatique. Cette combinaison améliore holistiquement l'équilibre de la ligne médiane faciale et l'esthétique du profil. La chirurgie est réalisée sous anesthésie générale ou locale, avec une période de récupération moyenne de 1 à 2 semaines.</p>
<p>Le Prof. Dr. Gökçe Özel prépare un plan de mentoplastie personnalisé pour chaque patient en utilisant l'analyse faciale numérique et les outils de planification 3D, permettant d'évaluer le résultat attendu avec le patient avant la chirurgie.</p>`,
    de: `<p>Mentoplastik (Kinn-Ästhetik) ist ein chirurgisches Verfahren, das das Gesichtsprofil und die Proportionen des Untergesichts durch Formgebung des Kinnknochens oder Weichteile korrigiert. Die Kinnform und -position als integraler Bestandteil der Gesichtsästhetik beeinflusst direkt die Gesichtsharmonie.</p>
<p>Bei kleinem und zurückweichendem Kinn kann eine Augmentations-Mentoplastik mit Silikonimplantat durchgeführt werden, während bei großem oder vorstehendem Kinn eine Reduktion durch Knochenresektion (Reduktions-Mentoplastik) möglich ist. In einigen Fällen wird eine als Genioplastik bezeichnete Technik mit Knochenspaltung und Repositionierung bevorzugt.</p>
<p>Mentoplastik wird häufig mit Rhinoplastik oder orthognather Chirurgie kombiniert. Diese Kombination verbessert ganzheitlich das Gleichgewicht der fazialen Mittellinie und die Profilästhetik. Die Operation wird unter Allgemein- oder Lokalanästhesie durchgeführt, mit einer Erholungszeit von durchschnittlich 1-2 Wochen.</p>
<p>Prof. Dr. Gökçe Özel erstellt unter Verwendung digitaler Gesichtsanalyse und 3D-Planungstools einen personalisierten Mentoplastik-Plan für jeden Patienten, sodass das erwartete Ergebnis vor der Operation gemeinsam mit dem Patienten bewertet werden kann.</p>`
  },
  {
    slug: 'damar-icine-glutatyon-uygulamasi',
    seoTitle: 'Damar İçine Glutatyon Uygulaması | Prof. Dr. Gökçe Özel',
    seoDesc: 'IV glutatyon uygulaması ile cilt aydınlatma, antioksidan destek ve gençleştirme tedavisi hakkında uzman bilgisi edinin.',
    tr: `<p>Glutatyon, vücutta doğal olarak üretilen ve en güçlü antioksidanlar arasında yer alan bir tripeptittir. Damar içi (intravenöz) glutatyon uygulaması, bu maddenin oral takviyeye kıyasla çok daha yüksek biyoyararlanımla doğrudan dolaşıma verilmesini sağlayan bir estetik tıp prosedürüdür.</p>
<p>Glutatyonun melanin sentezini inhibe etme özelliği, cilt tonu açısından belirgin etki yaratmaktadır. Tirozinaz enzimini baskılayan glutatyon, melanosit aktivitesini azaltarak koyu lekelerin ve eşitsiz cilt tonunun tedavisinde etkili sonuçlar vermektedir. Bunun yanı sıra oksidatif strese karşı hücresel koruma sağlar.</p>
<p>Uygulama, genellikle seri halinde planlanır; her seans 30-60 dakika sürmektedir. Etki kalıcılığı için düzenli aralıklarla tekrar uygulamalar önerilir. C vitamini ile kombinasyonu, glutatyonun antioksidan aktivitesini artırarak daha belirgin sonuçlar elde edilmesini destekler.</p>
<p>Prof. Dr. Gökçe Özel, damar içi glutatyon uygulamasını hasta öyküsü, cilt tipi ve tedavi hedeflerine göre bireyselleştirerek uygulamaktadır. Her uygulama, klinik protokollere uygun biçimde sağlık profesyoneli gözetiminde gerçekleştirilmektedir.</p>`,
    en: `<p>Glutathione is a tripeptide naturally produced in the body and among the most potent antioxidants. Intravenous glutathione application is an aesthetic medicine procedure that delivers this substance directly into the circulation with much higher bioavailability compared to oral supplementation.</p>
<p>Glutathione's property of inhibiting melanin synthesis creates a significant effect on skin tone. Glutathione, which suppresses the tyrosinase enzyme, reduces melanocyte activity, producing effective results in treating dark spots and uneven skin tone. It also provides cellular protection against oxidative stress.</p>
<p>Application is typically planned in series; each session lasts 30-60 minutes. Repeat applications at regular intervals are recommended for lasting effects. Combination with vitamin C supports achieving more pronounced results by increasing glutathione's antioxidant activity.</p>
<p>Prof. Dr. Gökçe Özel individualizes and applies intravenous glutathione treatment according to patient history, skin type, and treatment goals. Each application is performed under healthcare professional supervision in accordance with clinical protocols.</p>`,
    ar: `<p>الغلوتاثيون هو ببتيد ثلاثي منتَج طبيعيًا في الجسم ومن بين أقوى مضادات الأكسدة. تطبيق الغلوتاثيون داخل الوريد هو إجراء طبي تجميلي يُوصل هذه المادة مباشرة إلى الدورة الدموية بتوافر حيوي أعلى بكثير مقارنة بالمكملات الفموية.</p>
<p>تخلق خاصية الغلوتاثيون في تثبيط تخليق الميلانين تأثيرًا ملحوظًا على لون الجلد. يُقلل الغلوتاثيون، الذي يثبط إنزيم التيروزيناز، من نشاط الخلايا الصبغية، منتجًا نتائج فعالة في علاج البقع الداكنة وعدم انتظام لون الجلد. كما يوفر حماية خلوية ضد الإجهاد التأكسدي.</p>
<p>يُخطَّط للتطبيق عادةً في سلسلة؛ تستمر كل جلسة 30-60 دقيقة. تُوصى بتطبيقات متكررة على فترات منتظمة لتأثيرات دائمة. يدعم الجمع مع فيتامين C تحقيق نتائج أكثر وضوحًا بزيادة نشاط الغلوتاثيون المضاد للأكسدة.</p>`,
    ru: `<p>Глутатион — трипептид, естественным образом вырабатываемый в организме и являющийся одним из наиболее мощных антиоксидантов. Внутривенное введение глутатиона — процедура эстетической медицины, которая доставляет это вещество непосредственно в кровоток с гораздо более высокой биодоступностью по сравнению с пероральным приёмом.</p>
<p>Свойство глутатиона ингибировать синтез меланина создаёт значительный эффект на тон кожи. Глутатион, подавляющий фермент тирозиназу, снижает активность меланоцитов, давая эффективные результаты в лечении тёмных пятен и неровного тона кожи. Он также обеспечивает клеточную защиту от окислительного стресса.</p>
<p>Применение обычно планируется серией; каждый сеанс длится 30-60 минут. Для стойких эффектов рекомендуются повторные процедуры через регулярные промежутки. Комбинация с витамином С поддерживает достижение более выраженных результатов за счёт увеличения антиоксидантной активности глутатиона.</p>
<p>Проф. д-р Гёкче Озель индивидуализирует и применяет внутривенное лечение глутатионом в соответствии с историей болезни пациента, типом кожи и целями лечения. Каждое применение проводится под наблюдением медицинского специалиста в соответствии с клиническими протоколами.</p>`,
    fr: `<p>Le glutathion est un tripeptide naturellement produit dans le corps et parmi les antioxydants les plus puissants. L'application intraveineuse de glutathion est une procédure de médecine esthétique qui délivre cette substance directement dans la circulation avec une biodisponibilité beaucoup plus élevée par rapport à la supplémentation orale.</p>
<p>La propriété du glutathion d'inhiber la synthèse de mélanine crée un effet significatif sur le teint de la peau. Le glutathion, qui supprime l'enzyme tyrosinase, réduit l'activité des mélanocytes, produisant des résultats efficaces dans le traitement des taches sombres et du teint irrégulier. Il fournit également une protection cellulaire contre le stress oxydatif.</p>
<p>L'application est généralement planifiée en série ; chaque séance dure 30 à 60 minutes. Des applications répétées à intervalles réguliers sont recommandées pour des effets durables. La combinaison avec la vitamine C soutient l'obtention de résultats plus prononcés en augmentant l'activité antioxydante du glutathion.</p>`,
    de: `<p>Glutathion ist ein im Körper natürlich produziertes Tripeptid und gehört zu den wirksamsten Antioxidantien. Die intravenöse Glutathion-Anwendung ist ein ästhetisch-medizinisches Verfahren, das diese Substanz direkt in den Kreislauf einbringt mit viel höherer Bioverfügbarkeit im Vergleich zur oralen Supplementierung.</p>
<p>Die Eigenschaft von Glutathion, die Melaninsynthese zu hemmen, erzeugt einen signifikanten Effekt auf den Hautton. Glutathion, das das Enzym Tyrosinase unterdrückt, reduziert die Melanozytenaktivität und erzeugt effektive Ergebnisse bei der Behandlung von dunklen Flecken und ungleichmäßigem Hautton. Es bietet auch zellulären Schutz gegen oxidativen Stress.</p>
<p>Die Anwendung wird typischerweise in Serien geplant; jede Sitzung dauert 30-60 Minuten. Wiederholte Anwendungen in regelmäßigen Abständen werden für dauerhafte Effekte empfohlen. Die Kombination mit Vitamin C unterstützt das Erreichen ausgeprägter Ergebnisse durch Steigerung der antioxidativen Aktivität von Glutathion.</p>`
  },
  {
    slug: 'dolgu',
    seoTitle: 'Dolgu Uygulamaları | Prof. Dr. Gökçe Özel',
    seoDesc: 'Yüz dolgusu ile hacim kazanımı, kırışıklık dolgusu ve yüz gençleştirme hakkında uzman bilgisi. Prof. Dr. Gökçe Özel kliniği.',
    tr: `<p>Dolgu uygulamaları, yüz bölgelerine hyalüronik asit veya diğer biyouyumlu maddeler enjekte edilerek hacim, nem ve yapısal destek sağlanan minimal invaziv estetik işlemlerdir. Güvenlik profili ve geçici etki süresi sayesinde en çok tercih edilen yüz gençleştirme yöntemleri arasında yer almaktadır.</p>
<p>Hyalüronik asit esaslı dolgular; dudak hacmini artırma, yanak kemiklerini belirginleştirme, nazolabial kıvrımları azaltma, göz altı çukurluklarını düzeltme ve çene-yüz oranını optimize etme gibi geniş bir uygulama yelpazesine sahiptir. Farklı kıvam ve yoğunluktaki ürünler, her bölgenin ihtiyacına uygun biçimde seçilir.</p>
<p>Uygulama, ince iğne veya kanül tekniğiyle gerçekleştirilir; lokal anestezi ile konfor sağlanır. Etki süresi kullanılan ürüne ve bölgeye göre 6 ay ile 18 ay arasında değişmektedir. İstenildiğinde hiyaluronidaz enzimi ile dolgu tamamen çözülebilir.</p>
<p>Prof. Dr. Gökçe Özel, dolgu uygulamalarını yüz anatomi analizi temel alarak planlamakta; aşırı ve yapay görünümden kaçınarak doğal bir gençleşme etkisi elde etmeyi hedeflemektedir.</p>`,
    en: `<p>Filler applications are minimally invasive aesthetic procedures where hyaluronic acid or other biocompatible materials are injected into facial areas to provide volume, hydration, and structural support. Thanks to their safety profile and temporary effect duration, they are among the most preferred facial rejuvenation methods.</p>
<p>Hyaluronic acid-based fillers have a wide range of applications including increasing lip volume, accentuating cheekbones, reducing nasolabial folds, correcting under-eye hollows, and optimizing chin-face ratio. Products of different consistencies and densities are selected according to each area's needs.</p>
<p>The procedure is performed with fine needle or cannula technique; comfort is provided with local anesthesia. Duration of effect varies between 6 months and 18 months depending on the product and area used. If desired, the filler can be completely dissolved with hyaluronidase enzyme.</p>
<p>Prof. Dr. Gökçe Özel plans filler applications based on facial anatomy analysis, aiming to achieve a natural rejuvenating effect while avoiding excessive and artificial appearance.</p>`,
    ar: `<p>تطبيقات الحشو هي إجراءات تجميلية أقل توغلاً حيث يُحقن حمض الهيالورونيك أو مواد أخرى متوافقة حيويًا في مناطق الوجه لتوفير الحجم والترطيب والدعم الهيكلي. بفضل ملف سلامتها ومدة تأثيرها المؤقتة، تُعد من أكثر طرق تجديد شباب الوجه تفضيلاً.</p>
<p>تتميز الحشوات القائمة على حمض الهيالورونيك بمجموعة واسعة من التطبيقات تشمل زيادة حجم الشفاه وإبراز عظام الخد وتقليل الطيات الأنفية الشفوية وتصحيح التجاويف تحت العين وتحسين نسبة الذقن إلى الوجه. تُختار المنتجات ذات الاتساق والكثافة المختلفة وفقًا لاحتياجات كل منطقة.</p>
<p>يُنفَّذ الإجراء بتقنية الإبرة الدقيقة أو الكانيولا؛ يُوفر التخدير الموضعي الراحة. تتراوح مدة التأثير بين 6 أشهر و18 شهرًا حسب المنتج والمنطقة المستخدمة. إذا رُغب في ذلك، يمكن إذابة الحشو تمامًا بإنزيم الهيالورونيداز.</p>`,
    ru: `<p>Наполнители — малоинвазивные эстетические процедуры, при которых гиалуроновая кислота или другие биосовместимые материалы вводятся в области лица для обеспечения объёма, увлажнения и структурной поддержки. Благодаря профилю безопасности и временной продолжительности эффекта они являются одними из наиболее предпочтительных методов омоложения лица.</p>
<p>Наполнители на основе гиалуроновой кислоты имеют широкий спектр применения, включая увеличение объёма губ, подчёркивание скул, уменьшение носогубных складок, коррекцию под глазных впадин и оптимизацию соотношения подбородок-лицо. Продукты различной консистенции и плотности выбираются в соответствии с потребностями каждой области.</p>
<p>Процедура выполняется техникой тонкой иглы или канюли; комфорт обеспечивается местной анестезией. Продолжительность эффекта варьируется от 6 месяцев до 18 месяцев в зависимости от продукта и области. При желании наполнитель может быть полностью растворён ферментом гиалуронидазой.</p>`,
    fr: `<p>Les applications de charges sont des procédures esthétiques minimalement invasives où de l'acide hyaluronique ou d'autres matériaux biocompatibles sont injectés dans les zones faciales pour fournir volume, hydratation et soutien structurel. Grâce à leur profil de sécurité et à la durée d'effet temporaire, elles font partie des méthodes de rajeunissement facial les plus préférées.</p>
<p>Les charges à base d'acide hyaluronique ont un large éventail d'applications comprenant l'augmentation du volume des lèvres, l'accentuation des pommettes, la réduction des plis nasogéniens, la correction des creux sous les yeux et l'optimisation du rapport menton-visage. Des produits de consistances et densités différentes sont sélectionnés selon les besoins de chaque zone.</p>
<p>La procédure est réalisée avec une fine aiguille ou technique de canule ; le confort est fourni par anesthésie locale. La durée d'effet varie entre 6 mois et 18 mois selon le produit et la zone utilisés. Si souhaité, la charge peut être complètement dissoute avec l'enzyme hyaluronidase.</p>`,
    de: `<p>Filler-Anwendungen sind minimal-invasive ästhetische Verfahren, bei denen Hyaluronsäure oder andere biokompatible Materialien in Gesichtsbereiche injiziert werden, um Volumen, Hydratation und strukturelle Unterstützung bereitzustellen. Dank ihres Sicherheitsprofils und temporärer Wirkungsdauer gehören sie zu den bevorzugtesten Gesichtsverjüngungsmethoden.</p>
<p>Hyaluronsäurebasierte Filler haben ein breites Anwendungsspektrum, darunter Erhöhung des Lippenvolumens, Betonung der Wangenknochen, Reduzierung der Nasolabialfalten, Korrektur von Unteraugenvertiefungen und Optimierung des Kinn-Gesichts-Verhältnisses. Produkte unterschiedlicher Konsistenz und Dichte werden entsprechend den Bedürfnissen jedes Bereichs ausgewählt.</p>
<p>Der Eingriff wird mit feiner Nadel oder Kanülentechnik durchgeführt; Komfort wird durch Lokalanästhesie gewährleistet. Die Wirkungsdauer variiert je nach Produkt und Bereich zwischen 6 Monaten und 18 Monaten. Bei Wunsch kann der Filler mit dem Enzym Hyaluronidase vollständig aufgelöst werden.</p>`
  }
];

// Build a generic content generator for simpler pages
function makeContent(slug, nameTr, nameEn) {
  return {
    tr: `<p>${nameTr}, yüz estetiği alanında uygulanan ve hastanın görünümünü iyileştirmeyi hedefleyen modern bir estetik tıp prosedürüdür. Bu işlem, kişinin bireysel anatomik özelliklerine ve estetik beklentilerine göre özelleştirilmektedir.</p>
<p>Uygulama öncesinde Prof. Dr. Gökçe Özel tarafından kapsamlı bir yüz analizi ve konsültasyon gerçekleştirilmektedir. Bu süreçte hastanın sağlık durumu, beklentileri ve anatomik yapısı değerlendirilerek en uygun tedavi planı hazırlanmaktadır.</p>
<p>İşlem sırasında hasta konforunu ve güvenliğini ön planda tutan klinik protokoller uygulanmaktadır. Kullanılan malzeme ve teknikler uluslararası kalite standartlarını karşılamaktadır.</p>
<p>Tedavi sonrası bakım ve takip süreci, elde edilen sonuçların uzun süreli korunmasında belirleyici rol oynamaktadır. Kliniğimizde her hastaya bireysel bir bakım planı sunulmakta ve gerektiğinde follow-up seansları planlanmaktadır.</p>`,
    en: `<p>${nameEn} is a modern aesthetic medicine procedure applied in the field of facial aesthetics aimed at improving the patient's appearance. This procedure is customized according to the individual anatomical characteristics and aesthetic expectations of the patient.</p>
<p>A comprehensive facial analysis and consultation is performed by Prof. Dr. Gökçe Özel before the procedure. During this process, the most appropriate treatment plan is prepared by evaluating the patient's health status, expectations, and anatomical structure.</p>
<p>Clinical protocols that prioritize patient comfort and safety are applied during the procedure. Materials and techniques used meet international quality standards.</p>
<p>Post-treatment care and follow-up process plays a decisive role in long-term preservation of results achieved. A personalized care plan is offered to each patient in our clinic, and follow-up sessions are planned when needed.</p>`,
    ar: `<p>${nameEn} هو إجراء طب تجميلي حديث يُطبَّق في مجال جماليات الوجه يهدف إلى تحسين مظهر المريض. يُخصص هذا الإجراء وفقًا للخصائص التشريحية الفردية والتوقعات التجميلية للمريض.</p>
<p>يُجري البروفيسور الدكتور غوكتشه أوزيل تحليلاً شاملاً للوجه واستشارة قبل الإجراء. خلال هذه العملية، يُعد أنسب خطة علاجية من خلال تقييم الحالة الصحية للمريض وتوقعاته وبنيته التشريحية.</p>
<p>تُطبَّق بروتوكولات سريرية تُعطي الأولوية لراحة المريض وسلامته أثناء الإجراء. المواد والتقنيات المستخدمة تستوفي معايير الجودة الدولية.</p>
<p>تلعب العناية ما بعد العلاج وعملية المتابعة دورًا حاسمًا في الحفاظ طويل الأمد على النتائج المحققة. يُقدَّم لكل مريض خطة رعاية مخصصة في عيادتنا وتُخطَّط جلسات متابعة عند الحاجة.</p>`,
    ru: `<p>${nameEn} — современная процедура эстетической медицины, применяемая в области эстетики лица, направленная на улучшение внешности пациента. Процедура адаптируется в соответствии с индивидуальными анатомическими особенностями и эстетическими ожиданиями пациента.</p>
<p>Перед процедурой проф. д-р Гёкче Озель проводит всесторонний анализ лица и консультацию. В ходе этого процесса разрабатывается наиболее подходящий план лечения с учётом состояния здоровья пациента, его ожиданий и анатомической структуры.</p>
<p>Во время процедуры применяются клинические протоколы, ставящие во главу угла комфорт и безопасность пациента. Используемые материалы и техники соответствуют международным стандартам качества.</p>
<p>Постлечебный уход и процесс наблюдения играют решающую роль в долгосрочном сохранении достигнутых результатов. В нашей клинике каждому пациенту предлагается индивидуальный план ухода, и при необходимости планируются сеансы последующего наблюдения.</p>`,
    fr: `<p>${nameEn} est une procédure moderne de médecine esthétique appliquée dans le domaine de l'esthétique faciale visant à améliorer l'apparence du patient. Cette procédure est personnalisée selon les caractéristiques anatomiques individuelles et les attentes esthétiques du patient.</p>
<p>Une analyse faciale complète et une consultation sont effectuées par le Prof. Dr. Gökçe Özel avant la procédure. Au cours de ce processus, le plan de traitement le plus approprié est préparé en évaluant l'état de santé du patient, ses attentes et sa structure anatomique.</p>
<p>Des protocoles cliniques qui donnent la priorité au confort et à la sécurité du patient sont appliqués pendant la procédure. Les matériaux et techniques utilisés répondent aux normes de qualité internationales.</p>
<p>Le soin post-traitement et le processus de suivi jouent un rôle décisif dans la préservation à long terme des résultats obtenus. Un plan de soins personnalisé est offert à chaque patient dans notre clinique, et des séances de suivi sont planifiées si nécessaire.</p>`,
    de: `<p>${nameEn} ist ein modernes ästhetisch-medizinisches Verfahren im Bereich der Gesichtsästhetik, das darauf abzielt, das Erscheinungsbild des Patienten zu verbessern. Dieses Verfahren wird entsprechend den individuellen anatomischen Merkmalen und ästhetischen Erwartungen des Patienten angepasst.</p>
<p>Eine umfassende Gesichtsanalyse und Konsultation wird von Prof. Dr. Gökçe Özel vor dem Eingriff durchgeführt. Während dieses Prozesses wird der am besten geeignete Behandlungsplan durch Bewertung des Gesundheitszustands, der Erwartungen und der anatomischen Struktur des Patienten erstellt.</p>
<p>Klinische Protokolle, die Patientenkomfort und -sicherheit priorisieren, werden während des Eingriffs angewendet. Verwendete Materialien und Techniken erfüllen internationale Qualitätsstandards.</p>
<p>Die Nachbehandlungspflege und der Nachsorgeprozess spielen eine entscheidende Rolle bei der langfristigen Erhaltung der erzielten Ergebnisse. Ein personalisierter Pflegeplan wird jedem Patienten in unserer Klinik angeboten, und Nachsorgetermine werden bei Bedarf geplant.</p>`
  };
}

// All remaining pages using the generic generator
const GENERIC_PAGES = [
  { slug: 'dolgu-i-slemleri', seoTitle: 'Dolgu İşlemleri | Prof. Dr. Gökçe Özel', seoDesc: 'Yüz dolgu işlemleri ile kırışıklık giderme, hacim kazanımı ve doğal yüz gençleştirme. Uzman dolgu uygulaması için bilgi alın.', nameTr: 'Dolgu işlemleri', nameEn: 'Filler Procedures' },
  { slug: 'dolgu-ile-kas-kaldirma', seoTitle: 'Dolgu ile Kaş Kaldırma | Prof. Dr. Gökçe Özel', seoDesc: 'Hyalüronik asit dolgu ile ameliyatsız kaş kaldırma yöntemi, doğal sonuçlar ve hızlı iyileşme süreci hakkında bilgi.', nameTr: 'Dolgu ile kaş kaldırma', nameEn: 'Brow Lift with Filler' },
  { slug: 'dudak-dolgusu', seoTitle: 'Dudak Dolgusu | Prof. Dr. Gökçe Özel', seoDesc: 'Hyalüronik asit dudak dolgusu ile dolgun, şekilli dudaklar. Doğal görünümlü dudak büyütme ve şekillendirme uygulamaları.', nameTr: 'Dudak dolgusu', nameEn: 'Lip Filler' },
  { slug: 'dudak-estetigi-liplift', seoTitle: 'Dudak Estetiği - LipLift | Prof. Dr. Gökçe Özel', seoDesc: 'Lip lift ameliyatı ile üst dudak kısaltma ve belirginleştirme. Kalıcı dudak estetiği ve gülümseme iyileştirme hakkında uzman bilgisi.', nameTr: 'Dudak estetiği ve lip lift', nameEn: 'Lip Aesthetics - Lip Lift' },
  { slug: 'gamze-estetigi', seoTitle: 'Gamze Estetiği | Prof. Dr. Gökçe Özel', seoDesc: 'Gamze estetiği ile yüzde doğal çukurcuk oluşturma. Cerrahi ve minimal invaziv gamze yöntemi hakkında uzman bilgisi alın.', nameTr: 'Gamze estetiği', nameEn: 'Dimple Aesthetics' },
  { slug: 'goz-alti-isik-dolgusu', seoTitle: 'Göz Altı Işık Dolgusu | Prof. Dr. Gökçe Özel', seoDesc: 'Göz altı ışık dolgusu ile koyu halka ve çukurluk tedavisi. Dinlenmiş ve genç göz çevresi için profesyonel uygulama.', nameTr: 'Göz altı ışık dolgusu', nameEn: 'Under Eye Light Filler' },
  { slug: 'i-ple-kas-kaldirma', seoTitle: 'İple Kaş Kaldırma | Prof. Dr. Gökçe Özel', seoDesc: 'Eriyebilir ip ile ameliyatsız kaş kaldırma yöntemi, kalıcı etki ve minimal iyileşme süreci. Uzman bilgisi için inceleyin.', nameTr: 'İple kaş kaldırma', nameEn: 'Thread Brow Lift' },
  { slug: 'i-ple-yuz-germe-fransiz-aski', seoTitle: 'İple Yüz Germe - Fransız Askısı | Prof. Dr. Gökçe Özel', seoDesc: 'Fransız askısı (ip ile yüz germe) ile ameliyatsız yüz ve boyun gençleştirme. Sarkma ve kırışıklık tedavisi için uzman bilgisi.', nameTr: 'İple yüz germe ve Fransız askısı', nameEn: 'Thread Face Lift - French Lift' },
  { slug: 'kas-kaldirma', seoTitle: 'Kaş Kaldırma | Prof. Dr. Gökçe Özel', seoDesc: 'Kaş kaldırma yöntemleri: cerrahi, botoks, dolgu ve ip teknikleri ile kaş pozisyonunu iyileştirme. Uzman kaş estetiği bilgisi.', nameTr: 'Kaş kaldırma', nameEn: 'Brow Lift' },
  { slug: 'kepce-kulak-estetigi-otoplasti', seoTitle: 'Kepçe Kulak Estetiği - Otoplasti | Prof. Dr. Gökçe Özel', seoDesc: 'Kepçe kulak ameliyatı (otoplasti) ile kalıcı çözüm. Ameliyat süreci, iyileşme ve sonuçlar hakkında uzman bilgisi edinin.', nameTr: 'Kepçe kulak estetiği ve otoplasti', nameEn: 'Prominent Ear Surgery - Otoplasty' },
  { slug: 'lipoliz-i-nceltme-mezoterapisi', seoTitle: 'Lipoliz İnceltime Mezoterapisi | Prof. Dr. Gökçe Özel', seoDesc: 'Lipoliz mezoterapi ile yüz ve boyunda yağ inceltme. İğne ile bölgesel incelme ve kontur düzeltme hakkında uzman bilgisi.', nameTr: 'Lipoliz inceltime mezoterapisi', nameEn: 'Lipolysis Slimming Mesotherapy' },
  { slug: 'mezoterapi', seoTitle: 'Mezoterapi | Prof. Dr. Gökçe Özel', seoDesc: 'Yüz mezoterapisi ile cilt nemlendirme, yenileme ve kırışıklık tedavisi. Vitamin ve mineral kokteyliyle cilt canlandırma.', nameTr: 'Mezoterapi', nameEn: 'Mesotherapy' },
  { slug: 'migren-tedavisi', seoTitle: 'Migren Tedavisi | Prof. Dr. Gökçe Özel', seoDesc: 'Botoks ile kronik migren tedavisi. FDA onaylı botulinum toksin uygulaması ile migren sıklığını azaltma hakkında bilgi alın.', nameTr: 'Botoks ile migren tedavisi', nameEn: 'Migraine Treatment with Botox' },
  { slug: 'mikro-i-gneleme', seoTitle: 'Mikro İğneleme | Prof. Dr. Gökçe Özel', seoDesc: 'Mikro iğneleme (microneedling) ile kolajen uyarımı, cilt yenileme ve skar tedavisi. Profesyonel uygulama hakkında bilgi.', nameTr: 'Mikro iğneleme (microneedling)', nameEn: 'Microneedling' },
  { slug: 'ozon-uygulamasi', seoTitle: 'Ozon Uygulaması | Prof. Dr. Gökçe Özel', seoDesc: 'Ozon terapisi ile cilt gençleştirme, antioksidan destek ve iyileşme sürecini hızlandırma. Tıbbi ozon uygulaması bilgisi.', nameTr: 'Ozon uygulaması', nameEn: 'Ozone Therapy' },
  { slug: 'prp-uygulamasi', seoTitle: 'PRP Uygulaması | Prof. Dr. Gökçe Özel', seoDesc: 'PRP (platelet zengini plazma) uygulaması ile cilt yenileme, saç dökülmesi tedavisi ve hızlı iyileşme desteği.', nameTr: 'PRP uygulaması', nameEn: 'PRP Application' },
  { slug: 'revizyon-rinoplasti', seoTitle: 'Revizyon Rinoplasti | Prof. Dr. Gökçe Özel', seoDesc: 'Revizyon rinoplasti ile önceki burun ameliyatının düzeltilmesi. Komplikasyon yönetimi ve ikincil burun estetiği uzmanı.', nameTr: 'Revizyon rinoplasti', nameEn: 'Revision Rhinoplasty' },
  { slug: 'septorinoplasti', seoTitle: 'Septorinoplasti | Prof. Dr. Gökçe Özel', seoDesc: 'Septorinoplasti ile burun estetiği ve nefes problemini birlikte çözme. Deviye septum ve burun şekli düzeltme ameliyatı.', nameTr: 'Septorinoplasti', nameEn: 'Septorhinoplasty' },
  { slug: 'sinuzit-ameliyati', seoTitle: 'Sinüzit Ameliyatı | Prof. Dr. Gökçe Özel', seoDesc: 'Kronik sinüzit ameliyatı (FESS) ile kalıcı tedavi. Endoskopik sinüs cerrahisi hakkında uzman KBB hekimi bilgisi.', nameTr: 'Sinüzit ameliyatı', nameEn: 'Sinus Surgery' },
  { slug: 'skar-revizyonu-yara-izi-estetigi', seoTitle: 'Skar Revizyonu - Yara İzi Estetiği | Prof. Dr. Gökçe Özel', seoDesc: 'Skar revizyonu ile ameliyat ve yara izlerinin düzeltilmesi. Lazer, cerrahi ve dolgu yöntemleriyle yara izi estetiği.', nameTr: 'Skar revizyonu ve yara izi estetiği', nameEn: 'Scar Revision' },
  { slug: 'yuz-germe-facelift', seoTitle: 'Yüz Germe - Facelift | Prof. Dr. Gökçe Özel', seoDesc: 'Yüz germe ameliyatı (facelift) ile sarkma ve kırışıklıkları kalıcı olarak düzeltme. Uzman facelift cerrahisi hakkında bilgi.', nameTr: 'Yüz germe (facelift) ameliyatı', nameEn: 'Face Lift - Facelift' },
  { slug: 'yuz-mezoterapisi', seoTitle: 'Yüz Mezoterapisi | Prof. Dr. Gökçe Özel', seoDesc: 'Yüz mezoterapisi ile kolajen uyarımı, cilt parlaklığı ve nem dengesi. Vitamin kokteyliyle yüz gençleştirme hakkında bilgi.', nameTr: 'Yüz mezoterapisi', nameEn: 'Face Mesotherapy' },
  // PAGE type pages
  { slug: 'ameliyat-sureci-nasil-i-sliyor', seoTitle: 'Ameliyat Süreci Nasıl İşliyor? | Prof. Dr. Gökçe Özel', seoDesc: 'Estetik ameliyat öncesi, sırası ve sonrası süreç hakkında kapsamlı bilgi. Hasta güvenliği ve hazırlık adımları.', nameTr: 'Ameliyat süreci', nameEn: 'Surgery Process' },
  { slug: 'ameliyatsiz-i-slemler', seoTitle: 'Ameliyatsız İşlemler | Prof. Dr. Gökçe Özel', seoDesc: 'Cerrahi gerektirmeyen yüz gençleştirme yöntemleri: botoks, dolgu, mezoterapi ve ip tekniklerinin tamamı bir arada.', nameTr: 'Ameliyatsız işlemler', nameEn: 'Non-surgical Procedures' },
  { slug: 'estetik-operasyonlar-psikolojiyi-nasil-etkiliyor', seoTitle: 'Estetik Operasyonlar ve Psikoloji | Prof. Dr. Gökçe Özel', seoDesc: 'Estetik ameliyatların psikolojik etkileri, öz güven ve yaşam kalitesine katkısı hakkında bilimsel bir perspektif.', nameTr: 'Estetik operasyonların psikolojik etkileri', nameEn: 'Psychological Effects of Aesthetic Operations' },
  { slug: 'i-slemim-nerede-yapilacak', seoTitle: 'İşlemim Nerede Yapılacak? | Prof. Dr. Gökçe Özel', seoDesc: 'Prof. Dr. Gökçe Özel kliniğinin lokasyonu, hastane iş birlikleri ve ameliyathane standartları hakkında bilgi alın.', nameTr: 'İşlemin nerede yapılacağı', nameEn: 'Where Will My Procedure Be Done' },
  { slug: 'neden-estetigi-tercih-ettiniz', seoTitle: 'Neden Estetiği Tercih Ettiniz? | Prof. Dr. Gökçe Özel', seoDesc: 'Estetik müdahale kararında motivasyon, beklenti yönetimi ve doğru doktor seçimi hakkında kapsamlı rehber.', nameTr: 'Estetiği tercih etme nedenleri', nameEn: 'Why Choose Aesthetics' },
  { slug: 'neler-yapiyoruz', seoTitle: 'Neler Yapıyoruz? | Prof. Dr. Gökçe Özel', seoDesc: 'Prof. Dr. Gökçe Özel\'in uzmanlık alanları: rinoplasti, yüz estetiği, KBB ve minimal invaziv işlemlerin tamamı.', nameTr: 'Yapılan işlemler ve uzmanlık alanları', nameEn: 'What We Do' },
  { slug: 'prof-dr-gokce-ozel-klinigi', seoTitle: 'Prof. Dr. Gökçe Özel Kliniği | İstanbul Yüz Estetiği', seoDesc: 'Prof. Dr. Gökçe Özel Kliniği İstanbul - KBB uzmanı ve yüz estetiği cerrahı. Klinik, ekip ve olanaklar hakkında bilgi.', nameTr: 'Prof. Dr. Gökçe Özel kliniği', nameEn: 'Prof. Dr. Gökçe Özel Clinic' },
  { slug: 'yuz-boyun-estetigi', seoTitle: 'Yüz Boyun Estetiği | Prof. Dr. Gökçe Özel', seoDesc: 'Yüz ve boyun estetiği prosedürleri: facelift, boyun germe ve yüz gençleştirme yöntemleri hakkında uzman bilgisi.', nameTr: 'Yüz ve boyun estetiği', nameEn: 'Face and Neck Aesthetics' },
  { slug: 'yuz-estetigi-mi-dusunuyorsunuz', seoTitle: 'Yüz Estetiği mi Düşünüyorsunuz? | Prof. Dr. Gökçe Özel', seoDesc: 'Yüz estetiği kararı vermeden önce bilmeniz gerekenler: konsültasyon süreci, seçenekler ve doğru yönlendirme.', nameTr: 'Yüz estetiği düşünenler için rehber', nameEn: 'Considering Face Aesthetics' },
  { slug: 'yuz-prosedurleri', seoTitle: 'Yüz Prosedürleri | Prof. Dr. Gökçe Özel', seoDesc: 'Tüm yüz prosedürleri: cerrahi ve cerrahi dışı yüz estetiği seçenekleri hakkında kapsamlı bilgi ve rehberlik.', nameTr: 'Yüz prosedürleri', nameEn: 'Face Procedures' },
  { slug: 'yuze-yag-enjeksiyonu-kok-hucre-tedavisi', seoTitle: 'Yüze Yağ Enjeksiyonu - Kök Hücre Tedavisi | Prof. Dr. Gökçe Özel', seoDesc: 'Yüze otolog yağ enjeksiyonu ve kök hücre tedavisi ile hacim kazanımı ve cilt yenileme. Doğal gençleştirme yöntemi.', nameTr: 'Yüze yağ enjeksiyonu ve kök hücre tedavisi', nameEn: 'Fat Injection to Face - Stem Cell Treatment' },
  { slug: 'goz-kapagi-estetigi', seoTitle: 'Göz Kapağı Estetiği | Prof. Dr. Gökçe Özel', seoDesc: 'Blefaroplasti (göz kapağı estetiği) ile sarkık göz kapağı düzeltme. Alt ve üst blefaroplasti hakkında uzman bilgisi.', nameTr: 'Göz kapağı estetiği (blefaroplasti)', nameEn: 'Eyelid Aesthetics - Blepharoplasty' },
  { slug: 'gidi-liposuction', seoTitle: 'Gıdı Liposuction | Prof. Dr. Gökçe Özel', seoDesc: 'Gıdı liposuction ile çift çene ve boyun altı yağ birikintisini kalıcı olarak giderme. Uzman boyun estetiği cerrahisi.', nameTr: 'Gıdı liposuction (çift çene estetiği)', nameEn: 'Double Chin Liposuction' },
];

// SEO-only pages (skip content block creation)
const SEO_ONLY_PAGES = [
  {
    slug: 'rinoplasti',
    seoTitle: 'Rinoplasti (Burun Estetiği) | Prof. Dr. Gökçe Özel',
    seoDesc: 'Rinoplasti ile estetik ve fonksiyonel burun ameliyatı. Prof. Dr. Gökçe Özel\'in 3D simülasyon destekli rinoplasti yaklaşımı.'
  },
  {
    slug: 'gokce-ozel-kimdir',
    seoTitle: 'Prof. Dr. Gökçe Özel Kimdir? | KBB ve Yüz Estetiği Uzmanı',
    seoDesc: 'Prof. Dr. Gökçe Özel, KBB ve yüz estetiği uzmanı, rinoplasti ve minimal invaziv yüz estetiği alanında deneyimli cerrah.'
  }
];

async function upsertContentBlock(pageId, slug, contentByLocale) {
  // Check if legacy_content block already exists
  const existing = await prisma.contentBlock.findFirst({
    where: { pageId, componentType: 'legacy_content' }
  });

  let blockId;
  if (existing) {
    blockId = existing.id;
    console.log(`  ℹ Block already exists for ${slug} (id: ${blockId})`);
  } else {
    const block = await prisma.contentBlock.create({
      data: {
        pageId,
        componentType: 'legacy_content',
        sortOrder: 1,
        isActive: true,
        schemaDef: '{}'
      }
    });
    blockId = block.id;
    console.log(`  ✓ Created ContentBlock for ${slug}`);
  }

  // Upsert translations
  for (const locale of ['tr', 'en', 'ar', 'ru', 'fr', 'de']) {
    const content = contentByLocale[locale] || contentByLocale['en'];
    const contentData = JSON.stringify({
      slug,
      title: '',
      content,
      seo_title: '',
      seo_description: ''
    });
    await prisma.translation.upsert({
      where: { blockId_locale: { blockId, locale } },
      update: { contentData },
      create: { blockId, locale, contentData }
    });
  }
  console.log(`  ✓ Upserted translations for ${slug}`);
}

async function updateSeoMeta(pageId, slug, seoTitle, seoDesc) {
  const metas = await prisma.seoMeta.findMany({ where: { pageId } });
  if (metas.length === 0) {
    console.log(`  ⚠ No SeoMeta found for ${slug}`);
    return;
  }
  for (const meta of metas) {
    await prisma.seoMeta.update({
      where: { id: meta.id },
      data: { metaTitle: seoTitle, metaDescription: seoDesc }
    });
  }
  console.log(`  ✓ Updated ${metas.length} SeoMeta records for ${slug}`);
}

async function processPage(pageData, skipContent = false) {
  const { slug, seoTitle, seoDesc } = pageData;

  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) {
    console.log(`  ✗ Page not found: ${slug}`);
    return false;
  }

  if (!skipContent) {
    const contentByLocale = {
      tr: pageData.tr,
      en: pageData.en,
      ar: pageData.ar,
      ru: pageData.ru,
      fr: pageData.fr,
      de: pageData.de
    };
    await upsertContentBlock(page.id, slug, contentByLocale);
  }

  await updateSeoMeta(page.id, slug, seoTitle, seoDesc);
  return true;
}

async function main() {
  console.log('Starting content fill script...\n');

  // Process detailed pages (batch 1)
  console.log('=== Processing detailed pages batch 1 ===');
  for (const p of PAGES) {
    console.log(`Processing: ${p.slug}`);
    await processPage(p);
  }

  // Process detailed pages (batch 2)
  console.log('\n=== Processing detailed pages batch 2 ===');
  for (const p of PAGES2) {
    console.log(`Processing: ${p.slug}`);
    await processPage(p);
  }

  // Process generic pages
  console.log('\n=== Processing generic pages ===');
  for (const p of GENERIC_PAGES) {
    console.log(`Processing: ${p.slug}`);
    const content = makeContent(p.slug, p.nameTr, p.nameEn);
    await processPage({ ...p, ...content });
  }

  // Process SEO-only pages
  console.log('\n=== Processing SEO-only pages ===');
  for (const p of SEO_ONLY_PAGES) {
    console.log(`Processing SEO only: ${p.slug}`);
    const page = await prisma.page.findUnique({ where: { slug: p.slug } });
    if (!page) {
      console.log(`  ✗ Page not found: ${p.slug}`);
      continue;
    }
    await updateSeoMeta(page.id, p.slug, p.seoTitle, p.seoDesc);
  }

  console.log('\n✅ Content fill script completed!');
}

main()
  .catch(e => { console.error('Error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
