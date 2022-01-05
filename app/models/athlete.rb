class Athlete < User
#  has_and_belongs_to_many :coaches
  has_many :log_entries
  accepts_nested_attributes_for :log_entries
  has_many :month_totals

  def adjust_month_hours(date, zone, time)
    date1 = date.to_date.beginning_of_month()
    date2 = date1.end_of_month()
    if self.month_totals.where(:start_date => date1).size > 0
      month = self.month_totals.where(:start_date => date1).first
      month_totals = month.time_totals.split(",").collect{ |s| s.to_i }
      month_totals[zone] = month_totals[zone] + time.to_i

      month.time_totals = month_totals.join(",")
      month.save
    else
      total = self.zone_total_between(date1,date2)
      new_month_total = self.month_totals.new
      new_month_total.start_date = date1
      new_month_total.time_totals = total.join(",")
      new_month_total.save
    end

  end


  def comments(date1, date2)
    comments = []
    entries = self.log_entries.log_entry_between_dates(date1, date2)
    n = 0
    entries.each do |entry|
      entry.workouts.each do |workout|
        workout.messages.each do |message|
          comments << {:text => message.message, :user_id => message.user_id, :workout_id => message.workout_id, :comment_id => message.id, :comment_position => n, :date =>entry.date}
          n+=1
        end
      end
    end
    return comments.reverse
  end
  def month_hours(date)
    date1 = date.to_date.beginning_of_month()
    date2 = date1.end_of_month()
    if self.month_totals.where(:start_date => date1).size > 0
      total = (self.month_totals.where(:start_date => date1).first.time_totals).split(",").collect{ |s| s.to_i }
    else
      if self.log_entries.log_entry_between_dates(date1, date2).size > 0
        total = zone_total_between(date1,date2)
        new_month_total = self.month_totals.new
        new_month_total.start_date = date1
        new_month_total.time_totals = total.join(",")
        new_month_total.save
      else
        total = [0,0,0,0,0]
      end
    end
    return total
  end
  def year_stats(start_date)
    total = [0,0,0,0,0]
    month_total = 0
    12.times do |n|
      month_total = self.month_hours(start_date)
      if month_total != nil
        month_total.each_with_index do |value, index|
          total[index] = total[index] + value
        end
      end
      start_date += 1.month
    end
    return total
  end
  def month_stats(date)
    stats = {}
    date1 = date.to_date.beginning_of_month()
    date2 = date1.end_of_month()
    #atp planned month hours
    if self.preferences.start_date != nil
      start_date_atp = self.preferences.start_date
    else
      start_date_atp = "Wed, 01 Apr 2015"
    end
    year = date1.year
    start_date_atp = start_date_atp.to_date().change(:year => year.to_i)
    if start_date_atp > date1
      start_date_atp = start_date_atp.to_date().change(:year => (year.to_i - 1))
    end
   # last_year_training = self.year_stats(start_date_atp.to_date - 1.year)

    annual_training_plan = self.annual_training_plans.atp_for_year(start_date_atp.year).first
    if annual_training_plan != nil
      stats["planned_hours_month"] = eval(annual_training_plan.month_hours)[(date1.year * 12 + date1.month) - (start_date_atp.year * 12 + start_date_atp.month)]
    else
      stats["planned_hours_month"] = 0
    end
    #stats[:last_year_training] = last_year_training
    stats["zone_totals_month"] = self.month_hours(date1)
    stats["total_hour_year"] = self.year_stats(start_date_atp.to_date)
    stats["seven_day_feel"] = self.recent_feel
    stats["current_date"] = date1
    if stats["seven_day_feel"].size == 1
      stats["seven_day_feel"].unshift([Date.today, 0.0])
    end
    return stats
  end


  def current_week_load
    if Date.today.wday == 0
      start_date = Date.today - 6.days
    else
      start_date = Date.today - (Date.today.wday - 1).days
    end
    entries = log_entries.log_entry_between_dates(start_date, start_date + 7.days)
    total_time = 0
    total_intensity_time = 0
    if entries.size > 3
      entries.each do |entry|
        if entry.date == Date.today
          if entry.total_minutes > 0
            total_time += entry.total_minutes
            total_intensity_time += entry.total_intensity_completed
          else
            total_time += entry.total_minutes_planned
            total_intensity_time += entry.total_intensity_planned
          end
        elsif entry.date > Date.today
          total_time += entry.total_minutes_planned
          total_intensity_time += entry.total_intensity_planned
        else
          total_time += entry.total_minutes
          total_intensity_time += entry.total_intensity_completed
        end
      end
    end
    load = [total_time/60.0/60.0, total_intensity_time/60.0]
    return load
  end
  def average_load(start_date)
  end_date = Date.today - (6+ Date.today.wday).days
  load = []
  while start_date <= end_date
    entries = log_entries.log_entry_between_dates(start_date, start_date + 7.days)
    start_date += 7.days
    total_time = 0
    total_intensity_time = 0
    if entries.size > 3
      entries.each do |entry|
        total_time += entry.total_minutes
        total_intensity_time += entry.total_intensity_completed
      end
      load << [total_time,total_intensity_time]
    end

    end
    average_intensity = 0
    average_total = 0
    load.each do |load|
      average_intensity += load[1]
      average_total += load[0]
    end
    if load.size > 0
      average_load = [average_total/load.size.to_f/60.0/60.0,average_intensity/load.size.to_f/60.0]
    else
      average_load = [0,0]
    end
    return average_load
  end

  def recent_feel
    end_date = Date.today
    start_date = end_date - 8.days
    seven_day_feel = []
    Athlete.find(self.id).log_entries.log_entry_between_dates(start_date, end_date).each do |entry|
      feel = entry.feel
      if feel != nil
        seven_day_feel << [entry.date, ((feel/10.0))]
      end
    end
    if seven_day_feel.size < 2
      difference = 0
    else
      difference = seven_day_feel[-1][1] - seven_day_feel[-2][1]
    end
    seven_day_feel << difference.round(1)
    return seven_day_feel
  end
  def seven_day_feel
    end_date = Date.today
    start_date = end_date - 32.days
    seven_day_feel = []
    Athlete.find(self.id).log_entries.log_entry_between_dates(start_date, end_date).each do |entry|
      feel = entry.feel
      if feel != nil
        seven_day_feel << [entry.date.to_time.in_time_zone('UTC').beginning_of_day.to_i*1000, ((feel/10.0))]
      end
    end
    if seven_day_feel.size < 2
      difference = 0
    else
      difference = seven_day_feel[-1][1] - seven_day_feel[-2][1]
    end
    seven_day_feel << difference.round(1)
    return seven_day_feel

  end

  def planned_hours_month(start_date,end_date,zone)
    start_date = start_date.to_date
    end_date = end_date.to_date
      total_duration = 0
      Athlete.find(self.id).log_entries.log_entry_between_dates(start_date, end_date).each do |entry|
        entry.workouts.each do |workout|
          workout.planned_workouts.each do |planned_workout|
            if zone == 1
              planned_workout.planned_workout_times.zone(1).each do |workout_time|
                total_duration += workout_time.duration
              end
            elsif zone == 2
              planned_workout.planned_workout_times.zone(2).each do |workout_time|
                total_duration += workout_time.duration
              end
            elsif zone == 3
              planned_workout.planned_workout_times.zone(3).each do |workout_time|
                total_duration += workout_time.duration
              end
            elsif zone == 4
              planned_workout.planned_workout_times.zone(4).each do |workout_time|
                total_duration += workout_time.duration
              end
            elsif zone == 5
              planned_workout.planned_workout_times.zone(5).each do |workout_time|
                total_duration += workout_time.duration
              end
            else
              planned_workout.planned_workout_times.intensity().each do |workout_time|
                total_duration += workout_time.duration
              end
            end
          end
        end
      end
      return total_duration
  end
  def planned_hours_months(start_date,zone)
    months = []
    date_end = start_date.end_of_month()
    12.times do
      hours = self.planned_hours_month(start_date,date_end,zone)
      months << hours
      start_date += 1.month
      date_end += 1.month
    end
    return months
  end
  def total_planned_by_day(date1,date2)
    days = []
    diff = (date2 - date1).to_i
    diff.times do |n|
      days << self.planned_hours_month(date1,date1,1) + self.planned_hours_month(date1,date1,"intensity")
      date1 += 1.day
    end
    return days
  end
  def completed_hours_month(start_date,end_date,zone)
    start_date = start_date.to_date
    end_date = end_date.to_date
    total_duration = 0
    Athlete.find(self.id).log_entries.log_entry_between_dates(start_date, end_date).each do |entry|
      entry.workouts.each do |workout|
        workout.completed_workouts.each do |completed_workout|
          if zone == 1
            completed_workout.workout_times.zone(1).each do |workout_time|
              total_duration += workout_time.duration
            end
          elsif zone == 2
            completed_workout.workout_times.zone(2).each do |workout_time|
              total_duration += workout_time.duration
            end
          elsif zone == 3
            completed_workout.workout_times.zone(3).each do |workout_time|
              total_duration += workout_time.duration
            end
          elsif zone == 4
            completed_workout.workout_times.zone(4).each do |workout_time|
              total_duration += workout_time.duration
            end
          elsif zone == 5
            completed_workout.workout_times.zone(5).each do |workout_time|
              total_duration += workout_time.duration
            end
          else
            completed_workout.workout_times.intensity().each do |workout_time|
              total_duration += workout_time.duration
            end
          end
        end
      end
    end
    return total_duration
  end

  def completed_hours_months(start_date,zone)
    months = []
    end_date = start_date.end_of_month()
    12.times do
      hours = self.completed_hours_month(start_date,end_date,zone)
      months << hours
      start_date += 1.month
      end_date += 1.month
    end
    return months
  end
  def zone_totals_month(date)
    date_end = date.end_of_month()
    zones = []
    5.times do |n|
      zones << self.completed_hours_month(date,date_end,(n+1))
    end
    return zones
  end
  def zone_total_between(date1,date2)
    zones = []
    5.times do |n|
      zones << self.completed_hours_month(date1,date2,(n+1))
    end
    return zones
  end
  def zone_totals_by_day(date1,date2)
    days = []
    diff = (date2-date1).to_i
    diff.times do |n|
      days << self.zone_total_between(date1,date1)
      date1 += 1.day
    end
    return days
  end



  def total_hours_between_dates(start_date, end_date)
    total = 0
    self.log_entries.log_entry_between_dates(start_date, end_date).find_each do |entry|
      entry.workouts.each do |workout|
        total += workout.total_completed
      end
    end
    return total
  end

  def year_hours_to_today(year)
    start_date = self.preferences.start_date
    if start_date == nil
      start_date = ("April 1 "+Date.today.change(:year => year).year.to_s).to_date
    end
    start_date = start_date.change(:year => year)
    #use cached data for month if not first of month
    if start_date.day != 1
      hours = total_hours_between_dates(start_date, start_date.end_of_month)
    else
      hours = self.month_hours(start_date).inject(0){|sum,x| sum + x }
    end
    middle_date = start_date + 1.month
    while middle_date.month < Date.today.month
      hours += self.month_hours(middle_date).inject(0){|sum,x| sum + x }
      middle_date += 1.month
    end
    end_year = middle_date.year
    hours += self.total_hours_between_dates(middle_date.at_beginning_of_month, Date.today.change(:year => end_year))

    return hours

  end

  def year_hours_total(the_year)

    start_date = self.preferences.start_date
    if start_date == nil
      start_date = ("April 1 "+Date.today.change(:year => the_year).year.to_s).to_date
    end
    start_date = start_date.change(:year => the_year)
    end_date = start_date + 12.months
    annual_training_plan = self.annual_training_plans.atp_for_year(the_year).first
    if annual_training_plan != nil
      month_hours = eval(annual_training_plan.month_hours)
    else
      month_hours = [0,0,0,0,0,0,0,0,0,0,0,0]
    end
    year = {}
    12.times do |n|
      month_total = self.month_hours(start_date + n.months)
      year[(start_date + n.months).month] = {:planned => {:total => month_hours[n]*60*60}, :completed => {:total => month_total.inject(0){|sum,x| sum + x } , :total_intensity => month_total.drop(1).inject(0){|sum,x| sum + x }, :total_zones => month_total }}
    end

    #calculations to find ceiling
    ceiling = 0
    ceiling_completed = 0
    ceiling_planned = 0

    year.each do |month|
      total_completed = month[1][:completed][:total]
      total_planned = month[1][:planned][:total]

      if total_completed > ceiling_completed
        ceiling_completed = total_completed
      end
      if total_planned > ceiling_planned
        ceiling_planned = total_planned
      end
    end


    if ceiling_planned > ceiling_completed
      ceiling = ceiling_planned
    else
      ceiling = ceiling_completed
    end
    year[:ceiling] = (ceiling/60.0/60.0/10.0).ceil*60*60*10
    return year
  end


  def friend_hours(date)
    friends = Friendship.athletes(self.id)
    friends << User.find(self.id)
    friend_hours = []
    date1 = date.beginning_of_week(:monday)
    friends.each do |friend|
      minutes = LogEntry.total_hours(date1, friend.id)
      unless minutes == 0
      friend_hours << [(friend.first_name+" "+friend.last_name),  minutes, friend.id, nil]
      end
    end

    friend_hours = friend_hours.sort {|a,b| b[1] <=> a[1]}
    friend_hours.each do |friend|
      index = friend_hours.index(friend)

      if friend_hours[index][3] == nil
        friend_hours[index][3] = index + 1
        i = index
        while i < friend_hours.size - 1 do

          if friend_hours[index][1] == friend_hours[i + 1][1]
            friend_hours[i + 1][3] = index + 1
            if friend_hours[i+1][2] == self.id
              friend_hours.insert(index, friend_hours.delete_at(i+1))
            end
          end


            i+= 1
        end
      end
    end
    return friend_hours
  end

  def friend_hours_mobile(date)
    friends = Friendship.athletes(self.id)
    friend_hours = []
    date1 = date.beginning_of_week(:monday)
    friend_hours << [(self.first_name+" "+self.last_name),  LogEntry.total_hours(date1, self.id), self.id, nil]
    friends.each do |friend|
      minutes = LogEntry.total_hours(date1, friend.id)
      unless minutes == 0
      friend_hours << [(friend.first_name+" "+friend.last_name),  minutes, friend.id, nil]
      end
    end

    friend_hours = friend_hours.sort {|a,b| b[1] <=> a[1]}
    friend_hours.each do |friend|
      index = friend_hours.index(friend)

      if friend_hours[index][3] == nil
        friend_hours[index][3] = index + 1
        i = index
        while i < friend_hours.size - 1 do

          if friend_hours[index][1] == friend_hours[i + 1][1]
            friend_hours[i + 1][3] = index + 1
            if friend_hours[i+1][2] == self.id
              friend_hours.insert(index, friend_hours.delete_at(i+1))
            end
          end


            i+= 1
        end
      end
    end
    return friend_hours
  end

end
