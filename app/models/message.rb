class Message < ActiveRecord::Base
  #attr_accessible :message, :user_id, :workout_id
  belongs_to :workout
  belongs_to :user
  after_save { |message| message.destroy if message.message.blank? }

end
