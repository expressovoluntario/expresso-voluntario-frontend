/* globals angular:false */
(function (angular) {
    'use strict';

    angular
        .module('expresso.modules.ong')
        .factory('OngResource', OngResource);

    function OngResource($resource) {
        return $resource('http://localhost:5000/ong/:_id/', {'_id' : '@_id'}, {
            'update' : {
                'method' : 'PUT'
            }
        });
    }

})(angular);
