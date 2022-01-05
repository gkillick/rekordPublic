class Dropidfromathletecoaches < ActiveRecord::Migration[5.2]
  def self.up
    remove_column :athletes_coaches, :id
  end

  def self.down
  end
end
