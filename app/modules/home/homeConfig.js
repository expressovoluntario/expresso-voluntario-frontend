/*globals angular:false*/
(function (angular) {
    'use strict';

    var home;
    home = angular.module('expresso.modules.home', [])
    home.config(config);

    function config($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("404");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/app/modules/home/home.html',
                controller: 'HomeCtrl'
            })
            .state('home2', {
                url: '',
                templateUrl: '/app/modules/home/home.html',
                controller: 'HomeCtrl'
            });
    }
})(angular);
