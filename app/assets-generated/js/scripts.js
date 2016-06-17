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

    // -> verificar se o usuário está logado. Registrar um evento de mudança de rota pra que
    // toda hora que ele mudar de url verificar se está logado
    // como?
    //   verifica se o usuário está no cookie, se estiver é só pegar os atributos do cookie
    // se não estiver setar como is_authenticated = false
    function checkUserAuthentication($rootScope, $location, $cookies, $http, UserSession) {
        var url, mock;

        $rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.currentUser) {
            mock = {};
            mock.is_authenticated = true;
            UserSession.setUser(mock);

            url = 'http://localhost:5000/user/' + $rootScope.globals.currentUser.id;

            $http.get(url)
                .success(function successCallback(data) {
                    UserSession.setUser(data);
                })
                .error(function errorCallback(response) {
                    console.log("Erro ao recuperar usuário logado. Resposta do servidor: " + response);
                });

        } else {
            mock = {};
            mock.is_authenticated = false;
            UserSession.setUser(mock);
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            var path, publicPages, isRestrictedPage, isAuthenticated;
            path = $location.path();
            publicPages = ['', '/login', '/signup', '/pesquisar'];
            isRestrictedPage = _.indexOf(publicPages, path) === -1;
            isAuthenticated = UserSession.isAuthenticated();
            if (isRestrictedPage && !isAuthenticated) {
                $location.path('/login');
            }
        });
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
        .module('expresso.components')
        .directive('ngEnter', ngEnter)

        function ngEnter() {
            return function(scope, element, attrs) {
                element.bind("keydown keypress", function(event) {
                    if(event.which === 13) {
                            scope.$apply(function(){
                                    scope.$eval(attrs.ngEnter);
                            });

                            event.preventDefault();
                    }
                });
            };
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
            'expresso.modules.search',
            'expresso.modules.services',
            'expresso.modules.sharedTemplates',
            'expresso.modules.task',
            'expresso.modules.user'
        ]);

})(angular);

