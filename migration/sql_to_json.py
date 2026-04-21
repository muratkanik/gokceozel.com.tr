import re
import json
import sys

def parse_sql_to_json(sql_file, table_name):
    with open(sql_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the INSERT INTO `table_name` line
    pattern = r"INSERT INTO `" + table_name + r"` VALUES \((.*?)\);"
    match = re.search(pattern, content, re.DOTALL)
    
    if not match:
        print(f"Table {table_name} not found or no INSERT statement.")
        return []

    values_str = match.group(1)
    
    # This is a very basic parser for MySQL dump values.
    # It splits by `),(` but we must be careful about strings containing `),(`.
    # Since it's complex, we'll use a character-by-character state machine.
    
    rows = []
    current_row = []
    current_val = ""
    in_string = False
    escape = False
    
    # We add dummy parenthesis to make it uniform (val1,val2),(val3,val4)
    # The regex captured inside the VALUES so it is `val1,val2),(val3,val4`
    full_str = values_str + ","
    
    for i in range(len(full_str)):
        char = full_str[i]
        
        if escape:
            current_val += char
            escape = False
            continue
            
        if char == '\\':
            escape = True
            continue
            
        if char == "'" and not in_string:
            in_string = True
            continue
            
        if char == "'" and in_string:
            in_string = False
            continue
            
        if not in_string:
            if char == ',':
                current_row.append(current_val)
                current_val = ""
                continue
            if char == ')' and full_str[i:i+3] == '),(':
                current_row.append(current_val)
                rows.append(current_row)
                current_row = []
                current_val = ""
                # Skip over `,(`
                continue
            if char == ')' and i == len(full_str) - 2:
                # end of last row
                current_row.append(current_val)
                rows.append(current_row)
                break
            if char == '(' and len(current_row) == 0 and current_val == "":
                # Beginning of row
                continue
                
        current_val += char
        
    return rows

rows = parse_sql_to_json('archive/db_backups/gokceozel_local_20260420.sql', 'icerik')

# The `icerik` table columns based on previous grep:
columns = [
    'id', 'kategori', 'tarih', 'tutar', 'tr_baslik', 'tr_slug', 'tr_goster', 'tr_seo_title', 
    'tr_seo_description', 'tr_icerik', 'tr_detay', 'en_baslik', 'en_slug', 'en_goster', 
    'en_seo_title', 'en_seo_description', 'en_icerik', 'en_detay', 'ru_baslik', 'ru_slug'
]

formatted_rows = []
for r in rows:
    row_dict = {}
    for i, col in enumerate(columns):
        if i < len(r):
            val = r[i]
            if val == 'NULL': val = None
            row_dict[col] = val
    formatted_rows.append(row_dict)

with open('archive/icerik.json', 'w', encoding='utf-8') as f:
    json.dump(formatted_rows, f, ensure_ascii=False, indent=2)

print(f"Exported {len(formatted_rows)} rows to archive/icerik.json")
