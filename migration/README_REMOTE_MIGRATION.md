# 🚀 Remote Sunucuya Migration Uygulama Rehberi

Bu rehber, local'de geliştirilen tüm database değişikliklerini canlı sunucuya (remote) uygulamak için hazırlanmıştır.

---

## 📋 ÖN HAZIRLIK

### 1. Remote Sunucu Bilgilerini Edinin

Canlı sunucunuzun veritabanı bilgilerini bulun:
- **Sunucu Adresi** (Host): Örn: `185.123.45.67` veya `db.example.com`
- **Veritabanı Adı**: Örn: `gokceozel_db`
- **Kullanıcı Adı**: Örn: `gokceozel_user`
- **Şifre**: Veritabanı şifresi
- **Port**: Genellikle `3306` (varsayılan)

### 2. Bağlantı Dosyasını Yapılandırın

`site_backup/public_html/baglanti/baglan_remote.php` dosyasını açın ve bilgileri doldurun:

```php
$remote_sunucu = 'db.example.com';        // Remote host adresi
$remote_dbkullanici = 'gokceozel_user';   // Veritabanı kullanıcı adı
$remote_dbsifre = 'GÜÇLÜ_ŞİFRE_BURAYA';  // Veritabanı şifresi
$remote_db = 'gokceozel_db';              // Veritabanı adı
$remote_port = 3306;                       // Port (genellikle 3306)
```

---

## 🔍 ADIM 1: BAĞLANTI TESTİ

Önce remote sunucuya bağlanabildiğinizi test edin:

```bash
cd /Users/mkanik/Documents/GitHub/gokceozel.com.tr
php migration/test_remote_connection.php
```

**Beklenen Çıktı:**
```
✅ MySQL Versiyonu: 8.0.xx
✅ Aktif Veritabanı: gokceozel_db
✅ Karakter Seti: utf8mb4 (utf8mb4_unicode_ci)
📋 Mevcut Tablolar:
   - icerik (38 satır)
   - genel_kategori (20 satır)
   ...
⚠️  Migration gerekli!
```

**Eğer hata alırsanız:**
- Bağlantı bilgilerini kontrol edin
- Remote sunucuya erişim olduğundan emin olun
- Firewall/güvenlik ayarlarını kontrol edin
- Veritabanı kullanıcısının yeterli yetkisi olduğunu doğrulayın

---

## 🚀 ADIM 2: MİGRATION UYGULAMA

Bağlantı testi başarılıysa, migration'ları uygulayın:

```bash
php migration/apply_to_remote.php
```

Bu script şunları yapar:
1. ✅ `01_add_slug_columns.sql` - Slug kolonlarını ekler (7 dil için)
2. ✅ `02_create_seo_scoring_system.sql` - SEO scoring sistemini kurar
3. ✅ Otomatik slug generation - Mevcut içerikler için slug'lar oluşturur

**Beklenen Çıktı:**
```
========================================
🚀 REMOTE SUNUCU MIGRATION BAŞLATILIYOR
========================================

📄 Migration: 01_add_slug_columns.sql
   📊 Toplam 28 SQL komutu bulundu
   ✅ Başarılı! 28 komut uygulandı

📄 Migration: 02_create_seo_scoring_system.sql
   📊 Toplam 45 SQL komutu bulundu
   ✅ Başarılı! 45 komut uygulandı

========================================
📊 MIGRATION SONUÇLARI
========================================
✅ Başarılı: 2
❌ Hatalı: 0
📁 Toplam: 2

🎉 Tüm migration'lar başarıyla uygulandı!

🔧 Şimdi slug'ları oluşturuluyor...

========================================
🔧 SLUG OLUŞTURMA BAŞLATILIYOR
========================================

📝 İçerik slug'ları oluşturuluyor...
   ✅ 38 içerik güncellendi

📂 Kategori slug'ları oluşturuluyor...
   ✅ 20 kategori güncellendi

========================================
🎉 TÜM SLUG'LAR OLUŞTURULDU!
========================================

✨ Remote sunucu hazır!
```

---

## 📊 ADIM 3: DOĞRULAMA

Migration tamamlandıktan sonra tekrar test edin:

```bash
php migration/test_remote_connection.php
```

**Başarılı Sonuç:**
```
🔍 Slug Kolonları Kontrolü:
   ✅ Slug kolonları MEVCUT (Zaten uygulanmış)
      - tr_slug
      - en_slug
      - ru_slug
      - ar_slug
      - de_slug
      - fr_slug
      - cin_slug

🔍 SEO Tabloları Kontrolü:
   ✅ seo_scores - Mevcut (0 satır)
   ✅ seo_rules - Mevcut (22 satır)
   ✅ seo_keywords - Mevcut (0 satır)
   ✅ seo_audit_log - Mevcut (0 satır)
   ✅ seo_recommendations - Mevcut (0 satır)

========================================
📊 SONUÇ
========================================
✅ Veritabanı hazır!
   Tüm migration'lar zaten uygulanmış.
```

---

## 🔄 ADIM 4: DOSYA YÜKLEMESİ

Database migration tamamlandıktan sonra, yeni dosyaları canlı sunucuya yükleyin:

### Yüklenmesi Gereken Dosyalar:

