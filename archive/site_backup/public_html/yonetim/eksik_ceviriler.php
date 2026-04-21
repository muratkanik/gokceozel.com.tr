
<?php include("ust.php"); 
sayfayetkikontrol(4); 
?>

<div class="mainpanel">
    <div class="contentpanel">
        <div class="panel panel-dark-head">
            <div class="panel-heading">
                <h4 class="panel-title">EKSİK ÇEVİRİLER RAPORU</h4>
                <p>Çevirisi yapılmamış veya eksik olan içerikler</p>
            </div>
            
            <div class="table-responsive">
                <table id="shTable" class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th style="width: 10%">İşlemler</th>
                            <th>ID</th>
                            <th>Kayıt Adı (TR)</th>
                            <th>Eksik Diller</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        // Check for missing titles in any language for active records
                        $sorgu = "SELECT id, tr_baslik, eskayit,
                                  en_baslik, ru_baslik, ar_baslik, de_baslik, fr_baslik, cin_baslik,
                                  en_detay, ru_detay, ar_detay, de_detay, fr_detay, cin_detay
                                  FROM icerik 
                                  WHERE durum != '-1' 
                                  AND (
                                    (en_baslik = '' OR en_baslik IS NULL) OR
                                    (ru_baslik = '' OR ru_baslik IS NULL) OR
                                    (ar_baslik = '' OR ar_baslik IS NULL) OR
                                    (de_baslik = '' OR de_baslik IS NULL) OR
                                    (fr_baslik = '' OR fr_baslik IS NULL) OR
                                    (cin_baslik = '' OR cin_baslik IS NULL)
                                  )
                                  ORDER BY id DESC";
                        
                        $baglanti = sorgu($sorgu, $baglan);
                        $baglanti->execute();
                        
                        while ($row = veriliste($baglanti)) {
                            $missing_langs = array();
                            
                            // Check Languages
                            if (empty($row['en_baslik'])) $missing_langs[] = "EN";
                            if (empty($row['ru_baslik'])) $missing_langs[] = "RU";
                            if (empty($row['ar_baslik'])) $missing_langs[] = "AR";
                            if (empty($row['de_baslik'])) $missing_langs[] = "DE";
                            if (empty($row['fr_baslik'])) $missing_langs[] = "FR";
                            if (empty($row['cin_baslik'])) $missing_langs[] = "CIN";
                            
                            if (count($missing_langs) > 0) {
                        ?>
                        <tr>
                            <td>
                                <a href="icerik_ekle.php?bilgikayitonay=<?php echo $row['eskayit']; ?>" class="btn btn-xs btn-primary" target="_blank">
                                    <i class="fa fa-pencil"></i> Düzenle
                                </a>
                            </td>
                            <td><?php echo $row['id']; ?></td>
                            <td><?php echo htmlspecialchars($row['tr_baslik']); ?></td>
                            <td>
                                <?php 
                                foreach($missing_langs as $lang) {
                                    echo '<span class="label label-danger" style="margin-right:2px">' . $lang . '</span>';
                                }
                                ?>
                            </td>
                        </tr>
                        <?php 
                            } 
                        } 
                        ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<?php include("alt2.php"); ?>
