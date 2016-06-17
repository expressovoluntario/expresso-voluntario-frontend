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
                newTask.is_remote = controller.newTask.is_remote;
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
