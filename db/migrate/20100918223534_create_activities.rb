class CreateActivities < ActiveRecord::Migration[5.2]
  def self.up
    create_table :activities do |t|
      t.string :activity

      t.timestamps
    end
  end

  def self.down
    drop_table :activities
  end
end
