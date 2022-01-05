
var time_cleanups, weekdays;

weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

time_cleanups = function(t) {
  var h, r, x;
  t = t / 60;
  if (t < 60 && t >= 10) {
    if (t >= 10) {
      x = "0:" + t;
    } else {
      if (t < 10 && t !== 0) {
        x = "0:0" + t;
      }
    }
  } else if (t >= 60) {
    h = t / 60;
    h = Math.floor(h);
    r = t % 60;
    if (r >= 10) {
      x = h + ":" + r;
    } else {
      if (r < 10) {
        x = h + ":0" + r;
      }
    }
  } else {
    if (t < 10) {
      x = t + ":00";
    }
  }
  return x;
};

label_html = "<div id='sport_percentage_label'></div>"

  data = $('#sub_graph_feel').data('feel')
color_array = [ '#4d00ff', '#9900ff', '#e500ff', '#ff00cc', '#ff0080', '#ff0033', '#6AF9C4', 'blue']

function load_graphs(){
	if($('.selected_toggle').text() == "month"){
		var date_format = '{value:%b %d}'
		var rotation_value = -30
		var tick_interval = 24 * 3600 * 1000 * 2
		var min_value = Date.parse("t - 30 days").getTime() - 43200000
	}
	else{
		var date_format = '{value: %a}'
		var rotation_value = 0
		var tick_interval = 24 * 3600 * 1000
		var min_value = Date.parse("t - 6 days").getTime() - 43200000
	}
	if($('#dashboard_feel').size() > 0){
		var feel_data = $('#dashboard_feel').data('feel')
		var sleep_data = $('#dashboard_feel').data('sleep')

		feel_chart = $('#dashboard_feel').highcharts({
		            chart: {
		                type: 'area',
		            },
		            title: false,
		            legend: false,
		            xAxis: {
									tickInterval: tick_interval,
						min: min_value,
						max: Date.parse("t").getTime(),
						maxPadding: 0.00,
						minPadding: 0.00,
									endOnTick:false,


		                type: 'datetime',
				        labels: {
									format: date_format,
									rotation: rotation_value,
							style: {
								fontSize: '8px',
							    fontWeight: 'normal',
							    textTransform: 'uppercase',
								letterSpacing: '2px'
							},


				        }
		            },
		            yAxis: {
								tickPositions: [0, 25, 50, 75, 100],
						gridLineColor: '#d8d8d8',
						gridLineDashStyle: 'dot',
		                title: false,
						labels:{
							style: {
								fontSize: '8px',
							    fontWeight: 'normal',
							    textTransform: 'uppercase',
								letterSpacing: '2px'
							},
						},
		            },
		            tooltip: {
		                shared: true,
		                valueSuffix: '%',
										borderWidth: 0,
										shadow: false,
										borderRadius: '7.5px',
										headerFormat: '',
										backgroundColor: '#2c2c2c',
										style: {
											color: 'white'
										},
                    useHTML:true,
										pointFormat: '<div class="feel_sleep_tooltip" style="background:{series.color};"> {series.name}: {point.y} </div><br/>',

		            },
		            credits: {
		                enabled: false
		            },
		            plotOptions: {
		                area: {
												animation: false,
		                    fillOpacity: 0.5
		                }
		            },
		            series: [{
						name: 'Sleep Quality',
		                data: sleep_data,
						color: '#8d2eee',
						lineWidth: 0
		            },
					{
						name: 'Feel',
		                data: feel_data,
						color: '#11a7e5',
						lineWidth: 0
					}
					]
		        });

	}

	if ($('#sub_graph_sports').size() > 0){
		other_data = $('#sub_graph_sports').data('times')
		Highcharts.setOptions({
		 colors: [ '#11a7e5', '#4d00ff', '#9900ff', '#e500ff', '#ff00cc', '#ff0080', '#ff0033', '#6AF9C4', 'blue']
		});
		$('#sub_graph_sports').highcharts({
			credits: {
			    enabled: false
			  },
	        chart: {
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false
	        },
	        title: {
	            text: false,
	        },
	        tooltip: {
				enabled: false,
	    	    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',

	        },
	        plotOptions: {



	            pie: {

					borderWidth: 0,

					followPointer:false,
					innerSize:'80%',
					animation: false,
	                allowPointSelect: false,
	                cursor: 'pointer',
	                dataLabels: {
	                    enabled: false,
	                    color: '#000000',
	                    connectorColor: '#000000',
	                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
	                }
	            },
		        series: {
		        	point: {
		        		events: {
		        			mouseOver: function() {
								if($('#sport_percentage_label').size() < 1){
		        					$('#sub_graph_sports').append(label_html)
									other_data = $('#sub_graph_sports2').data('times')
									$('#sport_percentage_label').html("<span class='sport_percentages' >"+Math.round(this.percentage*10)/10.0 + "</span><div class='medium_small up_case'>% "+other_data[this.x][0]+"</div>")


								}
								else{
									$('#sport_percentage_label').show()
									other_data = $('#sub_graph_sports2').data('times')
									$('#sport_percentage_label').html("<span class='sport_percentages' >"+Math.round(this.percentage*10)/10.0 + "</span><div class='medium_small up_case'>% "+other_data[this.x][0]+"</div>")
								}

		                        }
		                    }
		                },
		                events: {
		                    mouseOut: function() {
			                $('#sport_percentage_label').hide()

		                    }
		                }
		            }
		        },

	        series: [{
	            type: 'pie',
	            name: 'Activity',
	            data: $('#sub_graph_sports').data('times'),
	        }]
	    });




}
}
jQuery(function() {
	load_graphs();

  $('body').on('click', '.feel_link_container', function () {
		var athlete_name = $(this).closest('tr').data("athlete-name")
		$('.team_average').css('opacity', '1')
		$('.feel_name').html(athlete_name)
      var chart = $('#dashboard_feel').highcharts();
			var feel_data = $(this).closest('tr').data("feel")
			var sleep_data = $(this).closest('tr').data("sleep")
			$('.highcharts-series, path').fadeOut(function(){
				chart.series[1].setData(feel_data);
				chart.series[0].setData(sleep_data);
				$('.highcharts-series, path').fadeIn()

			})


  });

	$('body').on('click', '.team_average', function(){
		$('.team_average').css('opacity', '0')
		$('.feel_name').html("team averages")
		var chart = $('#dashboard_feel').highcharts();
		var feel_data = $('#dashboard_feel').data('feel')
		var sleep_data = $('#dashboard_feel').data('sleep')
		$('.highcharts-series, path').fadeOut(function(){
			chart.series[1].setData(feel_data);
			chart.series[0].setData(sleep_data);
			$('.highcharts-series, path').fadeIn()

		})
	})

});
