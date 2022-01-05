// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//

//= require jquery-1.11.2.min.js
//= require jquery-ui.js
//= require jquery_ujs
//= require jquery.remotipart
//= require date
//= require_tree .
//= require jquery.simplemodal.1.4.4.min
//= require highcharts
//= require highcharts/highcharts-more
//= require selectize.min

jQuery.fn.preventDoubleClick = function() {
  $(this).on('click', function(e){
    var $el = $(this);
    if($el.data('clicked')){
      // Previously clicked, stop actions
      e.preventDefault();
      e.stopPropagation();
    }else{
      // Mark to ignore next click
      $el.data('clicked', true);
      // Unmark after 1 second
      window.setTimeout(function(){
        $el.removeData('clicked');
      }, 3000)
    }
  });
  return this;
};
jQuery.each( [ "put", "delete" ], function( i, method ) {
  jQuery[ method ] = function( url, data, callback, type ) {
    if ( jQuery.isFunction( data ) ) {
      type = type || callback;
      callback = data;
      data = undefined;
    }

    return jQuery.ajax({
      url: url,
      type: method,
      dataType: type,
      data: data,
      success: callback
    });
  };
});

String.prototype.width = function(font) {
  var f = font || '12px arial',
      o = $('<div>' + this + '</div>')
            .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
            .appendTo($('body')),
      w = o.width();

  o.remove();

  return w;
}

function time_interval_cleanup(t) {
	if (t.indexOf(':') != -1) {
	return t
	}
	else if (t == "") {
		x = "0:00";
	}
	else if (t == "0") {
		x = "0:00";
	}
	//convert any number between 10 and 60 to format 0:MM
	else if (t <60 && t >= 10) {
			if (t >= 10) {
				x = "0:"+t;
			}
			else if(t < 10 && t != 0) {
				x = "0:0"+t;
			}
	}
	//convert greater than 60 minutes to hours and minutes H:MM
	else if (t >= 60) {
		var h = t/60;
		h = Math.floor(h);
		var r = t%60;
			if(r >= 10) {
				x = h+":"+r;
			}
			else if(r < 10) {
				x = h+":0"+r;
			}
	}
	//convert numbers 1-10 to hours in format H:00
	else if (t < 10) {
		x = t+":00";
	}
	return x;
}

function paint_workouts(){

	//update current date
	var d = new Date();

	var month = d.getMonth()+1;
	var day = d.getDate();

	var output = 'g'+ d.getFullYear() + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;
	$('#'+output).addClass('today').find('.number_class').addClass('date_today')


	abreviate_activities()
	//if($('.color_workouts_toggle').html().toLowerCase() == "on"){
		if (1 == 1){
	$('.workout_list li a').each(function(){
		var percentage = $(this).data('effort')
		$(this).parent().css('background-position', '0 '+percentage+'%')
		$(this).parent().removeClass('blue_gradient').addClass('effort_gradient')

	})
	}


	else{
	$('.workout_list li').each(function(){
		var offset_y = $(this).offset().top
		$(this).css('background-position', '0 '+offset_y+'px')
		$(this).removeClass('effort_gradient').addClass('blue_gradient')
	})
	}
}



function cal_time_out(current_day){
	cal_date = "g"+current_day.getFullYear()+"-"+("0"+(current_day.getMonth()+1)).slice(-2)+"-"+("0"+current_day.getDate()).slice(-2)
	return cal_date
}
function time_out(date){
	month = date.getMonth()+1
	day = date.getDate()
	year = date.getFullYear()
	date_formated = month+"/"+day+"/"+year
	return date_formated
}
function cal_out(date){
	month = date.getMonth()+1
	day = date.getDate()
	year = date.getFullYear()
	if(month<10){
		month = "0"+month
	}
	if(day<10){
		day = "0"+day
	}
	date_formated = "c"+year+"-"+month+"-"+day
	return date_formated
}
function cal_time_in(current_day){
	var date = current_day.slice(1);
	date = Date.parse(date)
	return date
}


function entryIn(id, pos, width){
	$.get('/coaches/get_workout/'+id, function(data) {
	  $('#summary').html($(data));

	$("#summary").css({
	        position: "absolute",
	        top: (pos.top + 30) + "px",
	        left: (pos.left + 20) + "px"
	    })
	$("#summary").show()
	})
}
function entryOut(){
	$("#summary").hide()

}

//calculate all times and put in corrosponding duration fields



//onblur cleanup function
function reverse_time(t) {
	if (t.indexOf(':') != -1){
	var times = t.split(":");
	hours = times[0]
	minutes = times[1]
	total = (parseInt(hours)*60 + parseInt(minutes))
	return(total)
    }
	else {
		return(t)
	}

}

