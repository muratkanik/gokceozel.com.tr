<?php session_start();
include("baglanti/baglantilar_fonksiyonlar.php"); 
include("baglanti/sayfa_yetki_fonksiyonu.php");
include("include/class.phpmailer.php"); 

 sayfayetkikontrol(3);       

$mail = new PHPMailer();
$mail->IsSMTP();
$mail->SMTPAuth   = true;
$mail->Host ='93.89.232.4';
$mail->Port = 587;
$mail->Username = 'bilgimail@eyalcin.com';
$mail->Password = 'Emrah984';
$mail->CharSet = 'UTF-8';


if ((isset($_GET['sil'])) && ($_GET['sil'] != "")) {
   $edurum ='-1';
   $silbilgiid =temizlikimandan($_GET['sil']); 
   $formbilgisi=temizlikimandan($_GET['bilgigonder']); 
    
    
$silmesorgusu ='UPDATE icerik_belge SET durum= :durumal  WHERE id= :idal';
$silmesorgusub= guncel($silmesorgusu, $baglan);    
$silmesonucu =$silmesorgusub->execute(array("durumal" => $edurum,"idal" => $silbilgiid));  
if (!$silmesonucu) {echo "<script type='text/javascript'>alert('Hata! Döküman Silinemiyor');</script> ";}   
 if ($silmesonucu) {echo "<script type='text/javascript'>alert('Döküman Silindi');   location.href= 'icerik_belge_goster.php?bilgigonder=".$formbilgisi."';</script> ";} 
} 
 
 
if (($_POST['onayla']==1) && ($_POST['toplusilme']==1)) {  
    $baglan->beginTransaction();
 
 
        if(empty($_POST['sec']))

        {
               echo "Hiç Bir Seçim Yapmadiniz. Bu Islemi Gerçeklestirebilmek Için Lütfen Seçim Yapiniz.";
        }
            else
        {
                $secim=$_POST['sec'];

foreach ($secim as $veri => $deger) {
	 
            $belgeid = $_POST['belgeid_'.$deger]; 
            $edurum ='-1';
            $formbilgisi=temizlikimandan($_POST['bilgigonder']); 
    
    
$silmesorgusu ='UPDATE icerik_belge SET durum= :durumal  WHERE id= :idal';
$silmesorgusub= guncel($silmesorgusu, $baglan);    
$silmesonucu =$silmesorgusub->execute(array("durumal" => $edurum,"idal" => $belgeid));  
if (!$silmesonucu) {echo "<script type='text/javascript'>alert('Hata! Döküman Silinemiyor');</script> ";}   
if ($silmesonucu) {echo "<script type='text/javascript'>alert('Döküman Silindi');   location.href= 'icerik_belge_goster.php?bilgigonder=".$formbilgisi."';</script> ";} 
              
 }                       
 } 
    if($silmesonucu){   
 $baglan->commit();
      echo "<script type='text/javascript'>alert('İşleminiz Başarıyla Gerçekleştirildi');  location.href= 'icerik_belge_goster.php?bilgigonder=".$formbilgisi."';</script>";
    }else {
    $baglan->rollBack();
       
         echo "<script type='text/javascript'>  
	   alert('Hata! İşleminiz Gerçekleştirilemedi'); 
       location.href= 'icerik_belge_goster.php?bilgigonder=".$formbilgisi."';
</script>"; 
    } 
 }
	 
 



