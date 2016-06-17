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
                controller.searchTaskRemote = {};
                controller.searchTaskRemote.tag = '';
                controller.searchOng = {};
                controller.searchOng.name = '';
                controller.searchOng.location = '';
                controller.currentTab = 'tasks';
                controller.isFirstQuery= true;

                // FUNÇÕES
                controller.setCurrentTab = setCurrentTab;
                controller.isCurrentTab = isCurrentTab;
                controller.isResultEmpty = isResultEmpty;
                controller.getTaskByTitleAndLocation = getTaskByTitleAndLocation;
                controller.getTaskByTagAndLocation = getTaskByTagAndLocation;
                controller.getTaskByTagAndRemote = getTaskByTagAndRemote;
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

            function getTaskByTagAndRemote() {
                var params;

                if (controller.searchTaskRemote.tag) {
                    params = {
                        data : 'task',
                        remote : true,
                        tag : controller.searchTaskRemote.tag
                    };

                    SearchResource.query(params)
                        .$promise.then(function(response) {
                            controller.result = response;
                        });
                } else {
                    params = {
                        data : 'task',
                        remote : true
                    };

                    SearchResource.query(params)
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
