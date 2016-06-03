(function(angular) {
    'use strict'

    angular
        .module('expresso.modules.user', [])
        .config(config);

        function config ($stateProvider, $urlRouterProvider) {
            // $urlRouterProvider.otherwise("404");
            //
            // $stateProvider
            //     .state('profile', {
            //         url: "/profile",
            //         templateUrl: "/app/modules/ong/ong.html"
            //     });
        }

})(angular);
