<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include("baglan.php");

try {
    echo "<h3>Testing Column Existence</h3>";
    $stm = $baglan->query("SHOW COLUMNS FROM icerik LIKE 'tr_seo_score'");
    $col = $stm->fetch(PDO::FETCH_ASSOC);
    if ($col) {
        echo "Column 'tr_seo_score' exists.<br>";
        print_r($col);
    } else {
        echo "Column 'tr_seo_score' DOES NOT exist.<br>";
    }

    echo "<h3>Testing Query execution</h3>";
    $sql = "SELECT et.id, et.tr_seo_score FROM icerik et ORDER BY et.tr_seo_score DESC LIMIT 5";
    echo "Query: $sql<br>";
    
    $stm = $baglan->prepare($sql);
    $stm->execute();
    $rows = $stm->fetchAll(PDO::FETCH_ASSOC);
    echo "Query executed successfully. Result count: " . count($rows) . "<br>";
    echo "<pre>";
    print_r($rows);
    echo "</pre>";

} catch (PDOException $e) {
    echo "<div style='color:red; font-weight:bold;'>PDO Error: " . $e->getMessage() . "</div>";
} catch (Exception $e) {
    echo "<div style='color:red; font-weight:bold;'>General Error: " . $e->getMessage() . "</div>";
}
?>
