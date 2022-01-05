class Preferences < ActiveRecord::Base
  #attr_accessible :athlete_toggle, :side_bar, :user_id, :start_date, :sport,:activities, :copy_workouts, :color_workouts, :chart_range
  belongs_to :user
  serialize :activities
  before_save :modify_activities

  def modify_activities
    if self.sport == nil

      self.sport = Rails.application.config.sports.first
      self.activities = Rails.application.config.sports_activities[Rails.application.config.sports.first]
    end
    unless self.activities.instance_of? Array
      self.activities = JSON.parse(self.activities)
    end
  end

end
