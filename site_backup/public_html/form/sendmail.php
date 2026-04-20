<?php
header('Content-Type: application/json; charset=utf-8');
mb_internal_encoding('UTF-8');

// Session başlat
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Veritabanı bağlantısı
require __DIR__ . '/../baglanti/baglan.php';

// Rate Limiting - IP bazlı spam koruması
$ip_address = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'unknown';
$rate_limit_key = 'contact_form_rate_' . md5($ip_address);
$rate_limit_count = isset($_SESSION[$rate_limit_key]) ? $_SESSION[$rate_limit_key]['count'] : 0;
$rate_limit_time = isset($_SESSION[$rate_limit_key]) ? $_SESSION[$rate_limit_key]['time'] : 0;
$current_time = time();

// 5 dakika içinde 3'ten fazla istek varsa engelle
if ($rate_limit_count >= 3 && ($current_time - $rate_limit_time) < 300) {
    echo json_encode([
        'success' => false, 
        'message' => 'Çok fazla istek gönderdiniz. Lütfen 5 dakika sonra tekrar deneyin.'
    ]);
    exit;
}

// Rate limit zamanı dolmuşsa sıfırla
if (($current_time - $rate_limit_time) >= 300) {
    $rate_limit_count = 0;
}

// Form verilerini al
$from = isset($_REQUEST['mail']) ? trim($_REQUEST['mail']) : '';
$name = isset($_REQUEST['ad']) ? trim($_REQUEST['ad']) : '';
$phone = isset($_REQUEST['telefon']) ? trim($_REQUEST['telefon']) : '';
$message = isset($_REQUEST['mesaj']) ? trim($_REQUEST['mesaj']) : '';
$captcha_code = isset($_REQUEST['captcha_code']) ? trim($_REQUEST['captcha_code']) : '';

// Görsel Captcha kontrolü
if (!isset($_SESSION['contact_captcha']) || empty($captcha_code) || strtolower($captcha_code) !== strtolower($_SESSION['contact_captcha'])) {
    // Rate limit sayacını artır
    $_SESSION[$rate_limit_key] = [
        'count' => $rate_limit_count + 1,
        'time' => $current_time
    ];
    
    echo json_encode([
        'success' => false, 
        'message' => 'Güvenlik kodu hatalı! Lütfen tekrar deneyin.'
    ]);
    exit;
}

// Rate limit sayacını artır (başarılı istek için de)
$_SESSION[$rate_limit_key] = [
    'count' => $rate_limit_count + 1,
    'time' => $current_time
];

// Captcha session'ını temizle (bir kere kullanıldı)
unset($_SESSION['contact_captcha']);

// Veritabanına kaydet
try {
    $ip_adresi = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '';
    
    $insert_query = "INSERT INTO iletisim_formu (ad, mail, telefon, mesaj, ip_adresi, kayit_tarihi, durum) 
                     VALUES (:ad, :mail, :telefon, :mesaj, :ip_adresi, NOW(), 1)";
    
    $insert_stmt = $baglan->prepare($insert_query);
    $insert_stmt->bindValue(':ad', $name, PDO::PARAM_STR);
    $insert_stmt->bindValue(':mail', $from, PDO::PARAM_STR);
    $insert_stmt->bindValue(':telefon', $phone, PDO::PARAM_STR);
    $insert_stmt->bindValue(':mesaj', $message, PDO::PARAM_STR);
    $insert_stmt->bindValue(':ip_adresi', $ip_adresi, PDO::PARAM_STR);
    $insert_stmt->execute();
} catch (PDOException $e) {
    // Veritabanı hatası olsa bile mail göndermeyi dene
    error_log("İletişim formu veritabanı hatası: " . $e->getMessage());
}

// Mail gönderimi
try {
    // Ayarlardan mail alıcılarını al
    $ayarlar_query = "SELECT form_mail_alici FROM ayarlar LIMIT 1";
    $ayarlar_stmt = $baglan->query($ayarlar_query);
    $ayarlar = $ayarlar_stmt->fetch(PDO::FETCH_ASSOC);
    
    // Mail alıcılarını ayır (virgül veya noktalı virgül ile)
    $recipients = [];
    if (!empty($ayarlar['form_mail_alici'])) {
        // Hem virgül hem noktalı virgül ile ayır
        $emails = preg_split('/[,;]/', $ayarlar['form_mail_alici']);
        foreach ($emails as $email) {
            $email = trim($email);
            if (!empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $recipients[] = $email;
            }
        }
    }
    
    // Eğer ayarlarda mail alıcı yoksa, varsayılan mail adresini kullan
    if (empty($recipients)) {
        $ayarlar_mail_query = "SELECT mail FROM ayarlar LIMIT 1";
        $ayarlar_mail_stmt = $baglan->query($ayarlar_mail_query);
        $ayarlar_mail = $ayarlar_mail_stmt->fetch(PDO::FETCH_ASSOC);
        if (!empty($ayarlar_mail['mail'])) {
            $recipients[] = $ayarlar_mail['mail'];
        }
    }
    
    if (!empty($recipients)) {
        $subject = "Web Sitesinden İletişim Formu Mesajı";
        $headers = "From: " . $from . "\r\n";
        $headers .= "Reply-To: " . $from . "\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        
        $body = "Web sitesinden yeni bir iletişim formu mesajı alındı:\n\n";
        $body .= "Ad Soyad: " . $name . "\n";
        $body .= "E-posta: " . $from . "\n";
        $body .= "Telefon: " . ($phone ? $phone : "Belirtilmemiş") . "\n";
        $body .= "Mesaj:\n" . $message . "\n";
        $body .= "\n---\n";
        $body .= "IP Adresi: " . (isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'Bilinmiyor') . "\n";
        $body .= "Tarih: " . date('d.m.Y H:i:s') . "\n";
        
        // Her alıcıya mail gönder
        $mail_sent = false;
        foreach ($recipients as $to) {
            if (mail($to, $subject, $body, $headers)) {
                $mail_sent = true;
            }
        }
        
        if ($mail_sent) {
            echo json_encode(['success' => true, 'message' => 'Mesajınız başarıyla gönderildi!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Mail gönderilemedi, ancak mesajınız kaydedildi.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Mail alıcı adresi bulunamadı.']);
    }
} catch (Exception $e) {
    error_log("İletişim formu mail hatası: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Bir hata oluştu.']);
}

?>
