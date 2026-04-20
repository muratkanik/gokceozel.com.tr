<?php
header('Content-Type: text/html; charset=utf-8');
mb_internal_encoding('UTF-8');

include_once("baglanti/baglantilar_fonksiyonlar.php");
include_once("baglanti/url_helpers.php");

// 1. Pre-fetch Content (supports both slug and old detay parameter)
$hzyl = null;
$content = null;

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
        $slug_col = $lang_prefix . '_slug';
        $hzy = "SELECT et.id, eskayit,
        tr_baslik, tr_icerik, tr_detay, tr_seo_title, tr_seo_description, tr_slug,
        en_baslik, en_icerik, en_detay, en_seo_title, en_seo_description, en_slug,
        ru_baslik, ru_icerik, ru_detay, ru_seo_title, ru_seo_description, ru_slug,
        ar_baslik, ar_icerik, ar_detay, ar_seo_title, ar_seo_description, ar_slug,
        fr_baslik, fr_icerik, fr_detay, fr_seo_title, fr_seo_description, fr_slug,
        de_baslik, de_icerik, de_detay, de_seo_title, de_seo_description, de_slug,
        cin_baslik, cin_icerik, cin_detay, cin_seo_title, cin_seo_description, cin_slug,
        et.kayit_tarihi, et.kategori,
        (SELECT eb.belge FROM icerik_belge eb WHERE et.eskayit=eb.kayit_id AND eb.durum!='-1' ORDER BY eb.id DESC LIMIT 0,1) belge
        FROM icerik et WHERE durum='1' AND $slug_col = :slug ORDER BY et.id DESC LIMIT 0,1";

        $hzyb = sorgu($hzy, $baglan);
        $hzyb->bindValue(':slug', $slug, PDO::PARAM_STR);
    } else {
        $hzy = "SELECT et.id, eskayit,
        tr_baslik, tr_icerik, tr_detay, tr_seo_title, tr_seo_description, tr_slug,
        en_baslik, en_icerik, en_detay, en_seo_title, en_seo_description, en_slug,
        ru_baslik, ru_icerik, ru_detay, ru_seo_title, ru_seo_description, ru_slug,
        ar_baslik, ar_icerik, ar_detay, ar_seo_title, ar_seo_description, ar_slug,
        fr_baslik, fr_icerik, fr_detay, fr_seo_title, fr_seo_description, fr_slug,
        de_baslik, de_icerik, de_detay, de_seo_title, de_seo_description, de_slug,
        cin_baslik, cin_icerik, cin_detay, cin_seo_title, cin_seo_description, cin_slug,
        et.kayit_tarihi, et.kategori,
        (SELECT eb.belge FROM icerik_belge eb WHERE et.eskayit=eb.kayit_id AND eb.durum!='-1' ORDER BY eb.id DESC LIMIT 0,1) belge
        FROM icerik et WHERE durum='1' AND et.eskayit=:detaym ORDER BY et.id DESC LIMIT 0,1";

        $hzyb = sorgu($hzy, $baglan);
        $hzyb->bindValue(':detaym', $detay_id, PDO::PARAM_STR);
    }

    $hzyb->execute();
    $hzyl = veriliste($hzyb);
    $content = $hzyl;

    // Redirect to 404 if not found
    if (!$hzyl) {
        header("HTTP/1.0 404 Not Found");
        include('404.php');
        exit;
    }

    // Set SEO variables
    if ($hzyl) {
        if (isset($hzyl[$lang_prefix . '_seo_title']) && !empty($hzyl[$lang_prefix . '_seo_title'])) {
            $page_seo_title = $hzyl[$lang_prefix . '_seo_title'];
        } else {
            $page_seo_title = $hzyl[$lang_prefix . '_baslik'];
        }

        if (isset($hzyl[$lang_prefix . '_seo_description']) && !empty($hzyl[$lang_prefix . '_seo_description'])) {
            $page_seo_description = $hzyl[$lang_prefix . '_seo_description'];
        }
    }
}

define('HIDE_SLIDER', true);
include("ust.php");

