# 🚀 Remote Migration - Hızlı Başlangıç

## ⚡ 3 ADIMDA CANLIYA AKTARIM

### 1️⃣ Bağlantı Bilgilerini Girin

`site_backup/public_html/baglanti/baglan_remote.php` dosyasını düzenleyin:

```php
$remote_sunucu = 'YOUR_DB_HOST';        // Örn: db.example.com
$remote_dbkullanici = 'YOUR_DB_USER';   // Veritabanı kullanıcı adı
$remote_dbsifre = 'YOUR_DB_PASSWORD';   // Veritabanı şifresi
$remote_db = 'YOUR_DB_NAME';            // Veritabanı adı
```

---

### 2️⃣ Test & Migration Çalıştırın

```bash
cd /Users/mkanik/Documents/GitHub/gokceozel.com.tr

# Önce bağlantıyı test edin
php migration/test_remote_connection.php

# Migration'ları uygulayın
php migration/apply_to_remote.php
```

---

### 3️⃣ Dosyaları Yükleyin

FTP/SFTP ile canlı sunucuya yükleyin:

**Yeni Dosyalar:**
```
✅ baglanti/seo_analyzer.php
✅ baglanti/url_helpers.php
✅ sitemap.xml.php
✅ robots.txt
✅ yonetim/dashboard.php
✅ yonetim/sidebar.php
✅ yonetim/content-edit.php
✅ yonetim/content-save.php
✅ yonetim/seo-dashboard.php
✅ yonetim/login.php
✅ yonetim/logout.php
```

**Güncellenen Dosyalar:**
```
✅ .htaccess
✅ hizmetdetay.php
✅ blogdetay.php
```

---

## ✅ TEST

Canlıda test edin:

1. **Admin Panel:** https://gokceozel.com.tr/yonetim/login.php
2. **SEO Dashboard:** https://gokceozel.com.tr/yonetim/seo-dashboard.php
3. **Yeni URL:** https://gokceozel.com.tr/en/services/rhinoplasty
4. **Sitemap:** https://gokceozel.com.tr/sitemap.xml

---

## 📚 Detaylı Rehber

Daha fazla bilgi için: `migration/README_REMOTE_MIGRATION.md`

---

## 🎉 Başarılı!

Tüm sistemler hazır:
- ✅ SEO-friendly URLs
- ✅ Multi-language support (7 dil)
- ✅ SEO scoring system
- ✅ Modern CMS admin panel
- ✅ Dynamic sitemap & robots.txt
