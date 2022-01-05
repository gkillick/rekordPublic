class CreateWorkouts < ActiveRecord::Migration[5.2]
  def self.up
    create_table :workouts do |t|
      t.string :activity

      t.timestamps
    end
  end

  def self.down
    drop_table :workouts
  end
end
