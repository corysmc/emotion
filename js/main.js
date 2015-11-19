/*global angular : true fixes codekit error*/
var personalityApp = angular.module('personalityApp', ['ngRoute', 'ngAnimate', 'app.services']);

personalityApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'templates/builder.html',
            controller: 'mainController'
        })
        .when('/results', {
            templateUrl: 'templates/results.html',
            controller: 'resultsController'
        })
        .when('/results/:id', {
            templateUrl: 'templates/results.html',
            controller: 'resultsController'
        })
        .otherwise({
            redirectTo: '/'
        });
});

personalityApp.controller('mainController', function($scope, $location, $timeout, colors, motions, emotions, emotionsdata) {
    $scope.colors = colors;
    $scope.motions = motions;
    $scope.Q = 1;

    $scope.emotion = emotions.current();
    $scope.emotion.name = emotions.random();

    $scope.changeMotion = function(motion) {
        console.log('motion', motion);
        $scope.animation = null;
        
        $timeout(function() {
            $scope.animation = motion;
        }, 10);
    };
    $scope.submitEmotion = function(Q, emotion) {
        if (Q === 3) {
            $location.path('/results');

            emotionsdata.update(emotion, emotionsdata.all());
        } else {
            $scope.Q = (Q + 1);
        }
    };
    //this function adds active class to sidebar items//
    $scope.isActive = function(viewRoot, viewEnd) {
        var viewLocation = viewRoot + viewEnd;
        var active = (viewLocation === $location.url());
        return active;

    };
    //this pulls in the component groups for the sidebar//
});
personalityApp.controller('resultsController', function($scope, $location, emotionsdata) {
    //gets component id from URL
    $scope.emotions = emotionsdata.all();

    $scope.restart = function() {
        $location.path('/');
    };
});
personalityApp.filter('orderObjectBy', function() {
    return function(items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function(item) {
            filtered.push(item);
        });

        function index(obj, i) {
            return obj[i];
        }
        filtered.sort(function(a, b) {
            var comparator;
            var reducedA = field.split('.').reduce(index, a);
            var reducedB = field.split('.').reduce(index, b);
            if (reducedA === reducedB) {
                comparator = 0;
            } else {
                comparator = (reducedA > reducedB ? 1 : -1);
            }
            return comparator;
        });
        if (reverse) {
            filtered.reverse();
        }
        return filtered;
    };
});
