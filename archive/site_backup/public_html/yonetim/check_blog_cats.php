<?php
include("baglan.php");

echo "<h3>Category Content Counts</h3>";
$q = $baglan->query("
    SELECT k.id, k.tr_isim, COUNT(i.id) as count 
    FROM genel_kategori k 
    LEFT JOIN icerik i ON i.kategori = k.id 
    GROUP BY k.id, k.tr_isim 
    ORDER BY count DESC
");

echo "<table border='1'><tr><th>ID</th><th>Name</th><th>Count</th></tr>";
while ($row = $q->fetch(PDO::FETCH_ASSOC)) {
    echo "<tr><td>{$row['id']}</td><td>{$row['tr_isim']}</td><td>{$row['count']}</td></tr>";
}
echo "</table>";

echo "<h3>Preview Top 5 Items in Category with most items (excluding empty)</h3>";
// Find category with most items that isn't empty
$q2 = $baglan->query("
    SELECT kategori, COUNT(*) as c FROM icerik GROUP BY kategori ORDER BY c DESC LIMIT 3
");
while($catRow = $q2->fetch(PDO::FETCH_ASSOC)) {
    echo "<h4>Category {$catRow['kategori']}</h4>";
    $q3 = $baglan->query("SELECT id, tr_baslik FROM icerik WHERE kategori = {$catRow['kategori']} LIMIT 5");
    echo "<ul>";
    while($item = $q3->fetch(PDO::FETCH_ASSOC)) {
        echo "<li>ID: {$item['id']} - " . htmlspecialchars($item['tr_baslik']) . "</li>";
    }
    echo "</ul>";
}
?>
