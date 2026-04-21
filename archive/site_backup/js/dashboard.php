<? 
$baglan= EvrakConnectDB();
?>
<script type="text/javascript">

jQuery(document).ready(function(){
    
    "use strict";

    function showTooltip(x, y, contents) {
	jQuery('<div id="tooltip" class="tooltipflot">' + contents + '</div>').css( {
	    position: 'absolute',
	    display: 'none',
	    top: y + 5,
	    left: x + 5
	}).appendTo("body").fadeIn(200);
    }
    
    /*****SIMPLE CHART*****/
	
											<?	
										   
										   
										   	$yil2 = date("Y", strtotime('-1 years')); 
											$yilbaslangic2=$yil2."-01-01 00:00";
											$yilbitis2=$yil2."-12-31 23:59";
											$bulunduguyilbaslangic=date("Y")."-01-01 00:00"; 
											$bulunduguyilbitis=date("Y")."-12-31 23:59"; 
										   
										   
										   	$acilantoplam = "select   ay as ayal,sum(atacsayi) sayial   from (
															SELECT  month(kayit_tarihi) AY, count([id]) atacsayi FROM [KURUMSALABONE].[dbo].[ariza_takip] where durum!='-1' and 
											kayit_tarihi between '".$bulunduguyilbaslangic."' and '".$bulunduguyilbitis."' group by month(kayit_tarihi)
															union
															SELECT  month(kayit_tarihi) AY, count([id]) etacsayi FROM [KURUMSALABONE].[dbo].[envanter_takip] where   durum!='-1' and 
											kayit_tarihi between '".$bulunduguyilbaslangic."' and '".$bulunduguyilbitis."' group by month(kayit_tarihi)
															union
															SELECT  month(kayit_tarihi) AY, count([id]) ptacsayi FROM [KURUMSALABONE].[dbo].[proje_takip_kayit] where   durum!='-1'  and 
											kayit_tarihi between '".$bulunduguyilbaslangic."' and '".$bulunduguyilbitis."'group by month(kayit_tarihi)
															union
															SELECT  month(kayit_tarihi) AY, count([id]) ttacsayi FROM [KURUMSALABONE].[dbo].teknik_servis_malzeme_kayit where   durum!='-1' and 
											kayit_tarihi between '".$bulunduguyilbaslangic."' and '".$bulunduguyilbitis."' group by month(kayit_tarihi)
															union
															SELECT  month(kayit_tarihi) AY, count([id]) ptdaciksayi FROM [KURUMSALABONE].[dbo].[proje_takip_kayit_detay] where  durum!='1' and 
											kayit_tarihi between '".$bulunduguyilbaslangic."' and '".$bulunduguyilbitis."' group by month(kayit_tarihi)
															) a group by ay";
                                            $acilantoplamb = sorgu($acilantoplam, $baglan);
                                            $acilantoplaml = satirsay($acilantoplamb);
											
											
											$gacilantoplam = "select   ay as ayal,sum(atacsayi) sayial   from (
															SELECT  month(kayit_tarihi) AY, count([id]) atacsayi FROM [KURUMSALABONE].[dbo].[ariza_takip] where durum!='-1' and 
											kayit_tarihi between '".$yilbaslangic2."' and '".$yilbitis2."' group by month(kayit_tarihi)
															union
															SELECT  month(kayit_tarihi) AY, count([id]) etacsayi FROM [KURUMSALABONE].[dbo].[envanter_takip] where   durum!='-1' and 
											kayit_tarihi between '".$yilbaslangic2."' and '".$yilbitis2."' group by month(kayit_tarihi)
															union
															SELECT  month(kayit_tarihi) AY, count([id]) ptacsayi FROM [KURUMSALABONE].[dbo].[proje_takip_kayit] where   durum!='-1'  and 
											kayit_tarihi between '".$yilbaslangic2."' and '".$yilbitis2."'group by month(kayit_tarihi)
															union
															SELECT  month(kayit_tarihi) AY, count([id]) ttacsayi FROM [KURUMSALABONE].[dbo].teknik_servis_malzeme_kayit where   durum!='-1' and 
											kayit_tarihi between '".$yilbaslangic2."' and '".$yilbitis2."' group by month(kayit_tarihi)
															union
															SELECT  month(kayit_tarihi) AY, count([id]) ptdaciksayi FROM [KURUMSALABONE].[dbo].[proje_takip_kayit_detay] where  durum!='1' and 
											kayit_tarihi between '".$yilbaslangic2."' and '".$yilbitis2."' group by month(kayit_tarihi)
															) a group by ay";
                                            $gacilantoplamb = sorgu($gacilantoplam, $baglan);
                                            $gacilantoplaml = satirsay($gacilantoplamb);
											
											
											?>
	
	
    


    var newCust = [
	<?  if ($gacilantoplamb!='') {  ?><? do {?>
	<? if ($gacilantoplaml['ayal']=='0') {?>[<? echo $gacilantoplaml['ayal']?>, <? echo $gacilantoplaml['sayial']?>],<? }?> 
	<? if ($gacilantoplaml['ayal']=='1') {?>[<? echo $gacilantoplaml['ayal']?>, <? echo $gacilantoplaml['sayial']?>],<? }?> 
	<? if ($gacilantoplaml['ayal']=='2') {?>[<? echo $gacilantoplaml['ayal']?>, <? echo $gacilantoplaml['sayial']?>],<? }?> 
	<? if ($gacilantoplaml['ayal']=='3') {?>[<? echo $gacilantoplaml['ayal']?>, <? echo $gacilantoplaml['sayial']?>],<? }?>
	<? if ($gacilantoplaml['ayal']=='4') {?>[<? echo $gacilantoplaml['ayal']?>, <? echo $gacilantoplaml['sayial']?>],<? }?>  
	<? if ($gacilantoplaml['ayal']=='5') {?>[<? echo $gacilantoplaml['ayal']?>, <? echo $gacilantoplaml['sayial']?>],<? }?>  
	<? if ($gacilantoplaml['ayal']=='6') {?>[<? echo $gacilantoplaml['ayal']?>, <? echo $gacilantoplaml['sayial']?>],<? }?>  
	<? if ($gacilantoplaml['ayal']=='7') {?>[<? echo $gacilantoplaml['ayal']?>, <? echo $gacilantoplaml['sayial']?>],<? }?>  
	<? if ($gacilantoplaml['ayal']=='8') {?>[<? echo $gacilantoplaml['ayal']?>, <? echo $gacilantoplaml['sayial']?>],<? }?>  
	<? if ($gacilantoplaml['ayal']=='9') {?>[<? echo $gacilantoplaml['ayal']?>, <? echo $gacilantoplaml['sayial']?>],<? }?> 
	<? if ($gacilantoplaml['ayal']=='10') {?>[<? echo $gacilantoplaml['ayal']?>, <? echo $gacilantoplaml['sayial']?>],<? }?> 
	<? if ($gacilantoplaml['ayal']=='11') {?>[<? echo $gacilantoplaml['ayal']?>, <? echo $gacilantoplaml['sayial']?>],<? }?>  
	<? if ($gacilantoplaml['ayal']=='12') {?>[<? echo $gacilantoplaml['ayal']?>, <? echo $gacilantoplaml['sayial']?>]<? }?>
	<? } while ($gacilantoplaml = satirsay($gacilantoplamb)); ?><? } ?>
	];
	
	
	
	var retCust = [
	<?  if ($acilantoplamb!='') {  ?><? do {?>
	<? if ($acilantoplaml['ayal']=='0') {?>[<? echo $acilantoplaml['ayal']?>, <? echo $acilantoplaml['sayial']?>],<? }?> 
	<? if ($acilantoplaml['ayal']=='1') {?>[<? echo $acilantoplaml['ayal']?>, <? echo $acilantoplaml['sayial']?>],<? }?>
	<? if ($acilantoplaml['ayal']=='2') {?>[<? echo $acilantoplaml['ayal']?>, <? echo $acilantoplaml['sayial']?>],<? }?> 
	<? if ($acilantoplaml['ayal']=='3') {?>[<? echo $acilantoplaml['ayal']?>, <? echo $acilantoplaml['sayial']?>],<? }?> 
	<? if ($acilantoplaml['ayal']=='4') {?>[<? echo $acilantoplaml['ayal']?>, <? echo $acilantoplaml['sayial']?>],<? }?> 
	<? if ($acilantoplaml['ayal']=='5') {?>[<? echo $acilantoplaml['ayal']?>, <? echo $acilantoplaml['sayial']?>],<? }?>
	<? if ($acilantoplaml['ayal']=='6') {?>[<? echo $acilantoplaml['ayal']?>, <? echo $acilantoplaml['sayial']?>],<? }?>  
	<? if ($acilantoplaml['ayal']=='7') {?>[<? echo $acilantoplaml['ayal']?>, <? echo $acilantoplaml['sayial']?>],<? }?>  
	<? if ($acilantoplaml['ayal']=='8') {?>[<? echo $acilantoplaml['ayal']?>, <? echo $acilantoplaml['sayial']?>],<? }?>  
	<? if ($acilantoplaml['ayal']=='9') {?>[<? echo $acilantoplaml['ayal']?>, <? echo $acilantoplaml['sayial']?>],<? }?>  
	<? if ($acilantoplaml['ayal']=='10') {?>[<? echo $acilantoplaml['ayal']?>, <? echo $acilantoplaml['sayial']?>],<? }?> 
	<? if ($acilantoplaml['ayal']=='11') {?>[<? echo $acilantoplaml['ayal']?>, <? echo $acilantoplaml['sayial']?>],<? }?> 
	<? if ($acilantoplaml['ayal']=='12') {?>[<? echo $acilantoplaml['ayal']?>, <? echo $acilantoplaml['sayial']?>]<? }?>
	<? } while ($acilantoplaml = satirsay($acilantoplamb)); ?><? } ?>
	];
	
	
    var plot = jQuery.plot(jQuery("#basicflot"),
	[{
	    data: newCust,
	    label: "Önceki yıl",
	    color: "#03c3c4"
	},
        {
	    data: retCust,
	    label: "Bu Yıl",
	    color: "#905dd1"
        }
	],
	{
	    series: {
		lines: {
		    show: false
		},
		splines: {
		    show: true,
		    tension: 0.4,
		    lineWidth: 1,
		    fill: 0.4
		},
		shadowSize: 0
	    },
	    points: {
		show: true,
	    },
	    legend: {
		container: '#basicFlotLegend',
                noColumns: 0
	    },
	    grid: {
		hoverable: true,
		clickable: true,
		borderColor: '#ddd',
		borderWidth: 0,
		labelMargin: 10,
		backgroundColor: '#fff'
	    },
	    yaxis: {
		min: 0,
		max: 2000,
		color: '#eee'
	    },
	    xaxis: {
		color: '#eee'
	    }
	});
		
	var previousPoint = null;
	jQuery("#basicflot").bind("plothover", function (event, pos, item) {
	jQuery("#x").text(pos.x.toFixed(0));
	jQuery("#y").text(pos.y.toFixed(0));
			
	if(item) {
	    if (previousPoint != item.dataIndex) {
		previousPoint = item.dataIndex;
						
		jQuery("#tooltip").remove();
		var x = item.datapoint[0].toFixed(0),
		y = item.datapoint[1].toFixed(0);
	 			
		showTooltip(item.pageX, item.pageY,
		item.series.label + " " + x + ". Ay -  Toplam Kayıt: " + y);
	    }
			
	} else {
	    jQuery("#tooltip").remove();
	    previousPoint = null;            
	}
		
    });
		
    jQuery("#basicflot").bind("plotclick", function (event, pos, item) {
	if (item) {
	    plot.highlight(item.series, item.datapoint);
	}
    });
    
    
    /*****CHART 2 *****/
	
											<?	
										   
									
										   
										   	$kapanantoplam = "select ay as ayal,sum(atacsayi) sayial   from (
															SELECT  month(kapanis_tarihi) AY, count([id]) atacsayi FROM [KURUMSALABONE].[dbo].[ariza_takip] where durum!='-1' and 
											kapanis_tarihi between '".$bulunduguyilbaslangic."' and '".$bulunduguyilbitis."' group by month(kapanis_tarihi)
															union
															SELECT  month(kapanis_tarihi) AY, count([id]) ttacsayi FROM [KURUMSALABONE].[dbo].teknik_servis_malzeme_kayit where   durum!='-1' and 
											kapanis_tarihi between '".$bulunduguyilbaslangic."' and '".$bulunduguyilbitis."' group by month(kapanis_tarihi)
															) a where ay!='' group by ay";
                                            $kapanantoplamb = sorgu($kapanantoplam, $baglan);
                                            $kapanantoplaml = satirsay($kapanantoplamb);
											
											
											$gkapanantoplam = "select ay as ayal,sum(atacsayi) sayial   from (
															SELECT  month(kapanis_tarihi) AY, count([id]) atacsayi FROM [KURUMSALABONE].[dbo].[ariza_takip] where durum!='-1' and 
											kapanis_tarihi between '".$yilbaslangic2."' and '".$yilbitis2."' group by month(kapanis_tarihi)
															union
															SELECT  month(kapanis_tarihi) AY, count([id]) ttacsayi FROM [KURUMSALABONE].[dbo].teknik_servis_malzeme_kayit where   durum!='-1' and 
											kapanis_tarihi between '".$yilbaslangic2."' and '".$yilbitis2."' group by month(kapanis_tarihi)
															) a where ay!='' group by ay";
                                            $gkapanantoplamb = sorgu($gkapanantoplam, $baglan);
                                            $gkapanantoplaml = satirsay($gkapanantoplamb);
											
											
											?>
	
    
    var visitors = [
	<?  if ($gkapanantoplamb!='') {  ?><? do {?>
	<? if ($gkapanantoplaml['ayal']=='0') {?>[<? echo $gkapanantoplaml['ayal']?>, <? echo $gkapanantoplaml['sayial']?>],<? }?> 
	<? if ($gkapanantoplaml['ayal']=='1') {?>[<? echo $gkapanantoplaml['ayal']?>, <? echo $gkapanantoplaml['sayial']?>],<? }?> 
	<? if ($gkapanantoplaml['ayal']=='2') {?>[<? echo $gkapanantoplaml['ayal']?>, <? echo $gkapanantoplaml['sayial']?>],<? }?> 
	<? if ($gkapanantoplaml['ayal']=='3') {?>[<? echo $gkapanantoplaml['ayal']?>, <? echo $gkapanantoplaml['sayial']?>],<? }?>
	<? if ($gkapanantoplaml['ayal']=='4') {?>[<? echo $gkapanantoplaml['ayal']?>, <? echo $gkapanantoplaml['sayial']?>],<? }?>  
	<? if ($gkapanantoplaml['ayal']=='5') {?>[<? echo $gkapanantoplaml['ayal']?>, <? echo $gkapanantoplaml['sayial']?>],<? }?>  
	<? if ($gkapanantoplaml['ayal']=='6') {?>[<? echo $gkapanantoplaml['ayal']?>, <? echo $gkapanantoplaml['sayial']?>],<? }?>  
	<? if ($gkapanantoplaml['ayal']=='7') {?>[<? echo $gkapanantoplaml['ayal']?>, <? echo $gkapanantoplaml['sayial']?>],<? }?>  
	<? if ($gkapanantoplaml['ayal']=='8') {?>[<? echo $gkapanantoplaml['ayal']?>, <? echo $gkapanantoplaml['sayial']?>],<? }?>  
	<? if ($gkapanantoplaml['ayal']=='9') {?>[<? echo $gkapanantoplaml['ayal']?>, <? echo $gkapanantoplaml['sayial']?>],<? }?> 
	<? if ($gkapanantoplaml['ayal']=='10') {?>[<? echo $gkapanantoplaml['ayal']?>, <? echo $gkapanantoplaml['sayial']?>],<? }?> 
	<? if ($gkapanantoplaml['ayal']=='11') {?>[<? echo $gkapanantoplaml['ayal']?>, <? echo $gkapanantoplaml['sayial']?>],<? }?>  
	<? if ($gkapanantoplaml['ayal']=='12') {?>[<? echo $gkapanantoplaml['ayal']?>, <? echo $gkapanantoplaml['sayial']?>]<? }?>
	<? } while ($gkapanantoplaml = satirsay($gkapanantoplamb)); ?><? } ?>
	];
	
	
    var unique = [
	<?  if ($kapanantoplamb!='') {  ?><? do {?>
	<? if ($kapanantoplaml['ayal']=='0') {?>[<? echo $kapanantoplaml['ayal']?>, <? echo $kapanantoplaml['sayial']?>],<? }?> 
	<? if ($kapanantoplaml['ayal']=='1') {?>[<? echo $kapanantoplaml['ayal']?>, <? echo $kapanantoplaml['sayial']?>],<? }?>
	<? if ($kapanantoplaml['ayal']=='2') {?>[<? echo $kapanantoplaml['ayal']?>, <? echo $kapanantoplaml['sayial']?>],<? }?> 
	<? if ($kapanantoplaml['ayal']=='3') {?>[<? echo $kapanantoplaml['ayal']?>, <? echo $kapanantoplaml['sayial']?>],<? }?> 
	<? if ($kapanantoplaml['ayal']=='4') {?>[<? echo $kapanantoplaml['ayal']?>, <? echo $kapanantoplaml['sayial']?>],<? }?> 
	<? if ($kapanantoplaml['ayal']=='5') {?>[<? echo $kapanantoplaml['ayal']?>, <? echo $kapanantoplaml['sayial']?>],<? }?>
	<? if ($kapanantoplaml['ayal']=='6') {?>[<? echo $kapanantoplaml['ayal']?>, <? echo $kapanantoplaml['sayial']?>],<? }?>  
	<? if ($kapanantoplaml['ayal']=='7') {?>[<? echo $kapanantoplaml['ayal']?>, <? echo $kapanantoplaml['sayial']?>],<? }?>  
	<? if ($kapanantoplaml['ayal']=='8') {?>[<? echo $kapanantoplaml['ayal']?>, <? echo $kapanantoplaml['sayial']?>],<? }?>  
	<? if ($kapanantoplaml['ayal']=='9') {?>[<? echo $kapanantoplaml['ayal']?>, <? echo $kapanantoplaml['sayial']?>],<? }?>  
	<? if ($kapanantoplaml['ayal']=='10') {?>[<? echo $kapanantoplaml['ayal']?>, <? echo $kapanantoplaml['sayial']?>],<? }?> 
	<? if ($kapanantoplaml['ayal']=='11') {?>[<? echo $kapanantoplaml['ayal']?>, <? echo $kapanantoplaml['sayial']?>],<? }?> 
	<? if ($kapanantoplaml['ayal']=='12') {?>[<? echo $kapanantoplaml['ayal']?>, <? echo $kapanantoplaml['sayial']?>]<? }?>
	<? } while ($kapanantoplaml = satirsay($kapanantoplamb)); ?><? } ?>
	];
	
    var plot = jQuery.plot(jQuery("#basicflot2"),
	[{
	    data: visitors,
	    label: "Önceki yıl",
	    color: "#428bca"
	},
        {
	    data: unique,
	    label: "Bu Yıl",
	    color: "#b830b3"
        }
	],
	{
	    series: {
		lines: {
		    show: false
		},
		splines: {
		    show: true,
		    tension: 0.4,
		    lineWidth: 1,
		    fill: 0.5
		},
		shadowSize: 0
	    },
	    points: {
		show: true
	    },
	    legend: {
		container: '#basicFlotLegend2',
                noColumns: 0
	    },
	    grid: {
		hoverable: true,
		clickable: true,
		borderColor: '#ddd',
		borderWidth: 0,
		labelMargin: 5,
		backgroundColor: '#fff'
	    },
	    yaxis: {
		min: 0,
		max: 2000,
		color: '#eee'
	    },
	    xaxis: {
		color: '#eee'
	    }
	});
		
	var previousPoint = null;
	jQuery("#basicflot2").bind("plothover", function (event, pos, item) {
	jQuery("#x").text(pos.x.toFixed(0));
	jQuery("#y").text(pos.y.toFixed(0));
			
	if(item) {
	    if (previousPoint != item.dataIndex) {
		previousPoint = item.dataIndex;
						
		jQuery("#tooltip").remove();
		var x = item.datapoint[0].toFixed(0),
		y = item.datapoint[1].toFixed(0);
	 			
		showTooltip(item.pageX, item.pageY,
		item.series.label + " " + x + ". Ay -  Toplam Kayıt: " + y);
	    }
			
	} else {
	    jQuery("#tooltip").remove();
	    previousPoint = null;            
	}
		
    });
		
    jQuery("#basicflot2").bind("plotclick", function (event, pos, item) {
	if (item) {
	    plot.highlight(item.series, item.datapoint);
	}
    });
    
    
    /*****CHART 3 *****/
											<?
											$iacilantoplam = "select   ay as ayal,sum(atacsayi) sayial   from (
															SELECT  month(kayit_tarihi) AY, count([id]) atacsayi FROM [KURUMSALABONE].[dbo].[ariza_takip] where durum='1' and 
											kayit_tarihi between '".$bulunduguyilbaslangic."' and '".$bulunduguyilbitis."' group by month(kayit_tarihi)
															union
															SELECT  month(kayit_tarihi) AY, count([id]) etacsayi FROM [KURUMSALABONE].[dbo].[envanter_takip] where   durum='1' and 
											kayit_tarihi between '".$bulunduguyilbaslangic."' and '".$bulunduguyilbitis."' group by month(kayit_tarihi)
															union
															SELECT  month(kayit_tarihi) AY, count([id]) ptacsayi FROM [KURUMSALABONE].[dbo].[proje_takip_kayit] where   durum='1'  and 
											kayit_tarihi between '".$bulunduguyilbaslangic."' and '".$bulunduguyilbitis."'group by month(kayit_tarihi)
															union
															SELECT  month(kayit_tarihi) AY, count([id]) ttacsayi FROM [KURUMSALABONE].[dbo].teknik_servis_malzeme_kayit where   durum='1' and 
											kayit_tarihi between '".$bulunduguyilbaslangic."' and '".$bulunduguyilbitis."' group by month(kayit_tarihi)
															union
															SELECT  month(kayit_tarihi) AY, count([id]) ptdaciksayi FROM [KURUMSALABONE].[dbo].[proje_takip_kayit_detay] where  durum='1' and 
											kayit_tarihi between '".$bulunduguyilbaslangic."' and '".$bulunduguyilbitis."' group by month(kayit_tarihi)
															) a group by ay";
                                            $iacilantoplamb = sorgu($iacilantoplam, $baglan);
                                            $iacilantoplaml = satirsay($iacilantoplamb);
											
											
											$igacilantoplam = "select   ay as ayal,sum(atacsayi) sayial   from (
															SELECT  month(kayit_tarihi) AY, count([id]) atacsayi FROM [KURUMSALABONE].[dbo].[ariza_takip] where durum='1' and 
											kayit_tarihi between '".$yilbaslangic2."' and '".$yilbitis2."' group by month(kayit_tarihi)
															union
															SELECT  month(kayit_tarihi) AY, count([id]) etacsayi FROM [KURUMSALABONE].[dbo].[envanter_takip] where   durum='1' and 
											kayit_tarihi between '".$yilbaslangic2."' and '".$yilbitis2."' group by month(kayit_tarihi)
															union
															SELECT  month(kayit_tarihi) AY, count([id]) ptacsayi FROM [KURUMSALABONE].[dbo].[proje_takip_kayit] where   durum='1'  and 
											kayit_tarihi between '".$yilbaslangic2."' and '".$yilbitis2."'group by month(kayit_tarihi)
															union
															SELECT  month(kayit_tarihi) AY, count([id]) ttacsayi FROM [KURUMSALABONE].[dbo].teknik_servis_malzeme_kayit where   durum='1' and 
											kayit_tarihi between '".$yilbaslangic2."' and '".$yilbitis2."' group by month(kayit_tarihi)
															union
															SELECT  month(kayit_tarihi) AY, count([id]) ptdaciksayi FROM [KURUMSALABONE].[dbo].[proje_takip_kayit_detay] where  durum='1' and 
											kayit_tarihi between '".$yilbaslangic2."' and '".$yilbitis2."' group by month(kayit_tarihi)
															) a group by ay";
                                            $igacilantoplamb = sorgu($igacilantoplam, $baglan);
                                            $igacilantoplaml = satirsay($igacilantoplamb);
    										?>
											
    var impressions =       [
		<?  if ($igacilantoplamb!='') {  ?><? do {?>
	<? if ($igacilantoplaml['ayal']=='0') {?>[<? echo $igacilantoplaml['ayal']?>, <? echo $igacilantoplaml['sayial']?>],<? }?> 
	<? if ($igacilantoplaml['ayal']=='1') {?>[<? echo $igacilantoplaml['ayal']?>, <? echo $igacilantoplaml['sayial']?>],<? }?> 
	<? if ($igacilantoplaml['ayal']=='2') {?>[<? echo $igacilantoplaml['ayal']?>, <? echo $igacilantoplaml['sayial']?>],<? }?> 
	<? if ($igacilantoplaml['ayal']=='3') {?>[<? echo $igacilantoplaml['ayal']?>, <? echo $igacilantoplaml['sayial']?>],<? }?>
	<? if ($igacilantoplaml['ayal']=='4') {?>[<? echo $igacilantoplaml['ayal']?>, <? echo $igacilantoplaml['sayial']?>],<? }?>  
	<? if ($igacilantoplaml['ayal']=='5') {?>[<? echo $igacilantoplaml['ayal']?>, <? echo $igacilantoplaml['sayial']?>],<? }?>  
	<? if ($igacilantoplaml['ayal']=='6') {?>[<? echo $igacilantoplaml['ayal']?>, <? echo $igacilantoplaml['sayial']?>],<? }?>  
	<? if ($igacilantoplaml['ayal']=='7') {?>[<? echo $igacilantoplaml['ayal']?>, <? echo $igacilantoplaml['sayial']?>],<? }?>  
	<? if ($igacilantoplaml['ayal']=='8') {?>[<? echo $igacilantoplaml['ayal']?>, <? echo $igacilantoplaml['sayial']?>],<? }?>  
	<? if ($igacilantoplaml['ayal']=='9') {?>[<? echo $igacilantoplaml['ayal']?>, <? echo $igacilantoplaml['sayial']?>],<? }?> 
	<? if ($igacilantoplaml['ayal']=='10') {?>[<? echo $igacilantoplaml['ayal']?>, <? echo $igacilantoplaml['sayial']?>],<? }?> 
	<? if ($igacilantoplaml['ayal']=='11') {?>[<? echo $igacilantoplaml['ayal']?>, <? echo $igacilantoplaml['sayial']?>],<? }?>  
	<? if ($igacilantoplaml['ayal']=='12') {?>[<? echo $igacilantoplaml['ayal']?>, <? echo $igacilantoplaml['sayial']?>]<? }?>
	<? } while ($igacilantoplaml = satirsay($igacilantoplamb)); ?><? } ?>
	];
    var uniqueimpressions = [
	<?  if ($iacilantoplamb!='') {  ?><? do {?>
	<? if ($iacilantoplaml['ayal']=='0') {?>[<? echo $iacilantoplaml['ayal']?>, <? echo $iacilantoplaml['sayial']?>],<? }?> 
	<? if ($iacilantoplaml['ayal']=='1') {?>[<? echo $iacilantoplaml['ayal']?>, <? echo $iacilantoplaml['sayial']?>],<? }?>
	<? if ($iacilantoplaml['ayal']=='2') {?>[<? echo $iacilantoplaml['ayal']?>, <? echo $iacilantoplaml['sayial']?>],<? }?> 
	<? if ($iacilantoplaml['ayal']=='3') {?>[<? echo $iacilantoplaml['ayal']?>, <? echo $iacilantoplaml['sayial']?>],<? }?> 
	<? if ($iacilantoplaml['ayal']=='4') {?>[<? echo $iacilantoplaml['ayal']?>, <? echo $iacilantoplaml['sayial']?>],<? }?> 
	<? if ($iacilantoplaml['ayal']=='5') {?>[<? echo $iacilantoplaml['ayal']?>, <? echo $iacilantoplaml['sayial']?>],<? }?>
	<? if ($iacilantoplaml['ayal']=='6') {?>[<? echo $iacilantoplaml['ayal']?>, <? echo $iacilantoplaml['sayial']?>],<? }?>  
	<? if ($iacilantoplaml['ayal']=='7') {?>[<? echo $iacilantoplaml['ayal']?>, <? echo $iacilantoplaml['sayial']?>],<? }?>  
	<? if ($iacilantoplaml['ayal']=='8') {?>[<? echo $iacilantoplaml['ayal']?>, <? echo $iacilantoplaml['sayial']?>],<? }?>  
	<? if ($iacilantoplaml['ayal']=='9') {?>[<? echo $iacilantoplaml['ayal']?>, <? echo $iacilantoplaml['sayial']?>],<? }?>  
	<? if ($iacilantoplaml['ayal']=='10') {?>[<? echo $iacilantoplaml['ayal']?>, <? echo $iacilantoplaml['sayial']?>],<? }?> 
	<? if ($iacilantoplaml['ayal']=='11') {?>[<? echo $iacilantoplaml['ayal']?>, <? echo $iacilantoplaml['sayial']?>],<? }?> 
	<? if ($iacilantoplaml['ayal']=='12') {?>[<? echo $iacilantoplaml['ayal']?>, <? echo $iacilantoplaml['sayial']?>]<? }?>
	<? } while ($iacilantoplaml = satirsay($iacilantoplamb)); ?><? } ?>
	];
	
    var plot = jQuery.plot(jQuery("#basicflot3"),
	[{
	    data: impressions,
	    label: "Önceki yıl",
	    color: "#905dd1"
	},
        {
	    data: uniqueimpressions,
	    label: "Bu Yıl",
	    color: "#428bca"
        }
	],
	{
	    series: {
		lines: {
		    show: false
		},
		splines: {
		    show: true,
		    tension: 0.4,
		    lineWidth: 1,
		    fill: 0.4
		},
		shadowSize: 0
	    },
	    points: {
		show: true
	    },
	    legend: {
		container: '#basicFlotLegend3',
                noColumns: 0
	    },
	    grid: {
		hoverable: true,
		clickable: true,
		borderColor: '#ddd',
		borderWidth: 0,
		labelMargin: 5,
		backgroundColor: '#fff'
	    },
	    yaxis: {
		min: 0,
		max: 2000,
		color: '#eee'
	    },
	    xaxis: {
		color: '#eee'
	    }
	});
		
	var previousPoint = null;
	jQuery("#basicflot3").bind("plothover", function (event, pos, item) {
	jQuery("#x").text(pos.x.toFixed(0));
	jQuery("#y").text(pos.y.toFixed(0));
			
	if(item) {
	    if (previousPoint != item.dataIndex) {
		previousPoint = item.dataIndex;
						
		jQuery("#tooltip").remove();
		var x = item.datapoint[0].toFixed(0),
		y = item.datapoint[1].toFixed(0);
	 			
		showTooltip(item.pageX, item.pageY,
		item.series.label + " " + x + ". Ay -  Toplam Kayıt: " + y);
	    }
			
	} else {
	    jQuery("#tooltip").remove();
	    previousPoint = null;            
	}
		
    });
		
    jQuery("#basicflot3").bind("plotclick", function (event, pos, item) {
	if (item) {
	    plot.highlight(item.series, item.datapoint);
	}
    });
    
    
    jQuery('#sparkline').sparkline([1,2,3,4,5,6,7,8,9,10,11,12], {
	type: 'bar', 
        height:'30px',
        barColor: '#428BCA'
    });
    
    jQuery('#sparkline2').sparkline([1,2,3,4,5,6,7,8,9,10,11,12], {
	type: 'bar', 
	height:'30px',
        barColor: '#999'
    });
    
    jQuery('#sparkline3').sparkline([1,2,3,4,5,6,7,8,9,10,11,12], {
	type: 'bar', 
        height:'30px',
        barColor: '#428BCA'
    });
    
    jQuery('#sparkline4').sparkline([1,2,3,4,5,6,7,8,9,10,11,12], {
	type: 'bar', 
	height:'30px',
        barColor: '#999'
    });
    
    jQuery('#sparkline5').sparkline([1,2,3,4,5,6,7,8,9,10,11,12], {
	type: 'bar', 
        height:'30px',
        barColor: '#428BCA'
    });
    
    jQuery('#sparkline6').sparkline([1,2,3,4,5,6,7,8,9,10,11,12], {
	type: 'bar', 
	height:'30px',
        barColor: '#999'
    });
    
    
    /***** BAR CHART *****/
    
    var m3 = new Morris.Bar({
        // ID of the element in which to draw the chart.
        element: 'bar-chart',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data: [
           <?
		   
		   	
			
          	$bsayfasayi="SELECT count(id) as sayi  FROM [KURUMSALABONE].[dbo].[sayfa_ziyaretleri] where  tarih between '".$bulunduguyilbaslangic."' and '".$bulunduguyilbitis."' ";
			$bsayfasayib = sorgu($bsayfasayi, $baglan);
			$bsayfasayil =satirsay($bsayfasayib);
			
			$bsayfasayi2="SELECT count(id) as sayi  FROM [KURUMSALABONE].[dbo].[sayfa_ziyaretleri] where  tarih between '".$yilbaslangic2."' and '".$yilbitis2."' ";
			$bsayfasayib2 = sorgu($bsayfasayi2, $baglan);
			$bsayfasayil2 =satirsay($bsayfasayib2);
			?>
			
          
            { y: '<? echo date("Y");?>', a: <? echo $bsayfasayil['sayi'];?>, b: <? echo $bsayfasayil2['sayi'];?> }
        ],
        xkey: 'y',
        ykeys: ['b', 'a'],
        labels: ['Önceki Yıl', 'Bu Yıl'],
        lineWidth: '1px',
        fillOpacity: 0.8,
        smooth: true,
        hideHover: true,
        resize: true
    });
    
    var delay = (function() {
	var timer = 0;
	return function(callback, ms) {
	    clearTimeout(timer);
	    timer = setTimeout(callback, ms);
	};
    })();

    jQuery(window).resize(function() {
	delay(function() {
	    m3.redraw();
	}, 200);
    }).trigger('resize');
    
    
    // This will empty first option in select to enable placeholder
    jQuery('select option:first-child').text('');
    
    // Select2
    jQuery("select").select2({
        minimumResultsForSearch: -1
    });
                
    // Basic Wizard
    jQuery('#basicWizard').bootstrapWizard({
        onTabShow: function(tab, navigation, index) {
            tab.prevAll().addClass('done');
            tab.nextAll().removeClass('done');
            tab.removeClass('done');
                        
            var $total = navigation.find('li').length;
            var $current = index + 1;
                        
            if($current >= $total) {
                $('#basicWizard').find('.wizard .next').addClass('hide');
                $('#basicWizard').find('.wizard .finish').removeClass('hide');
            } else {
                $('#basicWizard').find('.wizard .next').removeClass('hide');
                $('#basicWizard').find('.wizard .finish').addClass('hide');
            }
        }
    });
    
   
    
});
</script>