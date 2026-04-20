<?php
/**
 * Multi-Language Content Editor
 * Modern WYSIWYG editor with real-time SEO scoring
 */
session_start();
require_once '../baglanti/baglan.php';
require_once '../baglanti/seo_analyzer.php';
require_once '../baglanti/url_helpers.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

$content_id = $_GET['id'] ?? null;
$is_new = isset($_GET['new']);
$content_type = $_GET['type'] ?? 'service';

$content = null;
$seo_scores = [];

if ($content_id) {
    $query = "SELECT * FROM icerik WHERE id = :id";
    $stmt = $baglan->prepare($query);
    $stmt->execute([':id' => $content_id]);
    $content = $stmt->fetch(PDO::FETCH_ASSOC);

    // Get SEO scores for all languages
    $seo_query = "SELECT * FROM seo_scores WHERE content_id = :id";
    $seo_stmt = $baglan->prepare($seo_query);
    $seo_stmt->execute([':id' => $content_id]);
    while ($score = $seo_stmt->fetch(PDO::FETCH_ASSOC)) {
        $seo_scores[$score['language_code']] = $score;
    }
}

// Categories
$categories_query = "SELECT id, tr_isim, en_isim FROM genel_kategori WHERE durum='1' ORDER BY sira";
$categories = $baglan->query($categories_query)->fetchAll(PDO::FETCH_ASSOC);

