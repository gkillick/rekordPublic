class AddActivitiesToPreferences < ActiveRecord::Migration[5.2]
  def change
    add_column :preferences, :activities, :string
  end
end
