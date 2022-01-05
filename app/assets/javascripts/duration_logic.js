//function to deal with .format_time class

function format_time(){
	$('.format_time').each(function(){
		var formatted_time = time_cleanup($(this).val())
		$(this).val(formatted_time)
		if($(this).val() == "0:00"){
			$(this).css("color", form_text_grey)
		}
	})
}
function format_time_mobile(){
	$('.format_time_mobile').each(function(){
		var formatted_time = time_cleanup($(this).val())

		if(formatted_time != "0:00"){
			$(this).val(formatted_time)
			if(formatted_time.indexOf(':') > -1){
				$(this).next('.time_colon_link').children().addClass('not_active')
			} else{
				$(this).next('.time_colon_link').children().removeClass('not_active')
			}

		}
	})

}
function calculate_total(){
	$('.total_duration_field').each(function(){
		var total_duration = 0
		var times_container = $(this).closest('.workout_grid_cell')
		times_container.find('.zone_row').each(function(){
			total_duration += parseInt($(this).find('.total_duration_interval').val())
		})
		if(total_duration > 0){
			$(this).val(total_duration/60.0)
		}
		else{
			$(this).val(0)
		}
	})
}

//function to recaculate time fields for duration
function time_respond(field){
	var total_intensity = 0
	var times_container = field.closest('.workout_grid_cell')
	var total_duration_seconds = reverse_time(times_container.find('.total_duration_field').val())*60
	//calculate all intervals
	times_container.find('.intensity_row:visible').each(function(){
		var sets = $(this).find('.multiplier').val()
		var sub_duration = reverse_time($(this).find('.sub_duration').val())
		if(sets != "" && sub_duration != ""){
			$(this).find('.total_duration_interval').val(sets*sub_duration)
			total_intensity += (sets*sub_duration)
		}
	})
	times_container.find('.interval_zone_1').find('.total_duration_interval').val(total_duration_seconds - total_intensity)

}
function time_respond_mobile(field){
	var total_intensity = 0
	var times_container = field.closest('.time_container')
	var total_duration_seconds = reverse_time(times_container.find('.total_duration_field').val())*60
	//calculate intervals 
	times_container.find('.zone_row:visible').each(function(){
		var sets = $(this).find('.multiplier').val()
		var sub_duration = reverse_time($(this).find('.sub_duration').val())
		if(sets != "" && sub_duration != ""){
			$(this).find('.total_duration_interval').val(sets*sub_duration)
			total_intensity += (sets*sub_duration)
		}
	})
	times_container.find('.interval_zone_1').find('.total_duration_interval').val(total_duration_seconds - total_intensity)
	
}

$(function(){
	$('body').on('keyup', '.time_respond', function(){
		time_respond($(this))
	})
	$('body').on('keyup', '.time_respond_mobile', function(){
		time_respond_mobile($(this))
	})
	
	$('body').on('focus', '.format_time', function(){
		if($(this).val() == '0:00'){
			$(this).val('')
		}
		$(this).css('color', 'black')
	})

	$('body').on('blur', '.format_time', function(){
		var time = time_cleanup($(this).val())
		$(this).val(time)
		time_respond($(this))
		if($(this).val() == "0:00"){
			$(this).css("color", form_text_grey)
		}
		else{
			$(this).css('color', 'black')
		}
	})
})
