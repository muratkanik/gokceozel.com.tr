<?php include("ust.php"); 
sayfayetkikontrol(4);  
 


if ((isset($_GET['sil'])) && ($_GET['sil'] != "")) {
    
$silmesorgusu ='UPDATE icerik SET durum= :durumal  WHERE eskayit= :idal';
$silbaglanti= guncel($silmesorgusu, $baglan);    
$sonsonucu =$silbaglanti->execute(array("durumal" => '-1',"idal" => $_GET['sil']));  
if (!$sonsonucu) {echo "<script type='text/javascript'>alert('Hata! Kayıt Silinemedi); location.href= 'icerik_rapor.php';</script> ";}   
 if ($sonsonucu) {echo "<script type='text/javascript'>alert('Kayıt Silindi');   location.href= 'icerik_rapor.php';</script> ";} 
} 

 
?>

   <link href="css/style.datatables.css" rel="stylesheet">
        <link href="css/dataTables.responsive.css" rel="stylesheet">
<link href="css/select2.css" rel="stylesheet" />
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
                    
                    
                    <div class="contentpanel">
 
                     <div class="btn-toolbar">
                                     
                                    <div class="btn-group">
                                        
                   <button class="btn btn-default btn-sm" onclick="location.href='icerik_ekle.php';"    type="submit"><i class="fa fa-plus"></i> Yeni Kayıt</button> 
                         </div> 
                                        
                                          
                                    
         
                                    
                                </div>     
                             
                        
                        
    
<?php

 
 
$sorgu = "SELECT
      et.id 
      ,et.kategori
      ,et.tarih
      ,et.tr_baslik
      ,et.tr_icerik
      ,et.tr_detay
      ,et.en_baslik
      ,et.en_icerik
      ,et.en_detay
      ,et.eskayit
      ,et.kayit_yapan_kullanici
      ,et.kayit_tarihi
      ,et.durum
      ,eu.tr_isim
      ,eu.anakategori
      ,dk.isim
      ,(select eb.id from icerik_belge eb where et.eskayit=eb.kayit_id AND  eb.durum!='-1' ORDER BY eb.id DESC LIMIT 0,1) belge
FROM icerik et
left outer join genel_kategori eu on et.kategori=eu.id
left outer join durum_kodlari dk on et.durum=dk.durum_id   
where et.durum!='-1' order by et.id desc";
$baglanti = sorgu($sorgu, $baglan);
$baglanti->execute();     

 

?>	
                            
                                
                         
                        <div class="panel panel-dark-head">
                            <div class="panel-heading">
                                
                                  
                                <h4 class="panel-title">İÇERİK RAPOR</h4>
                                <p>İçerik Yönetimi</p>
                            </div><!-- panel-heading -->
                            
                       
                            
                            <table id="shTable" class="table table-striped table-bordered">
                                <thead class="">
                                    
                                    
                                    
                                        
                                    <tr>
                                        <th style="width: 7%">İşlemler</th>
                                        <th>Kayıt No</th>
                                        <th>Kategori</th>
                                        <th>İsim</th>
                                        <th>Durum</th>
                                    </tr>
                                </thead>
                         
                              <tbody>  <?php while ($listele =veriliste($baglanti)) {  
    $gatk= "SELECT * FROM  genel_kategori  where durum='1' and  id=".$listele['anakategori']."";
$gatkb= sorgu($gatk, $baglan);
$gatkb->execute();    
$gatkl =veriliste($gatkb)?>
                      
								<tr  >
                                 
									
                
                                    
                                    <td><div class="btn-group">
                                         
                                        <button type="button" class="btn btn-xs btn-primary dropdown-toggle" data-toggle="dropdown">İşlem
                                          <span class="caret"></span>
                                       
                                        </button>
                                        <ul class="dropdown-menu pull-right" role="menu">
             
                                   
                         <li><a href="icerik_ekle.php?bilgikayitonay=<?php echo $listele['eskayit'];?>" title="Düzenle"><i class="fa fa-pencil"></i> Güncelle</a></li> 
                         <li><a href="javascript:PencereOrtala('icerik_belge_ekle.php?bilgigonder=<?php echo $listele['eskayit'];?> ',650,650);" title="Belge Ekle"><i class="fa fa-inbox"></i> Döküman Ekle</a></li>
                           <?php if($listele['belge']!='') { ?>                         
                         <li><a href="javascript:PencereOrtala('icerik_belge_goster.php?bilgigonder=<?php echo $listele['eskayit'];?> ',860,660);"><i class="fa fa-file-photo-o"></i> Döküman İncele</a></li>  <?php }?>  
                             
                                            
                         <li><a  onClick="return confirm('Bu Kaydı Silmek İstediğinizden Eminmisiniz?');" href="icerik_rapor.php?sil=<?php echo $listele['eskayit']; ?>" title="Kaldır"><i class="fa fa-trash-o"></i> Sil</a> </li>                    
                                            
                                        </ul>
                                      </div>
                                    
                                    </td>
                                    <td><?php echo $listele['id']; ?></td> 
									<td><?php if ($gatkl['id']!='') { echo $gatkl['tr_isim']." > ";}?> <?php echo $listele['tr_isim']; ?></td> 
                                    <td><?php echo $listele['tr_baslik']; ?></td> 
                                    <td><?php echo $listele['isim']; ?></td>
                                 
								</tr>	
							   
                        <?php } ?>	</tbody>
                                
                                
                                
                                    
                            </table>
                        </div><!-- panel -->
                        
                        
                        
                    </div><!-- contentpanel -->
                </div><!-- mainpanel -->
            </div><!-- mainwrapper -->

 

        </section>
        
  
 <script>
    
     $(document).ready(function() {        
 $('#belgeekle').on('show.bs.modal', function(e) {
    var sigortaid = $(e.relatedTarget).data('book-id'); 
    var plakaid = $(e.relatedTarget).data('prod-id');
    $(e.currentTarget).find('input[name="dokumid"]').val(sigortaid);
    $(e.currentTarget).find('#dokumanid').html(plakaid);
  
});   
         
      
        
     });
</script>    
    <script>
     if ( window.history.replaceState ) {
        window.history.replaceState( null, null, window.location.href );
    }
</script> 
 <?php include("alt2.php");?>