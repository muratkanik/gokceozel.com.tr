<?php
require 'site_backup/public_html/baglanti/baglan.php';

echo "Adding missing columns for Chinese (CIN)...\n";

try {
    // 1. Add columns to genel_kategori
    echo "Updating genel_kategori...\n";
    $cols = [
        "cin_seo_title VARCHAR(255) DEFAULT NULL",
        "cin_seo_description TEXT DEFAULT NULL",
        "cin_goster TINYINT(1) DEFAULT 1"
    ];
    
    foreach ($cols as $colDef) {
        $parts = explode(" ", $colDef);
        $colName = $parts[0];
        
        // Check if exists
        $check = $baglan->query("SHOW COLUMNS FROM genel_kategori LIKE '$colName'");
        if ($check->rowCount() == 0) {
            $baglan->exec("ALTER TABLE genel_kategori ADD COLUMN $colDef");
            echo "Added column: $colName\n";
        } else {
            echo "Column exists: $colName\n";
        }
    }

    // 2. Add columns to ayarlar
    echo "Updating ayarlar...\n";
    $ayarlarCols = [
        "cookie_cin_message TEXT DEFAULT NULL",
        "cookie_cin_dismiss VARCHAR(255) DEFAULT 'OK'",
        "cookie_cin_link VARCHAR(255) DEFAULT 'Learn more'"
    ];

    foreach ($ayarlarCols as $colDef) {
        $parts = explode(" ", $colDef);
        $colName = $parts[0];
        
        $check = $baglan->query("SHOW COLUMNS FROM ayarlar LIKE '$colName'");
        if ($check->rowCount() == 0) {
            $baglan->exec("ALTER TABLE ayarlar ADD COLUMN $colDef");
            echo "Added column: $colName\n";
        } else {
            echo "Column exists: $colName\n";
        }
    }

    // 3. Populate ayarlar content for Chinese
    echo "Populating Chinese Cookie Consent text...\n";
    $msg = "本网站使用 cookie 来为您提供最佳体验。接受 cookie 使用即表示您同意根据 GDPR 处理您的个人数据。有关更多信息，请查看我们的隐私政策。";
    $dismiss = "好";
    $link = "了解更多";

    $stmt = $baglan->prepare("UPDATE ayarlar SET 
        cookie_cin_message = :msg,
        cookie_cin_dismiss = :dismiss,
        cookie_cin_link = :link
        WHERE id = 1"); // Assuming id 1 is the main settings row
    
    $stmt->execute([
        ':msg' => $msg,
        ':dismiss' => $dismiss,
        ':link' => $link
    ]);
    
    echo "Chinese content updated.\n";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
