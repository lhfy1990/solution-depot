angular.module('directives')
    .directive('appHeader', function() {
        return {
            templateUrl: 'app/shared/header/headerView.html'
        };
    })
    .controller('headerController', ['$rootScope', '$location', 'userService', function($rootScope, $location, userService) {
        let is_active_burger = false;
        let user = userService;
        this.toggle_burger = () => {
            this.is_active_burger = !this.is_active_burger;
        };
        this.getPath = () => {
            return $location.path();
        };
        $rootScope.$on('$rootChangeStart', function(event, next, current) {
            if (sessionStorage.restorestate == "true") {
                $rootScope.$broadcast('restorestate');
                sessionStorage.restorestate = false;
            }
        });
        window.onbeforeunload = function(event) {
            $rootScope.$broadcast('savestate');
            console.log('hi');
        };
    }]);