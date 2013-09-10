
define([], 

  function(){
  
  var routes = {

    trucks: {
      base:     'trucks',
      all:      'trucks/all',
      nearby:   'trucks/nearby',
      onMap:    'trucks/onmap',
      search:   'trucks/search',
    }

  };

  return routes;

})