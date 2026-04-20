<?php
header('Content-Type: text/html; charset=utf-8');
mb_internal_encoding('UTF-8');
include("baglanti/baglantilar_fonksiyonlar.php");

include("servisler/sayfa_yetki_fonksiyonu.php");
session_start();
  
ob_start();


 
$tokenkontrol=preg_match("/6e5y7a1l6c3i2n3/", $_SESSION['jetonal']);

if((!$tokenkontrol) or (!$_SESSION['jetonal'])){
   
    session_destroy();
   exit(header("Location: giris.php"));    
    
}


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

 

$islem=$_GET['islem'];
$sayfa=$_SERVER['REQUEST_URI']; 
$sayfalink=$_SERVER['SCRIPT_NAME']; 

$sayfano=$_GET['sayfasayi'];
$altsayfano=$_GET['altsayfasayi'];


 



$anakategorial=$_GET['anakategori'];
if ($_GET['geribildirim']=='1') {
	
	
	
$im = imagegrabscreen();
imagepng($im, "hata/hata.png");
imagedestroy($im);
}


$kullanicijeton=$_SESSION['jetonal']; 
 
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <meta name="description" content="">
        <meta name="author" content="">

        <title>alembilisim MUHASEBE</title>

        <link href="css/style.default.css" rel="stylesheet">
        <link href="css/morris.css" rel="stylesheet">
        <link href="css/select2.css" rel="stylesheet" />
        
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
        
        <header>
            <div class="headerwrapper">
                <div class="header-left yazdirma">
                    <a href="index.php" class="logo">
                        <img style="margin-top:-8px" width="50%" src="images/logo.png" alt="ITSCS" /> 
                    </a>
                    <div class="pull-right">
                        <a href="" class="menu-collapse">
                            <i class="fa fa-bars"></i>
                        </a>
                    </div>
                </div><!-- header-left -->
                
                <div class="header-right yazdirma">
                    
                    <div class="pull-right yazdirma">
                 
                    
						 
                        <div class="btn-group btn-group-list btn-group-notification">
                            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                              <i class="fa fa-bell-o"></i>
                              <span class="badge"> </span>
                            </button>
                            
                            
                            
                            <div class="dropdown-menu pull-right">
                                <a href="" class="link-right"><i class="fa fa-search"></i></a>
                                <h5>Bildirimler</h5>
                                <ul class="media-list dropdown-list">
                             
                               
                                
                                  
                                    <li class="media">
                                       
                                        <div class="media-body">
         <strong>  <br> </strong><bR>   
                                          <small class="date"><i class="fa fa-thumbs-up"></i> </small>
                                        </div>
                                    </li>
                          
                                  
                                </ul>
                                <div class="dropdown-footer text-center">
                                    <a href="bildirimler.php" class="link">Tüm Bildirimleri Gör</a>
                                </div>
                            </div><!-- dropdown-menu -->
                        </div><!-- btn-group -->
                        	 
                                    
                        <div class="btn-group btn-group-list btn-group-messages">
                            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                                <i class="fa fa-envelope-o"></i>
                                <span class="badge"> </span>
                            </button>
                            <div class="dropdown-menu pull-right">
                                <a href="" class="link-right"><i class="fa fa-plus"></i></a>
                                <h5>Mesajlar</h5>
                                   
                                
                                <ul class="media-list dropdown-list">
                                  <a href="mesajlar.php"> 
                                    <li class="media">
                                       
                                        <img class="img-circle pull-left noti-thumb" src="images/avyok.jpg" alt="">
                                        
                                    </li></a>  
                                   
                                    
                                    
                                </ul>
                                <div class="dropdown-footer text-center">
                                    <a href="mesajlar.php" class="link">Tüm Mesaları Gör</a>
                                </div>
                            </div><!-- dropdown-menu -->
                        </div><!-- btn-group -->
                        
                        <div class="btn-group btn-group-option">
                            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                              <i class="fa fa-caret-down"></i>
                            </button>
                            <ul class="dropdown-menu pull-right" role="menu">
                              <li><a href="profilim.php"><i class="glyphicon glyphicon-user"></i> Profilim</a></li>
                              <li><a href="profilim.php"><i class="glyphicon glyphicon-star"></i> Son Hareketlerim</a></li>
                              <li><a href="profilim.php"><i class="glyphicon glyphicon-cog"></i> Ayarlar</a></li>
                              <li><a href="yardim.php"><i class="glyphicon glyphicon-question-sign"></i> Yardım</a></li>
                              <li class="divider"></li>
                              <li><a href="cikis.php"><i class="glyphicon glyphicon-log-out"></i>Çıkış</a></li>
                            </ul>
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
                            <img class="img-circle"  src="images/avyok.jpg" height="50" alt="<? echo $_SESSION['adi'];?>">
                        </a>
                        <div class="media-body">
                              <h4 class="media-heading"><? echo  $_SESSION['adi'];?></h4>
                            <small class="text-muted" style="font-size:9px"> </small>
                        </div>
                    </div><!-- media -->
                    
                    <h5 class="leftpanel-title">Menu</h5>
  <ul class="nav nav-pills nav-stacked">                        
 <? 
      
      
     $anakat = "SELECT   kg.isim ,kg.id,kg.ikon,kt.id ktid,link
