<?php function sayfayetkikontrol($sayfayetkisial) {
 
global $baglan;
 
		   $kullanici=temizlikimandan($_SESSION["kullaniciid"]);
		   $sayfakontrol=temizlikimandan($sayfayetkisial);
           $jetonal=temizlikimandan($_SESSION['jetonal']);

$opps=preg_match("/[\-]{2,}|[;]|[']|[\\\*]/", $kullanici);
$sayfaops=preg_match("/[\-]{2,}|[;]|[']|[\\\*]/", $sayfakontrol);
$tokenkontrol=preg_match("/6e5y7a1l6c3i2n3/",  $jetonal);

 if((!$tokenkontrol) or (!$_SESSION['jetonal']) or ($opps) or ($sayfaops)){
  header("location: cikis.php");  exit;
    
}
  
  if (in_array($sayfakontrol,$_SESSION['yetkidizi'])) {
  
 } else {  header("location: cikis.php");  exit;  }  

}
?>