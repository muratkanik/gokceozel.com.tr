<?php session_start();
 
include("baglanti/baglantilar_fonksiyonlar.php"); 
include("baglanti/sayfa_yetki_fonksiyonu.php");

 sayfayetkikontrol(22); 
  
	 
	if (!$_SESSION['jetonal']) {
		  session_destroy();
     header("Location: giris.php"); 
		} 
 

 ?>
<!doctype html>
		<html>
	
	<head>
<title>Sayfa Yetki</title>
<meta charset="utf-8">
     

        <link href="css/style.default.css" rel="stylesheet">
 
           <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script> 
 
	 
	 
</head>
<body>
<?php 
 


 
    
    if($_GET['yetkiver']!='') {
     
   $kategorimiz = addslashes($_GET["yetkiver"]);
    $kayityapan =temizlikimandan($_SESSION['kullaniciid']);
    $bugununtarihi=date('Y.m.d H:i:s');   
    $durum='1'; 
    $idalma=temizlikimandan($_GET["kullanicigetir"]);   
    
  
    $sayfayetkikontrol = "SELECT  kategori_id  from  kullanici_yetki  where kullanici_id='".$idalma."' and kategori_id='".$kategorimiz."' and durum='0'"; 
   $sayfayetkikontrolb = sorgu($sayfayetkikontrol, $baglan); 
    $sayfayetkikontrolb->execute();
    $sayfayetkikontroll =veriliste($sayfayetkikontrolb);       
    
        if($sayfayetkikontroll['kategori_id']=='') {    
 
    $yetkiekle ='INSERT INTO kullanici_yetki 
    (kullanici_id,
     kategori_id,
     durum, 
     kayit_yapan_kullanici,
     kayit_tarihi) 
     values
     (
     :kullaniciyet,
     :kategoriyet,
     :durumyet,
     :kayityapankullanicialyet,
     :kayitarihialyet)';
$kullaniciverilerl= guncel($yetkiekle, $baglan);    
      
$eklesonucuyet = $kullaniciverilerl->execute(array(
     "kullaniciyet" => $idalma,
     "kategoriyet" => $kategorimiz,
     "durumyet" => $durum,
     "kayityapankullanicialyet" => $kayityapan,
     "kayitarihialyet" => $bugununtarihi));      
      if ($eklesonucuyet === false) {  
                    echo "<script type='text/javascript'>  
	  alert('Hata! Yetki Verilemedi');
       
</script>"; 
 }            
        
        } else {
      
$sifrele ='UPDATE kullanici_yetki SET 
 
durum= :durumumuz,
guncelleme_yapan_kullanici= :guncelleyenkullanici,
guncelleme_tarihi= :guncelleyentarihi  
WHERE  kategori_id= :idal';
$sifrelel= guncel($sifrele, $baglan);    
      
  $eklesonucu = $sifrelel->execute(array(
 
      "durumumuz" => $durum,
      "guncelleyenkullanici" => $kayityapan,
      "guncelleyentarihi" => $bugununtarihi,
     "idal" => $kategorimiz));  
      
              if ($eklesonucu === false) {  
                    echo "<script type='text/javascript'>  
	  alert('Hata! Yetki Verilemedi');
       
</script>"; 
 }            
        }
 
    }
    
  if($_GET['yetkial']!='') {

    $kategorimiz = addslashes($_GET["yetkial"]);
    $kayityapan =temizlikimandan($_SESSION['kullaniciid']);
    $bugununtarihi=date('Y.m.d H:i:s');   
    $durum='0'; 
    $idalma=temizlikimandan($_GET["kullanicigetir"]);   
    
   
      
      
$sifrele ='UPDATE kullanici_yetki SET 
 
durum= :durumumuz,
guncelleme_yapan_kullanici= :guncelleyenkullanici,
guncelleme_tarihi= :guncelleyentarihi  
WHERE  kategori_id= :idal';
$sifrelel= guncel($sifrele, $baglan);    
      
   $eklesonucu =$sifrelel->execute(array(
 
      "durumumuz" => $durum,
      "guncelleyenkullanici" => $kayityapan,
      "guncelleyentarihi" => $bugununtarihi,
     "idal" => $kategorimiz));  
      
      if ($eklesonucu === false) {  
                    echo "<script type='text/javascript'>  
	  alert('Hata! Yetki Pasif Edilemedi');
       
</script>";  
    }
    } 
    
    
    
     if ($_POST["topluyetkiver"]=="1"){ 
   
 
        if(empty($_POST['sec']))

        {
               echo "<script type='text/javascript'> 
     jQuery(document).ready(function() {
                     jQuery.gritter.add({
                            title: 'Hata!',
                            text: 'Seçim Yapmadınız',
                      class_name: 'growl-danger',
                       time: '10000',
                       
                     });
                   
              }); 
       
</script>";
        }
            else
        {
                $secim=$_POST['sec'];

foreach ($secim as $veri => $deger) {
		 
	//SAYFA YENILEMEDE MÜKERRER KAYIT ENGELLEME
  $toplumukerrerkayitengelleme= "SELECT id FROM kullanici_yetki where kullanici_id='".$_POST['kullanicial']."' and kategori_id='".$_POST['yetki_'.$deger]."'";
$toplumukerrerkayitengellemebaglanti = sorgu($toplumukerrerkayitengelleme, $baglan); 
$toplumukerrerkayitengellemebaglanti->execute();
$toplumukerrerkayitengellemelistele =veriliste($toplumukerrerkayitengellemebaglanti); 
    
    
if($toplumukerrerkayitengellemelistele['id']==''){	 
		 
 $yetkiekle ='INSERT INTO kullanici_yetki 
    (kullanici_id,
     kategori_id,
     durum, 
     kayit_yapan_kullanici,
     kayit_tarihi) 
     values
     (
     :kullaniciyet,
     :kategoriyet,
     :durumyet,
     :kayityapankullanicialyet,
     :kayitarihialyet)';
$kullaniciverilerl= guncel($yetkiekle, $baglan);    
    $kullaniciverilerl->bindValue(':kullaniciyet', $_POST['kullanicial'], PDO::PARAM_INT);
    $kullaniciverilerl->bindValue(':kategoriyet', $_POST['yetki_'.$deger], PDO::PARAM_INT);
    $kullaniciverilerl->bindValue(':kayityapankullanicialyet', $_SESSION['kullaniciid'], PDO::PARAM_INT);
    $kullaniciverilerl->bindValue(':kayitarihialyet', date('Y.m.d H:i:s'), PDO::PARAM_STR);
    $kullaniciverilerl->bindValue(':durumyet', '1', PDO::PARAM_INT);
    $kullaniciverilerl->execute();      
 
				  
}

else 

{
	
 $sifrele ='UPDATE kullanici_yetki SET 
 
durum= :durumumuz,
guncelleme_yapan_kullanici= :guncelleyenkullanici,
guncelleme_tarihi= :guncelleyentarihi  
WHERE  kategori_id= :kategoriyet  and kullanici_id= :kullaniciyet';
$sifrelel= guncel($sifrele, $baglan);    
    $sifrelel->bindValue(':kullaniciyet', $_POST['kullanicial'], PDO::PARAM_INT);
    $sifrelel->bindValue(':kategoriyet', $_POST['yetki_'.$deger], PDO::PARAM_INT);
    $sifrelel->bindValue(':guncelleyenkullanici', $_SESSION['kullaniciid'], PDO::PARAM_INT);
    $sifrelel->bindValue(':guncelleyentarihi', date('Y.m.d H:i:s'), PDO::PARAM_STR);
    $sifrelel->bindValue(':durumumuz', '1', PDO::PARAM_INT);
    $sifrelel->execute();  
 
	
}   
}
}
  header("location: kullanici_yetki_alver.php?kullanicigetir=".$_POST['kullanicial']."",  true,  301 );  exit;        
}
    
    
    
 if ($_POST["topluyetkial"]=="1"){ 
   
 
        if(empty($_POST['sec']))

        {
               echo "<script type='text/javascript'> 
     jQuery(document).ready(function() {
                     jQuery.gritter.add({
                            title: 'Hata!',
                            text: 'Seçim Yapmadınız',
                      class_name: 'growl-danger',
                       time: '10000',
                       
                     });
                   
              }); 
       
</script>";
        }
            else
        {
                $secim=$_POST['sec'];

foreach ($secim as $veri => $deger) {
		 
 
	
 $sifrele ='UPDATE kullanici_yetki SET 
 
durum= :durumumuz,
guncelleme_yapan_kullanici= :guncelleyenkullanici,
guncelleme_tarihi= :guncelleyentarihi  
WHERE  kategori_id= :kategoriyet  and kullanici_id= :kullaniciyet';
$sifrelel= guncel($sifrele, $baglan);    
    $sifrelel->bindValue(':kullaniciyet', $_POST['kullanicial'], PDO::PARAM_INT);
    $sifrelel->bindValue(':kategoriyet', $_POST['yetki_'.$deger], PDO::PARAM_INT);
    $sifrelel->bindValue(':guncelleyenkullanici', $_SESSION['kullaniciid'], PDO::PARAM_INT);
    $sifrelel->bindValue(':guncelleyentarihi', date('Y.m.d H:i:s'), PDO::PARAM_STR);
    $sifrelel->bindValue(':durumumuz', '0', PDO::PARAM_INT);
    $sifrelel->execute();  
 
	
   
}
}
  header("location: kullanici_yetki_alver.php?kullanicigetir=".$_POST['kullanicial']."",  true,  301 );  exit;        
}    
    
