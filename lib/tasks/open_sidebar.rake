desc "open every user's sidebar"
task :open_sidebar => :environment do
  preferences = Preferences.all
  preferences.each do |preference|
    preference.side_bar = true
    preference.save
  end

end
