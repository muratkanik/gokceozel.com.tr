<?php
include("yonetim/baglan.php");

try {
    $stmt = $baglan->query("SHOW COLUMNS FROM icerik");
    $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "Columns in icerik table:\n";
    print_r($columns);
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
