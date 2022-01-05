class CreateMonthTotals < ActiveRecord::Migration[5.2]
  def change
    create_table :month_totals do |t|
      t.date :start_date
      t.string :time_totals
      t.integer :athlete_id

      t.timestamps
    end
  end
end
