class CreatePlans < ActiveRecord::Migration[5.2]
  def change
    create_table :plans do |t|
      t.integer :coach_id
      t.string :name

      t.timestamps
    end
  end
end
