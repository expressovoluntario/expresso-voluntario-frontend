(function (angular) {
    'use strict';

    var expresso;
    expresso = angular.module('MyApp', [
        'ui.router',
        'ngMaterial',
        'angular-google-analytics',

        'expresso.components',
        'expresso.modules'
    ]);

    expresso.config(function($mdThemingProvider, AnalyticsProvider) {

        // Configura a paleta de cores do angular material
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('amber');

        // Configura o Google Analytics
        AnalyticsProvider
            .setAccount('UA-67297111-2')
            .setPageEvent('$stateChangeSuccess');

            // .logAllCalls(true)
            // .startOffline(true);

    });

    expresso.run(function(Analytics) {});

})(angular);

angular.module('expresso.components', [
        // Add here the components modules
    ]);

/*globals angular:false*/
(function (angular) {
    'use strict';

    var home;
    home = angular.module('expresso.modules.home', [])
    home.config(config);

    function config($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("404");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/app/modules/home/home.html',
                controller: 'HomeCtrl'
            })
            .state('home2', {
                url: '',
                templateUrl: '/app/modules/home/home.html',
                controller: 'HomeCtrl'
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

/*globals angular:false*/
(function(angular) {
    'use strict';

    var home;
    home = angular.module('expresso.modules.home');
    home.controller('HomeCtrl', HomeCtrl);

    function HomeCtrl($scope, $http) {
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
