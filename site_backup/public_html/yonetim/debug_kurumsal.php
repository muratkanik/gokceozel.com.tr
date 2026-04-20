<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
include("baglan.php");
// Same query as kurumsal.php
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
$hkb = $baglan->prepare($hk);
$hkb->execute(); 
$hkl = $hkb->fetch(PDO::FETCH_ASSOC);

echo "<pre>";
print_r($hkl);
echo "</pre>";
?>
