/* globals angular:false */
(function (angular) {
    'use strict';

    angular
        .module('expresso.modules.login')
        .factory('LoginResource', LoginResource);

    function LoginResource($resource) {
        return $resource('url', {'_id' : '@_id'}, {
            'update' : {
                'method' : 'PUT'
            }
        });
    }

})(angular);
