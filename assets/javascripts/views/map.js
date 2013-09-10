
define([
    'backbone',
    'routes',
    'data/trucks',
    'async!http://maps.google.com/maps/api/js?sensor=false',
    'geo'
  ], 

  function(Backbone, routes, TruckCollection, undefined, Geo){
 
    var SF_CENTER         = new google.maps.LatLng(37.7881, -122.4075);
    var CALLE_MAPTYPE_ID  = 'calle-custom';
    var CHANGED_TIMEOUT   = 1000;
    var NEAR_MILES        = 20;

    var trucksCollection = new TruckCollection();

    var MapView = Backbone.View.extend({
      el: '.map-wrap',
      events: {
        'centerSelf':         'centerSelf',
        'markSelf':           'markSelf',
      },

      initialize: function(){
        var self = this;
        this.collection = trucksCollection;

        this.makeMap()
        this.bindMapEvents();
        this.styleMap();
      },

      bindMapEvents: function(){
        var self = this;

        google.maps.event.addListener(this.map, 'center_changed', function(){ 
          self.mapChanged();
        }); 

        google.maps.event.addListener(this.map, 'zoom_changed', function(){ 
          self.mapChanged();
        }); 

        google.maps.event.addListenerOnce(this.map, 'tilesloaded', function(){ 
          self.findTrucksOnMap();
        }); 
      },

      mapChanged: function(){

        if ( Calle.SidebarMainView.searching )
          return;

        var self = this;
        function finished(){ 
          self.findTrucksOnMap();
        }

        clearTimeout(this.timeout); 
        this.timeout = setTimeout(finished, CHANGED_TIMEOUT); 
      },

      selfLoc: function(){
        var loc   = new google.maps.LatLng( parseFloat(localStorage.lat), parseFloat(localStorage.lng) )
        return loc;
      },

      centerSelf: function(args){
        this.map.panTo( this.selfLoc() );
      },

      centerSF: function(args){
        this.map.panTo( SF_CENTER );
      },

      markSelf: function(args){
        this.marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: this.selfLoc(),
        });
      },

      getMapBoundsAndCenter: function(){
        var map   = this.map;
        var b     = map.getBounds();
        var neLat = b.getNorthEast().lat();
        var neLng = b.getNorthEast().lng();
        var swLat = b.getSouthWest().lat();
        var swLng = b.getSouthWest().lng();

        var c     = map.getCenter();
        var cLat  = c.lat();
        var cLng  = c.lng();

        return { ne: [neLat, neLng], sw: [swLat, swLng], c: [cLat, cLng] }
      },

      isUserNearSF: function(lat, lng){
        var distance = Geo.distance(lat, lng, SF_CENTER.lat(), SF_CENTER.lng() );
        return distance < NEAR_MILES;
      },

      findTrucksOnMap: function(){
        var self = this;

        $.ajax({
          url: routes.trucks.onMap,
          data: this.getMapBoundsAndCenter(),
          success: function(d){
            Calle.AppView.hideOverlay('truck');
            Calle.AppView.updateCounter( d.length ); 
            self.collection.add(d)
          }
        });

      },

      makeMap: function(){
        this.mapDiv  = this.$el.find('.map').get(0);
    
        this.map = window.calleMap = new google.maps.Map(this.mapDiv, {
          center: SF_CENTER,
          zoom: 17,
          disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          navigationControl: true,
          navigationControlOptions: {
            style: google.maps.NavigationControlStyle.SMALL
          },
          mapTypeId: CALLE_MAPTYPE_ID
        });

      },

      /* Simple Map Style */ 
      styleMap: function(){
        var featureOpts = [
              {
                "featureType": "water",
                "stylers": [
                  { "visibility": "on" },
                  { "weight": 2 },
                  { "color": "#ffffff" }
                ]
              },{
              },{
                "featureType": "administrative",
                "stylers": [
                  { "color": "#dfdfdf" }
                ]
              },{
                "featureType": "landscape.natural",
                "stylers": [
                  { "color": "#ffffff" }
                ]
              },{
                "featureType": "administrative",
                "stylers": [
                  { "color": "#ffffff" }
                ]
              },{
                "featureType": "poi",
                "stylers": [
                  { "visibility": "on" },
                  { "color": "#ffffff" }
                ]
              },{
              },{
                "featureType": "landscape",
                "stylers": [
                  { "color": "#ffffff" }
                ]
              },{
              },{
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                  { "color": "#000000" }
                ]
              },{
                "featureType": "road.highway",
                "elementType": "labels.text",
                "stylers": [
                  { "visibility": "simplified" },
                  { "color": "#000000" }
                ]
              },{
                "featureType": "transit",
                "elementType": "labels.icon",
                "stylers": [
                  { "visibility": "on" },
                  { "color": "#000000" }
                ]
              },{
                "featureType": "water",
                "stylers": [
                  { "color": "#000000" }
                ]
              }
            ]

        var styledMapOptions = {
          name: 'Calle'
        };

        var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);
        this.map.mapTypes.set(CALLE_MAPTYPE_ID, customMapType);
      }

    });

    return MapView;

})