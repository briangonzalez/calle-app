# <img src="https://rawgithub.com/briangonzalez/calle-app/master/assets/images/icon-truck-grey.svg" width=25 style="margin-right: 10px">  CalleApp

El ultimo SF food truck locator. __[Check it out!](http://briangonzalez.org/calle)__

## About

CalleApp was built for a coding challenge, and works great and both desktop and mobile devices. On iOS, CalleApp works best when added to your homescreen. 

## Technologies

### Backend

- Sinatra
- Geocoder rubygem
- Capistrano (deployment)
- JSON flat-file datastore

### Frontend

- backbone
- require
- Google Maps
- jquery.pep
- jquery.cookie
- Compass & Sass

## Spec

1. Find food trucks nearby by rating & cuisine
1. Search for trucks by keyword
1. Allow user to locate themselves
1. Get directions to said trucks (nixing for time's sake)

## Starting in development

```bash
$ rake start
```

## Icons

- [Food Truck](http://thenounproject.com/noun/food-truck/?dwn=CCBY&dwn_icon=19890#icon-No19890) by Kyle Tezak
- [Search](http://thenounproject.com/noun/search/#icon-No15440) by Alex S. Lakas
- [Shuffle](http://thenounproject.com/noun/shuffle/#icon-No5050) by Dmitry Baranovskiy
- [Utensils](http://thenounproject.com/noun/utensils/#icon-No10963) by Dmitry Baranovskiy
- [Right Arrow](http://thenounproject.com/noun/right-arrow/#icon-No21828) by Michael Zenaty 
- [Close Icon](http://thenounproject.com/noun/close/#icon-No15425) by Alex S. Lakas 
- [Others](http://fortawesome.github.io/Font-Awesome/) from Font Awesome 

## Todo

- Turn SVG icons into icon fonts
- Modularize CSS
- Remove misplaced logic in Backbone models
- Make icons, colors, etc. more consistent
- Lint code and write tests
- Consolidate crowded map markers
- Add ability to get directions to truck, view tweets about truck, etc.
- Improve accessibility
- More rigid to vertical grid
- Use hashbang to anchor to trucks 
- Make backend more RESTful
- Document source code better
- Add images for trucks

## Notes

- [UI for styling Google Maps](http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html)
- [Favicon Cheatsheet](https://github.com/audreyr/favicon-cheat-sheet)

## Why I chose these technologies?

### Frontend

[Backbone](http://backbonejs.org/) is fast and more flexible than most other MV* frontend frameworks. Using backbone also gives me the excuse of including [underscore](http://underscorejs.org/) in my apps. I like [requirejs](http://requirejs.org/) for dependency management. I also used [jquery.pep.js](http://pep.briangonzalez.org) for the dragging of the left-hand sidebars.

### Backend

[Sinatra](http://www.sinatrarb.com/) is trivially easy to setup, has a great commnunity (IRC, Google Groups, etc.), and uses a language I am already familiar with, Ruby. Sinatra also uses Rack middleware, which the community has buit a ton of extensions for.
Using Sinatra also gives me access to a plethora of rubygems, like [geocoder](http://www.rubygeocoder.com/), which I used in building Calle.

### Code Highlights

- [7 line search engine](https://github.com/briangonzalez/calle-app/blob/master/lib/trucks.rb#L19)
- [Geographical distance in javascript](https://github.com/briangonzalez/calle-app/blob/master/assets/javascripts/geo.js)
- [Homebrewed RPC!](https://github.com/briangonzalez/calle-app/blob/master/app.rb#L36)
- [jquery.pep.js](http://pep.briangonzalez.org) - glad I got to use my own plugin in a project!

## About Me

You can read more about me on my [website's about](http://briangonzalez.org/about). There, you'll also find an updated (hopefully) résümé (sp?).




