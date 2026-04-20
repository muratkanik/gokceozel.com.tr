<?php session_start();
include("baglanti/baglantilar_fonksiyonlar.php"); 
include("baglanti/sayfa_yetki_fonksiyonu.php");

 sayfayetkikontrol(7); 
  
 
                                    
  if(isset($_POST['kullaniciekle']) && $_POST['kullaniciekle']) {                               
                                  
    
 
    $sicilno = isset($_POST["sicilno"]) ? addslashes($_POST["sicilno"]) : '';
    $adi = isset($_POST["adi"]) ? $_POST["adi"] : '';
    $kullaniciadi = isset($_POST["kullaniciadi"]) ? $_POST["kullaniciadi"] : '';
    $sifre = isset($_POST["sifre"]) ? addslashes(md5($_POST["sifre"])) : '';
    $mail = isset($_POST["mail"]) ? $_POST["mail"] : '';                       
    $yoneticidurumu = isset($_POST["yoneticidurumu"]) ? addslashes($_POST["yoneticidurumu"]) : ''; 
    $kayityapan =addslashes($_SESSION['kullaniciid']);
    $bugununtarihi=date('Y.m.d H:i:s');   
    $durum='1'; 
     $tokenkontrol=preg_match("/6e5y7a1l6c3i2n3/", $_SESSION['jetonal']);
   
   if(!$tokenkontrol){
   
    session_destroy();
   exit(header("Location: giris.php"));    
    
}
        $kullanicibul = "select kullanici_adi from kullanicilar where kullanici_adi='".$kullaniciadi."' and durumu!='-1'"; 
             
       $girisb = sorgu($kullanicibul, $baglan);
       $girisb->execute();      
       $girisal =veriliste($girisb); 
 
      
        if($girisal['kullanici_adi']=='') {    
            
      
     $kullanicekle ='INSERT INTO kullanicilar  
     (sicil_no,
     adi_soyadi,
     kullanici_adi,
     sifre,
     maili,
     durumu, 
     yonetici_durum,
     kayit_yapan_kullanici,
     kayit_tarihi) 
     values
     (
     :sicilal,
     :adisoyadial,
     :kullaniciadial,
     :sifreal,
     :mailial,
     :durumual, 
     :yoneticidurumal,
     :kayityapankullanicial,
     :kayitarihial) ';
$kullaniciverilerl= guncel($kullanicekle, $baglan);    
      
$eklesonucu = $kullaniciverilerl->execute(array(
     "sicilal" => $sicilno,
     "adisoyadial" => $adi,
     "kullaniciadial" => $kullaniciadi,
     "sifreal" => $sifre,
     "mailial" => $mail,
     "durumual" => $durum,
     "yoneticidurumal" => $yoneticidurumu,
 "kayityapankullanicial" => $kayityapan,
 "kayitarihial" => $bugununtarihi));  
      
       
 if ($eklesonucu === false) {
    echo "<script type='text/javascript'>  
	alert('Kullanici Eklenemedi'); 
    window.close(); 
</script> ";                                           
 } else {
  echo "<script type='text/javascript'>  
	  alert('Kullanıcı Eklendi');
       window.close();
</script>"; 
 
  }         
            
   } else {
			echo "<script type='text/javascript'>  
	  alert('Bu Kullanıcı Adı Zaten Alınmış');
       location.href= 'kullanici_ekle.php';
</script>"; 
		}           
            
      
 }  

 
 
?><body onUnload="opener.location.reload(true);"/>   




 

<meta charset="utf-8">
 <link href="css/style.default.css" rel="stylesheet">
        
 <script type="text/javascript" src="js/jquery.min.js"></script>  
 
  
 

 
     <div class="modal-dialog"> 
 <div class="modal-content">  
                           <div class="panel panel-dark-head">
                              <div class="panel-heading"> 
                                
                                <h4 class="panel-title">KULLANICI EKLE </h4>
                                <p>  Kullanıcı İşlemleri</p>
                            </div>
 
               
      <form method="POST" action="kullanici_ekle.php" name="kullaniciekleme"  class="form-horizontal form-bordered" enctype="multipart/form-data" >          
  
    
 
             
                 
                
               
               
  								 
             

<input name="guncelkullaniciid"  type="hidden" value=""  />
 
 
	<div class="form-group">
<label>Sicil No:</label>
<input class="form-control tooltips" name="sicilno" autocomplete="off" value=""  /> 
</div>
		
 
	<div class="form-group">
<label>Adı Soyadı:</label>
<input class="form-control tooltips" name="adi"  autocomplete="off" value=""   required  /> 
</div>
            
 
	<div class="form-group">
<label>Kullanıcı Adı:</label>
<input class="form-control tooltips" name="kullaniciadi" value=""  autocomplete="off"  required  /> 
</div>	 
	
                   
  
	<div class="form-group">
<label>Şifre:</label>
<input class="form-control tooltips" name="sifre" value=""   autocomplete="off" required  /> 
</div>                  
                   
 	<div class="form-group">
<label>Mail:</label>
<input class="form-control tooltips" name="mail" value="" type="email"   autocomplete="off" required  /> 
</div> 
                   
 
	<div class="form-group">
<label>Yönetici Durumu:</label>
<select name="yoneticidurumu" tabindex="1"  required="required"  class="form-control tooltips"   >
<option value="0">Hayır</option>
<option value="1">Evet</option>
									</select>
</div>
 
 

<input type="hidden" name="kullaniciekle" value="1">


         
           
                      
                
                                <div class="modal-footer">
                <button type="button" class="btn btn-danger" onclick="kapat()" data-dismiss="modal" >Vazgeç</button>
                <button type="reset" class="btn btn-default">Temizle</button>
                <button type="sumbit" class="btn btn-primary">Ekle</button>
              </div>
				  </form>
              
          
   </div>
</div>
 
</div>


            <script src="js/jquery-1.11.1.min.js"></script>
    
        <script src="js/jquery-ui-1.10.3.min.js"></script>
     
  
     
  
 
 
   
<script>
           
    
    function kapat()

{

window.close()

}
        </script>  <?php $baglan = null;   ?>
</body>

  
 