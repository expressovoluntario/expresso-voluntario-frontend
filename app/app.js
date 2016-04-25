(function (angular) {
    'use strict';

    var expresso;
    expresso = angular.module('MyApp', [
        'ui.router',
        'ngMaterial',
        'ngMessages',
        'ngResource',
        'angular-google-analytics',

        'expresso.components',
        'expresso.modules'
    ]);

    expresso.config(function($mdThemingProvider, $httpProvider, $resourceProvider, AnalyticsProvider) {

        // dont remove trailing slashes from urls
        $resourceProvider.defaults.stripTrailingSlashes = false;

        // Configura a paleta de cores do angular material
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('amber');

        // Configura o $httpProvider (para o CORS funfar)
        $httpProvider.defaults.headers.common = {};
        $httpProvider.defaults.headers.post = {};
        $httpProvider.defaults.headers.put = {};
        $httpProvider.defaults.headers.patch = {};
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        // Configura o Google Analytics
        AnalyticsProvider
            .setAccount('UA-67297111-2')
            .setPageEvent('$stateChangeSuccess');
    });

    expresso.run(function(Analytics) {});

})(angular);
