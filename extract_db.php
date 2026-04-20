<?php
$file = "/Users/mkanik/Documents/GitHub/gokceozel.com.tr/archive/backups/database_backup/database_backup_fixed.sql";
$lines = file($file);
foreach($lines as $line) {
    if (strpos($line, "INSERT INTO `icerik`") !== false) {
        // Find rows with kategori 2 or 52
        if (preg_match("/\(2, /", $line) || preg_match("/\(52, /", $line) || strpos($line, "'2'") !== false || strpos($line, "'52'") !== false) {
            // print first 500 chars of the line
            echo substr($line, 0, 1000) . "\n\n";
        }
    }
}
?>
