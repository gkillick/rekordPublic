module ApplicationHelper
  def toggle(method_value, preference)
    value = (preference.send(method_value) if preference.send(method_value) != nil) || "off"
    link_value = ("on" if value.downcase == "off") || "off"
    link_class = ("app_option_selected" if value.downcase == "on") || "off"
    toggle = '<div class="app_button_option block_right '+method_value+'_toggle '+link_class+'">'+value+'</div>'
    link_to(toggle.html_safe, preference_path(preference.id, :preferences => {method_value.to_sym => link_value} ), :method => :put, :remote => true, :class => "interface_toggle_button", :id => "interface_toggle_"+method_value)
  end


  def link_to_permission_toggle(permission,attribute_name)
    link = '<div class="on_off_toggle toggle_'+permission.send(attribute_name.to_sym).to_s+'" data-toggle_value='+permission.send(attribute_name.to_sym).to_s+' data-attribute_name='+attribute_name.to_s+'><div class="on_off_circle toggle_'+permission.send(attribute_name.to_sym).to_s+'_circle"><div class="on_off_text"></div></div></div>'
				link_to(link.html_safe, friendship_permission_path(permission.id, "friendship_permission["+attribute_name+"]" => !permission.send(attribute_name.to_sym)), :method => :put, :id => "permission_"+ permission.id.to_s, :class => "toggle_link permission_"+attribute_name.to_s, :data => {:attribute_name => attribute_name.to_s,  :href => friendship_permission_path(permission.id, "friendship_permission["+attribute_name+"]" => !permission.send(attribute_name.to_sym))}, :remote => true)
  end

  def link_to_remove_fields(name, f)
    f.hidden_field(:_destroy) + link_to(raw("<div class='icon-cancel-circled'></div>"), "#",:class => "link_no_style remove_link remove_fields")
  end

  def link_to_remove_fields_mobile(name, f)
    f.hidden_field(:_destroy) + link_to(raw("<div class='remove_field_mobile'>b</div>"), "#",:class => "link_no_style remove_link")
  end

  def link_to_add_fields(name, f, association)
    new_object = f.object.send(association).klass.new
    id = new_object.object_id
    fields = f.fields_for(association, new_object, child_index: id) do |builder|
      render("workout_time_fields", :f => builder, :the_zone => 3)
    end
    link_to(raw("<div class='add_interval'>add interval</div>"), "#", class: "add_fields link_no_style "+ name, data: {id: id, fields: fields.gsub("\n", "")})
  end
  def link_to_add_fields_mobile(name, f, association)
    new_object = f.object.send(association).klass.new
    id = new_object.object_id
    fields = f.fields_for(association, new_object, child_index: id) do |builder|
      render("workout_time_fields", :f => builder, :the_zone => 3)
    end
    link_to(raw("<div class='add_interval_mobile'>add interval</div>"), "#", :class => "link_no_style "+ name, data: {id: id, fields: fields.gsub("\n", "")})
  end

  def link_to_dialog(name, reference, type, cal)
    title = type
    if type == "edit" # link_to_dialog(link_name, entry_id, edit)
      request = '/log_entries/'+reference+'/edit'
      link_to(name, 'dialog_link("'+request+'", "'+title+'")')
    elsif type == "graph"
      request = '/graph/'+reference
      link_to(name, 'dialog_link("'+request+'", "'+title+'")')
    elsif type == "new" # link_to_dialog(window_title, date, new)
      request = '/log_entries/new/'+reference
      if cal == "cal" #format link for either calendar or carousel
        link_to(Date.parse(reference).day, 'dialog_link("'+request+'", "'+name+'")', :class => "puh")
      else
        link_to(image_tag("/images/layout/plus.png", :alt => ''), 'dialog_link("'+request+'", "'+name+'")', :class => "plus")
      end
    end
     #have to make the "new dialog" suround the total div
  end
  def trim num
    i, f = num.to_i, num.to_f
    i == f ? i : f
  end
  def percentage_array(array,index)

    sum = array.inject(0){|sum,x| sum + x }
    if sum != 0
      sub_total = array[index]
      percent = sub_total.to_f/sum.to_f*100.0
    else
      percent = 0
    end
    return percent

  end

  def format_feel_trend(feel)
    feel = trim(feel)
		if feel < 0
		  trend = "- "+(-1*feel).to_s
		else
		  trend = "+ "+feel.to_s
    end
    return trend
  end

  def convert_to_week_days(date)
    Date.strptime(str = date, fmt='%F').strftime('%a').downcase
  end

  def convert_to_date(date)
    Date.strptime(str = date, fmt='%F').strftime('%d').downcase
  end
  def time_clean_seconds(t)
    if t == 0
      x = "00:00"
    else
      hours = t/3600
      minutes = t%3600
      seconds = minutes%60
      minutes = minutes/60
      if hours == 0
        hours = "0"
      elsif hours <10
        hours = "0"+hours.to_s()
      end
      if seconds <30
        seconds = 0
      elsif seconds >= 30
        minutes += 1
      end
      if minutes == 0
        minutes = "0"
      elsif minutes <10
        minutes = "0"+minutes.to_s()
      end
      unless x == "00:00"
        x = hours.to_s()+"<span class='sub_time'> hrs</span> "+minutes.to_s()+"<span class='sub_time'> min</span>"
      end
    end
    return x
  end
  def time_cleanup(t) #fix this so that it treats t as an integer and doesnt check for string value
    if t == 0
  		x = "0:00"
  	#convert any number between 10 and 60 to format 0:MM
  	elsif t <60 and t >= 10
  		x = "0:"+t.to_s()
  	elsif t < 10 and t != 0
  		x = "0:0"+t.to_s()
  	#convert greater than 60 minutes to hours and minutes H:MM
  	elsif t >= 60
  		h = t/60
  		h = h.floor
  		r = t%60
			if r >= 10
				x = h.to_s()+":"+r.to_s()
			elsif r < 10
				x = h.to_s()+":0"+r.to_s()
			end
  	#convert numbers 1-10 to hours in format H:00
  	elsif t < 10
  		x = t.to_s()+":00"
  	  return x
    end
  end

  def time_clean_seconds_text(t)
    if t == 0
      x = "0 seconds"
    else
      hours = t/3600
      minutes = t%3600
      seconds = minutes%60
      minutes = minutes/60
      if hours == 0
        hours = ""
      else
        if hours == 1
          hours = hours.to_s + "h "
        else
          hours = hours.to_s + "h "
        end
      end
      if minutes == 0
        minutes = ""
      else
        if minutes == 1
        minutes = minutes.to_s + "m "
        else
        minutes = minutes.to_s + "m "
        end
      end
      if seconds == 0
        seconds = ""
      else
        if seconds == 1
        seconds = seconds.to_s + "s"
        else
        seconds = seconds.to_s + "s"
        end
      end
    x = hours + minutes + seconds
    end
    return x
  end

  def time_clean_h_m(t)
    if t == 0
      x = "0"
    else
      hours = t/3600
      minutes = t%3600
      seconds = minutes%60
      minutes = minutes/60
      if seconds <30
        seconds = 0
      elsif seconds >= 30
        minutes += 1
      end
      if hours != 0
        hours = hours.to_s + "<span class='sub_time_mobile'>h</span>"
      else
        hours = ""
      end
      if minutes != 0
        minutes = minutes.to_s + "<span class='sub_time_mobile'>m</span>"
      else
        minutes = ""
      end

      if x != "0"
        x = hours+minutes
      else
        x = "0"
      end
    end
    return x
  end
  def time_clean_h(t)
    if t == 0
      x = "0"
    else
      hours = t/3600
      if hours != 0
        hours = hours.to_s + "<span class='sub_time_mobile'>h</span>"
      else
        hours = ""
      end

      if x != "0"
        x = hours
      else
        x = "0"
      end
    end
    return x
  end

  def mobile_device?
    if session[:mobile_param]
      session[:mobile_param] == "1"
    else
      request.user_agent =~ /Mobile|webOS/
    end
  end
  def add_array(array)
    return "%g" % (((array.inject(0){|sum,x| sum + x }/60.0/60.0 * 10).ceil/10.0) / 1.0)
  end

  def percentage_width(a,b)
    a = a.to_f
    b = b.to_f
    if a > b
      return 100
    else
      return a/b*100
    end
  end

  def start_date_year(start_date)
    if start_date == nil
      start_date = ("April 1st 2016").to_date
    end

    if Date.today - start_date.change(:year => Time.now.year) >= 0
      return Date.today.year
    else
      return Date.today.year - 1
    end
  end


end