?> 
	     <script type="text/javascript">
$(document).ready(function(){

$('input[id="tumu"]').bind('click', function(){
 
$('input[type="checkbox"]').attr('checked', $(this).is(':checked'));
});

});
</script>
    
    
    <form class="form-horizontal form-bordered" name="izinfor" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post" enctype="multipart/form-data" > 
	   <div class="panel panel-dark-head">
   
    
                            <div class="panel-heading">
                                
                                     
                                      
                                     
                              <?php
 $kal = "SELECT  adi_soyadi  from  kullanicilar  where id='".$_GET['kullanicigetir']."'"; 
 $kalb = sorgu($kal, $baglan); 
 $kalb->execute();
 $kall =veriliste($kalb);  
                                
                                ?> 
                                
                                <h4 class="panel-title"><?php echo $kall['adi_soyadi'];?></h4>
                                <p>  Kullanıcısına Yetki Tanımlamaktasınız</p>
                                 <input type="text" placeholder="Yetki Ara..." id="tablodaara"  class="form-control">
                            </div>

	
                 <div class="panel panel-dark-head">
                            
                            <table  border="1"   class="table table-dark mb30 width100p" >
                                <thead class="">
                                    
                                    
                                    
                                        
                                    <tr>
                                       <th  align="center"><p align="center"><input id="tumu" type="checkbox" style="width: 20px; height: 20px"></p></th>
                                        <th>Sayfa Adı</th>
                                        <th>Durum</th>
                                      
                                      
                                    </tr>
                                </thead>
              
                              <tbody   id="tablotr">  
                                  
                <input   name="kullanicial"  hidden="hidden"  value="<?php echo $_GET['kullanicigetir']; ?>"  /> 
                                  
                    <?php
         
              
 $kategoriler ="SELECT id,isim FROM kategoriler order by isim,id"; 
 $kategorilerb = sorgu($kategoriler, $baglan); 
 $kategorilerb->execute();                               
           
 
 $i=0;  while ($kategoriilkveri =veriliste($kategorilerb)) {  $i++;           
    
	 
    $kullaniciid=trim(addslashes($_GET['kullanicigetir']));
    $sayfaid=trim(addslashes($kategoriikinciveri['id']));                         
 
    $sayfayetkikontrol = "SELECT  kategori_id  from  kullanici_yetki  where kullanici_id='".$kullaniciid."' and kategori_id='".$kategoriilkveri['id']."' and durum='1' "; 
    $sayfayetkikontrolb = sorgu($sayfayetkikontrol, $baglan); 
    $sayfayetkikontrolb->execute();
    $sayfayetkikontroll =veriliste($sayfayetkikontrolb);  
            
      ?>
								
                                  
                     
                                  <tr>
                                 
				                      
                                      <input   name="yetki_<?php echo $i;?>"  hidden="hidden"  value="<?php echo $kategoriilkveri['id']; ?>"  /> 
                                      
                                    
                                    <td align="center"  style="vertical-align: middle"> <input value='<?php echo $i?>'  name='sec[]' style="width: 20px; height: 20px;"  type='checkbox'> </td> 
                                    <td><?php echo $kategoriilkveri['isim']; ?></td> 
									<td><?php if ($kategoriilkveri['id']==$sayfayetkikontroll['kategori_id']) {?> 
                                       <a href="?yetkial=<?php echo $kategoriilkveri['id']; ?>&kullanicigetir=<?php echo $_GET['kullanicigetir']; ?>" > <i class="glyphicon glyphicon-eye-open"></i></a>
                                        <?php } else {?>
                                        <a href="?yetkiver=<?php echo $kategoriilkveri['id']; ?>&kullanicigetir=<?php echo $_GET['kullanicigetir']; ?>" ><i class="glyphicon glyphicon-eye-close"></i></a>
                                        <?php } ?></td>
                                     
                     
                                   
									 
								</tr>	
                                  
<?php }  
    ?>
							 </tbody>
                                
                                
                        
                            </table>
                    <div class="pull-left">
                       
                      <button  class="btn btn-primary" type="submit" value="1" name="topluyetkiver" >SEÇİLİ SAYFALARA YETKİ VER</button>
                        </div> 
           
           
           
                        <div class="pull-right">
                             <button  class="btn btn-danger" type="submit" value="1" name="topluyetkial" >SEÇİLİ SAYFALARDAN YETKİ AL</button>
                       
                        </div>    </div>   
           
           
                      
                          
                                     
 	 
      
                        </div>   
                       
 
    </form>
            


<script src="js/jquery-1.11.1.min.js"></script>
        <script src="js/jquery-migrate-1.2.1.min.js"></script>
        <script src="js/bootstrap.min.js"></script>
 
        <script>
         
            
            $(document).ready(function () {
    $("#tablodaara").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tablotr tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});
            
        
        </script>
 
 </html>