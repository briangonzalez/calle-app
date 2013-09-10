requirejs.config({
    "baseUrl": "javascripts",
    "paths": {
      "jquery":       "lib/jquery",
      "underscore":   "lib/lodash",
      "backbone":     "lib/backbone",
      "pep":          "lib/jquery.pep",
      "cookie":       "lib/jquery.cookie",
      "async":        "lib/require.async",
      "fastclick":    "lib/fastclick"
    },
  shim: {
    "jquery": {
      exports: "$"
    },

    "pep": {
      deps: ["jquery"],
      exports: "$"
    },

    "underscore": {
      exports: "_"
    },

    "backbone": {
      deps: ["jquery", "underscore"],
      exports: "Backbone"
    }
  },
  waitSeconds : 120
});

// Load the main app module to start the app
requirejs(["main"]);