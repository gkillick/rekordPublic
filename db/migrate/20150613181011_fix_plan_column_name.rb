class FixPlanColumnName < ActiveRecord::Migration[5.2]
  def up
    rename_column :plans, :coach_id, :user_id
  end

  def down
    rename_column :plans, :user_id, :coach_id
  end
end
