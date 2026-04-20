<!--footer-->
	<div class="footer mt-0">
		<div class="container">
			<div class="row py-1 py-md-2 px-lg-0">
				<div class="col-lg-4 footer-col1">
					<div class="row flex-column flex-md-row flex-lg-column">
						<div class="col-md col-lg-auto">
							 
							<div class="mt-2 mt-lg-0"></div>
							<div class="footer-social d-lg-none">
						 
							<a href="<?php echo $ayarlarl['facebook']; ?>"  target="blank" class="hovicon"><i style="font-size:25px; margin:10px" class="icofont-facebook"></i></a>
							<a href="<?php echo $ayarlarl['twitter']; ?>"  target="blank" class="hovicon"><i style="font-size:25px; margin:10px" class="icofont-twitter"></i></a>
							<a href="<?php echo $ayarlarl['instagram']; ?>"  target="blank" class="hovicon"><i style="font-size:25px; margin:10px" class="icofont-instagram"></i></a>
							<a href="<?php echo $ayarlarl['youtube']; ?>"  target="blank" class="hovicon"><i style="font-size:25px; margin:10px" class="icofont-youtube"></i></a>
							<a href="<?php echo $ayarlarl['linkedin']; ?>"  target="blank" class="hovicon"><i style="font-size:25px; margin:10px"  class="icofont-linkedin"></i></a>
							</div>
						</div>
						<div class="col-md">
						 
							<div class="footer-social d-none d-lg-block">
							<a href="<?php echo $ayarlarl['facebook']; ?>"  target="blank" class="hovicon"><i style="font-size:25px; margin:10px" class="icofont-facebook"></i></a>
							<a href="<?php echo $ayarlarl['twitter']; ?>"  target="blank" class="hovicon"><i style="font-size:25px; margin:10px" class="icofont-twitter"></i></a>
							<a href="<?php echo $ayarlarl['instagram']; ?>"  target="blank" class="hovicon"><i style="font-size:25px; margin:10px" class="icofont-instagram"></i></a>
							<a href="<?php echo $ayarlarl['youtube']; ?>"  target="blank" class="hovicon"><i style="font-size:25px; margin:10px" class="icofont-youtube"></i></a>
							<a href="<?php echo $ayarlarl['linkedin']; ?>"  target="blank" class="hovicon"><i style="font-size:25px; margin:10px"  class="icofont-linkedin"></i></a>
								
							</div>
						</div>
					</div>
				</div>
				 
				<div class="col-sm-6 col-lg-4">
					<h3><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "Adres";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "Address";}
								   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo "地址";}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "Address";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "تبوك";}
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "die Anschrift";}
   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "Address";}
   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo "地址";}?></h3>
					<div class="h-decor"></div>
					<ul class="icn-list">
						<li><i class="icon-placeholder2"></i><?php echo $ayarlarl['adres']; ?>
							<br>
							<a href="https://www.google.com/maps/place/Prof.+Dr.+G%C3%B6k%C3%A7e+%C3%96ZEL+%2F+BURUN+ESTET%C4%B0%C4%9E%C4%B0/@39.9119242,32.766782,17z/data=!3m1!4b1!4m5!3m4!1s0x14d34755b73ae471:0x504c6fee17d0559!8m2!3d39.9119201!4d32.7689707" target="_blank" class="btn btn-xs btn-gradient"><i class="icon-placeholder2"></i><span><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "Harita";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "Map";}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "карта";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "خريطة";}
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "Karte";}
   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "Carte";}
   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo "地图";}?></span><i class="icon-right-arrow"></i></a>
						</li>
						 
					</ul>
				</div>
                						<div class="footer-col">
							<h3><?php echo metin('footer_contact'); ?></h3>
					<div class="h-decor"></div>
					<ul class="icn-list">
						 
						<li><i class="icon-telephone"></i><b><span class="phone"><span class="text-nowrap" dir="ltr"><?php echo $ayarlarl['telefon']; ?></span> </span></b>
						 </li>
						<li><i class="icon-black-envelope"></i><a href="mailto:<?php echo $ayarlarl['mail']; ?>"><?php echo $ayarlarl['mail']; ?></a></li>
					</ul>
				</div>
			</div>
		</div>
		<div class="footer-bottom">
			<div class="container">
				<div class="row text-center text-md-left">
					<div class="col-sm">Copyright © 2022 <a href="#"><?php echo $ayarlarl['siteadi']; ?></a><span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span>
						<a href="index.php"><?php echo metin('footer_rights'); ?>.</a><span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span>
						<a target="_blank" href="aydinlatmametni.pdf"><?php if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "KVKK Metni";} ?></a>
						<?php if (isset($_SESSION['kvkk']) && !empty($_SESSION['kvkk'])) { ?>
							<span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span>
							<a href="https://gokceozel.com.tr/yonetim/dosya/<?php echo $_SESSION['kvkk']; ?>" target="_blank" class="white-text"><?php echo metin('kvkk_text'); ?></a>
						<?php } ?>
					</div>
					<div class="col-sm-auto ml-auto"><span class="d-none d-sm-inline">						<div class="footer-copyright">© 2023 <?php echo isset($ayarlarl['siteadi']) ? $ayarlarl['siteadi'] : 'Gökçe Özel'; ?>  <a href="https://eyalcin.com" target="_blank"><?php echo metin('footer_software'); ?></a> : <a href="https://eyalcin.com" target="_blank" style="color: green">eyalcin</a></div>
				</div>
			</div>
		</div>
	</div>
	<!--//footer-->
	<div class="backToTop js-backToTop">
		<i class="icon icon-up-arrow"></i>
	</div>
	<div class="modal modal-form modal-form-sm fade" id="modalQuestionForm">
		<div class="modal-dialog">
			<div class="modal-content">
				<button aria-label='Close' class='close' data-dismiss='modal'>
					<i class="icon-error"></i>
				</button>
				<div class="modal-body">
					<div class="modal-form">
						<h3>Ask a Question</h3>
						<form class="mt-15" id="questionForm" method="post" novalidate>
							<div class="successform">
								<p>Your message was sent successfully!</p>
							</div>
							<div class="errorform">
								<p>Something went wrong, try refreshing and submitting the form again.</p>
							</div>
							<div class="input-group">
								<span>
								<i class="icon-user"></i>
							</span>
								<input type="text" name="name" class="form-control" autocomplete="off" placeholder="Your Name*" />
							</div>
							<div class="input-group">
								<span>
									<i class="icon-email2"></i>
								</span>
								<input type="text" name="email" class="form-control" autocomplete="off" placeholder="Your Email*" />
							</div>
							<div class="input-group">
								<span>
									<i class="icon-smartphone"></i>
								</span>
								<input type="text" name="phone" class="form-control" autocomplete="off" placeholder="Your Phone" />
							</div>
							<textarea name="message" class="form-control" placeholder="Your comment*"></textarea>
							<div class="text-right mt-2">
								<button type="submit" class="btn btn-sm btn-hover-fill">Ask Now</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="modal modal-form fade" id="modalBookingForm">
		<div class="modal-dialog">
			<div class="modal-content">
				<button aria-label='Close' class='close' data-dismiss='modal'>
					<i class="icon-error"></i>
				</button>
				<div class="modal-body">
					<div class="modal-form">
						<h3>Randevu Oluşturun</h3>
						<?php if(!defined('IS_RANDEVU_PAGE')) { ?>
						<a id="zl-url-modal" class="zl-url" href="https://www.doktortakvimi.com/gokce-ozel/kulak-burun-bogaz/ankara" rel="nofollow" data-zlw-doctor="gokce-ozel" data-zlw-type="big_with_calendar" data-zlw-opinion="false" data-zlw-hide-branding="true">Gökçe Özel - DoktorTakvimi.com</a>
						<?php } ?>
					</div>
				</div>
			</div>
		</div>
	</div>
	