```
site_backup/public_html/
├── .htaccess                           # ✨ Güncellenmiş - SEO-friendly routing
├── baglanti/
│   ├── seo_analyzer.php               # 🆕 Yeni - SEO scoring engine
│   └── url_helpers.php                # 🆕 Yeni - URL helper fonksiyonları
├── sitemap.xml.php                     # 🆕 Yeni - Dynamic sitemap
├── robots.txt                          # 🆕 Yeni - SEO robots dosyası
├── yonetim/
│   ├── dashboard.php                   # 🆕 Yeni - Modern dashboard
│   ├── sidebar.php                     # 🆕 Yeni - Admin sidebar
│   ├── content-edit.php               # 🆕 Yeni - Multi-language editor
│   ├── content-save.php               # 🆕 Yeni - Content save handler
│   ├── seo-dashboard.php              # 🆕 Yeni - SEO analytics dashboard
│   ├── login.php                       # 🆕 Yeni - Admin login
│   └── logout.php                      # 🆕 Yeni - Admin logout
├── hizmetdetay.php                     # ✨ Güncellenmiş - Slug support
└── blogdetay.php                       # ✨ Güncellenmiş - Slug support
```

### FTP/SFTP ile Yükleme:

```bash
# SFTP örneği
sftp user@your-server.com
cd /path/to/public_html
put -r site_backup/public_html/baglanti
put -r site_backup/public_html/yonetim
put site_backup/public_html/.htaccess
put site_backup/public_html/sitemap.xml.php
put site_backup/public_html/robots.txt
put site_backup/public_html/hizmetdetay.php
put site_backup/public_html/blogdetay.php
```

---

## ✅ ADIM 5: CANLIDA TEST

Dosyalar yüklendikten sonra:

### 1. Admin Paneline Giriş:
```
https://gokceozel.com.tr/yonetim/login.php
```

### 2. SEO Dashboard:
```
https://gokceozel.com.tr/yonetim/seo-dashboard.php
```

### 3. Yeni URL Formatını Test Edin:
```
# Eski format (hala çalışır, 301 redirect):
https://gokceozel.com.tr/hizmetdetay.php?detay=ID&LN=EN

# Yeni format:
https://gokceozel.com.tr/en/services/rhinoplasty
https://gokceozel.com.tr/tr/blog/yuz-estetigi-trendleri
```

### 4. Sitemap:
```
https://gokceozel.com.tr/sitemap.xml
```

### 5. Robots.txt:
```
https://gokceozel.com.tr/robots.txt
```

---

## 🛠️ SORUN GİDERME

### Migration Hataları

**Hata: "Connection refused"**
- Remote sunucu IP adresini kontrol edin
- Firewall/güvenlik duvarı portları açık mı?
- VPN/SSH tunnel gerekli mi?

**Hata: "Access denied"**
- Kullanıcı adı ve şifre doğru mu?
- Veritabanı kullanıcısının yetkileri yeterli mi?
- Uzak erişim (remote access) açık mı?

**Hata: "Table already exists"**
- Normal! Migration zaten uygulanmış
- Script devam edecek ve atlanacak

**Hata: "Duplicate column name"**
- Normal! Kolon zaten var
- Script devam edecek ve atlanacak

### Dosya Yükleme Sorunları

**404 Hataları:**
- Dosya yollarını kontrol edin
- Dosya izinlerini kontrol edin (644 for files, 755 for directories)

**.htaccess Çalışmıyor:**
- Apache `mod_rewrite` modülü aktif mi?
- `.htaccess` override izni var mı? (`AllowOverride All`)

---

## 🔄 GERİ ALMA (ROLLBACK)

Eğer bir sorun olursa:

### 1. Database Rollback:

```sql
-- Slug kolonlarını kaldır
ALTER TABLE icerik
DROP COLUMN tr_slug, DROP COLUMN en_slug, DROP COLUMN ru_slug,
DROP COLUMN ar_slug, DROP COLUMN de_slug, DROP COLUMN fr_slug, DROP COLUMN cin_slug;

ALTER TABLE genel_kategori
DROP COLUMN tr_slug, DROP COLUMN en_slug, DROP COLUMN ru_slug,
DROP COLUMN ar_slug, DROP COLUMN de_slug, DROP COLUMN fr_slug, DROP COLUMN cin_slug;

-- SEO tablolarını kaldır
DROP TABLE IF EXISTS seo_scores;
DROP TABLE IF EXISTS seo_keywords;
DROP TABLE IF EXISTS seo_rules;
DROP TABLE IF EXISTS seo_audit_log;
DROP TABLE IF EXISTS seo_recommendations;
```

### 2. Dosya Rollback:

Eski `.htaccess` dosyasını geri yükleyin ve yeni dosyaları silin.

---

## 📞 DESTEK

Sorun yaşarsanız:
1. Test komutlarının çıktısını kaydedin
2. Hata mesajlarının tam metnini alın
3. Migration log dosyalarını kontrol edin

---

## 🎉 BAŞARILI!

Tüm adımlar tamamlandıysa:

✅ Remote sunucu modern SEO-friendly URL sistemine sahip
✅ Multi-language slug desteği aktif
✅ SEO scoring sistemi kuruldu
✅ Admin CMS paneli çalışıyor
✅ Sitemap ve robots.txt dinamik olarak üretiliyor

**Site artık production'a hazır!** 🚀
