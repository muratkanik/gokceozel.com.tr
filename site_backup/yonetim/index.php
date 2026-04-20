<?php include("ust.php"); 
 
?>
                
                <div class="mainpanel">
                     <div class="pageheader">
                        <div class="media">
                            <div class="pageicon pull-left">
                                <i class="fa fa-home"></i>
                            </div>
                            <div class="media-body">
                                <ul class="breadcrumb">
                                    <li><a href=""><i class="glyphicon glyphicon-home"></i></a></li>
                                    <li>Ana Sayfa</li>
                                </ul>
                                <h4>Yönetim Paneli</h4>
                            </div>
                        </div><!-- media -->
                    </div><!-- pageheader -->
                    <div class="contentpanel">
                        
                        <div class="row row-stat">
                         
                         
                  <?php

 
 
$is = "SELECT count(id) iceriksayi
,(select count(id) from genel_kategori where durum!='-1') kategorisayi
,(select count(id) from icerik_belge where durum!='-1') belgesayi 
,(select count(id) from kullanicilar where durum!='-1') kullanicisayi 
from icerik where durum!='-1'";
$isb = sorgu($is, $baglan);
$isb->execute();     
$isl =veriliste($isb)
 

?>	          
                            
                          
                          <div class="col-md-3">
                                <div class="panel panel-primary noborder">
                                    <div class="panel-heading noborder" >
                                        <div class="panel-btns">
                                            <a href="" class="panel-close tooltips" data-toggle="tooltip" data-placement="left" title="Paneli Kapat"><i class="fa fa-times"></i></a>
                                        </div><!-- panel-btns -->  <h5 class="mt5" style="color: #E6D8D8">Kategori Sayısı</h5> <hr>
                                        
                                       
                                        
                                        <div class="media-body">
                                        <div class="clearfix mt20">
                                            <div class="pull-left">
                                                 <div class="panel-icon"><i class="fa fa-sitemap" style="font-size: 30px;"></i>  </div>
                                            </div>
                                            <div class="pull-right">
                                             
                                                <h1 class="nomargin"><?php echo $isl['kategorisayi'];?></h1>
                                            </div>
                                        </div>
                                            
                                         
                                          
                                        </div><!-- media-body -->
                                            
                                        <hr >
                                       <a href="icerik_ekle.php"    style="color: #C4B3B4">  Daha Fazla </a>
                                    </div><!-- panel-body -->
                                </div><!-- panel -->
                            </div> 
                               
                             
                            
                       <div class="col-md-3">
                                <div class="panel panel-primary noborder">
                                    <div class="panel-heading noborder" >
                                        <div class="panel-btns">
                                            <a href="" class="panel-close tooltips" data-toggle="tooltip" data-placement="left" title="Paneli Kapat"><i class="fa fa-times"></i></a>
                                        </div><!-- panel-btns -->  <h5 class="mt5"   style="color: #E6D8D8">İçerik Sayısı</h5> <hr>
                                        
                                       
                                        
                                        <div class="media-body">
                                        <div class="clearfix mt20">
                                            <div class="pull-left">
                                                 <div class="panel-icon"><i class="fa  fa-file-text" style="font-size: 30px"></i>  </div>
                                            </div>
                                            <div class="pull-right">
                                             
                                                <h1 class="nomargin"><?php echo $isl['iceriksayi'];?></h1>
                                            </div>
                                        </div>
                                            
                                         
                                          
                                        </div><!-- media-body -->
                                            
                                        <hr >
                                       <a href="icerik_rapor.php"    style="color: #C4B3B4">  Daha Fazla </a>
                                    </div><!-- panel-body -->
                                </div><!-- panel -->
                            </div> 
                        
                             
                  
                           <div class="col-md-3">
                                <div class="panel panel-primary noborder">
                                    <div class="panel-heading noborder" >
                                        <div class="panel-btns">
                                            <a href="" class="panel-close tooltips" data-toggle="tooltip" data-placement="left" title="Paneli Kapat"><i class="fa fa-times"></i></a>
                                        </div><!-- panel-btns -->  <h5 class="mt5" style="color: #E6D8D8">Belge Sayısı</h5> <hr>
                                        
                                       
                                        
                                        <div class="media-body">
                                        <div class="clearfix mt20">
                                            <div class="pull-left">
                                                 <div class="panel-icon"><i class="fa  fa-photo" style="font-size: 30px"></i>  </div>
                                            </div>
                                            <div class="pull-right">
                                             
                                                <h1 class="nomargin"><?php echo $isl['belgesayi'];?></h1>
                                            </div>
                                        </div>
                                            
                                         
                                          
                                        </div><!-- media-body -->
                                            
                                        <hr >
                                       <a href="icerik_rapor.php"  style="color: #C4B3B4">  Daha Fazla </a>
                                    </div><!-- panel-body -->
                                </div><!-- panel -->
                            </div> 
                            
                            <div class="col-md-3">
                                <div class="panel panel-primary noborder">
                                    <div class="panel-heading noborder" >
                                        <div class="panel-btns">
                                            <a href="" class="panel-close tooltips" data-toggle="tooltip" data-placement="left" title="Paneli Kapat"><i class="fa fa-times"></i></a>
                                        </div><!-- panel-btns -->  <h5 class="mt5" style="color: #E6D8D8">Kullanıcı Sayısı</h5> <hr>
                                        
                                       
                                        
                                        <div class="media-body">
                                        <div class="clearfix mt20">
                                            <div class="pull-left">
                                                 <div class="panel-icon"><i class="fa  fa-users" style="font-size: 30px"></i>  </div>
                                            </div>
                                            <div class="pull-right">
                                             
                                                <h1 class="nomargin"><?php echo $isl['kullanicisayi'];?></h1>
                                            </div>
                                        </div>
                                            
                                         
                                          
                                        </div><!-- media-body -->
                                            
                                        <hr >
                                       <a href="kullanici_rapor.php"    style="color: #C4B3B4">  Daha Fazla </a>
                                    </div><!-- panel-body -->
                                </div><!-- panel -->
                            </div>  
                      </div><!-- row --> 
                        
                        
                      <div class="alert alert-info">
                            <button aria-hidden="true" data-dismiss="alert" class="close" type="button">&times;</button>
                            <strong>Bilgi!</strong> Lütfen bilgi güvenliğine dikkat ediniz. Soru ve sorunlarınız için <a target="_blank" href="https://eyalcin.com">eyalcin.com</a> dan bize ulaşabilirsiniz. 
                        </div>      
             
                        
                        
                        
                        
                        
                        
                  <?php
 
