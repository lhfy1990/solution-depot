angular.module('services')
    .factory('userService', function($rootScope) {
        var service = {
            model: {
                _id: ''
            },
            saveState: function() {
                sessionStorage.userService = angular.toJson(service.model);
            },
            restoreState: function() {
                sevice.model = angular.fromJson(sessionStorage.userService);
            }
        };
        $rootScope.$on("savestate", service.SaveState);
        $rootScope.$on("restorestate", service.RestoreState);
        return service;
    });