/* globals angular:false */
(function(angular) {
    'use strict';

    angular
        .module('expresso.modules.login')
        .controller('LoginCtrl', LoginCtrl);

    function LoginCtrl($scope, $location) {
        var controller = this;
        init();

        function init() {
            controller.getRole = getRole;
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
