class CreateClipings < ActiveRecord::Migration[5.2]
  def change
    create_table :clipings do |t|
      t.integer :plan_id
      t.integer :log_entry_id

      t.timestamps
    end
  end
end
