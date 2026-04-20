import pymysql
import datetime
import random

# Database config
DB_CONFIG = {
    'host': '127.0.0.1', 
    'user': 'root',
    'password': 'root',
    'database': 'gokceozel_local',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

def connect_db():
    return pymysql.connect(**DB_CONFIG)

# ---------------------------------------------------------------------
# CONTENT TEMPLATES (Modular blocks to build 2500 words)
# ---------------------------------------------------------------------

# Common "Why Dr. Gokce Ozel" Block (~300 words)
# Common "Why Dr. Gokce Ozel" Block (~300 words)
WHY_US_BLOCKS = {
    'TR': """
    <h3>Neden Prof. Dr. Gökçe Özel?</h3>
    <p>Ankara'da estetik ve plastik cerrahi alanında öncü bir isim olan Prof. Dr. Gökçe Özel, yılların getirdiği akademik birikimi ve binlerce başarılı operasyon deneyimini bir araya getiriyor. Kliniğimizde uygulanan her prosedür, hastanın yüz anatomisine, doku yapısına ve estetik hedeflerine tam uyum sağlayacak şekilde, "kişiye özel" olarak planlanır.</p>
    <p>Modern tıbbın sunduğu en ileri teknolojileri (Endolift Lazer, Piezo Cerrahisi, 3D Modelleme vb.) kullanarak, hem cerrahi hem de cerrahi dışı işlemlerde maksimum konfor ve minimum iyileşme süreci hedefliyoruz.</p>
    """,
    'EN': """
    <h3>Why Choose Prof. Dr. Gökçe Özel?</h3>
    <p>Prof. Dr. Gökçe Özel is a pioneering name in aesthetic and plastic surgery in Ankara, combining years of academic accumulation with the experience of thousands of successful operations. Every procedure performed in our clinic is planned "specifically for the person".</p>
    <p>Using the most advanced technologies offered by modern medicine (Endolift Laser, Piezo Surgery, 3D Modeling, etc.), we aim for maximum comfort and minimum recovery time.</p>
    """,
    'RU': """
    <h3>Почему профессор, доктор Гёкче Озель?</h3>
    <p>Профессор, доктор Гёкче Озель — ведущее имя в области эстетической и пластической хирургии в Анкаре, объединяющее годы академических знаний с опытом тысяч успешных операций. Каждая процедура планируется «индивидуально», чтобы полностью соответствовать анатомии лица пациента.</p>
    <p>Используя передовые технологии современной медицины (лазер Endolift, пьезохирургия, 3D-моделирование и т.д.), мы стремимся к максимальному комфорту и минимальному периоду восстановления.</p>
    """,
    'AR': """
    <h3>لماذا البروفيسور الدكتور جوكتشه أوزيل؟</h3>
    <p>البروفيسور الدكتور جوكتشه أوزيل هو اسم رائد في مجال الجراحة التجميلية والبلاستيكية في أنقرة، حيث يجمع بين سنوات من الخبرة الأكاديمية وخبرة آلاف العمليات الناجحة. يتم تخطيط كل إجراء في عيادتنا "بشكل شخصي" ليتوافق تمامًا مع تشريح وجه المريض.</p>
    <p>باستخدام أحدث التقنيات التي يقدمها الطب الحديث (ليزر إندوليفت، جراحة بيزو، النمذجة ثلاثية الأبعاد، إلخ)، نهدف إلى توفير أقصى درجات الراحة وأقصر فترة تعافي.</p>
    """,
    'DE': """
    <h3>Warum Prof. Dr. Gökçe Özel?</h3>
    <p>Prof. Dr. Gökçe Özel ist ein führender Name in der ästhetischen und plastischen Chirurgie in Ankara und verbindet jahrelange akademische Erfahrung mit der Expertise aus tausenden erfolgreichen Operationen. Jedes Verfahren wird "individuell" geplant.</p>
    <p>Durch den Einsatz modernster medizinischer Technologien (Endolift-Laser, Piezo-Chirurgie, 3D-Modellierung usw.) streben wir maximalen Komfort und minimale Erholungszeiten an.</p>
    """,
    'FR': """
    <h3>Pourquoi le Prof. Dr. Gökçe Özel ?</h3>
    <p>Le Prof. Dr. Gökçe Özel est un nom pionnier de la chirurgie esthétique et plastique à Ankara, alliant des années d'acquis académiques à l'expérience de milliers d'opérations réussies. Chaque procédure est planifiée "sur mesure".</p>
    <p>En utilisant les technologies les plus avancées (Laser Endolift, Chirurgie Piezo, Modélisation 3D, etc.), nous visons un confort maximal et un temps de récupération minimal.</p>
    """,
    'CIN': """
    <h3>为什么选择 Gökçe Özel 教授博士？</h3>
    <p>Gökçe Özel 教授博士是安卡拉美容和整形外科领域的先驱，结合了多年的学术积累和数千次成功手术的经验。可以在我们诊所进行的每一个程序都是“量身定制”的。</p>
    <p>利用现代医学提供的最先进技术（Endolift 激光、压电手术、3D 建模等），我们的目标是实现最大的舒适度和最短的恢复时间。</p>
    """
}

# Common "Medical Tourism / Ankara" Block (~200 words)
ANKARA_BLOCKS = {
    'TR': """
    <h3>Ankara'da Sağlık Turizmi ve Konfor</h3>
    <p>Başkent Ankara, Türkiye'nin sağlık turizminde parlayan yıldızıdır. Yüksek standartlı hastaneleri, deneyimli cerrahları ve ulaşım kolaylığı ile uluslararası hastalar için cazip bir merkezdir. Kliniğimiz, şehir dışından ve yurt dışından gelen hastalarımız için konaklama, transfer ve tedavi planlaması konusunda tam destek sunmaktadır.</p>
    """,
    'EN': """
    <h3>Medical Tourism and Comfort in Ankara</h3>
    <p>The capital Ankara is the shining star of health tourism in Turkey. It is an attractive center for international patients with its high-standard hospitals, experienced surgeons, and ease of transportation. Our clinic offers full support for accommodation, transfer, and treatment planning.</p>
    """,
    'RU': """
    <h3>Медицинский туризм и комфорт в Анкаре</h3>
    <p>Столица Анкара — сияющая звезда оздоровительного туризма в Турции. Это привлекательный центр для иностранных пациентов благодаря высококлассным больницам и опытным хирургам. Наша клиника предлагает полную поддержку по размещению, трансферу и планированию лечения.</p>
    """,
    'AR': """
    <h3>السياحة العلاجية والراحة في أنقرة</h3>
    <p>العاصمة أنقرة هي النجم الساطع للسياحة العلاجية في تركيا. إنها مركز جذاب للمرضى الدوليين بفضل مستشفياتها عالية المستوى وجراحيها ذوي الخبرة. تقدم عيادتنا دعمًا كاملاً للإقامة والنقل وتخطيط العلاج.</p>
    """,
    'DE': """
    <h3>Gesundheitstourismus und Komfort in Ankara</h3>
    <p>Die Hauptstadt Ankara ist der leuchtende Stern des Gesundheitstourismus in der Türkei. Mit ihren erstklassigen Krankenhäusern und erfahrenen Chirurgen ist sie ein attraktives Zentrum für internationale Patienten. Unsere Klinik bietet volle Unterstützung bei Unterkunft, Transfer und Behandlungsplanung.</p>
    """,
    'FR': """
    <h3>Tourisme Médical et Confort à Ankara</h3>
    <p>La capitale Ankara est l'étoile brillante du tourisme de santé en Turquie. C'est un centre attractif pour les patients internationaux avec ses hôpitaux de haut niveau et ses chirurgiens expérimentés. Notre clinique offre un soutien complet pour l'hébergement, le transfert et la planification du traitement.</p>
    """,
    'CIN': """
    <h3>安卡拉的医疗旅游与舒适体验</h3>
    <p>首都安卡拉是土耳其医疗旅游的璀璨明星。凭借其高标准的医院、经验丰富的外科医生和便利的交通，它是国际患者极具吸引力的中心。我们的诊所为住宿、接送和治疗计划提供全面支持。</p>
    """
}

# Structural Helper
def build_article(lang, title, hook, definition, anatomy, candidates, procedure, recovery, risks, faq_list):
    """
    Assembles the 'detay' content. 
    Target length: ~2000-2500 words.
    """
    
    # Header Definitions
    HEADER_MAP = {
        'TR': {'def': f"{title} Nedir?", 'anat': "Anatomi ve Medikal Detaylar", 'cand': "Kimler İçin Uygundur?", 'proc': "Uygulama Süreci", 'rec': "İyileşme Süreci", 'risk': "Riskler", 'faq': "Sıkça Sorulan Sorular"},
        'EN': {'def': f"What is {title}?", 'anat': "Anatomy and Medical Details", 'cand': "Who is a Good Candidate?", 'proc': "Procedure Process", 'rec': "Recovery Process", 'risk': "Risks", 'faq': "FAQ"},
        'RU': {'def': f"Что такое {title}?", 'anat': "Анатомия и медицинские детали", 'cand': "Кто подходит для процедуры?", 'proc': "Процесс выполнения", 'rec': "Процесс восстановления", 'risk': "Риски", 'faq': "Часто задаваемые вопросы"},
        'AR': {'def': f"ما هو {title}؟", 'anat': "التشريح والتفاصيل الطبية", 'cand': "من هو المرشح المناسب؟", 'proc': "عملية التطبيق", 'rec': "عملية التعافي", 'risk': "المخاطر", 'faq': "الأسئلة الشائعة"},
        'DE': {'def': f"Was ist {title}?", 'anat': "Anatomie und medizinische Details", 'cand': "Für wen ist es geeignet?", 'proc': "Der Ablauf", 'rec': "Heilungsprozess", 'risk': "Risiken", 'faq': "Häufig gestellte Fragen"},
        'FR': {'def': f"Qu'est-ce que {title} ?", 'anat': "Anatomie et détails médicaux", 'cand': "Qui est un bon candidat ?", 'proc': "Processus d'application", 'rec': "Processus de récupération", 'risk': "Risques", 'faq': "FAQ"},
        'CIN': {'def': f"{title} 是什么？", 'anat': "解剖学和医学细节", 'cand': "谁是合适的候选人？", 'proc': "应用过程", 'rec': "恢复过程", 'risk': "风险", 'faq': "常见问题 (FAQ)"}
    }
    
    h = HEADER_MAP.get(lang, HEADER_MAP['EN'])
    
    if lang == 'TR':
        prep_text = "<p>Başarılı bir sonucun temeli, doğru planlama ve hazırlıkla atılır. Hastalarımızın dikkat etmesi gereken kritik hususlar şunlardır:</p><ul><li><strong>Tıbbi Öykü:</strong> Kullandığınız ilaçlar analiz edilir.</li><li><strong>Kan Sulandırıcılar:</strong> İşlemden 10 gün önce kesilmelidir.</li></ul>"
        prep_title = "Hazırlık Süreci"
    elif lang == 'EN':
        prep_text = "<p>The foundation of a successful result is laid with correct planning. Critical issues include:</p><ul><li><strong>Medical History:</strong> Medications are analyzed.</li><li><strong>Blood Thinners:</strong> Should be stopped 10 days before.</li></ul>"
        prep_title = "Preparation Process"
    elif lang == 'RU':
        prep_text = "<p>Основа успешного результата закладывается при правильном планировании. Важные моменты:</p><ul><li><strong>Медицинская история:</strong> Анализируются принимаемые лекарства.</li><li><strong>Разжижители крови:</strong> Следует прекратить прием за 10 дней.</li></ul>"
        prep_title = "Процесс подготовки"
    elif lang == 'AR':
        prep_text = "<p>يتم وضع أساس النتيجة الناجحة من خلال التخطيط الصحيح. تشمل القضايا الحاسمة:</p><ul><li><strong>التاريخ الطبي:</strong> يتم تحليل الأدوية.</li><li><strong>مميعات الدم:</strong> يجب إيقافها قبل 10 أيام.</li></ul>"
        prep_title = "عملية التحضير"
    elif lang == 'DE':
        prep_text = "<p>Die Grundlage für ein erfolgreiches Ergebnis wird durch die richtige Planung gelegt.</p><ul><li><strong>Krankengeschichte:</strong> Medikamente werden analysiert.</li><li><strong>Blutverdünner:</strong> Sollten 10 Tage vorher abgesetzt werden.</li></ul>"
        prep_title = "Vorbereitungsprozess"
    elif lang == 'FR':
        prep_text = "<p>La base d'un résultat réussi repose sur une planification correcte.</p><ul><li><strong>Antécédents médicaux:</strong> Les médicaments sont analysés.</li><li><strong>Fluidifiants sanguins:</strong> Doivent être arrêtés 10 jours avant.</li></ul>"
        prep_title = "Processus de préparation"
    elif lang == 'CIN':
        prep_text = "<p>成功结果的基础在于正确的规划。关键问题包括：</p><ul><li><strong>病史：</strong> 分析药物。</li><li><strong>血液稀释剂：</strong> 应在10天前停止。</li></ul>"
        prep_title = "准备过程"
    else:
        prep_text = ""
        prep_title = "Preparation"

    html = f"""
    <div class="long-form-content">
        <h3>{h['def']}</h3>
        {definition}
        
        <h3>{h['anat']}</h3>
        {anatomy}
        
        <h3>{h['cand']}</h3>
        {candidates}
        
        <h3>{prep_title}</h3>
        {prep_text}
        
        <h3>{h['proc']}</h3>
        {procedure}
        
        <h3>{h['rec']}</h3>
        {recovery}
        
        <h3>{h['risk']}</h3>
        {risks}
        
        {WHY_US_BLOCKS.get(lang, WHY_US_BLOCKS['EN'])}
        {ANKARA_BLOCKS.get(lang, ANKARA_BLOCKS['EN'])}
        
        <h3>{h['faq']}</h3>
        <div class="faq-section">
    """
    
    for q, a in faq_list:
        html += f"""
            <div class="faq-item" style="margin-bottom:20px;">
                <h4 style="font-size:18px; color:#333;">{q}</h4>
                <p>{a}</p>
            </div>
        """
        
    html += "</div></div>"
    return html

# ---------------------------------------------------------------------
# SPECIFIC CONTENT DATA (The "Meat")
# ---------------------------------------------------------------------

# 1. Rinoplasti Data
RINOPLASTI_HOOK_TR = "Burun estetiği (Rinoplasti), yüzün merkezindeki dengeyi yeniden kurarak kişinin ifadesini, özgüvenini ve nefes alma kalitesini kökten değiştiren en sofistike estetik cerrahi prosedürdür."
RINOPLASTI_DATA_TR = {
    'title': "Burun Estetiği (Rinoplasti)",
    'definition': """
    <p>Rinoplasti, burnun şeklini, boyutunu ve işlevini kalıcı olarak değiştiren cerrahi bir işlemdir. Ancak bu tanım, buzdağının sadece görünen kısmıdır. Rinoplasti, bilim ve sanatın en üst düzeyde buluştuğu noktadır. Amaç sadece "küçük" veya "kavisli" bir burun yapmak değil, yüzün diğer oranlarıyla (çene, alın, elmacık kemikleri) altın orana uygun, harmonik bir yapı oluşturmaktır.</p>
    <p>Modern burun estetiğinde (Preservation Rhinoplasty gibi tekniklerle), burnun doğal bağlarını ve çatısını koruyarak yapılan müdahaleler ön plana çıkmaktadır. Bu sayede "ameliyatlı görünüm"den uzak, doğuştan güzelmiş gibi duran sonuçlar elde edilir. Ayrıca septum deviasyonu (burun kemiği eğriliği) ve konka bülloza (burun eti büyümesi) gibi sorunlar da aynı seansta giderilerek hastanın yaşam kalitesi artırılır.</p>
    """,
    'anatomy': """
    <p>Burnun anatomisi, kemik, kıkırdak, mukoza, kas ve deriden oluşan karmaşık bir mimariye sahiptir. Rinoplasti uzmanı, bu 3 boyutlu yapıyı mükemmel bir şekilde analiz etmelidir:</p>
    <ul>
        <li><strong>Nazal Kemikler:</strong> Burnun üst 1/3'lük kısmını oluşturur. Kemer (hump) alınması veya daraltma işlemleri bu bölgede yapılır.</li>
        <li><strong>Üst Lateral Kıkırdaklar:</strong> Burnun orta çatısını oluşturur ve nefes alma valfinin önemli bir parçasıdır.</li>
        <li><strong>Alar Kıkırdaklar:</strong> Burun ucuna (tip) şeklini veren, hareketli ve hassas kıkırdaklardır. Burun ucu estetiğinde (Tipplasty) bu yapılar yeniden şekillendirilir.</li>
        <li><strong>Septum:</strong> Burnun orta direğini oluşturan kıkırdak yapıdır. Eğrilikleri nefes almayı engeller.</li>
    </ul>
    """,
    'candidates': """
    <p>Rinoplasti için ideal adaylar, fiziksel gelişimini tamamlamış (kadınlarda genellikle 17, erkeklerde 18 yaş sonrası) ve gerçekçi beklentilere sahip bireylerdir. Aşağıdaki durumlardan bir veya birkaçına sahipseniz bu ameliyatı düşünebilirsiniz:</p>
    <ul>
        <li>Burnunuzda kemer (dorsal hump) varsa.</li>
        <li>Burun ucunuz düşük, geniş veya asimetrikse.</li>
        <li>Burnunuz yüzünüze göre çok büyük veya genişse.</li>
        <li>Travma sonucu burun şeklinde bozulma varsa.</li>
        <li>Kronik burun tıkanıklığı, nefes alma güçlüğü yaşıyorsanız.</li>
    </ul>
    """,
    'procedure': """
    <p>Rinoplasti ameliyatları genel anestezi altında yapılır ve ortalama 2-3 saat sürer. Kullanılan tekniğe göre (Açık veya Kapalı Teknik) süreç değişebilir:</p>
    <p><strong>Açık Teknik:</strong> Burun delikleri arasındaki kolumella bölgesine küçük bir kesi yapılır. Deri kaldırılarak tüm burun anatomisi cerrahın görüş alanına girer. Komplike vakalar ve revizyonlar için tercih edilir.</p>
    <p><strong>Kapalı Teknik:</strong> Tüm kesiler burun deliği içinden yapılır. Dışarıda iz kalmaz. İyileşme süreci genellikle daha hızlıdır.</p>
    <p><strong>Piezo Cerrahisi (Ultrasonik Rinoplasti):</strong> Kemiklerin çekiç-keski yerine ultrasonik ses dalgalarıyla şekillendirilmesidir. Yumuşak dokuya zarar vermediği için morluk ve şişlik minimum düzeyde olur.</p>
    """,
    'recovery': """
    <p>İyileşme süreci sabır gerektiren ancak sonucu ödüllendirici bir dönemdir:</p>
    <ul>
        <li><strong>İlk 1 Hafta:</strong> Burun üzerinde termal alçı ve içinde silikon tamponlar bulunur. Tamponlar nefes almayı engellemez. 7. gün alçı ve tamponlar çıkarılır.</li>
        <li><strong>2. Hafta:</strong> Morlukların çoğu (varsa) geçer. Sosyal hayata dönülebilir.</li>
        <li><strong>1-3. Ay:</strong> Ödemlerin %60-70'i iner. Burun şekli oturmaya başlar.</li>
        <li><strong>6-12. Ay:</strong> Burun son şeklini alır (özellikle burun ucu). Kalın derili hastalarda bu süreç 1.5 - 2 yıla uzayabilir.</li>
    </ul>
    """,
    'risks': """
    <p>Her cerrahi işlem gibi rinoplastinin de riskleri vardır (enfeksiyon, kanama, anestezi riskleri vb.). Ancak deneyimli ellerde bu riskler minimaldir. Estetik açıdan %5-10 oranında revizyon (küçük düzeltme) ihtimali dünya genelinde kabul gören bir orandır.</p>
    """,
    'faq': [
        ("Ağrı hisseder miyim?", "Ameliyat genel anestezi altındadır, ağrı duymazsınız. Sonrasında da basit ağrı kesicilerle kontrol altına alınabilen hafif bir sızı olabilir."),
        ("Tamponlar acıtır mı?", "Hayır, artık bez tamponlar yerine kaygan, silikon splintler kullanıyoruz. Çıkarılması saniyeler sürer ve acısızdır."),
        ("İz kalır mı?", "Kapalı teknikte iz kalmaz. Açık teknikte burun ucunda belli belirsiz silik bir iz kalabilir, zamanla kaybolur."),
        ("Ne zaman işe dönebilirim?", "Masa başı işler için 7-10 gün yeterlidir. Fiziksel güç gerektiren işler için 3 hafta beklenmelidir."),
        ("Kalın derili miyim?", "Bunu muayenede en iyi doktorunuz anlar. Kalın deri, burun ucu hatlarını göstermekte dirençlidir, sabır ve özel teknikler gerektirir.")
    ]
}

RINOPLASTI_HOOK_EN = "Rhinoplasty (Nose Job) is the most sophisticated aesthetic surgical procedure that radically changes a person's expression, self-confidence, and breathing quality by restoring balance in the center of the face."
RINOPLASTI_DATA_EN = {
    'title': "Rhinoplasty (Nose Aesthetics)",
    'definition': """
    <p>Rhinoplasty is a surgical procedure that permanently changes the shape, size, and function of the nose. However, this definition is just the tip of the iceberg. Rhinoplasty is where science and art meet at the highest level. The aim is not just to make a "small" or "curved" nose, but to create a harmonic structure that fits the Golden Ratio with other facial proportions (chin, forehead, cheekbones).</p>
    <p>In modern rhinoplasty (with techniques like Preservation Rhinoplasty), interventions that preserve the natural ligaments and roof of the nose come to the fore. This way, results that look "born beautiful" and far from the "operated look" are achieved. Additionally, problems such as septal deviation and concha bullosa are corrected in the same session, improving the patient's quality of life.</p>
    """,
    'anatomy': """
    <p>The anatomy of the nose has a complex architecture consisting of bone, cartilage, mucosa, muscle, and skin. A rhinoplasty expert must analyze this 3D structure perfectly:</p>
    <ul>
        <li><strong>Nasal Bones:</strong> Forms the upper 1/3 of the nose. Hump removal or narrowing procedures are performed here.</li>
        <li><strong>Upper Lateral Cartilages:</strong> Forms the middle roof of the nose and is an important part of the breathing valve.</li>
        <li><strong>Alar Cartilages:</strong> These are mobile and delicate cartilages that give shape to the nasal tip. In tip aesthetics (Tipplasty), these structures are reshaped.</li>
        <li><strong>Septum:</strong> The cartilage structure that forms the central pillar of the nose. Curvatures (deviations) prevent breathing.</li>
    </ul>
    """,
    'candidates': """
    <p>Ideal candidates for rhinoplasty are individuals who have completed their physical development (usually after 17 for women, 18 for men) and have realistic expectations. You can consider this surgery if you have one or more of the following situations:</p>
    <ul>
        <li>If you have a hump (dorsal hump) on your nose.</li>
        <li>If your nasal tip is low, wide, or asymmetrical.</li>
        <li>If your nose is too large or wide for your face.</li>
        <li>If there is distortion in the nose shape due to trauma.</li>
        <li>If you experience chronic nasal congestion or difficulty breathing.</li>
    </ul>
    """,
    'procedure': """
    <p>Rhinoplasty surgeries are performed under general anesthesia and take an average of 2-3 hours. The process may vary according to the technique used (Open or Closed Technique):</p>
    <p><strong>Open Technique:</strong> A small incision is made in the columella region between the nostrils. By lifting the skin, the entire nasal anatomy enters the surgeon's field of view. Preferred for complicated cases and revisions.</p>
    <p><strong>Closed Technique:</strong> All incisions are made inside the nostril. No visible scars remain outside. The healing process is generally faster.</p>
    <p><strong>Piezo Surgery (Ultrasonic Rhinoplasty):</strong> It is the shaping of bones with ultrasonic sound waves instead of a hammer and chisel. Since it does not damage soft tissue, bruising and swelling are minimal.</p>
    """,
    'recovery': """
    <p>The recovery process is a period that requires patience but is rewarding:</p>
    <ul>
        <li><strong>First 1 Week:</strong> There is a thermal cast on the nose and silicone splints inside. Splints do not prevent breathing. On the 7th day, the cast and splints are removed.</li>
        <li><strong>2nd Week:</strong> Most bruises (if any) go away. Return to social life is possible.</li>
        <li><strong>1-3 Months:</strong> 60-70% of edema goes down. The nose shape starts to settle.</li>
        <li><strong>6-12 Months:</strong> The nose takes its final shape (especially the nasal tip). In patients with thick skin, this process can extend to 1.5 - 2 years.</li>
    </ul>
    """,
    'risks': """
    <p>Like any surgical procedure, rhinoplasty has risks (infection, bleeding, anesthesia risks, etc.). However, these risks are minimal in experienced hands. A revision (minor correction) rate of 5-10% is an accepted rate worldwide.</p>
    """,
    'faq': [
        ("Will I feel pain?", "The surgery is under general anesthesia, you will not feel pain. Afterwards, there may be a slight ache that can be controlled with simple painkillers."),
        ("Do tampons hurt?", "No, we use slippery, silicone splints instead of cloth tampons. Removal takes seconds and is painless."),
        ("Will there be a scar?", "No scar remains in the closed technique. In the open technique, a faint scar may remain on the nasal tip, which disappears over time."),
        ("When can I return to work?", "7-10 days are enough for desk jobs. 3 weeks should be expected for jobs requiring physical strength."),
        ("Do I have thick skin?", "Your doctor can understand this best during the examination. Thick skin is resistant to showing nasal tip lines and requires patience and special techniques.")
    ]
}


RINOPLASTI_HOOK_RU = "Ринопластика — это самая сложная эстетическая процедура, которая радикально меняет выражение лица, уверенность в себе и качество дыхания, восстанавливая баланс в центре лица."
RINOPLASTI_DATA_RU = {
    'title': "Ринопластика (Пластика носа)",
    'definition': "<p>Ринопластика — это хирургическая процедура, которая навсегда меняет форму, размер и функцию носа. Цель состоит не просто в том, чтобы сделать «маленький» или «изогнутый» нос, а в том, чтобы создать гармоничную структуру, соответствующую золотому сечению с другими пропорциями лица.</p>",
    'anatomy': "<p>Анатомия носа имеет сложную архитектуру, состоящую из кости, хряща, слизистой оболочки, мышц и кожи. Эксперт по ринопластике должен идеально проанализировать эту трехмерную структуру.</p>",
    'candidates': "<p>Идеальными кандидатами являются лица, завершившие физическое развитие (обычно после 17 лет для женщин, 18 для мужчин).</p>",
    'procedure': "<p>Операции ринопластики проводятся под общим наркозом и занимают в среднем 2-3 часа. Мы используем пьезохирургию (ультразвуковая ринопластика) для минимизации синяков.</p>",
    'recovery': "<p>Первая неделя: на носу гипс, внутри силиконовые сплинты. 2-я неделя: синяки проходят. 6-12 месяцев: нос принимает окончательную форму.</p>",
    'risks': "Как и при любой хирургической процедуре, существуют риски (инфекция, кровотечение), но они минимальны в опытных руках.",
    'faq': [("Больно ли это?", "Операция проходит под общим наркозом, боли нет."), ("Останутся ли шрамы?", "При закрытой технике шрамов не остается.")]
}

RINOPLASTI_HOOK_AR = "عملية تجميل الأنف هي الإجراء الجراحي التجميلي الأكثر تطوراً الذي يغير تعبير الشخص وثقته بنفسه وجودة التنفس بشكل جذري من خلال استعادة التوازن في وسط الوجه."
RINOPLASTI_DATA_AR = {
    'title': "تجميل الأنف (رينوبلاستي)",
    'definition': "<p>تجميل الأنف هو إجراء جراحي يغير شكل وحجم ووظيفة الأنف بشكل دائم. الهدف ليس مجرد صنع أنف 'صغير'، بل إنشاء هيكل متناغم يتناسب مع النسبة الذهبية لملامح الوجه الأخرى.</p>",
    'anatomy': "<p>يتمتع تشريح الأنف ببنية معقدة تتكون من العظام والغضاريف والأغشية المخاطية والعضلات والجلد. يجب على خبير تجميل الأنف تحليل هذا الهيكل ثلاثي الأبعاد بشكل مثالي.</p>",
    'candidates': "<p>المرشحون المثاليون هم الأفراد الذين أكملوا نموهم الجسدي (عادة بعد 17 للنساء، 18 للرجال).</p>",
    'procedure': "<p>تجرى العمليات تحت التخدير العام وتستغرق 2-3 ساعات. نستخدم جراحة بيزو (تجميل الأنف بالموجات فوق الصوتية) لتقليل الكدمات.</p>",
    'recovery': "<p>الأسبوع الأول: جبيرة على الأنف ودعامات سيليكون بالداخل. الأسبوع الثاني: تختفي معظم الكدمات. 6-12 شهرًا: يأخذ الأنف شكله النهائي.</p>",
    'risks': "مثل أي إجراء جراحي، هناك مخاطر (عدوى، نزيف)، لكنها ضئيلة في الأيدي الخبيرة.",
    'faq': [("هل سأشعر بالألم؟", "العملية تحت التخدير العام، لن تشعر بالألم."), ("هل ستبقى ندوب؟", "لا توجد ندوب في التقنية المغلقة.")]
}

RINOPLASTI_HOOK_DE = "Die Nasenkorrektur ist der anspruchsvollste ästhetische Eingriff, der den Ausdruck, das Selbstvertrauen und die Atemqualität einer Person radikal verändert, indem er das Gleichgewicht im Gesichtszentrum wiederherstellt."
RINOPLASTI_DATA_DE = {
    'title': "Nasenkorrektur (Rhinoplastik)",
    'definition': "<p>Die Rhinoplastik ist ein chirurgischer Eingriff, der Form, Größe und Funktion der Nase dauerhaft verändert. Das Ziel ist eine harmonische Struktur, die dem Goldenen Schnitt entspricht.</p>",
    'anatomy': "<p>Die Anatomie der Nase besteht aus Knochen, Knorpel, Schleimhaut, Muskeln und Haut. Ein Experte muss diese 3D-Struktur perfekt analysieren.</p>",
    'candidates': "<p>Ideale Kandidaten sind Personen, deren körperliche Entwicklung abgeschlossen ist (meist nach 17 bei Frauen, 18 bei Männern).</p>",
    'procedure': "<p>Die Operationen werden unter Vollnarkose durchgeführt und dauern durchschnittlich 2-3 Stunden. Wir verwenden Piezo-Chirurgie (Ultraschall), um Blutergüsse zu minimieren.</p>",
    'recovery': "<p>Erste Woche: Gips auf der Nase, Silikonschienen innen. 2. Woche: Blutergüsse verschwinden. 6-12 Monate: Die Nase nimmt ihre endgültige Form an.</p>",
    'risks': "Wie bei jedem Eingriff gibt es Risiken (Infektion, Blutung), diese sind jedoch in erfahrenen Händen minimal.",
    'faq': [("Werde ich Schmerzen haben?", "Die OP erfolgt unter Vollnarkose, Sie spüren keinen Schmerz."), ("Bleiben Narben?", "Bei der geschlossenen Technik bleiben keine Narben.")]
}

RINOPLASTI_HOOK_FR = "La rhinoplastie est la procédure esthétique la plus sophistiquée qui change radicalement l'expression, la confiance en soi et la qualité de la respiration en rétablissant l'équilibre au centre du visage."
RINOPLASTI_DATA_FR = {
    'title': "Rhinoplastie (Chirurgie du nez)",
    'definition': "<p>La rhinoplastie est une intervention chirurgicale qui modifie durablement la forme, la taille et la fonction du nez. L'objectif est de créer une structure harmonique conforme au Nombre d'Or.</p>",
    'anatomy': "<p>L'anatomie du nez a une architecture complexe composée d'os, de cartilage, de muqueuse, de muscle et de peau. Un expert doit analyser parfaitement cette structure 3D.</p>",
    'candidates': "<p>Les candidats idéaux sont les personnes ayant terminé leur développement physique (généralement après 17 ans pour les femmes, 18 ans pour les hommes).</p>",
    'procedure': "<p>Les opérations se font sous anesthésie générale et durent en moyenne 2-3 heures. Nous utilisons la chirurgie Piezo (ultrasons) pour minimiser les bleus.</p>",
    'recovery': "<p>1ère semaine : plâtre sur le nez, attelles en silicone à l'intérieur. 2ème semaine : les bleus disparaissent. 6-12 mois : le nez prend sa forme définitive.</p>",
    'risks': "Comme pour toute intervention, il existe des risques, mais ils sont minimes entre des mains expérimentées.",
    'faq': [("Vais-je ressentir de la douleur ?", "L'opération est sous anesthésie générale, vous ne sentirez rien."), ("Y aura-t-il des cicatrices ?", "Aucune cicatrice visible avec la technique fermée.")]
}

RINOPLASTI_HOOK_CIN = "隆鼻手术是最复杂的美容外科手术，通过恢复面部中心的平衡，彻底改变人的表情、自信和呼吸质量。"
RINOPLASTI_DATA_CIN = {
    'title': "隆鼻手术 (鼻整形术)",
    'definition': "<p>隆鼻手术是一种永久改变鼻子形状、大小和功能的手术程序。目标不仅仅是做一个“小”鼻子，而是创造一个符合黄金比例的和谐结构。</p>",
    'anatomy': "<p>鼻子的解剖结构复杂，由骨骼、软骨、粘膜、肌肉和皮肤组成。隆鼻专家必须完美分析这种3D结构。</p>",
    'candidates': "<p>理想的候选人是身体发育完成的个人（通常女性17岁以后，男性18岁以后）。</p>",
    'procedure': "<p>手术在全身麻醉下进行，平均需要2-3小时。我们使用压电手术（超声波隆鼻）以最大限度地减少瘀伤。</p>",
    'recovery': "<p>第1周：鼻子上由石膏，内部有硅胶夹板。第2周：大部分瘀伤消失。6-12个月：鼻子呈现最终形状。</p>",
    'risks': "与任何手术一样，存在风险（感染、出血），但在经验丰富的手中风险极小。",
    'faq': [("我会感到疼痛吗？", "手术在全麻下进行，您不会感到疼痛。"), ("会留疤吗？", "闭合技术不留疤痕。")]
}

# 2. Endolift Data
ENDOLIFT_HOOK_TR = "Geleneksel yüz germe ameliyatlarının risklerinden ve iyileşme sürelerinden çekinenler için Endolift Lazer, cerrahi neştersiz, dikişsiz ve konforlu bir gençleşme devrimi sunuyor."
ENDOLIFT_DATA_TR = {
    'title': "Endolift Lazer (Lazer Destekli Yüz Germe)",
    'definition': """
    <p>Endolift, saç teli inceliğindeki mikroskobik lazer fiberlerinin cilt altına (hipodermis) girerek, dokuyu içeriden sıkılaştırdığı, yağları erittiği ve kolajen üretimini tetiklediği FDA onaylı bir teknolojidir. Bu yöntem, "Interstisyel Lazer Lifting" olarak da bilinir. Cerrahi bir kesi yapılmaz, sadece iğne deliği kadar küçük giriş noktaları kullanılır.</p>
    """,
    'anatomy': """
    <p>Yaşlanma ile birlikte yüzdeki yağ yastıkçıkları yer değiştirir ve cilt elastikiyetini kaybeder (sarkar). Endolift, 1470 nm dalga boyuna sahip diod lazer enerjisiyle doğrudan bu sorunlu katmanlara ulaşır. Lazer enerjisi şunları sağlar:</p>
    <ul>
        <li><strong>Lipoliz:</strong> Gıdı (jowl) ve yanak bölgesindeki fazla yağı eritir.</li>
        <li><strong>Retraksiyon:</strong> Bağ dokusunu ve cildi anında gererek sıkılaştırır (lifting etkisi).</li>
        <li><strong>Neokollajenesis:</strong> İşlemden sonraki aylarda devam edecek yeni kolajen oluşumunu başlatır.</li>
    </ul>
    """,
    'candidates': """
    <p>Endolift, hafif ve orta derecede cilt sarkması olan, cerrahi operasyon istemeyenler için idealdir:</p>
    <ul>
        <li>Gıdı sarkması olanlar.</li>
        <li>Jawline (çene hattı) belirginliğini kaybetmiş kişiler.</li>
        <li>Nazolabial çizgileri derinleşenler.</li>
        <li>Göz altı torbaları olanlar.</li>
        <li>Boyun bölgesinde gevşeme başlayanlar.</li>
    </ul>
    """,
    'procedure': """
    <p>İşlem lokal anestezi veya soğutucu hava (soğuk anestezi) eşliğinde klinik ortamında yapılır. Yaklaşık 45-60 dakika sürer. Lazer fiberi cilt altında yelpaze şeklinde hareket ettirilerek tarama yapılır. Hasta işlem sırasında acı hissetmez, sadece hafif bir sıcaklık duyabilir.</p>
    """,
    'recovery': """
    <p>Endolift'in en büyük avantajı "sıfır nekahat dönemi"dir (downtime). Hasta işlemden hemen sonra sosyal hayatına dönebilir. Hafif bir ödem veya nadiren küçük morluklar olabilir, bunlar 3-5 günde geçer. Etkisi hemen görülmeye başlar ancak asıl sonuç 3. aydan itibaren kolajen üretimiyle zirveye ulaşır.</p>
    """,
    'risks': "Ciddi bir riski yoktur. Nadiren geçici hissizlik veya asimetrik ödem oluşabilir, kendiliğinden düzelir.",
    'faq': [
        ("Kalıcılığı ne kadardır?", "Kişinin cilt yapısına ve yaşına göre 2-5 yıl arasında kalıcılığı vardır."),
        ("Kaç seans gerekir?", "Genellikle tek seans yeterlidir. İleri vakalarda 6 ay sonra tekrar edilebilir."),
        ("Yazın yapılır mı?", "Evet, cilt yüzeyinde hasar oluşturmadığı için her mevsim güvenle uygulanabilir."),
        ("Acır mı?", "Minimal bir rahatsızlık olabilir, lokal anestezi ile tamamen konforlu hale getirilir.")
    ]
}

ENDOLIFT_HOOK_EN = "For those who shy away from the risks and recovery times of traditional facelifts, Endolift Laser offers a surgical scalpel-free, stitch-free, and comfortable rejuvenation revolution."
ENDOLIFT_DATA_EN = {
    'title': "Endolift Laser (Laser Assisted Face Ligting)",
    'definition': """
    <p>Endolift is an FDA-approved technology where microscopic laser fibers as thin as hair strands enter under the skin (hypodermis), tightening the tissue from the inside, melting fats, and triggering collagen production. This method is also known as "Interstitial Laser Lifting". No surgical incision is made, only entry points as small as pinholes are used.</p>
    """,
    'anatomy': """
    <p>With aging, fat pads in the face displace and skin loses elasticity (sags). Endolift reaches these problematic layers directly with diode laser energy with a wavelength of 1470 nm. Laser energy provides:</p>
    <ul>
        <li><strong>Lipolysis:</strong> Melts excess fat in the jowl (jowl) and cheek area.</li>
        <li><strong>Retraction:</strong> Tightens connective tissue and skin instantly (lifting effect).</li>
        <li><strong>Neocollagenesis:</strong> Initiates new collagen formation that will continue in the months following the procedure.</li>
    </ul>
    """,
    'candidates': """
    <p>Endolift is ideal for those with mild to moderate skin sagging who do not want surgical operation:</p>
    <ul>
        <li>Those with jowl sagging.</li>
        <li>Those who have lost jawline (jawline) definition.</li>
        <li>Those with deepening nasolabial lines.</li>
        <li>Those with under-eye bags.</li>
        <li>Those starting to have loosening in the neck area.</li>
    </ul>
    """,
    'procedure': """
    <p>The procedure is performed in a clinical setting accompanied by local anesthesia or cooling air (cold anesthesia). It takes about 45-60 minutes. The laser fiber is moved under the skin in a fan shape to scan. The patient does not feel pain during the procedure, only a slight warmth.</p>
    """,
    'recovery': """
    <p>The biggest advantage of Endolift is "zero downtime". The patient can return to social life immediately after the procedure. There may be slight edema or rarely small bruises, which pass in 3-5 days. The effect starts to be seen immediately but the main result reaches its peak with collagen production from the 3rd month on.</p>
    """,
    'risks': "There is no serious risk. Rarely, temporary numbness or asymmetric edema may occur, which resolves spontaneously.",
    'faq': [
        ("How long does it last?", "It has a permanence between 2-5 years depending on the person's skin structure and age."),
        ("How many sessions are needed?", "Usually a single session is sufficient. In advanced cases, it can be repeated after 6 months."),
        ("Can it be done in summer?", "Yes, since it does not cause damage on the skin surface, it can be applied safely in every season."),
        ("Does it hurt?", "There may be minimal discomfort, it is made completely comfortable with local anesthesia.")
    ]
}


ENDOLIFT_HOOK_RU = "Для тех, кто боится рисков и периода восстановления традиционной подтяжки лица, лазер Endolift предлагает революционное омоложение без скальпеля, швов и с комфортом."
ENDOLIFT_DATA_RU = {
    'title': "Эндолифтинг (Лазерная подтяжка лица)",
    'definition': "<p>Endolift — это технология, одобренная FDA, при которой микроскопические лазерные волокна вводятся под кожу, подтягивая ткани изнутри и расплавляя жир.</p>",
    'anatomy': "<p>С возрастом жировые пакеты смещаются. Endolift воздействует на эти слои диодным лазером 1470 нм.</p>",
    'candidates': "<p>Идеально подходит для тех, у кого легкое или умеренное провисание кожи и кто не хочет хирургического вмешательства.</p>",
    'procedure': "<p>Проводится под местной анестезией. Занимает 45-60 минут.</p>",
    'recovery': "<p>Нулевой период восстановления. Можно сразу вернуться к социальной жизни.</p>",
    'risks': "Серьезных рисков нет. Редко временный отек.",
    'faq': [("Как долго держится?", "2-5 лет."), ("Больно ли это?", "Минимальный дискомфорт.")]
}

ENDOLIFT_HOOK_AR = "بالنسبة لأولئك الذين يخشون مخاطر وفترات الشفاء من عمليات شد الوجه التقليدية، يقدم ليزر إندوليفت ثورة تجديد شباب مريحة وبدون جراحة أو غرز."
ENDOLIFT_DATA_AR = {
    'title': "إندوليفت ليزر (شد الوجه بالليزر)",
    'definition': "<p>إندوليفت هي تقنية معتمدة من FDA حيث تدخل ألياف الليزر المجهرية تحت الجلد، وتشد الأنسجة من الداخل وتذيب الدهون.</p>",
    'anatomy': "<p>مع التقدم في السن، تتحرك وسادات الدهون. يصل إندوليفت إلى هذه الطبقات مباشرة بطاقة ليزر دايود.</p>",
    'candidates': "<p>مثالي لأولئك الذين يعانون من ترهل الجلد الخفيف إلى المتوسط ولا يرغبون في إجراء جراحة.</p>",
    'procedure': "<p>يتم إجراؤه تحت التخدير الموضعي. يستغرق 45-60 دقيقة.</p>",
    'recovery': "<p>بدون فترة نقاهة. يمكن العودة للحياة الاجتماعية فوراً.</p>",
    'risks': "لا توجد مخاطر جسيمة.",
    'faq': [("كم يستمر؟", "2-5 سنوات."), ("هل هو مؤلم؟", "انزعاج طفيف.")]
}

ENDOLIFT_HOOK_DE = "Für diejenigen, die die Risiken und Erholungszeiten traditioneller Facelifts scheuen, bietet der Endolift-Laser eine Revolution der Verjüngung ohne Skalpell, ohne Nähte und mit Komfort."
ENDOLIFT_DATA_DE = {
    'title': "Endolift Laser (Laser-Facelift)",
    'definition': "<p>Endolift ist eine FDA-zugelassene Technologie, bei der mikroskopische Laserfasern unter die Haut eingeführt werden, um das Gewebe von innen zu straffen und Fett zu schmelzen.</p>",
    'anatomy': "<p>Mit dem Alter verschieben sich Fettpolster. Endolift erreicht diese Schichten direkt mit Diodenlaserenergie.</p>",
    'candidates': "<p>Ideal für Personen mit leichter bis mittlerer Hauterschlaffung, die keine Operation wünschen.</p>",
    'procedure': "<p>Wird unter örtlicher Betäubung durchgeführt. Dauert 45-60 Minuten.</p>",
    'recovery': "<p>Keine Ausfallzeit. Sofortige Rückkehr ins soziale Leben.</p>",
    'risks': "Keine ernsthaften Risiken.",
    'faq': [("Wie lange hält es?", "2-5 Jahre."), ("Tut es weh?", "Minimales Unbehagen.")]
}

ENDOLIFT_HOOK_FR = "Pour ceux qui craignent les risques et les temps de récupération des liftings traditionnels, le laser Endolift offre une révolution de rajeunissement sans scalpel, sans suture et confortable."
ENDOLIFT_DATA_FR = {
    'title': "Endolift Laser (Lifting Assisté par Laser)",
    'definition': "<p>Endolift est une technologie approuvée par la FDA où des fibres laser microscopiques pénètrent sous la peau, resserrant les tissus de l'intérieur.</p>",
    'anatomy': "<p>Avec l'âge, les coussinets graisseux se déplacent. Endolift atteint ces couches directement.</p>",
    'candidates': "<p>Idéal pour ceux qui ont un relâchement cutané léger à modéré et ne veulent pas de chirurgie.</p>",
    'procedure': "<p>Se fait sous anesthésie locale. Dure 45-60 minutes.</p>",
    'recovery': "<p>Aucun temps d'arrêt. Retour immédiat à la vie sociale.</p>",
    'risks': "Pas de risques sérieux.",
    'faq': [("Combien de temps ça dure ?", "2-5 ans."), ("Est-ce douloureux ?", "Inconfort minimal.")]
}

ENDOLIFT_HOOK_CIN = "对于那些因传统整容手术的风险和恢复时间而退缩的人来说，Endolift 激光提供了一场无需手术刀、无需缝合且舒适的年轻化革命。"
ENDOLIFT_DATA_CIN = {
    'title': "Endolift 激光 (激光面部提升)",
    'definition': "<p>Endolift 是一项 FDA 批准的技术，其中微小的激光纤维进入皮下，从内部收紧组织并融化脂肪。</p>",
    'anatomy': "<p>随着年龄的增长，脂肪垫移位。Endolift 直接利用二极管激光能量到达这些层。</p>",
    'candidates': "<p>非常适合皮肤轻度至中度松弛且不想动手术的人。</p>",
    'procedure': "<p>在局部麻醉下进行。大约需要 45-60 分钟。</p>",
    'recovery': "<p>零恢复期。立即恢复社交生活。</p>",
    'risks': "没有严重风险。",
    'faq': [("持续多久？", "2-5 年。"), ("疼吗？", "极轻微的不适。")]
}

# 3. İp Askı Data
IP_HOOK_TR = "Yerçekimine karşı etkili, anında sonuç veren ve ameliyatsız bir çözüm arayanlar için İp Askı (Fransız Askısı), yüzü yukarı taşıyarak dinamik ve genç bir ifade kazandırır."
IP_DATA_TR = {
    'title': "İp Askı ile Yüz Germe (Fransız Askısı / Face Lift)",
    'definition': """
    <p>İp askı, veya popüler adıyla Fransız Askısı, biyouyumlu (vücutla dost) ve zamanla eriyebilen veya kalıcı olabilen özel iplerin cilt altına yerleştirilerek yüzün mekanik olarak yukarı asılması işlemidir. Bu iplerin üzerindeki küçük çentikler (kılçıklar) dokuya tutunarak güçlü bir lifting etkisi yaratır.</p>
    """,
    'anatomy': """
    <p>Yaşla birlikte SMAS tabakası ve cilt gevşer. İpler, şakak bölgesindeki temporal fasyaya (sağlam doku) sabitlenerek, sarkan yanak, çene ve boyun dokusunu yukarı çeker. Kullanılan ipler genellikle PDO (Polidioksanon), PLA (Polilaktik Asit) veya kalıcı silikon/polyester materyallerden üretilir.</p>
    """,
    'candidates': """
    <p>35-60 yaş arası, cilt kalitesi nispeten iyi olan ancak sarkma yaşayan hastalar en uygun adaylardır. Çok ince veya çok ağır/kalın cilde sahip kişilerde etkinlik azalabilir.</p>
    """,
    'procedure': """
    <p>Lokal anestezi altında, yaklaşık 30-45 dakikada tamamlanır. İpler kanüller yardımıyla cilt altına (saçlı deri içinden veya kulak önünden) girilerek yerleştirilir. İz kalmaz, dikiş atılmaz.</p>
    """,
    'recovery': """
    <p>İşlem sonrası yüzdeki gerginlik hissi 1 hafta kadar sürebilir. İlk 3 hafta yüz üstü yatılmamalı, aşırı mimik yapılmamalı ve masajdan kaçınılmalıdır. Sosyal hayata dönüş 1-2 gün içindedir.</p>
    """,
    'risks': "İp kopması, asimetri veya gamzeleşme (dimpling) nadiren görülebilir. Deneyimli ellerde masajla düzeltilebilir.",
    'faq': [
        ("İpler yüzümde hissedilir mi?", "Hayır, doğru derinliğe yerleştirilen ipler elleyince veya bakınca hissedilmez."),
        ("Ne kadar dayanır?", "Eriyebilen ipler 1-2 yıl, kalıcı ipler (Fransız askı) 3-5 yıl veya daha fazla süre etkilidir."),
        ("Mimiklerimi bozar mı?", "Hayır, doğal ifadeyi bozmaz, sadece 'yukarı' taşır.")
    ]
}

IP_HOOK_EN = "For those seeking an effective, instantly rewarding, and non-surgical solution against gravity, Thread Lift (French Lift) gives a dynamic and young expression by carrying the face upwards."
IP_DATA_EN = {
    'title': "Thread Lift (French Lift / Face Lift)",
    'definition': """
    <p>Thread lift, or popularly known as French Lift, is the process of mechanically suspending the face upwards by placing biocompatible (body-friendly) and dissolvable or permanent special threads under the skin. The small notches (barbs) on these threads hold onto the tissue creating a strong lifting effect.</p>
    """,
    'anatomy': """
    <p>With age, the SMAS layer and skin loosen. Threads are fixed to the temporal fascia (strong tissue) in the temple area, pulling up the sagging cheek, chin, and neck tissue. Threads used are generally produced from PDO (Polydioxanone), PLA (Polylactic Acid), or permanent silicone/polyester materials.</p>
    """,
    'candidates': """
    <p>Patients between the ages of 35-60, with relatively good skin quality but experiencing sagging, are the most suitable candidates. Efficiency may decrease in people with very thin or very heavy/thick skin.</p>
    """,
    'procedure': """
    <p>It is completed in about 30-45 minutes under local anesthesia. Threads are placed under the skin (from inside the hairy scalp or in front of the ear) with the help of cannulas. No scar remains, no stitches are thrown.</p>
    """,
    'recovery': """
    <p>The tension feeling on the face after the procedure may last up to 1 week. For the first 3 weeks, one should not lie on the face, excessive facial expressions should not be made, and massage should be avoided. Return to social life is within 1-2 days.</p>
    """,
    'risks': "Thread breakage, asymmetry, or dimpling can rarely be seen. It can be corrected with massage in experienced hands.",
    'faq': [
        ("Are threads felt on my face?", "No, threads placed at the correct depth are not felt when touched or looked at."),
        ("How long does it last?", "Dissolvable threads are effective for 1-2 years, permanent threads (French lift) for 3-5 years or more."),
        ("Does it distort my mimics?", "No, it does not distort the natural expression, it only carries it 'up'.")
    ]
}


IP_HOOK_RU = "Для тех, кто ищет эффективное, мгновенное и безоперационное решение против гравитации, нитевой лифтинг придает лицу динамичное и молодое выражение, подтягивая его вверх."
IP_DATA_RU = {
    'title': "Нитевой лифтинг (Французский лифтинг)",
    'definition': "<p>Нитевой лифтинг — это процесс механического подтягивания лица вверх путем введения под кожу биосовместимых специальных нитей.</p>",
    'anatomy': "<p>С возрастом слой SMAS ослабевает. Нити фиксируются к височной фасции, подтягивая провисшие ткани.</p>",
    'candidates': "<p>Пациенты 35-60 лет с относительно хорошим качеством кожи.</p>",
    'procedure': "<p>Завершается за 30-45 минут под местной анестезией. Шрамов не остается.</p>",
    'recovery': "<p>Ощущение стянутости может длиться до 1 недели. Возвращение к социальной жизни за 1-2 дня.</p>",
    'risks': "Редко: разрыв нити, асимметрия.",
    'faq': [("Чувствуются ли нити?", "Нет."), ("Как долго держится?", "Рассасывающиеся 1-2 года, постоянные 3-5 лет.")]
}

IP_HOOK_AR = "لأولئك الذين يبحثون عن حل فعال وفوري وغير جراحي ضد الجاذبية، يمنح شد الوجه بالخيوط تعبيراً ديناميكياً وشاباً عن طريق رفع الوجه لأعلى."
IP_DATA_AR = {
    'title': "شد الوجه بالخيوط (الخيوط الفرنسية)",
    'definition': "<p>شد الوجه بالخيوط هو عملية تعليق الوجه ميكانيكياً لأعلى عن طريق وضع خيوط خاصة متوافقة حيوياً تحت الجلد.</p>",
    'anatomy': "<p>مع التقدم في السن، ترتخي طبقة SMAS. يتم تثبيت الخيوط في اللفافة الصدغية، مما يرفع الأنسجة المترهلة.</p>",
    'candidates': "<p>المرضى الذين تتراوح أعمارهم بين 35-60 عاماً والذين يتمتعون بجودة بشرة جيدة نسبياً.</p>",
    'procedure': "<p>تكتمل في حوالي 30-45 دقيقة تحت التخدير الموضعي. لا تبقى ندوب.</p>",
    'recovery': "<p>قد يستمر الشعور بالشد لمدة أسبوع. العودة للحياة الاجتماعية خلال 1-2 يوم.</p>",
    'risks': "نادرًا: قطع الخيط، عدم التماثل.",
    'faq': [("هل الخيوط محسوسة؟", "لا."), ("كم تستمر؟", "قابل للامتصاص 1-2 سنة، دائم 3-5 سنوات.")]
}

IP_HOOK_DE = "Für alle, die eine effektive, sofort wirksame und nicht-chirurgische Lösung gegen die Schwerkraft suchen, verleiht das Fadenlifting dem Gesicht durch Anheben einen dynamischen und jugendlichen Ausdruck."
IP_DATA_DE = {
    'title': "Fadenlifting (Französisches Lifting)",
    'definition': "<p>Fadenlifting ist der Prozess der mechanischen Aufhängung des Gesichts nach oben durch das Einführen spezieller Fäden unter die Haut.</p>",
    'anatomy': "<p>Mit dem Alter lockert sich die SMAS-Schicht. Fäden werden an der Schläfenfaszie fixiert und ziehen das Gewebe hoch.</p>",
    'candidates': "<p>Patienten zwischen 35-60 mit relativ guter Hautqualität.</p>",
    'procedure': "<p>Dauert 30-45 Minuten unter Lokalanästhesie. Keine Narben.</p>",
    'recovery': "<p>Spannungsgefühl kann bis zu 1 Woche anhalten. Rückkehr zum sozialen Leben in 1-2 Tagen.</p>",
    'risks': "Selten: Fadenriss, Asymmetrie.",
    'faq': [("Spürt man die Fäden?", "Nein."), ("Wie lange hält es?", "Abbaubar 1-2 Jahre, permanent 3-5 Jahre.")]
}

IP_HOOK_FR = "Pour ceux qui recherchent une solution efficace, instantanée et non chirurgicale contre la gravité, le lifting par fils donne une expression dynamique et jeune en remontant le visage."
IP_DATA_FR = {
    'title': "Lifting par Fils (Lifting Français)",
    'definition': "<p>Le lifting par fils est le processus de suspension mécanique du visage vers le haut en plaçant des fils spéciaux sous la peau.</p>",
    'anatomy': "<p>Avec l'âge, la couche SMAS se relâche. Les fils sont fixés au fascia temporal, remontant les tissus affaissés.</p>",
    'candidates': "<p>Patients entre 35-60 ans avec une qualité de peau relativement bonne.</p>",
    'procedure': "<p>Terminé en 30-45 minutes sous anesthésie locale. Pas de cicatrices.</p>",
    'recovery': "<p>La sensation de tension peut durer 1 semaine. Retour à la vie sociale en 1-2 jours.</p>",
    'risks': "Rarement : rupture de fil, asymétrie.",
    'faq': [("Sent-on les fils ?", "Non."), ("Combien de temps ?", "Résorbable 1-2 ans, permanent 3-5 ans.")]
}

IP_HOOK_CIN = "对于那些寻找对抗地心引力的有效、立竿见影且非手术解决方案的人来说，埋线提升通过向上提拉面部，赋予其充满活力和年轻的表情。"
IP_DATA_CIN = {
    'title': "埋线提升 (法国提升)",
    'definition': "<p>埋线提升是通过在皮下植入生物相容的特殊线，将面部机械地向上悬挂的过程。</p>",
    'anatomy': "<p>随着年龄增长，SMAS层松弛。线固定在颞筋膜上，拉起下垂的组织。</p>",
    'candidates': "<p>35-60岁之间皮肤质量相对较好的患者。</p>",
    'procedure': "<p>在局部麻醉下30-45分钟完成。不留疤痕。</p>",
    'recovery': "<p>紧绷感可能持续1周。1-2天内恢复社交生活。</p>",
    'risks': "罕见：线断裂，不对称。",
    'faq': [("能感觉到线吗？", "不能。"), ("能维持多久？", "可吸收1-2年，永久3-5年。")]
}

# 4. Göz Kapağı (Blefaroplasti)
BLEF_HOOK_TR = "Yorgun, uykusuz ve yaşlı bir ifadenin en büyük nedeni olan göz kapağı sarkmaları, Blefaroplasti ile yerini canlı, dinç ve genç bir bakışa bırakır."
BLEF_DATA_TR = {
    'title': "Göz Kapağı Estetiği (Blefaroplasti)",
    'definition': "<p>Blefaroplasti, alt ve üst göz kapaklarındaki fazla deri, kas ve fıtıklaşmış yağ dokularının çıkarılarak göz çevresinin gençleştirilmesi işlemidir.</p>",
    'anatomy': "<p>Göz kapağı derisi vücudun en ince derisidir. Yaşla birlikte orbital septum gevşer ve yağ paketçikleri dışarı fırlar (torbalanma). Cilt elastikiyetini kaybederek sarkar.</p>",
    'candidates': "<p>Göz kapağında düşüklük görme alanını kapatıyorsa, göz altı torbaları yorgun gösteriyorsa uygundur.</p>",
    'procedure': "<p>Üst kapak lokal anesteziyle 45 dk, alt kapak genellikle sedasyon/genel anesteziyle 1.5 saat sürer. Üstte kapak kıvrımından, altta kirpik dibinden kesi yapılır.</p>",
    'recovery': "<p>Dikişler 5-7 günde alınır. Morluk ve şişlik ilk 3 gün zirve yapar, 10 günde geçer.</p>",
    'risks': "Kuru göz, enfeksiyon, geçici asimetri.",
    'faq': [("İz kalır mı?", "Kesi yerleri doğal kıvrımlara gizlendiği için izler belirsizdir."), ("Görme bozulur mu?", "Hayır, göze dokunulmaz.")]
}

BLEF_HOOK_EN = "Eyelid sagging, which is the biggest cause of a tired, sleepless, and old expression, leaves its place to a lively, vigorous, and young look with Blepharoplasty."
BLEF_DATA_EN = {
    'title': "Eyelid Aesthetics (Blepharoplasty)",
    'definition': "<p>Blepharoplasty is the rejuvenation of the eye area by removing excess skin, muscle, and herniated fat tissues in the lower and upper eyelids.</p>",
    'anatomy': "<p>Eyelid skin is the thinnest skin of the body. With age, the orbital septum loosens and fat pads bulge out (bagging). Skin loses its elasticity and sags.</p>",
    'candidates': "<p>It is suitable if droopiness in the eyelid closes the visual field, or if under-eye bags make you look tired.</p>",
    'procedure': "<p>Upper lid takes 45 mins with local anesthesia, lower lid usually takes 1.5 hours with sedation/general anesthesia. Incision is made from the lid fold on top, from the eyelash bottom at the bottom.</p>",
    'recovery': "<p>Stitches are removed in 5-7 days. Bruising and swelling peak in the first 3 days, pass in 10 days.</p>",
    'risks': "Dry eye, infection, temporary asymmetry.",
    'faq': [("Will there be a scar?", "Since incision sites are hidden in natural folds, scars are indistinct."), ("Is vision impaired?", "No, the eye is not touched.")]
}


BLEF_HOOK_RU = "Обвисание век — главная причина усталого и старого вида. Блефаропластика возвращает живой и молодой взгляд."
BLEF_DATA_RU = {
    'title': "Блефаропластика (Пластика век)",
    'definition': "<p>Блефаропластика — это омоложение области вокруг глаз путем удаления лишней кожи, мышц и жировых грыж на веках.</p>",
    'anatomy': "<p>Кожа век самая тонкая. С возрастом орбитальная перегородка ослабевает, и жировые пакеты выпячиваются.</p>",
    'candidates': "<p>Если нависание века закрывает поле зрения или мешки под глазами придают усталый вид.</p>",
    'procedure': "<p>Верхнее веко 45 мин под местной анестезией, нижнее 1.5 часа.</p>",
    'recovery': "<p>Швы снимают на 5-7 день. Синяки проходят за 10 дней.</p>",
    'risks': "Сухость глаз, инфекция.",
    'faq': [("Останется ли шрам?", "Шрамы скрыты в естественных складках."), ("Повредится ли зрение?", "Нет.")]
}

BLEF_HOOK_AR = "ترهل الجفن هو السبب الأكبر للمظهر المتعب والقديم. رأب الجفن يعيد مظهرًا حيويًا وشابًا."
BLEF_DATA_AR = {
    'title': "تجميل الجفون (رأب الجفن)",
    'definition': "<p>رأب الجفن هو تجديد شباب منطقة العين عن طريق إزالة الجلد والعضلات والأنسجة الدهنية الزائدة في الجفون.</p>",
    'anatomy': "<p>جلد الجفن هو الأرق. مع تقدم العمر، يضعف الحاجز المداري وتبرز وسادات الدهون.</p>",
    'candidates': "<p>مناسب إذا كان ترهل الجفن يغلق مجال الرؤية.</p>",
    'procedure': "<p>الجفن العلوي 45 دقيقة تحت تخدير موضعي.</p>",
    'recovery': "<p>تزال الغرز في 5-7 أيام. تختفي الكدمات في 10 أيام.</p>",
    'risks': "جفاف العين، عدوى.",
    'faq': [("هل ستبقى ندبة؟", "تخفى الندوب في الطيات الطبيعية."), ("هل يتأثر البصر؟", "لا.")]
}

BLEF_HOOK_DE = "Schlupflider sind die Hauptursache für einen müden und alten Ausdruck. Die Blepharoplastik sorgt wieder für einen lebendigen und jungen Blick."
BLEF_DATA_DE = {
    'title': "Augenlidkorrektur (Blepharoplastik)",
    'definition': "<p>Blepharoplastik ist die Verjüngung der Augenpartie durch Entfernung von überschüssiger Haut und Fettgewebe.</p>",
    'anatomy': "<p>Die Augenhaut ist die dünnste. Im Alter lockert sich das Orbitalseptum.</p>",
    'candidates': "<p>Geeignet, wenn hängende Lider das Gesichtsfeld einschränken.</p>",
    'procedure': "<p>Oberlid 45 Min. in Lokalanästhesie.</p>",
    'recovery': "<p>Fäden werden nach 5-7 Tagen gezogen. Blutergüsse vergehen in 10 Tagen.</p>",
    'risks': "Trockenes Auge, Infektion.",
    'faq': [("Bleibt eine Narbe?", "Narben sind in natürlichen Falten versteckt."), ("Wird das Sehen beeinträchtigt?", "Nein.")]
}

BLEF_HOOK_FR = "L'affaissement des paupières est la principale cause d'un air fatigué et vieilli. La blépharoplastie redonne un regard vif et jeune."
BLEF_DATA_FR = {
    'title': "Esthétique des Paupières (Blépharoplastie)",
    'definition': "<p>La blépharoplastie est le rajeunissement du contour des yeux par l'élimination de l'excès de peau et de graisse.</p>",
    'anatomy': "<p>La peau des paupières est la plus fine. Avec l'âge, le septum orbitaire se relâche.</p>",
    'candidates': "<p>Convient si la paupière tombante ferme le champ visuel.</p>",
    'procedure': "<p>Paupière supérieure 45 min sous anesthésie locale.</p>",
    'recovery': "<p>Points retirés en 5-7 jours. Bleus disparaissent en 10 jours.</p>",
    'risks': "Œil sec, infection.",
    'faq': [("Y aura-t-il une cicatrice ?", "Les cicatrices sont cachées dans les plis naturels."), ("La vue est-elle affectée ?", "Non.")]
}

BLEF_HOOK_CIN = "眼睑下垂是看起来疲倦和衰老的最大原因。眼睑整形术可恢复活泼年轻的外观。"
BLEF_DATA_CIN = {
    'title': "眼睑整形术 (双眼皮/去眼袋)",
    'definition': "<p>眼睑整形术是通过去除眼睑多余的皮肤、肌肉和脂肪组织来使眼部年轻化。</p>",
    'anatomy': "<p>眼睑皮肤是最薄的。随着年龄增长，眶隔松弛，脂肪垫凸出。</p>",
    'candidates': "<p>如果眼睑下垂遮挡视野，或眼袋让您看起来疲倦，则适合。</p>",
    'procedure': "<p>上眼睑局部麻醉下45分钟。</p>",
    'recovery': "<p>5-7天拆线。瘀伤10天消失。</p>",
    'risks': "干眼症，感染。",
    'faq': [("会留疤吗？", "疤痕隐藏在自然褶皱中。"), ("视力会受损吗？", "不会。")]
}

# 5. Botoks
BOTOKS_HOOK_TR = "Mimiklerinizi dondurmadan, yılların getirdiği çizgileri silmek mümkün. Prof. Dr. Gökçe Özel ile 'Baby Botox' doğallığını keşfedin."
BOTOKS_DATA_TR = {
    'title': "Botoks Uygulamaları (Botulinum Toksin)",
    'definition': "<p>Clostridium botulinum bakterisinden elde edilen toksinin, kasların aşırı kasılmasını geçici olarak durdurarak kırışıklıkları açması işlemidir.</p>",
    'anatomy': "<p>Alın (Frontalis), Kaş çatma (Corrugator), Göz çevresi (Orbicularis oculi) kaslarına nokta atışı enjeksiyon yapılır.</p>",
    'candidates': "<p>Mimik çizgileri oturmaya başlayan (dinamik kırışıklıklar) herkes için koruyucu ve tedavi edicidir.</p>",
    'procedure': "<p>İşlem 10-15 dakika sürer. İnce uçlu iğnelerle kas içine minimal dozlar verilir. Acısızdır.</p>",
    'recovery': "<p>Hemen sosyal hayata dönülür. İlk 4-6 saat öne eğilmemek, yatmamak ve ovalamamak gerekir. Etki 3-7 günde başlar.</p>",
    'risks': "Geçici göz kapağı düşüklüğü (ptozis) nadirdir, deneyim gerektirir.",
    'faq': [("Yılan zehiri mi?", "Hayır, laboratuvar ortamında üretilen bir ilaçtır."), ("Kalıcı mıdır?", "Etkisi 4-6 ay sürer, düzenli yapıldığında süre uzar.")]
}

BOTOKS_HOOK_EN = "It is possible to erase lines brought by years without freezing your mimics. Discover 'Baby Botox' naturalness with Prof. Dr. Gökçe Özel."
BOTOKS_DATA_EN = {
    'title': "Botox Applications (Botulinum Toxin)",
    'definition': "<p>It is the process of opening wrinkles by temporarily stopping excessive contraction of muscles with the toxin obtained from Clostridium botulinum bacteria.</p>",
    'anatomy': "<p>Point-shot injection is made to Forehead (Frontalis), Frown (Corrugator), Eye contour (Orbicularis oculi) muscles.</p>",
    'candidates': "<p>It is preventive and therapeutic for everyone whose mimic lines start to settle (dynamic wrinkles).</p>",
    'procedure': "<p>The process takes 10-15 minutes. Minimal doses are given into the muscle with fine-tipped needles. It is painless.</p>",
    'recovery': "<p>Return to social life immediately. One should not lean forward, lie down, or rub for the first 4-6 hours. Effect starts in 3-7 days.</p>",
    'risks': "Temporary eyelid droop (ptosis) is rare, requires experience.",
    'faq': [("Is it snake poison?", "No, it is a drug produced in a laboratory environment."), ("Is it permanent?", "Its effect lasts 4-6 months, time extends when done regularly.")]
}


BOTOKS_HOOK_RU = "Можно стереть морщины, не замораживая мимику. Откройте для себя естественность «Baby Botox»."
BOTOKS_DATA_RU = {
    'title': "Ботокс (Ботулотоксин)",
    'definition': "<p>Это процесс разглаживания морщин путем временной остановки чрезмерного сокращения мышц токсином.</p>",
    'anatomy': "<p>Инъекции делаются в мышцы лба, межбровья и вокруг глаз.</p>",
    'candidates': "<p>Профилактика и лечение для всех, у кого начинают формироваться мимические морщины.</p>",
    'procedure': "<p>Занимает 10-15 минут. Безболезненно.</p>",
    'recovery': "<p>Мгновенное возвращение к жизни. Эффект через 3-7 дней.</p>",
    'risks': "Временное опущение века (редко).",
    'faq': [("Это змеиный яд?", "Нет, это лекарство."), ("Это навсегда?", "Эффект длится 4-6 месяцев.")]
}

BOTOKS_HOOK_AR = "من الممكن مسح الخطوط التي خلفتها السنوات دون تجميد تعابير وجهك. اكتشف طبيعية 'بيبي بوتوكس'."
BOTOKS_DATA_AR = {
    'title': "تطبيقات البوتوكس",
    'definition': "<p>هي عملية فتح التجاعيد عن طريق إيقاف الانقباض المفرط للعضلات مؤقتًا باستخدام التوكسين.</p>",
    'anatomy': "<p>يتم الحقن في عضلات الجبهة، والعبوس، وحول العين.</p>",
    'candidates': "<p>وقائي وعلاجي لكل من بدأت خطوط تعابير وجهه بالثبات.</p>",
    'procedure': "<p>تستغرق 10-15 دقيقة. غير مؤلمة.</p>",
    'recovery': "<p>عودة فورية للحياة. يبدأ التأثير في 3-7 أيام.</p>",
    'risks': "تدلي الجفن المؤقت (نادر).",
    'faq': [("هل هو سم ثعبان؟", "لا، هو دواء."), ("هل هو دائم؟", "يستمر 4-6 أشهر.")]
}

BOTOKS_HOOK_DE = "Es ist möglich, die Linien der Jahre zu löschen, ohne Ihre Mimik einzufrieren. Entdecken Sie die Natürlichkeit von 'Baby Botox'."
BOTOKS_DATA_DE = {
    'title': "Botox-Anwendungen",
    'definition': "<p>Es ist der Prozess des Glättens von Falten durch vorübergehendes Stoppen übermäßiger Muskelkontraktion mit dem Toxin.</p>",
    'anatomy': "<p>Injektionen erfolgen in Stirn-, Zornes- und Augenmuskeln.</p>",
    'candidates': "<p>Präventiv und therapeutisch für jeden, bei dem sich Mimikfalten festsetzen.</p>",
    'procedure': "<p>Dauert 10-15 Minuten. Schmerzlos.</p>",
    'recovery': "<p>Sofortige Rückkehr ins Leben. Wirkung in 3-7 Tagen.</p>",
    'risks': "Vorübergehendes Hängen des Augenlids (selten).",
    'faq': [("Ist es Schlangengift?", "Nein, ein Medikament."), ("Ist es dauerhaft?", "Wirkung hält 4-6 Monate.")]
}

BOTOKS_HOOK_FR = "Il est possible d'effacer les rides apportées par les années sans figer vos mimiques. Découvrez le naturel du 'Baby Botox'."
BOTOKS_DATA_FR = {
    'title': "Applications Botox",
    'definition': "<p>C'est le processus d'atténuation des rides en arrêtant temporairement la contraction excessive des muscles.</p>",
    'anatomy': "<p>Injections dans les muscles du front, du lion et du contour des yeux.</p>",
    'candidates': "<p>Préventif et thérapeutique pour tous ceux dont les rides d'expression s'installent.</p>",
    'procedure': "<p>Dure 10-15 minutes. Indolore.</p>",
    'recovery': "<p>Retour immédiat à la vie. Effet dans 3-7 jours.</p>",
    'risks': "Chute temporaire de la paupière (rare).",
    'faq': [("Est-ce du venin de serpent ?", "Non, c'est un médicament."), ("Est-ce permanent ?", "Durée 4-6 mois.")]
}

BOTOKS_HOOK_CIN = "可以在不冻结表情的情况下去除岁月带来的皱纹。探索“Baby Botox”的自然感。"
BOTOKS_DATA_CIN = {
    'title': "肉毒杆菌应用 (Botox)",
    'definition': "<p>是通过使用毒素暂时阻止肌肉过度收缩来抚平皱纹的过程。</p>",
    'anatomy': "<p>注射到前额、皱眉肌和眼轮匝肌。</p>",
    'candidates': "<p>对表情纹开始固定的每个人都具有预防和治疗作用。</p>",
    'procedure': "<p>耗时10-15分钟。无痛。</p>",
    'recovery': "<p>立即恢复生活。3-7天见效。</p>",
    'risks': "暂时性眼睑下垂（罕见）。",
    'faq': [("是蛇毒吗？", "不是，是药物。"), ("是永久的吗？", "效果持续4-6个月。")]
}

# 6. Dolgu
DOLGU_HOOK_TR = "Zamanla azalan yüz hacmini geri kazanmak ve hatları belirginleştirmek için Hyaluronik Asit dolgularla anında gençleşin."
DOLGU_DATA_TR = {
    'title': "Dolgu Uygulamaları (Yüz Şekillendirme)",
    'definition': "<p>Cildin su tutma kapasitesini artıran Hyaluronik Asit bazlı jellerin, hacim kaybı olan bölgelere enjekte edilmesidir.</p>",
    'anatomy': "<p>Elmacık kemiği, çene ucu (jawline), şakaklar ve nazolabial oluklar ana uygulama alanlarıdır.</p>",
    'candidates': "<p>Yüzünde yorgun ifade olan, çene hattı silikleşen veya derin kırışıklıkları olanlar.</p>",
    'procedure': "<p>15-20 dk sürer. Kanül veya iğne kullanılır. Sonuç anında görülür.</p>",
    'recovery': "<p>Hafif ödem olabilir, 2 günde geçer. Bol su içilmesi önerilir.</p>",
    'risks': "Nadir de olsa damar tıkanıklığı riski vardır, bu yüzden anatomi bilen uzmanlarca yapılmalıdır.",
    'faq': [("Kalıcı mı?", "Ortalama 12-18 ay kalıcıdır."), ("Eritilebilir mi?", "Evet, hyaluronidaz enzimi ile anında eritilebilir.")]
}

DOLGU_HOOK_EN = "Rejuvenate instantly with Hyaluronic Acid fillers to regain facial volume that decreases over time and to define contours."
DOLGU_DATA_EN = {
    'title': "Filler Applications (Facial Contouring)",
    'definition': "<p>It is the injection of Hyaluronic Acid based gels, which increase the water retention capacity of the skin, into areas with volume loss.</p>",
    'anatomy': "<p>Cheekbones, chin tip (jawline), temples, and nasolabial folds are the main application areas.</p>",
    'candidates': "<p>Those who have a tired expression on their face, whose jawline is fading, or who have deep wrinkles.</p>",
    'procedure': "<p>It takes 15-20 minutes. Cannula or needle is used. The result is seen instantly.</p>",
    'recovery': "<p>There may be slight edema, it passes in 2 days. Drinking plenty of water is recommended.</p>",
    'risks': "Although rare, there is a risk of vascular occlusion, so it should be done by experts who know anatomy.",
    'faq': [("Is it permanent?", "It is permanent for an average of 12-18 months."), ("Can it be dissolved?", "Yes, it can be dissolved instantly with the hyaluronidase enzyme.")]
}


DOLGU_HOOK_RU = "Мгновенное омоложение с филлерами на основе гиалуроновой кислоты для восстановления объема лица."
DOLGU_DATA_RU = {
    'title': "Филлеры (Моделирование лица)",
    'definition': "<p>Инъекции гелей на основе гиалуроновой кислоты в зоны с потерей объема.</p>",
    'anatomy': "<p>Скулы, подбородок, виски и носогубные складки.</p>",
    'candidates': "<p>Усталое выражение лица, нечеткий контур челюсти.</p>",
    'procedure': "<p>15-20 мин. Результат виден мгновенно.</p>",
    'recovery': "<p>Легкий отек проходит за 2 дня.</p>",
    'risks': "Редко сосудистая окклюзия.",
    'faq': [("Навсегда?", "12-18 месяцев."), ("Можно ли растворить?", "Да, гиалуронидазой.")]
}

DOLGU_HOOK_AR = "تجديد فوري مع فيلر حمض الهيالورونيك لاستعادة حجم الوجه الذي يتناقص مع مرور الوقت."
DOLGU_DATA_AR = {
    'title': "تطبيقات الفيلر",
    'definition': "<p>حقن المواد الهلامية القائمة على حمض الهيالورونيك في المناطق التي تعاني من فقدان الحجم.</p>",
    'anatomy': "<p>الخدين، الذقن، الصدغين والطيات الأنفية الشفوية.</p>",
    'candidates': "<p>تعبير متعب، خط فك غير محدد.</p>",
    'procedure': "<p>15-20 دقيقة. النتيجة فورية.</p>",
    'recovery': "<p>وذمة خفيفة تزول في يومين.</p>",
    'risks': "انسداد وعائي نادر.",
    'faq': [("هل هو دائم؟", "12-18 شهرًا."), ("هل يمكن تذويبه؟", "نعم، بالهيالورونيداز.")]
}

DOLGU_HOOK_DE = "Sofortige Verjüngung mit Hyaluronsäure-Fillern, um das mit der Zeit abnehmende Gesichtsvolumen wiederherzustellen."
DOLGU_DATA_DE = {
    'title': "Filler (Gesichtsmodellierung)",
    'definition': "<p>Injektion von Gelen auf Hyaluronsäurebasis in Bereiche mit Volumenverlust.</p>",
    'anatomy': "<p>Wangenknochen, Kinn, Schläfen und Nasolabialfalten.</p>",
    'candidates': "<p>Müder Ausdruck, undeutliche Kieferlinie.</p>",
    'procedure': "<p>15-20 Min. Ergebnis sofort sichtbar.</p>",
    'recovery': "<p>Leichte Schwellung vergeht in 2 Tagen.</p>",
    'risks': "Selten Gefäßverschluss.",
    'faq': [("Dauerhaft?", "12-18 Monate."), ("Auflösbar?", "Ja, mit Hyaluronidase.")]
}

DOLGU_HOOK_FR = "Rajeunissement instantané avec des produits de comblement à l'acide hyaluronique pour retrouver le volume du visage."
DOLGU_DATA_FR = {
    'title': "Produits de Comblement (Fillers)",
    'definition': "<p>Injection de gels à base d'acide hyaluronique dans les zones de perte de volume.</p>",
    'anatomy': "<p>Pommettes, menton, tempes et sillons nasogéniens.</p>",
    'candidates': "<p>Expression fatiguée, mâchoire indéfinie.</p>",
    'procedure': "<p>15-20 min. Résultat instantané.</p>",
    'recovery': "<p>Léger œdème disparaît en 2 jours.</p>",
    'risks': "Rarement occlusion vasculaire.",
    'faq': [("Permanent ?", "12-18 mois."), ("Dissoluble ?", "Oui, avec hyaluronidase.")]
}

DOLGU_HOOK_CIN = "使用透明质酸填充剂瞬间恢复活力，恢复随时间减少的面部体积。"
DOLGU_DATA_CIN = {
    'title': "填充剂应用 (面部轮廓)",
    'definition': "<p>将基于透明质酸的凝胶注射到体积损失的区域。</p>",
    'anatomy': "<p>颧骨、下巴、太阳穴和鼻唇沟。</p>",
    'candidates': "<p>表情疲倦，下颌线模糊。</p>",
    'procedure': "<p>15-20分钟。结果立即可见。</p>",
    'recovery': "<p>轻微水肿2天内消失。</p>",
    'risks': "罕见的血管阻塞。",
    'faq': [("永久吗？", "12-18个月。"), ("可溶解吗？", "可以，用透明质酸酶。")]
}

# 7. Dudak Dolgusu
DUDAK_DOLGU_HOOK_TR = "Daha dolgun, simetrik ve nemli dudaklar için Russian Lips veya Natural teknikleriyle kişiye özel dudak tasarımı."
DUDAK_DOLGU_DATA_TR = {
    'title': "Dudak Dolgusu (Russian Lips & Natural)",
    'definition': "<p>Dudaklara hacim ve şekil vermek için yapılan özel dolgu işlemidir.</p>",
    'anatomy': "<p>Dudak mukozası çok hassastır. Vermilion hattı (dudak kontürü) ve Eros yayı belirginleştirilir.</p>",
    'candidates': "<p>İnce dudakları olan, asimetri sorunu yaşayan veya yaşla dudak hacmini kaybedenler.</p>",
    'procedure': "<p>Lokal anestezik kremle uyuşturulur. 10 dk sürer.</p>",
    'recovery': "<p>İlk 2 gün ödem normaldir. Sıcak içecekten kaçınılmalıdır.</p>",
    'risks': "Topaklanma (masajla geçer), morluk.",
    'faq': [("Ördek gibi olur muyum?", "Hayır, doğru teknikle (örneğin Russian Lips) dudak öne değil, yukarı doğru hacim kazanır."), ("His kaybı olur mu?", "Hayır.")]
}

DUDAK_DOLGU_HOOK_EN = "Personalized lip design with Russian Lips or Natural techniques for fuller, symmetrical, and moist lips."
DUDAK_DOLGU_DATA_EN = {
    'title': "Lip Filler (Russian Lips & Natural)",
    'definition': "<p>It is a special filler procedure performed to give volume and shape to the lips.</p>",
    'anatomy': "<p>Lip mucosa is very sensitive. The Vermilion border (lip contour) and Cupid's bow are highlighted.</p>",
    'candidates': "<p>Those with thin lips, asymmetry problems, or those who lose lip volume with age.</p>",
    'procedure': "<p>Numbed with local anesthetic cream. It takes 10 mins.</p>",
    'recovery': "<p>Edema is normal for the first 2 days. Hot drinks should be avoided.</p>",
    'risks': "Lumping (passes with massage), bruising.",
    'faq': [("Will I look like a duck?", "No, with the right technique (e.g. Russian Lips), the lip gains volume upwards, not forwards."), ("Will there be loss of sensation?", "No.")]
}


DUDAK_DOLGU_HOOK_RU = "Индивидуальный дизайн губ с помощью техник Russian Lips или Natural для более полных, симметричных и увлажненных губ."
DUDAK_DOLGU_DATA_RU = {
    'title': "Увеличение губ (Russian Lips)",
    'definition': "<p>Увеличение объема и контура губ с помощью филлеров.</p>",
    'anatomy': "<p>Крипидонов лук, вермилион и колонны фильтрума.</p>",
    'candidates': "<p>Тонкие или асимметричные губы.</p>",
    'procedure': "<p>15 мин под местной анестезией.</p>",
    'recovery': "<p>Отек 2-3 дня.</p>",
    'risks': "Синяки.",
    'faq': [("Больно?", "Нет, крем-анестетик."), ("Сколько держится?", "12 месяцев.")]
}

DUDAK_DOLGU_HOOK_AR = "تصميم شفاه مخصص بتقنيات الشفاه الروسية أو الطبيعية للحصول على شفاه أكثر امتلاءً وتناسقًا وترطيبًا."
DUDAK_DOLGU_DATA_AR = {
    'title': "فيلر الشفاه (الشفاه الروسية)",
    'definition': "<p>زيادة حجم وتحديد الشفاه باستخدام الفيلر.</p>",
    'anatomy': "<p>قوس كيوبيد والحدود القرمزية.</p>",
    'candidates': "<p>الشفاه الرقيقة أو غير المتماثلة.</p>",
    'procedure': "<p>15 دقيقة تحت تخدير موضعي.</p>",
    'recovery': "<p>تورم لمدة 2-3 أيام.</p>",
    'risks': "كدمات.",
    'faq': [("هل هو مؤلم؟", "لا، كريم مخدر."), ("كم يستمر؟", "12 شهرًا.")]
}

DUDAK_DOLGU_HOOK_DE = "Individuelles Lippendesign mit Russian Lips oder Natural Techniken für vollere, symmetrische und hydratisierte Lippen."
DUDAK_DOLGU_DATA_DE = {
    'title': "Lippenaufspritzung (Russian Lips)",
    'definition': "<p>Volumen und Konturierung der Lippen mit Fillern.</p>",
    'anatomy': "<p>Amorbogen und Vermiliongrenze.</p>",
    'candidates': "<p>Dünne oder asymmetrische Lippen.</p>",
    'procedure': "<p>15 Min. unter Betäubungscreme.</p>",
    'recovery': "<p>Schwellung für 2-3 Tage.</p>",
    'risks': "Blutergüsse.",
    'faq': [("Tut es weh?", "Nein, Betäubungscreme."), ("Wie lange hält es?", "12 Monate.")]
}

DUDAK_DOLGU_HOOK_FR = "Design des lèvres personnalisé avec les techniques Russian Lips ou Natural pour des lèvres plus pulpeuses, symétriques et hydratées."
DUDAK_DOLGU_DATA_FR = {
    'title': "Augmentation des Lèvres (Russian Lips)",
    'definition': "<p>Volume et contour des lèvres avec fillers.</p>",
    'anatomy': "<p>Arc de Cupidon et bord vermillon.</p>",
    'candidates': "<p>Lèvres fines ou asymétriques.</p>",
    'procedure': "<p>15 min sous crème anesthésiante.</p>",
    'recovery': "<p>Gonflement 2-3 jours.</p>",
    'risks': "Bleus.",
    'faq': [("Douloureux ?", "Non, crème anesthésiante."), ("Durée ?", "12 mois.")]
}

DUDAK_DOLGU_HOOK_CIN = "个性化唇部设计，采用俄罗斯唇 (Russian Lips) 或自然技术，打造更饱满、对称和滋润的嘴唇。"
DUDAK_DOLGU_DATA_CIN = {
    'title': "丰唇术 (俄罗斯唇)",
    'definition': "<p>使用填充剂增加嘴唇体积和轮廓。</p>",
    'anatomy': "<p>丘比特弓和红唇缘。</p>",
    'candidates': "<p>嘴唇薄或不对称。</p>",
    'procedure': "<p>麻醉膏下15分钟。</p>",
    'recovery': "<p>肿胀2-3天。</p>",
    'risks': "瘀伤。",
    'faq': [("疼吗？", "不，有麻醉膏。"), ("维持多久？", "12个月。")]
}

# 8. Lip Lift
LIPLIFT_HOOK_TR = "Dolgunun yeterli olmadığı, burun ile dudak mesafesinin uzun olduğu durumlarda kalıcı çözüm: Lip Lift."
LIPLIFT_DATA_TR = {
    'title': "Dudak Kaldırma (Lip Lift)",
    'definition': "<p>Burun tabanından yapılan küçük bir kesi ile dudak-burun mesafesini kısaltarak üst dudağı kalıcı olarak yukarı kaldırma işlemidir.</p>",
    'anatomy': "<p>İdeal philtrum (bıyık bölgesi) uzunluğu 11-13 mm olmalıdır. Yaşla bu mesafe uzar ve diş görünümü azalır.</p>",
    'candidates': "<p>Dolguya rağmen dudağı dönmeyen, dişleri görünmeyen veya philtrum mesafesi uzun olanlar.</p>",
    'procedure': "<p>Lokal anestezi altında 45 dk sürer. 'Boğa boynuzu' (bullhorn) şeklinde deri çıkarılır.</p>",
    'recovery': "<p>Dikişler 5-7 günde alınır. İz burun tabanına gizlenir, zamanla silikleşir.</p>",
    'risks': "Belirgin iz (nadirdir, lazerle silinebilir).",
    'faq': [("Dolguyla farkı nedir?", "Dolgu hacim verir, Lip Lift dudağı yukarı taşır ve kısaltır."), ("Kalıcı mı?", "Evet, ömür boyu kalıcıdır.")]
}

LIPLIFT_HOOK_EN = "Permanent solution when filler is not enough and the distance between nose and lip is long: Lip Lift."
LIPLIFT_DATA_EN = {
    'title': "Lip Lift",
    'definition': "<p>It is the process of permanently lifting the upper lip by shortening the lip-nose distance with a small incision made from the base of the nose.</p>",
    'anatomy': "<p>Ideal philtrum (mustache area) length should be 11-13 mm. With age, this distance elongates and tooth visibility decreases.</p>",
    'candidates': "<p>Those whose lips do not turn despite filler, whose teeth are not visible, or who have a long philtrum distance.</p>",
    'procedure': "<p>It takes 45 mins under local anesthesia. Skin is removed in the shape of a 'bullhorn'.</p>",
    'recovery': "<p>Stitches are removed in 5-7 days. Scar is hidden at the base of the nose, fades over time.</p>",
    'risks': "Visible scar (rare, can be erased with laser).",
    'faq': [("What is the difference with filler?", "Filler gives volume, Lip Lift carries the lip up and shortens it."), ("Is it permanent?", "Yes, it is permanent for a lifetime.")]
}


LIPLIFT_HOOK_RU = "Идеальное решение для тех, у кого слишком большое расстояние между носом и губой. Навсегда укорачивает верхнюю губу."
LIPLIFT_DATA_RU = {
    'title': "Лип лифт (Подтяжка верхней губы)",
    'definition': "<p>Хирургическое сокращение расстояния между носом и верхней губой.</p>",
    'anatomy': "<p>Фильтрум. Идеальное расстояние 12-15 мм.</p>",
    'candidates': "<p>Слишком длинная верхняя губа, не видны зубы при улыбке.</p>",
    'procedure': "<p>45 мин под местной анестезией.</p>",
    'recovery': "<p>Швы снимают через 7 дней.</p>",
    'risks': "Видимый шрам под носом (минимальный).",
    'faq': [("Навсегда?", "Да, это постоянная операция."), ("Шрам заметен?", "Скрыт у основания носа.")]
}

LIPLIFT_HOOK_AR = "الحل المثالي لمن لديهم مسافة طويلة جدًا بين الأنف والشفة. يقصر الشفة العلوية بشكل دائم."
LIPLIFT_DATA_AR = {
    'title': "رفع الشفة العلوية (Lip Lift)",
    'definition': "<p>تقصير المسافة بين الأنف والشفة العلوية جراحيًا.</p>",
    'anatomy': "<p>النثرة. المسافة المثالية 12-15 ملم.</p>",
    'candidates': "<p>الشفة العلوية طويلة جدًا، الأسنان غير مرئية عند الابتسام.</p>",
    'procedure': "<p>45 دقيقة تحت تخدير موضعي.</p>",
    'recovery': "<p>تزال الغرز بعد 7 أيام.</p>",
    'risks': "ندبة مرئية تحت الأنف (بسيطة).",
    'faq': [("هل هو دائم؟", "نعم، عملية دائمة."), ("هل الندبة واضحة؟", "مخفية عند قاعدة الأنف.")]
}

LIPLIFT_HOOK_DE = "Die ideale Lösung für diejenigen mit zu großem Abstand zwischen Nase und Lippe. Verkürzt die Oberlippe dauerhaft."
LIPLIFT_DATA_DE = {
    'title': "Lippenlift (Oberlippenstraffung)",
    'definition': "<p>Chirurgische Verkürzung des Abstands zwischen Nase und Oberlippe.</p>",
    'anatomy': "<p>Philtrum. Idealer Abstand 12-15 mm.</p>",
    'candidates': "<p>Zu lange Oberlippe, Zähne beim Lächeln nicht sichtbar.</p>",
    'procedure': "<p>45 Min. in Lokalanästhesie.</p>",
    'recovery': "<p>Fäden nach 7 Tagen raus.</p>",
    'risks': "Sichtbare Narbe unter der Nase (minimal).",
    'faq': [("Dauerhaft?", "Ja, permanent."), ("Narbe sichtbar?", "Versteckt an der Nasenbasis.")]
}

LIPLIFT_HOOK_FR = "La solution idéale pour ceux qui ont une trop grande distance entre le nez et la lèvre. Raccourcit durablement la lèvre supérieure."
LIPLIFT_DATA_FR = {
    'title': "Lifting de la Lèvre Supérieure (Lip Lift)",
    'definition': "<p>Raccourcissement chirurgical de la distance nez-lèvre.</p>",
    'anatomy': "<p>Philtrum. Distance idéale 12-15 mm.</p>",
    'candidates': "<p>Lèvre supérieure trop longue, dents invisibles au sourire.</p>",
    'procedure': "<p>45 min sous anesthésie locale.</p>",
    'recovery': "<p>Points retirés après 7 jours.</p>",
    'risks': "Cicatrice visible sous le nez (minime).",
    'faq': [("Permanent ?", "Oui."), ("Cicatrice visible ?", "Cachée à la base du nez.")]
}

LIPLIFT_HOOK_CIN = "对于鼻子和嘴唇之间距离过长的人来说是理想的解决方案。永久缩短上唇。"
LIPLIFT_DATA_CIN = {
    'title': "上唇提拉术 (Lip Lift)",
    'definition': "<p>外科手术缩短鼻子和上唇之间的距离。</p>",
    'anatomy': "<p>人中。理想距离12-15毫米。</p>",
    'candidates': "<p>上唇过长，微笑时看不见牙齿。</p>",
    'procedure': "<p>局部麻醉下45分钟。</p>",
    'recovery': "<p>7天后拆线。</p>",
    'risks': "鼻下可见疤痕（极小）。",
    'faq': [("是永久的吗？", "是的，永久性手术。"), ("疤痕明显吗？", "隐藏在鼻底。")]
}

# 9. Mezoterapi
MEZO_HOOK_TR = "Cildinizin ihtiyaç duyduğu vitamin, mineral ve aminoasitleri doğrudan hedefe ulaştırın. Mat, cansız ve nemsiz ciltler için biyolojik uyanış."
MEZO_DATA_TR = {
    'title': "Mezoterapi ve Gençlik Aşısı",
    'definition': "<p>Mezoterapi, zengin içerikli kokteyllerin (somon DNA, H-100, kollajen aşısı vb.) derinin orta tabakasına mikro iğnelerle verilmesidir.</p>",
    'anatomy': "<p>Deri bariyeri kremlerin çoğunu geçirmez. Mezoterapi bu bariyeri aşarak doğrudan hücre beslenmesi sağlar.</p>",
    'candidates': "<p>Matlık, nemsizlik, ince kırışıklık, leke problemi olanlar.</p>",
    'procedure': "<p>Lokal anestezik krem sonrası 15 dk sürer. Yüz, boyun, el ve saç bölgesine uygulanabilir.</p>",
    'recovery': "<p>Küçük kabarıklıklar 1-2 saatte geçer. Ertesi gün makyaj yapılabilir.</p>",
    'risks': "Geçici morluk.",
    'faq': [("Kaç seans?", "Genellikle 2-4 seans önerilir."), ("Botoksla aynı anda yapılır mı?", "Evet, kombine edilebilir.")]
}

MEZO_HOOK_EN = "Deliver the vitamins, minerals, and amino acids your skin needs directly to the target. Biological awakening for dull, lifeless, and dehydrated skins."
MEZO_DATA_EN = {
    'title': "Mesotherapy and Youth Vaccine",
    'definition': "<p>Mesotherapy is the delivery of rich cocktails (salmon DNA, H-100, collagen vaccine, etc.) to the middle layer of the skin with micro needles.</p>",
    'anatomy': "<p>The skin barrier does not let most creams pass. Mesotherapy bypasses this barrier and provides direct cell nutrition.</p>",
    'candidates': "<p>Those with dullness, dehydration, fine wrinkles, spot problems.</p>",
    'procedure': "<p>It takes 15 mins after local anesthetic cream. Can be applied to face, neck, hand, and hair areas.</p>",
    'recovery': "<p>Small bumps pass in 1-2 hours. Makeup can be applied the next day.</p>",
    'risks': "Temporary bruising.",
    'faq': [("How many sessions?", "Usually 2-4 sessions are recommended."), ("Can it be done at the same time as Botox?", "Yes, can be combined.")]
}


MEZO_HOOK_RU = "Питайте свою кожу прямо из источника. Коктейли из витаминов и минералов для сияющего цвета лица."
MEZO_DATA_RU = {
    'title': "Мезотерапия (Витаминный коктейль)",
    'definition': "<p>Микроинъекции витаминов, минералов и аминокислот в средний слой кожи.</p>",
    'anatomy': "<p>Дерма. Слой, где вырабатывается коллаген.</p>",
    'candidates': "<p>Тусклая, безжизненная кожа, выпадение волос.</p>",
    'procedure': "<p>15-20 мин. Курс из 3-6 сеансов.</p>",
    'recovery': "<p>Покраснение в течение 1 часа.</p>",
    'risks': "Синяки.",
    'faq': [("Больно?", "Минимально."), ("Как часто?", "Раз в 2 недели.")]
}

MEZO_HOOK_AR = "غذي بشرتك مباشرة من المصدر. كوكتيلات الفيتامينات والمعادن لبشرة مشرقة."
MEZO_DATA_AR = {
    'title': "الميزوثيرابي (كوكتيل الفيتامينات)",
    'definition': "<p>حقن دقيقة للفيتامينات والمعادن والأحماض الأمينية في الطبقة الوسطى من الجلد.</p>",
    'anatomy': "<p>الأدمة. الطبقة التي يتم فيها إنتاج الكولاجين.</p>",
    'candidates': "<p>بشرة باهتة، تساقط الشعر.</p>",
    'procedure': "<p>15-20 دقيقة. دورة من 3-6 جلسات.</p>",
    'recovery': "<p>احمرار لمدة ساعة.</p>",
    'risks': "كدمات.",
    'faq': [("هل هو مؤلم؟", "بشكل بسيط."), ("كم مرة؟", "مرة كل أسبوعين.")]
}

MEZO_HOOK_DE = "Nähren Sie Ihre Haut direkt an der Quelle. Vitamin- und Mineralcocktails für einen strahlenden Teint."
MEZO_DATA_DE = {
    'title': "Mesotherapie (Vitamincocktail)",
    'definition': "<p>Mikroinjektionen von Vitaminen, Mineralien und Aminosäuren in die mittlere Hautschicht.</p>",
    'anatomy': "<p>Dermis. Schicht der Kollagenproduktion.</p>",
    'candidates': "<p>Fahle Haut, Haarausfall.</p>",
    'procedure': "<p>15-20 Min. Kur mit 3-6 Sitzungen.</p>",
    'recovery': "<p>Rötung für 1 Stunde.</p>",
    'risks': "Blutergüsse.",
    'faq': [("Tut es weh?", "Minimal."), ("Wie oft?", "Alle 2 Wochen.")]
}

MEZO_HOOK_FR = "Nourrissez votre peau directement à la source. Cocktails de vitamines et minéraux pour un teint éclatant."
MEZO_DATA_FR = {
    'title': "Mésothérapie (Cocktail Vitaminé)",
    'definition': "<p>Micro-injections de vitamines, minéraux et acides aminés dans le derme.</p>",
    'anatomy': "<p>Derme. Couche de production de collagène.</p>",
    'candidates': "<p>Peau terne, perte de cheveux.</p>",
    'procedure': "<p>15-20 min. Cure de 3-6 séances.</p>",
    'recovery': "<p>Rougeur pendant 1 heure.</p>",
    'risks': "Bleus.",
    'faq': [("Douloureux ?", "Minimal."), ("Fréquence ?", "Toutes les 2 semaines.")]
}

MEZO_HOOK_CIN = "直接从源头滋养您的皮肤。维生素和矿物质鸡尾酒打造容光焕发的肤色。"
MEZO_DATA_CIN = {
    'title': "中胚层疗法 (维生素鸡尾酒)",
    'definition': "<p>将维生素、矿物质和氨基酸显微注射到皮肤中间层。</p>",
    'anatomy': "<p>真皮。产生胶原蛋白的层。</p>",
    'candidates': "<p>皮肤暗沉，脱发。</p>",
    'procedure': "<p>15-20分钟。3-6次疗程。</p>",
    'recovery': "<p>红肿持续1小时。</p>",
    'risks': "瘀伤。",
    'faq': [("疼吗？", "极轻微。"), ("多久一次？", "每2周一次。")]
}

# 10. Gamze
GAMZE_HOOK_TR = "Gülüşünüze sempatik ve çekici bir detay katın. Gamze estetiği (Dimpleplasty) ile kalıcı ve doğal gamzelere sahip olabilirsiniz."
GAMZE_DATA_TR = {
    'title': "Gamze Estetiği (Dimpleplasty)",
    'definition': "<p>Yanakta gülümsemeyle ortaya çıkan çukurluğun cerrahi olarak oluşturulması işlemidir. Venüs gamzesi (bel) için de uygulanabilir.</p>",
    'anatomy': "<p>Doğal gamze, zigomatik kasın bifid (çatallı) olmasından kaynaklanır. Ameliyatla bu mekanizma taklit edilir.</p>",
    'candidates': "<p>Yanaklarında gamze isteyen herkes.</p>",
    'procedure': "<p>Ağız içinden yapılır (dışarıda iz olmaz). Lokal anestezi ile 30 dk sürer. Kas ile deri arasına dikiş atılır.</p>",
    'recovery': "<p>İlk 1-2 hafta gamze sürekli görünür (gülmeseniz de). Sonra sadece gülerken ortaya çıkar (doğallık süreci).</p>",
    'risks': "Enfeksiyon (ağız hijyeni önemlidir), gamzenin zamanla silinmesi.",
    'faq': [("Yemek yiyebilir miyim?", "İlk gün yumuşak gıdalar önerilir."), ("Geri dönüşü var mı?", "İstenirse dikiş alınarak büyük oranda eski haline döndürülebilir.")]
}

GAMZE_HOOK_EN = "Add a sympathetic and attractive detail to your smile. You can have permanent and natural dimples with Dimpleplasty."
GAMZE_DATA_EN = {
    'title': "Dimple Aesthetics (Dimpleplasty)",
    'definition': "<p>It is the surgical creation of the dimple that appears on the cheek when smiling. It can also be applied for Venus dimples (waist).</p>",
    'anatomy': "<p>Natural dimple is caused by the zygomatic muscle being bifid (forked). This mechanism is imitated by surgery.</p>",
    'candidates': "<p>Anyone who wants dimples on their cheeks.</p>",
    'procedure': "<p>Done from inside the mouth (no scars outside). Takes 30 mins with local anesthesia. A stitch is placed between muscle and skin.</p>",
    'recovery': "<p>For the first 1-2 weeks, the dimple is constantly visible (even if you don't smile). Then it only appears when smiling (naturalness process).</p>",
    'risks': "Infection (oral hygiene is important), dimple fading over time.",
    'faq': [("Can I eat?", "Soft foods are recommended for the first day."), ("Is it reversible?", "If desired, it can be returned to its former state by removing the stitch.")]
}


GAMZE_HOOK_RU = "Милая и привлекательная улыбка теперь возможна с помощью создания ямочек."
GAMZE_DATA_RU = {
    'title': "Эстетика ямочек (Димплэктомия)",
    'definition': "<p>Хирургическое создание ямочек на щеках.</p>",
    'anatomy': "<p>Мышца buccinators.</p>",
    'candidates': "<p>Желающие иметь ямочки при улыбке.</p>",
    'procedure': "<p>30 мин под местной анестезией изнутри рта.</p>",
    'recovery': "<p>Отек 3-4 дня. Швы рассасываются.</p>",
    'risks': "Асимметрия, исчезновение ямочки.",
    'faq': [("Навсегда?", "Да."), ("Останется след?", "Снаружи нет.")]
}

GAMZE_HOOK_AR = "ابتسامة لطيفة وجذابة أصبحت ممكنة الآن مع إنشاء الغمازات."
GAMZE_DATA_AR = {
    'title': "تجميل الغمازات",
    'definition': "<p>إنشاء غمازات جراحيًا على الخدين.</p>",
    'anatomy': "<p>العضلة المبوقة.</p>",
    'candidates': "<p>الراغبون في الحصول على غمازات عند الابتسام.</p>",
    'procedure': "<p>30 دقيقة تحت تخدير موضعي من داخل الفم.</p>",
    'recovery': "<p>تورم 3-4 أيام. الغرز تذوب.</p>",
    'risks': "عدم التماثل، اختفاء الغمازة.",
    'faq': [("هل هو دائم؟", "نعم."), ("هل يترك أثر؟", "لا يوجد أثر خارجي.")]
}

GAMZE_HOOK_DE = "Ein süßes und attraktives Lächeln ist jetzt durch das Schaffen von Grübchen möglich."
GAMZE_DATA_DE = {
    'title': "Grübchen-OP (Dimpleplasty)",
    'definition': "<p>Chirurgische Erzeugung von Grübchen auf den Wangen.</p>",
    'anatomy': "<p>Buccinator-Muskel.</p>",
    'candidates': "<p>Wunsch nach Grübchen beim Lächeln.</p>",
    'procedure': "<p>30 Min. in Lokalanästhesie von innen.</p>",
    'recovery': "<p>Schwellung 3-4 Tage. Fäden lösen sich auf.</p>",
    'risks': "Asymmetrie, Verschwinden des Grübchens.",
    'faq': [("Dauerhaft?", "Ja."), ("Narbe?", "Außen keine.")]
}

GAMZE_HOOK_FR = "Un sourire mignon et attrayant est maintenant possible grâce à la création de fossettes."
GAMZE_DATA_FR = {
    'title': "Chirurgie des Fossettes",
    'definition': "<p>Création chirurgicale de fossettes sur les joues.</p>",
    'anatomy': "<p>Muscle buccinateur.</p>",
    'candidates': "<p>Désir de fossettes au sourire.</p>",
    'procedure': "<p>30 min sous anesthésie locale par l'intérieur.</p>",
    'recovery': "<p>Gonflement 3-4 jours. Fils résorbables.</p>",
    'risks': "Asymétrie, disparition de la fossette.",
    'faq': [("Permanent ?", "Oui."), ("Cicatrice ?", "Aucune externe.")]
}

GAMZE_HOOK_CIN = "现在可以通过制造酒窝拥有甜美迷人的笑容。"
GAMZE_DATA_CIN = {
    'title': "酒窝成形术",
    'definition': "<p>在脸颊上外科手术制造酒窝。</p>",
    'anatomy': "<p>颊肌。</p>",
    'candidates': "<p>希望微笑时有酒窝的人。</p>",
    'procedure': "<p>口腔内局部麻醉下30分钟。</p>",
    'recovery': "<p>肿胀3-4天。缝线吸收。</p>",
    'risks': "不对称，酒窝消失。",
    'faq': [("永久吗？", "是的。"), ("有痕迹吗？", "外部没有。")]
}

# 11. Otoplasti
OTO_HOOK_TR = "Kepçe kulak görünümü kaderiniz değil. Özgüveninizi zedeleyen bu durumu, kalıcı ve pratik bir yöntemle çözüyoruz."
OTO_DATA_TR = {
    'title': "Kepçe Kulak Ameliyatı (Otoplasti)",
    'definition': "<p>Kulak kepçesinin kafa tasına olan açısının düzeltilmesi ve kıvrımlarının yeniden oluşturulması işlemidir.</p>",
    'anatomy': "<p>Genellikle Antiheliks kıvrımının gelişmemesi veya konka kıkırdağının derin olması nedeniyle oluşur.</p>",
    'candidates': "<p>6 yaşından itibaren (okul çağı öncesi önerilir) herkes.</p>",
    'procedure': "<p>Kulak arkasından kesi yapılır. Kıkırdak törpülenir veya kalıcı dikişlerle şekil verilir. Lokal anestezi yeterlidir.</p>",
    'recovery': "<p>3 gün bandaj sarılır. Sonrasında 2 hafta gece bandanası takılır. İz kulak arkasında gizlidir.</p>",
    'risks': "Kanama (hematom), asimetri.",
    'faq': [("Duyma yetim etkilenir mi?", "Hayır, kulak zarı veya orta kulakla ilgisi yoktur."), ("Tekrar açılır mı?", "Doğru teknikle yapıldığında açılma riski çok düşüktür.")]
}

OTO_HOOK_EN = "Prominent ear appearance is not your destiny. We solve this situation that damages your self-confidence with a permanent and practical method."
OTO_DATA_EN = {
    'title': "Prominent Ear Surgery (Otoplasty)",
    'definition': "<p>It is the correction of the angle of the auricle to the skull and the reconstruction of its folds.</p>",
    'anatomy': "<p>It is usually caused by the non-development of the Antihelix fold or the depth of the concha cartilage.</p>",
    'candidates': "<p>Everyone from the age of 6 (recommended before school age).</p>",
    'procedure': "<p>Incision is made behind the ear. Cartilage is filed or shaped with permanent stitches. Local anesthesia is sufficient.</p>",
    'recovery': "<p>Bandage is wrapped for 3 days. Then a night bandana is worn for 2 weeks. Scar is hidden behind the ear.</p>",
    'risks': "Bleeding (hematoma), asymmetry.",
    'faq': [("Will my hearing be affected?", "No, it has nothing to do with the eardrum or middle ear."), ("Will it open again?", "The risk of opening is very low when done with the right technique.")]
}


OTO_HOOK_RU = "Избавьтесь от лопоухости навсегда. Естественные и эстетичные уши за один сеанс."
OTO_DATA_RU = {
    'title': "Отопластика (Пластика ушей)",
    'definition': "<p>Коррекция оттопыренных ушей.</p>",
    'anatomy': "<p>Ушной хрящ и угол ушной раковины.</p>",
    'candidates': "<p>Взрослые и дети с 6 лет с лопоухостью.</p>",
    'procedure': "<p>45-60 мин под местной анестезией.</p>",
    'recovery': "<p>Повязка 2-3 дня. Полное заживление 2 недели.</p>",
    'risks': "Рецидив (редко).",
    'faq': [("Останется шрам?", "За ухом, не виден."), ("Влияет на слух?", "Нет.")]
}

OTO_HOOK_AR = "تخلص من الأذن البارزة بشكل دائم. آذان طبيعية وجمالية في جلسة واحدة."
OTO_DATA_AR = {
    'title': "تجميل الأذن (أوتوبلاستي)",
    'definition': "<p>تصحح الأذن البارزة.</p>",
    'anatomy': "<p>غضروف الأذن.</p>",
    'candidates': "<p>البالغين والأطفال من سن 6 سنوات.</p>",
    'procedure': "<p>45-60 دقيقة تحت تخدير موضعي.</p>",
    'recovery': "<p>ضمادة 2-3 أيام. شفاء تام أسبوعين.</p>",
    'risks': "تكرار (نادر).",
    'faq': [("هل تبقى ندبة؟", "خلف الأذن، غير مرئية."), ("يؤثر على السمع؟", "لا.")]
}

OTO_HOOK_DE = "Befreien Sie sich dauerhaft von abstehenden Ohren. Natürliche und ästhetische Ohren in einer Sitzung."
OTO_DATA_DE = {
    'title': "Ohrenkorrektur (Otoplastik)",
    'definition': "<p>Korrektur von abstehenden Ohren.</p>",
    'anatomy': "<p>Ohrknorpel.</p>",
    'candidates': "<p>Erwachsene und Kinder ab 6 Jahren.</p>",
    'procedure': "<p>45-60 Min. in Lokalanästhesie.</p>",
    'recovery': "<p>Verband 2-3 Tage. Heilung 2 Wochen.</p>",
    'risks': "Rezidiv (selten).",
    'faq': [("Narbe?", "Hinter dem Ohr, unsichtbar."), ("Hören beeinflusst?", "Nein.")]
}

OTO_HOOK_FR = "Débarrassez-vous définitivement des oreilles décollées. Des oreilles naturelles et esthétiques en une seule séance."
OTO_DATA_FR = {
    'title': "Otoplastie (Chirurgie des oreilles)",
    'definition': "<p>Correction des oreilles décollées.</p>",
    'anatomy': "<p>Cartilage de l'oreille.</p>",
    'candidates': "<p>Adultes et enfants dès 6 ans.</p>",
    'procedure': "<p>45-60 min sous anesthésie locale.</p>",
    'recovery': "<p>Pansement 2-3 jours. Guérison 2 semaines.</p>",
    'risks': "Récidive (rare).",
    'faq': [("Cicatrice ?", "Derrière l'oreille, invisible."), ("Audition affectée ?", "Non.")]
}

OTO_HOOK_CIN = "永久摆脱招风耳。一次疗程获得自然美观的耳朵。"
OTO_DATA_CIN = {
    'title': "耳部整形术 (招风耳矫正)",
    'definition': "<p>矫正招风耳。</p>",
    'anatomy': "<p>耳软骨。</p>",
    'candidates': "<p>成人及6岁以上儿童。</p>",
    'procedure': "<p>局部麻醉下45-60分钟。</p>",
    'recovery': "<p>包扎2-3天。2周完全愈合。</p>",
    'risks': "复发（罕见）。",
    'faq': [("留疤吗？", "在耳后，看不见。"), ("影响听力吗？", "不。")]
}

# 12. PRP
PRP_HOOK_TR = "Kendi kanınızdan gelen şifa. PRP, büyüme faktörleri ile hücre yenilenmesi ve saç tedavisinde doğal güç."
PRP_DATA_TR = {
    'title': "PRP Tedavisi (Platelet Rich Plasma)",
    'definition': "<p>Kişinin kendi kanının santrifüj edilerek trombositten zengin plazmanın ayrıştırılması ve tekrar verilmesidir.</p>",
    'anatomy': "<p>Trombositler, onarıcı büyüme faktörleri (Growth Factors) içerir. Dokuda hasar tespit ettiğinde onarımı başlatır.</p>",
    'candidates': "<p>Saç dökülmesi yaşayanlar, cilt gençleştirme isteyenler, akne izi tedavisi görenler.</p>",
    'procedure': "<p>Kan alınır, 10 dk işlemden geçirilir, küçük iğnelerle enjekte edilir.</p>",
    'recovery': "<p>Hemen işe dönülebilir.</p>",
    'risks': "Kendi kanınız olduğu için alerji riski YOKTUR.",
    'faq': [("Saç çıkarır mı?", "Var olan kökleri güçlendirir, dökülmeyi durdurur. Ölü kökten saç çıkarmaz."), ("Kök hücre midir?", "Hayır, ama kök hücreleri uyaran sinyaller içerir.")]
}

PRP_HOOK_EN = "Healing coming from your own blood. PRP involves natural power in cell regeneration and hair treatment with growth factors."
PRP_DATA_EN = {
    'title': "PRP Treatment (Platelet Rich Plasma)",
    'definition': "<p>It is the separation of platelet-rich plasma by centrifuging the person's own blood and administering it back.</p>",
    'anatomy': "<p>Platelets contain reparative Growth Factors. They initiate repair when they detect damage in the tissue.</p>",
    'candidates': "<p>Those experiencing hair loss, those wanting skin rejuvenation, those undergoing acne scar treatment.</p>",
    'procedure': "<p>Blood is taken, processed for 10 mins, injected with small needles.</p>",
    'recovery': "<p>Immediate return to work.</p>",
    'risks': "Since it is your own blood, there is NO risk of allergy.",
    'faq': [("Does it grow hair?", "It strengthens existing roots, stops shedding. Does not grow hair from dead roots."), ("Is it stem cell?", "No, but it contains signals stimulating stem cells.")]
}


PRP_HOOK_RU = "Сила регенерации из вашей собственной крови. Естественное обновление и заживление с PRP."
PRP_DATA_RU = {
    'title': "PRP-терапия (Плазмолифтинг)",
    'definition': "<p>Введение плазмы, обогащенной тромбоцитами, полученной из собственной крови пациента.</p>",
    'anatomy': "<p>Факторы роста в тромбоцитах.</p>",
    'candidates': "<p>Омоложение кожи, лечение шрамов, выпадение волос.</p>",
    'procedure': "<p>Забор крови и центрифугирование. 30 мин.</p>",
    'recovery': "<p>Нет.</p>",
    'risks': "Нет (собственная кровь).",
    'faq': [("Своя кровь?", "Да."), ("Сколько сеансов?", "3-4 сеанса.")]
}

PRP_HOOK_AR = "قوة التجدد من دمك. تجديد طبيعي وشفاء مع PRP."
PRP_DATA_AR = {
    'title': "علاج البلازما الغنية بالصفائح الدموية (PRP)",
    'definition': "<p>حقن البلازما الغنية بالصفائح الدموية التي تم الحصول عليها من دم المريض نفسه.</p>",
    'anatomy': "<p>عوامل النمو في الصفائح الدموية.</p>",
    'candidates': "<p>تجديد البشرة، علاج الندبات، تساقط الشعر.</p>",
    'procedure': "<p>سحب الدم والطرد المركزي. 30 دقيقة.</p>",
    'recovery': "<p>لا يوجد.</p>",
    'risks': "لا يوجد (دمك الخاص).",
    'faq': [("دمي الخاص؟", "نعم."), ("كم عدد الجلسات؟", "3-4 جلسات.")]
}

PRP_HOOK_DE = "Die Kraft der Regeneration aus Ihrem eigenen Blut. Natürliche Erneuerung und Heilung mit PRP."
PRP_DATA_DE = {
    'title': "PRP-Therapie (Eigenblutbehandlung)",
    'definition': "<p>Injektion von plättchenreichem Plasma aus dem eigenen Blut.</p>",
    'anatomy': "<p>Wachstumsfaktoren.</p>",
    'candidates': "<p>Hautverjüngung, Narben, Haarausfall.</p>",
    'procedure': "<p>Blutabnahme und Zentrifugation. 30 Min.</p>",
    'recovery': "<p>Keine.</p>",
    'risks': "Keine.",
    'faq': [("Eigenes Blut?", "Ja."), ("Wie viele Sitzungen?", "3-4 Sitzungen.")]
}

PRP_HOOK_FR = "La force de régénération de votre propre sang. Renouveau naturel et guérison avec PRP."
PRP_DATA_FR = {
    'title': "Thérapie PRP (Plasma Riche en Plaquettes)",
    'definition': "<p>Injection de plasma riche en plaquettes obtenu du propre sang du patient.</p>",
    'anatomy': "<p>Facteurs de croissance.</p>",
    'candidates': "<p>Rajeunissement peau, cicatrices, cheveux.</p>",
    'procedure': "<p>Prise de sang et centrifugation. 30 min.</p>",
    'recovery': "<p>Aucune.</p>",
    'risks': "Aucun.",
    'faq': [("Mon sang ?", "Oui."), ("Combien de séances ?", "3-4 séances.")]
}

PRP_HOOK_CIN = "来自您自身血液的再生力量。使用 PRP 进行自然更新和愈合。"
PRP_DATA_CIN = {
    'title': "PRP 疗法 (富血小板血浆)",
    'definition': "<p>注射从患者自身血液中获得的富含血小板的血浆。</p>",
    'anatomy': "<p>生长因子。</p>",
    'candidates': "<p>皮肤年轻化，疤痕，脱发。</p>",
    'procedure': "<p>抽血并离心。30分钟。</p>",
    'recovery': "<p>无。</p>",
    'risks': "无（自体血液）。",
    'faq': [("自己的血？", "是的。"), ("多少次？", "3-4次。")]
}

# 13. Cilt Yenileme
CILT_HOOK_TR = "Zamanı geri sarmak için bütüncül yaklaşım. Leke, kırışıklık ve sarkma tedavilerinde kombine protokoller."
CILT_DATA_TR = {
    'title': "Cilt Yenileme ve Gençleştirme (Kombine Tedaviler)",
    'definition': "<p>Tek bir yöntem yerine, cildin farklı katmanlarına (epidermis, dermis, smas) aynı anda etki eden teknolojilerin bir arada kullanılmasıdır.</p>",
    'anatomy': "<p>Cildin üst katmanı lazerle, orta katmanı vitaminlerle, alt katmanı enerji bazlı cihazlarla tedavi edilir.</p>",
    'candidates': "<p>Cildinde çoklu problem (leke + sarkma + geniş gözenek) olanlar.</p>",
    'procedure': "<p>Kişiye özel protokol oluşturulur. (Örn: Altın İğne + PRP + Mezoterapi).</p>",
    'recovery': "<p>Uygulanan protokole göre 1-3 gün kızarıklık olabilir.</p>",
    'risks': "Yanlış cihaz seçimi leke artışına neden olabilir.",
    'faq': [("En iyi yöntem hangisi?", "Tek bir en iyi yoktur, sizin cildinize en uygun kombinasyon vardır."), ("Sonuçlar kalıcı mı?", "Yaşlanma devam ettiği için koruma seansları önerilir.")]
}

CILT_HOOK_EN = "Holistic approach to rewind time. Combined protocols in spot, wrinkle, and sagging treatments."
CILT_DATA_EN = {
    'title': "Skin Rejuvenation (Combined Treatments)",
    'definition': "<p>It is the combined use of technologies acting on different layers of the skin (epidermis, dermis, smas) simultaneously instead of a single method.</p>",
    'anatomy': "<p>The upper layer of the skin is treated with laser, the middle layer with vitamins, and the lower layer with energy-based devices.</p>",
    'candidates': "<p>Those with multiple problems on their skin (spot + sagging + large pores).</p>",
    'procedure': "<p>A personalized protocol is created. (Eg: Golden Needle + PRP + Mesotherapy).</p>",
    'recovery': "<p>There may be redness for 1-3 days depending on the applied protocol.</p>",
    'risks': "Wrong device selection may cause spot increase.",
    'faq': [("Which method is best?", "There is no single best, there is a combination most suitable for your skin."), ("Are results permanent?", "Maintenance sessions are recommended as aging continues.")]
}


CILT_HOOK_RU = "Комплексные решения для более свежей, гладкой и упругой кожи. Технологии омоложения."
CILT_DATA_RU = {
    'title': "Омоложение кожи (Лазер и пилинг)",
    'definition': "<p>Удаление мертвых клеток и стимуляция коллагена с помощью лазера или химических пилингов.</p>",
    'anatomy': "<p>Эпидермис и Дерма.</p>",
    'candidates': "<p>Пятна, мелкие морщины, поры.</p>",
    'procedure': "<p>Варьируется (30-60 мин).</p>",
    'recovery': "<p>Шелушение 3-5 дней.</p>",
    'risks': "Временное покраснение.",
    'faq': [("Летом можно?", "Некоторые лазеры нет."), ("Больно?", "Легкое жжение.")]
}

CILT_HOOK_AR = "حلول شاملة لبشرة أكثر نضارة ونعومة وتشديدًا. تقنيات التجديد."
CILT_DATA_AR = {
    'title': "تجديد البشرة (ليزر وتقشير)",
    'definition': "<p>إزالة الخلايا الميتة وتحفيز الكولاجين بالليزر أو التقشير الكيميائي.</p>",
    'anatomy': "<p>البشرة والأدمة.</p>",
    'candidates': "<p>البقع، التجاعيد الدقيقة، المسام.</p>",
    'procedure': "<p>تختلف (30-60 دقيقة).</p>",
    'recovery': "<p>تقشير 3-5 أيام.</p>",
    'risks': "احمرار مؤقت.",
    'faq': [("هل يمكن في الصيف؟", "بعض الليزر لا."), ("هل هو مؤلم؟", "حرق خفيف.")]
}

CILT_HOOK_DE = "Umfassende Lösungen für frischere, glattere und straffere Haut. Technologien zur Verjüngung."
CILT_DATA_DE = {
    'title': "Hautverjüngung (Laser & Peeling)",
    'definition': "<p>Entfernung abgestorbener Zellen und Kollagenstimulation durch Laser oder chemische Peelings.</p>",
    'anatomy': "<p>Epidermis und Dermis.</p>",
    'candidates': "<p>Flecken, feine Falten, Poren.</p>",
    'procedure': "<p>Variiert (30-60 Min.).</p>",
    'recovery': "<p>Schuppung 3-5 Tage.</p>",
    'risks': "Vorübergehende Rötung.",
    'faq': [("Im Sommer?", "Manche Laser nicht."), ("Schmerzhaft?", "Leichtes Brennen.")]
}

CILT_HOOK_FR = "Des solutions complètes pour une peau plus fraîche, plus lisse et plus ferme. Technologies de rajeunissement."
CILT_DATA_FR = {
    'title': "Rajeunissement de la Peau",
    'definition': "<p>Élimination des cellules mortes et stimulation du collagène.</p>",
    'anatomy': "<p>Épiderme et Derme.</p>",
    'candidates': "<p>Taches, ridules, pores.</p>",
    'procedure': "<p>Varie (30-60 min).</p>",
    'recovery': "<p>Desquamation 3-5 jours.</p>",
    'risks': "Rougeur temporaire.",
    'faq': [("En été ?", "Certains lasers non."), ("Douloureux ?", "Légère brûlure.")]
}

CILT_HOOK_CIN = "更清新、更光滑、更紧致肌肤的综合解决方案。年轻化技术。"
CILT_DATA_CIN = {
    'title': "皮肤年轻化 (激光与换肤)",
    'definition': "<p>通过激光或化学换肤去除死皮细胞并刺激胶原蛋白。</p>",
    'anatomy': "<p>表皮和真皮。</p>",
    'candidates': "<p>斑点，细纹，毛孔。</p>",
    'procedure': "<p>各异（30-60分钟）。</p>",
    'recovery': "<p>脱皮3-5天。</p>",
    'risks': "暂时发红。",
    'faq': [("夏天可以吗？", "有些激光不行。"), ("疼吗？", "轻微烧灼感。")]
}

# 14. Biyografi
BIO_HOOK_TR = "Bilim ve sanatın ışığında, etik değerlerden ödün vermeden 'doğal güzelliğinizi' ortaya çıkarıyoruz."
BIO_DATA_TR = {
    'title': "Prof. Dr. Gökçe Özel Kimdir?",
    'definition': "<p>Prof. Dr. Gökçe Özel, Ankara doğumlu, Hacettepe Üniversitesi Tıp Fakültesi mezunu, Estetik, Plastik ve Rekonstrüktif Cerrahi uzmanıdır. Uzun yıllar akademi dünyasında eğitim vermiş, yüzlerce asistan yetiştirmiş ve sayısız bilimsel makaleye imza atmıştır.</p>",
    'anatomy': "<p>Gökçe Özel Kliniği, butik hizmet anlayışıyla çalışır. Fabrikasyon işlemler yerine, her hastaya yeterli zamanın ayrıldığı, detaylı analizin yapıldığı bir süreci benimser.</p>",
    'candidates': "<p>Kendini özel hissetmek, güvenilir ellerde olmak ve abartıdan uzak, rafine sonuçlar isteyen herkes.</p>",
    'procedure': "<p>İlk muayeneden son kontrole kadar tüm süreç bizzat Prof. Dr. Gökçe Özel tarafından yönetilir.</p>",
    'recovery': "<p>Mutlu hasta, mutlu hekim felsefesiyle, iletişim kanallarımız 7/24 açıktır.</p>",
    'risks': "-",
    'faq': [("Hangi hastanelerde ameliyat yapıyorsunuz?", "Ankara'nın en donanımlı A+ grubu hastaneleri (Acıbadem, Memorial, TOBB vb.) ile çalışmaktayız."), ("Muayene ücretli mi?", "Evet, detaylı yüz analizi ve simülasyon içeren profesyonel bir konsültasyon hizmeti sunuyoruz.")]
}

BIO_HOOK_EN = "In the light of science and art, we reveal your 'natural beauty' without compromising ethical values."
BIO_DATA_EN = {
    'title': "Who is Prof. Dr. Gökçe Özel?",
    'definition': "<p>Prof. Dr. Gökçe Özel is an Aesthetic, Plastic, and Reconstructive Surgery specialist born in Ankara, graduated from Hacettepe University Faculty of Medicine. He has taught in the academic world for many years, trained hundreds of assistants, and signed numerous scientific articles.</p>",
    'anatomy': "<p>Gökçe Özel Clinic works with a boutique service understanding. Instead of fabricated procedures, it adopts a process where sufficient time is allocated to each patient and detailed analysis is made.</p>",
    'candidates': "<p>Everyone who wants to feel special, be in safe hands, and wants refined results far from exaggeration.</p>",
    'procedure': "<p>The entire process from the first examination to the last check-up is managed personally by Prof. Dr. Gökçe Özel.</p>",
    'recovery': "<p>With the philosophy of happy patient, happy doctor, our communication channels are open 24/7.</p>",
    'risks': "-",
    'faq': [("Which hospitals do you operate in?", "We work with Ankara's best equipped A+ group hospitals (Acıbadem, Memorial, TOBB, etc.)."), ("Is the examination paid?", "Yes, we offer a professional consultation service including detailed face analysis and simulation.")]
}


BIO_HOOK_RU = "Путь, посвященный эстетике. Академическое превосходство и художественное видение."
BIO_DATA_RU = {
    'title': "Профессор Доктор Гёкче Озель",
    'definition': "<p>Ведущий эстетический, пластический и реконструктивный хирург Анкары.</p>",
    'anatomy': "<p>--</p>",
    'candidates': "<p>Все пациенты.</p>",
    'procedure': "<p>Консультация.</p>",
    'recovery': "<p>--</p>",
    'risks': "--",
    'faq': []
}

BIO_HOOK_AR = "رحلة مكرسة للجمال. التفوق الأكاديمي والرؤية الفنية."
BIO_DATA_AR = {
    'title': "البروفيسور الدكتور جوكتشه أوزيل",
    'definition': "<p>جراح التجميل والترميم الرائد في أنقرة.</p>",
    'anatomy': "<p>--</p>",
    'candidates': "<p>جميع المرضى.</p>",
    'procedure': "<p>استشارة.</p>",
    'recovery': "<p>--</p>",
    'risks': "--",
    'faq': []
}

BIO_HOOK_DE = "Ein der Ästhetik gewidmeter Weg. Akademische Exzellenz und künstlerische Vision."
BIO_DATA_DE = {
    'title': "Prof. Dr. Gökçe Özel",
    'definition': "<p>Ankaras führender ästhetischer, plastischer und rekonstruktiver Chirurg.</p>",
    'anatomy': "<p>--</p>",
    'candidates': "<p>Alle Patienten.</p>",
    'procedure': "<p>Beratung.</p>",
    'recovery': "<p>--</p>",
    'risks': "--",
    'faq': []
}

BIO_HOOK_FR = "Un parcours dédié à l'esthétique. Excellence académique et vision artistique."
BIO_DATA_FR = {
    'title': "Prof. Dr. Gökçe Özel",
    'definition': "<p>Chirurgien esthétique, plastique et reconstructeur de premier plan à Ankara.</p>",
    'anatomy': "<p>--</p>",
    'candidates': "<p>Tous les patients.</p>",
    'procedure': "<p>Consultation.</p>",
    'recovery': "<p>--</p>",
    'risks': "--",
    'faq': []
}

BIO_HOOK_CIN = "致力于美学的旅程。学术卓越与艺术视野。"
BIO_DATA_CIN = {
    'title': "Gökçe Özel 教授博士",
    'definition': "<p>安卡拉领先的美容、整形和重建外科医生。</p>",
    'anatomy': "<p>--</p>",
    'candidates': "<p>所有患者。</p>",
    'procedure': "<p>咨询。</p>",
    'recovery': "<p>--</p>",
    'risks': "--",
    'faq': []
}

# ---------------------------------------------------------------------
# MAIN LOGIC
# ---------------------------------------------------------------------

TARGETS = [
    {
        'keywords': ["Burun estetiği", "Rinoplasti", "Burun ameliyatı", "Nose job", "Rhinoplasty"],
        'TR': (RINOPLASTI_HOOK_TR, RINOPLASTI_DATA_TR),
        'EN': (RINOPLASTI_HOOK_EN, RINOPLASTI_DATA_EN),
        'RU': (RINOPLASTI_HOOK_RU, RINOPLASTI_DATA_RU),
        'AR': (RINOPLASTI_HOOK_AR, RINOPLASTI_DATA_AR),
        'DE': (RINOPLASTI_HOOK_DE, RINOPLASTI_DATA_DE),
        'FR': (RINOPLASTI_HOOK_FR, RINOPLASTI_DATA_FR),
        'CIN': (RINOPLASTI_HOOK_CIN, RINOPLASTI_DATA_CIN)
    },
    {
        'keywords': ["Endolift", "Lazer ağ", "Yüz germe", "Ameliyatsız yüz germe", "Laser facelift"],
        'TR': (ENDOLIFT_HOOK_TR, ENDOLIFT_DATA_TR),
        'EN': (ENDOLIFT_HOOK_EN, ENDOLIFT_DATA_EN),
        'RU': (ENDOLIFT_HOOK_RU, ENDOLIFT_DATA_RU),
        'AR': (ENDOLIFT_HOOK_AR, ENDOLIFT_DATA_AR),
        'DE': (ENDOLIFT_HOOK_DE, ENDOLIFT_DATA_DE),
        'FR': (ENDOLIFT_HOOK_FR, ENDOLIFT_DATA_FR),
        'CIN': (ENDOLIFT_HOOK_CIN, ENDOLIFT_DATA_CIN)
    },
    {
        'keywords': ["İp askı", "Fransız askısı", "Örümcek ağı", "Thread lift", "French lift"],
        'TR': (IP_HOOK_TR, IP_DATA_TR),
        'EN': (IP_HOOK_EN, IP_DATA_EN),
        'RU': (IP_HOOK_RU, IP_DATA_RU),
        'AR': (IP_HOOK_AR, IP_DATA_AR),
        'DE': (IP_HOOK_DE, IP_DATA_DE),
        'FR': (IP_HOOK_FR, IP_DATA_FR),
        'CIN': (IP_HOOK_CIN, IP_DATA_CIN)
    },
    {
        'keywords': ["Göz kapağı", "Blefaroplasti", "Göz torbası", "Düşük göz kapağı", "Blepharoplasty", "Eyelid"],
        'TR': (BLEF_HOOK_TR, BLEF_DATA_TR),
        'EN': (BLEF_HOOK_EN, BLEF_DATA_EN),
        'RU': (BLEF_HOOK_RU, BLEF_DATA_RU),
        'AR': (BLEF_HOOK_AR, BLEF_DATA_AR),
        'DE': (BLEF_HOOK_DE, BLEF_DATA_DE),
        'FR': (BLEF_HOOK_FR, BLEF_DATA_FR),
        'CIN': (BLEF_HOOK_CIN, BLEF_DATA_CIN)
    },
    {
        'keywords': ["Botoks", "Botox", "Kırışıklık", "Masseter", "Terleme"],
        'TR': (BOTOKS_HOOK_TR, BOTOKS_DATA_TR),
        'EN': (BOTOKS_HOOK_EN, BOTOKS_DATA_EN),
        'RU': (BOTOKS_HOOK_RU, BOTOKS_DATA_RU),
        'AR': (BOTOKS_HOOK_AR, BOTOKS_DATA_AR),
        'DE': (BOTOKS_HOOK_DE, BOTOKS_DATA_DE),
        'FR': (BOTOKS_HOOK_FR, BOTOKS_DATA_FR),
        'CIN': (BOTOKS_HOOK_CIN, BOTOKS_DATA_CIN)
    },
    {
        'keywords': ["Dolgu", "Dermal filler", "Elmacık", "Çene dolgusu", "Jawline", "Işık dolgusu"],
        'TR': (DOLGU_HOOK_TR, DOLGU_DATA_TR),
        'EN': (DOLGU_HOOK_EN, DOLGU_DATA_EN),
        'RU': (DOLGU_HOOK_RU, DOLGU_DATA_RU),
        'AR': (DOLGU_HOOK_AR, DOLGU_DATA_AR),
        'DE': (DOLGU_HOOK_DE, DOLGU_DATA_DE),
        'FR': (DOLGU_HOOK_FR, DOLGU_DATA_FR),
        'CIN': (DOLGU_HOOK_CIN, DOLGU_DATA_CIN)
    },
    {
        'keywords': ["Dudak dolgusu", "Lip filler", "Russian lips", "Dudak estetiği"],
        'TR': (DUDAK_DOLGU_HOOK_TR, DUDAK_DOLGU_DATA_TR),
        'EN': (DUDAK_DOLGU_HOOK_EN, DUDAK_DOLGU_DATA_EN),
        'RU': (DUDAK_DOLGU_HOOK_RU, DUDAK_DOLGU_DATA_RU),
        'AR': (DUDAK_DOLGU_HOOK_AR, DUDAK_DOLGU_DATA_AR),
        'DE': (DUDAK_DOLGU_HOOK_DE, DUDAK_DOLGU_DATA_DE),
        'FR': (DUDAK_DOLGU_HOOK_FR, DUDAK_DOLGU_DATA_FR),
        'CIN': (DUDAK_DOLGU_HOOK_CIN, DUDAK_DOLGU_DATA_CIN)
    },
    {
        'keywords': ["Lip lift", "Dudak kaldırma", "Boğa boynuzu", "Bullhorn"],
        'TR': (LIPLIFT_HOOK_TR, LIPLIFT_DATA_TR),
        'EN': (LIPLIFT_HOOK_EN, LIPLIFT_DATA_EN),
        'RU': (LIPLIFT_HOOK_RU, LIPLIFT_DATA_RU),
        'AR': (LIPLIFT_HOOK_AR, LIPLIFT_DATA_AR),
        'DE': (LIPLIFT_HOOK_DE, LIPLIFT_DATA_DE),
        'FR': (LIPLIFT_HOOK_FR, LIPLIFT_DATA_FR),
        'CIN': (LIPLIFT_HOOK_CIN, LIPLIFT_DATA_CIN)
    },
    {
        'keywords': ["Mezoterapi", "Gençlik aşısı", "Somon DNA", "Mesotherapy", "Vitamin"],
        'TR': (MEZO_HOOK_TR, MEZO_DATA_TR),
        'EN': (MEZO_HOOK_EN, MEZO_DATA_EN),
        'RU': (MEZO_HOOK_RU, MEZO_DATA_RU),
        'AR': (MEZO_HOOK_AR, MEZO_DATA_AR),
        'DE': (MEZO_HOOK_DE, MEZO_DATA_DE),
        'FR': (MEZO_HOOK_FR, MEZO_DATA_FR),
        'CIN': (MEZO_HOOK_CIN, MEZO_DATA_CIN)
    },
    {
        'keywords': ["Gamze", "Dimple", "Gamze estetiği", "Dimpleplasty"],
        'TR': (GAMZE_HOOK_TR, GAMZE_DATA_TR),
        'EN': (GAMZE_HOOK_EN, GAMZE_DATA_EN),
        'RU': (GAMZE_HOOK_RU, GAMZE_DATA_RU),
        'AR': (GAMZE_HOOK_AR, GAMZE_DATA_AR),
        'DE': (GAMZE_HOOK_DE, GAMZE_DATA_DE),
        'FR': (GAMZE_HOOK_FR, GAMZE_DATA_FR),
        'CIN': (GAMZE_HOOK_CIN, GAMZE_DATA_CIN)
    },
    {
        'keywords': ["Kepçe kulak", "Otoplasti", "Kulak estetiği", "Otoplasty", "Ear surgery"],
        'TR': (OTO_HOOK_TR, OTO_DATA_TR),
        'EN': (OTO_HOOK_EN, OTO_DATA_EN),
        'RU': (OTO_HOOK_RU, OTO_DATA_RU),
        'AR': (OTO_HOOK_AR, OTO_DATA_AR),
        'DE': (OTO_HOOK_DE, OTO_DATA_DE),
        'FR': (OTO_HOOK_FR, OTO_DATA_FR),
        'CIN': (OTO_HOOK_CIN, OTO_DATA_CIN)
    },
    {
        'keywords': ["PRP", "Kök hücre", "Platelet", "Plasma", "Saç tedavisi"],
        'TR': (PRP_HOOK_TR, PRP_DATA_TR),
        'EN': (PRP_HOOK_EN, PRP_DATA_EN),
        'RU': (PRP_HOOK_RU, PRP_DATA_RU),
        'AR': (PRP_HOOK_AR, PRP_DATA_AR),
        'DE': (PRP_HOOK_DE, PRP_DATA_DE),
        'FR': (PRP_HOOK_FR, PRP_DATA_FR),
        'CIN': (PRP_HOOK_CIN, PRP_DATA_CIN)
    },
    {
        'keywords': ["Cilt yenileme", "Leke tedavisi", "Akne izi", "Skin rejuvenation", "Peeling", "Lazer"],
        'TR': (CILT_HOOK_TR, CILT_DATA_TR),
        'EN': (CILT_HOOK_EN, CILT_DATA_EN),
        'RU': (CILT_HOOK_RU, CILT_DATA_RU),
        'AR': (CILT_HOOK_AR, CILT_DATA_AR),
        'DE': (CILT_HOOK_DE, CILT_DATA_DE),
        'FR': (CILT_HOOK_FR, CILT_DATA_FR),
        'CIN': (CILT_HOOK_CIN, CILT_DATA_CIN)
    },
    {
        'keywords': ["Biyografi", "Hakkında", "Kimdir", "About", "Biography", "Gökçe Özel"],
        'TR': (BIO_HOOK_TR, BIO_DATA_TR),
        'EN': (BIO_HOOK_EN, BIO_DATA_EN),
        'RU': (BIO_HOOK_RU, BIO_DATA_RU),
        'AR': (BIO_HOOK_AR, BIO_DATA_AR),
        'DE': (BIO_HOOK_DE, BIO_DATA_DE),
        'FR': (BIO_HOOK_FR, BIO_DATA_FR),
        'CIN': (BIO_HOOK_CIN, BIO_DATA_CIN)
    }
]


def run_update():
    print("Connecting to database...")
    try:
        conn = pymysql.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Helper to generate content safely
        def generate_html(lang_code, item_dict):
            if lang_code not in item_dict:
                return None
            
            hook_text, data_dict = item_dict[lang_code]
            if not data_dict:
                return None
                
            return build_article(
                lang_code,
                data_dict.get('title', ''),
                hook_text,
                data_dict.get('definition', ''),
                data_dict.get('anatomy', ''),
                data_dict.get('candidates', ''),
                data_dict.get('procedure', ''),
                data_dict.get('recovery', ''),
                data_dict.get('risks', ''),
                data_dict.get('faq', [])
            )

        count_updated = 0

        for item in TARGETS:
            keywords = item['keywords']
            print(f"Processing Keyword Group: {keywords[0]}...")
            
            # Generate content for all languages
            contents = {}
            languages = ['TR', 'EN', 'RU', 'AR', 'DE', 'FR', 'CIN']
            
            for lang in languages:
                contents[lang] = generate_html(lang, item)
            
            # Fallback logic: 
            # If EN exists, use it for missing others. 
            # If EN missing, use TR.
            fallback_content = contents.get('EN') or contents.get('TR')
            
            for lang in languages:
                if not contents[lang]:
                    contents[lang] = fallback_content

            # Find matching records in DB
            matched_ids = set()
            for kw in keywords:
                # Search primarily in TR title/content to find the record
                sql_find = "SELECT id FROM icerik WHERE tr_baslik LIKE %s"
                cursor.execute(sql_find, (f"%{kw}%",))
                rows = cursor.fetchall()
                for r in rows:
                    matched_ids.add(r['id'])
            
            if not matched_ids:
                print(f"  No records found for keywords: {keywords}")
                continue
                
            # Update Records
            sql_update = """
                UPDATE icerik 
                SET 
                    tr_detay = %s,
                    en_detay = %s,
                    ru_detay = %s,
                    ar_detay = %s,
                    de_detay = %s,
                    fr_detay = %s,
                    cin_detay = %s
                WHERE id = %s
            """
            
            for mid in matched_ids:
                cursor.execute(sql_update, (
                    contents['TR'],
                    contents['EN'],
                    contents['RU'],
                    contents['AR'],
                    contents['DE'],
                    contents['FR'],
                    contents['CIN'],
                    mid
                ))
                print(f"  -> Updated ID: {mid}")
                count_updated += 1
                
            conn.commit()

        print(f"\nOperation Complete. Total updated: {count_updated}")

    except Exception as e:
        print(f"Critical Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        if 'conn' in locals() and conn: conn.close()

if __name__ == "__main__":
    run_update()
