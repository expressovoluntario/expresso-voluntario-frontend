/* globals angular:false */
(function (angular) {
    'use strict';

    angular
        .module('expresso.modules.search')
        .factory('SearchResource', SearchResource);

    function SearchResource($resource) {
        return $resource('http://localhost:5000/search/:id', {'id' : '@id'}, {
            'update' : {
                'method' : 'PUT'
            }
        });
    }

})(angular);
