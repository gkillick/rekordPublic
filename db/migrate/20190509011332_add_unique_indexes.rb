class AddUniqueIndexes < ActiveRecord::Migration[5.2]
  def change
    #remove_index :log_entries, :athlete_id
    #remove_index :log_entries, :date
    remove_index :planned_workouts, :workout_id
    remove_index :completed_workouts, :workout_id
    add_index :log_entries, [:athlete_id, :date], unique: true
    add_index :planned_workouts, :workout_id, unique: true
    add_index :completed_workouts, :workout_id, unique: true
  end
end
