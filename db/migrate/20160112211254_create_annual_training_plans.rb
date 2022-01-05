class CreateAnnualTrainingPlans < ActiveRecord::Migration[5.2]
  def change
    create_table :annual_training_plans do |t|
      t.integer :start_year
      t.integer :total_planned_hours
      t.integer :user_id

      t.timestamps
    end
  end
end
