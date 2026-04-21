<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
include("ust.php");
 
 sayfayetkikontrol(3); 


// Schema Update / Auto-Migration Logic (MUST RUN BEFORE POST PROCESSING)
try {
    // 1. Check/Add 'form_mail_alici'
    $check_fma = "SHOW COLUMNS FROM ayarlar LIKE 'form_mail_alici'";
    $res_fma = $baglan->query($check_fma);
    if ($res_fma->rowCount() == 0) {
        $baglan->exec("ALTER TABLE ayarlar ADD COLUMN form_mail_alici VARCHAR(255) DEFAULT '' AFTER linkedin");
    }

    // 2. Check/Add 'cookie_aktif' and other cookie columns
    $check_cookie = "SHOW COLUMNS FROM ayarlar LIKE 'cookie_aktif'";
    $res_cookie = $baglan->query($check_cookie);
    if ($res_cookie->rowCount() == 0) {
        $add_cookie_cols = "ALTER TABLE ayarlar 
            ADD COLUMN cookie_aktif TINYINT(1) DEFAULT 1,
            ADD COLUMN cookie_tr_message TEXT NULL,
            ADD COLUMN cookie_tr_dismiss VARCHAR(100) DEFAULT 'Tamam',
            ADD COLUMN cookie_tr_link VARCHAR(100) DEFAULT 'Daha fazla bilgi',
            ADD COLUMN cookie_en_message TEXT NULL,
            ADD COLUMN cookie_en_dismiss VARCHAR(100) DEFAULT 'OK',
            ADD COLUMN cookie_en_link VARCHAR(100) DEFAULT 'Learn more',
            ADD COLUMN cookie_ru_message TEXT NULL,
            ADD COLUMN cookie_ru_dismiss VARCHAR(100) DEFAULT 'ОК',
            ADD COLUMN cookie_ru_link VARCHAR(100) DEFAULT 'Узнать больше',
            ADD COLUMN cookie_ar_message TEXT NULL,
            ADD COLUMN cookie_ar_dismiss VARCHAR(100) DEFAULT 'حسنا',
            ADD COLUMN cookie_ar_link VARCHAR(100) DEFAULT 'المزيد من المعلومات',
            ADD COLUMN cookie_de_message TEXT NULL,
            ADD COLUMN cookie_de_dismiss VARCHAR(100) DEFAULT 'OK',
            ADD COLUMN cookie_de_link VARCHAR(100) DEFAULT 'Mehr erfahren',
            ADD COLUMN cookie_fr_message TEXT NULL,
            ADD COLUMN cookie_fr_dismiss VARCHAR(100) DEFAULT 'OK',
            ADD COLUMN cookie_fr_link VARCHAR(100) DEFAULT 'En savoir plus'";
        $baglan->exec($add_cookie_cols);
    }

    // 3. Check/Add AI columns (ai_provider, etc.)
    $check_ai = "SHOW COLUMNS FROM ayarlar LIKE 'ai_provider'";
    $res_ai = $baglan->query($check_ai);
    
    if ($res_ai->rowCount() == 0) {
        $add_ai_cols = "ALTER TABLE ayarlar 
            ADD COLUMN ai_provider VARCHAR(50) DEFAULT 'openai',
            ADD COLUMN openai_api_key TEXT,
            ADD COLUMN gemini_api_key TEXT,
            ADD COLUMN ai_model VARCHAR(50) DEFAULT 'gpt-4o'";
        $baglan->exec($add_ai_cols);
    }
    
    // 4. Check/Add Serper.dev columns
    $check_serper = "SHOW COLUMNS FROM ayarlar LIKE 'serper_api_key'";
    $res_serper = $baglan->query($check_serper);
    
    if ($res_serper->rowCount() == 0) {
        $add_serper_cols = "ALTER TABLE ayarlar ADD COLUMN serper_api_key TEXT";
        $baglan->exec($add_serper_cols);
    }

    if ($res_ai->rowCount() == 0) {
        // Upgrade existing columns to TEXT if they are VARCHAR (fix for 1406 error)
        // We run this blindly inside try-catch, it's safe
        $baglan->exec("ALTER TABLE ayarlar MODIFY COLUMN openai_api_key TEXT");
        $baglan->exec("ALTER TABLE ayarlar MODIFY COLUMN gemini_api_key TEXT");
    }

} catch (PDOException $e) {
    error_log("Migration Error: " . $e->getMessage());
}


