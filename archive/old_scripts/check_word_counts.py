import pymysql
import re

# Database config
DB_CONFIG = {
    'host': '127.0.0.1', 
    'user': 'root',
    'password': 'root',
    'database': 'gokceozel_local',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

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

MAPPING = {
    "Burun estetiği Ankara": ["Burun Estetiği", "Rinoplasti"],
    "Rinoplasti uzmanı": ["Rinoplasti", "Burun Estetiği"],
    "Göz kapağı estetiği": ["Göz kapağı", "Blefaroplasti"],
    "Alt ve üst blefaroplasti": ["Blefaroplasti", "Göz kapağı"],
    "Botoks Ankara": ["Botoks"],
    "Dolgu uygulamaları": ["Dolgu", "Doldurma"],
    "Dudak dolgusu": ["Dudak Dolgusu", "Dudak Estetiği"],
    "Dudak kaldırma estetiği": ["Dudak Kaldırma", "Liplift", "Lip Lift"],
    "İp ile yüz askılama": ["İp Askı", "Fransız Askısı"],
    "Endolift lazer": ["Endolift"],
    "Lazerle yüz germe": ["Endolift"], 
    "Mezoterapi uygulamaları": ["Mezoterapi"],
    "Gamze estetiği": ["Gamze"],
    "Kepçe kulak ameliyatı": ["Kepçe Kulak", "Otoplasti"],
    "Yüz estetiği Ankara": ["Yüz Estetiği", "Endolift", "İp Askı"],
    "Cerrahsız yüz gençleştirme": ["Cerrahsız", "Ameliyatsız", "Cilt Yenileme"],
    "PRP ve gençlik aşısı": ["PRP", "Gençlik Aşısı"],
    "Cilt yenileme tedavileri": ["Cilt Yenileme", "Gençleştirme"],
    "Yüz şekillendirme": ["Yüz Şekillendirme", "Dolgu", "Endolift"],
    "Prof. Dr. Gökçe Özel estetik kliniği": ["Gökçe Özel", "Hakkımızda"]
}

def get_word_count(html_content):
    if not html_content: return 0
    clean = re.sub('<[^<]+?>', '', html_content)
    return len(clean.split())

def check_content():
    conn = pymysql.connect(**DB_CONFIG)
    try:
        with conn.cursor() as cursor:
            print(f"{'TOPIC':<30} | {'ID':<5} | {'TITLE':<30} | {'WORDS':<8} | {'STATUS'}")
            print("-" * 90)
            
            checked_ids = set()
            
            for item in ITEMS_TO_CHECK:
                search_terms = MAPPING.get(item, [item])
                conditions = []
                params = []
                for term in search_terms:
                    conditions.append("tr_baslik LIKE %s")
                    params.append(f"%{term}%")
                
                where = " OR ".join(conditions)
                sql = f"SELECT id, tr_baslik, tr_icerik, tr_detay FROM icerik WHERE {where}"
                cursor.execute(sql, params)
                results = cursor.fetchall()
                
                if not results:
                     print(f"{item:<30} | {'-':<5} | {'NOT FOUND':<30} | {'0':<8} | ❌ MISSING")
                
                for r in results:
                    if r['id'] in checked_ids: continue
                    checked_ids.add(r['id'])
                    
                    wc_icerik = get_word_count(r['tr_icerik'])
                    wc_detay = get_word_count(r.get('tr_detay', ''))
                    total_wc = wc_icerik + wc_detay
                    
                    status = "✅ OK" if total_wc >= 2000 else ("⚠️ FAIL (<90)" if total_wc < 1000 else "⚠️ WEAK")
                    
                    # Truncate title
                    title = (r['tr_baslik'][:27] + '..') if len(r['tr_baslik']) > 27 else r['tr_baslik']
                    print(f"{item[:29]:<30} | {r['id']:<5} | {title:<30} | {total_wc:<8} | {status}")

    finally:
        conn.close()

if __name__ == "__main__":
    check_content()
