<?php 
// EN ÖNCE output buffer'ı temizle (eğer önceki içerik varsa)
// Tüm mevcut output buffer'ları temizle
while (ob_get_level() > 0) {
    ob_end_clean();
}

// Standalone modda output buffer'ı temizle
$guncelleme_id_check = isset($_GET['guncelleme']) ? intval($_GET['guncelleme']) : 0;
$is_standalone_check = isset($_GET['standalone']) || ($guncelleme_id_check > 0 && !isset($_GET['table_only']) && !isset($_GET['form_only']));

// Standalone modda ise output buffer'ı temizle ve başlat
if ($is_standalone_check) {
    // Tüm mevcut output buffer'ları temizle
    while (ob_get_level() > 0) {
        ob_end_clean();
    }
    ob_start();
}

// Session zaten ust.php'de başlatılmış olabilir, kontrol et
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
// table_only modunda session kontrolü yapma (kategori_yonetimi.php zaten kontrol ediyor)
$is_table_only_for_session = isset($_GET['table_only']) && $_GET['table_only'] == 1;
if (!$is_table_only_for_session) {
    $tokenkontrol = isset($_SESSION['jetonal']) ? preg_match("/6e5y7a1l6c3i2n3/", $_SESSION['jetonal']) : false;
    if(!$tokenkontrol && (!isset($_SESSION['jetonal']) || $_SESSION['jetonal']=='')){
       header("location: cikis.php",  true,  301 );  exit;
    }
} else {
    // table_only modunda session kontrolü yapma, sadece debug mesajı
    // echo "<!-- DEBUG: table_only modunda session kontrolü atlandı -->";
}  
  
// Dosya yolu: site_backup/ajax/kategori_ekle.php
// baglanti klasörü: site_backup/baglanti/
// require_once kullanarak aynı dosyanın birden fazla kez include edilmesini önle

// Standalone modda output buffer'ı kontrol et ve temizle
if ($is_standalone_check) {
    // Tüm mevcut output buffer'ları temizle
    while (ob_get_level()) {
        ob_end_clean();
    }
    ob_start();
}

// Önce $baglan değişkeninin set edilip edilmediğini kontrol et
// Global scope'da kontrol et
if (!isset($GLOBALS['baglan']) || $GLOBALS['baglan'] === null) {
    // baglan.php dosyasını doğrudan include et
    require_once(__DIR__ . "/../baglanti/baglan.php");
}

// Local $baglan değişkenini global'den al veya yeni oluşturulan değişkeni kullan
if (!isset($baglan) || $baglan === null) {
    if (isset($GLOBALS['baglan'])) {
        $baglan = $GLOBALS['baglan'];
    } elseif (isset($baglan)) {
        $GLOBALS['baglan'] = $baglan;
    } else {
        // Son çare: baglan.php dosyasını tekrar include et
        require_once(__DIR__ . "/../baglanti/baglan.php");
        if (isset($baglan)) {
            $GLOBALS['baglan'] = $baglan;
        }
    }
}

if (!function_exists('sorgu')) {
    require_once(__DIR__ . "/../baglanti/baglantilar_fonksiyonlar.php");
    // baglantilar_fonksiyonlar.php içinde baglan.php include edilmiş olabilir, tekrar kontrol et
    if (!isset($baglan) || $baglan === null) {
        if (isset($GLOBALS['baglan'])) {
            $baglan = $GLOBALS['baglan'];
        } else {
            require_once(__DIR__ . "/../baglanti/baglan.php");
        }
    }
}
if (!function_exists('sayfayetkikontrol')) {
    require_once(__DIR__ . "/../baglanti/sayfa_yetki_fonksiyonu.php");
}

// table_only modunda yetki kontrolü yapma (kategori_yonetimi.php zaten kontrol ediyor)
$is_table_only = isset($_GET['table_only']) && $_GET['table_only'] == 1;
// Standalone modda yetki kontrolü yaparken output buffer'ı temizle
if (!$is_table_only) {
    // Standalone modda ise output buffer'ı temizle
    if ($is_standalone_check) {
        while (ob_get_level()) {
            ob_end_clean();
        }
        ob_start();
    }
    sayfayetkikontrol(3);
    // Standalone modda ise output buffer'ı tekrar temizle (sayfayetkikontrol içinde bir şey output edilmiş olabilir)
    if ($is_standalone_check) {
        ob_clean();
    }
}

// PencereOrtala ile açılan popup'lar için standalone=1 olmalı
// Eğer standalone parametresi yoksa ve guncelleme parametresi varsa, standalone modda açılıyor demektir
$guncelleme_id = isset($_GET['guncelleme']) ? intval($_GET['guncelleme']) : 0;
$is_standalone = isset($_GET['standalone']) || ($guncelleme_id > 0 && !isset($_GET['table_only']) && !isset($_GET['form_only']));
$is_modal = !$is_standalone;
$table_only = isset($_GET['table_only']) && $_GET['table_only'] == 1;
$form_only = isset($_GET['form_only']) && $_GET['form_only'] == 1;

