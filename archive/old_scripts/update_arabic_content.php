<?php
/**
 * Arapça içerik güncelleme scripti
 * kategori='2' olan içeriğe Arapça çeviriyi ekler
 */

header('Content-Type: text/html; charset=utf-8');
mb_internal_encoding('UTF-8');

require 'site_backup/baglanti/baglan.php';

// Arapça çeviri metni
$arabic_content = "<p>أنا خريج كلية الطب الإنجليزية في جامعة إسطنبول - جراح باشا. أكملت تدريبي التخصصي في عيادة الأنف والأذن والحنجرة في مستشفى ديشكابي يلديريم بايزيد للتعليم والبحث.</p>

<p>عملت كعضو هيئة تدريس في قسم الأنف والأذن والحنجرة بكلية الطب بجامعة كيريكالي بين عامي 2013-2021. أصبحت أستاذًا مساعدًا في عام 2015 وأستاذًا في عام 2021.</p>

<p>أنا عضو في مجلس إدارة جمعية جراحة الوجه التجميلية التركية وجمعية جراحة الوجه التجميلية الأوروبية. أنا في المجلس الاستشاري الدولي لجمعية التعاون في الجماليات الطبية (CMAC). لدي أكثر من 100 مقال منشور في المجلات الوطنية والدولية ومؤشر H الخاص بي هو 12.</p>

<p>في ممارسته المهنية، يقدم الخدمات لمرضاه في جميع مجالات تخصص الأنف والأذن والحنجرة.</p>";

echo "Arapça içerik güncelleniyor...\n\n";

// kategori='2' olan içeriği güncelle
$update = $baglan->prepare("UPDATE icerik SET ar_icerik = ? WHERE kategori = '2' AND durum != '-1' ORDER BY id DESC LIMIT 1");
$update->execute([$arabic_content]);

if ($update->rowCount() > 0) {
    echo "✓ Arapça içerik güncellendi!\n";
    echo "Güncellenen kayıt sayısı: " . $update->rowCount() . "\n";
} else {
    echo "⚠ Hiçbir kayıt güncellenmedi.\n";
}

// Kontrol et
$check = $baglan->query("SELECT id, kategori, LENGTH(ar_icerik) as ar_length FROM icerik WHERE kategori='2' LIMIT 1");
$result = $check->fetch(PDO::FETCH_ASSOC);
echo "\nKontrol:\n";
echo "  ID: " . $result['id'] . "\n";
echo "  Arapça içerik uzunluğu: " . $result['ar_length'] . " karakter\n";

echo "\nTamamlandı!\n";

