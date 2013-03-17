class ApplicationController < ActionController::Base
  protect_from_forgery

  # 
  # Mobile Web
  # 
  def mobile_device?
    if session[:mobile_param]
      session[:mobile_param] == "1"
    else
      request.user_agent =~ /Mobile|webOS/
    end
  end
  helper_method :mobile_device?

  def iphone?
    if session[:mobile_param]
      session[:mobile_param] == "1"
    else
  		request.user_agent =~ /iPhone/
    end
  end
  helper_method :iphone?


  def prepare_for_mobile
    session[:mobile_param] = params[:mobile] if params[:mobile]
    request.format = :mobile if mobile_device? && request.format.to_s !~ /json/
  end

end
