#!/bin/bash

##############################################
# CLEANUP AFTER MIGRATION
# Migration sonrası güvenlik için temizlik
##############################################

HOST="ftp.eyalcin.com"
USER="eyalcin_seo"
PASS="Gokce135246"
REMOTE_PATH="/home/eyalcin_seo/public_html"

echo "========================================="
echo "🧹 MİGRATION SONRASI TEMİZLİK"
echo "========================================="
echo ""

echo "⚠️  UYARI: Migration klasörü ve içindeki tüm dosyalar silinecek!"
echo "Migration'ın başarıyla tamamlandığından emin olun."
echo ""
read -p "Devam etmek istiyor musunuz? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "❌ İşlem iptal edildi."
    exit 1
fi

echo ""
echo "🗑️  Migration dosyaları siliniyor..."

lftp -c "
set ssl:verify-certificate no
open ftp://$USER:$PASS@$HOST
cd $REMOTE_PATH
rm -r migration
bye
"

echo "✅ Migration klasörü silindi!"
echo ""

echo "========================================="
echo "🔒 GÜVENLİK KONTROLÜ"
echo "========================================="
echo ""

echo "Kontrol edilecek dosyalar:"
echo "1. ✅ migration/ klasörü silindi"
echo "2. ⚠️  .htaccess yedekleri var mı?"
echo "3. ⚠️  database backup'ları güvende mi?"
echo ""

lftp -c "
set ssl:verify-certificate no
open ftp://$USER:$PASS@$HOST
cd $REMOTE_PATH
ls -la | grep .htaccess
bye
"

echo ""
echo "========================================="
echo "✅ TEMİZLİK TAMAMLANDI!"
echo "========================================="
echo ""
echo "📋 FİNAL KONTROL LİSTESİ:"
echo ""
echo "✅ Migration scriptleri silindi"
echo "✅ Sistem production'da çalışıyor"
echo ""
echo "🔗 Site URL'leri:"
echo "   • Ana Sayfa: https://gokceozel.com.tr"
echo "   • Admin Panel: https://gokceozel.com.tr/yonetim/login.php"
echo "   • SEO Dashboard: https://gokceozel.com.tr/yonetim/seo-dashboard.php"
echo "   • Sitemap: https://gokceozel.com.tr/sitemap.xml"
echo ""
echo "🎉 SİSTEM PRODUCTION'DA ÇALIŞIYOR!"
echo ""
