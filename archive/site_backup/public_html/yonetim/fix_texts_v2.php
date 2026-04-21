<?php
include("baglan.php");

echo "<h3>Text Replacement Details</h3>";

$tables = [
    'genel_kategori' => ['tr_isim', 'tr_icerik', 'en_isim', 'en_icerik', 'ru_icerik', 'ar_icerik', 'de_icerik', 'fr_icerik', 'cin_icerik'],
    'icerik' => ['tr_baslik', 'tr_icerik', 'en_baslik', 'en_icerik', 'ru_icerik', 'ar_icerik', 'de_icerik', 'fr_icerik', 'cin_icerik']
];

$replacement = "Estetik Cerrahi";
$search = "plastik cerrahi";

foreach ($tables as $table => $columns) {
    foreach ($columns as $col) {
        $sql = "SELECT id, $col FROM $table WHERE $col LIKE :search";
        $stmt = $baglan->prepare($sql);
        $stmt->execute([':search' => "%$search%"]);
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $id = $row['id'];
            $oldText = $row[$col];
            $newText = str_ireplace($search, $replacement, $oldText);
            
            if ($oldText !== $newText) {
                $update = $baglan->prepare("UPDATE $table SET $col = :newText WHERE id = :id");
                $update->execute([':newText' => $newText, ':id' => $id]);
                echo "Replaced in $table.$col (ID: $id)<br>";
            }
        }
    }
}

echo "<h3>Hiding 'Hizmetler' in TR Menu</h3>";
// Find "Hizmetler" category
$catStmt = $baglan->query("SELECT id, tr_isim FROM genel_kategori WHERE tr_isim LIKE '%Hizmetler%' LIMIT 1");
if ($catRow = $catStmt->fetch(PDO::FETCH_ASSOC)) {
    $catId = $catRow['id'];
    $hideStmt = $baglan->prepare("UPDATE genel_kategori SET tr_goster = '0' WHERE id = :id");
    $hideStmt->execute([':id' => $catId]);
    echo "Hidden TR menu for category: " . htmlspecialchars($catRow['tr_isim']) . " (ID: $catId)<br>";
} else {
    echo "Category 'Hizmetler' not found.<br>";
}

echo "<br><b>All tasks completed.</b>";
?>
