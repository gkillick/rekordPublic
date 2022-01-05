preferences_open = false
function string_activities(array){
	var new_array = JSON.parse(array)
	var new_string = ""
	for (var i = 0; i < new_array.length; i++) {
		if(i < (new_array.length - 1)){
		new_string += (new_array[i][0] + ",")
		}
		else{
			new_string += new_array[i][0]
		}
	}
	return new_string
}



	

function populate_activities(){
		var sport = $('.preferences_inner_cell .selectize-dropdown-content .selected').html()
		var activities = JSON.parse($('.sport_container').attr('data-activities'))
		$('.preferences').append("<div class='confirm_dialog_overlay'></div><div class='confirm_dialog_container'><div class='confirm_dialog'><div class='confirm_dialog_inside'><div class='update_activities confirm_yes confirm_button button' data-activities='"+JSON.stringify(activities[sport])+"'>overwrite activities?</div><div class='confirm_cancel confirm_button button_red'>keep activities</div></div></div></div>")
		$('.confirm_dialog_container').css('opacity')
		$('.confirm_dialog_container').css('opacity', 1)

}

	

function close_preferences(){
	$('.preferences_modal, .preferences').removeClass('show_preferences')
	setTimeout(function(){
		$('.preferences_modal').remove()
		

			preferences_open = false
	}, 300);
}

