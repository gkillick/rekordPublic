desc 'migrates the workout comments to messages'
task :migrate_comments => :environment do
  completed_workouts = CompletedWorkout.where("summary IS NOT NULL")
  completed_workouts.each do |completed_workout|
    workout = Workout.find(completed_workout.workout_id)
    log_entry = LogEntry.find(workout.log_entry_id)
    unless completed_workout.summary == ""
    Message.create({ :user_id => log_entry.athlete_id, :message => completed_workout.summary, :workout_id => workout.id})
    end
  end

end
