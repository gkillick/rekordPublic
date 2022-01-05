desc 'removes duplicate years in atp keeping first one'
task :clean_atp => :environment do
  users = User.all
  users.each do |user|
    atps = user.annual_training_plans.each 
    first_plan = atps.first
    atps.each do |training_plan|
      if training_plan.id != first_plan.id
        training_plan.destroy
      end
      
    end
    
  end

end