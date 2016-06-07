/* globals angular:false */
(function (angular) {
    'use strict';

    var dependencies = [
        'ui.router',
        'ngMaterial',
        'ngMessages',
        'ngResource',
        'ngCookies',
        'angular-google-analytics',
        'expresso.components',
        'expresso.modules'
    ];

    angular
        .module('MyApp', dependencies)
        .config(config)
        .run(checkUserAuthentication)
        .run(analytics)


    function config($mdThemingProvider, $httpProvider, $resourceProvider, AnalyticsProvider) {
        // Não remover as barras da url
        $resourceProvider.defaults.stripTrailingSlashes = false;

        // Configura a paleta de cores do angular material
        _setAngularMaterial($mdThemingProvider);

        // Configura o Google Analytics
        _setGoogleAnalytics(AnalyticsProvider);
    }

    function _setAngularMaterial($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('amber');
    }

    function _setGoogleAnalytics(AnalyticsProvider) {
        AnalyticsProvider
            .setAccount('UA-67297111-2')
            .setPageEvent('$stateChangeSuccess');
    }

    function checkUserAuthentication($rootScope, $location, $cookies, $http, UserSession) {
        var url;

        $rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.currentUser) {
            url = 'http://localhost:5000/user/' + $rootScope.globals.currentUser.id;

            $http.get(url)
                .success(function successCallback(data) {
                    UserSession.setUser(data);

                    $rootScope.$on('$locationChangeStart', function (event, next, current) {
                        var path, publicPages, isRestrictedPage, isAuthenticated;
                        path = $location.path();
                        publicPages = ['', '/login', '/signup'];
                        isRestrictedPage = _.indexOf(publicPages, path) === -1;
                        isAuthenticated = UserSession.isAuthenticated();
                        if (isRestrictedPage && !isAuthenticated) {
                            $location.path('/login');
                        }
                    });
                })
                .error(function errorCallback(response) {
                    console.log("Erro ao recuperar usuário logado. Resposta do servidor: " + response);
                });
        }
    }

    function analytics(Analytics) {}

})(angular);

/* globals angular:false */
(function (angular) {

    'use strict';
    angular.module('expresso.components', []);

})(angular);

/* globals angular:false */
(function (angular) {
    'use strict';

    angular
        .module('expresso.components')
        .directive('expressoMenu', expressoMenu)
        .controller('expressoMenuCtrl', expressoMenuCtrl)

     function expressoMenu() {
        return {
            'restrict': 'E',
            'templateUrl': '/app/components/expressoMenu/expressoMenu.html',
            'scope': {},
            'controller': expressoMenuCtrl,
            'controllerAs': 'controller'
        }
    }

    function expressoMenuCtrl(UserSession) {
        var controller = this, originatorEv;
        init();

        function init() {
            controller.isUserAuthenticated = isUserAuthenticated;
            controller.logout = logout;
            controller.openMenu = openMenu;
        }

        function isUserAuthenticated() {
            return UserSession.isAuthenticated();
        }

        function logout() {
            UserSession.logout();
        }

        function openMenu($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        }
    }
})(angular);

/* globals angular:false */
(function (angular) {
    'use strict';

    angular
        .module('expresso.modules', [
            'expresso.modules.home',
            'expresso.modules.index',
            'expresso.modules.login',
            'expresso.modules.ong',
            'expresso.modules.services',
            'expresso.modules.sharedTemplates',
            'expresso.modules.user'
        ]);

})(angular);

/* globals angular:false */
(function(angular) {
    'use strict'

    angular
        .module('expresso.modules.home', [])
        .config(config)
        .controller('HomeCtrl', HomeCtrl);

        // CONFIGURAÇÕES DE ROTAS
        function config ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("404");

            $stateProvider
                .state('home', {
                    url: "/home/{id}",
                    templateUrl: "/app/modules/home/home.html"
                });
        }

        // CONTROLLER
        function HomeCtrl(UserSession) {
            var controller = this
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

/*globals angular:false*/
(function (angular) {
    'use strict';

    angular
        .module('expresso.modules.index', [])
        .config(config)
        .controller('IndexCtrl', IndexCtrl);

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
    'use strict'

    angular
        .module('expresso.modules.login', [])
        .config(config)
        .controller('LoginCtrl', LoginCtrl);

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

    angular
        .module('expresso.modules.login')
        .directive('loginCard', loginCard);

    function loginCard() {
        return {
            'restrict': 'E',
            'templateUrl': '/app/modules/login/loginCard.html',
            'scope': {
                'role' : '='
            },
            'controller': loginCardCtrl,
            'controllerAs': 'controller'
        }
    }

    function loginCardCtrl($location, OngResource, UserResource, UserSession) {
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
                        UserSession.login(controller.email, controller.password);
                    });
                }
            }
            else if (path === '/login') {
                UserSession.login(controller.email, controller.password);
            }
        }

        function saveFirstUser(ongId) {
            var user = new UserResource();
            user.ong_id = ongId;
            user.email = controller.email;
            user.password = controller.password;
            user.$save().then(function(response) {

                $location.path('/home/' + ongId);
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
    'use strict'

    angular
        .module('expresso.modules.ong', [])
        .config(config)
        .controller('OngCtrl', OngCtrl);

        function config ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("404");

            $stateProvider
                .state('profile', {
                    url: "/profile",
                    templateUrl: "/app/modules/ong/ong.html"
                });
        }

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

/* globals angular:false */
(function (angular) {
    'use strict';

    angular
        .module('expresso.modules.services', [])
        .factory('UserSession', UserSession)
        .run(RunUserSession);

    function RunUserSession(UserSession) {
        // UserSession.create();
    }

    function UserSession($http, $location, $cookies, $rootScope, UserResource) {
        var user = {}, ong = {};

        return {
            login : function(email, password) {
                $http({
                    method: 'GET',
                    url: 'http://localhost:5000/user/login',
                    params: {
                        'email': email,
                        'password': password
                    }
                }).then(function successCallback(response) {
                    user.id = response.data.id;
                    user.name = response.data.name;
                    user.email = response.data.email;
                    user.is_authenticated = response.data.is_authenticated;
                    ong.id = response.data.ong_id;

                    $rootScope.globals.currentUser = {};
                    $rootScope.globals.currentUser = user;
                    $cookies.putObject('globals', $rootScope.globals);

                    $location.path('/home/' + ong.id);
                }, function errorCallback(response) {
                    console.log("Erro ao realizar login. Resposta do servidor: " + response);
                });
            },

            logout : function() {
                $http({
                    method: 'GET',
                    url: 'http://localhost:5000/user/logout'
                }).then(function successCallback(response) {
                    user = {};
                    ong = {};
                    $cookies.remove('globals');
                    $location.path('/login');
                }, function errorCallback(response) {
                    console.log("Erro ao realizar logout. Resposta do servidor: " + response);
                });
            },

            getUser : function() {
                return user;
            },

            setUser : function(newUser) {
                user = newUser;
            },

            getOng : function() {
                return ong;
            },

            isAuthenticated : function () {
                if (!_.isEmpty(user)) {
                    return user.is_authenticated;
                }
                return false;
            }
        };
    }

})(angular);

/* globals angular:false */
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

/* globals angular:false */
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
