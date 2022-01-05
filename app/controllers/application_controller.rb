class ApplicationController < ActionController::Base
  before_action :configure_permitted_parameters, if: :devise_controller?

  after_action :user_activity

  def index
  end

  def check_for_mobile
     session[:mobile_override] = params[:mobile] if params[:mobile]
     prepare_for_mobile if mobile_device?
   end

   def prepare_for_mobile
     prepend_view_path Rails.root + 'app' + 'views_mobile'
   end

   def mobile_device?
     if session[:mobile_override]
       session[:mobile_override] == "1"
     else
       # Season this regexp to taste. I prefer to treat iPad as non-mobile.
       (request.user_agent =~ /Mobile|webOS/) && (request.user_agent !~ /iPad/)
     end
   end
   helper_method :mobile_device?



   def user_activity
     current_user.try :touch
   end

   protected

   def configure_permitted_parameters
     devise_parameter_sanitizer.permit(:sign_up, keys: [:first_name, :last_name, :image, :user_type])
   end

end
