<?php
/**
 * Remote (Canlı) Sunucu Veritabanı Bağlantısı
 *
 * KULLANIM:
 * Bu dosyayı migration scriptlerinde kullanmak için:
 * require_once 'baglanti/baglan_remote.php';
 * // $baglan_remote değişkeni ile remote sunucuya erişebilirsiniz
 */

// CANLIDA ÇALIŞAN SUNUCU BİLGİLERİ (FTP'den alındı)
$remote_sunucu = 'localhost';             // Hosting üzerinde localhost
$remote_dbkullanici = 'eyalcin_gokceozel'; // Database username
$remote_dbsifre = 'Gokce.135246';         // Database password
$remote_db = 'eyalcin_gokceozel';         // Database name
$remote_port = 3306;

try {
    $baglan_remote = new PDO(
        "mysql:host=$remote_sunucu;port=$remote_port;dbname=$remote_db;charset=utf8mb4",
        $remote_dbkullanici,
        $remote_dbsifre
    );
    $baglan_remote->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $baglan_remote->exec("SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci'");
    $baglan_remote->exec("SET CHARACTER SET utf8mb4");
    $baglan_remote->exec("SET CHARSET 'utf8mb4'");

    echo "✅ Remote sunucuya başarıyla bağlanıldı!\n";

} catch(PDOException $e) {
    die("❌ Remote sunucu bağlantı hatası: " . $e->getMessage() . "\n");
}
?>
