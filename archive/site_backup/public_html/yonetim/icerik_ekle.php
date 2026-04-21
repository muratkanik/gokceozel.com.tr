<?php include("ust.php"); 
sayfayetkikontrol(3);  
 
    $eskayit= substr(md5(rand(0,9999999999)),-20)."".date("Ymd").""."eyalcin".substr(md5(rand(0,9999999999)),-20);	  			   

/*
// AUTO-MIGRATION: Check (and add) missing columns for SEO and Chinese support
try {
    $langs = ['tr', 'en', 'ru', 'ar', 'fr', 'de', 'cin'];
    foreach ($langs as $lang) {
        // SEO Columns
        $cols = ["{$lang}_seo_title", "{$lang}_seo_description"];
        
        // Extended checks for 'cin' (Chinese) if potentially missing entire set
        if ($lang === 'cin') {
            $cols[] = "cin_baslik";
            $cols[] = "cin_icerik";
            $cols[] = "cin_detay";
        }

        foreach ($cols as $col) {
            $check = $baglan->query("SHOW COLUMNS FROM icerik LIKE '$col'");
            if ($check->rowCount() == 0) {
                // Determine type
                $type = (strpos($col, 'icerik') !== false || strpos($col, 'detay') !== false || strpos($col, 'description') !== false) ? 'TEXT' : 'VARCHAR(255)';
                $baglan->exec("ALTER TABLE icerik ADD COLUMN $col $type DEFAULT NULL");
            }
        }
    }
} catch (Exception $e) {
    // Silent fail or log
    error_log("Icerik Migration Error: " . $e->getMessage());
}
*/
if (isset($_POST['formgenelkayit']) && $_POST['formgenelkayit']=='1') 
{
    
 $baglan->beginTransaction();   
    
    $katgel=$_POST['kategori'];
    $tarihgel=$_POST['tarih'];
    
    $trbaslikgel=$_POST['trbaslik'];
    $tricerikgel=$_POST['tricerik'];
    $trdetaygel=$_POST['trdetay'];
    $trseotitlegel=isset($_POST['trseotitle']) ? $_POST['trseotitle'] : '';
    $trseodescriptiongel=isset($_POST['trseodescription']) ? $_POST['trseodescription'] : '';
    
    $enbaslikgel=$_POST['enbaslik'];
    $enicerikgel=$_POST['enicerik'];
    $endetaygel=$_POST['endetay'];
    $enseotitlegel=isset($_POST['enseotitle']) ? $_POST['enseotitle'] : '';
    $enseodescriptiongel=isset($_POST['enseodescription']) ? $_POST['enseodescription'] : '';
    
    $rubaslikgel=$_POST['rubaslik'];
    $ruicerikgel=$_POST['ruicerik'];
    $rudetaygel=$_POST['rudetay'];
    $ruseotitlegel=isset($_POST['ruseotitle']) ? $_POST['ruseotitle'] : '';
    $ruseodescriptiongel=isset($_POST['ruseodescription']) ? $_POST['ruseodescription'] : '';
    
    $arbaslikgel=$_POST['arbaslik'];
    $aricerikgel=$_POST['aricerik'];
    $ardetaygel=$_POST['ardetay'];
    $arseotitlegel=isset($_POST['arseotitle']) ? $_POST['arseotitle'] : '';
    $arseodescriptiongel=isset($_POST['arseodescription']) ? $_POST['arseodescription'] : '';
    
    $frbaslikgel=$_POST['frbaslik'];
    $fricerikgel=$_POST['fricerik'];
    $frdetaygel=$_POST['frdetay'];
    $frseotitlegel=isset($_POST['frseotitle']) ? $_POST['frseotitle'] : '';
    $frseodescriptiongel=isset($_POST['frseodescription']) ? $_POST['frseodescription'] : '';
    
    $debaslikgel=$_POST['debaslik'];
    $deicerikgel=$_POST['deicerik'];
    $dedetaygel=$_POST['dedetay'];
    $deseotitlegel=isset($_POST['deseotitle']) ? $_POST['deseotitle'] : '';
    $deseodescriptiongel=isset($_POST['deseodescription']) ? $_POST['deseodescription'] : '';

    $cinbaslikgel=$_POST['cinbaslik'];
    $cinicerikgel=$_POST['cinicerik'];
    $cindetaygel=$_POST['cindetay'];
    $cinseotitlegel=isset($_POST['cinseotitle']) ? $_POST['cinseotitle'] : '';
    $cinseodescriptiongel=isset($_POST['cinseodescription']) ? $_POST['cinseodescription'] : '';
    
 
    $formeskayit=$_POST['eskayit'];

    $kayityapankullanicigel=addslashes($_SESSION['kullaniciid']);
    $kayittarihigel=date('Y.m.d H:i:s');  ;
    $kayitdurumugel='1';
    
           if (isset($_POST['tutar']) && $_POST['tutar']!='') {
$uzanti = $_POST['tutar'];
$noktatemizle=str_replace(".","",$uzanti);
$virgultemizle=str_replace(",",".",$noktatemizle);
$fiyat = $virgultemizle;
 
} 
 
       $kayit="insert into icerik
  	  (kategori
      ,tarih
     
      ,tr_baslik
      ,tr_icerik
      ,tr_detay
      ,tr_seo_title
      ,tr_seo_description
      ,en_baslik
      ,en_icerik
      ,en_detay
      ,en_seo_title
      ,en_seo_description
      ,ru_baslik
      ,ru_icerik
      ,ru_detay
      ,ru_seo_title
      ,ru_seo_description
      ,ar_baslik
      ,ar_icerik
      ,ar_detay
      ,ar_seo_title
      ,ar_seo_description
      ,fr_baslik
      ,fr_icerik
      ,fr_detay
      ,fr_seo_title
      ,fr_seo_description
      ,de_baslik
      ,de_icerik
      ,de_detay
      ,de_seo_title
      ,de_seo_description
      ,cin_baslik
      ,cin_icerik
      ,cin_detay
      ,cin_seo_title
      ,cin_seo_description
 
      ,eskayit
      ,kayit_yapan_kullanici
      ,kayit_tarihi
      ,durum)
 VALUES 
     (
       :katal
      ,:tarihal
    
      ,:trbaslikal
      ,:tricerikal
      ,:trdetayal
      ,:trseotitleal
      ,:trseodescriptional
      ,:enbaslikal
      ,:enicerikal
      ,:endetayal
      ,:enseotitleal
      ,:enseodescriptional
      ,:rubaslikal
      ,:ruicerikal
      ,:rudetayal
      ,:ruseotitleal
      ,:ruseodescriptional
      ,:arbaslikal
      ,:aricerikal
      ,:ardetayal
      ,:arseotitleal
      ,:arseodescriptional
      ,:frbaslikal
      ,:fricerikal
      ,:frdetayal
      ,:frseotitleal
      ,:frseodescriptional
      ,:debaslikal
      ,:deicerikal
      ,:dedetayal
      ,:deseotitleal
      ,:deseodescriptional
      ,:cinbaslikal
      ,:cinicerikal
      ,:cindetayal
      ,:cinseotitleal
      ,:cinseodescriptional
  
      ,:eskayit
      ,:kayit_yapan_kullanici
      ,:kayit_tarihi
      ,:durum
      ,:son_guncelleme) ";
$kayitveri= guncel($kayit, $baglan);
    $kayitveri->bindValue(':katal',$katgel, PDO::PARAM_INT);  
    $kayitveri->bindValue(':tarihal',$tarihgel, PDO::PARAM_STR);
    
    $kayitveri->bindValue(':trbaslikal',$trbaslikgel, PDO::PARAM_STR);  
    $kayitveri->bindValue(':tricerikal',$tricerikgel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':trdetayal',$trdetaygel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':trseotitleal',$trseotitlegel, PDO::PARAM_STR);
    $kayitveri->bindValue(':trseodescriptional',$trseodescriptiongel, PDO::PARAM_STR);
    
    $kayitveri->bindValue(':enbaslikal',$enbaslikgel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':enicerikal',$enicerikgel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':endetayal',$endetaygel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':enseotitleal',$enseotitlegel, PDO::PARAM_STR);
    $kayitveri->bindValue(':enseodescriptional',$enseodescriptiongel, PDO::PARAM_STR);
    
     $kayitveri->bindValue(':rubaslikal',$rubaslikgel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':ruicerikal',$ruicerikgel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':rudetayal',$rudetaygel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':ruseotitleal',$ruseotitlegel, PDO::PARAM_STR);
    $kayitveri->bindValue(':ruseodescriptional',$ruseodescriptiongel, PDO::PARAM_STR);
    
     $kayitveri->bindValue(':arbaslikal',$arbaslikgel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':aricerikal',$aricerikgel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':ardetayal',$ardetaygel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':arseotitleal',$arseotitlegel, PDO::PARAM_STR);
    $kayitveri->bindValue(':arseodescriptional',$arseodescriptiongel, PDO::PARAM_STR);
    
     $kayitveri->bindValue(':frbaslikal',$frbaslikgel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':fricerikal',$fricerikgel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':frdetayal',$frdetaygel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':frseotitleal',$frseotitlegel, PDO::PARAM_STR);
    $kayitveri->bindValue(':frseodescriptional',$frseodescriptiongel, PDO::PARAM_STR);
    
     $kayitveri->bindValue(':debaslikal',$debaslikgel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':deicerikal',$deicerikgel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':dedetayal',$dedetaygel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':deseotitleal',$deseotitlegel, PDO::PARAM_STR);
    $kayitveri->bindValue(':deseodescriptional', $deseodescriptiongel, PDO::PARAM_STR); 
    
    $kayitveri->bindValue(':cinbaslikal',$cinbaslikgel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':cinicerikal',$cinicerikgel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':cindetayal',$cindetaygel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':cinseotitleal',$cinseotitlegel, PDO::PARAM_STR);
    $kayitveri->bindValue(':cinseodescriptional',$cinseodescriptiongel, PDO::PARAM_STR); 
 
    $kayitveri->bindValue(':eskayit', $formeskayit, PDO::PARAM_STR); 
    $kayitveri->bindValue(':kayit_yapan_kullanici',$kayityapankullanicigel, PDO::PARAM_INT);
    $kayitveri->bindValue(':kayit_tarihi', $kayittarihigel, PDO::PARAM_STR);
    $kayitveri->bindValue(':durum',$kayitdurumugel, PDO::PARAM_INT);
    $kayitveri->bindValue(':son_guncelleme', $kayittarihigel, PDO::PARAM_STR);
    $kayitveri->execute();
 
 
 
if($kayitveri){
         $baglan->commit();
        
         echo "<script type='text/javascript'> 
     jQuery(document).ready(function() {
         /* Gritter removed, standard alert or better UX handled by ust.php/admin.js or manual alert here */
         alert('Kaydınız Gerçekleştirildi');
         setTimeout(function(){ location.href= 'icerik_ekle.php?bilgikayitonay=".temizlikimandan($formeskayit)."';}, 0);  
      }); 
</script>";

    }else {
    $baglan->rollBack();
       
         echo "<script type='text/javascript'> 
     jQuery(document).ready(function() {
         alert('İşleminiz Gerçekleştirilemedi.');
         setTimeout(function(){ location.href= 'icerik_ekle.php?bilgikayitonay=".temizlikimandan($formeskayit)."';}, 0);  
      }); 
</script>"; 
    }	
}

