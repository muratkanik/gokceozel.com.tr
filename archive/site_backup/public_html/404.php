<?php
header('Content-Type: text/html; charset=utf-8');
mb_internal_encoding('UTF-8');
include("ust.php");

// Default translations
$lang_map = [
    'TR' => ['title' => 'Sayfa Bulunamadı', 'message' => 'Aradığınız sayfa bulunamadı veya taşınmış olabilir.', 'button' => 'Ana Sayfaya Dön'],
    'EN' => ['title' => 'Page Not Found', 'message' => 'The page you are looking for not found or may have moved.', 'button' => 'Back to Home'],
    'RU' => ['title' => 'Страница не найдена', 'message' => 'Страница, которую вы ищете, не найдена или могла быть перемещена.', 'button' => 'Вернуться на главную'],
    'AR' => ['title' => 'الصفحة غير موجودة', 'message' => 'الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها.', 'button' => 'العودة إلى الصفحة الرئيسية'],
    'DE' => ['title' => 'Seite nicht gefunden', 'message' => 'Die gesuchte Seite wurde nicht gefunden oder möglicherweise verschoben.', 'button' => 'Zurück zur Startseite'],
    'FR' => ['title' => 'Page non trouvée', 'message' => 'La page que vous recherchez est introuvable ou a peut-être été déplacée.', 'button' => 'Retour à l\'accueil'],
    'CIN' => ['title' => '未找到页面', 'message' => '您查找的页面未找到或可能已移动。', 'button' => '返回首页']
];

$ln = isset($_GET['LN']) && array_key_exists($_GET['LN'], $lang_map) ? $_GET['LN'] : 'TR';
$text = $lang_map[$ln];
?>

<div class="page-content">
    <div class="section mt-0">
        <div class="container text-center" style="padding: 100px 0;">
            <div class="title-wrap">
                <h1 style="font-size: 80px; color: #C4B3B4;">404</h1>
                <h2 class="h1"><?php echo $text['title']; ?></h2>
            </div>
            <p style="font-size: 18px; margin-bottom: 30px;"><?php echo $text['message']; ?></p>
            <a href="index.php?LN=<?php echo $ln; ?>" class="btn btn-hover-fill">
                <i class="icon-right-arrow"></i><span><?php echo $text['button']; ?></span><i class="icon-right-arrow"></i>
            </a>
        </div>
    </div>
</div>

<?php include("alt.php"); ?>
