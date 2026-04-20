<?php
/**
 * Arapça karakterleri düzeltme scripti v2
 * Triple-encoded UTF-8 karakterleri düzeltir
 */

header('Content-Type: text/html; charset=utf-8');
mb_internal_encoding('UTF-8');

require 'site_backup/baglanti/baglan.php';

function fix_arabic_text_v2($text) {
    if (empty($text)) {
        return $text;
    }
    
    // Eğer double/triple-encoded UTF-8 karakterleri varsa düzelt
    if (preg_match('/[Ø-ÿ]/', $text)) {
        // İlk decode: UTF-8 -> ISO-8859-1
        $step1 = @iconv('UTF-8', 'ISO-8859-1//IGNORE', $text);
        if ($step1 !== false && $step1 !== $text) {
            // İkinci decode: Tekrar UTF-8 -> ISO-8859-1 (eğer hala sorunlu ise)
            if (preg_match('/[Ø-ÿ]/', $step1)) {
                $step2 = @iconv('UTF-8', 'ISO-8859-1//IGNORE', $step1);
                if ($step2 !== false && $step2 !== $step1 && mb_check_encoding($step2, 'UTF-8')) {
                    return $step2;
                }
            }
            // İlk decode başarılı ve geçerli UTF-8 ise
            if (mb_check_encoding($step1, 'UTF-8') && !preg_match('/[Ø-ÿ]/', $step1)) {
                return $step1;
            }
        }
    }
    
    return $text;
}

echo "Arapça karakterler düzeltiliyor (v2)...\n\n";

// genel_kategori tablosundaki Arapça alanları düzelt
$stmt = $baglan->query("SELECT id, ar_isim FROM genel_kategori WHERE ar_isim IS NOT NULL");
$count = 0;

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $original = $row['ar_isim'];
    $fixed = fix_arabic_text_v2($original);
    
    if ($fixed !== $original && !empty($fixed)) {
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
    $ar_baslik = $row['ar_baslik'] ?? '';
    $ar_icerik = $row['ar_icerik'] ?? '';
    $ar_detay = $row['ar_detay'] ?? '';
    
    $fixed_baslik = fix_arabic_text_v2($ar_baslik);
    $fixed_icerik = fix_arabic_text_v2($ar_icerik);
    $fixed_detay = fix_arabic_text_v2($ar_detay);
    
    if (($fixed_baslik !== $ar_baslik && !empty($fixed_baslik)) || 
        ($fixed_icerik !== $ar_icerik && !empty($fixed_icerik)) || 
        ($fixed_detay !== $ar_detay && !empty($fixed_detay))) {
        $update = $baglan->prepare("UPDATE icerik SET ar_baslik = ?, ar_icerik = ?, ar_detay = ? WHERE id = ?");
        $update->execute([$fixed_baslik ?: $ar_baslik, $fixed_icerik ?: $ar_icerik, $fixed_detay ?: $ar_detay, $row['id']]);
        echo "İçerik ID {$row['id']}: Düzeltildi\n";
        $count2++;
    }
}

echo "\nToplam düzeltilen kayıt:\n";
echo "  Kategori: $count\n";
echo "  İçerik: $count2\n";
echo "\nTamamlandı!\n";

