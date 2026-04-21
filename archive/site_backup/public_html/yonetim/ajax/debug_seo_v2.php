<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "Starting debug V2...<br>";

include("../baglan.php");
// Helper functions
include("../baglanti/veritabanifonksiyonlari.php"); // Assuming this exists or needed
include("../baglanti/SeoService.php");

echo "Files included.<br>";

try {
    $startRef = 0;
    $limit = 5;
    
    echo "Preparing query...<br>";
    // Check columns first? No, just try the query.
    // NOTE: Using 'eskayit' maybe? No, 'id'.
    
    $sorgu = "SELECT id, tr_baslik, tr_icerik, tr_seotitle, tr_seodescription, tr_seo_score FROM icerik WHERE id > :start_ref ORDER BY id ASC LIMIT :limit";
    $stmt = $baglan->prepare($sorgu);
    $stmt->bindValue(':start_ref', $startRef, PDO::PARAM_INT);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    echo "Executing query...<br>";
    $stmt->execute();
    
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "Query executed. Rows found: " . count($rows) . "<br>";
    
    $seoService = new SeoService();
    
    foreach ($rows as $row) {
        echo "Processing ID: " . $row['id'] . "<br>";
        
        $title = $row['tr_baslik'];
        $seoTitle = $row['tr_seotitle'];
        $seoDesc = $row['tr_seodescription'];
        $content = $row['tr_icerik'];
        
        // Debug lengths
        echo "Title Len: " . strlen($title) . "<br>";
        
        $result = $seoService->calculateScore($title, $seoTitle, $seoDesc, $content);
        echo "Score: " . $result['score'] . "<br>";
        
        $newScore = $result['score'];
        
        // Try update
        $updateSql = "UPDATE icerik SET tr_seo_score = :score WHERE id = :id";
        $updateStmt = $baglan->prepare($updateSql);
        $updateStmt->execute([
            ':score' => $newScore,
            ':id' => $row['id']
        ]);
        echo "Update success.<br><hr>";
    }
    
    echo "Loop complete.<br>";
    
} catch (Exception $e) {
    echo "EXCEPTION: " . $e->getMessage() . "<br>";
    echo "Trace: " . $e->getTraceAsString();
}
?>
