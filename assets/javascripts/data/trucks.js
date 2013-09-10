define([
  'backbone',
  'routes'
], function(Backbone, routes){

  var TruckModel = Backbone.Model.extend({
    initialize: function(){

      var self = this;

      var marker = new google.maps.Marker({
        map:          window.calleMap,
        // animation:    google.maps.Animation.DROP,
        position:     new google.maps.LatLng( this.get('lat_lng')[0], this.get('lat_lng')[1] ),
        icon:         new google.maps.MarkerImage('images/marker-truck.png', null, null, null, new google.maps.Size(40, 40) )
      });
      this.set('marker', marker)

      google.maps.event.addListener(marker, 'click', function() {
        Calle.SidebarInfoView.show(self);
      });

    }, 
    destroy: function(){ this.get('marker').setMap(null) },
  });

  var TruckCollection = Backbone.Collection.extend({
    model:  TruckModel,
    reset: function(models, options){
      _.invoke(this.models, 'destroy');
      Backbone.Collection.prototype.reset.call(this, models, options);
    },
    add: function (trucks) { 
      //  When we add trucks, we want to make sure their unique
      //  to the collection. This little chunk of code ensures
      //  this to be the case.

      if ( _.isArray(trucks) ) {
        var self = this;
        _.each(trucks, function(truck){
          if ( !self.findWhere({ id: truck.id } )) {
            Backbone.Collection.prototype.add.call(self, truck);
          }
        });
      }
      else {
        Backbone.Collection.prototype.add.call(self, trucks);
      }
    }
  });
  
  return TruckCollection;

});