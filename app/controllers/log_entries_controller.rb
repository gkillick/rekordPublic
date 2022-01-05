class LogEntriesController < ApplicationController
    before_action :authenticate_user!
    before_action :check_for_mobile

   def new
    @user = current_user
    @preferences = @user.preferences
     @date = Date.parse(params[:date])
     @start_date = params[:calendar_date].to_date
     plan_entry = params[:athlete_id]
     if plan_entry.slice(0,5) == "plan_" #check to see if it is a new entry within a plan
       @plan = Plan.find(plan_entry.split('_')[1])
       if @plan.log_entries.where(:date => @date).size > 0
         @log_entry = @plan.log_entries.where(:date => @date).first
         @new = false
       else
         @log_entry = @plan.log_entries.create(:date => @date)
         @new = true
       end
     else
     @athlete = User.find_by_id(params[:athlete_id])   #this is different in normal controller(non coach)

     if LogEntry.cal_entry(@date, @athlete.id).size == 0 #check to see if entry exists
       @log_entry = @athlete.log_entries.create(:date => @date)
       @new = false
     else
       @new = false                                   #use already existing LogEntry
       @log_entry = LogEntry.cal_entry(@date, @athlete.id).first
     end
     end
     if @log_entry.athlete_id != nil
       @plan_true = false
     else
       @plan_true = true
     end
     @edit = false
     @workout = @log_entry.workouts.create
     @message = @workout.messages.build(:user_id => current_user.id)
     planned_workouts = @workout.planned_workouts.build
     planned_workouts.planned_workout_times.build(:zone => 1)
     completed_workouts = @workout.completed_workouts.build
     completed_workouts.workout_times.build(:zone => 1)
     @messages = @workout.messages
#     @message_users = Hash.new
#     @messages.each do |message|
#       unless message.user_id == nil
#         @message_users[message.user_id] = User.find(message.user_id)
#       end
#     end


