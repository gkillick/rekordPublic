class Plan < ActiveRecord::Base
  has_many :taggings
  has_many :tags, :through => :taggings
  belongs_to :user
  has_many :clippings
  has_many :log_entries, :through => :clippings, :dependent => :destroy
  #attr_accessible :user_id, :name, :description
  before_save :not_labeled

  scope :by_coach, ->(coach_id) { where("user_id = ?", coach_id) }


  def not_labeled
   if self.name == "label.." || self.name == ""
     self.name = nil
   end
   if self.description == "add.." || self.description == ""
      self.description = nil
    end
  end

  def planned_minutes_zone
    zone_totals = {}
    entries = self.log_entries
    entries.each do |entry|
      zone_totals = entry.total_zone_minutes_planned(zone_totals)
    end
    return zone_totals
  end




  def zones
    zones = [0,0,0,0,0]
    n = 0
    self.log_entries.each do |entry|
      entry.workouts.each do |workout|
        workout.planned_workouts.each do |planned_workout|
          planned_workout.planned_workout_times.each do |workout_time|
            zones[workout_time.zone-1] += workout_time.duration

          end
        end
      end
    end

    return zones
  end
  def self.tagged_with(tag)
    Tag.find_by_name!(name).plans
  end
  def self.search_plans(search,user_id)
    plans = Plan.by_coach(user_id)
    searches = search.split('_')
    plan_relivance = []
    search_score = {}
    plans.each do |plan|
      relivance = 0
      if plan.name == nil
        names = []
      else
        names = plan.name.downcase.split(' ')
      end
      tags = plan.tags
      searches.each do |search|
        searched = false
        names.each do |name|
          if name.start_with?(search.downcase)
            relivance += 3
            searched = true
          end
        end
        tags.each do |tag|
          if tag.name.start_with?(search.downcase)
            relivance += 1
            searched = true
          end
        end
        if searched == false
          search_score[plan.id] = false
        end
        searched = false
      end
      if relivance > 0
        if search_score[plan.id] == nil
          plan_relivance << [plan.id,relivance]
        end
      end

    end
    plan_relivance = plan_relivance.reverse
    plan_relivance = plan_relivance.sort_by { |relivance| relivance[1] }
    searched_plans = []
    plan_relivance.each do |relivance|
      searched_plans << Plan.find(relivance[0])
    end
    searched_plans = searched_plans.reverse
    return searched_plans[0..5]

  end
  def end_dates
    clippings = self.clippings
    dates = []
    clippings.each do |clip|
      entry = LogEntry.find(clip.log_entry_id)
      unless entry.date == nil
      dates << entry.date
      end
    end
    start_date = dates.min
    end_date = dates.max
    return [start_date,end_date]
  end

  def athlete
    athlete_id = LogEntry.find(self.clippings.first.log_entry_id).athlete_id
    return Athlete.find(athlete_id)
  end
  def minutes
    clippings = self.clippings
    total_minutes = 0
    clippings.each do |clip|
      entry = LogEntry.find(clip.log_entry_id)
      total_minutes += entry.total_minutes_planned()
    end
    return total_minutes
  end

  #fix weird duplicate problem with plans
  def fix_duplicates
    entries = self.log_entries
    dates = []
    entries.each do |entry|
      unless dates.include? entry.date
        dates << entry.date
      end
    end
    dates.each do |date|
      duplicate_entries = entries.where(:date => date)
      if duplicate_entries.size > 1
        original = duplicate_entries.first
        duplicate_entries.each do |duplicate|
          unless duplicate.id == original.id
            duplicate.workouts.each do |workout|
              workout.log_entry_id = original.id
              workout.save
            end
          end
        end
      end
    end
    entries.each do |entry|
      if entry.workouts.size == 0
        entry.destroy
      end
    end
  end
end