// Standalone modda (popup pencere) tam HTML sayfası render et
if ($is_standalone && !$table_only) {
    // Output buffer'ı temizle (eğer önceki içerik varsa)
    // Tüm mevcut output buffer'ları temizle
    while (ob_get_level() > 0) {
        ob_end_clean();
    }
    // Yeni bir output buffer başlat
    ob_start();
    
    // Eğer hala output varsa, temizle
    if (ob_get_length() > 0) {
        ob_clean();
    }
    
    // HTML başlangıcı - icerik_belge_ekle.php gibi minimal yapı
    ?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="Content-Language" content="TR"/>
<link href="../yonetim/css/bootstrap.min.css" rel="stylesheet">
<link href="../yonetim/css/bootstrap-overrides.css" rel="stylesheet">
<link href="../yonetim/css/jquery-ui-1.10.2.custom.css" rel="stylesheet">
<link href="../yonetim/css/font-awesome.css" rel="stylesheet">
<link href="../yonetim/css/style.default.css" rel="stylesheet">
<script type="text/javascript" src="../yonetim/js/jquery-1.11.1.min.js"></script>
<script type="text/javascript" src="../yonetim/js/jquery-migrate-1.2.1.min.js"></script>
<script type="text/javascript" src="../yonetim/js/bootstrap.min.js"></script>
<script type="text/javascript" src="../yonetim/js/jquery-ui-1.10.3.min.js"></script>
<script type="text/javascript" src="../yonetim/js/jquery.gritter.min.js"></script>
</head>
<body>
<div class="mainpanel" style="margin: 0; padding: 20px;">
    <div class="contentpanel">
<?php
}
 ?>
 

          	<?php
          	
          	// Sadece tablo isteniyorsa formu gösterme
          	if ($table_only) {
          	    // Form kısmını atla, direkt tabloya geç
          	    // Tablo bloğu aşağıda render edilecek (if (!$form_only || $table_only) bloğunda)
          	    // Bu blok boş bırakılıyor, tablo aşağıda render edilecek
          	} else {
          	    // Form göster (hem form_only hem de normal mod için)
          	    if ($is_modal) { ?>
          	    <div class="modal-content">
          	    <?php } ?>
                <?php if (!$form_only) { ?>
                <div class="panel panel-dark-head">
               <div class="panel-heading">  
                                <h4 class="panel-title" id="kategoriFormTitle"><?php echo ($guncelleme_id > 0) ? 'KATEGORİ GÜNCELLE' : 'KATEGORİ EKLE'; ?> </h4>
                                 <p><?php echo ($guncelleme_id > 0) ? 'Kategori Güncelliyorsunuz' : 'Kategori Eklemektesiniz'; ?></p>
                            </div>
                <?php } else { ?>
                <!-- Form only modunda başlık -->
                <h4 class="panel-title" id="kategoriFormTitle" style="margin-bottom: 15px;"><?php echo ($guncelleme_id > 0) ? 'KATEGORİ GÜNCELLE' : 'KATEGORİ EKLE'; ?> </h4>
                <?php } ?>

                   <div class="<?php echo $is_modal ? 'modal-body' : 'panel-body'; ?>">
                                   
  
<?php
// Güncelleme modunda kategori bilgilerini çek
// $guncelleme_id zaten yukarıda tanımlanmış (satır 74)
$kayitsonucl = array();
if ($guncelleme_id > 0) {
    $kayitsorgusu = "SELECT * FROM genel_kategori WHERE id=:idal";
    $kayitsorgusub = sorgu($kayitsorgusu, $baglan);
    $kayitsorgusub->bindValue(':idal', $guncelleme_id, PDO::PARAM_INT);
    $kayitsorgusub->execute();
    $kayitsonucl = veriliste($kayitsorgusub);
    if (!$kayitsonucl) {
        $kayitsonucl = array();
    }
}
?>
<form method="POST" id="formgonder" name="kategori"  enctype="multipart/form-data" >
   <input id="guncelid" name="guncelleme" hidden="hidden" value="<?php echo isset($kayitsonucl['id']) ? htmlspecialchars($kayitsonucl['id']) : ''; ?>">
    <ul class="nav nav-tabs nav-info" style="font-size: 10px">
                                     
                                    <li class="active"><a href="#tr" data-toggle="tab"><strong>Türkçe</strong></a></li>
                                    <li><a href="#en" data-toggle="tab"><strong>İngilizce</strong></a></li>
                                    <li><a href="#ru" data-toggle="tab"><strong>Rusça</strong></a></li>
                                    <li><a href="#ar" data-toggle="tab"><strong>Arapça</strong></a></li>
                                    <li><a href="#fr" data-toggle="tab"><strong>Fransızca</strong></a></li>
                                    <li><a href="#de" data-toggle="tab"><strong>Almanca</strong></a></li>
                                    <li><a href="#cin" data-toggle="tab"><strong>Çince</strong></a></li>
                                  
                                </ul>
     
     <div class="form-group" style="margin-top: 15px; margin-bottom: 15px;">
         <label for="anakategori">Ana Kategori:</label>
         <select name="anakategori" id="anakategori" class="form-control tooltips">
              <?php 
$kt= "SELECT * FROM  genel_kategori  where durum='1'   order by tr_isim";
$ktb= sorgu($kt, $baglan);
$ktb->execute(); 	
 
?>
 

<option value="" >Seçiniz</option>
<?php while ($ktl = veriliste($ktb)){ ?>
<option value="<?php echo $ktl['id']; ?>" <?php echo (isset($kayitsonucl['anakategori']) && $kayitsonucl['anakategori'] == $ktl['id']) ? 'selected' : ''; ?> >  <?php
   $sukatlar= " with recursive cte (id, tr_isim,anakategori) as (
  select    id,
    		tr_isim,
    anakategori
  from       genel_kategori
  where      id = ".$ktl['id']." 
  union all
  select    p.id,
    		p.tr_isim,
    p.anakategori
  from       genel_kategori p
  inner join cte
          on p.id = cte.anakategori  
)
select * from cte order by id";
$sukatlarb= sorgu($sukatlar, $baglan);
$sukatlarb->execute();    
   
 ?><?php   while ($sukatlarl =veriliste($sukatlarb)) { 
  
     if($sukatlarl['anakategori']!=0){ echo " > "; } echo $sukatlarl['tr_isim'];} ?>
             </option>
<?php } ?>
</select>
     </div>
     
     <div class="tab-content mb30">
         
