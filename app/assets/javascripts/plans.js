edit_animation = false
edit_loaded = false


var delay = (function() {
  var timer = 0;
  return function(callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();


//setup plan view
function prepare_plan() {
  if ($('.plan_dark').size() > 0) {
    plan_load_scroll();
    $('.cal_scroll').scrollStopped(function() {
      plan_scroll_callbacks()
    })
  }
}

function plan_load_scroll() {
  var todayOffset = $('.plan_dark').first().parent().position().top
  var scrollHeight = Math.round($('.cal_scroll').height());
  $('.cal_scroll').scrollTop(todayOffset)

  var d = new Date();

  var month_val = d.getMonth() + 1;
  var day = d.getDate();
  var output = 'g' + d.getFullYear() + '-' + (month_val < 10 ? '0' : '') + month_val + '-' + (day < 10 ? '0' : '') + day;
  $('#' + output).addClass('today').find('.number_class').addClass('date_today')
}
//these actions will change month name, bold dates etc.
function plan_scroll_callbacks() {
  var items = []
  var month_title = $('.month_title_m').html()
  var scrolled_to = $('.cal_scroll').scrollTop()
  if ($('.workout_list_item').size() > 0) {
    var first_workout_top = $('.workout_list_item').first().position().top
    $('.day_1').html('day 1')
  } else {
    var first_workout_top = $('.date_today').first().position().top
    $('.day_1').html('today')
  }

  var cal_scroll_size = $('.cal_scroll').first().height()
  //add day 1 button if workouts not on screen
  if (first_workout_top >= scrolled_to && first_workout_top < (scrolled_to + cal_scroll_size)) {
    $('.day_1').addClass('transparent')
  } else {
    $('.day_1').removeClass('transparent')
  }
  $('.grid_days td').each(function() {
    var top_scroll = $(this).position().top
    if (top_scroll >= scrolled_to && top_scroll < (scrolled_to + 300)) {
      items.push($(this))
    }

  })
  var month = items[14].data('month')
  var month_name = items[14].data('month-name')
  if ($(".plan_month").text() != month) {
    $(".plan_month").text(month)
    $(".plan_dark").addClass('plan_light_grey').removeClass("plan_dark")
    $(".plan_" + month_name).addClass("plan_dark").removeClass('plan_light_grey')
  }
}

function fade_in_edit() {
  if (edit_animation == true && edit_loaded == true) {
    auto_size_text($('.plan_title_edit'))
    $('#edit_plan_container').animate({
      opacity: '1',
    })
    edit_animation = false
    edit_loaded = false
  }
}

function rename_sidebar_plan(text_field) {
  var the_other_string = text_field.val()
  var plan_field = $('#plan_' + text_field.data('plan'))

  plan_field.val(the_other_string)

  if (the_other_string == "") {
    plan_field.val('label..')
  } else {}
}

function rename_plan_title(text_field) {
  var the_other_string = text_field.val()
  var plan_field = $('.plan_title_edit')

  plan_field.val(the_other_string)

  if (the_other_string == "") {
    plan_field.val('label..')
  } else {}
  auto_size_text($('.plan_title_edit'))
}

function auto_size_text(text_field) {
/*  the_string = text_field.val()
  $('#plan_title_' + text_field.data('plan')).val(the_string)
  if (the_string.width('12px Helvetica Neue') + the_string.length * 3 + 1 > 53) {
    text_field.width(the_string.width('12px Helvetica Neue') + the_string.length * 3 + 1)
  } else {
    text_field.width(54)
  }*/

}

function maximize_rows() {
  var rows = ($('.grid_days').size() - 1)
  if (rows < 3) {
    var week_html = ""
    var start_date = Date.parse($('#add_row_top').attr('data-start_date'))
    var plan_id = $('#add_row_top').data('plan_id')
    start_date.setDate(start_date.getDate() + (3 * 7))
    for (var i = 0; i < 7; i++) {
      var dialog_link = "/log_entries/new/" + cal_out(start_date) + "/plan_" + plan_id
      var link = "<a class='dialog_link' onclick='simple_dialog_link(&quot;" + dialog_link.toString() + "&quot;, &quot;" + cal_out(start_date).to_String + "&quot;); return false;' href='#')>" + (i + 1 + (3 * 7)) + "</a>"
      week_html += "<td><div class='grid_cell'><div class='cell_padding'><div id='" + cal_out(start_date) + "' class='number_plan_grid'>" + link.toString() + "</div></div></div></td>"
      start_date.setDate(start_date.getDate() + 1)
    }
    week_html += "<td class='total_grid'><div class='grid_cell'></div></div>"
    var height_cell = $('.grid_days td').height()
    $('.grid_days').last().after("<tr class='grid_days'>" + week_html + "</tr>")
    $('.grid_days').last().children('td').css("display", "none")
    $('.grid_days').last().animate({
      height: height_cell
    }, 400, function() {
      $('.grid_days').last().children('td').fadeIn()

    })
  }
}

function backgrounded() {
  //find cal moused_over and change background of cal_days after
  var cal_day = $(this)
  count = days
  $('.grid_cell_day').each(function() {
    if ($(this).attr('id') == cal_day.attr('id')) {
      var date1 = Date.parse($(this).attr('id').slice(1))
      var grid_cell = $(this).index('.grid_cell_day')
      while (count > 0) {
        $('.grid_cell_day:eq(' + grid_cell + ')').parent().addClass('shadowed')
        grid_cell += 1
        count = count - 1
      }



    }
  })
}
last_ajax_call = ""

//function for closing plans and placing right_container_content back on the page
function close_plans_return() {
  $('.small_plan_title_grid').fadeOut()
  $('.plan_list').fadeIn()
  $('#search_plans').removeClass('large_plan_view')
  $('#right_container').animate({
    opacity: 0
  }, 0)
  $.get(last_ajax_call, function(data) {
    $('#right_container').html(data);
    paint_workouts()
    $('#right_container').animate({
      opacity: 1
    }, 400)

  })

}

function close_plans() {
  $('.copy_toggle').removeClass('hidden')
  $('#search_plans').removeClass('large_plan_view')
  if ($('.the_plans').is(":visible") == false) {
    if ($('.display_plans').hasClass('selected_toggle_item') == true) {
      $('.the_plans').show()
      $('.new_plan').addClass('hidden')

      var plan_height = $('.plan_list').height()
      $('.plan_list').css({
        height: 0,
        opacity: 0
      })
      $('.plan_list').animate({
        height: plan_height,
        opacity: 1
      }, function() {
        $('.plan_list').css("height", "auto")

      })
    }
  }
  if ($('#plan_search_container').is(":visible") == false) {
    $('.the_plans').show()
    $('.new_plan').addClass('hidden')
  }


}

function submit_form(form_id) {
  $('#' + form_id).submit()
}

function remove_backgrounded() {

  $('.shadowed').each(function() {
    $(this).removeClass('shadowed')
  })
}
traction_down = false

jQuery.fn.center = function() {
  this.css("position", "absolute");
  this.css("top", Math.max(0, (($('.edit_container').height() - $(this).outerHeight()) / 2) +
    $(window).scrollTop()) + "px");
  this.css("left", Math.max(0, (($('.edit_container').width() - $(this).outerWidth()) / 2) +
    $(window).scrollLeft()) + "px");
  return this;
}

$(function() {
  //scroll to start of plan
  $('body').on('click touchstart', '.day_1', function() {
    if ($('.workout_list_item').size() > 0) {
      var first_workout_top = $('.workout_list_item').first().parent().parent().position().top - 1
    } else {
      var first_workout_top = $('.date_today').first().parent().parent().position().top -4
    }
    $('.cal_scroll').first().animate({
      scrollTop: first_workout_top
    }, 1000, 'easeInOutCubic', function() {
      // Animation complete.
    });
  })


  // Create the measurement node
  var scrollDiv = document.createElement("div");
  scrollDiv.className = "scrollbar-measure";
  document.body.appendChild(scrollDiv);

  // Get the scrollbar width
  scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

  // Delete the DIV
  document.body.removeChild(scrollDiv);

  //remove scroll bar evidence
  $('#plan_bar_container').css('padding-left', scrollbarWidth)


  //plans link from cal view
  $('body').on('click', '.plans_link', function() {
    $('.active_plan').removeClass('active_plan')
    $('.plan').first().addClass('active_plan')
    adjust_side_bar('plans')
    $('.copy_toggle').addClass('hidden')
    //open sidebar if closed
    var width = $('#side_bar').css('left').replace(/[^-\d\.]/g, '');
    if (width < 0) {
      toggle_sidebar()
    }
    close_plan_athlete_id = $('#select_box').data('athlete_id')
    $('#right_container').fadeOut("fast")


    //	$('#search_plans').focus()
    last_ajax_call = "/log_entries/get_calendar/" + close_plan_athlete_id
    // make sure plans is selected
    if ($('.display_plans').hasClass('selected_toggle_item') == false) {
      $('.display_plans').click()
    }


  })
  $('body').on('click', '#close_all_plans', function() {
    $('.small_plan_title_grid').fadeOut()
    $('.plan_list').fadeIn()
    close_plans_return()
  })


  //center confirmation dialog
  $('.select_box').center()
  //dragable functionality
  $('.plan').draggable({
    handle: '.traction',
    cursorAt: {
      right: -1,
      bottom: -1
    }
  })
  $('body').on('mousedown', '.traction', function() {
    traction_down = true
    plan = $(this).parent('.plan')
    days = plan.attr('data-days')
    plan_clone = plan.clone()
    var width = plan.css('width')
    plan.css('width', width)
    plan.css('z-index', '99999')
    plan.css('opacity', '.8')
    plan.css('position', 'absolute')
    plan_clone.draggable({
      handle: '.traction',
      cursorAt: {
        right: -5
      }
    })
    plan.after(plan_clone)

    $('body').on('mouseenter', '.grid_cell_day', backgrounded)
    $('body').on('mouseleave', '.grid_cell_day', remove_backgrounded)
    return false;

  })

  //bring up confirmation depending on workouts contained
  $(document).mouseup(function() {
    if (traction_down == true) {
      traction_down = false
      plan_id = plan.attr('id')
      plan_id = plan_id.slice(8)
      plan.remove();
      start_date = $('.shadowed').first().children('.grid_cell').first().attr('id')
      var workout_count = 0
      $('.shadowed').each(function(cal_day) {
        workout_count += $(this).children('.grid_cell').first().children('.cell_padding').first().children('ul').length
      })
      if (typeof(start_date) != "undefined") {
        start_date = start_date.slice(1)
        athlete_id = $('#copy_button').attr('href').split('/')
      }
      $('body').off('mouseenter', '.grid_cell_day', backgrounded)
      $('.shadowed').each(function() {
        $(this).removeClass('shadowed')
      })
      if (workout_count > 0) {
        $('#confirm_paste').fadeIn();
      } else {
        var month = $('#calendar_navigation').data('start-date')
        paste_url = "/plans/paste/" + athlete_id[3] + "/" + plan_id + "/" + start_date + "/overwrite/" + month
        $.post(paste_url, function(data) {
          $('#confirm_paste').fadeOut();
          $('#right_container').html(data);
          paint_workouts()
        })
      }

    }
  })

  //give either overwrite or add_to_existing

  $('body').on('click', '#overwrite', function() {
    var month = $('#calendar_navigation').data('start-date')
    paste_url = "/plans/paste/" + athlete_id[3] + "/" + plan_id + "/" + start_date + "/overwrite/" + month
    $.post(paste_url, function(data) {
      $('#confirm_paste').fadeOut();
      $('#right_container').html(data);
      paint_workouts()
    })
  });

  $('body').on('click', '#add_to_existing', function() {
    var month = $('#calendar_navigation').data('start-date')
    paste_url = "/plans/paste/" + athlete_id[3] + "/" + plan_id + "/" + start_date + "/add/" + month
    $.post(paste_url, function(data) {
      $('#confirm_paste').fadeOut();
      $('#right_container').html(data);
      paint_workouts()
    })
  });

  //ajax functionality for labeling and adding tags to plan

  $('body').on('keyup', '.plan_name', function() {
    var name = $(this).val()
    var plan_id = $(this).parent('.plan').attr('id').slice(8)
    rename_plan_title($(this))
    delay(function() {


      $.put('/plans/update/' + plan_id + '/' + name, function(data) {

      });
    }, 300);

  })






  //control white text when form is clicked
  $('body').on('focus', '.tag_form', function() {
    if ($(this).val().toLowerCase() == 'click to add tags..') {
      if ($(this).hasClass('full_plan')) {
        $(this).addClass('black')
        $(this).val('')
      } else {
        $(this).addClass('white')
        $(this).val('')
      }
    }
  })
  $('body').on('blur', '.tag_form', function() {
    if ($(this).val().toLowerCase() == '') {
      $(this).removeClass('white')
      $(this).removeClass('black')
      $(this).val('click to add tags..')
    }
  })
  //watch tag field for (,) or (enter) and execute controller tag action to add tag to database
  $('body').on('focus', '.tag_form', function(e) {
    letter_count = 0
  })
  $('body').on('keyup', '.tag_form', function(e) {
    previous_count = letter_count
    letter_count = $(this).val().length
    plan_id = $(this).attr('id').substring(9)
    if (e.which == 188 || e.which == 13) {
      if (e.which == 188) {
        var tag = $(this).val().slice(0, -1)
      } else {
        var tag = $(this).val()
      }
      $(this).val('')
      if (tag != '') {
        var url = ("/plans/tag/" + plan_id + "/" + tag).replace(/ /g, "_");
        letter_count = 0
        if ($(this).hasClass('full_plan')) {
          $(this).prev('span').append("<span class='tag_full tag_hrs_full interface_teal'>" + tag + "</span> ")
        } else {
          $(this).prev('span').append("<span class='tag interface_teal'>" + tag + "</span> ")
        }
        $.get(url, function(data) {})
      }
    }
    //watch for backspace/delete and remove previous tag
    else if (e.which == 46 || e.which == 8) {
      if (previous_count == 0) {
        var content = $(this).prev('span').children('span:last-child').html()
        $(this).prev('span').children('span:last-child').remove()
        var url = ("/plans/remove_tag/" + plan_id + "/" + content).replace(/ /g, "_");
        $.get(url, function(data) {

        })

      }
    }
  })




  //adjust sidebar plans titles
  $('body').on('keyup', '.plan_title, .plan_title_edit', function() {
    rename_sidebar_plan($(this))

  })


  //search field for plans
  $('body').on('focus', '#search_plans', function() {
    if ($(this).val().toLowerCase() == 'search plans..') {
      $(this).addClass('black')
      $(this).val('')

    }
  })
  $('body').on('blur', '#search_plans', function() {
    if ($(this).val() == "") {
      $(this).removeClass('black')
      $(this).val('search plans..')

    }
  })
  //search field plans

  $('body').on('keyup', '#search_all_plans', function() {
    var search_object = $(this)
    delay(function() {
      //ajax call
      var search = search_object.val()
      if (search == '') {
        search = "recent_plans"
      }
      var url = ('/plans/search_list/' + search).replace(/ /g, "_");
      $.get(url);

    }, 500);

  })
  //search field plans ajax

  $('body').on('keyup', '#search_plans', function() {
    var search_object = $(this)
    delay(function() {
      var search = search_object.val()
      if (search == '') {
        search = "recent_plans"
      }
      if (search_object.hasClass('large_plan_view')) {
        var url = ('/plans/search/true/' + search).replace(/ /g, "_");
        $.get(url, function(data) {
          $('#right_container').html(data);
          $('#plan_bar_container').css('height', ($(window).height() - 51))

        })
      } else {
        var url = ('/plans/search/false/' + search).replace(/ /g, "_");
        $.get(url, function(data) {
          $('.plan_list').html(data)
          $('.plan').draggable({
            handle: '.traction',
            cursorAt: {
              right: -1,
              bottom: -1
            }
          })

        })
      }

    }, 300);
  })

  //manage plan index view
  $('body').on('focus', '.form_description', function() {
    if ($(this).val() == "add..") {
      $(this).val('')
    }
  })
  $('body').on('blur', '.form_description', function() {
    if ($(this).val() == '') {
      $(this).val('add..')
    }
  })
  var timeoutId = 0;
  $('body').on('keyup', '.edit_plan input, .edit_plan textarea', function() {
    clearTimeout(timeoutId); // doesn't matter if it's 0
    var form_id = $(this).closest('form').attr('id')
    timeoutId = setTimeout(function() {
      submit_form(form_id)
    }, 500);

  })
  $('.form_description').each(function() {
    if ($(this).val() == '') {
      $(this).val('add..')
    }
  })
  $('body').on('mouseenter', '.plan_info', function() {
    $(this).children('.plan_view_center').fadeIn('fast')
  })
  $('body').on('mouseleave', '.plan_info', function() {
    $(this).children('.plan_view_center').fadeOut('fast')
  })




  $('body').on('DOMMouseScroll mousewheel', '#plan_grid_scroll', function() {
    paint_workouts()
  })



  $('body').on('click', '#remove_row_bottom', function() {
    var count = 0
    $('.grid_days').last().children('td').each(function() {
      count += $(this).children('div').first().children('div').first().children('ul').size()
    })
    if (count > 0) {
      var confirm_dialog = "<div id='confirm_remove' class='select_box'><div class='button_red' id='remove_row_bottom_confirm'>remove workouts</div><div class='button' id='cancle_remove_row'>cancle</div></div>"
      $('body').append(confirm_dialog)
      $('#confirm_remove').fadeIn()
      $('#confirm_remove').center()
    } else {
      $('.grid_days').last().children('td').each(function() {
        $(this).remove()
      })

      var height_cell = $('.grid_days td').height()
      $('.grid_days').last().css('height', height_cell)
      $('.grid_days').last().animate({
        height: 0
      }, 400, function() {
        $('.grid_days').last().remove()
        paint_workouts()
      })
    }
  })
  $('body').on('click', '#remove_row_top', function() {
    var count = 0
    $('.grid_days').first().children('td').each(function() {
      count += $(this).children('div').first().children('div').first().children('ul').size()
    })
    if (count > 0) {
      var confirm_dialog = "<div id='confirm_remove' class='select_box'><div class='button_red' id='remove_row'>remove workouts</div><div class='button' id='cancle_remove_row'>cancle</div></div>"
      $('.edit_container').append(confirm_dialog)
      $('#confirm_remove').center()
      $('#confirm_remove').fadeIn()
    } else {
      $('.grid_days').first().children('td').each(function() {
        $(this).remove()
      })
      var starting_date = Date.parse($('#add_row_top').attr('data-start_date')).add({
        days: +7
      }).toString("yyyy-MM-dd")
      $('#add_row_top').attr('data-start_date', starting_date)
      //add a row too bottom if the row count is under 4
      maximize_rows()

      var height_cell = $('.grid_days td').height()
      $('.grid_days').first().css('height', height_cell)
      $('.grid_days').first().animate({
        height: 0
      }, 400, function() {
        $('.grid_days').first().remove()
        $('.number_plan_grid a').each(function() {
          var date_plan_number = parseInt($(this).text())
          $(this).text((date_plan_number - 7).toString())
        })
      })


    }
  })
  //confirm remove:

  $('body').on('click', '#remove_row_bottom_confirm', function() {
    $('#confirm_remove').remove()
    var copy_url = ""
    $('.grid_days').last().children('td').each(function() {
      var log_id = $(this).find('ul').attr('id')
      if (log_id) {
        log_id = log_id.slice(4)
        copy_url += "-" + log_id
      }
    })
    copy_url = copy_url.slice(1)
    $('.grid_days').last().children('td').each(function() {
      $(this).fadeOut()
      $(this).remove()
    })
    var height_cell = $('.grid_days td').height()

    $('.grid_days').last().css('height', height_cell)
    $('.grid_days').last().animate({
      height: 0
    }, 400, function() {
      $('.grid_days').last().remove()
      paint_workouts()
    })

    delete_url = "/plans/destroy/entries/" + copy_url
    $.delete(delete_url, function() {

    })

  })
  $('body').on('click', '#remove_row', function() {
    var starting_date = Date.parse($('#add_row_top').attr('data-start_date')).add({
      days: +7
    }).toString("yyyy-MM-dd")
    $('#add_row_top').attr('data-start_date', starting_date)
    $('#confirm_remove').remove()
    var copy_url = ""
    $('.grid_days').first().children('td').each(function() {
      var log_id = $(this).find('ul').attr('id')
      if (log_id) {
        log_id = log_id.slice(4)
        copy_url += "-" + log_id
      }
    })
    copy_url = copy_url.slice(1)
    $('.grid_days').first().children('td').each(function() {
      $(this).fadeOut()
      $(this).remove()
    })
    var height_cell = $('.grid_days td').height()

    $('.grid_days').first().css('height', height_cell)
    maximize_rows()
    $('.grid_days').first().animate({
      height: 0
    }, 400, function() {
      $('.grid_days').first().remove()
      $('.number_plan_grid a').each(function() {
        var date_plan_number = parseInt($(this).text())
        $(this).text((date_plan_number - 7).toString())
      })
    })

    delete_url = "/plans/destroy/entries/" + copy_url
    $.delete(delete_url, function() {

    })

    //close the plan and remove it from list if there are no more workouts in plan
    var workout_count = $('.workout_list').size()
    if (workout_count < 1) {
      var plan_top = plan_bar.position().top
      $('.plan_list_bars').hide();
      $('.plan_edit_link').show();
      $('.plan_title_center').children('input').show();
      plan_bar.fadeOut(function() {
        plan_bar.remove()
        $('.plan_bar').fadeIn()
        $('#plan_bar_container').scrollTop(scroll_position_plan)
        $('#plan_bar_container').css('height', ($(window).height() - 51))
      })

      $('#plan_bar_container').css('padding-left', scrollbarWidth)
      $('#edit_plan_container').empty();
      $('#edit_plan_container').css('height', 0)
    }


  })
  //opening/closing the plan?
  $('body').on('click', '.plan_click_container', function() {
    var plan_top = plan_bar.position().top
    $('.plan_list_bars').hide();
    $('.plan_edit_link').show();
    $('.plan_title_center').children('input').show();
    plan_bar.fadeOut(function() {
      plan_bar.remove()
      $('.plan_bar').fadeIn()
      $('#plan_bar_container').scrollTop(scroll_position_plan)
      $('#plan_bar_container').css('height', ($(window).height() - 51))
    })

    $('#plan_bar_container').css('padding-left', scrollbarWidth)
    $('#edit_plan_container').empty();
    $('#edit_plan_container').css('height', 0)
  })
  $('body').on('click', '#cancle_remove_row', function() {
    $('#confirm_remove').fadeOut()
    $('#confirm_remove').remove()
  })
  //add rows

  $('body').on('click', '#add_row_bottom', function() {
    var rows = ($('.grid_days').size())
    var week_html = ""
    var start_date = Date.parse($('#add_row_top').attr('data-start_date'))
    var plan_id = $('#add_row_top').data('plan_id')
    var starting_date = Date.parse($(this).attr('data-start_date'))
    start_date.setDate(start_date.getDate() + (rows * 7))

    for (var i = 0; i < 7; i++) {
      var dialog_link = "/log_entries/new/" + cal_out(start_date) + "/plan_" + plan_id
      var link = "<a class='dialog_link' data-remote='true' href='/log_entries/new?athlete_id=plan_" + plan_id + "&calendar_date=" + starting_date + "&date=" + start_date + "'>" + (i + 1 + rows * 7) + "</a>"
      week_html += "<td><div class='grid_cell'><div class='cell_padding'><div id='" + cal_out(start_date) + "' class='number_plan_grid'>" + link.toString() + "</div></div></div></td>"
      start_date.setDate(start_date.getDate() + 1)
    }
    week_html += "<td class='total_grid'><div class='grid_cell'></div></div>"
    var height_cell = $('.grid_days td').height()
    $('.grid_days').last().after("<tr class='grid_days'>" + week_html + "</tr>")
    $('.grid_days').last().children('td').css("display", "none")
    $('.grid_days').last().animate({
      height: height_cell
    }, 400, function() {
      $('.grid_days').last().children('td').fadeIn()

    })
  })
  $('body').on('click', '#add_row_top', function() {
    var week_html = ""
    var start_date = Date.parse($(this).attr('data-start_date'))
    var plan_id = $(this).data('plan_id')
    var starting_date = Date.parse($(this).attr('data-start_date')).add({
      days: -7
    }).toString("yyyy-MM-dd")
    start_date.setDate(start_date.getDate() - 7)
    for (var i = 0; i < 7; i++) {
      var dialog_link = "/log_entries/new/" + cal_out(start_date) + "/plan_" + plan_id
      var link = "<a class='dialog_link' data-remote='true' href='/log_entries/new?athlete_id=plan_" + plan_id + "&calendar_date=" + starting_date + "&date=" + start_date + "'>" + (i + 1) + "</a>"
      week_html += "<td><div class='grid_cell'><div class='cell_padding'><div id='" + cal_out(start_date) + "' class='number_plan_grid'>" + link.toString() + "</div></div></div></td>"
      start_date.setDate(start_date.getDate() + 1)
    }
    week_html += "<td class='total_grid'><div class='grid_cell'></div></div>"
    var height_cell = $('.grid_days td').height()
    $('.number_plan_grid a').each(function() {
      var number = parseInt($(this).text())
      $(this).text((number + 7).toString())
    })
    $('#add_row_top').attr('data-start_date', starting_date)
    $('.grid_days').first().before("<tr class='grid_days'>" + week_html + "</tr>")
    $('.grid_days').first().children('td').css("display", "none")
    $('.grid_days').first().animate({
      height: height_cell
    }, 400, function() {
      $('.grid_days').first().children('td').fadeIn()

    })


  })
  //cancle delete_workout
  $('body').on('click', '#cancle_remove', function() {
    $('#select_box').hide()
    $(".highlighted").each(function() {
      $(this).removeClass("highlighted")
    })
  })


  //adjust field size in edit mode

  $('body').on('keyup', '.plan_title_edit', function() {
    auto_size_text($(this))

  })
  $('body').on('click', '.edit_plan_link', function() {
    $("#right_container").fadeOut("fast")
    $('.active_plan').removeClass('active_plan')
    $(this).children('.plan').addClass('active_plan')

    //adjust plan delete link to id of clicked plan
    var plan_id = $(this).children('.plan').attr('id').slice(7)

    var delete_url = $('.plan_button_delete').attr('href')
    delete_url = delete_url.split('/')
    delete_url[3] = "plan" + plan_id
    $('.plan_button_delete').attr('href', delete_url.join('/'))
  })
  $('body').on('click', '.plan_name', function(e) {
    if ($(this).parent().hasClass('active_plan')) {
      return false
    }
  })

  $('body').on('click', '.add_week', function() {
    if ($(this).children('.row_menu').is(":hidden")) {
      $('.row_menu').hide()
      $(this).children('.row_menu').fadeIn('fast')
    } else {
      $(this).children('.row_menu').hide()
    }
  })
  $(document).mouseup(function(e) {
    var container = $(".add_week");

    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      $('.row_menu').hide()
    }
  });
  $('body').on('mouseup', '.plan_button_delete', function() {
    $(this).addClass('disabled')
  })

  $('body').on('ajax:send', '.plan_button_delete', function(e) {
    $('#right_container').fadeOut("fast")
    var plan_id = $('.active_plan').attr('id')
    $('.active_plan').addClass('temporary_plan_container')
    if ($('.all_plans').children().first().children().first().hasClass('active_plan')) {
      $('.active_plan').removeClass('active_plan')
      $('.all_plans').children().first().next('a').children('.plan').addClass('active_plan')
    } else {
      $('.active_plan').removeClass('active_plan')
      $('.all_plans').children().first().children('.plan').addClass('active_plan')
    }
    setTimeout(function() {
      $('#' + plan_id).first().parent().remove()
      $('#' + plan_id).remove()

    }, 350)

  })
  $('body').on('click', '.plan_button_new, .first_plan_link', function() {
    $('.plan_button_new').addClass('disabled')
    $('#right_container').fadeOut("fast")
  })
})
