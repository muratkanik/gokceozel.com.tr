<?php
header('Content-Type: text/html; charset=utf-8');
mb_internal_encoding('UTF-8');
ob_start();
session_start();
$tokenkontrol=preg_match("/6e5y7a1l6c3i2n3/", $_SESSION['jetonal']);
  if(!$tokenkontrol && $_SESSION['jetonal']==''){
   header("location: cikis.php",  true,  301 );  exit;
 
}  
  
include("baglanti/baglantilar_fonksiyonlar.php"); 
include("baglanti/sayfa_yetki_fonksiyonu.php");


 
 
$kullanicijeton=$_SESSION['jetonal']; 



function GetIP(){
	if(getenv("HTTP_CLIENT_IP")) {
 		$ip = getenv("HTTP_CLIENT_IP");
 	} elseif(getenv("HTTP_X_FORWARDED_FOR")) {
 		$ip = getenv("HTTP_X_FORWARDED_FOR");
 		if (strstr($ip, ',')) {
 			$tmp = explode (',', $ip);
 			$ip = trim($tmp[0]);
 		}
 	} else {
 	$ip = getenv("REMOTE_ADDR");
 	}
	return $ip;
}

$ipsonuc=GetIP();
gethostbyname($_SERVER['SERVER_NAME']);

 

$islem=isset($_GET['islem']) ? $_GET['islem']:'';
$sayfa=$_SERVER['REQUEST_URI']; 
$sayfalink=$_SERVER['SCRIPT_NAME']; 

$sayfano=isset($_GET['sayfasayi']) ? $_GET['sayfasayi']:'';
$altsayfano=isset($_GET['altsayfasayi']) ? $_GET['altsayfasayi']:'';



//$temizsayfalinkkucuk=ltrim($sayfalink,"/bymy/"); 
//$temizsayfalink=ltrim($temizsayfalinkkucuk,"/BYMY/");



$liknbolsonuc = substr($sayfalink, 1, 50);  
$yonetimlinkayar=stristr($liknbolsonuc,'/');
$yonetimlink = substr($yonetimlinkayar, 1, 50);  

$katsayfa= "SELECT id FROM   kategoriler where link=:linkdal ";
$katsayfab= sorgu($katsayfa, $baglan);
$katsayfab->bindValue(':linkdal',$yonetimlink, PDO::PARAM_STR); 
$katsayfab->execute(); 
$katsayfal = veriliste($katsayfab);


$sayfaidd=addslashes($katsayfal['id']);
$sayfalinkd=$yonetimlink;
$kullanicid=addslashes($_SESSION['kullaniciid']);
$tarihd=date('Y.m.d H:i:s');  
$ipd=$ipsonuc;    
    
    
  $sayfakayit = 'INSERT INTO sayfa_ziyaretleri 
(kullanici_id,
sayfa_id,
sayfa_linki,
tarih,
ip) 
VALUES 
(:kullanicial,
:sayfaidal,
:sayfalinkal,
:tarihal,
:ipal)';     
$sayfakayitb= guncel($sayfakayit, $baglan); 
$sayfakayitb->bindValue(':kullanicial',$kullanicid, PDO::PARAM_INT);   
$sayfakayitb->bindValue(':sayfaidal',$sayfaidd, PDO::PARAM_INT);  
$sayfakayitb->bindValue(':sayfalinkal',$sayfalinkd, PDO::PARAM_STR);
$sayfakayitb->bindValue(':tarihal',$tarihd, PDO::PARAM_STR);
$sayfakayitb->bindValue(':ipal',$ipd, PDO::PARAM_STR);
$sayfakayitb->execute();
 
//print_r($sayfakayitb->errorInfo());
?>
<!DOCTYPE html>
<html lang="tr">
    <head>
         
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta http-equiv="Content-Language" content="TR"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <meta name="description" content="">
        <meta name="author" content="">

        <title><?php echo $_SESSION['siteadi'];?></title>

        <link href="css/style.default.css" rel="stylesheet">
        <link href="css/morris.css" rel="stylesheet">
        <link href="css/select2.css" rel="stylesheet" />
          <link href="css/jquery.gritter.css" rel="stylesheet">    
        
           <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script> 
 <link href="css/tarih.css" rel="stylesheet" type="text/css" />
   <link href="css/bootstrap-wysihtml5.css" rel="stylesheet" />

  <script src="js/tarih.js" ></script>
        <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!--[if lt IE 9]>
        <script src="js/html5shiv.js"></script>
        <script src="js/respond.min.js"></script>
        <![endif]-->
        
<script language="javascript">
	
function gizleac(arama){
		if (document.getElementById(arama).style.display==""){
		document.getElementById(arama).style.display="none";
			}
			else {
				document.getElementById(arama).style.display="";
			}
		}

</script>
<script type="text/javascript"> 
function yazdir()
{
window.print();
}

  function uyariayar() {
  jQuery.ajax({
  url: 'zamanlanmisgorevpopup.php',
  success: function(veri) { 
      $('#bilgilendirmeicerik').html(veri);
      
  } 
});
        
        
} 
 
 setInterval(uyariayar, 60000);
    

   Number.prototype.formatMoney = function (fractionDigits, decimal, separator) {
fractionDigits = isNaN(fractionDigits = Math.abs(fractionDigits)) ? 2 : fractionDigits;

decimal = typeof (decimal) === "undefined" ? "." : decimal;

separator = typeof (separator) === "undefined" ? "," : separator;

var number = this;

var neg = number < 0 ? "-" : "";

var wholePart = parseInt(number = Math.abs(+number || 0).toFixed(fractionDigits)) + "";

var separtorIndex = (separtorIndex = wholePart.length) > 3 ? separtorIndex % 3 : 0;

return neg +

(separtorIndex ? wholePart.substr(0, separtorIndex) + separator : "") +

wholePart.substr(separtorIndex).replace(/(\d{3})(?=\d)/g, "$1" + separator) +

(fractionDigits ? decimal + Math.abs(number - wholePart).toFixed(fractionDigits).slice(2) : "");

};
    function formatMoney (raw) {

return Number(raw).formatMoney(2, ',', '.');

}
</script>

