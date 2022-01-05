class Workout < ActiveRecord::Base
  attr_accessor :intensity
  belongs_to :log_entry
  has_many :completed_workouts, :dependent => :destroy
  has_many :planned_workouts, :dependent => :destroy
  has_many :messages, :dependent => :destroy
  accepts_nested_attributes_for :completed_workouts
  accepts_nested_attributes_for :planned_workouts
  accepts_nested_attributes_for :messages
  default_scope {order('time ASC', 'id ASC')}

  amoeba do
    enable
  end
  def is_empty_workout
    empty = true
    if self.messages.size > 0
      empty = false
    end
    self.completed_workouts.each do |completed_workout|
      if completed_workout.summary != nil || completed_workout.workout_times.size > 0
        empty = false
      end
    end
    self.planned_workouts.each do |planned_workout|
      if planned_workout.instructions != "" || planned_workout.planned_workout_times.size > 0
        empty = false
      end
    end
    return empty
  end
  def total_completed_zones
    zones = {}
    if self.completed_workouts.first != nil
    self.completed_workouts.first.workout_times.each do |workout_time|
      if zones[workout_time.zone] == nil
        zones[workout_time.zone] = workout_time.duration
      else
        zones[workout_time.zone] = zones[workout_time.zone] += workout_time.duration
      end
    end
    end
    return zones
  end
  def total_planned_zones
    zones = {}
    if self.planned_workouts.first != nil
    self.planned_workouts.first.planned_workout_times.each do |workout_time|
      if zones[workout_time.zone] == nil
        zones[workout_time.zone] = workout_time.duration
      else
        zones[workout_time.zone] = zones[workout_time.zone] += workout_time.duration
      end
    end
    end
    return zones
  end

  def has_intensity
    intensity = false
    unless self.completed_workouts.first == nil
    if self.completed_workouts.first.workout_times.where('zone > ?', 1).size > 0
      intensity = true
    else
      intensity = false
    end
    end
    unless self.planned_workouts.first == nil
      if self.planned_workouts.first.planned_workout_times.where('zone > ?', 1).size > 0
        intensity = true
      end
    end
    return intensity

  end
  def self.total_completed(id)
    total = 0
    entry = Workout.find(id)
    entry.completed_workouts.each do |workout|
      workout.workout_times.each do |time|
        total += time.duration
      end
    end

    return total
  end
  def total_completed
    total = 0
    self.completed_workouts.each do |workout|
      workout.workout_times.each do |time|
        unless time.duration == nil
          total += time.duration
        end
      end
    end
    return total
  end
  def total_planned
    total = 0
    self.planned_workouts.each do |planned_workout|
      planned_workout.planned_workout_times.each do |time|
        unless time.duration == nil
          total += time.duration
        end
      end
    end
    return total
  end
  def self.total_planned(id) #find where used and change syntax
    total = 0
    entry = Workout.find(id)
    entry.planned_workouts.each do |planned_workout|
      planned_workout.planned_workout_times.each do |time|
        total += time.duration
      end
    end
    return total
  end
  def self.instructions(id)
    entry = Workout.find(id)
    instructions = entry.planned_workouts.first.instructions
    return instructions
  end
  def self.intensities(id)
    entry = Workout.find(id)
    intensities = entry.completed_workouts.first.workout_times.where('zone > ?', 1)
    return intensities
  end
  def self.planned_intensities(id)
    entry = Workout.find(id)
    intensities = entry.planned_workouts.first.planned_workout_times.where('zone > ?', 1)
    return intensities
  end

  #fix AM PM to integer
  def self.convert_am_pm
    Workout.all.each do |workout|
      if workout.time_of_day == "AM"
        workout.time = 1
      elsif workout.time_of_day == "PM"
        workout.time = 2
      else
        workout.time = 1
      end
      workout.save
    end
  end

  #calculate effort level

  def effort_level
    total_compeleted = self.total_completed
    total_planned = self.total_planned
    if total_completed == 0
      total_time = total_planned
    else
      total_time = total_compeleted
    end
    short_workout = 0
    long_workout = 14400

    if total_time <= short_workout
      percentage = 0
    elsif total_time >= long_workout
      percentage = 100
    else
      percentage = ((total_time - short_workout).to_f/(long_workout - short_workout).to_f*100).to_i
    end
    return percentage

    return total_zones
  end

end
