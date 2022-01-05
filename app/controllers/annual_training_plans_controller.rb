class AnnualTrainingPlansController < ApplicationController
  def create
    if User.find(params[:annual_training_plan][:user_id]).annual_training_plans.atp_for_year(params[:annual_training_plan][:start_year]).size == 0
      @atp = AnnualTrainingPlan.create(atp_params)
    else
      params[:annual_training_plan].delete :id
      @atp = User.find(params[:annual_training_plan][:user_id]).annual_training_plans.atp_for_year(params[:annual_training_plan][:start_year]).first.update_attributes(atp_params)
    end
    render :nothing => true
  end
  def update
    @atp = AnnualTrainingPlan.find(params[:id]).update_attributes(atp_params)
    render json: nil, status: :ok
  end


  private
    # Using a private method to encapsulate the permissible parameters
    # is just a good pattern since you'll be able to reuse the same
    # permit list between create and update. Also, you can specialize
    # this method with per-user checking of permissible attributes.
    def atp_params
      params.require(:annual_training_plan).permit!
    end
end
