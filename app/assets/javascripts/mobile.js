$.fn.scrollStopped = function(callback) {
  var that = this, $this = $(that);
  $this.scroll(function(ev) {
    clearTimeout($this.data('scrollTimeout'));
    $this.data('scrollTimeout', setTimeout(callback.bind(that), 250, ev));
  });
};
scrolling = false

function doOnOrientationChange() {
    switch(window.orientation) {
      case -90 || 90:
        $('.right_cell_m').css('height', window.innerHeight)

        break;
      default:
        $('.right_cell_m').css('height', window.innerHeight)
        break;
    }
}



$.fn.isOnScreen = function(){

    var win = $(window);

    var viewport = {
        top : win.scrollTop(),
        left : win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();

    var bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();

    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

};

function paint_dates_mobile_top(){
	var direction = $('.new_date_m').last().next().attr('data-direction')
	var background_position = $('.new_date_m').last().next().css('background-position').split(" ")[1].replace('%', '');
	n = parseInt(background_position*5/100)
	var entries = $($('.new_date_m').get().reverse())

	var total_entries = 5
	//calculate true n value and direction

	if (direction == "up"){
		n--
		if(n == 0){
			direction = "down"
			n = n + 2
		}

	}
	else{
		n++
		if(n == 6){
			direction = "up"
			n = n - 2
		}
	}
	console.log(n+" n value")
	console.log(direction)
	entries.each(function(){

		if(direction == "up"){
			$(this).addClass('gradient_m')
			$(this).css('background-position', "0% "+(n/total_entries*100)+"%")
			$(this).attr('data-direction', direction)
			n++
			if(n == 6){
				direction = "down"
				n = n - 2
			}
		}
		else{
			$(this).addClass('gradient_reverse_m')
			$(this).css('background-position', "0% "+((5-n)/total_entries*100)+"%")
			$(this).attr('data-direction', direction)
			n--
			if(n == 0){
				direction = "up"
				n = n + 2
			}
		}

	})

}
function paint_dates_mobile_bottom(){
	var direction = $('.new_date_m').first().prev().attr('data-direction')
	var background_position = $('.new_date_m').first().prev().css('background-position').split(" ")[1].replace('%', '');
	n = parseInt(background_position*5/100)
	var entries = $('.new_date_m')
	var total_entries = 5
	if (direction == "up"){
		n++
		if(n == 6){
			direction = "down"
			n = n - 2
		}
	}
	else{
		n--
		if(n == 0){
			direction = "up"
			n = n + 2
		}
	}


	entries.each(function(){

		if(direction == "up"){
					$(this).addClass('gradient_m')
			$(this).css('background-position', "0% "+(n/total_entries*100)+"%")
			$(this).attr('data-direction', direction)
			n++
			if(n == 6){
				direction = "down"
				n = n - 2
			}
		}
		else{
			$(this).addClass('gradient_reverse_m')
			$(this).css('background-position', "0% "+((5-n)/total_entries*100)+"%")
			$(this).attr('data-direction', direction)
			n--
			if(n == 0){
				direction = "up"
				n = n + 2
			}
		}
	})
}
function paint_dates_mobile(){
	var entries = $('.dates_m')
	var total_entries = 5
	var n = 1
	var direction = "up"
	entries.each(function(){

		if(direction == "up"){
			$(this).addClass('gradient_m')
			$(this).css('background-position', "0% "+(n/total_entries*100)+"%")
			$(this).attr('data-direction', direction)
			n++
			if(n == 6){
				direction = "down"
				n = n - 2
			}
		}
		else{
			$(this).addClass('gradient_reverse_m')
			$(this).css('background-position', "0% "+((5-n)/total_entries*100)+"%")
			$(this).attr('data-direction', direction)
			n--
			if(n == 0){
				direction = "up"
				n = n + 2
			}
		}
	})


}





entries_loading = false

$(function(){



	var a=document.getElementsByClassName("sign_out_mobile");
	for(var i=0;i<a.length;i++)
	{
	    a[i].onclick=function()
	    {
	        window.location=this.getAttribute("href");
	        return false
	    }
	}

	if($('.today_m').size() > 0){
	var todayOffset = Math.round($('.today_m').offset().top/80)*80;
	var scrollHeight = Math.round($('.dates_container_m').height()/80/2)*80-5
	}

	$('.dates_container_m').scrollTop(todayOffset - scrollHeight)
	window.addEventListener('orientationchange', doOnOrientationChange);
	$('.right_cell_m').css('height', window.innerHeight)
	$(".dates_container_m").scrollStopped(function(ev){
  scrolling = false

});

	$(".dates_container_m").on( 'scroll touchmove', function(e){
		scrolling = true
		var scroll_top = $(this).scrollTop()
		var height = $(".dates_container_m")[0].scrollHeight - $(this).height()


		if(scroll_top == 0){

			//load content before
			if(entries_loading == false){

			entries_loading = true
			console.log(entries_loading)
			var start_date = $('.dates_m ').first().data('date')
			$.get('athletes/pull_dates_mobile/'+start_date+'/up')
			$('.spin_gif').css({
				'visibility': 'visible',
				'top' : "100px",
				'bottom' : "auto"

			})

			console.log("load content before")
			}

		}
		else if(scroll_top == height){
			console.log(entries_loading)
			//load_content after
			if(entries_loading == false){
				entries_loading = true
				var start_date = $('.dates_m ').last().data('date')
				$.get('athletes/pull_dates_mobile/'+start_date+'/down')
				$('.spin_gif').css({
					'visibility': 'visible',
					'bottom' : "25px",
					'top' : "auto"

				})
				console.log("load content after")
			}

		}

		/*
		var new_months = $('.new_month_cell_m')
		new_months.each(function(){
			if($(this).isOnScreen()){
				if($(this).prev().prev().isOnScreen()){
					$(this).children('.new_month_m').removeClass('invisible_m')
					$('.month_title_m').text($(this).prev().prev().data('month'))
				}
				else{
					$(this).children('.new_month_m').addClass('invisible_m')
					$('.month_title_m').text($(this).data('month'))
				}
			}
		})
		*/
		var timer;
    if(timer)
    {
        clearTimeout(timer);
    }
    temp=Math.floor(Date.now());
    timer=setTimeout(function(){
			var items = []

			//perform end of scroll function
			var month_title = $('.month_title_m').html()
    	$('.dates_m ').each(function(){

    		if($(this).isOnScreen()){

    			items.push($(this))
    		}

    	})
			if(items[0].hasClass('new_month_cell_m') == false && items[0].next().hasClass('new_month_cell_m') == false){
				if(items[0].data('month') != month_title){
					$('.month_title_m').html(items[0].data('month'))
				}
			}

    }, 1000)

	});

	$('body').on('tap', '.dates_m', function(event){
		//event.stopPropagation(); event.preventDefault();

		if($(event.target).closest('a').length || scrolling == true){

		    }

		else{

		if($(this).css('max-height') == "80px"){
			$('.dates_m').css('max-height', '80px')
			if($(this).children('.log_entry_hidden_m').height() > 0){

				$('.dates_m_container').removeClass('eighty_percent').removeClass('twenty_percent')

				if($(this).children('.dates_m_container').hasClass('gradient_reverse_m')){
					$(this).children('.dates_m_container').addClass('twenty_percent')
				}
				else{
					$(this).children('.dates_m_container').addClass('eighty_percent')
				}

					$(this).css('max-height', $(this).children('.log_entry_hidden_m').height()+80)


			}
		}
		else {

				$(this).css('max-height', '80px')

				$(this).children('.dates_m_container').removeClass('eighty_percent').removeClass('twenty_percent')


		}
	}

	})
	$('body').on('touchstart click', '#open_side_bar_m', function(){
		$('.main_content_m').toggleClass('open_nav_m')
		$('.dates_container_m').toggleClass('noSwipe')
	})
	$('#rekord_logo_m').on('transitionend', function(){
		$(this).remove()
	})
  $("#top_bar_m, .navigation, .dates_container_m").swipe( {
    //Generic swipe handler for all directions

		allowPageScroll:"vertical",
		fingers:1,

    swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
      if(direction == "right"){
				if($('.main_content_m').hasClass('open_nav_m') == false){
					$('.dates_container_m').toggleClass('noSwipe')
					$('.main_content_m').toggleClass('open_nav_m')
				}

      }
      if(direction == "left"){
				if($('.main_content_m').hasClass('open_nav_m')){
					$('.dates_container_m').toggleClass('noSwipe')
					$('.main_content_m').toggleClass('open_nav_m')
				}

      }
    }
  });
	paint_dates_mobile()
	$('#everything').removeClass('invisible_m')
	$('#rekord_logo_m').addClass('invisible_m')
})
