# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_05_09_011332) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "activities", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "activities_sports", id: false, force: :cascade do |t|
    t.integer "activity_id"
    t.integer "sport_id"
  end

  create_table "annual_training_plans", force: :cascade do |t|
    t.integer "start_year"
    t.integer "total_planned_hours"
    t.integer "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "month_hours"
    t.index ["user_id"], name: "index_annual_training_plans_on_user_id"
  end

  create_table "athletes_coaches", id: false, force: :cascade do |t|
    t.integer "athlete_id"
    t.integer "coach_id"
  end

  create_table "clippings", force: :cascade do |t|
    t.integer "plan_id"
    t.integer "log_entry_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "completed_workouts", force: :cascade do |t|
    t.integer "workout_id"
    t.integer "zone"
    t.text "summary"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["workout_id"], name: "index_completed_workouts_on_workout_id", unique: true
  end

  create_table "friendship_permissions", force: :cascade do |t|
    t.integer "friendship_id"
    t.integer "user_id"
    t.integer "friend_id"
    t.boolean "view_training"
    t.boolean "limited_view"
    t.boolean "edit_training"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "friendships", force: :cascade do |t|
    t.integer "user_id"
    t.integer "friend_id"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "log_entries", force: :cascade do |t|
    t.date "date"
    t.integer "athlete_id"
    t.integer "feel"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "sleep_quality"
    t.index ["athlete_id", "date"], name: "index_log_entries_on_athlete_id_and_date", unique: true
    t.index ["athlete_id"], name: "index_log_entries_on_athlete_id"
  end

  create_table "messages", force: :cascade do |t|
    t.integer "user_id"
    t.text "message"
    t.integer "workout_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_messages_on_user_id"
  end

  create_table "month_totals", force: :cascade do |t|
    t.date "start_date"
    t.string "time_totals"
    t.integer "athlete_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["athlete_id"], name: "index_month_totals_on_athlete_id"
  end

  create_table "planned_workout_times", force: :cascade do |t|
    t.integer "duration"
    t.integer "zone"
    t.integer "planned_workout_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "multiplier"
    t.integer "sub_duration"
    t.integer "rest"
    t.index ["planned_workout_id"], name: "index_planned_workout_times_on_planned_workout_id"
  end

  create_table "planned_workouts", force: :cascade do |t|
    t.integer "workout_id"
    t.text "instructions"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["workout_id"], name: "index_planned_workouts_on_workout_id", unique: true
  end

  create_table "plans", force: :cascade do |t|
    t.integer "user_id"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "description"
    t.index ["user_id"], name: "index_plans_on_user_id"
  end

  create_table "preferences", force: :cascade do |t|
    t.integer "user_id"
    t.boolean "side_bar"
    t.boolean "athlete_toggle"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.date "start_date"
    t.string "sport"
    t.text "activities"
    t.string "copy_workouts"
    t.string "color_workouts"
    t.string "chart_range", default: "week", null: false
    t.boolean "comments"
  end

  create_table "sports", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "taggings", force: :cascade do |t|
    t.bigint "tag_id"
    t.bigint "plan_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["plan_id"], name: "index_taggings_on_plan_id"
    t.index ["tag_id"], name: "index_taggings_on_tag_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name"
    t.integer "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.string "password_salt"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "user_type"
    t.string "first_name"
    t.string "last_name"
    t.string "image"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "workout_times", force: :cascade do |t|
    t.integer "duration"
    t.integer "zone"
    t.integer "completed_workout_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "multiplier"
    t.integer "sub_duration"
    t.integer "rest"
    t.index ["completed_workout_id"], name: "index_workout_times_on_completed_workout_id"
  end

  create_table "workouts", force: :cascade do |t|
    t.string "activity"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "log_entry_id"
    t.string "time_of_day"
    t.string "activity_id"
    t.integer "time"
    t.index ["log_entry_id"], name: "index_workouts_on_log_entry_id"
  end

end
