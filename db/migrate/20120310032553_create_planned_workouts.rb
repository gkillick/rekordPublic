class CreatePlannedWorkouts < ActiveRecord::Migration[5.2]
  def self.up
    create_table :planned_workouts do |t|
      t.integer :log_entry_id
      t.text :instructions
      t.timestamps
    end
  end

  def self.down
    drop_table :planned_workouts
  end
end
