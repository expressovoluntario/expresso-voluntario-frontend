/* globals angular:false */
(function (angular) {
    'use strict';

    angular
        .module('expresso.modules.task')
        .factory('TaskResource', TaskResource);

    function TaskResource($resource) {
        return $resource('http://localhost:5000/task/:id', {'id' : '@id'}, {
            'update' : {
                'method' : 'PUT'
            }
        });
    }

})(angular);