if (isset($_POST['genelkayitguncelle']) && $_POST['genelkayitguncelle']=="1"){
    
    // Ensure helper functions exist - Fail-safe for 500 Error
    /*
    if (!defined('ENCRYPTION_KEY')) {
        define('ENCRYPTION_KEY', 'GokceOzel_Secure_Key_2025_!#');
    }
    if (!function_exists('sifrele')) {
        function sifrele($data) {
            if (empty($data)) return $data;
            $method = "AES-256-CBC";
            $iv = substr(hash('sha256', ENCRYPTION_KEY), 0, 16);
            if (function_exists('openssl_encrypt')) {
                return base64_encode(openssl_encrypt($data, $method, ENCRYPTION_KEY, 0, $iv));
            }
            return $data; // Fallback if openssl not loaded
        }
    }
    */
    
   $gelenid=isset($_POST['id']) ? temizlikimandan($_POST['id']) : '';
    $esiteadi=isset($_POST['siteadi']) ? addslashes($_POST['siteadi']) : '';
    $efirmaadi=isset($_POST['firmaadi']) ? addslashes($_POST['firmaadi']) : '';
    $eadres=isset($_POST['adres']) ? addslashes($_POST['adres']) : '';
    $ewebsitesi=isset($_POST['websitesi']) ? addslashes($_POST['websitesi']) : '';
    $email=isset($_POST['mail']) ? addslashes($_POST['mail']) : '';
    $evergidairesi=isset($_POST['vergidairesi']) ? $_POST['vergidairesi'] : '';
    $everginumarasi=isset($_POST['vergidairesi']) ? $_POST['vergidairesi'] : '';
    $etelefon=isset($_POST['telefon']) ? $_POST['telefon'] : '';
    $egsm=isset($_POST['gsm']) ? $_POST['gsm'] : '';
    $emersisno=isset($_POST['mersisno']) ? $_POST['mersisno'] : '';
    $doviz=isset($_POST['doviz']) ? $_POST['doviz'] : '';
    $ozel=isset($_POST['ozel']) ? $_POST['ozel'] : '';
    $facebook=isset($_POST['facebook']) ? $_POST['facebook'] : '';
    $instagram=isset($_POST['instagram']) ? $_POST['instagram'] : '';
    $twitter=isset($_POST['twitter']) ? $_POST['twitter'] : '';
    $youtube=isset($_POST['youtube']) ? $_POST['youtube'] : '';
    $linkedin=isset($_POST['linkedin']) ? $_POST['linkedin'] : '';
    $form_mail_alici=isset($_POST['form_mail_alici']) ? addslashes($_POST['form_mail_alici']) : '';
    $cookie_aktif=isset($_POST['cookie_aktif']) ? intval($_POST['cookie_aktif']) : 0;
    $cookie_tr_message=isset($_POST['cookie_tr_message']) ? addslashes($_POST['cookie_tr_message']) : '';
    $cookie_tr_dismiss=isset($_POST['cookie_tr_dismiss']) ? addslashes($_POST['cookie_tr_dismiss']) : 'Tamam';
    $cookie_tr_link=isset($_POST['cookie_tr_link']) ? addslashes($_POST['cookie_tr_link']) : 'Daha fazla bilgi';
    $cookie_en_message=isset($_POST['cookie_en_message']) ? addslashes($_POST['cookie_en_message']) : '';
    $cookie_en_dismiss=isset($_POST['cookie_en_dismiss']) ? addslashes($_POST['cookie_en_dismiss']) : 'OK';
    $cookie_en_link=isset($_POST['cookie_en_link']) ? addslashes($_POST['cookie_en_link']) : 'Learn more';
    $cookie_ru_message=isset($_POST['cookie_ru_message']) ? addslashes($_POST['cookie_ru_message']) : '';
    $cookie_ru_dismiss=isset($_POST['cookie_ru_dismiss']) ? addslashes($_POST['cookie_ru_dismiss']) : 'ОК';
    $cookie_ru_link=isset($_POST['cookie_ru_link']) ? addslashes($_POST['cookie_ru_link']) : 'Узнать больше';
    $cookie_ar_message=isset($_POST['cookie_ar_message']) ? addslashes($_POST['cookie_ar_message']) : '';
    $cookie_ar_dismiss=isset($_POST['cookie_ar_dismiss']) ? addslashes($_POST['cookie_ar_dismiss']) : 'حسنا';
    $cookie_ar_link=isset($_POST['cookie_ar_link']) ? addslashes($_POST['cookie_ar_link']) : 'المزيد من المعلومات';
    $cookie_de_message=isset($_POST['cookie_de_message']) ? addslashes($_POST['cookie_de_message']) : '';
    $cookie_de_dismiss=isset($_POST['cookie_de_dismiss']) ? addslashes($_POST['cookie_de_dismiss']) : 'OK';
    $cookie_de_link=isset($_POST['cookie_de_link']) ? addslashes($_POST['cookie_de_link']) : 'Mehr erfahren';
    $cookie_fr_message=isset($_POST['cookie_fr_message']) ? addslashes($_POST['cookie_fr_message']) : '';
    $cookie_fr_dismiss=isset($_POST['cookie_fr_dismiss']) ? addslashes($_POST['cookie_fr_dismiss']) : 'OK';
    $cookie_fr_link=isset($_POST['cookie_fr_link']) ? addslashes($_POST['cookie_fr_link']) : 'En savoir plus';
    
    // AI Ayarları
    // AI Ayarları
    $ai_provider=isset($_POST['ai_provider']) ? addslashes($_POST['ai_provider']) : 'openai';
    
    // Mevcut anahtarları çek (Güvenlik için)
    $mevcut_keys_sorgu = "SELECT openai_api_key, gemini_api_key, xai_api_key, serper_api_key FROM ayarlar WHERE id=:id";
    $mevcut_keys_stmt = $baglan->prepare($mevcut_keys_sorgu);
    $mevcut_keys_stmt->execute([':id' => $gelenid]);
    $mevcut_keys = $mevcut_keys_stmt->fetch(PDO::FETCH_ASSOC);

    // OpenAI Key Logic
    $posted_openai_key = isset($_POST['openai_api_key']) ? $_POST['openai_api_key'] : '';
    if (strpos($posted_openai_key, '***') !== false) {
        $val = $mevcut_keys['openai_api_key'];
        if (strpos($val, 'sk-') === 0) {
            $openai_api_key = sifrele($val);
        } else {
            $openai_api_key = $val;
        }
    } else {
        $openai_api_key = sifrele($posted_openai_key);
    }

    // Gemini Key Logic
    $posted_gemini_key = isset($_POST['gemini_api_key']) ? $_POST['gemini_api_key'] : '';
    if (strpos($posted_gemini_key, '***') !== false) {
        $val = $mevcut_keys['gemini_api_key'];
        if (strpos($val, 'AIza') === 0) {
            $gemini_api_key = sifrele($val);
        } else {
            $gemini_api_key = $val;
        }
    } else {
        $gemini_api_key = sifrele($posted_gemini_key);
    }

    // X.ai Key Logic
    $posted_xai_key = isset($_POST['xai_api_key']) ? $_POST['xai_api_key'] : '';
    if (strpos($posted_xai_key, '***') !== false) {
        $val = $mevcut_keys['xai_api_key'];
        if (strpos($val, 'xai-') === 0) {
            $xai_api_key = sifrele($val);
        } else {
            $xai_api_key = $val;
        }
    } elseif (!empty($posted_xai_key)) {
        $xai_api_key = sifrele($posted_xai_key);
    } else {
        $xai_api_key = ''; // Handle empty strictly if missing
    }

    $ai_model=isset($_POST['ai_model']) ? addslashes($_POST['ai_model']) : 'gpt-4o';
    
    // Serper Key Logic
    $posted_serper_key = isset($_POST['serper_api_key']) ? $_POST['serper_api_key'] : '';
    if (strpos($posted_serper_key, '***') !== false) {
        $val = $mevcut_keys['serper_api_key'];
        // Minimal encryption/check if needed, Serper keys are usually just random strings
        if (strlen($val) > 10 && strpos($val, '=') !== false) { // Simple check for likely-encrypted
             $serper_api_key = $val;
        } else {
             $serper_api_key = sifrele($val);
        }
    } else {
        $serper_api_key = sifrele($posted_serper_key);
    }

// Dosya yükleme değişkenlerini initialize et
$url1 = '';
$dosyasonuc1 = '';

for($i=1;$i<=1;$i++) 
{
$dosya1 ="resim1_".$i; 
$temizligebasla1 = isset($_FILES[$dosya1]['name']) ? $_FILES[$dosya1]['name'] : '';
if (!empty($temizligebasla1)) {
    $uzanti1 = strtolower(strrchr($temizligebasla1,'.'));
    $dosyasonucum1 = substr(md5(rand(0,9999999999)),-10)."eyalcin".$uzanti1;
    if(isset($_FILES[$dosya1]['tmp_name']) && move_uploaded_file($_FILES[$dosya1]['tmp_name'], "dosya/".$dosyasonucum1."")) 
    { 
        $url1 = $dosyasonucum1; 
    }
}
$veri1 = !empty($url1) ? trim($url1) : '';
if($veri1 != '') {
    $dosyasonuc1 = $veri1;
} else {
    $dosyasonuc1 = isset($_POST['resim1']) ? $_POST['resim1'] : '';
}
    
    
    
    
// Cookie alanlarının varlığını kontrol et
$check_cookie = "SHOW COLUMNS FROM ayarlar LIKE 'cookie_aktif'";
$check_cookie_result = $baglan->query($check_cookie);
$cookie_fields_exist = ($check_cookie_result->rowCount() > 0);

// UPDATE sorgusunu dinamik olarak oluştur
$duzenlesorgusu = 'UPDATE ayarlar SET 
siteadi= :siteadial,
firmaadi= :firmaadial,
adres= :adresal,
websitesi= :websitesial,
mail= :mailal,
vergidairesi= :vergidairesial,
verginumarasi= :verginumarasial,
telefon= :telefonal,
gsm= :gsmal,
mersisno= :mersisnoal,
logo= :logoal,
facebook= :facebook,
instagram= :instagram,
twitter= :twitter,
youtube= :youtube,
linkedin= :linkedin,
form_mail_alici= :form_mail_alici';

// Cookie alanları varsa ekle
if ($cookie_fields_exist) {
    $duzenlesorgusu .= ',
cookie_aktif= :cookie_aktif,
cookie_tr_message= :cookie_tr_message,
cookie_tr_dismiss= :cookie_tr_dismiss,
cookie_tr_link= :cookie_tr_link,
cookie_en_message= :cookie_en_message,
cookie_en_dismiss= :cookie_en_dismiss,
cookie_en_link= :cookie_en_link,
cookie_ru_message= :cookie_ru_message,
cookie_ru_dismiss= :cookie_ru_dismiss,
cookie_ru_link= :cookie_ru_link,
cookie_ar_message= :cookie_ar_message,
cookie_ar_dismiss= :cookie_ar_dismiss,
cookie_ar_link= :cookie_ar_link,
cookie_de_message= :cookie_de_message,
cookie_de_dismiss= :cookie_de_dismiss,
cookie_de_link= :cookie_de_link,
cookie_fr_link= :cookie_fr_link,
ai_provider= :ai_provider,
openai_api_key= :openai_api_key,
gemini_api_key= :gemini_api_key,
xai_api_key= :xai_api_key,
ai_model= :ai_model,
serper_api_key= :serper_api_key';
}

$duzenlesorgusu .= ' WHERE id= :idal';
$kayitveri= guncel($duzenlesorgusu, $baglan);  
    $kayitveri->bindValue(':siteadial',$esiteadi, PDO::PARAM_STR);  
    $kayitveri->bindValue(':firmaadial',$efirmaadi, PDO::PARAM_STR);
    $kayitveri->bindValue(':adresal',$eadres, PDO::PARAM_STR);  
    $kayitveri->bindValue(':websitesial',$ewebsitesi, PDO::PARAM_STR); 
    $kayitveri->bindValue(':mailal',$email, PDO::PARAM_STR); 
    $kayitveri->bindValue(':vergidairesial',$evergidairesi, PDO::PARAM_STR); 
    $kayitveri->bindValue(':verginumarasial',$everginumarasi, PDO::PARAM_STR); 
    $kayitveri->bindValue(':telefonal',$etelefon, PDO::PARAM_STR); 
    $kayitveri->bindValue(':gsmal',$egsm, PDO::PARAM_STR); 
    $kayitveri->bindValue(':mersisnoal',$emersisno, PDO::PARAM_STR); 
    $kayitveri->bindValue(':logoal',$dosyasonuc1, PDO::PARAM_STR); 
    $kayitveri->bindValue(':facebook',$facebook, PDO::PARAM_STR); 
    $kayitveri->bindValue(':instagram',$instagram, PDO::PARAM_STR); 
    $kayitveri->bindValue(':twitter',$twitter, PDO::PARAM_STR); 
    $kayitveri->bindValue(':youtube',$youtube, PDO::PARAM_STR); 
    $kayitveri->bindValue(':linkedin',$linkedin, PDO::PARAM_STR); 
    $kayitveri->bindValue(':form_mail_alici',$form_mail_alici, PDO::PARAM_STR);
    
    // Cookie alanları varsa bind et
    if ($cookie_fields_exist) {
        $kayitveri->bindValue(':cookie_aktif',$cookie_aktif, PDO::PARAM_INT);
        $kayitveri->bindValue(':cookie_tr_message',$cookie_tr_message, PDO::PARAM_STR);
        $kayitveri->bindValue(':cookie_tr_dismiss',$cookie_tr_dismiss, PDO::PARAM_STR);
        $kayitveri->bindValue(':cookie_tr_link',$cookie_tr_link, PDO::PARAM_STR);
        $kayitveri->bindValue(':cookie_en_message',$cookie_en_message, PDO::PARAM_STR);
        $kayitveri->bindValue(':cookie_en_dismiss',$cookie_en_dismiss, PDO::PARAM_STR);
        $kayitveri->bindValue(':cookie_en_link',$cookie_en_link, PDO::PARAM_STR);
        $kayitveri->bindValue(':cookie_ru_message',$cookie_ru_message, PDO::PARAM_STR);
        $kayitveri->bindValue(':cookie_ru_dismiss',$cookie_ru_dismiss, PDO::PARAM_STR);
        $kayitveri->bindValue(':cookie_ru_link',$cookie_ru_link, PDO::PARAM_STR);
        $kayitveri->bindValue(':cookie_ar_message',$cookie_ar_message, PDO::PARAM_STR);
        $kayitveri->bindValue(':cookie_ar_dismiss',$cookie_ar_dismiss, PDO::PARAM_STR);
        $kayitveri->bindValue(':cookie_ar_link',$cookie_ar_link, PDO::PARAM_STR);
        $kayitveri->bindValue(':cookie_de_message',$cookie_de_message, PDO::PARAM_STR);
        $kayitveri->bindValue(':cookie_de_dismiss',$cookie_de_dismiss, PDO::PARAM_STR);
        $kayitveri->bindValue(':cookie_de_link',$cookie_de_link, PDO::PARAM_STR);
        $kayitveri->bindValue(':cookie_fr_message',$cookie_fr_message, PDO::PARAM_STR);
        $kayitveri->bindValue(':cookie_fr_dismiss',$cookie_fr_dismiss, PDO::PARAM_STR);
        $kayitveri->bindValue(':cookie_fr_link',$cookie_fr_link, PDO::PARAM_STR);
        
        // AI Bindings
        $kayitveri->bindValue(':ai_provider', $ai_provider, PDO::PARAM_STR);
        $kayitveri->bindValue(':openai_api_key', $openai_api_key, PDO::PARAM_STR);
        $kayitveri->bindValue(':gemini_api_key', $gemini_api_key, PDO::PARAM_STR);
        $kayitveri->bindValue(':xai_api_key', $xai_api_key, PDO::PARAM_STR);
        $kayitveri->bindValue(':ai_model', $ai_model, PDO::PARAM_STR);
        $kayitveri->bindValue(':serper_api_key', $serper_api_key, PDO::PARAM_STR);
    }    
    $kayitveri->bindValue(':idal',$gelenid, PDO::PARAM_INT);
    $kayitveri->execute();    
 
 if (!$kayitveri) {echo "<script type='text/javascript'>alert('Hata! Ayarlar Güncellenemedi');</script> ";}     if ($kayitveri) {echo "<script type='text/javascript'>alert('Güncelleme Başarılı'); window.location.href='ayarlar.php?bilgikayitonay=ok';</script>";}   
    
    
    
    
     
}

}
 


