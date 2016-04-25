(function(angular) {
    'use strict'

    angular
        .module('expresso.modules.login', [])
        .config(config);

    function config ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("404");

        $stateProvider
            .state('login', {
                url: "/login",
                templateUrl: "/app/modules/login/login.html"
            })

            .state('signup', {
                url: "/signup",
                templateUrl: "/app/modules/login/login.html"
            });
    }

})(angular);
