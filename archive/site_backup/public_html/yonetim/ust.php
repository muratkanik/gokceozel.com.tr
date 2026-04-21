<?php
header('Content-Type: text/html; charset=utf-8');
mb_internal_encoding('UTF-8');
ob_start();
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
// Giriş sayfasında ise kontrol yapma
$current_page = basename($_SERVER['PHP_SELF']);
if ($current_page != 'giris.php' && $current_page != 'cikis.php' && $current_page != 'login.php') {
    $tokenkontrol = isset($_SESSION['jetonal']) ? preg_match("/6e5y7a1l6c3i2n3/", $_SESSION['jetonal']) : false;
    if(!$tokenkontrol && (!isset($_SESSION['jetonal']) || $_SESSION['jetonal']=='')){
        header("location: cikis.php");  exit;
    }
} 

// Force trailing slash for directory access (fixes relative link resolution)
if (basename($_SERVER['PHP_SELF']) == 'index.php' && 
    substr($_SERVER['REQUEST_URI'], -1) != '/' && 
    strpos($_SERVER['REQUEST_URI'], 'index.php') === false &&
    strpos($_SERVER['REQUEST_URI'], '?') === false) {
    header("Location: " . $_SERVER['REQUEST_URI'] . "/");
    exit;
}
  
include("baglanti/baglantilar_fonksiyonlar.php"); 
include("baglanti/sayfa_yetki_fonksiyonu.php");

$kullanicijeton = isset($_SESSION['jetonal']) ? $_SESSION['jetonal'] : ''; 

function GetIP(){
	if(getenv("HTTP_CLIENT_IP")) {
 		$ip = getenv("HTTP_CLIENT_IP");
 	} elseif(getenv("HTTP_X_FORWARDED_FOR")) {
 		$ip = getenv("HTTP_X_FORWARDED_FOR");
 		if (strstr($ip, ',')) {
 			$tmp = explode (',', $ip);
 			$ip = trim($tmp[0]);
 		}
 	} else {
 	$ip = getenv("REMOTE_ADDR");
 	}
	return $ip;
}

$ipsonuc=GetIP();

$islem=isset($_GET['islem']) ? $_GET['islem']:'';
$sayfa=$_SERVER['REQUEST_URI']; 
$sayfalink=$_SERVER['SCRIPT_NAME']; 

// Admin Page Tracking Logic - Preserved
$liknbolsonuc = substr($sayfalink, 1, 50);  
$yonetimlinkayar=stristr($liknbolsonuc,'/');
$yonetimlink = substr($yonetimlinkayar, 1, 50); 
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($_SESSION['siteadi']) ? $_SESSION['siteadi'] : 'Yönetim Paneli'; ?></title>
    <link rel="icon" href="../favicon.ico" type="image/x-icon" />
    
    <!-- Bootstrap 5 CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Custom Admin CSS -->
    <link href="assets/css/admin.css" rel="stylesheet">
    
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>

