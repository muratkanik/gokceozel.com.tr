<?php
// İletişim formu için captcha görseli
// Session başlat (sadece bir kez)
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// PNG olarak çıktıla
header('Content-type: image/png');
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');

// Rastgele 5 haneli kod oluştur
$numText = '0123456789';
$randomKod = substr(str_shuffle($numText), 0, 5);

// Session'a kaydet
$_SESSION['contact_captcha'] = $randomKod;

// Resmi oluştur (120x40)
$resim = imagecreate(120, 40);

// Renkler
$siyah = imagecolorallocate($resim, 2, 2, 2);  // Arkaplan (koyu)
$beyaz = imagecolorallocate($resim, 255, 255, 255);  // Yazı rengi
$gri = imagecolorallocate($resim, 150, 150, 150);  // Çizgi rengi

// Font dosyası kontrolü
$font = __DIR__ . '/../yonetim/css/a.ttf';
$font_exists = file_exists($font);

if ($font_exists) {
    // Font varsa TTF kullan
    imagettftext($resim, 18, rand(-15, 15), 15, 28, $beyaz, $font, $randomKod);
} else {
    // Font yoksa built-in font kullan
    imagestring($resim, 5, 15, 12, $randomKod, $beyaz);
}

// Gürültü çizgileri ekle
for($i = 0; $i < 5; $i++) {
    imageline($resim, rand(1, 50), rand(6, 20), rand(100, 121), rand(1, 41), $gri);
}

// Gürültü noktaları ekle
for($i = 0; $i < 50; $i++) {
    imagesetpixel($resim, rand(1, 119), rand(1, 39), $gri);
}

// Resmi çıktıla
imagepng($resim);

// Hafızayı temizle (PHP 8.5+ için deprecated ama zararsız)
@imagedestroy($resim);
?>

