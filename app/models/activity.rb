class Activity < ActiveRecord::Base
  has_and_belongs_to_many :sports
  validates_uniqueness_of :name
end
