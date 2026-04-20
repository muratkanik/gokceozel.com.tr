<?php
include("baglan.php");
// Find kayit_id for image
$q = $baglan->prepare("SELECT kayit_id FROM icerik_belge WHERE belge LIKE '%b6a210eca964e5576d44%'");
$q->execute();
if ($row = $q->fetch()) {
    $kayit_id = $row['kayit_id'];
    echo "Found rogue kayit_id: " . $kayit_id . "<br>";
    // Find corresponding icerik
    $q2 = $baglan->prepare("SELECT id, kategori, tr_baslik, LENGTH(tr_icerik) as len FROM icerik WHERE eskayit = ?");
    $q2->execute([$kayit_id]);
    if ($row2 = $q2->fetch()) {
        echo "Row in icerik -> ID: {$row2['id']}, Kategori: {$row2['kategori']}, Baslik: {$row2['tr_baslik']}, Icerik Len: {$row2['len']}";
    }
}
?>
