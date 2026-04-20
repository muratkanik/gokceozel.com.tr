# İçerik Belge Tablosu Özeti

## 📋 Tablo Yapısı

**Tablo Adı:** `icerik_belge`  
**Motor:** InnoDB  
**Karakter Seti:** utf8mb3  
**Collation:** utf8mb3_turkish_ci  
**Auto Increment:** 159 (158 kayıt mevcut)

### Sütunlar

| Sütun | Tip | Açıklama |
|-------|-----|----------|
| `id` | int(11) | Primary Key, Otomatik artan |
| `kayit_id` | varchar(150) | İçerik kaydına bağlantı (eskayit) |
| `belge_turu` | int(11) | Belge türü ID (belge_turleri tablosuna referans) |
| `belge_adi` | varchar(999) | Orijinal dosya adı |
| `belge` | varchar(999) | Sunucuda saklanan dosya adı |
| `aciklama` | varchar(999) | Belge açıklaması (çoğunlukla boş) |
| `kayit_yapan_kullanici` | int(11) | Kullanıcı ID (kullanicilar tablosuna referans) |
| `kayit_tarihi` | datetime | Kayıt oluşturulma tarihi |
| `durum` | int(11) | Durum kodu (1: Aktif, -1: Silinmiş) |

## 🎯 Kullanım Amacı

Bu tablo, web sitesindeki içerik kayıtlarına (icerik tablosu) bağlı belge/dosya eklerini saklamak için kullanılıyor.

## 📊 Veri Analizi

### Toplam Kayıt Sayısı
- **Toplam:** 132 kayıt
- **Aktif (durum=1):** 78 kayıt (%59)
- **Silinmiş (durum=-1):** 54 kayıt (%41)

### Dosya Türleri
- **Resim dosyaları:** JPG, JPEG, PNG, GIF
- **Doküman dosyaları:** PDF, DOC, DOCX (kodda destekleniyor ama verilerde görünmüyor)
- **Arşiv dosyaları:** ZIP, RAR (kodda destekleniyor)

### Kullanıcı Dağılımı
- **Kullanıcı ID 1:** İlk kayıtlar (2022-03-20)
- **Kullanıcı ID 7:** Çoğu kayıt (2022-04-07'den itibaren)

### Tarih Aralığı
- **İlk kayıt:** 2022-03-20
- **Son kayıt:** 2023-12-21
- **En aktif dönem:** 2022-04-07 - 2022-06-03

## 🔗 İlişkiler

### Foreign Key İlişkileri
1. **icerik tablosu** → `kayit_id` = `icerik.eskayit`
2. **belge_turleri tablosu** → `belge_turu` = `belge_turleri.id`
3. **kullanicilar tablosu** → `kayit_yapan_kullanici` = `kullanicilar.id`

## 💻 Kod Kullanımı

### Yönetim Paneli

#### 1. Belge Ekleme (`icerik_belge_ekle.php`)
- İçerik kaydına belge ekleme formu
- Dosya yükleme işlemi
- Desteklenen formatlar: jpeg, jpg, png, gif, zip, rar, doc, docx, xls, xlsx, pdf
- Dosyalar `dosya/` klasörüne kaydediliyor
- Dosya adları benzersiz hale getiriliyor (timestamp + rastgele string)

#### 2. Belge Görüntüleme (`icerik_belge_goster.php`)
- Belge listesi görüntüleme
- Belge silme işlemi
- Belge görüntüleme (lightbox)
- E-posta ile belge gönderme özelliği

#### 3. İçerik Raporu (`icerik_rapor.php`)
- İçerik listesinde belge varlığı kontrolü
- "Döküman Ekle" ve "Döküman İncele" butonları

### Frontend (Public)

#### Kullanıldığı Sayfalar
1. **index.php** - Ana sayfa içerik görselleri
2. **kurumsal.php** - Kurumsal sayfa görselleri
3. **hizmetler.php** - Hizmetler listesi görselleri
4. **hizmetdetay.php** - Hizmet detay görselleri
5. **fotogaleri.php** - Foto galeri görselleri
6. **blog.php** - Blog listesi görselleri
7. **blogdetay.php** - Blog detay görselleri

#### SQL Sorguları
```sql
-- En son belgeyi getir
SELECT belge FROM icerik_belge 
WHERE kayit_id = ? AND durum = '1' 
ORDER BY id DESC LIMIT 1

-- İlk belgeyi getir (ROW_NUMBER ile)
SELECT belge, ROW_NUMBER() OVER(ORDER BY belge) AS sira 
FROM icerik_belge 
WHERE kayit_id = ? AND durum = '1' 
LIMIT 0,1
```

## 📁 Dosya Yapısı

### Dosya Konumu
- **Yükleme:** `yonetim/dosya/` klasörü
- **Görüntüleme:** `yonetim/dosya/{dosya_adi}`

### Dosya Adlandırma
Dosyalar benzersiz isimlerle kaydediliyor:
```
{timestamp}{rastgele_string}eyalcin{hash}.{uzanti}
```

Örnek: `baec582720927d134a7220220320eyalcin087709d435089bf095b3.jpeg`

## 🔍 Önemli Özellikler

1. **Soft Delete:** Kayıtlar silinmiyor, sadece `durum = -1` yapılıyor
2. **Çoklu Belge:** Bir içerik kaydına birden fazla belge eklenebiliyor
3. **Belge Türü:** Belge türleri `belge_turleri` tablosundan yönetiliyor
4. **Kullanıcı Takibi:** Her belge hangi kullanıcı tarafından eklendiği kaydediliyor
5. **Tarih Takibi:** Kayıt tarihi otomatik olarak kaydediliyor

## ⚠️ Dikkat Edilmesi Gerekenler

1. **Dosya Boyutu:** Kodda maksimum dosya boyutu kontrolü yok
2. **Güvenlik:** Yüklenen dosyaların tip kontrolü var ama yeterli değil
3. **PHP Dosyası:** Kodda PHP dosyası yüklenmesine izin veriliyor (güvenlik riski!)
4. **Dosya Yolu:** Dosya yolları hardcoded (`dosya/` klasörü)

## 📈 İstatistikler

- **Toplam kayıt:** 132
- **Aktif kayıt:** 78 (%59)
- **Silinmiş kayıt:** 54 (%41)
- **Ortalama kayıt sayısı/ay:** ~7-8 kayıt
- **En çok kullanılan format:** JPG/JPEG
- **En aktif kullanıcı:** Kullanıcı ID 7
- **Silinme oranı:** %41

## 🔧 Öneriler

1. PHP dosyası yüklemeye izin verilmemeli
2. Dosya boyutu limiti eklenmeli
3. Dosya tipi kontrolü güçlendirilmeli
4. Dosya yolu yapılandırma dosyasından okunmalı
5. Dosya silme işlemi fiziksel olarak da yapılmalı (sadece DB'den silmek yeterli değil)

