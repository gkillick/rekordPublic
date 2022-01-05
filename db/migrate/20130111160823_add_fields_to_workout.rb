class AddFieldsToWorkout < ActiveRecord::Migration[5.2]
  def self.up
    add_column :workouts, :time_of_day, :string
    add_column :workouts, :activity_id, :string
    remove_column :completed_workouts, :time_of_day
    remove_column :completed_workouts, :activity_id

  end

  def self.down
    remove_column :workouts, :time_of_day, :string
    remove_column :workouts, :activity_id, :string
    add_column :completed_workouts, :time_of_day, :string
    add_column :completed_workouts, :activity_id, :string
  end
end
