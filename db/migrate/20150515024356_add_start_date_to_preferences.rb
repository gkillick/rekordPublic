class AddStartDateToPreferences < ActiveRecord::Migration[5.2]
  def change
    add_column :preferences, :start_date, :date
  end
end
