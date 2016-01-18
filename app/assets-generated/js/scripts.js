(function (angular) {
    'use strict';

    var expresso;
    expresso = angular.module('MyApp', [
        'ui.router',
        'ngMaterial',

        'expresso.components',
        'expresso.modules'
    ]);

})(angular);

angular.module('expresso.components', [
        // Add here the components modules
    ]);

(function (angular) {
    'use strict';

    var home;
    home = angular.module('expresso.modules.home', [])
    home.config(config);

    function config($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("404");

        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "/app/modules/home/home.html"
            })
            .state('home2', {
                url: "",
                templateUrl: "/app/modules/home/home.html"
            });
    }

})(angular);

(function(angular) {
    'use strict'

    var login;
    login = angular.module('expresso.modules.login', []);
    login.config(config);

    function config ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("404");

        $stateProvider
            .state('login', {
                url: "/login",
                templateUrl: "/app/modules/login/login.html"
            });
    }

})(angular);

(function(angular) {
    'use strict';

    var sharedTemplates;
    sharedTemplates = angular.module('expresso.modules.sharedTemplates', []);
    sharedTemplates.config(config);

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('404', {
                url: "/404",
                templateUrl: "/app/modules/sharedTemplates/404.html"
            });
    }
})(angular);

(function(angular) {
    'use strict'

    var signup;
    signup = angular.module('expresso.modules.signup', []);
    signup.config(config);

    function config ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("404");

        $stateProvider
            .state('signup', {
                url: "/signup",
                templateUrl: "/app/modules/signup/signup.html"
            });
    }

})(angular);

(function (angular) {
    'use strict';

    var modules;
    modules = angular.module('expresso.modules', [
        'expresso.modules.home',
        'expresso.modules.sharedTemplates',
        'expresso.modules.signup',
        'expresso.modules.login',
    ]);

})(angular);
