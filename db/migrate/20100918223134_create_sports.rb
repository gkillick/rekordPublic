class CreateSports < ActiveRecord::Migration[5.2]
  def self.up
    create_table :sports do |t|
      t.string :sport

      t.timestamps
    end
  end

  def self.down
    drop_table :sports
  end
end
