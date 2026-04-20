<?php
// CANLI SUNUCU BAGLANTISI
// Bu dosya baglanti/baglan.php olarak yuklenecek
$sunucu = 'localhost'; 
$dbkullanici = 'eyalcin_gokceozel'; // Check if this matches baglan_remote.php
$dbsifre = 'Gokce.135246'; // Check if this matches baglan_remote.php
$db = 'eyalcin_gokceozel'; 
$port = 3306;

try {
    $baglan = new PDO("mysql:host=$sunucu;port=$port;dbname=$db;charset=utf8mb4", $dbkullanici, $dbsifre);
    $baglan->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $baglan->exec("SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci'");
    $baglan->exec("SET CHARACTER SET utf8mb4");
    $baglan->exec("SET CHARSET 'utf8mb4'");
} catch(PDOException $e) {
    // Production'da hata detayini gizlemek daha guvenli olabilir ama su an debug icin acik birakiyoruz
    die("Veritabani Baglanti Hatasi: " . $e->getMessage());
}
?>
