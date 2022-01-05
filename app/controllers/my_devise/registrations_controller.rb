class MyDevise::RegistrationsController < Devise::RegistrationsController


  def new
    check_for_mobile
    super
    
  end
 

end 