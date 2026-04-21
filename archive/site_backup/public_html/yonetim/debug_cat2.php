<?php
include("baglan.php");
$q = $baglan->query("SELECT id, tr_baslik, LENGTH(tr_icerik) as len, tr_icerik FROM icerik WHERE kategori = '2' AND durum != '-1' ORDER BY id DESC LIMIT 1");
if ($row = $q->fetch(PDO::FETCH_ASSOC)) {
    echo "ID: " . $row['id'] . "<br>";
    echo "Title: " . $row['tr_baslik'] . "<br>";
    echo "Content Length: " . $row['len'] . "<br>";
    echo "Content Preview: " . htmlspecialchars(substr($row['tr_icerik'], 0, 500)) . "<br>";
} else {
    echo "No item found in kategori 2 with durum != -1";
}
?>