<div class="tab-pane active" id="tr">
      
<div class="form-group"> 
<label>Türkçe Kategori Adı</label>
<div class="input-group">
   <input class="form-control tooltips" name="trisim"  id="trisim"  required placeholder="Lütfen Türkçe Kategori Adı Giriniz" value="<?php echo isset($kayitsonucl['tr_isim']) ? htmlspecialchars($kayitsonucl['tr_isim']) : ''; ?>" />
   <span class="input-group-btn">
       <button type="button" class="btn btn-primary" id="aiTranslateBtn" style="height: 34px;"><i class="fa fa-language"></i> AI ile Çevir</button>
   </span>
</div>
</div>
<div class="form-group">
<label>SEO Başlık (TR)</label>
<input class="form-control" name="trseotitle" value="<?php echo isset($kayitsonucl['tr_seo_title']) ? htmlspecialchars($kayitsonucl['tr_seo_title']) : ''; ?>" placeholder="SEO Başlık" />
</div>
<div class="form-group">
<label>SEO Açıklama (TR)</label>
<textarea class="form-control" name="trseodescription" rows="2" placeholder="SEO Açıklama"><?php echo isset($kayitsonucl['tr_seo_description']) ? htmlspecialchars($kayitsonucl['tr_seo_description']) : ''; ?></textarea>
</div>
</div>
         <div class="tab-pane " id="en">
<div class="form-group">
<input class="form-control tooltips" name="enisim"  id="enisim"  placeholder="Lütfen İngilizce Kategori Adı Giriniz" style="margin-top: 30px" value="<?php echo isset($kayitsonucl['en_isim']) ? htmlspecialchars($kayitsonucl['en_isim']) : ''; ?>" /> 
</div>
<div class="form-group">
<label>SEO Başlık (EN)</label>
<input class="form-control" name="enseotitle" value="<?php echo isset($kayitsonucl['en_seo_title']) ? htmlspecialchars($kayitsonucl['en_seo_title']) : ''; ?>" placeholder="SEO Title" />
</div>
<div class="form-group">
<label>SEO Açıklama (EN)</label>
<textarea class="form-control" name="enseodescription" rows="2" placeholder="SEO Description"><?php echo isset($kayitsonucl['en_seo_description']) ? htmlspecialchars($kayitsonucl['en_seo_description']) : ''; ?></textarea>
</div>
</div> 
         <div class="tab-pane " id="ru">
<div class="form-group">
<input class="form-control tooltips" name="ruisim"   id="ruisim"  placeholder="Lütfen Rusça Kategori Adı Giriniz" style="margin-top: 30px" value="<?php echo isset($kayitsonucl['ru_isim']) ? htmlspecialchars($kayitsonucl['ru_isim']) : ''; ?>"/> 
</div>
<div class="form-group">
<label>SEO Başlık (RU)</label>
<input class="form-control" name="ruseotitle" value="<?php echo isset($kayitsonucl['ru_seo_title']) ? htmlspecialchars($kayitsonucl['ru_seo_title']) : ''; ?>" placeholder="SEO Title" />
</div>
<div class="form-group">
<label>SEO Açıklama (RU)</label>
<textarea class="form-control" name="ruseodescription" rows="2" placeholder="SEO Description"><?php echo isset($kayitsonucl['ru_seo_description']) ? htmlspecialchars($kayitsonucl['ru_seo_description']) : ''; ?></textarea>
</div>
</div> 
         <div class="tab-pane " id="ar">
