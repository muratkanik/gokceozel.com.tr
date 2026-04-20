<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h3>Encryption Test</h3>";

if (extension_loaded('openssl')) {
    echo "<p style='color:green'>OpenSSL Extension Loaded</p>";
} else {
    echo "<p style='color:red'>OpenSSL Extension NOT Loaded</p>";
}

include("baglanti/baglan.php");

echo "<p>Baglan.php included.</p>";

if (function_exists('sifrele')) {
    echo "<p style='color:green'>Function 'sifrele' exists.</p>";
    $test = "Hello World";
    $enc = sifrele($test);
    echo "Encrypted: $enc<br>";
    $dec = sifre_coz($enc);
    echo "Decrypted: $dec<br>";
    
    if ($test === $dec) {
        echo "<p style='color:green'>Encryption/Decryption working correctly.</p>";
    } else {
        echo "<p style='color:red'>Decryption FAILED.</p>";
    }
} else {
    echo "<p style='color:red'>Function 'sifrele' DOES NOT exist.</p>";
}

echo "<p>End of test.</p>";
?>
