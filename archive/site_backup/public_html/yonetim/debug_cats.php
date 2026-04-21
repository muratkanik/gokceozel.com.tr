<?php
include("baglan.php");
$q = $baglan->query("SELECT id, tr_isim, en_isim FROM genel_kategori WHERE ust_menu = '1'");
while ($row = $q->fetch(PDO::FETCH_ASSOC)) {
    echo "ID " . $row['id'] . " | TR: " . $row['tr_isim'] . " | EN: " . $row['en_isim'] . "<br>";
}
echo "<br>Subcategories:<br>";
$q2 = $baglan->query("SELECT id, tr_isim, en_isim FROM genel_kategori WHERE anakategori != '0'");
while ($row = $q2->fetch(PDO::FETCH_ASSOC)) {
    echo "ID " . $row['id'] . " | TR: " . $row['tr_isim'] . " | EN: " . $row['en_isim'] . "<br>";
}
?>
