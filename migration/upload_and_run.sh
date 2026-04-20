#!/bin/bash

echo "========================================="
echo "🚀 CANLIYA MIGRATION YÜKLEME VE ÇALIŞTIRMA"
echo "========================================="
echo ""

HOST="ftp.eyalcin.com"
USER="eyalcin_seo"
PASS="Gokce135246"
REMOTE_PATH="/home/eyalcin_seo/public_html"

echo "📤 Migration dosyaları FTP ile yükleniyor..."
echo ""

# Migration klasörünü oluştur
lftp -c "
set ssl:verify-certificate no
open ftp://$USER:$PASS@$HOST
cd $REMOTE_PATH
mkdir -p migration
bye
"

# SQL dosyalarını yükle
echo "📄 SQL migration dosyaları yükleniyor..."
lftp -c "
set ssl:verify-certificate no
open ftp://$USER:$PASS@$HOST
cd $REMOTE_PATH/migration
mput ../migration/*.sql
bye
"

# PHP scriptleri yükle
echo "📄 PHP migration scriptleri yükleniyor..."
lftp -c "
set ssl:verify-certificate no
open ftp://$USER:$PASS@$HOST
cd $REMOTE_PATH/migration
put ../migration/apply_to_production.php
put ../migration/generate_slugs_production.php
bye
"

echo ""
echo "✅ Dosyalar yüklendi!"
echo ""
echo "========================================="
echo "📋 SONRAKİ ADIMLAR:"
echo "========================================="
echo ""
echo "1. Tarayıcıda açın:"
echo "   https://gokceozel.com.tr/migration/apply_to_production.php"
echo ""
echo "2. Migration otomatik çalışacak"
echo ""
echo "3. Sonuçları kontrol edin"
echo ""
echo "========================================="
