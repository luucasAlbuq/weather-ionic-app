# Weather App
Weather App using Ionic 1 and DarkSky api

Functionalities
1. Currently weather information
2. Weekly weather information

Required installation
1. Install: cordova plugin add cordova-plugin-geolocation
2. Install: bower install ngCordova 

Import the cordova dependece to www/index.html
<script src="lib/ngCordova/dist/ng-cordova.js"></script> 

Add the cordova dependeve to the angular module, localtion www/js/app.js
angular.module('weather', ['ionic', 'ngCordova'])