<div class="form-group">
<input class="form-control tooltips" name="arisim"  id="arisim"   placeholder="Lütfen Arapça Kategori Adı Giriniz" style="margin-top: 30px" value="<?php echo isset($kayitsonucl['ar_isim']) ? htmlspecialchars($kayitsonucl['ar_isim']) : ''; ?>"/> 
</div>
<div class="form-group">
<label>SEO Başlık (AR)</label>
<input class="form-control" name="arseotitle" value="<?php echo isset($kayitsonucl['ar_seo_title']) ? htmlspecialchars($kayitsonucl['ar_seo_title']) : ''; ?>" placeholder="SEO Title" />
</div>
<div class="form-group">
<label>SEO Açıklama (AR)</label>
<textarea class="form-control" name="arseodescription" rows="2" placeholder="SEO Description"><?php echo isset($kayitsonucl['ar_seo_description']) ? htmlspecialchars($kayitsonucl['ar_seo_description']) : ''; ?></textarea>
</div>
</div> 
         <div class="tab-pane " id="fr">
<div class="form-group">
<input class="form-control tooltips" name="frisim"  id="frisim"   placeholder="Lütfen Fransızca Kategori Adı Giriniz" style="margin-top: 30px" value="<?php echo isset($kayitsonucl['fr_isim']) ? htmlspecialchars($kayitsonucl['fr_isim']) : ''; ?>"/>
</div>
<div class="form-group">
<label>SEO Başlık (FR)</label>
<input class="form-control" name="frseotitle" value="<?php echo isset($kayitsonucl['fr_seo_title']) ? htmlspecialchars($kayitsonucl['fr_seo_title']) : ''; ?>" placeholder="SEO Title" />
</div>
<div class="form-group">
<label>SEO Açıklama (FR)</label>
<textarea class="form-control" name="frseodescription" rows="2" placeholder="SEO Description"><?php echo isset($kayitsonucl['fr_seo_description']) ? htmlspecialchars($kayitsonucl['fr_seo_description']) : ''; ?></textarea>
</div>
</div> 
         <div class="tab-pane " id="de">
<div class="form-group">
<input class="form-control tooltips" name="deisim"  id="deisim"   placeholder="Lütfen Almanca Kategori Adı Giriniz" style="margin-top: 30px" value="<?php echo isset($kayitsonucl['de_isim']) ? htmlspecialchars($kayitsonucl['de_isim']) : ''; ?>"/> 
</div>
<div class="form-group">
<label>SEO Başlık (DE)</label>
<input class="form-control" name="deseotitle" value="<?php echo isset($kayitsonucl['de_seo_title']) ? htmlspecialchars($kayitsonucl['de_seo_title']) : ''; ?>" placeholder="SEO Title" />
</div>
<div class="form-group">
<label>SEO Açıklama (DE)</label>
<textarea class="form-control" name="deseodescription" rows="2" placeholder="SEO Description"><?php echo isset($kayitsonucl['de_seo_description']) ? htmlspecialchars($kayitsonucl['de_seo_description']) : ''; ?></textarea>
</div>
</div>
         
          <div class="tab-pane " id="cin">