$sz = "SELECT count(id) toplamsayi
,(select count(id) from sayfa_ziyaretleri where DAY(tarih) = DAY(CURDATE())) bugun
,(select count(id) from sayfa_ziyaretleri where  MONTH(tarih) = MONTH(CURDATE())) buay 
,(select count(id) from sayfa_ziyaretleri where YEAR(tarih) = YEAR(CURDATE())) buyil 
from sayfa_ziyaretleri ";
$szb = sorgu($sz, $baglan);
$szb->execute();     
$szl =veriliste($szb)
 

?>	          
                                       
                        
               <div class="row">
                            <div class="col-md-8">
                                <div class="panel panel-default">
                                  <div class="panel-body">
                                    <div class="row">
                                       
                                      <div class="col-md-8">
                                        <h5 class="lg-title">Ziyaretçi Bilgileri</h5>
                                        <p class="mb15">Sitenizi Ziyaret Eden Kullanıcı Sayıları</p>
                                        
                                        <span class="sublabel">Bugün (<?php echo $szl['bugun'];?>)</span>
                                        <div class="progress progress-xs progress-metro">
                                          <div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="<?php echo $szl['toplamsayi'];?>" style="width: <?php echo $szl['bugun'];?>%"></div>
                                        </div><!-- progress -->
                                        
                                        <span class="sublabel">Bu Ay (<?php echo $szl['buay'];?>)</span>
                                        <div class="progress progress-xs progress-metro">
                                          <div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="<?php echo $szl['toplamsayi'];?>" style="width: <?php echo $szl['buay'];?>%"></div>
                                        </div><!-- progress -->
                                        
                                        <span class="sublabel">Bu Yıl (<?php echo $szl['buyil'];?>)</span>
                                        <div class="progress progress-xs progress-metro">
                                          <div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="<?php echo $szl['toplamsayi'];?>" style="width: <?php echo $szl['buyil'];?>%"></div>
                                        </div><!-- progress -->
                                        
                                        <span class="sublabel">Toplam (<?php echo $szl['toplamsayi'];?>)</span>
                                        <div class="progress progress-xs progress-metro">
                                          <div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="<?php echo $szl['toplamsayi'];?>" style="width: <?php echo $szl['toplamsayi'];?>%"></div>
                                        </div><!-- progress -->
                                      
                                        
                                        
                                      </div><!-- col-md-5 -->
                                    </div><!-- row -->
                                  </div><!-- panel-body -->
                                </div><!-- panel -->
                            </div>
                            
                            <div class="col-md-4">
                                <div class="panel panel-success-head widget-todo">
                                    <div class="panel-heading">
                                        <div class="pull-right">
                                           
                                        </div><!-- panel-btns -->
                                        <h3 class="panel-title">Son Yaptığınız İşlemler</h3>
                                    </div>
                                    <ul class="panel-body list-group nopadding">
                                    
                                    				<?php 				
													$ziyaretler="SELECT  isim,tarih
													FROM sayfa_ziyaretleri sz left outer join kategoriler kt on sz.sayfa_id=kt.id 
													where sz.kullanici_id!='' and sz.sayfa_id!=''  and sz.kullanici_id='".$_SESSION['kullaniciid']."'
													order by sz.id desc limit 5";
                                                    $ziyaretlerb = sorgu($ziyaretler, $baglan);
                                                    $ziyaretlerb->execute();     
                                                    $ziyaretlerl =veriliste($ziyaretlerb);
												 
													?>

                                    
                                    		<?php   while ($ziyaretlerl =veriliste($ziyaretlerb)) {?>
                                        	<li class="list-group-item"><label for="washcar"><?php echo $ziyaretlerl['isim'];?> - <?php echo $ziyaretlerl['tarih'];?> </label></li>
                                            <?php } ?>	
                                         	
                                    </ul>
                                </div>
                            </div><!-- col-md-4 -->
                        </div><!-- row -->         
                        
                        
                        
                        
                        
                        
                         
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
      ,dk.isim
      ,(select eb.id from icerik_belge eb where et.id=eb.kayit_id AND  eb.durum!='-1' ORDER BY eb.id DESC LIMIT 0,1) belge
