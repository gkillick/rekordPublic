module FriendshipPermissionsHelper
  
  def link_to_permission_toggle(permission,attribute_name)
    link = '<div class="on_off_toggle toggle_'+permission.send(attribute_name.to_sym).to_s+'" data-toggle_value='+permission.send(attribute_name.to_sym).to_s+' data-attribute_name='+attribute_name.to_s+'><div class="on_off_circle toggle_'+permission.send(attribute_name.to_sym).to_s+'_circle"><div class="on_off_text"></div></div></div>'
				link_to(link.html_safe, friendship_permission_path(permission.id, "friendship_permission["+attribute_name+"]" => !permission.send(attribute_name.to_sym)), :method => :put, :id => "permission_"+ permission.id.to_s, :class => "toggle_link permission_"+attribute_name.to_s, :data => {:attribute_name => attribute_name.to_s,  :href => friendship_permission_path(permission.id, "friendship_permission["+attribute_name+"]" => !permission.send(attribute_name.to_sym))}, :remote => true)
  end
end
