<?php
// ajax/ai_enhance.php - AJAX Endpoint
header('Content-Type: application/json');
set_time_limit(180); // Allow 3 minutes for heavy AI tasks

// Catch Fatal Errors (Memory, Timeouts) to prevent raw HTML output
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error && ($error['type'] === E_ERROR || $error['type'] === E_PARSE || $error['type'] === E_CORE_ERROR || $error['type'] === E_COMPILE_ERROR)) {
        http_response_code(500);
        echo json_encode(['error' => 'Fatal PHP Error: ' . $error['message'] . ' in ' . $error['file'] . ':' . $error['line']]);
    }
});

// Robust DB Connection
if (file_exists("../baglan.php")) {
    include("../baglan.php");
} elseif (file_exists("../baglanti/baglan.php")) {
    include("../baglanti/baglan.php");
} else {
    // Fallback if moved or structure differs
    include("../../baglan.php");
}
include("../classes/AIService.php");

// Auth check (simple session check)
session_start();
if (!isset($_SESSION['kullaniciid'])) {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Get Settings
$query = $baglan->query("SELECT * FROM ayarlar LIMIT 1");
$settings = $query->fetch(PDO::FETCH_ASSOC);

$provider = isset($settings['ai_provider']) ? $settings['ai_provider'] : 'openai';
$rawKey = ($provider === 'gemini') ? $settings['gemini_api_key'] : $settings['openai_api_key'];
$apiKey = sifre_coz($rawKey);
$model = isset($settings['ai_model']) ? $settings['ai_model'] : '';

// Serper Search Keys
$rawSerperKey = isset($settings['serper_api_key']) ? $settings['serper_api_key'] : '';
$serperKey = sifre_coz($rawSerperKey);

if (empty($apiKey)) {
    echo json_encode(['error' => 'API Key is missing in settings.']);
    exit;
}

// Request Parameters
$input = json_decode(file_get_contents('php://input'), true);

$type = isset($input['type']) ? $input['type'] : ''; // title, description, rewrite, translate_all, research_write
$content = isset($input['content']) ? $input['content'] : '';
$lang = isset($input['lang']) ? $input['lang'] : 'tr';
$data = isset($input['data']) ? $input['data'] : []; // For translate_all

if (empty($type)) {
    echo json_encode(['error' => 'Invalid parameters.']);
    exit;
}

try {
    $ai = new AIService($provider, $apiKey, $model);
    
    if ($type === 'translate_all') {
        $result = $ai->translateAll($data);
    } elseif ($type === 'translate_single') {
        $targetLang = isset($input['target_lang']) ? $input['target_lang'] : 'en';
        $result = $ai->translateSingle($data, $targetLang);
    } elseif ($type === 'research_write') {
         $result = $ai->researchAndWrite($content, $serperKey);
    } else {
        $result = $ai->enhanceContent($content, $type, $lang);
    }
    
    echo json_encode($result);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
