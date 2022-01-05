module ActivitiesHelper
  def activities_clean(activities)
    cleaned_activities = []
    activities.each do |activity|
      if activity.kind_of?(Array)
        cleaned_activities << activity[0]
      else
        cleaned_activities << activity
      end
    end
    return cleaned_activities.compact
  end
end
