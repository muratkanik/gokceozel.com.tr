<?php include("ust.php"); ?>

<div class="container-fluid mb-5">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h4 class="mb-0 text-gray-800">Kategori Yönetimi</h4>
            <small class="text-muted">Kategorileri ekleyin, düzenleyin ve yönetin</small>
        </div>
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="index.php">Dashboard</a></li>
                <li class="breadcrumb-item active" aria-current="page">Kategori Yönetimi</li>
            </ol>
        </nav>
    </div>
    
    <div class="card border-0 shadow-sm">
        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0"><i class="bi bi-list-ul text-primary me-2"></i> Kategori Listesi</h5>
            <button type="button" class="btn btn-primary btn-sm" onclick="PencereOrtala('ajax/kategori_ekle.php',900,700);">
                <i class="bi bi-plus-lg"></i> Kategori Ekle
            </button>
        </div>
        
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th style="width: 150px;" class="text-center">İşlemler</th>
                            <th>Kategori Adı</th>
                            <th>Menüde Göster</th>
                            <th>Durum</th>
                        </tr>
                    </thead>
                    <tbody id="aramayap">
                        <?php
                        // Using variable $baglan from ust.php
                        $dta = "SELECT * FROM genel_kategori WHERE durum!='-1' ORDER BY tr_isim";
                        $dtab = sorgu($dta, $baglan);
                        $dtab->execute();
                        
                        while ($dtal = veriliste($dtab)) {
                            ?>
                            <tr>
                                <td class="text-center">
                                    <div class="dropdown">
                                        <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-boundary="viewport" aria-expanded="false">
                                            İşlem
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li>
                                                <a class="dropdown-item" href="javascript:void(0);" onclick="PencereOrtala('ajax/kategori_ekle.php?guncelleme=<?php echo $dtal['id'];?>',900,700);">
                                                    <i class="bi bi-pencil me-2 text-primary"></i> Güncelle
                                                </a>
                                            </li>
                                            <?php if ($dtal['durum']=='1') { ?>
                                            <li>
                                                <a class="dropdown-item" href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#pasifeal" data-kayit-id="<?php echo $dtal['id'];?>">
                                                    <i class="bi bi-x-circle me-2 text-warning"></i> Pasife Al
                                                </a>
                                            </li>
                                            <?php } ?>
                                            <?php if ($dtal['durum']=='3') { ?>
                                            <li>
                                                <a class="dropdown-item" href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#aktifeal" data-kayit-id="<?php echo $dtal['id'];?>">
                                                    <i class="bi bi-check-circle me-2 text-success"></i> Aktife Al
                                                </a>
                                            </li>
                                            <?php } ?>
                                            <li><hr class="dropdown-divider"></li>
                                            <li>
                                                <a class="dropdown-item" href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#kayitsil" data-kayit-id="<?php echo $dtal['id'];?>">
                                                    <i class="bi bi-trash me-2 text-danger"></i> Sil
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                                <td class="fw-bold text-dark">
                                    <?php
                                    $ukatlar = "WITH RECURSIVE cte (id, tr_isim, anakategori) AS (
                                        SELECT id, tr_isim, anakategori
                                        FROM genel_kategori
                                        WHERE id = ".$dtal['id']." 
                                        UNION ALL
                                        SELECT p.id, p.tr_isim, p.anakategori
                                        FROM genel_kategori p
                                        INNER JOIN cte ON p.id = cte.anakategori  
                                    )
                                    SELECT * FROM cte ORDER BY id";
                                    $ukatlarb = sorgu($ukatlar, $baglan);
                                    $ukatlarb->execute();
                                    while ($ukatlarl = veriliste($ukatlarb)) {
                                        if($ukatlarl['anakategori']!=0) {
                                            echo " <i class='bi bi-chevron-right text-muted small mx-1'></i> ";
                                        }
                                        echo htmlspecialchars($ukatlarl['tr_isim'] ?? '');
                                    }
                                    ?>
                                </td>
                                <td>
                                    <?php if($dtal['ust_menu']==1): ?>
                                        <span class="badge bg-info text-dark">Evet</span>
                                    <?php else: ?>
                                        <span class="badge bg-light text-secondary border">Hayır</span>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php 
                                    if($dtal['durum']==1) {
                                        echo '<span class="badge bg-success">Aktif</span>';
                                    } elseif ($dtal['durum']==3) {
                                        echo '<span class="badge bg-warning text-dark">Pasif</span>';
                                    }
                                    ?>
                                </td>
                            </tr>
                            <?php
                        }
                        ?>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="card-footer bg-white text-muted small">
            <i class="bi bi-info-circle me-1"></i> Alt kategorileri görmek için kategori adına bakınız.
        </div>
    </div>
