<?php 
include("baglan.php");
include("veritabanifonksiyonlari.php");

function metin($anahtar) {
    global $baglan;
    static $translations = null;

    if ($translations === null) {
        $translations = [];
        $sql = "SELECT anahtar, tr, en, ru, ar, de, fr, cin FROM dil_cevirileri";
        $stmt = $baglan->prepare($sql);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($rows as $row) {
            $translations[$row['anahtar']] = $row;
        }
    }

    if (!isset($translations[$anahtar])) {
        return $anahtar; // Fallback to key if not found
    }

    $lang_code = isset($_GET['LN']) ? strtoupper($_GET['LN']) : 'TR';
    $valid_langs = ['TR', 'EN', 'RU', 'AR', 'DE', 'FR', 'CIN'];
    if (!in_array($lang_code, $valid_langs)) {
        $lang_code = 'TR';
    }
    
    $col = strtolower($lang_code);
    return !empty($translations[$anahtar][$col]) ? $translations[$anahtar][$col] : $translations[$anahtar]['tr']; // Fallback to TR if empty
}
?>