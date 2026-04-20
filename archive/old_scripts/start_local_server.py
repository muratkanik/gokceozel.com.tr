#!/usr/bin/env python3
"""
Yerel web sunucusu başlatma scripti
PHP built-in server veya Docker kullanır
"""
import subprocess
import sys
import time
import os
import signal
from pathlib import Path

PORT = 8000
PUBLIC_DIR = Path(__file__).parent / "site_backup/public_html"

def check_command(cmd):
    """Komutun varlığını kontrol et"""
    try:
        subprocess.run(["which", cmd], capture_output=True, check=True)
        return True
    except:
        return False

def check_docker_container(name):
    """Docker container'ın çalışıp çalışmadığını kontrol et"""
    try:
        result = subprocess.run(
            ["docker", "ps"],
            capture_output=True,
            text=True,
            check=True
        )
        return name in result.stdout
    except:
        return False

def start_mysql_container():
    """MySQL container'ı başlat"""
    if not check_docker_container("mysql-gokceozel"):
        print("⚠ MySQL container çalışmıyor, başlatılıyor...")
        subprocess.run(["docker", "start", "mysql-gokceozel"], check=False)
        time.sleep(5)
        print("✓ MySQL container başlatıldı")

def start_php_server():
    """PHP built-in server başlat"""
    if not PUBLIC_DIR.exists():
        print(f"✗ Dizin bulunamadı: {PUBLIC_DIR}")
        return False
    
    print(f"✓ Dizin bulundu: {PUBLIC_DIR}")
    
    # Port kontrolü
    import socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('localhost', PORT))
    sock.close()
    
    if result == 0:
        print(f"⚠ Port {PORT} kullanımda, alternatif port deneniyor...")
        global PORT
        PORT = 8001
    
    print(f"\nWeb sunucusu başlatılıyor...")
    print(f"  URL: http://localhost:{PORT}")
    print(f"  Dizin: {PUBLIC_DIR}")
    print(f"\nDurdurmak için: Ctrl+C\n")
    
    # PHP server başlat
    os.chdir(PUBLIC_DIR)
    try:
        subprocess.run(
            ["php", "-S", f"localhost:{PORT}"],
            check=True
        )
    except KeyboardInterrupt:
        print("\n\nSunucu durduruldu.")
        return True
    except Exception as e:
        print(f"\n✗ Hata: {e}")
        return False

def main():
    print("=" * 60)
    print("Yerel Web Sunucusu")
    print("=" * 60)
    print()
    
    # MySQL container kontrolü
    if check_command("docker"):
        start_mysql_container()
    else:
        print("⚠ Docker bulunamadı, MySQL container kontrolü yapılamadı")
    
    print()
    
    # PHP kontrolü
    if check_command("php"):
        php_version = subprocess.run(
            ["php", "-v"],
            capture_output=True,
            text=True
        ).stdout.split('\n')[0]
        print(f"✓ PHP bulundu: {php_version}")
        print()
        return start_php_server()
    else:
        print("✗ PHP bulunamadı")
        print()
        print("Kurulum seçenekleri:")
        print("  1. PHP: brew install php")
        print("  2. Docker: start_local_server_docker.sh scriptini kullanın")
        return 1

if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\n\nSunucu durduruldu.")
        sys.exit(0)