FROM kategoriler as kt inner join kullanici_yetki  as ky on ky.kategori_id=kt.id 
inner join  kullanicilar as kl on kl.id=ky.kullanici_id inner join kategori_grup as kg on  kt.grup=kg.id
where  grup!='' 
and ky.kullanici_id='".$_SESSION['kullaniciid']."' and kt.durum!='0' and ky.durum='1'  group by kg.isim,kg.id,kg.sira,kg.ikon,kt.id,link order by kg.sira"; 
  
 $anamenukatverilerb = sorgu($anakat, $baglan); 
$anamenukatverilerb->execute();
       ?>
      
      
     <?    
     foreach($anamenukatverilerb as  $menukategoriilkveri) { 
 
           $altkat = "SELECT    kt.id id,kt.isim isim,kt.anakategori anakategori,kt.sira,kt.link ,grup
FROM kategoriler as kt inner join kullanici_yetki  as ky on ky.kategori_id=kt.id inner join  kullanicilar as kl on kl.id=ky.kullanici_id
where kt.anakategori='".$menukategoriilkveri['ktid']."'  and   ky.kullanici_id='".temizlikimandan($_SESSION['kullaniciid'])."'  and ky.durum='1' and kt.durum='1'  "; 
       
          $altkatverilerb = sorgu($altkat, $baglan); 
         $altkatverilerb->execute();  
      ?>
      
     <li <? if ($menukategoriilkveri['link']=='') {?> class="parent  <? if ($sayfa=="/alembilisim/".$menukategoriilkveri['link']) {echo "active";} else {echo "";}?> "<? } ?>><a href="<?php echo $menukategoriilkveri['link']; ?>"><i class="fa <?php echo $menukategoriilkveri['ikon'];?>"></i> <span><?php echo $menukategoriilkveri['isim'];?></span></a> 
         
         <? if ($menukategoriilkveri['link']!='') {?>
         
      <ul class="children">  
      <?
foreach($altkatverilerb as  $altkategoriilkveri) { 
  
        ?>
    <? if ($menukategoriilkveri['ktid']==$altkategoriilkveri['anakategori']) {?> 
 <li><a href="<?php echo $altkategoriilkveri['link']; ?>?anakategori=<?php echo $altkategoriilkveri['anakategori']; ?>"><?php echo $altkategoriilkveri['isim']; ?></a></li>
      
      <?}
  
}
?></ul> <? } ?>  </li>
 	       
      
      <? }  ?>
                    </ul> 
                </div><!-- leftpanel -->