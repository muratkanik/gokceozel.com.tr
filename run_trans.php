<?php
set_time_limit(0);
error_reporting(E_ALL);
ini_set('display_errors', 1);

require(__DIR__ . '/site_backup/public_html/baglanti/baglan.php');

$apiKey = '***REMOVED***'; // Gemini key

function translateGemini($text, $lang) {
    if (empty(trim(strip_tags($text)))) return '';
    $prompt = "You are a professional medical translator. Translate this Turkish text to {$lang} language. Return ONLY the translated HTML/text. Do not wrap in markdown or json.\n\n" . $text;
    
    $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' . $GLOBALS['apiKey'];
    $data = [
        "contents" => [["role" => "user", "parts" => [["text" => $prompt]]]],
        "generationConfig" => ["temperature" => 0.1, "maxOutputTokens" => 8192]
    ];
    $options = [
        'http' => [
            'header'  => "Content-Type: application/json\r\n",
            'method'  => 'POST',
            'content' => json_encode($data)
        ]
    ];
    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    
    if ($result === FALSE) return '';
    
    $response = json_decode($result, true);
    if(isset($response['candidates'][0]['content']['parts'][0]['text'])) {
        $translated = trim($response['candidates'][0]['content']['parts'][0]['text']);
        if (strpos($translated, '```html') === 0) {
            $translated = preg_replace('/^```html\s*|\s*```$/i', '', $translated);
        } elseif (strpos($translated, '```') === 0) {
            $translated = preg_replace('/^```\s*|\s*```$/i', '', $translated);
        }
        return $translated;
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
            echo "Translating ID $id -> $code...\n";
            $b = $row['tr_baslik'];
            $i = $row['tr_icerik'];
            $d = $row['tr_detay'] ?? '';
            
            $b_trans = !empty(trim($row["{$code}_baslik"])) ? $row["{$code}_baslik"] : translateGemini($b, $langName);
            $i_trans = !empty(trim($row["{$code}_icerik"])) ? $row["{$code}_icerik"] : translateGemini($i, $langName);
            $d_trans = empty(trim($row["{$code}_detay"] ?? '')) && !empty($d) ? translateGemini($d, $langName) : ($row["{$code}_detay"] ?? '');
            
            $up_sql = "UPDATE icerik SET {$code}_baslik=:b, {$code}_icerik=:i, {$code}_detay=:d WHERE id=:id";
            $up_stmt = $baglan->prepare($up_sql);
            $up_stmt->bindValue(':b', $b_trans);
            $up_stmt->bindValue(':i', $i_trans);
            $up_stmt->bindValue(':d', $d_trans);
            $up_stmt->bindValue(':id', $id);
            $up_stmt->execute();
            echo "Updated ID $id for $code\n";
            sleep(1);
        }
    }
}
echo "Done.\n";
