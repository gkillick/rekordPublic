class Tag < ActiveRecord::Base
  #attr_accessible :name, :user_id
  has_many :taggings, :dependent => :destroy
  has_many :plans, :through => :taggings
end
