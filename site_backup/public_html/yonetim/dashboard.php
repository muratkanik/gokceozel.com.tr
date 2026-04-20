<?php
/**
 * Modern Admin Dashboard
 * Multi-language CMS with SEO Management
 */
session_start();
require_once '../baglanti/baglan.php';
require_once '../baglanti/seo_analyzer.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

// Get dashboard statistics
$stats_query = "SELECT
    (SELECT COUNT(*) FROM icerik WHERE durum='1') as total_content,
    (SELECT COUNT(*) FROM icerik WHERE durum='1' AND kategori IN (42,43)) as total_services,
    (SELECT COUNT(*) FROM icerik WHERE durum='1' AND kategori=52) as total_blogs,
    (SELECT COUNT(*) FROM genel_kategori WHERE durum='1') as total_categories,
    (SELECT AVG(total_score) FROM seo_scores) as avg_seo_score,
    (SELECT COUNT(*) FROM seo_scores WHERE total_score < 70) as low_seo_pages";

$stats_stmt = $baglan->query($stats_query);
$stats = $stats_stmt->fetch(PDO::FETCH_ASSOC);

// Get recent content
$recent_query = "SELECT id, tr_baslik, en_baslik, kategori, kayit_tarihi, guncelleme_tarihi
                 FROM icerik WHERE durum='1'
                 ORDER BY guncelleme_tarihi DESC LIMIT 5";
$recent_stmt = $baglan->query($recent_query);
$recent_content = $recent_stmt->fetchAll(PDO::FETCH_ASSOC);

// Get SEO score distribution
$seo_dist_query = "SELECT
    score_grade,
    COUNT(*) as count
    FROM seo_scores
    GROUP BY score_grade
    ORDER BY
        CASE score_grade
            WHEN 'A+' THEN 1
            WHEN 'A' THEN 2
            WHEN 'B' THEN 3
            WHEN 'C' THEN 4
            WHEN 'D' THEN 5
            WHEN 'F' THEN 6
        END";
