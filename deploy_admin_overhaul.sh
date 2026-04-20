#!/bin/bash

##############################################
# ADMIN PANEL OVERHAUL DEPLOYMENT SCRIPT
# Prof. Dr. Gökçe Özel - Modern Admin Panel
##############################################

HOST="ftp.eyalcin.com"
USER="eyalcin_seo"
PASS="Gokce135246"
REMOTE_PATH="/home/eyalcin_seo/public_html"

echo "========================================="
echo "🚀 ADMIN DEPLOYMENT BAŞLIYOR"
echo "========================================="
echo ""

# ADIM 1: Assets Klasörünü Yükle (CSS/JS)
echo "📦 ADIM 1: Assets (CSS/JS) yükleniyor..."
echo ""

lftp -c "
set ssl:verify-certificate no
open ftp://$USER:$PASS@$HOST
cd $REMOTE_PATH/yonetim
mkdir -p assets
mkdir -p assets/css
mkdir -p assets/js
mkdir -p assets/img
cd assets/css
put /Users/mkanik/Documents/GitHub/gokceozel.com.tr/site_backup/public_html/yonetim/assets/css/admin.css
cd ../js
put /Users/mkanik/Documents/GitHub/gokceozel.com.tr/site_backup/public_html/yonetim/assets/js/admin.js
bye
"

echo "✅ Assets yüklendi"
echo ""

# ADIM 2: Ana Yapı Dosyalarını Yükle
echo "📦 ADIM 2: Ana yapı dosyaları (ust, alt, sidebar) yükleniyor..."
echo ""

lftp -c "
set ssl:verify-certificate no
open ftp://$USER:$PASS@$HOST
cd $REMOTE_PATH/yonetim
put /Users/mkanik/Documents/GitHub/gokceozel.com.tr/site_backup/public_html/yonetim/ust.php
put /Users/mkanik/Documents/GitHub/gokceozel.com.tr/site_backup/public_html/yonetim/alt.php
put /Users/mkanik/Documents/GitHub/gokceozel.com.tr/site_backup/public_html/yonetim/alt2.php
put /Users/mkanik/Documents/GitHub/gokceozel.com.tr/site_backup/public_html/yonetim/sidebar.php
bye
"

echo "✅ Yapı dosyaları yüklendi"
echo ""

# ADIM 3: Sayfaları Yükle
echo "📦 ADIM 3: Sayfa dosyaları yükleniyor..."
echo ""

lftp -c "
set ssl:verify-certificate no
open ftp://$USER:$PASS@$HOST
cd $REMOTE_PATH/yonetim
put /Users/mkanik/Documents/GitHub/gokceozel.com.tr/site_backup/public_html/yonetim/index.php
put /Users/mkanik/Documents/GitHub/gokceozel.com.tr/site_backup/public_html/yonetim/icerik_ekle.php
put /Users/mkanik/Documents/GitHub/gokceozel.com.tr/site_backup/public_html/yonetim/dil_yonetimi.php
put /Users/mkanik/Documents/GitHub/gokceozel.com.tr/site_backup/public_html/yonetim/kategori_yonetimi.php
bye
"

echo "✅ Sayfalar yüklendi"
echo ""

echo "========================================="
echo "✅ DEPLOYMENT TAMAMLANDI!"
echo "========================================="
echo ""
