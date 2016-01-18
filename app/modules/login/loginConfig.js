(function(angular) {
    'use strict'

    var login;
    login = angular.module('expresso.modules.login', []);
    login.config(config);

    function config ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("404");

        $stateProvider
            .state('login', {
                url: "/login",
                templateUrl: "/app/modules/login/login.html"
            });
    }

})(angular);
