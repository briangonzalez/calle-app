require 'net/http'
require 'json'

module Calle

  class TruckData

    RAW_TRUCK_DATA_URL  = 'https://data.sfgov.org/api/views/rqzj-sfat/rows.json?accessType=DOWNLOAD'
    RAW_TRUCK_DATA_FILE = File.join(App.settings.root, 'data', 'rows.json')

    INDEX_ID              = 0
    INDEX_NAME            = 9 
    INDEX_TYPE            = 10
    INDEX_LOC_DESCRIPTION = 12  
    INDEX_ADDRESS         = 13
    INDEX_FOOD_ITEMS      = 19   
    INDEX_LAT             = 22  
    INDEX_LNG             = 23  

    def data
      return @data if @data

      data = raw['data'].map do |t|

        {
          id:           t[INDEX_ID],
          name:         t[INDEX_NAME],
          type:         t[INDEX_TYPE],          
          description:  t[INDEX_LOC_DESCRIPTION],
          address:      t[INDEX_ADDRESS],        
          food_items:   t[INDEX_FOOD_ITEMS],     
          lat_lng:      [ t[INDEX_LAT], t[INDEX_LNG ] ]          
        }

      end

      @data = data
      @data
    end

    def count
      data.last[0]
    end

    def raw
      @raw ||= JSON.parse(json)
    end

    def json
      File.read( RAW_TRUCK_DATA_FILE )
    end

    def self.searchable
      # an array of indexes with searchable fields.
      [INDEX_NAME, INDEX_TYPE, INDEX_ADDRESS, INDEX_FOOD_ITEMS, INDEX_LOC_DESCRIPTION]
    end

    def get_latest!
      uri = URI( RAW_TRUCK_DATA_URL )
      res = Net::HTTP.get_response(uri)

      if res.is_a?(Net::HTTPSuccess)
        File.open( RAW_TRUCK_DATA_FILE, 'w') {|f| f.write(res.body) }
        @raw = nil
      end
    end

  end

end