$seo_dist_stmt = $baglan->query($seo_dist_query);
$seo_distribution = $seo_dist_stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Prof. Dr. Gökçe Özel CMS</title>

    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

    <style>
        :root {
            --primary-color: #2563eb;
            --secondary-color: #64748b;
            --success-color: #10b981;
            --warning-color: #f59e0b;
            --danger-color: #ef4444;
            --sidebar-width: 260px;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f8fafc;
        }

        .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            width: var(--sidebar-width);
            background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
            color: white;
            overflow-y: auto;
            z-index: 1000;
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
        }

        .sidebar-logo {
            padding: 1.5rem;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            font-size: 1.25rem;
            font-weight: 700;
        }

        .sidebar-menu {
            padding: 1rem 0;
        }

        .sidebar-menu-item {
            display: flex;
            align-items: center;
            padding: 0.75rem 1.5rem;
            color: rgba(255,255,255,0.7);
            text-decoration: none;
            transition: all 0.2s;
        }

        .sidebar-menu-item:hover,
        .sidebar-menu-item.active {
            background: rgba(255,255,255,0.1);
            color: white;
        }

        .sidebar-menu-item i {
            width: 24px;
            margin-right: 0.75rem;
            font-size: 1.25rem;
        }

        .main-content {
            margin-left: var(--sidebar-width);
            padding: 2rem;
        }

        .stat-card {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .stat-number {
            font-size: 2rem;
            font-weight: 700;
            margin: 0.5rem 0;
        }

        .stat-label {
            color: var(--secondary-color);
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .stat-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
        }

        .card-header-custom {
            background: white;
            border-bottom: 2px solid #e2e8f0;
            padding: 1.25rem;
            font-weight: 600;
        }

        .badge-score {
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 600;
        }

        .grade-a-plus { background: #10b981; color: white; }
        .grade-a { background: #3b82f6; color: white; }
        .grade-b { background: #f59e0b; color: white; }
        .grade-c { background: #f97316; color: white; }
        .grade-d { background: #ef4444; color: white; }
        .grade-f { background: #991b1b; color: white; }

        .quick-action-btn {
            padding: 1rem;
            border-radius: 12px;
            border: 2px solid #e2e8f0;
            background: white;
            text-align: center;
            text-decoration: none;
            color: #0f172a;
            transition: all 0.2s;
            display: block;
        }

        .quick-action-btn:hover {
            border-color: var(--primary-color);
            background: #f0f9ff;
            color: var(--primary-color);
            transform: translateY(-2px);
        }

        .quick-action-btn i {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            display: block;
        }
    </style>
</head>
<body>
    <!-- Sidebar -->
    <div class="sidebar">
        <div class="sidebar-logo">
            <i class="bi bi-hospital"></i> Dr. Gökçe CMS
        </div>

        <div class="sidebar-menu">
            <a href="dashboard.php" class="sidebar-menu-item active">
                <i class="bi bi-speedometer2"></i>
                Dashboard
            </a>
            <a href="content-list.php" class="sidebar-menu-item">
                <i class="bi bi-file-text"></i>
                İçerik Yönetimi
            </a>
            <a href="content-edit.php?new=1" class="sidebar-menu-item">
                <i class="bi bi-plus-circle"></i>
                Yeni İçerik
            </a>
            <a href="categories.php" class="sidebar-menu-item">
                <i class="bi bi-folder"></i>
                Kategoriler
            </a>
            <a href="seo-dashboard.php" class="sidebar-menu-item">
                <i class="bi bi-graph-up"></i>
                SEO Skorları
            </a>
            <a href="media-library.php" class="sidebar-menu-item">
                <i class="bi bi-images"></i>
                Medya Kütüphanesi
            </a>
            <a href="translations.php" class="sidebar-menu-item">
                <i class="bi bi-translate"></i>
                Çeviriler
            </a>
            <a href="settings.php" class="sidebar-menu-item">
                <i class="bi bi-gear"></i>
                Ayarlar
            </a>
        </div>

        <div style="position: absolute; bottom: 1rem; left: 0; right: 0; padding: 0 1.5rem;">
            <div style="padding: 1rem; background: rgba(255,255,255,0.1); border-radius: 8px;">
                <div style="font-size: 0.875rem; margin-bottom: 0.5rem;">
                    <i class="bi bi-person-circle"></i> <?php echo $_SESSION['username'] ?? 'Admin'; ?>
                </div>
                <a href="logout.php" style="color: rgba(255,255,255,0.7); font-size: 0.875rem; text-decoration: none;">
                    <i class="bi bi-box-arrow-right"></i> Çıkış Yap
                </a>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
        <div class="mb-4">
            <h1 class="mb-1">Dashboard</h1>
            <p class="text-muted">Hoş geldiniz! İşte sitenizin genel durumu.</p>
        </div>

        <!-- Statistics Cards -->
        <div class="row g-4 mb-4">
            <div class="col-md-3">
                <div class="stat-card">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <div class="stat-label">Toplam İçerik</div>
                            <div class="stat-number"><?php echo $stats['total_content']; ?></div>
                        </div>
                        <div class="stat-icon" style="background: #dbeafe; color: #2563eb;">
                            <i class="bi bi-file-text"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-3">
                <div class="stat-card">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <div class="stat-label">Hizmetler</div>
                            <div class="stat-number"><?php echo $stats['total_services']; ?></div>
                        </div>
                        <div class="stat-icon" style="background: #dcfce7; color: #10b981;">
                            <i class="bi bi-briefcase"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-3">
                <div class="stat-card">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <div class="stat-label">Blog Yazıları</div>
                            <div class="stat-number"><?php echo $stats['total_blogs']; ?></div>
                        </div>
                        <div class="stat-icon" style="background: #fef3c7; color: #f59e0b;">
                            <i class="bi bi-journal-text"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-3">
                <div class="stat-card">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <div class="stat-label">Ortalama SEO Skoru</div>
                            <div class="stat-number"><?php echo round($stats['avg_seo_score']); ?>%</div>
                        </div>
                        <div class="stat-icon" style="background: #fee2e2; color: #ef4444;">
                            <i class="bi bi-graph-up"></i>
                        </div>
                    </div>
                    <?php if ($stats['low_seo_pages'] > 0): ?>
                    <div class="mt-2">
                        <small class="text-warning">
                            <i class="bi bi-exclamation-triangle"></i>
                            <?php echo $stats['low_seo_pages']; ?> sayfa SEO iyileştirme bekliyor
                        </small>
                    </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <!-- Quick Actions & Recent Content -->
        <div class="row g-4">
            <!-- Quick Actions -->
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header-custom">
                        <i class="bi bi-lightning-charge"></i> Hızlı İşlemler
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-6">
                                <a href="content-edit.php?new=1&type=service" class="quick-action-btn">
                                    <i class="bi bi-plus-circle-fill"></i>
                                    Yeni Hizmet
                                </a>
                            </div>
                            <div class="col-6">
                                <a href="content-edit.php?new=1&type=blog" class="quick-action-btn">
                                    <i class="bi bi-pencil-square"></i>
                                    Yeni Blog
                                </a>
                            </div>
                            <div class="col-6">
                                <a href="media-library.php?upload=1" class="quick-action-btn">
                                    <i class="bi bi-cloud-upload"></i>
                                    Medya Yükle
                                </a>
                            </div>
                            <div class="col-6">
                                <a href="seo-dashboard.php" class="quick-action-btn">
                                    <i class="bi bi-search"></i>
                                    SEO Analiz
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SEO Score Distribution -->
                <div class="card mt-4">
                    <div class="card-header-custom">
                        <i class="bi bi-pie-chart"></i> SEO Skor Dağılımı
                    </div>
                    <div class="card-body">
                        <?php foreach ($seo_distribution as $grade): ?>
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge-score grade-<?php echo strtolower(str_replace('+', '-plus', $grade['score_grade'])); ?>">
                                <?php echo $grade['score_grade']; ?>
                            </span>
                            <span><?php echo $grade['count']; ?> sayfa</span>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>

            <!-- Recent Content -->
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header-custom d-flex justify-content-between align-items-center">
                        <span><i class="bi bi-clock-history"></i> Son Güncellenen İçerikler</span>
                        <a href="content-list.php" class="btn btn-sm btn-primary">Tümünü Gör</a>
                    </div>
                    <div class="card-body p-0">
                        <table class="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Başlık (TR)</th>
                                    <th>Başlık (EN)</th>
                                    <th>Kategori</th>
                                    <th>Son Güncelleme</th>
                                    <th>İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($recent_content as $item): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($item['tr_baslik']); ?></td>
                                    <td><?php echo htmlspecialchars($item['en_baslik'] ?: '-'); ?></td>
                                    <td>
                                        <?php
                                        $cat_labels = [42 => 'Ameliyatsız', 43 => 'Cerrahi', 52 => 'Blog'];
                                        echo $cat_labels[$item['kategori']] ?? 'Diğer';
                                        ?>
                                    </td>
                                    <td>
                                        <small class="text-muted">
                                            <?php echo date('d.m.Y H:i', strtotime($item['guncelleme_tarihi'])); ?>
                                        </small>
                                    </td>
                                    <td>
                                        <a href="content-edit.php?id=<?php echo $item['id']; ?>" class="btn btn-sm btn-outline-primary">
                                            <i class="bi bi-pencil"></i>
                                        </a>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
