#!/usr/bin/env python3
"""
Veritabanını doğrudan MySQL bağlantısı ile yedekleme scripti
"""
import mysql.connector
from mysql.connector import Error
from pathlib import Path
from datetime import datetime
import sys

# Veritabanı bilgileri
DB_CONFIG = {
    'host': 'ftp.eyalcin.com',  # Veya gerçek MySQL host adresi
    'user': 'eyalcin_gokceozel',
    'password': 'Gokce.135246',
    'database': 'eyalcin_gokceozel',
    'charset': 'utf8mb4',
    'collation': 'utf8mb4_unicode_ci'
}

# Yedek dizini
BACKUP_DIR = Path(__file__).parent / "database_backup"
BACKUP_DIR.mkdir(exist_ok=True)

def get_all_tables(connection):
    """Tüm tabloları listeler"""
    cursor = connection.cursor()
    cursor.execute("SHOW TABLES")
    tables = [table[0] for table in cursor.fetchall()]
    cursor.close()
    return tables

def get_create_table(connection, table_name):
    """Tablo yapısını alır"""
    cursor = connection.cursor()
    cursor.execute(f"SHOW CREATE TABLE `{table_name}`")
    result = cursor.fetchone()
    cursor.close()
    return result[1] if result else None

def get_table_data(connection, table_name):
    """Tablo verilerini alır"""
    cursor = connection.cursor(dictionary=True)
    cursor.execute(f"SELECT * FROM `{table_name}`")
    rows = cursor.fetchall()
    cursor.close()
    return rows

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
    try:
        # Önce farklı host'ları dene
        hosts_to_try = [
            'ftp.eyalcin.com',
            'eyalcin.com',
            'gokceozel.com.tr',
            'localhost'  # Son çare
        ]
        
        connection = None
        for host in hosts_to_try:
            try:
                print(f"  {host} deneniyor...")
                config = DB_CONFIG.copy()
                config['host'] = host
                connection = mysql.connector.connect(**config)
                print(f"✓ Bağlantı başarılı: {host}\n")
                break
            except Error as e:
                print(f"  ✗ {host}: {e}")
                continue
        
        if not connection:
            print("\n✗ Hiçbir host'a bağlanılamadı!")
            print("\nAlternatif: PHP scriptini kullanarak yedek alın:")
            print("  1. backup_database.php dosyasını FTP ile yükleyin")
            print("  2. https://gokceozel.com.tr/backup_database.php adresini ziyaret edin")
            return 1
        
        # Yedek dosyasını oluştur
        with open(backup_file, 'w', encoding='utf-8') as f:
            # Başlık
            f.write(f"-- Veritabanı Yedeği\n")
            f.write(f"-- Oluşturulma Tarihi: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"-- Veritabanı: {DB_CONFIG['database']}\n")
            f.write(f"-- Host: {connection.server_host}\n\n")
            f.write("SET FOREIGN_KEY_CHECKS=0;\n")
            f.write("SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO';\n")
            f.write("SET AUTOCOMMIT=0;\n")
            f.write("START TRANSACTION;\n\n")
            
            # Tüm tabloları al
            tables = get_all_tables(connection)
            print(f"Toplam {len(tables)} tablo bulundu.\n")
            
            for i, table in enumerate(tables, 1):
                print(f"[{i}/{len(tables)}] Yedekleniyor: {table}")
                
                # Tablo yapısı
                create_table = get_create_table(connection, table)
                if create_table:
                    f.write(f"\n-- Tablo yapısı: {table}\n")
                    f.write(f"DROP TABLE IF EXISTS `{table}`;\n")
                    f.write(f"{create_table};\n\n")
                
                # Tablo verileri
                rows = get_table_data(connection, table)
                if rows:
                    f.write(f"-- Tablo verileri: {table} ({len(rows)} satır)\n")
                    
                    # İlk satır için sütun isimlerini al
                    columns = list(rows[0].keys())
                    column_names = '`, `'.join(columns)
                    
                    f.write(f"INSERT INTO `{table}` (`{column_names}`) VALUES\n")
                    
                    for j, row in enumerate(rows):
                        values = [escape_value(row[col]) for col in columns]
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
        
    except Error as e:
        print(f"\n✗ MySQL hatası: {e}")
        print("\nAlternatif yöntem:")
        print("  PHP scriptini kullanarak yedek alabilirsiniz:")
        print("  1. backup_database.php dosyasını FTP ile yükleyin")
        print("  2. https://gokceozel.com.tr/backup_database.php adresini ziyaret edin")
        return 1
    except Exception as e:
        print(f"\n✗ Hata: {e}")
        return 1

if __name__ == "__main__":
    # MySQL connector kontrolü
    try:
        import mysql.connector
    except ImportError:
        print("✗ mysql-connector-python yüklü değil!")
        print("  Yüklemek için: pip3 install mysql-connector-python")
        sys.exit(1)
    
    exit(backup_database())

