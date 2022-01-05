class AddLogEntryIdToWorkouts < ActiveRecord::Migration[5.2]
  def self.up
    add_column :workouts, :log_entry_id, :integer
  end

  def self.down
        remove_column :workouts, :log_entry_id
  end
end
