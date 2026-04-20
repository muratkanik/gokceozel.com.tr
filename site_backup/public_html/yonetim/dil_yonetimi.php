<?php 
include("ust.php"); 

// --- BACKEND ACTION HANDLERS ---

// 1. Save (Insert/Update)
if (isset($_POST["kaydet"])) {
    $anahtar = trim($_POST["anahtar"]);
    $tr = $_POST["tr"];
    $en = $_POST["en"];
    $ru = $_POST["ru"];
    $ar = $_POST["ar"];
    $de = $_POST["de"];
    $fr = $_POST["fr"];
    $cin = $_POST["cin"];
    $id = (int)$_POST["id"];

    if ($id > 0) {
        // Update
        $sql = "UPDATE dil_cevirileri SET anahtar=?, tr=?, en=?, ru=?, ar=?, de=?, fr=?, cin=? WHERE id=?";
        $stmt = $baglan->prepare($sql);
        $result = $stmt->execute([$anahtar, $tr, $en, $ru, $ar, $de, $fr, $cin, $id]);
        $msg_type = $result ? "success" : "danger";
        $msg_text = $result ? "Çeviri başarıyla güncellendi." : "Hata oluştu.";
    } else {
        // Insert
        // Check duplicate key
        $check = $baglan->prepare("SELECT id FROM dil_cevirileri WHERE anahtar=?");
        $check->execute([$anahtar]);
        if($check->rowCount() > 0){
             $msg_type = "warning";
             $msg_text = "Bu anahtar ($anahtar) zaten mevcut!";
        } else {
            $sql = "INSERT INTO dil_cevirileri (anahtar, tr, en, ru, ar, de, fr, cin) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $baglan->prepare($sql);
            $result = $stmt->execute([$anahtar, $tr, $en, $ru, $ar, $de, $fr, $cin]);
            $msg_type = $result ? "success" : "danger";
            $msg_text = $result ? "Yeni çeviri eklendi." : "Hata oluştu.";
        }
    }
}

// 2. Delete
if (isset($_GET["sil"])) {
    $id = (int)$_GET["sil"];
    $sql = "DELETE FROM dil_cevirileri WHERE id=?";
    $stmt = $baglan->prepare($sql);
    $result = $stmt->execute([$id]);
    $msg_type = $result ? "success" : "danger";
    $msg_text = $result ? "Kayıt silindi." : "Silme hatası.";
}

?>

