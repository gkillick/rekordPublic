function completed_ceiling_top(){

	//Math.max.apply(Math, planned_hours)
	//parseInt(Math.ceil(planned_max/10.0)*10)
}
bar_select_open = false
function update_month_hours(){

	$('.bar_animated').addClass('bar_animated_again')
	var ceiling_array = []
	var completed_array = [0,0,0,0,0,0,0,0,0,0,0,0]
	var planned_array = []
	$('.month_summary_hours').each(function(){
		console.log($(this).data('completed'))

		ceiling_array.push((Math.ceil(parseInt($(this).data('completed'))/10.0)*10))
		month = parseInt($(this).data('month'))
		completed_array[month] = $(this).data('completed')

	})

	$('.edit_atp_month_container input').each(function(){
		if($(this).val()){
		ceiling_array.push(parseInt(Math.ceil(parseInt($(this).val())/10.0)*10))
		planned_array.push(parseInt($(this).val()))
		}else{
			planned_array.push(0)
		}
	})
	console.log(completed_array+" planned array: "+ planned_array)
	var ceiling = Math.max.apply(Math, ceiling_array)
	//iterate through and adjust heights
	setTimeout(function(){
		var n = 0
		$('.sub_bar').each(function(){
			$(this).children('.bar_select').first().children('.graph_planned').first().height(planned_array[n]/ceiling*100+"%")
			$(this).children('.bar_select').first().children('.sub_bar2').first().height(completed_array[n]/ceiling*100+"%")
		n++
		})

	}, 1)
	var x = 0
	$('.planned_total').each(function(){
		$(this).text(planned_array[x]+":00")
		x++
	})
	$('.y_top').text(ceiling)
	$('.y_middle').text(ceiling/2)
	$('#annual_training_plan_month_hours').val(JSON.stringify(planned_array))
	$('.atp_planned_hours').text(planned_array.reduce(function(pv, cv) { return pv + cv; }, 0))

	$('.atp_form').submit()
}

function resise_total_hours(){

	setTimeout(function(){
		var width = document.getElementById('hours_inside_text').clientWidth
		var planned_hours_width = document.getElementById('planned_hours_measure').clientWidth
		var plan_clone = $('.total_hours_inside').clone()
		plan_clone.attr('style', "").addClass('next_to_remove')
		$('body').append(plan_clone)
		if($('.next_to_remove').width() > planned_hours_width){
			$('.hours_inside_text').append("<span class='white_and_measure slash'> / </span>"+$('.total_hours_inside').html())
			$('.planned_hours_measure').addClass('white_and_measure')
			$('.total_hours_inside_small_size').addClass('white_and_measure')
			$('.total_hours_inside').html("")
		}
		var clone = $('.hours_inside_text').clone()
		clone.attr('style', "").addClass('to_remove')
		$('body').append(clone)
		if($('.to_remove').width() > width){

			$('.total_hours_inside').prepend($('.hours_inside_text').html()+" <span class='slash'> / </span>")
			$('.hours_inside_text').html("")
		}
		$('.to_remove, .next_to_remove').remove()

	}, 1);


}
function resise_total_hours_fluid(){

	if ($('#annual_training_plan_total_planned_hours').val() == ""){
		var value = 0
		$('#annual_training_plan_total_planned_hours').val(0)
	}
	else{
		value = $('#annual_training_plan_total_planned_hours').val()
	}
	$('.total_planned_hours_bar').text(value)
	var hours_planned = parseInt($('#annual_training_plan_total_planned_hours').val())
	var hours_completed = $('.hours_completed_total').data('completed')
	if (hours_planned <= hours_completed){
		hours_completed_percent_width = 100
	}
	else{
		hours_completed_percent_width = hours_completed/hours_planned*100
	}
	var total_width = $('.total_hours_graph').width()
	var hours_planned_width = total_width * (100 - hours_completed_percent_width)/100.0
	var hours_completed_width = total_width - hours_planned_width
	var simulated_planned_width = $('.planned_hours_measure').width()
	var simulated_completed_width = $('.total_hours_inside_large').width()
	if(hours_planned_width < simulated_planned_width){
		$('.slash').remove()
		$('.total_hours_inside_large').appendTo($('.hours_inside_text'))
		$('.total_hours_inside_large').append('<span class="white_and_measure slash"> / </span')
		$('.planned_hours_measure').appendTo($('.hours_inside_text')).addClass('white_and_measure')
		$('.total_hours_inside_small_size').addClass('white_and_measure')

	}
	if(hours_planned_width > simulated_planned_width && hours_completed_width > simulated_completed_width){
		$('.slash').remove()
		$('.white_and_measure').removeClass('white_and_measure')
		$('.total_hours_inside_large').appendTo($('.hours_inside_text'))
		$('.planned_hours_measure').appendTo($('.total_hours_inside'))


	}
	if(hours_completed_width < simulated_completed_width){
		$('.slash').remove()
		$('.white_and_measure').removeClass('white_and_measure')
		$('.total_hours_inside_large').appendTo($('.total_hours_inside'))
		$('.total_hours_inside').append('<span class=" slash"> / </span')
		$('.planned_hours_measure').appendTo($('.total_hours_inside'))


	}
	$('.hours_inside_text').css('width', hours_completed_percent_width+"%")
	$('.total_hours_inside').css('width', (100 - hours_completed_percent_width)+"%")
 $('.atp_form').submit()
}

