class PlannedWorkoutTime < ActiveRecord::Base
    belongs_to :planned_workout
    scope :zone, lambda { |zone| where('zone = ?', zone)}
    scope :intensity, lambda {where('zone != ?', "1")}
    validate :ensure_duration_is_number

    def ensure_duration_is_number
        if duration == 0 || duration == nil || duration == "0:00"
        self.destroy
      end
      end
end
