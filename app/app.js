/* globals angular:false */
(function (angular) {
    'use strict';

    var dependencies = [
        'ui.router',
        'ngMaterial',
        'ngMessages',
        'ngResource',
        'angular-google-analytics',
        'expresso.components',
        'expresso.modules'
    ];

    angular
        .module('MyApp', dependencies)
        .config(config)
        .run(analytics)


    function config($mdThemingProvider, $httpProvider, $resourceProvider, AnalyticsProvider) {
        // Não remover as barras da url
        $resourceProvider.defaults.stripTrailingSlashes = false;

        // Configura a paleta de cores do angular material
        setAngularMaterial($mdThemingProvider);

        // Configura o Google Analytics
        setGoogleAnalytics(AnalyticsProvider);
    }

    function setAngularMaterial($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('amber');
    }

    function setGoogleAnalytics(AnalyticsProvider) {
        AnalyticsProvider
            .setAccount('UA-67297111-2')
            .setPageEvent('$stateChangeSuccess');
    }

    function analytics(Analytics) {}

})(angular);
