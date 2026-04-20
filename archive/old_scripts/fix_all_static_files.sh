#!/bin/bash
# Tüm statik dosyaları (resimler, ikonlar, fontlar) public_html'e kopyalama scripti

cd "$(dirname "$0")/site_backup"

echo "=========================================="
echo "Statik Dosyalar Kopyalanıyor..."
echo "=========================================="

# 1. Vendor kütüphaneleri
echo "1. Vendor kütüphaneleri kopyalanıyor..."
mkdir -p public_html/vendor
for dir in jquery jquery-migrate cookie bootstrap-datetimepicker popper bootstrap waypoints imagesloaded slick scroll-with-ease countTo form-validation animate; do
    if [ -d "$dir" ]; then
        cp -r "$dir" public_html/vendor/ 2>/dev/null
    fi
done

# 2. CSS, JS, Icons, Images
echo "2. CSS, JS, Icons, Images kopyalanıyor..."
for dir in css js icons images form flag gallery product; do
    if [ -d "$dir" ] && [ ! -d "public_html/$dir" ]; then
        cp -r "$dir" public_html/ 2>/dev/null
    fi
done

# 3. Icon font dosyaları
echo "3. Icon font dosyaları kopyalanıyor..."
mkdir -p public_html/icons/fonts

# Icofont font dosyaları
find . -name "icofont.woff*" -o -name "icofont.ttf" -o -name "icofont.eot" | while read file; do
    cp "$file" public_html/icons/fonts/ 2>/dev/null
done

# Dentco font dosyaları
find . -name "dentco.*" | while read file; do
    cp "$file" public_html/icons/fonts/ 2>/dev/null
done

# Diğer font dosyaları (icons/fonts klasöründen)
if [ -d "icons/fonts" ]; then
    cp -r icons/fonts/* public_html/icons/fonts/ 2>/dev/null
fi

# 4. Yonetim dosyaları
echo "4. Yonetim dosyaları kopyalanıyor..."
mkdir -p public_html/yonetim
if [ -d "dosya" ]; then
    cp -r dosya public_html/yonetim/ 2>/dev/null
fi

# 5. Eksik font dosyalarını kontrol et
echo "5. Eksik font dosyaları kontrol ediliyor..."
if [ ! -f "public_html/icons/fonts/icofont.woff2" ] || [ ! -f "public_html/icons/fonts/icofont.woff" ]; then
    echo "  ⚠️  Icofont font dosyaları bulunamadı!"
    echo "  Bu dosyalar manuel olarak eklenmelidir."
fi

if [ ! -f "public_html/icons/fonts/dentco.woff" ] && [ ! -f "public_html/icons/fonts/dentco.ttf" ]; then
    echo "  ⚠️  Dentco font dosyaları bulunamadı!"
    echo "  Bu dosyalar manuel olarak eklenmelidir."
fi

echo ""
echo "=========================================="
echo "✓ Statik dosyalar kopyalandı"
echo "=========================================="
echo ""
echo "Kopyalanan klasörler:"
ls -d public_html/*/ 2>/dev/null | sed 's|public_html/||' | sed 's|/||'

