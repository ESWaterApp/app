angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('waterUCI', {
    url: '/splash',
    templateUrl: 'templates/waterUCI.html',
    controller: 'waterUCICtrl'
  })

  .state('verifyLocation', {
    url: '/gps',
    templateUrl: 'templates/verifyLocation.html',
    controller: 'verifyLocationCtrl'
  })

  .state('takePicture', {
    url: '/camera',
    templateUrl: 'templates/takePicture.html',
    controller: 'takePictureCtrl'
  })

  .state('confirm', {
    url: '/confirm',
    templateUrl: 'templates/confirm.html',
    controller: 'confirmCtrl'
  })

  .state('finish', {
    url: '/finish',
    templateUrl: 'templates/finish.html',
    controller: 'finishCtrl'
  })

  .state('thankYou', {
    url: '/thanks',
    templateUrl: 'templates/thankYou.html',
    controller: 'thankYouCtrl'
  })

$urlRouterProvider.otherwise('/splash')

  

});