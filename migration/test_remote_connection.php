#!/usr/bin/env php
<?php
/**
 * Remote Sunucu Bağlantı Testi
 *
 * KULLANIM:
 * php migration/test_remote_connection.php
 *
 * Bu script:
 * - Remote sunucuya bağlantıyı test eder
 * - Veritabanı bilgilerini gösterir
 * - Mevcut tabloları listeler
 * - Migration için hazır mı kontrol eder
 */

echo "\n========================================\n";
echo "🔍 REMOTE SUNUCU BAĞLANTI TESTİ\n";
echo "========================================\n\n";

// Remote bağlantıyı yükle
require_once __DIR__ . '/../site_backup/public_html/baglanti/baglan_remote.php';

try {
    // 1. Veritabanı versiyonu
    $version = $baglan_remote->query('SELECT VERSION()')->fetchColumn();
    echo "✅ MySQL Versiyonu: $version\n\n";

    // 2. Veritabanı adı
    $dbname = $baglan_remote->query('SELECT DATABASE()')->fetchColumn();
    echo "✅ Aktif Veritabanı: $dbname\n\n";

    // 3. Karakter seti
    $charset = $baglan_remote->query("SELECT @@character_set_database")->fetchColumn();
    $collation = $baglan_remote->query("SELECT @@collation_database")->fetchColumn();
    echo "✅ Karakter Seti: $charset ($collation)\n\n";

    // 4. Tabloları listele
    echo "📋 Mevcut Tablolar:\n";
    $tables = $baglan_remote->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
    foreach ($tables as $table) {
        // Satır sayısını al
        $count = $baglan_remote->query("SELECT COUNT(*) FROM `$table`")->fetchColumn();
        echo "   - $table ($count satır)\n";
    }
    echo "\n";

    // 5. Kritik tabloları kontrol et
    echo "🔍 Kritik Tablo Kontrolü:\n";

    $required_tables = ['icerik', 'genel_kategori', 'kullanicilar'];
    $missing_tables = [];

    foreach ($required_tables as $table) {
        if (in_array($table, $tables)) {
            echo "   ✅ $table - Mevcut\n";
        } else {
            echo "   ❌ $table - Eksik!\n";
            $missing_tables[] = $table;
        }
    }
    echo "\n";

    // 6. Slug kolonlarını kontrol et
    echo "🔍 Slug Kolonları Kontrolü:\n";

    $slug_check = $baglan_remote->query("SHOW COLUMNS FROM icerik LIKE '%slug%'")->fetchAll();
    if (empty($slug_check)) {
        echo "   ⚠️  Slug kolonları YOK - Migration gerekli\n";
    } else {
        echo "   ✅ Slug kolonları MEVCUT (Zaten uygulanmış)\n";
        foreach ($slug_check as $col) {
            echo "      - " . $col['Field'] . "\n";
        }
    }
    echo "\n";

    // 7. SEO tabloları kontrol et
    echo "🔍 SEO Tabloları Kontrolü:\n";

    $seo_tables = ['seo_scores', 'seo_rules', 'seo_keywords', 'seo_audit_log', 'seo_recommendations'];
    $missing_seo = [];

    foreach ($seo_tables as $table) {
        if (in_array($table, $tables)) {
            $count = $baglan_remote->query("SELECT COUNT(*) FROM `$table`")->fetchColumn();
            echo "   ✅ $table - Mevcut ($count satır)\n";
        } else {
            echo "   ⚠️  $table - YOK (Migration gerekli)\n";
            $missing_seo[] = $table;
        }
    }
    echo "\n";

    // 8. Sonuç
    echo "========================================\n";
    echo "📊 SONUÇ\n";
    echo "========================================\n";

    if (!empty($missing_tables)) {
        echo "❌ UYARI: Kritik tablolar eksik!\n";
        echo "   Eksik tablolar: " . implode(', ', $missing_tables) . "\n";
        echo "   Lütfen veritabanını kontrol edin.\n\n";
        exit(1);
    }

    if (empty($slug_check) || !empty($missing_seo)) {
        echo "⚠️  Migration gerekli!\n";
        echo "   Çalıştırın: php migration/apply_to_remote.php\n\n";
    } else {
        echo "✅ Veritabanı hazır!\n";
        echo "   Tüm migration'lar zaten uygulanmış.\n\n";
    }

} catch (Exception $e) {
    echo "❌ BAĞLANTI HATASI!\n";
    echo "Hata: " . $e->getMessage() . "\n\n";
    echo "Lütfen kontrol edin:\n";
    echo "1. site_backup/public_html/baglanti/baglan_remote.php dosyasındaki bilgiler doğru mu?\n";
    echo "2. Remote sunucuya erişim var mı?\n";
    echo "3. Veritabanı kullanıcısının yetkileri yeterli mi?\n\n";
    exit(1);
}
?>
