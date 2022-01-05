class AddRestToWorkoutTimes < ActiveRecord::Migration[5.2]
  def change
    add_column :workout_times, :rest, :integer
  end
end