<div class="form-group">
<input class="form-control tooltips" name="cinisim"   id="cinisim"  placeholder="Lütfen Çince Kategori Adı Giriniz" style="margin-top: 30px" value="<?php echo isset($kayitsonucl['cin_isim']) ? htmlspecialchars($kayitsonucl['cin_isim']) : ''; ?>"/> 
</div>
<div class="form-group">
<label>SEO Başlık (CIN)</label>
<input class="form-control" name="cinseotitle" value="<?php echo isset($kayitsonucl['cin_seo_title']) ? htmlspecialchars($kayitsonucl['cin_seo_title']) : ''; ?>" placeholder="SEO Title" />
</div>
<div class="form-group">
<label>SEO Açıklama (CIN)</label>
<textarea class="form-control" name="cinseodescription" rows="2" placeholder="SEO Description"><?php echo isset($kayitsonucl['cin_seo_description']) ? htmlspecialchars($kayitsonucl['cin_seo_description']) : ''; ?></textarea>
</div>
</div>       
         
         
         <div class="ckbox ckbox-primary">
                                                        <input type="checkbox" value="1" id="checkboxPrimary" name="ustmenu" <?php echo (isset($kayitsonucl['ust_menu']) && $kayitsonucl['ust_menu']==1) ? 'checked' : ''; ?> />
                                                        <label for="checkboxPrimary">Üst Menü</label>
                                                    </div>
         
         <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
             <h5 style="margin-bottom: 15px; font-size: 14px; font-weight: bold;">Menü Görünürlük Ayarları (Dil Bazlı)</h5>
             <div class="row">
                 <div class="col-md-4">
                     <div class="ckbox ckbox-primary">
                         <input type="checkbox" value="1" id="tr_goster" name="tr_goster" <?php echo (isset($kayitsonucl['tr_goster']) && $kayitsonucl['tr_goster']==1) ? 'checked' : (empty($kayitsonucl) ? 'checked' : ''); ?> />
                         <label for="tr_goster">Türkçe'de Göster</label>
                     </div>
                 </div>
                 <div class="col-md-4">
                     <div class="ckbox ckbox-primary">
                         <input type="checkbox" value="1" id="en_goster" name="en_goster" <?php echo (isset($kayitsonucl['en_goster']) && $kayitsonucl['en_goster']==1) ? 'checked' : (empty($kayitsonucl) ? 'checked' : ''); ?> />
                         <label for="en_goster">İngilizce'de Göster</label>
                     </div>
                 </div>
                 <div class="col-md-4">
                     <div class="ckbox ckbox-primary">
                         <input type="checkbox" value="1" id="ru_goster" name="ru_goster" <?php echo (isset($kayitsonucl['ru_goster']) && $kayitsonucl['ru_goster']==1) ? 'checked' : (empty($kayitsonucl) ? 'checked' : ''); ?> />
                         <label for="ru_goster">Rusça'da Göster</label>
                     </div>
                 </div>
                 <div class="col-md-4">
                     <div class="ckbox ckbox-primary">
                         <input type="checkbox" value="1" id="ar_goster" name="ar_goster" <?php echo (isset($kayitsonucl['ar_goster']) && $kayitsonucl['ar_goster']==1) ? 'checked' : (empty($kayitsonucl) ? 'checked' : ''); ?> />
                         <label for="ar_goster">Arapça'da Göster</label>
                     </div>
                 </div>
                 <div class="col-md-4">
                     <div class="ckbox ckbox-primary">
                         <input type="checkbox" value="1" id="de_goster" name="de_goster" <?php echo (isset($kayitsonucl['de_goster']) && $kayitsonucl['de_goster']==1) ? 'checked' : (empty($kayitsonucl) ? 'checked' : ''); ?> />
                         <label for="de_goster">Almanca'da Göster</label>
                     </div>
                 </div>
                 <div class="col-md-4">
                     <div class="ckbox ckbox-primary">
                         <input type="checkbox" value="1" id="fr_goster" name="fr_goster" <?php echo (isset($kayitsonucl['fr_goster']) && $kayitsonucl['fr_goster']==1) ? 'checked' : (empty($kayitsonucl) ? 'checked' : ''); ?> />
                         <label for="fr_goster">Fransızca'da Göster</label>
                     </div>
                 </div>
             </div>
             <div class="row" style="margin-top: 10px;">
                 <div class="col-md-4">
                     <div class="ckbox ckbox-primary">
                         <input type="checkbox" value="1" id="cin_goster" name="cin_goster" <?php echo (isset($kayitsonucl['cin_goster']) && $kayitsonucl['cin_goster']==1) ? 'checked' : (empty($kayitsonucl) ? 'checked' : ''); ?> />
                         <label for="cin_goster">Çince'de Göster</label>
                     </div>
                 </div>
             </div>
         </div>
         
                                </div>

     

      
 <div class="<?php echo $is_modal ? 'modal-footer' : 'form-group'; ?>">
 <?php if ($is_modal) { ?>
 <button type="button" class="btn btn-danger" onclick="kapat()" data-dismiss="modal" >Vazgeç</button>
 <?php } ?>
 <button type="reset" class="btn btn-default">Temizle</button>
 <input type="hidden" name="kayitturu" value="1">  <button type="sumbit" class="btn btn-primary"><?php echo ($guncelleme_id > 0) ? 'Güncelle' : 'Ekle'; ?></button>
  </div>
   
