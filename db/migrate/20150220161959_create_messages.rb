class CreateMessages < ActiveRecord::Migration[5.2]
  def change
    create_table :messages do |t|
      t.integer :user_id
      t.text :message
      t.integer :workout_id

      t.timestamps
    end
  end
end
