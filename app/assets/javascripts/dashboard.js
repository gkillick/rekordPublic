function paint_workout_feed(){

	var entries = $('.dashboard_comment')

	var total_entries = 5
	var n = 1
	var direction = "up"
	entries.each(function(){
		$(this).addClass('friend_hours_gradient')
		if(direction == "up"){
			$(this).addClass('friend_hours_gradient')
		$(this).css('background-position', "0% "+(n/total_entries*100)+"%")
			n++
			if(n == 6){
				direction = "down"
				n = n - 2
			}
		}
		else{
			$(this).addClass('friend_hours_gradient_reverse')
			$(this).css('background-position', "0% "+((5-n)/total_entries*100)+"%")
			n--
			if(n == 0){
				direction = "up"
				n = n + 2
			}
		}
	})


}

$(function(){

	paint_workout_feed()
	autosize($('textarea'));
	$('body').on('click', '.show_comment', function(){
		var textarea_dash = $(this).next('.add_comment_dashboard').find('textarea')
		$(this).css('display', 'none')
		$(this).next('.add_comment_dashboard').css('display', 'block')
		$(this).next('.add_comment_dashboard').css('opacity')
		setTimeout(function(){
			textarea_dash.focus()
		},1)

	})
	$('body').on('blur', '.dashboard_new_comment', function(){
		$('.show_comment').css('display', 'block')
		$('.add_comment_dashboard').css('display', 'none')

	})

	$('body').on('focus', '.dashboard_new_comment', function(){
				$(this).next('.send_dashboard').css('opacity', 1)


	})
	$('body').on('blur', '.dashboard_new_comment', function(){

		$(this).next('.send_dashboard').css('opacity', 0)
	})
	$('body').on('click', '.dashboard_link', function(){
		$('#right_container').fadeOut("fast")
		close_plans()
		adjust_side_bar('dashboard')


		})


	$('body').on('ajax:success', '.dashboard_link', function(evt, data, status, xhr){
		$('#right_container').html(data)
		$('#dashboard_feel')
		$('.comments').empty()
		autosize($('textarea'));
		paint_workout_feed()
		setTimeout(function(){
					load_graphs();
		},10)

      	$('#right_container').fadeIn()
	})

	$('body').on('click', '.not_selected_toggle', function(){
		if($(this).text() == "month"){
			$('.selected_toggle').removeClass('selected_toggle').addClass('not_selected_toggle')
			$(this).removeClass('not_selected_toggle')
			$(this).addClass('selected_toggle')
			var chart = $('#dashboard_feel').highcharts();
			chart.xAxis[0].update({
				min: Date.parse("t - 30 days").getTime() - 43200000,
				tickInterval: 24 * 3600 * 1000*2,
				labels: {
				                format: '{value:%b %d}',
												rotation: -30
				            }

			});


		}
		else{
			$('.selected_toggle').removeClass('selected_toggle').addClass('not_selected_toggle')
			$(this).removeClass('not_selected_toggle')
			$(this).addClass('selected_toggle')
			var chart = $('#dashboard_feel').highcharts();
			chart.xAxis[0].update({
				min: Date.parse("t - 6 days").getTime() - 43200000,
				tickInterval: 24 * 3600 * 1000,
				labels: {
				                format: '{value:%a}',
												rotation: 0
				            }

			});
		}




	})
	$('body').on('click', '.selected_toggle', function(e){
		e.preventDefault()

	})
})
