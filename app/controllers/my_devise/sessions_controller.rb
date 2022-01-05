class MyDevise::SessionsController < Devise::SessionsController
  before_action :check_for_mobile, :only => :new

  def new
    check_for_mobile
    super
    
  end
 

end 