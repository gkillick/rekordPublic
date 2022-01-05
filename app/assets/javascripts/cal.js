leader_board_open = false


function abreviate_activities(){
	if($('.side_bar_open').length > 0){
		$('.workout_list_item').each(function(){
			var activity_id = $(this).data('activity')
			if (activity_id.length > 6){

				$(this).find('.activity_class').text(activity_id.substring(0, 6)+".")
			}


		})
	}
	else{
		$('.workout_list_item').each(function(){
			var activity_id = $(this).data('activity')


				$(this).find('.activity_class').text(activity_id)



		})
	}
}
function populate_month_list(month,year,current_user,width,selected_month){
	$('.date_pull_down_container').remove()
	$('.plan_title_grid').append('<div data-current-user="'+current_user+'" data-year="'+year+'" data-month="'+month+'" data-width="'+width+'" data-selected_month="'+selected_month+'" class="date_pull_down_container"><ul class="year_list date_list" style="width:'+width+'px;"><li class="year_nav"><span class="rekord arrow_rekord"><</span> '+year+' <span class="rekord arrow_rekord next_year">></span></li></ul></div>')
	months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
	numerical_months = ["01","02","03","04","05","06","07","08","09","10","11","12"]


	for(var i = 0; i < 12; i++) {
		if(months[i] == month && year == (new Date).getFullYear().toString()){

			$('.year_list').append('<a href="/log_entries/get_calendar/'+current_user+'/'+year+'-'+numerical_months[i]+'-01" class="calendar_menu_link get_the_cal" data-remote="true" data-type="script" ><li class="current_month">'+months[i]+'</li></a>')
		}
		else if(months[i] == selected_month){
			$('.year_list').append('<a href="/log_entries/get_calendar/'+current_user+'/'+year+'-'+numerical_months[i]+'-01" class="calendar_menu_link get_the_cal" data-remote="true" data-type="script" ><li class="selected_month">'+months[i]+'</li></a>')
		}
		else{
		$('.year_list').append('<a href="/log_entries/get_calendar/'+current_user+'/'+year+'-'+numerical_months[i]+'-01" class="calendar_menu_link get_the_cal" data-remote="true" data-type="script" ><li>'+months[i]+'</li></a>')
		}
	}
	$('.date_pull_down_container').css('opacity')
	$('.date_pull_down_container').css('opacity', 1)

}


function setEqualHeight(columns){

 	var tallestcolumn = 0;
 	columns.each(
		function(){
 			currentHeight = $(this).height();
 			if(currentHeight > tallestcolumn){
 				tallestcolumn  = currentHeight;
 			}
 		}
 	);
	columns.height(tallestcolumn);
}

