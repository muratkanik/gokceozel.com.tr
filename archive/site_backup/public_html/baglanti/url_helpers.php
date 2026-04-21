<?php
/**
 * URL Helper Functions
 * SEO-friendly URL generation for multi-language website
 *
 * @author Prof. Dr. Gökçe Özel Clinic
 * @version 2.1.0
 * @date 2026-02-11
 */

/**
 * Generate SEO-friendly URL for content
 *
 * @param array $content Content data from icerik table
 * @param string $lang Language code (TR, EN, RU, AR, DE, FR, CIN)
 * @return string SEO-friendly URL
 */
function get_content_url($content, $lang = 'TR') {
    $lang_lower = strtolower($lang);
    $slug_col = $lang_lower . '_slug';

    if (!empty($content[$slug_col])) {
        $category = $content['kategori'];

        // Services: categories 42 (Non-surgical), 43 (Surgical)
        if (in_array($category, [42, 43])) {
            return "/{$lang_lower}/services/{$content[$slug_col]}";
        }
        // Blog: category 52
        else if ($category == 52) {
            return "/{$lang_lower}/blog/{$content[$slug_col]}";
        }
        // Gallery/Media: category 4, 5, 49, 50, 51
        else if (in_array($category, [4, 5, 49, 50, 51])) {
            return "/{$lang_lower}/gallery/{$content[$slug_col]}";
        }
        // Corporate/About: category 2
        else if ($category == 2) {
            return "/{$lang_lower}/about/{$content[$slug_col]}";
        }
    }

    // Fallback to old URL structure for backward compatibility
    if (!empty($content['eskayit'])) {
        return "/hizmetdetay.php?detay={$content['eskayit']}&LN=" . strtoupper($lang);
    }

    return "/{$lang_lower}/";
}

/**
 * Generate language-specific page URL
 *
 * @param string $page Page identifier (index, services, blog, contact, etc.)
 * @param string $lang Language code (TR, EN, RU, AR, DE, FR, CIN)
 * @return string Page URL
 */
function get_page_url($page, $lang = 'TR') {
    $lang_lower = strtolower($lang);

    $page_map = [
        'index' => "/{$lang_lower}/",
        'home' => "/{$lang_lower}/",
        'services' => "/{$lang_lower}/services",
        'blog' => "/{$lang_lower}/blog",
        'contact' => "/{$lang_lower}/contact",
        'appointment' => "/{$lang_lower}/appointment",
        'gallery' => "/{$lang_lower}/gallery",
        'about' => "/{$lang_lower}/about",
        'corporate' => "/{$lang_lower}/about"
    ];

    return $page_map[$page] ?? "/{$lang_lower}/";
}

/**
 * Generate SEO-friendly URL for menu items (genel_kategori)
 *
 * @param array|string $item Menu item data from genel_kategori
 * @param string $lang Language code (TR, EN, etc.)
 * @return string SEO-friendly URL
 */
function get_menu_link($item, $lang = 'TR') {
    if (empty($lang)) $lang = 'TR';
    $lang_lower = strtolower((string)$lang);
    $slug_col = $lang_lower . '_slug';
    
    // Support passing link string directly
    if (is_string($item)) {
        $link = $item;
        $item = ['link' => $link]; // Mock array for compatibility
    } elseif (is_array($item)) {
        $link = isset($item['link']) ? $item['link'] : '';
    } else {
        $link = '';
        $item = ['link' => ''];
    }

    // 1. Category Pages (hizmetler.php?kat=...)
    // Check specific params first to avoid catching generic palveluspage
    if (strpos($link, 'kat=') !== false && !empty($item[$slug_col])) {
         return "/{$lang_lower}/category/{$item[$slug_col]}";
    }

    // 2. Static Pages
    if (strpos($link, 'hizmetler.php') !== false) return "/{$lang_lower}/services";
    if (strpos($link, 'blog.php') !== false) return "/{$lang_lower}/blog";
    if (strpos($link, 'iletisim.php') !== false) return "/{$lang_lower}/contact";
    if (strpos($link, 'randevu.php') !== false) return "/{$lang_lower}/appointment";
    if (strpos($link, 'fotogaleri.php') !== false) {
        if (!empty($item[$slug_col]) && strpos($link, 'katla=') !== false) {
            return "/{$lang_lower}/gallery/{$item[$slug_col]}";
        }
        return "/{$lang_lower}/gallery";
    }
    if (strpos($link, 'kurumsal.php') !== false) return "/{$lang_lower}/about";
    if (strpos($link, 'index.php') !== false) return "/{$lang_lower}/";

    // 3. Detail Pages (Services, Blog)
    // Check if it's a detail link (has parameter) AND has a slug
    if (!empty($item[$slug_col])) {
        if (strpos($link, 'hizmetdetay.php') !== false) {
             return "/{$lang_lower}/services/{$item[$slug_col]}";
        }
        if (strpos($link, 'blogdetay.php') !== false) {
             return "/{$lang_lower}/blog/{$item[$slug_col]}";
        }
    }

    // 4. Fallback: Return original link with LN param
    if (strpos($link, 'javascript') === 0 || strpos($link, '#') === 0) {
        return $link;
    }
    
    // If link already has query string, use &LN=, else ?LN=
    $separator = (strpos($link, '?') !== false) ? '&' : '?';
    return $link . $separator . "LN=" . strtoupper($lang);
}

