<?php
/**
 * Arapça karakterleri düzeltme scripti
 * Veritabanındaki double-encoded Arapça karakterleri düzeltir
 */

header('Content-Type: text/html; charset=utf-8');
mb_internal_encoding('UTF-8');

require 'site_backup/baglanti/baglan.php';

function fix_arabic_text($text) {
    if (empty($text)) {
        return $text;
    }
    
    // Eğer double-encoded UTF-8 karakterleri varsa düzelt
    if (preg_match('/[Ø-ÿ]/', $text)) {
        // UTF-8'den ISO-8859-1'e decode et
        $decoded = @iconv('UTF-8', 'ISO-8859-1//IGNORE', $text);
        if ($decoded !== false && $decoded !== $text && mb_check_encoding($decoded, 'UTF-8')) {
            return $decoded;
        }
    }
    
    return $text;
}

echo "Arapça karakterler düzeltiliyor...\n\n";

// genel_kategori tablosundaki Arapça alanları düzelt
$stmt = $baglan->query("SELECT id, ar_isim FROM genel_kategori WHERE ar_isim IS NOT NULL");
$count = 0;

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $original = $row['ar_isim'];
    $fixed = fix_arabic_text($original);
    
    if ($fixed !== $original) {
        $update = $baglan->prepare("UPDATE genel_kategori SET ar_isim = ? WHERE id = ?");
        $update->execute([$fixed, $row['id']]);
        echo "ID {$row['id']}: Düzeltildi\n";
        echo "  Orijinal: $original\n";
        echo "  Düzeltilmiş: $fixed\n\n";
        $count++;
    }
}

// icerik tablosundaki Arapça alanları düzelt
$stmt = $baglan->query("SELECT id, ar_baslik, ar_icerik, ar_detay FROM icerik WHERE (ar_baslik IS NOT NULL OR ar_icerik IS NOT NULL OR ar_detay IS NOT NULL)");
$count2 = 0;

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $updated = false;
    $ar_baslik = $row['ar_baslik'];
    $ar_icerik = $row['ar_icerik'];
    $ar_detay = $row['ar_detay'];
    
    $fixed_baslik = fix_arabic_text($ar_baslik);
    $fixed_icerik = fix_arabic_text($ar_icerik);
    $fixed_detay = fix_arabic_text($ar_detay);
    
    if ($fixed_baslik !== $ar_baslik || $fixed_icerik !== $ar_icerik || $fixed_detay !== $ar_detay) {
        $update = $baglan->prepare("UPDATE icerik SET ar_baslik = ?, ar_icerik = ?, ar_detay = ? WHERE id = ?");
        $update->execute([$fixed_baslik, $fixed_icerik, $fixed_detay, $row['id']]);
        echo "İçerik ID {$row['id']}: Düzeltildi\n";
        $count2++;
        $updated = true;
    }
}

echo "\nToplam düzeltilen kayıt:\n";
echo "  Kategori: $count\n";
echo "  İçerik: $count2\n";
echo "\nTamamlandı!\n";

