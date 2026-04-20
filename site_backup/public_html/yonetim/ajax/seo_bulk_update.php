<?php
ini_set('display_errors', 0); // Return JSON only
header('Content-Type: application/json');

include("../baglan.php");
// Helper functions
include("../baglanti/veritabanifonksiyonlari.php"); // Assuming this exists or needed
include("../baglanti/SeoService.php");

$response = ['status' => 'error', 'message' => 'Unknown error'];

try {
    // 1. Inputs
    $startRef = isset($_GET['start_ref']) ? intval($_GET['start_ref']) : 0;
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
    
    // 2. Fetch Content
    // We use 'eskayit' as the unique reference for updating if needed, or 'id' for iteration
    // Let's use 'id' for simple pagination/cursor
    // The table schema has 'id' (auto inc) and 'eskayit' (correlation id for languages?)
    // Let's iterate by 'id' to be safe and cover everything.
    
    $sorgu = "SELECT id, tr_baslik, tr_icerik, tr_seo_title, tr_seo_description, tr_seo_score FROM icerik WHERE id > :start_ref ORDER BY id ASC LIMIT :limit";
    $stmt = $baglan->prepare($sorgu);
    $stmt->bindValue(':start_ref', $startRef, PDO::PARAM_INT);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();
    
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $count = count($rows);
    
    if ($count > 0) {
        $seoService = new SeoService();
        $updated = 0;
        $lastId = $startRef;
        
        foreach ($rows as $row) {
            $lastId = $row['id'];
            
            // Calculate Score
            // Use tr_seo_title if exists, else tr_baslik
            $title = $row['tr_baslik'];
            $seoTitle = $row['tr_seo_title'];
            $seoDesc = $row['tr_seo_description'];
            $content = $row['tr_icerik']; // Assuming HTML content
            
            $result = $seoService->calculateScore($title, $seoTitle, $seoDesc, $content);
            $newScore = $result['score'];
            
            // Update DB if score changed (or always to be sure)
            // Optimize: only update if different? 
            // For bulk tool, just update.
            
            $updateSql = "UPDATE icerik SET tr_seo_score = :score WHERE id = :id";
            $updateStmt = $baglan->prepare($updateSql);
            $updateStmt->execute([
                ':score' => $newScore,
                ':id' => $row['id']
            ]);
            
            $updated++;
        }
        
        // Check if there are more
        $checkMore = $baglan->prepare("SELECT id FROM icerik WHERE id > :last_id LIMIT 1");
        $checkMore->execute([':last_id' => $lastId]);
        $hasMore = $checkMore->rowCount() > 0;
        
        $response = [
            'status' => 'success',
            'processed_count' => $updated,
            'last_ref' => $lastId,
            'has_more' => $hasMore
        ];
        
    } else {
        $response = [
            'status' => 'success',
            'processed_count' => 0,
            'last_ref' => $startRef,
            'has_more' => false,
            'message' => 'No more content to process.'
        ];
    }

} catch (Exception $e) {
    $response = ['status' => 'error', 'message' => $e->getMessage()];
    http_response_code(500);
}

echo json_encode($response);
?>
