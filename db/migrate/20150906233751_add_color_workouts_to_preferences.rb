class AddColorWorkoutsToPreferences < ActiveRecord::Migration[5.2]
  def change
    add_column :preferences, :color_workouts, :string
  end
end
