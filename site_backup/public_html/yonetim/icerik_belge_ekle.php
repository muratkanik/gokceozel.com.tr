<?php session_start();
include("baglanti/baglantilar_fonksiyonlar.php"); 
include("baglanti/sayfa_yetki_fonksiyonu.php");

 sayfayetkikontrol(3); 

if ((isset($_GET['sil'])) && ($_GET['sil'] != "")) {
   $edurum ='-1';
   $silbilgiid =temizlikimandan($_GET['sil']); 
   $formbilgisi=temizlikimandan($_GET['bilgigonder']); 
    
    
$silmesorgusu ='UPDATE icerik_belge SET durum= :durumal  WHERE id= :idal';
$silmesorgusub= guncel($silmesorgusu, $baglan);
$silmesorgusub->bindValue(':durumal',$edurum, PDO::PARAM_INT);  
$silmesorgusub->bindValue(':idal',$silbilgiid, PDO::PARAM_INT);
$silmesorgusub->execute();    

if (!$silmesorgusub) {echo "<script type='text/javascript'>alert('Hata! Döküman Silinemiyor');</script> ";}   
 if ($silmesorgusub) {echo "<script type='text/javascript'>alert('Döküman Silindi');   location.href= 'icerik_belge_ekle.php?bilgigonder=".$formbilgisi."';</script> ";} 
} 
 



    
 
if (isset($_POST['formgenelkayit']) && $_POST["formgenelkayit"]=="1")

