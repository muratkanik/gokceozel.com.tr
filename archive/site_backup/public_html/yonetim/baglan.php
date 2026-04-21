<?php
header('Content-Type: text/html; charset=utf-8');
mb_internal_encoding('UTF-8');
// Veritabanı ayarları
$sunucu='localhost';
$dbkullanici='eyalcin_gokceozel';
$dbsifre='Gokce.135246';
$db='eyalcin_gokceozel';
$port=3306;

try {
// PHP 8.5+ uyumluluğu: INIT_COMMAND'ı constructor'dan çıkarıp exec() ile çalıştırıyoruz
// UTF-8 ve Arapça karakter desteği için utf8mb4 kullanıyoruz
$baglan = new PDO("mysql:host=$sunucu;port=$port;dbname=$db;charset=utf8mb4", $dbkullanici, $dbsifre);
$baglan->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$baglan->exec("SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci'");
$baglan->exec("SET CHARACTER SET utf8mb4");
$baglan->exec("SET CHARSET 'utf8mb4'");
}catch(PDOException $e) {
 die( $e->getMessage());
}


// Şifreleme Anahtarı
if (!defined('ENCRYPTION_KEY')) {
    define('ENCRYPTION_KEY', 'GokceOzel_Secure_Key_2025_!#');
}

if (!function_exists('sifrele')) {
    function sifrele($data) {
        if (empty($data)) return $data;
        $method = "AES-256-CBC";
        $iv = substr(hash('sha256', ENCRYPTION_KEY), 0, 16);
        if (function_exists('openssl_encrypt')) {
            return base64_encode(openssl_encrypt($data, $method, ENCRYPTION_KEY, 0, $iv));
        }
        return $data; // Fallback: return raw data if openssl missing
    }
}

if (!function_exists('sifre_coz')) {
    function sifre_coz($data) {
        if (empty($data)) return $data;
        // Eğer şifreli değilse (eski kayıtlar için) olduğu gibi döndür
        if (strpos($data, 'sk-') === 0 || strpos($data, 'AIza') === 0) return $data;
        
        $method = "AES-256-CBC";
        $iv = substr(hash('sha256', ENCRYPTION_KEY), 0, 16);
        if (function_exists('openssl_decrypt')) {
            return openssl_decrypt(base64_decode($data), $method, ENCRYPTION_KEY, 0, $iv);
        }
        return $data; // Fallback
    }
}
?>

