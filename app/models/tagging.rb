class Tagging < ActiveRecord::Base
  belongs_to :tag
  belongs_to :plan
  # attr_accessible :title, :body
end
