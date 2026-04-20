import pymysql
from deep_translator import GoogleTranslator
import time
import sys

# Database Configuration
db_config = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': 'root',
    'database': 'gokceozel_local',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

# Language Mappings (Target Code -> Column Prefix)
# Google Translator Codes: tr=Turkish, ru=Russian, ar=Arabic, fr=French, de=German, zh-CN=Chinese (Simplified)
LANG_MAP = {
    'tr': 'tr',
    'ru': 'ru',
    'ar': 'ar',
    'fr': 'fr',
    'de': 'de',
    'zh-CN': 'cin' 
}

# Fields to translate
FIELDS = ['baslik', 'icerik', 'detay', 'seo_title', 'seo_description']

def connect_db():
    return pymysql.connect(**db_config)

def translate_text(text, target_lang):
    if not text or not text.strip():
        return ""
    try:
        # Use simple translation. For heavy HTML, this is minimal effort, but requested by user.
        # deep-translator handles chunks automatically usually.
        translated = GoogleTranslator(source='en', target=target_lang).translate(text)
        return translated
    except Exception as e:
        print(f"Error translating to {target_lang}: {e}")
        return text # Fallback to original if fails

def main():
    print("Starting Batch Translation...")
    
    try:
        conn = connect_db()
        cursor = conn.cursor()
        
        # count total
        cursor.execute("SELECT COUNT(*) as cnt FROM icerik")
        total = cursor.fetchone()['cnt']
        print(f"Total rows to process: {total}")
        
        # Fetch all IDs to process rows one by one (safer for long running scripts)
        cursor.execute("SELECT id, en_baslik, en_icerik, en_detay, en_seo_title, en_seo_description FROM icerik")
        rows = cursor.fetchall()
        
        processed_count = 0
        
        for row in rows:
            row_id = row['id']
            en_data = {
                'baslik': row['en_baslik'],
                'icerik': row['en_icerik'],
                'detay': row['en_detay'],
                'seo_title': row['en_seo_title'],
                'seo_description': row['en_seo_description']
            }
            
            # Skip if English title is empty - assumed source of truth? 
            # User said "take English", so if English is empty checking might be redundant but safe.
            if not en_data['baslik']:
                # print(f"Skipping ID {row_id} (No EN Title)")
                continue

            print(f"[{processed_count+1}/{total}] Processing ID: {row_id} - {en_data['baslik'][:30]}...")
            
            update_query_parts = []
            update_values = []
            
            for lang_code, col_prefix in LANG_MAP.items():
                # print(f"  > Translating to {col_prefix.upper()}...")
                
                for field in FIELDS:
                    source_text = en_data.get(field, "")
                    if source_text:
                        translated_text = translate_text(source_text, lang_code)
                        # Construct column name, e.g., tr_baslik, cin_icerik
                        col_name = f"{col_prefix}_{field}"
                        update_query_parts.append(f"{col_name} = %s")
                        update_values.append(translated_text)
            
            if update_query_parts:
                sql = f"UPDATE icerik SET {', '.join(update_query_parts)} WHERE id = %s"
                update_values.append(row_id)
                # Execute Update
                cursor.execute(sql, update_values)
                conn.commit()
            
            processed_count += 1
            # Sleep slightly to respect API rate limits/avoid blocking
            # time.sleep(0.5) 

        print("Translation Completed Successfully.")

    except Exception as e:
        print(f"Critical Error: {e}")
    finally:
        if 'conn' in locals() and conn.open:
            conn.close()

if __name__ == "__main__":
    main()
