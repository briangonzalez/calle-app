// Your app goes here.
require([
    'jquery', 
    'views/app',
    'views/map',
    'views/sidebar-main',
    'views/sidebar-info'
  ], function($, AppView, MapView, SidebarMainView, SidebarInfoView) {

  $(document).ready(function(){
    window.Calle = {};
    Calle.MapView           = new MapView().render();
    Calle.AppView           = new AppView().render();
    Calle.SidebarMainView   = new SidebarMainView().render();
    Calle.SidebarInfoView   = new SidebarInfoView().render();
  });

});