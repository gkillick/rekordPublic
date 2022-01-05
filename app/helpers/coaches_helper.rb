module CoachesHelper
  def link_to_athlete(name, id)
    request = 'calendar/'+id.to_s
    link_to(name, request)
  end
end

# new coach dialog link with proper formating for list item

def average_load_convert(load)
  if load == 0
    string_load = "0"
  elsif load < 100
    percentage = 100 - load
    string_load = "-"+percentage.to_s
  elsif load == 100
    string_load = "0"
  elsif load > 100
    percentage = load - 100
    string_load = "+"+percentage.to_s
  end
  return string_load
end

def link_to_edit_workout(workout,date,plan,colors, calendar_month)
  if workout.total_completed != nil
  completed_time = time_cleanup(workout.total_completed/60)
  else
      completed_time = "0"
  end
  background = "blue_gradient"
  background_class = ""
  intensity = ""
  instructions_button = ""

  #grab messages for workout
  messages = ""
  if workout.messages.size > 1
    messages += "<div class='hover_coach_name'>Feedback:</div>"
  end
  if workout.messages.size > 0 && workout.messages.size < 2
    if workout.messages.first.message != ""
      messages += "<div class='hover_coach_name'>Feedback:</div>"
    end
  end
  workout.messages.each do |message|
    unless message.user_id == nil || message.message == ""
      messages += "<div><span class='hover_body'>" + truncate(message.message, :length => 85, :omission => '..') + "</span> <span class='hover_coach_name'> "+User.find(message.user_id).first_name+"</span></div>"
    end
  end

  if workout.planned_workouts && workout.planned_workouts.first != nil
      if workout.planned_workouts.first.planned_workout_times.size > 1
      intensity = "<table><tr><th>sets</th><th>time</th><th>rest</th><th>zone</th></tr>"
      workout.planned_workouts.first.planned_workout_times.each do |time|
        unless time.zone == 1
        #intensity += "<tr><td>"+time.multiplier.to_s+"</td><td>"+time_cleanup(time.sub_duration)+"</td><td>"+time_cleanup(time.rest)+"</td><td>"+time.zone.to_s+"</td></tr>"
        end
      end
      intensity += "</table>"
    end
    instructions = workout.planned_workouts.first.instructions
    if instructions.length > 0
      instructions_button = "<div class='icon-bars instructions_workout'><div class='instructions_drop'><div class='instructions_triangle'></div><div class='instructions_body'><span class='hover_coach_name'>Description:</span></br>"+simple_format(truncate(instructions, :length => 85, :omission => '..'),{}, sanitize: true)+"</div></div></div>"
  #  elsif intensity != ""
#      instructions_button = "<div class='icon-bars instructions_workout'><div class='instructions_drop'><div class='instructions_triangle'></div><div class='instructions_body'>"+truncate(instructions, :length => 85, :omission => '..')+intensity+messages+"</div></div></div>"
#    elsif messages != ""
  #    instructions_button = "<div class='icon-bars instructions_workout'><div class='instructions_drop'><div class='instructions_triangle'></div><div class='instructions_body'>"+messages+"</div></div></div>"
    else
      instructions_button = ""
    end
  end
  unless colors == nil
    colors = activities_to_array(colors)
    colors.each do |color|
      if color[0] == workout.activity_id && color.size > 1
        background_class = 'style="background:'+color[1]+';"'
        background = ""
      end
    end
  end
  unless workout == nil
    workout_effort = workout.effort_level
  title = date.to_s
  planned_time = ""
  if workout.has_intensity
    intensity_link = "intensity_true"
  else
    intensity_link = ""
  end
  if plan
    if workout.total_planned > 0
      planned_time = time_cleanup(workout.total_planned/60)
    else
      planned_time = "0:00"
    end
  else
    if workout.total_planned > 0
      if workout.total_completed == 0
        #completed_time = ""
      end
      planned_time = "<span class='plan_small'> / </span>"+time_cleanup(workout.total_planned/60)
    end
  end

  request = '/log_entries/'+workout.log_entry_id.to_s+'/edit/'+workout.id.to_s+"/"+calendar_month.to_s
  if plan
    html_link = "<li id='workout_"+workout.id.to_s+"' data-date='"+ date.to_s+"' class='workout_present "+intensity_link+" workout_list_item "+background+"' "+background_class+" data-activity='"+workout.activity_id.to_s+"'>"+link_to(raw(instructions_button+"<span class='activity_class'>"+workout.activity_id.to_s+"</span> "+planned_time), request, :class => "dialog_link", :remote=> true, :data => {:effort => workout_effort, :completed_time => workout.total_completed, :planned_time => workout.total_planned} )+link_to(raw("<div class='icon-cancel-circled delete_workout'></div>"), "log_entries/delete_workout/"+workout.id.to_s+"/"+calendar_month.to_s, :method => :delete, :remote => true, :class => "delete_workout_link", :id => "delete_workout_"+workout.id.to_s)+"</li>"
  else
  html_link = "<li id='workout_"+workout.id.to_s+"' class='"+intensity_link+" workout_list_item "+background+"' "+background_class+" data-activity='"+workout.activity_id.to_s+"'>"+link_to(raw(instructions_button+"<span class='activity_class'>"+workout.activity_id.to_s+"</span> "+completed_time+planned_time), request, :class => "dialog_link", :remote => true, :data => {:effort => workout_effort, :completed_time => workout.total_completed, :planned_time => workout.total_planned} )+link_to(raw("<div class='icon-cancel-circled delete_workout'></div>"), "log_entries/delete_workout/"+workout.id.to_s+"/"+calendar_month.to_s, :method => :delete, :remote => true, :class => "delete_workout_link", :id => "delete_workout_"+workout.id.to_s)+"</li>"
  end
  raw(html_link)
  end
end

def link_to_new_entry_coach(date,number,athlete_or_plan_id, calendar_date)
  link_to(number, new_log_entry_path(date: date.to_s, athlete_id: athlete_or_plan_id, calendar_date: calendar_date), :class => "dialog_link", :remote => true)
end

def link_to_new_entry_mobile(date,number,athlete_or_plan_id, calendar_date)
  title = date.to_s
  request = '/log_entries/new/'+date.to_s+'/'+athlete_or_plan_id+"/"+calendar_date.to_s
  link_to(number, request, :class => "dialog_link workout_mobile variable_link", :remote => 'true', :data => {:date => title}, method: :post)
end

def link_to_new_workout_coach(entry,number)
  request = "/log_entries/new/"+entry.date.to_s+"/entry_"+entry.id.to_s
  title = entry.date.to_s
  link_to(number, 'simple_dialog_link("'+request+'", "'+title+'")', :class => "dialog_link")
end


# custom dialog link copy from link_to_dialog but routed to proper controler ------

def link_to_coaches_dialog(name, reference, type, athlete_id, workout_reference, date)
  title = date
  if type == "edit" # link_to_dialog(link_name, entry_id, edit)
    request = '/log_entries/'+reference+'/edit/'+workout_reference
    link_to(name, 'simple_dialog_link("'+request+'", "'+title+'")', :class => "dialog_link")
  elsif type == "graph"
    request = '/graph/'+reference
    link_to(name, 'simple_dialog_link("'+request+'", "'+title+'")')
  elsif type == "new" # link_to_dialog(window_title, date, new, cal, athlete_id)
    request = '/log_entries/new/'+reference+'/'+athlete_id

      link_to(Date.parse(reference).day, 'simple_dialog_link("'+request+'", "'+title+'")', :class => "puh")

  end
   #have to make the "new dialog" suround the total div
end
