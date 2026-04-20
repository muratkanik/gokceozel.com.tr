
import pymysql

DB_CONFIG = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': 'root',
    'database': 'gokceozel_local',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

# Simplified Targets (just keywords needed)
TARGETS = [
    ["Burun estetiği", "Rinoplasti", "Burun ameliyatı", "Nose job", "Rhinoplasty"],
    ["Endolift", "Lazer ağ", "Yüz germe", "Ameliyatsız yüz germe", "Laser facelift"],
    ["İp askı", "Fransız askısı", "Örümcek ağı", "Thread lift", "French lift"],
    ["Göz kapağı", "Blefaroplasti", "Göz torbası", "Düşük göz kapağı", "Blepharoplasty", "Eyelid"],
    ["Botoks", "Botox", "Kırışıklık", "Masseter", "Terleme"],
    ["Dolgu", "Dermal filler", "Elmacık", "Çene dolgusu", "Jawline", "Işık dolgusu"],
    ["Dudak dolgusu", "Lip filler", "Russian lips", "Dudak estetiği"],
    ["Lip lift", "Dudak kaldırma", "Boğa boynuzu", "Bullhorn"],
    ["Mezoterapi", "Gençlik aşısı", "Somon DNA", "Mesotherapy", "Vitamin"],
    ["Gamze", "Dimple", "Gamze estetiği", "Dimpleplasty"],
    ["Kepçe kulak", "Otoplasti", "Kulak estetiği", "Otoplasty", "Ear surgery"],
    ["PRP", "Kök hücre", "Platelet", "Plasma", "Saç tedavisi"],
    ["Cilt yenileme", "Leke tedavisi", "Akne izi", "Skin rejuvenation", "Peeling", "Lazer"],
    ["Biyografi", "Hakkında", "Kimdir", "About", "Biography", "Gökçe Özel"]
]

def fix():
    print("Connecting...")
    try:
        conn = pymysql.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        bad_ids = set()

        for keywords in TARGETS:
            # Find Good IDs (Header Match)
            good_ids_for_group = set()
            for kw in keywords:
                cursor.execute("SELECT id FROM icerik WHERE tr_baslik LIKE %s", (f"%{kw}%",))
                for r in cursor.fetchall():
                    good_ids_for_group.add(r['id'])
            
            # Find All IDs (Content Match - The logic that caused the mess)
            all_ids_for_group = set()
            for kw in keywords:
                cursor.execute("SELECT id FROM icerik WHERE tr_baslik LIKE %s OR tr_icerik LIKE %s", (f"%{kw}%", f"%{kw}%"))
                for r in cursor.fetchall():
                    all_ids_for_group.add(r['id'])
            
            # Identify Bad IDs
            diff = all_ids_for_group - good_ids_for_group
            # If an ID is a "Good ID" for ANY group, it shouldn't be considered "Bad" globally?
            # Wait, if ID 29 (Rinoplasti) matched "Dolgu" content-wise, it was in "Bad IDs" for Dolgu group.
            # But it is a "Good ID" for Rinoplasti group.
            # So I should ONLY clean IDs that are NOT "Good IDs" for ANY group.
            bad_ids.update(diff)

        # Remove any ID that is actually a valid target for some group
        all_good_ids = set()
        for keywords in TARGETS:
            for kw in keywords:
                cursor.execute("SELECT id FROM icerik WHERE tr_baslik LIKE %s", (f"%{kw}%",))
                for r in cursor.fetchall():
                    all_good_ids.add(r['id'])
        
        really_bad_ids = bad_ids - all_good_ids
        
        print(f"Allocated {len(really_bad_ids)} incorrectly updated records.")
        
        if not really_bad_ids:
            print("No records to fix.")
            return

        # Fix them
        sql_fix = """
            UPDATE icerik 
            SET 
                tr_detay = tr_icerik,
                en_detay = NULL,
                ru_detay = NULL,
                ar_detay = NULL,
                de_detay = NULL,
                fr_detay = NULL,
                cin_detay = NULL
            WHERE id = %s
        """
        
        for mid in really_bad_ids:
            cursor.execute("SELECT tr_baslik FROM icerik WHERE id = %s", (mid,))
            row = cursor.fetchone()
            print(f"Restoring ID {mid}: {row['tr_baslik']}")
            cursor.execute(sql_fix, (mid,))
        
        conn.commit()
        print("Fix Complete.")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    fix()
