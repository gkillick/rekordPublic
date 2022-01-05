class AddCommentsToPreferences < ActiveRecord::Migration[5.2]
  def change
    add_column :preferences, :comments, :boolean
  end
end
