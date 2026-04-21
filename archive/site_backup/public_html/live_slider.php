
		<div class="section mt-0">
			<div id="mainSliderWrapper">
				<div class="loading-content">
					<div class="inner-circles-loader"></div>
				</div>
				<div class="main-slider mb-0 arrows-white" id="mainSlider" data-slick='{"arrows": true, "responsive":[{"breakpoint": 768,"settings":{"arrows": false, "dots": true }}]}'>
                    
    <?php
$slider = "SELECT  et.id,
tr_baslik,
tr_icerik,
en_baslik,
en_icerik,
ru_baslik,
ru_icerik,
ar_baslik,
ar_icerik,
fr_baslik,
fr_icerik,
de_baslik,
de_icerik,
cin_baslik,
cin_icerik,
et.kayit_tarihi,
(select eb.belge from icerik_belge eb where et.eskayit=eb.kayit_id AND  eb.durum!='-1' ORDER BY eb.id DESC LIMIT 0,1) belge  
FROM   icerik et  where kategori='8' and durum!='-1'   order by et.id desc limit 0,2";
$sliderb = sorgu($slider, $baglan);
$sliderb->execute();
                    
                    
                 
                                    
?>   
             <?php while ($sliderl =veriliste($sliderb)) {  ?>                  
					<div class="slide">
                        <?php 
                        $file_ext = strtolower(pathinfo($sliderl['belge'], PATHINFO_EXTENSION));
                        if (in_array($file_ext, ['mp4', 'webm', 'ogg'])): ?>
                            <div class="video--holder">
                                <video autoplay muted loop playsinline class="hero-video">
                                    <source src="yonetim/dosya/<?php echo $sliderl['belge']; ?>" type="video/<?php echo $file_ext; ?>">
                                </video>
                                <div class="video-overlay"></div>
                            </div>
                        <?php else: ?>
                            <div class="img--holder" data-animation="kenburns" data-bg="yonetim/dosya/<?php echo $sliderl['belge']; ?>"></div>
                        <?php endif; ?>
						<div class="slide-content center">
							<div class="vert-wrap container">
								<div class="vert">
									<div class="container">
										<div class="slide-txt1" data-animation="fadeInDown" data-animation-delay="1s"> 
											<br><b><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo $sliderl['tr_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo $sliderl['en_baslik'];}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo $sliderl['ru_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo $sliderl['ar_baslik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo $sliderl['de_baslik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo $sliderl['fr_baslik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo $sliderl['cin_baslik'];}?> </b></div>
										<div class="slide-txt2" data-animation="fadeInUp" data-animation-delay="1.5s"><?php 
								   if (empty($_GET['LN']) || $_GET['LN'] === 'TR') {echo $sliderl['tr_icerik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='EN') {echo $sliderl['en_icerik'];}
								   if (isset($_GET['LN']) && $_GET['LN']=='RU') {echo $sliderl['ru_icerik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='AR') {echo $sliderl['ar_icerik'];} 
								   if (isset($_GET['LN']) && $_GET['LN']=='DE') {echo $sliderl['de_icerik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='FR') {echo $sliderl['fr_icerik'];}
                                   if (isset($_GET['LN']) && $_GET['LN']=='CIN') {echo $sliderl['cin_icerik'];}?></div>
										<div class="slide-btn">								<a href="<?php echo get_menu_link('hizmetler.php', isset($_GET['LN']) ? $_GET['LN']:'TR'); ?>" class="btn" data-animation="fadeInUp" data-animation-delay="1.5s"><i class="icon-right-arrow"></i><span><?php echo metin('btn_hizmetler'); ?> </span><i class="icon-right-arrow"></i></a></div>
									</div>
								</div>
							</div>
						</div>
					</div>
<?php } ?>				
                </div>
			</div>
		</div>
