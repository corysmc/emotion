/*global angular : true fixes codekit error*/
angular.module("app.chart", [])
    .directive('chartJs', function($document) {
        return {
            restrict: 'E',
            scope: {
                config: '=',
            },
            replace: true,
            template: '<canvas></canvas>',
            link: function(scope, el) {
                //el.getContext("2d");
                if (scope.config) {
                    if (scope.config.type == 'scatter') {
                        new Chart.Scatter(el, scope.config);
                    }
                    if (scope.config.type == 'doughnut') {
                        new Chart(el, scope.config);
                    }
                }
            }
        };
    });