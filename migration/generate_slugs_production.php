<?php
/**
 * Production Slug Generator
 * Çalışan sunucuda mevcut içerikler için slug oluşturur
 */

// Eğer başka bir script tarafından çağrılmıyorsa, bağlantıyı yükle
if (!isset($baglan)) {
    require_once '../yonetim/baglanti/baglan.php';
}

/**
 * Türkçe karakterleri değiştir ve slug oluştur
 */
function generate_slug($text) {
    if (empty($text)) return '';

    $text = mb_strtolower($text, 'UTF-8');

    // Türkçe karakter dönüşümleri
    $turkish = ['ı', 'ğ', 'ü', 'ş', 'ö', 'ç', 'İ', 'Ğ', 'Ü', 'Ş', 'Ö', 'Ç'];
    $english = ['i', 'g', 'u', 's', 'o', 'c', 'i', 'g', 'u', 's', 'o', 'c'];
    $text = str_replace($turkish, $english, $text);

    // Özel karakterleri temizle
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s-]+/', '-', $text);
    $text = trim($text, '-');

    return substr($text, 0, 100);
}

try {
    $languages = ['tr', 'en', 'ru', 'ar', 'de', 'fr', 'cin'];

    // 1. İCERİK TABLOSU (icerik)
    echo "<p><strong>📝 İçerik slug'ları oluşturuluyor...</strong></p>";

    $query = "SELECT id, tr_baslik, en_baslik, ru_baslik, ar_baslik, de_baslik, fr_baslik, cin_baslik FROM icerik WHERE durum='1'";
    $stmt = $baglan->query($query);
    $contents = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $updated_count = 0;
    foreach ($contents as $content) {
        $slugs = [];

        foreach ($languages as $lang) {
            $baslik_col = $lang . '_baslik';
            $slug_col = $lang . '_slug';

            if (!empty($content[$baslik_col])) {
                $slug = generate_slug($content[$baslik_col]);
                if (!empty($slug)) {
                    $slugs[$slug_col] = $slug;
                }
            }
        }

        if (!empty($slugs)) {
            $set_clauses = [];
            foreach ($slugs as $col => $value) {
                $set_clauses[] = "$col = :$col";
            }

            $update_sql = "UPDATE icerik SET " . implode(', ', $set_clauses) . " WHERE id = :id";
            $update_stmt = $baglan->prepare($update_sql);

            foreach ($slugs as $col => $value) {
                $update_stmt->bindValue(":$col", $value);
            }
            $update_stmt->bindValue(':id', $content['id']);
            $update_stmt->execute();

            $updated_count++;
        }
    }

    echo "<p class='success'>✅ $updated_count içerik güncellendi</p>";

    // 2. KATEGORİ TABLOSU (genel_kategori)
    echo "<p><strong>📂 Kategori slug'ları oluşturuluyor...</strong></p>";

    $query = "SELECT id, tr_isim, en_isim, ru_isim, ar_isim, de_isim, fr_isim, cin_isim FROM genel_kategori WHERE durum='1'";
    $stmt = $baglan->query($query);
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $updated_count = 0;
    foreach ($categories as $category) {
        $slugs = [];

        foreach ($languages as $lang) {
            $isim_col = $lang . '_isim';
            $slug_col = $lang . '_slug';

            if (!empty($category[$isim_col])) {
                $slug = generate_slug($category[$isim_col]);
                if (!empty($slug)) {
                    $slugs[$slug_col] = $slug;
                }
            }
        }

        if (!empty($slugs)) {
            $set_clauses = [];
            foreach ($slugs as $col => $value) {
                $set_clauses[] = "$col = :$col";
            }

            $update_sql = "UPDATE genel_kategori SET " . implode(', ', $set_clauses) . " WHERE id = :id";
            $update_stmt = $baglan->prepare($update_sql);

            foreach ($slugs as $col => $value) {
                $update_stmt->bindValue(":$col", $value);
            }
            $update_stmt->bindValue(':id', $category['id']);
            $update_stmt->execute();

            $updated_count++;
        }
    }

    echo "<p class='success'>✅ $updated_count kategori güncellendi</p>";

    echo "<p class='success'><strong>🎉 TÜM SLUG'LAR OLUŞTURULDU!</strong></p>";

} catch (Exception $e) {
    echo "<p class='error'>❌ SLUG HATASI: " . $e->getMessage() . "</p>";
}
?>
