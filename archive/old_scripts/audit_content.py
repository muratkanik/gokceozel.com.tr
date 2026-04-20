
import pymysql
import json

DB_CONFIG = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': 'root',
    'database': 'gokceozel_local',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

LANGUAGES = ['TR', 'EN', 'RU', 'AR', 'DE', 'FR', 'CIN']

def audit_database():
    print("Starting Comprehensive Content Audit...")
    try:
        conn = pymysql.connect(**DB_CONFIG)
        cursor = conn.cursor()

        # 1. Check `icerik` table (Main Content)
        # We look for active records (durum != '-1' usually means active/not deleted)
        sql = "SELECT * FROM icerik WHERE durum != '-1'"
        cursor.execute(sql)
        rows = cursor.fetchall()
        
        print(f"Total Active Pages found: {len(rows)}\n")

        missing_report = {lang: {'title': [], 'content': [], 'detail': [], 'seo': []} for lang in LANGUAGES}
        
        for row in rows:
            page_id = row['id']
            page_ref = f"ID:{page_id} ({row.get('tr_baslik', 'NO_TITLE')[:30]})"

            for lang in LANGUAGES:
                prefix = lang.lower()
                
                # Title Check
                title_col = f"{prefix}_baslik"
                if not row.get(title_col) or len(str(row.get(title_col)).strip()) < 2:
                    missing_report[lang]['title'].append(page_ref)

                # Content (Short) Check
                content_col = f"{prefix}_icerik"
                if not row.get(content_col) or len(str(row.get(content_col)).strip()) < 10:
                    missing_report[lang]['content'].append(page_ref)
                
                # Detail (Long) Check - Critical for Procedure Pages
                # Note: Not all pages (like sliders) need details, but procedure pages do.
                # We will log it, but user needs to interpret if it applies to that page type.
                detail_col = f"{prefix}_detay"
                if not row.get(detail_col) or len(str(row.get(detail_col)).strip()) < 10:
                    missing_report[lang]['detail'].append(page_ref)

                # SEO Check
                # Looking for seo_title or seo_description
                seo_title = row.get(f"{prefix}_seo_title")
                seo_desc = row.get(f"{prefix}_seo_description")
                if not seo_title and not seo_desc:
                     missing_report[lang]['seo'].append(page_ref)

        # 2. Print Report
        print("-" * 60)
        print("AUDIT REPORT BY LANGUAGE")
        print("-" * 60)
        
        for lang in LANGUAGES:
            stats = missing_report[lang]
            print(f"\n[{lang}] Missing Stats:")
            print(f"  - Titles Missing: {len(stats['title'])}")
            print(f"  - Summaries Missing: {len(stats['content'])}")
            print(f"  - Details Missing: {len(stats['detail'])}")
            print(f"  - SEO Records Missing: {len(stats['seo'])}")
            
            if len(stats['title']) > 0:
                print(f"    Sample Missing Titles: {stats['title'][:3]}")
            if len(stats['detail']) > 0:
                print(f"    Sample Missing Details: {stats['detail'][:3]}")

        # 3. Check for globally broken pages (Missing TR title is a critical fail)
        print("-" * 60)
        print("CRITICAL INTEGRITY CHECKS")
        print("-" * 60)
        critical_fails = missing_report['TR']['title']
        if critical_fails:
            print(f"CRITICAL: {len(critical_fails)} pages contain no TR Title!")
            for f in critical_fails:
                print(f"  - {f}")
        else:
            print("PASS: All active pages have at least a TR Title.")

        conn.close()

    except Exception as e:
        print(f"Error during audit: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    audit_database()
