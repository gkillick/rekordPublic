class User < ActiveRecord::Base
  self.inheritance_column = 'user_type'
  has_many :annual_training_plans
  has_many :plans
  has_one :preferences
  has_many :friendships
  #has_many :friends, :through => :friendships, :conditions => "status = 'accepted'"
  has_many :friends, -> { where(friendships: {status: 'accepted'}) }, :through => :friendships
  has_many :inverse_friendships, :class_name => "Friendship", :foreign_key => "friend_id"
  #has_many :inverse_friends, :through => :inverse_friendships, :source => :user, :conditions => "status = 'accepted'"
  has_many :inverse_friends, -> { where(friendships: {status: 'accepted'}) }, :through => :inverse_friendships, :source => :user
  has_many :friendship_permissions, :dependent => :destroy
  has_many :messages, :dependent => :destroy
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable, :lockable and :timeoutable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :trackable, :validatable

  after_create :default_preferences





  scope :search_like, lambda { |search| where('LOWER(first_name) LIKE ? OR LOWER(last_name) LIKE ? OR LOWER(email) LIKE ?', "%#{search}%", "%#{search}%", "%#{search}%")}
  scope :filter_user, lambda { |name| where('id <> ?', name)}



  def default_preferences
    self.create_preferences(side_bar: true, athlete_toggle: true, color_workouts: "on", comments: true)
  end

  def accepted_friendships
    friendships = self.inverse_friendships.accepted() + self.friendships.accepted()
  end


  def self.search(search,current_user)
    if search
      if search != ""
        search_like(search.downcase).filter_user(current_user).limit(5)
      else
        []
      end
    else
      []
    end
  end
  def friend_with(user_id,friend_id)
    if Friendship.find_friend(user_id,friend_id)
      Friendship.find_friend(user_id,friend_id)
    end
  end
  def hours(duration)
    start_date = Date.today - duration.days
    user = User.find(self.id)
    hours = {}
    entries = user.log_entries.log_entry_between_dates(start_date, Date.today)
    minutes_total = 0
    entries.each do |entry|
      if hours[entry.date] == nil
        hours[entry.date] = 0
      end
      hours[entry.date] += entry.total_minutes
      minutes_total += entry.total_minutes
    end
    hours["total_minutes"] = minutes_total
    return hours
  end
  def feel(duration)
    start_date = Date.today - duration.days
    user = User.find(self.id)
    feel = {}
    entries = user.log_entries.log_entry_between_dates(start_date, Date.today)
    entries.each do |entry|
      unless entry.feel == nil
          feel[entry.date] = entry.feel
      end
    end

  feel = feel.map {|k, v| [k.to_time.in_time_zone('UTC').beginning_of_day.to_i*1000, v] }
  sorted = feel.sort { |x,y| x[0] <=> y[0] }
  return sorted
  end

  def sleep(duration)
    start_date = Date.today - duration.days
    user = User.find(self.id)
    sleep = {}
    entries = user.log_entries.log_entry_between_dates(start_date, Date.today)
    entries.each do |entry|
      unless entry.sleep_quality == nil
          sleep[entry.date] = entry.sleep_quality
      end
    end

  sleep = sleep.map {|k, v| [k.to_time.in_time_zone('UTC').beginning_of_day.to_i*1000, v] }
  sorted = sleep.sort { |x,y| x[0] <=> y[0] }
  return sorted
  end

end
