<?php
header('Content-Type: text/html; charset=utf-8');
mb_internal_encoding('UTF-8');
if (isset($_GET['LN'])) { $_GET['LN'] = strtoupper($_GET['LN']); }
include_once("baglanti/baglantilar_fonksiyonlar.php");
include_once("baglanti/url_helpers.php");

$active_lang_code = isset($_GET['LN']) ? $_GET['LN'] : 'TR';
$ayarlar ="select * from ayarlar"; 
$ayarlarb = sorgu($ayarlar, $baglan); 
$ayarlarb->execute();
$ayarlarl= veriliste($ayarlarb);   

$kurumsal ="select * from icerik where kategori='6'"; 
$kurumsalb = sorgu($kurumsal, $baglan); 
$kurumsalb->execute();
$kurumsall= veriliste($kurumsalb);


 

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
gethostbyname($_SERVER['SERVER_NAME']);

 

$islem=isset($_GET['islem']) ? $_GET['islem']:'';
$sayfa=$_SERVER['REQUEST_URI']; 
$sayfalink=$_SERVER['SCRIPT_NAME']; 

$sayfano=isset($_GET['sayfasayi']) ? $_GET['sayfasayi']:'';
$altsayfano=isset($_GET['altsayfasayi']) ? $_GET['altsayfasayi']:'';

 

$liknbolsonuc = substr($sayfalink, 1, 50);  


$katsayfa= "SELECT id FROM   genel_kategori where link=:linkdal ";
$katsayfab= sorgu($katsayfa, $baglan);
$katsayfab->bindValue(':linkdal',$liknbolsonuc, PDO::PARAM_STR); 
$katsayfab->execute(); 
$katsayfal = veriliste($katsayfab);

// --- GLOBAL SEO DEFAULTS ---
$ln_seo = isset($_GET['LN']) ? $_GET['LN'] : 'TR';

// Default Keywords (Combined from User Request)
$default_keywords = "Burun estetiği Ankara, Rinoplasti uzmanı, Göz kapağı estetiği, Alt blefaroplasti, Üst blefaroplasti, Botoks Ankara, Dolgu uygulamaları, Dudak dolgusu, Dudak kaldırma estetiği, İp ile yüz askılama, Endolift lazer, Lazerle yüz germe, Mezoterapi uygulamaları, Gamze estetiği, Kepçe kulak ameliyatı, Yüz estetiği Ankara, Cerrahsız yüz gençleştirme, PRP gençlik aşısı, Cilt yenileme tedavileri, Yüz şekillendirme, Prof. Dr. Gökçe Özel estetik kliniği, Rhinoplasty in Ankara, Eyelid aesthetics, Botox treatments, Dermal fillers, Lip filler, Endolift laser, Facial aesthetics in Ankara, PRP facial treatment";

// Rotation Logic for Description
if (!isset($_SESSION['seo_rotate'])) $_SESSION['seo_rotate'] = 0;
$_SESSION['seo_rotate'] = 1 - $_SESSION['seo_rotate']; // Toggle 0/1

if ($ln_seo == 'TR' || empty($ln_seo)) {
    // TR Defaults
    if ($_SESSION['seo_rotate'] == 0) {
        $default_desc = "Prof. Dr. Gökçe Özel, Ankara’da burun estetiği, göz kapağı estetiği, botoks, dolgu, Endolift lazer ve yüz gençleştirme uygulamalarında uzmandır.";
    } else {
        $default_desc = "Ankara’da doğal ve zarif yüz estetiği için Prof. Dr. Gökçe Özel kliniğinde burun estetiği, dolgu, botoks ve lazer yüz gençleştirme uygulamaları.";
    }
} else {
    // EN/Global Defaults (For EN, RU, AR, etc. unless specific provided)
    if ($_SESSION['seo_rotate'] == 0) {
        $default_desc = "Prof. Dr. Gökçe Özel, expert in facial aesthetics in Ankara. Rhinoplasty, eyelid surgery, Botox, fillers, and Endolift laser treatments.";
    } else {
        $default_desc = "Experience natural and refined facial aesthetics with Prof. Dr. Gökçe Özel in Ankara. Specialist in rhinoplasty, Botox, fillers and laser rejuvenation.";
    }
}

