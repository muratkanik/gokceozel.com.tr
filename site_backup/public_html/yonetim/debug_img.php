<?php
include("baglan.php");
$q = $baglan->prepare("SELECT kayit_id FROM icerik_belge WHERE belge LIKE '%4f22e1653e29%'");
$q->execute();
if ($row = $q->fetch()) {
    $kayit_id = $row['kayit_id'];
    echo "Found kayit_id: " . $kayit_id . "<br>";
    $q2 = $baglan->prepare("SELECT id, kategori, tr_baslik FROM icerik WHERE eskayit = ?");
    $q2->execute([$kayit_id]);
    if ($row2 = $q2->fetch()) {
        echo "Row in icerik -> ID: {$row2['id']}, Kategori: {$row2['kategori']}, Baslik: {$row2['tr_baslik']}";
    }
} else {
    echo "Image not found in DB.";
}
?>
