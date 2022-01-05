class FriendshipPermission < ActiveRecord::Base
  belongs_to :friendship
  belongs_to :user
  #attr_accessible :edit_training, :friend_id, :friendship_id, :limited_view, :user_id, :view_training


end
