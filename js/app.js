// Envudu App

/* global angular : true */
/* global firebaseUrl : true */
/* global console : true */
// @codekit-append "/services.js"

angular.module('emotion', ['ngAnimate'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        // State to represent Login View
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/app.html',
            resolve: {
                // controller will not be loaded until $requireAuth resolves
                // Auth refers to our $firebaseAuth wrapper in the example above
                "currentAuth": ["Auth",
                    function(Auth) {
                        // $requireAuth returns a promise so the resolve waits for it to complete
                        // If the promise is rejected, it will throw a $stateChangeError (see above)
                        return Auth.$requireAuth();
                    }
                ]
            }
        })
        .state('results', {
            url: '/results',
            abstract: true,
            templateUrl: 'templates/results.html',
            resolve: {
                // controller will not be loaded until $requireAuth resolves
                // Auth refers to our $firebaseAuth wrapper in the example above
                "currentAuth": ["Auth",
                    function(Auth) {
                        // $requireAuth returns a promise so the resolve waits for it to complete
                        // If the promise is rejected, it will throw a $stateChangeError (see above)
                        return Auth.$requireAuth();
                    }
                ]
            }
        });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app');
    })
    .directive('activeTab', function($location) {
        return {
            link: function postLink(scope, element, attrs) {
                scope.$on("$stateChangeSuccess", function() {
                    if (attrs.href !== undefined) { // this directive is called twice for some reason
                        // The activeTab attribute should contain a path search string to match on.
                        // I.e. <li><a href="#/nested/section1/partial" activeTab="/section1">First Partial</a></li>

                        if ($location.path().indexOf(attrs.activeTab) >= 0) {
                            element.addClass("active"); //parent to get the <li>
                        } else {
                            element.removeClass("active");
                        }
                    }
                });
            }
        };
    });
