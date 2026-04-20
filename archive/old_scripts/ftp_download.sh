#!/bin/bash

HOST="ftp.eyalcin.com"
USER="eyalcin_seo"
PASS="Gokce135246"

# FTP ile baglan.php dosyasını indir
lftp -c "
open ftp://$USER:$PASS@$HOST
lcd /Users/mkanik/Documents/GitHub/gokceozel.com.tr/remote_files
get baglanti/baglan.php -o baglan_remote_original.php
bye
"

echo "✅ Dosya indirildi: remote_files/baglan_remote_original.php"
