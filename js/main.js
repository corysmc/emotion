/*global angular : true fixes codekit error*/
var personalityApp = angular.module('personalityApp', ['ngRoute', 'ngAnimate', 'app.services', 'highcharts-ng', 'chart.js']);

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

    $scope.changeMotion = function(motion) {
        //console.log('motion', motion);
        $scope.animation = null;

        $timeout(function() {
            $scope.animation = motion;
        }, 10);
    };
    $scope.submitEmotion = function(Q, emotion) {
        if (Q === 3) {
            var path = '/results/' + emotion.name;
            $location.path(path);

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
personalityApp.controller('resultsController', function($scope, $location, emotionsdata, $routeParams) {
    //gets emotion name from URL
    $scope.emotionResult = $routeParams.id;
    $scope.emotionResults = emotionsdata.get($scope.emotionResult);

    // $scope.emotions = emotionsdata.all();

    $scope.averageEmotion = {};
    $scope.emotionResults.$loaded().then(function(data) {
        test();
    });


    var test = function() {
        console.log('test');
        var hue = 0;
        var radius = 0;
        var speed = 0;
        var emotionCount = 0;
        motions = [];
        hues = [];
        radii = [];
        speeds = [];
        angular.forEach($scope.emotionResults, function(emotion) {
            emotionCount++;
            hue += Number(emotion.hue);
            radius += Number(emotion.radius);
            speed += Number(emotion.speed);

            //create array of motions
            motions.push(emotion.motion);
            hues.push(emotion.hue);
            radii.push(emotion.radius);
            speeds.push(emotion.speed);
            //console.log(hueCount, hue, emotion.hue);
        });
        $scope.averageEmotion.radius = (radius / emotionCount)
        $scope.averageEmotion.hue = (hue / emotionCount);
        $scope.averageEmotion.speed = (speed / emotionCount);

        //which motion has the highest count
        $scope.averageEmotion.motion = mode(motions);


        //console.log('motions', motions, 'total', hue, 'motion', mode(motions));

        //Data for motion pie Chart 
        $scope.motionLabels = countDuplicates(motions)[0];
        $scope.motionData = countDuplicates(motions)[1];


        // //Data for Color Scatter Chart
        // $scope.colorLabels = countDuplicates(hues)[0];
        // $scope.colorData = countDuplicates(hues)[1];

        // //Data for Radius Scatter Chart
        // $scope.radiusLabels = countDuplicates(radii)[0];
        // $scope.radiusData = countDuplicates(radii)[1];

        // //Data for Radius Scatter Chart
        // $scope.speedLabels = countDuplicates(speeds)[0];
        // $scope.speedData = countDuplicates(speeds)[1];

        var colors = []
        var colorcount = 0;
        angular.forEach(countDuplicates(hues)[0], function(hue) {
            colors.push([Number(hue), countDuplicates(hues)[1][colorcount]]);
            colorcount++;
        })
        console.log('colors', colors[0])
        $scope.colorColors = colors;


        var radiuss = []
        var radiuscount = 0;
        angular.forEach(countDuplicates(radii)[0], function(radius) {
            radiuss.push([Number(radius), countDuplicates(radii)[1][radiuscount]]);
            radiuscount++;
        })
        console.log('radii', radiuss[0])
        $scope.radii = radiuss;


        var speedss = []
        var speedcount = 0;
        angular.forEach(countDuplicates(speeds)[0], function(speed) {
            speedss.push([Number(speed), countDuplicates(speeds)[1][speedcount]]);
            speedcount++;
        })
        console.log('speed', speedss[0])
        $scope.speeds = speedss;

        function countInArray(array, what) {
            var count = 0;
            for (var i = 0; i < array.length; i++) {
                if (array[i] == what) {
                    count++;
                }
            }
            return count;
        };

        //huesLineData = [];
        // huesXaxis = [];
        // for (var i = 0; i < 360; i++) {
        //     var count = countInArray(hues, i);
        //     console.log('count hue', count);
        //     huesLineData.push(count);
        //     huesXaxis.push(i);
        // };
        //start canvas
        //$scope.colorLabels = huesXaxis;
        //$scope.colorData = [huesLineData];

        //buildColorChart();
        //console.log('duplicates', countDuplicates(motions))

        $scope.colorChartConfig = {
            "options": {
                "chart": {
                    "type": "scatter",
                    "backgroundColor": 'transparent',
                    events: {
                        load: function() {
                            this.renderer.image('img/hue.png', 10, 10, '95.5%', 176).add(); // add image(url, x, y, w, h) old value with y axis(40, 10, '89%', 376)
                        }
                    }
                },
                "tooltip": {
                    "enabled": false
                },
                "plotOptions": {
                    "series": {
                        "stacking": "normal"
                    }
                }
            },
            "series": [{
                "color": "#FFF",
                "showInLegend": false,
                "data": $scope.colorColors,
                "id": "series-0",
                "name": "Other Hue Values"
            }],
            "title": {
                "text": ""
            },
            "xAxis": {
                "min": 0,
                "max": 360,
                "title": {
                    "text": null
                },
                "labels": {
                    "enabled": false
                }
            },
            "yAxis": {
                "title": {
                    "text": null
                },
                 "labels": {
                    "enabled": false
                }
            },
            "credits": {
                "enabled": false
            },
            "loading": false,
            "size": {},
            "tooltip": {
                backgroundColor: 'rgba(0,0,0,.5)',
                borderColor: 'black',
                borderRadius: 10,
                borderWidth: 3
            }
        };

        $scope.radiusChartConfig = {
            "options": {
                "chart": {
                    "type": "scatter",
                    "backgroundColor": 'transparent',
                },
                "tooltip": {
                    "enabled": false
                },
                "plotOptions": {
                    "series": {
                        "stacking": "normal"
                    }
                }
            },
            "series": [{
                "color": "#333",
                "showInLegend": false,
                "data": $scope.radii,
                "id": "series-0",
                "name": "Other Hue Values"
            }],
            "title": {
                "text": ""
            },
            "xAxis": {
                "min": 0,
                "max": 50,
                "title": {
                    "text": null
                },
                // "labels": {
                //     "enabled": false
                // }
            },
            "yAxis": {
                "title": {
                    "text": null
                },
                //  "labels": {
                //     "enabled": false
                // }
            },
            "credits": {
                "enabled": false
            },
            "loading": false,
            "size": {},
            "tooltip": {
                backgroundColor: 'rgba(0,0,0,.5)',
                borderColor: 'black',
                borderRadius: 10,
                borderWidth: 3
            }
        };
        $scope.speedChartConfig = {
            "options": {
                "chart": {
                    "type": "scatter",
                    "backgroundColor": 'transparent',
                },
                // "tooltip": {
                //     "enabled": false
                // },
                "plotOptions": {
                    "series": {
                        "stacking": "normal"
                    }
                }
            },
            "series": [{
                "color": "#333",
                "showInLegend": false,
                "data": $scope.speeds,
                "id": "series-0",
                "name": "Other Hue Values"
            }],
            "title": {
                "text": ""
            },
            "xAxis": {
                "min": -2,
                "max": -.2,
                "title": {
                    "text": null
                },
                // "labels": {
                //     "enabled": false
                // }
            },
            "yAxis": {
                "title": {
                    "text": null
                },
                //  "labels": {
                //     "enabled": false
                // }
            },
            "credits": {
                "enabled": false
            },
            "loading": false,
            "size": {},
            "tooltip": {
                backgroundColor: 'rgba(0,0,0,.5)',
                borderColor: 'black',
                borderRadius: 10,
                borderWidth: 3
            }
        };
    };

    function mode(array) {
        if (array.length == 0)
            return null;
        var modeMap = {};
        var maxEl = array[0],
            maxCount = 1;
        for (var i = 0; i < array.length; i++) {
            var el = array[i];
            if (modeMap[el] == null)
                modeMap[el] = 1;
            else
                modeMap[el]++;
            if (modeMap[el] > maxCount) {
                maxEl = el;
                maxCount = modeMap[el];
            }
        }
        return maxEl;

        //create color chart
        
    }
    //returns array that removes duplicates -> a
    //returns array of the count of each in array a -> b
    function countDuplicates(arr) {
        var a = [],
            b = [],
            prev;

        arr.sort();
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] !== prev) {
                a.push(arr[i]);
                b.push(1);
            } else {
                b[b.length - 1]++;
            }
            prev = arr[i];
        }

        return [a, b];
    }




    $scope.onClick = function(points, evt) {
        console.log(points, evt);
    };
    //end canvas


    $scope.restart = function() {
        $location.path('/');
    };
});


// personalityApp.filter('orderObjectBy', function() {
//     return function(items, field, reverse) {
//         var filtered = [];
//         angular.forEach(items, function(item) {
//             filtered.push(item);
//         });

//         function index(obj, i) {
//             return obj[i];
//         }
//         filtered.sort(function(a, b) {
//             var comparator;
//             var reducedA = field.split('.').reduce(index, a);
//             var reducedB = field.split('.').reduce(index, b);
//             if (reducedA === reducedB) {
//                 comparator = 0;
//             } else {
//                 comparator = (reducedA > reducedB ? 1 : -1);
//             }
//             return comparator;
//         });
//         if (reverse) {
//             filtered.reverse();
//         }
//         return filtered;
//     };
// });