if (isset($_POST['genelkayitguncelle']) && $_POST['genelkayitguncelle']=='1') 
{
     $baglan->beginTransaction();   
        
    $katgel=isset($_POST['kategori']) ? $_POST['kategori'] : '';
    $tarihgel=isset($_POST['tarih']) ? $_POST['tarih'] : '';
    $trbaslikgel=isset($_POST['trbaslik']) ? $_POST['trbaslik'] : '';
    $tricerikgel=isset($_POST['tricerik']) ? $_POST['tricerik'] : '';
    $trdetaygel=isset($_POST['trdetay']) ? $_POST['trdetay'] : '';
    $trseotitlegel=isset($_POST['trseotitle']) ? $_POST['trseotitle'] : '';
    $trseodescriptiongel=isset($_POST['trseodescription']) ? $_POST['trseodescription'] : '';
    
    $enbaslikgel=isset($_POST['enbaslik']) ? $_POST['enbaslik'] : '';
    $enicerikgel=isset($_POST['enicerik']) ? $_POST['enicerik'] : '';
    $endetaygel=isset($_POST['endetay']) ? $_POST['endetay'] : '';
    $enseotitlegel=isset($_POST['enseotitle']) ? $_POST['enseotitle'] : '';
    $enseodescriptiongel=isset($_POST['enseodescription']) ? $_POST['enseodescription'] : '';
    
    $rubaslikgel=isset($_POST['rubaslik']) ? $_POST['rubaslik'] : '';
    $ruicerikgel=isset($_POST['ruicerik']) ? $_POST['ruicerik'] : '';
    $rudetaygel=isset($_POST['rudetay']) ? $_POST['rudetay'] : '';
    $ruseotitlegel=isset($_POST['ruseotitle']) ? $_POST['ruseotitle'] : '';
    $ruseodescriptiongel=isset($_POST['ruseodescription']) ? $_POST['ruseodescription'] : '';
    
    $arbaslikgel=isset($_POST['arbaslik']) ? $_POST['arbaslik'] : '';
    $aricerikgel=isset($_POST['aricerik']) ? $_POST['aricerik'] : '';
    $ardetaygel=isset($_POST['ardetay']) ? $_POST['ardetay'] : '';
    $arseotitlegel=isset($_POST['arseotitle']) ? $_POST['arseotitle'] : '';
    $arseodescriptiongel=isset($_POST['arseodescription']) ? $_POST['arseodescription'] : '';
    
    $frbaslikgel=isset($_POST['frbaslik']) ? $_POST['frbaslik'] : '';
    $fricerikgel=isset($_POST['fricerik']) ? $_POST['fricerik'] : '';
    $frdetaygel=isset($_POST['frdetay']) ? $_POST['frdetay'] : '';
    $frseotitlegel=isset($_POST['frseotitle']) ? $_POST['frseotitle'] : '';
    $frseodescriptiongel=isset($_POST['frseodescription']) ? $_POST['frseodescription'] : '';
    
    $debaslikgel=isset($_POST['debaslik']) ? $_POST['debaslik'] : '';
    $deicerikgel=isset($_POST['deicerik']) ? $_POST['deicerik'] : '';
    $dedetaygel=isset($_POST['dedetay']) ? $_POST['dedetay'] : '';
    $deseotitlegel=isset($_POST['deseotitle']) ? $_POST['deseotitle'] : '';
    $deseodescriptiongel=isset($_POST['deseodescription']) ? $_POST['deseodescription'] : '';
    
    $cinbaslikgel=isset($_POST['cinbaslik']) ? $_POST['cinbaslik'] : '';
    $cinicerikgel=isset($_POST['cinicerik']) ? $_POST['cinicerik'] : '';
    $cindetaygel=isset($_POST['cindetay']) ? $_POST['cindetay'] : '';
    $cinseotitlegel=isset($_POST['cinseotitle']) ? $_POST['cinseotitle'] : '';
    $cinseodescriptiongel=isset($_POST['cinseodescription']) ? $_POST['cinseodescription'] : '';
 
    $idgel=isset($_POST['id']) ? addslashes($_POST['id']) : '';

            if (isset($_POST['tutar']) && $_POST['tutar']!='') {
$uzanti = $_POST['tutar'];
$noktatemizle=str_replace(".","",$uzanti);
$virgultemizle=str_replace(",",".",$noktatemizle);
$fiyat = $virgultemizle;
 
} 
 

 $duzenlesorgusu = 'UPDATE icerik SET  
 
 kategori=:katal
      ,tarih=:tarihal
      ,son_guncelleme=:son_guncelleme
     
      ,tr_baslik=:trbaslikal
      ,tr_icerik=:tricerikal
      ,tr_detay=:trdetayal
      ,tr_seo_title=:trseotitleal
      ,tr_seo_description=:trseodescriptional
      ,tr_seo_score=:trseoscoreal
      ,en_baslik=:enbaslikal
      ,en_icerik=:enicerikal
      ,en_detay=:endetayal
      ,en_seo_title=:enseotitleal
      ,en_seo_description=:enseodescriptional
      ,ru_baslik=:rubaslikal
      ,ru_icerik=:ruicerikal
      ,ru_detay=:rudetayal
      ,ru_seo_title=:ruseotitleal
      ,ru_seo_description=:ruseodescriptional
      ,ar_baslik=:arbaslikal
      ,ar_icerik=:aricerikal
      ,ar_detay=:ardetayal
      ,ar_seo_title=:arseotitleal
      ,ar_seo_description=:arseodescriptional
      ,fr_baslik=:frbaslikal
      ,fr_icerik=:fricerikal
      ,fr_detay=:frdetayal
      ,fr_seo_title=:frseotitleal
      ,fr_seo_description=:frseodescriptional
      ,de_baslik=:debaslikal
      ,de_icerik=:deicerikal
      ,de_detay=:dedetayal
      ,de_seo_title=:deseotitleal
      ,de_seo_description=:deseodescriptional
      ,cin_baslik=:cinbaslikal
      ,cin_icerik=:cinicerikal
      ,cin_detay=:cindetayal
      ,cin_seo_title=:cinseotitleal
      ,cin_seo_description=:cinseodescriptional
 
WHERE id= :idal';
$duzenleb= guncel($duzenlesorgusu, $baglan); 
    $duzenleb->bindValue(':katal',$katgel, PDO::PARAM_INT);  
    $duzenleb->bindValue(':tarihal',$tarihgel, PDO::PARAM_STR);
    $duzenleb->bindValue(':son_guncelleme', date('Y-m-d H:i:s'), PDO::PARAM_STR);
 
    $duzenleb->bindValue(':trbaslikal',$trbaslikgel, PDO::PARAM_STR);  
    $duzenleb->bindValue(':tricerikal',$tricerikgel, PDO::PARAM_STR); 
    $duzenleb->bindValue(':trdetayal',$trdetaygel, PDO::PARAM_STR); 
    $duzenleb->bindValue(':trseotitleal',$trseotitlegel, PDO::PARAM_STR);
    $duzenleb->bindValue(':trseodescriptional',$trseodescriptiongel, PDO::PARAM_STR);
    $duzenleb->bindValue(':trseoscoreal', isset($_POST['trseoscore']) ? intval($_POST['trseoscore']) : 0, PDO::PARAM_INT);
    
    $duzenleb->bindValue(':enbaslikal',$enbaslikgel, PDO::PARAM_STR); 
    $duzenleb->bindValue(':enicerikal',$enicerikgel, PDO::PARAM_STR); 
    $duzenleb->bindValue(':endetayal',$endetaygel, PDO::PARAM_STR);
    $duzenleb->bindValue(':enseotitleal',$enseotitlegel, PDO::PARAM_STR);
    $duzenleb->bindValue(':enseodescriptional',$enseodescriptiongel, PDO::PARAM_STR);
     
    $duzenleb->bindValue(':rubaslikal',$rubaslikgel, PDO::PARAM_STR); 
    $duzenleb->bindValue(':ruicerikal',$ruicerikgel, PDO::PARAM_STR); 
    $duzenleb->bindValue(':rudetayal',$rudetaygel, PDO::PARAM_STR); 
    $duzenleb->bindValue(':ruseotitleal',$ruseotitlegel, PDO::PARAM_STR);
    $duzenleb->bindValue(':ruseodescriptional',$ruseodescriptiongel, PDO::PARAM_STR);
    
    $duzenleb->bindValue(':arbaslikal',$arbaslikgel, PDO::PARAM_STR); 
    $duzenleb->bindValue(':aricerikal',$aricerikgel, PDO::PARAM_STR); 
    $duzenleb->bindValue(':ardetayal',$ardetaygel, PDO::PARAM_STR); 
    $duzenleb->bindValue(':arseotitleal',$arseotitlegel, PDO::PARAM_STR);
    $duzenleb->bindValue(':arseodescriptional',$arseodescriptiongel, PDO::PARAM_STR);
    
    $duzenleb->bindValue(':frbaslikal',$frbaslikgel, PDO::PARAM_STR); 
    $duzenleb->bindValue(':fricerikal',$fricerikgel, PDO::PARAM_STR); 
    $duzenleb->bindValue(':frdetayal',$frdetaygel, PDO::PARAM_STR);
    $duzenleb->bindValue(':frseotitleal',$frseotitlegel, PDO::PARAM_STR);
    $duzenleb->bindValue(':frseodescriptional',$frseodescriptiongel, PDO::PARAM_STR);
    
    $duzenleb->bindValue(':debaslikal',$debaslikgel, PDO::PARAM_STR); 
    $duzenleb->bindValue(':deicerikal',$deicerikgel, PDO::PARAM_STR); 
    $duzenleb->bindValue(':dedetayal',$dedetaygel, PDO::PARAM_STR);
    $duzenleb->bindValue(':deseotitleal',$deseotitlegel, PDO::PARAM_STR);
    $duzenleb->bindValue(':deseodescriptional',$deseodescriptiongel, PDO::PARAM_STR); 
 
    $duzenleb->bindValue(':cinbaslikal',$cinbaslikgel, PDO::PARAM_STR); 
    $duzenleb->bindValue(':cinicerikal',$cinicerikgel, PDO::PARAM_STR); 
    $duzenleb->bindValue(':cindetayal',$cindetaygel, PDO::PARAM_STR);
    $duzenleb->bindValue(':cinseotitleal',$cinseotitlegel, PDO::PARAM_STR);
    $duzenleb->bindValue(':cinseodescriptional',$cinseodescriptiongel, PDO::PARAM_STR); 
   
    $duzenleb->bindValue(':idal',$idgel, PDO::PARAM_INT);
    $duzenleb->execute();
 
if($duzenleb ){
         $baglan->commit();
          echo "<script type='text/javascript'> 
     jQuery(document).ready(function() {
         alert('Güncelleme Gerçekleştirildi');
         setTimeout(function(){ location.href= 'icerik_ekle.php?bilgikayitonay=".temizlikimandan(isset($_POST['bilgikayitonay']) ? $_POST['bilgikayitonay'] : '')."';}, 0);
      }); 
</script>";
    }else {
    $baglan->rollBack();
          echo "<script type='text/javascript'> 
     jQuery(document).ready(function() {
         alert('İşleminiz Gerçekleştirilemedi.');
         setTimeout(function(){ location.href= 'icerik_ekle.php?bilgikayitonay=".temizlikimandan(isset($_POST['bilgikayitonay']) ? $_POST['bilgikayitonay'] : '')."';}, 0); 
      }); 
</script>"; 
    }	
}

  $kayitsonucl = array('id' => 0, 'eskayit' => '', 'kategori' => '', 'tarih' => '', 
                       'tr_baslik' => '', 'tr_icerik' => '', 'tr_detay' => '', 'tr_seo_title' => '', 'tr_seo_description' => '',
                       'en_baslik' => '', 'en_icerik' => '', 'en_detay' => '', 'en_seo_title' => '', 'en_seo_description' => '',
                       'ru_baslik' => '', 'ru_icerik' => '', 'ru_detay' => '', 'ru_seo_title' => '', 'ru_seo_description' => '',
                       'ar_baslik' => '', 'ar_icerik' => '', 'ar_detay' => '', 'ar_seo_title' => '', 'ar_seo_description' => '',
                       'fr_baslik' => '', 'fr_icerik' => '', 'fr_detay' => '', 'fr_seo_title' => '', 'fr_seo_description' => '',
                       'de_baslik' => '', 'de_icerik' => '', 'de_detay' => '', 'de_seo_title' => '', 'de_seo_description' => '',
                       'cin_baslik' => '', 'cin_icerik' => '', 'cin_detay' => '', 'cin_seo_title' => '', 'cin_seo_description' => '');
  
  if (isset($_GET['bilgikayitonay']) && $_GET['bilgikayitonay'] != '') {
      $kayitsonuc= "SELECT * FROM icerik where durum!='-1' and eskayit='".temizlikimandan($_GET['bilgikayitonay'])."'";
      $kayitsonucb = sorgu($kayitsonuc, $baglan);
      $kayitsonucb->execute();
      $kayitsonucl_temp = veriliste($kayitsonucb);
      if ($kayitsonucl_temp && is_array($kayitsonucl_temp)) {
          $kayitsonucl = $kayitsonucl_temp;
      }
  }
