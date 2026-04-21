<?php
define('IS_RANDEVU_PAGE', true);
header('Content-Type: text/html; charset=utf-8');
mb_internal_encoding('UTF-8');
include("ust.php");

$is_tr = (empty($_GET['LN']) || strtoupper($_GET['LN']) === 'TR');
// Translations
$t_title = $is_tr ? "Randevu Al" : metin('page_contact_title');
$t_desc = $is_tr ? "Aşağıdaki formu doldurarak hızlıca randevu talebi oluşturabilirsiniz. Size en kısa sürede dönüş yapacağız." : metin('page_contact_desc');
$t_name = $is_tr ? "Adınız Soyadınız*" : "Your Name*";
$t_email = $is_tr ? "E-posta Adresiniz*" : "Your Email*";
$t_phone = $is_tr ? "Telefon Numaranız*" : "Your Phone*";
$t_msg = $is_tr ? "Mesajınız*" : "Your Message*";
$t_sec = $is_tr ? "Güvenlik Kodu*" : "Security Code*";
$t_sechint = $is_tr ? "Sağdaki kodu girin" : "Enter the code on the right";
$t_btn = $is_tr ? "Randevu Talebi Gönder" : "Send Appointment Request";

if (!$is_tr) {
    if (isset($_GET['LN']) && strtoupper($_GET['LN']) == 'RU') {
        $t_title = "Записаться на прием"; $t_desc = "Заполните форму ниже.";
        $t_name = "Ваше имя*"; $t_email = "Ваш email*"; $t_phone = "Ваш телефон*"; $t_msg = "Ваше сообщение*";
        $t_sec = "Код безопасности*"; $t_sechint = "Введите код выше"; $t_btn = "Отправить";
    } elseif (isset($_GET['LN']) && strtoupper($_GET['LN']) == 'AR') {
        $t_title = "تحديد موعد"; $t_desc = "يرجى ملء النموذج أدناه.";
        $t_name = "اسمك*"; $t_email = "البريد الإلكتروني*"; $t_phone = "هاتف*"; $t_msg = "الرسالة*";
        $t_sec = "رمز الأمان*"; $t_sechint = "أدخل الرمز"; $t_btn = "إرسال الطلب";
    }
}
?>
	<div class="page-content">
		<div class="section">
			<div class="container">
				<div class="row">
					<div class="col-md col-lg-5">
						<div class="pr-0 pr-lg-8">
							<div class="title-wrap">
								<h2><?php echo $t_title; ?></h2>
								<div class="h-decor"></div>
							</div>
							<div class="mt-2 mt-lg-4">
								<p><?php echo $t_desc; ?></p>
							</div>
							<div class="mt-2 mt-md-5">
								<form id="appointmentForm" method="post" novalidate>
									<div class="successform" style="display:none; color: green; font-weight: bold; margin-bottom: 15px;">
										<p></p>
									</div>
									<div class="errorform" style="display:none; color: red; font-weight: bold; margin-bottom: 15px;">
										<p></p>
									</div>
									<div class="input-group">
										<span><i class="icon-user"></i></span>
										<input type="text" name="ad" class="form-control" autocomplete="off" placeholder="<?php echo $t_name; ?>" required />
									</div>
									<div class="input-group">
										<span><i class="icon-email2"></i></span>
										<input type="email" name="mail" class="form-control" autocomplete="off" placeholder="<?php echo $t_email; ?>" required />
									</div>
									<div class="input-group">
										<span><i class="icon-smartphone"></i></span>
										<input type="text" name="telefon" class="form-control" autocomplete="off" placeholder="<?php echo $t_phone; ?>" required />
									</div>
									<textarea name="mesaj" class="form-control" placeholder="<?php echo $t_msg; ?>" required></textarea>
									<div class="form-group mt-3">
										<label class="control-label" style="font-size: 14px; margin-bottom: 5px;"><?php echo $t_sec; ?></label>
										<div class="row">
											<div class="col-sm-6">
												<input type="text" name="captcha_code" class="form-control" autocomplete="off" placeholder="<?php echo $t_sechint; ?>" required />
											</div>
											<div class="col-sm-6">
												<img src="yonetim/image.php" id="app_captcha_image" onclick="this.src='yonetim/image.php?rand=' + Math.random();" style="cursor: pointer; border: 1px solid #ddd; padding: 5px; height: 40px;" alt="Captcha" />
											</div>
										</div>
									</div>
									<div class="text-right mt-2">
										<button type="submit" class="btn btn-sm btn-hover-fill"><?php echo $t_btn; ?></button>
									</div>
								</form>
							</div>
<script>
document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById('appointmentForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var formData = new FormData(form);
        var successDiv = form.querySelector('.successform');
        var errorDiv = form.querySelector('.errorform');
        
        fetch('form/send_appointment.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                errorDiv.style.display = 'none';
                successDiv.querySelector('p').innerText = data.message;
                successDiv.style.display = 'block';
                form.reset();
                document.getElementById('app_captcha_image').src = 'form/captcha_image.php?rand=' + Math.random();
            } else {
                successDiv.style.display = 'none';
                errorDiv.querySelector('p').innerText = data.message;
                errorDiv.style.display = 'block';
                document.getElementById('app_captcha_image').src = 'form/captcha_image.php?rand=' + Math.random();
            }
        })
        .catch(err => {
            console.error(err);
        });
    });
});
</script>
							<div class="content-social mt-15">
								<a href="<?php echo $ayarlarl['facebook']; ?>" target="blank" class="hovicon"><i class="icon-facebook-logo"></i></a>
								<a href="<?php echo $ayarlarl['twitter']; ?>" target="blank" class="hovicon"><i class="icon-twitter-logo"></i></a>
								<a href="<?php echo $ayarlarl['instagram']; ?>" target="blank" class="hovicon"><i class="icon-instagram"></i></a>
							</div>
						</div>
					</div>
					<div class="col-md col-lg-6 mt-4 mt-md-0">
						<a id="zl-url-page" class="zl-url" href="https://www.doktortakvimi.com/gokce-ozel/kulak-burun-bogaz/ankara" rel="nofollow" data-zlw-doctor="gokce-ozel" data-zlw-type="big_with_calendar" data-zlw-opinion="false" data-zlw-hide-branding="true">Gökçe Özel - DoktorTakvimi.com</a>
						<script>!function($_x,_s,id){var js,fjs=$_x.getElementsByTagName(_s)[0];if(!$_x.getElementById(id)){js = $_x.createElement(_s);js.id = id;js.src = "//platform.docplanner.com/js/widget.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","zl-widget-s");</script>
					</div>
				</div>
			</div>
		</div>
	</div>
	<?php include("alt.php");?>