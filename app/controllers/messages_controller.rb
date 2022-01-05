class MessagesController < ApplicationController
  def create
    @message = Message.create(message_params)

    @date = LogEntry.find(Workout.find(@message.workout_id).log_entry_id).date
    respond_to do |format|
      format.js
    end
  end

  def destroy
    @message = Message.find(params[:id])
    @message.destroy
    respond_to do |format|
      format.js
    end
  end

  private
    # Using a private method to encapsulate the permissible parameters
    # is just a good pattern since you'll be able to reuse the same
    # permit list between create and update. Also, you can specialize
    # this method with per-user checking of permissible attributes.
    def message_params
      params.require(:message).permit!
    end
end
