'use strict';

var app = angular.module('restApp', ['ngRoute', 'modules']);

app.config(function($routeProvider) {
  $routeProvider
    .when('/home', {
      templateUrl: 'app/components/home/homeView.html'
    })
    .when('/dashboard', {
      templateUrl: 'app/components/dashboard/dashboardView.html'
    })
    .otherwise({
      redirectTo: '/home'
    });
});