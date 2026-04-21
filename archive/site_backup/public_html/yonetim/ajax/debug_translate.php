<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h1>Debug AI Translation</h1>";

include("../baglan.php");
include("../classes/AIService.php");

session_start();
// Mock session for testing if needed, or just rely on manual inclusion
if (!isset($_SESSION['kullaniciid'])) {
    echo "Simulating user session...<br>";
    $_SESSION['kullaniciid'] = 1; // Assuming 1 is admin
}

// Get Settings
$query = $baglan->query("SELECT * FROM ayarlar LIMIT 1");
$settings = $query->fetch(PDO::FETCH_ASSOC);

$provider = isset($settings['ai_provider']) ? $settings['ai_provider'] : 'openai';
echo "Provider: $provider<br>";

// Decrypt key
include("../baglanti/veritabanifonksiyonlari.php"); // Needed for sifre_coz? 
// Wait, sifre_coz is usually in baglantilar_fonksiyonlar or similar.
// Let's check where sifre_coz is defined. It was used in ai_enhance.php without including extra files, 
// so it might be in baglan.php or auto-loaded? 
// ai_enhance.php includes `../baglan.php` which might include it.
// Let's assume it's available or define a mock if not.

if (!function_exists('sifre_coz')) {
    echo "sifre_coz not found, defining mock... (MIGHT FAIL IF REAL ENCRYPTION USED)<br>";
    function sifre_coz($str) { return $str; } 
}

$rawKey = ($provider === 'gemini') ? $settings['gemini_api_key'] : $settings['openai_api_key'];
$apiKey = sifre_coz($rawKey);

// Mask key
echo "API Key: " . substr($apiKey, 0, 5) . "..." . substr($apiKey, -4) . "<br>";

$ai = new AIService($provider, $apiKey, 'gpt-4o'); // Force model or use default

$data = [
    'title' => 'Test Başlık',
    'content' => 'Bu bir test içeriğidir. AI çeviri sistemini kontrol ediyoruz.',
    'detail' => 'Detaylar burada.',
    'seo_title' => 'Test SEO Başlık',
    'seo_description' => 'Test açıklama'
];

echo "<h3>Testing translateSingle (EN)</h3>";
$result = $ai->translateSingle($data, 'en');

echo "<pre>";
print_r($result);
echo "</pre>";

if (isset($result['error'])) {
    echo "<h3 style='color:red'>ERROR: " . $result['error'] . "</h3>";
} else {
    echo "<h3 style='color:green'>SUCCESS</h3>";
}
?>
