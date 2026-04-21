<?php
/**
 * SEO Analyzer Class
 * Comprehensive SEO scoring and analysis system
 *
 * @version 2.0.0
 * @date 2026-02-11
 */

class SEOAnalyzer {
    private $baglan;
    private $language;
    private $rules = [];

    public function __construct($baglan, $language = 'TR') {
        $this->baglan = $baglan;
        $this->language = strtoupper($language);
        $this->loadRules();
    }

    /**
     * Load SEO rules from database
     */
    private function loadRules() {
        $query = "SELECT * FROM seo_rules WHERE is_active = 1";
        $stmt = $this->baglan->query($query);
        $this->rules = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Analyze a single page and calculate SEO score
     *
     * @param string $page_type Type of page
     * @param array $content Content data (null for static pages)
     * @param string $html_content Full HTML content of the page
     * @return array SEO analysis results
     */
    public function analyzePage($page_type, $content = null, $html_content = '') {
        $content_id = $content['id'] ?? null;
        $lang_prefix = strtolower($this->language);

        $analysis = [
            'page_type' => $page_type,
            'content_id' => $content_id,
            'language' => $this->language,
            'scores' => [],
            'issues' => [],
            'recommendations' => [],
            'metadata' => []
        ];

        // Extract meta information
        $meta = $this->extractMetaData($content, $lang_prefix, $html_content);
        $analysis['metadata'] = $meta;

        // Calculate individual scores
        $analysis['scores']['title'] = $this->analyzeTitleScore($meta);
        $analysis['scores']['description'] = $this->analyzeDescriptionScore($meta);
        $analysis['scores']['keywords'] = $this->analyzeKeywordsScore($meta);
        $analysis['scores']['content'] = $this->analyzeContentScore($meta);
        $analysis['scores']['url'] = $this->analyzeURLScore($meta);
        $analysis['scores']['images'] = $this->analyzeImageScore($meta);
        $analysis['scores']['links'] = $this->analyzeLinksScore($meta);
        $analysis['scores']['readability'] = $this->analyzeReadabilityScore($meta);

        // Calculate total score (weighted average)
        $weights = [
            'title' => 0.18,
            'description' => 0.15,
            'keywords' => 0.12,
            'content' => 0.20,
            'url' => 0.10,
            'images' => 0.10,
            'links' => 0.08,
            'readability' => 0.07
        ];

        $total_score = 0;
        foreach ($analysis['scores'] as $category => $score) {
            $total_score += $score * $weights[$category];
        }

        $analysis['total_score'] = round($total_score);
        $analysis['grade'] = $this->calculateGrade($total_score);

        // Save to database
        $this->saveSEOScore($analysis);

        return $analysis;
    }

    /**
     * Extract metadata from content
     */
    private function extractMetaData($content, $lang_prefix, $html_content) {
        $meta = [
            'title' => '',
            'description' => '',
            'keywords' => '',
            'content_text' => '',
            'word_count' => 0,
            'url' => '',
            'h1_tags' => [],
            'h2_tags' => [],
            'images' => [],
            'internal_links' => [],
            'external_links' => []
        ];

        if ($content) {
            $meta['title'] = $content[$lang_prefix . '_seo_title'] ?? $content[$lang_prefix . '_baslik'] ?? '';
            $meta['description'] = $content[$lang_prefix . '_seo_description'] ?? '';
            $meta['content_text'] = strip_tags($content[$lang_prefix . '_icerik'] ?? '');
            $meta['url'] = $content[$lang_prefix . '_slug'] ?? '';
        }

        // Parse HTML for additional data
        if (!empty($html_content)) {
            $meta = array_merge($meta, $this->parseHTML($html_content));
        }

        // Calculate word count
        $meta['word_count'] = str_word_count($meta['content_text']);
        $meta['reading_time'] = ceil($meta['word_count'] / 200); // 200 words per minute

        return $meta;
    }

    /**
     * Parse HTML content for SEO elements
     */
    private function parseHTML($html) {
        $data = [
            'h1_tags' => [],
            'h2_tags' => [],
            'images' => [],
            'internal_links' => [],
            'external_links' => []
        ];

        // Extract H1 tags
        preg_match_all('/<h1[^>]*>(.*?)<\/h1>/is', $html, $h1_matches);
        $data['h1_tags'] = $h1_matches[1] ?? [];

        // Extract H2 tags
        preg_match_all('/<h2[^>]*>(.*?)<\/h2>/is', $html, $h2_matches);
        $data['h2_tags'] = $h2_matches[1] ?? [];

        // Extract images
        preg_match_all('/<img[^>]+>/is', $html, $img_matches);
        foreach ($img_matches[0] as $img) {
            $has_alt = preg_match('/alt=["\']([^"\']*)["\']/', $img, $alt_match);
            $data['images'][] = [
                'tag' => $img,
                'has_alt' => $has_alt,
                'alt' => $alt_match[1] ?? ''
            ];
        }

        // Extract links
        preg_match_all('/<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)<\/a>/is', $html, $link_matches);
        for ($i = 0; $i < count($link_matches[1]); $i++) {
            $url = $link_matches[1][$i];
            $anchor = strip_tags($link_matches[2][$i]);

            if (strpos($url, 'http') === 0 || strpos($url, '//') === 0) {
                $data['external_links'][] = ['url' => $url, 'anchor' => $anchor];
            } else {
                $data['internal_links'][] = ['url' => $url, 'anchor' => $anchor];
            }
        }

        return $data;
    }

    /**
     * Analyze Title Score (0-100)
     */
    private function analyzeTitleScore($meta) {
        $score = 0;
        $title = $meta['title'];
        $title_length = mb_strlen($title);

        // Length check (50-60 optimal)
        if ($title_length >= 50 && $title_length <= 60) {
            $score += 50;
        } elseif ($title_length >= 40 && $title_length <= 70) {
            $score += 30;
        } elseif ($title_length > 0) {
            $score += 10;
        }

        // Keyword presence (basic check)
        if (!empty($title)) {
            $score += 20;
        }

        // No ALL CAPS
        if ($title != mb_strtoupper($title)) {
            $score += 15;
        }

        // Has branding
        if (stripos($title, 'Dr.') !== false || stripos($title, 'Gökçe') !== false) {
            $score += 15;
        }

        return min(100, $score);
    }

    /**
     * Analyze Description Score (0-100)
     */
    private function analyzeDescriptionScore($meta) {
        $score = 0;
        $desc = $meta['description'];
        $desc_length = mb_strlen($desc);

        // Length check (150-160 optimal)
        if ($desc_length >= 150 && $desc_length <= 160) {
            $score += 60;
        } elseif ($desc_length >= 120 && $desc_length <= 180) {
            $score += 40;
        } elseif ($desc_length > 0) {
            $score += 20;
        }

        // Has call-to-action words
        $cta_words = ['randevu', 'iletişim', 'appointment', 'contact', 'call', 'learn'];
        foreach ($cta_words as $word) {
            if (stripos($desc, $word) !== false) {
                $score += 20;
                break;
            }
        }

        // Not duplicate of title
        if (!empty($desc) && $desc != $meta['title']) {
            $score += 20;
        }

        return min(100, $score);
    }

    /**
     * Analyze Keywords Score (0-100)
     */
    private function analyzeKeywordsScore($meta) {
        $score = 0;

        // Check keyword in title
        if (!empty($meta['title'])) {
            $score += 30;
        }

        // Check H1 tags
        if (count($meta['h1_tags']) > 0 && count($meta['h1_tags']) <= 2) {
            $score += 30;
        } elseif (count($meta['h1_tags']) > 0) {
            $score += 15;
        }

        // Check H2 tags
        if (count($meta['h2_tags']) >= 2 && count($meta['h2_tags']) <= 5) {
            $score += 20;
        } elseif (count($meta['h2_tags']) > 0) {
            $score += 10;
        }

        // Keyword density check (rough estimate)
        if ($meta['word_count'] > 0) {
            $score += 20;
        }

        return min(100, $score);
    }

    /**
     * Analyze Content Quality Score (0-100)
     */
    private function analyzeContentScore($meta) {
        $score = 0;
        $word_count = $meta['word_count'];

        // Word count scoring
        if ($word_count >= 800) {
            $score += 40;
        } elseif ($word_count >= 500) {
            $score += 30;
        } elseif ($word_count >= 300) {
            $score += 20;
        } elseif ($word_count > 0) {
            $score += 10;
        }

        // Has proper structure (H1 + H2)
        if (count($meta['h1_tags']) > 0 && count($meta['h2_tags']) > 0) {
            $score += 30;
        }

        // Has images
        if (count($meta['images']) > 0) {
            $score += 15;
        }

        // Has internal links
        if (count($meta['internal_links']) > 0) {
            $score += 15;
        }

        return min(100, $score);
    }

    /**
     * Analyze URL Score (0-100)
     */
    private function analyzeURLScore($meta) {
        $score = 0;
        $url = $meta['url'];
        $url_length = strlen($url);

        // Length check (under 100 characters)
        if ($url_length > 0 && $url_length <= 50) {
            $score += 40;
        } elseif ($url_length <= 75) {
            $score += 30;
        } elseif ($url_length <= 100) {
            $score += 20;
        }

        // Uses hyphens (good practice)
        if (strpos($url, '-') !== false) {
            $score += 20;
        }

        // No special characters
        if (preg_match('/^[a-z0-9-]+$/', $url)) {
            $score += 20;
        }

        // Descriptive (has words, not just IDs)
        if (preg_match('/[a-z]{4,}/', $url)) {
            $score += 20;
        }

        return min(100, $score);
    }

    /**
     * Analyze Image Optimization Score (0-100)
     */
    private function analyzeImageScore($meta) {
        $score = 0;
        $images = $meta['images'];

        if (count($images) == 0) {
            return 50; // No images, neutral score
        }

        $images_with_alt = 0;
        foreach ($images as $img) {
            if ($img['has_alt'] && !empty($img['alt'])) {
                $images_with_alt++;
            }
        }

        // Alt text coverage
        $coverage = (count($images) > 0) ? ($images_with_alt / count($images)) * 100 : 0;
        $score = round($coverage);

        return min(100, $score);
    }

    /**
     * Analyze Internal Links Score (0-100)
     */
    private function analyzeLinksScore($meta) {
        $score = 0;
        $internal_count = count($meta['internal_links']);

        // Optimal: 3-5 internal links
        if ($internal_count >= 3 && $internal_count <= 5) {
            $score += 60;
        } elseif ($internal_count >= 1 && $internal_count <= 10) {
            $score += 40;
        } elseif ($internal_count > 10) {
            $score += 20;
        }

        // Check anchor text quality
        $descriptive_anchors = 0;
        foreach ($meta['internal_links'] as $link) {
            if (strlen($link['anchor']) > 10) {
                $descriptive_anchors++;
            }
        }

        if ($internal_count > 0) {
            $anchor_score = ($descriptive_anchors / $internal_count) * 40;
            $score += round($anchor_score);
        }

        return min(100, $score);
    }

    /**
     * Analyze Readability Score (0-100)
     */
    private function analyzeReadabilityScore($meta) {
        $score = 50; // Default neutral score
        $text = $meta['content_text'];

        if (empty($text)) {
            return $score;
        }

        // Simple readability check
        $sentences = preg_split('/[.!?]+/', $text);
        $sentence_count = count($sentences);

        if ($sentence_count > 0) {
            $avg_words_per_sentence = $meta['word_count'] / $sentence_count;

            // Optimal: 15-20 words per sentence
            if ($avg_words_per_sentence >= 10 && $avg_words_per_sentence <= 20) {
                $score = 80;
            } elseif ($avg_words_per_sentence < 25) {
                $score = 60;
            } else {
                $score = 40;
            }
        }

        // Bonus for proper formatting
        if (count($meta['h2_tags']) >= 2) {
            $score += 10;
        }

        return min(100, $score);
    }

    /**
     * Calculate grade based on score
     */
    private function calculateGrade($score) {
        if ($score >= 95) return 'A+';
        if ($score >= 85) return 'A';
        if ($score >= 70) return 'B';
        if ($score >= 55) return 'C';
        if ($score >= 40) return 'D';
        return 'F';
    }

    /**
     * Save SEO score to database
     */
    private function saveSEOScore($analysis) {
        $url_path = '/' . strtolower($analysis['language']) . '/' . $analysis['page_type'];

        $query = "INSERT INTO seo_scores (
            page_type, content_id, language_code, url_path,
            title_score, description_score, keywords_score, content_quality_score,
            url_score, image_optimization_score, internal_links_score, readability_score,
            total_score, score_grade,
            word_count, reading_time_minutes, last_analyzed
        ) VALUES (
            :page_type, :content_id, :language_code, :url_path,
            :title_score, :description_score, :keywords_score, :content_score,
            :url_score, :image_score, :links_score, :readability_score,
            :total_score, :grade,
            :word_count, :reading_time, NOW()
        ) ON DUPLICATE KEY UPDATE
            title_score = VALUES(title_score),
            description_score = VALUES(description_score),
            keywords_score = VALUES(keywords_score),
            content_quality_score = VALUES(content_quality_score),
            url_score = VALUES(url_score),
            image_optimization_score = VALUES(image_optimization_score),
            internal_links_score = VALUES(internal_links_score),
            readability_score = VALUES(readability_score),
            total_score = VALUES(total_score),
            score_grade = VALUES(score_grade),
            word_count = VALUES(word_count),
            reading_time_minutes = VALUES(reading_time_minutes),
            last_analyzed = NOW()";

        $stmt = $this->baglan->prepare($query);
        $stmt->execute([
            ':page_type' => $analysis['page_type'],
            ':content_id' => $analysis['content_id'],
            ':language_code' => $analysis['language'],
            ':url_path' => $url_path,
            ':title_score' => $analysis['scores']['title'],
            ':description_score' => $analysis['scores']['description'],
            ':keywords_score' => $analysis['scores']['keywords'],
            ':content_score' => $analysis['scores']['content'],
            ':url_score' => $analysis['scores']['url'],
            ':image_score' => $analysis['scores']['images'],
            ':links_score' => $analysis['scores']['links'],
            ':readability_score' => $analysis['scores']['readability'],
            ':total_score' => $analysis['total_score'],
            ':grade' => $analysis['grade'],
            ':word_count' => $analysis['metadata']['word_count'],
            ':reading_time' => $analysis['metadata']['reading_time']
        ]);

        return $this->baglan->lastInsertId();
    }

