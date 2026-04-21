<?php include("ust.php"); 

 sayfayetkikontrol(22);  

?>
<link href="css/style.datatables.css" rel="stylesheet">
        <link href="css/dataTables.responsive.css" rel="stylesheet">
<link href="css/select2.css" rel="stylesheet" />
                
                <div class="mainpanel">
                    <div class="pageheader">
                        <div class="media">
                            <div class="pageicon pull-left">
                                <i class="fa fa-th-list"></i>
                            </div>
                            <div class="media-body">
                                <ul class="breadcrumb">
                                    <li><a href=""><i class="glyphicon glyphicon-home"></i></a></li>
                                    <li><a href="index.php">Ana Sayfa</a></li>
                                    <li>Kullanıcı Rapor</li>
                                </ul>
                                <h4>Kullanıcı Rapor</h4>
                            </div>
                        </div><!-- media -->
                    </div><!-- pageheader -->
                    
                    <div class="contentpanel">
                        
     <?php
                    
                                        
  if($_GET['sil']) {    
      
    
$silnecekkullanici=addslashes($_GET['sil']);
$silenkullanici=addslashes($_SESSION['kullaniciid']);
$tokenkontrol=preg_match("/6e5y7a1l6c3i2n3/", $_SESSION['jetonal']);
$bugununtarihi=date('Y.m.d H:i:s');      
$durum='-1';       
 
 $kullanicsilme ='UPDATE kullanicilar SET 
 
 durumu= :durumual, 
 silen_kullanici= :silenkullanici,
 silme_tarihi= :silmetarihi 
 
 WHERE id= :idal';
    
$kullaniciverilerl= guncel($kullanicsilme, $baglan);    
$kullaniciverilerl->bindParam(':durumual',$durum);
$kullaniciverilerl->bindParam(':silenkullanici',$silenkullanici);
$kullaniciverilerl->bindParam(':silmetarihi',$bugununtarihi);   
$kullaniciverilerl->bindParam(':idal',$silnecekkullanici);      
$kullaniciverilerl->execute();
 
 if ($kullaniciverilerl === false) {
    echo "<script type='text/javascript'>  
	alert('Kullanici Silinemedi'); 
    location.href= 'kullanici_rapor.php'; 
</script> ";                                           
 } else {
  echo "<script type='text/javascript'>  
	  alert('Kullanıcı Silindi');
       location.href= 'kullanici_rapor.php';
</script>"; 
  
      
 } 
  }                
      
                        
                        
                        
                        
                        
                        
 if(($_GET['pasif']) or ($_GET['aktif'])) {    
     
   $pasif=addslashes($_GET["pasif"]);  
   $aktif=addslashes($_GET["aktif"]);  
     $guncelleyenkullanici=addslashes($_SESSION['kullaniciid']);
     $tokenkontrol=preg_match("/6e5y7a1l6c3i2n3/", $_SESSION['jetonal']);
     $bugununtarihi=date('Y.m.d H:i:s');   
        
     
 
    if ($pasif!='') { 
        
   $durum='3';     
        
 $kullanicpasif ='UPDATE kullanicilar SET 
 
 durumu= :durumual, 
 guncelleme_yapan_kullanici= :guncelleyenkullanici,
 guncelleme_tarihi= :guncelleyentarihi 
 
 WHERE id= :idal';
$kullaniciverilerl= guncel($kullanicpasif, $baglan);    
      
   $pasifsonucu = $kullaniciverilerl->execute(array(
 "durumual" => $durum,
 "guncelleyenkullanici" => $guncelleyenkullanici,
 "guncelleyentarihi" => $bugununtarihi,
 "idal" => $pasif));    
      
 if ($pasifsonucu === false) {
    echo "<script type='text/javascript'>  
	alert('Hata! Kullanıcı Pasif Edilemedi'); 
    location.href= 'kullanici_rapor.php'; 
</script> ";                                           
 } else {
  echo "<script type='text/javascript'>  
	  alert('Kullanıcı Pasif Edildi');
       location.href= 'kullanici_rapor.php';
</script>";      
 }  
        
        
  }
     if ($aktif!='') { 
       $durum='1';  
       $kullanicaktif ='UPDATE kullanicilar SET 
 
 durumu= :durumual, 
 guncelleme_yapan_kullanici= :guncelleyenkullanici,
 guncelleme_tarihi= :guncelleyentarihi 
 
 WHERE id= :idal';
$kullaniciverilerl= guncel($kullanicaktif, $baglan);    
      
 $aktifsonucu = $kullaniciverilerl->execute(array(
 "durumual" => $durum,
 "guncelleyenkullanici" => $guncelleyenkullanici,
 "guncelleyentarihi" => $bugununtarihi,
 "idal" => $aktif));    
      
 if ($aktifsonucu === false) {
    echo "<script type='text/javascript'>  
	alert('Hata! Kullanıcı Aktif Edilemedi'); 
    location.href= 'kullanici_rapor.php'; 
</script> ";                                           
 } else {
  echo "<script type='text/javascript'>  
	  alert('Kullanıcı Aktif Edildi');
       location.href= 'kullanici_rapor.php';
</script>";      
 }  
      
         
         
         
     }
          
 
  }                           
                        ?>                   
                           
                  
                                <div class="btn-toolbar">
                                     
                                    <div class="btn-group">
                                        <button class="btn btn-default btn-sm "  type="button"> <a   href="javascript:PencereOrtala('kullanici_ekle.php',400,600)" title="Yeni Kayıt"><i class="fa fa-plus"></i> Kullanıcı Ekle</a></button>
                                       
                                    </div>
                                    
                                    
                                 
                                     </div>       
       
                                   <?php echo $silmeuyari;?>
                         
                        <div class="panel panel-dark-head">
                            <div class="panel-heading">
                                <div class="pull-right">
                                    <div class="btn-group">
                                        <button data-toggle="dropdown" class="btn btn-sm mt5 btn-white noborder dropdown-toggle" type="button">
                                            Göster/Gizle <span class="caret"></span>
                                        </button>
                                        <ul role="menu" id="shCol" class="dropdown-menu dropdown-menu-sm pull-right">
                                            <li>
                                                <div class="ckbox ckbox-primary">
                                                    <input type="checkbox" checked="checked" id="islemler" value="0">
                                                    <label for="islemler">İşlemler</label>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="ckbox ckbox-primary">
                                                    <input type="checkbox" checked="checked" id="adisoyadi" value="1">
                                                    <label for="adisoyadi">Adı Soyadı</label>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="ckbox ckbox-primary">
                                                    <input type="checkbox" checked="checked" id="kullaniciadi" value="2">
                                                    <label for="kullaniciadi">Kullanıcı Adı</label>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="ckbox ckbox-primary">
                                                    <input type="checkbox" checked="checked" id="mail" value="3">
                                                    <label for="mail">Mail</label>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="ckbox ckbox-primary">
                                                    <input type="checkbox" checked="checked" id="durum" value="4">
                                                    <label for="durum">Durum</label>
                                                </div>
                                            </li>
                                            
                                        </ul>
                                    </div>
                                </div>
                                <h4 class="panel-title">Göster / Gizle</h4>
                                <p>Sütun Kriterlerini Bu Alandan Seçebilirsiniz.</p>
                            </div><!-- panel-heading -->
                            
                            
                           
                            
                            <table id="shTable" class="table table-striped table-bordered">
                                <thead class="">
                                    
                                    
                                    
                                        
                                    <tr>
                                        <th style="width: 7%">İşlemler</th>
                                        <th>Adı Soyadı</th>
                                        <th>Kullanıcı Adı</th>
                                        <th>Mail</th>
                                        <th>Durum</th>
                                      
                                    </tr>
                                </thead>
                         
                              <tbody>  
                                  
   <?php
             $kullanicilar = "SELECT  kl.id
      ,sicil_no
      ,adi_soyadi
       
      ,birimi
      ,maili
      ,kullanici_adi
      
  
      ,durumu
      ,yonetici_durum
    
      ,kayit_yapan_kullanici
      ,kayit_tarihi
 
      ,isim
