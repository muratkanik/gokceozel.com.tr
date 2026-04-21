<?php include("ust.php"); 
sayfayetkikontrol(3);  
 
    $eskayit= substr(md5(rand(0,9999999999)),-20)."".date("Ymd").""."eyalcin".substr(md5(rand(0,9999999999)),-20);	  			   
if ($_POST['formgenelkayit']=='1') 
{
    
 $baglan->beginTransaction();   
    
   
    
    
    
    $katgel=$_POST['kategori'];
    $tarihgel=$_POST['tarih'];
    
    $trbaslikgel=$_POST['trbaslik'];
    $tricerikgel=$_POST['tricerik'];
    $trdetaygel=$_POST['trdetay'];
    
    $enbaslikgel=$_POST['enbaslik'];
    $enicerikgel=$_POST['enicerik'];
    $endetaygel=$_POST['endetay'];
    
    $rubaslikgel=$_POST['rubaslik'];
    $ruicerikgel=$_POST['ruicerik'];
    $rudetaygel=$_POST['rudetay'];
    
    $arbaslikgel=$_POST['arbaslik'];
    $aricerikgel=$_POST['aricerik'];
    $ardetaygel=$_POST['ardetay'];
    
    $frbaslikgel=$_POST['frbaslik'];
    $fricerikgel=$_POST['fricerik'];
    $frdetaygel=$_POST['frdetay'];
    
    $debaslikgel=$_POST['debaslik'];
    $deicerikgel=$_POST['deicerik'];
    $dedetaygel=$_POST['dedetay'];
    
 
    $formeskayit=$_POST['eskayit'];

    $kayityapankullanicigel=addslashes($_SESSION['kullaniciid']);
    $kayittarihigel=date('Y.m.d H:i:s');  ;
    $kayitdurumugel='1';
    
    
    
           if ($tutar!='') {
$uzanti = $tutar;
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
      ,en_baslik
      ,en_icerik
      ,en_detay
      ,ru_baslik
      ,ru_icerik
      ,ru_detay
      ,ar_baslik
      ,ar_icerik
      ,ar_detay
      ,fr_baslik
      ,fr_icerik
      ,fr_detay
      ,de_baslik
      ,de_icerik
      ,de_detay
 
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
      ,:enbaslikal
      ,:enicerikal
      ,:endetayal
      ,:rubaslikal
      ,:ruicerikal
      ,:rudetayal
      ,:arbaslikal
      ,:aricerikal
      ,:ardetayal
      ,:frbaslikal
      ,:fricerikal
      ,:frdetayal
      ,:debaslikal
      ,:deicerikal
      ,:dedetayal
  
      ,:eskayit
      ,:kayit_yapan_kullanici
      ,:kayit_tarihi
      ,:durum) ";
$kayitveri= guncel($kayit, $baglan);
    $kayitveri->bindValue(':katal',$katgel, PDO::PARAM_INT);  
    $kayitveri->bindValue(':tarihal',$tarihgel, PDO::PARAM_STR);
    
    $kayitveri->bindValue(':trbaslikal',$trbaslikgel, PDO::PARAM_STR);  
    $kayitveri->bindValue(':tricerikal',$tricerikgel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':trdetayal',$trdetaygel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':enbaslikal',$enbaslikgel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':enicerikal',$enicerikgel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':endetayal',$endetaygel, PDO::PARAM_STR); 
     $kayitveri->bindValue(':rubaslikal',$rubaslikgel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':ruicerikal',$ruicerikgel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':rudetayal',$rudetaygel, PDO::PARAM_STR); 
     $kayitveri->bindValue(':arbaslikal',$arbaslikgel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':aricerikal',$aricerikgel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':ardetayal',$ardetaygel, PDO::PARAM_STR); 
     $kayitveri->bindValue(':frbaslikal',$frbaslikgel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':fricerikal',$fricerikgel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':frdetayal',$frdetaygel, PDO::PARAM_STR); 
     $kayitveri->bindValue(':debaslikal',$debaslikgel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':deicerikal',$deicerikgel, PDO::PARAM_STR); 
    $kayitveri->bindValue(':dedetayal',$dedetaygel, PDO::PARAM_STR); 
 
    $kayitveri->bindValue(':eskayit', $formeskayit, PDO::PARAM_STR); 
    $kayitveri->bindValue(':kayit_yapan_kullanici',$kayityapankullanicigel, PDO::PARAM_INT);
    $kayitveri->bindValue(':kayit_tarihi', $kayittarihigel, PDO::PARAM_STR);
    $kayitveri->bindValue(':durum',$kayitdurumugel, PDO::PARAM_INT);
    $kayitveri->execute();
 
 
 
if($kayitveri){
         $baglan->commit();
        
         echo "<script type='text/javascript'> 
     jQuery(document).ready(function() {
                     jQuery.gritter.add({
                            title: 'BİLGİ!',
                            text: 'Kaydınız Gerçekleştirildi',
                      class_name: 'growl-success',
                       time: '10000',
                       
                     });
                 setTimeout(function(){ location.href= 'icerik_ekle.php?bilgikayitonay=".temizlikimandan($formeskayit)."';}, 0);  
              }); 
       
</script>";

    }else {
    $baglan->rollBack();
       
         echo "<script type='text/javascript'> 
     jQuery(document).ready(function() {
                     jQuery.gritter.add({
                            title: 'Hata!',
                            text: 'İşleminiz Gerçekleştirilemedi.',
                      class_name: 'growl-danger',
                       time: '10000',
                       
                     });
                  setTimeout(function(){ location.href= 'icerik_ekle.php?bilgikayitonay=".temizlikimandan($formeskayit)."';}, 0);  
              }); 
       
</script>"; 
    }	
    
    //print_r($kayitveri->errorInfo());
 
 //header("Location: envanter_rapor.php");	
}

