<?php
/**
 * Arapça karakterleri doğru şekilde düzeltme scripti
 * Veritabanındaki double-encoded UTF-8 karakterleri düzeltir
 */

header('Content-Type: text/html; charset=utf-8');
mb_internal_encoding('UTF-8');

require 'site_backup/baglanti/baglan.php';

function fix_arabic_correct($text) {
    if (empty($text)) {
        return $text;
    }
    
    // Eğer double-encoded UTF-8 karakterleri varsa (Ø-ÿ aralığı)
    if (preg_match('/[Ø-ÿ]/', $text)) {
        // UTF-8 string'i ISO-8859-1 byte'larına çevir, sonra UTF-8 olarak decode et
        // Bu, double-encoded karakterleri düzeltir
        $bytes = [];
        $len = strlen($text);
        for ($i = 0; $i < $len; $i++) {
            $bytes[] = ord($text[$i]);
        }
        
        // ISO-8859-1 byte'larını UTF-8 string'e çevir
        $iso_string = '';
        foreach ($bytes as $byte) {
            $iso_string .= chr($byte);
        }
        
        // ISO-8859-1 string'i UTF-8'e decode et
        $decoded = @iconv('ISO-8859-1', 'UTF-8//IGNORE', $iso_string);
        if ($decoded !== false && $decoded !== $text && mb_check_encoding($decoded, 'UTF-8')) {
            return $decoded;
        }
    }
    
    return $text;
}

echo "Arapça karakterler düzeltiliyor (doğru yöntem)...\n\n";

// Test
$test = 'Ø§Ù„ØµÙØ­Ø©';
$fixed_test = fix_arabic_correct($test);
echo "Test:\n";
echo "  Orijinal: $test\n";
echo "  Düzeltilmiş: $fixed_test\n\n";

// genel_kategori tablosundaki Arapça alanları düzelt
$stmt = $baglan->query("SELECT id, ar_isim FROM genel_kategori WHERE ar_isim IS NOT NULL");
$count = 0;

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $original = $row['ar_isim'];
    $fixed = fix_arabic_correct($original);
    
    if ($fixed !== $original && !empty($fixed) && mb_check_encoding($fixed, 'UTF-8')) {
        // Önce test et
        echo "ID {$row['id']}: Test ediliyor...\n";
        echo "  Orijinal: $original\n";
        echo "  Düzeltilmiş: $fixed\n";
        
        // Kullanıcı onayı için bekle (şimdilik sadece göster)
        // $update = $baglan->prepare("UPDATE genel_kategori SET ar_isim = ? WHERE id = ?");
        // $update->execute([$fixed, $row['id']]);
        echo "  (Güncelleme yapılmadı - test modu)\n\n";
        $count++;
    }
}

echo "\nToplam test edilen kayıt: $count\n";
echo "\nNOT: Bu script sadece test modunda çalışıyor.\n";
echo "Güncelleme yapmak için script içindeki yorum satırlarını kaldırın.\n";

