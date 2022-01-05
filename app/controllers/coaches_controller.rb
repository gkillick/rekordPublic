class CoachesController < ApplicationController
    before_action :authenticate_user!


  def update
    @user = current_user
    @user.update_attributes(params[:coach])
  end


  def index
    ajax = params[:ajax]
    @user = current_user
    @coach = current_user
    @preferences = @coach.preferences
    @athletes = Friendship.athletes(@coach.id)
    @plans = @coach.plans.order("created_at DESC")
    if @plans.size > 0
    @intensity_plan = @plans.first.zones
  else
    @intensity_plan = [0,0,0,0,0]
  end

    @workouts = @coach.recent_workouts
    @feel = @coach.average_feel(31)
    @sleep_quality = @coach.average_sleep(31)
    #@average_load = @coach.average_load(365)
    @feel_list = @coach.individual_feel
    if ajax == "true"
      render :partial => "dashboard"
    end
  end





  def get_name
    @coach = current_user
    @friends = @coach.friends + @coach.inverse_friends
    @name = params[:name]
    @search_names = []
    @friends.each do |friend|
      if @name.length < 4
        if friend.first_name.downcase.first(@name.length).include?(@name.downcase)
          @search_names << friend
        elsif friend.last_name.downcase.first(@name.length).include?(@name.downcase)
          @search_names << friend
        end
      elsif friend.first_name.downcase.include?(@name.downcase)
        @search_names << friend
      elsif friend.last_name.downcase.include?(@name.downcase)
        @search_names << friend
      elsif (friend.first_name + " " + friend.last_name).downcase.include?(@name.downcase)
        @search_names << friend
      end

    end
    if @name.downcase == "all"
      @search_names = []
      @friends.each do |friend|
        @search_names << friend
      end
    end
    if @name ==  "null"
      @search_names = []
    end

    render :layout => false

  end


end
