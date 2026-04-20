<?php
// Migration: Apply AI Settings
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

echo "<h3>Veritabanı Güncelleme: AI Ayarları</h3>";

// Simplified definitions without AFTER to avoid "Column not found" errors
$columns = [
    'ai_provider' => "ENUM('openai', 'gemini') DEFAULT 'openai'",
    'openai_api_key' => "VARCHAR(255) DEFAULT NULL",
    'gemini_api_key' => "VARCHAR(255) DEFAULT NULL",
    'ai_model' => "VARCHAR(50) DEFAULT 'gpt-4o'"
];

// Check current columns
$current_columns = [];
try {
    $q = $baglan->query("SHOW COLUMNS FROM ayarlar");
    while($row = $q->fetch(PDO::FETCH_ASSOC)) {
        $current_columns[] = $row['Field'];
    }
} catch (PDOException $e) {
    die("Tablo okuma hatası: " . $e->getMessage());
}

echo "<ul>";
foreach ($columns as $col => $def) {
    if (!in_array($col, $current_columns)) {
        try {
            $sql = "ALTER TABLE ayarlar ADD COLUMN $col $def";
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
?>
