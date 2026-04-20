<?php
header('Content-Type: text/html; charset=utf-8');
mb_internal_encoding('UTF-8');
include("ust.php"); 
 

if ((isset($_GET['sil'])) && ($_GET['sil'] != "")) {
   $silmesorgusu = sprintf("update fatura_bilgi set durum='-1' WHERE id=%s",
                       GetSQLValueString($_GET['sil'], "int"));

  mysql_select_db($veritabani, $baglan);
  $silmesorgusubaglantisi = @mysql_query($silmesorgusu, $baglan) or die(mysql_error()); 
    
    
      $dogrula ="SELECT * FROM fatura_detay WHERE fatura_bilgi_id='".$_GET['sil']."' ";
$dogrulab = mysql_query($dogrula, $baglan) or die(mysql_error());
$dogrulal = mysql_fetch_assoc($dogrulab);  
    
    
       $dsilmesorgusu = sprintf("update fatura_detay set durum='-1' WHERE fatura_bilgi_id=%s",
                       GetSQLValueString($_GET['sil'], "int"));

  
  $dsilmesorgusubaglantisi = @mysql_query($dsilmesorgusu, $baglan) or die(mysql_error()); 
    
if( $dogrulal!='') 

{
  $stokdogrula ="SELECT id,miktar FROM stok_kart WHERE  id='".$dogrulal['stok_id']."'";
$stokdogrulab = mysql_query($stokdogrula, $baglan) or die(mysql_error());
$stokdogrulal = mysql_fetch_assoc($stokdogrulab);  
    
 $miktarguncelle=$stokdogrulal['miktar']-$dogrulal['miktar']; 
    

  $miktarg="update stok_kart set miktar='".$miktarguncelle."' WHERE id='".$stokdogrulal['id']."'";
  $miktargb = mysql_query($miktarg, $baglan) or die(mysql_error());
}   
}

 
 

?>



                
                <div class="mainpanel">
                    <div class="pageheader">
                        <div class="media">
                            <div class="pageicon pull-left">
                                <i class="fa fa-th-list"></i>
                            </div>
                            <div class="media-body">
                                <ul class="breadcrumb">
                                    <li><a href=""><i class="glyphicon glyphicon-home"></i></a></li>
                                    <li><a href="">CARİ RAPOR</a></li>
                                    <li>Cari Rapor</li>
                                </ul>
                                <h4>Cari Rapor</h4>
                            </div>
                        </div><!-- media -->
                    </div><!-- pageheader -->
                    
                    <div class="contentpanel">
                        
                        
                        
                        
                     
                           <?  $talis = "SELECT SUM(mal_hizmet_tutari) as mal_hizmet_tutari   FROM fatura_bilgi  inner join fatura_detay on fatura_bilgi.id=fatura_detay.fatura_bilgi_id
where    fatura_bilgi.durum!='-1'  and  fatura_detay.durum!='-1' and fatura_turu=2    ";
$talisb = @mysql_query($talis, $baglan) or die(@mysql_error());
$talisl = @mysql_fetch_assoc($talisb);?>   
                             
   <?  $tsatis = "SELECT SUM(mal_hizmet_tutari) as mal_hizmet_tutari   FROM fatura_bilgi  inner join fatura_detay on fatura_bilgi.id=fatura_detay.fatura_bilgi_id
where    fatura_bilgi.durum!='-1'  and  fatura_detay.durum!='-1' and fatura_turu=1  ";
$tsatisb = @mysql_query($tsatis, $baglan) or die(@mysql_error());
$tsatisl = @mysql_fetch_assoc($tsatisb);?>
                          
                            <div class="row">
                                
                                
                                
                      
                                
                      <div class="col-md-4">
                                <div class="panel panel-success-alt">
                                    <div class="panel-heading noborder">
                                        <div class="panel-btns">
                                            <a href="" class="panel-close tooltips" data-toggle="tooltip" title="Paneli Kapat"><i class="fa fa-times"></i></a>
                                        </div>
                                        <div class="panel-icon"><i class="fa fa-plus"></i></div>
                                        <div class="media-body">
                                          
                                        
                                        
                                            <h5 class="md-title nomargin">TOPLAM ALIŞ</h5>
                                            <h1 class="mt5"> 
 
                                           
                                                