<?php
// Cookie mesajlarını belirle
    $cookie_message = '';
    $cookie_dismiss = 'Tamam';
    $cookie_link = 'Daha fazla bilgi';
    
    $ln_cookie = isset($_GET['LN']) ? strtoupper($_GET['LN']) : 'TR';

    if (empty($ln_cookie) || $ln_cookie === 'TR') {
        $cookie_message = !empty($ayarlarl['cookie_tr_message']) ? $ayarlarl['cookie_tr_message'] : 'Bu web sitesi, size en iyi deneyimi sunmak için çerezler kullanmaktadır. KVKK ve GDPR uyumlu olarak, çerez kullanımına izin vererek kişisel verilerinizin işlenmesini kabul etmiş olursunuz. Daha fazla bilgi için gizlilik politikamızı inceleyebilirsiniz.';
        $cookie_dismiss = !empty($ayarlarl['cookie_tr_dismiss']) ? $ayarlarl['cookie_tr_dismiss'] : 'Tamam';
        $cookie_link = !empty($ayarlarl['cookie_tr_link']) ? $ayarlarl['cookie_tr_link'] : 'Daha fazla bilgi';
    } elseif ($ln_cookie === 'EN') {
        $cookie_message = !empty($ayarlarl['cookie_en_message']) ? $ayarlarl['cookie_en_message'] : 'This website uses cookies to provide you with the best experience. By accepting cookie usage, you consent to the processing of your personal data in compliance with GDPR. For more information, please review our privacy policy.';
        $cookie_dismiss = !empty($ayarlarl['cookie_en_dismiss']) ? $ayarlarl['cookie_en_dismiss'] : 'OK';
        $cookie_link = !empty($ayarlarl['cookie_en_link']) ? $ayarlarl['cookie_en_link'] : 'Learn more';
    } elseif ($ln_cookie === 'RU') {
        $cookie_message = !empty($ayarlarl['cookie_ru_message']) ? $ayarlarl['cookie_ru_message'] : 'Этот веб-сайт использует файлы cookie для обеспечения наилучшего опыта. Принимая использование файлов cookie, вы соглашаетесь на обработку ваших персональных данных в соответствии с GDPR. Для получения дополнительной информации ознакомьтесь с нашей политикой конфиденциальности.';
        $cookie_dismiss = !empty($ayarlarl['cookie_ru_dismiss']) ? $ayarlarl['cookie_ru_dismiss'] : 'ОК';
        $cookie_link = !empty($ayarlarl['cookie_ru_link']) ? $ayarlarl['cookie_ru_link'] : 'Узнать больше';
    } elseif ($ln_cookie === 'AR') {
        $cookie_message = !empty($ayarlarl['cookie_ar_message']) ? $ayarlarl['cookie_ar_message'] : 'يستخدم هذا الموقع ملفات تعريف الارتباط لتزويدك بأفضل تجربة. من خلال قبول استخدام ملفات تعريف الارتباط، فإنك توافق على معالجة بياناتك الشخصية وفقًا لـ GDPR. لمزيد من المعلومات، يرجى مراجعة سياسة الخصوصية الخاصة بنا.';
        $cookie_dismiss = !empty($ayarlarl['cookie_ar_dismiss']) ? $ayarlarl['cookie_ar_dismiss'] : 'حسنا';
        $cookie_link = !empty($ayarlarl['cookie_ar_link']) ? $ayarlarl['cookie_ar_link'] : 'المزيد من المعلومات';
    } elseif ($ln_cookie === 'DE') {
        $cookie_message = !empty($ayarlarl['cookie_de_message']) ? $ayarlarl['cookie_de_message'] : 'Diese Website verwendet Cookies, um Ihnen die beste Erfahrung zu bieten. Durch die Annahme der Cookie-Nutzung stimmen Sie der Verarbeitung Ihrer personenbezogenen Daten gemäß DSGVO zu. Weitere Informationen finden Sie in unserer Datenschutzerklärung.';
        $cookie_dismiss = !empty($ayarlarl['cookie_de_dismiss']) ? $ayarlarl['cookie_de_dismiss'] : 'OK';
        $cookie_link = !empty($ayarlarl['cookie_de_link']) ? $ayarlarl['cookie_de_link'] : 'Mehr erfahren';
    } elseif ($ln_cookie === 'FR') {
        $cookie_message = !empty($ayarlarl['cookie_fr_message']) ? $ayarlarl['cookie_fr_message'] : 'Ce site Web utilise des cookies pour vous offrir la meilleure expérience. En acceptant l\'utilisation des cookies, vous consentez au traitement de vos données personnelles conformément au RGPD. Pour plus d\'informations, veuillez consulter notre politique de confidentialité.';
        $cookie_dismiss = !empty($ayarlarl['cookie_fr_dismiss']) ? $ayarlarl['cookie_fr_dismiss'] : 'OK';
        $cookie_link = !empty($ayarlarl['cookie_fr_link']) ? $ayarlarl['cookie_fr_link'] : 'En savoir plus';
    } elseif ($ln_cookie === 'CIN') {
        $cookie_message = !empty($ayarlarl['cookie_cin_message']) ? $ayarlarl['cookie_cin_message'] : '本网站使用 cookie 来为您提供最佳体验。接受 cookie 使用即表示您同意根据 GDPR 处理您的个人数据。有关更多信息，请查看我们的隐私政策。';
        $cookie_dismiss = !empty($ayarlarl['cookie_cin_dismiss']) ? $ayarlarl['cookie_cin_dismiss'] : '好';
        $cookie_link = !empty($ayarlarl['cookie_cin_link']) ? $ayarlarl['cookie_cin_link'] : '了解更多';
    }
    
    // Cookie mesajını JavaScript'e güvenli şekilde aktar
    $cookie_message_js = json_encode($cookie_message, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_UNICODE);
    $cookie_dismiss_js = json_encode($cookie_dismiss, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_UNICODE);
    $cookie_link_js = json_encode($cookie_link, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_UNICODE);
