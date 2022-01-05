class Clipping < ActiveRecord::Base
  belongs_to :plan
  belongs_to :log_entry
  #attr_accessible :log_entry_id, :plan_id

  def self.entry(id)
    clipping = Clipping.find_by(log_entry_id: id)
    if clipping != nil
      plan = clipping.plan_id
    else
      plan = nil
    end
    return plan
  end
end
