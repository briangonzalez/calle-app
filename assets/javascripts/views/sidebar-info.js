
define([
    'backbone', 
    'jquery',
    'views/sidebar-base'
  ], 

  function(Backbone, $, SidebarBaseView){

    var SidebarInfoView = SidebarBaseView.extend({
      el: '.sidebar.truck-info',
      events: {
        'click .close' : 'moveIn'
      },

      initialize: function(){
        this.$content  = this.$el.find('.content');
        SidebarBaseView.prototype.initialize.call(this);
        return this;
      },

      moveIn: function(){
        this.updateDimensions();
        this.moveTo( -this.width );
        this.$el.attr('data-location', 'in');
      },

      show: function(model){

        Calle.SidebarMainView.moveIn();

        if ( this.model && this.model.get('id') === model.get('id') ){
            this.moveOut();
            return;
          }

        this.resetMarker();
        this.model = model;

        var marker = model.get('marker');
        marker.setIcon( new google.maps.MarkerImage('/images/marker-truck-red.png', null, null, null, new google.maps.Size(40, 40) ) )
        calleMap.panTo( marker.getPosition() );

        this.moveIn();
        this.draw(model);
        this.moveOut();
      },

      resetMarker: function(){
        if ( this.model ){
          this.model.get('marker').setIcon(
            new google.maps.MarkerImage('/images/marker-truck.png', null, null, null, new google.maps.Size(40, 40) )
          );
        }
      },

      draw: function(){
        this.$content.html( 
          _.template( this.template(), this.model.attributes ) 
        );
      },

      template: function(){
        html = [];
        html.push("<h2><%= name %></h2>")
        html.push("<h5><%= address %></h5>")
        html.push("<p><%= food_items%></p>")
        return html.join('');
      }

    });

    return SidebarInfoView;

})