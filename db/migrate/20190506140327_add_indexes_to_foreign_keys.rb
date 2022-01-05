class AddIndexesToForeignKeys < ActiveRecord::Migration[5.2]
  def change
    add_index :annual_training_plans, :user_id

    add_index :completed_workouts, :workout_id

    add_index :log_entries, :athlete_id

    add_index :messages, :user_id

    add_index :month_totals, :athlete_id

    add_index :planned_workout_times, :planned_workout_id

    add_index :planned_workouts, :workout_id

    add_index :plans, :user_id

    add_index :workout_times, :completed_workout_id
    
    add_index :workouts, :log_entry_id

  end
end
