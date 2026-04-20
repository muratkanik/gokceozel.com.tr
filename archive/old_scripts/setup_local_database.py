#!/usr/bin/env python3
"""
Yerel veritabanı kurulum scripti
MySQL/MariaDB kurulu değilse Docker kullanır
"""
import subprocess
import sys
import time
import os
from pathlib import Path

# Veritabanı bilgileri
DB_NAME = "gokceozel_local"
DB_USER = "root"
DB_PASS = "root"
DB_PORT = 3306
CONTAINER_NAME = "mysql-gokceozel"
SQL_FILE = Path(__file__).parent / "database_backup/database_backup_2025-12-02_00-23-15.sql"
SQL_FILE_FIXED = Path(__file__).parent / "database_backup/database_backup_fixed.sql"

def check_command(cmd):
    """Komutun varlığını kontrol et"""
    try:
        subprocess.run(["which", cmd], capture_output=True, check=True)
        return True
    except:
        return False

def run_command(cmd, check=True):
    """Komut çalıştır"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, check=check)
        return result.returncode == 0, result.stdout, result.stderr
    except subprocess.CalledProcessError as e:
        return False, e.stdout, e.stderr

def setup_with_mysql():
    """Yerel MySQL ile kurulum"""
    print("Yerel MySQL kullanılıyor...")
    
    # Veritabanını oluştur
    cmd = f"mysql -u {DB_USER} -e 'CREATE DATABASE IF NOT EXISTS {DB_NAME} CHARACTER SET utf8mb3 COLLATE utf8mb3_turkish_ci;'"
    success, stdout, stderr = run_command(cmd, check=False)
    
    if not success:
        print(f"✗ Veritabanı oluşturulamadı: {stderr}")
        return False
    
    print("✓ Veritabanı oluşturuldu")
    
    # SQL import
    print("SQL dosyası import ediliyor...")
    import_file = SQL_FILE_FIXED if SQL_FILE_FIXED.exists() else SQL_FILE
    cmd = f"mysql -u {DB_USER} {DB_NAME} < {import_file}"
    success, stdout, stderr = run_command(cmd, check=False)
    
    if success:
        print("✓ SQL dosyası import edildi")
        return True
    else:
        print(f"✗ SQL import hatası: {stderr}")
        return False

def setup_with_docker():
    """Docker ile kurulum"""
    print("Docker ile kurulum yapılıyor...")
    
    # Eski container'ı temizle
    print("Eski container kontrol ediliyor...")
    run_command(f"docker stop {CONTAINER_NAME}", check=False)
    run_command(f"docker rm {CONTAINER_NAME}", check=False)
    
    # Container'ı başlat
    print("MySQL container başlatılıyor...")
    cmd = f"""docker run --name {CONTAINER_NAME} \
        -e MYSQL_ROOT_PASSWORD={DB_PASS} \
        -e MYSQL_DATABASE={DB_NAME} \
        -p {DB_PORT}:3306 \
        -d mysql:8.0 \
        --character-set-server=utf8mb4 \
        --collation-server=utf8mb4_unicode_ci \
        --sql-mode="NO_AUTO_VALUE_ON_ZERO,ALLOW_INVALID_DATES" """
    
    success, stdout, stderr = run_command(cmd, check=False)
    
    if not success:
        print(f"✗ Container başlatılamadı: {stderr}")
        return False
    
    print("✓ Container başlatıldı")
    print("  MySQL'in hazır olması bekleniyor (30 saniye)...")
    time.sleep(30)
    
    # Veritabanını oluştur
    cmd = f'docker exec -i {CONTAINER_NAME} mysql -u{DB_USER} -p{DB_PASS} -e "CREATE DATABASE IF NOT EXISTS {DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"'
    run_command(cmd, check=False)
    
    # SQL import
    print("SQL dosyası import ediliyor...")
    # En yeni backup dosyasını kullan
    backup_files = sorted(SQL_FILE.parent.glob("database_backup_*.sql"), reverse=True)
    import_file = backup_files[0] if backup_files else (SQL_FILE_FIXED if SQL_FILE_FIXED.exists() else SQL_FILE)
    print(f"  Kullanılan dosya: {import_file.name}")
    
    with open(import_file, 'rb') as f:
        sql_content = f.read()
    
    # UTF-8 encoding ile import et
    cmd = f'docker exec -i {CONTAINER_NAME} mysql -u{DB_USER} -p{DB_PASS} --default-character-set=utf8mb4 {DB_NAME}'
    process = subprocess.Popen(cmd, shell=True, stdin=subprocess.PIPE, 
                              stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate(input=sql_content)
    
    if process.returncode == 0:
        print("✓ SQL dosyası import edildi")
        return True
    else:
        print(f"✗ SQL import hatası: {stderr}")
        return False

def main():
    print("=" * 60)
    print("Yerel Veritabanı Kurulumu")
    print("=" * 60)
    print()
    
    # SQL dosyası kontrolü ve düzeltme
    if not SQL_FILE.exists():
        print(f"✗ SQL dosyası bulunamadı: {SQL_FILE}")
        return 1
    
    print(f"✓ SQL dosyası bulundu: {SQL_FILE}")
    
    # Düzeltilmiş dosya varsa onu kullan
    import_file = SQL_FILE_FIXED if SQL_FILE_FIXED.exists() else SQL_FILE
    if SQL_FILE_FIXED.exists():
        print(f"✓ Düzeltilmiş SQL dosyası kullanılıyor: {SQL_FILE_FIXED}")
    print()
    
    # MySQL/MariaDB kontrolü
    if check_command("mysql") or check_command("mariadb"):
        success = setup_with_mysql()
    elif check_command("docker"):
        success = setup_with_docker()
    else:
        print("✗ MySQL/MariaDB veya Docker bulunamadı")
        print()
        print("Kurulum seçenekleri:")
        print("  1. MySQL: brew install mysql")
        print("  2. Docker: https://www.docker.com/products/docker-desktop")
        return 1
    
    if success:
        print()
        print("=" * 60)
        print("✓ VERİTABANI BAŞARIYLA KURULDU!")
        print("=" * 60)
        print()
        print("Bağlantı Bilgileri:")
        print(f"  Host: localhost")
        print(f"  Port: {DB_PORT}")
        print(f"  Database: {DB_NAME}")
        print(f"  User: {DB_USER}")
        print(f"  Password: {DB_PASS}")
        print()
        
        if CONTAINER_NAME:
            print("Docker Container Yönetimi:")
            print(f"  Başlat: docker start {CONTAINER_NAME}")
            print(f"  Durdur: docker stop {CONTAINER_NAME}")
            print(f"  Sil: docker rm -f {CONTAINER_NAME}")
            print(f"  Loglar: docker logs {CONTAINER_NAME}")
            print()
        
        print("Bağlantı Testi:")
        if check_command("mysql"):
            print(f"  mysql -u {DB_USER} -p{DB_PASS} {DB_NAME}")
        elif CONTAINER_NAME:
            print(f"  docker exec -it {CONTAINER_NAME} mysql -u{DB_USER} -p{DB_PASS} {DB_NAME}")
        
        return 0
    else:
        return 1

if __name__ == "__main__":
    sys.exit(main())

