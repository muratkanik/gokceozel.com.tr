<?php
/**
 * Content Save Handler
 * Handles multi-language content creation and updates
 */
session_start();
require_once '../baglanti/baglan.php';
require_once '../baglanti/seo_analyzer.php';

if (!isset($_SESSION['user_id'])) {
    die(json_encode(['error' => 'Unauthorized']));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die('Invalid request method');
}

$content_id = $_POST['content_id'] ?? null;
$action = $_POST['action'] ?? 'save';

// Function to generate slug from title
function generate_slug($text) {
    if (empty($text)) return '';

    $text = mb_strtolower($text, 'UTF-8');

    // Turkish character replacements
    $turkish = ['ı', 'ğ', 'ü', 'ş', 'ö', 'ç'];
    $english = ['i', 'g', 'u', 's', 'o', 'c'];
    $text = str_replace($turkish, $english, $text);

    // Remove special characters
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s-]+/', '-', $text);
    $text = trim($text, '-');

    return substr($text, 0, 100);
}

try {
    $baglan->beginTransaction();

    $languages = ['tr', 'en', 'ru', 'ar', 'de', 'fr', 'cin'];

    // Prepare data
    $data = [
        'kategori' => $_POST['kategori'],
        'durum' => $_POST['durum'] ?? '1',
        'guncelleme_yapan_kullanici' => $_SESSION['user_id'],
        'guncelleme_tarihi' => date('Y-m-d H:i:s')
    ];

    // Process each language
    foreach ($languages as $lang) {
        $data[$lang . '_baslik'] = $_POST[$lang . '_baslik'] ?? '';
        $data[$lang . '_seo_title'] = $_POST[$lang . '_seo_title'] ?? '';
        $data[$lang . '_seo_description'] = $_POST[$lang . '_seo_description'] ?? '';
        $data[$lang . '_icerik'] = $_POST[$lang . '_icerik'] ?? '';
        $data[$lang . '_detay'] = $_POST[$lang . '_detay'] ?? '';

        // Auto-generate slug if not provided
        $slug = $_POST[$lang . '_slug'] ?? '';
        if (empty($slug) && !empty($data[$lang . '_baslik'])) {
            $slug = generate_slug($data[$lang . '_baslik']);
        }
        $data[$lang . '_slug'] = $slug;
    }

    if ($content_id) {
        // UPDATE existing content
        $fields = [];
        foreach ($data as $key => $value) {
            $fields[] = "$key = :$key";
        }

        $sql = "UPDATE icerik SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $baglan->prepare($sql);

        foreach ($data as $key => $value) {
            $stmt->bindValue(":$key", $value);
        }
        $stmt->bindValue(':id', $content_id);
        $stmt->execute();

        $saved_id = $content_id;
        $message = 'İçerik başarıyla güncellendi!';

    } else {
        // INSERT new content
        $data['kayit_yapan_kullanici'] = $_SESSION['user_id'];
        $data['kayit_tarihi'] = date('Y-m-d H:i:s');
        $data['eskayit'] = uniqid() . time();

        $fields = array_keys($data);
        $placeholders = array_map(function($field) { return ":$field"; }, $fields);

        $sql = "INSERT INTO icerik (" . implode(', ', $fields) . ")
                VALUES (" . implode(', ', $placeholders) . ")";

        $stmt = $baglan->prepare($sql);

        foreach ($data as $key => $value) {
            $stmt->bindValue(":$key", $value);
        }
        $stmt->execute();

        $saved_id = $baglan->lastInsertId();
        $message = 'Yeni içerik başarıyla oluşturuldu!';
    }

    // Run SEO analysis if requested
    if ($action === 'save_analyze') {
        $analyzer = new SEOAnalyzer($baglan);

        // Get saved content
        $content_query = "SELECT * FROM icerik WHERE id = :id";
        $content_stmt = $baglan->prepare($content_query);
        $content_stmt->execute([':id' => $saved_id]);
        $content = $content_stmt->fetch(PDO::FETCH_ASSOC);

        // Analyze for each language
        foreach ($languages as $lang) {
            $lang_upper = strtoupper($lang);
            if (!empty($content[$lang . '_baslik'])) {
                $analyzer = new SEOAnalyzer($baglan, $lang_upper);
                $analyzer->analyzePage('service_detail', $content, '');
            }
        }

        $message .= ' SEO analizi tamamlandı!';
    }

    $baglan->commit();

    // Redirect back to edit page with success message
    header("Location: content-edit.php?id=$saved_id&success=" . urlencode($message));
    exit;

} catch (Exception $e) {
    $baglan->rollBack();

    // Redirect with error message
    $error = 'Kayıt sırasında hata oluştu: ' . $e->getMessage();
    header("Location: content-edit.php" . ($content_id ? "?id=$content_id" : "?new=1") . "&error=" . urlencode($error));
    exit;
}
?>
