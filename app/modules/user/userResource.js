/* globals angular:false */
(function (angular) {
    'use strict';

    angular
        .module('expresso.modules.user')
        .factory('UserResource', UserResource);

    function UserResource($resource) {
        return $resource('http://localhost:5000/user/:_id/', {'_id' : '@_id'}, {
            'update' : {
                'method' : 'PUT'
            }
        });
    }

})(angular);
