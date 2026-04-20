# Yerel Veritabanı Bilgileri

## ✅ Kurulum Tamamlandı

Veritabanı başarıyla yerel ortamda çalıştırılıyor.

## 🔌 Bağlantı Bilgileri

- **Host:** localhost
- **Port:** 3306
- **Database:** gokceozel_local
- **User:** root
- **Password:** root

## 🐳 Docker Container

**Container Adı:** mysql-gokceozel

### Container Yönetimi

```bash
# Container'ı başlat
docker start mysql-gokceozel

# Container'ı durdur
docker stop mysql-gokceozel

# Container'ı sil (veritabanı da silinir!)
docker rm -f mysql-gokceozel

# Container loglarını görüntüle
docker logs mysql-gokceozel

# Container durumunu kontrol et
docker ps -a | grep mysql-gokceozel
```

## 🔗 Bağlantı Testi

### Docker üzerinden

```bash
docker exec -it mysql-gokceozel mysql -uroot -proot gokceozel_local
```

### Yerel MySQL client ile

```bash
mysql -h 127.0.0.1 -P 3306 -u root -proot gokceozel_local
```

### Python ile

```python
import pymysql

connection = pymysql.connect(
    host='localhost',
    port=3306,
    user='root',
    password='root',
    database='gokceozel_local',
    charset='utf8mb3'
)

cursor = connection.cursor()
cursor.execute("SHOW TABLES")
tables = cursor.fetchall()
print(tables)
```

### PHP ile

```php
<?php
$host = 'localhost';
$port = 3306;
$dbname = 'gokceozel_local';
$username = 'root';
$password = 'root';

try {
    $pdo = new PDO(
        "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb3",
        $username,
        $password
    );
    echo "Bağlantı başarılı!";
} catch (PDOException $e) {
    echo "Bağlantı hatası: " . $e->getMessage();
}
?>
```

## 📊 Veritabanı İstatistikleri

- **Toplam Tablo:** 15 tablo
- **icerik_belge kayıtları:** 132 kayıt

## 📝 Notlar

1. **Güvenlik:** Bu yerel veritabanı sadece geliştirme amaçlıdır. Production'da kullanmayın!
2. **Şifre:** Root şifresi "root" olarak ayarlanmıştır (sadece yerel kullanım için)
3. **Port:** 3306 portu kullanılıyor. Eğer başka bir MySQL servisi çalışıyorsa çakışma olabilir
4. **Veri:** Veritabanı Docker container içinde saklanıyor. Container silinirse veriler de silinir!

## 🔄 Veritabanını Yeniden Oluşturma

Eğer veritabanını sıfırdan oluşturmak isterseniz:

```bash
# Container'ı durdur ve sil
docker stop mysql-gokceozel
docker rm mysql-gokceozel

# Kurulum scriptini tekrar çalıştır
python3 setup_local_database.py
```

## 📁 İlgili Dosyalar

- `setup_local_database.py` - Otomatik kurulum scripti
- `database_backup/database_backup_fixed.sql` - Düzeltilmiş SQL yedeği
- `database_backup/database_backup_2025-12-02_00-23-15.sql` - Orijinal SQL yedeği

