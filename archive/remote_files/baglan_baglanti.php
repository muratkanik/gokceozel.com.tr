<?php
$sunucu='localhost';
$dbkullanici='eyalcin_gokceozel';
$dbsifre='Gokce.135246';
$db='eyalcin_gokceozel';
try {
$baglan = new PDO("mysql:host=$sunucu;dbname=$db", $dbkullanici, $dbsifre, array(PDO::ATTR_PERSISTENT => true));
$baglan->query("SET CHARACTER SET utf8");
$baglan->prepare("SET CHARACTER SET utf8");
$baglan->exec("SET NAMES 'utf8'");
$baglan->exec("SET CHARSET 'utf8'");
}catch(PDOException $e) {
 die( $e->getMessage());
}

?>

