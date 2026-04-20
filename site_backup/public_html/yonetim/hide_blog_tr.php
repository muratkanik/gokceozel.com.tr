<?php
include("baglan.php");
// Category 52 is Blog. The user: "blog türkçede görünmesin diğer dillerde görünsün"
$baglan->query("UPDATE genel_kategori SET tr_goster = '0' WHERE id = 52");
echo "Blog hidden from TR menu.";
?>
