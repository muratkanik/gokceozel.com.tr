<?php ob_start();
session_start();
$tokenkontrol=preg_match("/6e5y7a1l6c3i2n3/", $_SESSION['jetonal']);
  if(!$tokenkontrol && $_SESSION['jetonal']==''){
   header("location: cikis.php",  true,  301 );  exit;
 
}  
  
include("../baglanti/baglantilar_fonksiyonlar.php"); 
include("../baglanti/sayfa_yetki_fonksiyonu.php");
sayfayetkikontrol(3);  
 
 // Güncelleme kontrolü - kayitturu parametresine göre de kontrol et
 $guncelleme_id = isset($_POST['guncelleme']) ? intval($_POST['guncelleme']) : 0;
 $kayitturu = isset($_POST['kayitturu']) ? intval($_POST['kayitturu']) : 1;
 
 // Eğer kayitturu=0 ise güncelleme modu, guncelleme ID'sini al
 if ($kayitturu == 0 && $guncelleme_id == 0) {
     // guncelid hidden input'undan al
     $guncelleme_id = isset($_POST['guncelid']) ? intval($_POST['guncelid']) : 0;
 }
 
 if($guncelleme_id < 1) {
    $anakategori=isset($_POST['anakategori']) ? $_POST['anakategori'] : '';            
    $trbaslikgel=isset($_POST['trisim']) ? $_POST['trisim'] : '';
    $enbaslikgel=isset($_POST['enisim']) ? $_POST['enisim'] : '';
    $rubaslikgel=isset($_POST['ruisim']) ? $_POST['ruisim'] : '';
    $arbaslikgel=isset($_POST['arisim']) ? $_POST['arisim'] : '';
    $frbaslikgel=isset($_POST['frisim']) ? $_POST['frisim'] : '';
    $debaslikgel=isset($_POST['deisim']) ? $_POST['deisim'] : '';
    $cinbaslikgel=isset($_POST['cinisim']) ? $_POST['cinisim'] : '';
    $ustmenual=isset($_POST['ustmenu']) ? $_POST['ustmenu'] : '0';
    $tr_goster=isset($_POST['tr_goster']) ? intval($_POST['tr_goster']) : 1;
    $en_goster=isset($_POST['en_goster']) ? intval($_POST['en_goster']) : 1;
    $ru_goster=isset($_POST['ru_goster']) ? intval($_POST['ru_goster']) : 1;
    $ar_goster=isset($_POST['ar_goster']) ? intval($_POST['ar_goster']) : 1;
    $de_goster=isset($_POST['de_goster']) ? intval($_POST['de_goster']) : 1;
    $fr_goster=isset($_POST['fr_goster']) ? intval($_POST['fr_goster']) : 1;
    $cin_goster=isset($_POST['cin_goster']) ? intval($_POST['cin_goster']) : 1;
    $kayityapankullanicigel=addslashes($_SESSION['kullaniciid']);
    $kayittarihigel=date('Y.m.d H:i:s');  
    $kayitsonuc=isset($_POST['guncelleme']) ? intval($_POST['guncelleme']) : 0;
    
    $trseotitle=isset($_POST['trseotitle']) ? $_POST['trseotitle'] : '';
    $trseodescription=isset($_POST['trseodescription']) ? $_POST['trseodescription'] : '';
    $enseotitle=isset($_POST['enseotitle']) ? $_POST['enseotitle'] : '';
    $enseodescription=isset($_POST['enseodescription']) ? $_POST['enseodescription'] : '';
    $ruseotitle=isset($_POST['ruseotitle']) ? $_POST['ruseotitle'] : '';
    $ruseodescription=isset($_POST['ruseodescription']) ? $_POST['ruseodescription'] : '';
    $arseotitle=isset($_POST['arseotitle']) ? $_POST['arseotitle'] : '';
    $arseodescription=isset($_POST['arseodescription']) ? $_POST['arseodescription'] : '';
    $frseotitle=isset($_POST['frseotitle']) ? $_POST['frseotitle'] : '';
    $frseodescription=isset($_POST['frseodescription']) ? $_POST['frseodescription'] : '';
    $deseotitle=isset($_POST['deseotitle']) ? $_POST['deseotitle'] : '';
    $deseodescription=isset($_POST['deseodescription']) ? $_POST['deseodescription'] : '';
    $cinseotitle=isset($_POST['cinseotitle']) ? $_POST['cinseotitle'] : '';
    $cinseodescription=isset($_POST['cinseodescription']) ? $_POST['cinseodescription'] : '';

    $kayitdurumugel='1';    
    
    
  $kturu = 'INSERT INTO genel_kategori 
(anakategori,
tr_isim,
en_isim,
ru_isim,
ar_isim,
fr_isim,
de_isim,
cin_isim,
ust_menu,
tr_goster,
en_goster,
ru_goster,
ar_goster,
de_goster,
fr_goster,
cin_goster,
kayit_yapan_kullanici,
kayit_tarihi,
tr_seo_title,
tr_seo_description,
en_seo_title,
en_seo_description,
ru_seo_title,
ru_seo_description,
ar_seo_title,
ar_seo_description,
fr_seo_title,
fr_seo_description,
de_seo_title,
de_seo_description,
cin_seo_title,
cin_seo_description,
durum) 
VALUES 
(:anakategorial,
:trisimal,
:enisimal,
:ruisimal,
:arisimal,
:frisimal,
:deisimal,
:cinisimal,
:ustmenu,
:tr_goster,
:en_goster,
:ru_goster,
:ar_goster,
:de_goster,
:fr_goster,
:cin_goster,
:kayit_yapan_kullanici,
:kayit_tarihi,
:trseotitle,
:trseodescription,
:enseotitle,
:enseodescription,
:ruseotitle,
:ruseodescription,
:arseotitle,
:arseodescription,
:frseotitle,
:frseodescription,
:deseotitle,
:deseodescription,
:cinseotitle,
:cinseodescription,
:durumal)';     
$kturub= guncel($kturu, $baglan); 
    $kturub->bindValue(':anakategorial',$anakategori, PDO::PARAM_INT);   
    $kturub->bindValue(':trisimal',$trbaslikgel, PDO::PARAM_STR);  
    $kturub->bindValue(':enisimal',$enbaslikgel, PDO::PARAM_STR);
    $kturub->bindValue(':ruisimal',$rubaslikgel, PDO::PARAM_STR);
    $kturub->bindValue(':arisimal',$arbaslikgel, PDO::PARAM_STR);
    $kturub->bindValue(':frisimal',$frbaslikgel, PDO::PARAM_STR);
    $kturub->bindValue(':deisimal',$debaslikgel, PDO::PARAM_STR);
    $kturub->bindValue(':cinisimal',$cinbaslikgel, PDO::PARAM_STR);
    $kturub->bindValue(':ustmenu',$ustmenual, PDO::PARAM_STR);
    $kturub->bindValue(':tr_goster',$tr_goster, PDO::PARAM_INT);
    $kturub->bindValue(':en_goster',$en_goster, PDO::PARAM_INT);
    $kturub->bindValue(':ru_goster',$ru_goster, PDO::PARAM_INT);
    $kturub->bindValue(':ar_goster',$ar_goster, PDO::PARAM_INT);
    $kturub->bindValue(':de_goster',$de_goster, PDO::PARAM_INT);
    $kturub->bindValue(':fr_goster',$fr_goster, PDO::PARAM_INT);
    $kturub->bindValue(':cin_goster',$cin_goster, PDO::PARAM_INT);
    $kturub->bindValue(':kayit_yapan_kullanici',$kayityapankullanicigel, PDO::PARAM_INT);
    $kturub->bindValue(':kayit_tarihi', $kayittarihigel, PDO::PARAM_STR);
    $kturub->bindValue(':durumal',$kayitdurumugel, PDO::PARAM_INT);
    $kturub->bindValue(':trseotitle',$trseotitle, PDO::PARAM_STR);
    $kturub->bindValue(':trseodescription',$trseodescription, PDO::PARAM_STR);
    $kturub->bindValue(':enseotitle',$enseotitle, PDO::PARAM_STR);
    $kturub->bindValue(':enseodescription',$enseodescription, PDO::PARAM_STR);
    $kturub->bindValue(':ruseotitle',$ruseotitle, PDO::PARAM_STR);
    $kturub->bindValue(':ruseodescription',$ruseodescription, PDO::PARAM_STR);
    $kturub->bindValue(':arseotitle',$arseotitle, PDO::PARAM_STR);
    $kturub->bindValue(':arseodescription',$arseodescription, PDO::PARAM_STR);
    $kturub->bindValue(':frseotitle',$frseotitle, PDO::PARAM_STR);
    $kturub->bindValue(':frseodescription',$frseodescription, PDO::PARAM_STR);
    $kturub->bindValue(':deseotitle',$deseotitle, PDO::PARAM_STR);
    $kturub->bindValue(':deseodescription',$deseodescription, PDO::PARAM_STR);
    $kturub->bindValue(':cinseotitle',$cinseotitle, PDO::PARAM_STR);
    $kturub->bindValue(':cinseodescription',$cinseodescription, PDO::PARAM_STR);
    $kturub->execute();     
     
     if (!$kturub) {echo "<script type='text/javascript'> 
     jQuery(document).ready(function() {
                     jQuery.gritter.add({
                            title: 'Hata!',
                            text: 'İşleminiz Onaylanmadı.',
                      class_name: 'growl-danger',
                       time: '10000',
                       
                     });
                   
              }); 
       
</script>";}  
else {echo "<script type='text/javascript'> 
     jQuery(document).ready(function() {
                     if (typeof jQuery.gritter !== 'undefined') {
                         jQuery.gritter.add({
                                title: 'BİLGİ!',
                                text: 'İşleminiz Onaylandı.',
                          class_name: 'growl-success',
                           time: '2000',
                           
                         });
                     }
                     // Popup pencerede isek ana sayfayı yenile ve pencereyi kapat
                     if (window.opener && !window.opener.closed) {
                         window.opener.location.reload();
                         setTimeout(function() {
                             window.close();
                         }, 1500);
                     } else {
                         // Normal sayfada isek sayfayı yenile
                         setTimeout(function() {
                             location.reload();
                         }, 1500);
                     }
                  
              }); 
       
</script>";}
     
 }

else
{
    $anakategori=isset($_POST['anakategori']) ? $_POST['anakategori'] : '';  
    $trbaslikgel=isset($_POST['trisim']) ? $_POST['trisim'] : '';
    $enbaslikgel=isset($_POST['enisim']) ? $_POST['enisim'] : '';
    $rubaslikgel=isset($_POST['ruisim']) ? $_POST['ruisim'] : '';
    $arbaslikgel=isset($_POST['arisim']) ? $_POST['arisim'] : '';
    $frbaslikgel=isset($_POST['frisim']) ? $_POST['frisim'] : '';
    $debaslikgel=isset($_POST['deisim']) ? $_POST['deisim'] : '';
    $cinbaslikgel=isset($_POST['cinisim']) ? $_POST['cinisim'] : '';
    $ustmenual=isset($_POST['ustmenu']) ? $_POST['ustmenu'] : '0';
    $tr_goster=isset($_POST['tr_goster']) ? intval($_POST['tr_goster']) : 1;
    $en_goster=isset($_POST['en_goster']) ? intval($_POST['en_goster']) : 1;
    $ru_goster=isset($_POST['ru_goster']) ? intval($_POST['ru_goster']) : 1;
    $ar_goster=isset($_POST['ar_goster']) ? intval($_POST['ar_goster']) : 1;
    $de_goster=isset($_POST['de_goster']) ? intval($_POST['de_goster']) : 1;
    $fr_goster=isset($_POST['fr_goster']) ? intval($_POST['fr_goster']) : 1;
    $cin_goster=isset($_POST['cin_goster']) ? intval($_POST['cin_goster']) : 1;
    $idnedir=isset($_POST['guncelleme']) ? intval($_POST['guncelleme']) : 0;
    
$detay = 'UPDATE genel_kategori 
SET 
anakategori= :anakategorial,
tr_isim= :trisimal,
en_isim= :enisimal,
ru_isim= :ruisimal,
ar_isim= :arisimal,
fr_isim= :frisimal,
de_isim= :deisimal,
cin_isim= :cinisimal,
ust_menu= :ustmenu,
tr_goster= :tr_goster,
en_goster= :en_goster,
ru_goster= :ru_goster,
ar_goster= :ar_goster,
de_goster= :de_goster,
fr_goster= :fr_goster,
cin_goster= :cin_goster,
tr_seo_title=:trseotitle,
tr_seo_description=:trseodescription,
en_seo_title=:enseotitle,
en_seo_description=:enseodescription,
ru_seo_title=:ruseotitle,
ru_seo_description=:ruseodescription,
ar_seo_title=:arseotitle,
ar_seo_description=:arseodescription,
fr_seo_title=:frseotitle,
fr_seo_description=:frseodescription,
de_seo_title=:deseotitle,
de_seo_description=:deseodescription,
cin_seo_title=:cinseotitle,
cin_seo_description=:cinseodescription
WHERE id= :idal';     
$detayveri= guncel($detay, $baglan); 
$detayveri->bindValue(':anakategorial',$anakategori, PDO::PARAM_INT);     
$detayveri->bindValue(':trisimal',$trbaslikgel, PDO::PARAM_STR);  
$detayveri->bindValue(':enisimal',$enbaslikgel, PDO::PARAM_STR);
$detayveri->bindValue(':ruisimal',$rubaslikgel, PDO::PARAM_STR);
$detayveri->bindValue(':arisimal',$arbaslikgel, PDO::PARAM_STR);
$detayveri->bindValue(':frisimal',$frbaslikgel, PDO::PARAM_STR);
$detayveri->bindValue(':deisimal',$debaslikgel, PDO::PARAM_STR);
$detayveri->bindValue(':cinisimal',$cinbaslikgel, PDO::PARAM_STR);
$detayveri->bindValue(':ustmenu',$ustmenual, PDO::PARAM_INT);
$detayveri->bindValue(':tr_goster',$tr_goster, PDO::PARAM_INT);
$detayveri->bindValue(':en_goster',$en_goster, PDO::PARAM_INT);
$detayveri->bindValue(':ru_goster',$ru_goster, PDO::PARAM_INT);
$detayveri->bindValue(':ar_goster',$ar_goster, PDO::PARAM_INT);
$detayveri->bindValue(':de_goster',$de_goster, PDO::PARAM_INT);
$detayveri->bindValue(':fr_goster',$fr_goster, PDO::PARAM_INT);
$detayveri->bindValue(':cin_goster',$cin_goster, PDO::PARAM_INT);
$detayveri->bindValue(':idal', $idnedir, PDO::PARAM_INT);
$detayveri->bindValue(':trseotitle',$trseotitle, PDO::PARAM_STR);
$detayveri->bindValue(':trseodescription',$trseodescription, PDO::PARAM_STR);
$detayveri->bindValue(':enseotitle',$enseotitle, PDO::PARAM_STR);
$detayveri->bindValue(':enseodescription',$enseodescription, PDO::PARAM_STR);
$detayveri->bindValue(':ruseotitle',$ruseotitle, PDO::PARAM_STR);
$detayveri->bindValue(':ruseodescription',$ruseodescription, PDO::PARAM_STR);
$detayveri->bindValue(':arseotitle',$arseotitle, PDO::PARAM_STR);
$detayveri->bindValue(':arseodescription',$arseodescription, PDO::PARAM_STR);
$detayveri->bindValue(':frseotitle',$frseotitle, PDO::PARAM_STR);
$detayveri->bindValue(':frseodescription',$frseodescription, PDO::PARAM_STR);
$detayveri->bindValue(':deseotitle',$deseotitle, PDO::PARAM_STR);
$detayveri->bindValue(':deseodescription',$deseodescription, PDO::PARAM_STR);
$detayveri->bindValue(':cinseotitle',$cinseotitle, PDO::PARAM_STR);
$detayveri->bindValue(':cinseodescription',$cinseodescription, PDO::PARAM_STR);  
$detayveri->execute();     
    
    
}
     
  if($detayveri)  {echo "<script type='text/javascript'> 
     jQuery(document).ready(function() {
                     if (typeof jQuery.gritter !== 'undefined') {
                         jQuery.gritter.add({
                                title: 'BİLGİ!',
                                text: 'İşleminiz Gerçekleştirilmiştir.',
                          class_name: 'growl-success',
                           time: '2000',
                           
                         });
                     }
                     // Popup pencerede isek ana sayfayı yenile ve pencereyi kapat
                     if (window.opener && !window.opener.closed) {
                         window.opener.location.reload();
                         setTimeout(function() {
                             window.close();
                         }, 1500);
                     } else {
                         // Normal sayfada isek sayfayı yenile
                         setTimeout(function() {
                             location.reload();
                         }, 1500);
                     }
   
              }); 
   
</script>";}  else {echo "<script type='text/javascript'> 
     jQuery(document).ready(function() {
                     jQuery.gritter.add({
                            title: 'Hata!',
                            text: 'İşleminiz Gerçekleştirilemedi.',
                      class_name: 'growl-danger',
                       time: '3000',
                       
                     });
              }); 
       
</script>";}     
 
 
  $baglan = null;?>
 
 