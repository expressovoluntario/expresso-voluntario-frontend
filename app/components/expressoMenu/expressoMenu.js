/* globals angular:false */
(function (angular) {
    'use strict';

    angular
        .module('expresso.components')
        .directive('expressoMenu', expressoMenu)
        .controller('expressoMenuCtrl', expressoMenuCtrl)

     function expressoMenu() {
        return {
            'restrict': 'E',
            'templateUrl': '/app/components/expressoMenu/expressoMenu.html',
            'scope': {},
            'controller': expressoMenuCtrl,
            'controllerAs': 'controller'
        }
    }

    function expressoMenuCtrl(UserSession) {
        var controller = this, originatorEv;
        init();

        function init() {
            controller.isUserAuthenticated = isUserAuthenticated;
            controller.logout = logout;
            controller.openMenu = openMenu;
        }

        function isUserAuthenticated() {
            return UserSession.isAuthenticated();
        }

        function logout() {
            UserSession.logout();
        }

        function openMenu($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        }
    }
})(angular);
