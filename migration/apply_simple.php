<?php
/**
 * SIMPLE PRODUCTION MIGRATION
 * Her komut tek tek çalıştırılır, hata olursa devam edilir
 */
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Simple Migration</title>
    <style>
        body { font-family: monospace; background: #1e1e1e; color: #00ff00; padding: 20px; }
        .success { color: #00ff00; }
        .error { color: #ff0000; }
        .warning { color: #ffaa00; }
        .command { background: #2a2a2a; padding: 10px; margin: 10px 0; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>🔧 SIMPLE MIGRATION</h1>

<?php
require_once '../yonetim/baglanti/baglan.php';

echo "<p class='success'>✅ Database: " . $db . "</p>";

// ADIM 1: Slug kolonlarını ekle - ICERIK tablosu
echo "<h2>📝 ADIM 1: İçerik Tablosuna Slug Kolonları Ekleniyor</h2>";

$slug_columns = ['tr', 'en', 'ru', 'ar', 'de', 'fr', 'cin'];

foreach ($slug_columns as $lang) {
    $col = $lang . '_slug';
    $baslik_col = $lang . '_baslik';

    echo "<div class='command'>";
    echo "Kolon: $col<br>";

    try {
        // Önce kolon var mı kontrol et
        $check = $baglan->query("SHOW COLUMNS FROM icerik LIKE '$col'");
        if ($check->rowCount() > 0) {
            echo "<span class='warning'>⚠️  Kolon zaten var, atlanıyor</span>";
        } else {
            $sql = "ALTER TABLE icerik ADD COLUMN $col VARCHAR(255) DEFAULT NULL AFTER $baslik_col";
            $baglan->exec($sql);
            echo "<span class='success'>✅ Oluşturuldu</span>";
        }
    } catch (Exception $e) {
        echo "<span class='error'>❌ " . $e->getMessage() . "</span>";
    }

    // Index ekle
    try {
        $idx_name = "idx_$col";
        $check_idx = $baglan->query("SHOW INDEX FROM icerik WHERE Key_name = '$idx_name'");
        if ($check_idx->rowCount() > 0) {
            echo " <span class='warning'>(Index zaten var)</span>";
        } else {
            $sql = "ALTER TABLE icerik ADD INDEX $idx_name ($col)";
            $baglan->exec($sql);
            echo " <span class='success'>(Index eklendi)</span>";
        }
    } catch (Exception $e) {
        echo " <span class='warning'>(Index hatası: " . substr($e->getMessage(), 0, 50) . ")</span>";
    }

    echo "</div>";
}

// ADIM 2: Slug kolonlarını ekle - GENEL_KATEGORI tablosu
echo "<h2>📂 ADIM 2: Kategori Tablosuna Slug Kolonları Ekleniyor</h2>";

foreach ($slug_columns as $lang) {
    $col = $lang . '_slug';
    $isim_col = $lang . '_isim';

    echo "<div class='command'>";
    echo "Kolon: $col<br>";

    try {
        $check = $baglan->query("SHOW COLUMNS FROM genel_kategori LIKE '$col'");
        if ($check->rowCount() > 0) {
            echo "<span class='warning'>⚠️  Kolon zaten var, atlanıyor</span>";
        } else {
            $sql = "ALTER TABLE genel_kategori ADD COLUMN $col VARCHAR(255) DEFAULT NULL AFTER $isim_col";
            $baglan->exec($sql);
            echo "<span class='success'>✅ Oluşturuldu</span>";
        }
    } catch (Exception $e) {
        echo "<span class='error'>❌ " . $e->getMessage() . "</span>";
    }

    // Index ekle
    try {
        $idx_name = "idx_$col";
        $check_idx = $baglan->query("SHOW INDEX FROM genel_kategori WHERE Key_name = '$idx_name'");
        if ($check_idx->rowCount() > 0) {
            echo " <span class='warning'>(Index zaten var)</span>";
        } else {
            $sql = "ALTER TABLE genel_kategori ADD INDEX $idx_name ($col)";
            $baglan->exec($sql);
            echo " <span class='success'>(Index eklendi)</span>";
        }
    } catch (Exception $e) {
        echo " <span class='warning'>(Index hatası)</span>";
    }

    echo "</div>";
}

// ADIM 3: SEO Tabloları oluştur
echo "<h2>🎯 ADIM 3: SEO Scoring Tabloları Oluşturuluyor</h2>";

// seo_scores tablosu
echo "<div class='command'>";
echo "Tablo: seo_scores<br>";
try {
    $check = $baglan->query("SHOW TABLES LIKE 'seo_scores'");
    if ($check->rowCount() > 0) {
        echo "<span class='warning'>⚠️  Tablo zaten var</span>";
    } else {
        $sql = "CREATE TABLE seo_scores (
            id INT AUTO_INCREMENT PRIMARY KEY,
            page_type ENUM('homepage', 'service_detail', 'blog_detail', 'services_list', 'blog_list', 'contact', 'about') NOT NULL,
            content_id INT DEFAULT NULL,
            language_code VARCHAR(10) NOT NULL,
            url_path VARCHAR(500) DEFAULT NULL,
            title_score INT DEFAULT 0,
            description_score INT DEFAULT 0,
            keywords_score INT DEFAULT 0,
            content_quality_score INT DEFAULT 0,
            url_score INT DEFAULT 0,
            image_optimization_score INT DEFAULT 0,
            internal_links_score INT DEFAULT 0,
            readability_score INT DEFAULT 0,
            total_score INT DEFAULT 0,
            score_grade ENUM('A+', 'A', 'B', 'C', 'D', 'F') DEFAULT 'F',
            word_count INT DEFAULT 0,
            reading_time INT DEFAULT 0,
            h1_count INT DEFAULT 0,
            h2_count INT DEFAULT 0,
            image_count INT DEFAULT 0,
            internal_link_count INT DEFAULT 0,
            external_link_count INT DEFAULT 0,
            meta_data TEXT DEFAULT NULL,
            last_analyzed TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_content_id (content_id),
            INDEX idx_language (language_code),
            INDEX idx_total_score (total_score),
            INDEX idx_page_type (page_type)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        $baglan->exec($sql);
        echo "<span class='success'>✅ Oluşturuldu</span>";
    }
} catch (Exception $e) {
    echo "<span class='error'>❌ " . substr($e->getMessage(), 0, 200) . "</span>";
}
echo "</div>";

// SEO diğer tablolar için basit yaklaşım
$seo_tables = [
    'seo_keywords' => "CREATE TABLE seo_keywords (
        id INT AUTO_INCREMENT PRIMARY KEY,
        keyword VARCHAR(255) NOT NULL,
        language_code VARCHAR(10) NOT NULL,
        search_volume INT DEFAULT 0,
        difficulty INT DEFAULT 0,
        current_rank INT DEFAULT NULL,
        target_rank INT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_keyword (keyword),
        INDEX idx_language (language_code)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    'seo_audit_log' => "CREATE TABLE seo_audit_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        audit_type ENUM('full_site', 'single_page', 'category', 'language') NOT NULL,
        pages_analyzed INT DEFAULT 0,
        total_score_avg DECIMAL(5,2) DEFAULT 0.00,
        audit_details TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    'seo_recommendations' => "CREATE TABLE seo_recommendations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content_id INT DEFAULT NULL,
        language_code VARCHAR(10) NOT NULL,
        recommendation_type ENUM('critical', 'important', 'minor', 'suggestion') NOT NULL,
        category VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        is_resolved TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP NULL DEFAULT NULL,
        INDEX idx_content (content_id),
        INDEX idx_resolved (is_resolved)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
];

foreach ($seo_tables as $table_name => $create_sql) {
    echo "<div class='command'>";
    echo "Tablo: $table_name<br>";
    try {
        $check = $baglan->query("SHOW TABLES LIKE '$table_name'");
        if ($check->rowCount() > 0) {
            echo "<span class='warning'>⚠️  Zaten var</span>";
        } else {
            $baglan->exec($create_sql);
            echo "<span class='success'>✅ Oluşturuldu</span>";
        }
    } catch (Exception $e) {
        echo "<span class='error'>❌ " . substr($e->getMessage(), 0, 200) . "</span>";
    }
    echo "</div>";
}

// SEO Rules tablosu ve data insert
echo "<div class='command'>";
echo "Tablo: seo_rules<br>";
try {
    $check = $baglan->query("SHOW TABLES LIKE 'seo_rules'");
    if ($check->rowCount() > 0) {
        echo "<span class='warning'>⚠️  Zaten var</span>";
    } else {
        $sql = "CREATE TABLE seo_rules (
            id INT AUTO_INCREMENT PRIMARY KEY,
            rule_name VARCHAR(100) NOT NULL,
            category VARCHAR(50) NOT NULL,
            weight DECIMAL(5,2) NOT NULL,
            min_value INT DEFAULT NULL,
            max_value INT DEFAULT NULL,
            optimal_value INT DEFAULT NULL,
            is_active TINYINT(1) DEFAULT 1,
            description TEXT DEFAULT NULL,
            INDEX idx_category (category),
            INDEX idx_active (is_active)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        $baglan->exec($sql);
        echo "<span class='success'>✅ Oluşturuldu</span><br>";

        // Insert rules
        $rules_sql = file_get_contents(__DIR__ . '/seo_rules_data.sql');
        if ($rules_sql) {
            $baglan->exec($rules_sql);
            echo "<span class='success'>22 SEO kuralı eklendi</span>";
        }
    }
} catch (Exception $e) {
    echo "<span class='error'>❌ " . substr($e->getMessage(), 0, 200) . "</span>";
}
echo "</div>";

// ADIM 4: Slug'ları oluştur
echo "<h2>🔧 ADIM 4: Slug Oluşturma</h2>";
include __DIR__ . '/generate_slugs_production.php';

echo "<h2 class='success'>🎉 MİGRATION TAMAMLANDI!</h2>";
echo "<p>Lütfen sistemi test edin ve sonra migration klasörünü silin.</p>";
?>
</body>
</html>
