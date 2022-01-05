module PreferencesHelper
  def simplify_activities(array)
    new_array = []
    array.each do |activity|
      if activity.class == Array
        new_array << activity[0]
      else
        new_array << activity
      end
    end
    return new_array
  end
  
  def activities_to_array(array)
    new_array = []
    array.each do |activity|
      if activity.class == Array
        new_array << activity
      else
        new_array << [activity]
      end
    end
    return new_array
  end
  

end
