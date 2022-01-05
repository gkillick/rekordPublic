class CreatePreferences < ActiveRecord::Migration[5.2]
  def change
    create_table :preferences do |t|
      t.integer :user_id
      t.boolean :side_bar
      t.boolean :athlete_toggle

      t.timestamps
    end
  end
end
