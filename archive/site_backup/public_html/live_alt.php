 
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
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "Address";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "تبوك";}
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "die Anschrift";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "Address";}?></h3>
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
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "Carte";}?></span><i class="icon-right-arrow"></i></a>
						</li>
						 
					</ul>
				</div>
                <div class="col-sm-6 col-lg-4">
					<h3><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "İletişim";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "Contact";}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "Коммуникация";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "تواصل";}
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "Kontakt";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "la communication";}?></h3>
					<div class="h-decor"></div>
					<ul class="icn-list">
						 
						<li><i class="icon-telephone"></i><b><span class="phone"><span class="text-nowrap"><?php echo $ayarlarl['telefon']; ?></span> </span></b>
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
						<a href="#"><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "Tüm Hakları Saklıdır";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "All rights reserved";}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "كل الحقوق محفوظة";}
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "Alle Rechte vorbehalten";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "";}?>.</a><span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span>
                    <a target="_blank" href="aydinlatmametni.pdf"><?php 
if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "KVKK Metni";} 
if (isset($_GET['LN']) && $_GET['LN'] == 'EN') {echo "KVKK Text";}
if (isset($_GET['LN']) && $_GET['LN'] == 'RU') {echo "Текст KVKK";} 
if (isset($_GET['LN']) && $_GET['LN'] == 'AR') {echo "نص KVKK";}
if (isset($_GET['LN']) && $_GET['LN'] == 'DE') {echo "KVKK-Text";}
if (isset($_GET['LN']) && $_GET['LN'] == 'FR') {echo "Texte KVKK";}
?></a></div>
					<div class="col-sm-auto ml-auto"><span class="d-none d-sm-inline"><a href="#"><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "Yazılım";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "Software";}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "برمجة";}
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "Software";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "";}?></a> : <a href="https://eyalcin.com" target="_blank" style="color: green">eyalcin</a></div>
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
						<a id="zl-url" class="zl-url" href="https://www.doktortakvimi.com/gokce-ozel/kulak-burun-bogaz/ankara" rel="nofollow" data-zlw-doctor="gokce-ozel" data-zlw-type="big_with_calendar" data-zlw-opinion="false" data-zlw-hide-branding="true">Gökçe Özel - DoktorTakvimi.com</a><script>!function($_x,_s,id){var js,fjs=$_x.getElementsByTagName(_s)[0];if(!$_x.getElementById(id)){js = $_x.createElement(_s);js.id = id;js.src = "//platform.docplanner.com/js/widget.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","zl-widget-s");</script>
					</div>
				</div>
			</div>
		</div>
	</div>
	
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
    "message": "Sitemizden en iyi şekilde faydalanabilmeniz için çerezler kullanılmaktadır. Bu siteye giriş yaparak çerez kullanımını kabul etmiş sayılıyorsunuz.",
    "dismiss": "Tamam",
    "link": "Daha fazla bilgi",
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