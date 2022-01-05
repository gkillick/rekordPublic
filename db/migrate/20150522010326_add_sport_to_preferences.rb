class AddSportToPreferences < ActiveRecord::Migration[5.2]
  def change
    add_column :preferences, :sport, :string
  end
end
