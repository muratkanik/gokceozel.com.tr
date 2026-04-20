<?php 
header('Content-Type: text/html; charset=utf-8');
mb_internal_encoding('UTF-8');
include("baglanti/baglantilar_fonksiyonlar.php");

// Fetch content early for SEO
$hk = "SELECT  et.id,
tr_baslik, tr_icerik,
en_baslik, en_icerik,
ru_baslik, ru_icerik,
ar_baslik, ar_icerik,
fr_baslik, fr_icerik,
de_baslik, de_icerik,
cin_baslik, cin_icerik,
et.kayit_tarihi,
et.eskayit 
FROM   icerik et  where kategori='2' and durum!='-1'   order by et.id desc limit 0,1";
$hkb = sorgu($hk, $baglan);
$hkb->execute(); 
$hkl =veriliste($hkb);

// Determine valid language code
$valid_langs = ['TR', 'EN', 'RU', 'AR', 'DE', 'FR', 'CIN'];
$lang_code = isset($_GET['LN']) && in_array($_GET['LN'], $valid_langs) ? $_GET['LN'] : 'TR';
$lang_prefix = strtolower($lang_code);

// Set Dynamic SEO Variables
$page_seo_title = !empty($hkl[$lang_prefix.'_seo_title']) ? $hkl[$lang_prefix.'_seo_title'] : $hkl[$lang_prefix.'_baslik'];
$page_seo_description = !empty($hkl[$lang_prefix.'_seo_description']) ? $hkl[$lang_prefix.'_seo_description'] : '';

include("ust.php");
/* DEBUG
if (isset($_GET['LN']) && $_GET['LN']=='RU') {
    echo "<!-- DEBUG: Hex of title: " . bin2hex($hkl['ru_baslik']) . " -->";
}
*/
?>
	<div class="page-content">
	
        
        

        
		<?php
$hk = "SELECT  et.id,
tr_baslik,
tr_icerik,
en_baslik,
en_icerik,
ru_baslik,
ru_icerik,
ar_baslik,
ar_icerik,
fr_baslik,
fr_icerik,
de_baslik,
de_icerik,
cin_baslik,
cin_icerik,
et.kayit_tarihi,
et.eskayit 
FROM   icerik et  where kategori='2' and durum!='-1'   order by et.id desc limit 0,1";
$hkb = sorgu($hk, $baglan);
$hkb->execute(); 
$hkl =veriliste($hkb)        
                                    
