var source;

function re_color_workouts(){
	var activities = JSON.parse($('#preferences_activities').val())
	var workouts = $('.workout_list li')
	workouts.each(function(){
		var workout = $(this)
		var activity = $(this).attr('data-activity')
		var activity_removed = true
		for (var i = 0; i < activities.length; i++){
			if(activities[i][0] == activity){
				activity_removed = false
				if(activities[i].length == 1){
					workout.css('background', "")
				}
				else{
					workout.css('background', activities[i][1])
				}
			}
		}
		if(activity_removed == true){
			workout.css('background', "")
			activity_removed = false
		}
	})
	paint_workouts()

}

function Shuffle(o) {
	var new_array = []
	var i = 0
	while(i < Math.ceil(o.size()/2.0)+1){

		new_array.push($(o)[i])
		new_array.push($(o)[o.size() - i])
		i++
	}
	return $(new_array)
};

function resolve_activities(list){

	// 1. check what values are in the selectize field and activities field
	var selectize_activities = []
	list.children('li').each(function(){

		selectize_activities.push($(this).html())

	})

	var activities_field = 	JSON.parse($('#preferences_activities').val())

	// 2. Create a new array by finding all the common values and checking for color values

	var updated_activities = []
	for (var i = 0; i < selectize_activities.length; i++) {
		var activity = selectize_activities[i]
		var old_activity = false
		for (var e = 0; e < activities_field.length; e++) {
			if (activities_field[e][0] == activity) {
				old_activity = true
				if(activities_field[e].length == 2){
					updated_activities.push(activities_field[e])
				}
				else{
					updated_activities.push([activity])
				}
			}
		}
		if(old_activity == false){
				updated_activities.push([activity])
		}

	}
	$('#preferences_activities').val(JSON.stringify(updated_activities))

	$('.edit_preferences').submit()
	re_color_workouts()
}

function adjustItems(source,evt){
	var source = $(source)
	var target = $(evt.target)
	if(source.index() < target.index()){
		target.after(source).addClass('li_drag').siblings('li').removeClass('li_drag')
	}
	else{
		target.before(source).addClass('li_drag').siblings('li').removeClass('li_drag')
	}
	resolve_activities(source.parent())

}
function dragEnd(evt){
	$('.tagging_box li').removeClass('li_drag')
}
function dragStarted(evt){

	//start drag
	source=evt.target;

	//set data
	evt.dataTransfer.setData("text/plain", evt.target.innerHTML);

	//specify allowed transfer
	evt.dataTransfer.effectAllowed = "move";
}

function draggingOver(evt){
//drag over
evt.preventDefault();
//specify operation

//check if index is new position
	adjustItems(source,evt)
	evt.dataTransfer.dropEffect = "move";
}

function dropped(evt){
//drop
evt.preventDefault();
evt.stopPropagation();
//update text in dragged item
source.innerHTML = evt.target.innerHTML;
$('.tagging_box li').removeClass('li_drag')
//update text in drop target
evt.target.innerHTML = evt.dataTransfer.getData("text/plain");
}

function intitialize_draggable_list() {
	$('.tagging_box li').attr({
		'ondragover':"draggingOver(event)",
		'ondragstart':"dragStarted(event)",
		'ondrop':"dropped(event)",
		'draggable': 'true',
		'ondragend': 'dragEnd(event)',
	})
}

function fadeIn(current, max, itmsList)
{
    $(itmsList[current]).css('opacity','1');
    if(current<max)
    {
        setTimeout( function() {fadeIn(current + 1,max,itmsList);}, 20);
    }
}

color_palette_open = false

