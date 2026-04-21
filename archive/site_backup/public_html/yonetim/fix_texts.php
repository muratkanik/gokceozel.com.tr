<?php
include("baglan.php");

echo "<h3>Text Visibility Debug</h3>";

// 1. Check one content item
$q = $baglan->query("SELECT id, tr_baslik, tr_icerik FROM icerik LIMIT 1");
$row = $q->fetch(PDO::FETCH_ASSOC);
echo "<b>Original tr_icerik (first 200 chars):</b><br>";
echo htmlspecialchars(substr($row['tr_icerik'], 0, 200)) . "<br><br>";

echo "<b>Decoded and stripped:</b><br>";
$decoded = strip_tags(html_entity_decode($row['tr_icerik'], ENT_QUOTES, 'UTF-8'));
echo mb_substr($decoded, 0, 120, 'UTF-8') . "<br><br>";

// 2. Search and replace "plastik cerrahi" -> "Estetik Cerrahi" (case insensitive search is tricky in SQL depending on collation, but we will use REPLACE for common cases)
echo "<h3>Replacing 'Plastik Cerrahi'</h3>";

$tables = ['genel_kategori' => ['tr_isim', 'tr_icerik'], 'icerik' => ['tr_baslik', 'tr_icerik']];
$searchTerms = ['Plastik Cerrahi', 'plastik cerrahi', 'PLASTİK CERRAHİ', 'Plastik cerrahi'];
$replacement = 'Estetik Cerrahi';

foreach ($tables as $table => $columns) {
    foreach ($columns as $column) {
        foreach ($searchTerms as $term) {
            $sql = "UPDATE $table SET $column = REPLACE($column, '$term', '$replacement') WHERE $column LIKE '%$term%'";
            $stmt = $baglan->prepare($sql);
            $stmt->execute();
            $count = $stmt->rowCount();
            if ($count > 0) {
                echo "Replaced '$term' in $table.$column: $count rows.<br>";
            }
        }
    }
}
echo "Done.";
?>
