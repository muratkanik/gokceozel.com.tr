#!/bin/bash
# Yerel veritabanı kurulum scripti

echo "=========================================="
echo "Yerel Veritabanı Kurulumu"
echo "=========================================="

# MySQL/MariaDB kontrolü
if command -v mysql &> /dev/null; then
    echo "✓ MySQL bulundu"
    MYSQL_CMD="mysql"
elif command -v mariadb &> /dev/null; then
    echo "✓ MariaDB bulundu"
    MYSQL_CMD="mariadb"
else
    echo "✗ MySQL/MariaDB bulunamadı"
    echo ""
    echo "Kurulum seçenekleri:"
    echo "1. Homebrew ile: brew install mysql"
    echo "2. Docker ile: docker run --name mysql-local -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=gokceozel -p 3306:3306 -d mysql:8.0"
    exit 1
fi

# Veritabanı bilgileri
DB_NAME="gokceozel_local"
DB_USER="root"
DB_PASS=""
SQL_FILE="database_backup/database_backup_2025-12-02_00-23-15.sql"

echo ""
echo "Veritabanı oluşturuluyor: $DB_NAME"

# Veritabanını oluştur
if [ -z "$DB_PASS" ]; then
    $MYSQL_CMD -u $DB_USER -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb3 COLLATE utf8mb3_turkish_ci;"
else
    $MYSQL_CMD -u $DB_USER -p$DB_PASS -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb3 COLLATE utf8mb3_turkish_ci;"
fi

if [ $? -eq 0 ]; then
    echo "✓ Veritabanı oluşturuldu"
else
    echo "✗ Veritabanı oluşturulamadı"
    exit 1
fi

echo ""
echo "SQL dosyası import ediliyor..."
echo "Bu işlem biraz zaman alabilir..."

# SQL dosyasını import et
if [ -z "$DB_PASS" ]; then
    $MYSQL_CMD -u $DB_USER $DB_NAME < $SQL_FILE
else
    $MYSQL_CMD -u $DB_USER -p$DB_PASS $DB_NAME < $SQL_FILE
fi

if [ $? -eq 0 ]; then
    echo "✓ SQL dosyası başarıyla import edildi"
    echo ""
    echo "Veritabanı hazır!"
    echo "Bağlantı bilgileri:"
    echo "  Host: localhost"
    echo "  Database: $DB_NAME"
    echo "  User: $DB_USER"
    echo "  Port: 3306"
else
    echo "✗ SQL import hatası"
    exit 1
fi

