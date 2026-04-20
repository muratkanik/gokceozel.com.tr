<?php
/**
 * Generate SEO-friendly slugs from existing content
 * Run once to populate slug columns
 */

require_once __DIR__ . '/../site_backup/public_html/baglanti/baglan.php';

// Function to generate URL-friendly slug
function generate_slug($text, $lang = 'tr') {
    if (empty($text)) return '';

    // Convert to lowercase
    $text = mb_strtolower($text, 'UTF-8');

    // Turkish character replacements
    $turkish = ['ı', 'ğ', 'ü', 'ş', 'ö', 'ç', 'İ', 'Ğ', 'Ü', 'Ş', 'Ö', 'Ç'];
    $english = ['i', 'g', 'u', 's', 'o', 'c', 'i', 'g', 'u', 's', 'o', 'c'];
    $text = str_replace($turkish, $english, $text);

    // Russian/Cyrillic transliteration
    $cyrillic = ['а','б','в','г','д','е','ё','ж','з','и','й','к','л','м','н','о','п','р','с','т','у','ф','х','ц','ч','ш','щ','ъ','ы','ь','э','ю','я'];
    $latin = ['a','b','v','g','d','e','yo','zh','z','i','y','k','l','m','n','o','p','r','s','t','u','f','h','ts','ch','sh','sch','','y','','e','yu','ya'];
    $text = str_replace($cyrillic, $latin, $text);

    // Arabic/Chinese - use simple transliteration or numbering
    if ($lang === 'ar' || $lang === 'cin') {
        // For Arabic/Chinese, we'll use a combination of category and ID
        return 'content-' . time() . '-' . rand(1000, 9999);
    }

    // Remove special characters
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);

    // Replace whitespace with hyphens
    $text = preg_replace('/[\s-]+/', '-', $text);

    // Trim hyphens from ends
    $text = trim($text, '-');

    // Limit length
    if (strlen($text) > 100) {
        $text = substr($text, 0, 100);
        $text = substr($text, 0, strrpos($text, '-'));
    }

    return $text;
}

// Ensure slug is unique
function ensure_unique_slug($baglan, $table, $slug, $lang, $current_id = null) {
    $slug_col = $lang . '_slug';
    $original_slug = $slug;
    $counter = 1;

    while (true) {
        $check_query = "SELECT id FROM $table WHERE $slug_col = :slug";
        if ($current_id) {
            $check_query .= " AND id != :current_id";
        }

        $stmt = $baglan->prepare($check_query);
        $stmt->bindValue(':slug', $slug, PDO::PARAM_STR);
        if ($current_id) {
            $stmt->bindValue(':current_id', $current_id, PDO::PARAM_INT);
        }
        $stmt->execute();

        if ($stmt->rowCount() == 0) {
            return $slug;
        }

        $slug = $original_slug . '-' . $counter;
        $counter++;
    }
}

echo "=== Slug Generation Started ===\n\n";

// Generate slugs for icerik table
echo "Processing ICERIK table...\n";

$query = "SELECT id, tr_baslik, en_baslik, ru_baslik, ar_baslik, de_baslik, fr_baslik, cin_baslik FROM icerik WHERE durum='1'";
$stmt = $baglan->query($query);
$content_items = $stmt->fetchAll(PDO::FETCH_ASSOC);

$processed = 0;
$skipped = 0;

foreach ($content_items as $item) {
    $id = $item['id'];
    $slugs = [];

    // Generate slug for each language
    $languages = ['tr', 'en', 'ru', 'ar', 'de', 'fr', 'cin'];
    foreach ($languages as $lang) {
        $baslik_col = $lang . '_baslik';
        $slug_col = $lang . '_slug';

        if (!empty($item[$baslik_col])) {
            $slug = generate_slug($item[$baslik_col], $lang);
            $slug = ensure_unique_slug($baglan, 'icerik', $slug, $lang, $id);
            $slugs[$slug_col] = $slug;
        }
    }

    // Update record with slugs
    if (!empty($slugs)) {
        $set_parts = [];
        foreach ($slugs as $col => $value) {
            $set_parts[] = "$col = :$col";
        }

        $update_query = "UPDATE icerik SET " . implode(', ', $set_parts) . " WHERE id = :id";
        $update_stmt = $baglan->prepare($update_query);

        foreach ($slugs as $col => $value) {
            $update_stmt->bindValue(":$col", $value, PDO::PARAM_STR);
        }
        $update_stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $update_stmt->execute();

        $processed++;
        echo "✓ Content ID $id: " . implode(', ', array_values($slugs)) . "\n";
    } else {
        $skipped++;
    }
}

echo "\nICERIK: Processed $processed items, skipped $skipped\n\n";

// Generate slugs for genel_kategori table
echo "Processing GENEL_KATEGORI table...\n";

$query = "SELECT id, tr_isim, en_isim, ru_isim, ar_isim, de_isim, fr_isim, cin_isim FROM genel_kategori WHERE durum='1'";
$stmt = $baglan->query($query);
$categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

$processed = 0;
$skipped = 0;

foreach ($categories as $cat) {
    $id = $cat['id'];
    $slugs = [];

    // Generate slug for each language
    $languages = ['tr', 'en', 'ru', 'ar', 'de', 'fr', 'cin'];
    foreach ($languages as $lang) {
        $isim_col = $lang . '_isim';
        $slug_col = $lang . '_slug';

        if (!empty($cat[$isim_col])) {
            $slug = generate_slug($cat[$isim_col], $lang);
            $slug = ensure_unique_slug($baglan, 'genel_kategori', $slug, $lang, $id);
            $slugs[$slug_col] = $slug;
        }
    }

    // Update record with slugs
    if (!empty($slugs)) {
        $set_parts = [];
        foreach ($slugs as $col => $value) {
            $set_parts[] = "$col = :$col";
        }

        $update_query = "UPDATE genel_kategori SET " . implode(', ', $set_parts) . " WHERE id = :id";
        $update_stmt = $baglan->prepare($update_query);

        foreach ($slugs as $col => $value) {
            $update_stmt->bindValue(":$col", $value, PDO::PARAM_STR);
        }
        $update_stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $update_stmt->execute();

        $processed++;
        echo "✓ Category ID $id: " . implode(', ', array_values($slugs)) . "\n";
    } else {
        $skipped++;
    }
}

echo "\nGENEL_KATEGORI: Processed $processed items, skipped $skipped\n\n";

echo "=== Slug Generation Completed ===\n";
?>
