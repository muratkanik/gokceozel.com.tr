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
    
    var newCust = [[0, 0], [1, 2], [2,3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13]];
    var retCust = [[0, 0], [1, 1], [2,2], [3, 3], [4, 4], [5, 5], [6,6], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11], [12, 12]];
	
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
		labelMargin: 5,
		backgroundColor: '#fff'
	    },
	    yaxis: {
		min: 0,
		max: 15,
		color: '#eee'
	    },
	    xaxis: {
		color: '#eee'
	    }
	});
		
	var previousPoint = null;
	jQuery("#basicflot").bind("plothover", function (event, pos, item) {
	jQuery("#x").text(pos.x.toFixed(2));
	jQuery("#y").text(pos.y.toFixed(2));
			
	if(item) {
	    if (previousPoint != item.dataIndex) {
		previousPoint = item.dataIndex;
						
		jQuery("#tooltip").remove();
		var x = item.datapoint[0].toFixed(2),
		y = item.datapoint[1].toFixed(2);
	 			
		showTooltip(item.pageX, item.pageY,
		item.series.label + " of " + x + " = " + y);
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
    
    var visitors = [[0, 0], [1, 3], [2,2], [3, 5], [4, 4], [5, 5], [6, 0], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11], [12, 12]];
    var unique = [[0, 0], [1, 2], [2,1], [3, 3], [4, 3], [5, 4], [6,0], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11], [12, 12]];
	
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
		max: 15,
		color: '#eee'
	    },
	    xaxis: {
		color: '#eee'
	    }
	});
		
	var previousPoint = null;
	jQuery("#basicflot2").bind("plothover", function (event, pos, item) {
	jQuery("#x").text(pos.x.toFixed(2));
	jQuery("#y").text(pos.y.toFixed(2));
			
	if(item) {
	    if (previousPoint != item.dataIndex) {
		previousPoint = item.dataIndex;
						
		jQuery("#tooltip").remove();
		var x = item.datapoint[0].toFixed(2),
		y = item.datapoint[1].toFixed(2);
	 			
		showTooltip(item.pageX, item.pageY,
		item.series.label + " of " + x + " = " + y);
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
    
    var impressions =       [[0, 0], [1, 5], [2,2], [3, 7], [4, 4], [5, 5], [6, 0], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11], [12, 12]];
    var uniqueimpressions = [[0, 0], [1, 2], [2,1], [3, 6], [4, 3], [5, 4], [6,0], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11], [12, 12]];
	
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
		max: 15,
		color: '#eee'
	    },
	    xaxis: {
		color: '#eee'
	    }
	});
		
	var previousPoint = null;
	jQuery("#basicflot3").bind("plothover", function (event, pos, item) {
	jQuery("#x").text(pos.x.toFixed(2));
	jQuery("#y").text(pos.y.toFixed(2));
			
	if(item) {
	    if (previousPoint != item.dataIndex) {
		previousPoint = item.dataIndex;
						
		jQuery("#tooltip").remove();
		var x = item.datapoint[0].toFixed(2),
		y = item.datapoint[1].toFixed(2);
	 			
		showTooltip(item.pageX, item.pageY,
		item.series.label + " of " + x + " = " + y);
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
           
            
            { y: '2016', a: 30, b: 50 },
            { y: '2017', a: 95, b: 50 }
        ],
        xkey: 'y',
        ykeys: ['a', 'b'],
        labels: ['Önceki Yıl', 'Bu Yıl'],
        lineWidth: '1px',
        fillOpacity: 0.8,
        smooth: false,
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
    
    // This will submit the basicWizard form
    jQuery('.panel-wizard').submit(function() {    
        alert('This will submit the form wizard');
        return false // remove this to submit to specified action url
    });
    
});