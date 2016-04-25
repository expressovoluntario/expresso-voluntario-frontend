/* globals angular:false */
(function (angular) {
    'use strict';

    var login = angular.module('expresso.modules.login');

    login.directive('loginCard', function () {
        return {
            'restrict': 'E',
            'templateUrl': '/app/modules/login/directives/loginCard.html',
            'scope': {
                'role' : '='
            },
            'controller': loginCardCtrl,
            'controllerAs': 'controller'
        }
    });

    function loginCardCtrl($location, OngResource) {
        var controller = this;
        init();

        function init() {
            controller.ong = undefined;
            controller.email = undefined;
            controller.password = undefined;
            controller.confirmPassword = undefined;
            controller.ongResource = new OngResource();

            controller.isSectionVisible = isSectionVisible;
            controller.registerOng = registerOng;
            controller.submitFormLogin = submitFormLogin;
        }

        function submitFormLogin() {
            var path, isPasswordValid, isEmailAvailable;

            path = $location.path();

            if (path === '/signup') {
                isPasswordValid = _matchPassword(controller.password, controller.confirmPassword);
                isEmailAvailable = _isEmailAvailble(controller.email);

                if (isPasswordValid && isEmailAvailable) {
                    controller.ongResource.email = controller.email;
                    controller.ongResource.$save().then(function(){
                        console.log('salvou porra :D');
                    });
                }
            }
            else if (path === '/login') {

            }
        }

        // Retorna se a seção (login, signup...) deve estar visível
        function isSectionVisible(role) {
            var path;
            path = $location.path();
            role = '/' + role;
            return role === path;
        }

        // Cadastra a ONG e o usuário na ONG
        function registerOng(signupForm) {
            var isSignupFormValid;
            isSignupFormValid = _validateSignupForm(signupForm);

            if (isSignupFormValid) {
                // fazer o POST
            }
        }

        // Valida se a senha combina com a senha de confirmação
        function _matchPassword(password1, password2) {
            return password1 === password2;
        }

        // Valida se o e-mail já está sendo utilizado
        function _isEmailAvailble(email) {
            return true;
        }
    }

})(angular);
