#!/bin/bash
# Docker ile yerel veritabanı kurulum scripti

echo "=========================================="
echo "Docker ile Yerel Veritabanı Kurulumu"
echo "=========================================="

# Docker kontrolü
if ! command -v docker &> /dev/null; then
    echo "✗ Docker bulunamadı"
    echo "Docker'ı kurmak için: https://www.docker.com/products/docker-desktop"
    exit 1
fi

echo "✓ Docker bulundu"

# Veritabanı bilgileri
CONTAINER_NAME="mysql-gokceozel"
DB_NAME="gokceozel_local"
DB_USER="root"
DB_PASS="root"
DB_PORT="3306"
SQL_FILE="database_backup/database_backup_2025-12-02_00-23-15.sql"

# Eski container'ı durdur ve sil
echo ""
echo "Eski container kontrol ediliyor..."
docker stop $CONTAINER_NAME 2>/dev/null
docker rm $CONTAINER_NAME 2>/dev/null

# MySQL container'ı başlat
echo ""
echo "MySQL container başlatılıyor..."
docker run --name $CONTAINER_NAME \
    -e MYSQL_ROOT_PASSWORD=$DB_PASS \
    -e MYSQL_DATABASE=$DB_NAME \
    -p $DB_PORT:3306 \
    -d mysql:8.0 \
    --character-set-server=utf8mb3 \
    --collation-server=utf8mb3_turkish_ci

if [ $? -ne 0 ]; then
    echo "✗ Container başlatılamadı"
    exit 1
fi

echo "✓ Container başlatıldı"
echo "  Container adı: $CONTAINER_NAME"
echo "  Port: $DB_PORT"

# MySQL'in hazır olmasını bekle
echo ""
echo "MySQL'in hazır olması bekleniyor (30 saniye)..."
sleep 30

# Veritabanını oluştur (zaten oluşturulmuş olabilir)
echo ""
echo "Veritabanı kontrol ediliyor..."
docker exec -i $CONTAINER_NAME mysql -u$DB_USER -p$DB_PASS -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb3 COLLATE utf8mb3_turkish_ci;" 2>/dev/null

# SQL dosyasını import et
echo ""
echo "SQL dosyası import ediliyor..."
echo "Bu işlem biraz zaman alabilir..."

docker exec -i $CONTAINER_NAME mysql -u$DB_USER -p$DB_PASS $DB_NAME < $SQL_FILE

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✓ VERİTABANI BAŞARIYLA KURULDU!"
    echo "=========================================="
    echo ""
    echo "Bağlantı Bilgileri:"
    echo "  Host: localhost"
    echo "  Port: $DB_PORT"
    echo "  Database: $DB_NAME"
    echo "  User: $DB_USER"
    echo "  Password: $DB_PASS"
    echo ""
    echo "Container Yönetimi:"
    echo "  Başlat: docker start $CONTAINER_NAME"
    echo "  Durdur: docker stop $CONTAINER_NAME"
    echo "  Sil: docker rm -f $CONTAINER_NAME"
    echo "  Loglar: docker logs $CONTAINER_NAME"
    echo ""
    echo "Bağlantı testi:"
    echo "  docker exec -it $CONTAINER_NAME mysql -u$DB_USER -p$DB_PASS $DB_NAME"
else
    echo "✗ SQL import hatası"
    echo "Container loglarını kontrol edin: docker logs $CONTAINER_NAME"
    exit 1
fi

