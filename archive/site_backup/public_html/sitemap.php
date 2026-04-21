<?php
header("Content-Type: application/xml; charset=utf-8");
include("baglanti/baglantilar_fonksiyonlar.php");

$baseUrl = "https://gokceozel.com.tr/";
$languages = ['TR', 'EN', 'RU', 'AR', 'DE', 'FR', 'CIN'];

echo '<?xml version="1.0" encoding="UTF-8"?>';
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">

<?php
// 1. Static Pages
$staticPages = ['index.php', 'iletisim.php', 'randevu.php', 'blog.php'];

foreach ($staticPages as $page) {
    echo "    <url>\n";
    echo "        <loc>{$baseUrl}{$page}</loc>\n";
    echo "        <changefreq>daily</changefreq>\n";
    echo "        <priority>0.8</priority>\n";
    foreach ($languages as $lang) {
        if ($lang == 'TR') continue; // Default is TR usually, or list all? Let's list parameterized
        echo "        <xhtml:link rel=\"alternate\" hreflang=\"" . strtolower($lang) . "\" href=\"{$baseUrl}{$page}?LN={$lang}\"/>\n";
    }
    echo "    </url>\n";
    
    // Also list the parameterized versions explicitly? Google prefers clean canonical, but for this structure:
    foreach ($languages as $lang) {
        if ($lang == 'TR') continue;
         echo "    <url>\n";
        echo "        <loc>{$baseUrl}{$page}?LN={$lang}</loc>\n";
        echo "        <changefreq>daily</changefreq>\n";
        echo "        <priority>0.8</priority>\n";
        echo "    </url>\n";
    }
}

// 2. Services (Hizmetler) - Categories 42, 43
$sqlServices = "SELECT eskayit, kayit_tarihi FROM icerik WHERE durum='1' AND kategori IN (42, 43) ORDER BY id DESC";
$stmtServices = $baglan->prepare($sqlServices);
$stmtServices->execute();

while ($row = $stmtServices->fetch(PDO::FETCH_ASSOC)) {
    $date = date('Y-m-d', strtotime($row['kayit_tarihi']));
    
    // TR (Default)
    echo "    <url>\n";
    echo "        <loc>{$baseUrl}hizmetdetay.php?detay={$row['eskayit']}</loc>\n";
    echo "        <lastmod>{$date}</lastmod>\n";
    echo "        <changefreq>weekly</changefreq>\n";
    echo "        <priority>0.9</priority>\n";
    echo "    </url>\n";

    // Other Languages
    foreach ($languages as $lang) {
        if ($lang == 'TR') continue;
        echo "    <url>\n";
        echo "        <loc>{$baseUrl}hizmetdetay.php?detay={$row['eskayit']}&amp;LN={$lang}</loc>\n";
        echo "        <lastmod>{$date}</lastmod>\n";
        echo "        <changefreq>weekly</changefreq>\n";
        echo "        <priority>0.9</priority>\n";
        echo "    </url>\n";
    }
}

// 3. Blog Posts - Category 52
$sqlBlog = "SELECT eskayit, kayit_tarihi FROM icerik WHERE durum='1' AND kategori=52 ORDER BY id DESC";
$stmtBlog = $baglan->prepare($sqlBlog);
$stmtBlog->execute();

while ($row = $stmtBlog->fetch(PDO::FETCH_ASSOC)) {
    $date = date('Y-m-d', strtotime($row['kayit_tarihi']));
    
    // TR
    echo "    <url>\n";
    echo "        <loc>{$baseUrl}blogdetay.php?detay={$row['eskayit']}</loc>\n";
    echo "        <lastmod>{$date}</lastmod>\n";
    echo "        <changefreq>weekly</changefreq>\n";
    echo "        <priority>0.7</priority>\n";
    echo "    </url>\n";

    // Other Languages
    foreach ($languages as $lang) {
        if ($lang == 'TR') continue;
        echo "    <url>\n";
        echo "        <loc>{$baseUrl}blogdetay.php?detay={$row['eskayit']}&amp;LN={$lang}</loc>\n";
        echo "        <lastmod>{$date}</lastmod>\n";
        echo "        <changefreq>weekly</changefreq>\n";
        echo "        <priority>0.7</priority>\n";
        echo "    </url>\n";
    }
}
?>
</urlset>
