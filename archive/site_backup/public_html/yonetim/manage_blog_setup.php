<?php
include("baglan.php");

echo "<h3>Blog & Translation Setup</h3>";

// 1. Check/Create Blog Category (ID 52)
$check = $baglan->query("SELECT * FROM genel_kategori WHERE id = 52");
if ($check->rowCount() > 0) {
    echo "Category 52 (Blog) exists.<br>";
} else {
    // If 52 is missing, we might need to insert it or find the real blog ID.
    // For now, let's look for any category named "Blog"
    $search = $baglan->query("SELECT * FROM genel_kategori WHERE tr_isim LIKE '%Blog%'");
    if ($row = $search->fetch(PDO::FETCH_ASSOC)) {
        echo "Found Blog Category: ID " . $row['id'] . " (" . $row['tr_isim'] . ")<br>";
        // If it's not 52, we might need to update our code or the DB. 
        // But the current blog.php uses 52 hardcoded.
    } else {
        echo "Blog Category NOT found. Creating ID 52...<br>";
        // Force insert ID 52 if possible, or just insert and get ID
        $insert = $baglan->prepare("INSERT INTO genel_kategori (id, tr_isim, en_isim, durum, sira) VALUES (52, 'Blog', 'Blog', '1', 99)");
        try {
            $insert->execute();
            echo "Category 52 created.<br>";
        } catch (Exception $e) {
            echo "Error creating category: " . $e->getMessage() . "<br>";
        }
    }
}

// 2. Insert Missing Translation Keys
$translations = [
    'service_non_surgical' => ['tr' => 'Ameliyatsız Uygulamalar', 'en' => 'Non-Surgical Procedures'],
    'service_non_surgical_desc' => ['tr' => 'Cerrahi müdahale gerektirmeyen estetik çözümler.', 'en' => 'Aesthetic solutions without surgical intervention.'],
    'service_filling' => ['tr' => 'Dolgu Uygulamaları', 'en' => 'Filling Applications'],
    'service_filling_desc' => ['tr' => 'Yüz hacmini geri kazandıran profesyonel dolgu işlemleri.', 'en' => 'Professional filling procedures to restore facial volume.'],
    'btn_hizmetler' => ['tr' => 'Hizmetlerimiz', 'en' => 'Our Services'],
    
    'service_medical_aesthetic' => ['tr' => 'Medikal Estetik', 'en' => 'Medical Aesthetic'],
    'service_medical_aesthetic_desc' => ['tr' => 'Cildinizin genç ve canlı kalması için medikal bakım.', 'en' => 'Medical care to keep your skin young and vibrant.'],
    
    'service_facial_procedures' => ['tr' => 'Yüz İşlemleri', 'en' => 'Facial Procedures'],
    'service_facial_procedures_desc' => ['tr' => 'Yüz estetiği için kapsamlı çözümler.', 'en' => 'Comprehensive solutions for facial aesthetics.'],
    
    'service_filling_applications' => ['tr' => 'Dolgu', 'en' => 'Filling'], 
    'service_filling_applications_desc' => ['tr' => 'Dudak, yanak ve çene dolgusu.', 'en' => 'Lip, cheek and chin fillers.'],
    
    'service_facial_aesthetics' => ['tr' => 'Yüz Estetiği', 'en' => 'Facial Aesthetics'],
    'service_facial_aesthetics_desc' => ['tr' => 'Doğal güzelliğinizi ortaya çıkarın.', 'en' => 'Reveal your natural beauty.']
];

foreach ($translations as $key => $vals) {
    $check = $baglan->prepare("SELECT id FROM dil_cevirileri WHERE anahtar = ?");
    $check->execute([$key]);
    if ($check->rowCount() == 0) {
        $ins = $baglan->prepare("INSERT INTO dil_cevirileri (anahtar, tr, en, durum) VALUES (?, ?, ?, '1')");
        $ins->execute([$key, $vals['tr'], $vals['en']]);
        echo "Inserted translation: $key<br>";
    } else {
        echo "Translation exists: $key<br>";
    }
}
?>