?> 
		<!--section-->
		<div class="section page-content-first">
			<div class="container">
				<div class="text-center mb-2  mb-md-3 mb-lg-4">
					<div class="h-sub theme-color"><?php echo $ayarlarl['siteadi']; ?></div>
					<h1><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo $hkl['tr_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo $hkl['en_baslik'];}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo $hkl['ru_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo $hkl['ar_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo $hkl['de_baslik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo $hkl['fr_baslik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo $hkl['cin_baslik'];}?></h1>
					<div class="h-decor"></div>
				</div>
			</div>
			<div class="container">
				<div class="row">

<?php  $belge = "SELECT  belge, ROW_NUMBER() OVER(ORDER BY belge) AS sira  FROM   icerik_belge   where  '".$hkl['eskayit']."'=kayit_id and durum='1' limit 0,1";
$belgeb = sorgu($belge, $baglan);
$belgeb->execute(); 
while ($belgel =veriliste($belgeb)) {

?>


					<div class="col-lg-6 text-center text-lg-left pr-md-4">
						<?php if ($belgel['sira']==1) {?>
						<div class="text-center">
							<a href="yonetim/dosya/<?php echo $belgel['belge']; ?>" data-lightbox="homepage-intro" data-title="Prof. Dr. Gökçe Özel">
								<img src="yonetim/dosya/<?php echo $belgel['belge']; ?>" style="border-radius: 10px; max-width: 70%; margin: 0 auto; box-shadow: 0 5px 15px rgba(0,0,0,0.15); transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'" alt="">
							</a>
						</div>
						<?php } ?>
					</div>
					<?php } ?>
					<div class="col-lg-6 mt-3 mt-lg-0">
						<?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo $hkl['tr_icerik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo $hkl['en_icerik'];}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo $hkl['ru_icerik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo $hkl['ar_icerik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo $hkl['de_icerik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo $hkl['fr_icerik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo $hkl['cin_icerik'];}?>
						 </div>
				</div>
			</div>
		</div>
		<!--//section-->
        
        <!--Slider removed (moved to global header)-->

        
       
		 
	 
        	<?php
$stb = "SELECT  et.id,
tr_baslik,
tr_icerik,
en_baslik,
en_icerik,
ru_baslik,
ru_icerik,
ar_baslik,
ar_icerik,
fr_baslik,
fr_icerik,
de_baslik,
de_icerik,
cin_baslik,
cin_icerik,
et.kayit_tarihi,
et.eskayit,
(select eb.belge from icerik_belge eb where et.eskayit=eb.kayit_id AND  eb.durum!='-1' ORDER BY eb.id DESC LIMIT 0,1) belge  
FROM   icerik et  where kategori='54' and durum='1'   order by et.id desc limit 0,1 ";
$stbb = sorgu($stb, $baglan);
$stbb->execute();
$stbl = veriliste($stbb);
// Fix for missing content warning
if (!$stbl) {
    $stbl = []; // Initialize as empty array to avoid warnings, though further checks are needed below
}                                    
?>
<?php if ($stbl): ?>
		<!--section-->
		<div class="section bg-grey py-0">
			<div class="container-fluid px-0">
				<div class="row no-gutters flex-wrap flex-md-nowrap">
					<!-- Centered Certificate Section -->
					<div class="col-12 text-center py-4">
						<div class="title-wrap text-center mb-3">
							<h2 class="h1"><span class="theme-color"><?php
							   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo $stbl['tr_baslik'];}
							   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo $stbl['en_baslik'];}
							   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo $stbl['ru_baslik'];}
							   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo $stbl['ar_baslik'];}
							   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo $stbl['de_baslik'];}
							   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo $stbl['fr_baslik'];}
							   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo $stbl['cin_baslik'];}
							?></span></h2>
						</div>
						
						<a data-fancybox="gallery" href="yonetim/dosya/<?php echo $stbl['belge']; ?>" style="display: inline-block; cursor: zoom-in;">
							<img src="yonetim/dosya/<?php echo $stbl['belge']; ?>" alt="Yetki Belgesi" style="max-height: 400px; width: auto; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
						</a>
						
						<div class="mt-4 mx-auto" style="max-width: 800px;">
							<?php
							   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo $stbl['tr_icerik'];}
							   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo $stbl['en_icerik'];}
							   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo $stbl['ru_icerik'];}
							   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo $stbl['ar_icerik'];}
							   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo $stbl['de_icerik'];}
							   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo $stbl['fr_icerik'];}
							   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo $stbl['cin_icerik'];}
							?>
						</div>
					</div>				</div>
					</div>

				</div>
			</div>
		</div>
