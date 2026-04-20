<?php
set_time_limit(0);
error_reporting(E_ALL);
ini_set('display_errors', 1);

require(__DIR__ . '/site_backup/public_html/baglanti/baglan.php');

$apiKey = 'xai-YZUdNIa0njDbY2Y86VGPEa0SKN9yfRMSVTXxANfR0xTtrG5x17XHpQcrUaTOGrcB3bz9QxFMZ9qs1hY';

function callXAI($prompt, $lang) {
    if (empty(trim(strip_tags($prompt)))) return '';
    
    // Check if the prompt is literally just a few words like "Gökçe Özel kimdir ?"
    if (strlen($prompt) < 100) {
        $final_prompt = "You are a professional translator. Translate this short Turkish phrase to {$lang} language. Return ONLY the translation, nothing else, no quotes.\n\n" . $prompt;
    } else {
        $final_prompt = "You are a professional medical translator. Translate this Turkish text to {$lang} language. Return ONLY the translated HTML/text. Do not wrap in markdown or json.\n\n" . $prompt;
    }
    
    $url = 'https://api.x.ai/v1/chat/completions';
    $data = [
        'model' => 'grok-2-latest',
        'messages' => [
            ['role' => 'system', 'content' => 'You are a helpful SEO and translation assistant.'],
            ['role' => 'user', 'content' => $final_prompt]
        ],
        'temperature' => 0.1
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $GLOBALS['apiKey']
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 60);

    $response = curl_exec($ch);
    $json = json_decode($response, true);
    curl_close($ch);
    
    if (isset($json['choices'][0]['message']['content'])) {
        $text = trim($json['choices'][0]['message']['content']);
        $text = preg_replace('/^```(?:json|html)?\s*/i', '', $text);
        $text = preg_replace('/^```\s*/', '', $text);
        $text = preg_replace('/\s*```$/', '', $text);
        return trim($text);
    } else {
        echo "X.AI API Error: " . print_r($json, true) . "\n";
    }
    return '';
}

$langs = ['en' => 'English', 'ru' => 'Russian', 'de' => 'German', 'fr' => 'French', 'ar' => 'Arabic'];
// Target the specific IDs first to resolve the user's issue instantly!
$sql = "SELECT id, tr_baslik, tr_icerik, tr_detay, tr_seo_title, tr_seo_description, en_baslik, en_icerik, ru_baslik, ru_icerik, de_baslik, de_icerik, fr_baslik, fr_icerik, ar_baslik, ar_icerik FROM icerik WHERE kategori IN (2, 8) OR id IN (64, 23, 22, 15) ORDER BY id DESC";
$stmt = $baglan->prepare($sql);
$stmt->execute();
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($rows as $row) {
    if (empty(trim(strip_tags($row['tr_baslik']))) && empty(trim(strip_tags($row['tr_icerik'])))) continue;
    $id = $row['id'];
    
    foreach ($langs as $code => $langName) {
        if (empty(trim($row["{$code}_baslik"])) || empty(trim($row["{$code}_icerik"]))) {
            echo "\nTranslating ID $id -> $code (X.AI)...\n";
            $b = trim($row['tr_baslik'] ?? '');
            $i = trim($row['tr_icerik'] ?? '');
            
            $b_trans = '';
            if (!empty($b)) {
                $b_trans = callXAI($b, $langName);
                sleep(2); // Rate limit protection
            }
            
            $i_trans = '';
            if (!empty($i)) {
                $i_trans = callXAI($i, $langName);
                sleep(2); // Rate limit protection
            }
            
            if ($b_trans !== '' || $i_trans !== '') {
                $up_sql = "UPDATE icerik SET {$code}_baslik=:b, {$code}_icerik=:i WHERE id=:id";
                $up_stmt = $baglan->prepare($up_sql);
                // Retain existing if translation failed but we had one before? No, we are only translating missing.
                $up_stmt->bindValue(':b', $b_trans !== '' ? $b_trans : $row["{$code}_baslik"]);
                $up_stmt->bindValue(':i', $i_trans !== '' ? $i_trans : $row["{$code}_icerik"]);
                $up_stmt->bindValue(':id', $id);
                $up_stmt->execute();
                echo "+ Updated ID $id for $code\n";
            } else {
                echo "- Skipping update for ID $id ($code) due to empty API response.\n";
            }
        }
    }
}
echo "Done.\n";
