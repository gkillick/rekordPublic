class PlannedWorkout < ActiveRecord::Base
  attr_accessor :total_minutes
  belongs_to :workout
  has_many :planned_workout_times, :dependent => :destroy
  accepts_nested_attributes_for :planned_workout_times, :allow_destroy => true
  validates :workout_id, uniqueness: true
  def total_minutes
    self.total_minutes = planned_workout_times.sum(:duration)
  end
  amoeba do
    enable
  end
end
