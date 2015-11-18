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

personalityApp.controller('mainController', function($scope, $location, colors, motions, emotions) {
    $scope.colors = colors;
    $scope.motions = motions;
    $scope.emotion ={};
    $scope.emotion.name = emotions.random();

    $scope.submitEmotion = function(emotion){
        $location.path( '/results' );
        console.log(emotion);
    };
    //this function adds active class to sidebar items//
    $scope.isActive = function(viewRoot, viewEnd) {
        var viewLocation = viewRoot + viewEnd;
        var active = (viewLocation === $location.url());
        return active;

    };
    //this pulls in the component groups for the sidebar//
});
personalityApp.controller('resultsController', function($scope, services, $routeParams) {
    //gets component id from URL
    var questionID = $routeParams.questionID;
    $scope.question = services.get(questionID);
});

