-- Migration: Create SEO Scoring System
-- Date: 2026-02-11
-- Description: Creates tables and structures for automated SEO scoring and monitoring

-- SEO Scores table - stores SEO scores for each page
CREATE TABLE IF NOT EXISTS seo_scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_type ENUM('homepage', 'service_detail', 'blog_detail', 'service_listing', 'blog_listing', 'contact', 'about', 'gallery') NOT NULL,
    content_id INT DEFAULT NULL COMMENT 'ID from icerik table (NULL for static pages)',
    language_code VARCHAR(10) NOT NULL DEFAULT 'TR',
    url_path VARCHAR(500) NOT NULL,

    -- SEO Score Components (0-100 each)
    title_score INT DEFAULT 0,
    description_score INT DEFAULT 0,
    keywords_score INT DEFAULT 0,
    content_quality_score INT DEFAULT 0,
    url_score INT DEFAULT 0,
    image_optimization_score INT DEFAULT 0,
    internal_links_score INT DEFAULT 0,
    readability_score INT DEFAULT 0,

    -- Overall Score (0-100)
    total_score INT DEFAULT 0,
    score_grade ENUM('A+', 'A', 'B', 'C', 'D', 'F') DEFAULT 'F',

    -- SEO Issues JSON
    issues JSON DEFAULT NULL COMMENT 'Array of SEO issues and recommendations',

    -- Metadata
    word_count INT DEFAULT 0,
    reading_time_minutes INT DEFAULT 0,
    last_analyzed DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_content_id (content_id),
    INDEX idx_language (language_code),
    INDEX idx_page_type (page_type),
    INDEX idx_total_score (total_score),
    INDEX idx_last_analyzed (last_analyzed),
    UNIQUE KEY unique_page (page_type, content_id, language_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SEO Keywords table - tracks keyword usage and density
CREATE TABLE IF NOT EXISTS seo_keywords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seo_score_id INT NOT NULL,
    keyword VARCHAR(255) NOT NULL,
    frequency INT DEFAULT 0,
    density DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Percentage',
    in_title BOOLEAN DEFAULT FALSE,
    in_description BOOLEAN DEFAULT FALSE,
    in_h1 BOOLEAN DEFAULT FALSE,
    in_h2 BOOLEAN DEFAULT FALSE,
    in_url BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (seo_score_id) REFERENCES seo_scores(id) ON DELETE CASCADE,
    INDEX idx_keyword (keyword),
    INDEX idx_density (density)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SEO Rules Configuration table - stores scoring rules and weights
CREATE TABLE IF NOT EXISTS seo_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rule_name VARCHAR(100) NOT NULL UNIQUE,
    rule_category ENUM('title', 'description', 'keywords', 'content', 'url', 'images', 'links', 'readability') NOT NULL,
    rule_description TEXT,
    max_points INT DEFAULT 10,
    min_value INT DEFAULT NULL,
    max_value INT DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default SEO rules
INSERT INTO seo_rules (rule_name, rule_category, rule_description, max_points, min_value, max_value) VALUES
-- Title Rules
('title_length', 'title', 'Title length should be between 50-60 characters', 15, 50, 60),
('title_keyword', 'title', 'Title should contain primary keyword', 10, NULL, NULL),
('title_uniqueness', 'title', 'Title should be unique across all pages', 5, NULL, NULL),

-- Description Rules
('desc_length', 'description', 'Meta description length should be between 150-160 characters', 15, 150, 160),
('desc_keyword', 'description', 'Description should contain primary keyword', 10, NULL, NULL),
('desc_cta', 'description', 'Description should have call-to-action', 5, NULL, NULL),

-- Keywords Rules
('keyword_density', 'keywords', 'Keyword density should be 1-3%', 10, 1, 3),
('keyword_in_h1', 'keywords', 'Keyword should appear in H1', 10, NULL, NULL),
('keyword_in_h2', 'keywords', 'Keyword should appear in H2 tags', 5, NULL, NULL),

-- Content Rules
('content_length', 'content', 'Content should be at least 300 words', 15, 300, NULL),
('content_structure', 'content', 'Content should have proper heading structure', 10, NULL, NULL),
('content_freshness', 'content', 'Content should be updated regularly', 5, NULL, NULL),

-- URL Rules
('url_length', 'url', 'URL should be concise (under 100 characters)', 10, NULL, 100),
('url_keyword', 'url', 'URL should contain target keyword', 10, NULL, NULL),
('url_structure', 'url', 'URL should follow SEO-friendly pattern', 5, NULL, NULL),

-- Image Rules
('img_alt_text', 'images', 'All images should have alt text', 10, NULL, NULL),
('img_optimization', 'images', 'Images should be optimized/compressed', 10, NULL, NULL),
('img_lazy_load', 'images', 'Images should use lazy loading', 5, NULL, NULL),

-- Internal Links Rules
('internal_links_count', 'links', 'Page should have 3-5 relevant internal links', 10, 3, 5),
('anchor_text_quality', 'links', 'Anchor text should be descriptive', 5, NULL, NULL),

-- Readability Rules
('readability_score', 'readability', 'Content should be easy to read (Flesch score 60+)', 10, 60, 100),
('paragraph_length', 'readability', 'Paragraphs should be concise', 5, NULL, NULL),
('sentence_length', 'readability', 'Sentences should be clear and short', 5, NULL, NULL);

-- SEO Audit Log - tracks all SEO analysis runs
CREATE TABLE IF NOT EXISTS seo_audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    audit_type ENUM('full_site', 'single_page', 'category', 'scheduled') NOT NULL,
    pages_analyzed INT DEFAULT 0,
    avg_score DECIMAL(5,2) DEFAULT 0.00,
    issues_found INT DEFAULT 0,
    started_at DATETIME NOT NULL,
    completed_at DATETIME DEFAULT NULL,
    status ENUM('running', 'completed', 'failed') DEFAULT 'running',
    error_message TEXT DEFAULT NULL,
    created_by INT DEFAULT NULL COMMENT 'User ID who triggered audit',

    INDEX idx_audit_type (audit_type),
    INDEX idx_started_at (started_at),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SEO Recommendations table - stores actionable recommendations
CREATE TABLE IF NOT EXISTS seo_recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seo_score_id INT NOT NULL,
    priority ENUM('critical', 'high', 'medium', 'low') NOT NULL DEFAULT 'medium',
    category VARCHAR(50) NOT NULL,
    issue_description TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    impact_score INT DEFAULT 0 COMMENT 'Potential score improvement if fixed',
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (seo_score_id) REFERENCES seo_scores(id) ON DELETE CASCADE,
    INDEX idx_priority (priority),
    INDEX idx_is_resolved (is_resolved)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
