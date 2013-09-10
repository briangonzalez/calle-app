# encoding: utf-8
require 'sinatra'
require "sinatra/reloader"
require 'haml'

module Calle

  class App < Sinatra::Application

    require_relative "lib/trucks"
    require_relative "lib/truck_data"

    configure do
      set :public_folder,           './assets'
      set :trucks,                  Calle::Trucks.new
      set :title,                   "CalleApp"
      set :tagline,                 "El ultimo San Fran food truck locator."
    end

    configure :development do
      register Sinatra::Reloader
      also_reload './lib/**/*'
    end 

    configure :production do
      set :haml, { :ugly=>true }
    end

    get '/' do
      haml :index
    end

    get '/trucks/:route' do
      result = settings.trucks.send(params[:route], params)

      content_type 'application/json'
      result.to_json
    end

  end

end