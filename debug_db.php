<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include the connection file
require_once __DIR__ . '/site_backup/public_html/baglanti/baglan.php';

try {
    echo "Database Connection Test:\n";
    // In baglan.php, the connection object is named $baglan, not $db
    if (isset($baglan)) {
        echo "Connection Object (\$baglan) exists.\n";
        echo "Server Info: " . $baglan->getAttribute(PDO::ATTR_SERVER_INFO) . "\n";
        
        // Check Charset
        $stmt = $baglan->query("SHOW VARIABLES LIKE 'character_set_connection'");
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "Current Charset: " . $row['Value'] . "\n";

        // Check dil_cevirileri table
        echo "\nChecking 'dil_cevirileri' table:\n";
        $stmt = $baglan->query("SELECT COUNT(*) as count FROM dil_cevirileri");
        if ($stmt) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            echo "Row count: " . $row['count'] . "\n";
            
            // Fetch a sample
            $stmt = $baglan->query("SELECT * FROM dil_cevirileri LIMIT 1");
            $sample = $stmt->fetch(PDO::FETCH_ASSOC);
            echo "Sample row: " . print_r($sample, true) . "\n";
        } else {
            echo "Error querying dil_cevirileri: " . print_r($baglan->errorInfo(), true) . "\n";
        }

    } else {
        echo "Variable \$baglan is not set. Check baglan.php.\n";
    }
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}
?>
