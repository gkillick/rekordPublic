class CreateWorkoutTimes < ActiveRecord::Migration[5.2]
  def self.up
    create_table :workout_times do |t|
      t.integer :duration
      t.integer :zone
      t.integer :workout_id

      t.timestamps
    end
  end

  def self.down
    drop_table :workout_times
  end
end
