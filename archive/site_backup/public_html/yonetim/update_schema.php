<?php
include("baglan.php");

try {
    // Check if column exists
    $check = $baglan->query("SHOW COLUMNS FROM icerik LIKE 'son_guncelleme'");
    if ($check->rowCount() == 0) {
        $baglan->exec("ALTER TABLE icerik ADD COLUMN son_guncelleme DATETIME DEFAULT NULL");
        echo "Column 'son_guncelleme' added successfully.<br>";
        
        // Update existing records to have a date (e.g. creation date or now)
        $baglan->exec("UPDATE icerik SET son_guncelleme = kayit_tarihi WHERE son_guncelleme IS NULL");
        echo "Existing records updated.<br>";
    } else {
        echo "Column 'son_guncelleme' already exists.<br>";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