{ 


if ($_FILES["belge"]["tmp_name"]!='') {
 
extract($_POST);
    $hata=array();
    $turler=array("jpeg","jpg","png","gif","zip","rar","doc","docx","xls","xlsx","pdf","php","JPG","JEPG","PNG","tif","TIF","PDF","DOC","DOCX","XLS","XLSX");
    foreach($_FILES["belge"]["tmp_name"] as $sifreleme=>$tmp_name)
            {
				
                $dosyaadi=$_FILES["belge"]["name"][$sifreleme];
				$uzanti = strtolower(strrchr($dosyaadi,'.'));
                $file_tmp=$_FILES["belge"]["tmp_name"][$sifreleme];
                $ext=pathinfo($dosyaadi,PATHINFO_EXTENSION);
                if(in_array($ext,$turler))
                {
                    if(!file_exists("dosya/".substr(md5(rand(0,9999999999)),-20)."".date("Ymd").""."eyalcin".substr(md5(rand(0,9999999999)),-20).$uzanti))
                    {
						
						$dosyasonucum = substr(md5(rand(0,9999999999)),-20)."".date("Ymd").""."eyalcin".substr(md5(rand(0,9999999999)),-20).$uzanti;
                      
						
						if ( move_uploaded_file($file_tmp=$_FILES["belge"]["tmp_name"][$sifreleme],"dosya/".$dosyasonucum) )
	{
		$dosya		= "dosya/".$dosyasonucum;
		/*$resim		= imagecreatefromjpeg($dosya); 	// Yüklenen resimden oluşacak yeni bir JPEG resmi oluşturuyoruz..
		$boyutlar	= getimagesize($dosya); 		// Resmimizin boyutlarını öğreniyoruz
		$resimorani	= 1000 / $boyutlar[0]; 			// Resmi küçültme/büyütme oranımızı hesaplıyoruz..
		$yeniyukseklik = $resimorani*$boyutlar[1]; 	// Bulduğumuz orandan yeni yüksekliğimizi hesaplıyoruz..
		$yeniresim	= imagecreatetruecolor("1000", $yeniyukseklik); // Oluşturulan boş resmi istediğimiz boyutlara getiriyoruz..
 
		imagecopyresampled($yeniresim, $resim, 0, 0, 0, 0, "1000", $yeniyukseklik, $boyutlar[0], $boyutlar[1]);
 
		// Yüklenen resmimizi istediğimiz boyutlara getiriyoruz ve boş resmin üzerine kopyalıyoruz..
		$hedefdosya=$dosyasonucum; // Yeni resimin kaydedileceği konumu belirtiyoruz..
		imagejpeg($yeniresim, "dava_dosya/".$hedefdosya, 100); 		// Ve resmi istediğimiz konuma kaydediyoruz..
 
		*/
		}
						
						

                    }
                 
	$duzen = array("I", "İ", "Ğ", "Ç", "ı", "ç", "ğ", "ü", "ö", "Ü", "Ö","'");
			
					
					
					
					
	if ($yol = opendir("dosya/") or die ("Dizin acilamadi!")) {

    while (false !== ($dosya = readdir($yol))) {
   
     if(is_file("dosya/".$dosya) && preg_match("/$dosyasonucum/", "$dosya")) { 
 
       $sonuc.=$dosya ;
 
       }

    } 

    closedir($yol);
}
 				
					
	if (($dosyasonucum!='') & (isset($_POST['bilgial']) && $_POST['bilgial']!='') & ($sonuc!='')) {			 	
    $kayitidal =isset($_POST['bilgial']) ? $_POST['bilgial'] : '';
    $belgeturual =isset($_POST['belgeturu']) ? addslashes($_POST['belgeturu']) : '';
    $dosyaadial =$dosyaadi;
    $belgeal =$dosyasonucum;        
    $aciklamaal =isset($_POST['aciklama']) ? addslashes($_POST['aciklama']) : '';
    $edurum ='1';
    $ekayityapan =temizlikimandan($_SESSION['kullaniciid']);
    $ebugununtarihi=date('Y.m.d H:i:s'); 
            
            
$kayit = 'INSERT INTO icerik_belge 
(
kayit_id,
belge_turu,
belge_adi,
aciklama,
belge,
durum,
kayit_yapan_kullanici,
kayit_tarihi
) VALUES (
     :kayitidal,
     :belgeturual,
     :belgeadial,
     :aciklamaal,
     :belgeal,
     :durumal,
     :kayityapankullanicial,
     :kayitarihial)';     
 $kayitq= guncel($kayit, $baglan); 
    $kayitq->bindValue(':kayitidal',$kayitidal, PDO::PARAM_STR);  
    $kayitq->bindValue(':belgeturual',$belgeturual, PDO::PARAM_INT);
    $kayitq->bindValue(':belgeadial',$dosyaadial, PDO::PARAM_STR);  
    $kayitq->bindValue(':aciklamaal',$aciklamaal, PDO::PARAM_STR); 
    $kayitq->bindValue(':belgeal',$belgeal, PDO::PARAM_STR); 
    $kayitq->bindValue(':durumal',$edurum, PDO::PARAM_INT);    
    $kayitq->bindValue(':kayityapankullanicial',$ekayityapan, PDO::PARAM_INT);
    $kayitq->bindValue(':kayitarihial', $ebugununtarihi, PDO::PARAM_STR);
    $kayitq->execute();

     if (!$kayitq) {echo "<script type='text/javascript'>alert('Hata! Dökümanlar Kaydedilemedi');</script> ";}  echo "<script type='text/javascript'>  
	   alert('Döküman Kaydınız Tamamlandı.'); 
       location.href= 'icerik_belge_ekle.php?bilgigonder=".$kayitidal."';
</script>";        
            
       } 
             }
                else
                {
                    array_push($hata,"$dosyaadi, ");
                }
            }

    }


}
 
?><body />   




<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="Content-Language" content="TR"/>
 <link href="css/style.default.css" rel="stylesheet">
 
 <script type="text/javascript" src="js/jquery.min.js"></script>  
 
              <div class="modal-dialog"> 
 <div class="modal-content">  
                            <div class="panel panel-dark-head">
                              <div class="panel-heading">  
                                <h4 class="panel-title">İÇERİK DÖKÜMAN EKLE </h4>
                                <p> Döküman Eklemektesiniz</p>
                            </div>
 
               
               
  								 
    <form class="form-horizontal form-bordered" name="form" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post" id="guncelle-formu"  enctype="multipart/form-data"  > 
           
 <input name="bilgial" value="<?php echo $_GET['bilgigonder']?>" hidden="hidden" />
                                            
                                            <div class="form-group"   >
                                                <label class="control-label">Döküman Türü</label>
                                                <div >
                                                <select name="belgeturu"  id="select-basic"  class="form-control tooltips"    >
<?php  $bt= "SELECT * FROM  belge_turleri   order by isim";
$btb = sorgu($bt, $baglan);
$btb->execute();  
?>
 									
<?php while ($btl =veriliste($btb)) {  ?> 
<option value="<?php echo $btl['id'];?>"><?php echo $btl['isim']; ?></option>
 <?php } ?>
