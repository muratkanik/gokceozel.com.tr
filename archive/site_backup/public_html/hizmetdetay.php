<?php
header('Content-Type: text/html; charset=utf-8');
mb_internal_encoding('UTF-8');

// Include DB connection and URL helpers
include_once(__DIR__ . "/baglanti/baglantilar_fonksiyonlar.php");
include_once(__DIR__ . "/baglanti/url_helpers.php");
?>
<?php

$show_detail = false;
$hzyl = null;
$hztb = null; // for submenu
$content = null; // For URL helper functions

// 1. Check for Detail (supports both slug and old detay parameter)
$slug = isset($_GET['slug']) ? clean(htmlentities($_GET['slug'], ENT_QUOTES)) : '';
$detay_id = isset($_GET['detay']) ? clean(htmlentities(addslashes($_GET['detay']), ENT_QUOTES)) : '';

if (!empty($slug) || !empty($detay_id)) {

    // Determine language
    $active_lang = (isset($_GET['LN']) && !empty($_GET['LN'])) ? strtoupper($_GET['LN']) : 'TR';
    $valid_langs = ['TR', 'EN', 'RU', 'AR', 'DE', 'FR', 'CIN'];
    if (!in_array($active_lang, $valid_langs)) {
        $active_lang = 'TR';
    }
    $lang_prefix = strtolower($active_lang);

    // Build query based on slug or ID
    if (!empty($slug)) {
        // New slug-based URL
        $slug_col = $lang_prefix . '_slug';
        $hzy = "SELECT et.id, eskayit,
et.kategori,
et.tr_slug,
et.en_slug,
et.ru_slug,
et.ar_slug,
et.de_slug,
et.fr_slug,
et.cin_slug,
        tr_baslik, tr_icerik, tr_detay, tr_slug,
        en_baslik, en_icerik, en_detay, en_slug,
        ru_baslik, ru_icerik, ru_detay, ru_slug,
        ar_baslik, ar_icerik, ar_detay, ar_slug,
        fr_baslik, fr_icerik, fr_detay, fr_slug,
        de_baslik, de_icerik, de_detay, de_slug,
        cin_baslik, cin_icerik, cin_detay, cin_slug,
        et.kayit_tarihi, et.kategori,
        (SELECT eb.belge FROM icerik_belge eb WHERE et.eskayit=eb.kayit_id AND eb.durum!='-1' ORDER BY eb.id DESC LIMIT 0,1) belge
        FROM icerik et WHERE kategori IN (42,43) AND durum='1' AND $slug_col = :slug ORDER BY et.id DESC LIMIT 0,1";

        $hzyb = sorgu($hzy, $baglan);
        $hzyb->bindValue(':slug', $slug, PDO::PARAM_STR);
    } else {
        // Old detay parameter (backward compatibility)
        $hzy = "SELECT et.id, eskayit,
et.kategori,
et.tr_slug,
et.en_slug,
et.ru_slug,
et.ar_slug,
et.de_slug,
et.fr_slug,
et.cin_slug,
        tr_baslik, tr_icerik, tr_detay, tr_seo_title, tr_seo_description, tr_slug,
        en_baslik, en_icerik, en_detay, en_seo_title, en_seo_description, en_slug,
        ru_baslik, ru_icerik, ru_detay, ru_seo_title, ru_seo_description, ru_slug,
        ar_baslik, ar_icerik, ar_detay, ar_seo_title, ar_seo_description, ar_slug,
        fr_baslik, fr_icerik, fr_detay, fr_seo_title, fr_seo_description, fr_slug,
        de_baslik, de_icerik, de_detay, de_seo_title, de_seo_description, de_slug,
        cin_baslik, cin_icerik, cin_detay, cin_seo_title, cin_seo_description, cin_slug,
        et.kayit_tarihi, et.kategori,
        (SELECT eb.belge FROM icerik_belge eb WHERE et.eskayit=eb.kayit_id AND eb.durum!='-1' ORDER BY eb.id DESC LIMIT 0,1) belge
        FROM icerik et WHERE kategori IN (42,43) AND durum='1' AND et.eskayit=:detaym ORDER BY et.id DESC LIMIT 0,1";

        $hzyb = sorgu($hzy, $baglan);
        $hzyb->bindValue(':detaym', $detay_id, PDO::PARAM_STR);
    }

    $hzyb->execute();
    $hzyl = veriliste($hzyb);
    $content = $hzyl; // Store for URL helpers

    // Redirect to 404 if content not found
    if (!$hzyl) {
        header("HTTP/1.0 404 Not Found");
        include('404.php');
        exit;
    }

    // Content found, enable detail view
    $show_detail = true;

    // Set SEO Variables for ust.php
    
    if (isset($hzyl[$lang_prefix . '_seo_title']) && !empty($hzyl[$lang_prefix . '_seo_title'])) {
        $page_seo_title = $hzyl[$lang_prefix . '_seo_title'];
    } else {
        $page_seo_title = $hzyl[$lang_prefix . '_baslik']; // Fallback to Title
    }

    if (isset($hzyl[$lang_prefix . '_seo_description']) && !empty($hzyl[$lang_prefix . '_seo_description'])) {
         $page_seo_description = $hzyl[$lang_prefix . '_seo_description'];
    }

    
    // Prepare Submenu Query (moved here to keep logic grouped, though executed later)
    $hzt = "SELECT  et.id,
et.kategori,
et.tr_slug,
et.en_slug,
et.ru_slug,
et.ar_slug,
et.de_slug,
et.fr_slug,
et.cin_slug,
    tr_baslik, tr_icerik,
    en_baslik, en_icerik,
    ru_baslik, ru_icerik,
    ar_baslik, ar_icerik,
    fr_baslik, fr_icerik,
    de_baslik, de_icerik,
    cin_baslik, cin_icerik,
    et.kayit_tarihi,
    eskayit
    FROM   icerik et  where kategori in (42,43) and durum!='-1'   order by et.id desc ";
    $hztb = sorgu($hzt, $baglan);
    $hztb->execute(); 
} 

