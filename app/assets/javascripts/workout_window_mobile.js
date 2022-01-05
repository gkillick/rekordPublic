function enable_slider(){
	$('.new_circle_slider_m').draggable({ axis: "x", containment: 'parent', drag: function( event, ui ) {}, stop: function( event, ui ) {$(this).removeClass('tooltip')}, });
	$('.new_circle_slider_m').each(function(){
		percent = $($(this).attr('data-form')).val()
		$(this).attr('data-content', parseFloat(percent/10.0).toFixed(0))
		total_width = $('.slider').width() - 14
		width = total_width*percent/100.0
		$(this).css('left', width)
		$(this).siblings('.slider_margin_container').children('.slider_percentage').css('background-position', '0% '+percent+'%')
		$(this).siblings('.slider_margin_container').children('.slider_percentage').width(width+5)
	})
}

function align_input_tools(){
	$('.input_mobile_container').each(function(){
		var height = $(this).height()
		var width = $(this).width()

		var button_width = $(this).children('.align_this_button').first().width()
		$(this).children('.align_this_button').css({
			top:height + 5,
			left:(width/2)-(button_width/2)
		})

	})
}
function format_inputs(){
	var totals = [0]
	var total = 0
	$('.zone_row').each(function(){
		var total_duration = $(this).find('.total_duration_interval').val()
		if(total_duration != ""){
		totals.push(total_duration)
		total += parseInt(total_duration)
		}
	})
	if(total > 0){
	$('.total_duration_field').val(total/60)
	format_time_mobile()
	}
}



$(function(){


	//delete functionality

	$('body').on('mouseenter', '.coach_comments', function(){
		$(this).find('.close-message').css('opacity',1)
	})
	$('body').on('mouseleave', '.coach_comments', function(){
		$(this).find('.close-message').css('opacity',0)
	})

	$('body').on('focus', '.add_colon_field', function(){

		if($(this).siblings('.time_colon_link').size() == 0){
			$(this).after('<a href="#" class="time_colon_link align_this_button"><div class="time_colon">:</div></a>')
			align_input_tools()
		}


		$(this).next('.time_colon_link').css({
			opacity: 1,
			visibility: 'visible'
		})
	})
	$('body').on('blur', '.add_colon_field', function(){
		$(this).next('.time_colon_link').css({
			opacity: 0,

		})
		if($(this).val().indexOf(':') > -1){
			$(this).next('.time_colon_link').children().addClass('not_active')
		} else{
			$(this).next('.time_colon_link').children().removeClass('not_active')
		}



	})

	$('body').on('blur', '.format_time_mobile', function(e){
		var field = $(this)
		setTimeout(function(){
			if(field.is(':focus')){

			}else{
				format_time_mobile()
				time_respond_mobile(field)

				field.next('.time_colon_link').css({
			opacity: 0,
			visibility: 'hidden'
		})


			}
		},200)


	})

	$('body').on('tap', '.time_colon_link', function(e){
		$(this).prev().focus()
		e.preventDefault()
		var time_value = $(this).prev('.add_colon_field').val()
		if(time_value.indexOf(':') == -1){
		var new_value = time_value + ":";
		$(this).prev('.add_colon_field').val(new_value)
		}

		if($(this).prev('.add_colon_field').val().indexOf(':') > -1){
			$(this).children().addClass('not_active')
		}
		$(this).prev().focus()
	})
	$('body').on('keyup', '.add_colon_field', function(){
		if($(this).val().indexOf(':') > -1){

			$(this).next('.time_colon_link').children().addClass('not_active')
		} else{
			$(this).next('.time_colon_link').children().removeClass('not_active')
		}
	})









	//edit ajax



	//new_slider_gradient
	$('body').on('drag', '.new_circle_slider_m', function(event,ui){
		width = ui.position.left
		total_width = $('.slider').width() - 14
		percent = Math.round(width/total_width * 100)
		$(this).siblings('.slider_margin_container').children('.slider_percentage').css('background-position', '0% '+percent+'%')
		$(this).siblings('.slider_margin_container').children('.slider_percentage').width(width+5)
		$(this).removeClass('tooltip')
		$(this).addClass('tooltip')
		var number = 0
		if(parseFloat(percent/10.0).toFixed(1) < 10 && parseFloat(percent/10.0).toFixed(1) > 9){
			number = 9
		}
		else if(parseFloat(percent/10.0).toFixed(0).toString() == "10"){
			number = 10
		}
		else{
			number = parseFloat(percent/10.0).toFixed(0)
		}
		$(this).attr('data-content', number);
		var id = $(this).attr('data-form')
		$(id).val(number*10)
	})

	$('body').on('ajax:success','.delete_workout_link_m', function(evt, xhr, settings){
		$(this).parent().addClass('removing_workout')


	})

	//before submit stuff
	$('body').on('submit', '.log_entry_form', function(){
		format_inputs()
		//reverse the sub_duration fields
		$('.sub_duration, .rest_duration').each(function(){
			$(this).val(reverse_time($(this).val()))
			console.log($(this).val())
		})

	})

	//disable edit and new_workout links after click

	$('body').on('click', '.disabled_link', function(e){
		e.preventDefault();
		event.stopImmediatePropagation();

	})
	$('body').on('submit', '.log_entry_form', function(){
		$('button[type=submit], input[type=submit]').prop('disabled',true);
		setTimeout(function(){$('button[type=submit], input[type=submit]').prop('disabled',false);}, 900)
	})
	$('body').on('click', '.variable_link', function(){
		$(".variable_link").addClass('disabled_link')
	})

})