function time_cleanup(t) {

	if (t.indexOf(':') != -1) {
	return t
	}
	else if (t.indexOf('.') != -1){
		t = t * 60
		if (t <60 && t >= 10) {
			if (t >= 10) {
				x = "0:"+t;
			}
			else if(t < 10 && t != 0) {
				x = "0:0"+t;
			}

		}
		else if (t >= 60) {
			var h = t/60;
			h = Math.floor(h);
			var r = t%60;
				if(r >= 10) {
					x = h+":"+r;
				}
				else if(r < 10) {
					x = h+":0"+r;
				}
		}
	}
	else if (t == "") {
		x = "";
	}
	else if (t == "0") {
		x = "";
	}
	//convert any number between 10 and 60 to format 0:MM
	else if (t <60 && t >= 10) {
			if (t >= 10) {
				x = "0:"+t;
			}
			else if(t < 10 && t != 0) {
				x = "0:0"+t;
			}
	}
	//convert greater than 60 minutes to hours and minutes H:MM
	else if (t >= 60) {
		var h = t/60;
		h = Math.floor(h);
		var r = t%60;
			if(r >= 10) {
				x = h+":"+r;
			}
			else if(r < 10) {
				x = h+":0"+r;
			}
	}
	//convert numbers 1-10 to hours in format H:00
	else if (t < 10) {
		x = t+":00";
	}

	return x;
}
function time_cleanup_with_zero(t) {

	if (t.indexOf(':') != -1) {
	return t
	}
	else if (t.indexOf('.') != -1){
		t = t * 60
		if (t <60 && t >= 10) {
			if (t >= 10) {
				x = "0:"+t;
			}
			else if(t < 10 && t != 0) {
				x = "0:0"+t;
			}

		}
		else if (t >= 60) {
			var h = t/60;
			h = Math.floor(h);
			var r = t%60;
				if(r >= 10) {
					x = h+":"+r;
				}
				else if(r < 10) {
					x = h+":0"+r;
				}
		}
	}
	else if (t == "") {
		x = "0:00";
	}
	else if (t == "0") {
		x = "0:00";
	}
	//convert any number between 10 and 60 to format 0:MM
	else if (t <60 && t >= 10) {
			if (t >= 10) {
				x = "0:"+t;
			}
			else if(t < 10 && t != 0) {
				x = "0:0"+t;
			}
	}
	//convert greater than 60 minutes to hours and minutes H:MM
	else if (t >= 60) {
		var h = t/60;
		h = Math.floor(h);
		var r = t%60;
			if(r >= 10) {
				x = h+":"+r;
			}
			else if(r < 10) {
				x = h+":0"+r;
			}
	}
	//convert numbers 1-10 to hours in format H:00
	else if (t < 10) {
		x = t+":00";
	}

	return x;
}



$(document).ready(function() {


  $('body').on('keyup keypress', '.edit_log_entry', function(e){
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      return false;
    }
  });


  $('body').on('click', '.dialog_link', function(e){
    var $el = $(this);
    if($el.data('clicked')){
      // Previously clicked, stop actions
      e.preventDefault();
      e.stopPropagation();
    }else{
      // Mark to ignore next click
      $el.data('clicked', true);
      // Unmark after 1 second
      window.setTimeout(function(){
        $el.removeData('clicked');
      }, 1500)
    }
  });

	$("body").on("keyup", "#friends_search", function() {
	  $.get($("#friends_search_form").attr("action"), $("#friends_search").serialize(), null, "script");
	  return false;
	});

	//toggle_on_off functionality


	$('body').on('click', '.app_button_option', function(){
		$(this).toggleClass('app_option_selected')
		if($(this).html().toLowerCase() == "on"){
			$(this).html("off")
			paint_workouts()
		}
		else{
			$(this).html("on")
			paint_workouts()
		}

	})

	//tooltip for any element

	$('body').on('mouseenter', '.tooltip_element', function(e){
		var width = $(e.target).closest('.tooltip_element').outerWidth()
		var height = $(e.target).closest('.tooltip_element').outerHeight()
		var content = $(e.target).closest('.tooltip_element').attr('data-tooltip')
		$(e.target).append('<div class="tooltip_container"><div class="tooltip_triangle"></div><div class="tooltip_body">'+content+'</div></div>')
		var element_width = $('.tooltip_container').outerWidth()
		$('.tooltip_container').css("top", height-10)
		$('.tooltip_container').css("left", width/2 - element_width/2)




	})
	$('body').on('mouseleave', '.tooltip_element', function(event){

					$('.tooltip_container').remove()

	})
	$('body').on('mouseenter', '.tooltip_container', function(event){

					$('.tooltip_container').remove()

	})


});