// 2. Output HTML Header (ust.php)
include("ust.php");

// 3. Render Content
if ($show_detail) {
    // --- DETAIL VIEW ---
    ?>
    <div class="page-content">
		<!--section-->
		<div class="section mt-0">
			<div class="breadcrumbs-wrap">
				<div class="container">
					<div class="breadcrumbs">
						<a href="index.php"><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "ANA SAYFA";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "HOME PAGE";}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "ГЛАВНАЯ СТРАНИЦА";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "الصفحة الرئيسية";}
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "STARTSEITE";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "PAGE D'ACCUEIL";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo "主页";}?></a>
					 
						<span>Detay</span>
					</div>
				</div>
			</div>
		</div>
		<!--//section--> 
		<div class="section page-content-first">
			<div class="container mt-6">
				<div class="row">
					<div class="col-md">
						<ul class="services-nav flex-column flex-nowrap">
							<li class="nav-item">
								<a class="nav-link" href="#submenu1" data-toggle="collapse" data-target="#submenu1">Hizmetler</a>
								<div class="collapse show" id="submenu1">
									<ul class="flex-column nav">
                                        
                                        <?php while ($hztl =veriliste($hztb)) { ?> 
										<li><a href="<?php echo get_content_url($hztl, isset($_GET['LN']) ? $_GET['LN']:'TR'); ?>"><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo $hztl['tr_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo $hztl['en_baslik'];}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo $hztl['ru_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo $hztl['ar_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo $hztl['de_baslik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo $hztl['fr_baslik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo $hztl['cin_baslik'];}?></a></li>
										<?php } ?>
									</ul>
								</div>
							</li>
							 
						</ul>
						<div class="row d-flex flex-column flex-sm-row flex-md-column mt-3">
							<div class="col-auto col-sm col-md-auto">
								<div class="contact-box contact-box-1">
									<h5 class="contact-box-title"><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "Çalışma Saatleri";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "Working hours";}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "Рабочие часы";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "ساعات العمل";}
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "Arbeitszeit";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "Heures d'ouverture";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo "工作时间";}?></h5>
									<ul class="icn-list">
                                        
                              
										<li><i class="icon-clock"></i>Pzt-Cum 08:00 - 18:00
											<br>Cumartesi 09:00 - 16:00
											<br>Pazar Kapalı</li>
									</ul>
								</div>
							</div>
							<div class="col-auto col-sm col-md-auto">
								<div class="contact-box contact-box-2">
									<h5 class="contact-box-title"><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "İletişim";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "Contact";}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "Коммуникация";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "تواصل";}
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "Kontakt";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "la communication";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo "联系";}?></h5>
									<ul class="icn-list">
										<li><i class="icon-telephone"></i>
											<div class="d-flex flex-wrap">
												<span><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "Telefon";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "Telephone";}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "телефон";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "هاتف";}
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "Telefon";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "Téléphone";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo "电话";}?>:&nbsp;&nbsp;</span>
												<span dir="ltr"><?php echo $ayarlarl['telefon']; ?></span></div>
										</li>
										<li><i class="icon-black-envelope"></i><a href="mailto:<?php echo $ayarlarl['mail']; ?>"><?php echo $ayarlarl['mail']; ?></a></li>
									</ul>
								</div>
							</div>
						</div>
						<div class="question-box mt-3">
							<h5 class="question-box-title">Bize Sorun</h5>
							<form id="questionForm" method="post" novalidate>
								<div class="successform">
									<p>Mesajınız Alındı!</p>
								</div>
								<div class="errorform">
									<p>Birşeyler ters gitti. Lütfen bizi arayınız.</p>
								</div>
								<input type="text" class="form-control" name="ad" placeholder="<?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "İsim";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "Name";}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "Имя";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "اسم";}
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "Name";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "Nom";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo "姓名";}?>*">
								<input type="text" class="form-control" name="mail" placeholder="<?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "Mail";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "Mail";}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "Эл. почта";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "البريد الإلكتروني";}
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "e-mail";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "e-mail";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo "邮件";}?>*">
								<input type="text" class="form-control" name="telefon" placeholder="<?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "Telefon";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "Telephone";}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "телефон";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "هاتف";}
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "Telefon";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "Téléphone";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo "电话";}?>">
								<textarea class="form-control" name="mesaj" placeholder="<?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "Mesaj";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "Message";}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "Сообщение";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "رسالة";}
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "Nachricht";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "Un message";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo "信息";}?>*"></textarea>
								<button type="submit" class="btn btn-sm btn-hover-fill mt-15"><i class="icon-right-arrow"></i><span><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "Gönder";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "Send";}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "послать";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "يرسل";}
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "Senden";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "Envoyer";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo "发送";}?></span><i class="icon-right-arrow"></i></button>
							</form>
						</div>
					</div>
					<div class="col-md-8 col-lg-9 mt-4 mt-md-0">
						<div class="title-wrap">
							<h1><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo $hzyl['tr_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo $hzyl['en_baslik'];}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo $hzyl['ru_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo $hzyl['ar_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo $hzyl['de_baslik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo $hzyl['fr_baslik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo $hzyl['cin_baslik'];}?></h1></div>
						<div class="service-img">
							<img src="yonetim/dosya/<?php echo $hzyl['belge']; ?>" class="img-fluid" alt="">
						</div>
						<div class="pt-2 pt-md-4">
						 <p><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo $hzyl['tr_icerik']; $detay_text = $hzyl['tr_detay']; $btn_text="Detaylı Bilgi";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo $hzyl['en_icerik']; $detay_text = $hzyl['en_detay']; $btn_text="Detailed Information";}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo $hzyl['ru_icerik']; $detay_text = $hzyl['ru_detay']; $btn_text="Подробная информация";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo $hzyl['ar_icerik']; $detay_text = $hzyl['ar_detay']; $btn_text="معلومات مفصلة";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo $hzyl['de_icerik']; $detay_text = $hzyl['de_detay']; $btn_text="Detaillierte Informationen";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo $hzyl['fr_icerik']; $detay_text = $hzyl['fr_detay']; $btn_text="Informations détaillées";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo $hzyl['cin_icerik']; $detay_text = $hzyl['cin_detay']; $btn_text="详细信息";}?></p>
							 
                             <?php if (!empty($detay_text)): ?>
                                <div class="text-center mt-3 mb-3">
                                    <button class="btn btn-md btn-hover-fill" onclick="document.getElementById('detay_content').style.display = (document.getElementById('detay_content').style.display === 'none' ? 'block' : 'none');">
                                        <span><?php echo $btn_text; ?></span>
                                    </button>
                                </div>
                                <div id="detay_content" style="display:none;">
                                    <?php echo $detay_text; ?>
                                </div>
                             <?php endif; ?>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!--//section-->
	</div>
    <?php 
} elseif (isset($_GET['LN']) && $_GET['LN'] == 'AR') {
    // --- ARABIC INFO VIEW ---
    echo "<div class='section mt-0'><div class='section'>
			<div class='container-fluid px-0'>
				<div class='title-wrap text-center'><h1>PROF. DR. GÖKÇE ÖZEL</h1><br><br><br><p>أنا خريج كلية الطب الإنجليزية في جامعة إسطنبول - جراح باشا. أكملت تدريبي التخصصي في عيادة الأنف والأذن والحنجرة في مستشفى ديشكابي يلديريم بايزيد للتعليم والبحث.<br><br>

 عملت كعضو هيئة تدريس في قسم الأنف والأذن والحنجرة بكلية الطب بجامعة كيريكالي بين عامي 2013-2021. أصبحت أستاذًا مساعدًا في عام 2015 وأستاذًا في عام 2021.<br><br>

 أنا عضو في مجلس إدارة جمعية جراحة الوجه التجميلية التركية وجمعية جراحة الوجه التجميلية الأوروبية. أنا في المجلس الاستشاري الدولي لجمعية التعاون في الجماليات الطبية (CMAC). لدي أكثر من 100 مقال منشور في المجلات الوطنية والدولية ومؤشر H الخاص بي هو 12.<br><br>

 في ممارسته المهنية، يقدم الخدمات لمرضاه في جميع مجالات تخصص الأنف والأذن والحنجرة. <br><br><br><br></p></div></div></div></div>";
} else {
    // --- DEFAULT TR/EN/ETC INFO VIEW ---
    echo "<div class='section mt-0'><div class='section'>
			<div class='container-fluid px-0'>
				<div class='title-wrap text-center'><h1>PROF. DR. GÖKÇE ÖZEL</h1><br><br><br><p>İstanbul Üniversitesi Cerrahpaşa İngilizce Tıp Fakültesi Mezunuyum. Dışkapı Yıldırım Beyazıt Eğitim ve Araştırma Hastanesi Kulak Burun Boğaz Kliniğinde Uzmanlık Eğitimimi Tamamladım.<br><br>

2013-2021 yılları arasında Kırıkkale Üniversitesi Tıp Fakültesi Kulak Burun Boğaz Anabilim Dalında Öğretim Üyesi olarak çalıştım. 2015 Yılında Doçent, 2021 yılında Profesör oldum oldum.
<br><br>
Türkiye Yüz Plastik Cerrahi Derneği Yönetim Kurulu ve Avrupa Fasiyal Plastik Cerrahi Derneği üyesiyim. Complications in Medical Aesthetic Collaborative (CMAC) derneği uluslararası danışma kurulundayım. Ulusal ve uluslararası dergilerde yayınlanmış 100'ün üzerinde makalem mevcut olup H indeksim 12'dir.
<br><br>
Mesleki pratiginde kulak burun bogaz bransinin her alaninda hastalarina hizmet vermektedir. <br><br><br><br></p></div></div></div></div>";
}

include("alt.php");
?>