if ((empty($_GET['LN']) || $_GET['LN']=== 'TR') && !isset($_GET['detay'])) {  
 
    echo "<div class='section mt-0'><div class='section'>
			<div class='container-fluid px-0'>
				<div class='title-wrap text-center'><h1>PROF. DR. GÖKÇE ÖZEL</h1><br><br><br><p>İstanbul Üniversitesi Cerrahpaşa İngilizce Tıp Fakültesi Mezunuyum. Dışkapı Yıldırım Beyazıt Eğitim ve Araştırma Hastanesi Kulak Burun Boğaz Kliniğinde Uzmanlık Eğitimimi Tamamladım.<br><br>

2013-2021 yılları arasında Kırıkkale Üniversitesi Tıp Fakültesi Kulak Burun Boğaz Anabilim Dalında Öğretim Üyesi olarak çalıştım. 2015 Yılında Doçent, 2021 yılında Profesör oldum oldum.
<br><br>
Türkiye Yüz Plastik Cerrahi Derneği Yönetim Kurulu ve Avrupa Fasiyal Plastik Cerrahi Derneği üyesiyim. Complications in Medical Aesthetic Collaborative (CMAC) derneği uluslararası danışma kurulundayım. Ulusal ve uluslararası dergilerde yayınlanmış 100'ün üzerinde makalem mevcut olup H indeksim 12'dir.
<br><br>
Mesleki pratiginde kulak burun bogaz bransinin her alaninda hastalarina hizmet vermektedir. <br><br><br><br></p></div></div></div></div>";
} elseif (isset($_GET['LN']) && $_GET['LN'] == 'AR' && !isset($_GET['detay'])) {
    echo "<div class='section mt-0'><div class='section'>
			<div class='container-fluid px-0'>
				<div class='title-wrap text-center'><h1>PROF. DR. GÖKÇE ÖZEL</h1><br><br><br><p>أنا خريج كلية الطب الإنجليزية في جامعة إسطنبول - جراح باشا. أكملت تدريبي التخصصي في عيادة الأنف والأذن والحنجرة في مستشفى ديشكابي يلديريم بايزيد للتعليم والبحث.<br><br>

عملت كعضو هيئة تدريس في قسم الأنف والأذن والحنجرة بكلية الطب بجامعة كيريكالي بين عامي 2013-2021. أصبحت أستاذًا مساعدًا في عام 2015 وأستاذًا في عام 2021.<br><br>

أنا عضو في مجلس إدارة جمعية جراحة الوجه التجميلية التركية وجمعية جراحة الوجه التجميلية الأوروبية. أنا في المجلس الاستشاري الدولي لجمعية التعاون في الجماليات الطبية (CMAC). لدي أكثر من 100 مقال منشور في المجلات الوطنية والدولية ومؤشر H الخاص بي هو 12.<br><br>

في ممارسته المهنية، يقدم الخدمات لمرضاه في جميع مجالات تخصص الأنف والأذن والحنجرة. <br><br><br><br></p></div></div></div></div>";
} elseif (isset($_GET['LN']) && $_GET['LN'] == 'CIN' && !isset($_GET['detay'])) {
    echo "<div class='section mt-0'><div class='section'>
			<div class='container-fluid px-0'>
				<div class='title-wrap text-center'><h1>PROF. DR. GÖKÇE ÖZEL</h1><br><br><br><p>我毕业于伊斯坦布尔大学塞拉帕萨英语医学院。我在 Dışkapı Yıldırım Beyazıt 培训和研究医院耳鼻喉科诊所完成了专业培训。<br><br>

2013 年至 2021 年间，我在 Kırıkkale 大学医学院耳鼻喉科担任教员。2015年成为副教授，2021年成为教授。<br><br>

我是土耳其面部整形外科学会董事会成员和欧洲面部整形外科学会成员。我是医学美学合作并发症 (CMAC) 协会国际顾问委员会的成员。我在国内和国际期刊上发表了 100 多篇文章，也就是我的 H 指数是 12。<br><br>

在他的专业实践中，他为耳鼻喉科各个领域的患者提供服务。 <br><br><br><br></p></div></div></div></div>";
} else { ?>
    <?php
setlocale(LC_TIME,'turkish');

// Content already fetched above ($hzyl)
                                     
?>
	<!--//header-->
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
                                   <a href="blog.php?LN=<?php echo isset($_GET['LN']) ? $_GET['LN']:'';?>"><?php 
                                   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "Blog";} 
                                   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "Blog";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "Блог";} 
                                   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "مقالات";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "Blog";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "Blog";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo "博客";}?></a>
						<span><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo $hzyl['tr_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo $hzyl['en_baslik'];}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo $hzyl['ru_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo $hzyl['ar_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo $hzyl['de_baslik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo $hzyl['fr_baslik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo $hzyl['cin_baslik'];}?></span>
					</div>
				</div>
			</div>
		</div>
		<!--//section-->
		<!--section-->
		<div class="section page-content-first">
			<div class="container">
				<div class="row">
					<div class="col-md-8 col-lg-9">
						<div class="blog-post blog-post-single">
							<div class="blog-post-info">
                            <div class="post-date"><?php 
							$tarih = strtotime($hzyl['kayit_tarihi']);
							$ay_numarasi = (int)date('n', $tarih);
							$turkce_aylar = array(1 => 'Ocak', 2 => 'Şubat', 3 => 'Mart', 4 => 'Nisan', 5 => 'Mayıs', 6 => 'Haziran', 7 => 'Temmuz', 8 => 'Ağustos', 9 => 'Eylül', 10 => 'Ekim', 11 => 'Kasım', 12 => 'Aralık');
							echo date('d', $tarih); ?><span><?php echo isset($turkce_aylar[$ay_numarasi]) ? $turkce_aylar[$ay_numarasi] : date('F', $tarih); ?></span></div>
									
								<div>
									<h2 class="post-title"><a href="blog-post-page.html"><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo $hzyl['tr_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo $hzyl['en_baslik'];}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo $hzyl['ru_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo $hzyl['ar_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo $hzyl['de_baslik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo $hzyl['fr_baslik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo $hzyl['cin_baslik'];}?></a></h2>
									<div class="post-meta">
                                    <div class="post-meta-author">Prof. Dr.  Gökçe Özel </div>
										<div class="post-meta-social">
                                        <a href="<?php echo $ayarlarl['facebook']; ?>"  target="blank" ><i style="font-size:15px; " class="icofont-facebook"></i></a>
							<a href="<?php echo $ayarlarl['twitter']; ?>"  target="blank" ><i style="font-size:15px; " class="icofont-twitter"></i></a>
							<a href="<?php echo $ayarlarl['instagram']; ?>"  target="blank" ><i style="font-size:15px; " class="icofont-instagram"></i></a>
							<a href="<?php echo $ayarlarl['youtube']; ?>"  target="blank"><i style="font-size:15px; " class="icofont-youtube"></i></a>
							<a href="<?php echo $ayarlarl['linkedin']; ?>"  target="blank" ><i style="font-size:15px; "  class="icofont-linkedin"></i></a>
										</div>
									</div>
								</div>
							</div>
							<div class="post-image">
								<img src="yonetim/dosya/<?php echo $hzyl['belge']; ?>" alt="Gökçe Özel">
							</div>
							<div class="post-text">
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
					<div class="col-md-4 col-lg-3 mt-4 mt-md-0">
						 
						<div class="side-block">
							<ul class="categories-list">
<?php $blogkat = "SELECT  et.id,
tr_baslik,
en_baslik,
ru_baslik,
ar_baslik,
fr_baslik,
de_baslik,
cin_baslik,
et.eskayit
FROM   icerik et  where   durum='1' and et.kategori IN (42, 43, 52)  order by et.id DESC limit 30";
$blogkatb = sorgu($blogkat, $baglan);
$blogkatb->execute();                                    
 
while ($blogkatl =veriliste($blogkatb)) {
?>
								<li><a href="blogdetay.php?detay=<?php echo $blogkatl['eskayit']; ?>&LN=<?php echo isset($_GET['LN']) ? $_GET['LN']:'';?>"><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo $blogkatl['tr_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo $blogkatl['en_baslik'];}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo $blogkatl['ru_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo $blogkatl['ar_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo $blogkatl['de_baslik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo $blogkatl['fr_baslik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo $blogkatl['cin_baslik'];}?></a></li>
<?php } ?>
							</ul>
						</div>
					 
					</div>
				</div>
			</div>
		</div>
		<!--//section-->
	</div>

<?php } ?>
    <?php include("alt.php");?>