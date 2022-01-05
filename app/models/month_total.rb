class MonthTotal < ActiveRecord::Base
  belongs_to :athlete
  #attr_accessible :athlete_id, :start_date, :time_totals
  serialize :time_totals


end
