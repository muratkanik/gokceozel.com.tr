<?php
set_time_limit(0);
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Use production connection logic
require(__DIR__ . '/baglanti/baglan.php');

// Translations
$updates = [
    15 => [ // Gökçe Özel kimdir ?
        'en_baslik' => 'Who is Gokce Ozel?',
        'ru_baslik' => 'Кто такая Гёкче Озель?',
        'de_baslik' => 'Wer ist Gökçe Özel?',
        'fr_baslik' => 'Qui est Gökçe Özel?',
        'ar_baslik' => 'من هي جوكتشه أوزيل؟',
    ],
    22 => [ // Yüz Prosedürleri
        'en_baslik' => 'Facial Procedures',
        'ru_baslik' => 'Процедуры для лица',
        'de_baslik' => 'Gesichtsbehandlungen',
        'fr_baslik' => 'Procédures faciales',
        'ar_baslik' => 'إجراءات الوجه',
    ],
    23 => [ // Ameliyatsız İşlemler
        'en_baslik' => 'Non-Surgical Procedures',
        'ru_baslik' => 'Безоперационные процедуры',
        'de_baslik' => 'Nicht-chirurgische Eingriffe',
        'fr_baslik' => 'Procédures non chirurgicales',
        'ar_baslik' => 'الإجراءات غير الجراحية',
    ],
    64 => [ // Hoşgeldiniz
        'en_baslik' => 'Welcome',
        'ru_baslik' => 'Добро пожаловать',
        'de_baslik' => 'Willkommen',
        'fr_baslik' => 'Bienvenue',
        'ar_baslik' => 'أهلاً بك',
    ]
];

foreach ($updates as $id => $langs) {
    echo "Updating ID $id...<br>";
    foreach ($langs as $col => $val) {
        $q = $baglan->prepare("UPDATE icerik SET $col = :v WHERE id = :id");
        $q->execute(['v' => $val, 'id' => $id]);
    }
}
echo "Manual translation injection complete on LIVE DB.<br>";
// Delete self after running
unlink(__FILE__);
?>
