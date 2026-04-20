<?php
header('Content-Type: application/xml; charset=utf-8');
require_once 'baglanti/baglan.php';
require_once 'baglanti/url_helpers.php';

$base_url = get_base_url();
$languages = ['TR', 'EN', 'RU', 'AR', 'DE', 'FR', 'CIN'];

echo '<?xml version="1.0" encoding="UTF-8"?>';
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

    <?php
    // ========================================
    // HOMEPAGE
    // ========================================
    foreach ($languages as $lang) {
        $lang_lower = strtolower($lang);
        ?>
        <url>
            <loc><?php echo $base_url; ?>/<?php echo $lang_lower; ?>/</loc>
            <changefreq>weekly</changefreq>
            <priority>1.0</priority>
            <lastmod><?php echo date('Y-m-d'); ?></lastmod>
            <?php foreach ($languages as $alt_lang): ?>
            <xhtml:link rel="alternate" hreflang="<?php echo strtolower($alt_lang); ?>" href="<?php echo $base_url; ?>/<?php echo strtolower($alt_lang); ?>/" />
            <?php endforeach; ?>
        </url>
        <?php
    }

    // ========================================
    // STATIC PAGES
    // ========================================
    $static_pages = [
        ['page' => 'services', 'priority' => 0.9, 'changefreq' => 'monthly'],
        ['page' => 'blog', 'priority' => 0.9, 'changefreq' => 'weekly'],
        ['page' => 'contact', 'priority' => 0.8, 'changefreq' => 'monthly'],
        ['page' => 'appointment', 'priority' => 0.9, 'changefreq' => 'monthly'],
        ['page' => 'gallery', 'priority' => 0.7, 'changefreq' => 'monthly'],
        ['page' => 'about', 'priority' => 0.8, 'changefreq' => 'monthly']
    ];

    foreach ($static_pages as $page_info) {
        foreach ($languages as $lang) {
            $url = get_page_url($page_info['page'], $lang);
            ?>
            <url>
                <loc><?php echo $base_url . $url; ?></loc>
                <changefreq><?php echo $page_info['changefreq']; ?></changefreq>
                <priority><?php echo $page_info['priority']; ?></priority>
                <lastmod><?php echo date('Y-m-d'); ?></lastmod>
                <?php foreach ($languages as $alt_lang): ?>
                <xhtml:link rel="alternate" hreflang="<?php echo strtolower($alt_lang); ?>" href="<?php echo $base_url . get_page_url($page_info['page'], $alt_lang); ?>" />
                <?php endforeach; ?>
            </url>
            <?php
        }
    }

    // ========================================
    // DYNAMIC CONTENT (Services & Blog)
    // ========================================
    $query = "SELECT * FROM icerik WHERE durum='1' ORDER BY guncelleme_tarihi DESC";
    $stmt = sorgu($query, $baglan);
    $stmt->execute();

    while ($content = veriliste($stmt)) {
        $category = $content['kategori'];

        // Skip if not service or blog
        if (!in_array($category, [42, 43, 52])) {
            continue;
        }

        foreach ($languages as $lang) {
            $lang_lower = strtolower($lang);
            $baslik_col = $lang_lower . '_baslik';
            $slug_col = $lang_lower . '_slug';

            // Skip if content not available in this language
            if (empty($content[$baslik_col]) || empty($content[$slug_col])) {
                continue;
            }

            $url = get_content_url($content, $lang);
            $lastmod = date('Y-m-d', strtotime($content['guncelleme_tarihi'] ?? $content['kayit_tarihi']));

            // Priority based on category
            $priority = in_array($category, [42, 43]) ? 0.8 : 0.7; // Services higher than blog

            ?>
            <url>
                <loc><?php echo $base_url . $url; ?></loc>
                <lastmod><?php echo $lastmod; ?></lastmod>
                <changefreq>monthly</changefreq>
                <priority><?php echo $priority; ?></priority>

                <?php
                // Add image if available
                if (!empty($content['belge'])) {
                    $image_url = $base_url . '/images/content/' . $content['belge'];
                    ?>
                    <image:image>
                        <image:loc><?php echo $image_url; ?></image:loc>
                        <image:title><?php echo htmlspecialchars($content[$baslik_col]); ?></image:title>
                    </image:image>
                    <?php
                }

                // Add alternate language versions
                foreach ($languages as $alt_lang):
                    $alt_lang_lower = strtolower($alt_lang);
                    $alt_baslik = $content[$alt_lang_lower . '_baslik'];

                    // Only add if content exists in alternate language
                    if (!empty($alt_baslik)):
                    ?>
                    <xhtml:link rel="alternate" hreflang="<?php echo $alt_lang_lower; ?>" href="<?php echo $base_url . get_content_url($content, $alt_lang); ?>" />
                    <?php
                    endif;
                endforeach;
                ?>
            </url>
            <?php
        }
    }
    ?>
</urlset>