if ($_POST["genelkayitguncelle"]=='1') 
{
     $baglan->beginTransaction();   
        
    $katgel=$_POST['kategori'];
    $tarihgel=$_POST['tarih'];
    $trbaslikgel=$_POST['trbaslik'];
    $tricerikgel=$_POST['tricerik'];
    $trdetaygel=$_POST['trdetay'];
    
    $enbaslikgel=$_POST['enbaslik'];
    $enicerikgel=$_POST['enicerik'];
    $endetaygel=$_POST['endetay'];
    
    $rubaslikgel=$_POST['rubaslik'];
    $ruicerikgel=$_POST['ruicerik'];
    $rudetaygel=$_POST['rudetay'];
    
    $arbaslikgel=$_POST['arbaslik'];
    $aricerikgel=$_POST['aricerik'];
    $ardetaygel=$_POST['ardetay'];
    
    $frbaslikgel=$_POST['frbaslik'];
    $fricerikgel=$_POST['fricerik'];
    $frdetaygel=$_POST['frdetay'];
    
    $debaslikgel=$_POST['debaslik'];
    $deicerikgel=$_POST['deicerik'];
    $dedetaygel=$_POST['dedetay'];
    
 
    
    $kayityapankullanicigel=addslashes($_SESSION['kullaniciid']);
    $kayittarihigel=date('Y.m.d H:i:s');  ;
    $kayitdurumugel='1';

    $idgel=addslashes($_POST['id']);

    
            if ($tutar!='') {
$uzanti = $tutar;
$noktatemizle=str_replace(".","",$uzanti);
$virgultemizle=str_replace(",",".",$noktatemizle);
$fiyat = $virgultemizle;
 
} 
 

 $duzenlesorgusu = 'UPDATE icerik SET  
 
 kategori=:katal
      ,tarih=:tarihal
     
      ,tr_baslik=:trbaslikal
      ,tr_icerik=:tricerikal
      ,tr_detay=:trdetayal
      ,en_baslik=:enbaslikal
      ,en_icerik=:enicerikal
      ,en_detay=:endetayal
      ,ru_baslik=:rubaslikal
      ,ru_icerik=:ruicerikal
      ,ru_detay=:rudetayal
      ,ar_baslik=:arbaslikal
      ,ar_icerik=:aricerikal
      ,ar_detay=:ardetayal
      ,fr_baslik=:frbaslikal
      ,fr_icerik=:fricerikal
      ,fr_detay=:frdetayal
      ,de_baslik=:debaslikal
      ,de_icerik=:deicerikal
      ,de_detay=:dedetayal
 
WHERE id= :idal';
$duzenleb= guncel($duzenlesorgusu, $baglan); 
    $duzenleb->bindValue(':katal',$katgel, PDO::PARAM_INT);  
    $duzenleb->bindValue(':tarihal',$tarihgel, PDO::PARAM_STR);
 
    $duzenleb->bindValue(':trbaslikal',$trbaslikgel, PDO::PARAM_STR);  
    $duzenleb->bindValue(':tricerikal',$tricerikgel, PDO::PARAM_STR); 
    $duzenleb->bindValue(':trdetayal',$trdetaygel, PDO::PARAM_STR); 
    $duzenleb->bindValue(':enbaslikal',$enbaslikgel, PDO::PARAM_STR); 
    $duzenleb->bindValue(':enicerikal',$enicerikgel, PDO::PARAM_STR); 
    $duzenleb->bindValue(':endetayal',$endetaygel, PDO::PARAM_STR); 
     $duzenleb->bindValue(':rubaslikal',$rubaslikgel, PDO::PARAM_STR); 
    $duzenleb->bindValue(':ruicerikal',$ruicerikgel, PDO::PARAM_STR); 
    $duzenleb->bindValue(':rudetayal',$rudetaygel, PDO::PARAM_STR); 
     $duzenleb->bindValue(':arbaslikal',$arbaslikgel, PDO::PARAM_STR); 
    $duzenleb->bindValue(':aricerikal',$aricerikgel, PDO::PARAM_STR); 
    $duzenleb->bindValue(':ardetayal',$ardetaygel, PDO::PARAM_STR); 
     $duzenleb->bindValue(':frbaslikal',$frbaslikgel, PDO::PARAM_STR); 
    $duzenleb->bindValue(':fricerikal',$fricerikgel, PDO::PARAM_STR); 
    $duzenleb->bindValue(':frdetayal',$frdetaygel, PDO::PARAM_STR); 
     $duzenleb->bindValue(':debaslikal',$debaslikgel, PDO::PARAM_STR); 
    $duzenleb->bindValue(':deicerikal',$deicerikgel, PDO::PARAM_STR); 
    $duzenleb->bindValue(':dedetayal',$dedetaygel, PDO::PARAM_STR); 
   
    $duzenleb->bindValue(':idal',$idgel, PDO::PARAM_INT);
    $duzenleb->execute();
 
  
    
 
if($duzenleb ){
         $baglan->commit();
        
         echo "<script type='text/javascript'> 
     jQuery(document).ready(function() {
                     jQuery.gritter.add({
                            title: 'BİLGİ!',
                            text: 'Güncelleme Gerçekleştirildi',
                      class_name: 'growl-success',
                       time: '10000',
                       
                     });
                  setTimeout(function(){ location.href= 'icerik_ekle.php?bilgikayitonay=".temizlikimandan($_POST['bilgikayitonay'])."';}, 0);
              }); 
       
</script>";

    }else {
    $baglan->rollBack();
       
         echo "<script type='text/javascript'> 
     jQuery(document).ready(function() {
                     jQuery.gritter.add({
                            title: 'Hata!',
                            text: 'İşleminiz Gerçekleştirilemedi.',
                      class_name: 'growl-danger',
                       time: '10000',
                       
                     });
                  setTimeout(function(){ location.href= 'icerik_ekle.php?bilgikayitonay=".temizlikimandan($_POST['bilgikayitonay'])."';}, 0); 
              }); 
       
</script>"; 
    }	
}

  $kayitsonuc= "SELECT * FROM icerik where durum!='-1' and eskayit='".temizlikimandan($_GET['bilgikayitonay'])."'";
