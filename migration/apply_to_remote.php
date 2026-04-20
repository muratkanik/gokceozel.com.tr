#!/usr/bin/env php
<?php
/**
 * Remote Sunucuya Migration Uygulama Script
 *
 * KULLANIM:
 * 1. baglanti/baglan_remote.php dosyasındaki bilgileri doldurun
 * 2. Terminal'den çalıştırın: php migration/apply_to_remote.php
 *
 * Bu script:
 * - Remote sunucuya bağlanır
 * - Tüm migration dosyalarını sırayla uygular
 * - Her adımı raporlar
 * - Hata durumunda rollback yapar
 */

echo "\n========================================\n";
echo "🚀 REMOTE SUNUCU MIGRATION BAŞLATILIYOR\n";
echo "========================================\n\n";

// Remote bağlantıyı yükle
require_once __DIR__ . '/../site_backup/public_html/baglanti/baglan_remote.php';

// Migration dosyalarının listesi (SIRAYLA UYGULANIR!)
$migrations = [
    '01_add_slug_columns.sql',
    '02_create_seo_scoring_system.sql'
];

$success_count = 0;
$error_count = 0;

foreach ($migrations as $migration_file) {
    $file_path = __DIR__ . '/' . $migration_file;

    echo "📄 Migration: $migration_file\n";

    if (!file_exists($file_path)) {
        echo "   ❌ Dosya bulunamadı: $file_path\n\n";
        $error_count++;
        continue;
    }

    // SQL dosyasını oku
    $sql = file_get_contents($file_path);

    // SQL komutlarını ayır (noktalı virgül ile)
    $statements = array_filter(
        array_map('trim', explode(';', $sql)),
        function($stmt) {
            // Boş satırları ve sadece yorum satırlarını atla
            return !empty($stmt) && !preg_match('/^--/', $stmt);
        }
    );

    echo "   📊 Toplam " . count($statements) . " SQL komutu bulundu\n";

    try {
        $baglan_remote->beginTransaction();

        $executed = 0;
        foreach ($statements as $statement) {
            if (!empty(trim($statement))) {
                // DROP IF EXISTS veya ALTER komutlarında hata olabilir, bunları yakalayalım
                try {
                    $baglan_remote->exec($statement);
                    $executed++;
                } catch (PDOException $e) {
                    // Eğer tablo/kolon zaten varsa, bu normal
                    if (strpos($e->getMessage(), 'already exists') !== false ||
                        strpos($e->getMessage(), 'Duplicate column') !== false) {
                        echo "   ⚠️  Uyarı: " . substr($e->getMessage(), 0, 100) . "...\n";
                        continue;
                    }
                    throw $e; // Diğer hataları yukarı fırlat
                }
            }
        }

        $baglan_remote->commit();
        echo "   ✅ Başarılı! $executed komut uygulandı\n\n";
        $success_count++;

    } catch (Exception $e) {
        $baglan_remote->rollBack();
        echo "   ❌ HATA: " . $e->getMessage() . "\n\n";
        $error_count++;

        // Kritik hata durumunda dur
        echo "⛔ Kritik hata! Migration durduruluyor.\n";
        echo "Lütfen hatayı düzeltin ve tekrar deneyin.\n\n";
        exit(1);
    }
}

// Sonuç raporu
echo "========================================\n";
echo "📊 MIGRATION SONUÇLARI\n";
echo "========================================\n";
echo "✅ Başarılı: $success_count\n";
echo "❌ Hatalı: $error_count\n";
echo "📁 Toplam: " . count($migrations) . "\n\n";

if ($error_count === 0) {
    echo "🎉 Tüm migration'lar başarıyla uygulandı!\n\n";

    // Slug'ları generate et
    echo "🔧 Şimdi slug'ları oluşturuluyor...\n\n";
    require_once __DIR__ . '/generate_slugs_remote.php';

} else {
    echo "⚠️  Bazı migration'lar uygulanamadı. Lütfen hataları kontrol edin.\n\n";
    exit(1);
}

echo "✨ Remote sunucu hazır!\n\n";
?>
