#!/usr/bin/env python3
"""
Veritabanını PyMySQL ile yedekleme scripti
"""
import pymysql
from pathlib import Path
from datetime import datetime
import sys

# Veritabanı bilgileri
DB_CONFIG = {
    'host': 'ftp.eyalcin.com',  # Farklı host'lar denenecek
    'user': 'eyalcin_gokceozel',
    'password': 'Gokce.135246',
    'database': 'eyalcin_gokceozel',
    'charset': 'utf8mb4'
}

# Yedek dizini
BACKUP_DIR = Path(__file__).parent / "database_backup"
BACKUP_DIR.mkdir(exist_ok=True)

def escape_value(value):
    """SQL değerlerini escape eder"""
    if value is None:
        return 'NULL'
    elif isinstance(value, (int, float)):
        return str(value)
    elif isinstance(value, bool):
        return '1' if value else '0'
    else:
        # String değerleri escape et
        value = str(value)
        value = value.replace('\\', '\\\\')
        value = value.replace("'", "\\'")
        value = value.replace('\n', '\\n')
        value = value.replace('\r', '\\r')
        return f"'{value}'"

def backup_database():
    """Veritabanını yedekler"""
    backup_file = BACKUP_DIR / f"database_backup_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.sql"
    
    print("MySQL bağlantısı kuruluyor...")
    
    # Farklı host'ları dene
    hosts_to_try = [
        'ftp.eyalcin.com',
        'eyalcin.com',
        'gokceozel.com.tr',
        'mysql.eyalcin.com',
        'db.eyalcin.com'
    ]
    
    connection = None
    for host in hosts_to_try:
        try:
            print(f"  {host} deneniyor...")
            config = DB_CONFIG.copy()
            config['host'] = host
            connection = pymysql.connect(**config)
            print(f"✓ Bağlantı başarılı: {host}\n")
            break
        except Exception as e:
            print(f"  ✗ {host}: {str(e)[:50]}")
            continue
    
    if not connection:
        print("\n⚠ Doğrudan MySQL bağlantısı kurulamadı!")
        print("\nAlternatif yöntem:")
        print("  PHP scriptini kullanarak yedek alın:")
        print("  1. backup_database.php dosyasını FTP ile yükleyin")
        print("  2. https://gokceozel.com.tr/backup_database.php adresini ziyaret edin")
        print("  3. Oluşan .sql dosyasını FTP ile indirin")
        return 1
    
    try:
        with connection.cursor() as cursor:
            # Tüm tabloları al
            cursor.execute("SHOW TABLES")
            tables = [table[0] for table in cursor.fetchall()]
            print(f"Toplam {len(tables)} tablo bulundu.\n")
            
            # Yedek dosyasını oluştur
            with open(backup_file, 'w', encoding='utf-8') as f:
                # Başlık
                f.write(f"-- Veritabanı Yedeği\n")
                f.write(f"-- Oluşturulma Tarihi: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write(f"-- Veritabanı: {DB_CONFIG['database']}\n")
                f.write(f"-- Host: {connection.host}\n\n")
                f.write("SET FOREIGN_KEY_CHECKS=0;\n")
                f.write("SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO';\n")
                f.write("SET AUTOCOMMIT=0;\n")
                f.write("START TRANSACTION;\n\n")
                
                for i, table in enumerate(tables, 1):
                    print(f"[{i}/{len(tables)}] Yedekleniyor: {table}")
                    
                    # Tablo yapısı
                    cursor.execute(f"SHOW CREATE TABLE `{table}`")
                    create_result = cursor.fetchone()
                    if create_result:
                        f.write(f"\n-- Tablo yapısı: {table}\n")
                        f.write(f"DROP TABLE IF EXISTS `{table}`;\n")
                        f.write(f"{create_result[1]};\n\n")
                    
                    # Tablo verileri
                    cursor.execute(f"SELECT * FROM `{table}`")
                    rows = cursor.fetchall()
                    
                    if rows:
                        # Sütun isimlerini al
                        cursor.execute(f"DESCRIBE `{table}`")
                        columns = [col[0] for col in cursor.fetchall()]
                        column_names = '`, `'.join(columns)
                        
                        f.write(f"-- Tablo verileri: {table} ({len(rows)} satır)\n")
                        f.write(f"INSERT INTO `{table}` (`{column_names}`) VALUES\n")
                        
                        for j, row in enumerate(rows):
                            values = [escape_value(value) for value in row]
                            f.write(f"({', '.join(values)})")
                            
                            if j < len(rows) - 1:
                                f.write(",\n")
                            else:
                                f.write(";\n\n")
                    else:
                        f.write(f"-- Tablo boş: {table}\n\n")
                
                f.write("COMMIT;\n")
                f.write("SET FOREIGN_KEY_CHECKS=1;\n")
        
        file_size = backup_file.stat().st_size
        print(f"\n✓ Yedekleme tamamlandı!")
        print(f"  Dosya: {backup_file}")
        print(f"  Boyut: {file_size / 1024:.2f} KB")
        
        connection.close()
        return 0
        
    except Exception as e:
        print(f"\n✗ Hata: {e}")
        if connection:
            connection.close()
        return 1

if __name__ == "__main__":
    try:
        import pymysql
    except ImportError:
        print("✗ pymysql yüklü değil!")
        print("  Yüklemek için: pip3 install pymysql")
        sys.exit(1)
    
    exit(backup_database())