//calculate the total times
function resolveTotals(){
	$('.grid_days').each(function(){
		var total_completed = 0
		var total_planned = 0
		$(this).find('.workout_list').each(function(){
			$(this).find('a.dialog_link').each(function(){
				total_completed += $(this).data('completed-time')
				total_planned += $(this).data('planned-time')
			})
		})
		if( total_completed > 0 || total_planned > 0){
			if ($(this).find('.inner_total').length > 0){

				$(this).find('.inner_total').find('.week_completed').html(time_cleanup_with_zero((total_completed/60).toString()))

				$(this).find('.inner_total').find('.week_planned').html(time_cleanup_with_zero((total_planned/60).toString()))
			}
			else{

				var totals_formatted = "<div class='outer_total'><div class='inner_total'><span class='week_completed'>"+time_cleanup((total_completed/60).toString())+"</span><span class='stats_sub_text'> C</span></br></br><span class='week_planned'>"+time_cleanup((total_planned/60).toString())+"</span><span class='stats_sub_text'> P</span></div></div>"
				$(this).find('.total_grid').find('.grid_cell').html(totals_formatted)
			}
		}
		else{
			$(this).find('.total_grid').find('.grid_cell').empty()
		}
	})
	var n = 0
	$('.total_grid').each(function(){
		$(this).find('.leader_board_link').attr('data-row', n)
		n++
		if( n == $('.total_grid').size()){
			$(this).find('.leader_board_link').attr('data-row', "last")
		}

	})
}
function resolveColumns(){
	$('.cal_week').each(function(){
		setEqualHeight($(this).children('div'))
	})
}
$(document).ready(function() {
	resolveColumns()
	paint_workouts()


	$('body').on('mouseenter', '#calendar_navigation', function(){
		$('.grey_arrow_link').animate({
			opacity:1
		}, 'fast')
	})
	$('body').on('mouseleave', '#calendar_navigation', function(){
		$('.grey_arrow_link').animate({
			opacity:0
		}, 'fast')
	})
	$('body').on('mouseenter', '.grid_cell_day', function(){
		var plus_sign = $(this).find('.add_workout_link')
		plus_sign.css('opacity', '1')
		$(this).find('.grey_new_workout').css('background', '#f4f4f4')
	})
	$('body').on('mouseleave', '.grid_cell_day', function(){
		var plus_sign = $(this).find('.add_workout_link')
				plus_sign.css('opacity', '0')
			$(this).find('.grey_new_workout').css('background', 'none')
	})
	//when click on date make window open if not clicked on link
	$('body').on('click touchstart', '.grid_cell_day', function(e) {
	  if ($('.app_option_selected').html() == "on") {

	  } else {
	    if (e.target == this) {
	      $(this).find('.number_plan_grid').children('a').click()
	    }
	  }


	})
	$('body').on('click touchstart', '.number_plan_grid', function(e) {
	      if ($('.app_option_selected').html() == "on") {

	      } else {
	        if (e.target == this) {
	          $(this).children('a').click()
	        }
	      }

})
	//delete functionality

	$('body').on('mouseenter', '.workout_list li', function(){
		$(this).find('.delete_workout').css('opacity')
		$(this).find('.delete_workout').addClass('workout_fade')
	})
	$('body').on('mouseleave', '.workout_list li', function(){
		$(this).find('.delete_workout').css('opacity')
		$(this).find('.delete_workout').removeClass('workout_fade')
	})

	$('body').on('click', '.delete_workout', function(e){
		if(!$(this).hasClass('confirm_open')){
		var delete_workout_id = $(this).parent().attr('id')
		$(this).addClass('confirm_open')
		$('.edit_container').append('<div class="confirm_dialog_overlay"></div><div class="confirm_dialog_container"><div class="confirm_dialog"><div class="confirm_dialog_inside"><div data-workout-id="'+delete_workout_id+'"class="confirm_yes confirm_button button">delete workout?</div><div class="confirm_cancel confirm_button button_red">cancel</div></div></div></div>')
		$('.confirm_dialog_container').css('opacity')
		$('.confirm_dialog_container').css('opacity', 1)
		return false
		}
	})
	$('body').on('click', '.confirm_yes', function(){
		var workout_id = $(this).attr('data-workout-id')
		$('#'+workout_id).click()
		$('.confirm_dialog_container, .confirm_dialog_overlay').remove()
	})
	$('body').on('click', '.confirm_cancel', function(){
		$('.confirm_dialog_container, .confirm_dialog_overlay').remove()
		$('.confirm_open').removeClass('confirm_open')
	})
	$('body').on('click', '.month_pull_down', function(){
		if($('.date_pull_down_container').size() == 0 ){

			var current_user = $(this).data('current-user')
			var month = $(this).data('current-month')
			var selected_month = $(this).data('selected-month')
			var width = $('.plan_title_grid').outerWidth()
			var year = $(this).data('selected-year')

			populate_month_list(month,year,current_user,width,selected_month)

		}
		else{
			$('.date_pull_down_container').remove()
		}
	})

	//arrow navigation for year
	$('body').on('click', '.arrow_rekord', function(){
			var current_user = $('.date_pull_down_container').data('current-user')
			var month = $('.date_pull_down_container').data('month')
			var selected_month = $('.date_pull_down_container').data('selected-month')
			var width = $('.plan_title_grid').outerWidth()

		if($(this).hasClass('next_year')){
			var year = parseInt($('.date_pull_down_container').data('year')) + 1
		}
		else{
			var year = parseInt($('.date_pull_down_container').data('year')) - 1
		}
		populate_month_list(month,year,current_user,width,selected_month)

	})

	//leader board
	$('body').on('click', '.leader_board_link', function(e){

		if(leader_board_open == false){
		var rows = $(this).find('tbody').children('tr')
		var total_rows = rows.size()
		var n = 1
		rows.each(function(){
			$(this).addClass('friend_hours_gradient')
			$(this).css('background-position', "0% "+(n/total_rows*100)+"%")
			n++
		})
		e.preventDefault()
		e.stopPropagation();
		var height = $(this).find('.leader_board').height()
		if ($(this).data('row') == "0"){
			var top = -35
		}
		else if($(this).data('row') == "last"){
			var top = -(height) +50
		}
		else{
			var top = -(height/2.0)
		}
		$(this).find('.leader_board').css('opacity')
		$(this).find('.leader_board').css({
			visibility:'visible',
			opacity:1,
			top: top
		})
		leader_board_open = true
		}
		else{
			$('.leader_board').css({
				visibility:'hidden',
				opacity:0
			})
			leader_board_open = false

		}
	})
	$(document).on('touchstart', function(event){
		if(bar_select_open){
		$('.month_sum_container').addClass('display_none')
		bar_select_open = false
		}
	})
	$(document).on('click touchstart', function(event){

		if(leader_board_open){
			$('.leader_board').css({
				visibility:'hidden',
				opacity:0
			})
		leader_board_open = false
		}
	})


	$('body').on('mouseenter', '.instructions_workout', function(e){
		var width = $(e.target).parents('li').outerWidth()
		if($('.side_bar_open').length > 0){
			$(this).find('table tr').each(function(){
				$(this).children().last().addClass('hidden').prev().addClass('no_right_border')

			})
		}
			if($(e.target).hasClass('instructions_workout')){
				$(this).children('.instructions_drop').css({
					visibility:'visible',
					opacity:1,
					width:width
				})
			}



	})
	$('body').on('mouseout', '.instructions_workout', function(){
		$(this).find('table tr').each(function(){
			$(this).children().last().removeClass('hidden').prev().removeClass('no_right_border')

		})
		$(this).children('.instructions_drop').css({
			visibility:'hidden',
			opacity:0
		})

	})

	//activity text length



});
