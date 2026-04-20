#!/bin/bash

echo "📦 Proje düzenleniyor..."
echo ""

# Archive klasörünü oluştur
mkdir -p archive/documentation
mkdir -p archive/backups
mkdir -p archive/old_scripts
mkdir -p archive/remote_files

# Documentation dosyalarını taşı
echo "📄 Documentation taşınıyor..."
mv *.md archive/documentation/ 2>/dev/null
mv IMPLEMENTATION_COMPLETE.md . 2>/dev/null  # Ana dokümanı geri getir

# Backup dosyalarını taşı
echo "💾 Backup dosyaları taşınıyor..."
mv database_backup archive/backups/ 2>/dev/null
mv *.sql archive/backups/ 2>/dev/null

# Eski scriptleri taşı
echo "🔧 Eski scriptler taşınıyor..."
mv *.py archive/old_scripts/ 2>/dev/null
mv add_*.php archive/old_scripts/ 2>/dev/null
mv audit_*.php archive/old_scripts/ 2>/dev/null
mv check_*.php archive/old_scripts/ 2>/dev/null
mv fix_*.php archive/old_scripts/ 2>/dev/null
mv test_*.php archive/old_scripts/ 2>/dev/null

# Remote files taşı
echo "🌐 Remote dosyalar taşınıyor..."
mv remote_files/* archive/remote_files/ 2>/dev/null
rmdir remote_files 2>/dev/null

# FTP script dosyalarını taşı
echo "📤 FTP scriptleri taşınıyor..."
mv *.sh archive/old_scripts/ 2>/dev/null
# Sadece deployment scriptlerini geri getir
mv archive/old_scripts/deploy_to_production.sh . 2>/dev/null
mv archive/old_scripts/cleanup_after_migration.sh . 2>/dev/null

echo ""
echo "✅ Düzenleme tamamlandı!"
echo ""
echo "📂 Proje Yapısı:"
echo "   ├── 📄 IMPLEMENTATION_COMPLETE.md (Ana doküman)"
echo "   ├── 📁 site_backup/ (Çalışan site)"
echo "   ├── 📁 migration/ (Migration scriptleri)"
echo "   ├── 📁 node_modules/ (NPM paketleri)"
echo "   ├── 📁 archive/ (Arşiv dosyalar)"
echo "   │   ├── documentation/"
echo "   │   ├── backups/"
echo "   │   ├── old_scripts/"
echo "   │   └── remote_files/"
echo "   ├── 🔧 deploy_to_production.sh"
echo "   ├── 🔧 cleanup_after_migration.sh"
echo "   ├── 📦 package.json"
echo "   └── ⚙️  vite.config.js"
echo ""
