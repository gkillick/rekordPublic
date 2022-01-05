module PlansHelper
  
  def link_to_new_plan(name, the_class)
    link_to(name,'plans/make_plan', :remote => true, :class => the_class)    
  end
end
