
require "geocoder"

module Calle

  class Trucks

    STOP_WORDS  = ['for', 'and', 'the', 'dr.', 'mikl']
    NEARBY      = 1

    def all(arg)
      truck_data.data 
    end

    def random(arg)
      truck_data.data.sample 
    end

    def search(params)
      query = params[:q]
      query = query.downcase.split(' ').map{ |term| "(?=.*#{term})" }.join
      query = %r{#{query}}

      truck_data.data.find_all do |truck|
        long_string = truck.values.join('')
        long_string.downcase.scan(query).length > 0
      end
    end

    def nearby(params)
      loc = params[:loc]

      nearby_trucks = truck_data.data.find_all do |truck|        
        Geocoder::Calculations.distance_between(loc, truck[:lat_lng]) < NEARBY
      end

      nearby_trucks
    end

    def onmap(params)
      center  = params[:c]
      ne      = params[:ne]
      sw      = params[:sw]

      onmap_trucks = truck_data.data.find_all do |truck|
        radius = Geocoder::Calculations.distance_between(ne, sw)/2
        Geocoder::Calculations.distance_between(center, truck[:lat_lng]) < radius
      end

      onmap_trucks
    end

    def cuisines(params)
      return @cuisines if @cuisines

      cuisines = truck_data.data.map do |truck|
        s = truck[ :food_items ].gsub(':', '')
        s = s.downcase.split(/\s|\/|\(|\)/)
      end

      cuisines = cuisines.flatten
      cuisines = cuisines.delete_if{ |s| s.length < 3 or STOP_WORDS.include?(s) }
      cuisines.uniq.sort
    end

    def count(arg)
      truck_data.data.last[:id]
    end

    def truck_data
      @truck_data || TruckData.new
    end

  end

end