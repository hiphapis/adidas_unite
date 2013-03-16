class MainController < ApplicationController

  before_filter :prepare_for_mobile

  def index
  end

	def dev
		render layout: "dev"
	end

	def iframe
		render layout: false
	end
end