<? echo number_format($talisl['mal_hizmet_tutari'], 2, ',', '.'); ?> TL
</h1>
                                        </div> 
                                        <hr>
                                       
                                        
                                    </div> 
                                </div> 
                            </div> 
                          
                          
                          
                           <div class="col-md-4">
                                <div class="panel panel-warning-alt">
                                    <div class="panel-heading noborder">
                                        <div class="panel-btns">
                                            <a href="" class="panel-close tooltips" data-toggle="tooltip" title="Paneli Kapat"><i class="fa fa-times"></i></a>
                                        </div>
                                        <div class="panel-icon"><i class="fa fa-minus"></i></div>
                                        <div class="media-body">
                                     
                                            <h5 class="md-title nomargin">TOPLAM SATIŞ:</h5>
                                            <h1 class="mt5">
  

<? echo number_format($tsatisl['mal_hizmet_tutari'], 2, ',', '.'); ?> TL </h1>
                                        </div> 
                                        <hr>
                                     
                                        
                                    </div> 
                                </div> 
                            </div> 
                          
                            <div class="col-md-4">
                                <div class="panel panel-danger-head">
                                    <div class="panel-heading noborder">
                                        <div class="panel-btns">
                                            <a href="" class="panel-close tooltips" data-toggle="tooltip" data-placement="left" title="Paneli Kapat"><i class="fa fa-times"></i></a>
                                        </div>
                                        <div class="panel-icon"><i class="fa fa-pencil"></i></div>
                                        <div class="media-body">
                                        
                                       
                                            <h5 class="md-title nomargin">TOPLAM BAKİYE:</h5>
                                            <h1 class="mt5">
  <? echo number_format($tsatisl['mal_hizmet_tutari']-$talisl['mal_hizmet_tutari'], 2, ',', '.'); ?> TL
                                        </div>
                                        <hr>
                                       
                                    </div>
                                </div>
                            </div>
                          
                          
                           </div>    
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                      <div class="panel-primary-head">
                          
                          
                         
                          
              <?
			  
			  $sayfaicerik="&kayitsayi=".$kackayit."&kayitno=".$_GET['kayitno']."&aciklama=".$_GET['aciklama']."&aramadurum=".$_GET['aramadurum']."";

          

		  
		  ?>
                            
                            <table  class="table table-striped table-bordered" >
                         <thead  >   <tr><form name="form" action="<?php echo $editFormAction; ?>" method="GET"  enctype="multipart/form-data" class="form">	 
							 <th>    <select name="cari"  id="select-basic"  class="form-control tooltips"  >
<? 
$kgsorgu= "SELECT * FROM  cari_kart    order by isim";
$kbaglanti = @mysql_query($kgsorgu, $baglan) or die(@mysql_error());
$klistele = @mysql_fetch_assoc($kbaglanti);
$ksatirsayisi = @mysql_num_rows($kbaglanti);
 ?>
    
 
<option value="" >Seçiniz</option>
<?php if ($ksatirsayisi > 0) { do { ?>
<option value="<?php echo $klistele['id']; ?>" ><?php echo $klistele['isim']; ?> - <?php echo $klistele['tel1']; ?> - <?php echo $klistele['tel2']; ?> - <?php echo $klistele['vergi_dairesi']; ?> - <?php echo $klistele['vergi_numarasi']; ?></option>
<?php } while ($klistele = mysql_fetch_assoc($kbaglanti)); ?>   <?php } ?>
</select>  
                                  
      
                                  </th>	
                               
                                 
                             
                             
							 <th colspan="2"> </th>
                           <th> <input   type="submit"  class="btn btn-primary   " value="GETİR" /></th>
                                   </form>
								</tr>
                                
                                                                 </thead>
                                
                  <thead  > 
                                    <tr height="40"  class="table table-success mb30">
                                    <th style="font-size:11px">CARİ</th>
                                   <th style="font-size:11px">ALIŞ</th>
                                  
                                   <th style="font-size:11px">SATIŞ</th>
 								   <th style="font-size:11px">BAKİYE</th>
                                  
                                 </tr>
                         </thead>
                         
                
  
