class AddMonthHoursToAnnualTrainingPlan < ActiveRecord::Migration[5.2]
  def change
    add_column :annual_training_plans, :month_hours, :string
  end
end
