<?php
set_time_limit(0);
error_reporting(E_ALL);
ini_set('display_errors', 1);

require(__DIR__ . '/site_backup/public_html/baglanti/baglan.php');

function sifre_coz($data) {
    if (empty($data)) return '';
    $encryption_key = '6e5y7a1l6c3i2n3';
    $ciphering = "AES-128-CTR"; 
    $options = 0; 
    $decryption_iv = '1234567891011121'; 
    return openssl_decrypt($data, $ciphering, $encryption_key, $options, $decryption_iv); 
}

require(__DIR__ . '/site_backup/public_html/yonetim/classes/AIService.php');

function sorgu($sql, $baglan) {
    return $baglan->prepare($sql);
}

function veriliste($stmt) {
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

$ayarlar = "SELECT gemini_api_key, ai_provider, ai_model, openai_api_key FROM ayarlar LIMIT 1"; 
$ayarlarb = sorgu($ayarlar, $baglan); 
$ayarlarb->execute();
$ayarlarl = veriliste($ayarlarb);

$provider = !empty($ayarlarl['ai_provider']) ? $ayarlarl['ai_provider'] : 'gemini';
if ($provider == 'gemini') {
    $apiKey = sifre_coz($ayarlarl['gemini_api_key']);
} else {
    $apiKey = sifre_coz($ayarlarl['openai_api_key']);
}
$model = !empty($ayarlarl['ai_model']) ? $ayarlarl['ai_model'] : null;

$aiService = new AIService($provider, $apiKey, $model);

$langs = ['en' => 'en', 'ru' => 'ru', 'de' => 'de', 'fr' => 'fr', 'ar' => 'ar'];

$sql = "SELECT id, tr_baslik, tr_icerik, tr_detay, tr_seo_title, tr_seo_description, en_baslik, en_icerik, ru_baslik, ru_icerik, de_baslik, de_icerik, fr_baslik, fr_icerik, ar_baslik, ar_icerik FROM icerik ORDER BY id DESC";
$stmt = $baglan->prepare($sql);
$stmt->execute();
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($rows as $row) {
    if (empty(trim(strip_tags($row['tr_baslik']))) && empty(trim(strip_tags($row['tr_icerik'])))) continue;
    
    $id = $row['id'];
    $echo_id = false;
    
    foreach ($langs as $code => $langParam) {
        if (empty(trim($row["{$code}_baslik"])) || empty(trim($row["{$code}_icerik"]))) {
            if (!$echo_id) {
                echo "Processing ID: $id - " . $row['tr_baslik'] . "\n";
                $echo_id = true;
            }
            
            echo "Translating to $code...\n";
            $data = [
                'title' => $row['tr_baslik'],
                'content' => $row['tr_icerik'],
                'detail' => $row['tr_detay'] ?? '',
                'seo_title' => $row['tr_seo_title'] ?? '',
                'seo_description' => $row['tr_seo_description'] ?? ''
            ];
            
            $result = $aiService->translateSingle($data, $code);
            
            if (isset($result['title']) && isset($result['content'])) {
                $up_sql = "UPDATE icerik SET {$code}_baslik=:b, {$code}_icerik=:i, {$code}_detay=:d, {$code}_seo_title=:st, {$code}_seo_description=:sd WHERE id=:id";
                $up_stmt = $baglan->prepare($up_sql);
                $up_stmt->bindValue(':b', $result['title']);
                $up_stmt->bindValue(':i', $result['content']);
                $up_stmt->bindValue(':d', isset($result['detail']) ? $result['detail'] : '');
                $up_stmt->bindValue(':st', isset($result['seo_title']) ? $result['seo_title'] : '');
                $up_stmt->bindValue(':sd', isset($result['seo_description']) ? $result['seo_description'] : '');
                $up_stmt->bindValue(':id', $id);
                $up_stmt->execute();
                echo "+ Updated $code for ID $id\n";
            } else {
                echo "- Failed $code for ID $id. Error: " . print_r($result, true) . "\n";
            }
            sleep(1);
        }
    }
}

echo "Done translation.\n";
