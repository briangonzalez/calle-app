
define([
    'backbone', 
    'jquery',
    'views/sidebar-base',
    'routes'
  ], 

  function(Backbone, $, SidebarBaseView, routes){

    var START_THRESHOLD = 50;
    var SNAP_DURATION   = 200;
    var TOGGLE_CLASS    = 'pop-out';
    var SEARCH_ICON     = 'images/icon-search.svg';
    var CLEAR_ICON      = 'images/icon-clear.svg';

    var SidebarMainView = SidebarBaseView.extend({
      el: '.sidebar.main',
      events: {
        'click .info' :           'showInfoOverlay',
        'click .logo .name':      'showInfoOverlay',
        'click .toggle' :         'toggle',
        'click .locate' :         'locate',
        'click .random' :         'random',
        'keyup .search':          'handleSearchKeypress',
        'focus .search':          'clearSearch',
        'click .search-wrap img': 'clearSearch',
        'blur .search':           'showLastQuery'
      },

      initialize: function(){
        SidebarBaseView.prototype.initialize.call(this);

        this.$searchWrap  = this.$el.find('.search-wrap');
        this.$search      = this.$el.find('.search');
        this.$searchIcon  = this.$el.find('.search-wrap img');

        this.handleOrientationChange();
        return this;
      },

      toggle: function(ev){
        this.$toggle.toggleClass( TOGGLE_CLASS );
        this.out() ? this.moveIn() : this.moveOut();
      },

      random: function(ev){
        var c     = Calle.MapView.collection.toArray();
        var model =  c[ _.random(c.length) ];
        Calle.SidebarInfoView.show(model);
      },

      locate: function(){
        var self = this;
        this.moveIn();
        setTimeout(function(){ Calle.MapView.centerSelf() }, 700);
      },

      handleSearchKeypress: function(ev){
        var val     = this.$search.val();
        this.$searchIcon.attr('src', CLEAR_ICON)
        
        if ( ev.which == 13 ) {
          this.search();
          this.lastQuery = val;
          this.searching = true;
          this.$search.addClass('active')
                 .blur();
          this.moveIn();
        } 

        if ( this.searching && val === '' ){
          this.clearSearch();
        }

      },

      search: function(query){
        var query = this.$search.val();

        $.ajax({
          url: routes.trucks.search,
          data: { q: query },
          success: function(d){
            Calle.AppView.updateCounter( d.length, 'found' ); 
            window.Calle.MapView.collection.reset(d)
          }
        });

      },

      clearSearch: function(search){
        this.$search.val('');
        this.$searchIcon.attr('src', SEARCH_ICON);
        this.$search.removeClass('active')

        if ( search === true ){
          Calle.MapView.findTrucksOnMap();
          this.searching = false;
          this.$search.removeClass('active')
        }

      },

      showLastQuery: function(){
        if ( this.lastQuery && this.searching ) {
          this.$searchIcon.attr('src', CLEAR_ICON);
          this.$search.addClass('active')
                      .val(this.lastQuery)
        }
      },

      showInfoOverlay: function(){
        Calle.AppView.showOverlay('info'); 
      },

      handleOrientationChange: function(){
        var self = this;
        $window.on('orientationchange resize', function(){
          self.moveOut()
        })
      }

    });

    return SidebarMainView;

})