</form>   
           <?php } // table_only else bloğu kapanışı ?>
           
           <?php 
           // Tablo kısmı hem table_only hem de normal modda gösterilmeli
           // table_only modunda form olmadığı için direkt tabloya geç
           // Tablo her zaman gösterilmeli (form_only hariç)
           // table_only modunda $form_only false olduğu için tablo render edilecek
           // NOT: Tablo bloğu else bloğunun DIŞINDA olmalı ki table_only modunda da çalışsın
           
           // Debug mesajları kaldırıldı
           
           if (!$form_only || $table_only) {
           ?>
                       <table class="table table-bordered table-primary mb30">
                                <thead>
                                  <tr style="font-size: 12px">
                                      <th align="center">İşlemler</th>
                                      <th>Tr İsim</th>
                                      <th>Menü</th>
                                      <th>Durum</th>
                               
                                     
                                      
                                  </tr>
                                </thead> 
                     
                              
                                <tbody  style="font-size: 11px" id="aramayap">
           
                                 
<?php
 
                                    
$dta= "SELECT * FROM  genel_kategori  where durum!='-1'   order by tr_isim";
$dtab= sorgu($dta, $baglan);
$dtab->execute();                                     
//$dtab->bindValue(':sonucal',$kayitsonucl['id'], PDO::PARAM_INT);                                      

                                    ?> 
                                    
                                    <?php while ($dtal =veriliste($dtab)) {   ?> 
                                  <tr>
                                     
                                      <td align="center"><div class="btn-group">
                                         
                                        <button type="button" class="btn btn-xs btn-primary dropdown-toggle" data-toggle="dropdown">İşlem
                                          <span class="caret"></span>
                                       
                                        </button>
                                        <ul class="dropdown-menu pull-right" role="menu">
             
                                   
                         <li> <a href="javascript:void(0);" class="kategori-guncelle-btn" data-kayit-id="<?php echo $dtal['id'];?>" 
                         data-anakategori="<?php echo htmlspecialchars(isset($dtal['anakategori']) && $dtal['anakategori'] !== null ? $dtal['anakategori'] : '', ENT_QUOTES, 'UTF-8');?>"
                         data-trisim="<?php echo htmlspecialchars(isset($dtal['tr_isim']) && $dtal['tr_isim'] !== null ? $dtal['tr_isim'] : '', ENT_QUOTES, 'UTF-8');?>"
                         data-enisim="<?php echo htmlspecialchars(isset($dtal['en_isim']) && $dtal['en_isim'] !== null ? $dtal['en_isim'] : '', ENT_QUOTES, 'UTF-8');?>"
                         data-ruisim="<?php echo htmlspecialchars(isset($dtal['ru_isim']) && $dtal['ru_isim'] !== null ? $dtal['ru_isim'] : '', ENT_QUOTES, 'UTF-8');?>"
                         data-arisim="<?php echo htmlspecialchars(isset($dtal['ar_isim']) && $dtal['ar_isim'] !== null ? $dtal['ar_isim'] : '', ENT_QUOTES, 'UTF-8');?>"
                         data-frisim="<?php echo htmlspecialchars(isset($dtal['fr_isim']) && $dtal['fr_isim'] !== null ? $dtal['fr_isim'] : '', ENT_QUOTES, 'UTF-8');?>"
                         data-deisim="<?php echo htmlspecialchars(isset($dtal['de_isim']) && $dtal['de_isim'] !== null ? $dtal['de_isim'] : '', ENT_QUOTES, 'UTF-8');?>"
                         data-cinisim="<?php echo htmlspecialchars(isset($dtal['cin_isim']) && $dtal['cin_isim'] !== null ? $dtal['cin_isim'] : '', ENT_QUOTES, 'UTF-8');?>"
                         data-ustmenu="<?php echo (isset($dtal['ust_menu']) && $dtal['ust_menu']==1) ? '1' : '0';?>"
                         data-tr_goster="<?php echo (isset($dtal['tr_goster']) && $dtal['tr_goster']==1) ? '1' : '0';?>"
                         data-en_goster="<?php echo (isset($dtal['en_goster']) && $dtal['en_goster']==1) ? '1' : '0';?>"
                         data-ru_goster="<?php echo (isset($dtal['ru_goster']) && $dtal['ru_goster']==1) ? '1' : '0';?>"
                         data-ar_goster="<?php echo (isset($dtal['ar_goster']) && $dtal['ar_goster']==1) ? '1' : '0';?>"
                         data-de_goster="<?php echo (isset($dtal['de_goster']) && $dtal['de_goster']==1) ? '1' : '0';?>"
                         data-fr_goster="<?php echo (isset($dtal['fr_goster']) && $dtal['fr_goster']==1) ? '1' : '0';?>"
                         data-cin_goster="<?php echo (isset($dtal['cin_goster']) && $dtal['cin_goster']==1) ? '1' : '0';?>"
                         data-cinseotitle="<?php echo htmlspecialchars(isset($dtal['cin_seo_title']) && $dtal['cin_seo_title'] !== null ? $dtal['cin_seo_title'] : '', ENT_QUOTES, 'UTF-8');?>"
                         data-cinseodescription="<?php echo htmlspecialchars(isset($dtal['cin_seo_description']) && $dtal['cin_seo_description'] !== null ? $dtal['cin_seo_description'] : '', ENT_QUOTES, 'UTF-8');?>"
                         ><i style="width: 20px" class="fa fa-pencil"></i> Güncelle</a> </li> 
                         
                           <?php if ($dtal['durum']=='1') {?>                   
                         <li><a  data-toggle="modal" href="#pasifeal"   data-kayit-id="<?php echo $dtal['id'];?>"  ><i style="width: 20px" class="fa fa-times"></i> Pasife Al</a></li>  <?php } ?>
                           <?php if ($dtal['durum']=='3') {?>                   
                         <li><a  data-toggle="modal" href="#aktifeal"   data-kayit-id="<?php echo $dtal['id'];?>"  ><i style="width: 20px" class="fa fa-check"></i> Aktife Al</a></li>  <?php } ?>                   
                                            
                         <li><a  data-toggle="modal" href="#kayitsil"   data-kayit-id="<?php echo $dtal['id'];?>"  ><i style="width: 20px" class="fa fa-trash-o"></i> Sil</a>  </li>                    
                                            
                                        </ul>
                                      </div>
                         
                                      </td>
                                      
                                      <?php
 $ukatlar= " with recursive cte (id, tr_isim,anakategori) as (
  select    id,
    		tr_isim,
    anakategori
  from       genel_kategori
  where      id = ".$dtal['id']." 
  union all
  select    p.id,
    		p.tr_isim,
    p.anakategori
  from       genel_kategori p
  inner join cte
          on p.id = cte.anakategori  
)
select * from cte order by id";
$ukatlarb= sorgu($ukatlar, $baglan);
$ukatlarb->execute();    
                                  
                                      
                                      ?>
                                      
                                      
                                     <td style="color: black; font-size: 16px"><?php  while ($ukatlarl =veriliste($ukatlarb)) {   if($ukatlarl['anakategori']!=0){ echo " > "; }echo $ukatlarl['tr_isim'];} ?></td>
                                      <td style="color: black"><?php if($dtal['ust_menu']==1) { echo "Evet";} else {echo "Hayır";}; ?></td>
                                      <td style="color: black"><?php if($dtal['durum']==1) { echo "Aktif";} elseif ($dtal['durum']==3){echo "Pasif";}; ?></td>
                                  </tr> 
                                 <?php } ?>
                                     
                                </tbody>
                              </table>
           <?php 
           // Tablo kısmını kapat (254. satırdaki if bloğunu kapat)
           } // 254. satırdaki if bloğunu kapat
           
           // table_only modunda sadece tablo var, div'ler yok
           if (!$form_only && !$table_only) {
           ?>
           </div>
                       
                       
                           
                  </div>
              </div>
           <?php 
           }
           ?>
           <?php if (!$form_only) { ?>
           <?php if (!$is_modal && !$table_only) { ?>
           </div>
           <?php } ?>
           <?php if ($is_modal) { ?>
           </div>
           <?php } ?>
           <?php } ?>
            
        
	<div class="modal fade" id="kayitsil"   tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog modal">
            <div class="modal-content">
                <div class="panel panel-dark-head">
                
                 
                  
                    <div id="kayitdetaysonuc"></div>
                    
                    
                    
                  </div>
              </div>