FROM kullanicilar kl inner join durum_kodlari dk  on kl.durumu=dk.id

order by kl.id desc"; 
  
 $kullanicilarb = sorgu($kullanicilar, $baglan); 
 $kullanicilarb->execute();                                 
                                  
 
  ?>                               
                                  
                                  
                            <?php foreach($kullanicilarb as  $kullaniciilkveri) { 
 
             ?>
								<tr  >
                                 
									
  
                                    
                                    <td><div class="btn-group">
                                         
                                        <button type="button" class="btn btn-xs btn-primary dropdown-toggle" data-toggle="dropdown">İşlem
                                          <span class="caret"></span>
                                       
                                        </button>
                                        <ul class="dropdown-menu pull-right" role="menu">
                                            
                         <li><a href="javascript:PencereOrtala('kullanici_yetki_alver.php?kullanicigetir=<?php echo $kullaniciilkveri['id'];?> ',800,650);" >Yetki Al/Ver</a></li>
                                            
                                            
                         <li><a href="javascript:PencereOrtala('kullanici_guncelle.php?kullanicigetir=<?php echo $kullaniciilkveri['id'];?> ',400,600)" >Kullanıcı Güncelle</a>
                             
                              
 
                         
                         <?php if ($kullaniciilkveri['durumu']=='1') {?>                   
                         <li><a onClick="return confirm('Kullanıcıyı Pasife Almak Üzeresiniz. İşlemi Onaylıyormusunuz?');" href="kullanici_rapor.php?pasif=<?php echo $kullaniciilkveri['id'];?>">Kullanıcı Pasife Al</a></li>  <?php } ?>
                           <?php if ($kullaniciilkveri['durumu']=='3') {?>                   
                         <li><a onClick="return confirm('Kullanıcıyı Aktife Almak Üzeresiniz. İşlemi Onaylıyormusunuz?');" href="kullanici_rapor.php?aktif=<?php echo $kullaniciilkveri['id'];?>">Kullanıcı Aktife Al</a></li>  <?php } ?>                 
                                            
                                            
                         <li><a onClick="return confirm('Bu Kaydı Silmek İstediğinizden Eminmisiniz?');" href="kullanici_rapor.php?sil=<?php echo $kullaniciilkveri['id'];?>">Kullanıcı Sil</a></li>                 
                                         
                                        </ul>
                                      </div>
                                    
                                    </td>
                                    <td><?php echo $kullaniciilkveri['adi_soyadi']; ?></td> 
									<td><?php echo $kullaniciilkveri['kullanici_adi']; ?></td>
                                    <td><?php echo $kullaniciilkveri['maili']; ?></td> 
                                    <td><?php echo $kullaniciilkveri['isim']; ?></td> 
                     
                                   
									 
								</tr>	
 
                                  
                                  
         
                                  
                                  
<?php  
                                  
}     ?>
							 </tbody>
                                
                                
                                
                                    
                            </table>
                        </div><!-- panel -->
                        
                        
                        
                    </div><!-- contentpanel -->
                </div><!-- mainpanel -->
            </div><!-- mainwrapper -->

        </section>
        
            

  <script language="JavaScript">
function yenisayfaac(url,width,height)
{
window.open(url,'', 'toolbar=0,scrollbars=2,location=0,statusbar=1,menubar=0,resizable=0,width='+width+',height='+height+',left = 200,top = 100');
}
</script>

        
   <?php  include("alt2.php");?>
        
      
    