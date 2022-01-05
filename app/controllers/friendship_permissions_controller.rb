class FriendshipPermissionsController < ApplicationController
  def update
    @permission = FriendshipPermission.find(params[:id])
    permission = params[:friendship_permission]
    if permission["view_training"] == "false"
      params[:friendship_permission]["limited_view"] = "false"
    end
    if permission["limited_view"] == "true"
      params[:friendship_permission]["view_training"] = "true"
    end
    @permission.update_attributes params[:friendship_permission]
    
    render :nothing => true
  end
end