</div>

<!-- Modals -->
<div class="modal fade" id="kayitsil" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Silme İşlemi</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="kayitdetaysonuc">
                Yükleniyor...
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="pasifeal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Pasife Alma İşlemi</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="pasifdetaysonuc">
                Yükleniyor...
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="aktifeal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Aktife Alma İşlemi</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="aktifdetaysonuc">
                Yükleniyor...
            </div>
        </div>
    </div>
</div>

<script>
function PencereOrtala(url, w, h) {
    var left = parseInt((screen.availWidth/2) - (w/2));
    var top = parseInt((screen.availHeight/2) - (h/2));
    var windowFeatures = "width=" + w + ",height=" + h + ",status,resizable,left=" + left + ",top=" + top + "screenX=" + left + ",screenY=" + top;
    window.open(url, "subWind", windowFeatures);
}

$(document).ready(function() {
    // Pasife Al modal
    $('#pasifeal').on('show.bs.modal', function(e) {
        var kayital = $(e.relatedTarget).data('kayit-id');
        jQuery.ajax({
            type: 'GET',
            data: {kayital: kayital},
            url: 'ajax/kategori_pasif.php',
            error: function() {
                $('#pasifdetaysonuc').html("İşlem Başarısız.");
            },
            success: function(veri) {
                $('#pasifdetaysonuc').html(veri);
            }
        });
    });
    
    // Aktife Al modal
    $('#aktifeal').on('show.bs.modal', function(e) {
        var kayital = $(e.relatedTarget).data('kayit-id');
        jQuery.ajax({
            type: 'GET',
            data: {kayital: kayital},
            url: 'ajax/kategori_aktif.php',
            error: function() {
                $('#aktifdetaysonuc').html("İşlem Başarısız.");
            },
            success: function(veri) {
                $('#aktifdetaysonuc').html(veri);
            }
        });
    });
    
    // Sil modal
    $('#kayitsil').on('show.bs.modal', function(e) {
        var kayital = $(e.relatedTarget).data('kayit-id');
        jQuery.ajax({
            type: 'GET',
            data: {kayital: kayital},
            url: 'ajax/kategori_sil.php',
            error: function() {
                $('#kayitdetaysonuc').html("İşlem Başarısız.");
            },
            success: function(veri) {
                $('#kayitdetaysonuc').html(veri);
            }
        });
    });
    
    // Modal'lar kapandıktan sonra sayfayı yenile (başarılı işlem sonrası)
    $('#pasifeal, #aktifeal, #kayitsil').on('hidden.bs.modal', function() {
        var modalId = $(this).attr('id');
        var resultDiv = '';
        if (modalId == 'pasifeal') {
            resultDiv = $('#pasifdetaysonuc');
        } else if (modalId == 'aktifeal') {
            resultDiv = $('#aktifdetaysonuc');
        } else if (modalId == 'kayitsil') {
            resultDiv = $('#kayitdetaysonuc');
        }
        
        if (resultDiv.length && (resultDiv.text().indexOf('Başarı') > -1 || resultDiv.text().indexOf('Onaylandı') > -1 || resultDiv.text().indexOf('Silindi') > -1)) {
            setTimeout(function() {
                location.reload();
            }, 500);
        }
    });

    // Check for popup close
    // Note: The original logic for `window.open` refresh on parent relies on `window.opener`.
    // We should keep the popup logic since `kategori_ekle.php` likely opens in a popup.
});
</script>

<?php include("alt2.php"); ?>