</div>
</div>

<div class="modal fade" id="pasifeal"   tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog modal">
            <div class="modal-content">
                <div class="panel panel-dark-head">
                
                 
                  
                    <div id="pasifdetaysonuc"></div>
                    
                    
                    
                  </div>
              </div>
</div>
</div>

<div class="modal fade" id="aktifeal"   tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog modal">
            <div class="modal-content">
                <div class="panel panel-dark-head">
                
                 
                  
                    <div id="aktifdetaysonuc"></div>
                    
                    
                    
                  </div>
              </div>
</div>
</div>
 
<script>
   $(document).ready(function() {    
       var ajaxBaseUrl = '<?php echo ($is_standalone) ? "../ajax/" : "ajax/"; ?>';
       
       
 $('#pasifeal').on('show.bs.modal', function(e) {
    var kayital = $(e.relatedTarget).data('kayit-id'); 

        jQuery.ajax({
  type: 'GET',
  data: {kayital: kayital},        
  url: ajaxBaseUrl + 'kategori_pasif.php',
  error:function(){ $('#pasifdetaysonuc').html("İşlem Başarısız."); }, 
  success: function(veri) { $('#pasifdetaysonuc').html(veri);} 
});
});        
       
       
 $('#aktifeal').on('show.bs.modal', function(e) {
    var kayital = $(e.relatedTarget).data('kayit-id'); 

        jQuery.ajax({
  type: 'GET',
  data: {kayital: kayital},        
  url: ajaxBaseUrl + 'kategori_aktif.php',
  error:function(){ $('#aktifdetaysonuc').html("İşlem Başarısız."); }, 
  success: function(veri) { $('#aktifdetaysonuc').html(veri);} 
});
});        
 
 
$('#kayitsil').on('show.bs.modal', function(e) {
    var kayital = $(e.relatedTarget).data('kayit-id'); 

        jQuery.ajax({
  type: 'GET',
  data: {kayital: kayital},        
  url: ajaxBaseUrl + 'kategori_sil.php',
  error:function(){ $('#kayitdetaysonuc').html("İşlem Başarısız."); }, 
  success: function(veri) { $('#kayitdetaysonuc').html(veri);} 
});
});       
       
       
   
$("#formgonder").submit(function(event){
    event.preventDefault(); // Form submit'ini engelle
    
    // Güncelleme modunda guncelleme parametresini ekle
    var formData = $('#formgonder').serialize();
    var guncelId = $('#guncelid').val();
    if (guncelId != '' && guncelId != '0' && guncelId != undefined) {
        formData += '&guncelleme=' + encodeURIComponent(guncelId);
    }
    
    var insertUrl = '<?php echo ($is_standalone) ? "kategori_ekle_insert.php" : "../../ajax/kategori_ekle_insert.php"; ?>';
    jQuery.ajax({
        type: 'POST', 
        data: formData,          
        url: insertUrl,
        error:function(){ 
            alert('İşlem Başarısız.'); 
        }, 
        success: function(veri) { 
            // Başarı mesajını göster
            if (veri.indexOf('Onaylandı') > -1 || veri.indexOf('Başarı') > -1 || veri.indexOf('Gerçekleştirilmiştir') > -1) {
                // Formu temizle
                $('#formgonder')[0].reset();
                $('#guncelid').val('');
                
                // Popup pencerede isek ana sayfayı yenile ve pencereyi kapat
                if (window.opener && !window.opener.closed) {
                    window.opener.location.reload();
                    setTimeout(function() {
                        window.close();
                    }, 1500);
                } else {
                    // Normal sayfada isek sayfayı yenile
                    setTimeout(function() {
                        location.reload();
                    }, 1500);
                }
            }
            // Mesajı göster (eğer gritter varsa)
            if (typeof jQuery.gritter !== 'undefined') {
                jQuery.gritter.add({
                    title: veri.indexOf('Hata') > -1 ? 'Hata!' : 'BİLGİ!',
                    text: veri.indexOf('Onaylandı') > -1 ? 'İşleminiz Onaylandı.' : (veri.indexOf('Başarı') > -1 ? 'İşlem Başarılı.' : 'İşlem tamamlandı.'),
                    class_name: veri.indexOf('Hata') > -1 ? 'growl-danger' : 'growl-success',
                    time: '2000'
                });
            } else {
                alert(veri.indexOf('Hata') > -1 ? 'Hata oluştu!' : 'İşlem tamamlandı!');
            }
        } 
    });
 
}); 
   
  
       
       });
