<?php
require(__DIR__ . '/baglanti/baglan.php');

$q = $baglan->query("SELECT id, tr_baslik, ru_baslik FROM icerik  where kategori='2' and durum!='-1' order by id desc limit 0,1");
$row = $q->fetch(PDO::FETCH_ASSOC);

echo "kategori=2:\n";
print_r($row);

$q2 = $baglan->query("SELECT id, tr_baslik, ru_baslik FROM icerik where kategori='8' and durum!='-1' order by id desc limit 0,2");
$rows = $q2->fetchAll(PDO::FETCH_ASSOC);

echo "\nkategori=8:\n";
print_r($rows);
?>
