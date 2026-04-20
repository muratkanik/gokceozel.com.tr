#!/usr/bin/env python3
"""
Veritabanını PHP scripti ile yedekleme
PHP scriptini FTP ile yükler, web üzerinden çalıştırır ve yedeği indirir
"""
import ftplib
import urllib.request
import time
from pathlib import Path

# FTP bilgileri
FTP_HOST = "ftp.eyalcin.com"
FTP_USER = "eyalcin_seo"
FTP_PASS = "Gokce135246"

# Web URL
WEB_URL = "https://gokceozel.com.tr"

# Yerel dizin
BACKUP_DIR = Path(__file__).parent / "database_backup"
BACKUP_DIR.mkdir(exist_ok=True)

def upload_php_script(ftp):
    """PHP yedekleme scriptini FTP'ye yükler"""
    print("PHP scripti yükleniyor...")
    
    # Önce mevcut dizini kontrol et
    current_dir = ftp.pwd()
    print(f"  Mevcut dizin: {current_dir}")
    
    # Kullanıcı dizinine geç
    try:
        ftp.cwd('/home/eyalcin_seo')
        print(f"  Kullanıcı dizinine geçildi: {ftp.pwd()}")
    except:
        pass
    
    # Olası web dizinlerini dene
    web_dirs = ['public_html', 'www', 'htdocs', 'html']
    
    for web_dir in web_dirs:
        try:
            if web_dir != '.':
                try:
                    ftp.cwd(web_dir)
                    print(f"  {web_dir} dizinine geçildi")
                except:
                    continue
            else:
                # Mevcut dizinde kal
                pass
            
            # Dosyayı yükle
            with open("backup_database.php", "rb") as f:
                ftp.storbinary("STOR backup_database.php", f)
            print(f"✓ PHP scripti yüklendi: {ftp.pwd()}/backup_database.php")
            return True
        except Exception as e:
            if web_dir != '.':
                print(f"  ✗ {web_dir}: {str(e)[:50]}")
            continue
    
    print("✗ PHP script yükleme hatası: Hiçbir dizine yazılamadı")
    print("  Lütfen manuel olarak backup_database.php dosyasını web root dizinine yükleyin")
    return False

def run_php_script():
    """PHP scriptini web üzerinden çalıştırır"""
    print("\nPHP scripti çalıştırılıyor...")
    try:
        url = f"{WEB_URL}/backup_database.php"
        print(f"  URL: {url}")
        
        with urllib.request.urlopen(url, timeout=300) as response:
            output = response.read().decode('utf-8')
            print("✓ Script çalıştırıldı")
            print("\nÇıktı:")
            print(output[:500])  # İlk 500 karakter
            if len(output) > 500:
                print("...")
            return True
    except urllib.error.HTTPError as e:
        print(f"✗ HTTP hatası: {e}")
        print(f"  URL'yi manuel olarak ziyaret edin: {WEB_URL}/backup_database.php")
        return False
    except Exception as e:
        print(f"✗ Hata: {e}")
        return False

def download_backup(ftp):
    """Oluşturulan yedek dosyasını indirir"""
    print("\nYedek dosyası aranıyor...")
    try:
        files = []
        ftp.retrlines('LIST', files.append)
        
        # SQL dosyalarını bul
        backup_files = []
        for f in files:
            parts = f.split()
            if len(parts) >= 9:
                filename = ' '.join(parts[8:])
                if 'database_backup_' in filename and filename.endswith('.sql'):
                    backup_files.append((filename, parts))
        
        if not backup_files:
            print("⚠ Yedek dosyası bulunamadı!")
            print("   Lütfen manuel olarak kontrol edin:")
            print(f"   {WEB_URL}/backup_database.php")
            return None
        
        # En yeni dosyayı bul (tarih/saat sıralamasına göre)
        backup_files.sort(key=lambda x: x[0], reverse=True)
        latest_file = backup_files[0][0]
        
        print(f"İndiriliyor: {latest_file}")
        local_file = BACKUP_DIR / latest_file
        
        with open(local_file, 'wb') as f:
            ftp.retrbinary(f'RETR {latest_file}', f.write)
        
        file_size = local_file.stat().st_size
        print(f"✓ Yedek indirildi: {local_file}")
        print(f"  Boyut: {file_size / 1024:.2f} KB")
        
        return local_file
        
    except Exception as e:
        print(f"✗ Yedek indirme hatası: {e}")
        return None

def cleanup(ftp):
    """Geçici dosyaları temizle (opsiyonel)"""
    try:
        # PHP scriptini silmek istemeyebiliriz, yorum satırına aldım
        # ftp.delete("backup_database.php")
        pass
    except:
        pass

def main():
    """Ana fonksiyon"""
    print("=" * 60)
    print("Veritabanı Yedekleme İşlemi")
    print("=" * 60)
    
    print("\nFTP bağlantısı kuruluyor...")
    try:
        ftp = ftplib.FTP(FTP_HOST)
        ftp.login(FTP_USER, FTP_PASS)
        ftp.encoding = 'utf-8'
        print("✓ FTP bağlantısı başarılı\n")
        
        # PHP scriptini yükle
        if not upload_php_script(ftp):
            return 1
        
        # Scripti çalıştır
        print("\n" + "-" * 60)
        if run_php_script():
            # Biraz bekle (dosyanın oluşması için)
            print("\n3 saniye bekleniyor...")
            time.sleep(3)
            
            # Yedeği indir
            backup_file = download_backup(ftp)
            
            if backup_file:
                print("\n" + "=" * 60)
                print("✓ VERİTABANI YEDEĞİ BAŞARIYLA OLUŞTURULDU!")
                print("=" * 60)
                print(f"  Dosya: {backup_file}")
                print(f"  Boyut: {backup_file.stat().st_size / 1024:.2f} KB")
                print(f"  Konum: {backup_file.absolute()}")
        else:
            print("\n⚠ PHP scripti çalıştırılamadı.")
            print("   Lütfen manuel olarak şu adresi ziyaret edin:")
            print(f"   {WEB_URL}/backup_database.php")
            print("\n   Sonra bu scripti tekrar çalıştırarak yedeği indirebilirsiniz.")
        
        # Temizlik
        cleanup(ftp)
        ftp.quit()
        
        return 0
        
    except Exception as e:
        print(f"\n✗ Hata: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    exit(main())