<?PHP


  
if ($_GET['cari']!='') { $sonuc.=" and id='".$_GET['cari']."'";}

$kackayit = 20; // sayfalda gösterilecek içerik miktarını belirtiyoruz.

$sorgu11 = "SELECT count(id) id FROM cari_kart  where  id!='' ".$sonuc." and durum!='-1'";
$baglanti11 = @mysql_query($sorgu11, $baglan) or die(@mysql_error());
$satir11 = @mysql_fetch_assoc($baglanti11);
$sayi11 =@mysql_num_rows($baglanti11);
$toplam_icerik = $satir11['id'];



 
@$sayfalsayisi = @ceil($toplam_icerik / $kackayit);
 
$sayfal = isset($_GET['sayfal']) ? (int) $_GET['sayfal'] : 1;
 
if($sayfal < 1) {$sayfal = 1; }
if($sayfal > $sayfalsayisi) {$sayfal = $sayfalsayisi; }
 
$limit = ($sayfal - 1) * $kackayit;
$kacartsin=$limit+$kackayit;


$sayfalicerik="&kayitsayi=".$kackayit."&icerik=".$_GET['icerik']."&id=".$_GET['id']."&baslik=".$_GET['baslik']."&kategori=".$_GET['kategori']."";


@mysql_select_db($veritabani, $baglan);
    $sorgu = "SELECT   *   FROM   cari_kart  
where      durum!='-1'  ".$sonuc."    LIMIT ".$limit.", ". $kacartsin."";
$baglanti = @mysql_query($sorgu, $baglan) or die(@mysql_error());
$listele = @mysql_fetch_assoc($baglanti);
 

?>	

   <tbody>

                             <?php if ($listele > 0) {  ?>
                          <?php do {?><tbody>
								<tr  >
                                 
									<td><?php echo $listele['isim']; ?></td> 
        
      <?  $alis = "SELECT SUM(mal_hizmet_tutari) as mal_hizmet_tutari   FROM fatura_bilgi  inner join fatura_detay on fatura_bilgi.id=fatura_detay.fatura_bilgi_id
where    fatura_bilgi.durum!='-1'  and  fatura_detay.durum!='-1' and fatura_turu=2 and fatura_bilgi.cari_id='".$listele['id']."'  ";
$alisb = @mysql_query($alis, $baglan) or die(@mysql_error());
$alisl = @mysql_fetch_assoc($alisb);?>                            
                                    
									<td><? echo number_format($alisl['mal_hizmet_tutari'], 2, ',', '.'); ?> TL</td>
                                    
      <?  $satis = "SELECT SUM(mal_hizmet_tutari) as mal_hizmet_tutari   FROM fatura_bilgi  inner join fatura_detay on fatura_bilgi.id=fatura_detay.fatura_bilgi_id
where    fatura_bilgi.durum!='-1'  and  fatura_detay.durum!='-1' and fatura_turu=1 and fatura_bilgi.cari_id='".$listele['id']."'  ";
$satisb = @mysql_query($satis, $baglan) or die(@mysql_error());
$satisl = @mysql_fetch_assoc($satisb);?>                                     
                                    
                                    <td><? echo number_format($satisl['mal_hizmet_tutari'], 2, ',', '.'); ?> TL</td>
                                    <td><? echo number_format($satisl['mal_hizmet_tutari']-$alisl['mal_hizmet_tutari'], 2, ',', '.'); ?> TL</td>
                                    
                                    
                            
                                    
									
									 
                                   
									 
								</tr>	</tbody>
							  <?php } while ($listele = mysql_fetch_assoc($baglanti)); ?>
                        <?php } ?>	
								
  
   
   
   
   
   
   
   
   
       <tr  >
         				

 <td colspan="7"  align="center">    

                                        
<? $geri=$sayfal-1?> 

<? if ($sayfal>1) {?><a href="?sayfal=<? echo $sayfalsayisi-$sayfalsayisi+1 ?><? echo $sayfalicerik; ?>"  title="İlk sayfal"><button type="button" class="btn btn-primary btn-xs ">İlk</button></a> 
<a href="?sayfal=<? echo $geri ?><? echo $sayfalicerik; ?>"  title="Geri"><button type="button" class="btn btn-primary btn-xs ">Geri</button></a>
<? } ?>

