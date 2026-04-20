<?php
header('Content-Type: text/html; charset=utf-8');
mb_internal_encoding('UTF-8');
ob_start();

include("baglanti/baglantilar_fonksiyonlar.php");

$ayarlar ="select siteadi,logo from ayarlar"; 
$ayarlarb = sorgu($ayarlar, $baglan); 
$ayarlarb->execute();
$ayarlarl= veriliste($ayarlarb);   
 

if($_POST['onay']=='1') {
    
    
             $kullaniciadial=clean(htmlentities($_POST['kullaniciadi'], ENT_QUOTES));
		    $sifre=clean(htmlentities(md5($_POST['sifre']), ENT_QUOTES));
            
    
   
    $kullanicilar = "select id,kullanici_adi,sifre,durumu from kullanicilar where kullanici_adi=:kadim and sifre=:sifrem and durumu=:durumum"; 
         $verilerb = sorgu($kullanicilar, $baglan); 
         $verilerb->bindValue(':kadim',$kullaniciadial, PDO::PARAM_STR);  
         $verilerb->bindValue(':sifrem',$sifre, PDO::PARAM_STR);
         $verilerb->bindValue(':durumum', 1, PDO::PARAM_INT);   
         $verilerb->execute();
         $verilerl= veriliste($verilerb);     
     
    
      
     
    if($verilerl['durumu']=='1') {  
     session_start();
        
        
        
        
    if($_POST['image_text']==$_SESSION['guvenlik']) {
    	 

       
       
        
      $tokenanahtari = substr(md5(rand(0,9999999999)),-30)."".date("Ymd").""."6e5y7a1l6c3i2n3".substr(md5(rand(0,9999999999)),-20);
      $jetonal=preg_match("/6e5y7a1l6c3i2n3/", $tokenanahtari);
        
                               
       $giriskontrol="select 
			count(*) as isim 
            ,id 
            ,adi_soyadi
            ,kullanici_adi
            ,maili
            ,birimi
            ,yonetici_durum
            ,avukat_durum
            ,durumu

	   from kullanicilar
	   where kullanici_adi=:kadim and sifre=:sifrem and durumu=:durumum
	  group by 
            id
            ,adi_soyadi
           ,kullanici_adi
           ,maili
            ,birimi
            ,yonetici_durum
            ,avukat_durum
            ,durumu ";      
   $girisb = sorgu($giriskontrol, $baglan);
   $girisb->bindValue(':kadim',$verilerl['kullanici_adi'], PDO::PARAM_STR);  
   $girisb->bindValue(':sifrem',$verilerl['sifre'], PDO::PARAM_STR);
   $girisb->bindValue(':durumum', 1, PDO::PARAM_INT);       
   $girisb->execute();      
   $girisal =veriliste($girisb);   
        
        
    $yetkisorgu = "SELECT  kullanici_yetki.kategori_id as kategori_id from kullanici_yetki where durum=:durumum and kullanici_id=:kidal";
    $yetkib = sorgu($yetkisorgu, $baglan);
    $yetkib->bindValue(':kidal',$girisal['id'], PDO::PARAM_INT); 
    $yetkib->bindValue(':durumum', 1, PDO::PARAM_INT);     
    $yetkib->execute();
     
while($yetkil= veriliste($yetkib)) 
{ 
$yetkilerdizi[]=$yetkil['kategori_id']; 
} 

 
  
              $_SESSION['yetkidizi'] = $yetkilerdizi;
              $_SESSION['siteadi'] = $ayarlarl['siteadi'];
              $_SESSION['logo'] = $ayarlarl['logo'];
              
			  $_SESSION['birim'] = $girisal['birimi'];
			  $_SESSION['kullaniciid'] = $girisal['id'];
			  $_SESSION['kullaniciadi'] = $girisal['kullanici_adi'];
              $_SESSION['adi'] = $girisal['adi_soyadi'];
              $_SESSION['maili'] = $girisal['maili'];
			  $_SESSION['yonetici_durum'] = $girisal['yonetici_durum'];
              $_SESSION['avukat_durum'] = $girisal['avukat_durum'];
              $_SESSION['jetonal'] = $tokenanahtari;  
	   
           if($girisal['durumu']=='1') {header('location: index.php?giris=onay');} 
 
 
        
     
 
   
 
        
 }  else {
            session_destroy();
			$hata.="Güvenlik Kodunu Hatalı Girdiniz"."<br>"; 
 
		} 

   }else {
            session_destroy();
			$hata.="Kullanıcı Adı veya Şifre Hatalı"."<br>"; 
 
		}
    
    }
