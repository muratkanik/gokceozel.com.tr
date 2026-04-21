<?php session_start();
// oturumu başlatalım
session_start();
 
// png olarak çıktılayalım
header('Content-type: image/png');
 
// yazımızın fontu .ttf cinsinden
 $font = 'C:\Inetpub\\home\eyalcin\web\eyalcin.com\public_html\css\a.ttf';
 
// rastgele karıştırılacak olan string oluşturuyoruz
$numText = '0123456789';
//$numText = '0123456789abcdefghijklmnopqrstuvwxyz';

// rastgele 5 karakterden oluşan kod oluşturuluyor
$randomKod = substr(str_shuffle($numText),0,5);
 
// Resmi oluşturalım
$resim = imagecreate(100, 35);
 
// arkaplanı beyaz yapalım
$siyah = imagecolorallocate($resim, 2, 2, 2);
 
// yazıyı siyah yapalım
$beyaz = imagecolorallocate($resim, 255, 255, 255);
 
// rastgele oluşturulan metni session'a aktarıyoruz
$_SESSION['guvenlik'] = $randomKod;
 
// Resme yazıyı yazalım
imagettftext($resim, 20, -10, 10, 25, $beyaz, $font, $_SESSION['guvenlik']);
 
for($i = 0; $i < 5; $i++) {
imageline($resim , rand(1,40), rand(6,20), rand(100,151), rand(1,51), $beyaz);
}
 
// resmi çıktılıyalım
imagepng($resim);
 
// hafızayı boşaltalım
imagedestroy($resim);
 
?>