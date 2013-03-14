#!/usr/bin/env ruby
# encoding: utf-8

UNICORN_RAILS = "unicorn"
APP_PATH = "/storage/www/adidas"
APP_NAME = "adidas"
UNICORN_CONF = "#{APP_PATH}/config/unicorn.rb"
PID_FILE = "/tmp/.unicorn.#{APP_NAME}.pid"

class Runner
  class << self

    def start
      system "cd #{APP_PATH}; #{UNICORN_RAILS} -D -E production -c #{UNICORN_CONF}"
    end

    def reload
      old_master_pid = pid
      system "kill -s USR2 #{old_master_pid}"
      sleep 3
      if old_master_pid != pid
        system "kill -s WINCH #{old_master_pid}"
        system "kill -s QUIT #{old_master_pid}"
      else
        puts "  Exception!!"
      end
    end

    def restart
      stop
      start
    end

    def stop
      graceful_stop
    end

    def graceful_stop
      system "kill -s QUIT #{pid}"
    end

    def force_stop
      system "kill -s KILL #{pid}"
    end

    def pid
      File.read PID_FILE
    end

    def status
      begin
        system "ps -o user,pid,ppid,command ax | grep #{pid}"
      rescue
        puts "Not started"
      end
    end

  end
end


case ARGV[0]
when "start"
  Runner.start
when "reload"
  Runner.reload
when "restart"
  Runner.restart
when "stop"
  Runner.stop
when "status"
  Runner.status
when "pid"
  Runner.pid
else
  STDERR.puts "usage init.unicorn.rb [start|reload|restart|stop|status|pid]"
  exit(1)
end

