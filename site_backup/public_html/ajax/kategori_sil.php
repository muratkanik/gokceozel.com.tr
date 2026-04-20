<?php ob_start();
session_start();
$tokenkontrol=preg_match("/6e5y7a1l6c3i2n3/", $_SESSION['jetonal']);
  if(!$tokenkontrol && $_SESSION['jetonal']==''){
   header("location: cikis.php",  true,  301 );  exit;
 
}  
  
include("../baglanti/baglantilar_fonksiyonlar.php"); 
include("../baglanti/sayfa_yetki_fonksiyonu.php");
sayfayetkikontrol(3);  


if  ($_GET['kayital']!='') {
 
$silmesorgusu ='UPDATE genel_kategori SET durum= :durumal  WHERE id= :idal';
$silbaglanti= guncel($silmesorgusu, $baglan);    
$silbaglanti->bindValue(':durumal', '-1', PDO::PARAM_INT);
$silbaglanti->bindValue(':idal', $_GET['kayital'], PDO::PARAM_INT);    
$silbaglanti->execute(); 
 if($silbaglanti)  {echo "<script type='text/javascript'> 
     jQuery(document).ready(function() {
                     if (typeof jQuery.gritter !== 'undefined') {
                         jQuery.gritter.add({
                                title: 'BİLGİ!',
                                text: 'İşleminiz Gerçekleştirilmiştir.',
                          class_name: 'growl-success',
                           time: '1000',
                           
                         });
                     }
                     // Modal'ı kapat
                     jQuery('#kayitsil').modal('hide');
                     // Ana sayfayı yenile (eğer popup içinde değilsek)
                     if (window.opener && !window.opener.closed) {
                         window.opener.location.reload();
                         window.close();
                     } else {
                         setTimeout(function() {
                             location.reload();
                         }, 1000);
                     }
              }); 
       
</script>";}  else {echo "<script type='text/javascript'> 
     jQuery(document).ready(function() {
                     jQuery.gritter.add({
                            title: 'Hata!',
                            text: 'İşleminiz Gerçekleştirilemedi.',
                      class_name: 'growl-danger',
                       time: '1000',
                       
                     });
  $('#kayitsil').removeClass('in');
  $('.modal-backdrop').remove();
  $('#kayitsil').hide();
  $('#davakategoriekle').hide();
   $('#davaturekle').hide();
              }); 
       
</script>";} 
} 

  $baglan = null;?>
 