?>
<link rel="stylesheet" media="all" href="https://eyalcin.com/cerez/cerez.css" />
<script  src='https://eyalcin.com/cerez/cerez.js'></script>

<script>
window.addEventListener("load", function(){
window.cookieconsent.initialise({
  "palette": {
    "popup": {
      "background": "#646478",  
      "text": "#ffffff"  
    },
    "button": {
      "background": "#8ec760",  
      "text": "#ffffff"  
    }
  },
  "theme": "classic", 
  "content": {
    "message": <?php echo $cookie_message_js; ?>,
    "dismiss": <?php echo $cookie_dismiss_js; ?>,
    "link": <?php echo $cookie_link_js; ?>,
    "href": "cerez.htm"
  }
})});
</script>

	<script src="vendor/jquery/jquery-3.2.1.min.js"></script>
	<script src="vendor/jquery-migrate/jquery-migrate-3.0.1.min.js"></script>
	<script src="vendor/cookie/jquery.cookie.js"></script>
	<script src="vendor/bootstrap-datetimepicker/moment.js"></script>
	<script src="vendor/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js"></script>
	<script src="vendor/popper/popper.min.js"></script>
	<script src="vendor/bootstrap/bootstrap.min.js"></script>
	<script src="vendor/waypoints/jquery.waypoints.min.js"></script>
	<script src="vendor/waypoints/sticky.min.js"></script>
	<script src="vendor/imagesloaded/imagesloaded.pkgd.min.js"></script>
	<script src="vendor/slick/slick.min.js"></script>
	<script src="vendor/scroll-with-ease/jquery.scroll-with-ease.min.js"></script>
	<script src="vendor/countTo/jquery.countTo.js"></script>
	<script src="vendor/form-validation/jquery.form.js"></script>
	<script src="vendor/form-validation/jquery.validate.min.js"></script>
	<!-- Custom Scripts -->
	<script src="js/app.js"></script>
	<script src="js/app-shop.js"></script>
	<script src="form/forms.js"></script>
	<?php if(!defined('IS_RANDEVU_PAGE')) { ?>
	<script>
	// Lazy load widget only when modal is opened to prevent HierarchyRequestError
	$(document).ready(function() {
		$('#modalBookingForm').on('shown.bs.modal', function () {
			if (!document.getElementById('zl-widget-s')) {
				var js, fjs = document.getElementsByTagName('script')[0];
				js = document.createElement('script');
				js.id = 'zl-widget-s';
				js.src = "//platform.docplanner.com/js/widget.js";
				fjs.parentNode.insertBefore(js, fjs);
			}
		});
	});
	</script>
	<?php } ?>
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '918930983158761');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=918930983158761&ev=PageView&noscript=1"
/></noscript>

</body>

</html>