/* globals angular:false */
(function(angular) {
    'use strict';

    angular
        .module('expresso.modules.ong')
        .controller('OngCtrl', OngCtrl);

    function OngCtrl() {
        var controller = this;
        init();

        function init() {
            controller.isEditing = false;
            controller.currentTab = 'tasks';

            controller.toggleEdit = toggleEdit;
            controller.setCurrentTab = setCurrentTab;
            controller.isCurrentTab = isCurrentTab;
        }

        function toggleEdit() {
            controller.isEditing = !controller.isEditing;
        }

        function setCurrentTab(tab) {
            controller.currentTab = tab;
        }

        function isCurrentTab(tab) {
            return controller.currentTab === tab;
        }
    }
})(angular);
