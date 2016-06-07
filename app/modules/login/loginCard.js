/* globals angular:false */
(function (angular) {
    'use strict';

    angular
        .module('expresso.modules.login')
        .directive('loginCard', loginCard);

    function loginCard() {
        return {
            'restrict': 'E',
            'templateUrl': '/app/modules/login/loginCard.html',
            'scope': {
                'role' : '='
            },
            'controller': loginCardCtrl,
            'controllerAs': 'controller'
        }
    }

    function loginCardCtrl($location, OngResource, UserResource, UserSession) {
        var controller = this;
        init();

        function init() {
            controller.ong = undefined;
            controller.email = undefined;
            controller.password = undefined;
            controller.confirmPassword = undefined;
            controller.ongResource = new OngResource();
            controller.user = new UserResource();

            controller.isSectionVisible = isSectionVisible;
            controller.registerOng = registerOng;
            controller.submitFormLogin = submitFormLogin;
        }

        function submitFormLogin() {
            var path, isPasswordValid, isEmailAvailable, ongId;

            path = $location.path();

            if (path === '/signup') {
                isPasswordValid = _matchPassword(controller.password, controller.confirmPassword);
                isEmailAvailable = _isEmailAvailble(controller.email);

                if (isPasswordValid && isEmailAvailable) {
                    controller.ongResource.name = controller.ong;
                    controller.ongResource.$save().then(function(response) {
                        saveFirstUser(response.id);
                    });
                }
            }
            else if (path === '/login') {
                UserSession.login(controller.email, controller.password);
            }
        }

        function saveFirstUser(ongId) {
            var user = new UserResource();
            user.ong_id = ongId;
            user.email = controller.email;
            user.password = controller.password;
            user.$save().then(function(response) {
                $location.path('/home/' + ongId);
            });
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