</script>	

<script>
            jQuery(document).ready(function(){
                
                jQuery('#basicTable').DataTable({
                    responsive: true
                });
                
      
                
                
                 jQuery("#select-basic, #select-multi").select2({
                 
                });
                
               
          
      
                // DataTables Length to Select2
                jQuery('div.dataTables_length select').removeClass('form-control input-sm');
                jQuery('div.dataTables_length select').css({width: '60px'});
                jQuery('div.dataTables_length select').select2({
                    minimumResultsForSearch: -1
                });
    
            });
 
        </script>
          
                 
<?php 
$baglan = null;

// Standalone modda (popup pencere) HTML kapanışı
if ($is_standalone && !$table_only) {
    ?>
    </div><!-- contentpanel -->
</div><!-- mainpanel -->
<script src="../yonetim/js/jquery-migrate-1.2.1.min.js"></script>
<script src="../yonetim/js/bootstrap.min.js"></script>
<script src="../yonetim/js/jquery-ui-1.10.3.min.js"></script>
<script src="../yonetim/js/jquery.gritter.min.js"></script>
<script src="../yonetim/js/custom.js"></script>
<script>
    function kapat() {
        window.close();
    }
    
    // Tab yapısının doğru çalışması için
    $(document).ready(function() {
        // İlk tab'ı aktif yap
        $('.nav-tabs a:first').tab('show');
        
        // Tab değiştiğinde içeriği göster
        $('.nav-tabs a').on('shown.bs.tab', function (e) {
            // Tab içeriğinin görünür olduğundan emin ol
            var target = $(e.target).attr("href");
            $(target).addClass('active');
        });
    });
</script>
</body>
</html>
<?php
}
?>
<script>
$(document).ready(function() {
    $('#aiTranslateBtn').click(function(e) {
        e.preventDefault();
        var trText = $('#trisim').val();
        if(!trText) { alert("Lütfen önce Türkçe isim girin"); return; }
        
        var btn = $(this);
        var oldHtml = btn.html();
        btn.html('<i class="fa fa-spinner fa-spin"></i> Çevriliyor...').prop('disabled', true);
        
        var ajaxBase = '<?php echo ($is_standalone) ? "" : "../../ajax/"; ?>';
        var ceviriUrl = ajaxBase + 'kategori_ceviri.php';
        
        $.ajax({
            url: ceviriUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({text: trText}),
            success: function(res) {
                btn.html(oldHtml).prop('disabled', false);
                if(res.error) {
                    alert("Hata: " + res.error);
                } else {
                    if(res.en) $('#enisim').val(res.en);
                    if(res.ru) $('#ruisim').val(res.ru);
                    if(res.ar) $('#arisim').val(res.ar);
                    if(res.fr) $('#frisim').val(res.fr);
                    if(res.de) $('#deisim').val(res.de);
                    if(res.cin) $('#cinisim').val(res.cin);
                    if (typeof jQuery.gritter !== 'undefined') {
                        jQuery.gritter.add({title: 'BİLGİ', text: 'Çeviri tamamlandı!', class_name: 'growl-success', time: '2000'});
                    } else {
                        alert("Çeviri tamamlandı!");
                    }
                }
            },
            error: function() {
                btn.html(oldHtml).prop('disabled', false);
                alert("Sunucu ile iletişim kurulamadı.");
            }
        });
    });
});
</script>