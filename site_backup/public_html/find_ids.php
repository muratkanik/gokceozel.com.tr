<?php
require(__DIR__ . '/baglanti/baglan.php');

$q = $baglan->query("SELECT id, kategori, tr_baslik, ru_baslik, en_baslik FROM icerik WHERE kategori IN (2, 8) OR tr_baslik LIKE '%Gökçe Özel kimdir%'");
$rows = $q->fetchAll(PDO::FETCH_ASSOC);

echo "<pre>";
print_r($rows);
echo "</pre>";
?>
