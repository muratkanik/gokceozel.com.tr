<?php
/**
 * PRODUCTION MIGRATION SCRIPT
 *
 * Bu script canlı sunucuda çalıştırılmalıdır
 * URL: https://gokceozel.com.tr/migration/apply_to_production.php
 */

// Güvenlik: Sadece belirli IP'lerden erişime izin ver (isteğe bağlı)
// $allowed_ips = ['YOUR_IP_HERE'];
// if (!in_array($_SERVER['REMOTE_ADDR'], $allowed_ips)) {
//     die('❌ Erişim engellendi!');
// }

?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Migration - Prof. Dr. Gökçe Özel</title>
    <style>
        body {
            font-family: 'Courier New', monospace;
            background: #1e1e1e;
            color: #00ff00;
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        .container {
            background: #000;
            border: 2px solid #00ff00;
            border-radius: 10px;
            padding: 30px;
        }
        h1 {
            color: #00ff00;
            text-align: center;
            border-bottom: 2px solid #00ff00;
            padding-bottom: 20px;
        }
        .status {
            margin: 20px 0;
            padding: 15px;
            background: #1a1a1a;
            border-left: 5px solid #00ff00;
        }
        .success {
            color: #00ff00;
        }
        .error {
            color: #ff0000;
            border-left-color: #ff0000;
        }
        .warning {
            color: #ffaa00;
            border-left-color: #ffaa00;
        }
        .command {
            background: #2a2a2a;
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
            font-size: 14px;
        }
        .summary {
            margin-top: 30px;
            padding: 20px;
            background: #0a3d0a;
            border-radius: 10px;
        }
        pre {
            background: #2a2a2a;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 DATABASE MIGRATION - PRODUCTION</h1>

<?php
// Veritabanı bağlantısı
require_once '../yonetim/baglanti/baglan.php';

echo "<div class='status'><strong>✅ Veritabanına bağlanıldı:</strong> " . $db . "</div>";

// Migration dosyaları
$migrations = [
    '01_add_slug_columns.sql',
    '02_create_seo_scoring_system.sql'
];

$results = [];
$total_success = 0;
$total_error = 0;

foreach ($migrations as $migration_file) {
    $file_path = __DIR__ . '/' . $migration_file;

    echo "<div class='status'>";
    echo "<h3>📄 Migration: $migration_file</h3>";

    if (!file_exists($file_path)) {
        echo "<p class='error'>❌ Dosya bulunamadı: $file_path</p>";
        echo "</div>";
        $total_error++;
        continue;
    }

    // SQL dosyasını oku
    $sql = file_get_contents($file_path);

    // SQL komutlarını ayır
    $statements = array_filter(
        array_map('trim', explode(';', $sql)),
        function($stmt) {
            return !empty($stmt) && !preg_match('/^--/', $stmt) && !preg_match('/^\/\*/', $stmt);
        }
    );

    echo "<p>📊 Toplam " . count($statements) . " SQL komutu bulundu</p>";
    echo "<div class='command'>";

    try {
        $baglan->beginTransaction();

        $executed = 0;
        $warnings = 0;

        foreach ($statements as $statement) {
            if (!empty(trim($statement))) {
                try {
                    $baglan->exec($statement);
                    $executed++;
                } catch (PDOException $e) {
                    // Kolon/tablo zaten varsa uyarı ver, devam et
                    if (strpos($e->getMessage(), 'already exists') !== false ||
                        strpos($e->getMessage(), 'Duplicate column') !== false) {
                        echo "<span class='warning'>⚠️  " . substr($e->getMessage(), 0, 150) . "...</span><br>";
                        $warnings++;
                        continue;
                    }
                    throw $e;
                }
            }
        }

        $baglan->commit();
        echo "</div>";
        echo "<p class='success'>✅ Başarılı! $executed komut uygulandı, $warnings uyarı</p>";
        echo "</div>";
        $total_success++;

    } catch (Exception $e) {
        $baglan->rollBack();
        echo "</div>";
        echo "<p class='error'>❌ HATA: " . $e->getMessage() . "</p>";
        echo "</div>";
        $total_error++;
    }
}

// Özet
echo "<div class='summary'>";
echo "<h2>📊 MIGRATION SONUÇLARI</h2>";
echo "<p><strong class='success'>✅ Başarılı:</strong> $total_success</p>";
echo "<p><strong class='error'>❌ Hatalı:</strong> $total_error</p>";
echo "<p><strong>📁 Toplam:</strong> " . count($migrations) . "</p>";
echo "</div>";

if ($total_error === 0) {
    echo "<div class='status success'>";
    echo "<h3>🎉 TÜM MIGRATION'LAR BAŞARILI!</h3>";
    echo "<p>Şimdi slug'lar oluşturuluyor...</p>";
    echo "</div>";

    // Slug generation'ı include et
    echo "<div class='status'>";
    echo "<h3>🔧 SLUG OLUŞTURMA</h3>";
    include __DIR__ . '/generate_slugs_production.php';
    echo "</div>";

    echo "<div class='summary success'>";
    echo "<h2>✨ SİSTEM HAZIR!</h2>";
    echo "<p>Tüm migration'lar ve slug'lar başarıyla oluşturuldu!</p>";
    echo "<h3>📋 Sonraki Adımlar:</h3>";
    echo "<ul>";
    echo "<li>✅ Yeni dosyaları FTP ile yükleyin (baglanti/seo_analyzer.php, url_helpers.php, vb.)</li>";
    echo "<li>✅ .htaccess dosyasını güncelleyin</li>";
    echo "<li>✅ Yönetim panelini test edin: <a href='/yonetim/login.php' style='color:#00ff00'>/yonetim/login.php</a></li>";
    echo "<li>✅ SEO dashboard'u kontrol edin: <a href='/yonetim/seo-dashboard.php' style='color:#00ff00'>/yonetim/seo-dashboard.php</a></li>";
    echo "</ul>";
    echo "<h3>⚠️  GÜVENLİK:</h3>";
    echo "<p style='color:#ff0000'><strong>ÖNEMLİ:</strong> Bu dosyayı sunucudan silin veya erişimi engelleyin!</p>";
    echo "</div>";
} else {
    echo "<div class='status error'>";
    echo "<h3>⚠️  HATALAR VAR!</h3>";
    echo "<p>Lütfen yukarıdaki hataları kontrol edin ve düzeltin.</p>";
    echo "</div>";
}
?>
    </div>
</body>
</html>