/* globals angular:false */
(function(angular) {
    'use strict'

    angular
        .module('expresso.modules.home', [])
        .config(config)
        .controller('HomeCtrl', HomeCtrl)
        .controller('TaskDetailCtrl', TaskDetailCtrl)
        .factory('HomeModel', HomeModel);

        // CONFIGURAÇÕES DE ROTAS
        function config ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("404");

            $stateProvider
                .state('home', {
                    url: "/inicio",
                    templateUrl: "/app/modules/home/home.html"
                })
                .state('home.about', {
                    url: "/sobre",
                    templateUrl: "/app/modules/home/partials/home.about.html"
                })
                .state('home.tasksList', {
                    url: "/tarefas",
                    templateUrl: "/app/modules/home/partials/home.tasksList.html"
                })
                .state('home.taskDetail', {
                    url: "/tarefa/:id",
                    templateUrl: "/app/modules/home/partials/home.taskDetail.html",
                    controller: TaskDetailCtrl,
                    controllerAs: 'controller'
                })
                .state('home.newTask', {
                    url: "/nova_tarefa",
                    templateUrl: "/app/modules/home/partials/home.newTask.html"
                });
        }

        // CONTROLLER
        function HomeCtrl($http, $location, $rootScope, UserSession, OngResource, TaskResource) {
            var controller = this
            init();

            function init() {
                // VARIÁVEIS
                controller.taskDescription = null;
                controller.isContactEditing = false;
                controller.isAboutEditing = false;
                controller.currentTab = 'tasks';
                controller.ong = _loadOng();
                controller.taskTags = [];

                controller.newTask = {};
                controller.newTask.tags = [];
                controller.newTask.title = '';
                controller.newTask.description = '';
                controller.newTask.status = '';

                // TESTES
                controller.searchTasks = searchTasks;


                // FUNÇÕES
                controller.isCurrentTab = isCurrentTab;
                controller.editContactInfo = editContactInfo;
                controller.saveContactInfo = saveContactInfo;
                controller.editAboutInfo = editAboutInfo;
                controller.saveAboutInfo = saveAboutInfo;
                controller.saveNewTask = saveNewTask;
                controller.loadAddressViaCEP = loadAddressViaCEP;
                controller.getName = getName;
                controller.getAddress = getAddress;
                controller.getPhones = getPhones;
                controller.getEmail = getEmail;
                controller.isTaskListEmpty = isTaskListEmpty;
            }

            //////////////////////
            // FUNÇÕES PÚBLICAS
            //////////////////////

            function getName() {
                var output;

                if (controller.ong && controller.ong.name) {
                    output = controller.ong.name;
                } else {
                    output = 'Adicione o nome da instituição';
                }

                return output;
            }

            function getAddress() {
                var output;

                if (controller.ong && controller.ong.address && !_.isEmpty(controller.ong.address)) {
                    output = controller.ong.address.logradouro;
                    if (controller.ong.addressNumber) {
                        output += ', ' + controller.ong.addressNumber;
                    }
                    output += ' - ' + controller.ong.address.bairro;
                    output += ' - ' + controller.ong.address.localidade;
                    output += ' - ' + controller.ong.address.uf;
                } else {
                    output = 'Adicione o Endereço da instituição';
                }

                return output;
            }

            function getPhones() {
                var output;

                if (controller.ong && controller.ong.phone1) {
                    output = controller.ong.phone1;

                    if (controller.ong.phone2) {
                        output += ' | ' + controller.ong.phone2;
                    }
                } else {
                    output = 'Adicione o Telefone da instituição';
                }

                return output;
            }

            function getEmail() {
                var output;

                if (controller.ong && controller.ong.email) {
                    output = controller.ong.email;
                } else {
                    output = 'Adicione o E-mail da instituição';
                }

                return output;
            }

            function editContactInfo() {
                controller.isContactEditing = true;
            }

            function saveContactInfo() {
                var ong;
                ong = new OngResource();
                ong.id = controller.ong.id;
                ong._id = controller.ong._id;
                ong.name = controller.ong.name;
                ong.phone1 = controller.ong.phone1;
                ong.phone2 = controller.ong.phone2;
                ong.email = controller.ong.email;

                if (controller.ong.address.cep && controller.ong.address.cep != '') {
                    ong.address = {};
                    ong.address.cep = controller.ong.address.cep;
                    ong.address.logradouro = controller.ong.address.logradouro;
                    ong.addressNumber = controller.ong.addressNumber;
                    ong.address.bairro = controller.ong.address.bairro;
                    ong.address.localidade = controller.ong.address.localidade;
                    ong.address.uf = controller.ong.address.uf;
                }

                ong.$update();
                controller.isContactEditing = false;
            }

            function editAboutInfo() {
                controller.isAboutEditing = true;
            }

            function saveAboutInfo() {
                var ong;
                ong = new OngResource();

                ong.id = controller.ong.id;
                ong._id = controller.ong._id;
                ong.description = controller.ong.description;
                ong.$update();
                controller.isAboutEditing = false;
            }

            function saveNewTask() {
                var newTask;

                if (_.isEmpty(controller.newTask.title) || _.isEmpty(controller.newTask.description)) {
                    return;
                }

                newTask = new TaskResource();
                newTask.title = controller.newTask.title;
                newTask.description = controller.newTask.description;
                newTask.tags = controller.newTask.tags;
                newTask.ong_id = controller.ong.id;
                newTask.$save().then(function(response) {
                    var url;
                    url = '/inicio/tarefa/' + response.id;
                    _loadOng();
                    $location.path(url);
                });

            }


            function loadAddressViaCEP(value) {
                var cep, url, promise;
                cep = _formatCEP(value);

                if (_.isEmpty(cep)) {
                    _clearAddressFields();
                }

                if (_validateCEP(cep)) {
                    url = 'http://viacep.com.br/ws/' + cep + '/json/';

                    promise = $http.get(url);
                    promise.then(function(response) {
                        controller.ong.address.logradouro = response.data.logradouro;
                        controller.ong.address.bairro = response.data.bairro;
                        controller.ong.address.localidade = response.data.localidade;
                        controller.ong.address.uf = response.data.uf;
                    });
                }
            }

            function isCurrentTab(tab) {
                var path, regxMatchTaskUrls;
                path = $location.path();

                if (tab === 'tasks') {
                    regxMatchTaskUrls = /tarefa/;
                    if (regxMatchTaskUrls.test(path)) {
                        return true;
                    } else {
                        return false;
                    }
                }

                if (tab === 'about') {
                    if (path === '/inicio/sobre') {
                        return true;
                    } else {
                        return false;
                    }
                }
            }

            function searchTasks(tag) {
                var url;

                url = 'http://localhost:5000/task?location='+ tag;
                $http.get(url).then(function(response) {
                    controller.testetasks = response.data;
                });
            }

            function isTaskListEmpty() {
                if(controller.ong.tasks && controller.ong.tasks.length === 0) {
                    return true;
                }

                return false;
            }


            //////////////////////
            // FUNÇÕES PRIVADAS
            //////////////////////

            function _loadOng() {
                var ong, globals, user;
                ong = UserSession.getOng();

                if (_.isEmpty(ong)) {
                    if ($rootScope.globals && $rootScope.globals.currentUser) {
                        var url;
                        url = 'http://localhost:5000/ong/' + $rootScope.globals.currentUser.ong_id,

                        $http.get(url).then(function(response){
                            var ong;
                            ong = response.data;
                            ong.tasks = JSON.parse(ong.tasks);
                            controller.ong = ong;
                        });
                    }
                }

                return ong;
            }

            function _formatCEP(cep) {
                return cep.replace(/\D/g, '');
            }

            function _validateCEP(cep) {
                var regxValidCEP;
                regxValidCEP = /^[0-9]{8}$/;

                if (!regxValidCEP.test(cep)) {
                    return false;
                }

                return true;
            }

            function _clearAddressFields() {
                controller.ong.address.logradouro = '';
                controller.ong.address.bairro = '';
                controller.ong.address.localidade = '';
                controller.ong.address.uf = '';
            }

            $rootScope.$on('tasksListChanged', function(event, data) {
                _loadOng();
            });
        }

        function TaskDetailCtrl($stateParams, $rootScope, $location, $mdDialog, TaskResource) {
            var controller = this;
            init();

            function init() {
                // VARIÁVEIS
                controller.task = {};
                controller.task.tags = [];
                controller.isTaskEditing = false;
                controller.taskStatusOptions = _getStatusOptions();

                // FUNÇÕES
                controller.editTask = editTask;
                controller.saveTask = saveTask;
                controller.updateTask = updateTask;
                controller.deleteTask = deleteTask;
                controller.getTags = getTags;

                _loadTask();
            }

            /////////////////////////
            // FUNÇÕES PÚBLICAS
            /////////////////////////

            function editTask() {
                controller.isTaskEditing = true;
            }

            function saveTask() {
                _triggerBroadcast();
                controller.isTaskEditing = false;
            }

            function updateTask(task) {
                task.$update(function(response) {
                    _triggerBroadcast();
                    controller.isTaskEditing = false;
                });
            }

            function deleteTask(ev, task) {
                var confirm = $mdDialog.confirm()
                    .title('Deseja excluir esta tarefa?')
                    .textContent('Esta ação não poderá ser desfeita')
                    .ariaLabel('(?)')
                    .targetEvent(ev)
                    .ok('Excluir')
                    .cancel('Cancelar');

                $mdDialog.show(confirm).then(function() {
                    task.$delete().then(function() {
                        _triggerBroadcast();
                        $location.path('/inicio/tarefas');
                    });
                }, function() {
                  console.log('cancelado');
                });

            }

            function _triggerBroadcast() {
                $rootScope.$broadcast('tasksListChanged');
            }

            function getTags() {
                var output;

                if (controller.task) {
                    if (controller.task.tags && controller.task.tags.length === 0) {
                        return 'Nenhuma palavra chave cadastrada';
                    }

                    output = '';
                    if (controller.task.tags) {
                        controller.task.tags.forEach(function(tag) {
                            output += tag + ', '
                        });
                        output = output.slice(0, -2);
                    }
                    return output;
                }
            }

            /////////////////////////
            // FUNÇÕES PRIVADAS
            /////////////////////////
            function _loadTask() {
                var task, id;
                id = $stateParams.id;

                TaskResource.get({id : id}, function(response) {
                    var task, createdAt, updatedAt;
                    task = response;
                    createdAt = Date.parse(response.createdAt);
                    updatedAt = Date.parse(response.updatedAt);
                    task.createdAt = createdAt;
                    task.updatedAt = updatedAt;
                    controller.task = task;
                });
            }

            function _getStatusOptions() {
                var options = ['Em aberto', 'Em andamento', 'Concluído'];
                options = options.map(function(option) {
                    return { label : option };
                });
                return options;
            }
        }

        function HomeModel() {
            return {

            };
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

    function LoginCtrl($scope, $location, UserSession) {
        var controller = this;
        init();

        function init() {
            controller.getRole = getRole;
            _redirectHomeIfLogged()
        }

        function _redirectHomeIfLogged() {
            if (UserSession.isAuthenticated()) {
                $location.path('/inicio/tarefas');
            }
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
                $location.path('/inicio/tarefas');
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
        return $resource('http://localhost:5000/ong/:_id', {'_id' : '@_id'}, {
            'update' : {
                'method' : 'PUT'
            }
        });
    }

})(angular);

/* globals angular:false */
(function(angular) {
    'use strict'

    angular
        .module('expresso.modules.search', [])
        .config(config)
        .controller('SearchCtrl', SearchCtrl);

        function config ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("404");

            $stateProvider
                .state('search', {
                    url: "/pesquisar",
                    templateUrl: "/app/modules/search/search.html"
                });
        }

        function SearchCtrl($http, SearchResource) {
            var controller = this;
            init();

            function init() {
                _getCities();

                // VARIÁVEIS
                controller.result = [];
                controller.resultOngs = [];
                controller.cities = [];
                controller.searchTask = {};
                controller.searchTask.title = '';
                controller.searchTask.tag = '';
                controller.searchTask.location = '';
                controller.currentTab = 'tasks';
                controller.isFirstQuery= true;

                // FUNÇÕES
                controller.setCurrentTab = setCurrentTab;
                controller.isCurrentTab = isCurrentTab;
                controller.isResultEmpty = isResultEmpty;
                controller.getTaskByTitleAndLocation = getTaskByTitleAndLocation;
                controller.getTaskByTagAndLocation = getTaskByTagAndLocation;
                controller.getOngsByNameAndLocation = getOngsByNameAndLocation;
            }

            //////////////////////////
            // FUNÇÕES PÚBLICAS
            //////////////////////////

            function getTaskByTitleAndLocation() {
                if (controller.searchTask.title) {
                    SearchResource.query({ data : 'task', title : controller.searchTask.title })
                        .$promise.then(function(response) {
                            if (controller.searchTask.location) {
                                controller.result = response.filter(function(task) {
                                    return task.location === controller.searchTask.location.trim();
                                });
                            } else {
                                controller.result = response;
                            }
                        });

                } else if (controller.searchTask.location) {
                    SearchResource.query({ data : 'task', location : controller.searchTask.location.trim() })
                        .$promise.then(function(response) {
                            controller.result = response;
                        });
                }
            }

            function getTaskByTagAndLocation() {
                if (controller.searchTask.tag) {
                    SearchResource.query({ data : 'task', tag : controller.searchTask.tag })
                        .$promise.then(function(response) {
                            if (controller.searchTask.location) {
                                controller.result = response.filter(function(task) {
                                    return task.location === controller.searchTask.location.trim();
                                });
                            } else {
                                controller.result = response;
                            }
                        });

                } else if (controller.searchTask.location) {
                    SearchResource.query({ data : 'task', location : controller.searchTask.location.trim() })
                        .$promise.then(function(response) {
                            controller.result = response;
                        });
                }
            }

            function getOngsByNameAndLocation() {
                if (controller.searchOng.name) {
                    SearchResource.query({ data : 'ong', name : controller.searchOng.name })
                        .$promise.then(function(response) {
                            if (controller.searchOng.location) {
                                controller.resultOngs = response.filter(function(ong) {
                                    return ong.location === controller.searchOng.location.trim();
                                });
                            } else {
                                controller.resultOngs = response;
                            }
                        });

                } else if (controller.searchOng.location) {
                    SearchResource.query({ data : 'ong', location : controller.searchOng.location.trim() })
                        .$promise.then(function(response) {
                            controller.resultOngs = response;
                        });
                }
            }

            function isResultEmpty(result) {
                return result.length === 0;
            }

            function setCurrentTab(tab) {
                controller.currentTab = tab;
            }

            function isCurrentTab(tab) {
                return tab === controller.currentTab;
            }

            //////////////////////////
            // FUNÇÕES PRIVADAS
            //////////////////////////
            function _getCities() {
                var cities, httpConfig;
                httpConfig = {
                    method: 'GET',
                    url: 'http://localhost:5000/search',
                    params: {'data' : 'cities'}
                };

                $http(httpConfig).then(function(response) {
                    controller.cities = JSON.parse(response.data)
                });
            }


        }

})(angular);

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

    function UserSession($http, $location, $cookies, $rootScope, UserResource, OngResource) {
        var user = {}, ong = {};

        function _logginUser(email, password) {
            var httpConfig, promise;

            httpConfig = {
                method: 'GET',
                url: 'http://localhost:5000/user/login',
                params: {
                    'email': email,
                    'password': password
                }
            };

            return $http(httpConfig);
        }

        function _getOngById(ong_id) {
            var httpConfig, promise;

            httpConfig = {
                method: 'GET',
                url: 'http://localhost:5000/ong/' + ong_id,
            };
            promise = $http(httpConfig);
            return promise;
        }

        return {
            login : function(email, password) {
                var httpConfig, promiseUser, promiseOng;

                promiseUser = _logginUser(email, password);
                promiseUser.then(
                    function loginSuccessCallback(response) {
                        user = response.data;
                        $rootScope.globals.currentUser = {};
                        $rootScope.globals.currentUser = user;
                        $cookies.putObject('globals', $rootScope.globals);

                        promiseOng = _getOngById(user.ong_id);
                        promiseOng.then(
                            function ongSuccessCallback(response) {
                                ong = response.data;
                                ong.tasks = JSON.parse(ong.tasks);
                                $location.path('/inicio/tarefas');
                            },

                            function ongErrorCallback(response) {
                                console.log("Erro ao realizar login. Response: " + response);
                            }
                        );

                    },

                    function loginErrorCallback(response) {
                        console.log("Erro ao realizar login. Response: " + response);
                    }
                );
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
        .module('expresso.modules.task', []);
})(angular);

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