<?php endif; ?>
         
		<?php if ($lang_code !== 'TR'): ?>
		<!--section services-->
		<div class="section">
			<div class="container-fluid px-0">
				<div class="title-wrap text-center">
					<h2 class="h1"><?php echo metin('header_hizmetler'); ?></h2>
					<div class="h-decor"></div>
				</div>
				<div class="row no-gutters services-box-wrap services-box-wrap-desktop">
					<div class="col-4 order-1">
						<div class="service-box-rotator js-service-box-rotator">
							 
							<div class="service-box service-box-greybg service-box--hiddenbtn">
								<div class="service-box-caption text-center">
									<div class="service-box-icon"><i class="icon-injecting"></i></div>
									<div class="service-box-icon-bg"><i class="icon-injecting"></i></div>
									<h3 class="service-box-title"><?php echo metin('service_medical_aesthetic'); ?></h3>
									<p><?php echo metin('service_medical_aesthetic_desc'); ?></p>
									<div class="btn-wrap"><a href="<?php echo get_menu_link('hizmetler.php', isset($_GET['LN']) ? $_GET['LN']:'TR'); ?>" class="btn"><i class="icon-right-arrow"></i><span><?php echo metin('btn_hizmetler'); ?></span><i class="icon-right-arrow"></i></a></div>
								</div>
							</div>
						</div>
					</div>
					<div class="col-8 order-2">
						<div class="service-box">
							<div class="service-box-image" data-bg="images/content/service-02.jpg"></div>
							<div class="service-box-caption text-center w-50 ml-auto">
								<h3 class="service-box-title"><?php echo metin('service_facial_procedures'); ?></h3>
								<p><?php echo metin('service_facial_procedures_desc'); ?>.</p>
								<div class="btn-wrap"><a href="<?php echo get_menu_link('hizmetler.php', isset($_GET['LN']) ? $_GET['LN']:'TR'); ?>" class="btn"><i class="icon-right-arrow"></i><span><?php echo metin('btn_hizmetler'); ?></span><i class="icon-right-arrow"></i></a></div>
							</div>
						</div>
					</div>
					<div class="col-8 order-3 order-lg-4 order-xl-3">
						<div class="service-box">
							<div class="service-box-image" data-bg="images/drgo_21.jpg"></div>
							<div class="service-box-caption text-center w-50 ml-auto">
								<h3 class="service-box-title"><?php echo metin('service_filling_applications'); ?></h3>
								<p><?php echo metin('service_filling_applications_desc'); ?>. </p>
								<div class="btn-wrap"><a href="<?php echo get_menu_link('hizmetler.php', isset($_GET['LN']) ? $_GET['LN']:'TR'); ?>" class="btn"><i class="icon-right-arrow"></i><span><?php echo metin('btn_hizmetler'); ?></span><i class="icon-right-arrow"></i></a></div>
							</div>
						</div>
					</div>
					<div class="col-4 order-5">
						<div class="service-box">
							<div class="service-box-image" data-bg="images/botillinhum.png"></div>
							<div class="service-box-caption text-center w-50 ml-auto">
							<h3 class="service-box-title"><?php echo metin('service_facial_aesthetics'); ?></h3>
									<p><?php echo metin('service_facial_aesthetics_desc'); ?>.</p>
									<div class="btn-wrap"><a href="<?php echo get_menu_link('hizmetler.php', isset($_GET['LN']) ? $_GET['LN']:'TR'); ?>" class="btn"><i class="icon-right-arrow"></i><span><?php echo metin('btn_hizmetler'); ?></span><i class="icon-right-arrow"></i></a>
									</div>
								</div>
							</div>
						 
						</div>
					</div>
				</div>
				<div class="row no-gutters services-box-wrap services-box-wrap-mobile">
					<div class="service-box-rotator js-service-box-rotator">
						 
						<div class="service-box service-box-greybg service-box--hiddenbtn">
							<div class="service-box-caption text-center">
								<div class="service-box-icon"><i class="icon-injecting"></i></div>
								<div class="service-box-icon-bg"><i class="icon-injecting"></i></div>
								<h3 class="service-box-title"><?php echo metin('service_non_surgical'); ?></h3>
								<p><?php echo metin('service_non_surgical_desc'); ?>.</p>
								<div class="btn-wrap"><a href="<?php echo get_menu_link('hizmetler.php', isset($_GET['LN']) ? $_GET['LN']:'TR'); ?>" class="btn"><i class="icon-right-arrow"></i><span><?php echo metin('btn_hizmetler'); ?></span><i class="icon-right-arrow"></i></a></div>
							</div>
						</div>
						 
						<div class="service-box service-box-greybg service-box--hiddenbtn">
							<div class="service-box-caption text-center">
								<div class="service-box-icon"><i class="icon-mommy"></i></div>
								<div class="service-box-icon-bg"><i class="icon-mommy"></i></div>
								<h3 class="service-box-title"><?php echo metin('service_filling'); ?></h3>
								<p><?php echo metin('service_filling_desc'); ?>.</p>
								<div class="btn-wrap"><a href="<?php echo get_menu_link('hizmetler.php', isset($_GET['LN']) ? $_GET['LN']:'TR'); ?>" class="btn"><i class="icon-right-arrow"></i><span><?php echo metin('btn_hizmetler'); ?></span><i class="icon-right-arrow"></i></a></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!--//section services-->
		<?php endif; ?>
 
        
		<?php if ($lang_code !== 'TR'): ?>
        	<?php
