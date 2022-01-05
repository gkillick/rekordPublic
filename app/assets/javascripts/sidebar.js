search_open = false
function toggle_sidebar(){

	if($('#toggle span').first().hasClass('icon-chevron-right')){
		$('#toggle span').removeClass('icon-chevron-right')
		$('#toggle span').addClass('icon-chevron-left')
	}
	else{
		$('#toggle span').removeClass('icon-chevron-left')
		$('#toggle span').addClass('icon-chevron-right')
	}
	if($("#side_bar").hasClass("side_bar_open")){
			$("#side_bar").removeClass("side_bar_open")
			$.put('users/set_preferences/0/nil')
			$("#side_bar").css({
		       left: '-20%'
		    });
				$("#right_container").css({
					width: "100%",
					left: '0%'
				})

setTimeout(function(){ load_graphs() }, 500);

	}
	else{
			$.put('users/set_preferences/1/nil')
			$("#side_bar").addClass("side_bar_open")
			$("#side_bar").css({
		       left: '0%'
		    });
			$("#right_container").css({
				width: "80%",
				left: '20%'
			})
			//resize graphs because highcharts doesn't want to
			setTimeout(function(){ load_graphs() }, 500);


	}
	abreviate_activities()

}
function open_search(){
	search_open = true
	$('#search').hide();
	$('#search_field').show();
	if($('#search_name').val() == "name.."){
		$('#search_name').val('')
	}
	$('#search_name').css("color", "black")
	$('#search_name').css("font-style", "normal")
	$('#search_name').focus();
	if($('#search_name').val().toLowerCase() != "all"){
		$('#search_name').val('');
		$('#names_list').empty();
	}
}

//side bar animate out and in through switch statement::

function adjust_side_bar(view){
	switch (view) {
		case "graphs":
			$('.calendar_only_item').addClass('transparent');
			break;
		case "calendar":
		$('.side_bar_plan_view').addClass('transparent')
			setTimeout(function(){
				$('.side_bar_plan_view').addClass('hidden')
				$('.plan_to_hide').removeClass('hidden')
				$('.calendar_only_item').removeClass('hidden');
				$('.calendar_only_item').css('opacity')
				$('.plan_to_hide').css('opacity')
				$('.plan_to_hide').removeClass('transparent')
				$('.calendar_only_item').removeClass('transparent');
			},500)
		break;
		case "dashboard":
			$('.calendar_only_item').addClass('transparent');
			$('.side_bar_plan_view').addClass('transparent')
			setTimeout(function(){
				$('.side_bar_plan_view').addClass('hidden')
				$('.plan_to_hide').removeClass('hidden')
				$('.plan_to_hide').css('opacity')
				$('.plan_to_hide').removeClass('transparent')
				$('.calendar_only_item').addClass('transparent')
			},500)
		break;
		case "plans":
		$('.plan_to_hide').addClass('transparent')
		setTimeout(function(){
			$('.plan_to_hide').addClass('hidden')
			$('.side_bar_plan_view').removeClass('hidden')
			$('.side_bar_plan_view').css('opacity')
			$('.side_bar_plan_view').removeClass('transparent')
		},500)
		default:

	}
}