$kayitsonucb = sorgu($kayitsonuc, $baglan);
$kayitsonucb->execute();
$kayitsonucl =veriliste($kayitsonucb);
 

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
            
          <script src="ckeditor/ckeditor.js"></script>       
            
            
            
            
                
                <div class="mainpanel">
                     
                    <div class="contentpanel">
                        <div class="btn-toolbar">
                                     
                                      
                                    
                                </div>
                            
                            
                            
                        <div class="panel panel-dark-head">
                        <div class="panel-heading">
                                <div class="pull-right">
                                   <div class="btn-group">
                                         <button class="btn btn-default btn-sm"    type="button" data-toggle="modal" href="#kategoriekle"> <i class="fa fa-plus"></i> 
                                              Kategori Ekle </button>

           
                                </div>   
                                </div>
                                <h4 class="panel-title">İçerik Kayıt</h4>
                                <p>İçerik Ekle</p>
                            </div>   
                        </div>    

         <div class="row">
                          <form class="form-horizontal form-bordered" name="form" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post" id="kayit-formu"  enctype="multipart/form-data"   > 
                          
                            <input name="id" hidden="hidden" value="<?php echo $kayitsonucl['id'];?>"  />
                            <input name="eskayit" hidden="hidden" value="<?php if($kayitsonucl['eskayit']!='') {echo $kayitsonucl['eskayit'];} else {echo $eskayit;}?>"  />
                            <input name="bilgikayitonay" hidden="hidden" value="<?php echo $_GET['bilgikayitonay'];?>"  />
                            <input name="anakategorial" hidden="hidden" value="<?php echo $_GET['anakategori'];?>"  />
                            
                            
                          
                                <ul class="nav nav-tabs">
                                    <li class="active"><a href="#genel" data-toggle="tab"><strong>Genel</strong></a></li>
                                    <li><a href="#turk" data-toggle="tab"><strong>Türkçe</strong></a></li>
                                    <li><a href="#ingiliz" data-toggle="tab"><strong>İngilizce</strong></a></li>
                                    <li><a href="#rus" data-toggle="tab"><strong>Rusça</strong></a></li>
                                    <li><a href="#arap" data-toggle="tab"><strong>Arapça</strong></a></li>
                                    <li><a href="#fransiz" data-toggle="tab"><strong>Fransızca</strong></a></li>
                                    <li><a href="#alman" data-toggle="tab"><strong>Almanca</strong></a></li>
                          
                                    <li><a href="#resim" data-toggle="tab"><strong>Döküman & Resim</strong></a></li>
                                </ul>
                        
                        
                        <div class="tab-content mb30">
                                    <div class="tab-pane active" id="genel">
                                     
                                       <div class="panel-body">
                                        
                                        
                                        <div class="form-group">
                                                <label class="col-sm-2 control-label">Kategori</label>
                                                <div class="col-sm-10">
               <select name="kategori" id="select-basic"     class="width100p" >
              <?php 
