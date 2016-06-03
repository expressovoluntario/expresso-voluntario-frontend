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
            // controller.isEditing = false;
            controller.currentTab = 'tasks';
            controller.taskTags = [];
            controller.taskStatus = getStatusOptions();
            controller.taskStatusSelected = null;
            controller.taskRecurrence = getRecurrenceOptions();
            controller.taskRecurrenceSelected = null;
            controller.taskDescription = null;

            // controller.toggleEdit = toggleEdit;
            controller.setCurrentTab = setCurrentTab;
            controller.isCurrentTab = isCurrentTab;
        }

        // TASK
        function getRecurrenceOptions() {
            var options = ['única', 'recorrente'];
            options = options.map(function(option) {
                return { label : option };
            });
            return options;
        }

        // TASK
        function getStatusOptions() {
            var options = ['aberto', 'concluído', 'andamento'];
            options = options.map(function(option) {
                return { label : option };
            });
            return options;
        }


        function setCurrentTab(tab) {
            controller.currentTab = tab;
        }

        function isCurrentTab(tab) {
            return controller.currentTab === tab;
        }
    }
})(angular);
