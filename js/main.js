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
        .otherwise({
            redirectTo: '/'
        });
});

personalityApp.controller('mainController', function($scope, $location, colors, motions, emotions, emotionsdata) {
    $scope.colors = colors;
    $scope.motions = motions;
    $scope.Q = 1;

    $scope.emotion = emotions.current();
    $scope.emotion.name = emotions.random();
    console.log(emotionsdata.get($scope.emotion.name));
    $scope.submitEmotion = function(Q, emotion) {
        if (Q === 3) {
            $location.path('/results');
            var emotioncount = emotionsdata.get(emotion.name);

            emotionsdata.update(emotion, emotioncount);
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
personalityApp.controller('resultsController', function($scope, $location) {
    //gets component id from URL
    $scope.restart = function() {
        $location.path('/');
    };
});