// Final SEO Variables
$final_title = isset($page_seo_title) && !empty($page_seo_title) ? $page_seo_title : $ayarlarl['siteadi'];
$final_desc = isset($page_seo_description) && !empty($page_seo_description) ? $page_seo_description : $default_desc;
$final_keywords = isset($page_seo_keywords) && !empty($page_seo_keywords) ? $page_seo_keywords : $default_keywords;

?>
<!DOCTYPE html>
<html lang="<?php echo (isset($_GET['LN']) && $_GET['LN'] === 'AR') ? 'ar' : ((isset($_GET['LN']) && $_GET['LN'] === 'EN') ? 'en' : 'tr'); ?>" <?php echo (isset($_GET['LN']) && $_GET['LN'] === 'AR') ? 'dir="rtl"' : ''; ?>>

<head>
	<base href="https://gokceozel.com.tr/">
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
	<meta name="description" content="<?php echo $final_desc; ?>">
    <meta name="keywords" content="<?php echo $final_keywords; ?>">
	<meta name="author" content="eyalcin.com">
	<meta name="format-detection" content="telephone=<?php echo $ayarlarl['telefon']; ?>">
    <meta name="facebook-domain-verification" content="en7z2q1l7dag3tzbpcejbcqbcfvdqj" />
	<title><?php echo $final_title; ?></title>

	<!-- Stylesheets -->
	<link href="vendor/slick/slick.css" rel="stylesheet">
	<link href="vendor/animate/animate.min.css" rel="stylesheet">
	<link href="icons/style.css" rel="stylesheet">
	<link href="vendor/bootstrap-datetimepicker/bootstrap-datetimepicker.css" rel="stylesheet">
	<link href="css/style.css" rel="stylesheet">
	<link href="icons/icofont.css" rel="stylesheet">
	<link href="icons/icofont.min.css" rel="stylesheet">
	<!--Favicon-->
	<link rel="icon" href="images/favicon.png" type="image/x-icon">
	<!-- Google Fonts -->
	<link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900" rel="stylesheet">
	<!-- Google map -->
	<script async src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCiFdr5Z0WRIXKUOqoRRvzRQ5SkzhkUVjk&loading=async"></script>

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-11015866416"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'AW-11015866416');
</script>
 
<script>
  gtag('event', 'conversion', {'send_to': 'AW-11015866416/-thrCJ6NwYUYELCQ44Qp'});
</script>

<!-- Rich Snippets (Schema.org) -->
<script type="application/ld+json">
<?php
// Default Organization Schema
$schema = [
    "@context" => "https://schema.org",
    "@type" => "MedicalBusiness",
    "name" => isset($ayarlarl['siteadi']) ? $ayarlarl['siteadi'] : "Prof. Dr. Gökçe Özel",
    "url" => "https://gokceozel.com.tr",
    "logo" => "https://gokceozel.com.tr/yonetim/dosya/" . (isset($ayarlarl['logo']) ? $ayarlarl['logo'] : 'logo.png'),
    "telephone" => isset($ayarlarl['telefon']) ? $ayarlarl['telefon'] : "",
    "address" => [
        "@type" => "PostalAddress",
        "streetAddress" => isset($ayarlarl['adres']) ? $ayarlarl['adres'] : "Ankara",
        "addressLocality" => "Ankara",
        "addressCountry" => "TR"
    ],
    "priceRange" => "$$"
];

