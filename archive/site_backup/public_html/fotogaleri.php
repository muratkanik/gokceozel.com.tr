<?php 
header('Content-Type: text/html; charset=utf-8');
mb_internal_encoding('UTF-8');
include("ust.php");
?>
	<link rel="stylesheet" href="css/lightbox.min.css">
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
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "PAGE D'ACCUEIL";}?></a>
					 
						<span><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "Foto Galeri";} 
								   elseif ($_GET['LN']=='EN') {echo "Photo Gallery";}
								   elseif ($_GET['LN']=='RU') {echo "Фотогалерея";} 
								   elseif ($_GET['LN']=='AR') {echo "معرض الصور";}
								   elseif ($_GET['LN']=='DE') {echo "Fotogalerie";}
                                   elseif ($_GET['LN']=='FR') {echo "Galerie de photos";}
                                   else {echo "Photo Gallery";}?></span>
					</div>
				</div>
			</div>
		</div>
		<!--//section-->
		<style>
.esitle{
	
 
position: relative;
float: center;
background-position: 50% 50%;
background-repeat: no-repeat;
background-size: cover;
overflow:hidden;
 text-align:center;
height: 200px !important;
margin:20px;
padding: 0 !important; 
width: 330px !important;
vertical-align:center;
 
 
}
.esitle img {
   max-height: 200px;
    padding: 1px;
	text-align:center;
	vertical-align:center;
	
}
</style>	 
		<div class="section">
			<div class="container">
				<div class="title-wrap text-center">
					<h2 class="h1"><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "Galeri";} 
								   elseif ($_GET['LN']=='EN') {echo "Gallery";}
								   elseif ($_GET['LN']=='RU') {echo "Галерея";} 
								   elseif ($_GET['LN']=='AR') {echo "صالة عرض";}
								   elseif ($_GET['LN']=='DE') {echo "Galerie";}
                                   elseif ($_GET['LN']=='FR') {echo "Galerie";}
                                   else {echo "Gallery";}?></h2>
					<div class="h-decor"></div>
				</div>
				<div class="row specialist-carousel js-specialist-carousel">
                    
    <?php
    $gelen = '';
    if (!empty($_GET['slug'])) {
        $slug = addslashes(htmlentities(trim($_GET['slug'])));
        $ln_db = isset($_GET['LN']) ? strtolower($_GET['LN']) : 'tr';
        if ($ln_db == 'cin') $ln_db = 'cin';
        $slug_col = $ln_db . '_slug';
        
        $kat_q = "SELECT id, tr_isim FROM genel_kategori WHERE {$slug_col} = :slug AND durum='1'";
        $kat_stmt = $baglan->prepare($kat_q);
        $kat_stmt->execute(['slug' => $slug]);
        $kat_row = $kat_stmt->fetch(PDO::FETCH_ASSOC);
        if ($kat_row) {
            $gelen = $kat_row['id'];
        }
    } elseif (!empty($_GET['katla'])) {
        $gelen = addslashes(htmlentities(trim($_GET['katla'])));
    }

    if($gelen != '') {
        $katsonucu = " and et.kategori=" . $gelen . "";
    } else {
        $katsonucu = " and et.kategori in (5,49,50,51)";
    }
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
et.kayit_tarihi,
et.eskayit,
(select eb.belge from icerik_belge eb where et.eskayit=eb.kayit_id AND  eb.durum!='-1' ORDER BY eb.id DESC LIMIT 0,1) belge  
FROM   icerik et  where   durum='1' ".$katsonucu."  order by et.id  ";
$hizmetlerb = sorgu($hizmetler, $baglan);
$hizmetlerb->execute();                                    
 
while ($hizmetlerl =veriliste($hizmetlerb)) {
?>                    
					<div class="col-sm-6 col-md-4">
						<div class="doctor-box text-center">
							<div class="doctor-box-photo">
							<a  class="example-image-link quickview-box-btn" href="yonetim/dosya/<?php echo $hizmetlerl['belge']; ?>"  data-lightbox="example-set" data-title="büyüt"  >
							<div class="esitle" ><img src="yonetim/dosya/<?php echo $hizmetlerl['belge']; ?>" style="height: 200px; border-radius:5px" class="img-fluid" alt=""></div></a> 
							</div>
							<h5 class="doctor-box-name"><a href="#"><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo $hizmetlerl['tr_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo $hizmetlerl['en_baslik'];}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo $hizmetlerl['ru_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo $hizmetlerl['ar_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo $hizmetlerl['de_baslik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo $hizmetlerl['fr_baslik'];}?></a></h5>
					 
							<div class="doctor-box-text">
								<p><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo $hizmetlerl['tr_icerik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo $hizmetlerl['en_icerik'];}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo $hizmetlerl['ru_icerik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo $hizmetlerl['ar_icerik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo $hizmetlerl['de_icerik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo $hizmetlerl['fr_icerik'];}?></p>
							</div>
							 
						</div>
					</div>
					 
                    
					 <?php } ?>
                    
                    
			 
				</div>
			</div>
		</div>
	</div>
	<!--footer-->
	<script src="js/lightbox-plus-jquery.min.js"></script> 
	<?php include("alt.php");?>