class AddColumnsToCompletedTimes < ActiveRecord::Migration[5.2]
  def self.up
    add_column :workout_times, :multiplier, :integer
    add_column :workout_times, :sub_duration, :integer
  end

  def self.down
    remove_column :workout_times, :multiplier
    remove_column :workout_times, :sub_duration
  end
end
