import pymysql
import sys

# Database configuration
DB_CONFIG = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': 'root',
    'database': 'gokceozel_local',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

# Target Keywords to Audit
KEYWORDS = [
    "Burun estetiği Ankara",
    "Rinoplasti uzmanı",
    "Göz kapağı estetiği",
    "Alt blefaroplasti", # Split from "Alt ve üst blefaroplasti" for better matching
    "Üst blefaroplasti",
    "Botoks Ankara",
    "Dolgu uygulamaları",
    "Dudak dolgusu",
    "Dudak kaldırma estetiği",
    "İp ile yüz askılama",
    "Endolift lazer",
    "Lazerle yüz germe",
    "Mezoterapi uygulamaları",
    "Gamze estetiği",
    "Kepçe kulak ameliyatı",
    "Yüz estetiği Ankara",
    "Cerrahsız yüz gençleştirme",
    "PRP", # Simplified from "PRP ve gençlik aşısı" to catch both
    "Cilt yenileme tedavileri",
    "Yüz şekillendirme",
    "Prof. Dr. Gökçe Özel estetik kliniği"
]

# User-Provided "Diamond" Metadata Set
# Map Keyword (or fuzzy key) -> {Title, Description}
# We will iterate this map to find matches in DB.
METADATA_MAP = [
    {
        "keys": ["Burun Estetiği", "Rinoplasti"],
        "title": "Burun Estetiği Ankara | Prof. Dr. Gökçe Özel",
        "desc": "Yüz oranlarını dengeleyen, doğal ve fonksiyonel burun estetiği. Prof. Dr. Gökçe Özel ile kişiye özel rinoplasti çözümleri."
    },
    {
        "keys": ["Göz Kapağı Estetiği", "Blefaroplasti"],
        "title": "Göz Kapağı Estetiği Ankara | Üst ve Alt Blefaroplasti",
        "desc": "Yorgun bakışları gideren, genç ve canlı bir görünüm sağlayan üst ve alt göz kapağı estetiği."
    },
    {
        "keys": ["Botoks"],
        "title": "Botoks Ankara | Doğal Görünümlü Yüz Gençleştirme",
        "desc": "Mimik çizgilerini azaltan, doğal ifadeyi koruyan botoks uygulamaları Prof. Dr. Gökçe Özel kliniğinde."
    },
    {
        "keys": ["Dolgu Uygulamaları"],
        "title": "Dolgu Uygulamaları Ankara | Yüz Hattı Şekillendirme",
        "desc": "Hacim kaybını gideren ve yüz hatlarını belirginleştiren dolgu uygulamalarıyla anında gençleşin."
    },
    {
        "keys": ["Dudak Kaldırma", "Lip Lift"],
        "title": "Dudak Kaldırma Estetiği | Doğal ve Genç Gülüş",
        "desc": "Dudak oranlarını dengeleyen, yüz estetiğine uyumlu dudak kaldırma işlemiyle zarif bir görünüm."
    },
    {
        "keys": ["Dudak Dolgusu"],
        "title": "Dudak Dolgusu Ankara | Doğal Hacimli Dudaklar",
        "desc": "Dudaklara form, nem ve dolgunluk kazandıran, doğal sonuçlar sunan dudak dolgusu uygulamaları."
    },
    {
        "keys": ["Endolift"],
        "title": "Endolift Lazer Ankara | Cerrahsız Yüz Germe",
        "desc": "Lazer teknolojisiyle cilt altı dokuda sıkılaşma ve toparlanma sağlayan Endolift uygulaması."
    },
    {
        "keys": ["Mezoterapi"],
        "title": "Mezoterapi Ankara | Cilt Canlandırma ve Nemlendirme",
        "desc": "Cilde parlaklık, nem ve elastikiyet kazandıran vitamin destekli mezoterapi uygulamaları."
    },
    {
        "keys": ["İp ile Yüz Askılama", "İp Askı"],
        "title": "İp ile Yüz Askılama Ankara | Cerrahsız Yüz Germe",
        "desc": "Sarkmaları ve kırışıklıkları gideren, ameliyatsız gençleşme sağlayan ip askı yöntemi."
    },
    {
        "keys": ["Gamze Estetiği"],
        "title": "Gamze Estetiği Ankara | Doğal ve Zarif Gülüş",
        "desc": "Yüze doğal bir çekicilik katan, kısa sürede kalıcı sonuçlar veren gamze estetiği uygulaması."
    },
    {
        "keys": ["Kepçe Kulak", "Otoplasti"],
        "title": "Kepçe Kulak Ameliyatı Ankara | Doğal Görünümlü Sonuçlar",
        "desc": "Yüz oranlarını dengeleyen, estetik ve doğal sonuçlar sağlayan otoplasti uygulamaları."
    },
    {
        "keys": ["PRP"],
        "title": "PRP Ankara | Doğal Cilt Yenileme ve Gençlik Aşısı",
        "desc": "Kendi kanınızdan elde edilen büyüme faktörleriyle cildi yenileyen PRP tedavisi."
    },
    {
        "keys": ["Cilt Yenileme"],
        "title": "Cilt Yenileme Ankara | Parlak ve Sağlıklı Görünüm",
        "desc": "Lazer, PRP ve mezoterapi kombinasyonlarıyla cilt dokusunu yenileyen uygulamalar."
    },
    {
        "keys": ["Cerrahsız Yüz Gençleştirme"],
        "title": "Cerrahsız Yüz Gençleştirme | Doğal ve Etkili Sonuçlar",
        "desc": "Botoks, dolgu, lazer ve ip uygulamalarıyla ameliyatsız yüz gençleştirme çözümleri."
    },
    {
        "keys": ["Yüz Şekillendirme"],
        "title": "Yüz Şekillendirme Ankara | Dolgu ve İp Askı Uygulamaları",
        "desc": "Çene, elmacık ve yüz ovalini yeniden tanımlayan estetik şekillendirme uygulamaları."
    },
    {
        "keys": ["Alt Blefaroplasti"],
        "title": "Alt Blefaroplasti Ankara | Göz Altı Torbaları İçin Çözüm",
        "desc": "Göz altı torbalanma ve morluklarını gidererek daha genç bir ifade kazandıran cerrahi işlem."
    }
]

