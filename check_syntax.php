<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
echo "<!-- Debug: Start -->"; flush();
include("ust.php"); 
echo "<!-- Debug: After ust.php -->"; flush(); 
sayfayetkikontrol(4);  

if ((isset($_GET['sil'])) && ($_GET['sil'] != "")) {
    $silmesorgusu ='UPDATE icerik SET durum= :durumal  WHERE eskayit= :idal';
    $silbaglanti= guncel($silmesorgusu, $baglan);    
    $sonsonucu =$silbaglanti->execute(array("durumal" => '-1',"idal" => $_GET['sil']));  
    if (!$sonsonucu) {
        echo "<script>alert('Hata! Kayıt Silinemedi'); location.href='icerik_rapor.php';</script>";
    }   
    if ($sonsonucu) {
        echo "<script>alert('Kayıt Silindi'); location.href='icerik_rapor.php';</script>";
    } 
} 

// Filter Parameters
$filtre_kategori = isset($_GET['filtre_kategori']) ? intval($_GET['filtre_kategori']) : 0;
$filtre_durum = isset($_GET['filtre_durum']) ? intval($_GET['filtre_durum']) : 0;
$filtre_arama = isset($_GET['filtre_arama']) ? trim($_GET['filtre_arama']) : '';

// Sort Parameters
$sort = isset($_GET['sort']) ? $_GET['sort'] : 'et.id';
$order = isset($_GET['order']) ? $_GET['order'] : 'DESC';

// Allowed Sort Columns
$allowed_cols = array('et.id', 'eu.tr_isim', 'et.tr_baslik', 'dk.isim', 'et.tr_seo_score');
if (!in_array($sort, $allowed_cols)) {
    $sort = 'et.id';
}
$order = ($order === 'ASC') ? 'ASC' : 'DESC';

// Build Query
$where_conditions = array("et.durum!='-1'");

if ($filtre_kategori > 0) {
    $where_conditions[] = "et.kategori = " . intval($filtre_kategori);
}
if ($filtre_durum > 0) {
    $where_conditions[] = "et.durum = " . intval($filtre_durum);
}
if (!empty($filtre_arama)) {
    $arama_guvenli = addslashes($filtre_arama);
    $where_conditions[] = "(et.tr_baslik LIKE '%" . $arama_guvenli . "%' OR et.tr_icerik LIKE '%" . $arama_guvenli . "%' OR et.en_baslik LIKE '%" . $arama_guvenli . "%' OR et.en_icerik LIKE '%" . $arama_guvenli . "%')";
}

$where_clause = "WHERE " . implode(" AND ", $where_conditions);

$sorgu = "SELECT
      et.id 
      ,et.kategori
      ,et.tarih
      ,et.tr_baslik
      ,et.tr_icerik
      ,et.tr_detay
      ,et.tr_seo_score
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
" . $where_clause . " ORDER BY " . $sort . " " . $order;

$baglanti = sorgu($sorgu, $baglan);
echo "<!-- Debug: Query prepared -->"; flush();
if(!$baglanti) { echo "Query Preparation Failed"; exit; }

try {
    $baglanti->execute();
    echo "<!-- Debug: Query executed -->"; flush();
} catch(PDOException $e) {
    echo "Query Execution Failed: " . $e->getMessage(); exit;
}

// Categories for Filter
$kategori_sorgu = "SELECT id, tr_isim, anakategori FROM genel_kategori WHERE durum='1' ORDER BY tr_isim ASC";
$kategori_baglanti = sorgu($kategori_sorgu, $baglan);
$kategori_baglanti->execute();
$kategoriler_listesi = array();
while ($kat = veriliste($kategori_baglanti)) {
    $kategoriler_listesi[] = $kat;
}

// Status Codes for Filter
$durum_sorgu = "SELECT durum_id, isim FROM durum_kodlari ORDER BY durum_id ASC";
$durum_baglanti = sorgu($durum_sorgu, $baglan);
$durum_baglanti->execute();
$durumlar_listesi = array();
while ($dur = veriliste($durum_baglanti)) {
    $durumlar_listesi[] = $dur;
}

