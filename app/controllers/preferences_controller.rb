class PreferencesController < ApplicationController
  def set_preferences
    user = current_user
    if user.preferences == nil
      user_preferences = user.create_preferences
    else
      user_preferences = user.preferences
    end

    if params[:side_bar] != "nil"
      if params[:side_bar] == "1"
        user_preferences.side_bar = true
      elsif params[:side_bar] == "0"
        user_preferences.side_bar = false
      end
    end
    if params[:athlete_toggle] != "nil"
      if params[:athlete_toggle] == "1"
        user_preferences.athlete_toggle = true
      elsif params[:athlete_toggle] == "0"
        user_preferences.athlete_toggle = false
      end
    end
    user_preferences.save

    head :ok, content_type: "text/html"
  end
  def set_custom_preference
    user = current_user
    preference = params[:preference]
    value = params[:value]
    if value == "true"
      value = true
    elsif value == "false"
      value = false
    end
    if user.preferences == nil
      user_preferences = user.create_preferences
    else
      user_preferences = user.preferences
    end

    user_preferences.send(preference+"=", value)
    user_preferences.save

    render nothing: true



    #:preference/:value
  end
  def index
    @user = current_user
    @preferences = @user.preferences
    @tab = params[:tab]
    @friends = (@user.friends + @user.inverse_friends).sort_by {|x| [x.first_name, x.last_name]}
    @search_friends = User.search(params[:friends_search],@user.id)
    @frienship_permissions = current_user.friendship_permissions
    @friendships = []
    @search_friends.each do |friend|
      if friend.friend_with(@user.id,friend.id)
        @friendships << friend.friend_with(@user.id,friend.id)
      else
        @friendships << friend.id
      end
    end
    @pending_requests = Friendship.pending_requests(@user.id)
    @pending_friends = []
    @pending_requests.each do |request|
      @pending_friends << User.find(request.user_id)
    end
    render layout: false
  end

  def update
     @preference = Preferences.find(params[:id])
     if params[:preferences][:start_date] != nil
     params[:preferences][:start_date] = params[:preferences][:start_date] + " 2015"
     end
    @preference.update_attributes(preferences_params)
    if params[:preferences][:copy_workouts] != nil || params[:preferences][:color_workouts] != nil
      render layout: false
    else
     render nothing: true
    end
  end

    private
      # Using a private method to encapsulate the permissible parameters
      # is just a good pattern since you'll be able to reuse the same
      # permit list between create and update. Also, you can specialize
      # this method with per-user checking of permissible attributes.
      def preferences_params
        params.require(:preferences).permit!
      end

end
