ALTER TABLE genel_kategori
ADD COLUMN tr_seo_title VARCHAR(255) DEFAULT NULL AFTER tr_isim,
ADD COLUMN tr_seo_description VARCHAR(255) DEFAULT NULL AFTER tr_seo_title,
ADD COLUMN en_seo_title VARCHAR(255) DEFAULT NULL AFTER en_isim,
ADD COLUMN en_seo_description VARCHAR(255) DEFAULT NULL AFTER en_seo_title,
ADD COLUMN ru_seo_title VARCHAR(255) DEFAULT NULL AFTER ru_isim,
ADD COLUMN ru_seo_description VARCHAR(255) DEFAULT NULL AFTER ru_seo_title,
ADD COLUMN ar_seo_title VARCHAR(255) DEFAULT NULL AFTER ar_isim,
ADD COLUMN ar_seo_description VARCHAR(255) DEFAULT NULL AFTER ar_seo_title,
ADD COLUMN de_seo_title VARCHAR(255) DEFAULT NULL AFTER de_isim,
ADD COLUMN de_seo_description VARCHAR(255) DEFAULT NULL AFTER de_seo_title,
ADD COLUMN fr_seo_title VARCHAR(255) DEFAULT NULL AFTER fr_isim,
ADD COLUMN fr_seo_description VARCHAR(255) DEFAULT NULL AFTER fr_seo_title;

ALTER TABLE icerik
ADD COLUMN tr_seo_title VARCHAR(255) DEFAULT NULL AFTER tr_baslik,
ADD COLUMN tr_seo_description VARCHAR(255) DEFAULT NULL AFTER tr_seo_title,
ADD COLUMN en_seo_title VARCHAR(255) DEFAULT NULL AFTER en_baslik,
ADD COLUMN en_seo_description VARCHAR(255) DEFAULT NULL AFTER en_seo_title,
ADD COLUMN ru_seo_title VARCHAR(255) DEFAULT NULL AFTER ru_baslik,
ADD COLUMN ru_seo_description VARCHAR(255) DEFAULT NULL AFTER ru_seo_title,
ADD COLUMN ar_seo_title VARCHAR(255) DEFAULT NULL AFTER ar_baslik,
ADD COLUMN ar_seo_description VARCHAR(255) DEFAULT NULL AFTER ar_seo_title,
ADD COLUMN de_seo_title VARCHAR(255) DEFAULT NULL AFTER de_baslik,
ADD COLUMN de_seo_description VARCHAR(255) DEFAULT NULL AFTER de_seo_title,
ADD COLUMN fr_seo_title VARCHAR(255) DEFAULT NULL AFTER fr_baslik,
ADD COLUMN fr_seo_description VARCHAR(255) DEFAULT NULL AFTER fr_seo_title;