$kt= "SELECT * FROM  genel_kategori  where durum='1'   order by tr_isim";
$ktb= sorgu($kt, $baglan);
$ktb->execute(); 	

                   
$atk= "SELECT * FROM  genel_kategori  where durum='1' and  id='".$kayitsonucl['kategori']."'";
$atkb= sorgu($atk, $baglan);
$atkb->execute();    
$atkl =veriliste($atkb)           
?>
   <?php if($atkl['id']!='') {  ?><option value="<?php echo $atkl['id']; ?>" > <?php echo $atkl['tr_isim']." - ".$ktl['en_isim']; ?></option> <?php } ?> 
                   
 <?php while ($ktl =veriliste($ktb)) {  ?>
<option value="<?php echo $ktl['id']; ?>" >  <?php echo $ktl['tr_isim']." - ".$ktl['en_isim']; ?></option>
                   <?php } ?>                    
                   
</select>
                                           
                                                </div>
                                            </div>
                                        
                                        
           
                                            
										        <div class="form-group">
                                                <label class="col-sm-2 control-label">Tarih</label>
                                                <div class="col-sm-10">
                                                       <input name="tarih" type="date"   value="<?php if ($kayitsonucl['tarih']!='') {echo $kayitsonucl['tarih'];} else {echo date('Y-m-d');} ?>"   style="height: 40px"  class="form-control tooltips" >
                                                </div>
                                            </div> 
                                            
             
                                           
                                              
                                    </div>
                                    </div> 
                            
                            
                            
                            <div class="tab-pane" id="turk">
                          <div class="form-group">
                                                <label class="col-sm-2 control-label">TR Başlık</label>
                                                <div class="col-sm-10">
              <input name="trbaslik"  value="<?php echo $kayitsonucl['tr_baslik']; ?>"  placeholder="Türkçe Başlık"  title="Türkçe Başlık" data-toggle="tooltip" data-trigger="hover" class="form-control tooltips"  type="text"/>  
                                                </div>
                                            </div><!-- form-group -->
                                            
                                            
                                            	<div class="form-group">
                                                <label class="col-sm-2 control-label">TR İçerik</label>
                                              <div class="col-sm-10">
                  <textarea  name="tricerik"   class="form-control"  placeholder="Türkçe İçerik" id="ckeditor" title="Türkçe İçerik"  rows="2"><?php echo $kayitsonucl['tr_icerik']; ?></textarea>
                                         
                                           </div> 
                                             </div>
                                        
                                        
                                        
                                        <div class="form-group">
                                                <label class="col-sm-2 control-label">TR Diğer Detay</label>
                                              <div class="col-sm-10">
                  <textarea  name="trdetay"   class="form-control"   placeholder="Türkçe Detay"  title="Türkçe Detay" rows="2"><?php echo $kayitsonucl['tr_detay']; ?></textarea>
                                         
                                           </div> 
                                             </div>	
                            </div> 
                            
                            
                            <div class="tab-pane" id="ingiliz">
                        <div class="form-group">
                                                <label class="col-sm-2 control-label">EN Başlık</label>
                                                <div class="col-sm-10">
              <input name="enbaslik"  value="<?php echo $kayitsonucl['en_baslik']; ?>"  placeholder="İngilizce Başlık"  title="İngilizce Başlık" data-toggle="tooltip" data-trigger="hover" class="form-control tooltips"  type="text"/>  
                                                </div>
                                            </div><!-- form-group -->
                                            
                                            
                                            	<div class="form-group">
                                                <label class="col-sm-2 control-label">EN İçerik</label>
                                              <div class="col-sm-10">
                  <textarea  name="enicerik"   class="form-control" placeholder="İngilizce İçerik"  title="İngilizce İçerik"   rows="2"><?php echo $kayitsonucl['en_icerik']; ?></textarea>
                                         
                                           </div> 
                                             </div>
                                        
                                        
                                        
                                        <div class="form-group">
                                                <label class="col-sm-2 control-label">RU Diğer Detay</label>
                                              <div class="col-sm-10">
                  <textarea  name="endetay"   class="form-control"  placeholder="İngilizce Detay"  title="İngilizce Detay"  rows="2"><?php echo $kayitsonucl['en_detay']; ?></textarea>
                                         
                                           </div> 
                                             </div>	
                            </div>
                            <div class="tab-pane" id="rus">
                                <div class="form-group">
                                                <label class="col-sm-2 control-label">RU Başlık</label>
                                                <div class="col-sm-10">
              <input name="rubaslik"  value="<?php echo $kayitsonucl['ru_baslik']; ?>"  placeholder="Rusça Başlık"  title="Rusça Başlık" data-toggle="tooltip" data-trigger="hover" class="form-control tooltips"  type="text"/>  
                                                </div>
                                            </div><!-- form-group -->
                                            
                                            
                                            	<div class="form-group">
                                                <label class="col-sm-2 control-label">RU İçerik</label>
                                              <div class="col-sm-10">
                  <textarea  name="ruicerik"   class="form-control" placeholder="Rusça İçerik"  title="Rusça İçerik"   rows="2"><?php echo $kayitsonucl['ru_icerik']; ?></textarea>
                                         
                                           </div> 
                                             </div>
                                        
                                        
                                        
                                        <div class="form-group">
                                                <label class="col-sm-2 control-label">RU Diğer Detay</label>
                                              <div class="col-sm-10">
                  <textarea  name="rudetay"   class="form-control"  placeholder="Rusça Detay"  title="Rusça Detay"  rows="2"><?php echo $kayitsonucl['ru_detay']; ?></textarea>
                                         
                                           </div> 
                                             </div>	
                        
                            </div>
                            <div class="tab-pane" id="arap">
                        <div class="form-group">
                                                <label class="col-sm-2 control-label">AR Başlık</label>
                                                <div class="col-sm-10">
              <input name="arbaslik"  value="<?php echo $kayitsonucl['ar_baslik']; ?>"  placeholder="Arapça Başlık"  title="Arapça Başlık" data-toggle="tooltip" data-trigger="hover" class="form-control tooltips"  type="text"/>  
                                                </div>
                                            </div><!-- form-group -->
                                            
                                            
                                            	<div class="form-group">
                                                <label class="col-sm-2 control-label">AR İçerik</label>
                                              <div class="col-sm-10">
                  <textarea  name="aricerik"   class="form-control" placeholder="Arapça İçerik"  title="Arapça İçerik"   rows="2"><?php echo $kayitsonucl['ar_icerik']; ?></textarea>
                                         
                                           </div> 
                                             </div>
                                        
                                        
                                        
                                        <div class="form-group">
                                                <label class="col-sm-2 control-label">AR Diğer Detay</label>
                                              <div class="col-sm-10">
                  <textarea  name="ardetay"   class="form-control"  placeholder="Arapça Detay"  title="Arapça Detay"  rows="2"><?php echo $kayitsonucl['ar_detay']; ?></textarea>
                                         
                                           </div> 
                                             </div>	
                            </div>
                            <div class="tab-pane" id="fransiz">
                        <div class="form-group">
                                                <label class="col-sm-2 control-label">FR Başlık</label>
                                                <div class="col-sm-10">
              <input name="frbaslik"  value="<?php echo $kayitsonucl['fr_baslik']; ?>"  placeholder="Fransızca Başlık"  title="Fransızca Başlık" data-toggle="tooltip" data-trigger="hover" class="form-control tooltips"  type="text"/>  
                                                </div>
                                            </div><!-- form-group -->
                                            
                                            
                                            	<div class="form-group">
                                                <label class="col-sm-2 control-label">FR İçerik</label>
                                              <div class="col-sm-10">
                  <textarea  name="fricerik"   class="form-control" placeholder="Fransızca İçerik"  title="Fransızca İçerik"   rows="2"><?php echo $kayitsonucl['fr_icerik']; ?></textarea>
                                         
                                           </div> 
                                             </div>
                                        
                                        
                                        
                                        <div class="form-group">
                                                <label class="col-sm-2 control-label">FR Diğer Detay</label>
                                              <div class="col-sm-10">
                  <textarea  name="frdetay"   class="form-control"  placeholder="Fransızca Detay"  title="Fransızca Detay"  rows="2"><?php echo $kayitsonucl['fr_detay']; ?></textarea>
                                         
                                           </div> 
                                             </div>	
                            </div>
                            <div class="tab-pane" id="alman">
                        <div class="form-group">
                                                <label class="col-sm-2 control-label">DE Başlık</label>
                                                <div class="col-sm-10">
              <input name="debaslik"  value="<?php echo $kayitsonucl['de_baslik']; ?>"  placeholder="Almanca Başlık"  title="Almanca Başlık" data-toggle="tooltip" data-trigger="hover" class="form-control tooltips"  type="text"/>  
                                                </div>
                                            </div><!-- form-group -->
                                            
                                            
                                            	<div class="form-group">
                                                <label class="col-sm-2 control-label">DE İçerik</label>
                                              <div class="col-sm-10">
                  <textarea  name="deicerik"   class="form-control" placeholder="Almanca İçerik"  title="Almanca İçerik"   rows="2"><?php echo $kayitsonucl['de_icerik']; ?></textarea>
                                         
                                           </div> 
                                             </div>
                                        
                                        
                                        
                                        <div class="form-group">
                                                <label class="col-sm-2 control-label">DE Diğer Detay</label>
                                              <div class="col-sm-10">
                  <textarea  name="dedetay"   class="form-control"  placeholder="Almanca Detay"  title="Almanca Detay"  rows="2"><?php echo $kayitsonucl['de_detay']; ?></textarea>
                                         
                                           </div> 
                                             </div>	
                            </div>
                             
                            
                             <div class="tab-pane" id="resim">
                        <div class="form-group">
                                               <label class="col-sm-4 control-label">Döküman Ekle/Görüntüle</label>  
                                                <div class="col-sm-8">
                           					  <div class="btn-group">
                    <button class="btn btn-default btn-sm"  type="button">  <a href="javascript:PencereOrtala('icerik_belge_ekle.php?bilgigonder=<?php if($kayitsonucl['id']!='') { echo $kayitsonucl['eskayit'];} else { echo $eskayit;}?> ',650,650);" title="Belge Ekle">  <i style="font-size:24px" class="fa fa-inbox"></i></a>  
                                           </button>
                                  </div>
                                                </div>
                                            </div>
                            </div>
                            
                         </div>
      
                               </div>
                        
            
                          </div>   
          
                        </div><!-- row -->
                             
     				 <div class="modal-footer">
