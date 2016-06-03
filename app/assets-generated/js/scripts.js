(function (angular) {
    'use strict';

    var expresso;
    expresso = angular.module('MyApp', [
        'ui.router',
        'ngMaterial',
        'ngMessages',
        'ngResource',
        'angular-google-analytics',

        'expresso.components',
        'expresso.modules'
    ]);

    expresso.config(function($mdThemingProvider, $httpProvider, $resourceProvider, AnalyticsProvider) {

        // dont remove trailing slashes from urls
        $resourceProvider.defaults.stripTrailingSlashes = false;

        // Configura a paleta de cores do angular material
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('amber');

        // Configura o Google Analytics
        AnalyticsProvider
            .setAccount('UA-67297111-2')
            .setPageEvent('$stateChangeSuccess');
    });

    expresso.run(function(Analytics) {});

})(angular);

angular.module('expresso.components', [
        // Add here the components modules
    ]);

/*globals angular:false*/
(function (angular) {
    'use strict';

    var index;
    index = angular.module('expresso.modules.index', [])
    index.config(config);

    function config($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("404");

        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: '/app/modules/index/index.html',
                controller: 'IndexCtrl'
            })
            .state('index2', {
                url: '',
                templateUrl: '/app/modules/index/index.html',
                controller: 'IndexCtrl'
            });
    }
})(angular);

(function(angular) {
    'use strict'

    angular
        .module('expresso.modules.login', [])
        .config(config);

    function config ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("404");

        $stateProvider
            .state('login', {
                url: "/login",
                templateUrl: "/app/modules/login/login.html"
            })

            .state('signup', {
                url: "/signup",
                templateUrl: "/app/modules/login/login.html"
            });
    }

})(angular);

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

(function(angular) {
    'use strict'

    angular
        .module('expresso.modules.ong', [])
        .config(config);

        function config ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("404");

            $stateProvider
                .state('profile', {
                    url: "/profile",
                    templateUrl: "/app/modules/ong/ong.html"
                });
        }

})(angular);

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

    angular
        .module('expresso.modules.user', [])
        .config(config);

        function config ($stateProvider, $urlRouterProvider) {
            // $urlRouterProvider.otherwise("404");
            //
            // $stateProvider
            //     .state('profile', {
            //         url: "/profile",
            //         templateUrl: "/app/modules/ong/ong.html"
            //     });
        }

})(angular);

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

/* globals angular:false */
(function(angular) {
    'use strict';

    angular
        .module('expresso.modules.login')
        .controller('LoginCtrl', LoginCtrl);

    function LoginCtrl($scope, $location) {
        var controller = this;
        init();

        function init() {
            controller.getRole = getRole;
        }

        // Retorna qual a função do card (signup, login...) de acordo com a URL
        function getRole() {
            var path;
            path = $location.path();
            path = path.replace('/', '');
            return path;
        }
    }
})(angular);

/* globals angular:false */
(function (angular) {
    'use strict';

    var login = angular.module('expresso.modules.login');

    login.directive('loginCard', function () {
        return {
            'restrict': 'E',
            'templateUrl': '/app/modules/login/directives/loginCard.html',
            'scope': {
                'role' : '='
            },
            'controller': loginCardCtrl,
            'controllerAs': 'controller'
        }
    });

    function loginCardCtrl($location, OngResource, UserResource) {
        var controller = this;
        init();

        function init() {
            controller.ong = undefined;
            controller.email = undefined;
            controller.password = undefined;
            controller.confirmPassword = undefined;
            controller.ongResource = new OngResource();
            controller.user = new UserResource();

            controller.isSectionVisible = isSectionVisible;
            controller.registerOng = registerOng;
            controller.submitFormLogin = submitFormLogin;
        }

        function submitFormLogin() {
            var path, isPasswordValid, isEmailAvailable, ongId;

            path = $location.path();

            if (path === '/signup') {
                isPasswordValid = _matchPassword(controller.password, controller.confirmPassword);
                isEmailAvailable = _isEmailAvailble(controller.email);

                if (isPasswordValid && isEmailAvailable) {
                    controller.ongResource.name = controller.ong;
                    controller.ongResource.$save().then(function(response) {
                        saveFirstUser(response.id);
                    });
                }
            }
            else if (path === '/login') {

            }
        }

        function saveFirstUser(ongId) {
            var user = new UserResource();
            user.ong_id = ongId;
            user.email = controller.email;
            user.password = controller.password;
            user.$save().then(function(response) {
                //redirect to profile
            });
        }

        // Retorna se a seção (login, signup...) deve estar visível
        function isSectionVisible(role) {
            var path;
            path = $location.path();
            role = '/' + role;
            return role === path;
        }

        // Cadastra a ONG e o usuário na ONG
        function registerOng(signupForm) {
            var isSignupFormValid;
            isSignupFormValid = _validateSignupForm(signupForm);

            if (isSignupFormValid) {
                // fazer o POST
            }
        }

        // Valida se a senha combina com a senha de confirmação
        function _matchPassword(password1, password2) {
            return password1 === password2;
        }

        // Valida se o e-mail já está sendo utilizado
        function _isEmailAvailble(email) {
            return true;
        }
    }

})(angular);

/* globals angular:false */
(function(angular) {
    'use strict';

    angular
        .module('expresso.modules.ong')
        .controller('OngCtrl', OngCtrl);

    function OngCtrl() {
        var controller = this;
        init();

        function init() {
            // controller.isEditing = false;
            controller.currentTab = 'tasks';
            controller.taskTags = [];
            controller.taskStatus = getStatusOptions();
            controller.taskStatusSelected = null;
            controller.taskRecurrence = getRecurrenceOptions();
            controller.taskRecurrenceSelected = null;
            controller.taskDescription = null;

            // controller.toggleEdit = toggleEdit;
            controller.setCurrentTab = setCurrentTab;
            controller.isCurrentTab = isCurrentTab;
        }

        // TASK
        function getRecurrenceOptions() {
            var options = ['única', 'recorrente'];
            options = options.map(function(option) {
                return { label : option };
            });
            return options;
        }

        // TASK
        function getStatusOptions() {
            var options = ['aberto', 'concluído', 'andamento'];
            options = options.map(function(option) {
                return { label : option };
            });
            return options;
        }


        function setCurrentTab(tab) {
            controller.currentTab = tab;
        }

        function isCurrentTab(tab) {
            return controller.currentTab === tab;
        }
    }
})(angular);

(function (angular) {
    'use strict';

    angular
        .module('expresso.modules', [
            'expresso.modules.index',
            'expresso.modules.login',
            'expresso.modules.ong',
            'expresso.modules.sharedTemplates',
            'expresso.modules.user'
        ]);

})(angular);