<style type="text/css" media="print">
@media print {
   .yazdirma {
        display: none;
    }
	
	 
}

</style>

    </head>

    <body>
        <div class="modal fade" id="bilgilendirme" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="myModalLabel"  style="color:red; font-weight:bold;">BİLGİ!</h4>
              </div>
              <div class="modal-body" >
              
               <div id="bilgilendirmeicerik"></div> 
                  
                  
              </div>
          
            </div>
          </div>
        </div>
            
            
            
        <header>
            <div class="headerwrapper">
                <div class="header-left yazdirma">
                    <a href="index.php" class="logo">
                        <img style="margin-top:-8px; max-height: 40px" width="80%" src="dosya/<?php echo $_SESSION['logo'];?>" alt="<?php echo $_SESSION['siteadi'];?>" /> 
                    </a>
                    <div class="pull-right">
                        <a href="" class="menu-collapse">
                            <i class="fa fa-bars"></i>
                        </a>
                    </div>
                </div><!-- header-left -->
                
                <div class="header-right yazdirma">
                    
                    <div class="pull-right yazdirma">
                 
                    
						 
                        	 
                       
                        
                        <div class="btn-group btn-group-option">
                            <button type="button"  >
                              <a href="cikis.php" ><i class="glyphicon glyphicon-log-out"></i>Çıkış</a>
                            </button>
                            
                        </div><!-- btn-group -->
                        
                    </div><!-- pull-right -->
                    
                </div><!-- header-right -->
                
            </div><!-- headerwrapper -->
        </header>
        
        <section>
        
        
        
        
        
            <div class="mainwrapper solacek">
                <div class="leftpanel yazdirma">
                    <div class="media profile-left yazdirma">
                        
                         <a class="pull-left profile-thumb" href="profilim.php">
                            <img class="img-circle"  src="images/avyok.jpg" height="50" alt="<?php echo $_SESSION['adi'];?>">
                        </a>
                        <div class="media-body">
                              <h4 class="media-heading"><?php echo  $_SESSION['adi'];?></h4>
                            <small class="text-muted" style="font-size:9px"> </small>
                        </div>
                    </div><!-- media -->
                    
                    <h5 class="leftpanel-title">Menu</h5>
  <ul class="nav nav-pills nav-stacked">                        
 <?php 
      
      
     $anakat = "SELECT   kg.isim ,kg.id,kg.ikon,kt.id ktid,link
FROM kategoriler as kt inner join kullanici_yetki  as ky on ky.kategori_id=kt.id 
inner join  kullanicilar as kl on kl.id=ky.kullanici_id inner join kategori_grup as kg on  kt.grup=kg.id
where  grup!='' 
and ky.kullanici_id=:kidal and kt.durum!='0' and ky.durum='1' group by kg.isim,kg.id,kg.sira,kg.ikon,kt.id,link order by kg.sira"; 
  
 $anamenukatverilerb = sorgu($anakat, $baglan); 
 $anamenukatverilerb->bindValue(':kidal',temizlikimandan($_SESSION['kullaniciid']), PDO::PARAM_INT);     
$anamenukatverilerb->execute();
       ?>
      
      
     <?php    
     while ($menukategoriilkveri =veriliste($anamenukatverilerb)) { 
 
           $altkat = "SELECT    kt.id id,kt.isim isim,kt.anakategori anakategori,kt.sira,kt.link ,grup
FROM kategoriler as kt inner join kullanici_yetki  as ky on ky.kategori_id=kt.id inner join  kullanicilar as kl on kl.id=ky.kullanici_id
where kt.anakategori='".temizlikimandan($menukategoriilkveri['ktid'])."'  and   ky.kullanici_id=:kidal  and ky.durum='1' and kt.durum='1' order by kt.sira "; 
       
          $altkatverilerb = sorgu($altkat, $baglan);
         $altkatverilerb->bindValue(':kidal',temizlikimandan($_SESSION['kullaniciid']), PDO::PARAM_INT);  
         $altkatverilerb->execute();  
      ?>
      
     <li <?php if ($menukategoriilkveri['link']=='') {?> class="parent  <?php if ($sayfa=="/alembilisim/".$menukategoriilkveri['link']) {echo "active";} else {echo "";}?> "<?php } ?>><a href="<?php echo $menukategoriilkveri['link']; ?>"><i class="fa <?php echo $menukategoriilkveri['ikon'];?>"></i> <span><?php echo $menukategoriilkveri['isim'];?></span></a> 
         
         <?php if ($menukategoriilkveri['link']=='') {?>
         
      <ul class="children">  
      <?php
 while ($altkategoriilkveri =veriliste($altkatverilerb)) {   
  
        ?>
    <?php if ($menukategoriilkveri['ktid']==$altkategoriilkveri['anakategori']) {?> 
 <li><a href="<?php echo $altkategoriilkveri['link']; ?>">&raquo; <?php echo $altkategoriilkveri['isim']; ?></a></li>
      
      <?php }
  
}
?></ul> <?php } ?>  </li>
 	       
      
      <?php }  ?>
                    </ul> 
                     
                    
                    
                     
                </div><!-- leftpanel -->