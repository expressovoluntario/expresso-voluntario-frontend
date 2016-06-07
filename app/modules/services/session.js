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

    function UserSession($http, $location, UserResource) {
        var user = {}, ong = {};

        return {
            login : function(email, password) {
                $http({
                    method: 'GET',
                    url: 'http://localhost:5000/user/login',
                    params: {
                        'email': email,
                        'password': password
                    }
                }).then(function successCallback(response) {
                    user.id = response.data.id;
                    user.name = response.data.name;
                    user.email = response.data.email;
                    user.isAuthenticated = response.data.is_authenticated;
                    ong.id = response.data.ong_id;
                    $location.path('/home/' + ong.id);
                }, function errorCallback(response) {
                    console.log("Erro ao realizar login. Resposta do servidor: " + response);
                });
            },

            logout : function() {
                $http({
                    method: 'GET',
                    url: 'http://localhost:5000/user/logout'
                }).then(function successCallback(response) {
                    user = {};
                    ong = {};
                    $location.path('/login');
                }, function errorCallback(response) {
                    console.log("Erro ao realizar logout. Resposta do servidor: " + response);
                });
            },

            getUser : function() {
                return user;
            },

            getOng : function() {
                return ong;
            },

            isAuthenticated : function () {
                if (!_.isEmpty(user)) {
                    return user.isAuthenticated;
                }
                return false;
            }
        };
    }

})(angular);