</select>
                                                    
                                       
                                                </div>
                                            </div>
                                        
                                         <div class="form-group"   >
                                                <label class="control-label">Açıklama</label>
                                                <div >
                                                 <textarea class="form-control"  name="aciklama"></textarea>
                                                </div>
                                            </div>
                                        
                                         <div class="form-group"   >
                                                <label class="control-label">Dökümanlar</label>
                                                   <div class="fallback">
                                                <input     type="file" name="belge[]" multiple class="form-control" placeholder="Lütfen Bir Dosya Seçin" />
                                                </div>
                                            </div>
                                        
                                             
                            
                     <div class="modal-footer">
                <button type="button" class="btn btn-danger" onclick="kapat()" data-dismiss="modal" >Vazgeç</button>
                <button type="reset" class="btn btn-default">Temizle</button>
                        
       
 <input type="hidden" name="formgenelkayit" value="1">  <button type="sumbit" class="btn btn-primary">Ekle</button>
                         
                       
                                    
              </div>
                        
           
               
				  </form>
          
                   </div>     
                  </div>
              </div>
    
             <?php 
  $sorgusonuc= "select db.id,dbt.isim,aciklama,kl.adi_soyadi,db.kayit_tarihi,db.kayit_id  
FROM icerik_belge	db 
left outer join   belge_turleri  dbt on db.belge_turu=dbt.id
left outer join kullanicilar kl on db.kayit_yapan_kullanici=kl.id
where   kayit_id='".$_GET['bilgigonder']."' and db.durum!='-1'";
 $sorgusonucb = sorgu($sorgusonuc, $baglan); 
 $sorgusonucb->execute();       ?>


                            <div class="col-md-12">
        <div class="table-responsive">
                              <table class="table table-bordered table-warning mb30">
                                <thead>
                                  <tr style="font-size: 12px">
                                    <th width="5%">İşlemler</th>
                                    <th>Belge Türü</th>
                                    <th>Açıklama</th>
                                    <th>Kayıt Yapan</th>
                                    <th>Kayıt Tarihi</th> 
                                   
                                  </tr>
                                </thead> 
                                <tbody  style="font-size: 11px">
                                    <?php while ($sorgusonucl =veriliste($sorgusonucb)) {   ?>
                                  <tr>
                                    <td align="center"> 
                                        <a href="javascript:NewWindow=window.open('icerik_belge_goster.php?bilgigonder=<?php echo $sorgusonucl['kayit_id'];?>&belgegonder=<?php echo $sorgusonucl['id'];?> ','newWin','width=660,height=660,toolbar=Yes,location=false,scrollbars=Yes,status=No,re sizable=No,fullscreen=No'); NewWindow.focus();void(0);"  title="Dökümanı Gör"><i style="font-size: 15px" class="fa fa-inbox"></i></a> 
                                        &nbsp;&nbsp;&nbsp;
              <a onClick="return confirm('Bu Kaydı Silmek İstediğinizden Eminmisiniz?');" href="icerik_belge_ekle.php?sil=<?php echo $sorgusonucl['id']; ?>&bilgigonder=<?php echo $_GET['bilgigonder']; ?>" title="Kaydı Sil"><i style="font-size: 15px" class="fa fa-trash-o"></i></a></td>
                                    <td><?php echo $sorgusonucl['isim']; ?></td>
                                    <td><?php echo $sorgusonucl['aciklama']; ?></td>
                                    <td><?php echo $sorgusonucl['adi_soyadi']; ?></td>
                                    <td><?php echo date('d.m.Y', strtotime($sorgusonucl['kayit_tarihi'])); ?></td>
                                  </tr>
                                 <?php } ?>
                                   
                                </tbody>
                              </table>
                              </div>
                                </div>
                                 
   <script>
            jQuery(document).ready(function(){
                
                // Delete row in a table
                jQuery('.delete-row').click(function(){
                    var c = confirm("Continue delete?");
                    if(c)
                        jQuery(this).closest('tr').fadeOut(function(){
                        jQuery(this).remove();
                    });
                    return false;
                });
                
                // Show aciton upon row hover
                jQuery('.table tbody tr').hover(function(){
                    jQuery(this).find('.table-action-hide a').animate({opacity: 1},100);
                },function(){
                    jQuery(this).find('.table-action-hide a').animate({opacity: 0},100);
                });
    
            });
        </script>
<script>
           
 
    function kapat()

{

window.close()

}
        </script>
   <?php $baglan = null;   ?>
</body>
 