<?

for ($i = 1; $i <= $sayfalsayisi; ++$i)

if ($i == $sayfal)
{
?>
   
<a href="?sayfal=<? echo $i ?><? echo $sayfalicerik; ?>" class="number <? if ($sayfal==$i) {echo "current";}?>"  title="<? echo $i?>"><? echo $i?></a>

<a href="?sayfal=<? echo $i ?><? echo $sayfalicerik; ?>" class="<? if ($sayfal==$i) {echo "current";}?>"   title="<? echo $i?>">Sayfa No: <? echo $i?></a>


<a href="?sayfal=<? echo $sayfalsayisi ?><? echo $sayfalicerik; ?>" class="<? if ($sayfal==$i) {echo "current";}?>"   title="Son">Toplam Sayfa:  <? echo $sayfalsayisi;?></a>  
 

   
										
<? } ?>
                               
                     <? $ileri=$sayfal+1?>  
					 <? if ($ileri <= $sayfalsayisi) {?> 
                                            
                  <a href="?sayfal=<? echo $ileri ?><? echo $sayfalicerik; ?>"   title="İleri"><button type="button" class="btn btn-primary btn-xs ">İleri</button></a> 
                  <a href="?sayfal=<? echo $sayfalsayisi ?><? echo $sayfalicerik; ?>"   title="Son"><button type="button" class="btn btn-primary btn-xs ">Son</button></a>
                  <? } ?>
               
 
 
 
 
 
 
                                </th>
                              </tr>                     
</table>

                        
<div class="panel panel-dark-head">
                            <div class="panel-heading">
                                <div class="pull-right">
                                    <div class="btn-group">
                                       <input   type="submit"  class="btn btn-primary   " value="GETİR" />
                                        
                                    </div>
                                </div>
                         <h4 class="panel-title">CARİ HESAPLAR</h4>
                                <p><select name="cari"  id="select-basic"  class="form-control tooltips"  >
<? 
$kgsorgu= "SELECT * FROM  cari_kart    order by isim";
$kbaglanti = @mysql_query($kgsorgu, $baglan) or die(@mysql_error());
$klistele = @mysql_fetch_assoc($kbaglanti);
$ksatirsayisi = @mysql_num_rows($kbaglanti);
 ?>
    
 
<option value="" >Seçiniz</option>
<?php if ($ksatirsayisi > 0) { do { ?>
<option value="<?php echo $klistele['id']; ?>" ><?php echo $klistele['isim']; ?> - <?php echo $klistele['tel1']; ?> - <?php echo $klistele['tel2']; ?> - <?php echo $klistele['vergi_dairesi']; ?> - <?php echo $klistele['vergi_numarasi']; ?></option>
<?php } while ($klistele = mysql_fetch_assoc($kbaglanti)); ?>   <?php } ?>
</select>  </p>
                            </div><!-- panel-heading -->
                            
                            <table id="shTable" class="table table-striped table-bordered">
                                <thead class="">
                                    <tr>
                                      
                                         <th style="font-size:11px">CARİ</th>
                                   <th style="font-size:11px">ALIŞ</th>
                                  
                                   <th style="font-size:11px">SATIŞ</th>
 								   <th style="font-size:11px">BAKİYE</th>
                                  
                                        
                                        
                                    </tr>
                                </thead>
                         
                                <tbody>
                                    <tr>
                                        <td>Tiger Nixon</td>
                                        <td>System Architect</td>
                                        <td>Edinburgh</td>
                                        <td>61</td>
                                        <td>2011/04/25</td>
                                        <td>$320,800</td>
                                    </tr>
                                    <tr>
                                        <td>Garrett Winters</td>
                                        <td>Accountant</td>
                                        <td>Tokyo</td>
                                        <td>63</td>
                                        <td>2011/07/25</td>
                                        <td>$170,750</td>
                                    </tr>
                                   
                                </tbody>
                            </table>
                        </div><!-- panel -->
       
                     
                    </div><!-- contentpanel -->
                </div><!-- mainpanel -->
            </div><!-- mainwrapper -->

        </section>
        
        
             
        
     
        
<?  include("alt.php");?>
     
   
       
        
      
    