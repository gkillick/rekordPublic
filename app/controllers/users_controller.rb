class UsersController < ApplicationController
  def update
    @email_used = false
    @no_errors = true
    @user = User.find(current_user.id)
    if @user.email != params[:user][:email]
      if User.exists?(:email => params[:user][:email])
        @email_used = true
        @no_errors = false
      end
    end
    if @no_errors == true
      if params[:user][:password].blank?
        @user.update_without_password(user_params)
      elsif @user.update_attributes(user_params)
        # Sign in the user by passing validation in case their password changed
        bypass_sign_in @user

      else
        @no_errors = false
        @password_incorrect = true

      end
    end
  end
  private
    # Using a private method to encapsulate the permissible parameters
    # is just a good pattern since you'll be able to reuse the same
    # permit list between create and update. Also, you can specialize
    # this method with per-user checking of permissible attributes.
    def user_params
      params.require(:user).permit(:password, :email, :last_name, :first_name, :image)
    end
end
