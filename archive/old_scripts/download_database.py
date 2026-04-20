#!/usr/bin/env python3
"""
Veritabanını uzak sunucudan yedekleme scripti
PHP scriptini FTP ile yükleyip çalıştırır, sonra yedeği indirir
"""
import ftplib
import os
import time
from pathlib import Path

# FTP bilgileri
FTP_HOST = "ftp.eyalcin.com"
FTP_USER = "eyalcin_seo"
FTP_PASS = "Gokce135246"

# Veritabanı bilgileri
DB_HOST = "localhost"
DB_USER = "eyalcin_gokceozel"
DB_PASS = "Gokce.135246"
DB_NAME = "eyalcin_gokceozel"

# Yerel dizin
LOCAL_DIR = Path(__file__).parent / "database_backup"
LOCAL_DIR.mkdir(exist_ok=True)

def upload_php_script(ftp):
    """PHP yedekleme scriptini FTP'ye yükler"""
    print("PHP scripti yükleniyor...")
    try:
        with open("backup_database.php", "rb") as f:
            ftp.storbinary("STOR backup_database.php", f)
        print("✓ PHP scripti yüklendi")
        return True
    except Exception as e:
        print(f"✗ PHP script yükleme hatası: {e}")
        return False

def download_backup(ftp):
    """Oluşturulan yedek dosyasını indirir"""
    print("\nYedek dosyası aranıyor...")
    try:
        files = []
        ftp.retrlines('LIST', files.append)
        
        backup_files = [f for f in files if 'database_backup_' in f and '.sql' in f]
        
        if not backup_files:
            print("Yedek dosyası bulunamadı!")
            return None
        
        # En yeni dosyayı bul
        backup_files.sort(reverse=True)
        latest_file = backup_files[0].split()[-1]
        
        print(f"İndiriliyor: {latest_file}")
        local_file = LOCAL_DIR / latest_file
        
        with open(local_file, 'wb') as f:
            ftp.retrbinary(f'RETR {latest_file}', f.write)
        
        print(f"✓ Yedek indirildi: {local_file}")
        return local_file
        
    except Exception as e:
        print(f"✗ Yedek indirme hatası: {e}")
        return None

def cleanup(ftp):
    """Geçici dosyaları temizle"""
    try:
        ftp.delete("backup_database.php")
        print("✓ Geçici dosyalar temizlendi")
    except:
        pass

def main():
    """Ana fonksiyon"""
    print("FTP bağlantısı kuruluyor...")
    try:
        ftp = ftplib.FTP(FTP_HOST)
        ftp.login(FTP_USER, FTP_PASS)
        ftp.encoding = 'utf-8'
        print("✓ FTP bağlantısı başarılı\n")
        
        # PHP scriptini yükle
        if not upload_php_script(ftp):
            return 1
        
        # Scripti çalıştırmak için web sunucusuna istek gönder
        print("\nPHP scripti çalıştırılıyor...")
        print("Not: PHP scriptini manuel olarak çalıştırmanız gerekebilir:")
        print(f"   https://gokceozel.com.tr/backup_database.php")
        print("\n5 saniye bekleniyor...")
        time.sleep(5)
        
        # Yedeği indir
        backup_file = download_backup(ftp)
        
        if backup_file:
            print(f"\n✓ Veritabanı yedeği başarıyla oluşturuldu!")
            print(f"  Konum: {backup_file}")
            print(f"  Boyut: {backup_file.stat().st_size / 1024:.2f} KB")
        else:
            print("\n⚠ Yedek dosyası bulunamadı.")
            print("   Lütfen https://gokceozel.com.tr/backup_database.php adresini ziyaret edin")
        
        # Temizlik
        cleanup(ftp)
        ftp.quit()
        
        return 0
        
    except Exception as e:
        print(f"✗ Hata: {e}")
        return 1

if __name__ == "__main__":
    exit(main())

