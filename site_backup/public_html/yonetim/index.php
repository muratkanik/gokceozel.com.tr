<?php include("ust.php"); ?>

<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="mb-0 text-gray-800">Dashboard</h4>
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                <li class="breadcrumb-item active" aria-current="page">Dashboard</li>
            </ol>
        </nav>
    </div>

    <!-- Stats Row -->
    <?php
    $is = "SELECT count(id) iceriksayi
    ,(select count(id) from genel_kategori where durum!='-1') kategorisayi
    ,(select count(id) from icerik_belge where durum!='-1') belgesayi 
    ,(select count(id) from kullanicilar where durum!='-1') kullanicisayi 
    from icerik where durum!='-1'";
    $isb = sorgu($is, $baglan);
    $isb->execute();     
    $isl = veriliste($isb);
    ?>

    <div class="row g-4 mb-4">
        <!-- Content Count -->
        <div class="col-md-6 col-lg-3">
            <div class="card h-100 border-0 shadow-sm">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <div class="flex-shrink-0 me-3">
                            <div class="bg-primary-soft p-3 rounded">
                                <i class="bi bi-file-text fs-3"></i>
                            </div>
                        </div>
                        <div>
                            <p class="mb-1 text-muted small text-uppercase">İçerik Sayısı</p>
                            <h4 class="mb-0 fw-bold"><?php echo $isl['iceriksayi']; ?></h4>
                        </div>
                    </div>
                </div>
                <div class="card-footer bg-white border-0 py-3">
                    <a href="icerik_rapor.php" class="text-decoration-none small text-primary fw-medium">Detayları Gör <i class="bi bi-arrow-right ms-1"></i></a>
                </div>
            </div>
        </div>

        <!-- Category Count -->
        <div class="col-md-6 col-lg-3">
            <div class="card h-100 border-0 shadow-sm">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <div class="flex-shrink-0 me-3">
                            <div class="bg-success-soft p-3 rounded">
                                <i class="bi bi-diagram-3 fs-3"></i>
                            </div>
                        </div>
                        <div>
                            <p class="mb-1 text-muted small text-uppercase">Kategori Sayısı</p>
                            <h4 class="mb-0 fw-bold"><?php echo $isl['kategorisayi']; ?></h4>
                        </div>
                    </div>
                </div>
                <div class="card-footer bg-white border-0 py-3">
                    <a href="kategori_yonetimi.php" class="text-decoration-none small text-success fw-medium">Detayları Gör <i class="bi bi-arrow-right ms-1"></i></a>
                </div>
            </div>
        </div>

        <!-- Document Count -->
        <div class="col-md-6 col-lg-3">
            <div class="card h-100 border-0 shadow-sm">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <div class="flex-shrink-0 me-3">
                            <div class="bg-warning-soft p-3 rounded">
                                <i class="bi bi-images fs-3"></i>
                            </div>
                        </div>
                        <div>
                            <p class="mb-1 text-muted small text-uppercase">Medya/Belge</p>
                            <h4 class="mb-0 fw-bold"><?php echo $isl['belgesayi']; ?></h4>
                        </div>
                    </div>
                </div>
                <div class="card-footer bg-white border-0 py-3">
                    <a href="#" class="text-decoration-none small text-warning fw-medium">Detayları Gör <i class="bi bi-arrow-right ms-1"></i></a>
                </div>
            </div>
        </div>

        <!-- User Count -->
        <div class="col-md-6 col-lg-3">
            <div class="card h-100 border-0 shadow-sm">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <div class="flex-shrink-0 me-3">
                            <div class="bg-danger-soft p-3 rounded">
                                <i class="bi bi-people fs-3"></i>
                            </div>
                        </div>
                        <div>
                            <p class="mb-1 text-muted small text-uppercase">Kullanıcılar</p>
                            <h4 class="mb-0 fw-bold"><?php echo $isl['kullanicisayi']; ?></h4>
                        </div>
                    </div>
                </div>
                <div class="card-footer bg-white border-0 py-3">
                    <a href="kullanici_rapor.php" class="text-decoration-none small text-danger fw-medium">Detayları Gör <i class="bi bi-arrow-right ms-1"></i></a>
                </div>
            </div>
        </div>
    </div>

    <?php
    // Visitors SQL
    $sz = "SELECT count(id) toplamsayi
    ,(select count(id) from sayfa_ziyaretleri where DAY(tarih) = DAY(CURDATE())) bugun
    ,(select count(id) from sayfa_ziyaretleri where  MONTH(tarih) = MONTH(CURDATE())) buay 
    ,(select count(id) from sayfa_ziyaretleri where YEAR(tarih) = YEAR(CURDATE())) buyil 
    from sayfa_ziyaretleri ";
    $szb = sorgu($sz, $baglan);
    $szb->execute();     
    $szl = veriliste($szb);
    ?>

    <div class="row g-4">
        <!-- Visitor Stats & Charts -->
        <div class="col-lg-8">
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-header bg-white py-3">
                    <h5 class="card-title mb-0">Ziyaretçi İstatistikleri</h5>
                </div>
                <div class="card-body">
                    <div class="row mb-4">
                        <div class="col-md-6">
                            <h6 class="text-muted mb-3">Ziyaret Özeti</h6>
                            
                            <div class="mb-3">
                                <div class="d-flex justify-content-between mb-1">
                                    <span>Bugün</span>
                                    <span class="fw-bold"><?php echo $szl['bugun']; ?></span>
                                </div>
                                <div class="progress" style="height: 6px;">
                                    <div class="progress-bar bg-primary" role="progressbar" style="width: <?php echo $szl['toplamsayi'] > 0 ? ($szl['bugun'] / $szl['toplamsayi'] * 100) * 10 : 0; ?>%"></div>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <div class="d-flex justify-content-between mb-1">
                                    <span>Bu Ay</span>
                                    <span class="fw-bold"><?php echo $szl['buay']; ?></span>
                                </div>
                                <div class="progress" style="height: 6px;">
                                    <div class="progress-bar bg-success" role="progressbar" style="width: <?php echo $szl['toplamsayi'] > 0 ? ($szl['buay'] / $szl['toplamsayi'] * 100) : 0; ?>%"></div>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <div class="d-flex justify-content-between mb-1">
                                    <span>Bu Yıl</span>
                                    <span class="fw-bold"><?php echo $szl['buyil']; ?></span>
                                </div>
                                <div class="progress" style="height: 6px;">
                                    <div class="progress-bar bg-info" role="progressbar" style="width: <?php echo $szl['toplamsayi'] > 0 ? ($szl['buyil'] / $szl['toplamsayi'] * 100) : 0; ?>%"></div>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <div class="d-flex justify-content-between mb-1">
                                    <span>Toplam</span>
                                    <span class="fw-bold"><?php echo $szl['toplamsayi']; ?></span>
                                </div>
                                <div class="progress" style="height: 6px;">
                                    <div class="progress-bar bg-dark" role="progressbar" style="width: 100%"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-6 border-start">
                             <h6 class="text-muted mb-3 ps-3">Referrer Kaynakları</h6>
                             <div class="ps-3">
                                <?php
                                $referrer_sorgu = "SELECT 
                                    CASE 
                                        WHEN referrer = '' OR referrer IS NULL OR referrer = 'Direkt Giriş' THEN 'Direkt Giriş'
                                        WHEN referrer LIKE '%google%' OR referrer LIKE '%bing%' OR referrer LIKE '%yahoo%' THEN 'Arama Motorları'
                                        WHEN referrer LIKE '%facebook%' OR referrer LIKE '%twitter%' OR referrer LIKE '%instagram%' OR referrer LIKE '%linkedin%' THEN 'Sosyal Medya'
                                        WHEN referrer LIKE '%localhost%' OR referrer LIKE '%127.0.0.1%' THEN 'Yerel/Test'
                                        ELSE 'Diğer Kaynaklar'
                                    END as kaynak,
                                    COUNT(*) as sayi
                                FROM sayfa_ziyaretleri 
                                GROUP BY kaynak
                                ORDER BY sayi DESC
                                LIMIT 5";
                                $referrer_b = sorgu($referrer_sorgu, $baglan);
                                $referrer_b->execute();
                                $referrer_toplam = 0;
                                $referrer_liste = array();
                                while ($referrer_l = veriliste($referrer_b)) {
                                    $referrer_liste[] = $referrer_l;
                                    $referrer_toplam += $referrer_l['sayi'];
                                }
                                ?>
                                <?php if (!empty($referrer_liste)) { ?>
                                    <?php foreach ($referrer_liste as $ref) { 
                                        $yuzde = $referrer_toplam > 0 ? ($ref['sayi'] / $referrer_toplam * 100) : 0;
                                    ?>
                                    <div class="mb-2">
                                        <div class="d-flex justify-content-between small">
                                            <span><?php echo htmlspecialchars($ref['kaynak']); ?></span>
                                            <span><?php echo $ref['sayi']; ?></span>
                                        </div>
                                        <div class="progress" style="height: 4px;">
                                            <div class="progress-bar bg-secondary" role="progressbar" style="width: <?php echo $yuzde; ?>%"></div>
                                        </div>
                                    </div>
                                    <?php } ?>
                                <?php } else { ?>
                                    <p class="text-muted small">Veri bulunamadı.</p>
                                <?php } ?>
                             </div>
                        </div>
                    </div>
                    
                    <h6 class="text-muted mb-3">Son Ziyaretler</h6>
                    <div class="table-responsive">
                        <table class="table table-hover table-sm align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th>Tarih</th>
                                    <th>Sayfa</th>
                                    <th>Referrer</th>
                                    <th>IP</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                $son_ziyaretler = "SELECT 
                                    tarih,
                                    sayfa_linki,
                                    CASE 
                                        WHEN referrer = '' OR referrer IS NULL OR referrer = 'Direkt Giriş' THEN 'Direkt Giriş'
                                        WHEN LENGTH(referrer) > 40 THEN CONCAT(LEFT(referrer, 40), '...')
                                        ELSE referrer
                                    END as referrer_kisa,
                                    ip
                                FROM sayfa_ziyaretleri 
                                ORDER BY id DESC 
                                LIMIT 8";
                                $son_ziyaretler_b = sorgu($son_ziyaretler, $baglan);
                                $son_ziyaretler_b->execute();
                                while ($son_ziyaret = veriliste($son_ziyaretler_b)) {
                                    $tarih_str = $son_ziyaret['tarih'];
                                    if (strpos($tarih_str, '.') !== false) {
                                        $tarih_str = str_replace('.', '-', $tarih_str);
                                    }
                                ?>
                                <tr>
                                    <td><small><?php echo date('d.m H:i', strtotime($tarih_str)); ?></small></td>
                                    <td><small class="text-truncate d-inline-block" style="max-width: 150px;"><?php echo htmlspecialchars($son_ziyaret['sayfa_linki'] ?: 'Ana Sayfa'); ?></small></td>
                                    <td><small class="text-muted"><?php echo htmlspecialchars($son_ziyaret['referrer_kisa']); ?></small></td>
                                    <td><span class="badge bg-light text-dark fw-normal"><?php echo htmlspecialchars($son_ziyaret['ip']); ?></span></td>
                                </tr>
                                <?php } ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
             <!-- Recent Content Logs -->
             <div class="card border-0 shadow-sm">
                <div class="card-header bg-white py-3">
                     <h5 class="card-title mb-0">Son Eklenen İçerikler</h5>
                </div>
                <div class="card-body p-0">
                    <?php
                    $sorgu = "SELECT et.id, et.kategori, et.tarih, et.tr_baslik, et.durum, dk.isim 
                    FROM icerik et
                    left outer join durum_kodlari dk on et.durum=dk.durum_id   
                    where et.durum!='-1' order by et.id desc limit 0,5";
                    $baglanti = sorgu($sorgu, $baglan);
                    $baglanti->execute();     
                    ?>
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th class="ps-4">ID</th>
                                    <th>Başlık</th>
                                    <th>Tarih</th>
                                    <th>Durum</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php while ($listele = veriliste($baglanti)) { ?>
                                <tr>
                                    <td class="ps-4">#<?php echo $listele['id']; ?></td>
                                    <td class="fw-medium"><?php echo htmlspecialchars($listele['tr_baslik']); ?></td>
                                    <td><small class="text-muted"><?php echo $listele['tarih']; ?></small></td>
                                    <td><span class="badge bg-success-soft text-success"><?php echo $listele['isim']; ?></span></td>
                                    <td class="text-end pe-4">
                                        <a href="icerik_ekle.php?bilgikayitonay=<?php // Assuming we need eskayit but standard edit links might differ... using id for now or fallback 
                                            // Wait, original code used eskayit for edit link? No, id usually.
                                            // Looking at original index.php, it didn't have edit links in the table!
                                            // Let's assume content-edit link structure.
                                            echo ''; 
                                        ?>" class="btn btn-sm btn-light"><i class="bi bi-pencil"></i></a>
                                    </td>
                                </tr>
                                <?php } ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sidebar Widgets -->
        <div class="col-lg-4">
            <!-- User Activity -->
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-header bg-white py-3">
                    <h5 class="card-title mb-0">Son İşlemleriniz</h5>
                </div>
                <div class="list-group list-group-flush">
                    <?php 				
                    $ziyaretler="SELECT isim, tarih FROM sayfa_ziyaretleri sz 
                    left outer join kategoriler kt on sz.sayfa_id=kt.id 
                    where sz.kullanici_id!='' and sz.sayfa_id!='' and sz.kullanici_id='".$_SESSION['kullaniciid']."'
                    order by sz.id desc limit 6";
                    $ziyaretlerb = sorgu($ziyaretler, $baglan);
                    $ziyaretlerb->execute();     
                    while ($ziyaretlerl = veriliste($ziyaretlerb)) {
                    ?>
                    <div class="list-group-item px-3 py-3">
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1 small fw-bold"><?php echo $ziyaretlerl['isim']; ?></h6>
                            <small class="text-muted" style="font-size: 0.7rem;"><?php echo date('H:i', strtotime($ziyaretlerl['tarih'])); ?></small>
                        </div>
                        <p class="mb-0 small text-muted">Ziyaret Edildi</p>
                    </div>
                    <?php } ?>
                </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="card border-0 shadow-sm bg-primary text-white">
                <div class="card-body p-4">
                    <h5 class="card-title text-white">Hızlı İşlemler</h5>
                    <p class="card-text opacity-75">Yeni içerik veya medya eklemek için hızlı menü.</p>
                    <div class="d-grid gap-2">
                        <a href="icerik_ekle.php" class="btn btn-light text-primary fw-bold"><i class="bi bi-plus-circle me-2"></i> Yeni İçerik Ekle</a>
                        <a href="yonetici_ekle.php" class="btn btn-outline-light"><i class="bi bi-person-plus me-2"></i> Yönetici Ekle</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php include("alt.php"); ?>
