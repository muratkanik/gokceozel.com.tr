<?php
// Migration: Add SEO Title and Description Columns for All Languages
// Usage: Upload to yonetim/ directory and run.

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Connect to Database
if (file_exists("baglan.php")) {
    include("baglan.php");
} elseif (file_exists("baglanti/baglan.php")) {
    include("baglanti/baglan.php");
} else {
    try {
        $baglan = new PDO("mysql:host=localhost;dbname=eyalcin_seo;charset=utf8", "eyalcin_seo", "Gokce135246");
        $baglan->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch(PDOException $e) {
        die("Bağlantı Hatası: " . $e->getMessage());
    }
}

echo "<h3>Veritabanı Güncelleme: SEO Kolonları</h3>";

$columns_to_add = [
    // English
    'en_seo_title' => 'VARCHAR(255) DEFAULT NULL AFTER en_detay',
    'en_seo_description' => 'TEXT DEFAULT NULL AFTER en_seo_title',
    // Russian
    'ru_seo_title' => 'VARCHAR(255) DEFAULT NULL AFTER ru_detay',
    'ru_seo_description' => 'TEXT DEFAULT NULL AFTER ru_seo_title',
    // Arabic
    'ar_seo_title' => 'VARCHAR(255) DEFAULT NULL AFTER ar_detay',
    'ar_seo_description' => 'TEXT DEFAULT NULL AFTER ar_seo_title',
    // French
    'fr_seo_title' => 'VARCHAR(255) DEFAULT NULL AFTER fr_detay',
    'fr_seo_description' => 'TEXT DEFAULT NULL AFTER fr_seo_title',
    // German
    'de_seo_title' => 'VARCHAR(255) DEFAULT NULL AFTER de_detay',
    'de_seo_description' => 'TEXT DEFAULT NULL AFTER de_seo_title',
    // Chinese
    'cin_seo_title' => 'VARCHAR(255) DEFAULT NULL AFTER cin_detay',
    'cin_seo_description' => 'TEXT DEFAULT NULL AFTER cin_seo_title',
];

// Check current columns
$current_columns = [];
$q = $baglan->query("SHOW COLUMNS FROM icerik");
while($row = $q->fetch(PDO::FETCH_ASSOC)) {
    $current_columns[] = $row['Field'];
}

echo "<ul>";
foreach ($columns_to_add as $col => $def) {
    if (!in_array($col, $current_columns)) {
        try {
            $sql = "ALTER TABLE icerik ADD COLUMN $col $def";
            $baglan->exec($sql);
            echo "<li style='color:green;'>Eklendi: <b>$col</b></li>";
        } catch (PDOException $e) {
            echo "<li style='color:red;'>Hata ($col): " . $e->getMessage() . "</li>";
        }
    } else {
        echo "<li style='color:blue;'>Zaten var: <b>$col</b></li>";
    }
}
echo "</ul>";

echo "<hr>";
echo "<div class='alert alert-success'>İşlem Tamamlandı.</div>";
echo "<p><a href='fill_seo_content.php'>Şimdi SEO İçeriklerini Doldur >></a></p>";
?>
