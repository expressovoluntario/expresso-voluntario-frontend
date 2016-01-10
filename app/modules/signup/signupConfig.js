(function(angular) {
    'use strict'

    var signup;
    signup = angular.module('expresso.modules.signup', []);
    signup.config(config);

    function config ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("404");

        $stateProvider
            .state('signup', {
                url: "/signup",
                templateUrl: "/app/modules/signup/signup.html"
            });
    }

})(angular);
