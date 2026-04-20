-- Migration: Add slug columns for SEO-friendly URLs
-- Date: 2026-02-11
-- Description: Adds URL slug columns to icerik and genel_kategori tables for all 7 languages

-- Add slug columns to icerik table
ALTER TABLE icerik
ADD COLUMN tr_slug VARCHAR(255) DEFAULT NULL AFTER tr_baslik,
ADD COLUMN en_slug VARCHAR(255) DEFAULT NULL AFTER en_baslik,
ADD COLUMN ru_slug VARCHAR(255) DEFAULT NULL AFTER ru_baslik,
ADD COLUMN ar_slug VARCHAR(255) DEFAULT NULL AFTER ar_baslik,
ADD COLUMN de_slug VARCHAR(255) DEFAULT NULL AFTER de_baslik,
ADD COLUMN fr_slug VARCHAR(255) DEFAULT NULL AFTER fr_baslik,
ADD COLUMN cin_slug VARCHAR(255) DEFAULT NULL AFTER cin_baslik;

-- Add indexes for slug columns (performance optimization)
ALTER TABLE icerik
ADD INDEX idx_tr_slug (tr_slug),
ADD INDEX idx_en_slug (en_slug),
ADD INDEX idx_ru_slug (ru_slug),
ADD INDEX idx_ar_slug (ar_slug),
ADD INDEX idx_de_slug (de_slug),
ADD INDEX idx_fr_slug (fr_slug),
ADD INDEX idx_cin_slug (cin_slug);

-- Add slug columns to genel_kategori table
ALTER TABLE genel_kategori
ADD COLUMN tr_slug VARCHAR(255) DEFAULT NULL AFTER tr_isim,
ADD COLUMN en_slug VARCHAR(255) DEFAULT NULL AFTER en_isim,
ADD COLUMN ru_slug VARCHAR(255) DEFAULT NULL AFTER ru_isim,
ADD COLUMN ar_slug VARCHAR(255) DEFAULT NULL AFTER ar_isim,
ADD COLUMN de_slug VARCHAR(255) DEFAULT NULL AFTER de_isim,
ADD COLUMN fr_slug VARCHAR(255) DEFAULT NULL AFTER fr_isim,
ADD COLUMN cin_slug VARCHAR(255) DEFAULT NULL AFTER cin_isim;

-- Add indexes for kategori slug columns
ALTER TABLE genel_kategori
ADD INDEX idx_tr_slug (tr_slug),
ADD INDEX idx_en_slug (en_slug);
