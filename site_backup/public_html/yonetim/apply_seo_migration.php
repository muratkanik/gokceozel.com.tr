<?php
include("baglan.php");

try {
    // Check if column exists
    $check = $baglan->query("SHOW COLUMNS FROM icerik LIKE 'tr_seo_score'");
    if ($check->rowCount() == 0) {
        // Add Column
        $sql = "ALTER TABLE icerik ADD COLUMN tr_seo_score INT DEFAULT 0";
        $baglan->exec($sql);
        echo "Column 'tr_seo_score' added successfully.";
    } else {
        echo "Column 'tr_seo_score' already exists.";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
