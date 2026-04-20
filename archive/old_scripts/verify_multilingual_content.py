
import pymysql

DB_CONFIG = {
    'host': '127.0.0.1', 
    'user': 'root',
    'password': 'root',
    'database': 'gokceozel_local',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

def verify():
    print("Connecting to DB...")
    conn = pymysql.connect(**DB_CONFIG)
    try:
        with conn.cursor() as cursor:
            sql = """
                SELECT 
                    id, 
                    tr_baslik, 
                    LENGTH(tr_detay) as tr_len,
                    LENGTH(en_detay) as en_len,
                    LENGTH(ru_detay) as ru_len,
                    LEFT(en_detay, 100) as en_sample
                FROM icerik 
                WHERE en_detay IS NOT NULL OR tr_detay IS NOT NULL
                ORDER BY id DESC
                LIMIT 20
            """
            cursor.execute(sql)
            rows = cursor.fetchall()
            
            print(f"{'ID':<5} | {'Title':<40} | {'TR Len':<8} | {'EN Len':<8} | {'RU Len':<8} | {'EN Sample'}")
            print("-" * 120)
            
            for r in rows:
                title = (r['tr_baslik'][:37] + '...') if len(r['tr_baslik']) > 37 else r['tr_baslik']
                en_sample = (r['en_sample'][:50] + '...') if r['en_sample'] else "NULL"
                print(f"{r['id']:<5} | {title:<40} | {r['tr_len'] or 0:<8} | {r['en_len'] or 0:<8} | {r['ru_len'] or 0:<8} | {en_sample}")

    finally:
        conn.close()

if __name__ == "__main__":
    verify()