$hzyiki = "SELECT  et.id,
tr_baslik,
tr_icerik,
en_baslik,
en_icerik,
ru_baslik,
ru_icerik,
ar_baslik,
ar_icerik,
fr_baslik,
fr_icerik,
de_baslik,
de_icerik,
cin_baslik,
cin_icerik,
et.kayit_tarihi,
et.eskayit,
(select eb.belge from icerik_belge eb where et.eskayit=eb.kayit_id AND  eb.durum!='-1' ORDER BY eb.id DESC LIMIT 0,1) belge  
FROM   icerik et  where kategori='40' and durum='1'   order by et.id desc limit 0,1 ";
$hzyikib = sorgu($hzyiki, $baglan);
$hzyikib->execute();                                    
$hzyikil =veriliste($hzyikib);                                    
?>
		<!--section-->
		<div class="section bg-grey py-0">
			<div class="container-fluid px-0">
				<div class="row no-gutters flex-wrap flex-md-nowrap">
					<div class="col-md-7 col-lg-6">
						<div class="services-wrap1 float-right">
							<div class="service-tab-banner d-md-none">
								<img src="yonetim/dosya/<?php echo $hzyikil['belge']; ?>" alt="">
							</div>
							<div class="title-wrap text-center text-sm-left mt-2 mt-md-0">
								<h2 class="h1">  <span class="theme-color"><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo $hzyikil['tr_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo $hzyikil['en_baslik'];}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo $hzyikil['ru_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo $hzyikil['ar_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo $hzyikil['de_baslik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo $hzyikil['fr_baslik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo $hzyikil['cin_baslik'];}?></span></h2>
							</div>
						 
							<div class="row">
								<div class="col-sm-12">
									<?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo $hzyikil['tr_icerik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo $hzyikil['en_icerik'];}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo $hzyikil['ru_icerik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo $hzyikil['ar_icerik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo $hzyikil['de_icerik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo $hzyikil['fr_icerik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo $hzyikil['cin_icerik'];}?>
								</div>
							</div>
						</div>
					</div>
					<div class="col-md-5 col-lg-6 service-tab-banner-alt d-none d-md-block align-items-center bg-cover bg-left" data-bg="yonetim/dosya/<?php echo $hzyikil['belge']; ?>">
					</div>
				</div>
			</div>
		</div>
		<!--//section-->
		<?php endif; ?>
		 
        
        	<?php
$sss = "SELECT  et.id,
tr_baslik,
tr_icerik,
en_baslik,
en_icerik,
ru_baslik,
ru_icerik,
ar_baslik,
ar_icerik,
fr_baslik,
fr_icerik,
de_baslik,
de_icerik,
cin_baslik,
cin_icerik,
et.kayit_tarihi,
et.eskayit,
ROW_NUMBER() OVER(ORDER BY id  ) AS sira, 
(select eb.belge from icerik_belge eb where et.eskayit=eb.kayit_id AND  eb.durum!='-1' ORDER BY eb.id DESC LIMIT 0,1) belge  
FROM   icerik et  where kategori='46' and durum='1'   order by et.id   limit 0,4 ";
$bsssb = sorgu($sss, $baglan);
$bsssb->execute();                                    
$bsssl =veriliste($bsssb)                               
?>
		<?php if ($active_lang_code !== 'TR'): ?>
		<!--section faq-->
		<div class="section bg-grey py-0">
			<div class="container-fluid px-0">
				<div class="row no-gutters">
					<div class="col-xl-6 banner-left bg-cover align-items-end" style="background-image: url(yonetim/dosya/<?php echo $bsssl['belge']; ?>)"></div>
					<div class="col-xl-6">
						<div class="faq-wrap">
							<div class="text-center text-md-left">
								<div class="title-wrap">
									<h2 class="h1"><?php echo metin('sss_bilgi'); ?> <span class="theme-color"><?php echo metin('sss_faq'); ?></span></h2>
								</div>
							</div>
							<div id="faqAccordion1" class="faq-accordion mt-2 mt-lg-3" data-children=".faq-item">
                                
                                <?php
                                $sssb = sorgu($sss, $baglan);
                                $sssb->execute(); 
                                while ($sssl =veriliste($sssb)) {?>
								<div class="faq-item">
									<a data-toggle="collapse" data-parent="#faqAccordion1" href="#faqItem<?php echo $sssl['sira'];?>" aria-expanded="false" class="collapsed"><span><?php echo $sssl['sira'];?>.</span><span><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo $sssl['tr_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo $sssl['en_baslik'];}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo $sssl['ru_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo $sssl['ar_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo $sssl['de_baslik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo $sssl['fr_baslik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo $sssl['cin_baslik'];}?></span></a>
									<div id="faqItem<?php echo $sssl['sira'];?>" class="collapse   faq-item-content" role="tabpanel">
										<div>
											<p><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo $sssl['tr_icerik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo $sssl['en_icerik'];}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo $sssl['ru_icerik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo $sssl['ar_icerik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo $sssl['de_icerik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo $sssl['fr_icerik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo $sssl['cin_icerik'];}?></p>
										</div>
									</div>
								</div>
                                <?php } ?>
							</div>
							</div>
							<a href="iletisim.php?LN=<?php echo isset($_GET['LN']) ? $_GET['LN']:'';?>" class="btn mt-3" ><i class="icon-right-arrow"></i><span><?php echo metin('btn_ask_question'); ?></span><i class="icon-right-arrow"></i></a>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!--//section faq-->
		 
		 <br><br>
		<!--section blog posts -->
		<div class="section">
			<div class="container">
				<div class="title-wrap text-center">
					<h2 class="h1"><?php echo metin('section_neler_yapiyoruz'); ?></h2>
					<div class="h-decor"></div>
				</div>
				<div class="blog-grid-full blog-grid-carousel-full js-blog-grid-carousel-full mt-3 mb-0 row">
                    
               
                     	<?php
$os = "SELECT  et.id,
et.kategori,
et.tr_slug,
et.en_slug,
et.ru_slug,
et.ar_slug,
et.de_slug,
et.fr_slug,
et.cin_slug,
tr_baslik,
tr_icerik,
en_baslik,
en_icerik,
ru_baslik,
ru_icerik,
ar_baslik,
ar_icerik,
fr_baslik,
fr_icerik,
de_baslik,
de_icerik,
cin_baslik,
cin_icerik,
et.kayit_tarihi,
et.eskayit,
 
(select eb.belge from icerik_belge eb where et.eskayit=eb.kayit_id AND  eb.durum!='-1' ORDER BY eb.id DESC LIMIT 0,1) belge  
FROM   icerik et  where kategori in (42,43)and durum='1'   order by rand()   limit 0,10  ";
$osb = sorgu($os, $baglan);
$osb->execute();                                    
  while ($osl =veriliste($osb)) {?>
                    <div class="col-sm-6">
						<div class="special-card">
							<div class="special-card-photo">
								<img src="yonetim/dosya/<?php echo $osl['belge']; ?>" style="height: 200px" alt="">
							</div>
							<div class="special-card-caption text-left">
								<div class="special-card-txt1" style="font-size: 18px" ><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo $osl['tr_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo $osl['en_baslik'];}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo $osl['ru_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo $osl['ar_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo $osl['de_baslik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo $osl['fr_baslik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo $osl['cin_baslik'];}?></div>
							 
							 
								<div><a href="<?php echo get_content_url($osl, isset($_GET['LN']) ? $_GET['LN']:'TR'); ?>" class="btn"><i class="icon-right-arrow"></i><span><?php echo metin('btn_more'); ?></span><i class="icon-right-arrow"></i></a></div>
							</div>
						</div>
					</div>
<?php } ?>  
					 
				</div>
			</div>
		</div>
		<!--//section blog posts -->
		<?php endif; ?>


		<br><br>
		<!--section-->
		<div class="section">
			<div class="container-fluid px-0">
				<div class="banner-center banner-center--p-sm bg-cover" style="background-image: url(images/gokcebanner.jpg)">
					<div class="banner-center-caption text-center">
						<div class="banner-center-text1"><?php echo metin('banner_bize_guvenin'); ?></div>
						<div class="banner-center-text4"><?php echo metin('banner_dogru_islem'); ?></div>
						<a href="#" class="btn btn-white btn-hover-fill mt-2 mt-sm-3 mt-lg-5" data-toggle="modal" data-target="#modalBookingForm"><i class="icon-right-arrow"></i><span><?php echo metin('btn_randevu_al'); ?></span><i class="icon-right-arrow"></i></a>
					</div>
				</div>
			</div>
		</div>
	
	<?php include("alt.php");?>