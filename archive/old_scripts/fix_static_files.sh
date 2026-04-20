#!/bin/bash
# Statik dosyaları public_html'e kopyalama scripti

cd "$(dirname "$0")/site_backup"

echo "Statik dosyalar kopyalanıyor..."

# Vendor alt klasörlerini kopyala
mkdir -p public_html/vendor
for dir in jquery jquery-migrate cookie bootstrap-datetimepicker popper bootstrap waypoints imagesloaded slick scroll-with-ease countTo form-validation animate; do
    if [ -d "$dir" ]; then
        echo "  Kopyalanıyor: $dir"
        cp -r "$dir" public_html/vendor/ 2>/dev/null
    fi
done

# Diğer klasörleri kopyala
for dir in css js icons images form flag gallery product; do
    if [ -d "$dir" ] && [ ! -d "public_html/$dir" ]; then
        echo "  Kopyalanıyor: $dir"
        cp -r "$dir" public_html/ 2>/dev/null
    fi
done

# Yonetim dosyaları için sembolik link
if [ ! -d "public_html/yonetim" ]; then
    mkdir -p public_html/yonetim
    if [ -d "yonetim/dosya" ]; then
        echo "  Kopyalanıyor: yonetim/dosya"
        cp -r yonetim/dosya public_html/yonetim/ 2>/dev/null
    fi
fi

echo "✓ Statik dosyalar kopyalandı"

