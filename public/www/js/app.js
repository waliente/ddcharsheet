angular.module('dd-charsheet', [

  'ionic',
  'webStorage',

  /** MY MODULES **/

  'app.controllers',
  'app.services'

])

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

.config(function($stateProvider, $urlRouterProvider, $localStorageProvider, $httpProvider) {

  $httpProvider.interceptors.push('AuthInterceptor');

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl',
      free: true
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'SignUpCtrl',
      free: true
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'templates/dashboard.html',
      controller: 'DashboardCtrl'
    })
    .state('character', {
      url: '/character-detail/:characterId',
      templateUrl: 'templates/character-detail.html',
      controller: 'CharacterCtrl'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/dashboard');

  // SET PREFIX
  $localStorageProvider.setPrefix('ddcharsheet_');

})

.controller('AppCtrl', function ($rootScope) {

})

;