    /**
     * Get SEO score for a page
     */
    public function getPageScore($page_type, $content_id = null, $language = null) {
        $language = $language ?? $this->language;

        $query = "SELECT * FROM seo_scores
                  WHERE page_type = :page_type
                  AND language_code = :language";

        $params = [
            ':page_type' => $page_type,
            ':language' => $language
        ];

        if ($content_id) {
            $query .= " AND content_id = :content_id";
            $params[':content_id'] = $content_id;
        } else {
            $query .= " AND content_id IS NULL";
        }

        $stmt = $this->baglan->prepare($query);
        $stmt->execute($params);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Get all pages with scores below threshold
     */
    public function getLowScoringPages($threshold = 70) {
        $query = "SELECT * FROM seo_scores
                  WHERE total_score < :threshold
                  ORDER BY total_score ASC";

        $stmt = $this->baglan->prepare($query);
        $stmt->execute([':threshold' => $threshold]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get average SEO score across all pages
     */
    public function getAverageScore($language = null) {
        $language = $language ?? $this->language;

        $query = "SELECT AVG(total_score) as avg_score FROM seo_scores";

        if ($language) {
            $query .= " WHERE language_code = :language";
            $stmt = $this->baglan->prepare($query);
            $stmt->execute([':language' => $language]);
        } else {
            $stmt = $this->baglan->query($query);
        }

        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return round($result['avg_score'] ?? 0, 2);
    }
}
?>
