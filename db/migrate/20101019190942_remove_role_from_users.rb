class RemoveRoleFromUsers < ActiveRecord::Migration[5.2]
  def self.up
        remove_column :users, :role
  end

  def self.down
        add_column :users, :role
  end
end
