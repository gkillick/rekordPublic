class FixWorkoutTimeColumnName < ActiveRecord::Migration[5.2]
  def self.up
    rename_column :workout_times, :workout_id, :completed_workout_id
  end

  def self.down
  end
end
