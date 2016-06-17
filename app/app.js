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
        // Impede que as barras da url sejam removidas
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

    // -> verificar se o usuário está logado. Registrar um evento de mudança de rota pra que
    // toda hora que ele mudar de url verificar se está logado
    // como?
    //   verifica se o usuário está no cookie, se estiver é só pegar os atributos do cookie
    // se não estiver setar como is_authenticated = false
    function checkUserAuthentication($rootScope, $location, $cookies, $http, UserSession) {
        var url, mock;

        $rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.currentUser) {
            mock = {};
            mock.is_authenticated = true;
            UserSession.setUser(mock);

            url = 'http://localhost:5000/user/' + $rootScope.globals.currentUser.id;

            $http.get(url)
                .success(function successCallback(data) {
                    UserSession.setUser(data);
                })
                .error(function errorCallback(response) {
                    console.log("Erro ao recuperar usuário logado. Resposta do servidor: " + response);
                });

        } else {
            mock = {};
            mock.is_authenticated = false;
            UserSession.setUser(mock);
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            var path, regMatchOngsPages, publicPages, isRestrictedPage, isAuthenticated;
            path = $location.path();
            publicPages = ['', '/login', '/signup', '/pesquisar'];
            isRestrictedPage = _.indexOf(publicPages, path) === -1;
            regMatchOngsPages = /ong\//;
            isRestrictedPage = isRestrictedPage && !regMatchOngsPages.test(path);
            isAuthenticated = UserSession.isAuthenticated();
            if (isRestrictedPage && !isAuthenticated) {
                $location.path('/login');
            }
        });
    }

    function analytics(Analytics) {}

})(angular);
