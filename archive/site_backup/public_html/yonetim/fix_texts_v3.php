<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

include("baglan.php");

echo "<h3>Text Replacement Details V3</h3>";

$tables = ['genel_kategori', 'icerik'];
$replacement = "Estetik Cerrahi";
$search = "plastik cerrahi";

foreach ($tables as $table) {
    echo "<b>Checking table $table</b><br>";
    $q = $baglan->query("SHOW COLUMNS FROM $table");
    $columns = [];
    while ($col = $q->fetch(PDO::FETCH_ASSOC)) {
        // Only check text and varchar columns
        if (strpos($col['Type'], 'varchar') !== false || strpos($col['Type'], 'text') !== false) {
            $columns[] = $col['Field'];
        }
    }

    foreach ($columns as $column) {
        $sql = "SELECT id, `$column` FROM `$table` WHERE `$column` LIKE :search";
        try {
            $stmt = $baglan->prepare($sql);
            $stmt->execute([':search' => "%$search%"]);
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            foreach ($results as $row) {
                $id = $row['id'];
                $oldText = $row[$column];
                $newText = str_ireplace($search, $replacement, $oldText);
                
                if ($oldText !== $newText) {
                    $update = $baglan->prepare("UPDATE `$table` SET `$column` = :newText WHERE id = :id");
                    $update->execute([':newText' => $newText, ':id' => $id]);
                    echo "Replaced in $table.$column (ID: $id)<br>";
                }
            }
        } catch (PDOException $e) {
            echo "Error checking $column in $table: " . $e->getMessage() . "<br>";
        }
    }
}

echo "<h3>Hiding 'Hizmetler' in TR Menu</h3>";
try {
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
} catch (PDOException $e) {
    echo "Error hiding category: " . $e->getMessage() . "<br>";
}

echo "<br><b>All tasks completed.</b>";
?>
