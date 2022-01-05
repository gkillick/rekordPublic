class Coach < User
  #has_and_belongs_to_many :athletes
  has_many :log_entries
  accepts_nested_attributes_for :log_entries

  def recent_workouts
    athletes = Friendship.athletes(self.id)
    athlete_ids = []
    athletes.each do |athlete|
      athlete_ids << athlete.id
    end
    return LogEntry.entries_for_athletes(athlete_ids)

  end
  def individual_feel
    feel = []
    athletes = Friendship.athletes(self.id)
    athletes.each do |athlete|
      seven_feel = athlete.seven_day_feel
      if seven_feel != [0.0]
        seven_feel << Athlete.find(athlete.id)
        feel << seven_feel
      else
        seven_feel.unshift([110])

      end
    end
    feel = feel.sort_by{|k|k[-3][-1]}
    return feel
  end
  def average_feel(duration)
    athletes = Friendship.athletes(self.id)
    average_feel = []
    start_date = Date.today - duration.days
    average_feel = {}
    athletes.each do |athlete|
      entries = athlete.log_entries.log_entry_between_dates(start_date, Date.today)
      entries.each do |entry|
        unless entry.feel == nil
          if average_feel[entry.date] == nil
            average_feel[entry.date] = [entry.feel]
          else
            average_feel[entry.date] << entry.feel
          end
        end
    end
  end
  average_feel.each do |key, array|
    average_feel[key] = (array.sum)/(array.size)
  end
  average_feel = average_feel.map {|k, v| [k.to_time.in_time_zone('UTC').beginning_of_day.to_i*1000, v] }
  sorted = average_feel.sort { |x,y| x[0] <=> y[0] }
  return sorted
  end

  def average_sleep(duration)
    athletes = Friendship.athletes(self.id)
    average_feel = []
    start_date = Date.today - duration.days
    average_feel = {}
    athletes.each do |athlete|
      entries = athlete.log_entries.log_entry_between_dates(start_date, Date.today)
      entries.each do |entry|
        unless entry.sleep_quality == nil
          if average_feel[entry.date] == nil
            average_feel[entry.date] = [entry.sleep_quality]
          else
            average_feel[entry.date] << entry.sleep_quality
          end
        end
    end
  end
  average_feel.each do |key, array|
    average_feel[key] = (array.sum)/(array.size)
  end
  average_feel = average_feel.map {|k, v| [k.to_time.in_time_zone('UTC').beginning_of_day.to_i*1000, v] }
  sorted = average_feel.sort { |x,y| x[0] <=> y[0] }
  return sorted
  end

  def average_load(duration)
    athletes = Friendship.athletes(self.id)
    average_load = []
    current_week_load = []
    start_date = Date.today - duration.days
    if start_date.monday? == false
      start_date = start_date + (8 - start_date.wday).days
    end
    athletes.each do |athlete|
      current_week_load_data = athlete.current_week_load
      if current_week_load_data[0] > 0 || current_week_load_data[1] > 0
        current_week_load << current_week_load_data
      end
      average_load << athlete.average_load(start_date)
    end
    average_volume = 0
    average_intensity = 0
    average_load.each do |load|
      average_volume += load[0]
      average_intensity += load[1]
    end
    current_average_volume = 0
    current_average_intensity = 0
    current_week_load.each do |load|
      current_average_volume += load[0]
      current_average_intensity += load[1]
    end
    if current_average_volume != 0
      current_average_volume = current_average_volume/current_week_load.size
    end
    if current_average_intensity != 0
      current_average_intensity = current_average_intensity/current_week_load.size
    end
    if average_load.size > 0
      totals = [average_volume/average_load.size, average_intensity/average_load.size, current_average_volume, current_average_intensity]
    else
      totals = [0,0,0,0]
    end
    return totals
    end
end
