class AdminController < ApplicationController
  def index
    @user = current_user

    if current_user.email == "gkillick@gmail.com"


    @users = User.all.sort_by(&:"#{:updated_at}").reverse

  end
  else

  end

end
