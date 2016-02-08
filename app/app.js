(function (angular) {
    'use strict';

    var expresso;
    expresso = angular.module('MyApp', [
        'ui.router',
        'ngMaterial',

        'expresso.components',
        'expresso.modules'
    ]);

    // Configura a paleta de cores do angular material
    expresso.config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('amber');
    });

})(angular);
