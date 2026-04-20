<?php
include("../baglanti/baglan.php");

$keys = [
    'service_non_surgical',
    'service_non_surgical_desc',
    'service_filling',
    'service_filling_desc',
    'btn_hizmetler',
    'service_medical_aesthetic',
    'service_medical_aesthetic_desc',
    'service_facial_procedures',
    'service_facial_procedures_desc',
    'service_filling_applications',
    'service_filling_applications_desc',
    'service_facial_aesthetics',
    'service_facial_aesthetics_desc'
];

echo "<h3>Checking Translation Keys</h3>";
echo "<table border='1'><tr><th>Key</th><th>TR</th><th>EN</th></tr>";

foreach ($keys as $key) {
    $stmt = $baglan->prepare("SELECT * FROM dil_cevirileri WHERE anahtar = ?");
    $stmt->execute([$key]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo "<tr>";
    echo "<td>$key</td>";
    if ($row) {
        echo "<td>" . htmlspecialchars($row['tr']) . "</td>";
        echo "<td>" . htmlspecialchars($row['en']) . "</td>";
    } else {
        echo "<td colspan='2' style='color:red;'>MISSING</td>";
    }
    echo "</tr>";
}
echo "</table>";
?>
