class AddCopyWorkoutsToPreferences < ActiveRecord::Migration[5.2]
  def change
    add_column :preferences, :copy_workouts, :string
  end
end
