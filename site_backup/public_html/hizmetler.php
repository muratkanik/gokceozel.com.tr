<?php 
header('Content-Type: text/html; charset=utf-8');
mb_internal_encoding('UTF-8');
include("ust.php");


// Logic removed: Hardcoded Bio text for TR/AR users was preventing service list display.
// Now showing services for all languages.
?>
<?php
// Handle SEO Slug for Category
if (isset($_GET['slug']) && !empty($_GET['slug'])) {
    $slug = clean(htmlentities($_GET['slug'], ENT_QUOTES));
    $current_ln = isset($_GET['LN']) ? $_GET['LN'] : 'TR';
    $lang_col = 'tr_slug';
    
    if ($current_ln === 'EN') $lang_col = 'en_slug';
    elseif ($current_ln === 'RU') $lang_col = 'ru_slug';
    elseif ($current_ln === 'AR') $lang_col = 'ar_slug';
    elseif ($current_ln === 'DE') $lang_col = 'de_slug';
    elseif ($current_ln === 'FR') $lang_col = 'fr_slug';
    elseif ($current_ln === 'CIN') $lang_col = 'cin_slug';
    
    $slug_sql = "SELECT id FROM genel_kategori WHERE $lang_col = :slug LIMIT 1";
    $slug_stmt = $baglan->prepare($slug_sql);
    $slug_stmt->bindValue(':slug', $slug, PDO::PARAM_STR);
    $slug_stmt->execute();
    
    if ($slug_row = $slug_stmt->fetch(PDO::FETCH_ASSOC)) {
        $_GET['kat'] = $slug_row['id'];
    }
}
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
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "PAGE D'ACCUEIL";}?></a>
						<span> <?php 
                                   // Dynamic Caegory Title Logic
                                   $current_ln = isset($_GET['LN']) ? $_GET['LN'] : 'TR';
                                   $cat_name = "";
                                   
                                   // Default fallback titles
                                   if ($current_ln === 'TR' || empty($current_ln)) $default_title = "HİZMETLER";
                                   elseif ($current_ln === 'EN') $default_title = "SERVICES";
                                   elseif ($current_ln === 'RU') $default_title = "СЕРВИСЫ";
                                   elseif ($current_ln === 'AR') $default_title = "خدمات";
                                   elseif ($current_ln === 'DE') $default_title = "DIENSTLEISTUNGEN";
                                   elseif ($current_ln === 'FR') $default_title = "PRESTATIONS DE SERVICE";
                                   
                                   if (isset($_GET['kat']) && is_numeric($_GET['kat'])) {
                                       $kat_id = intval($_GET['kat']);
                                       $lang_col = 'tr_isim';
                                       if ($current_ln === 'EN') $lang_col = 'en_isim';
                                       elseif ($current_ln === 'RU') $lang_col = 'ru_isim';
                                       elseif ($current_ln === 'AR') $lang_col = 'ar_isim';
                                       elseif ($current_ln === 'DE') $lang_col = 'de_isim';
                                       elseif ($current_ln === 'FR') $lang_col = 'fr_isim';
                                       
                                       $kat_sorgu = "SELECT $lang_col FROM genel_kategori WHERE id = :id";
                                       $kat_stmt = sorgu($kat_sorgu, $baglan);
                                       $kat_stmt->bindValue(':id', $kat_id, PDO::PARAM_INT);
                                       $kat_stmt->execute();
                                       $kat_row = veriliste($kat_stmt);
                                       
                                       if ($kat_row && !empty($kat_row[$lang_col])) {
                                           $cat_name = strtoupper($kat_row[$lang_col]);
                                       } else {
                                           $cat_name = $default_title;
                                       }
                                   } else {
                                       $cat_name = $default_title;
                                   }
                                   
                                   echo $cat_name;
                                   ?> 
						</span>
					</div>
				</div>
			</div>
		</div>
		<!--//section-->
		 
		<!--section special offers-->
		<div class="section" id="specialOffer">
			<div class="container">
				<div class="title-wrap text-center">
					<div class="h-sub theme-color"><?php echo $ayarlarl['siteadi']; ?></div>
					<h2 class="h1"><?php echo $cat_name; ?></h2>
					<div class="h-decor"></div>
				</div>
				<div class="row">

                <?php
 $gelen = (isset($_GET['kat']) && !empty($_GET['kat'])) ? addslashes(htmlentities(trim($_GET['kat']))) : '';
 
 // If no specific category is requested and we are on a non-TR language, show the Category Grid (Surgical vs Non-Surgical)
 if ($gelen == '' && isset($_GET['LN']) && strtoupper($_GET['LN']) != 'TR' && !empty($_GET['LN'])) {
     $cats_sql = "SELECT id, en_isim, ru_isim, ar_isim, de_isim, fr_isim, cin_isim, en_slug, ru_slug, ar_slug, de_slug, fr_slug, cin_slug FROM genel_kategori WHERE id IN (42,43) ORDER BY id DESC";
     $cats_stmt = sorgu($cats_sql, $baglan);
     $cats_stmt->execute();
     
     while ($cat = veriliste($cats_stmt)) {
         $ln = strtoupper($_GET['LN']);
         $cat_name = $cat[strtolower($ln).'_isim'] ?? "Category ".$cat['id'];
         $cat_slug = $cat[strtolower($ln).'_slug'] ?? "";
         
         // Get latest image of a service in this category to use as cover placeholder
         $img_sql = "SELECT b.belge FROM icerik_belge b JOIN icerik i ON b.kayit_id = i.eskayit WHERE i.kategori = :kat AND i.durum = '1' AND b.durum != '-1' ORDER BY b.id DESC LIMIT 1";
         $img_stmt = $baglan->prepare($img_sql);
         $img_stmt->bindValue(':kat', $cat['id'], PDO::PARAM_INT);
         $img_stmt->execute();
         $img = $img_stmt->fetch(PDO::FETCH_ASSOC);
         $image_path = $img ? "yonetim/dosya/".$img['belge'] : "images/placeholder.jpg";
         
         // Get description from translations, otherwise use a default
         $trans_key = ($cat['id'] == 43) ? 'desc_surgical' : 'desc_nonsurgical';
         $desc = metin($trans_key);
         if (empty($desc) || $desc == $trans_key) {
             $desc = ($cat['id'] == 43) ? "Discover our advanced aesthetic surgical procedures tailored to your needs." : "Explore our minimally invasive non-surgical treatments for a refreshed look.";
         }
         
         $cat_link = "/".strtolower($ln)."/category/".$cat_slug;
         $btn_text = "MORE";
         if ($ln == 'RU') $btn_text = "БОЛЕЕ"; elseif ($ln == 'AR') $btn_text = "أكثر"; elseif ($ln == 'DE') $btn_text = "MEHR"; elseif ($ln == 'FR') $btn_text = "SUITE";
         ?>
            <div class="col-sm-6">
                <div class="special-card">
                    <div class="special-card-photo">
                        <img src="<?php echo $image_path; ?>" style="height: 300px; object-fit: cover; width: 100%;" alt="">
                    </div>
                    <div class="special-card-caption text-left">
                        <div class="special-card-txt1" style="font-size: 25px"><?php echo $cat_name; ?></div>
                        <div class="special-card-txt3 mt-2 mb-3 text-muted" style="font-size: 14px; line-height: 1.5; height: 60px; overflow: hidden;"><?php echo $desc; ?></div>
                        <div><a href="<?php echo $cat_link; ?>" class="btn"><i class="icon-right-arrow"></i><span><?php echo $btn_text; ?></span><i class="icon-right-arrow"></i></a></div>
                    </div>
                </div>
            </div>
         <?php
     }
 } else {
     // Show regular service details list
    if($gelen!='') {$katsonucu=" and et.kategori=".$gelen."";}   else {$katsonucu=" and et.kategori in (42,43)";}    
                    
  $hizmetler = "SELECT  et.id,
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
et.kayit_tarihi,
et.eskayit,
(select eb.belge from icerik_belge eb where et.eskayit=eb.kayit_id AND  eb.durum!='-1' ORDER BY eb.id DESC LIMIT 0,1) belge  
FROM   icerik et  where   durum='1' ".$katsonucu."  order by et.id  ";
$hizmetlerb = sorgu($hizmetler, $baglan);
$hizmetlerb->execute();                                    
 
while ($hizmetlerl =veriliste($hizmetlerb)) {
?>   
					<div class="col-sm-6">
						<div class="special-card">
							<div class="special-card-photo">
								<img src="yonetim/dosya/<?php echo $hizmetlerl['belge']; ?>" style="height: 300px" alt="">
							</div>
							<div class="special-card-caption text-left">
								<div class="special-card-txt1" style="font-size: 25px" ><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo $hizmetlerl['tr_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo $hizmetlerl['en_baslik'];}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo $hizmetlerl['ru_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo $hizmetlerl['ar_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo $hizmetlerl['de_baslik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo $hizmetlerl['fr_baslik'];}?></div>
							 
								<div class="special-card-txt3 mt-2 mb-3 text-muted" style="font-size: 14px; line-height: 1.5; height: 60px; overflow: hidden;"><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo mb_substr(strip_tags(html_entity_decode($hizmetlerl['tr_icerik'], ENT_QUOTES, 'UTF-8')),0,120, 'UTF-8') . '[...]';} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo mb_substr(strip_tags(html_entity_decode($hizmetlerl['en_icerik'], ENT_QUOTES, 'UTF-8')),0,120, 'UTF-8') . '[...]';}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo mb_substr(strip_tags(html_entity_decode($hizmetlerl['ru_icerik'], ENT_QUOTES, 'UTF-8')),0,120, 'UTF-8') . '[...]';} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo mb_substr(strip_tags(html_entity_decode($hizmetlerl['ar_icerik'], ENT_QUOTES, 'UTF-8')),0,120, 'UTF-8') . '[...]';} 
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo mb_substr(strip_tags(html_entity_decode($hizmetlerl['de_icerik'], ENT_QUOTES, 'UTF-8')),0,120, 'UTF-8') . '[...]';}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo mb_substr(strip_tags(html_entity_decode($hizmetlerl['fr_icerik'], ENT_QUOTES, 'UTF-8')),0,120, 'UTF-8') . '[...]';}
                                   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo mb_substr(strip_tags(html_entity_decode($hizmetlerl['cin_icerik'], ENT_QUOTES, 'UTF-8')),0,120, 'UTF-8') . '[...]';}?></div>
								<div><a href="<?php echo get_content_url($hizmetlerl, isset($_GET['LN']) ? $_GET['LN']:'TR'); ?>" class="btn"><i class="icon-right-arrow"></i><span><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "DEVAMI";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "MORE";}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "БОЛЕЕ";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "أكثر";}
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "MEHR";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "SUITE";}?></span><i class="icon-right-arrow"></i></a></div>
							</div>
						</div>
					</div>
				 <?php } 
 } ?>
				  
				</div>
			</div>
		</div>
		<!--//section special offers-->
	</div>

	<?php include("alt.php");?>