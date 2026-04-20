<?php
// fix_remote.php
// Bu dosyayı sunucuda ana dizine (public_html) yükleyin ve tarayıcıdan çalıştırın:
// http://siteadresi.com/fix_remote.php

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Remote Translation Fix</title>
    <style>
        body { font-family: sans-serif; padding: 20px; background: #f0f0f0; }
        .box { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); max-width: 800px; margin: 0 auto; }
        .log { background: #333; color: #0f0; padding: 15px; border-radius: 5px; font-family: monospace; height: 400px; overflow-y: auto; }
        h1 { margin-top: 0; }
        .success { color: #2ecc71; }
        .error { color: #e74c3c; }
        .info { color: #3498db; }
    </style>
</head>
<body>
<div class="box">
    <h1>🔧 Remote Translation Fixer</h1>
    <div class="log">
<?php
// Hata raporlamayı aç
error_reporting(E_ALL);
ini_set('display_errors', 1);

function logMsg($msg, $type = 'info') {
    $icon = 'ℹ️';
    if ($type === 'success') $icon = '✅';
    if ($type === 'error') $icon = '❌';
    echo "<div class='$type'>$icon $msg</div>";
    flush(); 
    ob_flush();
}

// 1. Veritabanı Bağlantısı
logMsg("Veritabanı bağlantısı yapılıyor...", 'info');
// Try to locate baglan.php relative to this file
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
    logMsg("Bağlantı dosyası bulundu: " . basename($baglan_file), 'info');
    require_once $baglan_file;
} else {
    logMsg("baglan.php bulunamadı! Lütfen dosya yolunu veya dosya konumunu kontrol edin.", 'error');
    exit;
}

if (!isset($baglan) || !$baglan instanceof PDO) {
    if (isset($db)) { // Some older scripts used $db
         $baglan = $db;
    } else {
        logMsg("Veritabanı bağlantı değişkeni (\$baglan) başlatılamadı.", 'error');
        exit;
    }
}

logMsg("Bağlantı başarılı.", 'success');

// 2. Charset Ayarı
try {
    $baglan->exec("SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci'");
    $baglan->exec("SET CHARACTER SET utf8mb4");
    logMsg("Charset utf8mb4 olarak ayarlandı.", 'success');
} catch (PDOException $e) {
    logMsg("Charset ayarlanamadı: " . $e->getMessage(), 'error');
}

// 3. Eksik Anahtarların Eklenmesi
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

logMsg("Eksik anahtarlar kontrol ediliyor (" . count($missingKeys) . " adet)...", 'info');
$count_added = 0;

$sql = "INSERT INTO dil_cevirileri (anahtar, tr, en, ru, ar, de, fr, cin) VALUES (:anahtar, :tr, :en, :tr, :tr, :en, :en, :en) 
        ON DUPLICATE KEY UPDATE tr = VALUES(tr)"; // Basit bir update ile anahtarın varlığını garantiliyoruz

$stmt = $baglan->prepare($sql);

foreach ($missingKeys as $key => $vals) {
    try {
        $stmt->execute([
            ':anahtar' => $key,
            ':tr' => $vals['tr'],
            ':en' => $vals['en']
        ]);
        $count_added++;
    } catch (PDOException $e) {
        logMsg("Hata ($key): " . $e->getMessage(), 'error');
    }
}
logMsg("Tüm anahtarlar işlendi.", 'success');

// 4. Bozuk Karakterlerin Düzeltilmesi
$fixes = [
    'btn_detay' => 'Detaylı Bilgi',
    'cookie_mesaj' => 'Bu web sitesi size en iyi deneyimi sunabilmek için çerezleri kullanır.',
    'footer_telif' => 'Tüm hakları saklıdır.',
    'menu_hakkimda' => 'Hakkımda',
    'menu_iletisim' => 'İletişim'
];

logMsg("Bozuk karakterli eski anahtarlar düzeltiliyor (" . count($fixes) . " adet)...", 'info');
$update_stmt = $baglan->prepare("UPDATE dil_cevirileri SET tr = :val WHERE anahtar = :key");
$count_fixed = 0;

foreach ($fixes as $key => $val) {
    try {
        $update_stmt->execute([':key' => $key, ':val' => $val]);
        if ($update_stmt->rowCount() > 0) {
            logMsg("Düzeltildi: $key", 'success');
            $count_fixed++;
        }
    } catch (PDOException $e) {
        logMsg("Hata ($key düzeltme): " . $e->getMessage(), 'error');
    }
}

if ($count_fixed == 0) {
    logMsg("Bu adımda herhangi bir değişiklik yapılmadı (zaten güncel olabilir).", 'info');
} else {
    logMsg("$count_fixed kayıt güncellendi.", 'success');
}

logMsg("🏁 İŞLEM TAMAMLANDI. Lütfen sitenizi kontrol edin.", 'success');
?>
    </div>
    <p style="text-align:center; color: #7f8c8d; font-size: 0.9em;">Güvenlik için işlemden sonra bu dosyayı FTP'den siliniz.</p>
</div>
</body>
</html>
