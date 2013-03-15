module ApplicationHelper

	def fucking_ie?(versions = [6,7,8,9])
		reg = ""
		versions.each_with_index do |v, k|
			versions[k] = "MSIE #{v}"
		end

		request.user_agent =~ /#{versions.join("|")}/
	end

end