if (($_POST['onayla']==1) && ($_POST['emailgonder']==1)) {  
 
$Detay.='<table width="100%" cellspacing="2" cellpadding="0" style="font-family:Tahoma, Arial, Helvetica, sans-serif; font-size: 11px;color: #414141">';
       
        if(empty($_POST['sec']))

        {
               echo "Hiç Bir Seçim Yapmadiniz. Bu Islemi Gerçeklestirebilmek Için Lütfen Seçim Yapiniz.";
        }
            else
        {
                $secim=$_POST['sec'];
			    $enkucuk=min($secim);
                $enbuyuk=max($secim);
			  
	 
	 
                foreach ($secim as $veri => $deger) {
	 
          $isim = $_POST['isim_'.$deger]; 
          $kayittarihi = $_POST['kayittarihi_'.$deger];       
          $aciklama = $_POST['aciklama_'.$deger];           
          $adisoyadi = $_POST['adisoyadi_'.$deger];         
          $belge = "dosya/".$_POST['belge_'.$deger];  
               

                    
 
                $Detay.='<tr><td height="28" bgcolor="#F4F4F4">Dosya Türü: <font style="font-size:10px;color: #6A6A6A;font-weight:bold">'.$isim.' </font></td> </tr> ';
                $Detay.='<tr><td height="28" bgcolor="#F4F4F4">Kayıt Tarihi: <font style="font-size:10px;color: #6A6A6A;font-weight:bold">'.$kayittarihi.' </font></td> </tr> ';
                $Detay.='<tr><td height="28" bgcolor="#F4F4F4">Açıklama: <font style="font-size:10px;color: #6A6A6A;font-weight:bold">'.$aciklama.' </font></td> </tr> ';  
                $Detay.='<tr><td height="28" bgcolor="#F4F4F4">Ekleyen: <font style="font-size:10px;color: #6A6A6A;font-weight:bold">'.$adisoyadi.' </font></td> </tr> '; 
                $Detay.='<tr><td height="28" bgcolor="#F4F4F4">Döküman: <font style="font-size:10px;color: #6A6A6A;font-weight:bold"><a href='.$belge.' download>İndir/Görüntüle</a></font></td> </tr> ';               
      
     
			    $Detay.='<tr><td height="50" bgcolor="#ffffff"> </td> </tr> '; 
                
                }                       
                   
   }                
                   
 $Detay.='</table>';     

$mail->SetFrom($_SESSION['maili'], $_SESSION['siteadi']); 
$mail->Subject    = 'Döküman Bildirimi';
 
$mail->Body       = $Detay;
$mail->AltBody    = 'Tarafınıza Yeni Bir Döküman Gönderildi';
    
 $mailler = array(
   $_POST['mailler'] => '',
);
foreach($mailler as $email => $name)
{
   $mail->AddAddress($email, $name);
}
    
 
 if(!$mail->Send()){ echo "<script type='text/javascript'>alert('Hata! Mailiniz Gönderilemedi.' );location.href= 'icerik_belge_goster.php?bilgigonder=".$_POST['bilgigonder']."';</script>"; 
	 
	exit;
	} else {   
  echo "<script type='text/javascript'>alert('Mailiniz Başarılı Şekilde Gönderildi.'); location.href= 'icerik_belge_goster.php?bilgigonder=".$_POST['bilgigonder']."';</script>"; 
    
 exit;
 }
	 
}








$bilgiald=temizlikimandan($_GET['bilgigonder']); 
$belgeald=temizlikimandan($_GET['belgegonder']);
if($bilgiald!='') {$toplusonuc.=" and db.kayit_id='$bilgiald'";}
if($belgeald!='') {$toplusonuc.=" and db.id=$belgeald";}

  $sorgusonuc= "select db.id,dbt.isim,aciklama,kl.adi_soyadi,db.kayit_tarihi,db.belge,db.aciklama,db.kayit_id,db.belge_adi 