?>

<!-- TinyMCE -->
<script src="https://cdn.jsdelivr.net/npm/tinymce@6/tinymce.min.js"></script>

<div class="container-fluid mb-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="mb-0 text-gray-800">İçerik Düzenle</h4>
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="index.php">Dashboard</a></li>
                <li class="breadcrumb-item active" aria-current="page">İçerik İşlemleri</li>
            </ol>
        </nav>
    </div>

    <form id="kayit-formu" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post" enctype="multipart/form-data">
        <input name="eskayit" type="hidden" value="<?php if(isset($kayitsonucl['id']) && $kayitsonucl['id']!='') { echo $kayitsonucl['eskayit'];} else { echo $eskayit;}?>" />
        <input name="id" type="hidden" value="<?php echo isset($kayitsonucl['id']) ? $kayitsonucl['id'] : ''; ?>" />
        <input name="bilgikayitonay" type="hidden" value="<?php echo isset($_GET['bilgikayitonay']) ? $_GET['bilgikayitonay']:''; ?>" />

        <div class="row">
            <div class="col-lg-12">
                <div class="card border-0 shadow-sm">
                    <div class="card-header bg-white">
                        <ul class="nav nav-tabs card-header-tabs" id="contentTabs" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="genel-tab" data-bs-toggle="tab" data-bs-target="#genel" type="button" role="tab">
                                    <i class="bi bi-gear-fill me-2"></i> Genel
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="tr-tab" data-bs-toggle="tab" data-bs-target="#turk" type="button" role="tab">
                                    <img src="../images/flag/flag_tr.png" height="15"> Türkçe
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="en-tab" data-bs-toggle="tab" data-bs-target="#ing" type="button" role="tab">
                                    <img src="../images/flag/flag_en.png" height="15"> İngilizce
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="ru-tab" data-bs-toggle="tab" data-bs-target="#rus" type="button" role="tab">
                                    <img src="../images/flag/flag_ru.png" height="15"> Rusça
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="ar-tab" data-bs-toggle="tab" data-bs-target="#arap" type="button" role="tab">
                                    <img src="../images/flag/flag_ar.png" height="15"> Arapça
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="fr-tab" data-bs-toggle="tab" data-bs-target="#fransiz" type="button" role="tab">
                                    <img src="../images/flag/flag_fr.png" height="15"> Fransızca
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="de-tab" data-bs-toggle="tab" data-bs-target="#alman" type="button" role="tab">
                                    <img src="../images/flag/flag_de.png" height="15"> Almanca
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="cin-tab" data-bs-toggle="tab" data-bs-target="#cin" type="button" role="tab">
                                    <img src="../images/flag/flag_cn.png" height="15"> Çince
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="doc-tab" data-bs-toggle="tab" data-bs-target="#resim" type="button" role="tab">
                                    <i class="bi bi-paperclip me-2"></i> Dosyalar
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body">
                        <div class="tab-content" id="contentTabsContent">
                            <!-- Genel Tab -->
                            <div class="tab-pane fade show active" id="genel" role="tabpanel">
                                <div class="mb-3 row">
                                    <label class="col-sm-2 col-form-label">Kategori</label>
                                    <div class="col-sm-8">
                                        <div class="input-group">
                                            <select name="kategori" class="form-select" data-placeholder="Kategori Seçiniz...">
                                                <option value=""></option>
                                                <?php
                                                $kategoriler1 = "SELECT * FROM genel_kategori where durum!='-1' order by sira ";
                                                $kategori1b = sorgu($kategoriler1, $baglan);
                                                $kategori1b->execute();
                                                while ($kat1 = veriliste($kategori1b)) {
                                                    $selected = ($kayitsonucl['kategori'] == $kat1['id']) ? 'selected' : '';
                                                    echo '<option value="'.$kat1['id'].'" '.$selected.'>'.$kat1['tr_isim'].'</option>';
                                                }
                                                ?>
                                            </select>
                                            <button class="btn btn-outline-secondary" type="button" data-bs-toggle="modal" data-bs-target="#kategoriekle">
                                                <i class="bi bi-plus-lg"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <label class="col-sm-2 col-form-label">Tarih</label>
                                    <div class="col-sm-4">
                                        <input type="text" name="tarih" id="datepicker" class="form-control" value="<?php echo isset($kayitsonucl['tarih']) && $kayitsonucl['tarih'] != '' ? $kayitsonucl['tarih'] : date('Y-m-d'); ?>">
                                    </div>
                                </div>
                            </div>

                            <!-- Language Tabs (Repeated Logic with Flags) -->
                            <?php 
                            $languages = [
                                'turk' => ['prefix' => 'tr', 'label' => 'Türkçe', 'id' => 'turk'],
                                'ing' => ['prefix' => 'en', 'label' => 'İngilizce', 'id' => 'ing'],
                                'rus' => ['prefix' => 'ru', 'label' => 'Rusça', 'id' => 'rus'],
                                'arap' => ['prefix' => 'ar', 'label' => 'Arapça', 'id' => 'arap'],
                                'fransiz' => ['prefix' => 'fr', 'label' => 'Fransızca', 'id' => 'fransiz'],
                                'alman' => ['prefix' => 'de', 'label' => 'Almanca', 'id' => 'alman'],
                                'cin' => ['prefix' => 'cin', 'label' => 'Çince', 'id' => 'cin']
                            ];

                            foreach ($languages as $key => $lang) {
                                $p = $lang['prefix'];
                                ?>
                                <div class="tab-pane fade" id="<?php echo $lang['id']; ?>" role="tabpanel">
                                    
                                    <!-- SEO Score Widget -->
                                    <div class="card mb-3 bg-light border-0">
                                        <div class="card-body py-2">
                                            <div class="d-flex justify-content-between align-items-center">
                                                <span class="fw-bold text-secondary text-uppercase small"><i class="bi bi-bar-chart-fill"></i> SEO Skoru</span>
                                                <span id="seo-score-<?php echo $p; ?>" class="badge bg-secondary">0/100</span>
                                            </div>
                                            <div class="progress mt-2" style="height: 6px;">
                                                <div id="seo-progress-<?php echo $p; ?>" class="progress-bar bg-secondary" role="progressbar" style="width: 0%"></div>
                                            </div>
                                            <div id="seo-feedback-<?php echo $p; ?>" class="mt-2 small text-muted"></div>
                                        </div>
                                    </div>

                                    <div class="mb-3 row">
                                        <label class="col-sm-2 col-form-label">Başlık</label>
                                        <div class="col-sm-10">
                                            <div class="input-group">
                                                <input type="text" name="<?php echo $p; ?>baslik" class="form-control" placeholder="<?php echo $lang['label']; ?> Başlık" value="<?php echo htmlspecialchars($kayitsonucl[$p.'_baslik']); ?>">
                                                <button class="btn btn-outline-primary ai-enhance-btn" data-type="title" data-lang="<?php echo $p; ?>" type="button" title="AI ile Başlık Oluştur"><i class="bi bi-magic"></i> AI</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <label class="col-sm-2 col-form-label">İçerik</label>
                                        <div class="col-sm-10">
                                            <div class="d-flex justify-content-end mb-1 gap-2">
                                                <?php if($p == 'tr') { ?>
                                                    <button class="btn btn-sm btn-outline-warning ai-research-btn" type="button"><i class="bi bi-search"></i> Araştır & Yaz (Google SERP)</button>
                                                    <button class="btn btn-sm btn-outline-success ai-translate-btn" type="button"><i class="bi bi-translate"></i> AI ile Çevir (Tüm Diller)</button>
                                                <?php } ?>
                                                <button class="btn btn-sm btn-outline-primary ai-enhance-btn" data-type="rewrite" data-lang="<?php echo $p; ?>" type="button"><i class="bi bi-pencil-square"></i> AI ile Yaz / Düzelt</button>
                                            </div>
                                            <textarea name="<?php echo $p; ?>icerik" id="<?php echo $p; ?>icerik" class="form-control" rows="4" placeholder="<?php echo $lang['label']; ?> İçerik"><?php echo htmlspecialchars($kayitsonucl[$p.'_icerik']); ?></textarea>
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <label class="col-sm-2 col-form-label">Detay</label>
                                        <div class="col-sm-10">
                                            <textarea name="<?php echo $p; ?>detay" id="<?php echo $p; ?>detay" class="form-control" rows="2" placeholder="<?php echo $lang['label']; ?> Detay"><?php echo htmlspecialchars($kayitsonucl[$p.'_detay']); ?></textarea>
                                        </div>
                                    </div>
                                    <hr>
                                    <h6 class="text-muted text-uppercase small mb-3">SEO Ayarları</h6>
                                    <div class="mb-3 row">
                                        <label class="col-sm-2 col-form-label">SEO Başlık</label>
                                        <div class="col-sm-10">
                                            <div class="input-group">
                                                <input type="text" name="<?php echo $p; ?>seotitle" class="form-control" placeholder="SEO Title" value="<?php echo htmlspecialchars($kayitsonucl[$p.'_seo_title']); ?>">
                                                <button class="btn btn-outline-secondary ai-enhance-btn" data-type="title" data-lang="<?php echo $p; ?>" type="button"><i class="bi bi-magic"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <label class="col-sm-2 col-form-label">SEO Açıklama</label>
                                        <div class="col-sm-10">
                                            <div class="input-group">
                                                <textarea name="<?php echo $p; ?>seodescription" class="form-control" rows="2" placeholder="SEO Description"><?php echo htmlspecialchars($kayitsonucl[$p.'_seo_description']); ?></textarea>
                                                <button class="btn btn-outline-secondary ai-enhance-btn" data-type="description" data-lang="<?php echo $p; ?>" type="button"><i class="bi bi-magic"></i></button>
                                                <input type="hidden" name="<?php echo $p; ?>seoscore" id="seo-score-input-<?php echo $p; ?>" value="<?php echo ($p=='tr' && isset($cek['tr_seo_score'])) ? $cek['tr_seo_score'] : 0; ?>">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <?php
                            }
                            ?>

                            <!-- Files Tab -->
                            <div class="tab-pane fade" id="resim" role="tabpanel">
                                <div class="mb-3 row">
                                    <label class="col-sm-2 col-form-label">Döküman Ekle</label>
                                    <div class="col-sm-10">
                                        <button class="btn btn-outline-primary" type="button" onclick="PencereOrtala('icerik_belge_ekle.php?bilgigonder=<?php if(isset($kayitsonucl['id']) && $kayitsonucl['id']!='') { echo $kayitsonucl['eskayit'];} else { echo $eskayit;}?> ',650,650);">
                                            <i class="bi bi-cloud-upload me-2"></i> Dosya Yöneticisini Aç
                                        </button>
                                        <p class="form-text text-muted mt-2">Resim veya belge eklemek için yukarıdaki butona tıklayın.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>