$(function(){
	
	//update activities when different sport selected 
	$('body').on('click', '.update_activities', function(){
			var activities = JSON.parse($(this).attr('data-activities'))
			$('.tagging_box li').remove()
			jQuery.each(activities, function(i, val){
				$('.tagging_box input').before("<li class='tagging_item' draggable='true' ondragstart='dragStarted(event)'>"+val[0]+"</li")
			})
			resolve_activities($('.tagging_box'))
			$('#start_date_field').submit()
			intitialize_draggable_list()
		
	})

	//close modal
	
	$('body').on('click', '.preferences_modal', function(e){
		if(e.target == this){
			close_preferences()
			$('#ui-datepicker-div').remove()
		}
	})
	
	$('body').on('click', '.preferences_link', function(e){
		if(preferences_open == true){
			e.preventDefault();
			e.stopImmediatePropagation()
		}
		else{
			preferences_open = true
		}
	})
	
	$('.preferences_link').on('ajax:success', function(xhr, data, status){
		
		$('body').append("<div class='preferences_modal'><div class='preferences'>"+data+"</div></div>")
	// select sport code 
	
var REGEX_EMAIL = '([a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@' +
                  '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)';
	
    sport_preference = $('#preferences_sport').selectize({
    create: true,
    sortField: 'text',
		onChange: function(){
			$('#start_date_field').submit()
		},
		onItemAdd: function(value, $item){
			var sports = jQuery.parseJSON($('.sport_container').attr('data-sports'))
			if($.inArray(value, sports) > -1){
				populate_activities()
			}
		}
		});
		

		
		$("#datepicker").datepicker({
			onSelect: function(){
				$('#start_date_field').submit()
			},
			nextText: ">",
			prevText: "<",
			changeYear:false,
			dateFormat: "MM dd",
		});
		

		$('.preferences_modal').css('opacity')
		$('.preferences_modal, .preferences').addClass('show_preferences')

		var container_height = $(window).outerHeight() -160
		$('.friendship_list_container').css({"max-height": container_height, "overflow": "auto"})

		intitialize_draggable_list()
	})
	
	
	
	
	//control navigation transitions
	$('body').on('click', '.preferences_nav_item', function(){
		if($(this).hasClass('selected_preference') == false){
			var nav_item = $(this).data('link')
			var old_nav_item = $('.selected_preference').data('link')
			old_height = $('#preferences_'+old_nav_item).height()
			$('.preferences_size').height(old_height)
			$('.preferences_nav_content').hide()
			$('.preferences_nav_item').removeClass('selected_preference')
			$(this).addClass('selected_preference')
			var new_height = $('#preferences_'+nav_item).height()
			$('.preferences_size').addClass('preferences_transition')
			$('.preferences_size').css('height', new_height)
			setTimeout(function(){
				$('#preferences_'+nav_item).fadeIn(400)
			}, 300);
		}
	})
	$('body').on('change', '#file-input', function(){
		$('.preferences_form').submit()
		$('#current_user_profile_pic').remove()
		
		$('#loaderImage').css("opacity", "1")
	})
	requests_open = false
	$('body').on('click', '.pending_requests', function(){
			if(requests_open == false){
			var top_position = $(this).position().top + $(this).height() - 3
			var left_position = $(this).position().left - $('.friend_request_container').width() + $(this).width()
		
			$('.friend_request_container').fadeIn(150).css({
				top: top_position,
				left: left_position
			})
			var margin_left = $('.friend_request_container').width() - $(this).width()/2 - 3
			$('.triangle_grey').css('margin-left', margin_left)
			requests_open = true
		}	
	})
	$(document).mouseup(function (e)
	{
	    var container = $(".friend_request_container");

	    if (!container.is(e.target) // if the target of the click isn't the container...
	        && container.has(e.target).length === 0) // ... nor a descendant of the container
	    {
			if(requests_open == true){
				container.hide();
				setTimeout(function() {
			    	requests_open = false
				}, 100);
			}
	    }
	});
	
	//adding activity
	$('body').on('click', '#add_new_activity', function(){
		$('.activity_list').append('<div style="display:none;opacity:0;"><input type="text-field"></input></div>')
		var new_activity = $('.activity_list div:last')
		var original_height = $('.activity_list').height()
		$('.activity_list').css('height', original_height)
		var the_height = new_activity.outerHeight()

		$('.activity_list').addClass('animate_three')
		$('.activity_list').css({
			height: original_height + the_height
		})
		
		
	})
	$('body').on('transitionend', '.activity_list', function(){
		$('.activity_list div:last').css({
			display:'block',
			opacity:'1'
		})
		$('.activity_list div:last input').focus()
	})
	
	//code for search athlete or coach 
	$('body').on('focus', '#friends_search', function(){
		if($(this).val() == "search athlete or coach.."){
			$(this).val('')
			$(this).removeClass('light_grey')
		}
	})
	$('body').on('blur', '#friends_search', function(){
		if($(this).val() == ""){
			$(this).val('search athlete or coach..')
			$(this).addClass('light_grey')
		}
	})

	//password confirm
	
	$('body').on('keyup', '.password_confirm', function(){
		if($('.confirm_password').val().length < 6){
			$('.confirm_password').next( ".password_tip" ).html('')
		}
		if($(this).val().length == 0 ){
			$(this).next( ".password_tip" ).html('')
		}
		if($(this).hasClass('new_password')){
			if($('.confirm_password').val() != $('.new_password').val()){
				$('.confirm_password').next( ".password_tip" ).html('')
			}
			if($(this).val().length > 0 && $(this).val().length < 6){
				$(this).next( ".password_tip" ).html('too short')
			}
			if($(this).val().length >= 6){
				if($('.confirm_password').val() == $('.new_password').val()){
					$('.confirm_password').next( ".password_tip" ).html('<span class="green icon-check-mark"></span>')
					setTimeout(function(){
					  $('.confirm_password').next('.password_tip').addClass("transparent")
					}, 1000);
					setTimeout(function(){
						$('.confirm_password').next('.password_tip').html('');
					  $('.confirm_password').next('.password_tip').removeClass("transparent")
					}, 1300);
				}
				$(this).next( ".password_tip" ).html('')
			}
		}
		if($(this).hasClass('confirm_password')){
			if($('.confirm_password').val().length >=6){
				if($('.confirm_password').val() == $('.new_password').val()){
					$(this).next( ".password_tip" ).html('<span class="green icon-check-mark"></span>')
					setTimeout(function(){
					  $('.confirm_password').next('.password_tip').addClass("transparent")
					}, 1000);
					setTimeout(function(){
						$('.confirm_password').next('.password_tip').html('');
					  $('.confirm_password').next('.password_tip').removeClass("transparent")
					}, 1300);
				}
				else{
					$(this).next( ".password_tip" ).html('')
				}
			}
		}
		
		//check that password fields are valid before submitting 
		
	})
	$('body').on('submit', '#edit_user', function(){
		if($('.confirm_password').val() == ""){
			$('.password_confirm').val('')
		}
	})


})