FROM icerik_belge	db 
left outer join   belge_turleri  dbt on db.belge_turu=dbt.id
left outer join kullanicilar kl on db.kayit_yapan_kullanici=kl.id
where db.durum!='-1' $toplusonuc";
 $sorgusonucb = sorgu($sorgusonuc, $baglan); 
 $sorgusonucb->execute();     
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <meta name="description" content="">
        <meta name="author" content="">

        <title><?php echo $_SESSION['siteadi'];?></title>

        <link href="css/style.default.css" rel="stylesheet">
        <link rel="stylesheet" href="css/lightbox.min.css">

        <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!--[if lt IE 9]>
        <script src="js/html5shiv.js"></script>
        <script src="js/respond.min.js"></script>
        <![endif]-->
    </head>

    <body>
        
        <header>
           
        </header>
        
        <section>
      
        
                     <div class="panel panel-dark-head">
                              <div class="panel-heading">  
                                <h4 class="panel-title">DÖKÜMAN GÖRÜNTÜLE </h4>
                                <p> Davası Dökümanlarını Görüntülemektesiniz</p>
                            </div>
  <form name="hukukformU"       method="POST"> 
                    
                    <div class="contentpanel contentpanel-mediamanager">
                        
                        <div class="media-options">
                            <div class="pull-left">
                                <div class="btn-toolbar">
                                    <div class="btn-group">
                                        <a class="btn btn-default btn-sm" 
                                           href="javascript:NewWindow=window.open('icerik_belge_ekle.php?bilgigonder=<?php echo $_GET['bilgigonder'];?>','newWin','width=600,height=
                                  650,toolbar=Yes,location=false,scrollbars=Yes,status=No,re sizable=No,fullscreen=No'); NewWindow.focus();void(0);"  title="Belge Ekle"><i class="fa fa-plus"></i> Döküman Ekle</a>
                                    </div>
                                    
                                    
                                      <div class="btn-group">
                                        <button id="selectAll" class="btn btn-default btn-sm" type="button">Tümünü Seç</button>
                                    </div>
                                    
                                    <div class="btn-group">
                                        <button class="btn btn-default btn-sm disabled" type="button"  data-toggle="modal" data-target=".bs-example-modal-lg"  ><i class="fa fa-envelope mr5"></i> Email</button>
                                 
                                <div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                  <div class="modal-header">
                      <button aria-hidden="true" data-dismiss="modal" class="close" type="button">&times;</button>
                      <h4 class="modal-title">Döküman Mail</h4>
                  </div>
                  <div class="modal-body"><input class="form-control tooltips" type="email" name="mailler" value=""></div>
                
                 <div class="modal-body">      
                <button type="button" class="btn btn-danger" class="close" data-dismiss="modal" >Vazgeç</button>
                <button type="reset" class="btn btn-default">Temizle</button>
                <button name="emailgonder" value="1" class="btn btn-primary">Gönder</button>   
                       
              </div>
            </div>
        </div>
                                        
                                    </div>
                                </div>
                                    <div class="btn-group">
                                    
                                        <button onClick="return confirm('Bu Kaydı Silmek İstediğinizden Eminmisiniz?');"   name="toplusilme" value="1" class="btn btn-default btn-sm disabled" type="sumbit"><i class="fa fa-trash-o mr5"></i> Sil</button>
                                    </div>
                                <!-- btn-toolbar -->
                            </div>
                             
                        </div><!-- media-options -->
                       </div> 
                        <hr>
      
                        <div class="row">
                          <div class="col-sm-12">
                            <div class="row media-manager">
                             
                            
                                
                               
                             <?php $i=0;  while ($sorgusonucl =veriliste($sorgusonucb)) {  $i++;  
                                
                                $foto =$sorgusonucl['belge'];
                                $parca=explode(".",$foto); 
                                $ad=$parca[0]; 
                                $uzanti=$parca[1];   
                              
                                ?>     
                              <div class="col-xs-6 col-sm-4 col-md-3 image">
                                <div class="thmb" style="height: 300px">
                                  <div class="ckbox ckbox-default">
                                  <input value='<?php echo $i?>'  name='sec[]'  id="check<?php echo $i?>"    type='checkbox' />    
                               
                                    <label for="check<?php echo $i?>"></label>
                                  </div>
                                  <div class="btn-group fm-group">
                                      <button type="button" class="btn btn-default dropdown-toggle fm-toggle" data-toggle="dropdown">
                                        <span class="caret"></span>
                                      </button>
                                      <ul class="dropdown-menu fm-menu pull-right" role="menu">
                            
                                        <li><a href="dosya\<?php echo $foto;?>" download><i class="fa fa-download"></i> İndir</a></li>
                                        <li><a onClick="return confirm('Bu Kaydı Silmek İstediğinizden Eminmisiniz?');" href="icerik_belge_goster.php?sil=<?php echo $sorgusonucl['id']; ?>&bilgigonder=<?php echo $_GET['bilgigonder']; ?>" title="Kaydı Sil"><i class="fa fa-trash-o"></i> Sil</a></li>
                                      </ul>
                                  </div> 
                                  <div class="thmb-prev">
           <?php if (($uzanti=='JPG') or ($uzanti=='JPEG') or ($uzanti=='jpeg') or ($uzanti=='jpg')or ($uzanti=='png')or ($uzanti=='png') or ($uzanti=='gif') or ($uzanti=='bmp')){?>           
                                      <a  class="example-image-link quickview-box-btn" href="dosya\<?php echo $foto;?>"  data-lightbox="example-set" data-title="büyüt"  >
                              
                                      <img  src="dosya\<?php echo $foto;?>" class="img-responsive" style="height: 170px"   />
                                    </a>
                                      <?php } else {?>                            
                           
                           <a href="dosya\<?php echo $foto;?>" download><img src="images/media-doc.png" class="img-responsive"  style="height: 170px"    />        
                                      
                                      
                                <?php } ?>      
                                      
                                      
                                      
                                  </div>
                                  <p><small class="text-muted"><b>Belge Türü:</b> <?php echo $sorgusonucl['isim']; ?></small> </p>  
                                    <p><small class="text-muted"><b>Açıklama :</b> <?php echo $sorgusonucl['aciklama']; ?></small> </p>  
                                  <p><small class="text-muted"><b>Kayıt Tarihi:</b> <?php echo date('d.m.Y', strtotime($sorgusonucl['kayit_tarihi'])); ?></small></p>  
                                   <p><small class="text-muted"><b>Ekleyen:</b> <?php echo  $sorgusonucl['adi_soyadi'] ; ?></small>  </p>  
                                </div> 
                              </div> 
                                  
                                  
                               <input type="hidden" name="isim_<?php echo $i?>" value=" <?php echo $sorgusonucl['isim']; ?>"/>  
                               <input type="hidden" name="aciklama_<?php echo $i?>" value="<?php echo $sorgusonucl['aciklama']; ?>"/>
                               <input type="hidden" name="kayittarihi_<?php echo $i?>" value="<?php echo date('d.m.Y', strtotime($sorgusonucl['kayit_tarihi'])); ?>"/>  
                               <input type="hidden" name="adisoyadi_<?php echo $i?>" value="<?php echo  $sorgusonucl['adi_soyadi'] ; ?>"/>
                               <input type="hidden" name="belge_<?php echo $i?>" value="<?php echo $foto;?>"/>
                                <input type="hidden" name="belgeid_<?php echo $i?>" value="<?php echo $sorgusonucl['id']?>"/>   
                                <input type="hidden" name="bilgigonder" value="<?php echo $_GET['bilgigonder']?>"/> 
                                <input type="hidden" id="onayla" name="onayla" value="1"/>    
                                <?php } ?>
                               
                                
                           
                              
                            </div><!-- row -->
                            
                            
                          </div><!-- col-sm-9 -->
                           
                        </div>
                      </div>
                      </form>
                  
        </section>

                     
                  
                         
        <script src="js/jquery-1.11.1.min.js"></script>
        <script src="js/jquery-migrate-1.2.1.min.js"></script>
        <script src="js/bootstrap.min.js"></script>
        <script src="js/jquery.cookies.js"></script>
        <script src="js/lightbox-plus-jquery.min.js"></script> 
        
        <script src="js/custom.js"></script>
        <script>
            jQuery(document).ready(function(){
    
                jQuery('.thmb').hover(function() {
                    var t = jQuery(this);
                    t.find('.ckbox').show();
                    t.find('.fm-group').show();
                }, function() {
      
                    var t = jQuery(this);
                    if(!t.closest('.thmb').hasClass('checked')) {
                        t.find('.ckbox').hide();
                        t.find('.fm-group').hide();
                    }
                });
    
                jQuery('.ckbox').each(function(){
                    var t = jQuery(this);
                    var parent = t.parent();
                    if(t.find('input').is(':checked')) {
                        t.show();
                        parent.find('.fm-group').show();
                        parent.addClass('checked');
                    }
                });
    
    
                jQuery('.ckbox').click(function(){
                    var t = jQuery(this);
                    if(!t.find('input').is(':checked')) {
                        t.closest('.thmb').removeClass('checked');
                        enable_itemopt(false);
                    } else {
                        t.closest('.thmb').addClass('checked');
                        enable_itemopt(true);
                    }
                });
    
                jQuery('#selectAll').click(function() {
                    if(jQuery(this).hasClass('btn-default')) {
                        jQuery('.thmb').each(function() {
                            jQuery(this).find('input').attr('checked',true);
                            jQuery(this).addClass('checked');
                            jQuery(this).find('.ckbox, .fm-group').show();
                        });
                        enable_itemopt(true);
                        jQuery(this).removeClass('btn-default').addClass('btn-primary');
                        jQuery(this).text('Select None');
                    } else {
                        jQuery('.thmb').each(function(){
                            jQuery(this).find('input').attr('checked',false);
                            jQuery(this).removeClass('checked');
                            jQuery(this).find('.ckbox, .fm-group').hide();
                        });
                        enable_itemopt(false);
                        jQuery(this).removeClass('btn-primary').addClass('btn-default');
                        jQuery(this).text('Select All');
                    }
                });
    
                function enable_itemopt(enable) {
                    if(enable) {
                        jQuery('.media-options .btn.disabled').removeClass('disabled').addClass('enabled');
                    } else {
        
                        // check all thumbs if no remaining checks
                        // before we can disabled the options
                        var ch = false;
                        jQuery('.thmb').each(function(){
                            if(jQuery(this).hasClass('checked'))
                                ch = true;
                        });
        
                        if(!ch)
                            jQuery('.media-options .btn.enabled').removeClass('enabled').addClass('disabled');
                    }
                }
    
                jQuery("a[data-rel^='prettyPhoto']").prettyPhoto();
    
            });
        </script>
                         
           <script>

    var Pencerem;



    function PencereOrtala(url,w,h) {

        var left = parseInt((screen.availWidth/2) - (w/2));

        var top = parseInt((screen.availHeight/2) - (h/2));

        var windowFeatures = "width=" + w + ",height=" + h + ",status,resizable,left=" + left + ",top=" + top + "screenX=" + left + ",screenY=" + top;

        Pencerem = window.open(url, "subWind", windowFeatures);

    }

</script>                
                         
                         
                         
                         
                         <script>
           
 
    function kapat()

{

window.close()

}
        </script> <?php $baglan = null;   ?>
    </body>
</html>
  