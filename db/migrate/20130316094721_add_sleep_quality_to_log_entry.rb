class AddSleepQualityToLogEntry < ActiveRecord::Migration[5.2]
  def self.up
    add_column :log_entries, :sleep_quality, :integer
  end
  def self.down
    remove_column :log_entries, :sleep_quality

  end
end
