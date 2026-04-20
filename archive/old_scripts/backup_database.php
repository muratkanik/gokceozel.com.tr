<?php
/**
 * Veritabanı yedekleme scripti
 * Bu script uzak sunucuda çalıştırılarak veritabanını yedekler
 */

$sunucu = 'localhost';
$dbkullanici = 'eyalcin_gokceozel';
$dbsifre = 'Gokce.135246';
$db = 'eyalcin_gokceozel';

// Yedek dosya adı
$backup_file = 'database_backup_' . date('Y-m-d_H-i-s') . '.sql';

try {
    // MySQL bağlantısı
    $baglan = new PDO("mysql:host=$sunucu;dbname=$db", $dbkullanici, $dbsifre);
    $baglan->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Yedek dosyasını oluştur
    $handle = fopen($backup_file, 'w');
    
    // SQL başlığı
    fwrite($handle, "-- Veritabanı Yedeği\n");
    fwrite($handle, "-- Oluşturulma Tarihi: " . date('Y-m-d H:i:s') . "\n");
    fwrite($handle, "-- Veritabanı: $db\n\n");
    fwrite($handle, "SET FOREIGN_KEY_CHECKS=0;\n\n");
    
    // Tüm tabloları al
    $tables = $baglan->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    
    foreach ($tables as $table) {
        echo "Yedekleniyor: $table\n";
        
        // Tablo yapısını al
        $create_table = $baglan->query("SHOW CREATE TABLE `$table`")->fetch(PDO::FETCH_ASSOC);
        fwrite($handle, "\n-- Tablo yapısı: $table\n");
        fwrite($handle, "DROP TABLE IF EXISTS `$table`;\n");
        fwrite($handle, $create_table['Create Table'] . ";\n\n");
        
        // Tablo verilerini al
        $rows = $baglan->query("SELECT * FROM `$table`");
        $row_count = 0;
        
        while ($row = $rows->fetch(PDO::FETCH_ASSOC)) {
            $row_count++;
            $columns = array_keys($row);
            $values = array_values($row);
            
            // Değerleri escape et
            $escaped_values = array_map(function($value) use ($baglan) {
                if ($value === null) {
                    return 'NULL';
                }
                return $baglan->quote($value);
            }, $values);
            
            // INSERT statement oluştur
            if ($row_count == 1) {
                fwrite($handle, "INSERT INTO `$table` (`" . implode('`, `', $columns) . "`) VALUES\n");
            }
            
            fwrite($handle, "(" . implode(', ', $escaped_values) . ")");
            
            // Son satır değilse virgül ekle
            if ($row_count < $rows->rowCount()) {
                fwrite($handle, ",\n");
            } else {
                fwrite($handle, ";\n\n");
            }
        }
        
        if ($row_count == 0) {
            fwrite($handle, "-- Tablo boş: $table\n\n");
        }
    }
    
    fwrite($handle, "SET FOREIGN_KEY_CHECKS=1;\n");
    fclose($handle);
    
    echo "\nYedekleme tamamlandı: $backup_file\n";
    echo "Dosya boyutu: " . number_format(filesize($backup_file) / 1024, 2) . " KB\n";
    
} catch (PDOException $e) {
    die("Hata: " . $e->getMessage() . "\n");
}
?>

