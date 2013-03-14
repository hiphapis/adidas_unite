APP_NAME = "adidas"
APP_PATH = "/storage/www/adidas"

worker_processes 6
timeout 180

listen "/tmp/.unicorn.#{APP_NAME}.sock", :backlog => 512

pid "/tmp/.unicorn.#{APP_NAME}.pid"

stderr_path "#{APP_PATH}/log/unicorn.stderr.log"
stdout_path "#{APP_PATH}/log/unicorn.stdout.log"

preload_app false

GC.respond_to?(:copy_on_write_friendly=) and GC.copy_on_write_friendly = true

before_fork do |server, worker|
  defined?(ActiveRecord::Base) and ActiveRecord::Base.connection.disconnect!
end
after_fork do |server, worker|
  defined?(ActiveRecord::Base) and ActiveRecord::Base.establish_connection
end
