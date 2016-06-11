/* globals angular:false */
(function (angular) {
    'use strict';

    angular
        .module('expresso.modules.services', [])
        .factory('UserSession', UserSession)
        .run(RunUserSession);

    function RunUserSession(UserSession) {
        // UserSession.create();
    }

    function UserSession($http, $location, $cookies, $rootScope, UserResource, OngResource) {
        var user = {}, ong = {};

        function _logginUser(email, password) {
            var httpConfig, promise;

            httpConfig = {
                method: 'GET',
                url: 'http://localhost:5000/user/login',
                params: {
                    'email': email,
                    'password': password
                }
            };

            return $http(httpConfig);
        }

        function _getOngById(ong_id) {
            var httpConfig, promise;

            httpConfig = {
                method: 'GET',
                url: 'http://localhost:5000/ong/' + ong_id,
            };
            promise = $http(httpConfig);
            return promise;
        }

        return {
            login : function(email, password) {
                var httpConfig, promiseUser, promiseOng;

                promiseUser = _logginUser(email, password);
                promiseUser.then(
                    function loginSuccessCallback(response) {
                        user = response.data;
                        $rootScope.globals.currentUser = {};
                        $rootScope.globals.currentUser = user;
                        $cookies.putObject('globals', $rootScope.globals);

                        promiseOng = _getOngById(user.ong_id);
                        promiseOng.then(
                            function ongSuccessCallback(response) {
                                ong = response.data;
                                $location.path('/inicio/tarefas');
                            },

                            function ongErrorCallback(response) {
                                console.log("Erro ao realizar login. Response: " + response);
                            }
                        );

                    },

                    function loginErrorCallback(response) {
                        console.log("Erro ao realizar login. Response: " + response);
                    }
                );
            },

            logout : function() {
                $http({
                    method: 'GET',
                    url: 'http://localhost:5000/user/logout'
                }).then(function successCallback(response) {
                    user = {};
                    ong = {};
                    $cookies.remove('globals');
                    $location.path('/login');
                }, function errorCallback(response) {
                    console.log("Erro ao realizar logout. Resposta do servidor: " + response);
                });
            },

            getUser : function() {
                return user;
            },

            setUser : function(newUser) {
                user = newUser;
            },

            getOng : function() {
                return ong;
            },

            isAuthenticated : function () {
                if (!_.isEmpty(user)) {
                    return user.is_authenticated;
                }
                return false;
            }
        };
    }

})(angular);
