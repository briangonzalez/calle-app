
define([
  'backbone', 
  'jquery',
  'pep'
  ], 

  function(Backbone){

    var START_THRESHOLD = 50;
    var SNAP_DURATION   = 200;
    var TOGGLE_CLASS    = 'pop-out';

    var SidebarBaseView = Backbone.View.extend({
      el: null,
      events: {
        'click .toggle' : 'toggle'
      },

      initialize: function(){
        this.$toggle = this.$el.find('.toggle')
        this.updateDimensions();
        this.pepify();

        if ( $window.width() < this.width + 100 )
          this.moveIn();
      },

      updateDimensions: function(){
        this.width  = this.$el.width();
        this.height = this.$el.height();
      },

      moveTo: function(val){
        this.$el.animate({ left: val }, SNAP_DURATION, 'easeOutExpo');
      },

      moveIn: function(){
        this.updateDimensions();
        this.moveTo( -this.width + 50 );
        this.$el.attr('data-location', 'in');
        this.$toggle.addClass( TOGGLE_CLASS );
      },

      moveOut: function(){
        this.updateDimensions();
        this.moveTo(0);
        this.$el.attr('data-location', 'out');
        this.$toggle.removeClass( TOGGLE_CLASS );
      },

      out: function(){
        return this.$el.attr('data-location') == 'out';
      },

      in: function(){
        return this.$el.attr('data-location') == 'in';
      },

      pepify: function(){
        var self = this;

        this.$el.pep({
          initiate: function(ev){
            var $target = $(ev.originalEvent.target); 
            
            if( $target.hasClass('no-pep') )
              return false;
          },
          drag: function(){
            var ev      = this.normalizeEvent( this.moveEvent );
            var initialDx  = Math.abs(this.startX - ev.pep.x);
            var initialDy  = Math.abs(this.startY - ev.pep.y);
          },
          stop: function(ev){
            
            if ( self.out() ) {
              this.started ? self.moveIn() : self.moveOut();
            } else {
              this.started ? self.moveOut() : self.moveIn()
            } 

          },
          axis: 'x',
          useCSSTranslation: false,
          shouldEase: false,
          constrainTo: [false, 0, false, -self.width + 50],
          startThreshold: [START_THRESHOLD, 10000000] // value is arbitrary here.
        });

      }

    });

    return SidebarBaseView;

})