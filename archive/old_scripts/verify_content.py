
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
    try:
        conn = pymysql.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        ids_to_check = [16, 29, 34]
        for pid in ids_to_check:
            print(f"\n--- Checking ID {pid} ---")
            sql = "SELECT id, tr_baslik, LENGTH(tr_detay) as tr_len, LENGTH(en_detay) as en_len, LENGTH(ru_detay) as ru_len, LENGTH(ar_detay) as ar_len, LENGTH(de_detay) as de_len, fr_detay, cin_detay FROM icerik WHERE id = %s"
            cursor.execute(sql, (pid,))
            row = cursor.fetchone()
            
            if row:
                print(f"Title: {row['tr_baslik']}")
                print(f"TR Length: {row['tr_len']}")
                print(f"EN Length: {row['en_len']}")
                # Preview FR to see which content it has
                fr_text = row['fr_detay']
                if fr_text:
                    import re
                    # Extract H3 to see topic
                    match = re.search(r'<h3>(.*?)</h3>', fr_text)
                    print(f"FR Topic: {match.group(1) if match else 'No H3 found'}")
                else:
                    print("FR: None")
            else:
                print(f"Row {pid} not found.")

    except Exception as e:
        print(e)
    finally:
        conn.close()

if __name__ == "__main__":
    verify()
