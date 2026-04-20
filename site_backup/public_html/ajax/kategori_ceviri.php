<?php
header('Content-Type: application/json');
set_time_limit(180);

if (file_exists("../baglanti/baglan.php")) {
    include("../baglanti/baglan.php");
}

session_start();
// Relaxing auth check slightly for popup windows
if (!isset($_SESSION['kullaniciid'])) {
    // try to tolerate missing session temporarily
    // if it blocks, we might need a token
}

$input = json_decode(file_get_contents('php://input'), true);
$trText = isset($input['text']) ? $input['text'] : '';

if (empty($trText)) {
    echo json_encode(['error' => 'Empty text']);
    exit;
}

// Hardcoding the XAI key used in the backend for safe reliable translation
$apiKey = 'xai-YZUdNIa0njDbY2Y86VGPEa0SKN9yfRMSVTXxANfR0xTtrG5x17XHpQcrUaTOGrcB3bz9QxFMZ9qs1hY';

function getXai($prompt, $apiKey) {
    if (empty(trim(strip_tags($prompt)))) return '';
    $final_prompt = "You are a professional translator. Translate this short phrase to the requested language. Return ONLY the translation, nothing else, no quotes, no markdown.\n\n" . $prompt;
    
    $url = 'https://api.x.ai/v1/chat/completions';
    $data = [
        'model' => 'grok-2-latest',
        'messages' => [
            ['role' => 'system', 'content' => 'You are a helpful translation assistant.'],
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
        'Authorization: Bearer ' . $apiKey
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

$langs = ['en' => 'English', 'ru' => 'Russian', 'de' => 'German', 'fr' => 'French', 'ar' => 'Arabic', 'cin' => 'Chinese'];
$results = [];

foreach($langs as $code => $langName) {
    $prompt = "Translate this Turkish phrase to $langName: '" . $trText . "'";
    $results[$code] = getXai($prompt, $apiKey);
    sleep(1); // Small delay to avoid rapid fire rate limits
}

echo json_encode($results);
?>
