class AddChartRangeToPreferences < ActiveRecord::Migration[5.2]
  def change
    add_column :preferences, :chart_range, :string, :null => false, :default => "week"
  end
end