$(function(){
	//delete tag
	$('body').on('click', '.delete_activity a', function(e){
		e.preventDefault()
		var activity = $(this).parent().parent().parent().data('li')
		$(this).parent().parent().parent().parent().children('li').each(function(){
			if($(this).text() == activity){
				$(this).remove()
			}
		})
		$(this).parent().parent().parent().remove()
		color_palette_open = false
		resolve_activities($('.tagging_box'))


	})
	//click on color
	$('body').on('click', '.tagging_circle', function(){
		var color = $(this).attr('data-color')
		var li_text = $(this).parent().parent().attr('data-li')
		$(this).parent().parent().parent().children('li').each(function(){
			if($(this).text() == li_text){
				$(this).css('background', color)
				$(this).attr('data-color', color)

			}
		})
		var activities = JSON.parse($('#preferences_activities').val())
		for (var i = 0; i < activities.length; i++) {
			if(activities[i][0] == li_text){
				if(color == "#2095f8"){
					activities[i] = activities[i].slice(0, 1);
				}
				else{
				if(activities[i].length == 1){
					activities[i].push(color)
				}
				else{
					activities[i][1] = color
				}
				}
			}
		}
		$('#preferences_activities').val(JSON.stringify(activities))
		resolve_activities($(this).parent().parent().parent())
		$(this).parent().parent().remove()
		color_palette_open = false
	})
	$('body').on('click', function(e){
		if(color_palette_open){
   	 if(!$(e.target).closest('.tagging_tooltip').length && !$(e.target).closest('.tagging_box li').length) {
    			$('.tagging_tooltip').remove()
				 	color_palette_open = false
    	}
		}
	})
	//color palette
	$('body').on('click', '.tagging_box li', function(){

		if(color_palette_open == false){
		$('.tagging_tooltip').remove()
		$(this).parent().append('<div class="tagging_tooltip" data-li="'+$(this).text()+'"><div class="taggin_triangle"></div><div class="tagging_tooltip_body"></div></div>')
		var color_array = ['#4DAF7C','#1abc9c','#42dd5b','#14e0ca','#2095f8','#4275dd','#BF55EC','#e014d4','#DC3023','#F9690E','#336E7B','#535187','#6C7A89','#8D8D8D','#4c4c4c']
		var i = 0
		$(color_array).each(function(){
			i++
			$('.tagging_tooltip_body').append('<div class="tagging_circle" style="background:'+this+';" data-color="'+this+'"></div>')
			if(i%5 == 0){
				$('.tagging_tooltip_body').append('</br>')
			}
		})
		$('.tagging_tooltip_body').append('<div class="delete_activity"><a href="#">delete</a></div>')
		var width = $('.tagging_tooltip').width()
		$('.tagging_tooltip').css('width',width)
		var position = $(this).position()
		var tool_tip_width = $('.tagging_tooltip').outerWidth()
		var tag_width = $(this).outerWidth()
		var tag_height = $(this).outerHeight()
		$('.tagging_tooltip').css({
			top: position.top + tag_height,
			left: position.left - tool_tip_width*.5 + tag_width*.5
		})
		//shuffle display of colors
		var color_animate_array = Shuffle($('.tagging_tooltip_body .tagging_circle'))
		//$('.tagging_tooltip_body .tagging_circle').css('opacity','1')
		fadeIn(0, color_animate_array.size(), color_animate_array)
		color_palette_open = true
		}
		else{
			$('.tagging_tooltip').remove()
			color_palette_open = false
		}

	})

	$('body').on('keyup', '.tagging_box input', function(e){
		var key = e.keyCode || e.charCode;
		if($(this).val().length > 0 ){

			if(e.keyCode == 13){
				$('.add_tag').css('display','none')
				$(this).before("<li class='tagging_item' draggable='true' ondragstart='dragStarted(event)'>"+$(this).val()+"</li")
				$(this).val("")
				intitialize_draggable_list()
				resolve_activities($(this).parent())
			}
			else{
				var height = $(this).parent().outerHeight() - 2
				$('.tagging_item_mirror').text($(this).val())
				var width = $('.tagging_item_mirror').width() + 40
				$(this).css('width', width)

				$('.add_tag').html('add <b>'+$(this).val()+"</b>..").css('display', 'block').css('top',height)
		}

		}
		else if(key == 8 || key == 46){
			$(this).prev('.tagging_item').remove()
		}

		else{
			$('.add_tag').css('display','none')
		}
	})

	$('body').on('click', '.tagging_box', function(e){
		if(e.target != this) return;
		$(this).children('input').focus()
	})

	//draggable logic




})