function sortLink($col, $label, $currentSort, $currentOrder) {
    $newOrder = ($currentSort == $col && $currentOrder == 'ASC') ? 'DESC' : 'ASC';
    $icon = '';
    if ($currentSort == $col) {
        $icon = ($currentOrder == 'ASC') ? ' <i class="bi bi-caret-up-fill"></i>' : ' <i class="bi bi-caret-down-fill"></i>';
    }
    
    $params = $_GET;
    $params['sort'] = $col;
    $params['order'] = $newOrder;
    $queryString = http_build_query($params);
    
    return '<a href="?' . $queryString . '" class="text-decoration-none text-dark fw-bold">' . $label . $icon . '</a>';
}
?>

<div class="container-fluid mb-5">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h4 class="mb-0 text-gray-800">İçerik Raporu</h4>
            <small class="text-muted">İçeriklerinizi listeleyin ve yönetin</small>
        </div>
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="index.php">Dashboard</a></li>
                <li class="breadcrumb-item active" aria-current="page">İçerik Raporu</li>
            </ol>
        </nav>
    </div>

    <!-- Filters -->
    <div class="card border-0 shadow-sm mb-4">
        <div class="card-header bg-white py-3">
            <h5 class="card-title mb-0 fs-6"><i class="bi bi-filter text-primary me-2"></i> Filtrele</h5>
        </div>
        <div class="card-body">
            <form method="GET" action="icerik_rapor.php" class="row g-3 align-items-end">
                <div class="col-md-3">
                    <label for="filtre_kategori" class="form-label small text-muted">Kategori</label>
                    <select name="filtre_kategori" id="filtre_kategori" class="form-select select2">
                        <option value="0">Tüm Kategoriler</option>
                        <?php 
                        foreach ($kategoriler_listesi as $kategori) {
                            $selected = ($filtre_kategori == $kategori['id']) ? 'selected' : '';
                            echo '<option value="' . htmlspecialchars($kategori['id']) . '" ' . $selected . '>' . htmlspecialchars($kategori['tr_isim']) . '</option>';
                        }
                        ?>
                    </select>
                </div>
                <div class="col-md-3">
                    <label for="filtre_durum" class="form-label small text-muted">Durum</label>
                    <select name="filtre_durum" id="filtre_durum" class="form-select">
                        <option value="0">Tüm Durumlar</option>
                        <?php 
                        foreach ($durumlar_listesi as $durum) {
                            $selected = ($filtre_durum == $durum['durum_id']) ? 'selected' : '';
                            echo '<option value="' . htmlspecialchars($durum['durum_id']) . '" ' . $selected . '>' . htmlspecialchars($durum['isim']) . '</option>';
                        }
                        ?>
                    </select>
                </div>
                <div class="col-md-4">
                    <label for="filtre_arama" class="form-label small text-muted">Arama</label>
                    <input type="text" name="filtre_arama" id="filtre_arama" class="form-control" placeholder="Başlık veya içerik ara..." value="<?php echo htmlspecialchars($filtre_arama); ?>">
                </div>
                <div class="col-md-2">
                    <input type="hidden" name="sort" value="<?php echo htmlspecialchars($sort); ?>">
                    <input type="hidden" name="order" value="<?php echo htmlspecialchars($order); ?>">
                    <div class="d-grid gap-2">
                        <button type="submit" class="btn btn-primary"><i class="bi bi-search"></i> Ara</button>
                        <a href="icerik_rapor.php" class="btn btn-outline-secondary"><i class="bi bi-arrow-counterclockwise"></i> Temizle</a>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <!-- Content Table -->
    <div class="card border-0 shadow-sm">
        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0"><i class="bi bi-list-ul text-primary me-2"></i> İçerik Listesi</h5>
            <a href="icerik_ekle.php" class="btn btn-success btn-sm"><i class="bi bi-plus-lg"></i> Yeni Kayıt</a>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="shTable" class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th style="width: 100px;" class="text-center">İşlemler</th>
                            <th><?php echo sortLink('et.id', 'ID', $sort, $order); ?></th>
                            <th style="width:100px;"><?php echo sortLink('et.tr_seo_score', 'SEO', $sort, $order); ?></th>
                            <th><?php echo sortLink('eu.tr_isim', 'Kategori', $sort, $order); ?></th>
                            <th><?php echo sortLink('et.tr_baslik', 'Başlık', $sort, $order); ?></th>
                            <th><?php echo sortLink('dk.isim', 'Durum', $sort, $order); ?></th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php 
                        while ($listele = veriliste($baglanti)) {  
                            // Resolve Category Name recursively/properly if needed, or use joined value
                            $kategori_adi = $listele['tr_isim']; // From join
                            
                            // SEO Score Badge
                            $score = isset($listele['tr_seo_score']) ? intval($listele['tr_seo_score']) : 0;
                            $scoreClass = 'bg-danger';
                            if($score > 40) $scoreClass = 'bg-warning text-dark';
                            if($score > 70) $scoreClass = 'bg-success';
                            
                            // Calculate percentage for circular progress or just badge
                            // Simple badge for now
                        ?>
                        <tr>
                            <td class="text-center">
                                <div class="dropdown">
                                    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-boundary="viewport" aria-expanded="false">
                                        İşlem
                                    </button>
                                    <ul class="dropdown-menu shadow">
                                        <li>
                                            <a class="dropdown-item" href="icerik_ekle.php?bilgikayitonay=<?php echo isset($listele['eskayit']) ? htmlspecialchars($listele['eskayit']) : '';?>">
                                                <i class="bi bi-pencil me-2 text-primary"></i> Güncelle
                                            </a>
                                        </li>
                                        <li>
                                            <a class="dropdown-item" href="javascript:void(0);" onclick="PencereOrtala('icerik_belge_ekle.php?bilgigonder=<?php echo isset($listele['eskayit']) ? htmlspecialchars($listele['eskayit']) : '';?> ',650,650);">
                                                <i class="bi bi-cloud-upload me-2 text-info"></i> Döküman Ekle
                                            </a>
                                        </li>
                                        <li>
                                            <a class="dropdown-item" href="javascript:void(0);" onclick="PencereOrtala('icerik_belge_goster.php?bilgigonder=<?php echo isset($listele['eskayit']) ? htmlspecialchars($listele['eskayit']) : '';?> ',860,660);">
                                                <i class="bi bi-eye me-2 text-secondary"></i> Döküman İncele
                                            </a>
                                        </li>
                                        <li><hr class="dropdown-divider"></li>
                                        <li>
                                            <a class="dropdown-item text-danger" href="icerik_rapor.php?sil=<?php echo $listele['eskayit']; ?>" onclick="return confirm('Bu Kaydı Silmek İstediğinizden Emin Misiniz?');">
                                                <i class="bi bi-trash me-2"></i> Sil
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </td>
                            <td><span class="badge bg-light text-dark border"><?php echo $listele['id']; ?></span></td>
                            <td class="text-center">
                                <span class="badge <?php echo $scoreClass; ?> rounded-pill" style="min-width: 40px;"><?php echo $score; ?></span>
                            </td>
                            <td><span class="badge bg-info text-dark bg-opacity-10"><?php echo htmlspecialchars($kategori_adi); ?></span></td>
                            <td class="fw-bold text-dark">
                                <?php echo htmlspecialchars($listele['tr_baslik']); ?>
                            </td>
                            <td>
                                <?php 
                                $badgeClass = 'bg-secondary';
                                if($listele['durum'] == 1) $badgeClass = 'bg-success';
                                elseif($listele['durum'] == 3) $badgeClass = 'bg-warning text-dark';
                                elseif($listele['durum'] == 0) $badgeClass = 'bg-danger';
                                echo '<span class="badge ' . $badgeClass . '">' . htmlspecialchars($listele['isim']) . '</span>';
                                ?>
                            </td>
                        </tr>
                        <?php } ?>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="card-footer bg-white text-muted small">
            <i class="bi bi-info-circle me-1"></i> Toplam <?php echo $baglanti->rowCount(); ?> kayıt listelendi.
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
</script>

<?php include("alt2.php");?>
