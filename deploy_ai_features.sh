#!/bin/bash
HOST="ftp.eyalcin.com"
USER="eyalcin_seo"
PASS="Gokce135246"
REMOTE_DIR="/home/eyalcin_seo/public_html/yonetim"
LOCAL_DIR="/Users/mkanik/Documents/GitHub/gokceozel.com.tr/site_backup/public_html/yonetim"

lftp -c "
set ssl:verify-certificate no
open ftp://$USER:$PASS@$HOST
cd $REMOTE_DIR
mkdir -p classes
mkdir -p ajax
put $LOCAL_DIR/ayarlar.php
put $LOCAL_DIR/classes/AIService.php -o classes/AIService.php
put $LOCAL_DIR/ajax/ai_enhance.php -o ajax/ai_enhance.php
bye
"
