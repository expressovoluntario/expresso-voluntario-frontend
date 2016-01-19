/*globals angular:false*/
(function(angular) {
    'use strict';

    var home;
    home = angular.module('expresso.modules.home');
    home.controller('HomeCtrl', HomeCtrl);

    function HomeCtrl($scope, $http) {
        $scope.email;
        $scope.interest;
        $scope.messageFeedback;
        $scope.sendForm = sendForm;

        function sendForm() {
            var params;
            params = {
                'email' : $scope.email,
                'interesse' : $scope.interest
            };

           $http.post("https://sheetsu.com/apis/d009a995", params)
                .success(function(data, status) {
                    console.log(data);
                });
        }

    }
})(angular);
