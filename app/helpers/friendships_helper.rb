module FriendshipsHelper
  def link_to_accept_friend(name,id,status, ajax_id)
    link_to(name, friendship_path(id, "friendship[status]" => "accepted"), :method => :put, :remote => true, :class => "search_link add_friend interface_button")
  end
  def link_to_add_friend(name, user_id,ajax_id)
    request = 'friendships/new/'+user_id.to_s
    link_to(name, request, :remote => true, :class => "search_link add_friend interface_button", method: :post)
  end
  def link_to_remove_friend(name, user_id,ajax_id)
    request = 'friendships/'+user_id.to_s
    link_to(name, request, :remote => true, :method => :delete, :class => "search_link remove_friend interface_button")
  end
end