FROM icerik et
left outer join genel_kategori eu on et.kategori=eu.id
left outer join durum_kodlari dk on et.durum=dk.durum_id   
where et.durum!='-1' order by et.id desc limit 0,5";
$baglanti = sorgu($sorgu, $baglan);
$baglanti->execute();     

 

?>	   
                              
                            
                    <table   class="table table-primary mb30 table-bordered">
                                <thead class="">
                                    <tr><th colspan="4"><span align="center">Son 5 Kayıt</span></th></tr>
                             
                                    <tr>
                                     
                                        <th>Kayıt No</th>
                                        <th>Kategori</th>
                                        <th>İsim</th>
                                        <th>Durum</th>
                                    </tr>
                                </thead>
                         
                              <tbody>  <?php while ($listele =veriliste($baglanti)) {  ?>
                      
								<tr  >
                                 
									
                
                                    
                                    
                                    <td><?php echo $listele['id']; ?></td> 
									<td><?php echo $listele['tr_isim']; ?></td> 
                                    <td><?php echo $listele['tr_baslik']; ?></td> 
                                    <td><?php echo $listele['isim']; ?></td>
                                 
								</tr>	
							   
                        <?php } ?>	</tbody>
                                
                                
                                
                                    
                            </table>
                         
                      
                            
                        </div><!-- row -->
                        
                    </div><!-- contentpanel -->
                    
                </div><!-- mainpanel -->
            </div><!-- mainwrapper -->
        </section>

  

        
        
    
        
 
   
       

        <script src="js/jquery-1.11.1.min.js"></script>
        <script src="js/jquery-migrate-1.2.1.min.js"></script>
        <script src="js/bootstrap.min.js"></script>
        <script src="js/modernizr.min.js"></script>
        <script src="js/pace.min.js"></script>
        <script src="js/retina.min.js"></script>
        <script src="js/jquery.cookies.js"></script>
        
        <script src="js/jquery.flot.min.js"></script>
        <script src="js/jquery.flot.resize.min.js"></script>
        <script src="js/jquery.flot.symbol.min.js"></script>
        <script src="js/jquery.flot.crosshair.min.js"></script>
        <script src="js/jquery.flot.categories.min.js"></script>
        <script src="js/jquery.flot.pie.min.js"></script>
        <script src="js/morris.min.js"></script>
        <script src="js/raphael-2.1.0.min.js"></script>
        <script src="js/jquery.sparkline.min.js"></script>

        <script src="js/custom.js"></script>
        <script src="js/charts.js"></script>
 
  
 <script>

    var Pencerem;



    function PencereOrtala(url,w,h) {

        var left = parseInt((screen.availWidth/2) - (w/2));

        var top = parseInt((screen.availHeight/2) - (h/2));

        var windowFeatures = "width=" + w + ",height=" + h + ",status,resizable,left=" + left + ",top=" + top + "screenX=" + left + ",screenY=" + top;

        Pencerem = window.open(url, "subWind", windowFeatures);

    }
    
    
     

</script> 
    <?php $baglan = null;   ?>  

    </body>
</html>
