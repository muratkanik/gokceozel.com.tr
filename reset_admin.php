<?php
// Password Reset Tool
// USAGE: Upload to yonetim/ directory and run in browser.
// DELETE AFTER USE!

include("baglanti/baglantilar_fonksiyonlar.php");

$message = "";

// Handle Password Reset
if (isset($_POST['reset_id']) && isset($_POST['new_pass'])) {
    $id = intval($_POST['reset_id']);
    $pass = md5($_POST['new_pass']); // Legacy system uses MD5
    
    $update = "UPDATE kullanicilar SET sifre = :pass WHERE id = :id";
    $stmt = $baglan->prepare($update);
    $stmt->execute([':pass' => $pass, ':id' => $id]);
    
    $message = "Şifre başarıyla güncellendi! Yeni şifre: <b>" . htmlspecialchars($_POST['new_pass']) . "</b>";
}

// List Users
$query = "SELECT id, kullanici_adi, adi_soyadi, durumu FROM kullanicilar";
$stmt = $baglan->query($query);
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Admin Şifre Sıfırlama</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background: #f8f9fa; padding: 50px; }
        .card { max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    </style>
</head>
<body>

<div class="card">
    <div class="card-header bg-danger text-white">
        <h5 class="mb-0">⚠️ Admin Şifre Sıfırlama Aracı</h5>
    </div>
    <div class="card-body">
        
        <?php if ($message): ?>
            <div class="alert alert-success"><?php echo $message; ?></div>
        <?php endif; ?>

        <p class="text-muted">Aşağıdaki listeden şifresini sıfırlamak istediğiniz kullanıcıyı seçin.</p>

        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Kullanıcı Adı</th>
                    <th>Ad Soyad</th>
                    <th>İşlem</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($users as $user): ?>
                <tr>
                    <td><?php echo $user['id']; ?></td>
                    <td><b><?php echo htmlspecialchars($user['kullanici_adi']); ?></b></td>
                    <td><?php echo htmlspecialchars($user['adi_soyadi']); ?></td>
                    <td>
                        <form method="POST" style="display:flex; gap:5px;">
                            <input type="hidden" name="reset_id" value="<?php echo $user['id']; ?>">
                            <input type="text" name="new_pass" class="form-control form-control-sm" placeholder="Yeni Şifre" required style="width:100px;">
                            <button type="submit" class="btn btn-sm btn-primary">Kaydet</button>
                        </form>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

        <div class="alert alert-warning mt-3">
            <small><b>ÖNEMLİ:</b> İşiniz bittiğinde bu dosyayı sunucudan silmeyi unutmayın!</small>
        </div>
        
        <div class="text-center mt-3">
            <a href="login.php" class="btn btn-secondary">Giriş Sayfasına Git</a>
        </div>

    </div>
</div>

</body>
</html>
