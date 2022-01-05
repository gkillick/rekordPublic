class CreateFriendshipPermissions < ActiveRecord::Migration[5.2]
  def change
    create_table :friendship_permissions do |t|
      t.integer :friendship_id
      t.integer :user_id
      t.integer :friend_id
      t.boolean :view_training
      t.boolean :limited_view
      t.boolean :edit_training

      t.timestamps
    end
  end
end
