class Rename < ActiveRecord::Migration[5.2]
  def up
    rename_table :clipings, :clippings
  end

  def down
    rename_table :clippings, :clipings
  end
end
