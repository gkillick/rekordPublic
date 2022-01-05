class AthletesController < ApplicationController
  before_action :check_for_mobile
  def index
    @plan_true = false
    @type = current_user.user_type
    @user = current_user
    @preferences = @user.preferences
    @friends = @user.friends + @user.inverse_friends
    @athlete = @user
    @athletes = @friends
    @start_date = Time.now.beginning_of_month()
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


    if request.user_agent =~ /iPad;/
      @entries = LogEntry.date_pull(@first_day_of_cal.to_date,@last_day_of_cal.to_date, @athlete.id)
   elsif request.user_agent =~ /Mobile|webOS/
      @entries = LogEntry.date_pull(Date.today - 20.days,Date.today + 20.days, @athlete.id)
    else
          @entries = LogEntry.date_pull(@first_day_of_cal.to_date,@last_day_of_cal.to_date, @athlete.id)
    end
    @comments = @athlete.comments(@first_day_of_cal,@last_day_of_cal)
    @month_stats = @athlete.month_stats(@start_date.to_date)


    @last_month_date = @day_in_past_month - (@days_before -1) *24*60*60
    @this_month_date = @start_date
    @hours = []
    @true_hours = @athlete.total_hours_between_dates(@start_real_date, @last_day_of_month.to_date)

    @rows.times do |row|
      start = @first_day_of_cal - 1.day + (row*7).days
      @hours << LogEntry.total_hours(start, @athlete.id)
    end
  end

  def pull_dates_mobile
    prepend_view_path Rails.root + 'app' + 'views_mobile'
    @user = current_user
    date = Date.parse(params[:date])
    @direction = params[:direction]
    if @direction == "up"
      @start_date = date - 21.days
      @entries = LogEntry.date_pull(@start_date,date - 1.day, @user.id)
    end
    if @direction == "down"
      @start_date = date + 1.day
      @entries = LogEntry.date_pull(@start_date, date + 21.days, @user.id)
    end
  end
end
