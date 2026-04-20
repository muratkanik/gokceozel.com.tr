#!/bin/bash

##############################################
# PRODUCTION DEPLOYMENT SCRIPT
# Prof. Dr. Gökçe Özel - Modern SEO CMS
##############################################

HOST="ftp.eyalcin.com"
USER="eyalcin_seo"
PASS="Gokce135246"
REMOTE_PATH="/home/eyalcin_seo/public_html"

echo "========================================="
echo "🚀 PRODUCTION DEPLOYMENT BAŞLIYOR"
echo "========================================="
echo ""

# ADIM 1: Migration dosyalarını yükle
echo "📦 ADIM 1: Migration dosyaları yükleniyor..."
echo ""

lftp -c "
set ssl:verify-certificate no
open ftp://$USER:$PASS@$HOST
cd $REMOTE_PATH
mkdir -p migration
cd migration
mput /Users/mkanik/Documents/GitHub/gokceozel.com.tr/migration/*.sql
put /Users/mkanik/Documents/GitHub/gokceozel.com.tr/migration/apply_to_production.php
put /Users/mkanik/Documents/GitHub/gokceozel.com.tr/migration/generate_slugs_production.php
bye
"

echo "✅ Migration dosyaları yüklendi"
echo ""

# ADIM 2: Yeni PHP dosyalarını yükle
echo "📦 ADIM 2: Yeni PHP dosyaları yükleniyor..."
echo ""

# baglanti klasörü dosyaları
echo "   - baglanti/seo_analyzer.php"
echo "   - baglanti/url_helpers.php"
lftp -c "
set ssl:verify-certificate no
open ftp://$USER:$PASS@$HOST
cd $REMOTE_PATH/yonetim/baglanti
put /Users/mkanik/Documents/GitHub/gokceozel.com.tr/site_backup/public_html/baglanti/seo_analyzer.php
put /Users/mkanik/Documents/GitHub/gokceozel.com.tr/site_backup/public_html/baglanti/url_helpers.php
bye
"

# sitemap ve robots
echo "   - sitemap.xml.php"
echo "   - robots.txt"
lftp -c "
set ssl:verify-certificate no
open ftp://$USER:$PASS@$HOST
cd $REMOTE_PATH
put /Users/mkanik/Documents/GitHub/gokceozel.com.tr/site_backup/public_html/sitemap.xml.php
put /Users/mkanik/Documents/GitHub/gokceozel.com.tr/site_backup/public_html/robots.txt
bye
"

# Güncellenmiş PHP dosyaları
echo "   - hizmetdetay.php (slug desteği)"
echo "   - blogdetay.php (slug desteği)"
lftp -c "
set ssl:verify-certificate no
open ftp://$USER:$PASS@$HOST
cd $REMOTE_PATH
put /Users/mkanik/Documents/GitHub/gokceozel.com.tr/site_backup/public_html/hizmetdetay.php
put /Users/mkanik/Documents/GitHub/gokceozel.com.tr/site_backup/public_html/blogdetay.php
bye
"

# Yönetim paneli dosyaları
echo "   - yonetim/dashboard.php"
echo "   - yonetim/sidebar.php"
echo "   - yonetim/content-edit.php"
echo "   - yonetim/content-save.php"
echo "   - yonetim/seo-dashboard.php"
echo "   - yonetim/login.php"
echo "   - yonetim/logout.php"
lftp -c "
set ssl:verify-certificate no
open ftp://$USER:$PASS@$HOST
cd $REMOTE_PATH/yonetim
put /Users/mkanik/Documents/GitHub/gokceozel.com.tr/site_backup/public_html/yonetim/dashboard.php
put /Users/mkanik/Documents/GitHub/gokceozel.com.tr/site_backup/public_html/yonetim/sidebar.php
put /Users/mkanik/Documents/GitHub/gokceozel.com.tr/site_backup/public_html/yonetim/content-edit.php
put /Users/mkanik/Documents/GitHub/gokceozel.com.tr/site_backup/public_html/yonetim/content-save.php
put /Users/mkanik/Documents/GitHub/gokceozel.com.tr/site_backup/public_html/yonetim/seo-dashboard.php
put /Users/mkanik/Documents/GitHub/gokceozel.com.tr/site_backup/public_html/yonetim/login.php
put /Users/mkanik/Documents/GitHub/gokceozel.com.tr/site_backup/public_html/yonetim/logout.php
bye
"

# AJAX Kategori scriptleri
echo "   - ajax/kategori_ekle.php"
echo "   - ajax/kategori_ceviri.php"
lftp -c "
set ssl:verify-certificate no
open ftp://$USER:$PASS@$HOST
cd $REMOTE_PATH/ajax
put /Users/mkanik/Documents/GitHub/gokceozel.com.tr/site_backup/public_html/ajax/kategori_ekle.php
put /Users/mkanik/Documents/GitHub/gokceozel.com.tr/site_backup/public_html/ajax/kategori_ceviri.php
bye
"

echo ""
echo "✅ Tüm dosyalar yüklendi!"
echo ""

# .htaccess yedekleme ve güncelleme
echo "📦 ADIM 3: .htaccess yedekleniyor ve güncelleniyor..."
echo ""

lftp -c "
set ssl:verify-certificate no
open ftp://$USER:$PASS@$HOST
cd $REMOTE_PATH
get .htaccess -o .htaccess.backup.$(date +%Y%m%d)
put /Users/mkanik/Documents/GitHub/gokceozel.com.tr/site_backup/public_html/.htaccess
bye
"

echo "✅ .htaccess güncellendi (yedek alındı)"
echo ""

echo "========================================="
echo "✅ DEPLOYMENT TAMAMLANDI!"
echo "========================================="
echo ""
echo "📋 SONRAKI ADIMLAR:"
echo ""
echo "1. Migration'ı çalıştırın:"
echo "   👉 https://gokceozel.com.tr/migration/apply_to_production.php"
echo ""
echo "2. Migration tamamlandıktan sonra temizlik yapın:"
echo "   👉 ./cleanup_after_migration.sh"
echo ""
echo "3. Admin panelini test edin:"
echo "   👉 https://gokceozel.com.tr/yonetim/login.php"
echo ""
echo "4. SEO Dashboard kontrol edin:"
echo "   👉 https://gokceozel.com.tr/yonetim/seo-dashboard.php"
echo ""
echo "========================================="
