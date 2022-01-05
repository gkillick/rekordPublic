class RemoveDurationFromWorkouts < ActiveRecord::Migration[5.2]
  def self.up
    remove_column :workouts, :duration
  end

  def self.down
    add_column :workouts, :duration, :string
  end
end
