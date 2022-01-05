var dialog_disabled = false

function paint_coach_comments(){
	var entries = $('.coach_comments_gradient_item')
	var total_entries = 3
	var n = 1
	var direction = "up"
	entries.each(function(){

		$(this).addClass('coach_comment_gradient')
		if(direction == "up"){
			$(this).addClass('coach_comment_gradient')
			$(this).css('background-position', "0% "+(n/total_entries*100)+"%")
			n++
			if(n == 6){
				direction = "down"
				n = n - 2
			}
		}
		else{
			$(this).addClass('coach_comment_gradient')
			$(this).css('background-position', "0% "+((5-n)/total_entries*100)+"%")
			n--
			if(n == 0){
				direction = "up"
				n = n + 2
			}
		}
	})


}
function resize_text_area(textarea){
		var text = textarea.val()
		textarea.siblings('pre').children('span').text(text)
		var height = textarea.siblings('pre').css('height')
		textarea.css('height', height)
}

//scroll bottom messages
function scroll_bottom_messages(){
	if($('.workout_entry_comments').size() > 0 ){
	var wtf = $('.workout_entry_comments');
	    var height = wtf[0].scrollHeight;
	    wtf.scrollTop(height);
		}
}


function close_dialog(){
	dialog_disabled = false
	//send comment if not sent.
	if($('.chat_input_field').val() != ""){
		$('.comment_form_athlete').submit()
	}
	$('.sub_duration, .rest_duration').each(function(){
		$(this).val(reverse_time($(this).val()))
	})
	if($('#instructions_text_area').val() == 'workout description..'){
		$('#instructions_text_area').val('')
	}
	$('.new_log_entry, .edit_log_entry').submit()
	$('.md_overlay').css('opacity','0')
	$('.md_modal').toggleClass("md_show");
	setTimeout(function(){
		$('.md_overlay').remove()
		$('.modal_container').remove()
	}, 200);
}

