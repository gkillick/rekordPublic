class Friendship < ActiveRecord::Base
  belongs_to :user
  belongs_to :friend, :class_name => "User"
  validates_uniqueness_of :user_id, :scope => [:friend_id]
  validate :not_same_friend
  has_many :friendship_permissions, :dependent => :destroy

  scope :accepted, lambda { where('status = ?', "accepted")}

  after_create :default_permissions

  def default_permissions
    2.times do |n|
      permissions = self.friendship_permissions.new
      if n == 0
        permissions.user_id = self.user_id
        permissions.friend_id = self.friend_id
      end
      if n == 1
        permissions.friend_id = self.user_id
        permissions.user_id = self.friend_id
      end
      permissions.view_training = true
      permissions.limited_view = false
      permissions.edit_training = true
      permissions.save
    end
  end

  def not_same_friend
  errors.add(:user_id, "You cant be friends with yourself") if
  user_id == friend_id
  end



   def self.find_friend(user_id,friend_id)
   where('user_id = ? AND friend_id = ? OR user_id = ? AND friend_id = ?', user_id, friend_id, friend_id, user_id).first
  end

  def self.pending_requests(user_id)
    where('friend_id = ? AND status = ?', user_id, "pending")
  end
  def self.friends(user_id)
    where('friend_id = ? OR user_id = ? AND status = ?', user_id, user_id, "accepted")
  end

  def self.athletes(coach_id)
    athletes = []
    friendships = where('(friend_id = ? OR user_id = ?) AND status = ?', coach_id, coach_id, "accepted")
    friendships.each do |friendship|
      if friendship.friend_id == coach_id
        athlete_id = friendship.user_id
      else
        athlete_id = friendship.friend_id
      end
      athlete = User.find(athlete_id)
      if athlete.user_type == "Athlete"
        athletes << athlete
      end

    end
    return athletes
  end

end
