class AnnualTrainingPlan < ActiveRecord::Base
  #attr_accessible :start_year, :total_planned_hours, :user_id, :month_hours, :id
  belongs_to :user
  scope :atp_for_year, lambda { |date1| where('start_year = ?', date1)}


end