// Content Specific Schema (Article/Service)
// Check if $hzyl exists (populated by blogdetay.php or hizmetdetay.php)
if (isset($hzyl) && is_array($hzyl)) {
    $ln_prefix = isset($_GET['LN']) ? strtolower($_GET['LN']) : 'tr';
    if ($ln_prefix == 'cin') $ln_prefix = 'cin';

    $title = !empty($hzyl[$ln_prefix.'_baslik']) ? $hzyl[$ln_prefix.'_baslik'] : $hzyl['tr_baslik'];
    $desc = !empty($hzyl[$ln_prefix.'_seo_description']) ? $hzyl[$ln_prefix.'_seo_description'] : '';
    $image = !empty($hzyl['belge']) ? "https://gokceozel.com.tr/yonetim/dosya/".$hzyl['belge'] : "https://gokceozel.com.tr/images/logo.png";
    $datePublished = !empty($hzyl['kayit_tarihi']) ? date('c', strtotime($hzyl['kayit_tarihi'])) : date('c');

    // Detect if valid schema type
    if (strpos($_SERVER['PHP_SELF'], 'blogdetay.php') !== false) {
        // BLOG POST
        $schema = [
            "@context" => "https://schema.org",
            "@type" => "BlogPosting",
            "headline" => $title,
            "image" => $image,
            "description" => $desc,
            "datePublished" => $datePublished,
            "author" => [
                "@type" => "Person",
                "name" => "Prof. Dr. Gökçe Özel",
                "url" => "https://gokceozel.com.tr"
            ],
            "publisher" => [
                "@type" => "Organization",
                "name" => "Prof. Dr. Gökçe Özel",
                "logo" => [
                    "@type" => "ImageObject",
                    "url" => "https://gokceozel.com.tr/yonetim/dosya/" . (isset($ayarlarl['logo']) ? $ayarlarl['logo'] : 'logo.png')
                ]
            ]
        ];
    } elseif (strpos($_SERVER['PHP_SELF'], 'hizmetdetay.php') !== false) {
        // MEDICAL PROCEDURE / SERVICE
        $schema = [
            "@context" => "https://schema.org",
            "@type" => "MedicalWebPage",
            "name" => $title,
            "description" => $desc,
            "url" => "https://gokceozel.com.tr" . $_SERVER['REQUEST_URI'],
            "lastReviewed" => $datePublished,
            "reviewedBy" => [
                "@type" => "Person",
                "name" => "Prof. Dr. Gökçe Özel"
            ],
            "about" => [
                 "@type" => "MedicalProcedure",
                 "name" => $title,
                 "procedureType" => "Surgical" 
            ]
        ];
    }
}

echo json_encode($schema, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
?>
</script>

<style>
/* Custom Navbar Behavior: Never Wrap, Force Sandwich if needed */
.navbar-nav {
    flex-wrap: nowrap; /* Prevent wrapping on large screens */
}

/* Force Mobile Menu behavior for screens up to 1350px */
@media (max-width: 1350px) {
    /* KEY FIX: The toggler is OUTSIDE the navbar-expand-xl container 
       so we must target it directly, not as a child. */
    .navbar-toggler {
        display: block !important;
    }
    
    /* Force main menu to act like mobile menu */
    .navbar-expand-xl .navbar-collapse {
        display: none !important;
        position: absolute;
        top: 100%;
        right: 0;
        left: auto !important; /* Disable full width */
        width: 320px;          /* Drawer Width */
        max-width: 95vw;
        background: #fff;
        z-index: 1000;
        padding: 0;            /* Reset padding for flush list */
        box-shadow: 0 10px 30px rgba(0,0,0,0.15); /* Softer, deeper shadow */
        border-top: 2px solid #333; /* Accent line */
        border-radius: 0 0 0 10px;
    }
    .navbar-expand-xl .navbar-collapse.show {
        display: block !important;
        animation: slideInMenu 0.3s ease-out forwards;
    }
    
    @keyframes slideInMenu {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .navbar-expand-xl .navbar-nav {
        flex-direction: column;
        width: 100%;
    }
    .navbar-expand-xl .navbar-nav .nav-item {
        border-bottom: 1px solid #f5f5f5;
    }
    .navbar-expand-xl .navbar-nav .nav-link {
        padding: 15px 25px;
        font-weight: 500;
        color: #333;
        transition: all 0.3s ease;
        position: relative;
        display: block; /* Ensure full width click area */
    }
    .navbar-expand-xl .navbar-nav .nav-link:hover {
        background-color: #f9f9f9;
        padding-left: 35px; /* Indent effect */
        color: #000;
    }
    /* Add Arrow Icon on Hover */
    .navbar-expand-xl .navbar-nav .nav-link::after {
        content: '';
        position: absolute;
        right: 25px;
        top: 50%;
        transform: translateY(-50%);
        width: 6px;
        height: 6px;
        border-top: 2px solid #ccc;
        border-right: 2px solid #ccc; /* Chevron shape */
        opacity: 0;
        transition: all 0.3s ease;
        transform: translateY(-50%) rotate(45deg);
    }
    .navbar-expand-xl .navbar-nav .nav-link:hover::after {
        opacity: 1;
        border-color: #000;
        right: 20px; /* Slight movement */
    }
    
    /* Ensure Header content does not overlap */
    .header-content {
        position: relative;
    }
    
    /* Ensure navigation container allows flex manipulation */
    .header-nav-wrap {
        position: static; /* Allow collapse to be full width relative to header */
    }
}


/* FORCE RESET for Header Controls */
#header-controls-wrapper {
    position: absolute !important;
    top: 0 !important;
    bottom: 0 !important;
    right: 15px !important;
    transform: none !important;
    margin: 0 !important;
    padding: 0 !important;
    line-height: 1 !important;
    display: flex !important;
    align-items: center !important;
    z-index: 9999 !important;
}
#header-lang-wrapper {
    top: 0 !important;
    margin-top: 0 !important;
    padding-top: 0 !important;
    transform: none !important;
    position: relative !important;
    float: none !important;
    display: flex !important;
    align-items: center !important;
    height: auto !important;
}
#header-lang-wrapper .icon-globe1 {
    font-size: 24px !important;
    line-height: 1 !important;
    color: #444 !important;
    display: block !important;
    margin: 0 !important;
    padding: 0 !important;
}
.header-lang-dropdown {
    position: absolute !important;
    top: 100% !important;
    right: 0 !important;
    left: auto !important; /* Fix overflow: override any left positioning */
    /* Ensure it doesn't expand the wrapper */
}
#sandwich-menu-btn {
    position: relative !important;
    top: 0 !important;
    margin: 0 0 0 20px !important;
    padding: 0 !important;
    transform: none !important;
    line-height: 1 !important;
    display: flex !important; /* Ensure it is visible if parent allows */
    align-items: center !important;
    border: none !important;
    outline: none !important;
    height: auto !important;
    float: none !important;
}
#sandwich-menu-btn .icon-menu {
    vertical-align: middle !important;
    line-height: 1 !important;
    font-size: 24px !important; 
    color: #444 !important;
    display: block !important;
    margin: 0 !important;
}
@media (min-width: 1351px) {
    #sandwich-menu-btn {
        display: none !important;
    }
}
</style>
</head>