<!-- Fixed Bottom Bar -->
<div class="fixed-bottom-bar shadow-lg">
    <div class="action-buttons">
        <a href="icerik_rapor.php" class="btn btn-light border text-danger" onclick="return confirm('Değişiklikler kaydedilmeden çıkılacak?');">
            <i class="bi bi-x-circle"></i> İptal
        </a>
        <?php 
        $kayit_id = isset($kayitsonucl['id']) ? $kayitsonucl['id'] : 0;
        if ($kayit_id < 1) { ?>
            <button type="submit" form="kayit-formu" class="btn btn-primary">
                <i class="bi bi-save"></i> Kaydet
            </button>
            <input type="hidden" form="kayit-formu" name="formgenelkayit" value="1">
        <?php } else { ?>
            <button type="submit" form="kayit-formu" class="btn btn-primary">
                <i class="bi bi-save"></i> Güncelle
            </button>
            <input type="hidden" form="kayit-formu" name="genelkayitguncelle" value="1">
        <?php } ?>
    </div>
</div>

<!-- Style for Fixed Bar and Tabs -->
<style>
.fixed-bottom-bar {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 260px; /* Sidebar Width */
    background: #fff;
    padding: 15px 30px;
    border-top: 1px solid #e2e8f0;
    z-index: 990;
    display: flex;
    justify-content: flex-end;
    transition: left 0.3s ease-in-out;
}
@media (max-width: 992px) {
    .fixed-bottom-bar { left: 0; }
}
.card-header-tabs .nav-link.active {
    background-color: #fff;
    border-bottom-color: #fff;
    font-weight: 600;
}
</style>

