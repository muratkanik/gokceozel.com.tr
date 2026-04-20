<?php
/**
 * Test SEO Analyzer
 * Analyzes sample pages and displays scores
 */

require_once __DIR__ . '/site_backup/public_html/baglanti/baglan.php';
require_once __DIR__ . '/site_backup/public_html/baglanti/seo_analyzer.php';

echo "=== SEO Analyzer Test ===\n\n";

// Initialize analyzer
$analyzer = new SEOAnalyzer($baglan, 'TR');

// Test 1: Analyze a service page
echo "Test 1: Analyzing Service Page (Rinoplasti)...\n";

$service_query = "SELECT * FROM icerik WHERE kategori IN (42,43) AND durum='1' LIMIT 1";
$stmt = $baglan->query($service_query);
$service = $stmt->fetch(PDO::FETCH_ASSOC);

if ($service) {
    $analysis = $analyzer->analyzePage('service_detail', $service, '');

    echo "Title: " . $service['tr_baslik'] . "\n";
    echo "Total Score: " . $analysis['total_score'] . " (Grade: " . $analysis['grade'] . ")\n\n";

    echo "Component Scores:\n";
    foreach ($analysis['scores'] as $component => $score) {
        $bar = str_repeat('█', round($score / 5));
        echo sprintf("  %-15s: %3d%% %s\n", ucfirst($component), $score, $bar);
    }

    echo "\nMetadata:\n";
    echo "  Word Count: " . $analysis['metadata']['word_count'] . "\n";
    echo "  Reading Time: " . $analysis['metadata']['reading_time'] . " minutes\n";
    echo "  URL: " . $analysis['metadata']['url'] . "\n\n";
}

// Test 2: Analyze a blog page
echo "\nTest 2: Analyzing Blog Page...\n";

$blog_query = "SELECT * FROM icerik WHERE kategori = 52 AND durum='1' LIMIT 1";
$stmt = $baglan->query($blog_query);
$blog = $stmt->fetch(PDO::FETCH_ASSOC);

if ($blog) {
    $analysis = $analyzer->analyzePage('blog_detail', $blog, '');

    echo "Title: " . $blog['tr_baslik'] . "\n";
    echo "Total Score: " . $analysis['total_score'] . " (Grade: " . $analysis['grade'] . ")\n\n";

    echo "Component Scores:\n";
    foreach ($analysis['scores'] as $component => $score) {
        $bar = str_repeat('█', round($score / 5));
        echo sprintf("  %-15s: %3d%% %s\n", ucfirst($component), $score, $bar);
    }
}

// Test 3: Get average score
echo "\n\nTest 3: Overall Site Statistics...\n";
$avg_score = $analyzer->getAverageScore('TR');
echo "Average SEO Score (Turkish): " . $avg_score . "%\n";

// Test 4: Find low-scoring pages
echo "\nTest 4: Pages Needing Improvement (Score < 70)...\n";
$low_pages = $analyzer->getLowScoringPages(70);

if (count($low_pages) > 0) {
    foreach ($low_pages as $page) {
        echo sprintf("  - %s (ID: %s) - Score: %d%% (Grade: %s)\n",
            $page['page_type'],
            $page['content_id'] ?? 'N/A',
            $page['total_score'],
            $page['score_grade']
        );
    }
} else {
    echo "  All pages scoring 70% or higher! 🎉\n";
}

echo "\n=== Analysis Complete ===\n";
echo "\nSEO Scores saved to database table 'seo_scores'\n";
echo "View scores in admin panel or query database directly.\n";
?>
