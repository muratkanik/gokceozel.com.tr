<?php
/**
 * SEO Dashboard
 * Comprehensive SEO scoring and analysis overview
 */
session_start();
require_once '../baglanti/baglan.php';
require_once '../baglanti/seo_analyzer.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

// Get overall statistics
$stats_query = "SELECT
    COUNT(*) as total_pages,
    AVG(total_score) as avg_score,
    MIN(total_score) as min_score,
    MAX(total_score) as max_score,
    COUNT(CASE WHEN total_score >= 85 THEN 1 END) as excellent,
    COUNT(CASE WHEN total_score >= 70 AND total_score < 85 THEN 1 END) as good,
    COUNT(CASE WHEN total_score >= 50 AND total_score < 70 THEN 1 END) as fair,
    COUNT(CASE WHEN total_score < 50 THEN 1 END) as poor
    FROM seo_scores";

$stats = $baglan->query($stats_query)->fetch(PDO::FETCH_ASSOC);

// Get language-wise scores
$lang_scores_query = "SELECT
    language_code,
    AVG(total_score) as avg_score,
    COUNT(*) as page_count
    FROM seo_scores
    GROUP BY language_code
    ORDER BY avg_score DESC";

$lang_scores = $baglan->query($lang_scores_query)->fetchAll(PDO::FETCH_ASSOC);

// Get all pages with scores
$pages_query = "SELECT
    s.*,
    i.tr_baslik,
    i.en_baslik
    FROM seo_scores s
    LEFT JOIN icerik i ON s.content_id = i.id
    ORDER BY s.total_score ASC
    LIMIT 50";

$pages = $baglan->query($pages_query)->fetchAll(PDO::FETCH_ASSOC);

// Get component averages
$components_query = "SELECT
    AVG(title_score) as title,
    AVG(description_score) as description,
    AVG(keywords_score) as keywords,
    AVG(content_quality_score) as content,
    AVG(url_score) as url,
    AVG(image_optimization_score) as images,
    AVG(internal_links_score) as links,
    AVG(readability_score) as readability
    FROM seo_scores";

