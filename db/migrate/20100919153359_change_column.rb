class ChangeColumn < ActiveRecord::Migration[5.2]
  def self.up
    rename_column :activities, :activity, :name
    rename_column :sports, :sport, :name
  end

  def self.down
  end
end
