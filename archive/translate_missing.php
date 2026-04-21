<?php
set_time_limit(0);
error_reporting(E_ALL);
ini_set('display_errors', 1);

require(__DIR__ . '/site_backup/public_html/baglanti/baglan.php');

// Define API Key correctly (from site_backup logic)
define('GEMINI_API_KEY', '***REMOVED***');

function callGemini($text, $target_lang) {
    if (empty(trim(strip_tags($text)))) return '';
    
    $prompt = "You are a professional medical translator for a clinic website. Translate the following HTML content from Turkish to {$target_lang}. Keep the exact HTML formatting and classes. Do not wrap the response in markdown blocks like ```html. Just return the raw HTML string.\n\nTEXT:\n" . $text;
    
    $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' . GEMINI_API_KEY;
    $data = [
        "contents" => [
            ["role" => "user", "parts" => [["text" => $prompt]]]
        ],
        "generationConfig" => [
            "temperature" => 0.1,
            "maxOutputTokens" => 8192
        ]
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
    
    if ($result === FALSE) {
        return '';
    }
    
    $response = json_decode($result, true);
    if(isset($response['candidates'][0]['content']['parts'][0]['text'])) {
        $translated = trim($response['candidates'][0]['content']['parts'][0]['text']);
        // Remove markdown tags if any
        if (strpos($translated, '```html') === 0) {
            $translated = preg_replace('/^```html\s*|\s*```$/i', '', $translated);
        } elseif (strpos($translated, '```') === 0) {
            $translated = preg_replace('/^```\s*|\s*```$/i', '', $translated);
        }
        return $translated;
    }
    return '';
}

// Translate only empty rows for EN and RU
$langs = ['en' => 'English', 'ru' => 'Russian', 'de' => 'German', 'fr' => 'French', 'ar' => 'Arabic'];

$sql = "SELECT id, tr_baslik, tr_icerik, en_baslik, en_icerik, ru_baslik, ru_icerik, de_baslik, de_icerik, fr_baslik, fr_icerik, ar_baslik, ar_icerik FROM icerik ORDER BY id DESC";
$stmt = $baglan->prepare($sql);
$stmt->execute();
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($rows as $row) {
    $id = $row['id'];
    echo "Processing ID: $id - " . $row['tr_baslik'] . "\n";
    $updates = [];
    $params = [':id' => $id];
    
    foreach ($langs as $code => $lang_name) {
        if (empty(trim($row["{$code}_baslik"])) && !empty(trim($row['tr_baslik']))) {
            echo " Translating {$code}_baslik...\n";
            $trans = callGemini($row['tr_baslik'], $lang_name);
            if ($trans) {
                $updates[] = "{$code}_baslik = :{$code}_baslik";
                $params[":{$code}_baslik"] = $trans;
            }
        }
        if (empty(trim($row["{$code}_icerik"])) && !empty(trim($row['tr_icerik']))) {
            echo " Translating {$code}_icerik...\n";
            $trans = callGemini($row['tr_icerik'], $lang_name);
            if ($trans) {
                $updates[] = "{$code}_icerik = :{$code}_icerik";
                $params[":{$code}_icerik"] = $trans;
            }
        }
    }
    
    if (!empty($updates)) {
        $update_sql = "UPDATE icerik SET " . implode(', ', $updates) . " WHERE id = :id";
        $up_stmt = $baglan->prepare($update_sql);
        foreach ($params as $key => $val) {
            $up_stmt->bindValue($key, $val);
        }
        $up_stmt->execute();
        echo " Updated ID $id successfully.\n";
    }
    
    // Sleep to avoid rate limits
    sleep(1);
}

echo "Done.\n";
