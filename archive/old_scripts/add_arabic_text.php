<?php
/**
 * Arapça metin ekleme scripti
 * Randevu, blog, hizmetler vb. sayfalardaki hardcoded metinlere Arapça çeviri ekler
 */

header('Content-Type: text/html; charset=utf-8');
mb_internal_encoding('UTF-8');

// Arapça çeviri metni
$arabic_text = "أنا خريج كلية الطب الإنجليزية في جامعة إسطنبول - جراح باشا. أكملت تدريبي التخصصي في عيادة الأنف والأذن والحنجرة في مستشفى ديشكابي يلديريم بايزيد للتعليم والبحث.<br><br>

عملت كعضو هيئة تدريس في قسم الأنف والأذن والحنجرة بكلية الطب بجامعة كيريكالي بين عامي 2013-2021. أصبحت أستاذًا مساعدًا في عام 2015 وأستاذًا في عام 2021.<br><br>

أنا عضو في مجلس إدارة جمعية جراحة الوجه التجميلية التركية وجمعية جراحة الوجه التجميلية الأوروبية. أنا في المجلس الاستشاري الدولي لجمعية التعاون في الجماليات الطبية (CMAC). لدي أكثر من 100 مقال منشور في المجلات الوطنية والدولية ومؤشر H الخاص بي هو 12.<br><br>

في ممارسته المهنية، يقدم الخدمات لمرضاه في جميع مجالات تخصص الأنف والأذن والحنجرة.";

echo "Arapça metin hazır:\n";
echo substr($arabic_text, 0, 100) . "...\n\n";

echo "Bu metin şu dosyalara eklenecek:\n";
echo "- randevu.php\n";
echo "- blog.php\n";
echo "- hizmetler.php\n";
echo "- fotogaleri.php\n";
echo "- hizmetdetay.php\n";
echo "- blogdetay.php\n\n";

echo "Metin hazır! Manuel olarak dosyalara eklenebilir.\n";