$components = $baglan->query($components_query)->fetch(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SEO Dashboard - CMS</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

    <style>
        :root { --sidebar-width: 260px; }
        body { font-family: 'Inter', sans-serif; background: #f8fafc; }
        .main-content { margin-left: var(--sidebar-width); padding: 2rem; }

        .score-card {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            height: 100%;
        }

        .score-circle {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            font-weight: 700;
            position: relative;
        }

        .score-excellent { background: linear-gradient(135deg, #10b981, #059669); color: white; }
        .score-good { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; }
        .score-fair { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; }
        .score-poor { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; }

        .component-bar {
            height: 30px;
            background: #e2e8f0;
            border-radius: 15px;
            overflow: hidden;
            position: relative;
        }

        .component-bar-fill {
            height: 100%;
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 10px;
            color: white;
            font-weight: 600;
            font-size: 0.875rem;
            transition: width 0.5s ease;
        }

        .page-score-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 50px;
            height: 50px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 1.125rem;
        }

        .grade-badge {
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.875rem;
        }
    </style>
</head>
<body>
    <?php include 'sidebar.php'; ?>

    <div class="main-content">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h1>SEO Dashboard</h1>
                <p class="text-muted mb-0">Tüm sayfalarınızın SEO performans analizi</p>
            </div>
            <button class="btn btn-primary" onclick="runFullAnalysis()">
                <i class="bi bi-arrow-repeat"></i> Tüm Sayfaları Yeniden Analiz Et
            </button>
        </div>

        <!-- Overall Stats -->
        <div class="row g-4 mb-4">
            <div class="col-md-3">
                <div class="score-card text-center">
                    <div class="score-circle score-<?php
                        $avg = round($stats['avg_score']);
                        echo $avg >= 85 ? 'excellent' : ($avg >= 70 ? 'good' : ($avg >= 50 ? 'fair' : 'poor'));
                    ?> mx-auto mb-3">
                        <?php echo $avg; ?>%
                    </div>
                    <h6 class="mb-0">Ortalama SEO Skoru</h6>
                    <small class="text-muted"><?php echo $stats['total_pages']; ?> sayfa analiz edildi</small>
                </div>
            </div>

            <div class="col-md-3">
                <div class="score-card">
                    <h6 class="text-success mb-3">
                        <i class="bi bi-trophy"></i> Mükemmel Sayfalar
                    </h6>
                    <div class="display-4 mb-2"><?php echo $stats['excellent']; ?></div>
                    <small class="text-muted">85% ve üzeri skor</small>
                </div>
            </div>

            <div class="col-md-3">
                <div class="score-card">
                    <h6 class="text-primary mb-3">
                        <i class="bi bi-check-circle"></i> İyi Sayfalar
                    </h6>
                    <div class="display-4 mb-2"><?php echo $stats['good']; ?></div>
                    <small class="text-muted">70-84% arası skor</small>
                </div>
            </div>

            <div class="col-md-3">
                <div class="score-card">
                    <h6 class="text-danger mb-3">
                        <i class="bi bi-exclamation-triangle"></i> İyileştirme Gerekli
                    </h6>
                    <div class="display-4 mb-2"><?php echo $stats['fair'] + $stats['poor']; ?></div>
                    <small class="text-muted">70% altı skor</small>
                </div>
            </div>
        </div>

        <!-- Language Performance -->
        <div class="row g-4 mb-4">
            <div class="col-md-6">
                <div class="score-card">
                    <h5 class="mb-4"><i class="bi bi-globe"></i> Dillere Göre Performans</h5>
                    <canvas id="languageChart" height="200"></canvas>
                </div>
            </div>

            <div class="col-md-6">
                <div class="score-card">
                    <h5 class="mb-4"><i class="bi bi-bar-chart"></i> Skor Dağılımı</h5>
                    <canvas id="scoreDistributionChart" height="200"></canvas>
                </div>
            </div>
        </div>

        <!-- Component Scores -->
        <div class="score-card mb-4">
            <h5 class="mb-4"><i class="bi bi-puzzle"></i> Bileşen Skorları (Ortalama)</h5>
            <div class="row g-3">
                <?php
                $component_labels = [
                    'title' => ['icon' => 'bi-card-heading', 'label' => 'Başlık'],
                    'description' => ['icon' => 'bi-text-paragraph', 'label' => 'Açıklama'],
                    'keywords' => ['icon' => 'bi-tags', 'label' => 'Anahtar Kelimeler'],
                    'content' => ['icon' => 'bi-file-text', 'label' => 'İçerik Kalitesi'],
                    'url' => ['icon' => 'bi-link-45deg', 'label' => 'URL'],
                    'images' => ['icon' => 'bi-image', 'label' => 'Görseller'],
                    'links' => ['icon' => 'bi-diagram-3', 'label' => 'İç Bağlantılar'],
                    'readability' => ['icon' => 'bi-book', 'label' => 'Okunabilirlik']
                ];

                foreach ($component_labels as $key => $info):
                    $score = round($components[$key]);
                    $color = $score >= 85 ? '#10b981' : ($score >= 70 ? '#3b82f6' : ($score >= 50 ? '#f59e0b' : '#ef4444'));
                ?>
                <div class="col-md-6">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span><i class="bi <?php echo $info['icon']; ?>"></i> <?php echo $info['label']; ?></span>
                        <strong><?php echo $score; ?>%</strong>
                    </div>
                    <div class="component-bar">
                        <div class="component-bar-fill" style="width: <?php echo $score; ?>%; background: <?php echo $color; ?>;">
                            <?php echo $score; ?>%
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>

        <!-- Pages List -->
        <div class="score-card">
            <h5 class="mb-4"><i class="bi bi-list-check"></i> Tüm Sayfalar (En Düşük Skordan Başlayarak)</h5>
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Skor</th>
                            <th>Sayfa</th>
                            <th>Dil</th>
                            <th>Tip</th>
                            <th>Son Analiz</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($pages as $page): ?>
                        <tr>
                            <td>
                                <div class="page-score-badge score-<?php
                                    $score = $page['total_score'];
                                    echo $score >= 85 ? 'excellent' : ($score >= 70 ? 'good' : ($score >= 50 ? 'fair' : 'poor'));
                                ?>">
                                    <?php echo $score; ?>
                                </div>
                            </td>
                            <td>
                                <strong><?php echo htmlspecialchars($page['tr_baslik'] ?: $page['en_baslik'] ?: 'Unnamed'); ?></strong>
                                <br>
                                <small class="text-muted"><?php echo htmlspecialchars($page['url_path']); ?></small>
                            </td>
                            <td>
                                <span class="badge bg-secondary"><?php echo $page['language_code']; ?></span>
                            </td>
                            <td><?php echo str_replace('_', ' ', ucfirst($page['page_type'])); ?></td>
                            <td>
                                <small class="text-muted">
                                    <?php echo date('d.m.Y H:i', strtotime($page['last_analyzed'])); ?>
                                </small>
                            </td>
                            <td>
                                <?php if ($page['content_id']): ?>
                                <a href="content-edit.php?id=<?php echo $page['content_id']; ?>"
                                   class="btn btn-sm btn-outline-primary">
                                    <i class="bi bi-pencil"></i> Düzenle
                                </a>
                                <?php endif; ?>
                                <button class="btn btn-sm btn-outline-secondary"
                                        onclick="reanalyze(<?php echo $page['id']; ?>)">
                                    <i class="bi bi-arrow-repeat"></i>
                                </button>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <script>
        // Language Performance Chart
        const languageData = <?php echo json_encode($lang_scores); ?>;
        const langCtx = document.getElementById('languageChart').getContext('2d');
        new Chart(langCtx, {
            type: 'bar',
            data: {
                labels: languageData.map(l => l.language_code),
                datasets: [{
                    label: 'Ortalama SEO Skoru',
                    data: languageData.map(l => Math.round(l.avg_score)),
                    backgroundColor: 'rgba(37, 99, 235, 0.8)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, max: 100 }
                }
            }
        });

        // Score Distribution Chart
        const distCtx = document.getElementById('scoreDistributionChart').getContext('2d');
        new Chart(distCtx, {
            type: 'doughnut',
            data: {
                labels: ['Mükemmel (85+)', 'İyi (70-84)', 'Orta (50-69)', 'Zayıf (<50)'],
                datasets: [{
                    data: [
                        <?php echo $stats['excellent']; ?>,
                        <?php echo $stats['good']; ?>,
                        <?php echo $stats['fair']; ?>,
                        <?php echo $stats['poor']; ?>
                    ],
                    backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        function runFullAnalysis() {
            if (confirm('Tüm sayfalar yeniden analiz edilecek. Bu işlem birkaç dakika sürebilir. Devam etmek istiyor musunuz?')) {
                window.location.href = 'seo-analyze-all.php';
            }
        }

        function reanalyze(scoreId) {
            // Implement single page re-analysis
            alert('Sayfa yeniden analiz edilecek...');
        }
    </script>
</body>
</html>
