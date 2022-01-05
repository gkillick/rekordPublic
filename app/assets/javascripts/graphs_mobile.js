function paint_things_mobile(things){
	var entries = things
	var total_entries = 5
	var n = 1
	var direction = "up"
	entries.each(function(){
		$(this).addClass('gradient_m')
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
			$(this).addClass('gradient_reverse_m')
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
	
	$('body').on('tap', '.get_graph_m', function(e){

			$('.right_cell_content').html('<div class="graphs_mobile"><div id="top_bar_m" style="opacity: .99;"><a id="back" href="#" class="icon-chevron-left"></a><span class="month_title_m">Stats</span></div></div>')
			$('.main_content_m').toggleClass('new_workout_mobile')
			$('.get_graph_m_link').click()



	})
	
	$('body').on('ajax:success','.get_graph_m_link', function(evt, data, status, xhr){
	
		$('.graphs_mobile').append(data)
		$('.mobile_graph_container').css('opacity')
		$('.mobile_graph_container').removeClass('fade_in_mobile')
		
		var row_height = $('.leader_board_mobile_table').outerHeight()
		$('.leader_board_wrapper').height($('.leader_board_mobile_table').outerHeight())
		paint_things_mobile($('.leaderboard_0'))
		paint_things_mobile($('.leaderboard_1'))
		paint_things_mobile($('.leaderboard_2'))
		$('.h_graph_mobile_complete').each(function(){
			$(this).css('width', $(this).data('percentage')+"%")
		})


		
	})
	$('body').on('tap', ".leader_board_mobile_footer div", function(){
		if($(this).hasClass("selected_mobile")){
		}
		else{
			$('.leader_board_mobile_table tr').addClass('hidden').addClass('invisible_mobile')
			$("."+$(this).data('leaderboard')).removeClass('hidden')
			$("."+$(this).data('leaderboard')).css('opacity')
			$("."+$(this).data('leaderboard')).removeClass('invisible_mobile')
			var row_height = $('.leader_board_mobile_table').outerHeight()
			$('.leader_board_wrapper').height($('.leader_board_mobile_table').outerHeight())
			$('.selected_mobile').removeClass('selected_mobile')
			$(this).addClass('selected_mobile')
			
		}
	})

	$('body').on('tap', '#back', function(e){
		e.preventDefault()
		$('.main_content_m').toggleClass('new_workout_mobile')
	})
})