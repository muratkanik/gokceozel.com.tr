<?php 
header('Content-Type: text/html; charset=utf-8');
mb_internal_encoding('UTF-8');
include("ust.php");
?>
<?php
// Removed hardcoded Bio logic
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
						<span><?php 
                                   // Dynamic Blog Category Logic
                                   $current_ln = isset($_GET['LN']) ? $_GET['LN'] : 'TR';
                                   $cat_name = "";
                                   
                                   // Default fallback titles
                                   if ($current_ln === 'TR' || empty($current_ln)) $default_title = "Blog";
                                   elseif ($current_ln === 'EN') $default_title = "Blog";
                                   elseif ($current_ln === 'RU') $default_title = "Блог";
                                   elseif ($current_ln === 'AR') $default_title = "مدونة";
                                   elseif ($current_ln === 'DE') $default_title = "Blog";
                                   elseif ($current_ln === 'FR') $default_title = "Blog"; 
                                   elseif ($current_ln === 'CIN') $default_title = "博客";
                                   
                                   if (isset($_GET['kat']) && is_numeric($_GET['kat'])) {
                                       $kat_id = intval($_GET['kat']);
                                       $lang_col = 'tr_isim';
                                       if ($current_ln === 'EN') $lang_col = 'en_isim';
                                       elseif ($current_ln === 'RU') $lang_col = 'ru_isim';
                                       elseif ($current_ln === 'AR') $lang_col = 'ar_isim';
                                       elseif ($current_ln === 'DE') $lang_col = 'de_isim';
                                       elseif ($current_ln === 'FR') $lang_col = 'fr_isim';
                                       elseif ($current_ln === 'CIN') $lang_col = 'cin_isim';
                                       
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
                                   ?> </span>
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
						<div class="blog-posts">

                        <?php
                        setlocale(LC_TIME,'turkish');
 $gelen =isset($_GET['kat']) ? addslashes(htmlentities(trim($_GET['kat']))):'';                      
if($gelen!='') {$katsonucu=" and et.kategori=".$gelen."";}   else {$katsonucu=" and et.kategori in (42,43,52)";}    
                    
  $hizmetler = "SELECT  et.id,
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
FROM   icerik et  where   durum='1' ".$katsonucu."  order by et.id  ";
$hizmetlerb = sorgu($hizmetler, $baglan);
$hizmetlerb->execute();                                    
 
?>
<div class="row">
<?php while ($hizmetlerl =veriliste($hizmetlerb)) { ?> 
    <div class="col-md-6 mb-4">
        <div class="card h-100 border-0 shadow-sm" style="border-radius:15px; overflow:hidden; transition: transform 0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.05) !important;">
            <a href="blogdetay.php?detay=<?php echo $hizmetlerl['eskayit']; ?>&LN=<?php echo isset($_GET['LN']) ? $_GET['LN']:'';?>">
                <img src="yonetim/dosya/<?php echo $hizmetlerl['belge']; ?>" class="card-img-top" style="height:250px; object-fit:cover;" alt="">
            </a>
            <div class="card-body px-4 py-4">
                <div class="text-muted small mb-2"><i class="icon-clock3"></i> <?php 
                $tarih = strtotime($hizmetlerl['kayit_tarihi']);
                $ay_numarasi = (int)date('n', $tarih);
                $turkce_aylar = array(1 => 'Ocak', 2 => 'Şubat', 3 => 'Mart', 4 => 'Nisan', 5 => 'Mayıs', 6 => 'Haziran', 7 => 'Temmuz', 8 => 'Ağustos', 9 => 'Eylül', 10 => 'Ekim', 11 => 'Kasım', 12 => 'Aralık');
                echo date('d', $tarih) . ' ' . (isset($turkce_aylar[$ay_numarasi]) ? $turkce_aylar[$ay_numarasi] : date('F', $tarih)); ?></div>
                
                <h4 class="card-title font-weight-bold mb-3" style="font-size: 1.25rem;"><a href="blogdetay.php?detay=<?php echo $hizmetlerl['eskayit']; ?>&LN=<?php echo isset($_GET['LN']) ? $_GET['LN']:'';?>" class="text-dark"><?php 
                   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo $hizmetlerl['tr_baslik'];} 
                   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo $hizmetlerl['en_baslik'];}
                   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo $hizmetlerl['ru_baslik'];} 
                   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo $hizmetlerl['ar_baslik'];} 
                   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo $hizmetlerl['de_baslik'];}
                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo $hizmetlerl['fr_baslik'];}
                   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo $hizmetlerl['cin_baslik'];}?></a></h4>
                   
                <p class="card-text text-muted" style="font-size:14px; line-height:1.6; height:66px; overflow:hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;"><?php 
                   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo mb_substr(strip_tags(html_entity_decode($hizmetlerl['tr_icerik'], ENT_QUOTES, 'UTF-8')),0,300, 'UTF-8') . '[...]';} 
                   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo mb_substr(strip_tags(html_entity_decode($hizmetlerl['en_icerik'], ENT_QUOTES, 'UTF-8')),0,300, 'UTF-8') . '[...]';}
                   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo mb_substr(strip_tags(html_entity_decode($hizmetlerl['ru_icerik'], ENT_QUOTES, 'UTF-8')),0,300, 'UTF-8') . '[...]';} 
                   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo mb_substr(strip_tags(html_entity_decode($hizmetlerl['ar_icerik'], ENT_QUOTES, 'UTF-8')),0,300, 'UTF-8') . '[...]';} 
                   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo mb_substr(strip_tags(html_entity_decode($hizmetlerl['de_icerik'], ENT_QUOTES, 'UTF-8')),0,300, 'UTF-8') . '[...]';}
                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo mb_substr(strip_tags(html_entity_decode($hizmetlerl['fr_icerik'], ENT_QUOTES, 'UTF-8')),0,300, 'UTF-8') . '[...]';}
                   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo mb_substr(strip_tags(html_entity_decode($hizmetlerl['cin_icerik'], ENT_QUOTES, 'UTF-8')),0,300, 'UTF-8') . '[...]';}?></p>
            </div>
            
            <div class="card-footer bg-white border-0 px-4 pb-4 pt-0">
                <a href="blogdetay.php?detay=<?php echo $hizmetlerl['eskayit']; ?>&LN=<?php echo isset($_GET['LN']) ? $_GET['LN']:'';?>" class="btn btn-sm btn-outline-primary btn-hover-fill"><span><?php 
                   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "DEVAMI";} 
                   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "MORE";}
                   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "БОЛЕЕ";} 
                   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "أكثر";}
                   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "MEHR";}
                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "SUITE";}
                   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo "阅读更多";}?></span><i class="icon-right-arrow ml-2"></i></a>
            </div>
        </div>
    </div>
<?php } ?>
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
		</div>
		<!--//section-->
	</div>
	

	<?php include("alt.php");?>