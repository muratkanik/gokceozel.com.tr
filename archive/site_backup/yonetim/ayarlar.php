<?php include("ust.php");
 
 sayfayetkikontrol(3); 


if ($_POST["genelkayitguncelle"]=="1"){
    
    
   $gelenid=temizlikimandan($_POST['id']);
    $esiteadi=addslashes($_POST['siteadi']);
    $efirmaadi=addslashes($_POST['firmaadi']);
    $eadres=addslashes($_POST['adres']);
    $ewebsitesi=addslashes($_POST['websitesi']);
    $email=addslashes($_POST['mail']);
    $evergidairesi=$_POST['vergidairesi'];
    $everginumarasi =$_POST['vergidairesi'];
    $etelefon =$_POST['telefon'];
    $egsm =$_POST['gsm'];
    $emersisno=$_POST['mersisno'];
    $doviz=$_POST['doviz'];
    $ozel=$_POST['ozel'];
    $facebook=$_POST['facebook'];
    $instagram=$_POST['instagram'];
    $twitter=$_POST['twitter'];
    $youtube=$_POST['youtube'];
    $linkedin=$_POST['linkedin'];
    $form_mail_alici=addslashes($_POST['form_mail_alici']);
   
 

for($i=1;$i<=1;$i++) 
{
$dosya1 ="resim1_".$i; 
$temizligebasla1=$_FILES[$dosya1]['name'];
$uzanti1 = strtolower(strrchr($temizligebasla1,'.'));
$dosyasonucum1 = substr(md5(rand(0,9999999999)),-10)."eyalcin".$uzanti1;
if(move_uploaded_file($_FILES[$dosya1]['tmp_name'], "dosya/".$dosyasonucum1."")) 
{ 
$url1=$dosyasonucum1; 
}    
 $veri1=trim($url1); if($veri1!='') {$dosyasonuc1.=$veri1;}  else {$dosyasonuc1.=$_POST['resim1'];}
    
    
    
    
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
form_mail_alici= :form_mail_alici
WHERE id= :idal';
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
    $kayitveri->bindValue(':idal',$gelenid, PDO::PARAM_INT);
    $kayitveri->execute();    
 
 if (!$kayitveri) {echo "<script type='text/javascript'>alert('Hata! Ayarlar Güncellenemedi');</script> ";}    
 if ($kayitveri) {echo "<script type='text/javascript'>alert('Güncelleme Başarılı');  window.close();</script> ";}  
    
    
    
    
     
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
                        
                        <div class="row">
                          <form class="form-horizontal form-bordered" name="ayar" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="POST" enctype="multipart/form-data"  id="ayar"> 
                          
                           <input name="id" type="hidden" id="id" value="<?php echo $ayarlarliste['id']; ?>">
                
                            
                             
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
                                            
                                             <div class="form-group">
                                                <label class="col-sm-4 control-label">Form Mail Alıcıları</label>
                                                <div class="col-sm-8">
                                                   <input type="text" name="form_mail_alici" value="<?php echo isset($ayarlarliste['form_mail_alici']) ? $ayarlarliste['form_mail_alici'] : ''; ?>" class="form-control tooltips" placeholder="email1@example.com, email2@example.com; email3@example.com" />
                                                   <span class="help-block">Birden fazla e-posta adresi virgül (,) veya noktalı virgül (;) ile ayrılabilir</span>
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
                             
     					<div class="panel panel-default">
                            <div class="panel-heading">
                                <div class="panel-btns">
                                    <a href="" class="panel-minimize tooltips" data-toggle="tooltip" title="Minimize Panel"><i class="fa fa-minus"></i></a>
                                    <a href="" class="panel-close tooltips" data-toggle="tooltip" title="Close Panel"><i class="fa fa-times"></i></a>
                                </div><!-- panel-btns -->
                                
                                <p>Güncellemeyi gerçekletirmeden önce lütfen <code>bilgilerinizi</code> kontrol ediniz.</p>
                            </div>
                            <div class="panel-body" style="text-align:right">
                            
<input class="btn btn-primary"  type="submit" value="FORMU GÜNCELLE" />

</p>
<input type="hidden" name="genelkayitguncelle" value="1">                         
                            </div><!-- panel-body -->
                        </div><!-- panel -->                  
                              
                        </form> 
                    </div><!-- contentpanel -->
                </div>
            </div><!-- mainwrapper -->
        </section>

<?php  include("alt.php");?>