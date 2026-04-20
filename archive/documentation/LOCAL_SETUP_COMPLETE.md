# Yerel Geliştirme Ortamı Kurulumu Tamamlandı ✅

## 🎉 Başarıyla Tamamlandı

Web sitesi yerel veritabanı ile çalışacak şekilde yapılandırıldı ve başlatıldı.

## 🔧 Yapılan Değişiklikler

### 1. Veritabanı Bağlantı Dosyaları Güncellendi

**Güncellenen Dosyalar:**
- `site_backup/baglanti/baglan.php`
- `site_backup/yonetim/baglan.php`

**Yeni Ayarlar:**
```php
$sunucu = 'localhost';
$dbkullanici = 'root';
$dbsifre = 'root';
$db = 'gokceozel_local';
$port = 3306;
```

### 2. Yerel Veritabanı
- **Container:** mysql-gokceozel (Docker)
- **Database:** gokceozel_local
- **Port:** 3306

## 🌐 Web Sunucusu

### Erişim Bilgileri
- **URL:** http://localhost:8000 (veya 8001)
- **Dizin:** `site_backup/public_html`

### Sunucuyu Başlatma

#### Yöntem 1: Python Scripti (Önerilen)
```bash
python3 start_local_server.py
```

#### Yöntem 2: Shell Script
```bash
./start_local_server.sh
```

#### Yöntem 3: Manuel PHP Server
```bash
cd site_backup/public_html
php -S localhost:8000
```

### Sunucuyu Durdurma
- Terminal'de `Ctrl+C` tuşlarına basın

## 📁 Proje Yapısı

```
gokceozel.com.tr/
├── site_backup/
│   ├── public_html/          # Frontend (Ana site)
│   ├── yonetim/              # Admin paneli
│   └── baglanti/
│       └── baglan.php        # Veritabanı bağlantısı (güncellendi)
├── database_backup/          # SQL yedekleri
├── start_local_server.py     # Sunucu başlatma scripti
└── setup_local_database.py   # Veritabanı kurulum scripti
```

## 🔗 Erişim URL'leri

### Frontend
- **Ana Sayfa:** http://localhost:8000
- **Hizmetler:** http://localhost:8000/hizmetler.php
- **Blog:** http://localhost:8000/blog.php
- **Kurumsal:** http://localhost:8000/kurumsal.php

### Admin Paneli
- **Giriş:** http://localhost:8000/yonetim/giris.php
- **Kullanıcı:** seo
- **Şifre:** 135246

## 🐳 Docker Container Yönetimi

### MySQL Container
```bash
# Başlat
docker start mysql-gokceozel

# Durdur
docker stop mysql-gokceozel

# Durum kontrolü
docker ps | grep mysql-gokceozel
```

## ⚠️ Önemli Notlar

1. **MySQL Container:** Web sunucusunu başlatmadan önce MySQL container'ının çalıştığından emin olun
2. **Port Çakışması:** Eğer 8000 portu kullanımdaysa, script otomatik olarak 8001 portunu kullanır
3. **Dosya Yolları:** Bazı dosya yolları (resimler, dosyalar) yanlış görünebilir, bu normaldir
4. **Session:** Admin paneli için session çalışması gerekir

## 🔍 Sorun Giderme

### Veritabanı Bağlantı Hatası
```bash
# MySQL container'ı kontrol et
docker ps | grep mysql-gokceozel

# Container'ı başlat
docker start mysql-gokceozel

# Bağlantıyı test et
docker exec mysql-gokceozel mysql -uroot -proot gokceozel_local -e "SHOW TABLES;"
```

### PHP Hatası
```bash
# PHP versiyonunu kontrol et
php --version

# PHP modüllerini kontrol et
php -m | grep pdo
php -m | grep mysql
```

### Port Kullanımda
```bash
# Port kullanımını kontrol et
lsof -i :8000

# Farklı port kullan
cd site_backup/public_html
php -S localhost:8001
```

## 📝 Sonraki Adımlar

1. Web sitesini tarayıcıda açın: http://localhost:8000
2. Admin paneline giriş yapın: http://localhost:8000/yonetim/giris.php
3. Veritabanı bağlantısını test edin
4. İçerikleri kontrol edin

## 🎯 Hızlı Başlangıç

```bash
# 1. MySQL container'ı başlat
docker start mysql-gokceozel

# 2. Web sunucusunu başlat
python3 start_local_server.py

# 3. Tarayıcıda aç
open http://localhost:8000
```

