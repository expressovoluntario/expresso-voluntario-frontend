/* globals angular:false */
(function(angular) {
    'use strict'

    angular
        .module('expresso.modules.ong', [])
        .config(config)
        .controller('OngCtrl', OngCtrl);

        // CONFIGURAÇÕES DE ROTAS
        function config ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("404");

            $stateProvider
                .state('ong', {
                    url: "/ong/:ongId",
                    templateUrl: "/app/modules/ong/ong.html"
                })
                .state('ong.about', {
                    url: "/sobre",
                    templateUrl: "/app/modules/ong/partials/ong.about.html"
                })
                .state('ong.tasksList', {
                    url: "/tarefas",
                    templateUrl: "/app/modules/ong/partials/ong.tasksList.html"
                })
                .state('ong.taskDetail', {
                    url: "/tarefa/:taskId",
                    templateUrl: "/app/modules/ong/partials/ong.taskDetail.html",
                    controller: OngTaskDetail,
                    controllerAs: 'controller'
                });
        }


        function OngCtrl($http, $location, $stateParams, $rootScope, UserSession) {
            var controller = this;
            init();

            function init() {
                _loadOng();

                // VARIÁVEIS

                // FUNÇÕES
                controller.getName = getName;
                controller.getAddress = getAddress;
                controller.getPhones = getPhones;
                controller.getEmail = getEmail;
                controller.isTaskListEmpty = isTaskListEmpty;
                controller.isCurrentTab = isCurrentTab;

            }

            //////////////////////
            // FUNÇÕES PÚBLICAS
            //////////////////////

            function getName() {
                var output;

                if (controller.ong && controller.ong.name) {
                    output = controller.ong.name;
                } else {
                    output = 'Nome da instituição não informado';
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
                    output = 'Endereço da instituição não foi informado';
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
                    output = 'Telefone da instituição não foi informado';
                }

                return output;
            }

            function getEmail() {
                var output;

                if (controller.ong && controller.ong.email) {
                    output = controller.ong.email;
                } else {
                    output = 'E-mail da instituição não foi informado';
                }

                return output;
            }

            function isTaskListEmpty() {
                if(controller.ong.tasks && controller.ong.tasks.length === 0) {
                    return true;
                }
                return false;
            }

            function isCurrentTab(tab) {
                var path, regxMatchTaskUrls, regxMatchAboutUrl;
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
                    regxMatchAboutUrl = /sobre/;
                    if (regxMatchAboutUrl.test(path)) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }


            //////////////////////
            // FUNÇÕES PRIVADAS
            //////////////////////

            function _loadOng() {
                var ong, url, ongId;
                ong = UserSession.getOng();

                if (_.isEmpty(ong)) {
                    ongId = $stateParams.ongId;
                    url = 'http://localhost:5000/ong/' + ongId,
                    $http.get(url).then(function(response){
                        var ong;
                        ong = response.data;
                        ong.tasks = JSON.parse(ong.tasks);
                        controller.ong = ong;
                    });
                }

                controller.ong = ong;
            }

        }

        function OngTaskDetail($stateParams, TaskResource) {
            var controller = this;
            init();

            function init() {
                _loadTask();

                // VARIÁVEIS
                controller.task = {};

                // FUNÇÕES
                controller.getTags = getTags;
            }

            //////////////////////
            // FUNÇÕES PÚBLICAS
            //////////////////////

            function getTags() {
                var output;

                if (controller.task) {
                    if (controller.task.tags && controller.task.tags.length === 0) {
                        return 'Nenhuma palavra chave adicionada';
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


            //////////////////////
            // FUNÇÕES PRIVADAS
            //////////////////////

            function _loadTask() {
                var taskId, task;
                taskId = $stateParams.taskId;
                task = TaskResource.get({ id : taskId});
                task.$promise.then(function(response){
                    controller.task = response;
                });
            }

        }

})(angular);
