set :domain, "briangonzalez.org"
set :application, "calle"
set :deploy_to, "/srv/www/#{application}"

role :web, domain
role :app, domain
role :db,  domain, :primary => true

default_run_options[:pty] = true  # Must be set for the password prompt from git to work
set :repository,  "git@github.com:briangonzalez/calle-app.git"
set :deploy_via, :remote_cache
set :branch, "master"
set :scm, "git"
set :user, "root"  # The server's user for deploys
ssh_options[:forward_agent] = true

set :git_enable_submodules, 1

set :rvm_ruby_string, 'ruby-2.0.0-p195'

# if you want to clean up old releases on each deploy uncomment this:
after "deploy:restart", "deploy:cleanup"

# if you're still using the script/reaper helper you will need
# these http://github.com/rails/irs_process_scripts

# If you are using Passenger mod_rails uncomment this:
namespace :deploy do
  task :start do ; end
  task :stop do ; end
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
    run "git submodule "
  end
end