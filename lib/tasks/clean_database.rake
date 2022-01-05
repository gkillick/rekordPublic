desc "clean up the database data to allow for unique indexes"
task :remove_duplicates => :environment do


LogEntry.find_by_sql("select a.id, b.id, date, athlete_id FROM log_entries a INNER JOIN log_entries b USING (date, athlete_id) WHERE a.id > b.id").each(&:destroy)
CompletedWorkout.find_by_sql("select a.id, b.id, workout_id FROM completed_workouts a INNER JOIN completed_workouts b USING (workout_id) WHERE a.id > b.id").each(&:destroy)




  planned_workouts = PlannedWorkout.where.not(id: PlannedWorkout.group(:workout_id).select("min(id)"))

  #loop through and find the ids of the workout
  workout_ids = []
  planned_workouts.each do |planned_workout|
    workout_ids << planned_workout.workout_id
  end
  planned_workouts = []
  workout_ids.each do |workout_id|
    Workout.find(workout_id).planned_workouts.first.destroy
  end


end
