function AnimateRotate(angle,selector,start) {
    // caching the object for performance reasons
    var $elem = $(selector);

    // we use a pseudo object for the animation
    // (starts from `0` to `angle`), you can name it as you want
    $({deg: start}).animate({deg: angle}, {
        duration: 400,
        step: function(now) {
            // in the step-callback (that is fired each step of the animation),
            // you can use the `now` paramter which contains the current
            // animation-position (`0` up to `angle`)
            $elem.css({
                transform: 'rotate(' + now + 'deg)'
            });
        }
    });
}

$(function(){
	$('body').on('click','.icon-plus-circle_big', function(){
		if($('.custom_field_choices').height() == 0){
			$('.custom_field_choice').css('cursor','move')
			$(this).addClass('black')
			AnimateRotate(45,'.icon-plus-circle_big','0')
			$('.custom_field_choices').animate({
				height:'100px',
			},function(){
				$('.custom_field_choices').animate({
					opacity:1
				},'700')
			})
		}
		
		else{
			AnimateRotate(0,'.icon-plus-circle_big',45)
			$(this).removeClass('black')
			$('.custom_field_choice').css('cursor','auto')
			$('.custom_field_choices').css('opacity','0')
			$('.custom_field_choices').animate({
				height:'0px',
			}, function(){
				$('.custom_field_choices').css('opacity','0')
			})
			
		}
	})
	//open workout drawer
	$('body').on('click', '.info_workout', function(){
		width = $('.workout_drawer').width()
		if($('.workout_drawer').css('left') == "-"+width+"px"){
			$('.hidden_custom_field').animate({
				opacity:0
			})
			$('.workout_drawer').animate({
				left:0,

			}, 400)
			$('.workout_drawer div').animate({
				opacity:0
			},400)
			$(this).removeClass('black')
			$('.custom_field_choice').css('cursor','auto')
		}
		else{
			$('.hidden_custom_field').animate({
				opacity:1
			})
			$(this).addClass('black')
			$('.custom_field_choice').css('cursor','move')
			$('.add_row').css('cursor','pointer')
			$('.workout_drawer').animate({
				left: "-"+width+"px",

			},400)
			$('.workout_drawer div').animate({
				opacity:1
			},600, function(){

			})
		}
	})
	
	//add row to custom fields
	$('body').on('click', '.add_row', function(){
		var custom_number = $('.custom_field_container_inside').last().data('custom-number')
		var a_new_row = "<div class='custom_field_wrapper_new'><div class='custom_field_container_new'><div class='custom_field_container_inside no_right_border center_sports grey' data-custom-number='"+(custom_number+1).toString()+"'>custom "+(custom_number+1).toString()+"</div></div><div class='custom_field_container_new'><div class='custom_field_container_inside no_right_border center_sports grey' data-custom-number='"+(custom_number+2).toString()+"'>custom "+(custom_number+2).toString()+"</div></div><div class='custom_field_container_new'><div class='custom_field_container_inside center_sports grey' data-custom-number='"+(custom_number+3).toString()+"'>custom "+(custom_number+3).toString()+"</div></div></div>"
		$('.day_stats').append(a_new_row)
	})
})
