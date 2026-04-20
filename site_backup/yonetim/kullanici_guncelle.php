<?php session_start();
include("baglanti/baglantilar_fonksiyonlar.php"); 
include("baglanti/sayfa_yetki_fonksiyonu.php");

 sayfayetkikontrol(7); 
  

  if($_POST['kullaniciguncelle']) {                               
  
    $sicilno = addslashes($_POST["sicilno"]);
    $adi = addslashes($_POST["adi"]);
    $kullaniciadi = addslashes($_POST["kullaniciadi"]);
   if ($_POST["sifre"]!='') { $sifre = addslashes(md5($_POST["sifre"]));}
    $mail = addslashes($_POST["mail"]);                       
    $yoneticidurumu = temizlikimandan($_POST["yoneticidurumu"]); 
    
    $kayityapan =temizlikimandan($_SESSION['kullaniciid']);
    $bugununtarihi=date('Y.m.d H:i:s');   
    $durum='1'; 
    $idalma=temizlikimandan($_POST["guncelkullaniciid"]);   
    
 
    
      
     $kullanicekle ='UPDATE kullanicilar SET  
     sicil_no= :sicilal,
     adi_soyadi= :adisoyadial,
     kullanici_adi= :kullaniciadial,
  
     maili= :mailial,
     durumu= :durumual, 
     yonetici_durum= :yoneticidurumal,
     
     guncelleme_yapan_kullanici= :guncelleyenkullanici,
     guncelleme_tarihi= :guncelleyentarihi
      
     WHERE id= :idal';
$kullaniciverilerl= guncel($kullanicekle, $baglan);    
      
  $eklesonucu = $kullaniciverilerl->execute(array(
     "sicilal" => $sicilno,
     "adisoyadial" => $adi,
     "kullaniciadial" => $kullaniciadi,
 
     "mailial" => $mail,
     "durumual" => $durum,
     "yoneticidurumal" => $yoneticidurumu,
      
 "guncelleyenkullanici" => $kayityapan,
 "guncelleyentarihi" => $bugununtarihi,
 "idal" => $idalma));  
            
            
   if ($_POST["sifre"]!='') {           
            
$sifrele ='UPDATE kullanicilar SET   sifre= :sifreal  WHERE id= :idal';
$sifrelel= guncel($sifrele, $baglan);    
      
  $sifrelel->execute(array(
     "sifreal" => $sifre,
     "idal" => $idalma));  
   }
       
 if ($eklesonucu === false) {
    echo "<script type='text/javascript'>  
	alert('Kullanici Güncellenemedi'); 
    window.close(); 
</script> ";                                           
 } else {
  echo "<script type='text/javascript'>  
	  alert('Kullanıcı Güncellendi');
       window.close();
</script>"; 
 
  }        
          
      
 }  


 



 if($_GET["kullanicigetir"]!='') { 
     
     
     $kullanici=addslashes($_GET["kullanicigetir"]);
              
       $kullanicilar = "SELECT   id
      ,sicil_no
      ,adi_soyadi
       
      ,birimi
      ,maili
      ,kullanici_adi
      ,sifre
  
      ,durumu
      ,yonetici_durum
      ,avukat_durum
      ,kayit_yapan_kullanici
      ,kayit_tarihi
 
    
FROM kullanicilar where id=".$kullanici.""; 
  
 $kullanicilarb = sorgu($kullanicilar, $baglan); 
 $kullanicilarb->execute();                               
 $kullanicilarl =veriliste($kullanicilarb);                                  
 }
                      

 
?><body onUnload="opener.location.reload(true);"/>   




 

<meta charset="utf-8">
 <link href="css/style.default.css" rel="stylesheet">
        
 <script type="text/javascript" src="js/jquery.min.js"></script>  
 
  
 

 
     <div class="modal-dialog"> 
 <div class="modal-content">  
                           <div class="panel panel-dark-head">
                              <div class="panel-heading"> 
                                
                                <h4 class="panel-title">KULLANICI GÜNCELLE</h4>
                                <p>  Kullanıcı İşlemleri</p>
                            </div>
              
               
      <form method="POST" action="kullanici_guncelle.php" name="kullaniciekleme"  class="form-horizontal form-bordered"  enctype="multipart/form-data" >          
  
    
 
              
               
  								 
             

<input name="guncelkullaniciid"  type="hidden" value="<?php echo $kullanicilarl['id']; ?>"  />
 
 
	<div class="form-group">
<label>Sicil No:</label>
<input class="form-control tooltips" name="sicilno" value="<?php echo $kullanicilarl['sicil_no']; ?>"  /> 
</div>
		
 
	<div class="form-group">
<label>Adı Soyadı:</label>
<input class="form-control tooltips" name="adi" value="<?php echo $kullanicilarl['adi_soyadi']; ?>"   required  /> 
</div>
            
 
	<div class="form-group">
<label>Kullanıcı Adı:</label>
<input class="form-control tooltips" name="kullaniciadi" value="<?php echo  $kullanicilarl['kullanici_adi']; ?>"    required  /> 
</div>	 
	
 
	<div class="form-group">
<label>Şifre:</label>
<input class="form-control tooltips" name="sifre" value=""      /> 
</div>                  
                   
 	<div class="form-group">
<label>Mail:</label>
<input class="form-control tooltips" name="mail" value="<?php echo $kullanicilarl['maili']; ?>"   required  /> 
</div> 
                   
 
	<div class="form-group">
<label>Yönetici Durumu:</label>
   <select name="yoneticidurumu" tabindex="1"  required="required"  class="form-control tooltips"   >
<option value="<?php if ($kullanicilarl['yonetici_durum']=='1') { echo "1";} else {echo "0";}?>"><?php if ($kullanicilarl['yonetici_durum']=='1') {echo "Evet";} else {echo "Hayır";} ?></option>
<option value="<?php if ($kullanicilarl['yonetici_durum']!='1') { echo "1";} else {echo "0";}?>"><?php if ($kullanicilarl['yonetici_durum']!='1') {echo "Evet";} else {echo "Hayır";} ?></option>
									</select>        
        
 
</div>
 

  
          
          
 
     <input type="hidden" name="kullaniciguncelle" value="1">              
                  
             
           
                      
                
                                <div class="modal-footer">
                <button type="button" class="btn btn-danger" onclick="kapat()" data-dismiss="modal" >Vazgeç</button>
                <button type="reset" class="btn btn-default">Temizle</button>
                <button type="sumbit" class="btn btn-primary">Güncelle</button>
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

  
 