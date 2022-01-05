class FriendshipsController < ApplicationController
  before_action :authenticate_user!
  def index
    @user = current_user
    @friends = @user.friends + @user.inverse_friends
    @search_friends = User.search(params[:friends_search],@user.id)
    @friendships = []
    @search_friends.each do |friend|
      if friend.friend_with(@user.id,friend.id)
        @friendships << friend.friend_with(@user.id,friend.id)
      else
        @friendships << friend.id
      end
    end
    @pending_requests = Friendship.pending_requests(@user.id)
    @pending_friends = []
    @pending_requests.each do |request|
      @pending_friends << User.find(request.user_id)
    end
#    @friends2 = @user.inverse_friends #somehow this is updating the user_id to current_user

  render :layout => false
  end
  def create
    @friend_id = params[:friend_id]
    @friendship = current_user.friendships.build(:friend_id => params[:friend_id], :status =>"pending")
    @friendship.save
  end
  def update
    @athlete = current_user
    @friendship = Friendship.find(params[:id])
    @friendship.update_attributes(friendship_params)
    @user = User.find(@friendship.friend_id)
    @friend = User.find(@friendship.user_id)
    @frienship_permissions = @athlete.friendship_permissions
    @request_count = Friendship.pending_requests(current_user.id).size
  end

  def destroy
    @friendship = Friendship.find_friend(current_user.id, params[:id])
    if @friendship.friend_id == current_user.id
      @friend_id = @friendship.user_id
    else
      @friend_id = @friendship.friend_id
    end
    @friendship.destroy

    @request_count = Friendship.pending_requests(current_user.id).size

  end


    private
      # Using a private method to encapsulate the permissible parameters
      # is just a good pattern since you'll be able to reuse the same
      # permit list between create and update. Also, you can specialize
      # this method with per-user checking of permissible attributes.
      def friendship_params
        params.require(:friendship).permit!
      end
end
