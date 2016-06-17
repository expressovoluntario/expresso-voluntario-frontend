/* globals angular:false */
(function (angular) {
    'use strict';

    angular
        .module('expresso.modules', [
            'expresso.modules.home',
            'expresso.modules.index',
            'expresso.modules.login',
            'expresso.modules.ong',
            'expresso.modules.search',
            'expresso.modules.services',
            'expresso.modules.sharedTemplates',
            'expresso.modules.task',
            'expresso.modules.user'
        ]);

})(angular);
