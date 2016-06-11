/* globals angular:false */
(function(angular) {
    'use strict'

    angular
        .module('expresso.modules.home', [])
        .config(config)
        .controller('HomeCtrl', HomeCtrl)
        .controller('TaskDetailCtrl', TaskDetailCtrl);

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
                controller.taskStatusOptions = _getStatusOptions();
                controller.taskStatusSelected = null;
                controller.taskDescription = null;
                controller.isContactEditing = false;
                controller.isAboutEditing = false;
                controller.currentTab = 'tasks';
                controller.ong = _loadOng();

                controller.newTask = {};
                controller.newTask.title = '';
                controller.newTask.description = '';
                controller.newTask.status = '';



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
                newTask = new TaskResource();
                newTask.title = controller.newTask.title;
                newTask.description = controller.newTask.description;
                // newTask.status = controller.newTask.status;
                newTask.ong_id = controller.ong.id;
                newTask.$save();
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


            //////////////////////
            // FUNÇÕES PRIVADAS
            //////////////////////

            function _getStatusOptions() {
                var options = ['Em aberto', 'Em andamento', 'Concluído'];
                options = options.map(function(option) {
                    return { label : option };
                });
                return options;
            }

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

            // function _redirectToTasksList() {
            //     var path;
            //     path = $location.path();
            //
            //     if (path === '/inicio') {
            //         $location.path('/inicio/tarefas');
            //     }
            // }
        }

        function TaskDetailCtrl($stateParams, TaskResource) {
            var controller = this;
            init();

            function init() {
                // VARIÁVEIS
                controller.task;
                controller.taskTags = [];
                controller.isTaskEditing = false;


                // FUNÇÕES
                controller.editTask = editTask;
                controller.saveTask = saveTask;

                _loadTask();
            }

            /////////////////////////
            // FUNÇÕES PRIVADAS
            /////////////////////////

            function editTask() {
                controller.isTaskEditing = true;
            }

            function saveTask() {
                controller.isTaskEditing = false;
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
        }

})(angular);