$ayarlar = "SELECT * FROM ayarlar";
$ayarlarb = sorgu($ayarlar, $baglan);
$ayarlarb->execute();     
$ayarlarliste =veriliste($ayarlarb);

?>
            
            
            
         <script type="text/javascript">
        function numbersonly(myfield, e, dec) {
            var key;
            var keychar;
            if (window.event)
                key = window.event.keyCode;
            else if (e)
                key = e.which;
            else
                return true;
            keychar = String.fromCharCode(key);
            // control keys
            if ((key == null) || (key == 0) || (key == 8) ||
    (key == 9) || (key == 13) || (key == 27) )
                return true;
            // numbers
            else if ((("0123456789,").indexOf(keychar) > -1))
                return true;
            // decimal point jump
            else if (dec && (keychar == ".")) {
                myfield.form.elements[dec].focus();
                return false;
            }
            else
                return false;
        }
</script>          
            
            
            
            
            
            
                
                <div class="mainpanel">
                    <div class="pageheader">
                        <div class="media">
                            <div class="pageicon pull-left">
                                <i class="fa fa-pencil"></i>
                            </div>
                              <div class="media-body">
                                <ul class="breadcrumb">
                                    <li><a href=""><i class="glyphicon glyphicon-home"></i></a></li>
                                    <li><a href="">Ayarlar</a></li>
                                    <li>Ayarlar</li>
                                </ul>
                                <h4>Ayarlar</h4>
                            </div>
                        </div><!-- media -->
                    </div><!-- pageheader -->
                    
                    <div class="contentpanel">
                        
                        <!-- Tab Navigasyonu -->
                        <ul class="nav nav-tabs nav-justified" style="margin-bottom: 20px;">
                            <li class="nav-item">
                                <a class="nav-link active" href="#genel_ayarlar" data-bs-toggle="tab"><i class="fa fa-cog"></i> <strong>Genel Ayarlar</strong></a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#email_ayarlari" data-bs-toggle="tab"><i class="fa fa-envelope"></i> <strong>Email Ayarları</strong></a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#cookie_ayarlari" data-bs-toggle="tab"><i class="fa fa-shield"></i> <strong>Cookie Ayarları</strong></a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#ai_ayarlari" data-bs-toggle="tab"><i class="fa fa-magic"></i> <strong>Yapay Zeka</strong></a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#seo_tools" data-bs-toggle="tab"><i class="fa fa-line-chart"></i> <strong>SEO Araçları</strong></a>
                            </li>
                        </ul>
                        
                        <form class="form-horizontal form-bordered" name="ayar" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="POST" enctype="multipart/form-data"  id="ayar"> 
                          
                           <input name="id" type="hidden" id="id" value="<?php echo $ayarlarliste['id']; ?>">
                
                        <div class="tab-content">
                            <!-- Genel Ayarlar Tab -->
                            <div class="tab-pane fade show active" id="genel_ayarlar">
                        <div class="row">
                             <div class="col-md-6">
                                <div class="panel panel-default">
                                    <div class="panel-heading">
                                        <div class="panel-btns">
                                            <a href="" class="panel-minimize tooltips" data-toggle="tooltip" title="Minimize Panel"><i class="fa fa-minus"></i></a>
                                            <a href="" class="panel-close tooltips" data-toggle="tooltip" title="Close Panel"><i class="fa fa-times"></i></a>
                                        </div><!-- panel-btns -->
                                        <h4 class="panel-title">Firma Bilgileri</h4>
                                       
                                    </div><!-- panel-heading -->
                                    
                                    <div class="panel-body">
          
                                         <div class="form-group">
                                                <label class="col-sm-4 control-label">Logo <?php if ($ayarlarliste['logo']!='') {?> - <img width="20" height="max-height:20px;" src="dosya/<?php echo $ayarlarliste['logo']; ?>"> <?php } else  {;}?></label>
                                                <div class="col-sm-8">
                                               
                                                