$(function(){

	$('body').on('blur', '.edit_atp_month_container input', function(){
			update_month_hours()
	})
	//manage keyup for months inputs
	$('body').on('keyup', '.edit_atp_month_container input', function(){
		update_month_hours()
	})
	$('body').on('click', '.icon-refresh', function(){
		$('#annual_training_plan_total_planned_hours').val($('.atp_planned_hours').text())
		resise_total_hours_fluid()
	})
	//manage atp months edit click
	$('body').on('click', '.edit_atp_link', function(e){
		e.preventDefault()
		if($(".edit_atp_month_container").hasClass('atp_open')){
			$(".edit_atp_month_container").removeClass('atp_open')
			$('.atp_stats').css('opacity', '0')

			setTimeout(function(){
				$('.atp_stats').remove()
			},500)
		}
		else{
			planned_array = [0]
			$('.edit_atp_month_container input').each(function(){
				if($(this).val()){
				planned_array.push(parseInt($(this).val()))
				}
			})
			var planned_hours = planned_array.reduce(function(pv, cv) { return pv + cv; }, 0)

			$(".edit_atp_month_container").addClass('atp_open')
			$('.area').append("<div class='atp_stats'><span class='atp_planned_hours'>"+planned_hours+"</span><span class='sub_atp_stats_font'> planned hrs</span> <span class='icon-refresh'></span></div>")
			setTimeout(function(){
							$('.atp_stats').css('opacity','.6')
			},0)


		}
	})

	$('body').on('keyup', '.tooltip_total_hours input', function(e){
		$('#annual_training_plan_total_planned_hours').val($(this).val())
		if(e.keyCode == 13){
			resise_total_hours_fluid()
		$(".tagging_tooltip_custom").remove()
		hours_tool_tip_open = false
		}


	})
	//total hours edit
	hours_tool_tip_open = false
	$('body').on('click', '.total_hours_graph', function(e){
		if(!hours_tool_tip_open){
		if($('.tagging_tooltip_custom').size() == 0){
		var width = $(this).width()
		var value = $('#annual_training_plan_total_planned_hours').val()
		$(this).append('<div class="tagging_tooltip_custom tagging_tooltip"><div class="taggin_triangle"></div><div class="tagging_tooltip_body"><div class="tooltip_total_hours"><input type="text" placeholder="" onkeypress="return event.charCode >= 48 && event.charCode <= 57"></input><div style="clear: both"></div><div class="hrs_planned_totals">planned hours</div></div></div></div>')
		var tooltip_width_percentage = $('.tagging_tooltip').width()/width*100*.5
		$('.tagging_tooltip_custom').css('left', ''+50-tooltip_width_percentage+'%')
		$('.tagging_tooltip_custom input').focus()
			$('.tagging_tooltip_custom').css('opacity', '1')
			$('.tagging_tooltip_custom input').val(value)

			hours_tool_tip_open = true
	}
 }
	})
	$(document).mouseup(function (e)
	{
			if(hours_tool_tip_open){
	    var container = $(".tagging_tooltip_custom");

	    if (!container.is(e.target) // if the target of the click isn't the container...
	        && container.has(e.target).length === 0) // ... nor a descendant of the container
	    {
	        container.remove();
					resise_total_hours_fluid()
					setTimeout(function(){
						hours_tool_tip_open = false
					},1)
	    }
		}
	});
	$('body').on('click', '.date_pull_down', function(){

		if($('.date_pull_down_container').size() == 0 ){
			var year = parseInt($(this).data('current-year')) + 1
			var current_year = year - 1
			var year_within = parseInt($(this).data('year-within'))
			var current_user = $(this).data('current-user')

			var width = $('.plan_title_grid').outerWidth()
			$('.graph_title').append('<div class="date_pull_down_container"><ul class="year_list" style="width:'+width+'px;"></ul></div>')
			if(year_within > current_year + 1){
				$('.year_list').append('<li class="current_year_within"><a href="/graph/'+current_user+'/'+year_within+'" class="get_the_graph_menu" data-remote="true" data-type="html" >'+year_within+'</a></li>')
			}


			for(var i = 0; i < 8; i++) {
				if (year_within == year){
					$('.year_list').append('<li class="current_year_within"><a href="/graph/'+current_user+'/'+year_within+'" class="get_the_graph_menu" data-remote="true" data-type="html" >'+year_within+'</a></li>')
				}
				else if(year == current_year){
					$('.year_list').append('<li class="current_year"><a href="/graph/'+current_user+'/'+year+'" class="get_the_graph_menu" data-remote="true" data-type="html" >'+year+'</a></li>')
				}
				else{
			    $('.year_list').append('<a href="/graph/'+current_user+'/'+year+'" class="get_the_graph_menu" data-remote="true" data-type="html" ><li>'+year+'</li></a>')
				}
				year -= 1
			}
			$('.date_pull_down_container').css('opacity')
			$('.date_pull_down_container').css('opacity', 1)

		}
		else{
			$('.date_pull_down_container').remove()
		}
	})
	$('body').on('mouseover touchstart','.bar_select', function(){
		bar_select_open = true
		id = $(this).attr('id');
		id = id.split('&')
		new_summary_id = "#"+id[0]+"_column"
		var offset = $(this).offset();
		var height = $(this).closest('.sub_bar').height();
		var width2 = $(this).width();
		var width = $(new_summary_id).width();
		var offset_compensation = $('#graph_container').offset();

		var right = offset.left - offset_compensation.left - (width/2) + (width2/2) + 25 +"px";
		var top = offset.top + height - offset_compensation.top + 40 + "px";

		$(new_summary_id).css( {
		    'position': 'absolute',
		    'left': right,
			'top' : top,

		});
		$(new_summary_id).removeClass('display_none')
		$(new_summary_id).css('z-index','99999')
	}).on('mouseout','.bar_select', function(){
		$(new_summary_id).addClass('display_none')
	})

	$('body').on('mouseenter', '.full_bar_container', function(){
		var id = ($(this).attr('id')).split('&');
		new_week_sum_id = "#"+id[0]+"_week_column"
		var offset_compensation = $('#graph_container').offset();
		var offset = $(this).offset();
		var height = $(this).height();
		var width2 = $(this).width();
		var width = $(new_week_sum_id).width();
		var right = offset.left - offset_compensation.left - (width/2) + (width2/2) + 25 +"px";
		var top = offset.top - offset_compensation.top + height + 30 + "px";

		$(new_week_sum_id).css( {
		    'position': 'absolute',
		    'left': right,
			'top' : top,

		});
		$(new_week_sum_id).removeClass('display_none')
		$(new_week_sum_id).css('z-index','99999')

	}).on('mouseleave','.full_bar_container', function(){
		$(new_week_sum_id).addClass('display_none')
	})



})
