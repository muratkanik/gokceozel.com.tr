<?php include("ust.php"); ?>
<link href="css/style.datatables.css" rel="stylesheet">
<link href="css/dataTables.responsive.css" rel="stylesheet">
<div class="mainpanel">
    <div class="pageheader">
        <div class="media">
            <div class="pageicon pull-left">
                <i class="fa fa-calendar"></i>
            </div>
            <div class="media-body">
                <ul class="breadcrumb">
                    <li><a href="index.php"><i class="glyphicon glyphicon-home"></i></a></li>
                    <li>Randevular</li>
                </ul>
                <h4>Randevu Talepleri</h4>
            </div>
        </div>
    </div>
    
    <div class="contentpanel">
        <?php
        if (isset($_GET['sil']) && $_GET['sil'] != '') {
            $sil_id = intval($_GET['sil']);
            $sil = "DELETE FROM randevular WHERE id = :id";
            $silg = guncel($sil, $baglan);
            $silg->bindParam(':id', $sil_id, PDO::PARAM_INT);
            if ($silg->execute()) {
                echo "<script>alert('Randevu talebi silindi.'); location.href='randevu_listesi.php';</script>";
            } else {
                echo "<script>alert('Silme sırasında bir hata oluştu.'); location.href='randevu_listesi.php';</script>";
            }
        }
        
        if (isset($_GET['okundu']) && $_GET['okundu'] != '') {
            $okundu_id = intval($_GET['okundu']);
            $okundu = "UPDATE randevular SET durum=1 WHERE id = :id";
            $okundug = guncel($okundu, $baglan);
            $okundug->bindParam(':id', $okundu_id, PDO::PARAM_INT);
            if ($okundug->execute()) {
                echo "<script>location.href='randevu_listesi.php';</script>";
            }
        }
        ?>
        
        <div class="panel panel-dark-head">
            <div class="panel-heading">
                <h4 class="panel-title">Randevu Talepleri</h4>
                <p>Web sitesi üzerinden gönderilen randevu talepleri aşağıda listelenmektedir.</p>
            </div>
            <div style="padding: 10px; background: #fff; overflow-x: auto;">
            <table id="shTable" class="table table-striped table-bordered text-sm text-dark mt-3" style="width: 100%;">
                <thead>
                    <tr>
                        <th style="width: 10%">İşlemler</th>
                        <th style="width: 20%">Ad Soyad</th>
                        <th style="width: 15%">Telefon</th>
                        <th style="width: 20%">E-Posta</th>
                        <th style="width: 25%">Mesaj</th>
                        <th style="width: 10%">Tarih</th>
                    </tr>
                </thead>
                <tbody>
                <?php
                $randevular = "SELECT * FROM randevular ORDER BY id DESC";
                $randevularb = sorgu($randevular, $baglan);
                $randevularb->execute();
                while ($randevu = veriliste($randevularb)) {
                    $tr_class = $randevu['durum'] == 0 ? "font-weight-bold" : "";
                ?>
                    <tr class="<?php echo $tr_class; ?>" style="<?php echo $randevu['durum'] == 0 ? 'background-color:#e8f4f8;' : ''; ?>">
                        <td>
                            <div class="btn-group">
                                <button type="button" class="btn btn-xs btn-primary dropdown-toggle" data-toggle="dropdown">İşlem <span class="caret"></span></button>
                                <ul class="dropdown-menu" role="menu">
                                    <?php if ($randevu['durum'] == 0) { ?>
                                    <li><a href="randevu_listesi.php?okundu=<?php echo $randevu['id']; ?>">Okundu İşaretle</a></li>
                                    <?php } ?>
                                    <li><a onClick="return confirm('Bu talebi silmek istediğinizden emin misiniz?');" href="randevu_listesi.php?sil=<?php echo $randevu['id']; ?>">Randevuyu Sil</a></li>
                                </ul>
                            </div>
                        </td>
                        <td><?php echo $randevu['ad_soyad']; ?></td>
                        <td><?php echo $randevu['telefon']; ?></td>
                        <td><a href="mailto:<?php echo $randevu['email']; ?>"><?php echo $randevu['email']; ?></a></td>
                        <td><div style="max-height: 80px; overflow-y: auto;"><?php echo nl2br(htmlspecialchars($randevu['mesaj'])); ?></div></td>
                        <td><?php echo date('d.m.Y H:i', strtotime($randevu['kayit_tarihi'])); ?></td>
                    </tr>
                <?php } ?>
                </tbody>
            </table>
            </div>
        </div>
    </div>
</div>
<?php include("alt2.php"); ?>
