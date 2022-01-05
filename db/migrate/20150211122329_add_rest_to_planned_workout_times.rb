class AddRestToPlannedWorkoutTimes < ActiveRecord::Migration[5.2]
  def change
    add_column :planned_workout_times, :rest, :integer
  end
end
