$(function () {
	$('body').on('click','#copy_button', function(){
		//open sidebar if closed
		var width = $('#side_bar').css('left').replace(/[^-\d\.]/g, '');
		if (width < 0){
			toggle_sidebar()
		}
		$('.toggle_item').last().trigger( "click" );

	})
	
	$('body').on("ajax:success",'#copy_button', function(xhr, data, status) {
		$('#select_box').fadeOut()
		$('.plan_container').prepend(data)
		$('.highlighted').each(function(){
			$(this).removeClass('highlighted', function(){

		})
		})
		var plan = $('.plan_container').children('.plan').first()
		plan.fadeOut(0)

		plan.fadeIn(300)
		if($('.plan_container').children('.plan').length == 5){
		$('.plan_container').children('.plan').last().remove()
		}
		$('.plan').draggable({ handle: '.traction',cursorAt: { right: -1, bottom:-1 }})

	
	});
	$('body').on('click', "#first_delete_button", function(){
		$(this).hide()
		$('#copy_button').hide()
		$('#delete_button').show()
		$('#cancle_button').show()
		
		
	})
	$('body').on('click', "#cancle_button", function(){
		$(this).hide()
		$('#delete_button').hide()
		$('#copy_button').show()
		$('#first_delete_button').show()		
		
	})
	$('body').on('click', "a#delete_button", function(){
		
		log_entry_ids = $(this).attr('data-entry_ids').split('-')
		$.each(log_entry_ids, function(i, val){
			$('#log_'+val).remove()
			
		})
		$(".highlighted").each(function(){
	   		$(this).removeClass("highlighted")
     	})
		$('#select_box').fadeOut(function(){
			$('#cancle_button').hide()
			$('#delete_button').hide()
			$('#copy_button').show()
			$('#first_delete_button').show()
		})
		if($('#remove_row_top').size() > 0){
			var workout_count = $('.workout_list').size()
			if(workout_count < 1){	
				var plan_top = plan_bar.position().top
				$('.plan_list_bars').hide();
				$('.plan_edit_link').show();
				$('.plan_title_center').children('input').show();
				plan_bar.fadeOut(function(){
					plan_bar.remove()
					$('.plan_bar').fadeIn()
					$('#plan_bar_container').scrollTop(scroll_position_plan)
					$('#plan_bar_container').css('height',($( window ).height()-51))
				})

				$('#plan_bar_container').css('padding-left', scrollbarWidth)
				$('#edit_plan_container').empty();
				$('#edit_plan_container').css('height',0)
			}
		}
		resolveTotals()
		
	})

	
});