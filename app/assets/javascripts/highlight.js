$(function(){
	$(document).keyup(function(e) {
	  if (e.keyCode == 27) {
		if($('.highlighted').length == 0){
				//if($('search_name').focus() == true ){
					if(search_open == false){
						open_search();
						search_open = true
					}
					else{
						$('#search_field').hide();
						$('#search').show();
						search_open = false
					}

			}
		else{
	     $(".highlighted").each(function(){
		   $(this).removeClass("highlighted")
     		$('#select_box').fadeOut(function(){
				$('#cancle_button').hide()
				$('#delete_button').hide()
				$('#copy_button').show()
				$('#first_delete_button').show()
})
	     })
		}
		 }   // esc remove highlightes
	});

  var parent = $('#calendar_header');

	$('body').on('click', '.cancle_calendar', function(){
		$('#cancle_button').hide()
		$('#delete_button').hide()
		$('#copy_button').show()
		$('#first_delete_button').show()
	})
	$('body').on('click', '.cancle_plan', function(){
		$('#delete_button').hide()
		$('#first_delete_button').show()
	})

  $('body').on('click','#calendar_header', function(event){

     $(".highlighted").each(function(){
	   $(this).removeClass("highlighted")
     })
     $('#select_box').fadeOut(function(){
			$('#cancle_button').hide()
			$('#delete_button').hide()
			$('#copy_button').show()
			$('#first_delete_button').show()
})

     });


  $(function () {
    var isMouseDown = false;


    //prevent highlight from being falsely activated
    $("body").on("mousedown","ul li, .puh, .dialog_link", function(e){

      e.stopPropagation()
    })
		$('body').on('ajax:send', function(){
			if ( window.history.replaceState ) {
							window.history.replaceState( null, null, null );
							
					}
		})

    //highlight started
    $("body")
	    .on("mousedown",".grid_cell_day", function () {
				if($('#interface_toggle_copy_workouts .app_option_selected').size() > 0){
	      isMouseDown = true;
	      $('#search_field').hide();
	   	$('#search').show();

	     //grab the start_date and assign it to variable
	      start_date = $(this).attr('id').slice(1);
			start_date = Date.parse(start_date)

		  //change the first clicked element to highlighted/unhighlighted
	      $(this).parent().toggleClass("highlighted");
          var num = $(".highlighted")

		  if(num.length > 0){
			$('#select_box').center()
			$('#select_box').fadeIn()

          }
		  else {
			$('#select_box').fadeOut(function(){
				$('#cancle_button').hide()
				$('#delete_button').hide()
				$('#copy_button').show()
				$('#first_delete_button').show()
			})

	    	}


	      starting_date = cal_time_out(start_date)
	   //   $('#select_box').html(starting_date)
	      return false; // prevent text selection
			}
	    })

	    .on("mouseover",".grid_cell_day", function () {
	      if (isMouseDown) {


	        //grab the end date and asign it to variable
            end_date = $(this).attr('id').slice(1);
			end_date = Date.parse(end_date)

			ending_date = cal_time_out(end_date)
			date_range = starting_date+" - "+ending_date
		//	$('#select_box').html(date_range)
			current_day = new Date(start_date.getTime());

			//highlight 2. just find dates inbetween first and second and set to highlight

			//when date is greater

				var start_id = cal_time_out(start_date)
		 		var end_id = cal_time_out(end_date)

				//select all dates inbetween
				$('.grid_cell_day').each(function(){
					var date_id = this.id
					var date_id_date = cal_time_in(date_id)


						//check if date_id_date is within start and end date then write same highlighted logic.
						//should be able to remove the above code if done properly

					var is_between = date_id_date.between(start_date, end_date); // true|false
					if(is_between){
						has_highlighted_class = $(this).parent().hasClass("highlighted")
						if(has_highlighted_class){
						}
						else{
							$(this).parent().addClass("highlighted");
						}
					}
					var reverse_is_between = date_id_date.between(end_date, start_date);
					if(reverse_is_between == false){
						if(is_between == false){
							$(this).parent().removeClass("highlighted");
						}
					}  //write two if statements to find if both are false
					if(Date.compare(start_date,end_date) == 1){ //if start_date comes after end_date


						if(reverse_is_between){
							has_highlighted_class = $(this).parent().hasClass("highlighted")
							if(has_highlighted_class){
							}
							else{
								$(this).parent().addClass("highlighted");
							}
						}

					}

				})


	      }
	    })
	    .bind("selectstart", function () { // doesnt highlight any text as you drag
	      return false;
	    })

		$(document)
		.on("mouseup", function () {
			if(isMouseDown == true){
			isMouseDown = false;

			var copy_url = ""
			var delete_url = ""
			$('.highlighted').each(function(){
				var log_id = $(this).find('ul').attr('id')
				if(log_id){
					log_id = log_id.slice(4)
				copy_url += "-" + log_id
		   		}
			})
			copy_url = copy_url.slice(1)
			$('#delete_button').attr('data-entry_ids',copy_url)
			var athlete_id = $('#copy_button').attr('href').split('/')
			//check if link is for plan_entries or cal_entries
			if($('#select_box').data('plan_id') != null){
				delete_url = "/plans/destroy/entries/"+copy_url
			}
			else{
				delete_url = "/log_entries/destroy/"+athlete_id[3]+"/"+copy_url
				copy_url = "/plans/new/"+athlete_id[3]+"/"+copy_url
			}
			$('#delete_button').attr('href',delete_url)
			$('#copy_button').attr('href',copy_url)
		}






	    });
	});

	//control z functionality
	var ctrlDown = false;
	var cmdDown = false;
    var ctrlKey = 17, zKey = 90, cmdKey = 91;

    $(document).keydown(function(e)
    {
        if (e.keyCode == ctrlKey) ctrlDown = true;
        if (e.keyCode == cmdKey) cmdDown = true;
    }).keyup(function(e)
    {
        if (e.keyCode == ctrlKey) ctrlDown = false;
        if (e.keyCode == cmdKey) cmdDown = false;

      if ((ctrlDown || cmdDown) && (e.keyCode == zKey)) {
	$(".highlighted").removeClass('highlighted')


    }
    });



});
