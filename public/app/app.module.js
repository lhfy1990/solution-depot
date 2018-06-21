var home = angular.module('home', []);
var dashboard = angular.module('dashboard', []);
var directives = angular.module('directives', []);
var services = angular.module('services', []);
var module = angular.module('modules', ['home', 'dashboard', 'directives','services']);