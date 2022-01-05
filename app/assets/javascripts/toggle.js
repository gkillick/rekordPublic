function double_toggle(v){
	var x = v.children('.on_off_toggle').first()
	if(v.hasClass('permission_view_training')){
		if(x.hasClass('toggle_false')){
			var other_toggle = x.closest('.right_permission_list').find('.permission_limited_view')
			if(other_toggle.children('.on_off_toggle').first().hasClass('toggle_true')){
				other_toggle.children('.on_off_toggle').first().children('.on_off_circle').css('left', '0px')
				position_toggle(other_toggle, false)
				var url = other_toggle.attr('href').split("=").shift()+"=true" 
				other_toggle.attr('href', url)				
			}
		}

	}
	else if(v.hasClass('permission_limited_view')){
		if(x.hasClass('toggle_true')){
			var other_toggle = x.closest('.right_permission_list').find('.permission_view_training')
			if(other_toggle.children('.on_off_toggle').first().hasClass('toggle_false')){
				other_toggle.children('.on_off_toggle').first().children('.on_off_circle').css('left', '19px')
				position_toggle(other_toggle, true)
				var url = other_toggle.attr('href').split("=").shift()+"=false" 
				other_toggle.attr('href', url)
			}
		}
	}
}
function position_toggle(v, value){
	var x = v.children('.on_off_toggle').first()
	x.removeClass('toggle_'+(!value).toString())
	x.addClass('toggle_'+value.toString())
	x.children('.on_off_circle').removeClass('toggle_'+(!value).toString()+'_circle')
	x.children('.on_off_circle').addClass('toggle_'+value.toString()+'_circle')
}
function animate_toggle(v, value){
	var x = v.children('.on_off_toggle').first()
	if(value){
		css_left = "0px"
		animate_left = "19px"
	}
	else{
		css_left = "19px"
		animate_left = "0px"
	}
	x.children('.on_off_circle').css('left', css_left)
	x.children('.on_off_circle').animate({
		left: animate_left
	},250, function(){
		toggle_animation_complete = true
		enable_link(v)
		double_toggle(v)
		
	})
}
function toggle_it(x){
	toggle_animation_complete = false
	toggle_ajax_complete = false
	var url = $(x).attr('href')
	var value = url.split("=").pop() == "true"
	if(value){ var new_url = url.split("=").shift()+"=false"}
	else{ var new_url = url.split("=").shift()+"=true" }
	x.removeAttr('data-remote').attr('href', "#").removeAttr('data-method').attr('data-href', new_url)
	position_toggle(x, value)
	animate_toggle(x, value)
}
function enable_link(x){
	if(toggle_animation_complete == true && toggle_ajax_complete == true){

		var new_url = x.attr('data-href')
		x.attr('data-remote', 'true').attr('href', new_url).attr('data-method', 'put')
	}
}

$(function(){
	$('body').on('ajax:send', '.toggle_link', function(){
		toggle_it($(this))
	})
	$('body').on('ajax:success', '.toggle_link', function(){
		toggle_ajax_complete = true

		enable_link($(this))
	})
})