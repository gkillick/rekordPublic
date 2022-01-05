class FixColumnPWorkoutName < ActiveRecord::Migration[5.2]
  def self.up
        rename_column :planned_workouts, :log_entry_id, :workout_id
  end

  def self.down
        rename_column :planned_workouts, :workout_id, :log_entry_id
  end
end
