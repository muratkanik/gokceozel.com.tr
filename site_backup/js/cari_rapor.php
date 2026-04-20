<?  include("ust.php"); 
 

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

   <link href="css/style.datatables.css" rel="stylesheet">
        <link href="css/dataTables.responsive.css" rel="stylesheet">

                
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
                        
                        
    
<?PHP


  
if ($_GET['cari']!='') { $sonuc.=" and id='".$_GET['cari']."'";}


  
@mysql_select_db($veritabani, $baglan);
$sorgu = "SELECT   *   FROM   cari_kart  where      durum!='-1' ";
$baglanti = @mysql_query($sorgu, $baglan) or die(@mysql_error());
$listele = @mysql_fetch_assoc($baglanti);
 

?>	
                            
                                
                         
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
                                                    <input type="checkbox" checked="checked" id="cari" value="0">
                                                    <label for="cari">Cari</label>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="ckbox ckbox-primary">
                                                    <input type="checkbox" checked="checked" id="alis" value="1">
                                                    <label for="alis">Alış</label>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="ckbox ckbox-primary">
                                                    <input type="checkbox" checked="checked" id="satis" value="2">
                                                    <label for="satis">Satış</label>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="ckbox ckbox-primary">
                                                    <input type="checkbox" checked="checked" id="bakiye" value="3">
                                                    <label for="bakiye">Bakiye</label>
                                                </div>
                                            </li>
                                            
                                        </ul>
                                    </div>
                                </div>
                                <h4 class="panel-title">Goster/Gizle</h4>
                                <p>Sütun Kriterlerini Bu Alandan Seçebilirsiniz.</p>
                            </div><!-- panel-heading -->
                            
                            <table id="shTable" class="table table-striped table-bordered">
                                <thead class="">
                                    <tr>
                                        <th>Cari</th>
                                        <th>Alış</th>
                                        <th>Satış</th>
                                        <th>Bakiye</th>
                                      
                                    </tr>
                                </thead>
                         
                              <tbody>  <?php if ($listele > 0) {  ?>
                          <?php do {?>
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
                                    
                                    
                            
                                    
									
									 
                                   
									 
								</tr>	
							  <?php } while ($listele = mysql_fetch_assoc($baglanti)); ?>
                        <?php } ?>	</tbody>
                                
                                
                                
                                    
                            </table>
                        </div><!-- panel -->
                        
                        
                        
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
        
        <script src="js/jquery.dataTables.min.js"></script>
        <script src="js/dataTables.bootstrap.js"></script>
        <script src="js/dataTables.responsive.js"></script>
        <script src="js/select2.min.js"></script>

        <script src="js/custom.js"></script>
        <script>
            jQuery(document).ready(function(){
                
                jQuery('#basicTable').DataTable({
                    responsive: true
                });
                
                var shTable = jQuery('#shTable').DataTable({
                    "fnDrawCallback": function(oSettings) {
                        jQuery('#shTable_paginate ul').addClass('pagination-active-dark');
                    },
                    responsive: true
                });
                
                // Show/Hide Columns Dropdown
                jQuery('#shCol').click(function(event){
                    event.stopPropagation();
                });
                
                jQuery('#shCol input').on('click', function() {

                    // Get the column API object
                    var column = shTable.column($(this).val());
 
                    // Toggle the visibility
                    if ($(this).is(':checked'))
                        column.visible(true);
                    else
                        column.visible(false);
                });
                
                var exRowTable = jQuery('#exRowTable').DataTable({
                    responsive: true,
                    "fnDrawCallback": function(oSettings) {
                        jQuery('#exRowTable_paginate ul').addClass('pagination-active-success');
                    },
                    "ajax": "ajax/objects.txt",
                    "columns": [
                        {
                            "class":          'details-control',
                            "orderable":      false,
                            "data":           null,
                            "defaultContent": ''
                        },
                        { "data": "name" },
                        { "data": "position" },
                        { "data": "office" },
                        { "data": "salary" }
                    ],
                    "order": [[1, 'asc']] 
                });
                
                // Add event listener for opening and closing details
                jQuery('#exRowTable tbody').on('click', 'td.details-control', function () {
                    var tr = $(this).closest('tr');
                    var row = exRowTable.row( tr );
             
                    if ( row.child.isShown() ) {
                        // This row is already open - close it
                        row.child.hide();
                        tr.removeClass('shown');
                    }
                    else {
                        // Open this row
                        row.child( format(row.data()) ).show();
                        tr.addClass('shown');
                    }
                });
               
                
                // DataTables Length to Select2
                jQuery('div.dataTables_length select').removeClass('form-control input-sm');
                jQuery('div.dataTables_length select').css({width: '60px'});
                jQuery('div.dataTables_length select').select2({
                    minimumResultsForSearch: -1
                });
    
            });
            
            function format (d) {
                // `d` is the original data object for the row
                return '<table class="table table-bordered nomargin">'+
                    '<tr>'+
                        '<td>Full name:</td>'+
                        '<td>'+d.name+'</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td>Extension number:</td>'+
                        '<td>'+d.extn+'</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td>Extra info:</td>'+
                        '<td>And any further details here (images etc)...</td>'+
                    '</tr>'+
                '</table>';
            }
        </script>
        
      
    