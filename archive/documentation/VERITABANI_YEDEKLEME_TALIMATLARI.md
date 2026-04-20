# Veritabanı Yedekleme Talimatları

## Bulunan Veritabanı Bilgileri

- **Sunucu**: localhost (uzak sunucuda)
- **Kullanıcı**: eyalcin_gokceozel
- **Şifre**: Gokce.135246
- **Veritabanı**: eyalcin_gokceozel

## Yedekleme Yöntemleri

### Yöntem 1: PHP Scripti ile (Önerilen)

1. `backup_database.php` dosyasını FTP ile sunucuya yükleyin
   - FTP Host: ftp.eyalcin.com
   - Kullanıcı: eyalcin_seo
   - Şifre: Gokce135246
   - Dosyayı web root dizinine (public_html veya www) yükleyin

2. Web tarayıcınızda şu adresi ziyaret edin:
   ```
   https://gokceozel.com.tr/backup_database.php
   ```

3. Script çalıştıktan sonra oluşan `.sql` dosyasını FTP ile indirin

4. İndirilen dosyayı `database_backup/` klasörüne kaydedin

### Yöntem 2: Manuel MySQL Dump

Eğer sunucuya SSH erişiminiz varsa:

```bash
mysqldump -u eyalcin_gokceozel -p'Gokce.135246' eyalcin_gokceozel > database_backup.sql
```

### Yöntem 3: Python Scripti (Doğrudan Bağlantı)

`backup_database_pymysql.py` scriptini çalıştırın. Script farklı host'ları deneyecektir:

```bash
python3 backup_database_pymysql.py
```

**Not**: Bu yöntem için pymysql kütüphanesi gerekli:
```bash
pip3 install --user pymysql
```

## Oluşturulan Dosyalar

- `backup_database.php` - PHP yedekleme scripti
- `backup_database_ftp.py` - Otomatik FTP yükleme ve çalıştırma scripti
- `backup_database_pymysql.py` - Doğrudan MySQL bağlantısı scripti
- `credentials.txt` - Tüm erişim bilgileri

## Güvenlik Uyarısı

⚠️ **ÖNEMLİ**: Yedekleme işlemi tamamlandıktan sonra:
- `backup_database.php` dosyasını sunucudan silin
- Oluşan `.sql` yedek dosyalarını güvenli bir yerde saklayın
- `credentials.txt` dosyasını güvenli tutun

