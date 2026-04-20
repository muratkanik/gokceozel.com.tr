# Yerel Web Sunucusu Durumu

## ✅ Kurulum Tamamlandı

### Veritabanı Bağlantıları Güncellendi
- `site_backup/baglanti/baglan.php` - Yerel veritabanı ayarlarıyla güncellendi
- `site_backup/yonetim/baglan.php` - Yerel veritabanı ayarlarıyla güncellendi
- `site_backup/public_html/ust.php` - Dosya yolu düzeltildi

### Web Sunucusu
- **Durum:** Çalışıyor
- **URL:** http://localhost:8000
- **Port:** 8000
- **Dizin:** `site_backup/public_html`

## 🚀 Sunucuyu Başlatma

### Hızlı Başlatma
```bash
./start_server.sh
```

### Manuel Başlatma
```bash
cd site_backup/public_html
php -S localhost:8000
```

## 🔗 Erişim URL'leri

- **Ana Sayfa:** http://localhost:8000
- **Admin Paneli:** http://localhost:8000/yonetim/giris.php
  - Kullanıcı: seo
  - Şifre: 135246

## ⚠️ Önemli Notlar

1. **MySQL Container:** Sunucuyu başlatmadan önce MySQL container'ının çalıştığından emin olun:
   ```bash
   docker start mysql-gokceozel
   ```

2. **Dosya Yolları:** Bazı dosya yolları (resimler, dosyalar) yanlış görünebilir. Bu normaldir çünkü dosyalar `yonetim/dosya/` klasöründe.

3. **Session:** Admin paneli için PHP session'larının çalışması gerekir.

## 🛠️ Sorun Giderme

### Sunucu Başlamıyor
```bash
# Port kontrolü
lsof -i :8000

# PHP kontrolü
php --version

# MySQL container kontrolü
docker ps | grep mysql-gokceozel
```

### Veritabanı Bağlantı Hatası
```bash
# Container'ı başlat
docker start mysql-gokceozel

# Bağlantıyı test et
docker exec mysql-gokceozel mysql -uroot -proot gokceozel_local -e "SHOW TABLES;"
```

### Dosya Yolu Hataları
Eğer "include" hataları alıyorsanız, dosya yollarını kontrol edin:
- `site_backup/public_html/ust.php` → `../baglanti/baglantilar_fonksiyonlar.php`
- `site_backup/yonetim/*.php` → `baglanti/baglantilar_fonksiyonlar.php`