<?php if ($kayitsonucl['id']<1) {?><input class="btn btn-primary"  type="submit" value="İÇERİĞİ KAYDET" /><?php }  else { ?><input class="btn btn-primary"  type="submit" value="İÇERİĞİ GÜNCELLE" /><?php } ?>

</p>
<?php if ($kayitsonucl['id']<1) {?><input type="hidden" name="formgenelkayit" value="1"><?php }  else { ?><input type="hidden" name="genelkayitguncelle" value="1"><?php } ?>                          
                            
                        </div>                
                              
                        </form> 
                    </div><!-- contentpanel -->
                </div>
            </div><!-- mainwrapper -->
        </section>
     
          <script>
    if ( window.history.replaceState ) {
        window.history.replaceState( null, null, window.location.href );
    } 
</script>   
  <script>
 
	
    CKEDITOR.replace('tricerik', {
        filebrowserUploadUrl: 'ckeditor/ck_upload.php',
        filebrowserUploadMethod: 'form'
    });
	
	    CKEDITOR.replace('trdetay', {
        filebrowserUploadUrl: 'ckeditor/ck_upload.php',
        filebrowserUploadMethod: 'form'
    });
    
       CKEDITOR.replace('enicerik', {
        filebrowserUploadUrl: 'ckeditor/ck_upload.php',
        filebrowserUploadMethod: 'form'
    });
    
    CKEDITOR.replace('endetay', {
        filebrowserUploadUrl: 'ckeditor/ck_upload.php',
        filebrowserUploadMethod: 'form'
    });
    
      
      CKEDITOR.replace('ruicerik', {
        filebrowserUploadUrl: 'ckeditor/ck_upload.php',
        filebrowserUploadMethod: 'form'
    });
    
    CKEDITOR.replace('rudetay', {
        filebrowserUploadUrl: 'ckeditor/ck_upload.php',
        filebrowserUploadMethod: 'form'
    });
    
      
      CKEDITOR.replace('aricerik', {
        filebrowserUploadUrl: 'ckeditor/ck_upload.php',
        filebrowserUploadMethod: 'form'
    });
    
    CKEDITOR.replace('ardetay', {
        filebrowserUploadUrl: 'ckeditor/ck_upload.php',
        filebrowserUploadMethod: 'form'
    });
    
      
      CKEDITOR.replace('fricerik', {
        filebrowserUploadUrl: 'ckeditor/ck_upload.php',
        filebrowserUploadMethod: 'form'
    });
    
    CKEDITOR.replace('frdetay', {
        filebrowserUploadUrl: 'ckeditor/ck_upload.php',
        filebrowserUploadMethod: 'form'
    });
    
      
      CKEDITOR.replace('deicerik', {
        filebrowserUploadUrl: 'ckeditor/ck_upload.php',
        filebrowserUploadMethod: 'form'
    });
    
    CKEDITOR.replace('dedetay', {
        filebrowserUploadUrl: 'ckeditor/ck_upload.php',
        filebrowserUploadMethod: 'form'
    });
    
      
      CKEDITOR.replace('cinicerik', {
        filebrowserUploadUrl: 'ckeditor/ck_upload.php',
        filebrowserUploadMethod: 'form'
    });
    
    CKEDITOR.replace('cindetay', {
        filebrowserUploadUrl: 'ckeditor/ck_upload.php',
        filebrowserUploadMethod: 'form'
    });
    
 		 
</script>


<div class="modal fade" id="kategoriekle" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
   
               <div class="modal-dialog modal-lg">           
           <div id="kategoriekleme"></div>
       </div>      
</div>

<script>
   $(document).ready(function() {       
 
       
  $('#kategoriekle').on('show.bs.modal', function(e) {
  
   jQuery.ajax({
  type: 'GET',   
  url: 'ajax/kategori_ekle.php',
  error:function(){ $('#kategoriekleme').html("İşlem Başarısız."); }, 
  success: function(averi) { $('#kategoriekleme').html(averi);} 
});    
      
}); 
       
 
       });
</script>

<?php  include("alt2.php");?>