/* globals angular:false */
(function(angular) {
    'use strict'

    angular
        .module('expresso.modules.login', [])
        .config(config)
        .controller('LoginCtrl', LoginCtrl);

    function config ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("404");

        $stateProvider
            .state('login', {
                url: "/login",
                templateUrl: "/app/modules/login/login.html"
            })

            .state('signup', {
                url: "/signup",
                templateUrl: "/app/modules/login/login.html"
            });
    }

    function LoginCtrl($scope, $location, UserSession) {
        var controller = this;
        init();

        function init() {
            controller.getRole = getRole;
            _redirectHomeIfLogged()
        }

        function _redirectHomeIfLogged() {
            if (UserSession.isAuthenticated()) {
                $location.path('/inicio/tarefas');
            }
        }

        // Retorna qual a função do card (signup, login...) de acordo com a URL
        function getRole() {
            var path;
            path = $location.path();
            path = path.replace('/', '');
            return path;
        }
    }

})(angular);
