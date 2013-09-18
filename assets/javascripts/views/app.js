
define([
  'backbone', 
  'underscore', 
  'fastclick', 
  'routes',
  'geo',
  'cookie'
  ], function(Backbone, _, fastclick, routes, Geo, undefined){
  
  REMEMBER_DAYS   = 1;
  REMEMBER_COOKIE = 'loc_decision';
  IOS_COOKIE      = 'seen_ios_alerft';

  var AppView = Backbone.View.extend({
    el: 'body',
    events: {
      'click .overlay .close': 'closeOverlay'
    },

    initialize: function(){
      _.bindAll(this, 'locateSuccess', 'locateError');

      /* we'll use this later */
      window.$window = $(window);

      /* fastclicks, oooooo! */
      FastClick.attach(document.body);

      this.$map = this.$el.find('.map-wrap'); 
      this.locateSelf();
      this.checkForIOSAndNotify();
    },

    hideOverlay: function(overlay){
      var c = overlay ? '.'+ overlay : '';
      this.$el.find(c +'.overlay')
              .addClass('hidden');
    },

    showOverlay: function(overlay){
      var c = overlay ? '.'+ overlay : '';
      this.$el.find( c + '.overlay')
              .removeClass('hidden');
    },

    locateSelf: function(){
      navigator.geolocation.getCurrentPosition(
          this.locateSuccess, 
          this.locateError,
          { enableHighAccuracy: true, timeout: 10*100*1000, maximumAge: 0 }
        );
    },

    locateSuccess: function(p){
      this.hideOverlay('location');
      this.coords         = p.coords;
      localStorage.coords = JSON.stringify(p.coords);
      localStorage.lat    = p.coords.latitude; 
      localStorage.lng    = p.coords.longitude; 


      // If we know the user's location, use it. Else:
      // Use what they told us to use stored in the cookie.
      // Else, ask them what we should do.
      if ( Calle.MapView.isUserNearSF(this.coords.latitude, this.coords.longitude) ){
        Calle.MapView.centerSelf();
      } 
      else if ( $.cookie( REMEMBER_COOKIE ) ) {
        Calle.MapView[ $.cookie(REMEMBER_COOKIE) ]()
      }
      else {
        var goToSF = confirm(   [ "Your location is not too close to San Francisco.", 
                                  "Do you want to stay in SF?\n\n",
                                  "Click OK to keep the map in SF, or click cancel to pan to your actual location.",
                                  "Your decision will be stored in your cookies for", 
                                  REMEMBER_DAYS, 
                                  "day." ].join(' ') 
                              );

        var val = goToSF ? 'centerSF' : 'centerSelf';

        $.cookie(REMEMBER_COOKIE, val, { expires: REMEMBER_DAYS });

        Calle.MapView[val]();
      }
      
      Calle.MapView.markSelf();
    },

    locateError: function(){
      alert("We were unable to geolocate you. We're going to assume your location.")
      this.hideOverlay('location');
      Calle.MapView.goToSF();
    },

    updateCounter: function(count, verb){
      verb = verb || 'Showing';
      this.$count = this.$count || this.$el.find('.count');

      var text = [verb, count, 'truck'].join(' ');
      if ( !(count === 1) ) 
        text = text + "s"

      this.$count.text(text)
    },

    closeOverlay: function(){
      this.hideOverlay()
    },


    checkForIOSAndNotify: function(){
      if ( this.isIOS() && !this.isStandalone() && !$.cookie( IOS_COOKIE ) ) {
        alert( "We've detected you're on an iOS device. CalleApp works best installed to your homescreen." );
        $.cookie( IOS_COOKIE, '1' )
      }
    },

    isIOS: function(){
      // I don't like doing this sort of thing, but meh.
      return  (navigator.userAgent.match(/iPhone/i)) || 
              (navigator.userAgent.match(/iPod/i))    || 
              (navigator.userAgent.match(/iPad/i))
    },

    isStandalone: function(){
      return ('standalone' in navigator && navigator.standalone)
    }
    
  });

  return AppView;

})