<!-- Modal for Attributes -->
<div class="modal fade" id="kategoriekle" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Kategori Ekle</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="kategoriekleme">
               Yükleniyor...
            </div>
        </div>
    </div>
</div>

<script>
    function PencereOrtala(url, w, h) {
        var left = parseInt((screen.availWidth/2) - (w/2));
        var top = parseInt((screen.availHeight/2) - (h/2));
        var windowFeatures = "width=" + w + ",height=" + h + ",status,resizable,left=" + left + ",top=" + top + "screenX=" + left + ",screenY=" + top;
        window.open(url, "subWind", windowFeatures);
    }
    
    $(document).ready(function() {
        $('#kategoriekle').on('show.bs.modal', function(e) {
            $('#kategoriekleme').load('ajax/kategori_ekle.php');
        });
        
        // Initialize TinyMCE
        if (typeof tinymce !== 'undefined') {
             var editorIds = ['tricerik', 'trdetay', 'enicerik', 'endetay', 'ruicerik', 'rudetay', 
                              'aricerik', 'ardetay', 'fricerik', 'frdetay', 'deicerik', 'dedetay', 'cinicerik', 'cindetay'];
            
            tinymce.init({
                selector: '#' + editorIds.join(', #'),
                language: 'tr',
                language_url: 'https://cdn.jsdelivr.net/npm/tinymce-i18n@23.10.9/langs6/tr.js',
                height: 300,
                menubar: false,
                plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
                toolbar: 'undo redo | blocks | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                promotion: false,
                branding: false
            });
        }
    });
</script>

<?php include("alt2.php"); ?>
<script src="assets/js/seo_analyzer.js?v=<?php echo time(); ?>_final"></script>