$(function(){



	//make search field appear
	$('body').on('click','#search', function(e){
		open_search()
		e.stopPropagation();
		e.preventDefault();

	})

	//make dissapear if elsewhere is clicked

	$(document).click(function() {
		$('#search_field').hide();
		$('#search').show();
		search_open = false
	});



	//controll the selector with keypress in name_list
	$("body").on('click', 'a.get_the_graph, a.get_the_graph_menu', function(event) {

		adjust_side_bar("graphs")

		$('#right_container').fadeOut("fast");

	})
	$("body").on("ajax:success", 'a.get_the_graph, a.get_the_graph_menu', function(evt, data, status, xhr){
	  $('#right_container').html(data);

		//animate the bars



			$('.bar_animated').each(function(){

				var height_bar = $(this).css('height')
				if (height_bar != "0px" && height_bar != "") {

				if(height_bar.indexOf("px") !== -1){

					height_bar = (parseInt(height_bar) / 250)*100
				}


				$(this).height("0px")
				if(height_bar.indexOf("%") !== -1){
				$(this).animate({

					height: height_bar,
				},1000, "easeOutQuart")
			}
			else{
				$(this).animate({

					height: height_bar + "%",
				},1000, "easeOutQuart")
			}
			}
			})








      $('#right_container').fadeIn("fast", function(){
			load_graphs();
		});


    })

	// grabs a calendar for a given id and replaces current calendar
	$("body").on('click', 'a.get_the_cal', function(event) {
		$('#right_container').animate({
			opacity:0
		},0)
		$('.search_field_side_bar').removeClass('search_field_side_bar_closed')
		$('#select_box').hide();
		$('#search_field').hide();
		$('#search').show();
	})


	// esc to open search field


	//side_bar search field
	$("#search_name").focus(function(){
		$("#names_list").fadeIn()
	})
	$("#search_name").on('click', function(e){
		e.stopPropagation();
	})
	$("#search_name").on("keyup", function(e) {
		var search_object = $(this)
		delay(function(){
		$("#names_list").fadeIn()
	    switch (e.keyCode) {
	        case 16: // Shift
	        case 17: // Ctrl
	        case 18: // Alt
	        case 19: // Pause/Break
	        case 20: // Caps Lock
	        case 27: // Escape
	        case 35: // End
	        case 36: // Home
	        case 37: // Left
	        case 38: // Up
            if($("input,textarea").is(":focus")){
				if($(".highlighted_box").length == 0) {
					$('#names_list').children().last().children().addClass("highlighted_box")
			    }
			    else if($('#names_list').children('a').length > 1) {
				  d = $('.highlighted_box').parent()
				  $('.highlighted_box').removeClass("highlighted_box")
				  d.prev().children().addClass("highlighted_box")

		    	}
			}
			break;
	        case 39: // Right
			break;
			case 13: // Enter
			if($(".highlighted_box").length == 1) {
		       $('.highlighted_box').parent().click()


		    }
			else if($('#names_list').children('a').length > 0){
				$('#names_list').children('a').first().click()

			}
		    break;
	        case 40: // Down
	        if($("input,textarea").is(":focus")){
				if($(".highlighted_box").length == 0) {
			       $('#square_1').addClass("highlighted_box")
			    }
			    else if($('#names_list').children('a').length > 1) {
				  d = $('.highlighted_box').parent()
				  $('.highlighted_box').removeClass("highlighted_box")
				  d.next().children().addClass("highlighted_box")

		    	}
			}
			break;
	        // Mac CMD Key
	        case 91: // Safari, Chrome
	        case 93: // Safari, Chrome
	        case 224: // Firefox
	        break;
	        default:
	          name = search_object.val()
			if (search_object.val() == "") {
				name = null
			}

			$.get('/coaches/get_name/'+name, function(data) {
			  $('#names_list').html(data);
			});
	        break;
	    }
}, 300 );
	})

	//side bar animate out and in through switch statement::

	$("#toggle").click(function(event) {
		toggle_sidebar()
	})
	$('body').on('click', '.comments_title', function(){
		$(this).toggleClass('comments_closed_title')
		$('.side_bar_flex_2').toggleClass('comments_closed')
		if($('.side_bar_flex_2').hasClass('comments_closed')){
			$.put('users/set_custom_preference/comments/false')
		}
		else{
			$.put('users/set_custom_preference/comments/true')
		}


	})
	$('body').on('mouseenter', '.comments .comment_wrapper', function(){
		var workout_id = "workout_"+$(this).children('.comment').first().data('workout-id')
		$("#"+workout_id).addClass('fade_workout')
		$('.'+workout_id).children('.comment').css('background', 'white')

	})
	$('body').on('mouseleave', '.comments .comment_wrapper', function(){
		var workout_id = "workout_"+$(this).children('.comment').first().data('workout-id')
		$("#"+workout_id).removeClass('fade_workout')
		$('.'+workout_id).children('.comment').removeAttr('style')
	})
	$('body').on('click', '.comments .comment', function(){
			var workout_id = "workout_"+$(this).data('workout-id')
		$("#"+workout_id).click()
		$('.'+workout_id).children('.comment').removeAttr('style')
	})


 });
