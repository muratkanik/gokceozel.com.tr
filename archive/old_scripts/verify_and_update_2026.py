import pymysql
import datetime
import sys

# Database config
DB_CONFIG = {
    'host': '127.0.0.1', 
    'user': 'root',
    'password': 'root',
    'database': 'gokceozel_local',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

# The 20 items from User
ITEMS_TO_CHECK = [
    "Burun estetiği Ankara",
    "Rinoplasti uzmanı",
    "Göz kapağı estetiği",
    "Alt ve üst blefaroplasti",
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
    "PRP ve gençlik aşısı",
    "Cilt yenileme tedavileri",
    "Yüz şekillendirme",
    "Prof. Dr. Gökçe Özel estetik kliniği"
]

# Mapping Logic (Keywords to search in DB)
# We map the User's term to SQL SEARCH TERMS (Title OR Content)
# Checks if we have coverage.
MAPPING = {
    "Burun estetiği Ankara": ["Burun Estetiği", "Rinoplasti"],
    "Rinoplasti uzmanı": ["Rinoplasti", "Burun Estetiği"],
    "Göz kapağı estetiği": ["Göz kapağı", "Blefaroplasti"],
    "Alt ve üst blefaroplasti": ["Blefaroplasti", "Göz kapağı"],
    "Botoks Ankara": ["Botoks"],
    "Dolgu uygulamaları": ["Dolgu", "Doldurma"],
    "Dudak dolgusu": ["Dudak Dolgusu", "Dudak Estetiği"],
    "Dudak kaldırma estetiği": ["Dudak Kaldırma", "Lip Lift", "Dudak Estetiği"],
    "İp ile yüz askılama": ["İp Askı", "Fransız Askısı"],
    "Endolift lazer": ["Endolift"],
    "Lazerle yüz germe": ["Endolift", "Lazerle Yüz Germe"], 
    "Mezoterapi uygulamaları": ["Mezoterapi"],
    "Gamze estetiği": ["Gamze"],
    "Kepçe kulak ameliyatı": ["Kepçe Kulak", "Otoplasti"],
    "Yüz estetiği Ankara": ["Yüz Estetiği", "Endolift", "İp Askı"], # Generic, covers many
    "Cerrahsız yüz gençleştirme": ["Cerrahsız", "Ameliyatsız", "Cilt Yenileme"],
    "PRP ve gençlik aşısı": ["PRP", "Gençlik Aşısı"],
    "Cilt yenileme tedavileri": ["Cilt Yenileme", "Gençleştirme"],
    "Yüz şekillendirme": ["Yüz Şekillendirme", "Dolgu", "Endolift"],
    "Prof. Dr. Gökçe Özel estetik kliniği": ["Gökçe Özel", "Hakkımızda", "Ana Sayfa"] # Usually Homepage
}

def connect_db():
    return pymysql.connect(**DB_CONFIG)

def verify_and_update():
    print("Connecting to database...")
    conn = connect_db()
    
    found_count = 0
    missing_items = []
    
    # Current 2026 date
    new_date = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S') # 2026-02-02...

    try:
        with conn.cursor() as cursor:
            print(f"\n--- Checking {len(ITEMS_TO_CHECK)} Items & Updating Dates to {new_date} ---")
            
            for item in ITEMS_TO_CHECK:
                search_terms = MAPPING.get(item, [item])
                
                # Build Query
                conditions = []
                params = []
                for term in search_terms:
                    conditions.append("tr_baslik LIKE %s")
                    params.append(f"%{term}%")
                
                where_clause = " OR ".join(conditions)
                sql = f"SELECT id, tr_baslik, kayit_tarihi FROM icerik WHERE {where_clause}"
                
                cursor.execute(sql, params)
                results = cursor.fetchall()
                
                if results:
                    found_count += 1
                    status = "✅ FOUND"
                    # Update Date
                    ids_to_update = [r['id'] for r in results]
                    
                    # Update 'guncelleme_tarihi' AND 'kayit_tarihi' to be sure? 
                    # User said "update to 2026". Let's update `kayit_tarihi` (Record Date) to make it look fresh 2026 content.
                    # Also `guncelleme_tarihi`.
                    
                    # Check if columns exist (we know they do from previous checks, except guncelleme might be nuanced)
                    # We know `kayit_tarihi` exists.
                    
                    for row in results:
                        rec_id = row['id']
                        update_sql = "UPDATE icerik SET kayit_tarihi = %s WHERE id = %s"
                        cursor.execute(update_sql, (new_date, rec_id))
                        
                    print(f"{status}: '{item}' -> Matches {len(results)} records ({[r['tr_baslik'] for r in results]}) -> Updated Dates")
                else:
                    print(f"❌ MISSING: '{item}' (Searched for: {search_terms})")
                    missing_items.append(item)
            
            conn.commit()
            
            print(f"\n--- RESULTS ---")
            print(f"Total Items Checked: {len(ITEMS_TO_CHECK)}")
            print(f"Found & Updated: {found_count}")
            print(f"Missing: {len(missing_items)}")
            if missing_items:
                for m in missing_items:
                    print(f" - {m}")

    except Exception as e:
        print(f"Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    verify_and_update()
