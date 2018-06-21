angular.module('home')
  .controller('homeController', function($scope, $http) {
    let is_active_burger = false;
    this.toggle_burger = () => {
      this.is_active_burger = !this.is_active_burger;
    };
  });