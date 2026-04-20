<?php
/**
 * Türkçe karakter sorunlarını düzeltme scripti
 * PHP dosyalarının başına encoding header'ları ekler
 */

$public_html_dir = __DIR__ . '/site_backup/public_html';
$yonetim_dir = __DIR__ . '/site_backup/yonetim';

function addEncodingHeader($file) {
    $content = file_get_contents($file);
    
    // Zaten header varsa atla
    if (strpos($content, "mb_internal_encoding") !== false || 
        strpos($content, "Content-Type: text/html; charset") !== false) {
        return false;
    }
    
    // <?php satırını bul
    if (preg_match('/^<\?php\s*\n/', $content, $matches)) {
        $header = "<?php\nheader('Content-Type: text/html; charset=utf-8');\nmb_internal_encoding('UTF-8');\n";
        $newContent = preg_replace('/^<\?php\s*\n/', $header, $content);
        file_put_contents($file, $newContent);
        return true;
    }
    
    return false;
}

$files = [];
$files = array_merge($files, glob($public_html_dir . '/*.php'));
$files = array_merge($files, glob($yonetim_dir . '/*.php'));

$count = 0;
foreach ($files as $file) {
    if (addEncodingHeader($file)) {
        $count++;
        echo "Düzeltildi: " . basename($file) . "\n";
    }
}

echo "\nToplam $count dosya düzeltildi.\n";