<body class="shop-page">
	<!--header-->
	<header class="header">
		<div class="header-mobile-info">
			<div class="header-mobile-info-content js-info-content">
				<ul class="icn-list-sm">
					<li><i class="icon-placeholder2"></i><?php echo $ayarlarl['adres']; ?>
					</li>
					<li><i class="icon-telephone"></i><span class="text-nowrap" dir="ltr"><?php echo $ayarlarl['telefon']; ?></span>, <span class="text-nowrap" dir="ltr"><?php echo $ayarlarl['telefon']; ?></span></li>
					<li><i class="icon-black-envelope"></i><a href="mailto:<?php echo $ayarlarl['mail']; ?>"><?php echo $ayarlarl['mail']; ?></a></li>
					<li><i class="icon-clock"></i>Pzt-Cum: 08:00 - 19:00
						<br> Cmt: 10:00 - 16:00</li>
				</ul>
			</div>
		</div>
		<div class="header-mobile-top">
			<div class="container">
				<div class="row align-items-center">
					<div class="col-3">
						<div class="header-mobile-info-toggle js-info-toggle"></div>
					</div>
					<div class="col-auto header-button-wrap ml-auto">
						<?php if(defined('IS_RANDEVU_PAGE')) { ?>
							<a href="#zl-url-page" class="btn"><i class="icon-right-arrow"></i><?php echo metin('btn_randevu_al'); ?><i class="icon-right-arrow"></i></a>
						<?php } else { ?>
							<a href="#" class="btn" data-toggle="modal" data-target="#modalBookingForm"><i class="icon-right-arrow"></i><?php echo metin('btn_randevu_al'); ?><i class="icon-right-arrow"></i></a>
						<?php } ?>
					</div>
				</div>
			</div>
		</div>
		<div class="header-topline d-none d-lg-flex">
			<div class="container">
				<div class="row align-items-center">
					<div class="col-auto d-flex align-items-center">
						<div class="header-phone"><i class="icon-telephone"></i><a href="tel:<?php echo $ayarlarl['telefon']; ?>" dir="ltr"><?php echo $ayarlarl['telefon']; ?></a></div>
						<div class="header-info"><i class="icon-placeholder2"></i><?php echo $ayarlarl['adres']; ?></div>
						<div class="header-info"><i class="icon-black-envelope"></i><a href="mailto:<?php echo $ayarlarl['mail']; ?>"><?php echo $ayarlarl['mail']; ?></a></div>
					</div>
					<div class="col-auto ml-auto d-flex align-items-center">
						<span class="header-social">
							<a href="<?php echo $ayarlarl['facebook']; ?>"  target="blank" class="hovicon"><i style="font-size:25px; margin:10px" class="icofont-facebook"></i></a>
							<a href="<?php echo $ayarlarl['twitter']; ?>"  target="blank" class="hovicon"><i style="font-size:25px; margin:10px" class="icofont-twitter"></i></a>
							<a href="<?php echo $ayarlarl['instagram']; ?>"  target="blank" class="hovicon"><i style="font-size:25px; margin:10px" class="icofont-instagram"></i></a>
							<a href="<?php echo $ayarlarl['youtube']; ?>"  target="blank" class="hovicon"><i style="font-size:25px; margin:10px" class="icofont-youtube"></i></a>
							<a href="<?php echo $ayarlarl['linkedin']; ?>"  target="blank" class="hovicon"><i style="font-size:25px; margin:10px"  class="icofont-linkedin"></i></a>
						</span>
					</div>
				</div>
			</div>
		</div>
		<div class="header-content">
			<div class="container-fluid" style="position: relative;">
				<div class="row align-items-center">

					<div class="col-auto col-lg-auto col-lg-2 d-flex align-items-center">
						<a href="index.php?LN=<?php echo isset($_GET['LN']) ? $_GET['LN']:'';?>" class="header-logo"><img src="yonetim/dosya/<?php echo $ayarlarl['logo']; ?>"    alt="<?php echo $ayarlarl['siteadi']; ?>" class="img-fluid"></a>
					</div>
					<div class="col ml-auto header-nav-wrap" style="padding-right: 120px;">
						<div class="header-nav js-header-nav">
							<nav class="navbar navbar-expand-xl btco-hover-menu">
								<div class="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
									<ul class="navbar-nav">

    <?php
    // Determine current language
    $ln = isset($_GET['LN']) ? $_GET['LN'] : 'TR';
    $lang_col = 'tr_isim';
    $show_col = 'tr_goster';
    
    if ($ln === 'EN') { $lang_col = 'en_isim'; $show_col = 'en_goster'; }
    elseif ($ln === 'RU') { $lang_col = 'ru_isim'; $show_col = 'ru_goster'; }
    elseif ($ln === 'AR') { $lang_col = 'ar_isim'; $show_col = 'ar_goster'; }
    elseif ($ln === 'DE') { $lang_col = 'de_isim'; $show_col = 'de_goster'; }
    elseif ($ln === 'FR') { $lang_col = 'fr_isim'; $show_col = 'fr_goster'; }
    elseif ($ln === 'CIN') { $lang_col = 'cin_isim'; $show_col = 'cin_goster'; }

    // Fetch main categories
    // Logic: Must be active (durum=1), top menu (ust_menu=1), and visible in current language
    $kategori = "SELECT * FROM genel_kategori 
                 WHERE ust_menu='1' 
                 AND durum='1' 
                 AND anakategori='0' 
                 AND ($show_col='1' OR $show_col IS NULL)
                 AND ($lang_col IS NOT NULL AND $lang_col != '')
                 ORDER BY sira";
    
    $kategorib = sorgu($kategori, $baglan);
    $kategorib->execute();                                                                      
    ?>                                   
    <?php while ($ktl = veriliste($kategorib)) { 
        // User requested: Blog should NOT be visible in Turkish but visible in other languages.
        if ($ln === 'TR' && strpos($ktl['link'], 'blog.php') !== false) {
            continue;
        }
        
        // Fetch subcategories with same logic
        $altkategori = "SELECT * FROM genel_kategori 
                        WHERE ust_menu='1' 
                        AND durum='1' 
                        AND anakategori=:ustid 
                        AND ($show_col='1' OR $show_col IS NULL)
                        AND ($lang_col IS NOT NULL AND $lang_col != '')
                        ORDER BY sira";
        
        $altkategorib = sorgu($altkategori, $baglan);
        $altkategorib->bindValue(':ustid', $ktl['id'], PDO::PARAM_INT);      
        $altkategorib->execute(); 
        $altkategoril = veriliste($altkategorib);                                                                     
        ?>  
        <li class="nav-item">
            <a 
                <?php if (isset($altkategoril['id'])) { ?>
                    class="nav-link dropdown-toggle" 
                    href="javascript:void(0);" 
                    data-toggle="dropdown"
                <?php } else { ?>
                    class="nav-link" 
                    href="<?php echo get_menu_link($ktl, $active_lang_code); ?>"
                <?php } ?>
            >
                <?php echo $ktl[$lang_col]; ?>
            </a>

            <?php if (isset($altkategoril['id'])) { ?>
                <ul class="dropdown-menu">
                    <?php 
                    $kaltkategorib = sorgu($altkategori, $baglan);
                    $kaltkategorib->bindValue(':ustid', $ktl['id'], PDO::PARAM_INT);      
                    $kaltkategorib->execute(); 
                    while ($kaltkategoril = veriliste($kaltkategorib)) {  
                    ?> 
                        <li>
                            <a 
                                class="dropdown-item" 
                                href="<?php echo get_menu_link($kaltkategoril, $active_lang_code); ?>"
                            >
                                <?php echo $kaltkategoril[$lang_col]; ?>
                            </a>
                        </li>
                    <?php } ?>
                </ul>
            <?php } ?>
        </li>
    <?php } ?>
