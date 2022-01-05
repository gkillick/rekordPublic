class ChangeActivitiesColumnPreferencesToText < ActiveRecord::Migration[5.2]
  def up
      change_column :preferences, :activities, :text
  end
  def down
      # This might cause trouble if you have strings longer
      # than 255 characters.
      change_column :preferences, :activities, :string
  end
end
