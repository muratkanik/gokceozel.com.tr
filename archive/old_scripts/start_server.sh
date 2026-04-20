#!/bin/bash
# Web sunucusu başlatma scripti

cd "$(dirname "$0")/site_backup/public_html"

# MySQL container kontrolü
if ! docker ps | grep -q mysql-gokceozel; then
    echo "MySQL container başlatılıyor..."
    docker start mysql-gokceozel
    sleep 3
fi

echo "=========================================="
echo "Web Sunucusu Başlatılıyor"
echo "=========================================="
echo ""
echo "URL: http://localhost:8000"
echo "Admin: http://localhost:8000/yonetim/giris.php"
echo ""
echo "Durdurmak için: Ctrl+C"
echo "=========================================="
echo ""

php -S localhost:8000

