class AddTimeToWorkouts < ActiveRecord::Migration[5.2]
  def change
    add_column :workouts, :time, :integer
  end
end
