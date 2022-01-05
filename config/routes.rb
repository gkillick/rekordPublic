Flondo::Application.routes.draw do
  devise_for :users, controllers: {sessions: "my_devise/sessions", registrations: "my_devise/registrations"}


  resources :annual_training_plans, :except => :show
  resources :messages
  resources :activities
  resources :sports
  resources :log_entries
  resources :friendships
  resources :users
  resources :coaches
  match"plans/make_plan" => "plans#make_plan", :via => [:get]
  resources :plans
  resources :preferences
  resources :friendship_permissions


  #not logged in links to login page
  unauthenticated :user do
    devise_scope :user do
      get "/" => "my_devise/sessions#new"
    end
  end
  #logged in checks if coach or athlete then assigns different controllers
  authenticated :user do
  root :to => 'coaches#index', :constraints => lambda { |request| request.env['warden'].user.user_type == 'Coach' }, as: :coach_root
  root :to => 'athletes#index', :constraints => lambda { |request| request.env['warden'].user.user_type == 'Athlete' }, as: :athlete_root
  end


  resource :preferences, only: [:index] do
    collection do
      put 'update_password'
    end
  end
  match 'admin/infinite_content' => 'admin#index', :via => [:get]
  match 'athletes/pull_dates_mobile/:date/:direction' => 'athletes#pull_dates_mobile', :via => [:get]
  match 'log_entries/delete_workout/:workout_id/:calendar_date' => 'log_entries#delete_workout', :via => [:delete]
  match"users/set_preferences/:side_bar/:athlete_toggle" => "preferences#set_preferences", :via => [:put]
  match"users/set_custom_preference/:preference/:value" => "preferences#set_custom_preference", :via => [:put]
  match"plans" => "plans#index", :via => [:get]
  match"plans/destroy/:type/:log_ids" => "plans#destroy", :via => [:delete]
  match"plans/search/:large_view/:search" => "plans#search", :via => [:get]
  match"plans/search_list/:search" => "plans#search_list", :via => [:get]
  match"plans/remove_tag/:plan_id/:tag_name" => "plans#remove_tag", :via => [:delete]
  match"plans/tag/:plan_id/:tag_name" => "plans#tag", :via => [:post]
  match"plans/paste/:athlete_id/:plan_id/:date/:mode/:cal_month" => "plans#paste", :via => [:post]
  match"plans/update/:id/:name" => "plans#update", :via => [:put]
  match"plans/new/:athlete_id/:log_ids" => "plans#new", :via => [:post]
  match"coaches/dashboard/:ajax" => "coaches#index", :via => [:get]
  match"log_entries/destroy/:athlete_id/:log_ids" => "log_entries#destroy", :via => [:delete]
  match"coaches/copy/:athlete_id/:log_ids" => "coaches#copy_log_entries", :via => [:post]
  match "/calendar/:athlete_id" => "coaches#calendar", :via => [:get]
  match "/graph/:athlete_id/:start_year" => "log_entries#graph", :via => [:get]
  match "/graph_mobile/:athlete_id/:start_year" => "log_entries#graph_mobile", :via => [:get]
  match "/friendships/new/:friend_id" => "friendships#create", :via => [:post]
  match "/calendar" => "log_entries#calendar", :via => [:get]
  match "/log_entries/new/:date/:athlete_id/:calendar_date" => "log_entries#new", :via => [:post]
  match "/log_entries/new/:date" => "log_entries#new", :via => [:post]
  match "log_entries/:id/edit/:workout_ref/:calendar_date" => "log_entries#edit", :via => [:get]
  match "/graph/:date" => "log_entries#graph", :via => [:get]
  match "/graph/get_month/:athlete_id/:date" => "log_entries#get_month", :via => [:get]
  match "/coaches/get_name/:name" => "coaches#get_name", :via => [:get]
  match "/log_entries/get_calendar/:athlete_id/:date" => "log_entries#get_calendar", :via => [:get]



  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => "welcome#index"

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'
end