/**
 * Get alternate language URLs for hreflang tags
 * Used for SEO and language switching
 *
 * @param string $current_page Current page identifier
 * @param array|null $content Content data (for detail pages)
 * @return array Associative array of language codes to URLs
 */
function get_alternate_urls($current_page, $content = null) {
    $langs = ['TR', 'EN', 'RU', 'AR', 'DE', 'FR', 'CIN'];
    $alternates = [];

    foreach ($langs as $lang) {
        if ($content) {
            // Generate alternate URL for content detail pages
            $alternates[$lang] = get_content_url($content, $lang);
        } else {
            // Generate alternate URL for static pages
            $alternates[$lang] = get_page_url($current_page, $lang);
        }
    }

    return $alternates;
}

/**
 * Get current canonical URL
 * Removes query parameters for clean canonical URL
 *
 * @return string Canonical URL
 */
function get_canonical_url() {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
    $canonical_url = $protocol . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

    // Remove query parameters
    $canonical_url = strtok($canonical_url, '?');

    // Remove trailing slash if not homepage
    if ($canonical_url != $protocol . $_SERVER['HTTP_HOST'] . '/') {
        $canonical_url = rtrim($canonical_url, '/');
    }

    return $canonical_url;
}

/**
 * Get base URL with protocol
 *
 * @return string Base URL (e.g., https://gokceozel.com.tr)
 */
function get_base_url() {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
    return $protocol . $_SERVER['HTTP_HOST'];
}

/**
 * Generate breadcrumb structured data for SEO
 *
 * @param array $items Array of breadcrumb items [['name' => 'Home', 'url' => '/'], ...]
 * @return string JSON-LD structured data
 */
function generate_breadcrumb_schema($items) {
    $schema = [
        '@context' => 'https://schema.org',
        '@type' => 'BreadcrumbList',
        'itemListElement' => []
    ];

    foreach ($items as $position => $item) {
        $schema['itemListElement'][] = [
            '@type' => 'ListItem',
            'position' => $position + 1,
            'name' => $item['name'],
            'item' => get_base_url() . $item['url']
        ];
    }

    return json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}

/**
 * Get language flag for display
 *
 * @param string $lang Language code
 * @return string HTML for language flag
 */
function get_language_flag($lang) {
    $lang_upper = strtoupper($lang);
    $flags = [
        'TR' => '🇹🇷',
        'EN' => '🇬🇧',
        'RU' => '🇷🇺',
        'AR' => '🇸🇦',
        'DE' => '🇩🇪',
        'FR' => '🇫🇷',
        'CIN' => '🇨🇳'
    ];

    return $flags[$lang_upper] ?? '';
}

/**
 * Get language name
 *
 * @param string $lang Language code
 * @return string Language name
 */
function get_language_name($lang) {
    $lang_upper = strtoupper($lang);
    $names = [
        'TR' => 'Türkçe',
        'EN' => 'English',
        'RU' => 'Русский',
        'AR' => 'العربية',
        'DE' => 'Deutsch',
        'FR' => 'Français',
        'CIN' => '中文'
    ];

    return $names[$lang_upper] ?? 'Türkçe';
}

/**
 * Check if current language is RTL (Right-to-Left)
 *
 * @param string $lang Language code
 * @return bool True if RTL language
 */
function is_rtl_language($lang) {
    return strtoupper($lang) === 'AR';
}

/**
 * Generate hreflang links for SEO
 *
 * @param string $current_page Current page
 * @param array|null $content Content data
 * @return string HTML link tags
 */
function generate_hreflang_tags($current_page, $content = null) {
    $base_url = get_base_url();
    $alternate_urls = get_alternate_urls($current_page, $content);

    $html = '';
    foreach ($alternate_urls as $lang => $url) {
        $lang_lower = strtolower($lang);
        $html .= '<link rel="alternate" hreflang="' . $lang_lower . '" href="' . $base_url . $url . '">' . "\n    ";
    }

    // x-default for default language (Turkish)
    $html .= '<link rel="alternate" hreflang="x-default" href="' . $base_url . '/tr/">';

    return $html;
}
?>
