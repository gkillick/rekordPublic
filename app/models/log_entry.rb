class LogEntry < ActiveRecord::Base
  has_many :clippings, :dependent => :destroy
  has_many :plans, :through => :clippings
  has_many :workouts, :dependent => :destroy
  accepts_nested_attributes_for :workouts
  belongs_to :athlete
  default_scope {order('date ASC')}
  scope :log_entry_between_dates, lambda { |date1, date2| where('date >= ? and date <= ?', date1, date2)}
  scope :log_entry_for_date, lambda { |date1| where('date = ?', date1)}
  scope :log_entry_for_athlete, lambda { |athlete_id| where(:athlete_id => athlete_id)}
  scope :recent_entries, lambda { where('date >= ?', (Date.today - 2.weeks))}
  scope :past_entries, lambda { where('date <= ?', Date.today)}
  validates :date, presence: true

  amoeba do
    enable
    exclude_field :plans
    exclude_field :clippings
  end
  def total_zones

    total_completed = {}
    total_planned = {}
    self.workouts.each do |workout|
      total_completed = workout.total_completed_zones.merge!(total_completed) { |k, o, n| o + n }
      total_planned = workout.total_planned_zones.merge!(total_planned) { |k, o, n| o + n }
    end
    total_zones = {completed: total_completed, planned: total_planned}
    return total_zones
  end
  def self.entries_for_athletes(athlete_ids)
    entries = []
    athlete_ids.each do |athlete_id|
      log_entry_for_athlete(athlete_id).recent_entries.past_entries.each do |entry|
        entries << entry
      end
    end
    workouts = []
    entries = entries.sort_by &:updated_at
    entries.each do |entry|
      entry.workouts.each do |workout|
        workouts << workout
      end
    end
    workouts = workouts.sort_by &:updated_at
    workouts = workouts.sort { |x,y| x.log_entry.date <=> y.log_entry.date }
    return workouts.reverse


  end
  def self.cal_entry(date, athlete_id)
    log_entry_for_date(date).log_entry_for_athlete(athlete_id).includes({:workouts => {:completed_workouts => :workout_times}})
  end
  def self.cal_entry_only(date, athlete_id)
    log_entry_for_date(date).log_entry_for_athlete(athlete_id)
  end

  def self.date_pull(start_date, end_date, athlete_id)
    log_entry_between_dates(start_date, end_date).log_entry_for_athlete(athlete_id).includes({:workouts => {:completed_workouts => :workout_times}})
  end
  def self.log_entry_pull(start_date, end_date, athlete_id)
    log_entry_between_dates(start_date, end_date).log_entry_for_athlete(athlete_id)
  end

  def total_intensity_planned
    total_intensity = 0
    self.workouts.each do |workout|
      workout.planned_workouts.each do |planned_workout|
        planned_workout.planned_workout_times.each do |p_workout_time|
          unless p_workout_time.duration == nil
            if p_workout_time.zone > 1
              total_intensity += p_workout_time.duration
            end
          end
        end
      end
    end
    return total_intensity
  end
  def total_intensity_completed
    total_intensity = 0
    self.workouts.each do |workout|
      workout.completed_workouts.each do |completed_workout|
        completed_workout.workout_times.each do |c_workout_time|
          unless c_workout_time.duration == nil
            if c_workout_time.zone > 1
              total_intensity += c_workout_time.duration
            end
          end
        end
      end
    end
    return total_intensity
  end
  def total_zone_minutes_planned(zone_hash)
    total_zone_minutes = zone_hash
    workouts = self.workouts
    workouts.each do |workout|
      planned_workouts = workout.planned_workouts
      planned_workouts.each do |planned_workout|
        planned_workout.planned_workout_times.each do |p_workout_time|
          unless p_workout_time.duration == nil
            if total_zone_minutes[p_workout_time.zone] == nil
              total_zone_minutes[p_workout_time.zone] = p_workout_time.duration
            else
              total_zone_minutes[p_workout_time.zone] += p_workout_time.duration
            end
          end
        end
      end
    end
    return total_zone_minutes
  end


# this method will check whether the date is from the current month or not and will return the class name acccordingly.
  def self.get_class_name(date)
    (date.to_date.strftime("%m").to_i == Time.now.month.to_i)?("day_title"):("last_day_title")
  end

  def self.total_hours(date, athlete_id)
    total = 0
    days = log_entry_between_dates(date, (date + 6.days)).log_entry_for_athlete(athlete_id).includes({:workouts => {:completed_workouts => :workout_times}})
    days.each do |day|
      workouts = day.workouts
      workouts.each do |workout|
        completed_workouts = workout.completed_workouts
        completed_workouts.each do |completed_workout|
        total += completed_workout.total_minutes
      end
    end
    end
    return total
  end

  def total_minutes
    total_minutes = 0
    workouts = self.workouts
    workouts.each do |workout|
      total_minutes += workout.total_completed
    end
    return total_minutes
  end
  def total_minutes_planned
    total_minutes = 0
    workouts = self.workouts
    workouts.each do |workout|
      total_minutes += workout.total_planned
    end
    return total_minutes
  end

  def workout_attributes=(workout_attributes)
    workout_attributes.each do |attributes|
      completed_workouts.build(attributes)
    end
  end

  #for the donut graph grab the total minutes as well as the sport and place in an array
  def sport_time
    activity_times = {}
    workouts = self.workouts
    workouts.each do |workout|
      total_minutes_sport = workout.total_completed
      activity = workout.activity_id
      unless activity == nil
      if activity_times[activity] == nil
        activity_times[activity.to_s] = total_minutes_sport
      else
        activity_times[activity.to_s] += total_minutes_sport
      end
      end
    end
    return activity_times
  end

  def self.sport_times_between_dates(athlete_id,start_date,end_date)
    sport_times = {}
    entries = log_entry_between_dates(start_date, end_date).log_entry_for_athlete(athlete_id).includes({:workouts => {:completed_workouts => :workout_times}})
    entries.each do |entry|
      entry_times = entry.sport_time
      entry_times.each do |time|
        if sport_times[time[0]] == nil
          sport_times[time[0]] = time[1]
        else
          sport_times[time[0]] += time[1]
        end
      end
    end

    return sport_times.to_a.sort_by{|k|k[1]}.reverse
  end
  def self.get_hours(athlete_id,days,start_date,end_date)
    entries = LogEntry.date_pull(end_date,start_date,athlete_id)
    minutes_load = {}
    entries.each do |entry|
      total_completed = entry.total_minutes
      total_planned = entry.total_minutes_planned
      array_hours = [total_completed,total_planned]
      minutes_load[entry.date] = array_hours
    end
    return minutes_load


  end


end