<div class="container-fluid mb-5">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h4 class="mb-0 text-gray-800">Dil Yönetimi</h4>
            <small class="text-muted">Site Çevirileri (<?php echo $baglan->query("SELECT count(*) FROM dil_cevirileri")->fetchColumn(); ?> kayıt)</small>
        </div>
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="index.php">Dashboard</a></li>
                <li class="breadcrumb-item active" aria-current="page">Dil Yönetimi</li>
            </ol>
        </nav>
    </div>

    <!-- Alerts -->
    <?php if(isset($msg_type)): ?>
    <div class="alert alert-<?php echo $msg_type; ?> alert-dismissible fade show" role="alert">
        <strong><i class="bi bi-info-circle"></i> Bilgi:</strong> <?php echo $msg_text; ?>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    <?php endif; ?>

    <div class="row">
        <!-- Centered and constrained width for better focus -->
        <div class="col-12">
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-0"><i class="bi bi-translate text-primary me-2"></i> Çeviri Listesi</h5>
                    <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalForm" onclick="resetForm()">
                        <i class="bi bi-plus-lg"></i> Yeni Çeviri Ekle
                    </button>
                </div>
                
                <!-- Scrollable Frame Container -->
                <div class="card-body p-0">
                    <div class="table-responsive" style="max-height: 70vh;">
                        <table id="basicTable" class="table table-hover align-middle mb-0">
                            <thead class="table-light sticky-top">
                                <tr>
                                    <th style="width: 250px;">Anahtar (Kod)</th>
                                    <th>Türkçe (Önizleme)</th>
                                    <th>Durum</th>
                                    <th class="text-end" style="width: 130px;">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                            <?php
                            $sorgu = $baglan->query("SELECT * FROM dil_cevirileri ORDER BY id DESC");
                            while ($row = $sorgu->fetch(PDO::FETCH_ASSOC)) {
                                $jsonData = htmlspecialchars(json_encode($row), ENT_QUOTES, 'UTF-8');
                                
                                // Compact Badges
                                $cnt = 0;
                                $langs = ['EN' => $row['en'], 'RU' => $row['ru'], 'DE' => $row['de'], 'FR' => $row['fr'], 'AR' => $row['ar'], 'CN' => $row['cin']];
                                $badges = "";
                                foreach($langs as $code => $val){
                                    if(!empty(trim($val))) {
                                        $badges .= "<span class='badge bg-success me-1' style='font-size: 0.65rem;'>$code</span>";
                                        $cnt++;
                                    }
                                }
                                if($cnt == 0) $badges = "<span class='badge bg-light text-secondary border'>Yok</span>";
                            ?>
                                <tr>
                                    <td class="font-monospace text-primary fw-bold ps-3"><?php echo $row['anahtar']; ?></td>
                                    <td>
                                        <div class="text-truncate" style="max-width: 400px; color: #555;">
                                            <?php echo strip_tags($row['tr']); ?>
                                        </div>
                                    </td>
                                    <td><?php echo $badges; ?></td>
                                    <td class="text-end pe-3">
                                        <button class="btn btn-sm btn-outline-primary me-1" title="Düzenle" onclick="editRow(<?php echo $jsonData; ?>)">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                        <a href="dil_yonetimi.php?sil=<?php echo $row['id']; ?>" class="btn btn-sm btn-outline-danger" title="Sil" onclick="return confirm('Bu çeviriyi silmek istediğinizden emin misiniz?');">
                                            <i class="bi bi-trash"></i>
                                        </a>
                                    </td>
                                </tr>
                            <?php } ?>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="card-footer bg-white text-muted small">
                    <i class="bi bi-info-circle me-1"></i> Tabloda gezinmek için kaydırın. Düzenlemek için kalem ikonuna tıklayın.
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal Form -->
<div class="modal fade" id="modalForm" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <form method="post" action="dil_yonetimi.php" id="transForm">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="modalTitle">Yeni Çeviri Ekle</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" name="id" id="f_id" value="0">
                    
                    <!-- Key Input -->
                    <div class="mb-3">
                        <label for="f_anahtar" class="form-label fw-bold">Anahtar (Kod)</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-key"></i></span>
                            <input type="text" class="form-control font-monospace fw-bold" name="anahtar" id="f_anahtar" required placeholder="Örn: anasayfa_baslik">
                        </div>
                        <div class="form-text">Benzersiz bir kod giriniz. Boşluk kullanmayınız.</div>
                    </div>

                    <hr>

                    <!-- Tabs for Languages -->
                    <div class="card shadow-none border">
                        <div class="card-header bg-light">
                            <ul class="nav nav-tabs card-header-tabs" id="langTabs" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link active" id="tab-tr-tab" data-bs-toggle="tab" data-bs-target="#tab_tr" type="button" role="tab">
                                        <img src="../images/flag/flag_tr.png" height="15"> Türkçe
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="tab-en-tab" data-bs-toggle="tab" data-bs-target="#tab_en" type="button" role="tab">
                                        <img src="../images/flag/flag_en.png" height="15"> İngilizce
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="tab-ru-tab" data-bs-toggle="tab" data-bs-target="#tab_ru" type="button" role="tab">
                                        <img src="../images/flag/flag_ru.png" height="15"> Rusça
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="tab-de-tab" data-bs-toggle="tab" data-bs-target="#tab_de" type="button" role="tab">
                                        <img src="../images/flag/flag_de.png" height="15"> Almanca
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="tab-fr-tab" data-bs-toggle="tab" data-bs-target="#tab_fr" type="button" role="tab">
                                        <img src="../images/flag/flag_fr.png" height="15"> Fransızca
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="tab-ar-tab" data-bs-toggle="tab" data-bs-target="#tab_ar" type="button" role="tab">
                                        <img src="../images/flag/flag_ar.png" height="15"> Arapça
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="tab-cin-tab" data-bs-toggle="tab" data-bs-target="#tab_cin" type="button" role="tab">
                                        <img src="../images/flag/flag_cn.png" height="15"> Çince
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div class="card-body">
                            <div class="tab-content" id="langTabsContent">
                                <?php 
                                $langs = [
                                    'tr' => 'Türkçe Çeviri',
                                    'en' => 'English Translation',
                                    'ru' => 'Russian Translation',
                                    'de' => 'German Translation',
                                    'fr' => 'French Translation',
                                    'ar' => 'Arabic Translation',
                                    'cin'=> 'Chinese Translation'
                                ];
                                $first = true;
                                foreach($langs as $code => $label) {
                                    $active = $first ? 'show active' : '';
                                    $dir = ($code == 'ar') ? 'rtl' : 'ltr';
                                    echo "
                                    <div class='tab-pane fade $active' id='tab_$code' role='tabpanel'>
                                        <div class='mb-3'>
                                            <label class='form-label'>$label</label>
                                            <textarea class='form-control' name='$code' id='f_$code' rows='5' dir='$dir' style='resize:vertical;'></textarea>
                                        </div>
                                    </div>";
                                    $first = false;
                                }
                                ?>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">İptal</button>
                    <button type="submit" name="kaydet" class="btn btn-primary"><i class="bi bi-save"></i> Kaydet</button>
                </div>
            </div>
        </form>
    </div>
</div>

<?php include("alt2.php"); ?>

<script>
function resetForm() {
    $('#modalTitle').text('Yeni Çeviri Ekle');
    $('#transForm')[0].reset();
    $('#f_id').val('0');
    // Select first tab
    var firstTab = new bootstrap.Tab(document.querySelector('#tab-tr-tab'));
    firstTab.show();
}

function editRow(data) {
    resetForm();
    $('#modalTitle').text('Çeviri Düzenle: ' + data.anahtar);
    
    // Fill fields
    $('#f_id').val(data.id);
    $('#f_anahtar').val(data.anahtar);
    $('#f_tr').val(data.tr);
    $('#f_en').val(data.en);
    $('#f_ru').val(data.ru);
    $('#f_de').val(data.de);
    $('#f_fr').val(data.fr);
    $('#f_ar').val(data.ar);
    $('#f_cin').val(data.cin);
    
    // Open Modal
    var modal = new bootstrap.Modal(document.getElementById('modalForm'));
    modal.show();
}

// Auto-focus logic
var myModal = document.getElementById('modalForm')
myModal.addEventListener('shown.bs.modal', function () {
    if($('#f_id').val() == '0'){
        $('#f_anahtar').focus();
    } else {
        $('#f_tr').focus();
    }
})
</script>
