#!/bin/bash
# Docker ile yerel web sunucusu başlatma scripti

echo "=========================================="
echo "Docker ile Yerel Web Sunucusu"
echo "=========================================="

# Docker kontrolü
if ! command -v docker &> /dev/null; then
    echo "✗ Docker bulunamadı"
    exit 1
fi

# MySQL container kontrolü
if ! docker ps | grep -q mysql-gokceozel; then
    echo "⚠ MySQL container çalışmıyor, başlatılıyor..."
    docker start mysql-gokceozel
    sleep 5
fi

# PHP container'ı başlat
CONTAINER_NAME="php-gokceozel"
PORT=8000

# Eski container'ı temizle
docker stop $CONTAINER_NAME 2>/dev/null
docker rm $CONTAINER_NAME 2>/dev/null

echo ""
echo "PHP container başlatılıyor..."
docker run -d \
    --name $CONTAINER_NAME \
    --network host \
    -v "$(pwd)/site_backup/public_html:/var/www/html" \
    -v "$(pwd)/site_backup/yonetim:/var/www/html/yonetim" \
    -v "$(pwd)/site_backup/baglanti:/var/www/html/yonetim/baglanti" \
    php:8.1-apache

if [ $? -eq 0 ]; then
    echo "✓ PHP container başlatıldı"
    echo ""
    echo "Web sitesi: http://localhost:$PORT"
    echo ""
    echo "Container yönetimi:"
    echo "  Durdur: docker stop $CONTAINER_NAME"
    echo "  Başlat: docker start $CONTAINER_NAME"
    echo "  Loglar: docker logs $CONTAINER_NAME"
else
    echo "✗ Container başlatılamadı"
    exit 1
fi

