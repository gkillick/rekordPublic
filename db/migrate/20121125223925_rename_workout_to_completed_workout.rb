class RenameWorkoutToCompletedWorkout < ActiveRecord::Migration[5.2]
  def self.up
    rename_table :workouts, :completed_workouts
  end

  def self.down
    rename_table :completed_workouts, :workouts
  end
end
