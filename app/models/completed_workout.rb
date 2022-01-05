class CompletedWorkout < ActiveRecord::Base
  attr_accessor :total_minutes
  belongs_to :workout
  has_many :workout_times, :dependent => :destroy
  accepts_nested_attributes_for :workout_times, :allow_destroy => true
  validates :workout_id, uniqueness: true
  def total_minutes
    self.total_minutes = workout_times.sum(:duration)
  end
  amoeba do
    enable
  end
end