respond_to do |format|
  format.js
 end
   end
  def create
    @start_date = Date.today
    @date = params[:log_entry][:date]
    @log_entry = LogEntry.update(params[:log_entry])
    @plan_true = false
    if params[:plan_id] != nil
      Clipping.create(:log_entry_id => @log_entry.id,:plan_id => params[:plan_id])
      @plan_true = true

    end
    @date = @log_entry.date.to_s
    @cal_class = LogEntry.get_class_name(@date)
    respond_to do |format|
      format.html { redirect_to log_entries_path }
      format.js
    end
  end

  def edit
   @user = current_user
   @preferences = @user.preferences
    @workout_id = params[:workout_ref]
    @start_date = params[:calendar_date].to_date
    @workout = Workout.find(@workout_id)
    @log_entry = LogEntry.find(@workout.log_entry_id)
    @message = @workout.messages.build(:user_id => current_user.id)
    @messages = @workout.messages
    if @log_entry.plans.size == 0
      @athlete = User.find(@log_entry.athlete_id)
      @plan_true = false
    else
      @plan = @log_entry.plans.first
      @plan_true = true
    end

    @date = @log_entry.date
    @edit = true


    respond_to do |format|
      format.js
    end
  end

  def update
    @month_stats = nil
    @log_entry = LogEntry.find(params[:id])
    @log_entry.update(log_entry_params)
    @workout_id = params[:workout_id]
    workout = Workout.find(@workout_id)
    @comments = @log_entry.workouts.where(id: @workout_id).first.messages
    @date = @log_entry.date.to_s
    @start_date = params[:calendar_date]
    @plan_true = false
    if params[:plan_id] != nil
      @plan_true = true
      @plan = Plan.find(params[:plan_id])
      @plan_zones = @plan.zones
      @plans = current_user.plans.order("created_at DESC").limit(4)

    else
      @month_stats = Athlete.find(@log_entry.athlete_id).month_stats(@start_date.to_date)
    end




    @first_day_of_cal = @date
    if @date.to_date.wday == 1
      @first_day_of_cal = @date.to_date + 1.day
    end
    @rows = 4
    @cal_class = LogEntry.get_class_name(@date)

    @workout_empty = false
    if workout.is_empty_workout
      workout.destroy
      @workout_empty = true
    end

    respond_to do |format|
      format.html { redirect_to coaches_path }
      format.js
     end



   end

  def destroy
    @coach = current_user
    @log_ids = params[:log_ids]
    @log_ids = @log_ids.split("-")
    @log_ids.each do |log_id|
      @athlete_id = LogEntry.find(log_id).athlete_id
      LogEntry.destroy(log_id)
    end
    @athlete = Athlete.find(@athlete_id)
  #redundant code goes here

  #and ends here
    render nothing: true
  end
  def delete_workout
    @start_date = params[:calendar_date]
    @workout = Workout.find(params[:workout_id])
    @log_entry = LogEntry.find(@workout.log_entry_id)
    plan_id = Clipping.entry(@log_entry.id)
    if plan_id != nil
      @plan = Plan.find(plan_id)
      @plan_true = true
      @plans = current_user.plans.order("created_at DESC").limit(4)
    else
      @plan_true = false
      @plan = nil
      @plan_zones = nil

    end
    athlete_id = @log_entry.athlete_id
    @date = @log_entry.date
    @first_day_of_cal = @date
    if @date.to_date.wday == 1
      @first_day_of_cal = @date.to_date + 1.day
    end

    @rows = 4
    if @log_entry.workouts.size == 1
      @log_entry.destroy
    else
      @workout.destroy
    end
    if @plan_true
      @plan_zones = @plan.zones
    end
    @month_stats = nil
    if athlete_id != nil
      @month_stats = Athlete.find(athlete_id).month_stats(@start_date.to_date)
    end


  end


  def get_month
    athlete = User.find(params[:athlete_id])
    date = params[:date]
    @hours_completed_zone_1 = athlete.completed_hours_month(date,1)
    @hours_completed_intensity = athlete.completed_hours_month(date,"intensity")
    @total_hours = @hours_completed_zone_1[0] + @hours_completed_intensity[0]
    @zone_totals = athlete.zone_totals_month(date)
    render :layout => false
  end

  def graph

    @coach = current_user
    @athlete = User.find(params[:athlete_id])
    @athletes = Friendship.athletes(@coach.id)
    @year = params[:start_year]
    coach = false
    @athletes.each do |athlete|
      if athlete.id == @athlete.id
        coach = true
      end
    end
    if @athlete.id == @coach.id
      coach = true
    end
    if coach == true
      @feel = @athlete.feel(7)
      @sleep_quality = @athlete.sleep(7)
      if @coach.preferences.start_date != nil
        @start_date = @coach.preferences.start_date
      else
        @start_date = "Wed, 01 Apr 2015"
      end
      @start_date = @start_date.to_date().change(:year => @year.to_i)
      @year_totals = @athlete.year_hours_total(@year.to_i)
      feel_and_change = @athlete.seven_day_feel
      @difference = feel_and_change.last
      feel_and_change.pop
      @seven_day_feel = feel_and_change
      @today = Date.today
      @one_year = Date.today - 1.year
      @sport_times = LogEntry.sport_times_between_dates(@athlete.id,@start_date,@start_date + 1.year) #speed up
      if Date.today.wday == 1
        @date1 = Date.today
      else
        @date1 = Chronic::parse('last monday').to_date
      end
      date2 = @date1 + 7.days
      @week_load = LogEntry.get_hours(@athlete.id,7,date2,@date1)
      @longest_time = 0.0
      @week_load.each do |k, v|
        if @longest_time > v[0]
        else
          @longest_time = v[0]
        end
        if @longest_time > v[1]
        else
          @longest_time = v[1]
        end
      end
      @longest_time = (@longest_time/60.0/60.0).ceil + 1
    end
    @zone_totals_week = @athlete.zone_totals_by_day(@date1,date2)
    @total_planned_week = @athlete.total_planned_by_day(@date1,date2)
    @total_hours_completed_year = 0
    12.times do |n|
      @total_hours_completed_year += @year_totals[(@start_date+n.months).month][:completed][:total]/60
    end
    @annual_training_plan = @athlete.annual_training_plans.atp_for_year(@start_date.year).first
    if @annual_training_plan == nil
      @annual_training_plan = @athlete.annual_training_plans.new
      @annual_training_plan.month_hours = '[0,0,0,0,0,0,0,0,0,0,0,0]'
      @annual_training_plan.start_year = @start_date.year
      @annual_training_plan.total_planned_hours = 0
      @annual_training_plan.user_id = @athlete.id
    end
    if @annual_training_plan.month_hours == " " || @annual_training_plan.month_hours == "" || @annual_training_plan.month_hours == nil
      @annual_training_plan.month_hours = '[0,0,0,0,0,0,0,0,0,0,0,0]'
    end
    render :layout => false

  end

  def graph_mobile
    @athlete = User.find(params[:athlete_id])
    #upgrade to rails 5 and remove
    start_date = @athlete.preferences.start_date
    if start_date == nil
      start_date = ("April 1st 2016").to_date
    end
    if Date.today - start_date.change(:year => Time.now.year) >= 0
      @year = Date.today.year
    else
      @year = Date.today.year - 1
    end
    @leaderboards = []
    @leaderboards << @athlete.friend_hours_mobile(Date.today)
    @leaderboards << @athlete.friend_hours_mobile(Date.today - 1.week)
    @leaderboards << @athlete.friend_hours_mobile(Date.today - 2.week)
    @year_totals = @athlete.year_hours_total(@year)
     @month_stats = @athlete.month_stats(Date.today)
    render :layout => false

  end
  def get_calendar
    @plan_true = false
    @type = current_user.user_type
    @user = current_user
    @coach = current_user
    @friends = @coach.friends + @coach.inverse_friends
    @athlete = User.find(params[:athlete_id])
    @athletes = Friendship.athletes(@coach.id)
    coach = false
    @athletes.each do |athlete|
      if athlete.id == @athlete.id
        coach = true
      end
    end
    if @coach.id == @athlete.id
      coach = true
    end

    if coach == true
    if @type == "Athlete"
         @month_stats = Athlete.find(current_user.id).month_stats((Time.parse(params[:date])).beginning_of_month().to_date)
    end
    @start_date = (Time.parse(params[:date])).beginning_of_month()
    @start_real_date = @start_date.to_date
    if @start_date.wday == 0
      @days_before = 6
    else @days_before = @start_date.wday - 1
    end
    @day_in_past_month = @start_date.ago(1)
    @rows = ((@start_date.end_of_month().day + @days_before)/7.0).ceil
    @last_day_of_month = @start_date.end_of_month()
    @first_day_of_cal = @start_date - (@days_before*24*60*60)
    @last_day_of_cal = @first_day_of_cal + ((7*@rows - 1)*24*60*60)
    @entries = LogEntry.date_pull(@first_day_of_cal.to_date,@last_day_of_cal, @athlete.id)
    @last_month_date = @day_in_past_month - (@days_before -1) *24*60*60
    @this_month_date = @start_date
    @hours = []
    @comments = @athlete.comments(@first_day_of_cal,@last_day_of_cal)
    @rows.times do |row|
      start = @first_day_of_cal - 1.day + (row*7).days
      @hours << LogEntry.total_hours(start, @athlete.id)
    end
  end
  respond_to do |format|

    format.js {render :content_type => 'text/javascript'}
   end


  end

  private
    # Using a private method to encapsulate the permissible parameters
    # is just a good pattern since you'll be able to reuse the same
    # permit list between create and update. Also, you can specialize
    # this method with per-user checking of permissible attributes.
    def log_entry_params
      params.require(:log_entry).permit!
    end


end
