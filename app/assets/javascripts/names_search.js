$(function(){
	$("body").on('click', '#athlete_plan_toggle .toggle_item', function(){
		if($(this).hasClass('selected_toggle_item') != true ){
			$(this).css("background", primary_color)
			$(this).siblings().css("background", "#d2d2d2")
			$(".selected_toggle_item").removeClass('selected_toggle_item')
			$(this).addClass('selected_toggle_item')

			if($(this).hasClass('display_athletes')){
				$.put('users/set_preferences/nil/1')
				$('#athlete_search_sidebar').show()
				var athlete_list_height = $(".athlete_list").height()
				$('#athlete_search_sidebar').hide()
				if($('.plan_list').is(":visible") == false){
					$('.plan_list').show()
					$('.plan_list').css({opacity:0,height:0})
					var plans_open = true
				}
				$('.plan_list').animate({
					height: athlete_list_height,
					opacity: "0"
				}, function(){
					$('#plans_search_sidebar').hide()
					$('#athlete_search_sidebar').show()
					$('.athlete_list').css('opacity','0')
					$('.athlete_list').animate({
						opacity: 1
					})
					$('.plan_list').css({
						height: "auto",
						opacity: 1

					})
					if(plans_open == true){
						$('.plan_list').hide()

					}


				})

			}
			if($(this).hasClass('display_plans')){
				$.put('users/set_preferences/nil/0')
				$('#plans_search_sidebar').show()
				var plans_list_height = $(".plan_list").height()
				if($('.plan_list').is(":visible") == false){
					plans_list_height = 0
				}
				$('#plans_search_sidebar').hide()
				$('.athlete_list').animate({
					height: plans_list_height,
					opacity: "0"
				}, function(){
					$('#athlete_search_sidebar').hide()
					$('#plans_search_sidebar').show()
					$('.plan_list').css('opacity','0')
					$('.plan_list').animate({
						opacity: 1
					})
					$('.athlete_list').css({
						height: "auto",
						opacity: 1

					})


				})
			}
		}

	})
	$("body").on('focus', '#search_athletes', function(){
		if ($(this).val() == "search athletes.."){
			$(this).val("")
			$(this).addClass('black')

		}
	})
	$("body").on('blur', '#search_athletes', function(){
		if($(this).val() == ""){
			$(this).val("search athletes..")
			$(this).removeClass('black')

		}
	})
	$("body").on('keyup', '#search_athletes', function(){
		var athletes = []
		$('.athlete_listed').each(function(){
			athletes.push([$(this).text(), 0, $(this).attr("id")])
		})

		var myExp = new RegExp($(this).val(), 'i');
		$.each(athletes,function(index, value){
			if($(this)[0].search(myExp) != -1){
				athletes[index][1] = 1
			}
		})
		$.each(athletes, function(){
			if($(this)[1] == 0){
				$("#"+$(this)[2]).hide()
			}
			else if($(this)[1] > 0){
				$("#"+$(this)[2]).show()
			}
		})

	})



})
