<?php 
header('Content-Type: text/html; charset=utf-8');
mb_internal_encoding('UTF-8');
include("ust.php");
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
						<span><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "PROF.DR. GÖKÇE ÖZEL";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "PROF.DR. GÖKÇE ÖZEL";}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "PROF.DR. GÖKÇE ÖZEL";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "PROF.DR. GÖKÇE ÖZEL";}
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "PROF.DR. GÖKÇE ÖZEL";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "PROF.DR. GÖKÇE ÖZEL";}?></span>
					</div>
				</div>
			</div>
		</div>
		<!--//section-->


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
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo $hkl['fr_baslik'];}?></h1>
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
						<?php if ($belgel['sira']==1) {?><img src="yonetim/dosya/<?php echo $belgel['belge']; ?>" style="border-radius: 10px;" class="w-100" alt=""><?php } ?>
					 
					</div>
					<?php } ?>
					<div class="col-lg-6 mt-3 mt-lg-0">
						<?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo html_entity_decode($hkl['tr_icerik'], ENT_QUOTES, 'UTF-8');} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo html_entity_decode($hkl['en_icerik'], ENT_QUOTES, 'UTF-8');}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo html_entity_decode($hkl['ru_icerik'], ENT_QUOTES, 'UTF-8');} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo html_entity_decode($hkl['ar_icerik'], ENT_QUOTES, 'UTF-8');} 
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo html_entity_decode($hkl['de_icerik'], ENT_QUOTES, 'UTF-8');}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo html_entity_decode($hkl['fr_icerik'], ENT_QUOTES, 'UTF-8');}?>
						 </div>
				</div>
			</div>
		</div>
		<!--//section-->
 
	</div>
	<?php include("alt.php");?>