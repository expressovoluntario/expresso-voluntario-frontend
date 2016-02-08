(function (angular) {
    'use strict';

    var expresso;
    expresso = angular.module('MyApp', [
        'ui.router',
        'ngMaterial',
        'angular-google-analytics',

        'expresso.components',
        'expresso.modules'
    ]);

    expresso.config(function($mdThemingProvider, AnalyticsProvider) {

        // Configura a paleta de cores do angular material
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('amber');

        // Configura o Google Analytics
        AnalyticsProvider
            .setAccount('UA-67297111-2')
            .setPageEvent('$stateChangeSuccess');
    });

    expresso.run(function(Analytics) {});

})(angular);
