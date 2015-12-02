/*global angular : true fixes codekit error*/
var personalityApp = angular.module('personalityApp', ['ngRoute', 'ngAnimate', 'app.services', 'chart.js']);

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

personalityApp.controller('mainController', function($scope, $location, $timeout, motions, emotions, emotionsdata) {
    $scope.motions = motions;
    $scope.Q = 1;

    $scope.emotion = emotions.current();
    $scope.emotion.name = emotions.random();
    $scope.emotion.hue = 180;
    $scope.emotion.speed = -1;

    $scope.changeMotion = function(motion) {
        //console.log('motion', motion);
        $scope.animation = null;

        $timeout(function() {
            $scope.animation = motion;
        }, 10);
    };
    $scope.submitEmotion = function(Q, emotion) {
        if (Q === 3) {
            $location.path('/results');

            //emotionsdata.update(emotion, emotionsdata.all());
            emotionsdata.add(emotion);
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

    //start canvas
    $scope.labels = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    $scope.series = ['Series A', 'Series B'];
    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];
    $scope.onClick = function(points, evt) {
        console.log(points, evt);
    };
    //end canvas
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