$languages = [
    'TR' => ['name' => 'Türkçe', 'flag' => '🇹🇷'],
    'EN' => ['name' => 'English', 'flag' => '🇬🇧'],
    'RU' => ['name' => 'Русский', 'flag' => '🇷🇺'],
    'AR' => ['name' => 'العربية', 'flag' => '🇸🇦'],
    'DE' => ['name' => 'Deutsch', 'flag' => '🇩🇪'],
    'FR' => ['name' => 'Français', 'flag' => '🇫🇷'],
    'CIN' => ['name' => '中文', 'flag' => '🇨🇳']
];
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $is_new ? 'Yeni İçerik' : 'İçerik Düzenle'; ?> - CMS</title>

    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">

    <!-- TinyMCE -->
    <script src="https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js" referrerpolicy="origin"></script>

    <style>
        :root {
            --sidebar-width: 260px;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: #f8fafc;
        }

        .editor-container {
            margin-left: var(--sidebar-width);
            padding: 2rem;
        }

        .language-tab {
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            padding: 0.75rem 1.5rem;
            background: white;
            cursor: pointer;
            transition: all 0.2s;
            margin-right: 0.5rem;
        }

        .language-tab:hover {
            border-color: #cbd5e1;
        }

        .language-tab.active {
            border-color: #2563eb;
            background: #eff6ff;
        }

        .language-tab .flag {
            font-size: 1.5rem;
            margin-right: 0.5rem;
        }

        .seo-score-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.875rem;
            font-weight: 600;
            margin-left: 0.5rem;
        }

        .score-excellent { background: #10b981; color: white; }
        .score-good { background: #3b82f6; color: white; }
        .score-fair { background: #f59e0b; color: white; }
        .score-poor { background: #ef4444; color: white; }

        .form-section {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .form-section-title {
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: 1rem;
            padding-bottom: 0.75rem;
            border-bottom: 2px solid #e2e8f0;
        }

        .char-counter {
            font-size: 0.875rem;
            color: #64748b;
            float: right;
        }

        .char-counter.warning {
            color: #f59e0b;
        }

        .char-counter.error {
            color: #ef4444;
        }

        .seo-tips {
            background: #f0f9ff;
            border-left: 4px solid #2563eb;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
        }

        .sticky-actions {
            position: sticky;
            top: 20px;
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <?php include 'sidebar.php'; ?>

    <div class="editor-container">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h1><?php echo $is_new ? 'Yeni İçerik Oluştur' : 'İçeriği Düzenle'; ?></h1>
                <p class="text-muted mb-0">
                    <?php if ($content_id): ?>
                    ID: <?php echo $content_id; ?> | Son güncelleme: <?php echo date('d.m.Y H:i', strtotime($content['guncelleme_tarihi'] ?? 'now')); ?>
                    <?php endif; ?>
                </p>
            </div>
            <a href="content-list.php" class="btn btn-outline-secondary">
                <i class="bi bi-arrow-left"></i> Geri Dön
            </a>
        </div>

        <form action="content-save.php" method="POST" id="contentForm">
            <input type="hidden" name="content_id" value="<?php echo $content_id; ?>">

            <div class="row">
                <div class="col-lg-8">
                    <!-- Language Tabs -->
                    <div class="d-flex flex-wrap mb-3" id="languageTabs">
                        <?php foreach ($languages as $code => $lang): ?>
                        <div class="language-tab <?php echo $code === 'TR' ? 'active' : ''; ?>"
                             onclick="switchLanguage('<?php echo strtolower($code); ?>')">
                            <span class="flag"><?php echo $lang['flag']; ?></span>
                            <?php echo $lang['name']; ?>
                            <?php if (isset($seo_scores[$code])): ?>
                            <span class="seo-score-badge score-<?php
                                $score = $seo_scores[$code]['total_score'];
                                echo $score >= 85 ? 'excellent' : ($score >= 70 ? 'good' : ($score >= 50 ? 'fair' : 'poor'));
                            ?>">
                                <?php echo $score; ?>%
                            </span>
                            <?php endif; ?>
                        </div>
                        <?php endforeach; ?>
                    </div>

                    <!-- Turkish Content (Default) -->
                    <div class="language-content" id="content-tr" style="display: block;">
                        <div class="form-section">
                            <div class="form-section-title">
                                <i class="bi bi-file-text"></i> İçerik (Türkçe)
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Başlık</label>
                                <span class="char-counter" id="tr-title-counter">0/60</span>
                                <input type="text" class="form-control form-control-lg" name="tr_baslik"
                                       value="<?php echo htmlspecialchars($content['tr_baslik'] ?? ''); ?>"
                                       maxlength="100" onkeyup="updateCharCounter('tr-title', this.value, 60)">
                                <small class="text-muted">Optimal: 50-60 karakter</small>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">SEO Title (Meta)</label>
                                <span class="char-counter" id="tr-seo-title-counter">0/60</span>
                                <input type="text" class="form-control" name="tr_seo_title"
                                       value="<?php echo htmlspecialchars($content['tr_seo_title'] ?? ''); ?>"
                                       maxlength="100" onkeyup="updateCharCounter('tr-seo-title', this.value, 60)">
                            </div>

                            <div class="mb-3">
                                <label class="form-label">SEO Description (Meta)</label>
                                <span class="char-counter" id="tr-seo-desc-counter">0/160</span>
                                <textarea class="form-control" name="tr_seo_description" rows="2"
                                          maxlength="200" onkeyup="updateCharCounter('tr-seo-desc', this.value, 160)"
                                ><?php echo htmlspecialchars($content['tr_seo_description'] ?? ''); ?></textarea>
                                <small class="text-muted">Optimal: 150-160 karakter</small>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">URL Slug</label>
                                <input type="text" class="form-control" name="tr_slug"
                                       value="<?php echo htmlspecialchars($content['tr_slug'] ?? ''); ?>"
                                       pattern="[a-z0-9-]+" placeholder="ornek-url-slug">
                                <small class="text-muted">Sadece küçük harf, rakam ve tire (-) kullanın</small>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Özet İçerik</label>
                                <textarea class="form-control" name="tr_icerik" rows="4"
                                ><?php echo htmlspecialchars($content['tr_icerik'] ?? ''); ?></textarea>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Detaylı İçerik</label>
                                <textarea class="form-control tinymce" name="tr_detay"
                                ><?php echo htmlspecialchars($content['tr_detay'] ?? ''); ?></textarea>
                            </div>

                            <div class="seo-tips">
                                <strong><i class="bi bi-lightbulb"></i> SEO İpuçları:</strong>
                                <ul class="mb-0 mt-2">
                                    <li>Başlığı 50-60 karakter arası tutun</li>
                                    <li>İçeriğinizi en az 300 kelime yapın</li>
                                    <li>Alt başlıklar (H2, H3) kullanın</li>
                                    <li>Görsellere alt text ekleyin</li>
                                    <li>İç bağlantılar (internal links) ekleyin</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Other Languages (Template - will be similar structure) -->
                    <?php foreach (['en', 'ru', 'ar', 'de', 'fr', 'cin'] as $lang_code): ?>
                    <div class="language-content" id="content-<?php echo $lang_code; ?>" style="display: none;">
                        <div class="form-section">
                            <div class="form-section-title">
                                <i class="bi bi-file-text"></i> İçerik (<?php echo $languages[strtoupper($lang_code)]['name']; ?>)
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Başlık</label>
                                <input type="text" class="form-control form-control-lg" name="<?php echo $lang_code; ?>_baslik"
                                       value="<?php echo htmlspecialchars($content[$lang_code.'_baslik'] ?? ''); ?>">
                            </div>

                            <div class="mb-3">
                                <label class="form-label">SEO Title</label>
                                <input type="text" class="form-control" name="<?php echo $lang_code; ?>_seo_title"
                                       value="<?php echo htmlspecialchars($content[$lang_code.'_seo_title'] ?? ''); ?>">
                            </div>

                            <div class="mb-3">
                                <label class="form-label">SEO Description</label>
                                <textarea class="form-control" name="<?php echo $lang_code; ?>_seo_description" rows="2"
                                ><?php echo htmlspecialchars($content[$lang_code.'_seo_description'] ?? ''); ?></textarea>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">URL Slug</label>
                                <input type="text" class="form-control" name="<?php echo $lang_code; ?>_slug"
                                       value="<?php echo htmlspecialchars($content[$lang_code.'_slug'] ?? ''); ?>">
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Özet İçerik</label>
                                <textarea class="form-control" name="<?php echo $lang_code; ?>_icerik" rows="4"
                                ><?php echo htmlspecialchars($content[$lang_code.'_icerik'] ?? ''); ?></textarea>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Detaylı İçerik</label>
                                <textarea class="form-control tinymce" name="<?php echo $lang_code; ?>_detay"
                                ><?php echo htmlspecialchars($content[$lang_code.'_detay'] ?? ''); ?></textarea>
                            </div>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>

                <!-- Sidebar Actions -->
                <div class="col-lg-4">
                    <div class="sticky-actions">
                        <h5 class="mb-3">Yayın Ayarları</h5>

                        <div class="mb-3">
                            <label class="form-label">Kategori</label>
                            <select class="form-select" name="kategori" required>
                                <option value="">Seçiniz...</option>
                                <?php foreach ($categories as $cat): ?>
                                <option value="<?php echo $cat['id']; ?>"
                                    <?php echo ($content['kategori'] ?? '') == $cat['id'] ? 'selected' : ''; ?>>
                                    <?php echo htmlspecialchars($cat['tr_isim']); ?>
                                </option>
                                <?php endforeach; ?>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Durum</label>
                            <select class="form-select" name="durum">
                                <option value="1" <?php echo ($content['durum'] ?? '1') == '1' ? 'selected' : ''; ?>>Aktif</option>
                                <option value="-1" <?php echo ($content['durum'] ?? '') == '-1' ? 'selected' : ''; ?>>Pasif</option>
                            </select>
                        </div>

                        <div class="d-grid gap-2">
                            <button type="submit" name="action" value="save" class="btn btn-primary btn-lg">
                                <i class="bi bi-check-lg"></i> Kaydet
                            </button>
                            <button type="submit" name="action" value="save_analyze" class="btn btn-outline-primary">
                                <i class="bi bi-graph-up"></i> Kaydet ve SEO Analiz Et
                            </button>
                            <button type="button" class="btn btn-outline-secondary" onclick="previewContent()">
                                <i class="bi bi-eye"></i> Önizleme
                            </button>
                        </div>

                        <hr class="my-4">

                        <h6 class="mb-3">SEO Durum Özeti</h6>
                        <?php if (!empty($seo_scores)): ?>
                            <?php foreach ($seo_scores as $lang => $score): ?>
                            <div class="mb-2">
                                <div class="d-flex justify-content-between">
                                    <span><?php echo $languages[$lang]['flag']; ?> <?php echo $languages[$lang]['name']; ?></span>
                                    <strong><?php echo $score['total_score']; ?>%</strong>
                                </div>
                                <div class="progress" style="height: 8px;">
                                    <div class="progress-bar bg-<?php
                                        echo $score['total_score'] >= 85 ? 'success' :
                                             ($score['total_score'] >= 70 ? 'primary' :
                                              ($score['total_score'] >= 50 ? 'warning' : 'danger'));
                                    ?>" style="width: <?php echo $score['total_score']; ?>%"></div>
                                </div>
                            </div>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <p class="text-muted small">SEO analizi henüz yapılmadı</p>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </form>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <script>
        // Initialize TinyMCE
        tinymce.init({
            selector: '.tinymce',
            height: 500,
            menubar: false,
            plugins: 'anchor autolink charmap code codesample emoticons image link lists media searchreplace table visualblocks wordcount',
            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            language: 'tr_TR'
        });

        // Switch language tabs
        function switchLanguage(lang) {
            // Hide all content
            document.querySelectorAll('.language-content').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.language-tab').forEach(el => el.classList.remove('active'));

            // Show selected
            document.getElementById('content-' + lang).style.display = 'block';
            event.target.closest('.language-tab').classList.add('active');
        }

        // Character counter
        function updateCharCounter(id, value, optimal) {
            const counter = document.getElementById(id + '-counter');
            const len = value.length;
            counter.textContent = len + '/' + optimal;

            if (len > optimal + 10) {
                counter.className = 'char-counter error';
            } else if (len > optimal) {
                counter.className = 'char-counter warning';
            } else {
                counter.className = 'char-counter';
            }
        }

        // Preview content
        function previewContent() {
            alert('Önizleme özelliği yakında eklenecek!');
        }

        // Initialize counters on load
        document.addEventListener('DOMContentLoaded', function() {
            const trTitle = document.querySelector('input[name="tr_baslik"]');
            if (trTitle) updateCharCounter('tr-title', trTitle.value, 60);

            const trSeoTitle = document.querySelector('input[name="tr_seo_title"]');
            if (trSeoTitle) updateCharCounter('tr-seo-title', trSeoTitle.value, 60);

            const trSeoDesc = document.querySelector('textarea[name="tr_seo_description"]');
            if (trSeoDesc) updateCharCounter('tr-seo-desc', trSeoDesc.value, 160);
        });
    </script>
</body>
</html>
