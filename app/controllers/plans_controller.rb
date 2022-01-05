class PlansController < ApplicationController
  before_action :authenticate_user!
  def index
    @plan_true = true
    @coach = current_user
    @preferences = @coach.preferences
    @plan = Plan.by_coach(@coach.id).order("created_at DESC").first
    @plans = @coach.plans.order("created_at DESC")
    @no_plan = false
    if @plan != nil
    @plan_zones = @plan.zones
    @entries = @plan.log_entries.where.not(date: [nil, ""])
    else
     @plan_zones = [0,0,0,0,0]
     @no_plan = true
     @entries = []
    end

    if @entries.size > 0
      @start_date = @entries.first.date
      @current_month = @start_date
      @end_date = @entries.last.date
    else
      @start_date = Date.today
      @current_month = @start_date
      @end_date = Date.today
    end

    @start_date = @start_date.beginning_of_month() - 6.months
    @start_real_date = @start_date.to_date
    if @start_date.wday == 0
      @days_before = 6
    else @days_before = @start_date.wday - 1
    end
    @day_in_past_month = @start_date.ago(1)
      #total number of days between start_date and 1month passed end_date + days before
    @rows =  (((@end_date - @start_date) + (@end_date.end_of_month() - @end_date) + ((@end_date.end_of_month()+ 6.months) - @end_date.end_of_month()) + @days_before)/7.0).ceil
    @last_day_of_month = @start_date.end_of_month()
    @first_day_of_cal = @start_date - (@days_before).days
    @last_day_of_cal = @first_day_of_cal + ((7*@rows - 1)*24*60*60)
    @last_month_date = @day_in_past_month - (@days_before -1) *24*60*60
    @this_month_date = @start_date

  respond_to do |format|
     format.js
   end
  end
  def new
    @plan_true = true
    @coach = current_user
    @log_ids = params[:log_ids]
    @log_ids = @log_ids.split("-")
    @new_log_ids = []
    @log_ids.each do |id|
      new_entry = LogEntry.find(id).amoeba_dup
      new_entry.athlete_id = nil
      new_entry.save
      @new_log_ids << new_entry.id
    end

    @plan = @coach.plans.create()
    @new_log_ids.each do |log_id|
      @plan.clippings.create(log_entry_id: log_id)
    end
    @plans = []
    @plans << @coach.plans.last

    render :layout => false
  end
  def make_plan
    @coach = current_user
    @user = current_user
    @plan = @user.plans.create()
    @plan_zones = @plan.zones
    @start_date = Date.today
    @current_month = @start_date
    @end_date = Date.today
    @start_date = @start_date.beginning_of_month() - 6.months
    if @start_date.wday == 0
      @days_before = 6
    else @days_before = @start_date.wday - 1
    end
    @day_in_past_month = @start_date.ago(1)
    @rows =  (((@end_date - @start_date) + (@end_date.end_of_month() - @end_date) + ((@end_date.end_of_month()+ 6.months) - @end_date.end_of_month()) + @days_before)/7.0).ceil
    @last_day_of_month = @start_date.end_of_month()
    @first_day_of_cal = @start_date - (@days_before).days
    @last_day_of_cal = @first_day_of_cal + ((7*@rows - 1)*24*60*60)
    @last_month_date = @day_in_past_month - (@days_before -1) *24*60*60
    @this_month_date = @start_date
    @entries = []
    @zone_totals = []
    @zone_totals[@plan.id] = @plan.planned_minutes_zone
    @plans = @coach.plans.order("created_at DESC").limit(4)
    respond_to do |format|
     format.js
   end
  end
  def edit
    @plan_true = true
    @coach = current_user
    @plan = Plan.find(params[:id])
    @plans = @coach.plans.order("created_at DESC")
    @plan_zones = @plan.zones
    @entries = @plan.log_entries.where.not(date: [nil, ""])
    if @entries.size > 0
      @start_date = @entries.first.date
      @current_month = @start_date
      @end_date = @entries.last.date
    else
      @start_date = Date.today
      @current_month = @start_date
      @end_date = Date.today
    end

    @start_date = @start_date.beginning_of_month() - 6.months
    @start_real_date = @start_date.to_date
    if @start_date.wday == 0
      @days_before = 6
    else @days_before = @start_date.wday - 1
    end
    @day_in_past_month = @start_date.ago(1)
      #total number of days between start_date and 1month passed end_date + days before
    @rows =  (((@end_date - @start_date) + (@end_date.end_of_month() - @end_date) + ((@end_date.end_of_month()+ 6.months) - @end_date.end_of_month()) + @days_before)/7.0).ceil
    @last_day_of_month = @start_date.end_of_month()
    @first_day_of_cal = @start_date - (@days_before).days
    @last_day_of_cal = @first_day_of_cal + ((7*@rows - 1)*24*60*60)
    @last_month_date = @day_in_past_month - (@days_before -1) *24*60*60
    @this_month_date = @start_date
    respond_to do |format|
     format.js
   end

  end

  def update
    @coach = current_user
    @plans = @coach.plans.order("created_at DESC").limit(4)
    @plan = Plan.find(params[:id])
    if params[:name] != nil
    @plan.name = params[:name]
    else
      @plan.update_attributes(plan_params)
    end

    @plan.save
    respond_to do |format|
     format.js
   end

  end

  def destroy
    @plan_true = true
    @coach = current_user
    @log_ids = params[:log_ids]
    @no_plans = false

    if @log_ids[0...4] == "plan"
      @editor = true
      plan_id = @log_ids[5..-1]
      @plan = Plan.find(plan_id)
      @plan.log_entries.each do |entry|
        entry.destroy
      end
      @plan.destroy
      if current_user.plans.limit(4).size > 0
      @plan = Plan.by_coach(@coach.id).order("created_at DESC").first
      @plan_zones = @plan.zones
      @entries = @plan.log_entries.where.not(date: [nil, ""])
      if @entries.size > 0
        @start_date = @entries.first.date
        @current_month = @start_date
        @end_date = @entries.last.date
      else
        @start_date = Date.today
        @current_month = @start_date
        @end_date = Date.today
      end

      @start_date = @start_date.beginning_of_month() - 6.months
      @start_real_date = @start_date.to_date
      if @start_date.wday == 0
        @days_before = 6
      else @days_before = @start_date.wday - 1
      end
      @day_in_past_month = @start_date.ago(1)
        #total number of days between start_date and 1month passed end_date + days before
      @rows =  (((@end_date - @start_date) + (@end_date.end_of_month() - @end_date) + ((@end_date.end_of_month()+ 6.months) - @end_date.end_of_month()) + @days_before)/7.0).ceil
      @last_day_of_month = @start_date.end_of_month()
      @first_day_of_cal = @start_date - (@days_before).days
      @last_day_of_cal = @first_day_of_cal + ((7*@rows - 1)*24*60*60)
      @last_month_date = @day_in_past_month - (@days_before -1) *24*60*60
      @this_month_date = @start_date
      else
        @no_plans = true
      end

    else
      @editor = false
      @log_ids = @log_ids.split("-")
      @plan = LogEntry.find(@log_ids.first).plans.first
      @log_ids.each do |log_id|
        entry = LogEntry.find(log_id)
        if(entry.plans.first.user_id == @coach.id)
          LogEntry.destroy(log_id)
        end
      end
      if @plan.log_entries.size < 1
      @plan.destroy
      end
    end

    @plans = @coach.plans.order("created_at DESC")
    #@plans = @coach.plans.order("created_at DESC").limit(4)

    render nothing: true

  end

  def paste
    @user = current_user
    @mode = params[:mode]
    @athlete = Athlete.find(params[:athlete_id])
    @plan = Plan.find(params[:plan_id])
    @entry_date = Date.parse(params[:date])
    @start_date = Date.parse(params[:cal_month])
    @end_dates = @plan.end_dates
    @plan.log_entries.each do |entry|
      difference = (entry.date - @end_dates[0]).to_i
      new_date = @entry_date + difference.days
      log_entry = LogEntry.cal_entry_only(new_date,@athlete.id)


      if log_entry.size > 0
        puts "THE LOG ENTRY IS -------------------------------------------------------> "+ log_entry.first.id.to_s
        if @mode == "overwrite"
          log_entry.first.destroy
          new_entry = entry.amoeba_dup
          new_entry.athlete_id = @athlete.id
          new_entry.date = @entry_date + difference.days
          new_entry.save
        else
          new_workouts = entry.workouts.each do |workout|
            new_workout = workout.amoeba_dup
            new_workout.log_entry_id = log_entry.first.id
            new_workout.save
        end
      end
      else
        new_entry = entry.amoeba_dup
        new_entry.athlete_id = @athlete.id
        new_entry.date = @entry_date + difference.days
        new_entry.save
      end
    end

    #redundant code goes here
        @coach = current_user
        @friends = @coach.friends + @coach.inverse_friends

        @athletes = Friendship.athletes(@coach.id)
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
        @start_date = Time.parse(@start_date.to_s).beginning_of_month()
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
        @rows.times do |row|
          start = @first_day_of_cal - 1.day + (row*7).days
          @hours << LogEntry.total_hours(start, @athlete.id)
        end
      end
    #and ends here
      render :layout => false
  end

  def tag
    @coach = current_user
    @plan = Plan.find(params[:plan_id])
    tag_name = params[:tag_name]
    without_underscore = tag_name.gsub!(/_/, ' ')
    unless without_underscore == nil
      tag_name = without_underscore
    end
    @tag = @plan.tags.create(name: tag_name, user_id: @coach.id)
    @tags = @plan.tags
    render :layout => false
  end

  def remove_tag
    @coach = current_user
    tag_name = params[:tag_name]
    without_underscore = tag_name.gsub!(/_/, ' ')
    unless without_underscore == nil
      tag_name = without_underscore
    end
    @plan = Plan.find(params[:plan_id])
    tag = @plan.tags.where(name: tag_name).first
    if tag.user_id == @coach.id
      tag.destroy
    end
    respond_to do |format|
      format.html
      format.js
     end
  end

  def search
    @coach = current_user
    if params[:search] == "recent_plans"
      if params[:large_view] == "true"
        @plans = Plan.by_coach(@coach.id).order("created_at DESC")
      else
        @plans = @coach.plans.order("created_at DESC").limit(4)
      end
    else
      @plans = Plan.search_plans(params[:search],@coach.id)
    end
    if params[:large_view] == "true"
      @zone_totals = {}
      @plans.each do |plan|
        @zone_totals[plan.id] = plan.planned_minutes_zone

      end
      render :index, :layout => false
    else
    render :layout => false
    end
  end
  def search_list
    @coach = current_user
    if params[:search] == "recent_plans"
      @plans = Plan.by_coach(@coach.id).order("created_at DESC")
    else
      @plans = Plan.search_plans(params[:search],@coach.id)
    end
    respond_to do |format|
     format.js
   end
  end
  private
    # Using a private method to encapsulate the permissible parameters
    # is just a good pattern since you'll be able to reuse the same
    # permit list between create and update. Also, you can specialize
    # this method with per-user checking of permissible attributes.
    def plan_params
      params.require(:plan).permit!
    end

end