<div class="sidebar">
    <div class="sidebar-header">
        <i class="bi bi-hospital me-2"></i> Dr. Gökçe CMS
    </div>
    
    <div class="sidebar-menu">
        <nav class="nav flex-column">
            <a href="index.php" class="nav-link <?php echo ($current_page == 'index.php' || $current_page == 'dashboard.php') ? 'active' : ''; ?>">
                <i class="bi bi-speedometer2"></i> Dashboard
            </a>
            
            <div class="sidebar-footer mt-2 mb-2">
                <small class="text-uppercase text-muted ps-3" style="font-size: 0.75rem; letter-spacing: 1px;">İçerik Yönetimi</small>
            </div>
            
             <?php 
                 // Dynamic Menu Generation based on 'kategoriler' table and permissions
                 $anakat = "SELECT kg.isim, kg.id, kg.ikon, kt.id ktid, link 
                            FROM kategoriler as kt 
                            INNER JOIN kullanici_yetki as ky on ky.kategori_id=kt.id 
                            INNER JOIN kategori_grup as kg on kt.grup=kg.id 
                            WHERE grup!='' 
                            AND ky.kullanici_id=:kidal 
                            AND kt.durum!='0' 
                            AND ky.durum='1' 
                            GROUP BY kg.isim, kg.id, kg.sira, kg.ikon, kt.id, link 
                            ORDER BY kg.sira"; 
                  
                 $anamenukatverilerb = sorgu($anakat, $baglan); 
                 $anamenukatverilerb->bindValue(':kidal', temizlikimandan($_SESSION['kullaniciid']), PDO::PARAM_INT);     
                 $anamenukatverilerb->execute();
                 
                 while ($menukategoriilkveri = veriliste($anamenukatverilerb)) {
                     // Check if this group has sub-items
                     $has_sub = ($menukategoriilkveri['link'] == '');
                     
                     // Name Override
                     $mainName = $menukategoriilkveri['isim'];
                     if ($mainName == 'İçerik Kayıt') $mainName = 'İçerik Ekle';

                     // Icon Logic Enhancement
                     $iconClass = $menukategoriilkveri['ikon'];
                     // Convert legacy FA to BI
                     $iconClass = str_replace(['fa ', 'fa-'], ['', 'bi-'], $iconClass);
                     
                     // Default Icons if empty or generic
                     if (empty($iconClass) || $iconClass == 'bi-') {
                         if (stripos($mainName, 'Ayarlar') !== false) $iconClass = 'bi-gear';
                         elseif (stripos($mainName, 'İçerik') !== false) $iconClass = 'bi-file-text';
                         elseif (stripos($mainName, 'Kullanıcı') !== false) $iconClass = 'bi-people';
                         elseif (stripos($mainName, 'Mesaj') !== false) $iconClass = 'bi-envelope';
                         elseif (stripos($mainName, 'İstatistik') !== false) $iconClass = 'bi-bar-chart';
                         else $iconClass = 'bi-circle';
                     }

                     if (!$has_sub) {
                         // Direct Link
                         $isActive = (strpos($_SERVER['REQUEST_URI'], $menukategoriilkveri['link']) !== false) ? 'active' : '';
                         ?>
                         <a href="<?php echo $menukategoriilkveri['link']; ?>" class="nav-link <?php echo $isActive; ?>">
                             <i class="bi <?php echo $iconClass; ?>"></i> 
                             <?php echo $mainName; ?>
                         </a>
                         <?php
                     } else {
                         // Collapsible Group
                         ?>
                         <div class="nav-group mb-3">
                             <div class="px-3 py-2 text-white-50 small text-uppercase d-flex align-items-center" style="font-size: 0.7rem; letter-spacing: 0.5px;">
                                <i class="bi <?php echo $iconClass; ?> me-2"></i> <?php echo $mainName; ?>
                             </div>
                             <?php
                               $altkat = "SELECT kt.id id, kt.isim isim, kt.anakategori anakategori, kt.sira, kt.link 
                                          FROM kategoriler as kt 
                                          INNER JOIN kullanici_yetki as ky on ky.kategori_id=kt.id 
                                          WHERE kt.anakategori='".temizlikimandan($menukategoriilkveri['ktid'])."'  
                                          AND ky.kullanici_id=:kidal 
                                          AND ky.durum='1' 
                                          AND kt.durum='1' 
                                          ORDER BY kt.sira "; 
                               
                               $altkatverilerb = sorgu($altkat, $baglan);
                               $altkatverilerb->bindValue(':kidal', temizlikimandan($_SESSION['kullaniciid']), PDO::PARAM_INT);  
                               $altkatverilerb->execute();  
                               
                               while ($alt = veriliste($altkatverilerb)) {
                                   $isActive = (strpos($_SERVER['REQUEST_URI'], $alt['link']) !== false) ? 'active' : '';
                                   
                                   // Sub-item Name Override
                                   $subName = $alt['isim'];
                                   if ($subName == 'İçerik Kayıt') $subName = 'İçerik Ekle';
                                   if ($subName == 'İçerik Rapor') $subName = 'İçerik Listele';
                                   // if ($subName == 'İçerik Listele') $subName = 'İçerik Listesi'; // Removed or kept? User wants "İçerik Listele" explicitly.

                                   echo '<a href="'.$alt['link'].'" class="nav-link '.$isActive.'"><i class="bi bi-chevron-right" style="font-size:0.8rem"></i> '.$subName.'</a>';
                               }
                               
                               // Special Injections for "İçerik İşlemleri"
                               if (stripos($mainName, 'İçerik') !== false || stripos($mainName, 'icerik') !== false) {
                                   $catActive = (basename($_SERVER['PHP_SELF']) == 'kategori_yonetimi.php') ? 'active' : '';
                                   $langActive = (basename($_SERVER['PHP_SELF']) == 'dil_yonetimi.php') ? 'active' : '';
                                   echo '<a href="kategori_yonetimi.php" class="nav-link '.$catActive.'"><i class="bi bi-folder2-open"></i> Kategori Yönetimi</a>';
                                   echo '<a href="dil_yonetimi.php" class="nav-link '.$langActive.'"><i class="bi bi-translate"></i> Dil Yönetimi</a>';
                               }
                             ?>
                         </div>
                         <?php
                     }
                 }
             ?>
             
             <div class="sidebar-footer mt-4">
                 <!-- Ayarlar removed to prevent duplicate -->
                 <a href="cikis.php" class="nav-link text-danger"><i class="bi bi-box-arrow-right"></i> Çıkış Yap</a>
             </div>
        </nav>
    </div>
</div>

<div class="main-content">
    <header class="top-header">
        <button class="toggle-sidebar"><i class="bi bi-list"></i></button>
        
        <div class="d-flex align-items-center">
            <h5 class="mb-0 me-3 d-none d-md-block">Yönetim Paneli</h5>
        </div>
        
        <div class="dropdown">
            <a href="#" class="d-flex align-items-center text-decoration-none dropdown-toggle text-dark" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="images/avyok.jpg" alt="User" width="32" height="32" class="rounded-circle me-2">
                <span class="d-none d-sm-inline"><?php echo isset($_SESSION['adi']) ? $_SESSION['adi'] : 'Admin'; ?></span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><a class="dropdown-item" href="profilim.php"><i class="bi bi-person me-2"></i> Profil</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" href="cikis.php"><i class="bi bi-box-arrow-right me-2"></i> Çıkış</a></li>
            </ul>
        </div>
    </header>
    
    <div class="p-4" style="min-height: calc(100vh - 64px);">