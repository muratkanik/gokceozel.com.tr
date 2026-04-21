<?php
header('Content-Type: text/html; charset=utf-8');
include("baglanti/baglan.php");

echo "<h3>Veritabanı Sütun Ekleme İşlemi</h3>";

$columns = [
    'tr_goster', 'en_goster', 'ru_goster', 'ar_goster', 'de_goster', 'fr_goster', 'cin_goster'
];

foreach ($columns as $col) {
    try {
        // Kolon var mı kontrol et
        $check = $baglan->query("SHOW COLUMNS FROM genel_kategori LIKE '$col'");
        if($check->rowCount() == 0) {
            // Yoksa ekle
            $sql = "ALTER TABLE genel_kategori ADD $col int(11) DEFAULT 1";
            $baglan->exec($sql);
            echo "✅ $col eklendi.<br>";
        } else {
            echo "ℹ️ $col zaten var.<br>";
        }
    } catch(PDOException $e) {
        echo "❌ Hata ($col): " . $e->getMessage() . "<br>";
    }
}

echo "<hr><h3>İşlem Tamamlandı.</h3>";
?>
