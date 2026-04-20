<?php 
header('Content-Type: text/html; charset=utf-8');
mb_internal_encoding('UTF-8');
include("ust.php");
?>
<div class="page-content">
        <!--section-->
		<div class="section">
			<div class="container">
				<div class="row">
					<div class="col-md col-lg-12">
						<div class="pr-0 pr-lg-8">
							<div class="title-wrap">
								<h2><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "Bize Yazın";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "Contact Us";}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "Связаться с нами";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "اتصل بنا";}
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "Kontaktiere uns";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "Nous contacter";}?></h2>
								<div class="h-decor"></div>
							</div>
							<div class="mt-2 mt-lg-4">
								<p><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "Genel sorularınız için lütfen bize bir mesaj gönderin, size hemen geri döneceğiz. Ayrıca görüşmek için bizi doğrudan arayabilirsiniz";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "For general inquiries, please send us a message and we will get back to you immediately. You can also call us directly to discuss.";}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "";}
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "";}?>.</p>
								<p class="p-sm">* <?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "ile işaretlenmiş alanlar gerekli";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "Fields marked with are required.";}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "";}
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "";}?>.</p>
							</div>
							<div class="mt-2 mt-md-5">
								<form id="contactForm" method="post" novalidate>
									<div class="successform">
										<p><?php 
										   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "Mesajınız başarıyla gönderildi!";} 
										   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "Your message was sent successfully!";}
										   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "";} 
										   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "";}
										   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "";}
                                           if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "";}?></p>
									</div>
									<div class="errorform">
										<p><?php 
										   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "Bir şeyler ters gitti. Lütfen sayfayı yenileyip tekrar deneyin.";} 
										   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "Something went wrong, try refreshing and submitting the form again.";}
										   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "";} 
										   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "";}
										   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "";}
                                           if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "";}?></p>
									</div>
									<div class="input-group">
										<span>
											<i class="icon-user"></i>
										</span>
										<input type="text" name="ad" class="form-control" autocomplete="off" placeholder="<?php 
										   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "Adınız Soyadınız*";} 
										   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "Your Name*";}
										   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "Ваше имя*";} 
										   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "اسمك*";}
										   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "Ihr Name*";}
                                           if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "Votre nom*";}?>" />
									</div>
									<div class="input-group">
										<span>
											<i class="icon-email2"></i>
										</span>
										<input type="text" name="mail" class="form-control" autocomplete="off" placeholder="<?php 
										   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "E-posta Adresiniz*";} 
										   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "Your Email*";}
										   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "Ваш email*";} 
										   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "بريدك الإلكتروني*";}
										   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "Ihre E-Mail*";}
                                           if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "Votre email*";}?>" />
									</div>
									<div class="input-group">
										<span>
											<i class="icon-smartphone"></i>
										</span>
										<input type="text" name="telefon" class="form-control" autocomplete="off" placeholder="<?php 
										   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "Telefon Numaranız";} 
										   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "Your Phone";}
										   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "Ваш телефон";} 
										   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "رقم هاتفك";}
										   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "Ihre Telefonnummer";}
                                           if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "Votre téléphone";}?>" />
									</div>
									<textarea name="mesaj" class="form-control" placeholder="<?php 
									   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "Mesajınız*";} 
									   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "Your Message*";}
									   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "Ваше сообщение*";} 
									   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "رسالتك*";}
									   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "Ihre Nachricht*";}
                                       if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "Votre message*";}?>" ></textarea>
									<div class="form-group mt-3">
										<label class="control-label" style="font-size: 14px; margin-bottom: 5px;">
											<?php 
											if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "Güvenlik Kodu*";} 
											if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "Security Code*";}
											if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "Код безопасности*";} 
											if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "رمز الأمان*";}
											if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "Sicherheitscode*";}
											if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "Code de sécurité*";}?>
										</label>
										<div class="row">
											<div class="col-sm-6">
												<input type="text" name="captcha_code" class="form-control" autocomplete="off" placeholder="<?php 
												   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "Yukarıdaki kodu girin";} 
												   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "Enter the code above";}
												   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "Введите код выше";} 
												   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "أدخل الرمز أعلاه";}
												   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "Geben Sie den Code oben ein";}
												   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "Entrez le code ci-dessus";}?>" />
											</div>
											<div class="col-sm-6">
												<img src="form/captcha_image.php" id="captcha_image" onclick="this.src='form/captcha_image.php?rand=' + Math.random();" style="cursor: pointer; border: 1px solid #ddd; padding: 5px; height: 40px;" alt="Güvenlik Kodu" title="<?php 
												   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "Yenilemek için tıklayın";} 
												   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "Click to refresh";}
												   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "Нажмите, чтобы обновить";} 
												   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "انقر للتحديث";}
												   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "Zum Aktualisieren klicken";}
												   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "Cliquez pour actualiser";}?>" />
											</div>
										</div>
									</div>
									<div class="text-right mt-2">
										<button type="submit" class="btn btn-sm btn-hover-fill"><?php 
										   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "Gönder";} 
										   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "Send";}
										   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "Отправить";} 
										   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "إرسال";}
										   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "Senden";}
                                           if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "Envoyer";}?></button>
									</div>
								</form>
							</div>
					 
							<div class="content-social mt-15">
							<a href="<?php echo $ayarlarl['facebook']; ?>"  target="blank" class="hovicon"><i style="font-size:25px; margin:10px" class="icofont-facebook"></i></a>
							<a href="<?php echo $ayarlarl['twitter']; ?>"  target="blank" class="hovicon"><i style="font-size:25px; margin:10px" class="icofont-twitter"></i></a>
							<a href="<?php echo $ayarlarl['instagram']; ?>"  target="blank" class="hovicon"><i style="font-size:25px; margin:10px" class="icofont-instagram"></i></a>
							<a href="<?php echo $ayarlarl['youtube']; ?>"  target="blank" class="hovicon"><i style="font-size:25px; margin:10px" class="icofont-youtube"></i></a>
							<a href="<?php echo $ayarlarl['linkedin']; ?>"  target="blank" class="hovicon"><i style="font-size:25px; margin:10px"  class="icofont-linkedin"></i></a>
							</div>
						</div>
					</div>
					 
				</div>
			</div>
		</div>
		<!--//section-->
		<br><br>
		<!--section-->
		<div class="section mt-0 bg-grey">
			<div class="container">
				<div class="row">
					<div class="col-md">
						<div class="title-wrap">
							<h5><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "Adres";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "Address";}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "Адрес";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "عنوان";}
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "Anschrift";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "Adresse";}?></h5>
							<div class="h-decor"></div>
						</div>
						<ul class="icn-list-lg">
							<li><i class="icon-placeholder2"></i> <?php echo $ayarlarl['siteadi']; ?>
								<br><?php echo $ayarlarl['adres']; ?>
							</li>
						</ul>
					</div>
					<div class="col-md mt-3 mt-md-0">
						<div class="title-wrap">
							<h5><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "İletişim";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "Contact";}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "Коммуникация";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "تواصل";}
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "Kontakt";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "la communication";}?></h5>
							<div class="h-decor"></div>
						</div>
						<ul class="icn-list-lg">
							<li><i class="icon-telephone"></i><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "Telefon";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "Telephone";}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "телефон";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "هاتف";}
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "Telefon";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "Téléphone";}?>: <span class="theme-color"> <span class="text-nowrap" dir="ltr"><?php echo $ayarlarl['telefon']; ?> </span>
								</span>
							 
								</span>
							</li>
							<li><i class="icon-black-envelope"></i><a href="mailto:<?php echo $ayarlarl['mail']; ?>"><?php echo $ayarlarl['mail']; ?> </a></li>
						</ul>
					</div>
					<div class="col-md mt-3 mt-md-0">
						<div class="title-wrap">
							<h5><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo "Çalışma Saatleri";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo "Working hours";}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo "Рабочие часы";} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo "ساعات العمل";}
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo "Arbeitszeit";}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo "Heures d'ouverture";}?></h5>
							<div class="h-decor"></div>
						</div>
						<ul class="icn-list-lg">
							<li><i class="icon-clock"></i>
								<div>
									<div class="d-flex"><span>Pzt-Cum</span><span class="theme-color">08:00 - 18:00</span></div>
									<div class="d-flex"><span>Cumartesi</span><span class="theme-color">09:00 - 16:00</span></div>
									<div class="d-flex"><span>Pazar</span><span class="theme-color">Kapalı</span></div>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<!--//section-->
		<!--section-->
		<div class="section mt-0">
		<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3060.3170684191655!2d32.7689707!3d39.911920099999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34755b73ae471%3A0x504c6fee17d0559!2zUHJvZi4gRHIuIEfDtmvDp2Ugw5ZaRUwgLyBCVVJVTiBFU1RFVMSwxJ7EsA!5e0!3m2!1str!2str!4v1654012468825!5m2!1str!2str" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
		</div>
		<!--//section-->
	</div>
	<?php include("alt.php");?>