def connect_db():
    return pymysql.connect(**DB_CONFIG)

def audit_and_apply():
    print("Connecting to database...")
    conn = connect_db()
    
    missing_keywords = []
    updated_records = 0
    
    try:
        with conn.cursor() as cursor:
            # 1. Check all KEYWORDS
            print("\n--- AUDIT: Checking content for target keywords ---")
            for keyword in KEYWORDS:
                sql = "SELECT id, tr_baslik FROM icerik WHERE tr_baslik LIKE %s OR tr_icerik LIKE %s"
                cursor.execute(sql, (f'%{keyword}%', f'%{keyword}%'))
                results = cursor.fetchall()
                
                if results:
                    print(f"[FOUND] '{keyword}' matches {len(results)} records: {[r['tr_baslik'] for r in results]}")
                else:
                    print(f"[MISSING] '{keyword}'")
                    missing_keywords.append(keyword)

            # 2. Apply Metadata
            print("\n--- APPLY: Updating SEO Metadata ---")
            for item in METADATA_MAP:
                # Construct query to find record matching any of the keys
                # We check Title OR Content
                conditions = []
                params = []
                for k in item['keys']:
                    conditions.append("tr_baslik LIKE %s")
                    params.append(f"%{k}%")
                
                where_clause = " OR ".join(conditions)
                sql = f"SELECT id, tr_baslik FROM icerik WHERE {where_clause}"
                
                cursor.execute(sql, params)
                matches = cursor.fetchall()
                
                if matches:
                    print(f"Applying metadata for keys {item['keys']}...")
                    print(f"  Title: {item['title']}")
                    print(f"  Desc:  {item['desc']}")
                    
                    for match in matches:
                        print(f"  -> Updating ID {match['id']} '{match['tr_baslik']}'")
                        update_sql = "UPDATE icerik SET tr_seo_title = %s, tr_seo_description = %s WHERE id = %s"
                        cursor.execute(update_sql, (item['title'], item['desc'], match['id']))
                        updated_records += 1
                else:
                    print(f"No content found for metadata keys: {item['keys']}")

            conn.commit()
            print(f"\n--- SUMMARY ---")
            print(f"Records Updated: {updated_records}")
            print(f"Missing Keywords (Candidates for new articles): {len(missing_keywords)}")
            for mk in missing_keywords:
                print(f" - {mk}")
            
    except Exception as e:
        print(f"Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    audit_and_apply()
