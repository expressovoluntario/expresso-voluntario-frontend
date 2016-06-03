/*globals angular:false*/
(function (angular) {
    'use strict';

    var index;
    index = angular.module('expresso.modules.index', [])
    index.config(config);

    function config($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("404");

        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: '/app/modules/index/index.html',
                controller: 'IndexCtrl'
            })
            .state('index2', {
                url: '',
                templateUrl: '/app/modules/index/index.html',
                controller: 'IndexCtrl'
            });
    }
})(angular);
