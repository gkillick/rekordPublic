class CreateLogEntries < ActiveRecord::Migration[5.2]
  def self.up
    create_table :log_entries do |t|
      t.date :date
      t.integer :athlete_id
      t.integer :feel

      t.timestamps
    end
  end

  def self.down
    drop_table :log_entries
  end
end
