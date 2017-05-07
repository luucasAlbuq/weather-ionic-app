// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('weather-app', ['ionic', 'starter.controllers', 'starter.services','ngCordova'])


.factory('weather', function($q,$http){
  var deferred = $q.defer();

  function getCurrentWeather(lat,lng){
    var url = 'https://api.forecast.io/forecast/91cb9493e810db2c9e922ca08c773720/' + lat +',' + lng + '?units=si&callback=JSON_CALLBACK';
    $http.jsonp(url).success(deferred.resolve).error(deferred.reject);
    return deferred.promise;
  }

  return{
    getCurrentWeather: getCurrentWeather
  };

})

.controller('weatherCtrl', function($scope,  $ionicModal, $cordovaGeolocation, weather){
  $scope.view = 'currentlyView'
  $scope.weekDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
  $scope.loading = true;
  $scope.weatherInfo  = {};
  $scope.currently = {};
  $scope.weekly = {};
  $scope.selectedDay = {};

  $scope.selectDay = function(index){
    $scope.selectedDay = $scope.weekly.data[index];
    $scope.selectDay.dayName = $scope.getDayName(index);
    $scope.openDayDetailModal();
  }

  $scope.getDayName = function(index){
    var currentDay = new Date().getDay();
    var dayReturnIndex =+ index;
    if(dayReturnIndex > 8){
      dayReturnIndex -= 8;
    }
    return $scope.weekDays[dayReturnIndex];
  }

  $scope.toKmh = function(mlh){
    return (mlh*0.621371192237).toFixed(1);
  }

  $cordovaGeolocation.getCurrentPosition({timeout: 10000,enableHighAccuracy: false})
    .then(function(position){
            var lat = position.coords.latitude;
            var long = position.coords.longitude;

            weather.getCurrentWeather(lat,long).then(function(data){
              console.log("*****",data)
              $scope.weatherInfo = data;
              $scope.currently = data.currently;
              $scope.weekly = data.daily;
              $scope.loading = false;
            }, function(error){
              console.log(">>> ERROR:",error);
            });
          },
          function(error){
            console.log(">>> ERROR:",error);
          }
  );

  //Configuring the views
  $ionicModal.fromTemplateUrl('../views//day_weather_details.html',{
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal){
    $scope.dayDetailView = modal;
  });

  $scope.openDayDetailModal = function(){
    $scope.dayDetailView.show();
  }

  $scope.closeDayDetailModal = function(){
    $scope.dayDetailView.hide();
  }

  $scope.openWeeklyView = function(){
    $scope.view = 'weeklyView';
  }

  $scope.openCurrentlyView = function(){
     $scope.view = 'currentlyView';
  }

})

/*******************************************************************************************************/
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
/*******************************************************************************************************/