<input name="resim1" type="hidden"  value="<?php echo $ayarlarliste['logo']; ?>" size="60" />

                                                    <input type="file" name="resim1_1" id="resim1_1"   class="form-control tooltips" />
                                                </div>
                                            </div><!-- form-group -->
                                            
                                            
                                           


                                             <div class="form-group">
                                                <label class="col-sm-4 control-label">Site Adı</label>
                                                <div class="col-sm-8">
                                                    <input type="text" name="siteadi"  value="<?php echo $ayarlarliste['siteadi']; ?>"  class="form-control tooltips" />
                                                </div>
                                            </div><!-- form-group -->
                                            
                                            
                                             <div class="form-group">
                                                <label class="col-sm-4 control-label">Firma Adı</label>
                                                <div class="col-sm-8">
                                                    <input type="text" name="firmaadi"  value="<?php echo $ayarlarliste['firmaadi']; ?>"   class="form-control tooltips" />
                                                </div>
                                            </div><!-- form-group -->
                                            
                                            
                                            <div class="form-group">
                                                <label class="col-sm-4 control-label">Adres</label>
                                                <div class="col-sm-8">
                                                   <input type="text" name="adres"  value="<?php echo $ayarlarliste['adres']; ?>"  class="form-control tooltips" />
                                                </div>
                                            </div><!-- form-group -->
                                            
                                            
                                                <div class="form-group">
                                                <label class="col-sm-4 control-label">Web Sitesi</label>
                                                <div class="col-sm-8">
                                                   <input type="text" name="websitesi"   value="<?php echo $ayarlarliste['websitesi']; ?>"    class="form-control tooltips" />
                                                </div>
                                            </div><!-- form-group -->
                                            
                                             <div class="form-group">
                                                <label class="col-sm-4 control-label">Mail</label>
                                                <div class="col-sm-8">
                                                   <input type="text" name="mail"    value="<?php echo $ayarlarliste['mail']; ?>"  class="form-control tooltips" />
                                                </div>
                                            </div><!-- form-group -->
                                            
                                        
                                        
                                        
                                            
                                              
                                    </div><!-- panel-body -->       
                                </div><!-- panel -->
                            </div><!-- col-md-6 -->
                            
                            <div class="col-md-6">
                                <div class="panel panel-default">
                                    <div class="panel-heading">
                                        <div class="panel-btns">
                                            <a href="" class="panel-minimize tooltips" data-toggle="tooltip" title="Minimize Panel"><i class="fa fa-minus"></i></a>
                                            <a href="" class="panel-close tooltips" data-toggle="tooltip" title="Close Panel"><i class="fa fa-times"></i></a>
                                        </div><!-- panel-btns -->
                                        <h4 class="panel-title">Kurum Bilgileri</h4>
                                       
                                    </div><!-- panel-heading -->
                                    
                                    <div class="panel-body">
          
                                     
                                     
                                         
                                            
                                            
                                            
                                               <div class="form-group">
                                                <label class="col-sm-4 control-label">Vergi Dairesi</label>
                                                <div class="col-sm-8">
                                                   <input type="text" name="vergidairesi"  value="<?php echo $ayarlarliste['vergidairesi']; ?>"  class="form-control tooltips" />
                                                </div>
                                            </div><!-- form-group -->
                                            
                                            
                                               <div class="form-group">
                                                <label class="col-sm-4 control-label">Vergi Numarası</label>
                                                <div class="col-sm-8">
                                                   <input type="text" name="verginumarasi" value="<?php echo $ayarlarliste['verginumarasi']; ?>"   class="form-control tooltips" />
                                                </div>
                                            </div><!-- form-group -->
                                            
                                               <div class="form-group">
                                                <label class="col-sm-4 control-label">Mersis No</label>
                                                <div class="col-sm-8">
                                                   <input type="text" name="mersisno"  value="<?php echo $ayarlarliste['mersisno']; ?>" class="form-control tooltips" /> 
                                                </div>
                                            </div><!-- form-group -->
                                            
                                            
                                               <div class="form-group">
                                                <label class="col-sm-4 control-label">Telefon</label>
                                                <div class="col-sm-8">
                                                   <input type="text" name="telefon"  value="<?php echo $ayarlarliste['telefon']; ?>" class="form-control tooltips" />
                                                </div>
                                            </div><!-- form-group -->
                                            
                                               <div class="form-group">
                                                <label class="col-sm-4 control-label">Gsm</label>
                                                <div class="col-sm-8">
                                                   <input type="text" name="gsm"  value="<?php echo $ayarlarliste['gsm']; ?>"   class="form-control tooltips" />
                                                </div>
                                            </div><!-- form-group -->
                                        
                                        
                                         <div class="form-group">
                                                <label class="col-sm-4 control-label">Facebook</label>
                                                <div class="col-sm-8">
                                                   <input type="text" name="facebook"  value="<?php echo $ayarlarliste['facebook']; ?>"   class="form-control tooltips" />
                                                </div>
                                            </div><!-- form-group -->
                                        
                                         <div class="form-group">
                                                <label class="col-sm-4 control-label">Instagram</label>
                                                <div class="col-sm-8">
                                                   <input type="text" name="instagram"  value="<?php echo $ayarlarliste['instagram']; ?>"   class="form-control tooltips" />
                                                </div>
                                            </div><!-- form-group -->
                                        
                                         <div class="form-group">
                                                <label class="col-sm-4 control-label">Twitter</label>
                                                <div class="col-sm-8">
                                                   <input type="text" name="twitter"  value="<?php echo $ayarlarliste['twitter']; ?>"   class="form-control tooltips" />
                                                </div>
                                            </div><!-- form-group -->
                                        
                                         <div class="form-group">
                                                <label class="col-sm-4 control-label">Youtube</label>
                                                <div class="col-sm-8">
                                                   <input type="text" name="youtube"  value="<?php echo $ayarlarliste['youtube']; ?>"   class="form-control tooltips" />
                                                </div>
                                            </div><!-- form-group -->

                                            <div class="form-group">
                                                <label class="col-sm-4 control-label">Linkedin</label>
                                                <div class="col-sm-8">
                                                   <input type="text" name="linkedin"  value="<?php echo $ayarlarliste['linkedin']; ?>"   class="form-control tooltips" />
                                                </div>
                                            </div><!-- form-group -->
                                            
                                        
                                        
                                     
                                           
                                    </div><!-- panel-body -->       
                                </div><!-- panel -->
                            </div><!-- col-md-6 -->
                            
                           
                           
                        </div><!-- row -->
                            </div><!-- tab-pane genel_ayarlar -->

                            <!-- SEO Tools Tab -->
                            <div class="tab-pane fade" id="seo_tools">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="panel panel-default">
                                            <div class="panel-heading">
                                                <div class="panel-btns">
                                                    <a href="" class="panel-minimize tooltips" data-toggle="tooltip" title="Minimize Panel"><i class="fa fa-minus"></i></a>
                                                </div>
                                                <h4 class="panel-title"><i class="fa fa-line-chart"></i> Toplu SEO Analizi</h4>
                                            </div>
                                            <div class="panel-body">
                                                <div class="alert alert-info">
                                                    <i class="fa fa-info-circle"></i> Bu araç, tüm içeriklerinizi tarayarak SEO skorlarını yeniden hesaplar. İşlem süresi içerik sayısına göre değişebilir.
                                                </div>
                                                
                                                <div class="form-group">
                                                    <label class="col-sm-3 control-label">İşlem Durumu</label>
                                                    <div class="col-sm-9">
                                                        <button type="button" id="start-bulk-seo" class="btn btn-primary btn-lg">
                                                            <i class="fa fa-play"></i> Analizi Başlat
                                                        </button>
                                                        <button type="button" id="stop-bulk-seo" class="btn btn-danger btn-lg" style="display:none;">
                                                            <i class="fa fa-stop"></i> Durdur
                                                        </button>
                                                    </div>
                                                </div>

                                                <div id="seo-progress-container" style="display:none; margin-top:20px;">
                                                    <div class="progress">
                                                        <div id="seo-progress-bar" class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">
                                                            <span id="seo-progress-text">0%</span>
                                                        </div>
                                                    </div>
                                                    <div id="seo-log" style="height: 150px; overflow-y: auto; background: #f5f5f5; border: 1px solid #ddd; padding: 10px; font-family: monospace;"></div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div><!-- tab-pane seo_tools -->
                            
                            <!-- Email Ayarları Tab -->
                            <div class="tab-pane fade" id="email_ayarlari">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="panel panel-default">
                                            <div class="panel-heading">
                                                <div class="panel-btns">
                                                    <a href="" class="panel-minimize tooltips" data-toggle="tooltip" title="Minimize Panel"><i class="fa fa-minus"></i></a>
                                                    <a href="" class="panel-close tooltips" data-toggle="tooltip" title="Close Panel"><i class="fa fa-times"></i></a>
                                                </div>
                                                <h4 class="panel-title"><i class="fa fa-envelope"></i> Email Ayarları</h4>
                                            </div>
                                            <div class="panel-body">
                                                <div class="form-group">
                                                    <label class="col-sm-3 control-label">Form Mail Alıcıları</label>
                                                    <div class="col-sm-9">
                                                       <?php 
                                                       // Eğer form_mail_alici boşsa, varsayılan olarak mail adresini göster
                                                       $default_mail = '';
                                                       if (empty($ayarlarliste['form_mail_alici']) && !empty($ayarlarliste['mail'])) {
                                                           $default_mail = $ayarlarliste['mail'];
                                                       } else {
                                                           $default_mail = isset($ayarlarliste['form_mail_alici']) ? $ayarlarliste['form_mail_alici'] : '';
                                                       }
                                                       ?>
                                                       <input type="text" name="form_mail_alici" value="<?php echo htmlspecialchars($default_mail); ?>" class="form-control tooltips" placeholder="<?php echo htmlspecialchars($ayarlarliste['mail']); ?>" />
                                                       <span class="help-block">Birden fazla e-posta adresi virgül (,) veya noktalı virgül (;) ile ayrılabilir. <strong>Mevcut mail adresi: <?php echo htmlspecialchars($ayarlarliste['mail']); ?></strong></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div><!-- tab-pane email_ayarlari -->
                            
                            <!-- Cookie Ayarları Tab -->
                            <div class="tab-pane fade" id="cookie_ayarlari">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="panel panel-default">
                                            <div class="panel-heading">
                                                <div class="panel-btns">
                                                    <a href="" class="panel-minimize tooltips" data-toggle="tooltip" title="Minimize Panel"><i class="fa fa-minus"></i></a>
                                                    <a href="" class="panel-close tooltips" data-toggle="tooltip" title="Close Panel"><i class="fa fa-times"></i></a>
                                                </div>
                                                <h4 class="panel-title"><i class="fa fa-shield"></i> Çerez (Cookie) Ayarları</h4>
                                            </div>
                                            <div class="panel-body">
                                        <div class="form-group">
                                            <label class="col-sm-3 control-label">Çerez Uyarısı Aktif</label>
                                            <div class="col-sm-9">
                                                <div class="ckbox ckbox-primary">
                                                    <input type="checkbox" name="cookie_aktif" id="cookie_aktif" value="1" <?php echo (isset($ayarlarliste['cookie_aktif']) && $ayarlarliste['cookie_aktif'] == 1) ? 'checked' : ''; ?> />
                                                    <label for="cookie_aktif">Çerez uyarısını göster</label>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <ul class="nav nav-tabs mt-3">
                                            <li class="nav-item"><a class="nav-link active" href="#cookie_tr" data-bs-toggle="tab"><strong>Türkçe</strong></a></li>
                                            <li class="nav-item"><a class="nav-link" href="#cookie_en" data-bs-toggle="tab"><strong>İngilizce</strong></a></li>
                                            <li class="nav-item"><a class="nav-link" href="#cookie_ru" data-bs-toggle="tab"><strong>Rusça</strong></a></li>
                                            <li class="nav-item"><a class="nav-link" href="#cookie_ar" data-bs-toggle="tab"><strong>Arapça</strong></a></li>
                                            <li class="nav-item"><a class="nav-link" href="#cookie_de" data-bs-toggle="tab"><strong>Almanca</strong></a></li>
                                            <li class="nav-item"><a class="nav-link" href="#cookie_fr" data-bs-toggle="tab"><strong>Fransızca</strong></a></li>
                                        </ul>
                                        
                                        <div class="tab-content mb30" style="padding-top: 20px;">
                                            <!-- Türkçe -->
                                            <div class="tab-pane fade show active" id="cookie_tr">
                                                <div class="form-group">
                                                    <label class="col-sm-3 control-label">Mesaj</label>
                                                    <div class="col-sm-9">
                                                        <textarea name="cookie_tr_message" class="form-control" rows="3"><?php echo isset($ayarlarliste['cookie_tr_message']) ? htmlspecialchars($ayarlarliste['cookie_tr_message']) : 'Bu web sitesi, size en iyi deneyimi sunmak için çerezler kullanmaktadır. KVKK ve GDPR uyumlu olarak, çerez kullanımına izin vererek kişisel verilerinizin işlenmesini kabul etmiş olursunuz. Daha fazla bilgi için gizlilik politikamızı inceleyebilirsiniz.'; ?></textarea>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-sm-3 control-label">Kabul Butonu</label>
                                                    <div class="col-sm-9">
                                                        <input type="text" name="cookie_tr_dismiss" class="form-control" value="<?php echo isset($ayarlarliste['cookie_tr_dismiss']) ? htmlspecialchars($ayarlarliste['cookie_tr_dismiss']) : 'Tamam'; ?>" />
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-sm-3 control-label">Link Metni</label>
                                                    <div class="col-sm-9">
                                                        <input type="text" name="cookie_tr_link" class="form-control" value="<?php echo isset($ayarlarliste['cookie_tr_link']) ? htmlspecialchars($ayarlarliste['cookie_tr_link']) : 'Daha fazla bilgi'; ?>" />
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <!-- İngilizce -->
                                            <div class="tab-pane fade" id="cookie_en">
                                                <div class="form-group">
                                                    <label class="col-sm-3 control-label">Message</label>
                                                    <div class="col-sm-9">
                                                        <textarea name="cookie_en_message" class="form-control" rows="3"><?php echo isset($ayarlarliste['cookie_en_message']) ? htmlspecialchars($ayarlarliste['cookie_en_message']) : 'This website uses cookies to provide you with the best experience. By accepting cookie usage, you consent to the processing of your personal data in compliance with GDPR. For more information, please review our privacy policy.'; ?></textarea>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-sm-3 control-label">Dismiss Button</label>
                                                    <div class="col-sm-9">
                                                        <input type="text" name="cookie_en_dismiss" class="form-control" value="<?php echo isset($ayarlarliste['cookie_en_dismiss']) ? htmlspecialchars($ayarlarliste['cookie_en_dismiss']) : 'OK'; ?>" />
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-sm-3 control-label">Link Text</label>
                                                    <div class="col-sm-9">
                                                        <input type="text" name="cookie_en_link" class="form-control" value="<?php echo isset($ayarlarliste['cookie_en_link']) ? htmlspecialchars($ayarlarliste['cookie_en_link']) : 'Learn more'; ?>" />
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <!-- Rusça -->
                                            <div class="tab-pane fade" id="cookie_ru">
                                                <div class="form-group">
                                                    <label class="col-sm-3 control-label">Сообщение</label>
                                                    <div class="col-sm-9">
                                                        <textarea name="cookie_ru_message" class="form-control" rows="3"><?php echo isset($ayarlarliste['cookie_ru_message']) ? htmlspecialchars($ayarlarliste['cookie_ru_message']) : 'Этот веб-сайт использует файлы cookie для обеспечения наилучшего опыта. Принимая использование файлов cookie, вы соглашаетесь на обработку ваших персональных данных в соответствии с GDPR. Для получения дополнительной информации ознакомьтесь с нашей политикой конфиденциальности.'; ?></textarea>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-sm-3 control-label">Кнопка принятия</label>
                                                    <div class="col-sm-9">
                                                        <input type="text" name="cookie_ru_dismiss" class="form-control" value="<?php echo isset($ayarlarliste['cookie_ru_dismiss']) ? htmlspecialchars($ayarlarliste['cookie_ru_dismiss']) : 'ОК'; ?>" />
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-sm-3 control-label">Текст ссылки</label>
                                                    <div class="col-sm-9">
                                                        <input type="text" name="cookie_ru_link" class="form-control" value="<?php echo isset($ayarlarliste['cookie_ru_link']) ? htmlspecialchars($ayarlarliste['cookie_ru_link']) : 'Узнать больше'; ?>" />
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <!-- Arapça -->
                                            <div class="tab-pane fade" id="cookie_ar">
                                                <div class="form-group">
                                                    <label class="col-sm-3 control-label">الرسالة</label>
                                                    <div class="col-sm-9">
                                                        <textarea name="cookie_ar_message" class="form-control" rows="3" dir="rtl"><?php echo isset($ayarlarliste['cookie_ar_message']) ? htmlspecialchars($ayarlarliste['cookie_ar_message']) : 'يستخدم هذا الموقع ملفات تعريف الارتباط لتزويدك بأفضل تجربة. من خلال قبول استخدام ملفات تعريف الارتباط، فإنك توافق على معالجة بياناتك الشخصية وفقًا لـ GDPR. لمزيد من المعلومات، يرجى مراجعة سياسة الخصوصية الخاصة بنا.'; ?></textarea>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-sm-3 control-label">زر الموافقة</label>
                                                    <div class="col-sm-9">
                                                        <input type="text" name="cookie_ar_dismiss" class="form-control" dir="rtl" value="<?php echo isset($ayarlarliste['cookie_ar_dismiss']) ? htmlspecialchars($ayarlarliste['cookie_ar_dismiss']) : 'حسنا'; ?>" />
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-sm-3 control-label">نص الرابط</label>
                                                    <div class="col-sm-9">
                                                        <input type="text" name="cookie_ar_link" class="form-control" dir="rtl" value="<?php echo isset($ayarlarliste['cookie_ar_link']) ? htmlspecialchars($ayarlarliste['cookie_ar_link']) : 'المزيد من المعلومات'; ?>" />
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <!-- Almanca -->
                                            <div class="tab-pane fade" id="cookie_de">
                                                <div class="form-group">
                                                    <label class="col-sm-3 control-label">Nachricht</label>
                                                    <div class="col-sm-9">
                                                        <textarea name="cookie_de_message" class="form-control" rows="3"><?php echo isset($ayarlarliste['cookie_de_message']) ? htmlspecialchars($ayarlarliste['cookie_de_message']) : 'Diese Website verwendet Cookies, um Ihnen die beste Erfahrung zu bieten. Durch die Annahme der Cookie-Nutzung stimmen Sie der Verarbeitung Ihrer personenbezogenen Daten gemäß DSGVO zu. Weitere Informationen finden Sie in unserer Datenschutzerklärung.'; ?></textarea>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-sm-3 control-label">Akzeptieren-Button</label>
                                                    <div class="col-sm-9">
                                                        <input type="text" name="cookie_de_dismiss" class="form-control" value="<?php echo isset($ayarlarliste['cookie_de_dismiss']) ? htmlspecialchars($ayarlarliste['cookie_de_dismiss']) : 'OK'; ?>" />
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-sm-3 control-label">Link-Text</label>
                                                    <div class="col-sm-9">
                                                        <input type="text" name="cookie_de_link" class="form-control" value="<?php echo isset($ayarlarliste['cookie_de_link']) ? htmlspecialchars($ayarlarliste['cookie_de_link']) : 'Mehr erfahren'; ?>" />
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <!-- Fransızca -->
                                            <div class="tab-pane fade" id="cookie_fr">
                                                <div class="form-group">
                                                    <label class="col-sm-3 control-label">Message</label>
                                                    <div class="col-sm-9">
                                                        <textarea name="cookie_fr_message" class="form-control" rows="3"><?php echo isset($ayarlarliste['cookie_fr_message']) ? htmlspecialchars($ayarlarliste['cookie_fr_message']) : 'Ce site Web utilise des cookies pour vous offrir la meilleure expérience. En acceptant l\'utilisation des cookies, vous consentez au traitement de vos données personnelles conformément au RGPD. Pour plus d\'informations, veuillez consulter notre politique de confidentialité.'; ?></textarea>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-sm-3 control-label">Bouton d\'acceptation</label>
                                                    <div class="col-sm-9">
                                                        <input type="text" name="cookie_fr_dismiss" class="form-control" value="<?php echo isset($ayarlarliste['cookie_fr_dismiss']) ? htmlspecialchars($ayarlarliste['cookie_fr_dismiss']) : 'OK'; ?>" />
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-sm-3 control-label">Texte du lien</label>
                                                    <div class="col-sm-9">
                                                        <input type="text" name="cookie_fr_link" class="form-control" value="<?php echo isset($ayarlarliste['cookie_fr_link']) ? htmlspecialchars($ayarlarliste['cookie_fr_link']) : 'En savoir plus'; ?>" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                            </div><!-- tab-pane cookie_ayarlari -->
                            
                            <!-- AI Ayarları Tab -->
                            <div class="tab-pane fade" id="ai_ayarlari">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="panel panel-default">
                                            <div class="panel-heading">
                                                <h4 class="panel-title"><i class="fa fa-magic"></i> Yapay Zeka (AI) Ayarları</h4>
                                                <p>İçerik üretiminde kullanılacak yapay zeka servis sağlayıcısını seçin ve API anahtarınızı girin.</p>
                                            </div>
                                            <div class="panel-body">
                                                
                                                <div class="form-group">
                                                    <label class="col-sm-3 control-label">AI Servis Sağlayıcı</label>
                                                    <div class="col-sm-9">
                                                        <select name="ai_provider" class="form-control">
                                                            <option value="openai" <?php echo (isset($ayarlarliste['ai_provider']) && $ayarlarliste['ai_provider'] == 'openai') ? 'selected' : ''; ?>>OpenAI (ChatGPT)</option>
                                                            <option value="gemini" <?php echo (isset($ayarlarliste['ai_provider']) && $ayarlarliste['ai_provider'] == 'gemini') ? 'selected' : ''; ?>>Google Gemini</option>
                                                            <option value="xai" <?php echo (isset($ayarlarliste['ai_provider']) && $ayarlarliste['ai_provider'] == 'xai') ? 'selected' : ''; ?>>X.AI (Grok)</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div class="form-group">
                                                    <label class="col-sm-3 control-label">OpenAI API Key</label>
                                                    <div class="col-sm-9">
                                                        <input type="password" name="openai_api_key" value="<?php echo (!empty($ayarlarliste['openai_api_key'])) ? '********************' : ''; ?>" class="form-control" placeholder="sk-..." />
                                                        <span class="help-block"><a href="https://platform.openai.com/api-keys" target="_blank">OpenAI API Key Al</a></span>
                                                    </div>
                                                </div>

                                                <div class="form-group">
                                                    <label class="col-sm-3 control-label">Gemini API Key</label>
                                                    <div class="col-sm-9">
                                                        <input type="password" name="gemini_api_key" value="<?php echo (!empty($ayarlarliste['gemini_api_key'])) ? '********************' : ''; ?>" class="form-control" placeholder="AIza..." />
                                                        <span class="help-block"><a href="https://aistudio.google.com/app/apikey" target="_blank">Google Gemini API Key Al</a></span>
                                                    </div>
                                                </div>

                                                <div class="form-group">
                                                    <label class="col-sm-3 control-label">X.AI API Key</label>
                                                    <div class="col-sm-9">
                                                        <input type="password" name="xai_api_key" value="<?php echo (!empty($ayarlarliste['xai_api_key'])) ? '********************' : ''; ?>" class="form-control" placeholder="xai-..." />
                                                        <span class="help-block"><a href="https://console.x.ai/" target="_blank">X.AI API Key Al</a></span>
                                                    </div>
                                                </div>

                                                <hr>
                                                <h5 class="mb-3">Google Search Ayarları (Serper.dev)</h5>
                                                <p class="text-muted"><small>Serper.dev, Google Arama sonuçlarını hızlı ve ucuz getiren bir servistir. <a href="https://serper.dev" target="_blank">Serper.dev</a> üzerinden ücretsiz API anahtarı alabilirsiniz.</small></p>
                                                
                                                <div class="form-group">
                                                    <label class="col-sm-3 control-label">Serper API Key</label>
                                                    <div class="col-sm-9">
                                                        <input type="password" name="serper_api_key" value="<?php echo (!empty($ayarlarliste['serper_api_key'])) ? '********************' : ''; ?>" class="form-control" placeholder="API Key..." />
                                                    </div>
                                                </div>
                                                <hr>

                                                <div class="form-group">
                                                    <label class="col-sm-3 control-label">Model Adı</label>
                                                    <div class="col-sm-9">
                                                        <input type="text" name="ai_model" value="<?php echo isset($ayarlarliste['ai_model']) ? htmlspecialchars($ayarlarliste['ai_model']) : 'gpt-4o'; ?>" class="form-control" placeholder="gpt-4o, gpt-3.5-turbo, gemini-1.5-flash vb." />
                                                        <span class="help-block">Varsayılan: <code>gpt-4o</code> veya <code>gemini-1.5-flash</code></span>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div><!-- tab-pane ai_ayarlari -->
                            
                        </div><!-- tab-content -->
                             
                        </form> 
                    </div><!-- contentpanel -->
                </div>
            </div><!-- mainwrapper -->
        </section>
        
        <!-- Sabit Alt Bar - Kaydet Butonları (Modern) -->
        <div class="fixed-bottom-bar">
            <div class="action-buttons">
                <button type="button" class="btn btn-default" onclick="if(confirm('Değişiklikler kaydedilmeden çıkmak istediğinizden emin misiniz?')) { window.location.reload(); }">
                    <i class="fa fa-times"></i> İptal
                </button>
                <button type="submit" form="ayar" class="btn btn-primary">
                    <i class="fa fa-save"></i> Güncelle
                </button>
                <input type="hidden" form="ayar" name="genelkayitguncelle" value="1">
            </div>
        </div>

