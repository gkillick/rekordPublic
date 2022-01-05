class WorkoutTime < ActiveRecord::Base
  include ActiveModel::Dirty
  belongs_to :completed_workout
  scope :zone, lambda { |zone| where('zone = ?', zone)}
  scope :intensity, lambda {where('zone != ?', "1")}
  amoeba do
    enable
  end

  validate :ensure_duration_is_number
  after_save :adjust_hours

  before_destroy :subtract_hours

  def subtract_hours
    if self.completed_workout_id != nil && self.duration != nil && self.zone != nil

    log_entry = LogEntry.find(Workout.find(CompletedWorkout.find(self.completed_workout_id).workout_id).log_entry_id)
    zone = self.zone - 1
    time = -1 * self.duration_was
    Athlete.find(log_entry.athlete_id).adjust_month_hours(log_entry.date, zone, time)
    end
  end

  def adjust_hours
    log_entry = LogEntry.find(Workout.find(CompletedWorkout.find(self.completed_workout_id).workout_id).log_entry_id)

    previous_time = self.attribute_before_last_save(:duration)
    new_time = self.duration
    previous_zone = self.attribute_before_last_save(:zone)
    new_zone = self.zone

    if previous_time != nil
      time_change = new_time - previous_time
    else
      time_change = new_time
    end

    if previous_zone != new_zone && previous_zone != nil
      Athlete.find(log_entry.athlete_id).adjust_month_hours(log_entry.date, previous_zone - 1, -1*previous_time)
      Athlete.find(log_entry.athlete_id).adjust_month_hours(log_entry.date, new_zone - 1, new_time)
    else
      Athlete.find(log_entry.athlete_id).adjust_month_hours(log_entry.date, self.zone - 1, time_change)
    end
  end

  def ensure_duration_is_number
      if duration == 0 || duration == nil || duration == "0:00"
      self.destroy
    end
    end
end
