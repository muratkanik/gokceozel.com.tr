<?php
header('Content-Type: text/html; charset=utf-8');
mb_internal_encoding('UTF-8');
// Yerel veritabanı ayarları
$sunucu='127.0.0.1';
$dbkullanici='root';
$dbsifre='root';
$db='gokceozel_local';
$port=3306;

try {
// PHP 8.5+ uyumluluğu: INIT_COMMAND'ı constructor'dan çıkarıp exec() ile çalıştırıyoruz
// UTF-8 ve Arapça karakter desteği için utf8mb4 kullanıyoruz
$baglan = new PDO("mysql:host=$sunucu;port=$port;dbname=$db;charset=utf8mb4", $dbkullanici, $dbsifre);
$baglan->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$baglan->exec("SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci'");
$baglan->exec("SET CHARACTER SET utf8mb4");
$baglan->exec("SET CHARSET 'utf8mb4'");
}catch(PDOException $e) {
 die( $e->getMessage());
}

?>

