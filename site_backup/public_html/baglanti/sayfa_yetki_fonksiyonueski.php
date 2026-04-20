<?php

function yetkikontrol($sayfayetkisial) {
    
     
    $kullaniciid=temizlikimandan($_SESSION['kullaniciid']);
    $sayfakod=$sayfayetkisial;
    $kullanicijeton=temizlikimandan($_SESSION['jetonal']);     
 
    
     
$opps=preg_match("/[\-]{2,}|[;]|[']|[\\\*]/", $kullaniciid);;
$tokenkontrol=preg_match("/6e5y7a1l6c3i2n3/", $kullanicijeton);

if((!$tokenkontrol) or (!$_SESSION['jetonal']) or ($opps) ){
   
    session_destroy();
   exit(header("Location: giris.php"));    
    
}
    
    
    $yetkipost = array('kullaniciid' => "$kullaniciid",'sayfagonder' => "$sayfakod",'jetonal' => "$kullanicijeton");

 
 if ($sayfakod!=$yetkidonustur['kategori_id']) {
			 echo "<script type='text/javascript'>  
	alert('BU SAYFAYA YETKİNİZ BULUNMAMAKTADIR.'); 
</script> "; 
     session_destroy();
     exit(header("Location: giris.php"));  
   }   
  }

?>