/*globals angular:false*/
(function(angular) {
    'use strict';

    var index;
    index = angular.module('expresso.modules.index');
    index.controller('IndexCtrl', IndexCtrl);

    function IndexCtrl($scope, $http) {
        // init variables
        $scope.email;
        $scope.interest;
        $scope.messageFeedback;
        $scope.formState = 'new';

        // init functions
        $scope.sendForm = sendForm;
        $scope.setFormState = setFormState;

        function sendForm() {
            var params;
            params = {
                'email' : $scope.email,
                'interesse' : $scope.interest
            };

            $scope.formState = 'loading';
            $http.post("https://sheetsu.com/apis/d009a995", params)
                .success(function(data, status) {
                    console.log(data);
                    $scope.formState = 'success';
                })
                .error(function(data, status) {
                    console.log(data)
                    $scope.formState = 'error';
                });
        }

        function setFormState(state) {
            $scope.formState = state;
        }

    }
})(angular);
