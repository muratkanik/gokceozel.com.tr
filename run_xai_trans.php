<?php
set_time_limit(0);
error_reporting(E_ALL);
ini_set('display_errors', 1);

require(__DIR__ . '/site_backup/public_html/baglanti/baglan.php');

$apiKey = 'xai-YZUdNIa0njDbY2Y86VGPEa0SKN9yfRMSVTXxANfR0xTtrG5x17XHpQcrUaTOGrcB3bz9QxFMZ9qs1hY';

function callXAI($prompt, $lang) {
    if (empty(trim(strip_tags($prompt)))) return '';
    $final_prompt = "You are a professional medical translator. Translate this Turkish text to {$lang} language. Return ONLY the translated HTML/text. Do not wrap in markdown or json.\n\n" . $prompt;
    
    $url = 'https://api.x.ai/v1/chat/completions';
    $data = [
        'model' => 'grok-beta',
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
    }
    return '';
}

$langs = ['en' => 'English', 'ru' => 'Russian', 'de' => 'German', 'fr' => 'French', 'ar' => 'Arabic'];
$sql = "SELECT id, tr_baslik, tr_icerik, tr_detay, tr_seo_title, tr_seo_description, en_baslik, en_icerik, ru_baslik, ru_icerik, de_baslik, de_icerik, fr_baslik, fr_icerik, ar_baslik, ar_icerik FROM icerik ORDER BY id DESC";
$stmt = $baglan->prepare($sql);
$stmt->execute();
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($rows as $row) {
    if (empty(trim(strip_tags($row['tr_baslik']))) && empty(trim(strip_tags($row['tr_icerik'])))) continue;
    $id = $row['id'];
    
    foreach ($langs as $code => $langName) {
        if (empty(trim($row["{$code}_baslik"])) || empty(trim($row["{$code}_icerik"]))) {
            echo "Translating ID $id -> $code (X.AI)...\n";
            $b = trim($row['tr_baslik'] ?? '');
            $i = trim($row['tr_icerik'] ?? '');
            $d = trim($row['tr_detay'] ?? '');
            
            $b_trans = !empty(trim($row["{$code}_baslik"] ?? '')) ? $row["{$code}_baslik"] : callXAI($b, $langName);
            $i_trans = !empty(trim($row["{$code}_icerik"] ?? '')) ? $row["{$code}_icerik"] : callXAI($i, $langName);
            $d_trans = empty(trim($row["{$code}_detay"] ?? '')) && !empty($d) ? callXAI($d, $langName) : ($row["{$code}_detay"] ?? '');
            
            $up_sql = "UPDATE icerik SET {$code}_baslik=:b, {$code}_icerik=:i, {$code}_detay=:d WHERE id=:id";
            $up_stmt = $baglan->prepare($up_sql);
            $up_stmt->bindValue(':b', $b_trans);
            $up_stmt->bindValue(':i', $i_trans);
            $up_stmt->bindValue(':d', $d_trans);
            $up_stmt->bindValue(':id', $id);
            $up_stmt->execute();
            echo "+ Updated ID $id for $code\n";
        }
    }
}
echo "Done.\n";
