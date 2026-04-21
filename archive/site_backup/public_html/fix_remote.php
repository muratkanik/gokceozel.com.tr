<?php
// fix_remote.php
// COMPLETE SERVER REPAIR TOOL
// Bu dosyayı sunucuda ana dizine (public_html) yükleyin ve tarayıcıdan çalıştırın:
// http://siteadresi.com/fix_remote.php

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Remote Translation & Schema Repair</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 20px; background: #f0f0f0; line-height: 1.6; }
        .box { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); max-width: 900px; margin: 0 auto; }
        .log { background: #1e1e1e; color: #a9b7c6; padding: 15px; border-radius: 5px; font-family: "JetBrains Mono", monospace; height: 500px; overflow-y: auto; font-size: 13px; }
        h1 { margin-top: 0; color: #333; border-bottom: 2px solid #eee; padding-bottom: 15px; }
        .success { color: #50c878; }
        .error { color: #ff6b6b; }
        .info { color: #61afef; }
        .warning { color: #d19a66; }
        .step { background: #2c2c2c; padding: 8px; margin: 5px 0; border-radius: 4px; border-left: 3px solid #666; }
        .step h3 { margin: 0 0 5px 0; font-size: 14px; color: #fff; }
    </style>
</head>
<body>
<div class="box">
    <h1>🔧 Gökçe Özel - Remote Repair Kit</h1>
    <div class="log">
<?php
// ---------------------------------------------------------------------
// KONFIGURASYON VE YARDIMCI FONKSIYONLAR
// ---------------------------------------------------------------------
error_reporting(E_ALL);
ini_set('display_errors', 1);

function logMsg($msg, $type = 'info', $groupStart = false) {
    $icon = 'ℹ️';
    if ($type === 'success') $icon = '✅';
    if ($type === 'error') $icon = '❌';
    if ($type === 'warning') $icon = '⚠️';
    
    if ($groupStart) {
        echo "<div class='step'><h3>$msg</h3>";
    } else {
        echo "<div class='$type'>$icon $msg</div>";
    }
    
    flush(); 
    ob_flush();
}

function closeGroup() {
    echo "</div>";
    flush(); 
    ob_flush();
}

// ---------------------------------------------------------------------
// 1. VERITABANI BAGLANTISI
// ---------------------------------------------------------------------
logMsg("1. Veritabanı Bağlantısı", 'info', true);

$possible_paths = [
    __DIR__ . '/baglanti/baglan.php',
    __DIR__ . '/yonetim/baglanti/baglan.php',
    dirname(__DIR__) . '/baglanti/baglan.php'
];

$baglan_file = null;
foreach ($possible_paths as $path) {
    if (file_exists($path)) {
        $baglan_file = $path;
        break;
    }
}

if ($baglan_file) {
    logMsg("Dosya bulundu: " . basename($baglan_file), 'success');
    require_once $baglan_file;
} else {
    logMsg("baglan.php bulunamadı! İşlem durduruldu.", 'error');
    closeGroup();
    exit;
}

if (!isset($baglan) || !$baglan instanceof PDO) {
    if (isset($db)) {
         $baglan = $db;
    } else {
        logMsg("\$baglan değişkeni bulunamadı.", 'error');
        closeGroup();
        exit;
    }
}

try {
    $baglan->exec("SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci'");
    $baglan->exec("SET CHARACTER SET utf8mb4");
    logMsg("Karakter seti utf8mb4 olarak ayarlandı.", 'success');
} catch (PDOException $e) {
    logMsg("Karakter seti hatası: " . $e->getMessage(), 'warning');
}
closeGroup();

// ---------------------------------------------------------------------
// 2. DIL CEVIRILERI TABLOSU
// ---------------------------------------------------------------------
logMsg("2. Dil Çevirileri Tablosu", 'info', true);

try {
    $check = $baglan->query("SHOW TABLES LIKE 'dil_cevirileri'");
    
    if ($check->rowCount() == 0) {
        logMsg("Tablo eksik, oluşturuluyor...", 'warning');
        
        $create_sql = "CREATE TABLE `dil_cevirileri` (
          `id` int(11) NOT NULL AUTO_INCREMENT,
          `anahtar` varchar(150) NOT NULL,
          `tr` varchar(999) DEFAULT NULL,
          `en` varchar(999) DEFAULT NULL,
          `ru` varchar(99) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
          `ar` varchar(99) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
          `de` varchar(99) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
          `fr` varchar(99) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
          `cin` varchar(99) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
          `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
          `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          UNIQUE KEY `anahtar` (`anahtar`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
        
        $baglan->exec($create_sql);
        logMsg("Tablo başarıyla oluşturuldu.", 'success');
    } else {
        logMsg("Tablo zaten mevcut.", 'info');
    }
} catch (PDOException $e) {
    logMsg("Kritik Hata: " . $e->getMessage(), 'error');
}

// Anahtarları Ekle
$missingKeys = [
    'banner_bize_guvenin' => ['tr' => 'Bize Güvenin', 'en' => 'Trust Us'],
    'banner_dogru_islem' => ['tr' => 'Doğru İşlem', 'en' => 'Correct Procedure'],
    'btn_ask_question' => ['tr' => 'Soru Sor', 'en' => 'Ask a Question'],
    'btn_hizmetler' => ['tr' => 'Hizmetler', 'en' => 'Services'],
    'btn_more' => ['tr' => 'Devamını Oku', 'en' => 'Read More'],
    'footer_contact' => ['tr' => 'İletişim', 'en' => 'Contact'],
    'footer_rights' => ['tr' => 'Tüm Hakları Saklıdır', 'en' => 'All Rights Reserved'],
    'footer_software' => ['tr' => 'Yazılım', 'en' => 'Software'],
    'header_hizmetler' => ['tr' => 'Hizmetlerimiz', 'en' => 'Our Services'],
    'kvkk_text' => ['tr' => 'KVKK Metni', 'en' => 'GDPR Text'],
    'page_contact_desc' => ['tr' => 'İletişim Açıklaması', 'en' => 'Contact Description'],
    'page_contact_title' => ['tr' => 'İletişim Başlığı', 'en' => 'Contact Title'],
    'section_neler_yapiyoruz' => ['tr' => 'Neler Yapıyoruz?', 'en' => 'What We Do'],
    'service_facial_aesthetics' => ['tr' => 'Yüz Estetiği', 'en' => 'Facial Aesthetics'],
    'service_facial_aesthetics_desc' => ['tr' => 'Yüz estetiği açıklaması...', 'en' => 'Facial aesthetics description...'],
    'service_facial_procedures' => ['tr' => 'Yüz İşlemleri', 'en' => 'Facial Procedures'],
    'service_facial_procedures_desc' => ['tr' => 'Yüz işlemleri açıklaması...', 'en' => 'Facial procedures description...'],
    'service_filling' => ['tr' => 'Dolgu', 'en' => 'Filling'],
    'service_filling_applications' => ['tr' => 'Dolgu Uygulamaları', 'en' => 'Filling Applications'],
    'service_filling_applications_desc' => ['tr' => 'Dolgu uygulamaları açıklaması...', 'en' => 'Filling applications description...'],
    'service_filling_desc' => ['tr' => 'Dolgu açıklaması...', 'en' => 'Filling description...'],
    'service_medical_aesthetic' => ['tr' => 'Medikal Estetik', 'en' => 'Medical Aesthetic'],
    'service_medical_aesthetic_desc' => ['tr' => 'Medikal estetik açıklaması...', 'en' => 'Medical aesthetic description...'],
    'service_non_surgical' => ['tr' => 'Ameliyatsız İşlemler', 'en' => 'Non-Surgical Procedures'],
    'service_non_surgical_desc' => ['tr' => 'Ameliyatsız işlemler açıklaması...', 'en' => 'Non-surgical procedures description...'],
    'sss_bilgi' => ['tr' => 'Bilgi', 'en' => 'Info'],
    'sss_faq' => ['tr' => 'Sıkça Sorulan Sorular', 'en' => 'FAQ'],
];

$sql = "INSERT INTO dil_cevirileri (anahtar, tr, en, ru, ar, de, fr, cin) VALUES (:anahtar, :tr, :en, :tr, :tr, :en, :en, :en) 
        ON DUPLICATE KEY UPDATE tr = VALUES(tr)";
$stmt = $baglan->prepare($sql);
$added = 0;
foreach ($missingKeys as $key => $vals) {
    try {
        $stmt->execute([':anahtar' => $key, ':tr' => $vals['tr'], ':en' => $vals['en']]);
        $added++;
    } catch (PDOException $e) {}
}
logMsg("$added çeviri anahtarı işlendi.", 'success');

// Bozuk Karakterleri Düzelt
$fixes = [
    'btn_detay' => 'Detaylı Bilgi',
    'cookie_mesaj' => 'Bu web sitesi size en iyi deneyimi sunabilmek için çerezleri kullanır.',
    'footer_telif' => 'Tüm hakları saklıdır.',
    'menu_hakkimda' => 'Hakkımda',
    'menu_iletisim' => 'İletişim'
];
$stmt = $baglan->prepare("UPDATE dil_cevirileri SET tr = :val WHERE anahtar = :key");
$fixed = 0;
foreach ($fixes as $key => $val) {
    $stmt->execute([':key' => $key, ':val' => $val]);
    if ($stmt->rowCount() > 0) $fixed++;
}
logMsg("$fixed bozuk karakterli kayıt düzeltildi.", 'success');
closeGroup();

// ---------------------------------------------------------------------
// 3. SLUG KOLONLARI
// ---------------------------------------------------------------------
logMsg("3. Slug Kolonları (Schema Check)", 'info', true);
$slug_langs = ['tr', 'en', 'ru', 'ar', 'de', 'fr', 'cin'];

// Tablo: icerik
foreach ($slug_langs as $lang) {
    $col = $lang . '_slug';
    $after = $lang . '_baslik';
    try {
        $check = $baglan->query("SHOW COLUMNS FROM icerik LIKE '$col'");
        if ($check->rowCount() == 0) {
            $baglan->exec("ALTER TABLE icerik ADD COLUMN $col VARCHAR(255) DEFAULT NULL AFTER $after");
            $baglan->exec("ALTER TABLE icerik ADD INDEX idx_$col ($col)");
            logMsg("icerik.$col kolonu eklendi.", 'success');
        }
    } catch (PDOException $e) { logMsg("Hata icerik.$col: " . $e->getMessage(), 'error'); }
}

// Tablo: genel_kategori
foreach ($slug_langs as $lang) {
    $col = $lang . '_slug';
    $after = $lang . '_isim';
    try {
        $check = $baglan->query("SHOW COLUMNS FROM genel_kategori LIKE '$col'");
        if ($check->rowCount() == 0) {
            $baglan->exec("ALTER TABLE genel_kategori ADD COLUMN $col VARCHAR(255) DEFAULT NULL AFTER $after");
            $baglan->exec("ALTER TABLE genel_kategori ADD INDEX idx_$col ($col)");
            logMsg("genel_kategori.$col kolonu eklendi.", 'success');
        }
    } catch (PDOException $e) { logMsg("Hata genel_kategori.$col: " . $e->getMessage(), 'error'); }
}
closeGroup();

// ---------------------------------------------------------------------
// 4. SEO TABLOLARI
// ---------------------------------------------------------------------
logMsg("4. SEO Tabloları", 'info', true);

$seo_tables = [
    'seo_scores' => "CREATE TABLE IF NOT EXISTS seo_scores (
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
    
    'seo_keywords' => "CREATE TABLE IF NOT EXISTS seo_keywords (
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

    'seo_audit_log' => "CREATE TABLE IF NOT EXISTS seo_audit_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        audit_type ENUM('full_site', 'single_page', 'category', 'language') NOT NULL,
        pages_analyzed INT DEFAULT 0,
        total_score_avg DECIMAL(5,2) DEFAULT 0.00,
        audit_details TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    'seo_recommendations' => "CREATE TABLE IF NOT EXISTS seo_recommendations (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    'seo_rules' => "CREATE TABLE IF NOT EXISTS seo_rules (
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
];

foreach ($seo_tables as $name => $sql) {
    try {
        $baglan->exec($sql);
        logMsg("Tablo kontrol/oluşturma: $name", 'success');
    } catch (PDOException $e) {
        logMsg("Hata $name: " . $e->getMessage(), 'error');
    }
}

// SEO Rules Data Populate
try {
    $count = $baglan->query("SELECT COUNT(*) FROM seo_rules")->fetchColumn();
    if ($count == 0) {
        $insert_rules = "INSERT INTO seo_rules (rule_name, category, weight, min_value, max_value, optimal_value, is_active, description) VALUES
            ('Title Length', 'title', 15.00, 30, 70, 60, 1, 'Optimal title length for SEO'),
            ('Title Has Keywords', 'title', 15.00, NULL, NULL, 1, 1, 'Title should contain target keywords'),
            ('Title Uniqueness', 'title', 15.00, NULL, NULL, 1, 1, 'Title should be unique across site'),
            ('Description Length', 'description', 15.00, 120, 160, 155, 1, 'Optimal meta description length'),
            ('Description Has Keywords', 'description', 15.00, NULL, NULL, 1, 1, 'Description should contain keywords'),
            ('Keyword Density', 'keywords', 10.00, 1, 3, 2, 1, 'Keyword density should be 1-3%'),
            ('Keyword Placement', 'keywords', 10.00, NULL, NULL, 1, 1, 'Keywords in title, h1, first paragraph'),
            ('Content Length', 'content', 20.00, 300, 3000, 1000, 1, 'Optimal content length'),
            ('Content Readability', 'content', 20.00, 60, 100, 70, 1, 'Flesch reading ease score'),
            ('Content Structure', 'content', 20.00, NULL, NULL, 1, 1, 'Proper use of headings'),
            ('Content Freshness', 'content', 20.00, NULL, NULL, 1, 1, 'Recently updated content'),
            ('URL Length', 'url', 10.00, 10, 60, 40, 1, 'Optimal URL length'),
            ('URL Structure', 'url', 10.00, NULL, NULL, 1, 1, 'Clean, descriptive URL structure'),
            ('URL Has Keywords', 'url', 10.00, NULL, NULL, 1, 1, 'URL contains target keywords'),
            ('Image Alt Text', 'images', 10.00, NULL, NULL, 1, 1, 'All images have descriptive alt text'),
            ('Image Optimization', 'images', 10.00, NULL, NULL, 1, 1, 'Images are optimized for web'),
            ('Image Count', 'images', 10.00, 1, 10, 3, 1, 'Optimal number of images'),
            ('Internal Links', 'links', 10.00, 2, 10, 5, 1, 'Number of internal links'),
            ('External Links', 'links', 10.00, 1, 5, 2, 1, 'Number of external links'),
            ('Link Quality', 'links', 10.00, NULL, NULL, 1, 1, 'Links to authoritative sources'),
            ('Readability Score', 'readability', 10.00, 60, 100, 70, 1, 'Flesch reading ease'),
            ('Paragraph Length', 'readability', 10.00, 50, 150, 100, 1, 'Average paragraph length')";
        $baglan->exec($insert_rules);
        logMsg("SEO kuralları eklendi.", 'success');
    }
} catch (PDOException $e) {
    logMsg("Kural ekleme hatası: " . $e->getMessage(), 'warning');
}
closeGroup();

// ---------------------------------------------------------------------
// 5. SLUG GENERATION
// ---------------------------------------------------------------------
logMsg("5. Slug Oluşturma (Auto-Fix)", 'info', true);

function generate_slug($text) {
    if (empty($text)) return '';
    $text = mb_strtolower($text, 'UTF-8');
    $turkish = ['ı', 'ğ', 'ü', 'ş', 'ö', 'ç', 'İ', 'Ğ', 'Ü', 'Ş', 'Ö', 'Ç'];
    $english = ['i', 'g', 'u', 's', 'o', 'c', 'i', 'g', 'u', 's', 'o', 'c'];
    $text = str_replace($turkish, $english, $text);
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s-]+/', '-', $text);
    return substr(trim($text, '-'), 0, 100);
}

// icerik update
$cnt = 0;
$rows = $baglan->query("SELECT * FROM icerik WHERE durum='1' AND (tr_slug IS NULL OR tr_slug = '')")->fetchAll(PDO::FETCH_ASSOC);
foreach ($rows as $row) {
    $updates = [];
    foreach ($slug_langs as $lang) {
        if (!empty($row[$lang.'_baslik'])) {
            $slug = generate_slug($row[$lang.'_baslik']);
            if ($slug) $updates[] = $lang.'_slug = '.$baglan->quote($slug);
        }
    }
    if ($updates) {
        $baglan->exec("UPDATE icerik SET " . implode(', ', $updates) . " WHERE id = " . $row['id']);
        $cnt++;
    }
}
logMsg("$cnt içerik slug'ı güncellendi.", 'success');

// kategori update
$cnt = 0;
$rows = $baglan->query("SELECT * FROM genel_kategori WHERE durum='1' AND (tr_slug IS NULL OR tr_slug = '')")->fetchAll(PDO::FETCH_ASSOC);
foreach ($rows as $row) {
    $updates = [];
    foreach ($slug_langs as $lang) {
        if (!empty($row[$lang.'_isim'])) {
            $slug = generate_slug($row[$lang.'_isim']);
            if ($slug) $updates[] = $lang.'_slug = '.$baglan->quote($slug);
        }
    }
    if ($updates) {
        $baglan->exec("UPDATE genel_kategori SET " . implode(', ', $updates) . " WHERE id = " . $row['id']);
        $cnt++;
    }
}
logMsg("$cnt kategori slug'ı güncellendi.", 'success');
closeGroup();

logMsg("🏁 TÜM İŞLEMLER BAŞARIYLA TAMAMLANDI!", 'success', true);
echo "<p>Artık her şeyin çalıştığını doğruladıktan sonra bu dosyayı siliniz.</p>";
closeGroup();
?>
    </div>
</div>
</body>
</html>
