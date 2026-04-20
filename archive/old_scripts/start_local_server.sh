#!/bin/bash
# Yerel web sunucusu başlatma scripti

echo "=========================================="
echo "Yerel Web Sunucusu Başlatılıyor"
echo "=========================================="

# PHP kontrolü
if command -v php &> /dev/null; then
    PHP_VERSION=$(php -v | head -1)
    echo "✓ PHP bulundu: $PHP_VERSION"
else
    echo "✗ PHP bulunamadı"
    echo ""
    echo "PHP kurulumu:"
    echo "  brew install php"
    echo ""
    echo "Veya Docker kullanabilirsiniz (start_local_server_docker.sh)"
    exit 1
fi

# Docker container kontrolü
if ! docker ps | grep -q mysql-gokceozel; then
    echo ""
    echo "⚠ MySQL container çalışmıyor, başlatılıyor..."
    docker start mysql-gokceozel
    sleep 5
fi

# Dizinleri kontrol et
if [ ! -d "site_backup/public_html" ]; then
    echo "✗ site_backup/public_html dizini bulunamadı"
    exit 1
fi

# Port kontrolü
PORT=8000
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠ Port $PORT kullanımda, alternatif port deneniyor..."
    PORT=8001
fi

echo ""
echo "Web sunucusu başlatılıyor..."
echo "  URL: http://localhost:$PORT"
echo "  Dizin: site_backup/public_html"
echo ""
echo "Durdurmak için: Ctrl+C"
echo ""

# PHP built-in server başlat
cd site_backup/public_html
php -S localhost:$PORT

