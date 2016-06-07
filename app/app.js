/* globals angular:false */
(function (angular) {
    'use strict';

    var dependencies = [
        'ui.router',
        'ngMaterial',
        'ngMessages',
        'ngResource',
        'ngCookies',
        'angular-google-analytics',
        'expresso.components',
        'expresso.modules'
    ];

    angular
        .module('MyApp', dependencies)
        .config(config)
        .run(checkUserAuthentication)
        .run(analytics)


    function config($mdThemingProvider, $httpProvider, $resourceProvider, AnalyticsProvider) {
        // Não remover as barras da url
        $resourceProvider.defaults.stripTrailingSlashes = false;

        // Configura a paleta de cores do angular material
        _setAngularMaterial($mdThemingProvider);

        // Configura o Google Analytics
        _setGoogleAnalytics(AnalyticsProvider);
    }

    function _setAngularMaterial($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('amber');
    }

    function _setGoogleAnalytics(AnalyticsProvider) {
        AnalyticsProvider
            .setAccount('UA-67297111-2')
            .setPageEvent('$stateChangeSuccess');
    }

    function checkUserAuthentication($rootScope, $location, $cookies, $http, UserSession) {
        var url;

        $rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.currentUser) {
            url = 'http://localhost:5000/user/' + $rootScope.globals.currentUser.id;

            $http.get(url)
                .success(function successCallback(data) {
                    UserSession.setUser(data);

                    $rootScope.$on('$locationChangeStart', function (event, next, current) {
                        var path, publicPages, isRestrictedPage, isAuthenticated;
                        path = $location.path();
                        publicPages = ['', '/login', '/signup'];
                        isRestrictedPage = _.indexOf(publicPages, path) === -1;
                        isAuthenticated = UserSession.isAuthenticated();
                        if (isRestrictedPage && !isAuthenticated) {
                            $location.path('/login');
                        }
                    });
                })
                .error(function errorCallback(response) {
                    console.log("Erro ao recuperar usuário logado. Resposta do servidor: " + response);
                });
        }
    }

    function analytics(Analytics) {}

})(angular);
