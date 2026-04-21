<?php
include("baglan.php");
$q3 = $baglan->query("SELECT id, tr_baslik FROM icerik WHERE kategori = 52");
while($item = $q3->fetch(PDO::FETCH_ASSOC)) {
    echo "<li>ID: {$item['id']} - " . htmlspecialchars($item['tr_baslik']) . "</li>";
}
?>
