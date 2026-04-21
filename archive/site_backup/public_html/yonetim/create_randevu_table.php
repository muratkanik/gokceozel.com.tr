<?php
include("baglan.php");

// 1. Create table
$sql = "CREATE TABLE IF NOT EXISTS `randevular` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ad_soyad` varchar(255) NOT NULL,
  `telefon` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mesaj` text NOT NULL,
  `durum` int(1) DEFAULT '0' COMMENT '0: New, 1: Read, 2: Contacted',
  `ip_adresi` varchar(50) DEFAULT NULL,
  `kayit_tarihi` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

try {
    $baglan->exec($sql);
    echo "Table 'randevular' checked/created.<br>";
} catch (PDOException $e) {
    echo "Error creating table: " . $e->getMessage() . "<br>";
}
?>