function format_workout_window() {
	//fade in  css animation
	$('.md_modal').css('transform')
	$('.md_overlay').css('opacity','1')
	$('.md_modal').toggleClass("md_show");

	//size up the textarea


	//move instructions to correct place in dom
	$('.expanding_area_instructions').append($('#instructions_text_area'))
	$('.expanding_area_summary').append($('#summary_text_area'))

	if($('#instructions_text_area').val() == ''){
		$('#instructions_text_area').val('workout description..').addClass('light_grey')
	}
	resize_text_area($('.expanding_area_instructions textarea'))
	resize_text_area($('.expanding_area_summary textarea'))
	resize_text_area($('.expanding_area_coach_comments textarea'))
	autosize($('.athlete_comment_messenger'));

	//cleanup all inputs to format: 00:00
  calculate_total()
	format_time()
	scroll_bottom_messages()
	$('.instructions_drop table tr').each(function(){
				$(this).children().last().removeClass('hidden').prev().removeClass('no_right_border')

	})
	$('.instructions_drop').css({
		visibility:'hidden',
		opacity:0
	})


		$('.new_circle_slider').draggable({ axis: "x", containment: 'parent', drag: function( event, ui ) {}, stop: function( event, ui ) {$(this).removeClass('tooltip')}, });

	$('.new_circle_slider').each(function(){
		percent = $($(this).attr('data-form')).val()
		$(this).attr('data-content', parseFloat(percent/10.0).toFixed(0))
		total_width = $('.slider').width() - 14
		width = total_width*percent/100.0
		$(this).css('left', width)
		$(this).siblings('.slider_percentage').css('background-position', '0% '+percent+'%')
		$(this).siblings('.slider_percentage').width(width+5)
	})
	$('.custom_select').selectize({
		create:false,
    readOnly: true,
    onDelete: function() { return false }
	});
	$('select').selectize()
	$('.new_circle_slider').hover(
	       function(){ $(this).addClass('tooltip') },
	       function(){ $(this).removeClass('tooltip') }
		)
};
$(function(){

	//remove fields new code
	$('body').on('click', '.remove_fields, .remove_link', function(){
		var table = $(this).closest('table')
		var row = $(this).closest('.intensity_row')
		var row_height = row.outerHeight()
		var table_animate = $(this).closest('.table_animate')
			$(this).prev("input[type=hidden]").val("1");
			if(table.find('tr:visible').size() > 2){
				var new_height = table_animate.height() - row.height()
				var the_opacity = 1
			}
			else{
				var new_height = 0
				var the_opacity = 0
			}
			row.css('opacity','0')
			row.children('td').each(function(){
				$(this).wrapInner( "<div style='height:"+row_height+"' class='row_animate'></div>" );
			})
			if(table.find('tr:visible').size() < 3){
				table_animate.animate({
					height:0,
					opacity:0,
				}, 300, function(){
					table_animate.addClass("hidden")
					table_animate.removeAttr("style")
				})
			}
			$('.row_animate').animate({
				height:0
			},300, function(){
				row.hide()

				console.log($('.right_cell_m').size())
				if($('.right_cell_m').size() > 0){
					time_respond_mobile($(this))
				}
				else{
					time_respond($(this))
				}


			})
	})
	//adding fields new keyCode

	$('body').on('click', '.add_fields, .add_field', function(event){
		link = $(this)
		var tables = $('.table_animate')
		var table_open = false
		tables.each(function(table){
			if(!$(this).hasClass('hidden')){
				table_open = true
			}
		})
		var time = new Date().getTime();
		var regexp = new RegExp($(this).data('id'), "g")
		var table_animate = $(link).siblings('.table_animate')
		var table = $(link).siblings('.table_animate').find('table')

		if (table_animate.size() == 0){
			table_animate = $(link).closest('.padding_mobile_workout').next().children('.table_animate')
			table = table_animate.find('table')
		}
		var table_animate_height = table_animate.height()
		table.append($(this).data('fields').replace(regexp, time))
		event.preventDefault()
		var table_height = table_animate.height()
		if(table.find('tr:visible').size() < 1){
			if(table_open){
				table_animate.removeClass('hidden')
				table_animate.css({
					opacity:0,
				})
				table_animate.animate({
					opacity:1
				}, 300)
			}

			else{
				table_animate.removeClass('hidden')
				var table_height = table_animate.height()
				table_animate.css({
					opacity:0,
					height:0,
				})
				table_animate.animate({
					height:table_height,
				}, 300, function(){
					table_animate.animate({
						opacity:1
					}, 300)
					table_animate.css('height','auto')

				})
			}
		}
		else{
			table_animate.css('height', table_animate_height)
			var new_height = table.outerHeight()
			table.find('tr').last().css('opacity','0')
			table_animate.animate({
				height:new_height
			},300, function(){
				table_animate.css('height','auto')
				table.find('tr').last().animate({
					opacity:1
				},300)
			})

		}
		table.find('tr').last().find('.select_zone').selectize()
		table.find('tr').last().find('.custom_select_mobile').niceSelect();
		format_time()

	});

	$('body').on('mouseenter', '.new_circle_slider, .new_circle_slider_m', function(){
    $(this).addClass('tooltip')
  })
  	$('body').on('mouseleave', '.new_circle_slider, .new_circle_slider_m', function(){
    $(this).removeClass('tooltip')
  })

	$('body').on('focus', '#message_message', function(){
		if(!$('.comment_history').hasClass('comment_history_open')){
			$('.comment_history').addClass('comment_history_open')
		}

	})
	$('body').on('blur', '#message_message', function(){
		if($('.comment_history_list').children('li').size() == 0){
			$('.comment_history').removeClass('comment_history_open')
		}


	})

	//messenger

	$('body').on('click', '.send, .send_dashboard', function(e){
		e.preventDefault();
		var message_field = $(this).closest('.new_message').find('.message_field')
		if(message_field.val() != "" && message_field.val() != "comment.."){
			console.log('hi there')
			$(this).closest('.new_message').submit()
		}
	})
	$('body').on('mousedown', '.send, .send_dashboard', function(e){
		e.preventDefault();
	})
	$('body').on('click touchstart', '.md_overlay, .icon-close-thick', function(){
			close_dialog()
	})
	$('body').on('click touchstart', '.modal_container', function(e){
		if(e.target != this) return;
			close_dialog()
	})

	//stop submit on enter
	$('body').on('keypress keydown keyup', '.new_message', function(e){
	       if(e.keyCode == 13) {
					 e.preventDefault();

				  }
	});
	$('body').on('keyup', '.new_message', function(e){
	       if(e.keyCode == 13) {
					 if($(this).find('.message_field').val() != ""){

						 $(this).submit()

					 }
				 }

	});

	//new_slider_gradient
	$('body').on('drag', '.new_circle_slider', function(event,ui){
		width = ui.position.left
		total_width = $('.slider').width() - 25
		percent = Math.round(width/total_width * 100)
		var background_percent = percent - 1
		$(this).siblings('.slider_percentage').css('background-position', '0% '+background_percent+'%')
		$(this).siblings('.slider_percentage').width(width+5)
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

	//instructions mirror for sizing textarea

	$('body').on('input', '.expanding_area textarea', function(){
		resize_text_area($(this))
	})
	$('body').on('focus', '#instructions_text_area', function(){
		if($(this).val() == 'workout description..'){
			$(this).val('')
			$(this).removeClass('light_grey')
		}
	})
	$('body').on('blur', '#instructions_text_area', function(){
		if($(this).val() == ''){
			$(this).val('workout description..')
			$(this).addClass('light_grey')
		}
	})


	//allow entire li element to trigger the dialog window
	$('body').on('click', '.workout_list li', function(e){
		var delete_workout = $(this).find('.delete_workout')
		var workout_link = $(this).find('.dialog_link')
		if(!$(e.target).closest('a').length){
		if($(e.target).html() != delete_workout.html()){
			if($(e.target).html() != workout_link.html()){
				if($(e.target).html() != $(this).find('.delete_workout_link').html()){
					workout_link.click()
				}
			}
		}
		}
	})

});
