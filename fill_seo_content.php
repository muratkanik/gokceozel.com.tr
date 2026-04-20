<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h3>SEO ve İçerik Doldurma Aracı (Debug Modu)</h3>";

// Try to include connection directly
if (file_exists("baglan.php")) {
    include("baglan.php");
} elseif (file_exists("baglanti/baglan.php")) {
    include("baglanti/baglan.php");
} else {
    echo "Baglan.php bulunamadı, manuel bağlantı deneniyor...<br>";
    try {
        $baglan = new PDO("mysql:host=localhost;dbname=eyalcin_seo;charset=utf8", "eyalcin_seo", "Gokce135246");
        $baglan->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch(PDOException $e) {
        die("Bağlantı Hatası: " . $e->getMessage());
    }
}

// Function to handle potentially null strings
function safe_str($str) {
    return !empty($str) ? $str : '';
}

$languages = ['en', 'ru', 'ar', 'fr', 'de', 'cin'];
$source_lang = 'tr';

try {
    $query = "SELECT * FROM icerik";
    $stmt = $baglan->query($query);
    
    if (!$stmt) {
        die("Sorgu hatası: " . print_r($baglan->errorInfo(), true));
    }
    
    $records = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $count = 0;

    echo "<table border='1' cellpadding='5' cellspacing='0'>";
    echo "<tr><th>ID</th><th>Başlık (TR)</th><th>Güncellenen Diller</th></tr>";

    foreach ($records as $row) {
        $id = $row['id'];
        $updates = [];
        $params = [':id' => $id];
        $updated_langs = [];
        
        // Get Source Data
        $src_title = safe_str($row['tr_baslik']);
        $src_content = safe_str($row['tr_icerik']);
        $src_detay = safe_str($row['tr_detay']);
        
        // Fallback for SEO Title
        $src_seo_title = !empty($row['tr_seo_title']) ? $row['tr_seo_title'] : $src_title;

        // Fallback for SEO Description
        // Strip tags and handle length safely
        $clean_detay = strip_tags($src_detay);
        $clean_content = strip_tags($src_content);
        
        $src_seo_desc = !empty($row['tr_seo_description']) ? $row['tr_seo_description'] : mb_substr($clean_detay, 0, 160);
        if(empty($src_seo_desc)) $src_seo_desc = mb_substr($clean_content, 0, 160);


        foreach ($languages as $lang) {
            // 1. Fill Content if Empty
            if (empty($row[$lang.'_icerik']) && !empty($src_content)) {
                $updates[] = "{$lang}_icerik = :{$lang}_icerik";
                $params[":{$lang}_icerik"] = $src_content; 
                $updated_langs[] = "$lang (Content)";
            }

            // 2. Fill Title if Empty
            if (empty($row[$lang.'_baslik']) && !empty($src_title)) {
                $updates[] = "{$lang}_baslik = :{$lang}_baslik";
                $params[":{$lang}_baslik"] = $src_title;
                $updated_langs[] = "$lang (Title)";
            }

            // 3. Fill SEO Title if Empty
            if (empty($row[$lang.'_seo_title'])) {
                $val = !empty($src_seo_title) ? $src_seo_title : $src_title;
                if (!empty($val)) {
                    $updates[] = "{$lang}_seo_title = :{$lang}_seo_title";
                    $params[":{$lang}_seo_title"] = $val;
                     $updated_langs[] = "$lang (SEO Title)";
                }
            }

            // 4. Fill SEO Description if Empty
            if (empty($row[$lang.'_seo_description'])) {
                $val = $src_seo_desc;
                if (!empty($val)) {
                    $updates[] = "{$lang}_seo_description = :{$lang}_seo_description";
                    $params[":{$lang}_seo_description"] = $val;
                     $updated_langs[] = "$lang (SEO Desc)";
                }
            }
        }

        if (!empty($updates)) {
            $sql = "UPDATE icerik SET " . implode(', ', $updates) . " WHERE id = :id";
            $updateStmt = $baglan->prepare($sql);
            $updateStmt->execute($params);
            $count++;
            
             echo "<tr>";
             echo "<td>$id</td>";
             echo "<td>" . htmlspecialchars($src_title) . "</td>";
             echo "<td>" . implode(", ", array_unique($updated_langs)) . "</td>";
             echo "</tr>";
        }
    }

    echo "</table>";
    echo "<hr>";
    echo "<strong>Toplam $count kayıt güncellendi.</strong>";

} catch (Exception $e) {
    echo "<b>Hata Oluştu:</b> " . $e->getMessage();
}
?>
