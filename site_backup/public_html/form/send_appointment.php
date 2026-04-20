<?php
header('Content-Type: application/json; charset=utf-8');
mb_internal_encoding('UTF-8');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require __DIR__ . '/../baglanti/baglan.php';

// Rate Limiting
$ip_address = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'unknown';
$rate_limit_key = 'appointment_form_rate_' . md5($ip_address);
$rate_limit_count = isset($_SESSION[$rate_limit_key]) ? $_SESSION[$rate_limit_key]['count'] : 0;
$rate_limit_time = isset($_SESSION[$rate_limit_key]) ? $_SESSION[$rate_limit_key]['time'] : 0;
$current_time = time();

if ($rate_limit_count >= 3 && ($current_time - $rate_limit_time) < 300) {
    echo json_encode(['success' => false, 'message' => 'Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.']);
    exit;
}
if (($current_time - $rate_limit_time) >= 300) { $rate_limit_count = 0; }

$name = isset($_REQUEST['ad']) ? trim($_REQUEST['ad']) : '';
$from = isset($_REQUEST['mail']) ? trim($_REQUEST['mail']) : '';
$phone = isset($_REQUEST['telefon']) ? trim($_REQUEST['telefon']) : '';
$message = isset($_REQUEST['mesaj']) ? trim($_REQUEST['mesaj']) : '';
$captcha_code = isset($_REQUEST['captcha_code']) ? trim($_REQUEST['captcha_code']) : '';

if (!isset($_SESSION['guvenlik']) || empty($captcha_code) || strtolower($captcha_code) !== strtolower($_SESSION['guvenlik'])) {
    $_SESSION[$rate_limit_key] = ['count' => $rate_limit_count + 1, 'time' => $current_time];
    echo json_encode(['success' => false, 'message' => 'Güvenlik kodu hatalı! Lütfen tekrar deneyin.']);
    exit;
}

$_SESSION[$rate_limit_key] = ['count' => $rate_limit_count + 1, 'time' => $current_time];
unset($_SESSION['guvenlik']);

try {
    $insert_query = "INSERT INTO randevular (ad_soyad, email, telefon, mesaj, ip_adresi, kayit_tarihi, durum) 
                     VALUES (:ad, :mail, :telefon, :mesaj, :ip_adresi, NOW(), 0)";
    
    $insert_stmt = $baglan->prepare($insert_query);
    $insert_stmt->bindValue(':ad', $name, PDO::PARAM_STR);
    $insert_stmt->bindValue(':mail', $from, PDO::PARAM_STR);
    $insert_stmt->bindValue(':telefon', $phone, PDO::PARAM_STR);
    $insert_stmt->bindValue(':mesaj', $message, PDO::PARAM_STR);
    $insert_stmt->bindValue(':ip_adresi', $ip_address, PDO::PARAM_STR);
    $insert_stmt->execute();
} catch (PDOException $e) {
    error_log("Randevu formu veritabanı hatası: " . $e->getMessage());
}

try {
    $ayarlar_stmt = $baglan->query("SELECT form_mail_alici, mail FROM ayarlar LIMIT 1");
    $ayarlar = $ayarlar_stmt->fetch(PDO::FETCH_ASSOC);
    $recipients = [];
    if (!empty($ayarlar['form_mail_alici'])) {
        $emails = preg_split('/[,;]/', $ayarlar['form_mail_alici']);
        foreach ($emails as $email) {
            if (filter_var(trim($email), FILTER_VALIDATE_EMAIL)) $recipients[] = trim($email);
        }
    }
    if (empty($recipients) && !empty($ayarlar['mail'])) {
        $recipients[] = $ayarlar['mail'];
    }
    
    if (!empty($recipients)) {
        $subject = "Web Sitesinden Yeni Randevu Talebi";
        $headers = "From: " . $from . "\r\nReply-To: " . $from . "\r\nContent-Type: text/plain; charset=UTF-8\r\n";
        
        $body = "Web sitesinden yeni bir doktor randevu talebi alındı:\n\n";
        $body .= "Ad Soyad: " . $name . "\n";
        $body .= "E-posta: " . $from . "\n";
        $body .= "Telefon: " . ($phone ? $phone : "Belirtilmemiş") . "\n";
        $body .= "Mesaj:\n" . $message . "\n\n---\n";
        $body .= "IP Adresi: " . $ip_address . "\nTarih: " . date('d.m.Y H:i:s') . "\n";
        
        foreach ($recipients as $to) {
            @mail($to, $subject, $body, $headers);
        }
        echo json_encode(['success' => true, 'message' => 'Randevu talebiniz başarıyla alındı. En kısa sürede size geri dönüş yapılacaktır.']);
    } else {
        echo json_encode(['success' => true, 'message' => 'Talebiniz kaydedildi, geri dönüş yapılacaktır.']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => true, 'message' => 'Talebiniz kaydedildi. Gönderim aşamasında bir aksaklık oldu ancak randevunuz sistemimize ulaştı.']);
}
?>
