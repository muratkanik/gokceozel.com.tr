#!/usr/bin/env python3
"""
FTP ile site dosyalarını indirme scripti
"""
import ftplib
import os
from pathlib import Path

# FTP bilgileri
FTP_HOST = "ftp.eyalcin.com"
FTP_USER = "eyalcin_seo"
FTP_PASS = "Gokce135246"

# İndirme dizini
DOWNLOAD_DIR = Path(__file__).parent / "site_backup"
DOWNLOAD_DIR.mkdir(exist_ok=True)

def download_directory(ftp, remote_dir, local_dir):
    """FTP'den dizin ve dosyaları indirir"""
    try:
        # Dizine geç
        ftp.cwd(remote_dir)
        
        # Dizini oluştur
        local_path = local_dir / remote_dir.lstrip('/')
        local_path.mkdir(parents=True, exist_ok=True)
        
        # Dosya ve dizinleri listele
        items = []
        ftp.retrlines('LIST', items.append)
        
        for item in items:
            parts = item.split()
            if len(parts) < 9:
                continue
                
            name = ' '.join(parts[8:])
            
            # . ve .. dizinlerini atla
            if name in ['.', '..']:
                continue
            
            # Dizin mi dosya mı kontrol et
            if item.startswith('d'):
                # Dizin - recursive olarak indir
                download_directory(ftp, name, local_dir)
                ftp.cwd('..')
            else:
                # Dosya - indir
                local_file = local_path / name
                print(f"İndiriliyor: {remote_dir}/{name} -> {local_file}")
                try:
                    with open(local_file, 'wb') as f:
                        ftp.retrbinary(f'RETR {name}', f.write)
                except Exception as e:
                    print(f"Hata ({name}): {e}")
                    
    except Exception as e:
        print(f"Dizin indirme hatası ({remote_dir}): {e}")

def main():
    """Ana fonksiyon"""
    print("FTP bağlantısı kuruluyor...")
    try:
        # FTP bağlantısı
        ftp = ftplib.FTP(FTP_HOST)
        ftp.login(FTP_USER, FTP_PASS)
        ftp.encoding = 'utf-8'
        
        print("Bağlantı başarılı!")
        print(f"Sunucu: {ftp.getwelcome()}")
        
        # Ana dizine geç
        ftp.cwd('/')
        
        # Tüm dosyaları indir
        print("\nDosyalar indiriliyor...")
        download_directory(ftp, '/', DOWNLOAD_DIR)
        
        ftp.quit()
        print(f"\nİndirme tamamlandı! Dosyalar: {DOWNLOAD_DIR}")
        
    except Exception as e:
        print(f"FTP bağlantı hatası: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())

