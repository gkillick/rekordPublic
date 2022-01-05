class CreatePlannedWorkoutTimes < ActiveRecord::Migration[5.2]
  def self.up
    create_table :planned_workout_times do |t|
      t.integer :duration
      t.integer :zone
      t.integer :planned_workout_id

      t.timestamps
    end
  end

  def self.down
    drop_table :planned_workout_times
  end
end
