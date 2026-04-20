
import pymysql

DB_CONFIG = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': 'root',
    'database': 'gokceozel_local',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

# Junk IDs to delete
IDS_TO_DELETE = [61, 62, 65, 66, 67, 68, 69, 70, 71]

# Missing Translations
DOLGU_ISLEM_DATA = {
    'EN': "Filler Procedures",
    'RU': "Процедуры с филлерами",
    'AR': "إجراءات الحشو",
    'DE': "Filler-Behandlungen",
    'FR': "Procédures de Comblement",
    'CIN': "填充疗程"
}

WELCOME_DATA = {
    'EN': "Welcome to Prof. Dr. Gökçe Özel Clinic",
    'RU': "Добро пожаловать в клинику профессора доктора Гёкче Озель",
    'AR': "مرحبًا بكم في عيادة البروفيسور الدكتور جوكتشه أوزيل",
    'DE': "Willkommen in der Klinik von Prof. Dr. Gökçe Özel",
    'FR': "Bienvenue à la clinique du Pr Dr Gökçe Özel",
    'CIN': "欢迎来到 Gökçe Özel 教授博士诊所"
}

def cleanup():
    print("Connecting...")
    try:
        conn = pymysql.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # 1. Delete Junk
        if IDS_TO_DELETE:
            format_strings = ','.join(['%s'] * len(IDS_TO_DELETE))
            print(f"Deleting IDs: {IDS_TO_DELETE}")
            cursor.execute(f"DELETE FROM icerik WHERE id IN ({format_strings})", tuple(IDS_TO_DELETE))
        
        # 2. Update Dolgu (ID 63)
        print("Updating ID 63 (Dolgu İşlemleri)...")
        sql_update_63 = """
            UPDATE icerik 
            SET 
                en_baslik=%s, ru_baslik=%s, ar_baslik=%s, de_baslik=%s, fr_baslik=%s, cin_baslik=%s
            WHERE id = 63
        """
        cursor.execute(sql_update_63, (
            DOLGU_ISLEM_DATA['EN'], DOLGU_ISLEM_DATA['RU'], DOLGU_ISLEM_DATA['AR'],
            DOLGU_ISLEM_DATA['DE'], DOLGU_ISLEM_DATA['FR'], DOLGU_ISLEM_DATA['CIN']
        ))

        # 3. Update Welcome (ID 64)
        print("Updating ID 64 (Hoşgeldiniz)...")
        sql_update_64 = """
            UPDATE icerik 
            SET 
                en_baslik=%s, ru_baslik=%s, ar_baslik=%s, de_baslik=%s, fr_baslik=%s, cin_baslik=%s,
                en_icerik=%s, ru_icerik=%s, ar_icerik=%s, de_icerik=%s, fr_icerik=%s, cin_icerik=%s
            WHERE id = 64
        """
        cursor.execute(sql_update_64, (
            WELCOME_DATA['EN'], WELCOME_DATA['RU'], WELCOME_DATA['AR'],
            WELCOME_DATA['DE'], WELCOME_DATA['FR'], WELCOME_DATA['CIN'],
            WELCOME_DATA['EN'], WELCOME_DATA['RU'], WELCOME_DATA['AR'],
            WELCOME_DATA['DE'], WELCOME_DATA['FR'], WELCOME_DATA['CIN']
        ))

        conn.commit()
        print("Cleanup Complete.")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    cleanup()