</ul>
								</div>
							</nav>
						</div>
						</div>
					</div> <!-- End of header-nav-wrap -->

					</div> <!-- End of Row -->
					
					<!-- Absolute Key Controls: Pinpoint Fixed Position -->
					<div id="header-controls-wrapper">
						<div id="header-lang-wrapper" class="header-lang lang-toggler">
							<a href="#" class="icon icon-globe1"></a>
							<div class="header-lang-dropdown">
								<ul>
									<li><a href="?LN=TR&detay=<?php echo isset($_GET['detay']) ? $_GET['detay']:'';?>"><span class="header-lang-flag"><img src="images/flag/flag_tr.png" style="height:10px" alt="Türkçe"></span><span>Türkçe</span></a></li>
									<li><a href="?LN=EN&detay=<?php echo isset($_GET['detay']) ? $_GET['detay']:'';?>"><span class="header-lang-flag"><img src="images/flag/flag_en.png" style="height:10px"  alt="English"></span><span>English</span></a></li>
									<li><a href="?LN=RU&detay=<?php echo isset($_GET['detay']) ? $_GET['detay']:'';?>"><span class="header-lang-flag"><img src="images/flag/flag_ru.png" style="height:10px"  alt="Русский"></span><span>Русский</span></a></li>
                                    <li><a href="?LN=DE&detay=<?php echo isset($_GET['detay']) ? $_GET['detay']:'';?>"><span class="header-lang-flag"><img src="images/flag/flag_de.png" style="height:10px"  alt="DEUTSCHE"></span><span>Deutsche</span></a></li>
                                    <li><a href="?LN=AR&detay=<?php echo isset($_GET['detay']) ? $_GET['detay']:'';?>"><span class="header-lang-flag"><img src="images/flag/flag_ar.png" style="height:10px"  alt="عربى"></span><span>عربى</span></a></li>
                                    <li><a href="?LN=CIN&detay=<?php echo isset($_GET['detay']) ? $_GET['detay']:'';?>"><span class="header-lang-flag"><img src="images/flag/flag_cn.png" style="height:10px"  alt="中文"></span><span>中文</span></a></li>
									 </ul>
							</div>
						</div>
						<button id="sandwich-menu-btn" class="navbar-toggler collapsed" data-toggle="collapse" data-target="#navbarNavDropdown">
							<span class="icon-menu"></span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</header>
	<!--//header-->
    
    <?php if (basename($_SERVER['PHP_SELF']) == 'index.php' && !defined('HIDE_SLIDER')) { include("slider.php"); } ?>