<script>
// Sabit alt bar'ın sol menü durumuna göre pozisyonunu ayarla
jQuery(document).ready(function() {
    function updateFixedBarPosition() {
        var $fixedBar = jQuery('.fixed-bottom-bar');
        if ($fixedBar.length) {
            if (jQuery('.mainwrapper').hasClass('collapsed')) {
                $fixedBar.css('left', '61px');
            } else {
                $fixedBar.css('left', '230px');
            }
        }
    }
    
    // Sayfa yüklendiğinde kontrol et
    updateFixedBarPosition();
    
    // Sol menü toggle olduğunda güncelle
    jQuery(document).on('click', '.leftpanel-toggle, .leftpanel-collapse', function() {
        setTimeout(updateFixedBarPosition, 300);
    });
    
    // Window resize olduğunda güncelle
    jQuery(window).on('resize', updateFixedBarPosition);
});
</script>

<script>
jQuery(document).ready(function() {
    // --- HACKER TERMINAL & MODAL LOGIC ---
    function initTerminal() {
        if (jQuery('#hacker-terminal').length === 0) {
            const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            jQuery('body').append(`
                <!-- HACKER TERMINAL -->
                <div id="hacker-terminal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index:99999; font-family:'Courier New', monospace; color:#0f0; padding:20px; overflow:hidden;">
                    <div style="max-width:900px; margin:50px auto; border: 1px solid #0f0; padding: 20px; background:#000; box-shadow: 0 0 20px #0f0; min-height:500px; position:relative;">
                        <div style="border-bottom:1px solid #0f0; padding-bottom:10px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-weight:bold; letter-spacing:2px;">TERMINAL_SESSION_${dateCode}_ROOT</span>
                            <button id="close-terminal-btn" style="background:none; border:1px solid #0f0; color:#0f0; padding:5px 10px; cursor:pointer; font-family:inherit; display:none;">[ SHUTDOWN ]</button>
                        </div>
                        <div id="terminal-logs" style="height:380px; overflow-y:auto; font-size:14px; line-height:1.5;"></div>
                        <div class="progress mt-3" style="height: 5px; background: #333;">
                            <div id="terminal-progress-bar" class="progress-bar bg-success" role="progressbar" style="width: 0%; background-color:#0f0 !important;"></div>
                        </div>
                        <div class="blinking-cursor" style="margin-top:10px;">> <span id="typing-line"></span><span style="animation: blink 1s step-end infinite;">_</span></div>
                    </div>
                </div>

                <!-- HACKER CONFIRM MODAL -->
                <div id="hacker-confirm" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:10001; font-family:'Courier New', monospace; color:#0f0;">
                    <div style="width:500px; margin:15% auto; border: 2px solid #f00; background:#000; box-shadow: 0 0 30px #f00; padding:20px; text-align:center;">
                        <h3 style="color:#f00; border-bottom:1px solid #f00; padding-bottom:10px;">⚠️ SYSTEM WARNING</h3>
                        <p style="font-size:16px; margin:20px 0;">INITIATING BULK SEO ANALYSIS.</p>
                        <p style="margin-bottom:20px;">THIS WILL RE-CALCULATE SCORES FOR <span style="color:#f00;">ALL CONTENT</span>.</p>
                        <p>PROCEED WITH OPERATION?</p>
                        <div style="display:flex; justify-content:center; gap:20px; margin-top:30px;">
                            <button id="hacker-confirm-yes" class="btn btn-lg" style="border:1px solid #f00; color:#f00; background:#000; padding: 10px 30px;">[ Y ] EXECUTE</button>
                            <button id="hacker-confirm-no" class="btn btn-lg" style="border:1px solid #0f0; color:#0f0; background:#000; padding: 10px 30px;">[ N ] ABORT</button>
                        </div>
                    </div>
                </div>

                <style>
                    @keyframes blink { 50% { opacity: 0; } }
                    #terminal-logs p { margin: 2px 0; opacity: 0.9; text-shadow: 0 0 2px rgba(0,255,0,0.5); }
                    .log-success { color: #0f0; }
                    .log-warning { color: #ff0; }
                    .log-error { color: #f00; font-weight:bold; }
                    .log-info { color: #0ff; }
                    #hacker-terminal ::-webkit-scrollbar { width: 8px; }
                    #hacker-terminal ::-webkit-scrollbar-track { background: #000; }
                    #hacker-terminal ::-webkit-scrollbar-thumb { background: #0f0; }
                </style>
            `);
            
            jQuery('#close-terminal-btn').click(function(e) {
                e.preventDefault();
                jQuery('#hacker-terminal').fadeOut();
            });

            jQuery('#hacker-confirm-no').click(function(e) {
                e.preventDefault();
                jQuery('#hacker-confirm').fadeOut();
            });

            jQuery('#hacker-confirm-yes').click(function(e) {
                e.preventDefault();
                jQuery('#hacker-confirm').fadeOut();
                startTerminalProcess();
            });
        }
    }

    function log(msg, type = 'normal') {
        const colors = { 'normal': '#0f0', 'success': '#0f0', 'warning': '#ff0', 'error': '#f00', 'info': '#0ff' };
        const timestamp = new Date().toLocaleTimeString('tr-TR');
        const p = jQuery(`<p style="color:${colors[type]}"><span style="opacity:0.5">[${timestamp}]</span> ${msg}</p>`);
        jQuery('#terminal-logs').append(p);
        const div = document.getElementById('terminal-logs');
        if (div) div.scrollTop = div.scrollHeight;
    }

    // --- BULK SEO LOGIC ---
    let isProcessing = false;
    let processedCount = 0;
    let errorCount = 0;

    $('#start-bulk-seo').click(function(e) {
        e.preventDefault(); 
        e.stopPropagation();
        
        initTerminal(); // Ensure DOM exists
        $('#hacker-confirm').fadeIn(200); // Show Modal First
    });

    function startTerminalProcess() {
        if(isProcessing) return;

        // Init UI
        $('#terminal-logs').empty();
        $('#hacker-terminal').fadeIn(200);
        $('#close-terminal-btn').hide();
        $('#terminal-progress-bar').css('width', '0%');
        
        isProcessing = true;
        processedCount = 0;
        errorCount = 0;
        
        log('INITIALIZING BULK SEO ANALYSIS PROTOCOL...', 'info');
        setTimeout(() => {
            log('Target: ALL CONTENT DATABASE', 'normal');
            log('Loading scoring matrix...', 'warning');
            setTimeout(() => {
                log('STARTING BATCH PROCESSING...', 'success');
                processBatch(0);
            }, 1000);
        }, 800);
    }

    $('#stop-bulk-seo').click(function(e) {
        e.preventDefault();
        isProcessing = false;
        log('MANUAL ABORT INITIATED.', 'error');
        finishProcess();
    });

    function processBatch(startRef) {
        if(!isProcessing) return;

        $.ajax({
            url: 'ajax/seo_bulk_update.php',
            type: 'GET',
            data: { start_ref: startRef, limit: 10 },
            dataType: 'json',
            success: function(res) {
                if(res.status === 'success') {
                    if (res.processed_count > 0) {
                        processedCount += res.processed_count;
                        log(`BATCH COMPLETE. Scanned: 10 | Total Processed: ${processedCount}. Last ID: ${res.last_ref}`, 'normal');
                        
                        // Update Progress (Visual approximation)
                        let percent = 0; // We don't know total, so let's just pulsate
                        $('#terminal-progress-bar').css('width', '100%').addClass('progress-bar-striped active');
                    }

                    if(res.has_more) {
                        setTimeout(function() {
                            processBatch(res.last_ref);
                        }, 300); 
                    } else {
                        log('ALL CONTENT PROCESSED SUCCESSFULLY.', 'success');
                        log('DATABASE UPDATED.', 'success');
                        finishProcess();
                    }
                } else {
                    log(`ERROR: ${res.message}`, 'error');
                    errorCount++;
                    if(errorCount >= 3) {
                         log('TOO MANY ERRORS. TERMINATING.', 'error');
                         finishProcess();
                    } else {
                        // Retry next batch anyway? or stop? Stop is safer.
                        isProcessing = false;
                        finishProcess();
                    }
                }
            },
            error: function(xhr, status, error) {
                 log(`CONNECTION LOST: ${error}`, 'error');
                 isProcessing = false;
                 finishProcess();
            }
        });
    }

    function finishProcess() {
        isProcessing = false;
        $('#close-terminal-btn').show();
        $('#terminal-progress-bar').removeClass('progress-bar-striped active').css('background-color', '#0f0');
        log('SESSION TERMINATED. READY TO SHUTDOWN.', 'info');
    }

});
</script>
<?php include("alt2.php"); ?>