?>
 
<!DOCTYPE html>
<html lang="tr">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <meta name="description" content="">
        <meta name="author" content="">

        <title><?php echo $ayarlarl['siteadi']; ?></title>

        <link href="css/style.default.css" rel="stylesheet">
 <style>/*auth-login-form*/
.login-bg-image{
  height: 100vh;
  background: url(images/ark.jpg) center center/cover;
  filter: blur(6px);
  -webkit-filter: blur(6px);
}

.auth-login-form {
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0, 0.4); /* Black w/opacity/see-through */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  width: 100%;
  height: 100%;  
  position: fixed;
}

.auth-login-form .auth-form{
  width: 100%;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}</style>
    </head>

    <body  >
    <script language="JavaScript">
/*function kontrol() 
{ var image_text=document.frmX.image_text.value; if (image_text !="") return true; else alert ('Güvenlik Kodunu Girmediniz!')
 return false;
}*/


</script>
        
        
      <div class="login-bg-image"></div>  
        <section>
        <div class="page auth-login-form">
            <div class="panel panel-signin" >
                <div class="panel-body">
                    <div class="logo text-center">
                       <img id="logo" src="dosya/<?php echo $ayarlarl['logo'];?>" alt="<?php echo $ayarlarl['siteadi']; ?>" class="width100p" />
                    </div>
                   
                   
                    <h5 class="text-center mb5"><b>Hesabınıza Giriş Yapın</b></h5>
                    
                    
                
                    
                               <?php if(isset($hata) && $hata!='') {?> <div class="alert alert-danger" align="center">
                                 
                                    <strong ><?php echo $hata;?></strong> 
                                </div>
                              <?php } ?>
                 
                    
                    <div class="mb30"></div>
                    
                    <form  method="POST"  action="giris.php" name='frmX' id="frmX" onSubmit="return kontrol()" >
                    <input type="hidden" name="onay"  value="1">
                        <div class="input-group mb15">
                            <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
                             <input  class="form-control" name="kullaniciadi" type="text" required  placeholder="Kullanıcı Adı" />
                        </div><!-- input-group -->
                        <div class="input-group mb15">
                            <span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>
                         
                             <input  class="form-control" name="sifre" type="password" AUTOCOMPLETE="off" required placeholder="Şifre" />
                        </div><!-- input-group -->
                        
                       <div class="input-group mb15">
                            <span class="input-group-addon"><i class="glyphicon  glyphicon-eye-open"></i></span>
                            <input  class="form-control"  name="image_text" type="text"  required  id="Güvenlik Kodu" value="" autocomplete="off" placeholder="Güvenlik Kodu">
                  
                                  <img src="image.php"  >
                        </div>
                    
                        
                        <div class="clearfix" >
                            <div class="pull-left">
                                <div class="ckbox ckbox-success">
                                    <input type="checkbox"  id="checkboxSuccess" checked="checked">
                                    <label for="checkboxSuccess">Beni Hatırla</label>
                                </div>
                            </div>
                            <div class="pull-right">
                               
                               <label for="checkboxSuccess" style="margin-top: 3px "><a  href="https://eyalcin.com" target="_blank" >Şifremi Unuttum</a></label> 
                               
                            </div>
                        </div>    
                        
                         <div class="clearfix width100p" style="margin-top: 20px ">
                             
                           
                                <button type="submit"  onClick="return myFormSubmit()" class="btn btn-success width100p">Oturum Aç </button>
                             
                        </div> 
                    </form>
                    
                </div><!-- panel-body -->
                <div class="panel-footer" >
                
                 <div style="text-align:center"><a href="https://eyalcin.com" target="_blank" style="color: darkslategrey">eyalcin Yazılım Hizmetleri</a></div>
                </div><!-- panel-footer -->
               </div> 
             <!-- panel --><div class="text-center text-muted" style="margin-top: 30px">
          Yardım ve Destek İçin <a href="https://eyalcin.com" target="_blank" style="color: darkslategrey">eyalcin</a>
        </div>
            </div> 
        </section>


        
 <?php $baglan = null;     
 ob_end_flush();?>

    </body>
</html>