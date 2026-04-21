<?php
// Session başlat (sadece bir kez)
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// PNG olarak çıktıla
header('Content-type: image/png');

// Rastgele 5 haneli kod oluştur
$numText = '0123456789';
$randomKod = substr(str_shuffle($numText), 0, 5);

// Session'a kaydet
$_SESSION['guvenlik'] = $randomKod;

// Resmi oluştur (100x35)
$resim = imagecreate(100, 35);

// Renkler
$siyah = imagecolorallocate($resim, 2, 2, 2);  // Arkaplan (koyu)
$beyaz = imagecolorallocate($resim, 255, 255, 255);  // Yazı rengi
$gri = imagecolorallocate($resim, 150, 150, 150);  // Çizgi rengi

// Font dosyası kontrolü
$font = __DIR__ . '/css/a.ttf';
$font_exists = file_exists($font);

if ($font_exists) {
    // Font varsa TTF kullan
    imagettftext($resim, 20, -10, 10, 25, $beyaz, $font, $randomKod);
} else {
    // Font yoksa built-in font kullan
    imagestring($resim, 5, 10, 10, $randomKod, $beyaz);
}

// Gürültü çizgileri ekle
for($i = 0; $i < 5; $i++) {
    imageline($resim, rand(1, 40), rand(6, 20), rand(100, 151), rand(1, 51), $gri);
}

// Resmi çıktıla
imagepng($resim);

// Hafızayı temizle (PHP 8.5+ için deprecated ama zararsız)
@imagedestroy($resim);

?>
